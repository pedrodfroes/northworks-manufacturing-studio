import {createModel} from './model.js?v=17';

export const cases = {
 liquid: {name:'Liquid medicine',question:'Can filling meet the promise without overflowing the buffer?',product:'Oral solution',unit:'L',quantity:100,resources:[['Compounding vessel','blend'],['Reserve vessel','blend'],['Bottle filler','fill'],['Alternate filler','fill']],route:['Compound','Fill'],materials:['Active ingredient','Bottles'],skill:'Filling operator'},
 discrete: {name:'Pump assembly',question:'Can the pump order ship when its seal kit arrives late?',product:'Industrial pump',unit:'units',quantity:10,resources:[['Assembly cell','blend'],['Alternate assembly cell','blend'],['Test bench','fill']],route:['Assemble','Pressure test'],materials:['Seal kit','Motor'],skill:'Test technician'},
 mro: {name:'Equipment overhaul',question:'Can the overhaul finish with one specialist and a late spare?',product:'Hydraulic module overhaul',unit:'jobs',quantity:1,resources:[['Overhaul bay','blend'],['Reserve bay','blend'],['Certification bench','fill']],route:['Repair','Certify'],materials:['Replacement cartridge','Seal set'],skill:'Certified inspector'}
};
export function configurationKey(configuration){
 const copy=structuredClone(configuration||{});
 for(const key of ['i','max','view','done','coverSeen','blueprintOpen','tutorial','decisionEvidence'])delete copy[key];
 return JSON.stringify(copy);
}
export function caseFor(c={}){
 const ids=(c.industryContexts||[]).map(x=>x.industry);
 if(c.archetypes?.some(x=>/maintenance|repair|mro/.test(x)))return 'mro';
 if(c.volumeStorage?.present===true)return 'liquid';
 if(ids.some(x=>['pharma','food-beverage','chemicals','energy-services'].includes(x))&&!c.archetypes?.includes('discrete-assembly'))return 'liquid';
 return ids.length?'discrete':'liquid';
}
export function projectScenario(c={},caseId=c.referenceCase||caseFor(c)){
 const def=cases[caseId]||cases.liquid,m=createModel();
 m.caseId=caseId;m.name=def.name+' · working scenario';m.industry=(c.industryContexts||[]).map(x=>x.specialty).join(' / ')||def.name;
 m.implementation=structuredClone(c);m.sourceKey=configurationKey(c);m.revision=1;
 m.calendar.hours=c.calendar?.hours||({'single-shift':8,'multi-shift':16}[c.calendar?.pattern])||16;
 m.resources=def.resources.map(([name,group],i)=>({id:`asset-${i+1}`,name,group}));
 m.tank.enabled=caseId==='liquid'&&c.volumeStorage?.present!==false;
 m.cleaning.enabled=caseId==='liquid'||!!c.transitions?.types?.length;
 m.skills=[{id:'specialist',name:def.skill,count:caseId==='liquid'?2:1}];
 m.materials=def.materials.map((name,i)=>({id:`material-${i+1}`,name,ready:i===0&&caseId!=='liquid'?26:0}));
 const input=c.scenarioInputs||{};
 m.resources.forEach(r=>{if(input.resourceNames?.[r.id])r.name=input.resourceNames[r.id];});
 if(input.people)m.skills[0].count=Math.max(1,Math.floor(input.people));
 if(input.materialReady!==undefined)m.materials[0].ready=input.materialReady;
 if(input.tankCapacity)m.tank.capacity=input.tankCapacity;
 if(input.batch)m.tank.batch=input.batch;
 m.orders=m.orders.slice(0,caseId==='liquid'?12:6).map((o,i)=>({...o,product:`${def.product} ${o.family}`,quantity:def.quantity,unit:def.unit,operations:o.operations.map((op,j)=>({...op,name:def.route[j],material:j===0&&i===0?'material-1':null,skill:j===1?'specialist':null}))}));
 m.orders.forEach(o=>o.operations.forEach((op,i)=>{if(input.routeHours?.[i])op.hours=input.routeHours[i];}));
 m.projection=[
  {name:'Operating case',status:'Assumed',detail:`${def.name}: synthetic quantities, durations, resources and routes; edit them in the experiment.`},
  {name:'Daily calendar',status:c.calendar?.hours?'Applied':'Assumed',detail:`${m.calendar.hours} hours from 06:00 daily. ${c.calendar?.hours?'Explicit scenario hours.':'Shift category translated to sample hours.'} Holidays, rotating patterns and local exceptions are not imported.`},
  {name:'Resources & routes',status:'Assumed',detail:`${m.resources.length} named assets, ${m.orders.length} orders; taxonomy selections are requirements, not asset records.`},
  {name:'Sequence cleaning',status:'Applied',detail:`${m.cleaning.enabled?'Asymmetric A/B/C matrix; predecessor occupancy extends, material output stays at processing end.':'Disabled.'} Selected transition categories do not supply measured durations.`},
  {name:'Material availability',status:'Applied',detail:'Scenario receipt time blocks its consuming operation. Customer BOM, stock allocation, shelf life and substitutions are not imported.'},
  {name:'People',status:'Applied',detail:'Scenario skill headcount limits concurrent processing. Customer qualifications, absences and cleaning labor are not imported.'},
  {name:'Liquid buffers',status:m.tank.enabled?'Diagnostic':'Not applicable',detail:m.tank.enabled?'Continuous volume balance and capacity exceedance; does not delay operations.':'No product-liquid model for this case.'},
  ...['Master planning policies','System integration & execution events','Product attributes & customer BOM','Configured supply and workforce policies','Semantic graph variants'].map(name=>({name,status:'Captured only',detail:'Retained in the implementation requirements; not executed by this scenario.'}))
 ];
 return m;
}
export function snapshot(model,result,name){return {name,createdAt:new Date().toISOString(),revision:model.revision||1,model:structuredClone(model),result:structuredClone(result)};}
