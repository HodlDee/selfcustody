(()=>{
 /* Inside the journey's arrival frame the parent already shows this control,
    and a second copy would sit on top of the first. */
 if(window.self!==window.top)return;
 const key='sc-cutscenes-enabled';let memory=true;
 window.cutscenesEnabled=()=>{try{return localStorage.getItem(key)!=='false'}catch{return memory}};
 const button=document.createElement('button');button.id='cutscenes-toggle';button.type='button';button.setAttribute('role','switch');button.setAttribute('aria-label','Cutscenes');button.innerHTML='<span>Cutscenes</span><span class="cutscenes-state"></span><span class="cutscenes-track" aria-hidden="true"></span>';document.body.append(button);
 const paint=()=>{const on=window.cutscenesEnabled();button.setAttribute('aria-checked',String(on));button.querySelector('.cutscenes-state').textContent=on?'On':'Off'};
 const apply=()=>{paint();if(window.cutscenesEnabled())return;const launch=document.querySelector('.launch-transition');if(launch&&!launch.hidden)launch.querySelector('.launch-skip')?.click();if(document.body.classList.contains('in-flight')&&!document.body.classList.contains('at-article'))window.quickstartVideo?.skip()};
 button.addEventListener('click',()=>{memory=!window.cutscenesEnabled();try{localStorage.setItem(key,String(memory))}catch{}apply();window.dispatchEvent(new CustomEvent('sc-cutscenes-change',{detail:{enabled:window.cutscenesEnabled()}}))});
 window.addEventListener('storage',e=>{if(e.key===key)apply()});paint();
})();