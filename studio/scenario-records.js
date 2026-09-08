const identifier=v=>typeof v==='string'&&/^[A-Za-z0-9_-]+$/.test(v);
const finite=(v,min,max)=>Number.isFinite(v)&&v>=min&&v<=max;
export function validateScenario(value){
 const m=structuredClone(value?.model||value);
 const fail=message=>{throw Error(message);};
 if(!m||m.version!==1)fail('Choose a version 1 Northworks scenario export.');
 if(!finite(m.calendar?.hours,0.5,24))fail('Daily working hours must be between 0.5 and 24.');
 if(!Array.isArray(m.resources)||!m.resources.length||m.resources.length>100)fail('A scenario needs 1–100 resources.');
 if(!Array.isArray(m.orders)||!m.orders.length||m.orders.length>500)fail('A scenario needs 1–500 orders.');
 for(const items of [m.resources,m.orders,m.skills||[],m.materials||[]]){
  if(new Set(items.map(x=>x.id)).size!==items.length||items.some(x=>!identifier(x.id)))fail('Use unique alphanumeric IDs with hyphens or underscores.');
 }
 for(const r of m.resources)if(!identifier(r.group)||typeof r.name!=='string')fail('Each resource needs a name and route group.');
 for(const skill of m.skills||[])if(!Number.isInteger(skill.count)||skill.count<1||skill.count>100)fail('Skill headcount must be a positive whole number.');
 for(const material of m.materials||[])if(!finite(material.ready,0,10000))fail('Material receipt time must be between 0 and 10,000 hours.');
 for(const o of m.orders){
  if(!['A','B','C'].includes(o.family)||!finite(o.release,0,10000)||!finite(o.due,0,10000)||!finite(o.priority,1,5))fail('Check order family, release, due and priority.');
  if(!Array.isArray(o.operations)||!o.operations.length||o.operations.length>50)fail('Each order needs 1–50 operations.');
  for(const op of o.operations){
   if(!finite(op.hours,0.01,m.calendar.hours))fail('Each operation must fit inside the working day.');
   if(!m.resources.some(r=>r.group===op.group))fail('An operation has no eligible resource.');
   if(op.skill&&!(m.skills||[]).some(s=>s.id===op.skill))fail('An operation references an unknown skill.');
   if(op.material&&!(m.materials||[]).some(s=>s.id===op.material))fail('An operation references an unknown material.');
  }
 }
 if(!m.cleaning||![true,false].includes(m.cleaning.enabled))fail('Cleaning policy is missing.');
 for(const a of 'ABC')for(const b of 'ABC')if(!finite(m.cleaning.matrix?.[a]?.[b],0,24))fail('Cleaning matrix values must be between 0 and 24 hours.');
 if(!finite(m.tank?.capacity,1,100000)||!finite(m.tank?.batch,1,100000))fail('Tank capacity and batch size must be positive.');
 if(!['due','short','priority','clean','search'].includes(m.rule)||!Number.isInteger(m.budget)||m.budget<0||m.budget>500)fail('Invalid dispatch rule or search budget.');
 m.moves||={};
 for(const [key,move] of Object.entries(m.moves)){
  const [order,index]=key.split(':'),o=m.orders.find(x=>x.id===order),op=o?.operations[+index];
  if(!op||move.order!==order||!finite(move.start,0,10000)||!m.resources.some(r=>r.id===move.resource&&r.group===op.group))fail('A manual move has an invalid operation, resource or start.');
 }
 m.revision=Number.isInteger(m.revision)&&m.revision>0?m.revision:1;
 return m;
}
export function inputDifferences(before,after){
 const changes=[],omit=new Set(['revision','implementation','sourceKey','projection']);
 function visit(a,b,path){
  if(JSON.stringify(a)===JSON.stringify(b))return;
  if(a&&b&&typeof a==='object'&&typeof b==='object'){
   for(const key of new Set([...Object.keys(a),...Object.keys(b)])){if(!path&&omit.has(key))continue;visit(a[key],b[key],path?`${path} / ${key}`:key);}return;
  }
  changes.push({field:path,before:a??'Not set',after:b??'Not set'});
 }
 visit(before,after,'');return changes;
}
