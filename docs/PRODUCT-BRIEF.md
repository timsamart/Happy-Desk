# Happy Desk — Product Brief

**Status:** Discovery draft  
**Version:** 0.2  
**Date:** 2026-08-05  
**Signature UX:** [UX-CONCEPT-KNOWLEDGE-LOOM.md](UX-CONCEPT-KNOWLEDGE-LOOM.md)  
**Decisions log:** [GRILL-DECISIONS.md](GRILL-DECISIONS.md)  
**Design system:** [design-system/happy-desk/MASTER.md](../design-system/happy-desk/MASTER.md)

## One-sentence product

Happy Desk is a local-first continuity workspace that turns any folder into an explorable knowledge fabric and lets people resume many threads of work, deliberately assemble context, and hand that context to native AI agents.

## North star

Happy Desk is the **continuity surface** for people whose cognition runs many threads at once: it catches context switches, keeps ideas and open loops alive, makes exploration feel good enough to stay in flow, and hands bounded work to agents — eventually as a candidate home interface for an agentic personal OS.

> For minds that hold too much at once, Happy Desk turns scattered digital work into a continuous, explorable fabric of threads you can leave, resume, and deliberately hand to agents — without losing yourself or your provenance.

**v1 ships the folder/Git/agent wedge.** The OS horizon is vision prose only until Kill tests A and B pass — see [GRILL-DECISIONS.md](GRILL-DECISIONS.md) D18.

## Product thesis

The bottleneck in AI-assisted work is increasingly not model capability. It is **context death across switches**: the reasoning behind a file, relationships between artifacts, open questions, and the trail from source → decision → agent output disappear across tools and sessions.

Happy Desk gives the folder a semantic layer without taking ownership away from the filesystem. Files stay portable. A rebuildable index adds search, embeddings, typed relationships, provenance, and activity history. The user resumes **Threads**, inspects and shapes context, freezes a **Context Pack**, and runs a replaceable native harness.

This is an **operative continuity instrument**, not a prettier archive and not a chatbot shell.

**Irreducible loop:** `source → relation → pack → agent run → knowledge change → resume`

## Primary persona (v1)

**Alex**, 34, technical lead / independent builder. ADHD with high working-memory bursts. Runs 6–15 live projects and idea tracks across Markdown, code, and agent CLIs. Loses 20–40 minutes reconstructing context after deep interrupts. Already uses folders, Git, and at least one native agent CLI. Needs external structure without judgment or shame.

**Secondary:** structured knowledge workers with folder-based bases — same loop, not a separate product.

## The job to be done

> When I return after an interrupt or time away, help me land on the right Thread, recover what matters, explore without losing my place, deliberately choose working context, and continue with an AI agent — without starting from zero, dumping an entire folder into a prompt, or facing a wall of unfinished work as punishment.

## What Happy Desk is

- A viewer and editor for ordinary local folders.
- A **Thread**-centric resume surface for many parallel work streams.
- A dynamic knowledge layer built from files, links, structure, meaning, and work history.
- A local graph explorer in which distance, strength, type, and provenance are controls—not decoration.
- A context-building instrument that creates inspectable, reproducible Context Packs.
- A launcher and control surface for real native CLI harnesses such as Codex and Claude Code.
- A record of how sources, decisions, agent runs, and deliverables connect.
- A two-second **Capture** path into Open Loops (executive-function offload).
- A **Weave** (Writing Feather) peek: relations already woven to the focus, and relations the draft may produce.

## What Happy Desk is not

- Not an Obsidian clone with an AI chat panel.
- Not another VS Code distribution.
- Not a global “hairball” graph whose main purpose is to look impressive.
- Not a vector store that hides why a result was retrieved.
- Not an agent framework that forces every model through one proprietary abstraction.
- Not a new content silo. A folder must remain useful if Happy Desk disappears.
- Not a mail/calendar/chat operating system in v1.
- Not a judgment engine for unfinished work.

## Product principles

1. **The filesystem is canonical.** User content remains in normal files. The index can be deleted and rebuilt.
2. **Continuity over spectacle.** Visualize how information becomes usable and how work resumes — not the database.
3. **Threads are the unit; packs are the bullet.** Resume continuity via Threads; execute via Context Packs.
4. **The graph must explain itself.** Every inferred node, edge, and search result exposes evidence, method, confidence, and indexer version.
5. **Proposed never contaminates default retrieval.** Unreviewed inferences stay out of packs and default neighborhoods.
6. **Relationship strength and confidence are different.**
7. **Pack-first to act; Loom-first to orient.** Great packs from the ranked list alone; Loom scales amplify exploration.
8. **Resume ≤30s / ≤2 clicks** beats teaching the epistemic model on day one.
9. **Capture defaults to Open Loop**; refine/promote later.
10. **Compassionate Home, honest full mess on request.**
11. **Local first, not local only.** Remote models/connectors are optional, visible choices.
12. **Agents are replaceable tools.** Happy Desk owns context and provenance; the harness owns its loop.
13. **Structure grows from use.** No mandatory ontology to get value.
14. **File diff primary; knowledge diff exception-based.**
15. **Folder/Git/agent wedge before OS sprawl.**

## Local and Git-native by default

The normal Happy Desk workspace is either an ordinary local folder or a local Git worktree. Git is not the query engine, but it is excellent durable transport for human-readable, diffable, branchable state.

| State | Examples | Default location |
|---|---|---|
| Canonical content | Markdown, code, documents, project assets | Normal workspace files, optionally tracked by Git |
| Portable Happy Desk metadata | Threads, authored relationships, decisions, open loops, saved lenses, promoted context manifests | Human-readable files under `.happy-desk/`, eligible for Git |
| Derived/local state | Parsed chunks, embeddings, full-text indexes, inferred edges, caches, transient run output | Local SurrealDB/index storage, excluded from Git and rebuildable |

A remote repository is another way to obtain a workspace: clone or pull, then index locally. Agent runs may operate in the workspace, on a branch, or later in an isolated worktree.

The `.happy-desk/` directory must stay selective — never a dump of embeddings, terminal logs, secrets, or machine-specific paths.

## Core mental model

| Concept | Meaning |
|---|---|
| Workspace | A folder opened by Happy Desk, with configuration and a derived index. |
| Thread | First-class continuity unit: title/intent, anchor, open loops, resume cursor, optional pack and last run. |
| Artifact | A file, folder, note, code symbol, document, URL, or generated output. |
| Work object | A project, topic, decision, task, open loop, argument, person, or deliverable. |
| Relationship | A typed, weighted, provenance-bearing connection between two nodes. |
| Context Lens | Controls that determine which nearby and similar information is relevant now. |
| Context Pack | A frozen, inspectable manifest of selected context for a task or agent run. |
| Agent Run | A native harness process, its objective, input context, output, changes, and status. |
| Home | Compassionate subset of Active + Recently touched Threads and scoped Needs-you items. |

## The core loop

1. **Open** a folder (or return to Home). Files and Threads are usable while indexing continues.
2. **Resume** a Thread — restore anchor, cursor, and local context in ≤30 seconds.
3. **Orient / Explore** — quiet trust; optional Loom scales and proposals.
4. **Capture** impulses as Open Loops in ≤2 seconds when needed.
5. **Act** — tune Context Lens, freeze a Pack (loud trust), run a native agent.
6. **Review** — file diff primary; high-impact knowledge deltas selective.
7. **Remember** — Thread cursor, loops, and provenance update so the next switch is cheap.

## Signature interaction: Thread Resume

Restoring a Thread restores the same addressable object, selection/cursor, scale, and enough local context to continue — then optionally zoom or Act. This is the crowned signature interaction ([D20](GRILL-DECISIONS.md)).

**Composition signature (second chair):** **Weave** ([D21](GRILL-DECISIONS.md)) — while writing, peek at woven + likely relations of the current focus without leaving the editor.

**Context Lens** remains the primary *execution* instrument for composing what an agent sees (pack-first). Semantic zoom and neighborhood views amplify exploration; they are not prerequisites for packing.

### Context Lens controls

- **Hops:** 0–3 initially.
- **Minimum relationship strength**
- **Relationship types**
- **Blend:** lexical, semantic, graph, recency
- **Scope:** folders, types, dates, privacy
- **Budget:** items / chunks / estimated tokens
- **Pins and exclusions**

Each result answers “Why is this here?” with score components and strongest path.

### Working scoring model

```text
edge_score(e) = strength(e) × confidence(e) × source_prior(e) × freshness(e)
path_score(path) = product(edge_score(e)) × hop_decay^(d - 1)
relevance =
  lexical_weight × lexical_score
  + semantic_weight × semantic_score
  + graph_weight × best_or_combined_path_score
  + recency_weight × recency_score
  + explicit_pin_boost
```

Scores must stay reproducible, decomposable, and explainable.

## Primary workspace

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Home · Threads · workspace · branch · scope     Search / Capture    Health   │
├──────────────────────────────────────────────────────────────────────────────┤
│ Knowledge Pulse (capability coverage)                                        │
├───────────────┬─────────────────────────────────────┬────────────────────────┤
│ Explorer      │ Continuous Knowledge Surface        │ Lens + Evidence        │
│ Files         │ Source ⇄ Structure ⇄ Neighborhood   │ Why is this here?      │
│ Threads       │              ⇄ Atlas (later)        │ Pack candidates        │
│ Open loops    │ Same anchor, changing scale         │ Trust / provenance     │
├───────────────┴─────────────────────────────────────┴────────────────────────┤
│ Build Shelf: capture · promote · relate · compose · pack · Act (run agent)   │
├──────────────────────────────────────────────────────────────────────────────┤
│ Agent Dock / Review · Time Rail (progressive)                                │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Experience direction

Calm professional instrument: desktop-dense, keyboard-first, progressive disclosure, compassionate Home copy. Motion preserves spatial continuity (150–250ms); reduced-motion supported. Visual tokens and anti-patterns live in the [design system](../design-system/happy-desk/MASTER.md).

## Relationship sources

| Source | Examples | Default trust |
|---|---|---|
| Authored | Markdown links, frontmatter, manually drawn typed edges | Highest |
| Structural | Folder containment, code imports/calls, headings, citations | High |
| Extracted | Entities, issue IDs, decision statements, task references | Medium |
| Semantic | Embedding similarity or model-proposed relationship | Lower until confirmed |
| Behavioral | Co-opened, co-edited, same context pack | Opt-in and low |
| Agent-produced | Relationships asserted during a run with evidence | Depends on review state |

Default neighborhood: **authored + structural**. Inferred ghosts are capped and opt-in.

## Native agent model

Happy Desk invokes real local harnesses via adapters (executable, cwd, PTY, context injection, permissions, completion, optional worktree). First presets: Codex and Claude Code, plus custom CLI. Happy Desk owns context preparation and run provenance; the harness owns its native loop.

## Product wedge

> Open a real mixed Markdown/code project, land on Home Threads, resume one Thread, expand explainable local context, freeze a Context Pack, run a native agent, review file changes (and selective knowledge proposals), switch to another Thread and resume without anxiety.

**Kill test A — Cold resume + act:** After 10+ days away, within 5 minutes compose a trusted pack, run one native task, prefer this to manual reconstruction.  
**Kill test B — Multi-thread switching:** ≥3 Threads in one session, each left recoverable; return later without reconstructing from anxiety.

If those fail, the foundation is invalid — regardless of visual polish.

## Open product questions

1. Should user-authored graph metadata live primarily in Markdown frontmatter, sidecar files, or both?
2. Is the first editor Markdown-focused, or must code editing be first-class from day one?
3. Which inferred relationship types are useful enough behind the proposals toggle?
4. What is the safest universal contract for passing a Context Pack to different CLI harnesses?
5. How much agent-run state should remain in the workspace versus app-level storage?
6. Should graph edits immediately materialize into portable file metadata, or require an explicit commit/apply step?
7. Exact portable schema for Thread resume cursors under `.happy-desk/`.

## Recommended first decision

Build the first vertical slice around **Thread resume → Context Pack → native agent → selective review**, optimized for Alex’s switch-cost targets (≤30s, ≤2 clicks). That exercises indexing, explainable retrieval, continuity, agent invocation, and change capture in one coherent workflow.
