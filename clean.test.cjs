const assert=require('node:assert/strict');
const APS=require('./legacy-scheduler.cjs');
const model={resources:[{id:'r',group:0}],orders:['A','B','C'].map((family,i)=>({id:family,family,release:0,due:20+i,priority:1,route:[{group:0,duration:2}]}))};
const off=APS.schedule(model,{shift:8,setup:0}),on=APS.schedule(model,{shift:8,setup:0,sequenceClean:true});
assert.equal(on.operations[0].processEnd,2);assert.equal(on.operations[0].end,2.5);assert.equal(on.operations[0].nextFamily,'B');assert.equal(on.operations.at(-1).clean,0);assert.equal(off.clean,0);
for(const shift of [8,16,24])for(const rule of Object.keys(APS.rules)){
 const r=APS.schedule(model,{shift,rule,sequenceClean:true,setup:0.5,outage:{resource:'r',start:4,end:8}});
 r.operations.forEach((op,i)=>{assert.ok(op.processEnd<=op.end);if(op.clean){assert.ok(op.cleanStart>=op.processEnd);assert.ok(op.end<=Math.floor(op.cleanStart/24)*24+shift);assert.ok(op.end<=4||op.cleanStart>=8);}if(i)assert.ok(op.start>=r.operations[i-1].end);});
}
console.log('Cleaning timing, terminal policy, asymmetric matrix, shifts and outage checks passed.');
const {performance}=require('node:perf_hooks');
const rows=[];
for(const count of [12,60,120]){
 const m={resources:[0,1,2,3].map(i=>({id:'r'+i,group:Math.floor(i/2)})),orders:Array.from({length:count},(_,i)=>({id:'o'+i,family:'ABC'[i%3],release:0,due:20+i,priority:1,route:[{group:0,duration:2},{group:1,duration:3}]}))};
 const times={off:[],on:[]};
 for(let i=0;i<70;i++)for(const enabled of i%2?[true,false]:[false,true]){
  const opts={shift:16,setup:0.5,sequenceClean:enabled,moves:{'o0:0':{resource:'r0',start:(i%12)/2,sequence:{order:'o0',resources:{0:'r0',1:'r2'}}}}};
  const t=performance.now();APS.schedule(m,opts);const elapsed=performance.now()-t;if(i>=10)times[enabled?'on':'off'].push(elapsed);
 }
 const stats=a=>{a.sort((x,y)=>x-y);return {medianMs:+a[30].toFixed(3),p95Ms:+a[57].toFixed(3)}};
 rows.push({orders:count,operations:count*2,off:stats(times.off),on:stats(times.on)});
}
console.log(JSON.stringify(rows,null,2));
require('fs').writeFileSync('outputs/clean-benchmark.json',JSON.stringify({runtime:process.version,method:'60 timed drag resequences per mode after 10 warmups; alternating mode order',rows},null,2));
