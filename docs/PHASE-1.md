# Phase 1 — Living Folder + Home (toe-dip)

**Status:** Toe-dip in progress — shell scaffolded (2026-08-06)  
**Started:** 2026-08-06  
**Authority:** [PRD.md](PRD.md) §11 Phase 1 · [GRILL-DECISIONS.md](GRILL-DECISIONS.md) · [design-system/happy-desk/MASTER.md](../design-system/happy-desk/MASTER.md) · [pages/home.md](../design-system/happy-desk/pages/home.md)  
**Predecessor:** [PHASE-0.md](PHASE-0.md) · [PHASE-0.1.md](PHASE-0.1.md) (engine + kill-test green)

## Goal

Start the desktop product path: a **Tauri 2 shell** that opens as a calm instrument Home (Threads), carrying forward the Phase 0 kill-test interaction thesis without yet shipping the full Living Folder stack.

## Scope / done-when (this toe-dip)

| Track | Artifact | Done when |
|---|---|---|
| A. PID | this doc | Status, goal, scope, out of scope, exit criteria filed; linked from Phase 0 / README |
| B. Shell | [`../desktop/`](../desktop/) | Tauri 2 + React/TS Vite app builds; window title **Happy Desk**; design tokens match MASTER (IBM Plex, trust-blue primary, no purple) |
| C. Home vertical | desktop UI | Home shows fixture-aligned Active + Recent Threads; Resume opens a Thread stub (source pane placeholder); Capture affordance visible; Quiet Pulse strip present |
| D. Workspace path | Rust command | `get_workspace_label` (or equivalent) returns a path string for `fixtures/sample-project` (hardcoded / relative for toe-dip — real folder picker later) |

## Out of scope (defer in Phase 1 later increments)

- Real folder open / native dialog  
- File explorer, Markdown editor (CodeMirror), FS watcher  
- KnowledgeIndex wired into the shell (still spike crate)  
- Context Pack compose, Agent Dock, Weave, Atlas, Time Rail  
- Full kill-test path inside Tauri (prototype remains the interaction reference)

## Exit criteria (toe-dip)

- `cd desktop && npm install && npm run build` succeeds (frontend + `tauri build` deps resolved enough for `cargo check` in `desktop/src-tauri`).  
- Home lists ≥3 active + 1 recent Threads matching [`fixtures/sample-project/FIXTURE.md`](../fixtures/sample-project/FIXTURE.md) titles.  
- Resume is ≤2 clicks from Home in the shell (row click → Thread stub).  
- [PHASE-0.md](PHASE-0.md) / [PHASE-0.1.md](PHASE-0.1.md) point here as next/current product increment.

## Product Phase 1 remainder (after this toe-dip)

Per PRD §11 — still required before Phase 1 **Exit** (“ordinary folders feel immediately useful; resume meets switch-cost in lab tests”):

1. Folder open, explorer, Markdown editor, watcher, Pulse (live).  
2. Threads Home with durable resume cursor; Capture → Open Loop.  
3. Explicit links, containment graph, full-text search.  
4. Local neighborhood + accessible list.

## Next (after toe-dip green)

Wire folder picker + read Markdown into the Thread source pane; then watcher + Pulse; keep KnowledgeIndex behind the spike trait until a thin IPC boundary is sketched.

## Toe-dip results (2026-08-06)

- `desktop/` Tauri 2 + React/TS scaffold with design-system tokens  
- Home → Resume Thread stub; Capture stub; Pulse strip; `get_workspace_label`  
- Verified: `npm run build` · `cargo check --manifest-path src-tauri/Cargo.toml`
