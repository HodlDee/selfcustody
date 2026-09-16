(() => {
 window.installCockpitMenuOrbit=async function(d,available){
  const w=d.defaultView,stage=d.querySelector('.cockpit-composition'),gate=d.querySelector('.choice-quickstart'),menu=d.querySelector('.hub-directory');
  const style=d.createElement('link');style.rel='stylesheet';style.href='assets/css/cockpit-menu-orbit.css?v=4';
  await new Promise(resolve=>{style.onload=resolve;style.onerror=resolve;d.head.append(style)});
  const entries=new Map([['quickstart',{el:gate,p:0}]]);
  const approved={
   help:{file:'help-station-approved-v1.png',alt:'A waving astronaut beside a warm ivory and copper help station.',width:1374,height:1145},
   entropy:{file:'entropy-gyro-approved-v1.png',alt:'A spherical copper gyroscope workshop with floating dice, cards and a heads coin.',width:1312,height:1199},
   dashboard:{file:'dashboard-satellite-approved-v1.png',alt:'An ivory and copper satellite with teal solar panels.',width:1536,height:1024}
  };
  gate.classList.add('cockpit-orbit-quickstart');
  for(const key of ['help','entropy','dashboard','compare','guides']){
   const source=d.querySelector(`.choice-${key} .destination-art`);
   const el=d.createElement('div');el.className='cockpit-orbit-destination';el.dataset.orbitDestination=key;el.setAttribute('aria-hidden','true');el.style.visibility='hidden';
   if(approved[key]){
    const art=approved[key],world=d.createElement('span'),holder=d.createElement('div'),img=d.createElement('img');
    world.className='world-mini approved-destination';holder.className='approved-art';
    img.src='assets/img/space-hub/'+art.file;img.alt=art.alt;img.width=art.width;img.height=art.height;img.decoding='async';
    holder.style.aspectRatio=art.width+'/'+art.height;holder.append(img);
    if(key==='entropy'){
     // Neutralize only the pale shell. The original PNG, copper and room stay intact.
     const shell=d.createElementNS('http://www.w3.org/2000/svg','svg');
     shell.setAttribute('viewBox','0 0 1312 1199');shell.setAttribute('aria-hidden','true');shell.classList.add('entropy-shell-tone');
     shell.innerHTML=`<defs>
      <filter id="entropy-ivory-select" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  -.6 -.6 4 0 -.25"/><feComposite in2="SourceGraphic" operator="in"/></filter>
      <filter id="entropy-ivory-tone" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0  .6 .4 0 0 0  .7 0 .3 0 0  0 0 0 1 0"/></filter>
      <mask id="entropy-shell-region"><ellipse cx="660" cy="570" rx="398" ry="370" fill="white"/><ellipse cx="710" cy="566" rx="303" ry="301" fill="black"/></mask>
      <mask id="entropy-pale-shell" style="mask-type:alpha"><g mask="url(#entropy-shell-region)"><image href="assets/img/space-hub/entropy-gyro-approved-v1.png" width="1312" height="1199" filter="url(#entropy-ivory-select)"/></g></mask>
     </defs><image href="assets/img/space-hub/entropy-gyro-approved-v1.png" width="1312" height="1199" filter="url(#entropy-ivory-tone)" mask="url(#entropy-pale-shell)" opacity=".85"/>`;
     holder.append(shell);
    }
    if(key==='dashboard'){
     const signals=d.createElement('img');signals.src='assets/img/space-hub/dashboard-signal-arcs.svg';signals.className='dashboard-signal-layer';signals.alt='';signals.setAttribute('aria-hidden','true');holder.append(signals);
    }
    world.append(holder);el.append(world);
   }else el.append(source.content.querySelector('.world-mini').cloneNode(true));
   for(const img of el.querySelectorAll('img')){img.loading='eager';img.removeAttribute('srcset');img.removeAttribute('sizes')}
   gate.parentElement.append(el);entries.set(key,{el,p:1});
  }
  // Warm the existing artwork before the first hover, including the workshop's separate pieces.
  await Promise.all([...entries.values()].flatMap(({el})=>[...el.querySelectorAll('img')].map(img=>img.decode().catch(()=>{}))));
  let selected='quickstart',wanted='quickstart',frame=0,timer=0,hovered=null,geometry,pendingLink=null,pendingFill=null;
  const fills=new Map();
  for(const link of menu.querySelectorAll('[data-select]')){
   const fill=d.createElement('span');fill.className='orbit-hover-fill';fill.setAttribute('aria-hidden','true');link.prepend(fill);fills.set(link,fill);
  }
  const reduced=w.matchMedia('(prefers-reduced-motion: reduce)');
  const ease=(t,leaving)=>leaving?t*t*(3-2*t):1-Math.pow(1-t,4);
  const moving=()=>[...entries.values()].some(entry=>entry.motion);
  function layout(){
   const x=gate.offsetLeft,y=gate.offsetTop,width=gate.offsetWidth;
   const earth=d.querySelector('.selection-earth').getBoundingClientRect();
   geometry={x,y,span:Math.max(w.innerWidth*.82,width*1.6,x+width*.65),center:earth.width?earth.x+earth.width/2:w.innerWidth/2,radius:Math.max(w.innerWidth*1.35,earth.width*.65)};
   for(const [key,{el}] of entries){if(key==='quickstart')continue;el.style.left=x+'px';el.style.top=y+'px';el.style.width=width*((key==='compare'||key==='guides')?.82:.67)+'px';el.style.height=width*.62+'px'}
   for(const entry of entries.values())paint(entry);
  }
  function paint(entry){
   const dx=entry.p*geometry.span,base=geometry.x-geometry.center;
   // A shared orbital arc: rise toward Earth's crown, then descend beyond it.
   const dy=((base+dx)*(base+dx)-base*base)/(2*geometry.radius);
   entry.el.style.setProperty('--orbit-x',dx+'px');entry.el.style.setProperty('--orbit-y',dy+'px');
   entry.el.style.setProperty('--orbit-scale',1-Math.min(1,Math.abs(entry.p))*.12);
  }
  function visible(entry){return entry.el.style.visibility!=='hidden'}
  function rightEdge(entry){return (w.innerWidth-geometry.x+entry.el.offsetWidth*.65+24)/geometry.span}
  function setVisible(entry,on){entry.el.style.visibility=on?'':'hidden';if(entry.el===gate)gate.inert=!on||selected!=='quickstart'}
  function aim(entry,target,ms){
   if(entry.motion?.to===target)return;
   if(Math.abs(entry.p-target)<.0001){entry.p=target;entry.motion=null;paint(entry);return}
   entry.motion={from:entry.p,to:target,start:w.performance.now(),duration:ms};
  }
  function settle(){
   w.cancelAnimationFrame(frame);frame=0;
   for(const [key,entry] of entries){entry.motion=null;entry.p=key===selected?0:1;paint(entry);setVisible(entry,key===selected)}
  }
  function reconcile(){
   let count=0;
   for(const [key,entry] of entries){
    if(!visible(entry))continue;count++;
    // Once departure starts, complete it to the left even if selected again.
    // That destination can then re-enter from the right through a free slot.
    if(key===selected&&entry.motion?.to!==-1&&entry.p>=0)aim(entry,0,1050);
    else{
     const exit=-1;
     if(Math.abs(entry.p-exit)<.0001){entry.motion=null;setVisible(entry,false);count--;continue}
     aim(entry,exit,650);
    }
    if(entry.el===gate)gate.inert=key!==selected||entry.motion?.to===-1;
   }
   const next=entries.get(selected);
   if(!visible(next)&&count<2){next.p=rightEdge(next);paint(next);setVisible(next,true);aim(next,0,1050)}
  }
  function tick(now){
   frame=0;
   for(const [key,entry] of entries){
    const motion=entry.motion;if(!motion)continue;
    const t=Math.max(0,Math.min(1,(now-motion.start)/motion.duration));entry.p=motion.from+(motion.to-motion.from)*ease(t,motion.to===-1);paint(entry);
    if(t===1){entry.p=motion.to;paint(entry);entry.motion=null;if(motion.to===-1||key!==selected)setVisible(entry,false)}
   }
   // Finish this swap before considering the single latest hover request.
   reconcile();
   if(moving())frame=w.requestAnimationFrame(tick);
   else if(!timer)beginSwap();
  }
  function beginSwap(){
   if(!available()||selected===wanted)return;
   clearPending();
   selected=wanted;stage.dataset.orbitSelection=selected;
   for(const link of menu.querySelectorAll('[data-select]'))link.toggleAttribute('data-orbit-selected',link.dataset.select===selected);
   if(reduced.matches){settle();return}
   reconcile();if(!frame)frame=w.requestAnimationFrame(tick);
  }
  function show(key){
   if(!available()||!entries.has(key))return;
   wanted=key;
   if(!moving())beginSwap();
  }
  function clearPending(){
   pendingFill?.cancel();pendingFill=null;
   pendingLink?.removeAttribute('data-orbit-pending');pendingLink=null;
  }
  function schedule(){
   w.clearTimeout(timer);clearPending();
   const focused=menu.querySelector('[data-select]:focus-visible');
   const key=hovered||focused?.dataset.select||'quickstart';
   const delay=key==='quickstart'?350:190;
   if(available()&&key!==selected){
    pendingLink=menu.querySelector(`[data-select="${key}"]`);
    if(pendingLink){
     pendingLink.setAttribute('data-orbit-pending','');
     // Include the remaining rotation: a queued row fills until its swap can start.
     const now=w.performance.now();
     const wait=Math.max(delay,...[...entries.values()].map(({motion})=>motion?motion.start+motion.duration-now:0));
     if(!reduced.matches)pendingFill=fills.get(pendingLink).animate([{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{duration:wait,easing:'linear',fill:'forwards'});
    }
   }
   timer=w.setTimeout(()=>{timer=0;show(key)},delay);
  }
  for(const link of menu.querySelectorAll('[data-select]')){
   link.addEventListener('pointerenter',e=>{if(e.pointerType==='touch')return;hovered=link.dataset.select;schedule()});
   link.addEventListener('pointerleave',()=>{hovered=null;schedule()});
   link.addEventListener('focus',schedule);link.addEventListener('blur',schedule);
  }
  function reset(){
   clearPending();
   w.cancelAnimationFrame(frame);w.clearTimeout(timer);frame=0;timer=0;hovered=null;selected=wanted='quickstart';
   for(const link of menu.querySelectorAll('[data-orbit-selected]'))link.removeAttribute('data-orbit-selected');
   stage.dataset.orbitSelection=selected;settle();
  }
  w.addEventListener('resize',layout);layout();reset();
  return {reset,get selected(){return selected}};
 };
})();
