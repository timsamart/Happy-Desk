# ADR 0001 — Knowledge index engine (Phase 0 spike)

**Status:** Provisional go (continue SurrealDB path)  
**Date:** 2026-08-06  
**Spike:** [`spikes/knowledge-index`](../../spikes/knowledge-index)  
**Corpus:** [`fixtures/sample-project`](../../fixtures/sample-project)

## Context

Happy Desk needs one embedded derived engine for metadata, graph edges, FTS, and (later) vectors. [KNOWLEDGE-ENGINE.md](../KNOWLEDGE-ENGINE.md) nominated SurrealDB first.

## Decision

**Continue with SurrealDB embedded** using the **SurrealKV** backend for the desktop spike path. Keep a thin `KnowledgeIndex` trait so LadybugDB / SQLite remain swappable if Surreal fails a later hard gate (vectors, license, or packaging).

## Evidence (2026-08-06, Windows)

| Check | Result |
|---|---|
| Embed without daemon | **PASS** — SurrealKV on disk |
| Ingest fixture | **PASS** — 8 files → 11 nodes, 11 edges, 2 work objects |
| Retrieve `embedded index` | **PASS** — `docs/architecture.md` in top hits (contains fallback; SEARCH index defined) |
| 2-hop from decision | **PASS** — architecture + related docs/folders/open loop |
| Rebuild authored objects | **PASS** — decision present after wipe+reingest |

Command: `cargo run --release` in `spikes/knowledge-index`.

## License note (not legal advice)

SurrealDB core is under **Business Source License 1.1**. Happy Desk’s intended use is **embedded inside a local desktop app**, with the DB as rebuildable derived state and files/Git as canonical. Surreal’s public guidance allows development and production use in one’s own applications under BSL terms, with additional obligations if offering the database as a service to third parties.

**Spike determination:** proceed for discovery and local prototypes. **Before commercial distribution / store listing**, obtain a short counsel review of BSL 1.1 against Happy Desk’s distribution model (or confirm Surreal’s then-current license). File any follow-up as ADR amendment — do not treat this note as final compliance.

## Consequences

- Next engineering: harden FTS (ensure BM25 SEARCH hits without contains fallback), incremental watcher ingest, then vector spike.  
- Do not wire Tauri until Kill-test UI path + this engine path both stay green.  
- If Surreal packaging or BSL blocks distribution, pivot ADR to SQLite+FTS5 or LadybugDB using the same trait.

## Alternatives considered

- RocksDB embed — stronger ops pedigree; heavier native deps on Windows (deferred).  
- SQLite+FTS5 — conservative fallback; graph via app BFS (already used in spike neighborhood).  
- LadybugDB — graph-native comparator if Surreal graph/query ergonomics disappoint later.
