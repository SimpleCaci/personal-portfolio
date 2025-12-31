// Enhanced /QUINTON title: crisp slash blink + outline/drop-shadow + multi-animations
// Works with: <h1 class="page-title">/QUINTON</h1>

const title = document.querySelector(".page-title");
if (!title) throw new Error("Missing .page-title");

const raw = title.textContent.trim();
const hasSlash = raw.startsWith("/");
const word = hasSlash ? raw.slice(1) : raw;

// Build spans
title.innerHTML =
  (hasSlash ? `<span class="pt-slash">/</span>` : "") +
  word.split("").map((ch, i) => `<span class="pt-char" data-i="${i}">${ch}</span>`).join("");

// Inject CSS (self-contained)
const style = document.createElement("style");
style.textContent = `
  .page-title{
    display:inline-flex;
    align-items:baseline;
    gap:0.06em;
    user-select:none;
    position:relative;
  }

  /* Base readability: outline + shadow so blink is visible on clouds */
  .page-title .pt-slash,
  .page-title .pt-char{
    display:inline-block;
    -webkit-text-stroke: 2px rgba(10, 18, 40, 0.18);
    text-shadow:
      0 2px 0 rgba(10,18,40,0.28),
      0 10px 24px rgba(0,0,0,0.22);
    transition:
      color 220ms ease,
      transform 220ms ease,
      text-shadow 220ms ease,
      filter 220ms ease,
      opacity 180ms ease;
    will-change: transform, color, text-shadow, filter, opacity;
  }

  .page-title .pt-slash{
    margin-right:0.02em;
    filter: drop-shadow(0 0 10px rgba(255,255,255,0.22));
  }

  /* Ambient “sparkle” for the whole word (very subtle) */
  @keyframes titleShimmer {
    0%   { filter: drop-shadow(0 0 0 rgba(255,255,255,0)); }
    50%  { filter: drop-shadow(0 0 14px rgba(255,255,255,0.18)); }
    100% { filter: drop-shadow(0 0 0 rgba(255,255,255,0)); }
  }
  .page-title{ animation: titleShimmer 3.2s ease-in-out infinite; }

  /* “Attention” bounce on hover */
  @keyframes microBounce{
    0% { transform: translateY(0); }
    35%{ transform: translateY(-2px); }
    70%{ transform: translateY(0); }
    100%{ transform: translateY(0); }
  }
  .page-title:hover .pt-char,
  .page-title:hover .pt-slash{
    animation: microBounce 700ms ease-out 1;
  }

  /* Reduce motion */
  @media (prefers-reduced-motion: reduce){
    .page-title{ animation:none; }
    .page-title:hover .pt-char,
    .page-title:hover .pt-slash{ animation:none; }
  }
`;
document.head.appendChild(style);

const slashEl = title.querySelector(".pt-slash");
const chars = [...title.querySelectorAll(".pt-char")];

// ---------- Slash blink: visible + “terminal glow” ----------
if (slashEl) {
  let on = true;
  setInterval(() => {
    on = !on;
    slashEl.style.opacity = on ? "1" : "0.08"; // not fully gone so you still see the outline
    slashEl.style.textShadow = on
      ? "0 2px 0 rgba(10,18,40,0.28), 0 10px 24px rgba(0,0,0,0.22), 0 0 18px rgba(255,255,255,0.34)"
      : "0 2px 0 rgba(10,18,40,0.32), 0 10px 24px rgba(0,0,0,0.22), 0 0 8px rgba(255,255,255,0.12)";
  }, 520);

  // Tiny “spark” tick to make it feel alive
  let spark = false;
  setInterval(() => {
    spark = !spark;
    slashEl.style.filter = spark
      ? "drop-shadow(0 0 14px rgba(255,255,255,0.28))"
      : "drop-shadow(0 0 10px rgba(255,255,255,0.18))";
  }, 1100);
}

// ---------- Per-character wave: highlight travels across letters ----------
const base = { r: 170, g: 178, b: 190 };  // smoky gray-blue
const hi   = { r: 255, g: 255, b: 255 };  // bright highlight
const accent = { r: 140, g: 190, b: 255 }; // soft sky accent

function mix(a, b, amt) {
  const r = Math.round(a.r + (b.r - a.r) * amt);
  const g = Math.round(a.g + (b.g - a.g) * amt);
  const bb = Math.round(a.b + (b.b - a.b) * amt);
  return `rgb(${r},${g},${bb})`;
}

function falloff(dist) {
  return Math.max(0, Math.exp(-dist * 0.85)); // smooth decay
}

let t = 0;
let hoverSlow = false;

title.addEventListener("mouseenter", () => (hoverSlow = true));
title.addEventListener("mouseleave", () => (hoverSlow = false));

function animate() {
  const n = chars.length;
  if (!n) return;

  // focus slides across; on hover it slows down for readability
  const speed = hoverSlow ? 0.030 : 0.060;
  const focus = (t * speed) % n;

  chars.forEach((el, i) => {
    const d = Math.abs(i - focus);
    const f = falloff(d);

    // color blend: base -> accent -> white as it gets closer
    const mid = mix(base, accent, Math.min(1, f * 0.85));
    const col = mix({ r: parseInt(mid.slice(4)), g: 0, b: 0 }, hi, 0); // placeholder to avoid parsing
    // Use two-step without parsing: just compute directly
    const color = f > 0.55 ? mix(accent, hi, (f - 0.55) / 0.45) : mix(base, accent, f / 0.55);

    el.style.color = color;

    // lift and “bounce” near the focus
    const lift = (f > 0.75) ? -3 : (f > 0.45 ? -1.5 : 0);
    el.style.transform = `translateY(${lift}px)`;

    // glow near focus + stronger outline for legibility
    el.style.textShadow = (f > 0.55)
      ? `0 2px 0 rgba(10,18,40,0.30),
         0 10px 24px rgba(0,0,0,0.24),
         0 0 ${Math.round(18 * f)}px rgba(255,255,255,${0.26 * f})`
      : `0 2px 0 rgba(10,18,40,0.28),
         0 10px 24px rgba(0,0,0,0.22)`;
  });

  // occasional “sparkle ping” that hits a random letter (subtle)
  if (t % 240 === 0 && n > 2) {
    const j = Math.floor(Math.random() * n);
    const el = chars[j];
    el.style.filter = "drop-shadow(0 0 14px rgba(255,255,255,0.22))";
    setTimeout(() => (el.style.filter = "none"), 220);
  }

  t += 1;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// ---------- Optional: pause work when tab hidden (saves CPU) ----------
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    chars.forEach(el => { el.style.transform = "translateY(0)"; el.style.filter = "none"; });
  }
});
