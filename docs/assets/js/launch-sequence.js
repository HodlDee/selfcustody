(()=>{try{sessionStorage.setItem("sc-launch-seen","1")}catch(e){}})();
(() => {
 const links=[...document.querySelectorAll('.rocket-launch-link')];
 const layer=document.querySelector('.launch-transition');
 if(!links.length||!layer)return;
 const video=layer.querySelector('video'),skip=layer.querySelector('.launch-skip');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const portrait=matchMedia('(max-width:1199px) and (max-aspect-ratio:6/5)');
 const cockpit=links[0].getAttribute('href')||'index.html';
 const launchTitle=document.title;
 const launchCopy=document.querySelector('.mobile-launch-title');
 let cockpitFrame=null,cockpitPrepared=false,cockpitVisible=false,skyBanner=null;
 let busy=false,leaving=false,warmed=false,deadline=0,framing=0,portraitStart=null;
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
  // Move one soft edge through the caption, finishing during ignition.
  const captionProgress=Math.max(0,Math.min(1,(video.currentTime-.02)/1.1));
  if(skyBanner){
   skyBanner.style.setProperty('--launch-welcome-edge', `${128-156*captionProgress}%`);
   skyBanner.style.visibility=captionProgress===1?'hidden':'';
  }
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
   // Laptops now have a full-height movie: reveal its whole sky immediately.
   // Other layouts retain their existing sky blend above the opening rocket.
   const laptop=innerWidth>=901&&innerWidth<1600&&innerWidth/innerHeight>1.2;
   const skyProgress=laptop?1:Math.max(0,Math.min(1,(video.currentTime-1)/1.2));
   // A fourth-power lead-in keeps the first stars subtler, with a soft finish at full opacity.
   const skyAlpha=skyProgress*skyProgress*skyProgress*skyProgress*(5-4*skyProgress);
   document.body.style.setProperty("--launch-rest-sky-opacity",String(laptop?1:1-skyAlpha));
   let skyMask=skyProgress<1?`linear-gradient(to bottom,rgba(0,0,0,${skyAlpha}) 30%,#000 38%)`:'none';
   // Blend the tablet's fitted movie into the sky until the camera fills the screen.
   if(innerWidth>600&&innerWidth<1200&&innerWidth/innerHeight<=1.2&&e<1){
    const feather=`linear-gradient(to bottom,transparent,#000 ${64*(1-e)}px)`;
    skyMask=skyMask==='none'?feather:`${skyMask},${feather}`;
   }
   video.style.maskComposite='intersect';
   video.style.maskImage=skyMask;
   video.style.webkitMaskImage=skyMask;
  }else{
   const art=document.querySelector('.mobile-launch-scene'),windowBox=document.querySelector('.mobile-launch').getBoundingClientRect();
   if(!portraitStart){const r=art.getBoundingClientRect();portraitStart={x:r.left,y:r.bottom-r.width*9/16,width:r.width,windowTop:windowBox.top}}
   const smooth=v=>{v=Math.max(0,Math.min(1,v));return v*v*v*(v*(v*6-15)+10)};
   // Hold the registered opening through ignition, then follow the approach.
   const p=smooth((video.currentTime-2.7)/1.5),mix=(a,b)=>a+(b-a)*p;
   const scale=Math.max(innerWidth/1920,innerHeight/1080),endW=1920*scale;
   const follow=smooth((video.currentTime-2.7)/1.5),focus=1313+(960-1313)*follow;
   // Ease the added magnification more slowly than the follow movement,
   // giving the film's own push-in more room without revealing its lower edge.
   const zoomProgress=smooth((video.currentTime-2.7)/2.4);
   const width=portraitStart.width+(endW-portraitStart.width)*zoomProgress;
   const registration=portraitStart.x-(innerWidth/2-1313*portraitStart.width/1920);
   const left=innerWidth/2-focus*width/1920+registration*(1-p),top=portraitStart.y+((innerHeight-1080*scale)/2-portraitStart.y)*zoomProgress;
   Object.assign(video.style,{width:width+'px',height:width*9/16+'px',left:left+'px',top:top+'px',objectFit:'fill',transformOrigin:'50% 48.5%',transform:`scaleY(${1+.01025*(1-p)})`,clipPath:'none'});
   const sky=smooth((video.currentTime-.25)/1.35);
   const tablet=innerWidth>600;
   // On tablets, fade the sky at fixed coordinates instead of wiping upward.
   const edge=Math.max(0,portraitStart.windowTop-portraitStart.y)*(tablet?1:1-sky)*(1-p);
   const feather=Math.max(48,(portraitStart.width/2.7)*.94*.07)*(1-zoomProgress);
   const skyOpacity=tablet?`rgba(0,0,0,${sky})`:'transparent';
   const mask=zoomProgress>=1||(tablet&&sky>=1)?'none':`linear-gradient(to bottom,${skyOpacity} ${edge}px,#000 ${edge+feather}px)`;
   video.style.maskImage=mask;video.style.webkitMaskImage=mask;
   video.style.opacity=String(smooth(video.currentTime/.24));
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
   frame.contentDocument?.addEventListener('click',event=>{
    if(!cockpitVisible||event.defaultPrevented||event.button>0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const link=event.target.closest('a[href]');
    if(!link||link.target==='_blank'||link.hasAttribute('download')||link.getAttribute('href').startsWith('#'))return;
    event.preventDefault();
    if(link.id==='back-to-launch'){
     window.pageTransition.run(()=>new Promise(resolve=>{
      window.addEventListener('popstate',resolve,{once:true});
      history.back();
     }),true);
    }else window.pageTransition.navigate(link.href);
   });
  });
  document.body.append(frame);
 }
 function prepareCockpit(){
  let player;
  try{player=cockpitFrame?.contentWindow?.quickstartVideo}catch{return false}
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
  cockpitFrame.contentWindow.quickstartVideo.setViewportActive(true);
  cockpitFrame.contentWindow.quickstartVideo.revealLaunchArrival();
  layer.hidden=true;cockpitFrame.focus({preventScroll:true});
  return true;
 }
 function restoreLaunch(){
  layer.querySelector('.launch-skip-blackout')?.remove();
  clearTimeout(deadline);cancelAnimationFrame(framing);busy=false;leaving=false;video.pause();video.currentTime=0;layer.hidden=true;
  cockpitVisible=false;cockpitPrepared=false;
  cockpitFrame?.contentWindow.quickstartVideo?.setViewportActive(false);
  if(cockpitFrame){cockpitFrame.classList.remove('is-prepared','is-presented');cockpitFrame.inert=true;cockpitFrame.setAttribute('aria-hidden','true');cockpitFrame.contentWindow.quickstartVideo?.reset()}
  skyBanner?.remove();skyBanner=null;launchCopy.style.opacity='';portraitStart=null;video.style.opacity='';video.style.maskImage='';video.style.webkitMaskImage='';video.style.clipPath='';video.style.filter='';document.body.style.removeProperty('--launch-rest-sky-opacity');layer.classList.remove('is-playing');document.title=launchTitle;
  document.querySelector('main').inert=false;document.getElementById('launchpad').inert=false;document.getElementById('site-header').inert=false;
  document.body.classList.remove('launch-in-progress');
 }
 async function enter(withReveal, skipLaunch=false){
  if(leaving)return;leaving=true;clearTimeout(deadline);cancelAnimationFrame(framing);video.pause();
  let blackout;
  if(skipLaunch&&!reduced.matches){
   blackout=document.createElement('div');
   blackout.className='launch-skip-blackout';
   blackout.setAttribute('aria-hidden','true');
   layer.append(blackout);
   await blackout.animate([{opacity:0},{opacity:1}],{duration:260,easing:'ease-in-out',fill:'forwards'}).finished;
  }
  if(withReveal&&!reduced.matches&&showCockpit()){blackout?.remove();return;}
  try{if(withReveal&&!reduced.matches)sessionStorage.setItem('sc-launch-arrival',String(Date.now()));else sessionStorage.removeItem('sc-launch-arrival');}catch{}
  if(withReveal)location.assign(cockpit);else window.pageTransition.navigate(cockpit);
 }
 function launch(event){
  if(event.button>0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  if(reduced.matches||window.cutscenesEnabled?.()===false)return;
  event.preventDefault();if(busy)return;busy=true;warm();
  // Keep the transition's Skip button active while locking the launch artwork.
  document.getElementById('launchpad').inert=true;
  document.getElementById('site-header').inert=true;
  document.body.classList.add('launch-in-progress');
  layer.hidden=false;(document.getElementById('cutscenes-toggle')||skip).focus({preventScroll:true});
  layer.classList.remove('is-playing');
  // A stalled download must not turn a short launch into a waiting screen.
  deadline=setTimeout(()=>enter(false),9000);
  video.currentTime=0;portraitStart=null;
  skyBanner?.remove();skyBanner=null;
  // Keep the caption above the crossfade so only its moving edge controls the exit.
  skyBanner=launchCopy.cloneNode(true);skyBanner.classList.add('launch-sky-banner');
  skyBanner.setAttribute('aria-hidden','true');layer.append(skyBanner);launchCopy.style.opacity='0';
  frameRocket();
  playLaunchVideo();
 }
 video.addEventListener('playing',()=>{
  const reveal=()=>{if(busy&&!leaving)layer.classList.add('is-playing')};
  if(video.requestVideoFrameCallback)video.requestVideoFrameCallback(reveal);else requestAnimationFrame(reveal);
 });
 links.forEach(link=>{link.addEventListener('click',launch);link.addEventListener('pointerenter',warm,{once:true});link.addEventListener('focus',warm,{once:true});});
 skip.addEventListener('click',()=>enter(true,true));
 video.addEventListener('ended',()=>enter(true));
 video.addEventListener('error',()=>{if(!fallbackVideo()&&busy)enter(false)});
 document.addEventListener('keydown',event=>{if(busy&&event.key==='Escape'){event.preventDefault();enter(true,true)}});
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
