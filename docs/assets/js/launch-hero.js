const hero=document.getElementById('launchpad');
const stage=document.querySelector('.approved-stage'),mobileScene=document.querySelector('.mobile-launch');
const canvas=document.getElementById('night-sky'),ctx=canvas.getContext('2d');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const portraitLayout=matchMedia('(max-width: 800px), (max-aspect-ratio: 6/5)');
let frame=0,last=0,time=0,width=1,height=1,mobile=false,headerHeight=60;
let nextMeteor=5,meteor=null;
let seed=5917;const random=()=>{seed=seed*16807%2147483647;return(seed-1)/2147483646;};
const stars=Array.from({length:90},()=>({x:random(),y:random(),r:.4+random()*.7,phase:random()*6.28,speed:.3+random()*.5}));
function resize(){
 width=hero.clientWidth;height=hero.clientHeight;mobile=portraitLayout.matches;headerHeight=document.getElementById('header').getBoundingClientRect().height;

 if(mobile){
  const start=Math.max(headerHeight+60,height*.22);
  const available=Math.max(180,height-start-25),sh=Math.min(width*.35,available*.34),sw=Math.min(width,sh/.35),rh=available-sh,rw=Math.min(width,rh/1.05);
  Object.assign(stage.style,{width:sw+'px',height:sh+'px',left:(width-sw)/2+'px',top:start+'px'});
  stage.style.setProperty('--stage-width',sw+'px');
  const sceneHeight=Math.min(rh,rw*.94);
  Object.assign(mobileScene.style,{width:rw+'px',height:sceneHeight+'px',left:(width-rw)/2+'px',top:(height-25-sceneHeight)+'px'});
  mobileScene.style.setProperty('--rocket-width',rw+'px');
  mobileScene.style.setProperty('--scene-scale',String(rw*2.7/1536));
 }else{
  const scale=Math.max(width/1536,height/1024),w=1536*scale,h=1024*scale;
  Object.assign(stage.style,{width:w+'px',height:h+'px',left:(width-w)/2+'px',top:(height-h)+'px'});
  stage.style.setProperty('--scene-scale',String(scale));
 }
 const ratio=Math.min(devicePixelRatio,1.5);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);ctx?.setTransform(ratio,0,0,ratio,0,0);draw();schedule();
}
function draw(){
 if(!ctx)return;ctx.clearRect(0,0,width,height);
 const top=headerHeight+8,skyHeight=mobile?Math.max(20,stage.offsetTop-top):Math.max(70,height*.39-top);
 // Desktop stars are registered to the launch film in the sky plate.
 // Keep the separate decorative star field for the mobile composition only.
 stars.slice(0,mobile?18:0).forEach(s=>{
  const alpha=.25+(.5+.5*Math.sin(time*s.speed+s.phase))*.5;
   ctx.fillStyle=`rgba(215,232,255,${alpha})`;ctx.beginPath();ctx.arc(s.x*width,top+s.y*skyHeight,s.r,0,Math.PI*2);ctx.fill();
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


