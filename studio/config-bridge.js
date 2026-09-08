let appliesToProject=()=>true;
// Keep the complete existing decision engine inside an isolated migration boundary.
function publishConfiguration(){
 const decisionStatus=steps.map(s=>({id:s.id,required:!!s.gate&&appliesToProject(s.id,state),complete:s.gate?!!s.gate():null}));
 localStorage.setItem('northworks-decision-status',JSON.stringify(decisionStatus));
 parent.postMessage({type:'configuration-state',step:steps[state.i]?.id,status:decisionStatus,readiness:readiness(),summary:{scope:state.scope,industry:industryLabel(),erp:profile().badge,master:state.masterPlanning.enabled,dispatch:state.dispatch.enabled},configuration:JSON.parse(JSON.stringify(state))},location.origin);
}
window.addEventListener('DOMContentLoaded',async()=>{
 const {adjacent,sequence}=await import('./navigation.js?v=17');
 const {attachDecisionContext}=await import('./decision-context.js?v=17');
 const {renderScope,stepApplies}=await import('./capabilities.js?v=17');
 appliesToProject=stepApplies;
 const {registerDomainDesign}=await import('./domain-design.js?v=17');
 const {registerModules}=await import('./business-modules.js?v=17');
 registerModules({state,steps,render:()=>render()});
 registerDomainDesign({state,steps,render:()=>render()});
 const nextStep=(id,direction)=>{let next=adjacent(id,direction);while(next&&!stepApplies(next,state))next=adjacent(next,direction);return next;};
 const original=render;let lastStep=null;
 render=function(){
  const currentId=steps[state.i]?.id,same=currentId===lastStep,scroll=document.querySelector('#stageBody').scrollTop,active=document.activeElement;
  const focusSelector=active?.id?'#'+CSS.escape(active.id):active?.hasAttribute('data-capability')?'[data-capability="'+active.dataset.capability+'"]':active?.hasAttribute('data-contract')?'[data-contract="'+active.dataset.contract+'"]':null;
  const contractOpen=document.querySelector('[data-contract-details]')?.open;
  original();
  if(currentId==='scope'){renderScope(document.querySelector('.step-body'),state,()=>render());document.querySelector('.step h2').textContent='What will this implementation cover?';document.querySelector('.step-sub').textContent='Select the capabilities you are designing. Their configuration and shared handoffs form your journey.';}
  try{attachDecisionContext({state,steps,render,save,representativeData,datasetParams});}catch(error){const p=document.createElement('p');p.className='case-error';p.textContent='Worked case could not run: '+error.message;document.querySelector('#stageBody').append(p);}

  if(same&&contractOpen)document.querySelector('[data-contract-details]')?.setAttribute('open','');
  const id=steps[state.i]?.id;
  document.querySelector('#stageCount').textContent='Implementation decision';
  document.querySelector('#backBtn').disabled=sequence.indexOf(id)===0;
  document.querySelector('#nextLabel').textContent=nextStep(id,1)?'Next: '+(steps.find(s=>s.id===nextStep(id,1))?.nav||'decision'):'Return to map';
  if(same){document.querySelector('#stageBody').scrollTop=scroll;if(focusSelector)document.querySelector(focusSelector)?.focus({preventScroll:true});}else document.querySelector('#stageBody').scrollTop=0;lastStep=currentId;
  publishConfiguration();
 };
 const open=id=>{const index=steps.findIndex(s=>s.id===id);if(index<0)return;state.i=index;state.max=Math.max(state.max,index);state.view='flow';state.done=false;state.coverSeen=true;state.tutorial.active=false;render();};
 window.addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==parent)return;if(e.data?.type==='configuration-open')open(e.data.step);});
 document.addEventListener('click',e=>{if(e.target.closest('#launchAPS,#sandboxToggle')){e.preventDefault();e.stopImmediatePropagation();parent.postMessage({type:'configuration-experiment',configuration:JSON.parse(JSON.stringify(state))},location.origin);return;}const button=e.target.closest('#nextBtn,#backBtn');if(!button||button.disabled)return;e.preventDefault();e.stopImmediatePropagation();const id=nextStep(steps[state.i].id,button.id==='nextBtn'?1:-1);if(id)open(id);else parent.postMessage({type:'configuration-map'},location.origin);},true);
 open(new URLSearchParams(location.search).get('step')||'scope');
});
