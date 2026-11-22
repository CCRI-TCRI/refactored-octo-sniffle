/* Stillwater: a small daily-ritual app for mental health.
   Everything is stored on the device in localStorage. No accounts, no server. */

const STORE_KEY = "stillwater.v1";

const HABITS = {
  water:    { name: "Drink a glass of water", emoji: "💧", mins: 1 },
  breathe:  { name: "Two minutes of slow breathing", emoji: "🌬", mins: 2, tool: "breathe" },
  intent:   { name: "Set one intention for today", emoji: "🎯", mins: 2, tool: "journal", prompt: "What's one thing that would make today feel okay?" },
  sun:      { name: "Get some daylight", emoji: "🌤", mins: 10 },
  move:     { name: "Move your body", emoji: "🚶", mins: 15 },
  checkin:  { name: "Mood check-in", emoji: "◐", mins: 1, tool: "mood" },
  ground:   { name: "5-4-3-2-1 grounding", emoji: "🌿", mins: 3, tool: "ground" },
  reach:    { name: "Message someone you like", emoji: "💬", mins: 3 },
  screens:  { name: "Phone down an hour before bed", emoji: "📵", mins: 0 },
  grateful: { name: "Write three good things", emoji: "📓", mins: 5, tool: "journal", prompt: "Three things that went alright today, even small ones:" },
  unload:   { name: "Brain dump your worries", emoji: "🗂", mins: 5, tool: "journal", prompt: "Get it out of your head. What's on your mind right now?" },
  stretch:  { name: "Gentle stretch", emoji: "🧘", mins: 5 },
};

const RITUALS = [
  { id: "morning",   title: "Morning reset",   time: "Start of the day" },
  { id: "afternoon", title: "Midday pause",    time: "When things get busy" },
  { id: "evening",   title: "Wind down",       time: "Before sleep" },
];

const DEFAULT_RITUALS = {
  morning:   ["water", "breathe", "intent"],
  afternoon: ["checkin", "sun"],
  evening:   ["screens", "grateful"],
};

const GOALS = [
  { id: "anxiety", label: "Worry less",           sub: "Racing thoughts, feeling on edge" },
  { id: "mood",    label: "Lift my mood",         sub: "Low energy, flat days" },
  { id: "sleep",   label: "Sleep better",         sub: "Can't switch off at night" },
  { id: "self",    label: "Be kinder to myself",  sub: "Harsh inner voice" },
];

const JOURNEYS = [
  {
    id: "calm", title: "Calmer Mind", goal: "anxiety",
    blurb: "Seven short steps for when your head won't stop spinning.",
    steps: [
      { title: "Notice the spin", text: "Anxiety usually shows up in your body before you put a name to it. Tight chest, shallow breathing, a jaw you didn't know you were clenching. Today the only job is to notice. When you feel it, say to yourself: \"there it is.\" You don't have to fix anything.", habit: "checkin" },
      { title: "Breathe out longer than in", text: "A longer exhale tells your nervous system it's safe to slow down. Try in for 4, out for 6. It feels too simple to work, and that's sort of the point. Do two minutes of it this morning.", habit: "breathe" },
      { title: "Come back to the room", text: "When thoughts run ahead to things that haven't happened, your senses can pull you back. Name what you can see, hear and touch right now. It's called grounding and you can do it anywhere, even in a meeting.", habit: "ground" },
      { title: "Give worries a parking spot", text: "Worries love to show up at 2am. Give them a set time earlier in the day instead. Write everything down for five minutes, then close the notebook. If they come back later, tell them they've had their turn.", habit: "unload" },
      { title: "Move it through", text: "Anxious energy needs somewhere to go. A brisk walk counts. So does dancing in your kitchen. Fifteen minutes is plenty.", habit: "move" },
      { title: "Don't do it alone", text: "Worry gets bigger in isolation. Send a message to someone today. It doesn't have to be about how you feel. Just stay connected.", habit: "reach" },
      { title: "Look how far you came", text: "Scroll back through your mood check-ins from this week. Not to judge them, just to notice patterns. What helped? Keep that. You've built a small toolkit now, and it's yours." },
    ],
  },
  {
    id: "sleep", title: "Quiet Nights", goal: "sleep",
    blurb: "Build an evening that makes sleep easier to find.",
    steps: [
      { title: "Light in the morning", text: "Good sleep starts in the morning. Daylight in your eyes early on helps set your body clock. Ten minutes outside, even on a grey day, does more than you'd expect.", habit: "sun" },
      { title: "A screen curfew", text: "It's not just the blue light. It's the endless stuff to react to. Put your phone somewhere out of reach an hour before bed. Charge it in another room if you can.", habit: "screens" },
      { title: "Empty your head first", text: "If you lie down and your brain starts making lists, give it a list before bed instead. Write out tomorrow's to-dos and anything bugging you.", habit: "unload" },
      { title: "Loosen up", text: "A few minutes of slow stretching tells your body the day is done. Nothing fancy. Neck rolls, a forward fold, lying with your legs up the wall.", habit: "stretch" },
      { title: "End on something good", text: "Writing down three good things shifts what you're thinking about as you drift off. It also gets easier to spot them the more you do it.", habit: "grateful" },
    ],
  },
  {
    id: "kind", title: "Kinder Voice", goal: "self",
    blurb: "Learn to talk to yourself like you'd talk to a friend.",
    steps: [
      { title: "Catch the critic", text: "Most of us have a voice that's quick to point out what we did wrong. Today, just catch it in the act. Jot down one thing it said. Seeing it in writing often makes it sound less true.", habit: "checkin" },
      { title: "The friend test", text: "Take what your inner critic said and imagine a friend said it about themselves. What would you tell them? Write that down, then read it back as if it's for you.", habit: "intent" },
      { title: "Small wins count", text: "Getting out of bed on a hard day is a win. So is drinking water. Notice the small stuff you do and give yourself credit for it.", habit: "grateful" },
      { title: "Rest isn't earned", text: "You don't have to finish everything before you're allowed to stop. Pick a short break today and take it without guilt.", habit: "stretch" },
      { title: "Keep going", text: "Being kind to yourself is a habit, not a mood. Some days it'll be easy and some days it won't. Both are fine. Keep showing up." },
    ],
  },
];

const MOODS = [
  { v: 1, face: "😞", label: "Rough",  color: "#c98aa3" },
  { v: 2, face: "😕", label: "Low",    color: "#a79bd8" },
  { v: 3, face: "😐", label: "Okay",   color: "#7fb2e5" },
  { v: 4, face: "🙂", label: "Good",   color: "#7fb7a4" },
  { v: 5, face: "😄", label: "Great",  color: "#f2c46d" },
];
const MOOD_TAGS = ["Work", "Sleep", "Family", "Friends", "Health", "Money", "Alone time", "Exercise", "Weather", "Food"];

const COACH_LINES = [
  "You don't need a perfect day. You just need the next small step.",
  "Feelings are like weather. This one will pass too.",
  "Showing up on a bad day counts more than showing up on a good one.",
  "If all you did today was get through it, that's enough.",
  "Small things done often beat big things done once.",
  "Be as patient with yourself as you would be with a friend.",
  "Rest is part of the work, not a break from it.",
];

/* ---------- state ---------- */

const todayKey = (d = new Date()) => {
  const z = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
};

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* storage blocked, run in memory */ }
  return null;
}

let state = load() || {
  name: "",
  goals: [],
  rituals: structuredClone(DEFAULT_RITUALS),
  done: {},
  moods: [],
  journals: [],
  journey: "calm",
  journeyProgress: {},
  journeyLastDay: {},
};

function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
}

/* ---------- helpers ---------- */

const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function toast(msg) {
  document.querySelectorAll(".toast").forEach((old) => old.remove());
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2200);
}

function doneToday() { return state.done[todayKey()] || []; }

function allHabitsToday() {
  return RITUALS.flatMap((r) => state.rituals[r.id] || []);
}

function streak() {
  let n = 0;
  const d = new Date();
  if (!(state.done[todayKey(d)] || []).length) d.setDate(d.getDate() - 1);
  while ((state.done[todayKey(d)] || []).length) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

function toggleHabit(id) {
  const k = todayKey();
  const list = state.done[k] || [];
  const i = list.indexOf(id);
  if (i >= 0) list.splice(i, 1);
  else list.push(id);
  state.done[k] = list;
  save();
  if (i < 0) {
    const total = allHabitsToday().length;
    const did = allHabitsToday().filter((h) => list.includes(h)).length;
    if (did === total) toast("Everything done today. Nice one 🌱");
    else toast("Ticked off ✓");
  }
}

function markHabitDone(id) {
  if (!doneToday().includes(id) && allHabitsToday().includes(id)) toggleHabit(id);
}

/* ---------- header ---------- */

function renderHeader() {
  const now = new Date();
  $("#today-date").textContent = now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  const h = now.getHours();
  const part = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  $("#greeting").textContent = state.name ? `${part}, ${state.name}` : part;
}

/* ---------- views ---------- */

let currentTab = "today";

function render() {
  renderHeader();
  const v = $("#view");
  if (currentTab === "today") v.innerHTML = viewToday();
  if (currentTab === "journey") v.innerHTML = viewJourney();
  if (currentTab === "mood") v.innerHTML = viewMood();
  if (currentTab === "tools") v.innerHTML = viewTools();
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === currentTab));
}

function ring(pct) {
  const r = 32, c = 2 * Math.PI * r;
  return `<div class="ring">
    <svg width="76" height="76" viewBox="0 0 76 76" aria-hidden="true">
      <circle cx="38" cy="38" r="${r}" fill="none" stroke="#f0e8db" stroke-width="8"/>
      <circle cx="38" cy="38" r="${r}" fill="none" stroke="#ef8a6f" stroke-width="8" stroke-linecap="round"
        stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - pct)}" style="transition:stroke-dashoffset .5s"/>
    </svg>
    <div class="ring-label">${Math.round(pct * 100)}%</div>
  </div>`;
}

function viewToday() {
  const all = allHabitsToday();
  const done = doneToday();
  const did = all.filter((h) => done.includes(h)).length;
  const pct = all.length ? did / all.length : 0;
  const s = streak();
  const dayIdx = Math.floor(Date.now() / 86400000);
  const coach = COACH_LINES[dayIdx % COACH_LINES.length];

  const j = JOURNEYS.find((x) => x.id === state.journey) || JOURNEYS[0];
  const prog = state.journeyProgress[j.id] || 0;
  const next = j.steps[prog];

  let html = `
    <div class="card hero">
      ${ring(pct)}
      <div>
        <h2>${did === all.length && all.length ? "All done for today" : `${did} of ${all.length} done`}</h2>
        <p>${pct === 1 ? "Go easy on yourself for the rest of the day." : "Small steps. Tap a habit when you've done it."}</p>
        ${s ? `<span class="streak">🔥 ${s} day${s > 1 ? "s" : ""} in a row</span>` : ""}
      </div>
    </div>`;

  if (next) {
    html += `
    <button class="card" style="width:100%;text-align:left" data-action="open-step" data-journey="${j.id}" data-step="${prog}">
      <p class="eyebrow">${esc(j.title)} · Step ${prog + 1} of ${j.steps.length}</p>
      <h2>${esc(next.title)}</h2>
      <p>Tap to read today's step. Takes about a minute.</p>
    </button>`;
  }

  for (const r of RITUALS) {
    const ids = state.rituals[r.id] || [];
    const rDone = ids.filter((h) => done.includes(h)).length;
    html += `<div class="card ritual ${r.id}">
      <div class="ritual-head"><div><h3>${r.title}</h3><small>${r.time}</small></div><small>${rDone}/${ids.length}</small></div>`;
    if (!ids.length) html += `<div class="habit"><div class="habit-body habit-meta">Nothing here yet.</div></div>`;
    for (const id of ids) {
      const h = HABITS[id];
      if (!h) continue;
      const isDone = done.includes(id);
      html += `<div class="habit ${isDone ? "done" : ""}">
        <span class="habit-emoji">${h.emoji}</span>
        <div class="habit-body">
          <div class="habit-name">${esc(h.name)}</div>
          <div class="habit-meta">${h.mins ? `${h.mins} min` : "Anytime"}${h.tool && !isDone ? ` · <button class="link-btn" data-action="tool" data-tool="${h.tool}" data-habit="${id}">Start</button>` : ""}</div>
        </div>
        <button class="check" data-action="toggle" data-habit="${id}" aria-label="${isDone ? "Mark not done" : "Mark done"}: ${esc(h.name)}">${isDone ? "✓" : ""}</button>
      </div>`;
    }
    html += `<div class="ritual-foot"><button class="link-btn" data-action="edit-ritual" data-ritual="${r.id}">+ Edit habits</button></div></div>`;
  }

  html += `<div class="card coach"><div class="coach-avatar">S</div><div><p class="eyebrow">A note for today</p><p>${coach}</p></div></div>`;
  return html;
}

function viewJourney() {
  const j = JOURNEYS.find((x) => x.id === state.journey) || JOURNEYS[0];
  const prog = state.journeyProgress[j.id] || 0;
  const doneToday = state.journeyLastDay[j.id] === todayKey();

  let html = `<div class="journey-picker">${JOURNEYS.map((x) =>
    `<button class="chip ${x.id === j.id ? "active" : ""}" data-action="pick-journey" data-journey="${x.id}">${esc(x.title)}</button>`).join("")}</div>`;

  html += `<div class="journey-cover">
    <p class="eyebrow" style="color:var(--gold)">Your journey</p>
    <h2>${esc(j.title)}</h2>
    <p>${esc(j.blurb)}</p>
    <div class="bar"><span style="width:${(prog / j.steps.length) * 100}%"></span></div>
    <p style="font-size:13px;margin-top:8px">${prog} of ${j.steps.length} steps done${doneToday && prog < j.steps.length ? " · next one unlocks tomorrow" : ""}</p>
  </div>`;

  j.steps.forEach((st, i) => {
    const status = i < prog ? "done" : i === prog && !doneToday ? "current" : "locked";
    html += `<button class="step ${status}" ${status === "locked" ? "disabled" : ""} data-action="open-step" data-journey="${j.id}" data-step="${i}">
      <span class="step-num">${status === "done" ? "✓" : i + 1}</span>
      <div><h3>${esc(st.title)}</h3><p>${status === "locked" ? "Locked for now" : st.habit ? `Adds: ${esc(HABITS[st.habit].name)}` : "Reflection"}</p></div>
    </button>`;
  });

  if (prog >= j.steps.length) {
    html += `<div class="card coach"><div class="coach-avatar">S</div><div><p class="eyebrow">Journey complete</p><p>You finished ${esc(j.title)}. Pick another one above whenever you're ready.</p></div></div>`;
  }
  return html;
}

let draftMood = { level: 0, tags: [] };

function viewMood() {
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const k = todayKey(d);
    const entries = state.moods.filter((m) => m.date === k);
    const avg = entries.length ? entries.reduce((a, b) => a + b.level, 0) / entries.length : 0;
    days.push({ k, avg, label: d.toLocaleDateString(undefined, { weekday: "narrow" }) });
  }

  let html = `<div class="card">
    <h2>How are you, really?</h2>
    <p>No right answer. Just pick the closest one.</p>
    <div class="moods">${MOODS.map((m) =>
      `<button class="mood-btn ${draftMood.level === m.v ? "active" : ""}" data-action="mood" data-level="${m.v}">
        <span class="mood-face" style="background:${m.color}33">${m.face}</span>${m.label}</button>`).join("")}
    </div>`;

  if (draftMood.level) {
    html += `<p style="margin-top:14px">What's it about?</p>
      <div class="tags">${MOOD_TAGS.map((t) =>
        `<button class="tag ${draftMood.tags.includes(t) ? "on" : ""}" data-action="mood-tag" data-tag="${t}">${t}</button>`).join("")}</div>
      <textarea id="mood-note" placeholder="Anything you want to get off your chest? (optional)"></textarea>
      <button class="btn" data-action="save-mood">Save check-in</button>`;
    if (draftMood.level <= 2) {
      html += `<button class="btn ghost" data-action="tool" data-tool="breathe">Try a breathing exercise first</button>`;
    }
  }
  html += `</div>`;

  html += `<div class="card"><h2>Last two weeks</h2>
    <div class="chart">${days.map((d) => {
      const m = MOODS[Math.round(d.avg) - 1];
      return `<div class="chart-col" title="${d.k}"><div class="chart-bar" style="height:${d.avg ? (d.avg / 5) * 100 : 3}%;background:${m ? m.color : "#eee"}"></div><span class="chart-day">${d.label}</span></div>`;
    }).join("")}</div></div>`;

  const recent = [...state.moods].reverse().slice(0, 8);
  html += `<div class="card"><h2>Recent check-ins</h2>`;
  if (!recent.length) html += `<p class="empty">Nothing yet. Your first check-in will show up here.</p>`;
  for (const e of recent) {
    const m = MOODS[e.level - 1];
    const when = new Date(e.ts).toLocaleString(undefined, { weekday: "short", hour: "numeric", minute: "2-digit" });
    html += `<div class="log-item"><span class="mood-face" style="background:${m.color}33">${m.face}</span>
      <div><strong>${m.label}</strong> <span class="habit-meta">· ${when}</span>
      ${e.tags.length ? `<p>${e.tags.map(esc).join(", ")}</p>` : ""}${e.note ? `<p style="color:var(--text)">${esc(e.note)}</p>` : ""}</div></div>`;
  }
  html += `</div>`;
  return html;
}

function viewTools() {
  const tools = [
    { id: "breathe", title: "Slow breathing", sub: "4 in, 6 out", ico: "🌬", bg: "linear-gradient(140deg,#6fb39e,#3f7f6d)" },
    { id: "ground",  title: "5-4-3-2-1",      sub: "Get out of your head", ico: "🌿", bg: "linear-gradient(140deg,#f3a36f,#d9734f)" },
    { id: "journal", title: "Journal",         sub: "Write it down", ico: "📓", bg: "linear-gradient(140deg,#7fb2e5,#4c78b0)" },
    { id: "box",     title: "Box breathing",   sub: "4-4-4-4 for panic", ico: "⬜", bg: "linear-gradient(140deg,#a79bd8,#6a5fb0)" },
  ];
  let html = `<div class="card"><h2>Your toolkit</h2><p>Quick things to reach for when it's a lot. Each one takes a few minutes.</p></div>
    <div class="tool-grid">${tools.map((t) =>
      `<button class="tool" style="background:${t.bg}" data-action="tool" data-tool="${t.id}">
        <span class="tool-ico">${t.ico}</span><div><h3>${t.title}</h3><span>${t.sub}</span></div></button>`).join("")}</div>`;

  html += `<h2 class="section-title">Your journal</h2>`;
  const js = [...state.journals].reverse().slice(0, 10);
  html += `<div class="card">`;
  if (!js.length) html += `<p class="empty">Entries you write will be kept here, only on this device.</p>`;
  for (const e of js) {
    html += `<div class="log-item"><div><span class="habit-meta">${new Date(e.ts).toLocaleDateString(undefined, { month: "short", day: "numeric" })} · ${esc(e.prompt)}</span><p style="color:var(--text)">${esc(e.text)}</p></div></div>`;
  }
  html += `</div>`;

  html += `<div class="card"><h2>Settings</h2>
    <button class="btn ghost" data-action="export">Download my data</button>
    <button class="btn ghost" data-action="reset" style="color:var(--danger)">Erase everything</button></div>`;
  return html;
}

/* ---------- sheet ---------- */

let sheetCleanup = null;

function openSheet(html, onMount) {
  $("#sheet-body").innerHTML = html;
  $("#sheet").hidden = false;
  $("#sheet-backdrop").hidden = false;
  document.body.style.overflow = "hidden";
  sheetCleanup = onMount ? onMount($("#sheet-body")) : null;
}

function closeSheet() {
  if (typeof sheetCleanup === "function") sheetCleanup();
  sheetCleanup = null;
  $("#sheet").hidden = true;
  $("#sheet-backdrop").hidden = true;
  document.body.style.overflow = "";
  render();
}

function openStep(jid, idx) {
  const j = JOURNEYS.find((x) => x.id === jid);
  const st = j.steps[idx];
  const prog = state.journeyProgress[jid] || 0;
  const isCurrent = idx === prog && state.journeyLastDay[jid] !== todayKey();
  const h = st.habit ? HABITS[st.habit] : null;
  const already = h && RITUALS.some((r) => state.rituals[r.id].includes(st.habit));

  openSheet(`<div class="lesson">
    <p class="eyebrow">${esc(j.title)} · Step ${idx + 1}</p>
    <h2>${esc(st.title)}</h2>
    <p>${esc(st.text)}</p>
    ${h ? `<div class="card" style="margin-top:16px;display:flex;gap:12px;align-items:center">
      <span class="habit-emoji">${h.emoji}</span><div><strong>${esc(h.name)}</strong><p style="font-size:14px">${already ? "Already in your day" : "Gets added to your daily rituals"}</p></div></div>` : ""}
    ${isCurrent ? `<button class="btn" id="step-done">${h && !already ? "Add it and finish step" : "Finish step"}</button>` : ""}
  </div>`, (root) => {
    const b = $("#step-done", root);
    if (b) b.onclick = () => {
      if (h && !already) {
        const slot = ["screens", "grateful", "unload", "stretch"].includes(st.habit) ? "evening"
          : ["sun", "move", "checkin", "ground", "reach"].includes(st.habit) ? "afternoon" : "morning";
        state.rituals[slot].push(st.habit);
      }
      state.journeyProgress[jid] = idx + 1;
      state.journeyLastDay[jid] = todayKey();
      save();
      closeSheet();
      toast(idx + 1 === j.steps.length ? "Journey complete 🎉" : "Step done. See you tomorrow.");
    };
  });
}

function editRitual(rid) {
  const r = RITUALS.find((x) => x.id === rid);
  const cur = new Set(state.rituals[rid]);
  const list = () => Object.entries(HABITS).map(([id, h]) =>
    `<button class="habit ${cur.has(id) ? "done" : ""}" data-id="${id}" style="padding:12px 0">
      <span class="habit-emoji">${h.emoji}</span><div class="habit-body"><div class="habit-name" style="text-decoration:none;color:var(--text)">${esc(h.name)}</div></div>
      <span class="check">${cur.has(id) ? "✓" : ""}</span></button>`).join("");
  openSheet(`<h2>${r.title}</h2><p>Pick what you want in this part of your day. Keep it small. Three is plenty.</p>
    <div id="hl">${list()}</div><button class="btn" id="hsave">Save</button>`, (root) => {
    root.addEventListener("click", (e) => {
      const b = e.target.closest("[data-id]");
      if (b) {
        const id = b.dataset.id;
        cur.has(id) ? cur.delete(id) : cur.add(id);
        $("#hl", root).innerHTML = list();
      }
    });
    $("#hsave", root).onclick = () => {
      state.rituals[rid] = Object.keys(HABITS).filter((id) => cur.has(id));
      save();
      closeSheet();
    };
  });
}

/* ---------- tools ---------- */

function toolBreathe(habitId, pattern) {
  const phases = pattern === "box"
    ? [["Breathe in", 4, 1], ["Hold", 4, 1], ["Breathe out", 4, 0.6], ["Hold", 4, 0.6]]
    : [["Breathe in", 4, 1], ["Breathe out", 6, 0.6]];
  const cycleLen = phases.reduce((a, p) => a + p[1], 0);
  const totalCycles = Math.ceil(120 / cycleLen);

  openSheet(`<h2>${pattern === "box" ? "Box breathing" : "Slow breathing"}</h2>
    <p>${pattern === "box" ? "Good for when panic is rising. Follow the circle." : "Let your out-breath be a little longer than your in-breath."}</p>
    <div class="breath-wrap"><div class="breath-circle" id="bc">Ready?</div></div>
    <p class="breath-count" id="bn">About two minutes</p>
    <button class="btn" id="bgo">Start</button>`, (root) => {
    let timer = null, alive = true;
    const circle = $("#bc", root), count = $("#bn", root), go = $("#bgo", root);
    go.onclick = () => {
      go.hidden = true;
      let cycle = 0, p = 0;
      const step = () => {
        if (!alive) return;
        if (p === phases.length) { p = 0; cycle++; }
        if (cycle >= totalCycles) {
          circle.textContent = "Well done";
          circle.style.transform = "scale(.8)";
          count.textContent = "Notice how you feel now.";
          if (habitId) markHabitDone(habitId);
          else markHabitDone("breathe");
          return;
        }
        const [label, secs, scale] = phases[p];
        circle.textContent = label;
        circle.style.transitionDuration = `${secs}s`;
        circle.style.transform = `scale(${scale})`;
        count.textContent = `Round ${cycle + 1} of ${totalCycles}`;
        p++;
        timer = setTimeout(step, secs * 1000);
      };
      step();
    };
    return () => { alive = false; clearTimeout(timer); };
  });
}

function toolGround(habitId) {
  const steps = [
    [5, "things you can see", "Look around slowly. Name them out loud or in your head."],
    [4, "things you can feel", "Your feet on the floor. The fabric of your clothes. The air on your skin."],
    [3, "things you can hear", "Close by and far away. Even the quiet ones."],
    [2, "things you can smell", "If nothing comes, think of two smells you like."],
    [1, "thing you can taste", "Or one kind thing you can say to yourself."],
  ];
  let i = 0;
  const draw = (root) => {
    if (i >= steps.length) {
      root.innerHTML = `<div class="ground-step"><div class="ground-big">✓</div><h3>You're here</h3><p>Take one slow breath before you carry on.</p><button class="btn" id="gx">Done</button></div>`;
      if (habitId) markHabitDone(habitId); else markHabitDone("ground");
      $("#gx", root).onclick = closeSheet;
      return;
    }
    const [n, what, tip] = steps[i];
    root.innerHTML = `<div class="ground-step"><div class="ground-big">${n}</div><h3>${what}</h3><p>${tip}</p>
      <div class="dots">${steps.map((_, k) => `<i class="${k <= i ? "on" : ""}"></i>`).join("")}</div>
      <button class="btn" id="gn">${i === steps.length - 1 ? "Finish" : "Next"}</button></div>`;
    $("#gn", root).onclick = () => { i++; draw(root); };
  };
  openSheet(`<h2>Come back to now</h2><div id="gr"></div>`, (root) => draw($("#gr", root)));
}

const JOURNAL_PROMPTS = [
  "What's taking up the most space in your head today?",
  "What's one thing you'd tell a friend who felt like you do right now?",
  "When did you feel most like yourself this week?",
  "What do you need more of at the moment? What do you need less of?",
  "What's something small you're looking forward to?",
];

function toolJournal(habitId) {
  const h = habitId ? HABITS[habitId] : null;
  let prompt = h && h.prompt ? h.prompt : JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)];
  openSheet(`<h2>Journal</h2><p id="jp">${esc(prompt)}</p>
    ${h ? "" : `<button class="link-btn" id="jshuffle">Different question</button>`}
    <textarea id="jt" style="min-height:180px;margin-top:12px" placeholder="Just start typing. Nobody else sees this."></textarea>
    <button class="btn" id="js">Save entry</button>`, (root) => {
    const sh = $("#jshuffle", root);
    if (sh) sh.onclick = () => {
      prompt = JOURNAL_PROMPTS[(JOURNAL_PROMPTS.indexOf(prompt) + 1) % JOURNAL_PROMPTS.length];
      $("#jp", root).textContent = prompt;
    };
    $("#js", root).onclick = () => {
      const text = $("#jt", root).value.trim();
      if (!text) { toast("Write something first"); return; }
      state.journals.push({ ts: Date.now(), prompt, text });
      if (habitId) markHabitDone(habitId);
      save();
      closeSheet();
      toast("Saved to your journal");
    };
  });
}

function openTool(tool, habitId) {
  if (tool === "breathe") return toolBreathe(habitId);
  if (tool === "box") return toolBreathe(habitId, "box");
  if (tool === "ground") return toolGround(habitId);
  if (tool === "journal") return toolJournal(habitId);
  if (tool === "mood") { currentTab = "mood"; render(); window.scrollTo(0, 0); }
}

function openHelp() {
  openSheet(`<h2>You don't have to handle this alone</h2>
    <p>If you're thinking about hurting yourself or you're in danger, please reach out to someone right now.</p>
    <a class="help-line urgent" href="tel:911"><strong>Emergency: 911</strong><span>If you're in immediate danger (US). Use your local emergency number elsewhere.</span></a>
    <a class="help-line" href="tel:988"><strong>Call or text 988</strong><span>Suicide &amp; Crisis Lifeline, US. Free, 24/7.</span></a>
    <a class="help-line" href="sms:741741?body=HOME"><strong>Text HOME to 741741</strong><span>Crisis Text Line, US, UK and Canada.</span></a>
    <a class="help-line" href="https://findahelpline.com" target="_blank" rel="noopener"><strong>Outside the US?</strong><span>findahelpline.com lists free lines in your country.</span></a>
    <p style="font-size:13px;margin-top:14px">Stillwater is a self-care tool, not a replacement for a therapist or doctor.</p>
    <button class="btn ghost" id="hb">Do a breathing exercise instead</button>`, (root) => {
    $("#hb", root).onclick = () => { closeSheet(); toolBreathe(null, "box"); };
  });
}

/* ---------- onboarding ---------- */

function onboarding() {
  const wrap = document.createElement("div");
  wrap.className = "onboard";
  document.body.appendChild(wrap);
  let step = 0;
  const goals = new Set();

  const draw = () => {
    if (step === 0) {
      wrap.innerHTML = `<div class="onboard-inner"><div class="moon">🌙</div>
        <h1>A calmer day, one small step at a time.</h1>
        <p>Stillwater helps you build little daily rituals that look after your head. Breathing, check-ins, a bit of writing. Nothing fancy.</p>
        <p>Everything stays on your phone.</p>
        <input id="ob-name" placeholder="What should we call you?" maxlength="30" autocomplete="given-name">
        <button class="btn" id="ob-next">Let's go</button></div>`;
      $("#ob-next", wrap).onclick = () => { state.name = $("#ob-name", wrap).value.trim(); step = 1; draw(); };
    } else {
      wrap.innerHTML = `<div class="onboard-inner">
        <h1>What would you like help with?</h1><p>Pick as many as you like. You can change this later.</p>
        ${GOALS.map((g) => `<button class="goal ${goals.has(g.id) ? "on" : ""}" data-g="${g.id}"><div>${g.label}<small>${g.sub}</small></div></button>`).join("")}
        <button class="btn" id="ob-done">${goals.size ? "Build my day" : "Skip for now"}</button></div>`;
      wrap.querySelectorAll("[data-g]").forEach((b) => b.onclick = () => {
        goals.has(b.dataset.g) ? goals.delete(b.dataset.g) : goals.add(b.dataset.g);
        draw();
      });
      $("#ob-done", wrap).onclick = () => {
        state.goals = [...goals];
        const match = JOURNEYS.find((j) => goals.has(j.goal));
        state.journey = match ? match.id : "calm";
        if (goals.has("sleep") && !state.rituals.evening.includes("unload")) state.rituals.evening.push("unload");
        if (goals.has("mood") && !state.rituals.afternoon.includes("move")) state.rituals.afternoon.push("move");
        state.onboarded = true;
        save();
        wrap.remove();
        render();
      };
    }
  };
  draw();
}

/* ---------- events ---------- */

document.addEventListener("click", (e) => {
  const tab = e.target.closest(".tab");
  if (tab) { currentTab = tab.dataset.tab; render(); window.scrollTo(0, 0); return; }

  const a = e.target.closest("[data-action]");
  if (!a || !$("#view").contains(a)) return;
  const d = a.dataset;
  switch (d.action) {
    case "toggle": toggleHabit(d.habit); render(); break;
    case "tool": openTool(d.tool, d.habit); break;
    case "edit-ritual": editRitual(d.ritual); break;
    case "open-step": openStep(d.journey, Number(d.step)); break;
    case "pick-journey": state.journey = d.journey; save(); render(); break;
    case "mood": draftMood.level = Number(d.level); render(); break;
    case "mood-tag": {
      const note = $("#mood-note")?.value || "";
      const t = draftMood.tags;
      t.includes(d.tag) ? t.splice(t.indexOf(d.tag), 1) : t.push(d.tag);
      render();
      $("#mood-note").value = note;
      break;
    }
    case "save-mood": {
      state.moods.push({ date: todayKey(), ts: Date.now(), level: draftMood.level, tags: [...draftMood.tags], note: $("#mood-note").value.trim() });
      draftMood = { level: 0, tags: [] };
      markHabitDone("checkin");
      save();
      render();
      toast("Check-in saved");
      break;
    }
    case "export": {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `stillwater-${todayKey()}.json`;
      link.click();
      break;
    }
    case "reset":
      if (confirm("This deletes all your check-ins, journal entries and progress. Are you sure?")) {
        try { localStorage.removeItem(STORE_KEY); } catch (err) {}
        location.reload();
      }
      break;
  }
});

$("#sheet-close").onclick = closeSheet;
$("#sheet-backdrop").onclick = closeSheet;
$("#sos-btn").onclick = openHelp;
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#sheet").hidden) closeSheet(); });

render();
if (!state.onboarded) onboarding();

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
