# Phase 0.1 — Engine FTS harden + incremental ingest

**Status:** Done (2026-08-06)  
**Started:** 2026-08-06  
**Authority:** [PHASE-0.md](PHASE-0.md) Next · [ENGINE-SPIKE.md](ENGINE-SPIKE.md) Next · [ADR 0001](adr/0001-knowledge-index-engine.md)  
**Predecessor:** Phase 0 toe-dip (kill-test UI · fixture corpus · SurrealKV spike PASS)

## Goal

Finish the remaining Phase 0 engine hardening before Tauri scaffolding:

1. **BM25 FTS without contains fallback** — SEARCH hits for fixture queries must come from the full-text index.  
2. **Incremental ingest** — re-ingest skips unchanged files via `content_hash`; stats report skipped vs upserted.  
3. **Prototype ↔ fixture alignment** — kill-test Thread titles/anchors match [`fixtures/sample-project/FIXTURE.md`](../fixtures/sample-project/FIXTURE.md).

## Scope

| Track | Artifact | Done when |
|---|---|---|
| A. FTS | [`../spikes/knowledge-index`](../spikes/knowledge-index) | `search_fts("embedded index")` returns `docs/architecture.md` with a numeric BM25 `score_hint` (not `"contains"`); contains fallback removed from the happy path |
| B. Incremental | same spike crate | Second ingest of an unchanged workspace reports `skipped > 0` and `upserted == 0` for file nodes; changing one file body upserts only that file (and its derived edges as needed) |
| C. Prototype data | [`../prototype/kill-test-flow/app.js`](../prototype/kill-test-flow/app.js) | Thread titles + anchor paths match FIXTURE suggested Threads (≥3 active + 1 recent) |

## Out of scope

- Tauri / desktop shell (Phase 1)  
- RocksDB bake on CI Linux  
- Vector / HNSW  
- File-system watcher daemon (hash-skip ingest is enough for this PID)  
- Real embeddings or hybrid ranking  

## Exit criteria

- `cargo run --release` in `spikes/knowledge-index` prints all checks **PASS**, including new `fts_bm25_no_fallback` and `incremental_hash_skip` checks.  
- Kill-test prototype still walks Kill-test B with fixture-aligned Thread names.  
- [ENGINE-SPIKE.md](ENGINE-SPIKE.md) and [PHASE-0.md](PHASE-0.md) Next updated to reflect completion / Phase 1 ready.

## Implementation notes

- SurrealDB FTS indexes are **one field per index**. Split `title` and `body` into separate `SEARCH … BM25` indexes; query with numbered match refs (`@0@` / `@1@`) and combine `search::score`.  
- Fail the FTS check if any hit uses `score_hint == "contains"` or if SEARCH returns empty for the fixture phrase.  
- Keep `content_hash` on nodes; on ingest, lookup by `uri` and skip upsert when hash matches.  
- Rebuild remains a wipe + full ingest (unchanged contract).

## Results (2026-08-06)

Verified with `cargo run --release` in `spikes/knowledge-index`:

- `fts_bm25_no_fallback` — architecture.md in hits with numeric BM25 scores  
- `incremental_hash_skip` — second ingest: upserted=0, skipped=11, edges=0  
- Existing embed / ingest / 2-hop / rebuild checks still PASS  

Root cause of empty SEARCH: Surreal allows **one field per FTS index**; the v0 spike had `FIELDS title, body` on a single index.

## Next (after exit)

Phase 0.1 is green → [PHASE-1.md](PHASE-1.md) (Tauri shell + Home toe-dip in [`desktop/`](../desktop/)).
