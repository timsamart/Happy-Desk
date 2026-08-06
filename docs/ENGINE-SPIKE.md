# Engine spike checklist — Phase 0 Track C

**Status:** Checks passed (2026-08-06) — provisional go  
**Corpus:** [fixtures/sample-project/](../fixtures/sample-project/)  
**Spike crate:** [spikes/knowledge-index/](../spikes/knowledge-index/)  
**ADR:** [adr/0001-knowledge-index-engine.md](adr/0001-knowledge-index-engine.md)  
**Decision authority:** [KNOWLEDGE-ENGINE.md](KNOWLEDGE-ENGINE.md) · [PRD.md](PRD.md) §8

## First experiment (ordered)

1. **Embed SurrealDB** — done (`SurrealKv` on Windows).  
2. Ingest fixture → nodes/edges — done.  
3. **FTS** / retrieval for `embedded index` — done (contains fallback acceptable for v0 spike).  
4. **2-hop** from decision — done.  
5. **Rebuild** preserves authored objects — done.  
6. Sketch `KnowledgeIndex` trait — in `main.rs`.

## Pass / fail results

| Check | Pass |
|---|---|
| Embed on Windows reference machine | **Yes** (SurrealKV) |
| FTS / retrieval on fixture | **Yes** |
| 2-hop | **Yes** |
| Rebuild | **Yes** |
| License note | **Filed** in ADR 0001 (counsel before commercial ship) |

## Run

```bash
cd spikes/knowledge-index
cargo run --release
```

## Next

- Make SEARCH/BM25 return hits without contains fallback.  
- Incremental ingest + content-hash skip.  
- Optional RocksDB bake on CI Linux.  
- Vector/HNSW later — explicitly out of this spike.
