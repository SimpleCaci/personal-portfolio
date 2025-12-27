// ===== Rope Pull → Transition → Navigate =====
const rope = document.getElementById("rope");

// --- Config ---
const CFG = {
  pullThreshold: 95,   // trigger when pulled past this
  follow: 0.18,         // smoothing while dragging
  ret: 0.10,            // smoothing while returning
  swayAmp: 2.2,         // degrees
  swaySpeed: 0.018,     // sway frequency
  maxDrag: 220,         // max visual pull distance (clamp)
  navigateTo: "../index.html",
  navigateAt: 0.5       // 0.5 = at full cover (t/2 in your transition)
};

// --- State ---
const S = {
  dragging: false,
  transitioned: false,
  startY: 0,
  targetY: 0,
  currentY: 0,
  t: 0,
  rotate: 0
};

// --- Helpers ---
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

function setDragging(on, e) {
  S.dragging = on;
  if (on && e) S.startY = e.clientY - S.currentY; // preserves continuity
}

function computeTargetY(e) {
  const raw = e.clientY - S.startY;
  S.targetY = clamp(raw, 0, CFG.maxDrag);
}

function updateSway() {
  S.t += 1;
  S.rotate = S.dragging ? 0 : Math.sin(S.t * CFG.swaySpeed) * CFG.swayAmp;
}

function updatePosition() {
  const goal = S.dragging ? S.targetY : 0;
  const k = S.dragging ? CFG.follow : CFG.ret;
  S.currentY += (goal - S.currentY) * k;
}

function render() {
  rope.style.transform = `translate(-50%, ${S.currentY-100}px) rotate(${S.rotate}deg)`;
}

function shouldTriggerTransition() {
  return !S.transitioned && S.targetY >= CFG.pullThreshold;
}

function runTransitionAndNavigate() {
  S.transitioned = true;
  const dur = barsZoomTransition();            // must exist globally
  setTimeout(() => window.location.href = CFG.navigateTo, dur * CFG.navigateAt);
}

// --- Events ---
rope.addEventListener("mousedown", (e) => setDragging(true, e));

document.addEventListener("mousemove", (e) => {
  if (!S.dragging) return;
  computeTargetY(e);
  if (shouldTriggerTransition()) runTransitionAndNavigate();
});

document.addEventListener("mouseup", () => setDragging(false));

// --- Animation Loop ---
(function tick() {
  updateSway();
  updatePosition();
  render();
  requestAnimationFrame(tick);
})();
