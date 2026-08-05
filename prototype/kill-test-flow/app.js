const threads = [
  {
    id: "engine",
    title: "Engine spike",
    group: "active",
    meta: "Anchor · docs/architecture.md · 2h ago",
    needsYou: true,
    away: "While you were away · Agent left 2 claims to review on this Thread.",
    body: `<p>We should use an <strong>embedded index</strong> for Happy Desk so the graph, FTS, and vectors stay local and rebuildable.</p>
<p>Open question: does SurrealDB’s license block our distribution story, or is embedded app use fine?</p>
<p>Next: freeze a pack with the architecture note, the decision draft, and the engine evaluation — then ask the agent to propose the spike checklist.</p>`,
  },
  {
    id: "loom",
    title: "Loom UX copy",
    group: "active",
    meta: "Anchor · docs/UX-CONCEPT… · yesterday",
    needsYou: false,
    away: "",
    body: `<p>Signature interaction is <strong>Thread Resume</strong>. Weave is second chair — composition-time foresight, not the home screen.</p>
<p>Keep Home compassionate. No shame counts.</p>`,
  },
  {
    id: "pack",
    title: "Context Pack contract",
    group: "active",
    meta: "Anchor · .happy-desk/contexts · 3d ago",
    needsYou: false,
    away: "",
    body: `<p>Packs must be inspectable: pins, exclusions, budget, hashes. Ranked list alone must be enough to Act.</p>`,
  },
  {
    id: "readme",
    title: "README tone pass",
    group: "recent",
    meta: "Parked · 5d ago",
    needsYou: false,
    away: "",
    body: `<p>Continuity workspace framing — not “another AI chat.”</p>`,
  },
];

const packItems = [
  {
    id: "p1",
    title: "docs/architecture.md",
    why: "anchor · hop 0 · structural",
    pinned: true,
  },
  {
    id: "p2",
    title: "Decision: embedded index",
    why: "pin · authored · supports project",
    pinned: true,
  },
  {
    id: "p3",
    title: "docs/KNOWLEDGE-ENGINE.md",
    why: "hop 1 · links_to · lexical",
    pinned: true,
  },
  {
    id: "p4",
    title: "old-notes/neo4j-qdrant.md",
    why: "semantic 0.61 · excluded archive?",
    pinned: false,
  },
  {
    id: "p5",
    title: "Open Loop: BSL review",
    why: "hop 1 · may contradict · anticipatory off pack",
    pinned: false,
  },
];

const woven = [
  { text: "Decision: embedded index — supports", detail: "hop 1 · authored" },
  { text: "KNOWLEDGE-ENGINE.md — links_to", detail: "hop 1 · structural" },
];

const likely = [
  { text: "Open Loop: BSL review — may close", detail: "anticipatory · loop match" },
  { text: "Thread: Context Pack contract — may join", detail: "anticipatory · co-pin history" },
];

const state = {
  view: "home",
  threadId: "engine",
  tab: "pack",
};

const $ = (sel) => document.querySelector(sel);

function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    el.hidden = true;
  }, 2800);
}

function renderHome() {
  const active = $("#active-threads");
  const recent = $("#recent-threads");
  active.innerHTML = "";
  recent.innerHTML = "";
  for (const t of threads) {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "thread-row";
    btn.dataset.resume = t.id;
    btn.innerHTML = `<span class="title">${t.title}${
      t.needsYou ? '<span class="badge-need">needs you</span>' : ""
    }</span><span class="meta">${t.meta}</span>`;
    li.appendChild(btn);
    (t.group === "active" ? active : recent).appendChild(li);
  }
}

function renderWork() {
  const t = threads.find((x) => x.id === state.threadId) || threads[0];
  $("#thread-title").textContent = t.title;
  $("#thread-meta").textContent = t.meta;
  $("#editor-body").innerHTML = t.body;
  const away = $("#while-away");
  if (t.away) {
    away.hidden = false;
    away.textContent = t.away;
  } else {
    away.hidden = true;
  }
  renderPack();
  renderWeaveLists();
}

function renderPack() {
  const list = $("#pack-list");
  list.innerHTML = "";
  for (const item of packItems) {
    const li = document.createElement("li");
    if (item.pinned) li.classList.add("pinned");
    li.dataset.pack = item.id;
    li.innerHTML = `<strong>${item.title}</strong><span class="why">${item.why}</span>`;
    li.addEventListener("click", () => {
      state.tab = "why";
      $("#why-body").innerHTML = `<p><strong>${item.title}</strong></p><p class="why">${item.why}</p><p>Score components are mock data in Phase 0 — real Lens comes with the engine spike.</p>`;
      setTab("why");
    });
    list.appendChild(li);
  }
}

function renderWeaveLists() {
  const w = $("#woven-list");
  const l = $("#likely-list");
  w.innerHTML = woven
    .map((x) => `<li><div>${x.text}</div><div class="why">${x.detail}</div></li>`)
    .join("");
  l.innerHTML = likely
    .map(
      (x) =>
        `<li class="likely"><div>${x.text}</div><div class="why">${x.detail}</div></li>`
    )
    .join("");
}

function setTab(name) {
  state.tab = name;
  for (const tab of document.querySelectorAll(".tab")) {
    tab.classList.toggle("active", tab.dataset.tab === name);
  }
  $("#panel-why").hidden = name !== "why";
  $("#panel-weave").hidden = name !== "weave";
  $("#panel-pack").hidden = name !== "pack";
}

function showView(name) {
  state.view = name;
  $("#view-home").hidden = name !== "home";
  $("#view-work").hidden = name !== "work";
  $("#view-review").hidden = name !== "review";
  if (name === "home") renderHome();
  if (name === "work") {
    renderWork();
    setTab(state.tab === "weave" ? "pack" : state.tab);
  }
}

function openWeave() {
  showView("work");
  $("#weave-dock").hidden = false;
  setTab("weave");
  toast("Weave peek — woven + likely (anticipatory stays out of packs)");
}

function closeWeave() {
  $("#weave-dock").hidden = true;
  $("#editor-body").focus();
}

document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-goto],[data-resume],[data-action],[data-tab]");
  if (!t) return;

  if (t.dataset.resume) {
    state.threadId = t.dataset.resume;
    state.tab = "pack";
    closeWeave();
    showView("work");
    toast("Thread resumed · cursor restored (stub) · ≤2 clicks from Home");
    return;
  }

  if (t.dataset.goto === "home") {
    closeWeave();
    showView("home");
    return;
  }
  if (t.dataset.goto === "work") {
    showView("work");
    return;
  }
  if (t.dataset.goto === "pack") {
    showView("work");
    setTab("pack");
    return;
  }
  if (t.dataset.goto === "review") {
    closeWeave();
    showView("review");
    toast("Pack frozen (stub) · agent run simulated");
    return;
  }

  if (t.dataset.tab) {
    setTab(t.dataset.tab);
    if (t.dataset.tab === "weave") openWeave();
    return;
  }

  if (t.dataset.action === "capture") {
    toast("Captured → Open Loop (inbox) · ≤2s · no ontology pick");
    return;
  }
  if (t.dataset.action === "weave") {
    openWeave();
    return;
  }
  if (t.dataset.action === "close-weave") {
    closeWeave();
    setTab("pack");
  }
});

$("#show-all").addEventListener("click", () => {
  const el = $("#all-loops");
  el.hidden = !el.hidden;
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeWeave();
  }
});

showView("home");
