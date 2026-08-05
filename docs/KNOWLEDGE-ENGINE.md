# Happy Desk — Knowledge Engine Evaluation

**Status:** Discovery recommendation  
**Date:** 2026-08-01

## Decision to make

Choose the embedded derived-data engine for Happy Desk’s structured metadata, full-text index, vectors, and relationship graph.

“Single engine” does not mean storing the user’s files inside a database. Files remain canonical. It means avoiding a fragile application-level join across separate metadata, graph, lexical, and vector databases.

## Required capabilities

- Embedded, local, and cross-platform operation suitable for a desktop application.
- Durable on-disk storage and transactional updates.
- Property graph or practical multi-hop traversal.
- Weighted, typed edges with provenance properties.
- Full-text indexing with ranked results.
- Vector storage and nearest-neighbor search.
- Ability to combine or efficiently fuse graph, lexical, vector, and metadata results.
- Incremental writes for file-watcher workloads.
- Backup/rebuild and schema migration path.
- Redistributable licensing compatible with this product.
- Maintained Rust or C-compatible integration.

## Current candidates

| Engine | Strengths for Happy Desk | Primary concerns | Current position |
|---|---|---|---|
| LadybugDB | Embedded property graph, Cypher, on-disk ACID, MIT license, Rust binding, BM25 FTS and HNSW vector extensions | Newer product lineage; extension packaging; optimized for analytical graphs; update-heavy watcher behavior needs measurement | Graph-native comparator |
| CozoDB | Embedded relational/graph/vector engine, Datalog is excellent for bounded hops, HNSW, FTS, time travel, MPL-2.0 | Smaller ecosystem, older 0.x line, Datalog learning/adapter cost, maintenance cadence must be checked | Strong technical comparator |
| SurrealDB | Embedded Rust, native graph/document model, full-text, HNSW/DiskANN, hybrid fusion, live-query features | Core uses Business Source License 1.1; larger and broader platform than needed; distribution and upgrade implications | **First spike** |
| SQLite + extensions | Exceptional deployment and reliability, FTS5, simple transactions, recursive CTE graph traversal, huge ecosystem | Graph is modeled manually; vector extension maturity/ANN support and cross-platform packaging require care; hybrid logic lives in the app | Conservative fallback |

## Provisional recommendation

Spike **SurrealDB first**, with LadybugDB as the graph-native comparator and SQLite as the conservative baseline.

This restores the conclusion from the earlier agent-memory research. That investigation first considered `Neo4j + Qdrant + Postgres`, then moved toward a Rust-first single engine, examined CoordiNode, and selected SurrealDB as the better-established implementation of the same basic shape. LadybugDB—formerly Kuzu—was the runner-up when graph-native design mattered more than Rust-first multi-model breadth.

The reasons are product-shaped rather than benchmark-shaped:

1. One embedded Rust engine covers documents, graph relationships, vector retrieval, full-text retrieval, and hybrid fusion.
2. The data model fits both file-derived records and first-class relationship edges without adding separate services.
3. Embedded operation fits a Tauri/Rust desktop core and avoids a required local database daemon.
4. Live queries and the event model may simplify keeping multiple Happy Desk surfaces synchronized.
5. The project is substantially more established than the CoordiNode option that prompted the earlier comparison.

This is not yet an adoption decision. SurrealDB must earn its place through a repeatable benchmark, embedded packaging proof, migration rehearsal, and a written licensing determination. Its core database is under Business Source License 1.1, so redistribution and future product deployment must be reviewed before it becomes foundational.

The intended Happy Desk deployment materially narrows that concern: SurrealDB runs locally as an embedded implementation detail, while users interact with Happy Desk workspaces rather than a general database service. The canonical and shareable state is carried by files and Git; the database is local and rebuildable. This aligns with SurrealDB's published statement that development and production use in one's own applications is free, while still requiring a final review before commercial distribution.

## Proposed physical model for the spike

Use one generic node table and one relationship table first. This keeps the ontology extensible while the product vocabulary is still moving and maps naturally to SurrealDB records plus relation tables.

```text
Node(id, kind, subtype, uri, title, body, embedding, metadata,
     content_hash, created_at, updated_at)

Relation(from Node to Node, kind, strength, confidence, source,
         evidence_uri, review_state, indexer_version,
         created_at, valid_from, valid_to)
```

Indexes:

- unique index on `Node.uri` where applicable;
- ordinary indexes on `kind`, `subtype`, and timestamps;
- BM25/full-text index on `title` and `body`;
- vector index on `embedding`;
- graph adjacency supplied by the relationship table.

If the generic shape creates unacceptable query or storage costs, the second iteration can split Artifact, Chunk, WorkObject, and AgentRun into typed node tables.

## Benchmark corpus

Use a copy of a real mixed workspace, plus a deterministic generated corpus:

- 10,000 files;
- 50,000 chunks;
- 100,000 structural and authored edges;
- 250,000 semantic candidate edges before thresholding;
- Markdown, plain text, and representative source code;
- repeated creates, edits, renames, deletes, and bulk branch changes.

Do not benchmark confidential content unless the corpus is explicitly approved and isolated.

## Queries to measure

1. Exact path/title lookup.
2. BM25 top 20 with folder and type filters.
3. Vector top 20 with metadata filters.
4. One-, two-, and three-hop traversal with edge type and minimum-strength filters.
5. Vector candidates expanded through two graph hops.
6. Hybrid rank fusion with explanation fields.
7. Upsert one modified file, its chunks, embeddings, and relationships transactionally.
8. Rename a folder subtree without leaving duplicate active nodes.
9. Delete and tombstone behavior.
10. Full rebuild, backup, restore, and schema migration.

## Pass/fail criteria

- Warm hybrid query p95 below 300 ms on the reference laptop.
- Three-hop capped Context Lens query p95 below 500 ms.
- Ordinary one-file incremental update visible within 2 seconds.
- No corruption after forced termination during indexing.
- Deterministic rebuild for authored and structural data.
- Installer works without a separately managed database server.
- Windows, macOS, and Linux packaging is documented or proven for required extensions.
- Database and extensions have acceptable redistribution terms.
- A version upgrade and export/import rehearsal succeeds.

## Integration boundary

Application code should depend on a narrow interface:

```text
KnowledgeIndex
  apply(change_batch)
  search(query, filters, blend)
  neighborhood(anchors, hops, edge_filter)
  explain(result_id, retrieval_revision)
  freeze_context_pack(selection)
  rebuild(workspace)
  health()
```

Engine-specific query text stays behind this boundary. Context Pack schemas, portable metadata, and agent adapters must not expose database-native identifiers.

## Sources checked

- [SurrealDB overview](https://surrealdb.com/docs/what-is-surrealdb)
- [SurrealDB embedded Rust SDK](https://surrealdb.com/docs/reference/rust/embedding)
- [SurrealDB graph model](https://surrealdb.com/docs/learn/data-models/graph/overview)
- [SurrealDB hybrid vector and full-text retrieval](https://surrealdb.com/docs/learn/data-models/vector-search/overview)
- [SurrealDB vector indexes](https://surrealdb.com/docs/learn/data-models/vector-search/vector-indexes)
- [SurrealDB repository and license](https://github.com/surrealdb/surrealdb)
- [Ladybug documentation](https://docs.ladybugdb.com/)
- [Ladybug vector extension](https://docs.ladybugdb.com/extensions/vector/)
- [Ladybug repository and license](https://github.com/LadybugDB/ladybug)
- [CozoDB overview](https://www.cozodb.org/)
- [CozoDB vector and full-text indexes](https://docs.cozodb.org/en/latest/vector.html)
- [SQLite FTS5](https://www.sqlite.org/fts5.html)
- [SQLite recursive CTE syntax](https://sqlite.org/syntax/recursive-cte.html)

These sources establish feature availability, not fitness for Happy Desk. The spike supplies that evidence.
