/* Which of the two front doors a visit lands on.

   The cockpit is Home. The rocket launch that introduces it is worth seeing
   once, not on every return to the homepage -- so the first visit in a tab is
   sent to launch.html and every visit after it stays on the cockpit. The
   banner's Home link therefore comes straight back here, with no launch to sit
   through, which is the behaviour without a flag to set.

   sessionStorage, not localStorage: "once per tab" is the intent, so a new tab
   or window is a new first visit while a reload is not.

   This runs before paint -- it is the one script in the head that is neither
   deferred nor a module -- because a redirect after the cockpit has drawn is a
   flash of the wrong page. It is small enough to be worth that cost.

   location.replace, not assign: the launch takes this entry's place in history
   rather than adding one, so Back from the cockpit reaches whatever preceded
   the site instead of bouncing through a launch the visitor already watched. */
(() => {
  "use strict";
  var KEY = "sc-launch-seen";

  var seen = true;
  try { seen = sessionStorage.getItem(KEY) === "1"; } catch (e) { seen = true; }
  if (seen) return;

  /* Both opt-outs are honoured here rather than by the launch page, so someone
     who has turned cutscenes off, or asked for reduced motion, never loads the
     launch at all -- no video fetched, no redirect to sit through. They are
     separate switches on purpose: reduced motion is a standing accessibility
     preference, the toggle is a choice about this site. */
  var reduced = false;
  try { reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}

  var cutscenesOff = false;
  try { cutscenesOff = localStorage.getItem("sc-cutscenes-enabled") === "false"; } catch (e) {}

  /* Marked seen either way. Someone who declines the launch has still had their
     one chance at it this tab, and turning cutscenes back on mid-visit should
     not drop them into a launch from an ordinary click on Home. */
  try { sessionStorage.setItem(KEY, "1"); } catch (e) {}

  if (reduced || cutscenesOff) return;
  window.location.replace("launch.html");
})();
