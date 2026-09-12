// Compatibility routes remain valid; the working journey has one stop per decision.
export const workspaceAliases={welcome:'scope','calendar-gantt-intro':'calendar','calendar-gantt-preview':'calendar','bottleneck-intro':'constraint','bottleneck-preview':'constraint','tank-intro':'volume-storage','tank-preview':'volume-storage','transition-intro':'transitions','transition-preview':'transitions','workforce-intro':'workforce','workforce-preview':'workforce',sop:'sop-design',plm:'plm-design',mrp:'mrp-design',lims:'lims-design',qms:'qms-design'};
export const workspaceId=id=>workspaceAliases[id]||id;
export const workspaceSteps=ids=>[...new Set(ids.map(workspaceId))];
export const workspaceNames={scope:'Project scope',architecture:'Application ownership',calendar:'Shifts & available capacity',constraint:'Bottlenecks & delivery impact','volume-storage':'Liquid storage & flow',transitions:'Sequence & cleaning',workforce:'People & competing work','sop-design':'Demand & supply balance','plm-design':'Product revision & effectivity','mrp-design':'Requirements & planned supply','lims-design':'Laboratory evidence','qms-design':'Quality disposition'};

export function composeWorkspace({id,root,state,steps,render,moduleBody}){
 const domain=id.endsWith('-design')?id.slice(0,-7):null;
 if(!['sop','plm','mrp','lims','qms'].includes(domain))return;
 const body=root.querySelector('.step-body'),design=body.querySelector('.domain-design');
 if(!design)return;
 const trial=document.createElement('section');trial.className='workspace-trial';trial.innerHTML=moduleBody(domain,state);
 const details=document.createElement('details');details.className='workspace-contract';details.innerHTML='<summary>Implementation requirements & ownership</summary>';
 design.replaceWith(details);details.append(design);body.prepend(trial);
 steps.find(s=>s.id===domain)?.attach?.(trial);
 const h=root.querySelector('.step h2');if(h)h.textContent=workspaceNames[id];
 const sub=root.querySelector('.step-sub');if(sub)sub.textContent='Change the example and inspect its effect. Capture the implementation contract below.';
 const c=state.domainDesign?.[domain],status=document.createElement('p');status.className='workspace-contract-status';status.textContent=c?.owner&&c?.system&&c?.requirements?.length?'Contract captured · review evidence below':'Contract incomplete · add requirements, owner and system';details.prepend(status);
}
