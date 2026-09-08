// Pure scheduling kernel: model in, immutable schedule out. No DOM or persistence.
const key=(id,i)=>`${id}:${i}`;
function fit(t,d,h){if(d>h)throw Error('A processing or cleaning operation exceeds the daily working window.');return t%24+d<=h+1e-8?t:(Math.floor(t/24)+1)*24;}
function dispatch(m,ranks){
 const skillPools=Object.fromEntries((m.skills||[]).map(s=>[s.id,Array.from({length:s.count},()=>0)]));
 const lanes=m.resources.map(r=>({...r,end:0,last:null})),pending=m.orders.map(o=>({...o,next:0,ready:o.release})),ops=[];
 const focus=Object.values(m.moves).at(-1)?.order;
 while(pending.some(o=>o.next<o.operations.length)){
  const choices=[];
  for(const o of pending){if(o.next===o.operations.length)continue;const op=o.operations[o.next],move=m.moves[key(o.id,o.next)];
   for(const r of lanes.filter(r=>r.group===op.group&&(!move||move.resource===r.id))){
    const clean=m.cleaning.enabled&&r.last?m.cleaning.matrix[r.last.family][o.family]:0;
    const cleanStart=fit(r.end,clean,m.calendar.hours),cleanEnd=cleanStart+clean;
    const pool=op.skill?skillPools[op.skill]:null;
    if(op.skill&&(!pool||!pool.length))continue;
    const person=pool?pool.indexOf(Math.min(...pool)):-1;
    const material=op.material?(m.materials||[]).find(x=>x.id===op.material):null;
    if(op.material&&!material)throw Error('Missing material availability for '+op.material);
    const start=fit(Math.max(cleanEnd,o.ready,move?.start||0,material?.ready||0,pool?.[person]||0),op.hours,m.calendar.hours);
    const score=m.rule==='short'?op.hours:m.rule==='priority'?-o.priority:o.due;
    choices.push({o,r,op,clean,cleanStart,cleanEnd,start,score,pool,person,rank:ranks?.[key(o.id,o.next)]||0});
   }
  }
  if(!choices.length)throw Error('An operation has no eligible resource.');
  choices.sort((a,b)=>Number(b.o.id===focus)-Number(a.o.id===focus)||(ranks?a.rank-b.rank:0)||(['clean','search'].includes(m.rule)?a.clean-b.clean:0)||a.start-b.start||a.score-b.score||a.o.id.localeCompare(b.o.id)||a.r.id.localeCompare(b.r.id));
  const c=choices[0];if(c.r.last)Object.assign(c.r.last,{clean:c.clean,cleanStart:c.cleanStart,end:c.cleanEnd,nextFamily:c.o.family});
  const op={key:key(c.o.id,c.o.next),order:c.o.id,index:c.o.next,family:c.o.family,resource:c.r.id,start:c.start,processEnd:c.start+c.op.hours,end:c.start+c.op.hours,clean:0,cleanStart:c.start+c.op.hours};
  if(c.pool)c.pool[c.person]=op.processEnd;
  ops.push(op);c.r.last=op;c.r.end=op.processEnd;c.o.ready=op.processEnd;c.o.next++;
 }
 const orders=pending.map(o=>({id:o.id,completion:o.ready,tardy:Math.max(0,o.ready-o.due)}));
 return {ops,orders,clean:ops.reduce((s,o)=>s+o.clean,0),late:orders.filter(o=>o.tardy>0).length,tardy:orders.reduce((s,o)=>s+o.tardy,0),end:Math.max(0,...ops.map(o=>o.end))};
}
export function schedule(model){
 if(!Number.isFinite(model.calendar.hours)||model.calendar.hours<=0||model.calendar.hours>24)throw Error('Daily hours must be between 0 and 24.');
 if(!model.orders.length)throw Error('Add at least one order.');
 for(const o of model.orders)for(const op of o.operations)if(!Number.isFinite(op.hours)||op.hours<=0)throw Error('Operation duration must be positive.');
 const started=performance.now();let best=dispatch(model),trials=0,accepted=0;const seed=best.clean;
 if(model.rule==='search')while(trials<model.budget){
  const keys=best.ops.map(o=>o.key);let improved=false;
  search:for(let d=1;d<keys.length;d++)for(let i=0;i+d<keys.length;i++){
   if(trials>=model.budget)break search;
   const trialKeys=keys.slice();[trialKeys[i],trialKeys[i+d]]=[trialKeys[i+d],trialKeys[i]];
   const trial=dispatch(model,Object.fromEntries(trialKeys.map((k,j)=>[k,j])));trials++;
   if(trial.clean<best.clean||trial.clean===best.clean&&(trial.tardy<best.tardy||trial.tardy===best.tardy&&trial.end<best.end)){best=trial;accepted++;improved=true;break search;}
  }if(!improved)break;
 }
 return {...best,search:{trials,accepted,seed,ms:performance.now()-started}};
}
export function tankProfile(model,result,family){
 const changes=new Map();for(const op of result.ops.filter(o=>o.family===family&&o.index<2)){
  const rate=(op.index===0?1:-1)*model.tank.batch/(op.processEnd-op.start);
  changes.set(op.start,(changes.get(op.start)||0)+rate);changes.set(op.processEnd,(changes.get(op.processEnd)||0)-rate);
 }
 let t=0,rate=0,value=0;const points=[{t:0,value:0}];for(const [at,delta] of [...changes].sort((a,b)=>a[0]-b[0])){value+=rate*(at-t);if(Math.abs(value)<1e-8)value=0;points.push({t:at,value});rate+=delta;t=at;}return points;
}

export function skillProfile(model,result,skill){
 const events=new Map();
 for(const op of result.ops){
  const input=model.orders.find(o=>o.id===op.order)?.operations[op.index];
  if(input?.skill!==skill)continue;
  events.set(op.start,(events.get(op.start)||0)+1);
  events.set(op.processEnd,(events.get(op.processEnd)||0)-1);
 }
 let demand=0;const points=[{t:0,demand:0}];
 for(const [t,change] of [...events].sort((a,b)=>a[0]-b[0])){points.push({t,demand});demand+=change;points.push({t,demand});}
 return points;
}
