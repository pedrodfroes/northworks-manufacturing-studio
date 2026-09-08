// Secondary profiles are diagnostic: they expose overloads without constraining the scheduler.
function apsSecondaryProfiles(model, result, settings) {
  const profiles=[];
  const add=(id,name,unit,initial,limit,events)=>profiles.push({id,name,unit,initial,limit,events});
  const families=[...new Set(model.orders.map(o=>o.family))];
  for(const family of families){
    const orders=model.orders.filter(o=>o.family===family);
    const tank=[];
    for(const order of orders){
      const ops=result.operations.filter(o=>o.order===order.id).sort((a,b)=>a.index-b.index);
      // Illustrative batch: 100 units, 1 litre per unit. Constant flow during processing; no flow during setup or idle time.
      ops.forEach((op,i)=>{
        if((i===0 && ops.length>1)||i===1){
          const rate=(i===0?100:-100)/((op.processEnd??op.end)-op.processStart);
          tank.push({time:op.processStart,delta:rate},{time:op.processEnd??op.end,delta:-rate});
        }
      });
    }
    add(`tank-${family}`,`Tank ${family}`,'L',0,settings.tank,tank);
  }
  return profiles.map(p=>{
    const grouped=new Map();p.events.forEach(e=>grouped.set(e.time,(grouped.get(e.time)||0)+e.delta));
    let value=p.initial, rate=0, previous=0;
    const points=[{time:0,value}];
    [...grouped].sort((a,b)=>a[0]-b[0]).forEach(([time,delta])=>{value+=rate*(time-previous);if(Math.abs(value)<1e-8)value=0;points.push({time,value});rate+=delta;previous=time;});
    return {...p,points,min:Math.min(...points.map(x=>x.value)),max:Math.max(...points.map(x=>x.value))};
  });
}
function apsRenderSecondary(s,result,horizon,preview=false) {
  const root=document.querySelector('#apsSecondary');if(!root)return;
  const settings=s.secondary ||= {tank:250};
  const profiles=apsSecondaryProfiles(s.model,result,settings);
  const width=horizon*s.zoom;
  const group=(title,filter)=>`<div class="aps-secondary-title">${title}</div>${profiles.filter(filter).map(p=>{
    const low=Math.min(0,p.min), high=Math.max(1,p.max,p.limit||0), span=high-low;
    const y=v=>72-(v-low)/span*56;
    let path=`M0 ${y(p.initial)}`;
    p.points.forEach(point=>{path+=` L${point.time*s.zoom} ${y(point.value)}`;});path+=` H${width}`;
    const conflict=p.min<0 || p.limit!==null&&p.max>p.limit;
    // Split linear segments exactly where they cross zero or tank capacity.
    const bands=p.points.flatMap((point,i)=>{
      const next=p.points[i+1]||{time:horizon,value:point.value};
      if(next.time<=point.time)return [];
      const cuts=[0,1];
      for(const limit of [0,p.limit])if(limit!==null&&next.value!==point.value){
        const fraction=(limit-point.value)/(next.value-point.value);
        if(fraction>0&&fraction<1)cuts.push(fraction);
      }
      cuts.sort((a,b)=>a-b);
      return cuts.slice(1).map((end,j)=>{
        const start=cuts[j], value=point.value+(next.value-point.value)*(start+end)/2;
        return value < -1e-8 || p.limit!==null&&value>p.limit+1e-8 ? `<rect x="${(point.time+(next.time-point.time)*start)*s.zoom}" y="0" width="${(next.time-point.time)*(end-start)*s.zoom}" height="84" fill="#fae1e3"/>`:'';
      });
    }).join('');
    return `<div class="aps-secondary-row"><strong>${escapeHtml(p.name)}<small>${p.unit} · ${low}–${high}</small><small class="${conflict?'aps-secondary-alert':''}">${conflict?'Conflict':'Within limits'} · peak ${p.max}</small></strong><svg width="${width}" height="84" role="img" aria-label="${escapeHtml(p.name)}: minimum ${p.min}, peak ${p.max} ${p.unit}" data-profile="${p.id}">${bands}${Array.from({length:Math.ceil(horizon/24)},(_,i)=>`<line x1="${i*24*s.zoom}" x2="${i*24*s.zoom}" y1="0" y2="84" stroke="#dce5e2"/>`).join('')}<line x1="0" x2="${width}" y1="${y(0)}" y2="${y(0)}" stroke="#abbfba"/>${p.limit!==null?`<line x1="0" x2="${width}" y1="${y(p.limit)}" y2="${y(p.limit)}" stroke="#bd5262" stroke-dasharray="5 4"/>`:''}<path d="${path}" fill="none" stroke="${preview?'#a47119':'#247e73'}" stroke-width="2"/>${p.points.map(point=>`<circle cx="${point.time*s.zoom}" cy="${y(point.value)}" r="3" fill="transparent"><title>${apsTime(point.time)}: ${point.value} ${p.unit}</title></circle>`).join('')}</svg></div>`;
  }).join('')}`;
  root.innerHTML=`<div class="aps-secondary-title">Secondary constraints · ${preview?'LIVE DRAG PREVIEW':'Current schedule'} · red shading = shortage / overload</div>${group(`Tank liquid · capacity ${settings.tank} L per tank`,p=>p.id.startsWith('tank'))}`;
}
