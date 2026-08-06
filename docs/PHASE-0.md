# Phase 0 — Product & engine spike

**Status:** Phase 0.1 complete — ready for Phase 1 when desired  
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
| C. Engine | [`ENGINE-SPIKE.md`](ENGINE-SPIKE.md) · [`../spikes/knowledge-index`](../spikes/knowledge-index) | Surreal embed + ingest + retrieval + 2-hop + rebuild — **PASS** · [ADR 0001](adr/0001-knowledge-index-engine.md) |

## Out of scope for the toe-dip

- Real embeddings bake-off or CLI harnesses  
- Atlas, Time Rail, Weave whisper ticks  
- Full desktop shell  

## Kill-test reminders

- **A:** Cold resume + pack + act preference vs manual reconstruction  
- **B:** ≥3 Threads, recoverable switches, ≤30s / ≤2 clicks from Home  

## Next

Phase 0.1 complete — see [PHASE-0.1.md](PHASE-0.1.md).  
**Next increment:** scaffold Tauri shell (**Phase 1** start).
