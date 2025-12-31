/* =========================================================
   ADHD-CODED JS (tiny but powerful)
   - Progress bar
   - Character counter
   - “Quick chips” that auto-fill message
   - Autosave draft (localStorage)
   - Haptic feedback on mobile (vibrate)
   Works with your existing .contacts + .contact-form markup
   ========================================================= */

const form = document.querySelector(".contact-form");
if (!form) throw new Error("Missing .contact-form");

const fields = {
  name: form.querySelector("#name"),
  email: form.querySelector("#email"),
  reason: form.querySelector("#reason"),
  priority: form.querySelector("#priority"),
  timeline: form.querySelector("#timeline"),
  links: form.querySelector("#links"),
  message: form.querySelector("#message"),
};
const submitBtn = form.querySelector(".contact-submit");

/* ---------- Inject progress + chips + counter (no HTML changes needed) ---------- */
const progress = document.createElement("div");
progress.className = "contact-progress";
progress.innerHTML = `<span></span>`;
form.prepend(progress);

const chipRow = document.createElement("div");
chipRow.className = "chip-row";
chipRow.innerHTML = `
  <button type="button" class="chip" data-fill="Hey Quinton — quick question: ">quick question</button>
  <button type="button" class="chip" data-fill="Collab idea: ">collab idea</button>
  <button type="button" class="chip" data-fill="Opportunity: ">opportunity</button>
  <button type="button" class="chip" data-fill="Feedback: ">feedback</button>
  <button type="button" class="chip" data-fill="Here’s the link: ">add link</button>
`;
form.insertBefore(chipRow, form.querySelector(".form-row")); // puts chips near top

const counterRow = document.createElement("div");
counterRow.className = "char-row";
counterRow.innerHTML = `
  <div class="microcopy">Tip: 2–5 sentences is perfect.</div>
  <div class="char-counter"><b>0</b>/600</div>
`;
fields.message.parentElement.appendChild(counterRow);

const counterNum = counterRow.querySelector(".char-counter b");
const progressBar = progress.querySelector("span");

/* ---------- Progress calculation ---------- */
const requiredEls = [fields.email, fields.reason, fields.message];
const allTrackEls = [fields.name, fields.email, fields.reason, fields.priority, fields.timeline, fields.links, fields.message];

function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }

function updateProgress() {
  // required completion counts more
  let score = 0;
  let total = 0;

  requiredEls.forEach(el => {
    total += 2;
    if (el && el.value && el.checkValidity()) score += 2;
  });

  allTrackEls.forEach(el => {
    if (!el || requiredEls.includes(el)) return;
    total += 1;
    if (el.value.trim().length > 0) score += 1;
  });

  const pct = clamp(Math.round((score / total) * 100), 0, 100);
  progressBar.style.width = pct + "%";
}

/* ---------- Character counter ---------- */
const MAX = 600;
fields.message.setAttribute("maxlength", String(MAX));

function updateCounter() {
  const len = fields.message.value.length;
  counterNum.textContent = String(len);
  // gentle warning near limit
  if (len > MAX - 80) {
    fields.message.style.borderColor = "rgba(255,193,7,0.55)";
  } else {
    fields.message.style.borderColor = "";
  }
}

/* ---------- Field “done” pop + haptics ---------- */
function popDone(el) {
  el.classList.remove("pt-done");
  void el.offsetWidth; // restart animation
  el.classList.add("pt-done");
  if (navigator.vibrate) navigator.vibrate(12);
}

/* ---------- Chips fill message ---------- */
chipRow.addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  const add = btn.dataset.fill || "";
  const msg = fields.message;
  msg.value = (msg.value ? msg.value + "\n" : "") + add;
  msg.focus();
  updateCounter();
  updateProgress();
  popDone(msg);
});

/* ---------- Autosave draft ---------- */
const KEY = "contact_draft_v1";
function saveDraft() {
  const payload = {};
  Object.keys(fields).forEach(k => payload[k] = (fields[k]?.value ?? ""));
  localStorage.setItem(KEY, JSON.stringify(payload));
}
function loadDraft() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return;
  try {
    const payload = JSON.parse(raw);
    Object.keys(fields).forEach(k => {
      if (fields[k] && typeof payload[k] === "string" && payload[k].length) fields[k].value = payload[k];
    });
  } catch {}
}
loadDraft();

/* ---------- Wire events ---------- */
allTrackEls.forEach(el => {
  if (!el) return;
  el.addEventListener("input", () => {
    updateProgress();
    if (el === fields.message) updateCounter();
    saveDraft();
  });
  el.addEventListener("change", () => {
    updateProgress();
    saveDraft();
    if (el.value && el.checkValidity?.()) popDone(el);
  });
});

/* Message counter init */
updateCounter();
updateProgress();

/* ---------- Cow tap = dopamine (tiny haptic + micro compliment) ---------- */
const cow = document.querySelector(".work-in-progress-image");
if (cow) {
  cow.addEventListener("click", () => {
    if (navigator.vibrate) navigator.vibrate([10, 20, 10]);
    // playful, minimal, not wordy:
    const msgs = ["moo.", "cow buff applied.", "message power +10."];
    cow.alt = msgs[Math.floor(Math.random() * msgs.length)];
    setTimeout(() => (cow.alt = "Work in Progress"), 800);
  });
}

/* ---------- Submit: validate + feedback ---------- */
form.addEventListener("submit", (e) => {
  // front-end validation feedback
  const bad = requiredEls.find(el => !el.checkValidity());
  if (bad) {
    e.preventDefault();
    form.classList.remove("sent");
    form.classList.add("shake");
    setTimeout(() => form.classList.remove("shake"), 450);
    bad.focus();
    if (navigator.vibrate) navigator.vibrate([25, 30, 25]);
    return;
  }

  // show “sending” state (bucket will handle the actual post)
  submitBtn.classList.add("sending");
  if (navigator.vibrate) navigator.vibrate(18);

  // if you use an external bucket that redirects, you won't see this,
  // but it still looks nice in cases where it stays on page:
  setTimeout(() => {
    form.classList.add("sent");
    localStorage.removeItem(KEY);
  }, 600);
});
