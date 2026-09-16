/* The arrival reveal.

   Two ways in. Through the flight, the journey drives it from the parent
   document; opened directly -- a search result, a link, the Guides menu -- the
   page has to start it itself, which it did not, so a normal visit showed the
   finished state with no entrance at all.

   The iframe check is what keeps the two from fighting: inside the journey the
   parent owns the timing, so this stays out of the way.

   Deliberately NOT gated on the cutscenes switch. That switch turns off travel
   -- the launch and the flight -- and the title and text entrance is part of
   the guide, not part of the journey. prefers-reduced-motion is the one thing
   that suppresses it, and it leaves the finished state on screen. */
(()=>{
 const body=document.body;
 const REVEAL_MS=1500;
 const play=()=>{
  body.classList.remove('is-arriving');
  void body.offsetWidth;
  body.classList.add('is-arriving');
  setTimeout(()=>body.classList.remove('is-arriving'),REVEAL_MS);
 };
 let reduced=false;
 try{reduced=matchMedia('(prefers-reduced-motion: reduce)').matches}catch{}
 const embedded=window.self!==window.top;
 if(!embedded&&!reduced)play();
})();
(()=>{let timer;document.querySelector('.galaxy-replay').addEventListener('click',()=>{clearTimeout(timer);document.body.classList.remove('is-arriving');void document.body.offsetWidth;document.body.classList.add('is-arriving');timer=setTimeout(()=>document.body.classList.remove('is-arriving'),1500)});})();
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
