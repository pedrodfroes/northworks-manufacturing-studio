// Vendor-neutral, synthetic MES execution model. No authentication or live plant I/O.
export const sources = [
 ['PAS-X · master batch records','https://www.koerber.com/en/insights-and-events/mbr-design-successful-mes-implementation'],
 ['PAS-X · weighing and dispensing','https://www.koerber.com/en/solutions/software-and-ai/life-sciences-mes/digital-manufacturing/weighing-and-material-dispensing'],
 ['PAS-X · electronic batch recording','https://www.koerber.com/en/insights-and-events/electronic-batch-recording-efficiency'],
 ['PAS-X · cell and gene therapy','https://www.koerber.com/en/insights-and-events/mes-for-cell-gene-therapy'],
 ['Opcenter Execution Pharma · functional scope','https://www.siemens.com/en-gb/campaigns/pharma-industry-opcenter-execution/'],
 ['Emerson · life sciences / DeltaV MES','https://www.emerson.com/en/automation-systems/automation-systems-for-life-sciences'],
 ['European Commission · EudraLex Volume 4','https://health.ec.europa.eu/medicinal-products/eudralex/eudralex-volume-4_en'],
 ['FDA · Part 11 scope and application','https://www.fda.gov/regulatory-information/search-fda-guidance-documents/part-11-electronic-records-electronic-signatures-scope-and-application']
];
export const processes = {
 oral:{name:'Oral solution',product:'Oral solution 10 mg/mL',batch:'OS-2401',unit:'L',size:1000,material:'Active ingredient',dose:10,doseUnit:'kg',equipment:'Compounding vessel CV-101',family:'Non-sterile liquid',question:'Can we complete the batch with the correct material, dose and release evidence?',steps:[['clear','Line clearance','check',15],['dispense','Dispense active','weigh',30],['charge','Charge vessel','check',15],['mix','Mix solution','process',90],['sample','In-process assay','sample',45],['fill','Fill and reconcile','pack',60],['review','Review batch record','review',30]],parameter:['Mix temperature','°C',18,25,22],assay:['Assay','%',95,105,99],hold:240},
 sterile:{name:'Sterile fill-finish',product:'Injectable solution · 10 mL vial',batch:'SF-2401',unit:'vials',size:10000,material:'Sterile bulk solution',dose:100,doseUnit:'L',equipment:'Isolator filling line FL-201',family:'Aseptic drug product',question:'Do clearance, sterilization readiness, hold time and IPC evidence permit filling?',steps:[['clear','Aseptic line clearance','check',30],['dispense','Verify bulk transfer','weigh',25],['charge','Connect sterile path','check',20],['mix','Sterile filtration','process',60],['sample','Pre-fill IPC','sample',40],['fill','Aseptic fill and reconcile','pack',120],['review','Review aseptic batch','review',45]],parameter:['Filtration pressure','bar',0.5,2,1.2],assay:['Fill volume','mL',9.8,10.2,10],hold:180},
 biologic:{name:'Biologics drug substance',product:'Monoclonal antibody intermediate',batch:'BIO-2401',unit:'L',size:2000,material:'Media concentrate',dose:200,doseUnit:'kg',equipment:'Single-use bioreactor BR-301',family:'Biotech upstream / downstream',question:'Can the campaign proceed with qualified equipment and acceptable process and sample evidence?',steps:[['clear','Verify single-use assembly','check',30],['dispense','Prepare media','weigh',45],['charge','Inoculate bioreactor','check',30],['mix','Culture and harvest','process',720],['sample','Harvest IPC','sample',90],['fill','Transfer and reconcile','pack',120],['review','Review campaign batch','review',45]],parameter:['Culture temperature','°C',36,38,37],assay:['Viability','%',85,100,96],hold:300},
 cell:{name:'Autologous cell therapy',product:'Patient-specific cell product',batch:'CT-2401',unit:'dose',size:1,material:'Patient starting material',dose:100,doseUnit:'mL',equipment:'Closed processing unit CP-401',family:'Cell and gene therapy',question:'Does patient identity remain intact from receipt through processing and custody transfer?',steps:[['clear','Verify chain of identity','check',20],['dispense','Receive patient material','weigh',20],['charge','Transfer custody','check',15],['mix','Process cell product','process',180],['sample','Viability result','sample',60],['fill','Fill patient dose','pack',30],['review','Review identity and batch','review',30]],parameter:['Process temperature','°C',18,25,22],assay:['Viability','%',80,100,94],hold:120},
 api:{name:'Small-molecule API',product:'Crystalline active intermediate',batch:'API-2401',unit:'kg',size:500,material:'Reaction starting material',dose:250,doseUnit:'kg',equipment:'Reactor RX-501',family:'Chemical drug substance',question:'Are charge quantity, reaction limits, yield and genealogy acceptable for the next stage?',steps:[['clear','Verify clean reactor','check',20],['dispense','Weigh starting material','weigh',40],['charge','Charge reactor','check',25],['mix','React and crystallize','process',240],['sample','Purity result','sample',90],['fill','Isolate and reconcile','pack',90],['review','Review intermediate','review',30]],parameter:['Reaction temperature','°C',65,75,70],assay:['Purity','%',98,100,99.3],hold:360}
};
export const policies = [
 {id:'material',group:'Materials',name:'Released material only',why:'Held or rejected lots cannot be charged.',type:'bool',value:true},
 {id:'expiry',group:'Materials',name:'Expiry at time of use',why:'Check the lot when the step executes.',type:'bool',value:true},
 {id:'potency',group:'Materials',name:'Potency-adjusted dispensing',why:'Target gross dose = nominal active dose ÷ potency.',type:'bool',value:true},
 {id:'tolerance',group:'Materials',name:'Dispense tolerance (%)',why:'An out-of-tolerance measurement creates an exception.',type:'number',value:1,min:0,max:10},
 {id:'equipment',group:'Equipment & people',name:'Clean and calibrated equipment',why:'Dirty equipment or an expired calibration blocks work.',type:'bool',value:true},
 {id:'training',group:'Equipment & people',name:'Current operator qualification',why:'An unqualified operator cannot execute production steps.',type:'bool',value:true},
 {id:'witness',group:'Equipment & people',name:'Independent dispense witness',why:'The witness must differ from the executing operator.',type:'bool',value:true},
 {id:'hold',group:'Process control',name:'Enforce material hold time',why:'Delay between processing and filling can block filling.',type:'bool',value:true},
 {id:'ipc',group:'Process control',name:'Passing reviewed IPC before fill',why:'Laboratory evidence is required before the fill step.',type:'bool',value:true},
 {id:'identity',group:'Process control',name:'Patient chain of identity',why:'Cell-therapy batches require the matching patient token.',type:'bool',value:true},
 {id:'yield',group:'Process control',name:'Minimum reconciled yield (%)',why:'Good output and reject accounting are checked together.',type:'number',value:95,min:0,max:100},
 {id:'review',group:'Batch review',name:'Review mode',why:'Exception mode narrows the queue; release still requires QA.',type:'select',value:'exception',options:['exception','full']}
];
export const catalog = [
 ['Recipe lifecycle','Reusable operations, parameter inheritance, MBR approval, effectivity and site variants.','Executable: versioned sequential recipe, approval and fixed batch snapshot. Parallel branches and site inheritance: design only.'],
 ['Material execution','Identity, status, expiry, potency, dispensing, consumption, returns and genealogy.','Executable: one input lot, dose tolerance, potency, stock consumption and batch genealogy. Multi-lot allocation and split/merge: design only.'],
 ['Equipment lifecycle','Room/line clearance, cleaning, calibration, maintenance and digital logbooks.','Executable: clean/calibration gates and recorded resource use. CIP/SIP automation and equipment state machines: design only.'],
 ['People & signatures','Role access, qualification, independent verification and signature meaning.','Executable: simulated roles, qualification and independent witness. Authentication and legally binding signatures: design only.'],
 ['Process execution','Guided steps, readings, calculations, hold times, IPC and instruction versions.','Executable: sequential dependencies, limits, simulated clock and batch-specific readings. Continuous historian streams: design only.'],
 ['Sterile manufacturing','Sterile-path checks, environmental monitoring, filter integrity and aseptic interventions.','Executable: sterile reference route and readiness check. Detailed EM trending, media fill and contamination control: design only.'],
 ['Cell & gene therapy','Chain of identity, custody, patient scheduling and small-batch orchestration.','Executable: matching identity token, custody step and genealogy. Patient logistics and treatment integration: design only.'],
 ['Packaging','Line clearance, labels, reconciliation, serialization and aggregation.','Executable: good/reject/loss balance and yield. Serial-number commissioning and aggregation: design only.'],
 ['Quality & release','Deviation capture, investigation, review by exception and disposition authority.','Executable: failed-attempt history, QA exception resolution and blocked release. CAPA lifecycle and formal QP certification: design only.'],
 ['Integration','ERP orders, APS dispatch/actuals, LIMS samples, QMS deviations, PLM recipes, automation values.','Executable: local message contracts and simulated events with IDs. No live connectors.'],
 ['Validation & data integrity','Requirements traceability, risk assessment, testing, audit, retention and recovery.','Executable: repeatable model checks and event export. Validated storage, retention enforcement and disaster recovery: design only.'],
 ['Deployment & rollout','Site template, pilot scope, migration, infrastructure, cutover and support.','Captured design: site, hosting, availability target, ownership and rollout notes. No infrastructure provisioning.']
];
export function processSpec(m,b){return {...processes[b?.process||m.process],...(b?.spec||m.spec||{})};}
export function createMES(process='oral'){
 const c=processes[process];if(!c)throw Error('Unknown process');
 const design={version:1,process,revision:1,name:c.name+' · MES design',spec:{size:c.size,dose:c.dose,hold:c.hold,parameter:[...c.parameter],assay:[...c.assay]},recipe:{version:1,status:'draft',steps:c.steps.map(([id,name,type,duration],i)=>({id,name,type,duration,after:i?[c.steps[i-1][0]]:[]}))},policy:Object.fromEntries(policies.map(p=>[p.id,p.value])),lot:{id:'LOT-001',status:'released',potency:98,quantity:c.dose*2,expiry:3000},equipment:{name:c.equipment,clean:true,calibrated:true},operator:{name:'Alex · operator',qualified:true},witness:'Sam · verifier',patient:'PT-DEMO-001',plan:{site:'Pilot plant',hosting:'Site managed',owner:'',availability:'',rollout:''},contracts:{},requirements:Object.fromEntries(catalog.map(([name])=>[name,'required'])),batches:[],audit:[],serial:0};
 if(!['oral','api'].includes(process)){design.policy.potency=false;design.lot.potency=100;}
 if(process==='cell')design.policy.witness=true;
 return design;
}
export function audit(m,type,detail,actor='Designer'){m.audit.push({id:'EV-'+String(m.audit.length+1).padStart(4,'0'),at:new Date().toISOString(),type,actor,detail});}
export function editMES(m,fn,description){const before=structuredClone(m);try{fn(m);approveRecipe(structuredClone(m));}catch(error){for(const key of Object.keys(m))delete m[key];Object.assign(m,before);throw error;}m.revision++;m.recipe.status='draft';audit(m,'Configuration changed',description);}
export function validateRecipe(recipe){
 const seen=new Set();for(const s of recipe.steps){if(seen.has(s.id)||!s.name.trim()||!Number.isFinite(s.duration)||s.duration<=0)throw Error('Each step needs a unique identity, name and positive duration.');if(s.after.some(id=>!seen.has(id)))throw Error('A predecessor must appear before its dependent step.');seen.add(s.id);}
 if(recipe.steps.length<7||recipe.steps[0].id!=='clear'||recipe.steps.at(-1).id!=='review')throw Error('Keep the core process, clearance first and batch review last.');
}
export function approveRecipe(m){validateRecipe(m.recipe);const c=processSpec(m);if(!Number.isFinite(c.size)||c.size<=0||!Number.isFinite(c.dose)||c.dose<=0||!Number.isFinite(c.hold)||c.hold<0)throw Error('Batch size and dose must be positive; hold time cannot be negative.');for(const spec of [c.parameter,c.assay])if(!spec.slice(2).every(Number.isFinite)||spec[2]>spec[3])throw Error('Specification limits must be numeric and lower must not exceed upper.');m.recipe.status='approved';audit(m,'Recipe approved','MBR revision '+m.revision,'QA · simulated');}
export function startBatch(m){
 if(m.recipe.status!=='approved')throw Error('Approve this recipe revision before creating a batch.');
 const c=processSpec(m);const b={id:c.batch+'-'+String(++m.serial).padStart(2,'0'),process:m.process,spec:structuredClone(m.spec||{}),revision:m.revision,recipe:structuredClone(m.recipe),policy:structuredClone(m.policy),clock:0,records:[],exceptions:[],events:[],status:'executing',patient:m.patient,lot:structuredClone(m.lot),equipment:structuredClone(m.equipment),operator:structuredClone(m.operator),witness:m.witness,inputs:{weight:targetDose(m),reading:c.parameter[4],assay:c.assay[4],good:c.size,reject:0,loss:0,identity:m.patient,clearance:true},consumed:0};
 m.batches.push(b);audit(m,'Batch created',b.id+' · configuration revision '+m.revision);return b;
}
export function targetDose(m,b){const c=processSpec(m,b),p=b?.policy||m.policy,lot=b?.lot||m.lot;return c.dose/(p.potency?lot.potency/100:1);}
export function nextStep(b){return b.recipe.steps.find(s=>!b.records.some(r=>r.step===s.id));}
export function blockers(m,b,s=nextStep(b)){
 if(!s)return [];const c=processSpec(m,b),p=b.policy,i=b.inputs,reasons=[];
 const add=(test,text)=>{if(test)reasons.push(text);};
 add(s.after.some(id=>!b.records.some(r=>r.step===id)),'Predecessor evidence is incomplete.');
 if(s.type!=='review'){
 add(p.training&&!b.operator.qualified,'Operator qualification is not current.');
 add(p.equipment&&(!b.equipment.clean||!b.equipment.calibrated),'Equipment must be clean and calibrated.');
 }
 if(s.id==='clear'){add(!i.clearance,'Line / process clearance has not been verified.');add(b.process==='cell'&&p.identity&&i.identity!==b.patient,'Patient identity does not match this batch.');}
 if(s.type==='weigh'){
 add(p.material&&b.lot.status!=='released','Input lot is not released.');add(p.expiry&&b.lot.expiry<b.clock+s.duration,'Input lot expires before dispensing completes.');
 add(!Number.isFinite(b.lot.potency)||b.lot.potency<=0||b.lot.potency>100,'Potency must be greater than zero and at most 100%.');
 const target=targetDose(m,b);add(!Number.isFinite(i.weight)||i.weight<=0||Math.abs(i.weight-target)>target*p.tolerance/100+1e-8,`Dose outside ${p.tolerance}% tolerance around ${target.toFixed(3)} ${c.doseUnit}.`);
 add(i.weight>b.lot.quantity,'Insufficient lot quantity.');add(p.witness&&(!b.witness.trim()||b.witness===b.operator.name),'An independent dispense witness is required.');
 }
 if(s.type==='process')add(!Number.isFinite(i.reading)||i.reading<c.parameter[2]||i.reading>c.parameter[3],`${c.parameter[0]} outside ${c.parameter[2]}–${c.parameter[3]} ${c.parameter[1]}.`);
 if(s.type==='sample')add(!Number.isFinite(i.assay)||i.assay<c.assay[2]||i.assay>c.assay[3],`${c.assay[0]} outside ${c.assay[2]}–${c.assay[3]} ${c.assay[1]}.`);
 if(s.type==='pack'){
 const process=b.records.find(r=>r.type==='process');add(p.hold&&process&&b.clock-process.end>c.hold,`Material hold exceeded ${c.hold} minutes.`);
 add(p.ipc&&!b.records.some(r=>r.type==='sample'),'Reviewed passing IPC is required.');
 add([i.good,i.reject,i.loss].some(n=>!Number.isFinite(n)||n<0),'Output quantities must be non-negative.');
 add(Math.abs(i.good+i.reject+i.loss-c.size)>1e-6,'Good + rejects + loss must reconcile to the batch quantity.');add(i.good/c.size*100<p.yield,`Yield is below ${p.yield}%.`);
 }
 if(s.type==='review')add(b.exceptions.some(e=>!e.resolved),'Resolve every exception before QA release.');
 return reasons;
}
export function executeStep(m,b,actor='operator'){
 if(b.status==='released')throw Error('Released batch records are read-only.');
 const s=nextStep(b);if(!s)throw Error('No remaining step.');
 if(s.type==='review'&&actor!=='qa')throw Error('QA role is required for batch release.');
 const reasons=blockers(m,b,s);
 if(reasons.length){for(const reason of reasons)if(!b.exceptions.some(e=>e.step===s.id&&e.reason===reason&&!e.resolved)){const e={id:b.id+'-EX'+(b.exceptions.length+1),step:s.id,reason,at:b.clock,resolved:false};b.exceptions.push(e);b.events.push({id:e.id,type:'QMS.deviation',batch:b.id,step:s.id,minute:b.clock,revision:b.revision,payload:{reason,status:'open'}});}audit(m,'Execution blocked',b.id+' · '+s.name+' · '+reasons.join(' '),actor);return {ok:false,reasons};}
 const r={step:s.id,name:s.name,type:s.type,start:b.clock,end:b.clock+s.duration,actor:s.type==='review'?'QA · simulated':b.operator.name,inputs:structuredClone(b.inputs),lot:b.lot.id,equipment:b.equipment.name,witness:s.type==='weigh'&&b.policy.witness?b.witness:null};
 b.records.push(r);b.clock=r.end;if(s.type==='weigh'){b.consumed=b.inputs.weight;b.lot.quantity-=b.inputs.weight;}if(s.type==='review')b.status='released';
 b.events.push({id:b.id+':'+s.id,type:s.type==='sample'?'LIMS.result':s.type==='review'?'ERP.disposition':'MES.stepCompleted',batch:b.id,step:s.id,minute:b.clock,revision:b.revision,payload:{start:r.start,end:r.end,evidence:structuredClone(r.inputs),lot:r.lot,equipment:r.equipment,disposition:b.status,source:b.source||null}});audit(m,s.type==='review'?'Batch released':'Step completed',b.id+' · '+s.name,r.actor);return {ok:true};
}
export function resolveException(m,b,id,note,actor='qa'){
 if(actor!=='qa')throw Error('QA role is required to resolve an exception.');if(!note?.trim())throw Error('Record the investigation and disposition rationale.');
 const e=b.exceptions.find(x=>x.id===id);if(!e||e.resolved)throw Error('Select an open exception.');e.resolved=true;e.note=note;e.resolvedAt=b.clock;audit(m,'Exception reviewed',id+' · '+note,'QA · simulated');
}
export function simulateMES(m,fault='none'){
 const copy=structuredClone(m);approveRecipe(copy);const b=startBatch(copy),c=processSpec(copy);
 if(fault==='held')b.lot.status='held';if(fault==='dose')b.inputs.weight*=1.05;if(fault==='ipc')b.inputs.assay=c.assay[2]-1;if(fault==='dirty')b.equipment.clean=false;if(fault==='identity')b.inputs.identity='PT-OTHER';
 let stop=[];for(let n=0;n<b.recipe.steps.length+1;n++){const s=nextStep(b);if(!s)break;if(fault==='hold'&&s.type==='pack')b.clock+=c.hold+1;const r=executeStep(copy,b,'qa');if(!r.ok){stop=r.reasons;break;}}
 return {fault,batch:b,stop,duration:b.clock,completed:b.records.length,released:b.status==='released'};
}
export function validationChecks(m){return ['none','held','dose','ipc','dirty','hold',...(m.process==='cell'?['identity']:[])].map(fault=>{const r=simulateMES(m,fault);let expected=fault==='none';if(fault==='held')expected=!m.policy.material;if(fault==='dose')expected=m.policy.tolerance>=5;if(fault==='dirty')expected=!m.policy.equipment;if(fault==='hold')expected=!m.policy.hold;if(fault==='identity')expected=!m.policy.identity;return {fault,passed:r.released===expected,expected:expected?'Release':'Block',observed:r.released?'Release':'Block',reason:r.stop.join(' '),completed:r.completed};});}
