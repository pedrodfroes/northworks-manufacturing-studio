// Chart-first attention cues. No prescribed order or numbered narration.
function attachVisualStory(stepId){
 if(stepId==='bottleneck-intro'||stepId==='bottleneck-preview'){renderPlannerBottleneck(stepId);return;}
 if(state.tutorial?.active)return;
 const topic=stepId.startsWith('calendar-gantt-')?'capacity':stepId.split('-')[0];
 const specs={
  capacity:{chart:'.gantt',title:'Working time sets the limit.',cues:[['Available to run','.gantt-block.shift'],['Capacity removed','.gantt-block.exception'],['Closed time','.gantt-track']]},
  bottleneck:{chart:'.gantt',title:'Find the lane with no room left.',cues:[['The limiting resource','.gantt-row.ccr'],['Room to spare','.gantt-row:not(.gantt-axis):not(.ccr)']]},
  tank:{chart:'.tank-board',title:'Watch the liquid level.',cues:[['Fill → hold → drain','.tank-fill'],['Do not exceed','.tank-guide.max'],['Keep this reserve','.tank-guide.heel']]},
  transition:{chart:'.seq-gantt',title:'The time between runs matters.',cues:[['Productive time','.seq-seg.job'],['Time lost between runs','.seq-seg.changeover, .seq-seg.setup'],['Cleaning occupies the line','.seq-seg.cleaning']]},
  workforce:{chart:'.gantt',title:'A free machine may still have to wait.',cues:[['Needs a person','.wf-block.need'],['People available','.wf-block.avail'],['Waiting for a skill','.wf-block.wait']]}
 };
 if(!/^(calendar-gantt-(intro|preview)|(bottleneck|tank|transition|workforce)-(intro|preview))$/.test(stepId))return;
 const spec=specs[topic],root=document.querySelector('#stageBody'),chart=root.querySelector(spec.chart);if(!chart)return;
 root.classList.add('visual-story-page');root.querySelector('.step h2').textContent=spec.title;
 const wrap=document.createElement('div');wrap.className='attention-chart';chart.before(wrap);wrap.appendChild(chart);
 const bar=document.createElement('div');bar.className='attention-toolbar';bar.innerHTML=`<span>${'ILLUSTRATION · NOT A SCHEDULE RESULT'}</span><button type="button" class="ghost-btn">Show whole chart</button>`;wrap.before(bar);
 const clear=()=>{chart.classList.remove('story-focused');chart.querySelectorAll('.story-target,.story-context').forEach(el=>el.classList.remove('story-target','story-context'));};
 const cues=spec.cues.map(([label,selector])=>({label,targets:[...chart.querySelectorAll(selector)]})).filter(c=>c.targets.length);
 let active=cues[0],shown=false;
 function focus(cue){clear();active=cue;shown=true;bar.querySelector('button').textContent='Show whole chart';chart.classList.add('story-focused');cue.targets.forEach(el=>{el.classList.add('story-target');let p=el.parentElement;while(p&&p!==chart){p.classList.add('story-context');p=p.parentElement;}});wrap.querySelectorAll('.attention-pin').forEach(b=>{b.classList.toggle('active',b.textContent===cue.label);b.setAttribute('aria-pressed',String(b.textContent===cue.label));});}
 cues.forEach(cue=>{const button=document.createElement('button');button.type='button';button.className='attention-pin';button.textContent=cue.label;button.setAttribute('aria-label',`Highlight: ${cue.label}`);button.onclick=()=>focus(cue);button.onfocus=()=>focus(cue);button.onmouseenter=()=>focus(cue);cue.button=button;bar.appendChild(button);});
 function position(){const box=wrap.getBoundingClientRect(),placed=[];cues.forEach(cue=>{const r=cue.targets[0].getBoundingClientRect(),b=cue.button;let x=Math.max(4,Math.min(box.width-b.offsetWidth-4,r.left-box.left+r.width/2-b.offsetWidth/2)),y=Math.max(4,r.top-box.top-29);for(const prev of placed)if(Math.abs(y-prev.y)<29&&x<prev.x+prev.w+8&&x+b.offsetWidth>prev.x)y=prev.y+31;b.style.position='static';placed.push({x,y,w:b.offsetWidth});});}
 bar.querySelector('button').onclick=()=>{if(shown){clear();shown=false;wrap.querySelectorAll('.attention-pin').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false')});bar.querySelector('button').textContent='Highlight key features';}else if(active)focus(active);};
 wrap.addEventListener('keydown',e=>{if(e.key==='Escape'){clear();shown=false;bar.querySelector('button').textContent='Highlight key features';}});
 bar.querySelector('button').textContent='Highlight key features';requestAnimationFrame(position);
 const observer=new ResizeObserver(position);observer.observe(wrap);
 window.visualStoryCleanup=()=>observer.disconnect();
}
