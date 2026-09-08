function apsGenerate() {

  const types = state.resourceTypes.length ? state.resourceTypes : ['processing', 'finishing'];

  const resources = types.flatMap((type,g) => [0,1].map(n => ({ id:`R${g+1}-${n+1}`, group:g, name:`${resourceTaxonomy.find(r=>r.id===type)?.name || type} ${n+1}` })));

  const rng = makeRng(20260905);

  return { resources, orders: Array.from({length:12},(_,i)=>({ id:`WO-${String(i+1).padStart(3,'0')}`, family:['A','B','C'][i%3], release: i<8 ? 0 : 4+(i-8)*2, due: 12+Math.floor(rng()*55), priority:1+Math.floor(rng()*5), route:types.map((_,group)=>({group,duration:1+Math.floor(rng()*4)})) })) };

}

function apsFresh() {

  return { model:apsGenerate(), rule:state.dispatch?.policies?.includes('setup-protect')?'setup':'edd', shift:state.calendar.pattern==='multi-shift'?16:state.calendar.pattern==='variable'?24:8, setup:0.5, outage:null, selected:'WO-001', zoom:18, group:'resource', baseline:null };

}

function openSandbox() {

  state.coverSeen = true;

  state.view = 'sandbox';

  state.tutorial = { active:false, index:0 };

  document.querySelector('.tutorial-layer')?.remove();

  state.sandbox ||= apsFresh();

  render();

}

function apsTime(t) { const minutes = Math.round(t*60)+360; return `D${Math.floor(minutes/1440)+1} ${String(Math.floor(minutes/60)%24).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`; }

function renderSandbox() {

  const s = state.sandbox ||= apsFresh(), result = APSScheduler.schedule(s.model,s), esc = escapeHtml;

  const selected = s.model.orders.find(o=>o.id===s.selected) || s.model.orders[0];

  s.selected = selected.id;

  const horizon = Math.ceil(Math.max(48,result.makespan+4,...s.model.orders.map(o=>o.due))/24)*24;

  const rows = s.group==='resource' ? s.model.resources.map(r=>({id:r.id,name:r.name,ops:result.operations.filter(o=>o.resource===r.id)})) : s.model.orders.map(r=>({id:r.id,name:r.id,ops:result.operations.filter(o=>o.order===r.id)}));

  const options = (values,current) => Object.entries(values).map(([id,label])=>`<option value="${esc(id)}" ${String(current)===id?'selected':''}>${esc(label)}</option>`).join('');

  const metric = (label,value) => `<div><small>${label}</small><strong>${value}</strong></div>`;

  $('#stageFoot').style.display='none'; $('#stageCount').textContent='APS · Working model'; $('#stageBody').dataset.step='sandbox';

  $('#stageBody').innerHTML=`<section class="aps">

    <div class="aps-heading"><div><p class="eyebrow">Generate · Schedule · Experiment</p><h2>Planning playground</h2><p>A small, executable model of your configuration. Change a rule. See what moves.</p></div><button class="ghost-btn" id="apsBack">Back to configuration</button></div>

    <div class="aps-toolbar">

      <label>Dispatch rule<select id="apsRule">${options(APSScheduler.rules,s.rule)}</select></label>

      <label>Feedback search effort<select id="apsSearchBudget">${options({20:"Quick · 20 trials",80:"Standard · 80 trials",200:"Deep · 200 trials"},s.searchBudget||80)}</select></label><label>Daily capacity<select id="apsShift">${options({8:'1 shift · 8 hours',16:'2 shifts · 16 hours',24:'Continuous · 24 hours'},s.shift)}</select></label>

      <label>Sequence-dependent clean<select id="apsClean">${options({off:"Off",on:"On - next-family matrix"},s.sequenceClean?"on":"off")}</select></label>
      <label>Family changeover<select id="apsSetup">${options({0:'None',0.5:'30 minutes',1:'1 hour',2:'2 hours'},s.setup)}</select></label>

      <button class="ghost-btn" id="apsBaseline">Save baseline</button><button class="ghost-btn" id="apsRebuild">Regenerate from configuration</button>

    </div>

    <p class="aps-note">${result.search?`Feedback search: ${result.search.evaluations} trial schedules, ${result.search.accepted} accepted improvements, ${result.search.elapsedMs.toFixed(1)} ms. Cleaning ${result.search.initialClean.toFixed(1)} → ${result.clean.toFixed(1)} h. ${result.search.stop}. Objective: cleaning first, then lateness, then makespan. Each trial rebuilds cleaning and downstream timing; manual moves retain priority.`:''}</p>
    <div class="aps-metrics">${metric('On-time orders',`${result.orders.length-result.late} / ${result.orders.length}`)}${metric('Total lateness',`${result.tardiness.toFixed(1)} h`)}${metric('Setup / cleaning',`${result.setup.toFixed(1)} / ${result.clean.toFixed(1)} h`)}${metric('Resource utilization',`${result.utilization.toFixed(0)}%`)}${metric('Last completion',apsTime(result.makespan))}</div>

    ${s.baseline?`<p class="aps-note">Baseline: ${esc(s.baseline.label)} · Late orders ${s.baseline.late} → ${result.late} · Total lateness ${s.baseline.tardiness.toFixed(1)} → ${result.tardiness.toFixed(1)} h · Changeovers ${s.baseline.setup.toFixed(1)} → ${result.setup.toFixed(1)} h</p>`:''}

    <div class="aps-chart-head"><h3>Schedule</h3><label>View<select id="apsGroup">${options({resource:'By resource',order:'By order'},s.group)}</select></label><label>Zoom<select id="apsZoom">${options({10:'Compact',18:'Standard',32:'Detailed'},s.zoom)}</select></label><span><b class="aps-key">A</b> <b class="aps-key b">B</b> <b class="aps-key c">C</b> families · purple tail = cleaning; striped = setup · red outline = late order</span></div>

    <div class="aps-scroll"><div style="width:${180+horizon*s.zoom}px">

      <div class="aps-axis"><strong>Resource / order</strong><div style="width:${horizon*s.zoom}px">${Array.from({length:horizon/4},(_,i)=>`<span style="left:${i*4*s.zoom}px">${apsTime(i*4)}</span>`).join('')}</div></div>

      ${rows.map(row=>`<div class="aps-row"><strong>${esc(row.name)}</strong><div class="aps-track" data-lane="${esc(row.id)}" style="width:${horizon*s.zoom}px;background-size:${24*s.zoom}px 100%;--working:${s.shift/24*100}%">${s.outage && (s.group==='resource' && row.id===s.outage.resource)?`<span class="aps-outage" style="left:${s.outage.start*s.zoom}px;width:${(s.outage.end-s.outage.start)*s.zoom}px" title="Resource unavailable">Down</span>`:''}${row.ops.map(op=>`<button class="aps-bar family-${op.family} ${result.orders.find(o=>o.id===op.order).tardiness?'late':''} ${op.order===selected.id?'selected':''}" draggable="true" data-operation="${op.index}" data-order="${op.order}" style="left:${op.start*s.zoom}px;width:${(op.end-op.start)*s.zoom}px" title="${op.order} / operation ${op.index+1} / ${esc(op.resource)} · ${apsTime(op.start)}–${apsTime(op.end)} · ${esc(op.reason)}"><i style="width:${op.setup/(op.end-op.start)*100}%"></i><b class="aps-clean-tail" style="left:${(op.cleanStart-op.start)/(op.end-op.start)*100}%;width:${op.clean/(op.end-op.start)*100}%"></b><span>${op.order.slice(3)}·${op.index+1}</span></button>`).join('')}<span class="aps-due" style="left:${selected.due*s.zoom}px" title="${selected.id} due date"></span></div></div>`).join('')}

    <div id="apsSecondary"></div></div></div><p class="aps-note">Drag to move operations; downstream work is previewed continuously.</p>

    <div class="aps-toolbar"><button id="apsUndoMove" class="ghost-btn" ${s.moveUndo?.length?'':'disabled'}>Undo move</button><button id="apsClearMoves" class="ghost-btn" ${Object.keys(s.moves||{}).length?'':'disabled'}>Clear manual moves</button><span id="apsMoveStatus" role="status">${esc(s.moveMessage||'')}</span></div><div class="aps-bottom"><section><h3>Order inspector</h3><div class="aps-toolbar"><label>Order<select id="apsOrder">${options(Object.fromEntries(s.model.orders.map(o=>[o.id,`${o.id} · Family ${o.family}`])),selected.id)}</select></label><label>Release (hours)<input id="apsRelease" type="number" min="0" max="240" step="0.5" value="${selected.release}"></label><label>Due (hours)<input id="apsDue" type="number" min="0" max="480" step="0.5" value="${selected.due}"></label><label>Priority (5 = highest)<input id="apsPriority" type="number" min="1" max="5" value="${selected.priority}"></label></div>

    <p class="aps-note">Hours are measured from D1 06:00. Changes immediately recalculate the entire schedule.</p>

    ${result.operations.filter(o=>o.order===selected.id).map(op=>`<p class="aps-operation"><strong>Operation ${op.index+1} · ${esc(s.model.resources.find(r=>r.id===op.resource).name)}</strong><span>${apsTime(op.start)} → ${apsTime(op.end)} · ${op.setup} h setup; output ${apsTime(op.processEnd)}; ${op.clean} h cleaning${op.nextFamily?` for ${op.nextFamily}`:" (last on resource)"}</span><small>${esc(op.reason)}</small></p>`).join('')}</section>

    <section><h3>What-if experiments</h3><label>Resource unavailable on D1, 10:00–14:00<select id="apsOutage">${options({'':'No breakdown',...Object.fromEntries(s.model.resources.map(r=>[r.id,r.name]))},s.outage?.resource||'')}</select></label><button class="ghost-btn" id="apsRush">Add rush order</button><h3>Compare dispatch rules</h3><p class="aps-note">Minimize cleaning groups compatible families using the smallest next-family cleaning time. It may wait for compatible work and increase lateness; manual moves retain priority. Selecting it enables sequence-dependent cleaning. Feedback search always enables cleaning and revisits sequence choices. Other rows use the current cleaning toggle. Search trials are deterministic, so drag preview and drop use the same effort; larger models and deep searches can reduce responsiveness.</p><table><thead><tr><th>Rule</th><th>Late</th><th>Setup h</th><th>Clean h</th><th>Lateness h</th></tr></thead><tbody>${Object.entries(APSScheduler.rules).map(([rule,label])=>{const r=APSScheduler.schedule(s.model,{...s,rule});return `<tr class="${rule===s.rule?'active':''}"><td><button data-rule="${rule}">${label}</button></td><td>${r.late}</td><td>${r.setup.toFixed(1)}</td><td>${r.clean.toFixed(1)}</td><td>${r.tardiness.toFixed(1)}</td></tr>`;}).join('')}</tbody></table></section></div>

    <details class="aps-assumptions"><summary>Model scope and assumptions</summary><p>Seeded synthetic orders; ${s.model.resources.length/2} configured resource types, two interchangeable resources per type, one unit of capacity each. Every order visits each type in sequence. Durations are synthetic (1–4 hours); family changes consume the selected setup time. Daily shifts start at 06:00 and repeat every day. Operations and setup stay together within a shift. Rules rank candidates at the earliest feasible start, with stable order/resource ties. Cleaning matrix (hours): A to B 0.5, A to C 2; B to A 1.5, B to C 1; C to A 2, C to B 0.5. Same family and final operation: zero. Cleaning is additional to setup, may wait for a shift, and extends occupancy without delaying material output. No global optimization.</p><p>Calendar selection and resource types seed this model when generated. Other configuration choices remain design inputs: materials, tanks, labor, weekends, detailed calendars and quantity-dependent rates are not enforced in this sketch. Regenerating replaces sandbox edits and the baseline. All experiments are saved locally with your configuration.</p></details>

  </section>`;

  s.secondary ||= {tank:250};
  apsRenderSecondary(s,result,horizon);
  const controls=document.createElement('div');controls.className='aps-toolbar';
  controls.innerHTML=`<label>Tank capacity (L per family)<input id="apsTankLimit" type="number" min="1" max="10000" value="${s.secondary.tank}"></label><span class="aps-note">Illustrative 100 L batches: continuous inflow during operation 1, outflow during operation 2, none during setup or cleaning. Tank conflicts are diagnostic.</span>`;
  document.querySelector('.aps-chart-head').before(controls);
  apsAttachDrag(s, result);

  const change=(id,fn)=>$('#'+id).addEventListener('change',e=>{fn(e.target.value);requestAnimationFrame(()=>{if(state.view==='sandbox')render();});});

  change('apsTankLimit',v=>s.secondary.tank=Math.max(1,Math.min(10000,Number(v)||1)));
  change('apsSearchBudget',v=>s.searchBudget=Number(v));
  change('apsClean',v=>{s.sequenceClean=v==='on';if(!s.sequenceClean&&['clean','feedback'].includes(s.rule))s.rule='edd';});
  change('apsRule',v=>{s.rule=v;if(v==='clean'||v==='feedback')s.sequenceClean=true;}); change('apsShift',v=>s.shift=Number(v)); change('apsSetup',v=>s.setup=Number(v)); change('apsGroup',v=>s.group=v); change('apsZoom',v=>s.zoom=Number(v)); change('apsOrder',v=>s.selected=v);

  [['apsRelease','release',0,240],['apsDue','due',0,480],['apsPriority','priority',1,5]].forEach(([id,key,min,max])=>change(id,v=>{if(v.trim() && Number.isFinite(Number(v))) selected[key]=Math.max(min,Math.min(max,key==='priority'?Math.round(Number(v)):Number(v)));}));

  change('apsOutage',v=>s.outage=v?{resource:v,start:4,end:8}:null);

  document.querySelectorAll('[data-order]').forEach(b=>b.onclick=()=>{s.selected=b.dataset.order;render();});

  document.querySelectorAll('[data-rule]').forEach(b=>b.onclick=()=>{s.rule=b.dataset.rule;if(s.rule==='clean'||s.rule==='feedback')s.sequenceClean=true;render();});

  $('#apsBaseline').onclick=()=>{s.baseline={label:APSScheduler.rules[s.rule],late:result.late,tardiness:result.tardiness,setup:result.setup};render();};

  $('#apsRebuild').onclick=()=>{state.sandbox=apsFresh();render();};

  $('#apsBack').onclick=()=>{state.view='flow';render();};

  $('#apsRush').onclick=()=>{const order=clone(s.model.orders[0]);order.id=`RUSH-${s.model.orders.length-11}`;order.release=0;order.due=10;order.priority=5;s.model.orders.push(order);s.selected=order.id;render();};

}



// Manual moves are resource assignments plus earliest-start constraints, not fixed reservations.

function apsAttachDrag(s, result) {

  let drag = null;

  const scroll = document.querySelector('.aps-scroll');

  const tracks = [...document.querySelectorAll('.aps-track')];

  const status = document.querySelector('#apsMoveStatus');

  const live = document.createElement('div');

  live.className = 'aps-live-sequence';

  live.hidden = true;

  scroll.before(live);

  const originalWidths = [scroll.firstElementChild, ...tracks, document.querySelector('.aps-axis > div')].map(el=>[el,el.style.width]);

  const clearPreview = () => {

    document.querySelectorAll('.aps-drop-preview, .aps-sequence-preview').forEach(e=>e.remove());

    document.querySelectorAll('.aps-preview-original').forEach(e=>e.classList.remove('aps-preview-original'));

    originalWidths.forEach(([el,width])=>el.style.width=width);

    live.hidden=true;
    apsRenderSecondary(s,result,parseFloat(originalWidths[1][1])/s.zoom);

    if(drag)drag.previewKey=null;

  };

  const preview = (track,start) => {

    const resource=s.group==='resource'?track.dataset.lane:drag.op.resource;

    const key=`${resource}:${start}`;

    if(drag.previewKey===key)return;

    clearPreview();drag.previewKey=key;

    const trial=APSScheduler.schedule(s.model,{...s,moves:apsInsertionMoves(s,drag.op,resource,start,result)});

    const width=Math.max(parseFloat(originalWidths[1][1]),Math.ceil((trial.makespan+4)/24)*24*s.zoom);

    originalWidths.forEach(([el],i)=>el.style.width=`${width+(i===0?180:0)}px`);

    apsRenderSecondary(s,trial,width/s.zoom,true);
    const chain=trial.operations.filter(o=>o.order===drag.op.order && o.index>=drag.op.index);

    let changed=0;

    trial.operations.forEach(op=>{

      const old=result.operations.find(o=>o.order===op.order&&o.index===op.index);

      const differs=old.start!==op.start||old.end!==op.end||old.resource!==op.resource;

      const dependent=op.order===drag.op.order&&op.index>=drag.op.index;

      if(!differs&&!dependent)return;

      if(differs)changed++;

      const lane=tracks.find(t=>t.dataset.lane===(s.group==='resource'?op.resource:op.order));

      const ghost=document.createElement('span');

      ghost.className=`aps-sequence-preview ${dependent?'aps-preview-dependent':'aps-preview-ripple'}`;

      ghost.dataset.order=op.order;ghost.dataset.operation=op.index;

      ghost.dataset.start=op.start;ghost.dataset.end=op.end;ghost.dataset.resource=op.resource;

      ghost.style.left=`${op.start*s.zoom}px`;ghost.style.width=`${(op.end-op.start)*s.zoom}px`;

      ghost.textContent=`${op.order} · ${op.index+1}`;
      if(op.clean){const tail=document.createElement('b');tail.className='aps-clean-tail';tail.style.left=`${(op.cleanStart-op.start)/(op.end-op.start)*100}%`;tail.style.width=`${op.clean/(op.end-op.start)*100}%`;ghost.appendChild(tail);}

      lane.appendChild(ghost);

      document.querySelector(`.aps-bar[data-order="${op.order}"][data-operation="${op.index}"]`)?.classList.add('aps-preview-original');

    });

    const ghost=document.createElement('span');

    ghost.className='aps-drop-preview';ghost.style.left=`${start*s.zoom}px`;ghost.style.width=`${(drag.op.end-drag.op.start)*s.zoom}px`;track.appendChild(ghost);

    live.hidden=false;

    live.textContent=`Live sequence · ${drag.op.order} · Requested ${apsTime(start)} · `+chain.map(op=>`Op ${op.index+1}: ${apsTime(op.start)}–${apsTime(op.end)} (${s.model.resources.find(r=>r.id===op.resource).name})`).join(' → ')+` · ${changed} operations repositioned. Teal = order sequence; amber = other affected work. Preview only until dropped.`;

    status.textContent=`${trial.search?`Feedback: ${trial.search.evaluations} trials, ${trial.search.accepted} improvements, ${trial.search.elapsedMs.toFixed(1)} ms. `:""}Live trial: ${trial.late} late orders; ${trial.tardiness.toFixed(1)} h total lateness. Constraints enforced.`;

  };

  const cleanup = () => {

    clearPreview();

    tracks.forEach(t => t.classList.remove('aps-drop-eligible','aps-drop-target'));

    document.querySelectorAll('.aps-drop-preview').forEach(e=>e.remove());

    document.querySelectorAll('.aps-dragging').forEach(e=>e.classList.remove('aps-dragging'));

    drag = null;

  };

  const redraw = () => {

    const left=scroll.scrollLeft, top=document.querySelector('#stageBody').scrollTop;

    render();

    document.querySelector('.aps-scroll').scrollLeft=left;

    document.querySelector('#stageBody').scrollTop=top;

  };

  const remember = () => { s.moveUndo ||= []; s.moveUndo.push(clone(s.moves||{})); if(s.moveUndo.length>30)s.moveUndo.shift(); };

  document.querySelector('#apsUndoMove').onclick=()=>{s.moves=s.moveUndo.pop();s.moveMessage='Last manual move undone.';redraw();};

  document.querySelector('#apsClearMoves').onclick=()=>{remember();s.moves={};s.moveMessage='Manual moves cleared. Dispatch rules control all operations.';redraw();};

  document.querySelectorAll('.aps-bar').forEach(bar=>{

    bar.addEventListener('dragstart',e=>{

      const op=result.operations.find(o=>o.order===bar.dataset.order && o.index===Number(bar.dataset.operation));

      const group=s.model.orders.find(o=>o.id===op.order).route[op.index].group;

      drag={op,group,offset:e.clientX-bar.getBoundingClientRect().left};

      e.dataTransfer.effectAllowed='move';

      e.dataTransfer.setData('text/plain',`${op.order}:${op.index}`);

      bar.classList.add('aps-dragging');

      tracks.forEach(t=>{if(eligible(t))t.classList.add('aps-drop-eligible');});

      status.textContent='Drop on a highlighted lane. Requested start snaps to 30 minutes.';

    });

    bar.addEventListener('dragend',()=>{cleanup();status.textContent=s.moveMessage||'Move cancelled.';});

  });

  const eligible = track => drag && (s.group==='order' ? track.dataset.lane===drag.op.order : s.model.resources.some(r=>r.id===track.dataset.lane && r.group===drag.group));

  const requested = (e,track) => Math.max(0, Math.round((e.clientX-track.getBoundingClientRect().left-drag.offset)/s.zoom*2)/2);

  tracks.forEach(track=>{

    track.addEventListener('dragover',e=>{

      if(!eligible(track)){if(drag){clearPreview();status.textContent='This lane is not eligible for this operation.';}return;}

      e.preventDefault();e.dataTransfer.dropEffect='move';

      tracks.forEach(t=>t.classList.toggle('aps-drop-target',t===track));

      preview(track,requested(e,track));

      const bounds=scroll.getBoundingClientRect();

      if(e.clientX>bounds.right-45)scroll.scrollLeft+=18;

      if(e.clientX<bounds.left+210)scroll.scrollLeft-=18;

    });

    track.addEventListener('drop',e=>{

      if(!eligible(track))return;

      e.preventDefault();

      const {op}=drag, start=requested(e,track), resource=s.group==='resource'?track.dataset.lane:op.resource;

      remember();s.moves=apsInsertionMoves(s,op,resource,start,result);

      const actual=APSScheduler.schedule(s.model,s).operations.find(o=>o.order===op.order&&o.index===op.index);

      s.selected=op.order;

      s.moveMessage=`${op.order}, operation ${op.index+1}: requested ${apsTime(start)} → scheduled ${apsTime(actual.start)} on ${s.model.resources.find(r=>r.id===resource).name}.${actual.start>start?' Shift, capacity or order constraints moved the start later.':''}`;

      cleanup();redraw();

    });

  });

  scroll.addEventListener('dragleave',e=>{if(drag&&!scroll.contains(e.relatedTarget)){clearPreview();}});

}



function apsInsertionMoves(s, op, resource, start, result) {

  const moves={...s.moves}, key=`${op.order}:${op.index}`;

  delete moves[key];

  moves[key]={resource,start,sequence:{order:op.order,resources:Object.fromEntries(result.operations.filter(o=>o.order===op.order).map(o=>[o.index,o.index===op.index?resource:o.resource]))}};

  return moves;

}

