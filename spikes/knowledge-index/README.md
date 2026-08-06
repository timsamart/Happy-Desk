# KnowledgeIndex spike

Phase 0 / 0.1 SurrealDB embed experiment for Happy Desk.

## Run

```bash
cd spikes/knowledge-index
cargo run --release
```

Uses corpus [`fixtures/sample-project`](../../fixtures/sample-project). Writes local DB under `.spike-data/` (gitignored).

## Checks

1. Embed via **SurrealKV** (no external daemon; Windows-friendly vs RocksDB)  
2. Ingest files → nodes + structural/authored edges  
3. **BM25 FTS** for `embedded index` (separate title/body SEARCH indexes; no contains fallback)  
4. **Incremental hash-skip** on second ingest of an unchanged workspace  
5. 2-hop neighborhood from decision object  
6. Rebuild preserves authored `.happy-desk` objects  

## Notes

- Thin `KnowledgeIndex` trait sketched in `src/main.rs`.  
- Surreal FTS allows one field per SEARCH index — title and body are indexed separately.  
- See [docs/PHASE-0.1.md](../../docs/PHASE-0.1.md) · [docs/adr/0001-knowledge-index-engine.md](../../docs/adr/0001-knowledge-index-engine.md).
