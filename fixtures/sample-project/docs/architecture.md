# Architecture

Happy Desk should keep the **filesystem canonical** and treat search/graph/vectors as a rebuildable derived layer.

## Decision draft

We should use an **embedded index** so graph traversal, full-text search, and vectors stay local.

## Open questions

- Does SurrealDB BSL block distribution of an embedded desktop app, or is in-app use fine?
- What is the thinnest `KnowledgeIndex` trait that still lets us swap engines?

## Related

- [../KNOWLEDGE-ENGINE.md](../../docs/KNOWLEDGE-ENGINE.md) (product docs; not in this fixture tree)
- [context-pack.md](context-pack.md)
- [loom-notes.md](loom-notes.md)

Next: freeze a Context Pack with this note, the decision object, and the engine evaluation — then ask an agent for a spike checklist.
