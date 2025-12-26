// Fix: navigate AFTER the cover animation finishes (i.e., when all bars are fully scaleX(1))

function barsZoomTransition({
  bars = 8,
  inMs = 600,
  coverHoldMs = 400,
  outMs = 600,
  hideAfterMs = 80
} = {}) {
  const wipe = document.getElementById("wipe");
  if (!wipe) throw new Error("Missing #wipe element");

  buildBars(wipe, bars);
  const barEls = [...wipe.children];

  wipe.style.opacity = "1";

  const stIn = inMs / (bars + 6);
  const stOut = outMs / (bars + 6);

  // cover
  barEls.forEach((b, i) => {
    b.animate(
      [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
      { duration: inMs, delay: i * stIn, easing: "cubic-bezier(.2,.9,.2,1)", fill: "forwards" }
    );
  });

  // IMPORTANT: cover is only guaranteed complete after the last bar finishes
  const coverDoneAt = inMs + (bars - 1) * stIn;

  // reveal
  const startRevealAt = coverDoneAt + coverHoldMs;
  barEls.forEach((b, i) => {
    b.animate(
      [{ transform: "scaleX(1)" }, { transform: "scaleX(0)" }],
      { duration: outMs, delay: startRevealAt + i * stOut, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" }
    );
  });

  const total = startRevealAt + outMs + (bars - 1) * stOut + hideAfterMs;
  setTimeout(() => (wipe.style.opacity = "0"), total);

  return { total, coverDoneAt, startRevealAt };
}

function buildBars(wipe, bars) {
  wipe.style.gridTemplateRows = `repeat(${bars}, 1fr)`;
  wipe.innerHTML = "";
  for (let i = 0; i < bars; i++) {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.transformOrigin = i % 2 === 0 ? "left center" : "right center";
    wipe.appendChild(bar);
  }
}

// Navigate only when fully covered (no chance to show the next page early):
// const tr = barsZoomTransition({ bars: 8, coverHoldMs: 300 });
// setTimeout(() => (window.location.href = "../index.html"), tr.coverDoneAt + 50);



// REVERSE ANIMATIONS (for load ins)
function playReverseTransition({ bars = 10, outMs = 800 } = {}) {
  const wipe = document.getElementById("wipe");
  wipe.style.opacity = "0";                 // keep hidden while building
  wipe.style.gridTemplateRows = `repeat(${bars}, 1fr)`;
  wipe.innerHTML = "";

  for (let i = 0; i < bars; i++) {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.transformOrigin = i % 2 === 0 ? "left center" : "right center";
    bar.style.transform = "scaleX(1)";      // start covered for reverse
    wipe.appendChild(bar);
  }

  // show only after bars exist
  wipe.style.opacity = "1";

  const barEls = [...wipe.children];
  const stagger = outMs / (bars + 6);

  barEls.forEach((b, i) => {
    b.animate(
      [{ transform: "scaleX(1)" }, { transform: "scaleX(0)" }],
      { duration: outMs, delay: i * stagger, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" }
    );
  });

  const total = outMs + (bars - 1) * stagger + 50;
  setTimeout(() => (wipe.style.opacity = "0"), total);
}

window.addEventListener("load", () => playReverseTransition());