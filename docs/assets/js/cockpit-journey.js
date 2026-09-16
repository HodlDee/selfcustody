(() => {
 const scene=document.getElementById('cockpit-scene'),article=document.getElementById('arrival-article'),video=document.getElementById('jump-video');
 const play=document.getElementById('sequence-play'),reset=document.getElementById('sequence-reset'),skip=document.getElementById('sequence-skip'),scrub=document.getElementById('sequence-time'),status=document.querySelector('.review-status');
 const introDuration=1.48,sourceTime=1.2;
 const firstPerson=video.dataset.perspective==='first-person';
 const galaxyArrival=video.dataset.arrival==='galaxy';
 const captureFrame=new URLSearchParams(location.search).has('capture-frame');
 if(captureFrame){document.title='Quickstart — first frame review';const captureStyle=document.createElement('style');captureStyle.textContent='#site-header,#back-to-launch,#back-to-cockpit,.video-review,#cockpit-arrival-shade{display:none!important}';document.head.append(captureStyle)}
 if(firstPerson)document.documentElement.classList.add('first-person-flight');
 if(new URLSearchParams(location.search).has('review-controls')){const controls=document.querySelector('.video-review');controls.hidden=false;controls.inert=false;controls.removeAttribute('aria-hidden')}
 const openingLead=firstPerson&&galaxyArrival?.4:0;
 const videoOffset=firstPerson?openingLead:introDuration;
 let openingAlignment=null,restingPose=null;
 let departureRingAppearance=null;
 let departureCanvas=null,departureContext=null,departureFrame=null;
 let arrivalCanvas=null,arrivalContext=null;
 let openingFrame=null,cameraLayers=[],registrationCanvas=null,registrationContext=null,registeredFrame=-1,registeredGate=null;
 let rocketPose=null,menuOrbit=null;
 const arrivalShade=document.getElementById('cockpit-arrival-shade');
 let fromLaunch=false,hostedLaunch=false;
 if(window.self===window.top){try{const stamp=Number(sessionStorage.getItem('sc-launch-arrival'));fromLaunch=stamp>0&&Date.now()-stamp<15000;sessionStorage.removeItem('sc-launch-arrival')}catch{}}
 let arrivalStarted=false,arrivalAnimations=[];
 let sceneReady=false,articleReady=false,videoReady=false,failed=false,raf=0,runId=0,state='idle',time=0,blobUrl;
 const clamp=v=>Math.max(0,Math.min(1,v)),smooth=v=>{v=clamp(v);return v*v*(3-2*v)};
 const duration=()=>Number.isFinite(video.duration)?video.duration:6.041667;
 const ending=()=>videoOffset+duration();
 const cockpitReady=()=>sceneReady&&(!firstPerson||!!openingFrame||failed);
 function layout(){const params=new URLSearchParams(location.search),captureWidth=Number(params.get('width')),captureHeight=Number(params.get('height'));if(captureFrame&&captureWidth>=320&&captureWidth<=3840&&captureHeight>=240&&captureHeight<=2160){const scale=Math.min(innerWidth/captureWidth,innerHeight/captureHeight);scene.style.width=captureWidth+'px';scene.style.height=captureHeight+'px';scene.style.transform=`translate(${(innerWidth-captureWidth*scale)/2}px,${(innerHeight-captureHeight*scale)/2}px) scale(${scale})`;return}const responsive=scene.hasAttribute('data-viewport-layout')||innerWidth<=900,w=responsive?innerWidth:1920,h=responsive?innerHeight:1080,s=responsive?1:Math.max(innerWidth/w,innerHeight/h);scene.style.width=w+'px';scene.style.height=h+'px';scene.style.transform=`translate(${(innerWidth-w*s)/2}px,0) scale(${s})`}
 layout();addEventListener('resize',()=>{resetDeparture();restingPose?.clear();restingPose=null;layout();rocketPose=null;if(openingLead&&sceneReady&&state==='idle')restingPose=window.createQuickstartRestingPose(scene,openingLead)});
 function ready(){play.disabled=!cockpitReady();if(sceneReady)status.textContent=videoReady?'Ready — click Quickstart or Play.':failed?'Video unavailable. You can still open the article.':'Preparing the video…';scrub.max=ending();if(cockpitReady()&&!arrivalStarted){arrivalStarted=true;arriveCockpit()}}
 function arriveCockpit(returnFocus=false){
  resetAll();
  const focus=()=>{if(returnFocus)scene.contentDocument.querySelector('.choice-quickstart')?.focus({preventScroll:true})};
  if(captureFrame||!arrivalShade||(window.self!==window.top&&!hostedLaunch)||matchMedia('(prefers-reduced-motion: reduce)').matches){focus();return}
  // The gate enters sideways and settles in the original wide cockpit view.
  state='entering';scene.inert=false;arrivalShade.style.opacity='1';
  const id=runId,d=scene.contentDocument,compact=scene.contentWindow.innerWidth<=900;
  const motion={duration:1900,delay:100,easing:'cubic-bezier(.22,.65,.25,1)',fill:'both'};
  for(const el of d.querySelectorAll('.cabin-art,.cabin-mobile-art,.selection-copy'))arrivalAnimations.push(el.animate([{translate:`${compact?-32:-110}px 0`},{translate:'0 0'}],motion));
  const brand=document.querySelector('#site-header .sc-brand');
  if(brand)arrivalAnimations.push(brand.animate([{translate:`${compact?-32:-110}px 0`},{translate:'0 0'}],motion));
  const gate=d.querySelector('.choice-quickstart');
  if(gate)arrivalAnimations.push(gate.animate([{translate:`${compact?26:95}px 0`},{translate:'0 0'}],motion));
  // Match the outgoing black, then ease into the cockpit as soon as it is ready.
  const launchReveal=fromLaunch&&!returnFocus;
  arrivalShade.style.backgroundColor=launchReveal?'#000':'';
  arrivalAnimations.push(arrivalShade.animate([{opacity:1},{opacity:0}],{duration:launchReveal?600:650,easing:launchReveal?'cubic-bezier(.25,.1,.25,1)':'ease-out',fill:'both'}));
  Promise.all(arrivalAnimations.map(a=>a.finished)).then(()=>{if(id!==runId)return;arrivalShade.style.opacity='0';arrivalAnimations.forEach(a=>a.cancel());arrivalAnimations=[];scene.inert=false;state='idle';focus()}).catch(()=>{});
 }
 function idleRings(enabled){
  const d=scene.contentDocument;d.querySelector('.cockpit-composition')?.classList.toggle('gate-hover-ready',enabled);
  d.querySelector('.cockpit-composition')?.classList.toggle('gate-floating',enabled&&!firstPerson);
  if(enabled)for(const ring of d.querySelectorAll('.ring-light')){ring.style.removeProperty('--gate-activation');ring.style.removeProperty('--ring-energy')}
 }
 scene.addEventListener('load',async()=>{const w=scene.contentWindow,d=scene.contentDocument;await new Promise(resolve=>{const check=()=>w.flightMockup?.articleReady?resolve():setTimeout(check,60);check()});await Promise.all([...d.images].map(i=>i.decode().catch(()=>{})));
  const skin=d.createElement('style');skin.textContent='#header,#site-header,.flight-controls{display:none!important}@media(min-width:901px){html,body{overflow:hidden!important}html{scrollbar-gutter:auto!important}}@media(max-width:900px){html,body{overflow-x:hidden!important;overflow-y:auto!important}}';skin.textContent += '.choice-quickstart .quickstart-station{mask-image:url(assets/img/space-hub/quickstart-portrait-mask.svg?v=3)!important;mask-size:100% 100%!important;mask-repeat:no-repeat!important;mask-composite:add!important}';skin.textContent += '.flight-rocket-layer{z-index:3!important}';d.head.append(skin);
  if(firstPerson)skin.textContent+='html,body,.navmock .selection-stage,.selection-stars{background-color:#080a0d!important}.flight-rocket-layer,.warp-follow-rocket{display:none!important}.cabin-mobile-art{z-index:4}.choice-quickstart .quickstart-station>img{filter:saturate(.9)}@media(min-width:901px){.selection-earth{bottom:calc(-6vw - 7svh + max(0px,55svh - 30.9375vw))}}';
  if(captureFrame)skin.textContent+='.cabin-art,.cabin-mobile-art,.selection-copy{visibility:hidden!important}.cockpit-composition{pointer-events:none!important}';
  const hoverSkin=d.createElement('link');hoverSkin.rel='stylesheet';hoverSkin.href='assets/css/cockpit-hover.css?v=6';await new Promise(resolve=>{hoverSkin.onload=resolve;hoverSkin.onerror=resolve;d.head.append(hoverSkin)});
  // Use the artwork's existing silhouette for pointer hits, without clipping its soft edges.
  const maskText=await fetch('assets/img/space-hub/quickstart-portrait-mask.svg?v=3').then(r=>r.text());
  const maskDocument=new DOMParser().parseFromString(maskText,'image/svg+xml');
  const hitArea=d.createElementNS('http://www.w3.org/2000/svg','svg');
  hitArea.setAttribute('viewBox','0 0 1536 1024');hitArea.setAttribute('class','quickstart-hit-area');hitArea.setAttribute('aria-hidden','true');
  const hitPath=d.createElementNS('http://www.w3.org/2000/svg','path');
  hitPath.setAttribute('d',maskDocument.querySelector('path').getAttribute('d'));hitPath.setAttribute('fill','transparent');hitArea.append(hitPath);
  d.querySelector('.choice-quickstart .quickstart-station').append(hitArea);
  d.querySelector('.cockpit-composition').classList.add('gate-hit-area');
  if(window.installCockpitMenuOrbit)menuOrbit=await window.installCockpitMenuOrbit(d,()=>state==='idle'||state==='entering');
  // Keep the approved study intact; the embedded copy only provides the cockpit exit.
  d.addEventListener('click',e=>{if(e.target.closest('.choice-quickstart')){e.preventDefault();e.stopImmediatePropagation();start()}else if(e.target.closest('.hub-directory a')){e.preventDefault();e.stopImmediatePropagation();const routes={help:'contact.html',entropy:'entropy.html',dashboard:'dashboard.html',compare:'devices.html',guides:'guides.html',glossary:'glossary.html',devices:'devices.html',software:'software.html',exchanges:'exchanges.html'};(hostedLaunch?window.top:window).location.href=routes[e.target.closest('a').dataset.select]||'guides.html'}},true);
  w.flightMockup.seek(0);sceneReady=true;scene.classList.add('ready');ready();
 });
 // Fade the complete charcoal/cloud/star composition as one layer. Fading its
 // base and cloud alpha separately darkens the midpoint of the crossfade.
 function prepareArrivalBackground(d){
  const w=article.contentWindow,group=d.createElement('div');
  group.className='quickstart-arrival-background';group.setAttribute('aria-hidden','true');
  const layers=[...d.querySelectorAll('.sc-guide-head,.sc-guide-body')].map(source=>{
   const layer=d.createElement('div');group.append(layer);return {source,layer};
  });
  d.body.prepend(group);
  const update=()=>{
   group.style.height=Math.max(w.innerHeight,...[...d.body.children].filter(el=>el!==group).map(el=>el.getBoundingClientRect().bottom+w.scrollY))+'px';
   for(const {source,layer} of layers){
    const r=source.getBoundingClientRect(),cs=w.getComputedStyle(source,'::before');
    const shift=new w.DOMMatrix(w.getComputedStyle(source).transform).m42;
    Object.assign(layer.style,{position:'absolute',left:(r.left+w.scrollX+(parseFloat(cs.left)||0))+'px',top:(r.top+w.scrollY-shift+(parseFloat(cs.top)||0))+'px',width:cs.width==='auto'?r.width+'px':cs.width,height:cs.height==='auto'?r.height+'px':cs.height});
    for(const key of ['backgroundImage','backgroundSize','backgroundPosition','backgroundRepeat','maskImage','maskSize','maskPosition','maskRepeat','clipPath','opacity'])layer.style[key]=cs[key];
   }
  };
  const observer=new w.ResizeObserver(update);for(const {source} of layers)observer.observe(source);
  w.addEventListener('resize',update);update();
 }
 article.addEventListener('load',async()=>{try{const d=article.contentDocument,l=d.createElement('link');l.rel='stylesheet';l.href=galaxyArrival?'../assets/css/quickstart-galaxy-arrival.css?v=9':'../assets/css/quickstart-arrival.css?v=4';await new Promise(r=>{l.onload=r;l.onerror=r;d.head.append(l)});await d.fonts.ready;if(galaxyArrival){d.documentElement.classList.add('quickstart-arrival-layer');prepareArrivalBackground(d);article.style.background='transparent';article.style.zIndex='32';d.documentElement.style.setProperty('--arrival-background',state==='article'?'1':'0')}d.documentElement.style.setProperty('--arrival-content',state==='article'?'1':'0');articleReady=true}catch{}});
 // Loading a local blob makes replay and frame seeking reliable on the simple preview server.
 const standardSource=video.dataset.source||'assets/video/quickstart-runway-moon-v14.mp4';
 const connection=navigator.connection,constrained=connection?.saveData||/^(slow-2g|2g|3g)$/.test(connection?.effectiveType||'');
 const use4k=video.dataset.source4k&&!constrained&&matchMedia('(min-width:1200px) and (min-aspect-ratio:6/5) and (hover:hover)').matches;
 let selectedSource=use4k?video.dataset.source4k:standardSource,loadId=0;
 async function loadVideo(source){
  const id=++loadId;selectedSource=source;video.dataset.loadedSource=source;
  try{
   const response=await fetch(source);if(!response.ok)throw Error('Video download failed');
   const blob=await response.blob();if(id!==loadId)return;
   if(blobUrl)URL.revokeObjectURL(blobUrl);
   blobUrl=URL.createObjectURL(blob);video.src=blobUrl;video.load();
  }catch{if(id===loadId)videoFailure()}
 }
 function videoFailure(){
  if(selectedSource!==standardSource){videoReady=false;loadVideo(standardSource);return}
  failed=true;videoReady=false;ready();if(state==='video')revealArticle();
 }
 loadVideo(selectedSource);
 video.addEventListener('loadeddata',()=>{
  videoReady=true;
  // Keep the approved registration coordinates independent of decode resolution.
  if(firstPerson&&!openingFrame){openingFrame=document.createElement('canvas');openingFrame.width=1920;openingFrame.height=1080;openingFrame.getContext('2d').drawImage(video,0,0,1920,1080)}
  ready();
 });video.addEventListener('error',videoFailure);
 function poseForHandoff(){
  const w=scene.contentWindow,d=scene.contentDocument;
  w.flightMockup.seek(sourceTime);
  const el=d.querySelector('.flight-rocket');
  const m=el.style.transform.match(/translate\(([-.\d]+)px,\s*([-.\d]+)px\) rotate\(([-.\d]+)deg\) scale\(([-.\d]+)\)/);
  if(m)rocketPose={el,x:+m[1],y:+m[2],angle:+m[3],scale:+m[4],sx:w.innerWidth/1920,sy:w.innerHeight/1080};
 }
 function matchRocket(t){
  if(firstPerson||!rocketPose)return;
  const r=rocketPose,dt=t-introDuration,growth=dt>0?1+dt*.3:1;
  // Match the opening movie's velocity, rather than racing into a held frame.
  r.el.style.transform=`translate(${r.x+230*dt*r.sx}px,${r.y-135*dt*r.sy}px) rotate(${r.angle}deg) scale(${r.scale*growth})`;
  r.el.style.opacity=t>0?'1':'0';
 }
 function exterior(t){if(!sceneReady)return;const w=scene.contentWindow,d=scene.contentDocument;if(!firstPerson&&!rocketPose)poseForHandoff();w.flightMockup.seek(firstPerson?0:Math.min(sourceTime,t/introDuration*sourceTime));
  const cabins=[...d.querySelectorAll('.cabin-art,.cabin-mobile-art,.selection-copy')],distance=Math.max(...cabins.map(c=>c.offsetLeft+c.offsetWidth))+40;
  matchRocket(t);

  for(const c of cabins){c.style.translate=`${-distance*smooth((t-.08)/1.4)}px 0`;c.style.visibility=t>=introDuration?'hidden':''}
 }
 // Register the live artwork to the filmed approach only during departure.
 // Coordinates are the red tube's outer edge in the 1536px artwork and 1920px movie.
 const gateSource={x:554,y:154,w:345,h:372};
 const approachKeys=galaxyArrival?[
  {t:0,gate:[1288,296,214,232],moon:[1727.5,243.5,67.4],earthY:755},
  {t:.75,gate:[1224,274,266,284],moon:[1657.5,251.5,69.8],earthY:801},
  {t:1.5,gate:[1088,212,388,403],moon:[1511.5,274.5,74.4],earthY:849}
 ]:[
  {t:0,gate:[1287,281,232,249],moon:[1717,175,70],earthY:855},
  {t:.75,gate:[1179,218,331,357],moon:[1664,219,70],earthY:938},
  {t:1.5,gate:[945,87,542,578],moon:[1550,304,72],earthY:1060}
 ];
 // Read the two red tube bands from decoded frames while they are still small.
 // This follows the filmed acceleration instead of assuming a linear zoom.
 function registerGate(t){
  const index=Math.floor(t*24);
  if(index===registeredFrame)return registeredGate;
  registeredFrame=index;
  if(!registrationCanvas){registrationCanvas=document.createElement('canvas');registrationCanvas.width=640;registrationCanvas.height=560;registrationContext=registrationCanvas.getContext('2d',{willReadFrequently:true})}
  const ctx=registrationContext,sx=video.videoWidth/1920,sy=video.videoHeight/1080;ctx.drawImage(video,1050*sx,100*sy,640*sx,560*sy,0,0,640,560);
  const pixels=ctx.getImageData(0,0,640,560).data,hits=new Uint8Array(640*560),groups=[];
  for(let i=0;i<hits.length;i++){const k=i*4;hits[i]=pixels[k]>220&&pixels[k+1]<100&&pixels[k+2]<130?1:0}
  for(let i=0;i<hits.length;i++)if(hits[i]){
   const queue=[i];hits[i]=0;let left=640,top=560,right=0,bottom=0;
   for(let j=0;j<queue.length;j++){
    const at=queue[j],x=at%640,y=Math.floor(at/640);left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);
    for(const next of [at-1,at+1,at-640,at+640])if(hits[next]){hits[next]=0;queue.push(next)}
   }
   if(queue.length>500)groups.push({n:queue.length,left,top,right,bottom});
  }
  groups.sort((a,b)=>b.n-a.n);
  if(groups.length>=2){const a=groups[0],b=groups[1],x=Math.min(a.left,b.left),y=Math.min(a.top,b.top);registeredGate=[1050+x,100+y,Math.max(a.right,b.right)-x,Math.max(a.bottom,b.bottom)-y]}
  return registeredGate;
 }
 function filmPose(t){
  const a=t<=.75?approachKeys[0]:approachKeys[1],b=t<=.75?approachKeys[1]:approachKeys[2],p=clamp((t-a.t)/(b.t-a.t));
  return {gate:a.gate.map((v,i)=>v+(b.gate[i]-v)*p),moon:a.moon.map((v,i)=>v+(b.moon[i]-v)*p),earthY:a.earthY+(b.earthY-a.earthY)*p};
 }
 function prepareDeparture(){
  if(!firstPerson||departureFrame)return;
  const d=scene.contentDocument,w=scene.contentWindow;
  if(openingLead){departureFrame={gpu:true};openingAlignment=window.createQuickstartOpeningScene(scene,video,openingLead,openingFrame,departureRingAppearance);return}
  if(!departureCanvas){
   departureCanvas=d.createElement('canvas');departureCanvas.setAttribute('aria-hidden','true');
   departureCanvas.className='first-person-departure';
   departureCanvas.style.cssText='position:fixed;inset:0;z-index:3;pointer-events:none;display:none';
   d.querySelector('.cockpit-composition').append(departureCanvas);departureContext=departureCanvas.getContext('2d',{alpha:false});
  }
  const width=w.innerWidth,height=w.innerHeight,compact=width<=900;
  const targetScale=compact?Math.min(width/1920,height/1080):Math.max(width/1920,height/1080);
  departureFrame={width,height,compact,targetScale,targetX:(width-1920*targetScale)/2,targetY:compact?(height-1080*targetScale)/2:0};
  departureCanvas.width=Math.round(width*Math.min(w.devicePixelRatio,2));departureCanvas.height=Math.round(height*Math.min(w.devicePixelRatio,2));
  departureCanvas.style.width=width+'px';departureCanvas.style.height=height+'px';
  // Preserve the actual layout and all original inline styles for replay/menu return.
  cameraLayers=['.quickstart-station','.selection-moon','.selection-earth','.selection-stars'].map(selector=>{
   const el=d.querySelector(selector),rect=el.getBoundingClientRect(),matrix=new w.DOMMatrix(w.getComputedStyle(el).transform);
   const saved=['transform','transform-origin'].map(key=>[key,el.style.getPropertyValue(key),el.style.getPropertyPriority(key)]);
   return {el,selector,rect,matrix,saved};
  });
  if(openingLead)openingAlignment=window.createQuickstartOpeningAlignment?.(cameraLayers,width,height,targetScale,departureFrame.targetX,departureFrame.targetY);
 }
 function moveLayer(layer,box){
  const {el,rect,matrix:m}=layer;
  el.style.setProperty('transform-origin','0 0','important');
  el.style.setProperty('transform',`matrix(${box.w/rect.width},0,0,${box.h/rect.height},${m.e+box.x-rect.left},${m.f+box.y-rect.top})`,'important');
 }
 function cameraApproach(t){
  const f=departureFrame,p=smooth(t/.56),pose=filmPose(t),s=f.targetScale;
  if(t<.91)pose.gate=registerGate(t)||pose.gate;
  const mix=(a,b)=>a+(b-a)*p;
  for(const layer of cameraLayers){
   const r=layer.rect;let target;
   if(layer.selector==='.quickstart-station'){
    const [x,y,width,height]=pose.gate,sx=width/gateSource.w*s,sy=height/gateSource.h*s;
    target={x:f.targetX+x*s-gateSource.x*sx,y:f.targetY+y*s-gateSource.y*sy,w:1536*sx,h:1024*sy};
   }else if(layer.selector==='.selection-moon'){
    const [cx,cy,radius]=pose.moon,width=radius/.354*s,height=width*r.height/r.width;
    target={x:f.targetX+cx*s-width*.497,y:f.targetY+cy*s-height*.471,w:width,h:height};
   }else if(layer.selector==='.selection-earth'){
    const width=1920*s,height=width*r.height/r.width;
    target={x:f.targetX,y:f.targetY+pose.earthY*s-105*width/2171,w:width,h:height};
   }else target={x:r.x-f.width*.035,y:r.y-f.height*.035,w:r.width*1.07,h:r.height*1.07};
   if(r.width&&r.height)moveLayer(layer,{x:mix(r.x,target.x),y:mix(r.y,target.y),w:mix(r.width,target.w),h:mix(r.height,target.h)});
  }
 }
 function renderAlignedDeparture(t,elapsed){
  prepareDeparture();openingAlignment.render(elapsed,state==='intro'||state==='video');
 }

 function renderDeparture(t){
  if(openingLead){renderAlignedDeparture(t,videoOffset+t);return}
  prepareDeparture();const f=departureFrame;
  if(t>=introDuration){if(!f.complete)exterior(introDuration);f.complete=true;departureCanvas.style.display='none';video.style.opacity='1';return}
  f.complete=false;exterior(t);if(t<.91)cameraApproach(t);
  const ctx=departureContext;
  ctx.setTransform(departureCanvas.width/f.width,0,0,departureCanvas.height/f.height,0,0);
  ctx.fillStyle='#000';ctx.fillRect(0,0,f.width,f.height);
  ctx.drawImage(t<1/24?openingFrame:video,f.targetX,f.targetY,1920*f.targetScale,1080*f.targetScale);
  // Like the launch handoff, let the live sky dissolve while the camera is moving.
  // Nothing from the movie is visible at rest. The full viewport has no patch edges.
  const blend=smooth((t-.56)/.30),feather=f.width*.075,edge=-feather+(f.width+2*feather)*blend;
  // A short feathered wipe avoids displaying two versions of the island's lettering.
  departureCanvas.style.display=t>0?'block':'none';departureCanvas.style.opacity='1';
  const mask=t<.86?`linear-gradient(to right,#000 ${edge-feather}px,transparent ${edge+feather}px)`:'none';
  departureCanvas.style.maskImage=mask;departureCanvas.style.webkitMaskImage=mask;
  video.style.opacity='0';
 }
 function renderArrivalFraming(t){
  if(t<4.85){if(arrivalCanvas)arrivalCanvas.style.display='none';return}
  if(!arrivalCanvas){
   arrivalCanvas=document.createElement('canvas');arrivalCanvas.setAttribute('aria-hidden','true');
   arrivalCanvas.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:31;pointer-events:none;display:none';
   document.getElementById('main-content').append(arrivalCanvas);arrivalContext=arrivalCanvas.getContext('2d',{alpha:false});
  }
  const w=innerWidth,h=innerHeight,dpr=Math.min(devicePixelRatio,2),compact=w<=900;
  if(arrivalCanvas.width!==Math.round(w*dpr)||arrivalCanvas.height!==Math.round(h*dpr)){arrivalCanvas.width=Math.round(w*dpr);arrivalCanvas.height=Math.round(h*dpr)}
  const from=compact?Math.min(w/1920,h/1080):Math.max(w/1920,h/1080);
  // The cloud hero uses viewport-width artwork; match that before dissolving.
  const p=smooth((t-4.85)/.70),scale=from+(w/1920-from)*p;
  const y=(compact?(h-1080*from)/2:0)*(1-p);
  arrivalContext.setTransform(dpr,0,0,dpr,0,0);arrivalContext.fillStyle='#080a0d';arrivalContext.fillRect(0,0,w,h);
  arrivalContext.drawImage(video,(w-1920*scale)/2,y,1920*scale,1080*scale);
  const bottom=y+1080*scale;
  if(bottom<h){const feather=80*scale,fade=arrivalContext.createLinearGradient(0,bottom-feather,0,bottom);fade.addColorStop(0,'#080a0d00');fade.addColorStop(1,'#080a0d');arrivalContext.fillStyle=fade;arrivalContext.fillRect(0,bottom-feather,w,feather+1)}
  arrivalCanvas.style.display='block';arrivalCanvas.style.opacity='1';video.style.opacity='0';
 }
 function resetDeparture(){
  openingAlignment?.destroy();openingAlignment=null;
  departureRingAppearance=null;
  if(arrivalCanvas)arrivalCanvas.style.display='none';
  if(departureCanvas)departureCanvas.style.display='none';
  for(const {el,saved} of cameraLayers)for(const [key,value,priority] of saved){if(value)el.style.setProperty(key,value,priority);else el.style.removeProperty(key)}
  cameraLayers=[];departureFrame=null;registeredFrame=-1;registeredGate=null;
 }
 function cancel(){runId++;seekId++;cancelAnimationFrame(raf);raf=0;video.pause();menuOrbit?.reset();arrivalAnimations.forEach(a=>a.cancel());arrivalAnimations=[];if(arrivalShade)arrivalShade.style.opacity='0'}
 function resetAll(){cancel();resetDeparture();restingPose?.clear();restingPose=null;state='idle';time=0;play.textContent='Play sequence';video.classList.remove('active');video.style.opacity=0;article.classList.remove('active');article.inert=true;article.setAttribute('aria-hidden','true');scene.inert=false;document.body.classList.remove('in-flight','at-article');if(videoReady)video.currentTime=0;if(sceneReady){exterior(0);scene.contentWindow.flightMockup.seek(0);if(openingLead)restingPose=window.createQuickstartRestingPose(scene,openingLead);idleRings(true);}if(articleReady){article.contentDocument.documentElement.style.setProperty('--arrival-background','0');article.contentDocument.documentElement.style.setProperty('--arrival-title','0');article.contentDocument.documentElement.style.setProperty('--arrival-content','0');article.contentWindow.scrollTo(0,0)}scrub.value=0;ready()}
 function showArticle(progress,contentProgress,titleProgress){
  article.classList.add('active');article.inert=progress<1;article.setAttribute('aria-hidden',String(progress<1));
  if(articleReady){
   const root=article.contentDocument.documentElement;
   const content=contentProgress===undefined?smooth((progress-.12)/.88):contentProgress;
   root.style.setProperty('--arrival-content',content);
   root.style.setProperty('--arrival-title',titleProgress===undefined?content:titleProgress);
   if(galaxyArrival)root.style.setProperty('--arrival-background',smooth(progress));
  }
  const framed=arrivalCanvas?.style.display==='block',alpha=galaxyArrival?1:1-smooth(progress);
  video.style.opacity=framed?'0':String(alpha);if(arrivalCanvas)arrivalCanvas.style.opacity=String(alpha);
  if(progress>=1){state='article';document.body.classList.add('at-article');video.classList.remove('active');if(arrivalCanvas)arrivalCanvas.style.display='none';video.pause();status.textContent='Quickstart article';play.textContent='Replay sequence'}
 }
 function revealArticle(){cancel();resetDeparture();state='arriving';scene.inert=true;document.body.classList.add('in-flight');if(window.cutscenesEnabled?.()===false){
   const id=runId,root=articleReady?article.contentDocument.documentElement:null;
   const titleFrom=clamp(Number(root?.style.getPropertyValue('--arrival-title'))||0),contentFrom=clamp(Number(root?.style.getPropertyValue('--arrival-content'))||0);
   const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
   showArticle(1,reduced?1:contentFrom,reduced?1:titleFrom);
   if(reduced)return;
   let began=null;
   const revealText=now=>{if(id!==runId)return;if(!articleReady){raf=requestAnimationFrame(revealText);return}if(began===null)began=now;
    const elapsed=now-began,title=clamp(titleFrom+elapsed/1150),copy=contentFrom+(1-contentFrom)*smooth((elapsed-(contentFrom>0?0:Math.max(0,570-titleFrom*1150)))/1000);
    showArticle(1,copy,title);if(title<1||copy<1)raf=requestAnimationFrame(revealText);
   };raf=requestAnimationFrame(revealText);return;
  }const id=runId,start=performance.now();const step=now=>{if(id!==runId)return;showArticle(smooth((now-start)/650));if(state!=='article')raf=requestAnimationFrame(step)};raf=requestAnimationFrame(step)}
 function renderVideo(){time=videoOffset+video.currentTime;scrub.value=time;
  if(firstPerson)renderDeparture(video.currentTime);
  if(galaxyArrival)renderArrivalFraming(video.currentTime);
  // Blend the settled cloud ending into the matching guide hero. Legacy clips fade through black.
  const fadeStart=duration()-(firstPerson?.45:.9),p=clamp((video.currentTime-fadeStart)/(firstPerson?.4:.85));
  const titleProgress=galaxyArrival?clamp((video.currentTime-4.03)/1.15):0;
  const textProgress=galaxyArrival?smooth((video.currentTime-4.60)/1.0):0;
  if(p>0||titleProgress>0)showArticle(p,galaxyArrival?textProgress:undefined,galaxyArrival?titleProgress:undefined);else{if(!firstPerson)video.style.opacity=smooth(video.currentTime/.1);if(video.currentTime<.14)matchRocket(introDuration+Math.floor((video.currentTime+.0001)*24)/24);status.textContent=galaxyArrival?(video.currentTime<2.8?'Approaching the gate…':video.currentTime<3.5?'Through the gate, past the Moon…':video.currentTime<4.85?'Into hyperspace…':'Arriving at the guide…'):(video.currentTime<(firstPerson?3.3:2.4)?'Approaching the gate…':video.currentTime<(firstPerson?4.1:4.5)?'Through the gate, past the Moon…':'Into hyperspace…')}
 }
 async function start(){if(!cockpitReady())return;if(window.cutscenesEnabled?.()===false){revealArticle();return;}
  // Accept an early click, but finish the entrance before departure to avoid snapping home.
  if(state==='entering'){const arrivalId=runId;try{await Promise.all(arrivalAnimations.map(a=>a.finished))}catch{return}if(arrivalId!==runId)return}
  const ringAppearance=openingLead&&state==='idle'?[...scene.contentDocument.querySelectorAll('.ring-rest,.ring-powered')].map(el=>({el,opacity:scene.contentWindow.getComputedStyle(el).opacity})):null;
  resetAll();departureRingAppearance=ringAppearance;if(matchMedia('(prefers-reduced-motion: reduce)').matches||failed){revealArticle();return}state='loading';const id=runId;status.textContent='Preparing the sequence…';const timeout=performance.now()+12000;while(!videoReady&&performance.now()<timeout&&!failed){await new Promise(r=>setTimeout(r,60));if(id!==runId)return}if(id!==runId)return;if(!videoReady){revealArticle();return}
  if(video.seeking)await new Promise(resolve=>video.addEventListener('seeked',resolve,{once:true}));if(id!==runId)return;
  if(firstPerson){
   prepareDeparture();idleRings(false);scene.inert=true;document.body.classList.add('in-flight');state='video';video.classList.add('active');video.style.opacity='0';
   const beginVideo=async()=>{try{state='video';
    await video.play();if(id!==runId)return;const loop=()=>{if(id!==runId||state==='article')return;renderVideo();raf=requestAnimationFrame(loop)};loop()}catch{if(id===runId)revealArticle()}};
   if(openingLead){state='intro';status.textContent='Leaving the cockpit…';const begin=performance.now();const tick=now=>{if(id!==runId)return;time=Math.min(openingLead,(now-begin)/1000);scrub.value=time;renderAlignedDeparture(0,time);if(time<openingLead)raf=requestAnimationFrame(tick);else beginVideo()};raf=requestAnimationFrame(tick)}else await beginVideo();
   return;
  }
  state='intro';idleRings(false);scene.inert=true;document.body.classList.add('in-flight');const begin=performance.now();status.textContent='Leaving the cockpit…';
  const tick=now=>{if(id!==runId)return;time=Math.min(introDuration,(now-begin)/1000);scrub.value=time;exterior(time);if(time<introDuration){raf=requestAnimationFrame(tick);return}state='video';video.classList.add('active');video.style.opacity=0;video.play().then(()=>{if(id!==runId){video.pause();return}const loop=()=>{if(id!==runId||state==='article')return;renderVideo();raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop)}).catch(()=>{if(id===runId)revealArticle()})};raf=requestAnimationFrame(tick);
 }
 video.addEventListener('ended',()=>{if(state==='video'||state==='arriving')showArticle(1)});
 let seekId=0;
 async function seek(t){cancel();const id=++seekId;time=t;scrub.value=t;document.body.classList.remove('at-article');article.classList.remove('active');article.inert=true;article.setAttribute('aria-hidden','true');if(t<videoOffset){state='paused';document.body.classList.toggle('in-flight',t>0);video.classList.toggle('active',!!openingLead&&t>0);if(openingLead){prepareDeparture();idleRings(false);scene.inert=t>0;renderAlignedDeparture(0,t)}else exterior(t);return}if(!videoReady)return;state='paused';scene.inert=true;document.body.classList.toggle('in-flight',t>0);if(firstPerson){prepareDeparture();idleRings(false)}else exterior(introDuration);video.classList.add('active');const target=Math.max(0,Math.min(duration()-.001,t-videoOffset+.0001));if(Math.abs(video.currentTime-target)>.005)await new Promise(r=>{video.addEventListener('seeked',r,{once:true});video.currentTime=target});if(id!==seekId)return;renderVideo();if(t>=ending()-.06)showArticle(1)}
 play.addEventListener('click',start);reset.addEventListener('click',resetAll);skip.addEventListener('click',revealArticle);scrub.addEventListener('input',()=>seek(Number(scrub.value)));addEventListener('keydown',e=>{if(e.key==='Escape'&&state!=='idle'&&state!=='article')revealArticle()});
 addEventListener('pagehide',()=>{cancel();if(blobUrl)URL.revokeObjectURL(blobUrl)});
 document.getElementById('back-to-cockpit')?.addEventListener('click',()=>arriveCockpit(true));
 window.quickstartVideo={play:start,reset:resetAll,seek,skip:revealArticle,
  get canReveal(){return cockpitReady()},
  prepareLaunchArrival(){if(!cockpitReady())return false;hostedLaunch=true;fromLaunch=true;arrivalShade.style.backgroundColor='#000';arrivalShade.style.opacity='1';return true},
  revealLaunchArrival(){if(!cockpitReady())return false;hostedLaunch=true;fromLaunch=true;arriveCockpit();return true},
  get ready(){return sceneReady&&videoReady&&articleReady&&state!=='entering'},get state(){return state},get time(){return time}};
})();
