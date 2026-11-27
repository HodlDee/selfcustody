/* Ordinary navigation fades through black; cutscene handlers keep ownership
   by preventing the click's default action before it bubbles to the document. */
(() => {
  'use strict';
  const key = 'sc-page-fade';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  const embedded = window.self !== window.top;
  let busy = false;
  let arriving = false;
  let shade;
  let animation;
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  function overlay() {
    if (!shade) {
      shade = document.createElement('div');
      shade.id = 'sc-page-fade';
      shade.setAttribute('aria-hidden', 'true');
      shade.style.cssText = 'position:fixed;inset:0;background:#000;opacity:0;z-index:2147483647;pointer-events:none;';
      root.append(shade);
    }
    return shade;
  }
  let camera;
  const fadeOutDuration = 260;
  const cameraLead = () => camera ? Math.max(0, camera.effect.getTiming().duration - fadeOutDuration) : 0;
  function cockpit(){
    return document.querySelector('.cockpit-preloader.is-presented')?.contentWindow?.quickstartVideo || window.quickstartVideo;
  }
  async function fade(opacity, lead = 0) {
    const el = overlay();
    const from = getComputedStyle(el).opacity;
    animation?.cancel();
    el.style.opacity = String(opacity);
    if (reduced.matches) return;
    animation = el.animate([{ opacity: from }, { opacity }], {
      delay: lead, fill: 'backwards', duration: opacity ? fadeOutDuration : 360, easing: 'ease-in-out'
    });
    await animation.finished.catch(() => {});
  }
  function clear() {
    camera?.cancel(); camera = null;
    animation?.cancel();
    if (shade) { shade.style.opacity = '0'; shade.style.pointerEvents = 'none'; }
    busy = false;
    arriving = false;
  }
  async function run(change, leavingCockpit = false) {
    if (embedded && window.top.pageTransition) return window.top.pageTransition.run(change, leavingCockpit);
    if (busy) return;
    busy = true;
    overlay().style.pointerEvents = 'auto';
    try {
      if (leavingCockpit) camera = cockpit()?.cockpitCamera('exit', 'launch.html');
      await fade(1, cameraLead());
      await change();
      // Paint the new view under black before revealing it.
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      await fade(0);
    } finally { clear(); }
  }
  async function navigate(href) {
    if (embedded && window.top.pageTransition) return window.top.pageTransition.navigate(new URL(href, location.href).href);
    if (busy) return;
    busy = true;
    overlay().style.pointerEvents = 'auto';
    camera = cockpit()?.cockpitCamera('exit', href);
    await fade(1, cameraLead());
    try { sessionStorage.setItem(key, JSON.stringify({ href: new URL(href, location.href).href, time: Date.now() })); } catch {}
    location.assign(href);
    // Recover if a download or cancelled navigation leaves this document alive.
    setTimeout(clear, 5000);
  }
  window.pageTransition = { navigate, run, get arriving() { return arriving; } };

  if (!embedded) {
    try {
      const pending = JSON.parse(sessionStorage.getItem(key) || 'null');
      sessionStorage.removeItem(key);
      if (pending && Date.now() - pending.time < 15000) {
        const target = new URL(pending.href);
        arriving = target.pathname === location.pathname && target.search === location.search;
      }
    } catch {}
    if (arriving) { overlay().style.opacity = '1'; }
    document.addEventListener('DOMContentLoaded', async () => {
      if (!arriving) return;
      // The cockpit is an iframe whose artwork is prepared after DOM ready.
      const deadline = performance.now() + 8000;
      while (document.getElementById('cockpit-scene') && !window.quickstartVideo?.canReveal && performance.now() < deadline) await delay(40);
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      if (!busy) { cockpit()?.cockpitCamera('enter'); await fade(0); arriving = false; }
    }, { once: true });
    addEventListener('pageshow', event => { if (event.persisted) { clear(); cockpit()?.cockpitCamera('enter'); } });
  }

  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && !['_self', '_top'].includes(link.target))) return;
    const url = new URL(link.href);
    if (!/^https?:$/.test(url.protocol) || url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search) return;
    if (!url.pathname.endsWith('.html') && !url.pathname.endsWith('/')) return;
    event.preventDefault();
    navigate(url.href);
  });
})();
