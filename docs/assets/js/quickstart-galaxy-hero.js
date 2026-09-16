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
