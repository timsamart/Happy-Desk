# Phase 0 — Product & engine spike

**Status:** In progress  
**Started:** 2026-08-05  
**Authority:** [PRD.md](PRD.md) §11 Phase 0 · [GRILL-DECISIONS.md](GRILL-DECISIONS.md)

## Goal

Prove the product bet before Tauri scaffolding:

1. **Clickable kill-test flow** (UI/UX) — Home → Resume → Capture → Pack → “Run” stub → Review → switch Thread.  
2. **Engine spike plan** (later in Phase 0) — SurrealDB vs fallback on a corpus; thin `KnowledgeIndex` boundary.  
3. **Exit:** ADR + go/no-go for the vertical slice.

## Toe-dip (this week)

| Track | Artifact | Done when |
|---|---|---|
| A. Interaction | [`../prototype/kill-test-flow/index.html`](../prototype/kill-test-flow/index.html) | Can walk Kill-test B path in a browser; keyboard orchestration feels first-class — **done for toe-dip** |
| B. Corpus | [`../fixtures/sample-project/`](../fixtures/sample-project/) | Mixed Markdown/code fixture + Threads listed — **scaffolded** |
| C. Engine | [`ENGINE-SPIKE.md`](ENGINE-SPIKE.md) | Surreal embed + FTS + 2-hop checklist named — **checklist ready**; code spike next |

## Out of scope for the toe-dip

- Real indexing, embeddings, or CLI harnesses  
- Atlas, Time Rail, Weave whisper ticks  
- Full desktop shell  

## Kill-test reminders

- **A:** Cold resume + pack + act preference vs manual reconstruction  
- **B:** ≥3 Threads, recoverable switches, ≤30s / ≤2 clicks from Home  

## Next

1. Walk fixture Threads in the prototype (optional: point prototype data at fixture titles).  
2. Stand up `spikes/knowledge-index/` Rust crate and run [ENGINE-SPIKE.md](ENGINE-SPIKE.md) checks.  
3. Write ADR 0001 go/no-go when checks land.
