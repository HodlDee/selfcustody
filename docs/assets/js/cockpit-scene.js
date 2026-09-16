(() => {
 const stage=document.querySelector('.cockpit-composition');stage.classList.add('flight-study');
 const gate=stage.querySelector('.choice-quickstart');
 const cabins=[...stage.querySelectorAll('.cabin-art,.cabin-mobile-art,.selection-copy')];
 const rocket=document.createElement('div');rocket.className='flight-rocket';rocket.innerHTML='<span class="flight-exhaust"></span><img src="assets/img/space-hub/rocket-flight-empty-v3.webp" alt="">';stage.append(rocket);
 const rocketLayer=document.createElement('div');rocketLayer.className='flight-rocket-layer';stage.append(rocketLayer);rocketLayer.append(rocket);
 const ns='http://www.w3.org/2000/svg',overlay=document.createElementNS(ns,'svg');overlay.classList.add('flight-overlay');overlay.innerHTML='<defs><radialGradient id="flight-flash-gradient"><stop stop-color="#fff9df" stop-opacity=".9"/><stop offset=".2" stop-color="#ffd073" stop-opacity=".65"/><stop offset="1" stop-color="#ff8b22" stop-opacity="0"/></radialGradient></defs><path class="flight-guide"/><path class="flight-trail flight-trail-soft"/><path class="flight-trail flight-trail-core"/><ellipse class="flight-flash"/>';stage.append(overlay);
 const article=document.createElement('iframe');article.className='flight-article';article.title='Quickstart article preview';article.inert=true;article.setAttribute('aria-hidden','true');
 const warp=document.createElement('div');warp.className='flight-warp';warp.setAttribute('aria-hidden','true');warp.innerHTML='<canvas class="warp-speed-lines"></canvas><div class="warp-follow-rocket"><span class="flight-exhaust"></span><img src="assets/img/space-hub/rocket-flight-empty-v3.webp" alt=""></div>';
 document.body.append(article,warp);
 const blink=document.createElement('div');blink.className='rocket-jump-blink';warp.append(blink);
 const speedCanvas=warp.querySelector('canvas'),speedContext=speedCanvas.getContext('2d'),followRocket=warp.querySelector('.warp-follow-rocket');
 const followLayer=document.createElement('div');followLayer.className='warp-follow-layer';warp.append(followLayer);followLayer.append(followRocket);
 const scenery=[{el:gate,depth:1.25},{el:stage.querySelector('.selection-earth'),depth:1.8},{el:stage.querySelector('.selection-moon'),depth:.7}];
 const speedStars=Array.from({length:120},(_,i)=>({x:((i*73.731)%101)/101,y:((i*37.137)%103)/103,depth:.25+((i*17)%71)/71,tint:i%5===0?'#ffbd71':i%3===0?'#74c9ff':'#d5edff'}));
 const underlying=[...document.body.children].filter(e=>e!==article&&e!==warp&&!e.classList.contains('flight-controls')&&e.tagName!=='SCRIPT');
 let articleReady=false,articleVisible=false;
 article.addEventListener('load',async()=>{try{const doc=article.contentDocument;const skin=doc.createElement('link');skin.rel='stylesheet';skin.href='../assets/css/quickstart-arrival.css?v=4';await new Promise(resolve=>{skin.onload=resolve;skin.onerror=resolve;doc.head.append(skin)});doc.documentElement.style.setProperty('--arrival-content','0');await Promise.race([article.contentDocument.fonts.ready,new Promise(resolve=>setTimeout(resolve,1000))]);articleReady=!!article.contentDocument.querySelector('main,h1');if(articleReady)render(new URLSearchParams(location.search).has('article-preview')?timing.end:clock)}catch{} });
 article.src='guides/quickstart.html';
 const scrub=document.getElementById('flight-scrub'),phase=document.getElementById('flight-phase'),caption=document.getElementById('flight-caption'),play=document.getElementById('flight-play');
 let clock=0,raf=0,started=0,geometry;
 const clamp=v=>Math.max(0,Math.min(1,v)),smooth=v=>{v=clamp(v);return v*v*(3-2*v)};
 const timing={start:1,gate:3.05,exit:3.22,jump:3.22,article:4.8,end:5.85};
 const bez=(p,u)=>{const v=1-u;return{x:v*v*v*p[0].x+3*v*v*u*p[1].x+3*v*u*u*p[2].x+u*u*u*p[3].x,y:v*v*v*p[0].y+3*v*v*u*p[1].y+3*v*u*u*p[2].y+u*u*u*p[3].y}};
 const d=p=>`M${p[0].x},${p[0].y} C${p[1].x},${p[1].y} ${p[2].x},${p[2].y} ${p[3].x},${p[3].y}`;
 function measure(){
  const saved=scenery.map(({el})=>({el,translate:el.style.translate,scale:el.style.scale}));saved.forEach(({el})=>{el.style.translate='0 0';el.style.scale='1'});
  const s=stage.getBoundingClientRect(),g=gate.querySelector('.quickstart-station').getBoundingClientRect();
  const at=(x,y)=>({x:g.left-s.left+g.width*x/1536,y:g.top-s.top+g.height*y/1024});
  const front=at(730,338),inside=at(844,318),exit=at(1070,265);
  const approachSlope=(front.y-exit.y)/(exit.x-front.x),approachReach=innerWidth*450/1920;
  const approach=[{x:-innerWidth*70/1920-s.left,y:innerHeight*1000/1080-s.top},{x:innerWidth*300/1920-s.left,y:innerHeight*735/1080-s.top},{x:front.x-approachReach,y:front.y+approachReach*approachSlope},front];
  const moonRect=stage.querySelector('.selection-moon').getBoundingClientRect();
  const moonX=moonRect.left+moonRect.width*.497,moonY=moonRect.top+moonRect.height*.471,moonRadius=moonRect.width*.354;
  const flybyX=Math.max(120,moonX+moonRadius*1.3-(s.left+exit.x));
  const slope=approachSlope;
  const flybyDistance=Math.hypot(flybyX,flybyX*slope),backward={x:-1/Math.hypot(1,slope),y:slope/Math.hypot(1,slope)},flightHeading=90-Math.atan(slope)*180/Math.PI;
  const jumpEnd={x:s.width+180,y:exit.y-(s.width+180-exit.x)*slope};
  const jumpPath=`M${exit.x},${exit.y} L${jumpEnd.x},${jumpEnd.y}`;
  const tunnelReach=innerWidth*60/1920;
  const tunnel=[front,{x:front.x+tunnelReach,y:front.y-tunnelReach*approachSlope},{x:exit.x-tunnelReach,y:exit.y+tunnelReach*slope},exit];
  const cabinDistance=Math.max(...cabins.map(c=>c.offsetLeft+c.offsetWidth))+40;
  geometry={w:s.width,h:s.height,front,inside,exit,approach,tunnel,cabinDistance,flybyDistance,backward,flightHeading,gateRect:{x:g.left,y:g.top,w:g.width,h:g.height},stageOffset:{x:s.left,y:s.top},screenExit:{x:s.left+exit.x,y:s.top+exit.y}};overlay.setAttribute('viewBox',`0 0 ${s.width} ${s.height}`);
  const pixelRatio=Math.min(devicePixelRatio,2);speedCanvas.width=innerWidth*pixelRatio;speedCanvas.height=innerHeight*pixelRatio;speedContext.setTransform(pixelRatio,0,0,pixelRatio,0,0);
  overlay.querySelector('.flight-guide').setAttribute('d',d(approach)+d(tunnel)+jumpPath);
  for(const line of overlay.querySelectorAll('.flight-trail'))line.setAttribute('d',jumpPath);
  const flash=overlay.querySelector('.flight-flash');flash.setAttribute('cx',front.x);flash.setAttribute('cy',front.y);flash.setAttribute('rx',g.width*.10);flash.setAttribute('ry',g.height*.23);
  saved.forEach(({el,translate,scale})=>{el.style.translate=translate;el.style.scale=scale});render(clock);
 }
 function render(t){
  clock=t;scrub.value=t;if(!geometry)return;const g=geometry,{backward,flightHeading}=g;
  // One camera offset shared by the stationary world and the travelling rocket.
  // Briefly hold the outward view, then track right as the rocket arrives.
  const panProgress=clamp((t-1.25)/1.6);
  const panEase=panProgress**3*(panProgress*(panProgress*6-15)+10);
  const cameraDrift=-Math.min(innerWidth*.0075,15)*smooth((t-.08)/1.1);
  const ambientDrift=Math.min(innerWidth*.015,30)*.75*smooth((t-.08)/1.1)*(1-panEase);
  const cabinProgress=smooth((t-.08)/1.4);for(const cabin of cabins){cabin.style.translate=`${-g.cabinDistance*cabinProgress}px 0`;cabin.style.opacity=1}
  
  [...gate.querySelectorAll('.ring-light')].forEach((ring,i)=>{ring.style.setProperty('--gate-activation',smooth((t-i*.13)/.18));ring.style.setProperty('--ring-energy',.5+.5*Math.sin(t*9-i*.8))});
  const approachTime=clamp((t-timing.start)/(timing.gate-timing.start)),u=.12*approachTime+.88*(1-Math.pow(1-approachTime,1.7)),p=bez(g.approach,u),q=bez(g.approach,Math.min(1,u+.002));
  let angle=90+Math.atan2(q.y-p.y,q.x-p.x)*180/Math.PI,scale=.95-.35*u;
  let x=p.x,y=p.y,alpha=t<timing.exit?smooth((t-timing.start)/.12):0;
  if(t>=timing.gate){
   const enter=clamp((t-timing.gate)/(timing.exit-timing.gate)),tunnel=g.tunnel;
   const point=bez(tunnel,enter),before=bez(tunnel,Math.max(0,enter-.002)),after=bez(tunnel,Math.min(1,enter+.002));
   x=point.x;y=point.y;angle=90+Math.atan2(after.y-before.y,after.x-before.x)*180/Math.PI;scale=.6+.02*enter;
  }
  rocket.style.transform=`translate(${x-65+cameraDrift}px,${y-95}px) rotate(${angle}deg) scale(${scale})`;rocket.style.opacity=alpha;
  const activation=smooth((t-timing.exit)/.055)*(1-smooth((t-timing.exit-.1)/.2));
  const gatePulse=overlay.querySelector('.flight-flash');gatePulse.setAttribute('cx',g.exit.x+cameraDrift);gatePulse.setAttribute('cy',g.exit.y);gatePulse.setAttribute('rx',g.gateRect.w*.022);gatePulse.setAttribute('ry',g.gateRect.h*.075);gatePulse.style.opacity=activation*.5;
  for(const line of overlay.querySelectorAll('.flight-trail'))line.style.opacity=0;
  const elapsed=Math.max(0,t-timing.exit),flyby=smooth(elapsed/.35),chase=clamp((t-timing.jump)/.8),rush=chase*chase,clear=smooth((t-timing.article)/.65);
  // The world stops with the settled camera. Only the rocket and light trails travel.
  const departureCamera=clamp(elapsed/.58);
  const sceneryTravel=Math.hypot(innerWidth,innerHeight)*3*departureCamera*departureCamera;
  for(const {el,depth} of scenery){const travel=sceneryTravel*depth,parallax=el===gate?1:el.classList.contains('selection-earth')?.55:.25;el.style.translate=travel||cameraDrift?`${travel*backward.x+(el===gate?cameraDrift:ambientDrift*parallax)}px ${travel*backward.y}px`:'';el.style.filter=elapsed>0?`blur(${smooth(elapsed/.5)*depth*2}px)`:""}
  // Moon flyby: approach the camera in depth instead of sliding across the screen.
  const moon=stage.querySelector('.selection-moon'),moonApproach=clamp(elapsed/.6),moonDepth=moonApproach*moonApproach;
  moon.style.translate=`${ambientDrift*.25-innerWidth*.44*smooth(elapsed/.38)}px ${innerHeight*.10*moonDepth}px`;
  moon.style.scale=1+5*moonDepth;
  moon.style.opacity=1-smooth((elapsed-.40)/.20);
  moon.style.filter=elapsed>0?`blur(${moonDepth*1.8}px)`:'';
  // The opaque near-side wall hides the rocket physically; opacity stays solid.
  const wall=[[858,232],[877,280],[887,330],[885,380],[866,434],[836,481],[977,503],[1040,446],[1076,374],[1084,301],[1072,230],[1039,159],[956,105],[856,90]];
  const wallClip=(ox,oy,width,height)=>{const points=wall.map(([px,py])=>`${g.gateRect.x-ox+px*g.gateRect.w/1536+sceneryTravel*backward.x*1.25+cameraDrift},${g.gateRect.y-oy+py*g.gateRect.h/1024+sceneryTravel*backward.y*1.25}`);return `path(evenodd, "M-500,-500 H${width+500} V${height+500} H-500 Z M${points.join(' L')} Z")`};
  rocketLayer.style.clipPath=wallClip(g.stageOffset.x,g.stageOffset.y,g.w,g.h);
  followLayer.style.clipPath=wallClip(0,0,innerWidth,innerHeight);
  overlay.querySelector('.flight-guide').style.transform=`translateX(${cameraDrift}px)`;
  stage.querySelector('.selection-stars').style.backgroundPosition=`${sceneryTravel*backward.x*.4+ambientDrift*.1}px ${sceneryTravel*backward.y*.4}px`;
  warp.style.opacity=t>=timing.exit&&t<timing.article+.65?1-clear:0;
  const ctx=speedContext,w=innerWidth,h=innerHeight;
  ctx.clearRect(0,0,w,h);ctx.fillStyle=`rgba(10,13,17,${smooth((t-timing.jump-.42)/.22)})`;ctx.fillRect(0,0,w,h);
  const jumpElapsed=Math.max(0,t-timing.jump),brake=clamp((jumpElapsed-.75)/.7),coast=Math.min(jumpElapsed,.75);
  // Integrate the slowing speed so the stars stop travelling as well as shortening.
  const distance=coast*.8+coast*coast*.85+(jumpElapsed>.75?2.075*.7*(brake-brake**3+.5*brake**4):0);
  const speed=smooth((jumpElapsed-.12)/.5)*(1-smooth(brake)),spanX=w*1.8,spanY=h*1.8;
  // Perspective trails expand from the flight direction toward and past the viewer.
  const vanishingX=w*.70,vanishingY=h*.34,reach=Math.hypot(w,h)*1.3;
  for(const star of speedStars){
   const angle=star.x*Math.PI*2,dx=Math.cos(angle),dy=Math.sin(angle);
   const phase=(star.y+distance*(.22+star.depth*.17))%1;
   const radius=(.025+phase*phase)*reach;
   const length=Math.min(radius*.83,(40+star.depth*540)*speed*(.15+phase));
   const sx=vanishingX+dx*radius,sy=vanishingY+dy*radius;
   const tx=sx-dx*length,ty=sy-dy*length;
   const glow=ctx.createLinearGradient(tx,ty,sx,sy);glow.addColorStop(0,'transparent');glow.addColorStop(.58,star.tint);glow.addColorStop(.96,'#f1fbff');glow.addColorStop(1,'transparent');
   ctx.globalAlpha=speed*(.18+star.depth*.7)*smooth(phase/.12)*(1-smooth((phase-.88)/.12));ctx.strokeStyle=glow;ctx.lineWidth=.65+star.depth*2.4;ctx.shadowColor=star.tint;ctx.shadowBlur=star.depth>.8?9:0;
   ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(sx,sy);ctx.stroke();
  }
  ctx.shadowBlur=0;
  ctx.globalAlpha=1;
  // A short camera catch-up, then the rocket pulls away and blinks out.
  const departure=clamp((t-timing.exit)/.72),follow=smooth((t-timing.exit)/.4);
  const fx=g.screenExit.x+cameraDrift+(w*.69-g.screenExit.x-cameraDrift)*follow+w*.08*departure*departure;
  const fy=g.screenExit.y+(h*.29-g.screenExit.y)*follow-w*.08*departure*departure*(-backward.y/backward.x);
  const rocketScale=.62*(1-.93*Math.pow(departure,2.5));
  followRocket.style.transform=`translate(${fx-65}px,${fy-95}px) rotate(${flightHeading}deg) scale(${rocketScale})`;
  followRocket.style.opacity=t>=timing.exit&&departure<1?1:0;
  const blinkAge=t-(timing.exit+.72),blinkPower=blinkAge>=0&&blinkAge<.12?Math.sin(Math.PI*blinkAge/.12):0;
  blink.style.left=fx+'px';blink.style.top=fy+'px';blink.style.opacity=blinkPower;
  blink.style.transform=`translate(-50%,-50%) rotate(-${90-flightHeading}deg) scale(${.7+blinkPower*.5})`;
  if(articleReady)article.contentDocument.documentElement.style.setProperty('--arrival-content',smooth((t-timing.article-.1)/.75));
  const showArticle=t>=timing.article;
  if(showArticle!==articleVisible){articleVisible=showArticle;article.classList.toggle('is-visible',showArticle);article.inert=!showArticle;article.setAttribute('aria-hidden',String(!showArticle));underlying.forEach(e=>e.inert=showArticle);if(!showArticle){try{article.contentWindow.scrollTo(0,0)}catch{}}}
  const state=t<.1?['Ready to jump','Quick follow draft. Click Quickstart or Play.']:t<1.35?['01 · Leave the cockpit','Quickstart drifts slightly left while the cockpit exits.']:t<timing.exit?['02 · Approach the gate','Original ring colours and runway lights stay intact.']:t<timing.exit+.72?['03 · Rocket departs','A brief camera follow; the Moon and gate clear before full hyperspace.']:t<timing.article?['Hyperspace slows to a stop','The streaks slow and fade into near-black before the article appears.']:t<timing.article+.65?['04 · Reveal the article','The moving hyperspace tail dissolves into Quickstart.']:['Quickstart handoff','Reset to review the quick-follow draft again.'];
  phase.textContent=state[0];caption.textContent=state[1];
 }
 function stop(){cancelAnimationFrame(raf);raf=0;play.textContent='Play sequence'}
 function tick(now){const next=(now-started)/1000;if(next>=timing.article&&!articleReady&&next<12){render(timing.article-.01);caption.textContent='Preparing the Quickstart article…';raf=requestAnimationFrame(tick);return}if(clock===timing.article-.01&&articleReady)started=now-timing.article*1000;render(Math.min(timing.end,(now-started)/1000));if(clock<timing.end)raf=requestAnimationFrame(tick);else stop()}
 function run(){stop();render(0);if(matchMedia('(prefers-reduced-motion: reduce)').matches){render(timing.end);return}started=performance.now();play.textContent='Replay';raf=requestAnimationFrame(tick)}
 play.addEventListener('click',run);gate.addEventListener('click',run);document.getElementById('flight-reset').addEventListener('click',()=>{stop();render(0)});
 scrub.addEventListener('input',()=>{stop();render(Number(scrub.value))});for(const button of document.querySelectorAll('[data-time]'))button.addEventListener('click',()=>{stop();render(Number(button.dataset.time))});
 document.getElementById('flight-path-toggle').addEventListener('change',e=>stage.classList.toggle('show-flight-path',e.target.checked));
 stage.querySelector('.hub-directory').addEventListener('click',e=>e.preventDefault());
 new ResizeObserver(measure).observe(stage);Promise.all([...stage.querySelectorAll('img')].map(i=>i.decode().catch(()=>{}))).then(measure);
 window.flightMockup={seek:t=>{stop();render(t)},play:run,get articleReady(){return articleReady}};
})();














