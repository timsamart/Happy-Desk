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

const commands = [
  { id: "home", label: "Go Home", keys: "G H", run: () => goHome() },
  { id: "capture", label: "Capture → Open Loop", keys: "C", run: () => capture() },
  { id: "weave", label: "Open Weave peek", keys: "W", run: () => openWeave() },
  { id: "pack", label: "Act / Pack tab", keys: "A", run: () => goPack() },
  { id: "run", label: "Freeze pack & run (stub)", keys: "Ctrl+Enter", run: () => freezeAndRun() },
  { id: "insert", label: "Insert mode (edit Source)", keys: "I", run: () => enterInsert() },
  { id: "help", label: "Keyboard help", keys: "?", run: () => openHelp() },
  { id: "resume-1", label: "Resume: Engine spike", keys: "1", run: () => resumeThread("engine") },
  { id: "resume-2", label: "Resume: Loom UX copy", keys: "2", run: () => resumeThread("loom") },
  { id: "resume-3", label: "Resume: Context Pack contract", keys: "3", run: () => resumeThread("pack") },
  { id: "review-home", label: "Review → Home (switch)", keys: "G H", run: () => goHome() },
];

const state = {
  view: "home",
  threadId: "engine",
  tab: "pack",
  mode: "command", // command | insert
  threadIndex: 0,
  packIndex: 0,
  pendingChord: null,
  paletteIndex: 0,
  paletteFilter: "",
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    el.hidden = true;
  }, 2600);
}

function isOverlayOpen() {
  return !$("#palette").hidden || !$("#help").hidden;
}

function isTypingTarget(el) {
  if (!el) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA") return true;
  if (el.isContentEditable) return true;
  return false;
}

function updateStatusline() {
  const mode = $("#status-mode");
  mode.textContent = state.mode.toUpperCase();
  mode.classList.toggle("insert", state.mode === "insert");
  $("#status-view").textContent = state.view;
  $("#status-chord").textContent = state.pendingChord
    ? `chord: ${state.pendingChord.toUpperCase()} …`
    : "";

  let hints = "";
  if (isOverlayOpen()) {
    hints = "Esc close";
  } else if (state.mode === "insert") {
    hints = "Esc command · Ctrl+K palette · Ctrl+Enter run";
  } else if (state.view === "home") {
    hints = "J/K select · Enter resume · C capture · ? help · Ctrl+K";
  } else if (state.view === "work") {
    hints = "I insert · W weave · A pack · 1/2/3 tabs · Ctrl+Enter run · G H home";
  } else if (state.view === "review") {
    hints = "Y/N knowledge · R resume · G H home · Esc thread";
  }
  $("#status-hints").textContent = hints;
}

function flatThreads() {
  return [
    ...threads.filter((t) => t.group === "active"),
    ...threads.filter((t) => t.group === "recent"),
  ];
}

function renderHome() {
  const active = $("#active-threads");
  const recent = $("#recent-threads");
  active.innerHTML = "";
  recent.innerHTML = "";
  const flat = flatThreads();
  flat.forEach((t, i) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "thread-row";
    btn.dataset.resume = t.id;
    btn.setAttribute("role", "option");
    btn.setAttribute("aria-selected", i === state.threadIndex ? "true" : "false");
    if (i === state.threadIndex) btn.classList.add("selected");
    btn.innerHTML = `<span class="title"><span class="idx">${i + 1}</span> ${t.title}${
      t.needsYou ? '<span class="badge-need">needs you</span>' : ""
    }</span><span class="meta">${t.meta}</span>`;
    li.appendChild(btn);
    (t.group === "active" ? active : recent).appendChild(li);
  });
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
  packItems.forEach((item, i) => {
    const li = document.createElement("li");
    if (item.pinned) li.classList.add("pinned");
    if (i === state.packIndex) li.classList.add("selected");
    li.dataset.pack = item.id;
    li.setAttribute("role", "option");
    li.setAttribute("aria-selected", i === state.packIndex ? "true" : "false");
    li.tabIndex = -1;
    li.innerHTML = `<strong>${item.title}</strong><span class="why">${item.why}</span>`;
    li.addEventListener("click", () => {
      state.packIndex = i;
      showPackWhy(item);
      renderPack();
    });
    list.appendChild(li);
  });
}

function showPackWhy(item) {
  state.tab = "why";
  $("#why-body").innerHTML = `<p><strong>${item.title}</strong></p><p class="why">${item.why}</p><p>Score components are mock data in Phase 0 — real Lens comes with the engine spike.</p>`;
  setTab("why");
}

function renderWeaveLists() {
  $("#woven-list").innerHTML = woven
    .map((x) => `<li><div>${x.text}</div><div class="why">${x.detail}</div></li>`)
    .join("");
  $("#likely-list").innerHTML = likely
    .map(
      (x) =>
        `<li class="likely"><div>${x.text}</div><div class="why">${x.detail}</div></li>`
    )
    .join("");
}

function setTab(name) {
  state.tab = name;
  for (const tab of $$(".tab")) {
    tab.classList.toggle("active", tab.dataset.tab === name);
    tab.setAttribute("aria-selected", tab.dataset.tab === name ? "true" : "false");
  }
  $("#panel-why").hidden = name !== "why";
  $("#panel-weave").hidden = name !== "weave";
  $("#panel-pack").hidden = name !== "pack";
  updateStatusline();
}

function showView(name) {
  state.view = name;
  $("#view-home").hidden = name !== "home";
  $("#view-work").hidden = name !== "work";
  $("#view-review").hidden = name !== "review";
  if (name === "home") {
    leaveInsert(false);
    renderHome();
    focusSelectedThread();
  }
  if (name === "work") {
    renderWork();
    if (state.tab === "weave" && $("#weave-dock").hidden) setTab("pack");
  }
  if (name === "review") leaveInsert(false);
  updateStatusline();
}

function focusSelectedThread() {
  const btn = $$(`.thread-row`)[state.threadIndex];
  if (btn) btn.focus();
}

function resumeThread(id) {
  const flat = flatThreads();
  const idx = flat.findIndex((t) => t.id === id);
  if (idx >= 0) state.threadIndex = idx;
  state.threadId = id;
  state.tab = "pack";
  closeWeave();
  closePalette();
  showView("work");
  leaveInsert(false);
  toast("Thread resumed · cursor restored (stub) · keyboard path ok");
}

function goHome() {
  closeWeave();
  closePalette();
  closeHelp();
  showView("home");
  toast("Home · COMMAND mode");
}

function goPack() {
  showView("work");
  setTab("pack");
  leaveInsert(false);
  toast("Pack / Act");
}

function freezeAndRun() {
  if (state.view !== "work" && state.view !== "review") {
    showView("work");
    setTab("pack");
  }
  closeWeave();
  closePalette();
  leaveInsert(false);
  showView("review");
  toast("Pack frozen (stub) · agent run simulated");
}

function capture() {
  toast("Captured → Open Loop (inbox) · ≤2s · no ontology pick");
}

function enterInsert() {
  if (state.view !== "work") showView("work");
  state.mode = "insert";
  closePalette();
  $("#editor-body").focus();
  updateStatusline();
  toast("INSERT · Esc returns to COMMAND");
}

function leaveInsert(focusEditor = true) {
  state.mode = "command";
  const ed = $("#editor-body");
  if (document.activeElement === ed) ed.blur();
  updateStatusline();
  if (focusEditor && state.view === "work") {
    /* stay unfocused so chords work */
  }
}

function openWeave() {
  closeHelp();
  closePalette();
  if (state.view !== "work") showView("work");
  leaveInsert(false);
  $("#weave-dock").hidden = false;
  setTab("weave");
  toast("Weave peek — Woven + Likely");
  updateStatusline();
}

function closeWeave() {
  const dock = $("#weave-dock");
  if (dock) dock.hidden = true;
  updateStatusline();
}

function openHelp() {
  closePalette();
  leaveInsert(false);
  $("#help").hidden = false;
  updateStatusline();
}

function closeHelp() {
  $("#help").hidden = true;
  updateStatusline();
}

function openPalette() {
  closeHelp();
  leaveInsert(false);
  state.paletteFilter = "";
  state.paletteIndex = 0;
  $("#palette").hidden = false;
  const input = $("#palette-input");
  input.value = "";
  input.focus();
  renderPalette();
  updateStatusline();
}

function closePalette() {
  $("#palette").hidden = true;
  updateStatusline();
}

function filteredCommands() {
  const q = state.paletteFilter.trim().toLowerCase();
  if (!q) return commands;
  return commands.filter(
    (c) =>
      c.label.toLowerCase().includes(q) ||
      c.keys.toLowerCase().includes(q) ||
      c.id.includes(q)
  );
}

function renderPalette() {
  const list = $("#palette-list");
  const items = filteredCommands();
  if (state.paletteIndex >= items.length) state.paletteIndex = Math.max(0, items.length - 1);
  list.innerHTML = items
    .map(
      (c, i) =>
        `<li role="option" class="${i === state.paletteIndex ? "selected" : ""}" data-cmd="${c.id}">
          <span>${c.label}</span><kbd>${c.keys}</kbd>
        </li>`
    )
    .join("");
}

function runPaletteSelected() {
  const items = filteredCommands();
  const c = items[state.paletteIndex];
  if (!c) return;
  closePalette();
  c.run();
}

function moveThread(delta) {
  const flat = flatThreads();
  state.threadIndex = (state.threadIndex + delta + flat.length) % flat.length;
  renderHome();
  focusSelectedThread();
  updateStatusline();
}

function movePack(delta) {
  state.packIndex = (state.packIndex + delta + packItems.length) % packItems.length;
  renderPack();
  updateStatusline();
}

function clearChordSoon() {
  clearTimeout(clearChordSoon._t);
  clearChordSoon._t = setTimeout(() => {
    state.pendingChord = null;
    updateStatusline();
  }, 900);
}

function handleCommandKey(e) {
  const key = e.key;
  const lower = key.length === 1 ? key.toLowerCase() : key;

  // Chord G H
  if (state.pendingChord === "g") {
    state.pendingChord = null;
    if (lower === "h") {
      e.preventDefault();
      goHome();
      return;
    }
    updateStatusline();
  }

  if (lower === "g") {
    e.preventDefault();
    state.pendingChord = "g";
    updateStatusline();
    clearChordSoon();
    return;
  }

  if (key === "?" || (e.shiftKey && key === "/")) {
    e.preventDefault();
    openHelp();
    return;
  }

  if (state.view === "home") {
    if (lower === "j" || key === "ArrowDown") {
      e.preventDefault();
      moveThread(1);
      return;
    }
    if (lower === "k" || key === "ArrowUp") {
      e.preventDefault();
      moveThread(-1);
      return;
    }
    if (key === "Enter") {
      e.preventDefault();
      resumeThread(flatThreads()[state.threadIndex].id);
      return;
    }
    if (/^[1-4]$/.test(key)) {
      e.preventDefault();
      const t = flatThreads()[Number(key) - 1];
      if (t) resumeThread(t.id);
      return;
    }
    if (lower === "o") {
      e.preventDefault();
      $("#show-all").click();
      return;
    }
  }

  if (state.view === "work") {
    if (lower === "i") {
      e.preventDefault();
      enterInsert();
      return;
    }
    if (lower === "w") {
      e.preventDefault();
      openWeave();
      return;
    }
    if (lower === "a") {
      e.preventDefault();
      goPack();
      return;
    }
    if (key === "1") {
      e.preventDefault();
      setTab("why");
      return;
    }
    if (key === "2") {
      e.preventDefault();
      openWeave();
      return;
    }
    if (key === "3") {
      e.preventDefault();
      goPack();
      return;
    }
    if (state.tab === "pack" && (lower === "j" || key === "ArrowDown")) {
      e.preventDefault();
      movePack(1);
      return;
    }
    if (state.tab === "pack" && (lower === "k" || key === "ArrowUp")) {
      e.preventDefault();
      movePack(-1);
      return;
    }
    if (state.tab === "pack" && key === "Enter") {
      e.preventDefault();
      showPackWhy(packItems[state.packIndex]);
      renderPack();
      return;
    }
  }

  if (state.view === "review") {
    if (lower === "r") {
      e.preventDefault();
      showView("work");
      return;
    }
    if (lower === "y") {
      e.preventDefault();
      toast("Knowledge accepted (stub)");
      return;
    }
    if (lower === "n") {
      e.preventDefault();
      toast("Kept proposed · stays out of default packs");
      return;
    }
  }

  if (lower === "c") {
    e.preventDefault();
    capture();
  }
}

document.addEventListener("click", (e) => {
  const t = e.target.closest(
    "[data-goto],[data-resume],[data-action],[data-tab],[data-cmd]"
  );
  if (!t) return;

  if (t.dataset.cmd) {
    const c = commands.find((x) => x.id === t.dataset.cmd);
    if (c) {
      closePalette();
      c.run();
    }
    return;
  }

  if (t.dataset.resume) {
    resumeThread(t.dataset.resume);
    return;
  }

  if (t.dataset.goto === "home") {
    goHome();
    return;
  }
  if (t.dataset.goto === "work") {
    showView("work");
    return;
  }
  if (t.dataset.goto === "pack") {
    goPack();
    return;
  }
  if (t.dataset.goto === "review") {
    freezeAndRun();
    return;
  }

  if (t.dataset.tab) {
    if (t.dataset.tab === "weave") openWeave();
    else {
      closeWeave();
      setTab(t.dataset.tab);
    }
    return;
  }

  if (t.dataset.action === "capture") capture();
  if (t.dataset.action === "weave") openWeave();
  if (t.dataset.action === "close-weave") {
    closeWeave();
    setTab("pack");
  }
  if (t.dataset.action === "palette") openPalette();
  if (t.dataset.action === "help") openHelp();
  if (t.dataset.action === "close-help") closeHelp();
  if (t.dataset.action === "accept-knowledge") toast("Knowledge accepted (stub)");
  if (t.dataset.action === "keep-proposed")
    toast("Kept proposed · stays out of default packs");
});

$("#show-all").addEventListener("click", () => {
  const el = $("#all-loops");
  el.hidden = !el.hidden;
});

$("#editor-body").addEventListener("focus", () => {
  state.mode = "insert";
  updateStatusline();
});

$("#editor-body").addEventListener("blur", () => {
  if (!$("#palette").hidden) return;
  state.mode = "command";
  updateStatusline();
});

$("#palette-input").addEventListener("input", (e) => {
  state.paletteFilter = e.target.value;
  state.paletteIndex = 0;
  renderPalette();
});

$("#palette-list").addEventListener("click", (e) => {
  const li = e.target.closest("[data-cmd]");
  if (!li) return;
  const c = commands.find((x) => x.id === li.dataset.cmd);
  if (c) {
    closePalette();
    c.run();
  }
});

document.addEventListener("keydown", (e) => {
  const meta = e.ctrlKey || e.metaKey;

  // Palette always
  if (meta && e.key.toLowerCase() === "k") {
    e.preventDefault();
    if (!$("#palette").hidden) closePalette();
    else openPalette();
    return;
  }

  if (meta && e.key === "Enter") {
    e.preventDefault();
    freezeAndRun();
    return;
  }

  // Palette navigation
  if (!$("#palette").hidden) {
    if (e.key === "Escape") {
      e.preventDefault();
      closePalette();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      state.paletteIndex++;
      renderPalette();
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      state.paletteIndex = Math.max(0, state.paletteIndex - 1);
      renderPalette();
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      runPaletteSelected();
      return;
    }
    return;
  }

  if (!$("#help").hidden) {
    if (e.key === "Escape") {
      e.preventDefault();
      closeHelp();
    }
    return;
  }

  if (e.key === "Escape") {
    e.preventDefault();
    if (!$("#weave-dock").hidden) {
      closeWeave();
      setTab("pack");
      leaveInsert(false);
      return;
    }
    if (state.mode === "insert") {
      leaveInsert(false);
      toast("COMMAND");
      return;
    }
    if (state.view === "review") {
      showView("work");
      return;
    }
    if (state.view === "work") {
      goHome();
      return;
    }
    return;
  }

  // Insert mode: only meta chords (already handled) and Esc
  if (state.mode === "insert" || isTypingTarget(document.activeElement)) {
    return;
  }

  handleCommandKey(e);
});

showView("home");
updateStatusline();
toast("COMMAND mode · press ? for keys · Ctrl+K for palette");
