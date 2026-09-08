// Deterministic, finite-capacity serial dispatch scheduler. Time is hours from day 1, 06:00.
const APSScheduler = (() => {
  const rules = { edd: 'Earliest due date', fifo: 'First in, first out', spt: 'Shortest operation', slack: 'Least remaining slack', cr: 'Critical ratio', setup: 'Minimize changeovers', clean: 'Minimize cleaning', feedback: 'Cleaning feedback search', priority: 'Order priority' };
  function slot(earliest, duration, shift) {
    if (!(duration > 0) || duration > shift) throw new Error('Operation plus setup must fit within one shift.');
    const day = Math.floor(earliest / 24), hour = earliest % 24;
    return hour + duration <= shift + 1e-9 ? earliest : (day + 1) * 24;
  }
  const cleanMatrix = { A:{A:0,B:0.5,C:2}, B:{A:1.5,B:0,C:1}, C:{A:2,B:0.5,C:0} };
  function schedule(model, options) {
    if(options.rule==='feedback')return feedbackSearch(model,options);
    return dispatch(model,options);
  }
  function feedbackSearch(model,options){
    const began=performance.now();
    const baseOptions={...options,rule:'clean',sequenceClean:true};
    let best=dispatch(model,baseOptions);
    const initialClean=best.clean, initialTardiness=best.tardiness;
    const budget=Math.max(1,Math.min(500,Number(options.searchBudget)||80));
    let evaluations=0,passes=0,accepted=0,exhausted=false;
    const better=(a,b)=>a.clean<b.clean-1e-9 || Math.abs(a.clean-b.clean)<1e-9 && (a.tardiness<b.tardiness-1e-9 || Math.abs(a.tardiness-b.tardiness)<1e-9 && a.makespan<b.makespan-1e-9);
    const history=[{clean:best.clean,tardiness:best.tardiness,makespan:best.makespan}];
    while(evaluations<budget){
      passes++;
      const sequence=best.operations.map(o=>`${o.order}:${o.index}`);
      let improved=false;
      // Try short swaps first, then wider changes. Rebuild all resource and order consequences.
      search:for(let distance=1;distance<sequence.length;distance++)for(let i=0;i+distance<sequence.length;i++){
        if(evaluations>=budget)break search;
        const trialOrder=sequence.slice();
        [trialOrder[i],trialOrder[i+distance]]=[trialOrder[i+distance],trialOrder[i]];
        const searchRanks=Object.fromEntries(trialOrder.map((key,index)=>[key,index]));
        const trial=dispatch(model,{...baseOptions,searchRanks});evaluations++;
        if(better(trial,best)){
          best=trial;accepted++;improved=true;
          history.push({clean:best.clean,tardiness:best.tardiness,makespan:best.makespan});
          break search;
        }
      }
      if(!improved){exhausted=evaluations<budget;break;}
    }
    best.search={evaluations,passes,accepted,budget,initialClean,initialTardiness,elapsedMs:performance.now()-began,stop:exhausted?'No improving swap':'Evaluation limit reached',history};
    best.operations.forEach(o=>o.reason+=' Feedback search rebuilt sequences, cleaning tails and downstream timing; objective: cleaning, then lateness, then makespan.');
    return best;
  }
  function dispatch(model, options) {
    const { rule = 'edd', shift = 16, setup = 0.5, outage = null } = options;
    const lanes = model.resources.map(r => ({ ...r, end: 0, family: null }));
    const pending = model.orders.map(o => ({ ...o, next: 0, ready: o.release }));
    const operations = [];
    const fit = (time,duration,resource) => {
      if(!duration)return time;
      let start=slot(time,duration,shift);
      if(outage && outage.resource===resource && start<outage.end && start+duration>outage.start)start=slot(outage.end,duration,shift);
      return start;
    };
    // A manual insertion owns its order's sequence before the dispatch queue is rebuilt.
    // Keep downstream resource assignments so a collision pushes work instead of routing around it.
    const insertion = Object.entries(options.moves || {}).filter(([,move])=>move.sequence).at(-1);
    const bulldozeOrder = insertion?.[1].sequence.order;
    while (pending.some(o => o.next < o.route.length)) {
      const candidates = [];
      pending.filter(o => o.next < o.route.length).forEach(o => {
        const op = o.route[o.next];
        const manual = options.moves?.[`${o.id}:${o.next}`];
        const assigned = manual?.resource || (o.id===bulldozeOrder ? insertion[1].sequence.resources[o.next] : null);
        lanes.filter(r => r.group === op.group && (!assigned || r.id === assigned)).forEach(r => {
          const clean = options.sequenceClean && r.last ? (options.cleanMatrix || cleanMatrix)[r.family]?.[o.family] ?? (r.family===o.family?0:1) : 0;
          if(!Number.isFinite(clean)||clean<0)throw new Error('Cleaning duration must be non-negative.');
          const cleanStart=fit(r.end,clean,r.id), cleanEnd=cleanStart+clean;
          const change = r.family && r.family !== o.family ? setup : 0;
          let start = slot(Math.max(cleanEnd, o.ready, manual?.start || 0), op.duration + change, shift);
          if (outage && outage.resource === r.id && start < outage.end && start + change + op.duration > outage.start)
            start = slot(outage.end, op.duration + change, shift);
          const remaining = o.route.slice(o.next).reduce((s, x) => s + x.duration, 0);
          const score = ({ edd: o.due, fifo: o.release, spt: op.duration, slack: o.due - start - remaining, cr: (o.due - start) / remaining, setup: change, clean, priority: -o.priority })[rule];
          candidates.push({ o, r, op, change, start, score, clean, cleanStart, cleanEnd });
        });
      });
      if (!candidates.length) throw new Error('No eligible resource for an operation.');
      // Dispatch at the earliest feasible start; rank competing available operations by the chosen rule.
      candidates.sort((a,b) => Number(b.o.id===bulldozeOrder)-Number(a.o.id===bulldozeOrder) || (options.searchRanks ? options.searchRanks[`${a.o.id}:${a.o.next}`]-options.searchRanks[`${b.o.id}:${b.o.next}`] : 0) || (rule==='clean' ? a.clean-b.clean || a.start-b.start || a.o.due-b.o.due : a.start-b.start || a.score-b.score) || a.o.id.localeCompare(b.o.id) || a.r.id.localeCompare(b.r.id));
      const c = candidates[0], end = c.start + c.change + c.op.duration;
      if(c.r.last && options.sequenceClean){
        Object.assign(c.r.last,{clean:c.clean,cleanStart:c.cleanStart,end:c.cleanEnd,nextFamily:c.o.family});
      }
      operations.push({ order: c.o.id, index: c.o.next, resource: c.r.id, family: c.o.family, start: c.start, processStart: c.start+c.change, end, processEnd:end, clean:0, cleanStart:end, nextFamily:null, setup: c.change, due: c.o.due, reason: `${rules[rule]}${rule==='clean'?' prioritizes the smallest cleaning transition, then earliest start and due date':' at earliest feasible start'}; score ${c.score.toFixed(2)}. Release, predecessor, resource and shift availability respected.` });
      c.r.last=operations.at(-1);
      c.r.end = end; c.r.family = c.o.family; c.o.ready = end; c.o.next++;
    }
    const orders = pending.map(o => ({ ...o, completion: o.ready, tardiness: Math.max(0, o.ready-o.due) }));
    const makespan = Math.max(0,...operations.map(o => o.end));
    const busy = operations.reduce((s,o) => s+o.processEnd-o.start+o.clean,0);
    const available = (Math.floor(makespan/24)*shift + Math.min(shift,makespan%24))*lanes.length - (outage ? Array.from({length:Math.ceil(makespan/24)},(_,d)=>Math.max(0,Math.min(d*24+shift,outage.end,makespan)-Math.max(d*24,outage.start))).reduce((a,b)=>a+b,0):0);
    return { operations, orders, makespan, clean:operations.reduce((sum,op)=>sum+op.clean,0), late: orders.filter(o=>o.tardiness>0).length, tardiness: orders.reduce((s,o)=>s+o.tardiness,0), setup: operations.reduce((s,o)=>s+o.setup,0), utilization: available ? busy/available*100 : 0 };
  }
  return { rules, schedule, slot, cleanMatrix };
})();
if (typeof module !== 'undefined') module.exports = APSScheduler;
