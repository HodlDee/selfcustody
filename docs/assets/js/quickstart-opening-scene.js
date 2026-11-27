/* Lead-in velocities in source pixels; land gently grows in place, planets travel left. */
window.quickstartOpeningVelocity={
 '.quickstart-station':{x:0,y:0,growth:.155},
 '.selection-moon':{x:-45,y:0,growth:.02},
 '.selection-earth':{x:-75,y:0,growth:.008},
 '.selection-stars':{x:-20,y:0,growth:0}
};
window.createQuickstartRestingPose=function(scene,lead){
 // Smaller scenes have their own resting composition; desktop film coordinates
 // would move the island under the wall or beyond the visible window.
 if(scene.contentWindow.innerWidth<1200)return {clear(){}};
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
   const targetWidth=w.innerWidth>=1200&&w.innerWidth<1600?Math.min(1536*.61846306*s,w.innerWidth*.60):1536*.61846306*s,targetHeight=targetWidth*r.height/r.width;
   const startScale=1+v.growth*dt;
   ratio=targetWidth*startScale/r.width;
   dx=(w.innerWidth-1920*s)/2+945.725*s-r.x+targetWidth*(1-startScale)/2;

   dy=(202.141-80)*s-r.y+targetHeight*(1-startScale)/2;
   if(w.innerWidth>=1200&&w.innerWidth<1600){
    dx-=w.innerWidth*.05;
    dx+=targetWidth*startScale*.025;
    dy+=targetHeight*startScale*.025;
    ratio*=.95;
   }
  }
  // The film-aligned desktop pose blends in after the laptop breakpoint.
  // At 1200px it starts at the same live pose as the narrower composition.
  const poseBlend=Math.max(0,Math.min(1,(w.innerWidth-1200)/80));
  ratio=1+(ratio-1)*poseBlend;dx*=poseBlend;dy*=poseBlend;
  const e=m.e+o[0]-m.a*o[0]-m.c*o[1]+dx/parentScale,f=m.f+o[1]-m.b*o[0]-m.d*o[1]+dy/parentScale;
  el.style.transformOrigin='0 0';el.style.setProperty('transform',`matrix(${m.a*ratio},${m.b*ratio},${m.c*ratio},${m.d*ratio},${e},${f})`,'important');
 }
 return {clear(){for(const [el,value] of saved){if(value===null)el.removeAttribute('style');else el.setAttribute('style',value)}}};
};
/* Track the gate through a cover crop, then settle onto the guide's cloud crop.
   Positions are source pixels measured from the approved 1080p movie. */
window.quickstartResponsiveFrame=function(t,width,height){
 const clamp=v=>Math.max(0,Math.min(1,v)),ease=v=>{v=clamp(v);return v*v*v*(v*(v*6-15)+10)},mix=(a,b,p)=>a+(b-a)*p;
 const portrait=width/height<=1.2,guideScale=portrait?Math.max(720,height)/1080:width/1920;
 const guideX=portrait?(width-1920*guideScale)*.68:0;
 const endFocus=(width/2-guideX)/guideScale;
 const points=[[0,1394],[.8,1386],[1.6,1320],[2.4,1170],[3.25,960],[3.65,960],[4.85,endFocus]];
 let i=0;while(i<points.length-2&&t>points[i+1][0])i++;
 const a=points[i],b=points[i+1],before=points[Math.max(0,i-1)],after=points[Math.min(points.length-1,i+2)];
 const u=clamp((t-a[0])/(b[0]-a[0])),dt=b[0]-a[0],u2=u*u,u3=u2*u;
 const va=i===0?0:(b[1]-before[1])/(b[0]-before[0]);
 const vb=i===points.length-2?0:(after[1]-a[1])/(after[0]-a[0]);
 const focus=(2*u3-3*u2+1)*a[1]+(u3-2*u2+u)*dt*va+(-2*u3+3*u2)*b[1]+(u3-u2)*dt*vb;
 const opening=Math.max(width/1920,height/917),cover=Math.max(width/1920,height/1080);
 const release=ease((t-2.7)/.5),arrival=ease((t-3.65)/1.2);
 const scale=mix(mix(opening,cover,release),guideScale,arrival);
 const x=mix(Math.min(0,Math.max(width-1920*scale,width/2-focus*scale)),guideX,arrival);
 const y=mix(mix(-80*opening,(height-1080*scale)/2,release),0,arrival);
 return {x,y,scale};
};
/* Animate the existing scene using compositor transforms, then reveal native video. */
window.createQuickstartOpeningScene=function(scene,video,lead,firstFrame,ringAppearance,nativeFrame=firstFrame){
 const d=scene.contentDocument,w=scene.contentWindow,width=w.innerWidth,height=w.innerHeight;
 const viewport=document.getElementById('scene-viewport'),saved=new Map();
 const remember=el=>{if(!saved.has(el))saved.set(el,el.getAttribute('style'))};
 const clamp=v=>Math.max(0,Math.min(1,v)),smooth=v=>{v=clamp(v);return v*v*v*(v*(v*6-15)+10)},mix=(a,b,p)=>a+(b-a)*p;
 const responsive=width<1200,initial=responsive?window.quickstartResponsiveFrame(0,width,height):null;
 const scale=initial?.scale??Math.max(width/1920,height/917),x=initial?.x??(width-1920*scale)/2,y=initial?.y??-80*scale;
 const nativeScale=Math.max(width/1920,height/1080);
 // Desktop bridge layers retain the decoded movie's detail. Compact views
 // keep their existing 1080p masks and pixel cleanup unchanged.
 const nativeSource=!responsive&&nativeFrame&&nativeFrame.width<=video.videoWidth?nativeFrame:firstFrame;
 const rasterScale=nativeSource.width/1920;
 const skyPixel=responsive?firstFrame.getContext('2d').getImageData(0,0,1,1).data:null;
 const skyTone=skyPixel?`rgb(${skyPixel[0]},${skyPixel[1]},${skyPixel[2]})`:'#080a0d';
 const layers=['.quickstart-station','.selection-moon','.selection-earth','.selection-stars'].map(selector=>{
  const el=d.querySelector(selector),r=el.getBoundingClientRect(),cs=w.getComputedStyle(el),m=new w.DOMMatrix(cs.transform),o=cs.transformOrigin.split(' ').map(parseFloat);
  remember(el);
  const parentScale=r.width/(el.offsetWidth*Math.hypot(m.a,m.b))||1;
  return {selector,el,r,m,parentScale,ox:o[0]||0,oy:o[1]||0,opacity:Number(cs.opacity)};
 }).filter(layer=>layer.r.width>0&&layer.r.height>0);
 const cabins=[...d.querySelectorAll('.cabin-art,.cabin-mobile-art,.selection-copy')];
 for(const c of cabins)remember(c);
 // Leave the room through the actual visible glass. Nearby trim moves
 // strongly while the distant island and planets retain their film alignment.
 const portraitBox=d.querySelector('.cabin-mobile-window')?.getBoundingClientRect();
 const plateGeometry=d.querySelector('.cabin-mobile-wide')?.dataset.consoleGeometry;
 let opening;
 if(portraitBox?.height&&w.getComputedStyle(d.querySelector('.cabin-mobile-window')).display!=='none'){
  const insetX=portraitBox.width*.10,insetY=portraitBox.height*.10;
  const floorHeight=parseFloat(w.getComputedStyle(d.querySelector('.cabin-mobile-window'),'::before').height)||0;
  opening={left:portraitBox.left+insetX,right:portraitBox.right-insetX,top:portraitBox.top+insetY,bottom:Math.min(height-24,portraitBox.bottom-insetY-floorHeight)};
 }else if(plateGeometry){
  const p=JSON.parse(plateGeometry).windowProjection;
  opening={left:1050*p.scale+p.x,right:Math.min(width-12,1750*p.scale+p.x),top:190*p.scale+p.y,bottom:Math.min(height-18,690*p.scale+p.y)};
 }else{
  const art=d.querySelector('.cabin-art').getBoundingClientRect();
  opening={left:art.left+art.width*.48,right:width-24,top:Math.max(72,art.top+art.height*.10),bottom:height-32};
 }
 const cameraFocus={x:(opening.left+opening.right)/2,y:(opening.top+opening.bottom)/2};
 const cameraZoom=Math.max(1,(width+48)/Math.max(1,opening.right-opening.left),(height+48)/Math.max(1,opening.bottom-opening.top));
 const cameraPan={x:width/2-cameraFocus.x,y:height/2-cameraFocus.y};
 const exitDuration=responsive?Math.max(.1,lead-.04):1.4,exitDelay=responsive?.02:.04;
 const header=document.getElementById('site-header');
 const nearLayers=[...cabins,header].filter(Boolean).map(el=>{
  const r=el.getBoundingClientRect();if(!r.width)return null;
  remember(el);const localScale=r.width/el.offsetWidth||1;
  const sceneTop=el===header?scene.getBoundingClientRect().top:0;
  return {el,origin:{x:(cameraFocus.x-r.x)/localScale,y:(cameraFocus.y+sceneTop-r.y)/localScale}};
 }).filter(Boolean);
 // Keep the near cockpit opaque and in front of the space bridge.
 for(const {el} of nearLayers)if(el!==header)el.style.zIndex='40';
 if(header)header.style.setProperty('opacity','1','important');
 viewport.dataset.exitCamera=JSON.stringify({opening,focus:cameraFocus,zoom:cameraZoom,pan:cameraPan,duration:exitDuration+exitDelay});
 // Preserve the appearance at click time even when the hover state goes away.
 for(const {el,opacity} of ringAppearance||[]){remember(el);el.style.setProperty('opacity',opacity,'important')}
 remember(viewport);remember(video);
 const style=d.createElement('style');
 style.textContent='html.quickstart-native-flight,html.quickstart-native-flight body,html.quickstart-native-flight main,html.quickstart-native-flight .selection-stage{background:transparent!important}html.quickstart-native-flight .selection-stars{background-color:transparent!important}html.quickstart-native-flight .quickstart-station,html.quickstart-native-flight .selection-moon,html.quickstart-native-flight .selection-earth,html.quickstart-native-flight .selection-stars{will-change:transform,opacity;transition:none!important}';
 if(responsive)style.textContent+=`html.quickstart-native-flight{scrollbar-gutter:auto!important;scrollbar-width:none!important}html.quickstart-native-flight .cockpit-composition{width:${d.querySelector('.cockpit-composition').getBoundingClientRect().width}px!important}`;
 d.head.append(style);
 const backdrop=d.createElement('div');backdrop.setAttribute('aria-hidden','true');backdrop.style.cssText='position:absolute;inset:0;background:#080a0d;z-index:-2;pointer-events:none;will-change:opacity';backdrop.style.background=skyTone;d.querySelector('.cockpit-composition').prepend(backdrop);
 // Split the decoded still once, so each subject can keep its own path during
 // the dissolve. The entire group fades together to preserve brightness.
 const bridge=d.createElement('div');
 bridge.setAttribute('aria-hidden','true');bridge.className='quickstart-opening-bridge';bridge.dataset.sourceResolution=nativeSource.width+'x'+nativeSource.height;
 bridge.style.cssText='position:fixed;inset:0;z-index:3;pointer-events:none;opacity:0;will-change:opacity;isolation:isolate;background:#080a0d';
 bridge.style.background=skyTone;
 const plate=()=>{const c=d.createElement('canvas');c.width=1920*rasterScale;c.height=1080*rasterScale;c.getContext('2d').scale(rasterScale,rasterScale);c.style.cssText=`position:absolute;left:${x}px;top:${y}px;width:${1920*scale}px;height:${1080*scale}px;will-change:transform`;return c};
 const sky=plate(),skyContext=sky.getContext('2d');skyContext.drawImage(nativeSource,0,0,1920,1080);bridge.append(sky);
 const patches=new Map(),masks=new Map();
 for(const layer of layers.filter(l=>l.selector!=='.selection-stars')){
  const mask=plate(),ctx=mask.getContext('2d');ctx.fillStyle='#fff';
  if(layer.selector==='.quickstart-station'){
   ctx.transform(.61846306,0,0,.61846306,945.725,202.141);
   const path=new Path2D(d.querySelector('.quickstart-hit-area path').getAttribute('d'));ctx.fill(path);ctx.strokeStyle='#fff';ctx.lineWidth=18;ctx.lineJoin='round';ctx.stroke(path);
  }else if(layer.selector==='.selection-moon'){
   ctx.beginPath();ctx.arc(1727,244,77,0,Math.PI*2);ctx.fill();
  }else{
   // Include the whole Earth and its faint atmosphere; the border is in empty sky.
   ctx.beginPath();ctx.moveTo(0,655);ctx.bezierCurveTo(410,500,1080,430,1920,960);ctx.lineTo(1920,1080);ctx.lineTo(0,1080);ctx.closePath();ctx.fill();
   const gateMask=masks.get('.quickstart-station');
   if(gateMask){ctx.globalCompositeOperation='destination-out';ctx.drawImage(gateMask,0,0,1920,1080)}
  }
  const c=plate(),pctx=c.getContext('2d');pctx.drawImage(nativeSource,0,0,1920,1080);pctx.globalCompositeOperation='destination-in';pctx.drawImage(mask,0,0,1920,1080);
  if(responsive&&layer.selector==='.quickstart-station'){
   // The broad silhouette includes sky between and below the rocks. Those
   // pixels must be transparent when the island moves over the Earth layer.
   const pixels=pctx.getImageData(0,0,1920,1080),rgba=pixels.data;
   // Keep the dark tunnel interior opaque; only clean the lower island fringe.
   for(let i=600*1920*4;i<rgba.length;i+=4){
    if(!rgba[i+3])continue;
    const distance=Math.max(Math.abs(rgba[i]-skyPixel[0]),Math.abs(rgba[i+1]-skyPixel[1]),Math.abs(rgba[i+2]-skyPixel[2]));
    const edge=clamp((distance-3)/12);
    rgba[i+3]=Math.round(rgba[i+3]*edge*edge*(3-2*edge));
   }
   pctx.putImageData(pixels,0,0);
   const liveMask=d.createElement('canvas');liveMask.width=1536;liveMask.height=1024;
   liveMask.getContext('2d').drawImage(c,945.725,202.141,1536*.61846306,1024*.61846306,0,0,1536,1024);
   layer.el.style.setProperty('mask-image',`url("${liveMask.toDataURL('image/png')}")`,'important');
  }
  skyContext.globalCompositeOperation='destination-out';skyContext.drawImage(mask,0,0,1920,1080);
  bridge.append(c);patches.set(layer.selector,c);masks.set(layer.selector,mask);
 }
 // Keep the planet behind the now-transparent island silhouette.
 if(responsive&&patches.has('.quickstart-station'))bridge.append(patches.get('.quickstart-station'));
 skyContext.globalCompositeOperation='destination-over';skyContext.fillStyle=skyTone;skyContext.fillRect(0,0,1920,1080);
 d.querySelector('.cockpit-composition').append(bridge);
 let active=false,lastCrop='',previousTick=null;const intervals=[],costs=[];
 function publishTiming(){if(!intervals.length)return;const sorted=intervals.slice().sort((a,b)=>a-b);viewport.dataset.openingTiming=JSON.stringify({samples:intervals.length,medianMs:sorted[Math.floor(sorted.length/2)],maxMs:Math.max(...intervals),meanWorkMs:costs.reduce((a,b)=>a+b,0)/costs.length})}
 function crop(t){
  if(responsive){const f=window.quickstartResponsiveFrame(t,width,height);Object.assign(video.style,{width:1920*f.scale+'px',height:1080*f.scale+'px',left:f.x+'px',top:f.y+'px',right:'auto',bottom:'auto',objectFit:'fill',transform:'none'});return}

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
 const blendDuration=responsive ? lead*.8 : alignmentTravel<=12 ? .28 : .16;
 const travel=(a,b,velocity,u)=>{const u2=u*u,u3=u2*u;return (2*u3-3*u2+1)*a+(-2*u3+3*u2)*b+(u3-u2)*lead*velocity};
 function render(elapsed,running=false){
  const tick=performance.now();if(running&&elapsed<1.48){if(previousTick!==null)intervals.push(tick-previousTick);previousTick=tick}
  if(!active){d.documentElement.classList.add('quickstart-native-flight');viewport.style.background=responsive?skyTone:'transparent';active=true}
  const t=Math.max(0,elapsed-lead);crop(t);video.style.opacity=responsive&&elapsed<lead?'0':'1';
  if(elapsed>=(responsive?lead:1.48)){viewport.style.zIndex='0';if(previousTick!==null){publishTiming();previousTick=null}return}
  viewport.style.zIndex='31';
  const progress=clamp(elapsed/lead),handedOff=elapsed>=lead;
  bridge.style.display=handedOff?'none':'block';
  bridge.style.opacity=String(smooth((elapsed-(lead-blendDuration))/blendDuration));
  backdrop.style.opacity=handedOff?'0':'1';
  for(const layer of layers){
   if(responsive&&layer.selector==='.selection-stars')continue;
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
  const cameraProgress=clamp((elapsed-exitDelay)/exitDuration);
  const forward=cameraProgress**3*(cameraProgress*(cameraProgress*6-15)+10);
  const zoom=1+(cameraZoom-1)*forward;
  for(const {el,origin} of nearLayers){
   el.style.transformOrigin=origin.x+'px '+origin.y+'px';
   el.style.translate=cameraPan.x*forward+'px '+cameraPan.y*forward+'px';
   el.style.scale=String(zoom);el.style.opacity='1';
  }
  if(running)costs.push(performance.now()-tick);
 }
 function destroy(){delete viewport.dataset.exitCamera;d.documentElement.classList.remove('quickstart-native-flight');style.remove();backdrop.remove();bridge.remove();for(const [el,value] of saved){if(value===null)el.removeAttribute('style');else el.setAttribute('style',value)}}
 return {render,destroy};
};
