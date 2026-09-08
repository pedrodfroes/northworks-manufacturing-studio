const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const APS = require('./legacy-scheduler.cjs');
const context = vm.createContext({console});
vm.runInContext(['util.js','packs.js','model.js','data.js','state.js','derive.js','generator.js','sandbox.js'].map(f=>fs.readFileSync(f,'utf8')).join('\n')+'\nthis.fixture=apsFresh();', context);
const model = context.fixture.model;
for (const rule of Object.keys(APS.rules)) for (const shift of [8,16,24]) for (const setup of [0,0.5,2]) {
  const options = {rule,shift,setup,moves:{[`${model.orders[0].id}:0`]:{resource:model.resources[1].id,start:5.5}},outage:{resource:model.resources[0].id,start:4,end:8}};
  const r = APS.schedule(model,options);
  if(r.search){assert.ok(r.search.evaluations<=r.search.budget);assert.ok(r.clean<=r.search.initialClean);for(let i=1;i<r.search.history.length;i++){const a=r.search.history[i-1],b=r.search.history[i];assert.ok(b.clean<a.clean || b.clean===a.clean&&(b.tardiness<a.tardiness||b.tardiness===a.tardiness&&b.makespan<a.makespan));}}
  const moved=r.operations.find(o=>o.order===model.orders[0].id&&o.index===0);
  assert.equal(moved.resource,model.resources[1].id);assert.ok(moved.start>=5.5);
  assert.equal(r.operations.length,model.orders.reduce((s,o)=>s+o.route.length,0));
  const repeated=APS.schedule(model,options);
  assert.deepEqual(r.operations,repeated.operations);assert.deepEqual(r.orders,repeated.orders);
  for (const op of r.operations) {
    const order = model.orders.find(o=>o.id===op.order);
    assert.ok(op.start>=order.release);
    assert.ok(op.end-op.start>0);
    assert.ok(op.processEnd <= Math.floor(op.start/24)*24+shift+1e-8);
    assert.equal(model.resources.find(x=>x.id===op.resource).group,order.route[op.index].group);
    if(op.index) assert.ok(op.start>=r.operations.find(x=>x.order===op.order&&x.index===op.index-1).processEnd);
    if(op.resource===options.outage.resource) assert.ok(op.processEnd<=4 || op.start>=8);
  }
  for(const resource of model.resources) {
    const ops=r.operations.filter(o=>o.resource===resource.id).sort((a,b)=>a.start-b.start);
    ops.slice(1).forEach((op,i)=>assert.ok(op.start>=ops[i].end));
  }
  assert.ok(r.utilization>=0&&r.utilization<=100.000001);
}
const simple={resources:[{id:'r',group:0}],orders:[{id:'a',family:'A',release:0,due:20,priority:1,route:[{group:0,duration:2}]},{id:'b',family:'B',release:0,due:5,priority:5,route:[{group:0,duration:3}]}]};
assert.equal(APS.schedule(simple,{rule:'edd',shift:8,setup:0}).operations[0].order,'b');
assert.equal(APS.schedule(simple,{rule:'spt',shift:8,setup:0}).operations[0].order,'a');
assert.throws(()=>APS.slot(0,9,8));
console.log('Passed all dispatch-rule / shift / setup combinations: precedence, eligibility, capacity, shifts, outages, determinism, KPIs and dispatch ordering.');
// A dragged predecessor and its successor must displace even higher-ranked competing work.
const conflict={resources:[{id:'up',group:0},{id:'down',group:1}],orders:[
  {id:'dragged',family:'A',release:0,due:100,priority:1,route:[{group:0,duration:2},{group:1,duration:3}]},
  {id:'urgent',family:'B',release:0,due:1,priority:5,route:[{group:1,duration:4}]}
]};
for(const start of [0,2,6,24]) {
 const options={rule:'edd',shift:8,setup:0.5,moves:{'dragged:0':{resource:'up',start,sequence:{order:'dragged',resources:{0:'up',1:'down'}}}}};
 const r=APS.schedule(conflict,options), first=r.operations.find(o=>o.order==='dragged'&&o.index===0), next=r.operations.find(o=>o.order==='dragged'&&o.index===1), pushed=r.operations.find(o=>o.order==='urgent');
 assert.equal(first.start,start);assert.equal(next.start,APS.slot(first.end,3,8));assert.ok(pushed.start>=next.end);
}
console.log('Passed bulldoze conflict tests: downstream work displaces higher-ranked jobs at four drag positions.');
