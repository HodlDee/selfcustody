(()=>{try{sessionStorage.setItem("sc-launch-seen","1")}catch(e){}})();
(() => {
 const links=[...document.querySelectorAll('.rocket-launch-link')];
 const layer=document.querySelector('.launch-transition');
 if(!links.length||!layer)return;
 const video=layer.querySelector('video'),skip=layer.querySelector('.launch-skip');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const portrait=matchMedia('(max-width:800px), (max-aspect-ratio:6/5)');
 const cockpit=links[0].getAttribute('href')||'index.html';
 const launchTitle=document.title;
 let cockpitFrame=null,cockpitPrepared=false,cockpitVisible=false;
 let busy=false,leaving=false,warmed=false,deadline=0,framing=0;
 function videoSource(){
  const connection=navigator.connection;
  const constrained=connection?.saveData||/^(slow-2g|2g|3g)$/.test(connection?.effectiveType||'');
  const largeScreen=matchMedia('(min-width:1200px) and (min-aspect-ratio:6/5) and (hover:hover)').matches;
  return largeScreen&&!constrained&&video.dataset.src4k?video.dataset.src4k:video.dataset.src;
 }
 function playLaunchVideo(){
  const source=video.src;
  video.play()?.catch(()=>{
   // Ignore a rejected play request after switching away from a failed source.
   if(leaving||video.src!==source)return;
   if(!fallbackVideo())enter(false);
  });
 }
 function fallbackVideo(){
  if(video.getAttribute('src')!==video.dataset.src4k)return false;
  video.src=video.dataset.src;video.load();
  if(busy&&!leaving)playLaunchVideo();
  return true;
 }
 function frameRocket(){
  // Manually fade the porthole approach and cut the remaining tail at full black.
  const end=Number.isFinite(video.duration)?video.duration:6.04;
  const handoff=end-.24;
  // Paint the warmed cockpit behind the outgoing video before the black crossing.
  if(video.currentTime>=handoff-.3)prepareCockpit();
  const darkness=Math.max(0,Math.min(1,(video.currentTime-(handoff-.3))/.3));
  video.style.filter=`brightness(${1-darkness*darkness*(3-2*darkness)})`;
  if(busy&&!leaving&&video.currentTime>=handoff){
   enter(true);return;
  }
  if(!portrait.matches){
   const stage=document.querySelector('.approved-stage').getBoundingClientRect();
   const ratio=(video.videoWidth||1920)/(video.videoHeight||1080);
   const endW=Math.max(innerWidth,innerHeight*ratio);
   // The source is a bottom-aligned crop of the homepage's 3:2 artwork.
   // Keep that exact framing through ignition; open the crop only with the filmed camera move.
   const p=Math.max(0,Math.min(1,(video.currentTime-2.7)/1.5));
   const e=p*p*(3-2*p),mix=(a,b)=>a+(b-a)*e;
   const width=mix(stage.width,endW);
   Object.assign(video.style,{width:width+'px',height:'auto',left:mix(stage.left,(innerWidth-endW)/2)+'px',top:(mix(stage.bottom,innerHeight)-width/ratio)+'px'});
   // The generated opening compresses Y by ~1.015% around 48.5% height.
   // Register it to the settled artwork; release this correction during the camera approach.
   video.style.transformOrigin='50% 48.5%';
   video.style.transform=`scaleY(${1+.01025*(1-e)})`;
   // Hold the settled sky for one second, then reveal the stars over 1.2 seconds.
   // Keep the feather above the rocket's opening position so ignition stays visible.
   const skyProgress=Math.max(0,Math.min(1,(video.currentTime-1)/1.2));
   // A fourth-power lead-in keeps the first stars subtler, with a soft finish at full opacity.
   const skyAlpha=skyProgress*skyProgress*skyProgress*skyProgress*(5-4*skyProgress);
   document.body.style.setProperty("--launch-rest-sky-opacity",String(1-skyAlpha));
   const skyMask=skyProgress<1?`linear-gradient(to bottom,rgba(0,0,0,${skyAlpha}) 30%,#000 38%)`:'none';
   video.style.maskImage=skyMask;
   video.style.webkitMaskImage=skyMask;
  }else{
   Object.assign(video.style,{width:'100%',height:'100%',left:'0px',top:'0px',transform:'none',maskImage:'none',webkitMaskImage:'none'});
  }
  const progress=Math.max(0,Math.min(1,(video.currentTime-2.7)/1.5));
  const ease=progress*progress*(3-2*progress);
  video.style.setProperty('--launch-focus-x',`${68.4-18.4*ease}%`);
  if(busy&&!leaving)framing=requestAnimationFrame(frameRocket);
 }
 function warm(){
  if(warmed)return;warmed=true;
  if(!reduced.matches){video.src=videoSource();video.preload='auto';video.load();}
  const frame=cockpitFrame=document.createElement('iframe');
  frame.className='cockpit-preloader';frame.title='';frame.tabIndex=-1;
  frame.setAttribute('aria-hidden','true');frame.inert=true;frame.src=cockpit;
  frame.addEventListener('load',()=>{
   frame.contentDocument.addEventListener('click',event=>{
    if(!cockpitVisible||event.defaultPrevented||event.button>0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const link=event.target.closest('a[href]');
    if(!link||link.target==='_blank'||link.hasAttribute('download')||link.getAttribute('href').startsWith('#'))return;
    event.preventDefault();
    if(link.id==='back-to-launch')history.back();else location.assign(link.href);
   });
  });
  document.body.append(frame);
 }
 function prepareCockpit(){
  const player=cockpitFrame?.contentWindow?.quickstartVideo;
  if(!player?.canReveal)return false;
  if(!cockpitPrepared){
   if(!player.prepareLaunchArrival())return false;
   cockpitPrepared=true;cockpitFrame.classList.add('is-prepared');
  }
  return true;
 }
 function showCockpit(addHistory=true){
  if(!prepareCockpit())return false;
  // Keep the live document: navigating here would discard the preload and flash on repaint.
  if(addHistory)history.pushState({scLaunchCockpit:true},'',cockpit);
  busy=true;leaving=true;cockpitVisible=true;
  document.title=cockpitFrame.contentDocument.title;
  document.querySelector('main').inert=true;document.getElementById('site-header').inert=true;
  document.body.classList.add('launch-in-progress');
  cockpitFrame.classList.add('is-presented');cockpitFrame.inert=false;
  cockpitFrame.removeAttribute('aria-hidden');cockpitFrame.title='Bitcoin cockpit';
  cockpitFrame.contentWindow.quickstartVideo.revealLaunchArrival();
  layer.hidden=true;cockpitFrame.focus({preventScroll:true});
  return true;
 }
 function restoreLaunch(){
  clearTimeout(deadline);cancelAnimationFrame(framing);busy=false;leaving=false;video.pause();video.currentTime=0;layer.hidden=true;
  cockpitVisible=false;cockpitPrepared=false;
  if(cockpitFrame){cockpitFrame.classList.remove('is-prepared','is-presented');cockpitFrame.inert=true;cockpitFrame.setAttribute('aria-hidden','true');cockpitFrame.contentWindow.quickstartVideo?.reset()}
  video.style.filter='';document.body.style.removeProperty('--launch-rest-sky-opacity');layer.classList.remove('is-playing');document.title=launchTitle;
  document.querySelector('main').inert=false;document.getElementById('site-header').inert=false;
  document.body.classList.remove('launch-in-progress');
 }
 function enter(withReveal){
  if(leaving)return;leaving=true;clearTimeout(deadline);cancelAnimationFrame(framing);video.pause();
  if(withReveal&&!reduced.matches&&showCockpit())return;
  try{if(withReveal&&!reduced.matches)sessionStorage.setItem('sc-launch-arrival',String(Date.now()));else sessionStorage.removeItem('sc-launch-arrival');}catch{}
  location.assign(cockpit);
 }
 function launch(event){
  if(event.button>0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  if(reduced.matches||window.cutscenesEnabled?.()===false)return;
  event.preventDefault();if(busy)return;busy=true;warm();
  document.querySelector('main').inert=true;
  document.getElementById('site-header').inert=true;
  document.body.classList.add('launch-in-progress');
  layer.hidden=false;(document.getElementById('cutscenes-toggle')||skip).focus({preventScroll:true});
  layer.classList.remove('is-playing');
  // A stalled download must not turn a short launch into a waiting screen.
  deadline=setTimeout(()=>enter(false),9000);
  video.currentTime=0;
  frameRocket();
  playLaunchVideo();
 }
 video.addEventListener('playing',()=>{
  const reveal=()=>{if(busy&&!leaving)layer.classList.add('is-playing')};
  if(video.requestVideoFrameCallback)video.requestVideoFrameCallback(reveal);else requestAnimationFrame(reveal);
 });
 links.forEach(link=>{link.addEventListener('click',launch);link.addEventListener('pointerenter',warm,{once:true});link.addEventListener('focus',warm,{once:true});});
 skip.addEventListener('click',()=>enter(false));
 video.addEventListener('ended',()=>enter(true));
 video.addEventListener('error',()=>{if(!fallbackVideo()&&busy)enter(false)});
 document.addEventListener('keydown',event=>{if(busy&&event.key==='Escape'){event.preventDefault();enter(false)}});
 // The header and scene are already painted before preloading the next view.
 window.addEventListener('load',()=>setTimeout(warm,650),{once:true});
 window.addEventListener('pageshow',event=>{
  if(!event.persisted)return;
  if(!history.state?.scLaunchCockpit)restoreLaunch();
 });
 window.addEventListener('popstate',event=>{
  if(event.state?.scLaunchCockpit){if(!showCockpit(false))location.reload()}
  else if(cockpitVisible){restoreLaunch();links[0].focus({preventScroll:true})}
 });
})();

