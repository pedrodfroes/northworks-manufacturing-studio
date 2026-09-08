const assert=require('node:assert/strict'),APS=require('./legacy-scheduler.cjs');
const m={resources:[{id:'r',group:0}],orders:['A','B','A','B'].map((family,i)=>({id:'o'+i,family,release:i===2?3:0,due:10+i,priority:1,route:[{group:0,duration:2}]}))};
const options={shift:24,setup:0,sequenceClean:true};
const edd=APS.schedule(m,{...options,rule:'edd'}),clean=APS.schedule(m,{...options,rule:'clean'});
assert.ok(clean.clean<edd.clean);assert.equal(clean.operations.map(o=>o.family).join(''),'AABB');
for(const op of clean.operations){const prev=clean.operations[clean.operations.indexOf(op)-1];if(prev)assert.ok(op.start>=prev.end);}
console.log(`Cleaning rule: ${edd.clean} h -> ${clean.clean} h; same resource, orders and matrix.`);

