# Engine spike checklist — Phase 0 Track C

**Status:** Checks passed (2026-08-06) — provisional go · Phase 0.1 harden done  
**Corpus:** [fixtures/sample-project/](../fixtures/sample-project/)  
**Spike crate:** [spikes/knowledge-index/](../spikes/knowledge-index/)  
**ADR:** [adr/0001-knowledge-index-engine.md](adr/0001-knowledge-index-engine.md)  
**Decision authority:** [KNOWLEDGE-ENGINE.md](KNOWLEDGE-ENGINE.md) · [PRD.md](PRD.md) §8  
**Harden PID:** [PHASE-0.1.md](PHASE-0.1.md)

## First experiment (ordered)

1. **Embed SurrealDB** — done (`SurrealKv` on Windows).  
2. Ingest fixture → nodes/edges — done.  
3. **FTS** / retrieval for `embedded index` — done (Phase 0.1: BM25, no contains fallback).  
4. **2-hop** from decision — done.  
5. **Rebuild** preserves authored objects — done.  
6. Sketch `KnowledgeIndex` trait — in `main.rs`.  
7. **Incremental ingest** + content-hash skip — done (Phase 0.1).

## Pass / fail results

| Check | Pass |
|---|---|
| Embed on Windows reference machine | **Yes** (SurrealKV) |
| FTS / retrieval on fixture | **Yes** (BM25; Phase 0.1) |
| Incremental hash-skip | **Yes** (Phase 0.1) |
| 2-hop | **Yes** |
| Rebuild | **Yes** |
| License note | **Filed** in ADR 0001 (counsel before commercial ship) |

## Run

```bash
cd spikes/knowledge-index
cargo run --release
```

## Next

Phase 0.1 engine harden is done. Remaining later work:

- Optional RocksDB bake on CI Linux.  
- Vector/HNSW — explicitly out of this spike.  
- Product next: Tauri shell (**Phase 1**).
