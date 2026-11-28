(()=>{
 /* The hosted cockpit owns its control after the launch parent hides its copy.
    Arrival articles still use their journey parent's control. */
 const hostedCockpit=window.self!==window.top&&window.frameElement?.classList.contains('cockpit-preloader');
 if(window.self!==window.top&&!hostedCockpit)return;
 const key='sc-cutscenes-enabled';let memory=true;
 window.cutscenesEnabled=()=>{try{return localStorage.getItem(key)!=='false'}catch{return memory}};
 const button=document.createElement('button');button.id='cutscenes-toggle';button.type='button';button.setAttribute('role','switch');button.setAttribute('aria-label','Cutscenes');button.innerHTML='<svg aria-hidden="true" width="26" height="24" viewBox="0 0 26 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="12" height="10" rx="2"/><path d="m14 10 3-2v8l-3-2"/><circle class="cutscenes-on" cx="22" cy="7" r="2.25"/><path class="cutscenes-off" d="m2 3 18 18"/></svg>';document.body.append(button);
 const paint=()=>{const on=window.cutscenesEnabled();button.setAttribute('aria-checked',String(on));button.title=on?'Turn cutscenes off':'Turn cutscenes on'};
 const apply=()=>{paint();if(window.cutscenesEnabled())return;const launch=document.querySelector('.launch-transition');if(launch&&!launch.hidden)launch.querySelector('.launch-skip')?.click();if(document.body.classList.contains('in-flight')&&!document.body.classList.contains('at-article'))window.quickstartVideo?.skip()};
 button.addEventListener('click',()=>{memory=!window.cutscenesEnabled();try{localStorage.setItem(key,String(memory))}catch{}apply();window.dispatchEvent(new CustomEvent('sc-cutscenes-change',{detail:{enabled:window.cutscenesEnabled()}}))});
 window.addEventListener('storage',e=>{if(e.key===key)apply()});paint();
})();