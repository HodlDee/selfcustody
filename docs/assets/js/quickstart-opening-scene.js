/* Lead-in velocities in source pixels; land gently grows in place, planets travel left. */
window.quickstartOpeningVelocity={
 '.quickstart-station':{x:0,y:0,growth:.155},
 '.selection-moon':{x:-45,y:0,growth:.02},
 '.selection-earth':{x:-75,y:0,growth:.008},
 '.selection-stars':{x:-20,y:0,growth:0}
};
window.createQuickstartRestingPose=function(scene,lead){
 const d=scene.contentDocument,w=scene.contentWindow,s=Math.max(w.innerWidth/1920,w.innerHeight/917),saved=[];
 for(const [selector,v] of Object.entries(window.quickstartOpeningVelocity)){
  const el=d.querySelector(selector),r=el.getBoundingClientRect();if(!r.width)continue;
  saved.push([el,el.getAttribute('style')]);
  const cs=w.getComputedStyle(el),m=new w.DOMMatrix(cs.transform),o=cs.transformOrigin.split(' ').map(parseFloat),parentScale=r.width/(el.offsetWidth*Math.hypot(m.a,m.b))||1;
  const dt=-lead/2;let ratio=1+v.growth*dt;
  let dx=v.x*s*dt+r.width*(1-ratio)/2;
  let dy=v.y*s*dt+r.height*(1-ratio)/2;
  // Set the planets at their handoff height before clicking. Otherwise even
  // a horizontal velocity still interpolates down to the registered frame.
  if(selector==='.selection-moon'||selector==='.selection-earth'){
   const moon=selector==='.selection-moon',targetWidth=(moon?1254*.15333381:2171*.88444176)*s;
   const targetCenterY=((moon?153.831:657.938)-80)*s+targetWidth*r.height/r.width/2;
   dy=targetCenterY-(r.y+r.height/2)+r.height*(1-ratio)/2;
  }
  // Grow the land toward its registered movie size around a fixed center.
  if(selector==='.quickstart-station'){
   const targetWidth=1536*.61846306*s,targetHeight=targetWidth*r.height/r.width;
   const startScale=1+v.growth*dt;
   ratio=targetWidth*startScale/r.width;
   dx=(w.innerWidth-1920*s)/2+945.725*s-r.x+targetWidth*(1-startScale)/2;
   dy=(202.141-80)*s-r.y+targetHeight*(1-startScale)/2;
  }
  const e=m.e+o[0]-m.a*o[0]-m.c*o[1]+dx/parentScale,f=m.f+o[1]-m.b*o[0]-m.d*o[1]+dy/parentScale;
  el.style.transformOrigin='0 0';el.style.setProperty('transform',`matrix(${m.a*ratio},${m.b*ratio},${m.c*ratio},${m.d*ratio},${e},${f})`,'important');
 }
 return {clear(){for(const [el,value] of saved){if(value===null)el.removeAttribute('style');else el.setAttribute('style',value)}}};
};
/* Animate the existing scene using compositor transforms, then reveal native video. */
window.createQuickstartOpeningScene=function(scene,video,lead,firstFrame,ringAppearance){
 const d=scene.contentDocument,w=scene.contentWindow,width=w.innerWidth,height=w.innerHeight;
 const viewport=document.getElementById('scene-viewport'),saved=new Map();
 const remember=el=>{if(!saved.has(el))saved.set(el,el.getAttribute('style'))};
 const clamp=v=>Math.max(0,Math.min(1,v)),smooth=v=>{v=clamp(v);return v*v*v*(v*(v*6-15)+10)},mix=(a,b,p)=>a+(b-a)*p;
 const scale=Math.max(width/1920,height/917),x=(width-1920*scale)/2,y=-80*scale;
 const nativeScale=width<=900?Math.min(width/1920,height/1080):Math.max(width/1920,height/1080);
 const layers=['.quickstart-station','.selection-moon','.selection-earth','.selection-stars'].map(selector=>{
  const el=d.querySelector(selector),r=el.getBoundingClientRect(),cs=w.getComputedStyle(el),m=new w.DOMMatrix(cs.transform),o=cs.transformOrigin.split(' ').map(parseFloat);
  remember(el);
  const parentScale=r.width/(el.offsetWidth*Math.hypot(m.a,m.b))||1;
  return {selector,el,r,m,parentScale,ox:o[0]||0,oy:o[1]||0,opacity:Number(cs.opacity)};
 }).filter(layer=>layer.r.width>0&&layer.r.height>0);
 const cabins=[...d.querySelectorAll('.cabin-art,.cabin-mobile-art,.selection-copy')];
 const distance=Math.max(...cabins.map(c=>c.offsetLeft+c.offsetWidth))+40;
 for(const c of cabins)remember(c);
 // Preserve the appearance at click time even when the hover state goes away.
 for(const {el,opacity} of ringAppearance||[]){remember(el);el.style.setProperty('opacity',opacity,'important')}
 remember(viewport);remember(video);
 const style=d.createElement('style');
 style.textContent='html.quickstart-native-flight,html.quickstart-native-flight body,html.quickstart-native-flight main,html.quickstart-native-flight .selection-stage{background:transparent!important}html.quickstart-native-flight .selection-stars{background-color:transparent!important}html.quickstart-native-flight .quickstart-station,html.quickstart-native-flight .selection-moon,html.quickstart-native-flight .selection-earth,html.quickstart-native-flight .selection-stars{will-change:transform,opacity;transition:none!important}';
 d.head.append(style);
 const backdrop=d.createElement('div');backdrop.setAttribute('aria-hidden','true');backdrop.style.cssText='position:absolute;inset:0;background:#080a0d;z-index:-2;pointer-events:none;will-change:opacity';d.querySelector('.cockpit-composition').prepend(backdrop);
 // Split the decoded still once, so each subject can keep its own path during
 // the dissolve. The entire group fades together to preserve brightness.
 const bridge=d.createElement('div');
 bridge.setAttribute('aria-hidden','true');
 bridge.style.cssText='position:fixed;inset:0;z-index:3;pointer-events:none;opacity:0;will-change:opacity;isolation:isolate;background:#080a0d';
 const plate=()=>{const c=d.createElement('canvas');c.width=1920;c.height=1080;c.style.cssText=`position:absolute;left:${x}px;top:${y}px;width:${1920*scale}px;height:${1080*scale}px;will-change:transform`;return c};
 const sky=plate(),skyContext=sky.getContext('2d');skyContext.drawImage(firstFrame,0,0);bridge.append(sky);
 const patches=new Map(),masks=new Map();
 for(const layer of layers.filter(l=>l.selector!=='.selection-stars')){
  const mask=plate(),ctx=mask.getContext('2d');ctx.fillStyle='#fff';
  if(layer.selector==='.quickstart-station'){
   ctx.setTransform(.61846306,0,0,.61846306,945.725,202.141);
   const path=new Path2D(d.querySelector('.quickstart-hit-area path').getAttribute('d'));ctx.fill(path);ctx.strokeStyle='#fff';ctx.lineWidth=18;ctx.lineJoin='round';ctx.stroke(path);
  }else if(layer.selector==='.selection-moon'){
   ctx.beginPath();ctx.arc(1727,244,77,0,Math.PI*2);ctx.fill();
  }else{
   // Include the whole Earth and its faint atmosphere; the border is in empty sky.
   ctx.beginPath();ctx.moveTo(0,655);ctx.bezierCurveTo(410,500,1080,430,1920,960);ctx.lineTo(1920,1080);ctx.lineTo(0,1080);ctx.closePath();ctx.fill();
   const gateMask=masks.get('.quickstart-station');
   if(gateMask){ctx.globalCompositeOperation='destination-out';ctx.drawImage(gateMask,0,0)}
  }
  const c=plate(),pctx=c.getContext('2d');pctx.drawImage(firstFrame,0,0);pctx.globalCompositeOperation='destination-in';pctx.drawImage(mask,0,0);
  skyContext.globalCompositeOperation='destination-out';skyContext.drawImage(mask,0,0);
  bridge.append(c);patches.set(layer.selector,c);masks.set(layer.selector,mask);
 }
 skyContext.globalCompositeOperation='destination-over';skyContext.fillStyle='#080a0d';skyContext.fillRect(0,0,1920,1080);
 d.querySelector('.cockpit-composition').append(bridge);
 let active=false,lastCrop='',previousTick=null;const intervals=[],costs=[];
 function publishTiming(){if(!intervals.length)return;const sorted=intervals.slice().sort((a,b)=>a-b);viewport.dataset.openingTiming=JSON.stringify({samples:intervals.length,medianMs:sorted[Math.floor(sorted.length/2)],maxMs:Math.max(...intervals),meanWorkMs:costs.reduce((a,b)=>a+b,0)/costs.length})}
 function crop(t){
  // Keep the source Earth cutoff below the viewport until it has passed out of view.
  const p=smooth((t-2.7)/.5),s=mix(scale,nativeScale,p);
  const left=mix(x,(width-1920*nativeScale)/2,p),top=mix(y,width<=900?(height-1080*nativeScale)/2:0,p);
  const key=`${s}:${top}`;if(key===lastCrop)return;lastCrop=key;
  Object.assign(video.style,{width:1920*s+'px',height:1080*s+'px',left:left+'px',top:top+'px',right:'auto',bottom:'auto',objectFit:'fill',transform:'none'});
 }
 function target(layer){
  // Asset features registered directly against decoded movie frame zero.
  if(layer.selector==='.quickstart-station')return {x:x+945.725*scale,y:y+202.141*scale,w:1536*.61846306*scale};
  if(layer.selector==='.selection-moon')return {x:x+1631.559*scale,y:y+153.831*scale,w:1254*.15333381*scale};
  if(layer.selector==='.selection-earth')return {x:x-.091*scale,y:y+657.938*scale,w:2171*.88444176*scale};
  return {x,y:y+80*scale,w:1920*scale};
 }
 // A nearly aligned desktop composition can blend gently while the cabin moves.
 // Narrower views finish their larger framing correction before revealing it.
 const alignmentTravel=Math.max(...layers.filter(l=>l.selector!=='.selection-stars').map(l=>{const b=target(l);return Math.max(Math.abs(l.r.x-b.x),Math.abs(l.r.y-b.y),Math.abs(l.r.width-b.w))}));
 const blendDuration=alignmentTravel<=12?.28:.16;
 const travel=(a,b,velocity,u)=>{const u2=u*u,u3=u2*u;return (2*u3-3*u2+1)*a+(-2*u3+3*u2)*b+(u3-u2)*lead*velocity};
 function render(elapsed,running=false){
  const tick=performance.now();if(running&&elapsed<1.48){if(previousTick!==null)intervals.push(tick-previousTick);previousTick=tick}
  if(!active){d.documentElement.classList.add('quickstart-native-flight');viewport.style.background='transparent';active=true}
  const t=Math.max(0,elapsed-lead);crop(t);video.style.opacity='1';
  if(elapsed>=1.48){viewport.style.zIndex='0';if(previousTick!==null){publishTiming();previousTick=null}return}
  viewport.style.zIndex='31';
  const progress=clamp(elapsed/lead),handedOff=elapsed>=lead;
  bridge.style.display=handedOff?'none':'block';
  bridge.style.opacity=String(smooth((elapsed-(lead-blendDuration))/blendDuration));
  backdrop.style.opacity=handedOff?'0':'1';
  for(const layer of layers){
   const {el,r,m,parentScale,ox,oy}=layer,b=target(layer);
   const v=window.quickstartOpeningVelocity[layer.selector],bh=b.w*r.height/r.width;
   const bw=travel(r.width,b.w,v.growth*b.w,progress);
   const bx=travel(r.x+r.width/2,b.x+b.w/2,v.x*scale,progress)-bw/2;
   const by=travel(r.y+r.height/2,b.y+bh/2,v.y*scale,progress)-bw*r.height/r.width/2;
   const ratio=r.width?bw/r.width:1;
   const e=m.e+ox-m.a*ox-m.c*oy+(bx-r.x)/parentScale,f=m.f+oy-m.b*ox-m.d*oy+(by-r.y)/parentScale;
   el.style.transformOrigin='0 0';el.style.setProperty('transform',`matrix(${m.a*ratio},${m.b*ratio},${m.c*ratio},${m.d*ratio},${e},${f})`,'important');
   el.style.opacity=String(handedOff?0:layer.opacity);
   const patch=patches.get(layer.selector)||sky;
   patch.style.transformOrigin=`${b.x-x}px ${b.y-y}px`;
   patch.style.transform=`translate(${bx-b.x}px,${by-b.y}px) scale(${bw/b.w})`;
  }
  const exit=-distance*smooth((elapsed-.08)/1.4);
  for(const c of cabins)c.style.translate=exit+'px 0';
  if(running)costs.push(performance.now()-tick);
 }
 function destroy(){d.documentElement.classList.remove('quickstart-native-flight');style.remove();backdrop.remove();bridge.remove();for(const [el,value] of saved){if(value===null)el.removeAttribute('style');else el.setAttribute('style',value)}}
 return {render,destroy};
};
