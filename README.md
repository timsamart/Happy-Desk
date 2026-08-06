# Happy Desk

A local-first **continuity workspace** for people who hold many threads of work at once: explore an explainable knowledge fabric, resume where you left off, assemble precise context, and hand it to native CLI agents.

Happy Desk opens an ordinary folder as a living workbench. Files stay yours. Threads catch context switches. Context Packs make agent input inspectable. Codex, Claude Code, and other local harnesses stay replaceable.

## Product documents

- [Product brief](docs/PRODUCT-BRIEF.md)
- [Initial PRD](docs/PRD.md)
- [Knowledge Loom UX concept](docs/UX-CONCEPT-KNOWLEDGE-LOOM.md)
- [Grill decisions (D1–D21)](docs/GRILL-DECISIONS.md)
- [Knowledge engine evaluation](docs/KNOWLEDGE-ENGINE.md)
- [Phase 0 spike](docs/PHASE-0.md) · [Phase 0.1](docs/PHASE-0.1.md) (FTS harden + incremental ingest)
- [Phase 1 — Living Folder + Home](docs/PHASE-1.md) — Tauri shell toe-dip ([`desktop/`](desktop/))
- [Engine spike checklist](docs/ENGINE-SPIKE.md) · [ADR 0001](docs/adr/0001-knowledge-index-engine.md)
- [Knowledge-index spike crate](spikes/knowledge-index/) — `cargo run --release`
- [Design system](design-system/happy-desk/MASTER.md)
- [Kill-test UI prototype](prototype/kill-test-flow/index.html) — open in a browser (`?` for keys)
- [Sample fixture workspace](fixtures/sample-project/)

The project is entering **Phase 1** (desktop shell). The filesystem remains the source of truth; indexes are derived and rebuildable. v1 validates Thread resume → Context Pack → native agent — not an OS replacement.
