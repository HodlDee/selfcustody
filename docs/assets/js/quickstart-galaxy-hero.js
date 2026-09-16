/* The arrival reveal.

   Two ways in. Through the flight, the journey drives it from the parent
   document; opened directly -- a search result, a link, the Guides menu -- the
   page has to start it itself, which it did not.

   It runs the flight's own reveal rather than an effect of its own. That is
   what --arrival-title drives: the rows of the guide head fading up in
   sequence, offset against each other by the --row-start values in
   quickstart-galaxy-arrival.css. 1150ms, the same figure the journey uses, so
   the two entrances stay identical by construction.

   --arrival-content is pinned at 1 from the start. In the flight it ramps,
   because the banner and body are arriving out of a video; here they are
   already on screen and should stay put. Only the head rows move, over clouds
   and a banner that do not.

   The iframe check keeps the two from fighting: inside the journey the parent
   owns the timing, so this stays out of the way. */
(()=>{
 const root=document.documentElement;
 const REVEAL_MS=1150;
 const set=(name,value)=>root.style.setProperty(name,String(value));

 const play=()=>{
  root.classList.add('quickstart-arrival-layer','galaxy-direct');
  set('--arrival-content',1);
  set('--arrival-title',0);
  let began=null,done=false;
  const finish=()=>{if(done)return;done=true;set('--arrival-title',1)};
  const step=now=>{
   if(done)return;
   if(began===null)began=now;
   const progress=Math.min(1,(now-began)/REVEAL_MS);
   set('--arrival-title',progress);
   if(progress<1)requestAnimationFrame(step);else finish();
  };
  /* The rows start at zero opacity, so if the frame callback never arrives the
     heading and its opening lines are stranded invisible -- and it genuinely
     does not arrive in a background tab, or anywhere the page is not being
     composited. A timer still fires there, so this guarantees the text ends up
     on screen whether or not it got to animate on the way. Slightly longer than
     the reveal, so it only ever acts as a floor. */
  setTimeout(finish,REVEAL_MS+400);
  requestAnimationFrame(step);
 };

 let reduced=false;
 try{reduced=matchMedia('(prefers-reduced-motion: reduce)').matches}catch{}
 const embedded=window.self!==window.top;
 if(embedded)return;
 if(reduced){
  /* Finished state, no motion. The stylesheet's own reduced-motion block
     already neutralises the transforms; this makes sure nothing is left at
     zero opacity waiting for a frame that will not come. */
  root.classList.add('quickstart-arrival-layer','galaxy-direct');
  set('--arrival-content',1);
  set('--arrival-title',1);
  return;
 }
 play();

 /* Replay runs the same entrance rather than the old black-wipe effect. */
 const replay=document.querySelector('.galaxy-replay');
 if(replay)replay.addEventListener('click',play);
})();

(()=>{
 const header=document.getElementById('header');
 let pending=0;
 const update=()=>{
  header.style.setProperty('--galaxy-header-progress',String(Math.min(1,Math.max(0,scrollY/120))));
  pending=0;
 };
 addEventListener('scroll',()=>{if(!pending)pending=requestAnimationFrame(update)},{passive:true});
 addEventListener('pageshow',update);
 update();
})();
(()=>{

 const hero=document.querySelector('.sc-guide-head');
 const fadeAnchor=document.getElementById('cloud-fade-anchor');
 const alignFade=()=>{
  const end=fadeAnchor.getBoundingClientRect().bottom-hero.getBoundingClientRect().top;
  hero.style.setProperty('--cloud-fade-end',`${Math.round(end)}px`);
 };
 // Keep the cloud's final fade aligned with this paragraph as text wraps.
 const layoutObserver=new ResizeObserver(alignFade);
 layoutObserver.observe(fadeAnchor);
 layoutObserver.observe(hero);
 document.fonts.ready.then(alignFade);
 alignFade();
})();
