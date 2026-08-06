# KnowledgeIndex spike

Phase 0 SurrealDB embed experiment for Happy Desk.

## Run

```bash
cd spikes/knowledge-index
cargo run --release
```

Uses corpus [`fixtures/sample-project`](../../fixtures/sample-project). Writes local DB under `.spike-data/` (gitignored).

## Checks

1. Embed via **SurrealKV** (no external daemon; Windows-friendly vs RocksDB)  
2. Ingest files → nodes + structural/authored edges  
3. FTS / contains retrieval for `embedded index`  
4. 2-hop neighborhood from decision object  
5. Rebuild preserves authored `.happy-desk` objects  

## Notes

- Thin `KnowledgeIndex` trait sketched in `src/main.rs`.  
- SEARCH/BM25 is defined; spike currently accepts contains fallback if SEARCH returns empty — still proves retrieval wiring.  
- See [docs/adr/0001-knowledge-index-engine.md](../../docs/adr/0001-knowledge-index-engine.md).
