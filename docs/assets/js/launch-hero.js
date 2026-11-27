const hero=document.getElementById('launchpad');
const stage=document.querySelector('.approved-stage'),mobileScene=document.querySelector('.mobile-launch');
const launchTitle=document.querySelector('.mobile-launch-title');
const canvas=document.getElementById('night-sky'),ctx=canvas.getContext('2d');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const portraitLayout=matchMedia('(max-width:1199px) and (max-aspect-ratio:6/5)');
let frame=0,last=0,time=0,width=1,height=1,mobile=false,headerHeight=60,tabletSkyBottom=0;
let nextMeteor=5,meteor=null;
let seed=5917;const random=()=>{seed=seed*16807%2147483647;return(seed-1)/2147483646;};
const stars=Array.from({length:90},()=>({x:random(),y:random(),r:.4+random()*.7,phase:random()*6.28,speed:.3+random()*.5}));
function resize(){
 width=hero.clientWidth;height=hero.clientHeight;mobile=portraitLayout.matches;headerHeight=document.getElementById('header').getBoundingClientRect().bottom;

 if(mobile){
  const compactTablet=width>600&&height<=850;
  const safeBottom=parseFloat(getComputedStyle(hero).getPropertyValue('--launch-safe-bottom'))||0;
  const compactPhone=width<=600&&height-(headerHeight-70)-safeBottom<=750;
  launchTitle.style.top=(headerHeight+(width>600?(compactTablet?32:36):compactPhone?13:23))+'px';
  if(width>600){
   // Fit source rows 505..950 (nose through launchpad) below the welcome copy.
   const copyBottom=launchTitle.offsetTop+launchTitle.offsetHeight;
   const subjectTop=copyBottom+(compactTablet?16:64),subjectBottom=height-(compactTablet?48:64);
   // The art extends 484 source pixels to the right of the centered rocket.
   // Keep that edge beyond the viewport even when height limits the subject fit.
   const scale=Math.max(width/968,Math.min((subjectBottom-subjectTop)/445,width*2.6/1536));
   const rocketTop=subjectTop+(subjectBottom-subjectTop-445*scale)/2;
   tabletSkyBottom=rocketTop;
   const windowTop=copyBottom+8;
   Object.assign(mobileScene.style,{width:width+'px',height:(height-windowTop)+'px',left:'0px',top:windowTop+'px'});
   mobileScene.style.setProperty('--tablet-art-width',(1536*scale)+'px');
   mobileScene.style.setProperty('--tablet-art-left',(width/2-1052*scale)+'px');
   mobileScene.style.setProperty('--tablet-art-top',(rocketTop-505*scale-windowTop)+'px');
   mobileScene.style.setProperty('--scene-scale',String(scale));
  }else{
   // Fit the nose and pad between the caption and the bottom controls.
   const captionBottom=launchTitle.offsetTop+launchTitle.offsetHeight;
   const subjectTop=captionBottom+24,subjectBottom=height-safeBottom-28;
   const scale=Math.min(width/405,Math.max(1,subjectBottom-subjectTop)/445);
   const rocketTop=subjectTop+(subjectBottom-subjectTop-445*scale)*.65;
   const rw=1536*scale/2.7,headroom=80;
   const sceneTop=rocketTop-505*scale+rw*.873-headroom;
   const sceneHeight=height-sceneTop;
   mobileScene.style.setProperty('--phone-art-headroom',headroom+'px');
   Object.assign(mobileScene.style,{width:rw+'px',height:sceneHeight+'px',left:(width-rw)/2+'px',top:sceneTop+'px'});
   mobileScene.style.setProperty('--rocket-width',rw+'px');
   mobileScene.style.setProperty('--scene-scale',String(rw*2.7/1536));
  }
 }else{
  // Zoom the tablet scene around the sign lettering and rocket together.
  const tabletPortrait=width>600&&width<1200&&width/height<=1.2;
  const laptop=width>=901&&width<1600&&width/height>1.2;
  // Cover the 16:9 movie crop from the start, not just the taller source still.
  const scale=tabletPortrait?width*1.5/1536:Math.max(width/1536,height/(laptop?864:1024)),w=1536*scale,h=1024*scale;
  const centeredLeft=(width-w)/2;
  // Aim slightly farther right on laptops while retaining the sign's left support.
  let left=tabletPortrait?width/2-677*scale+10:width>=901&&width<1600?Math.max(width-w,Math.min(0,Math.max(centeredLeft,-80*scale)-(width>=1200?-15:35))):centeredLeft;
  if(laptop&&width<1200){
   // Reserve room for the 280px caption by moving its subject with it.
   left=Math.max(width-w,Math.min(left,width-156-1052*scale));
  }
  // Reserve a real caption lane on short landscape screens, keeping the nose below it.
  const shortLandscape=width<=1100&&height<=500&&width>height;
  const captionClearance=shortLandscape?Math.max(0,64+launchTitle.offsetHeight+20-(height-h+505*scale)):0;
  Object.assign(stage.style,{width:w+'px',height:h+'px',left:left+'px',top:(height-h+captionClearance)+'px'});
  stage.style.setProperty('--scene-scale',String(scale));
  launchTitle.style.setProperty('--launch-copy-x',(left+1052*scale)+'px');
  launchTitle.style.setProperty('--launch-copy-top',(height-h+505*scale-35)+'px');
 }
 const ratio=Math.min(devicePixelRatio,1.5);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);ctx?.setTransform(ratio,0,0,ratio,0,0);draw();schedule();
}
function draw(){
 if(!ctx)return;ctx.clearRect(0,0,width,height);
 const tablet=mobile&&width>600;
 const top=headerHeight+8,skyHeight=tablet?Math.max(70,tabletSkyBottom-top):mobile?Math.max(20,launchTitle.offsetTop-top):Math.max(70,Math.max(height*.39,stage.offsetTop)-top);
 // Tablet stars already fill the sky behind the title and welcome copy at rest.
 // Coordinates stay fixed; only their brightness changes gently.
 stars.slice(0,tablet?90:mobile?18:0).forEach(s=>{
  const alpha=(tablet?.35:.25)+(.5+.5*Math.sin(time*s.speed+s.phase))*.5;
   ctx.fillStyle=`rgba(215,232,255,${alpha})`;ctx.beginPath();ctx.arc(s.x*width,top+s.y*skyHeight,s.r*(tablet?1.15:1),0,Math.PI*2);ctx.fill();
 });
 if(meteor){
  const p=(time-meteor.start)/1.25;
  if(p>=1)meteor=null;
  else{
   const x=width*(meteor.x+p*.23),y=top+skyHeight*(.1+p*.5),tail=Math.min(125,width*.1),a=Math.sin(p*Math.PI);
   const glow=ctx.createLinearGradient(x-tail,y-tail*.35,x,y);glow.addColorStop(0,'rgba(196,225,255,0)');glow.addColorStop(1,`rgba(237,246,255,${a})`);
   ctx.strokeStyle=glow;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x-tail,y-tail*.35);ctx.lineTo(x,y);ctx.stroke();
  }
 }
}
function tick(now){
 frame=0;time+=last?Math.min((now-last)/1000,.1):0;last=now;

 if(time>=nextMeteor){meteor={start:time,x:.15+random()*.45};nextMeteor=time+17+random()*14;}
 draw();schedule();
}
function schedule(){if(!frame&&!reduced.matches&&!document.hidden)frame=requestAnimationFrame(tick);}
function syncMotion(){
 const stop=reduced.matches;hero.classList.toggle('motion-off',stop);

 cancelAnimationFrame(frame);frame=0;last=0;if(stop)meteor=null;draw();schedule();
}
 reduced.addEventListener('change',syncMotion);
 document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(frame);frame=0;last=0;schedule();});
 const observer=new ResizeObserver(resize);observer.observe(hero);resize();syncMotion();
 document.fonts.ready.then(resize);
