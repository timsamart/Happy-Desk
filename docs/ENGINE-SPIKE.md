# Engine spike checklist — Phase 0 Track C

**Status:** Ready to run  
**Date:** 2026-08-05  
**Corpus:** [fixtures/sample-project/](../fixtures/sample-project/)  
**Decision authority:** [KNOWLEDGE-ENGINE.md](KNOWLEDGE-ENGINE.md) · [PRD.md](PRD.md) §8

## First experiment (ordered)

1. **Embed SurrealDB** in a tiny Rust binary/library (`spikes/knowledge-index/` — create when coding starts).  
2. Ingest fixture files → nodes (file, chunk, work_object).  
3. **FTS** query for `embedded index` returns `docs/architecture.md` (or chunks).  
4. **2-hop** from `decision-embedded-index` → architecture → related docs via `links_to` / containment.  
5. Prove **rebuild**: delete DB file, re-ingest, authored objects from `.happy-desk/objects/` survive.  
6. Sketch trait:

```rust
// illustrative — not final
trait KnowledgeIndex {
    fn upsert_node(&self, node: Node) -> Result<()>;
    fn upsert_edge(&self, edge: Edge) -> Result<()>;
    fn search_fts(&self, q: &str, limit: usize) -> Result<Vec<Hit>>;
    fn neighborhood(&self, id: &str, hops: u8) -> Result<Vec<Node>>;
    fn rebuild_from_workspace(&self, root: &Path) -> Result<()>;
}
```

## Pass / fail (go/no-go inputs)

| Check | Pass |
|---|---|
| Embed on Windows reference machine | Opens DB without external daemon |
| FTS on fixture | Relevant hit in top 5 |
| 2-hop | Returns ≥1 expected neighbor |
| Rebuild | Authored decision/loop still present |
| License note | Written BSL determination filed (even if “needs lawyer”) |

## Comparators (only if Surreal fails a hard gate)

- LadybugDB (graph-native)  
- SQLite + FTS5 (conservative)  

## Explicitly not in this spike

- Embeddings / HNSW quality bake-off  
- Full Tauri UI wiring  
- Real Codex/Claude Code launch  

## Exit artifact

One short ADR: `docs/adr/0001-knowledge-index-engine.md` — go / no-go / pivot.
