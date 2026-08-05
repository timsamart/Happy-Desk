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
| A. Interaction | [`../prototype/kill-test-flow/index.html`](../prototype/kill-test-flow/index.html) | Can walk Kill-test B path in a browser without code literacy; **keyboard orchestration** (COMMAND/INSERT, Ctrl+K, `?`) feels first-class |
| B. Corpus notes | TBD `fixtures/` | One real mixed Markdown/code sample workspace listed |
| C. Engine | Spike checklist only | SurrealDB embed + FTS + 2-hop query named as first experiment |

## Out of scope for the toe-dip

- Real indexing, embeddings, or CLI harnesses  
- Atlas, Time Rail, Weave whisper ticks  
- Full desktop shell  

## Kill-test reminders

- **A:** Cold resume + pack + act preference vs manual reconstruction  
- **B:** ≥3 Threads, recoverable switches, ≤30s / ≤2 clicks from Home  

## Next after toe-dip

1. Critique prototype with Alex-persona walkthrough (shame, flow, pack trust).  
2. Add Weave Peek panel to the prototype (FR-11 love path).  
3. Stand up Rust/Surreal spike repo folder when UI path feels right.
