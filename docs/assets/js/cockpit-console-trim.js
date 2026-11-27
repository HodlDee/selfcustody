/* Register the landscape wall contour to the board's actual painted box. */
(() => {
 const plate=document.querySelector('.cabin-mobile-wide');
 if(!plate)return;
 const landscape=matchMedia('(max-width:1100px) and (max-height:500px) and (min-aspect-ratio:6/5), (max-width:900px) and (max-height:700px) and (min-aspect-ratio:6/5)');
 const destinations=document.querySelector('.destination-menu');
 // Inner glass edge traced from the approved 1897×829 landscape plate.
 const glass=[[1390,154],[1157,155],[1074,157],[1040,160],[1019,165],[1006,170],[986,180],[964,200],[946,230],[932,260],[924,300],[918,360],[917,440],[917,520],[923,600],[930,640],[936,660],[946,680],[959,700],[970,710],[985,720],[999,730],[1024,740],[1047,745],[1088,750],[1168,752],[1390,753],[1624,752],[1658,750],[1701,745],[1722,740],[1751,730],[1771,720],[1786,710],[1797,700],[1803,680],[1826,660],[1837,640],[1854,600],[1864,520],[1868,440],[1866,360],[1860,300],[1851,260],[1840,230],[1818,200],[1798,180],[1776,170],[1763,165],[1709,160],[1655,157],[1560,155]];
 function aperturePath(projection){
  const points=glass.map(([x,y])=>[x*projection.scale+projection.x,y*projection.scale+projection.y]);
  let path='M'+points[0].map(n).join(' ');
  for(let i=0;i<points.length;i++){
   const a=points[(i+points.length-1)%points.length],b=points[i],c=points[(i+1)%points.length],e=points[(i+2)%points.length];
   path+='C'+[b[0]+(c[0]-a[0])/6,b[1]+(c[1]-a[1])/6,c[0]-(e[0]-b[0])/6,c[1]-(e[1]-b[1])/6,c[0],c[1]].map(n).join(' ');
  }
  return path+'Z';
 }
 let pending=0;
 const n=value=>Math.round(value*1000)/1000;
 function render(){
  pending=0;plate.classList.toggle('console-trim-ready',landscape.matches);
  if(!landscape.matches){plate.style.removeProperty('--console-wall-art');destinations?.style.removeProperty('clip-path');delete plate.dataset.consoleGeometry;return}
  const style=getComputedStyle(plate,'::after'),rim=parseFloat(style.borderTopWidth);
  // Saved before-stylesheets retain their original artwork treatment.
  if(!(rim>0))return;
  const width=plate.clientWidth,height=plate.clientHeight;
  const frame={x:parseFloat(style.left),y:parseFloat(style.top),width:parseFloat(style.width),height:parseFloat(style.height),radius:parseFloat(style.borderTopLeftRadius)};
  if(![width,height,...Object.values(frame)].every(Number.isFinite)||width<=0||height<=0)return;
  // Cover the original painted left bend, then end above the cockpit sill.
  const scale=Math.max(width/1897,height/829),imageStyle=getComputedStyle(plate.querySelector('img'));
  const positions=imageStyle.objectPosition.split(' ').map(value=>parseFloat(value)/100);
  const projection={scale,x:(width-1897*scale)*(Number.isFinite(positions[0])?positions[0]:.5),y:(height-829*scale)*(Number.isFinite(positions[1])?positions[1]:.5)};
  const windowPath=aperturePath(projection);if(destinations)destinations.style.clipPath='path("'+windowPath+'")';
  // Measured black seam along the original trim, rather than the board edge.
  const native=[[1074,116],[1040,116],[1015,117],[990,118],[976,122],[964,125],[955,130],[945,135],[938,140],[932,145],[926,150],[920,156],[915,162],[902,180],[892,200],[885,220],[880,242],[874,280],[871,306],[866,400],[866,500],[871,600],[876,650],[885,690],[897,720],[909,740],[917,750],[925,758],[952,780],[985,829]];
  const stroke=1.5,inset=stroke/2;
  const project=(point,offset=0)=>[point[0]*scale+projection.x-offset,point[1]*scale+projection.y];
  function curve(points,move=true){
   let path=move?'M'+points[0].map(n).join(' '):'';
   for(let i=0;i<points.length-1;i++){
    const a=points[Math.max(0,i-1)],b=points[i],c=points[i+1],e=points[Math.min(points.length-1,i+2)];
    path+='C'+[b[0]+(c[0]-a[0])/6,b[1]+(c[1]-a[1])/6,c[0]-(e[0]-b[0])/6,c[1]-(e[1]-b[1])/6,c[0],c[1]].map(n).join(' ');
   }
   return path;
  }
  const lightBarY=758*scale+projection.y;
  const left=Math.round(frame.x-10),right=frame.x+frame.width+6,top=Math.max(48,124*scale+projection.y);
  // Keep the accepted left bend, and return across the bottom above the sill.
  const edgeBottom=Math.max(frame.y+frame.height+1.5,Math.min(frame.y+frame.height+5,lightBarY-2));
  const edgeLeft=left+1.5,leftRadius=frame.radius+frame.x-left-1.5;
  const leftYRadius=frame.radius+edgeBottom-frame.y-frame.height;
  const corner=8,joinY=edgeBottom-corner,sourceY=(joinY-projection.y)/scale;
  let k=1;while(k<native.length-1&&native[k][1]<sourceY)k++;
  const p=native[k-1],q=native[k],fraction=Math.max(0,Math.min(1,(sourceY-p[1])/(q[1]-p[1])));
  const joinSource=[p[0]+(q[0]-p[0])*fraction,sourceY];
  const up=[joinSource,...native.slice(0,k).reverse()].map(point=>project(point,inset+.25*Math.max(0,Math.min(1,(180-point[1])/40))));
  const join=up[0],tangent=[(up[1][0]-join[0])/6,(up[1][1]-join[1])/6];
  const outline=`M${n(edgeLeft)} ${n(top+2)}V${n(edgeBottom-leftYRadius)}A${n(leftRadius)} ${n(leftYRadius)} 0 0 0 ${n(edgeLeft+leftRadius)} ${n(edgeBottom)}H${n(join[0]-corner)}C${n(join[0]+corner*.15)} ${n(edgeBottom)} ${n(join[0]-tangent[0])} ${n(join[1]-tangent[1])} ${n(join[0])} ${n(join[1])}${curve(up,false)}`;
  // In wide crops, carry the wall up to the underside of the roof trim.
  // The former diagonal closure left an exposed dark rectangle beside the sign.
  const roofY=123*scale+projection.y;
  const roofRadius=Math.max(0,Math.min(24*scale,top+2-roofY));
  const roofFill=width>=992&&projection.y<-.5&&roofRadius>0;
  const shape=outline+(roofFill
   ? `L${n(edgeLeft+roofRadius)} ${n(roofY)}Q${n(edgeLeft)} ${n(roofY)} ${n(edgeLeft)} ${n(roofY+roofRadius)}V${n(top+2)}Z`
   : `L${n(edgeLeft)} ${n(top+2)}Z`);
  // A very quiet inner shade follows the same quadratic roof corner.
  // Clip it to the wall face and fade both ends, avoiding any rectangular patch.
  const cornerPath=`M${n(edgeLeft+roofRadius+30)} ${n(roofY)}H${n(edgeLeft+roofRadius)}Q${n(edgeLeft)} ${n(roofY)} ${n(edgeLeft)} ${n(roofY+roofRadius)}V${n(roofY+roofRadius+30)}`;
  const cornerShade=roofFill?`<g clip-path="url(#wall-face)" mask="url(#corner-fade)"><path d="${cornerPath}" fill="none" stroke="#000" stroke-width="3" opacity=".16" stroke-linecap="round" filter="url(#corner-softness)"/></g>`:'';
  // A single sill face removes the panel breaks beneath the bar. Its light
  // path keeps the original downward turn and runs beyond the visible edge.
  const sillLightPath='M0 758H848C867 758 878 796 903 829';
  const continuousSill=roofFill?`<g transform="matrix(${scale} 0 0 ${scale} ${projection.x} ${projection.y})"><path d="M0 730H1000V829H0Z" fill="url(#sill-bronze)"/><path d="${sillLightPath}" fill="none" stroke="#f69a43" stroke-width="11" opacity=".38" filter="url(#sill-halo)"/><path d="${sillLightPath}" fill="none" stroke="#f3a95d" stroke-width="4.5" opacity=".75"/><path d="${sillLightPath}" fill="none" stroke="#fff1c6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></g>`:'';
  const nativePath=curve(native.map(point=>project(point)));
  const nativeClip=`M0 0H${width}V${n(native[0][1]*scale+projection.y)}H${n(native[0][0]*scale+projection.x)}${nativePath.slice(nativePath.indexOf('C'))}H0Z`;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs><clipPath id="wall-side"><path d="${nativeClip}"/></clipPath><clipPath id="wall-face"><path d="${shape}"/></clipPath><filter id="corner-softness" filterUnits="userSpaceOnUse" x="0" y="0" width="${width}" height="${height}"><feGaussianBlur stdDeviation=".65"/></filter><radialGradient id="corner-fade-art" gradientUnits="userSpaceOnUse" cx="${n(edgeLeft+roofRadius)}" cy="${n(roofY+roofRadius)}" r="${n(roofRadius+18)}"><stop stop-color="white"/><stop offset=".45" stop-color="white"/><stop offset=".85" stop-color="white" stop-opacity=".15"/><stop offset="1" stop-color="white" stop-opacity="0"/></radialGradient><mask id="corner-fade"><rect width="${width}" height="${height}" fill="url(#corner-fade-art)"/></mask><linearGradient id="sill-bronze" gradientUnits="userSpaceOnUse" x1="0" y1="730" x2="0" y2="829"><stop stop-color="#140e08"/><stop offset=".04" stop-color="#0d0300"/><stop offset=".1" stop-color="#27170c"/><stop offset=".2" stop-color="#3a1e0e"/><stop offset=".28" stop-color="#502a13"/><stop offset=".36" stop-color="#582f16"/><stop offset=".5" stop-color="#331d10"/><stop offset=".7" stop-color="#29180c"/><stop offset="1" stop-color="#2a190d"/></linearGradient><filter id="sill-halo" x="-10%" y="-100%" width="120%" height="300%"><feGaussianBlur stdDeviation="3"/></filter></defs><g clip-path="url(#wall-side)">${continuousSill}<path d="${shape}" fill="#17191b"/>${cornerShade}<path d="${outline}" fill="none" stroke="#000" stroke-width="${stroke}" stroke-linejoin="round" stroke-linecap="round"/></g></svg>`;
  plate.style.setProperty('--console-wall-art',`url("data:image/svg+xml,${encodeURIComponent(svg)}")`);
  plate.dataset.consoleGeometry=JSON.stringify({frame,rim,wall:{left,right,bottom:edgeBottom+inset,gap:right-frame.x-frame.width,contour:'continuous-native-u'},roofFill:roofFill?{top:roofY,radius:roofRadius,shadeWidth:3,shadeOpacity:.16,shadeBlur:.65}:null,sillContinuous:roofFill,artworkRetouch:"landscape-v2",windowProjection:projection,windowMask:'landscape-inner-glass-v1',outline:{path:outline,width:stroke,segments:1,bottom:edgeBottom,lightBarY,topRight:up.at(-1),rightJoin:join},blackEdge:{x:866*scale+projection.x-inset,start:native[0][1]*scale+projection.y,end:edgeBottom,inset,width:stroke,opacity:1,continuous:true,anchor:'native-window-trim'},leftBlackEdge:{x:edgeLeft,start:top+2,end:edgeBottom,inset:1.5,width:stroke,opacity:1,continuous:true}});
 }
 function schedule(){if(!pending)pending=requestAnimationFrame(render)}
 addEventListener('resize',schedule);landscape.addEventListener('change',schedule);
 new ResizeObserver(schedule).observe(plate);schedule();
})();
