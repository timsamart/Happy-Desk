# Happy Desk — Grill Decisions

**Status:** Folded into brief / Loom / PRD / design system (still canonical decision log)  
**Version:** 0.3  
**Date:** 2026-08-05  
**Related:** [PRODUCT-BRIEF.md](PRODUCT-BRIEF.md) · [UX-CONCEPT-KNOWLEDGE-LOOM.md](UX-CONCEPT-KNOWLEDGE-LOOM.md) · [PRD.md](PRD.md) · [design-system/happy-desk/MASTER.md](../design-system/happy-desk/MASTER.md)

This document records hardened answers from adversarial grilling. Decisions D1–D20 were folded into the brief, Loom UX concept, PRD, and design system on 2026-08-05. **D21 (Writing Feather / Weave)** added for composition-time relational foresight. **This log remains authoritative** if product docs drift; revise Decision IDs here first, then propagate.

---

## North star (locked for discovery)

Happy Desk is the **continuity surface** for people whose cognition runs many threads at once: it catches context switches, keeps ideas and open loops alive, makes exploration feel good enough to stay in flow, and hands bounded work to agents — eventually as a candidate home interface for an agentic personal OS.

The Knowledge Loom is how **attention, memory, and action stay continuous** across switches. It is not a graph theme and not a prettier RAG panel.

**One-line thesis**

> For minds that hold too much at once, Happy Desk turns scattered digital work into a continuous, explorable fabric of threads you can leave, resume, and deliberately hand to agents — without losing yourself or your provenance.

---

## Round 1 — Loom as signature bet

### D1. Irreducible product

**Decision:** The irreducible thing is **inspectable, deliberate context composition over a folder that stays yours**, with a continuous provenance loop:

`source → relation → pack → agent run → knowledge change → resume`

Not the Loom metaphor, not the Atlas, not semantic zoom choreography.

**Enemy (narrow wedge):** Blind or sticky agent context (whole-repo dumps, hidden RAG, chat amnesia) inside IDE + harness workflows.

**Enemy (north star):** **Context death across switches** — unfinished threads, orphaned reasoning, taboo unfinished work, lost “where was I?”

### D2. Day-one cognitive load

**Decision:** Day one teaches only:

1. Open folder → files work immediately  
2. Land on your threads / active work  
3. Select something → nearby relevant context appears with “why”  
4. Pin / exclude / freeze a Context Pack → run agent  
5. Review what changed (files primary; knowledge selective)

**Hidden until asked:** three state axes as a taught model, Atlas, full hop-ring theory, Time Rail scrubbing, ontology vocabulary.

**ND exception:** Open Loops, Frontier (compassionate subset), and Pulse capability readiness are **first-class chrome**, not advanced features — they externalize executive function.

### D3. Curation tax

**Decision:** Curation is **offloaded executive function**, not ontology homework.

- No mandatory promotion to get value; structural links + explainable retrieval must deliver the wedge alone.  
- Promote / relate when it reduces future switch cost or resolves friction (contradiction, agent claim, resume ambiguity).  
- Capture impulse must beat reconstruction anxiety (see D14).

### D4. Minute-five monorepo honesty

**Decision:** At minute five the product is allowed to look like:

- Explorer + editor (full)  
- Knowledge Pulse as **capability coverage** (exact / semantic / graph readiness)  
- Local neighborhood of the active file: authored + structural first  

**Banned at minute five:** global Atlas, tens of thousands of ghost edges, “impressive” all-node views.

Progressive availability *is* the Loom. Atlas is a later lens.

### D5. Anchor continuity when identity isn’t 1:1

**Decision:** Continuity = **addressable identity + explicit rebinding**, never silent retargeting.

| Case | Behavior |
|---|---|
| One span → many promotions | Anchor stays the span; work objects are children with back-refs |
| Source moves / edits | Sticky citation by content hash + span; on drift, banner to re-link or accept new span |
| Chunk ≠ file ≠ concept | Primary URI + role; breadcrumb `file › chunk › Decision` |
| Identity forks | User picks survivor; history keeps both |

### D6. Ghost structure without trust theater

**Decision:**

- Default neighborhood: **authored + structural only**  
- Inferred ghosts: capped, local, behind “Show proposals” / Review queue  
- Never auto-accept into canonical knowledge  
- Unreviewed proposals **never** enter default retrieval or packs  
- Ignoring a proposal class may auto-suppress similar low-evidence bulk  

Ghosts are a **local review inbox**, not ambient wallpaper.

### D7. Ranked checklist vs Loom surfaces

**Decision:** **Pack-first for execution; Loom-first for orientation and switching.**

- Users must build a great Context Pack from the ranked list + pins + budget alone.  
- Loom scales (Source → Structure → Neighborhood → Atlas) amplify hard cases and exploration; they are not prerequisites for packing.  
- Evidence paths, Frontier, and knowledge diffs earn their keep where the checklist fails.

### D8. Dual-diff when knowledge review is skipped

**Decision:** File diff is primary. Knowledge review is **exception-based**.

- Highlight only high-impact deltas: new Decisions/claims, contradictions, edges that affect future packs.  
- Collapse speculative merges into “N low-confidence proposals.”  
- Accepting files never launders inferences into accepted knowledge.  
- After a switch-away, resume must answer: **what changed / what did the agent leave hanging?**

### D9. Smallest falsifying prototypes

**Decision:** Two kill tests. Either failing kills confidence in the bet.

**Kill test A — Cold resume + act**  
After 10+ days away from a real mixed Markdown/code repo: open cold → within 5 minutes compose a pack you trust → run one native agent task → prefer this to manual reconstruction.

**Kill test B — Multi-thread switching**  
In one session, switch among ≥3 live threads, leave each recoverable, return later without reconstructing from anxiety.

**Prototype must include:** progressive readiness, explainable local neighborhood (list OK), pin/freeze pack, one harness run, file diff + selective knowledge proposals, thread resume surface.

**Prototype may omit:** Atlas, Time Rail scrubbing, full semantic-zoom choreography, hop-ring visual polish, full reconcile UI.

### D10. Primary competitive framing

**Decision:**

| Horizon | Primary enemy |
|---|---|
| v1 wedge | IDE + agent harness **opaque context** |
| North star | **Context death across switches** |

Not “Obsidian killer.” Not “chat-with-repo clone.” Happy Desk is the **attention + memory + agency layer** between a user’s durable stuff and replaceable agents.

---

## Round 2 — ND continuity, flow, and OS horizon

### D11. Day-one person (concrete)

**Decision — primary persona for v1:**

> **Alex**, 34, technical lead / independent builder. ADHD + high working-memory bursts. Runs 6–15 live projects and idea tracks across Markdown, code, and agent CLIs. Loses 20–40 minutes reconstructing context after each deep interrupt. Already uses folders, Git, and at least one native agent CLI. Shame spiral around unfinished threads; needs external structure without judgment.

**Ship order:** Alex’s folder/Git/agent wedge first. Broader “whole digital life” users inherit the same continuity model later; they do not redefine v1 scope.

**Secondary:** structured knowledge workers with folder-based bases — served by the same loop, not a separate product.

### D12. Unit of continuity: Thread

**Decision:** The unit of continuity is a **Thread**.

A Thread is a first-class work object that bundles:

- a title and optional intent  
- an anchor (file, selection, Decision, or query)  
- Open Loops attached to it  
- last-touched timestamp and resume cursor (selection, scale, lens preset)  
- optional active / last Context Pack  
- optional last agent run summary  

**Mapping:** Projects may contain many Threads. Open Loops can exist without a Thread (inbox) but prefer attachment. Context Packs are *execution snapshots*, not Threads. Sessions are ephemeral; Threads persist.

**Home shows (hard cap):**

- **Active** Threads (user-pinned, default ≤7)  
- **Recently touched** (e.g. last 14 days, capped)  
- **Needs you** slice of Frontier for those Threads only (contradictions, agent hangings, stale packs)

**Home refuses:**

- global dump of all historical loops  
- workspace-wide Atlas as default  
- ranked shame list of everything unfinished forever  

Full mess lives one deliberate click away (“Show all open loops”).

### D13. Flow vs instrument — what we sacrifice first

**Decision:** For **≤30-second re-entry** after interrupt, sacrifice *taught correctness* before *resume speed*.

**Keep always:**

- files usable  
- Thread resume cursor  
- Pulse as quiet readiness  
- proposed ≠ accepted barrier  

**Sacrifice first (defer / progressive disclosure):**

- teaching three state axes  
- Atlas / multi-resolution map  
- hop-ring visual grammar  
- dual-diff parity with git  
- ghost edges in default view  
- Time Rail scrubbing  

**30-second resume path (canonical):**

1. Open Happy Desk → Home Threads  
2. Click Thread → restore anchor + cursor + last scale  
3. Optional one-line “while you were away” (agent hangings / stale pack)  
4. Continue or Act  

No model literacy required on that path.

### D14. Universal capture (≤2 seconds)

**Decision:** One universal gesture: **Capture** (shortcut + Build Shelf affordance + command palette).

**Default create:** an **Open Loop** (or quick note) with:

- timestamp  
- optional linked anchor = current selection / file if any  
- provenance “captured from …”  
- state `inbox` until attached to a Thread  

**Not required mid-impulse:** Concept / Decision / Argument typing. Promotion is a later one-tap refine (“Promote to Decision…”).

**Capture sources in v1:** editor selection, empty capture (thought), agent output selection, search result.  
**Explicitly later:** browser / OS-global capture (OS horizon — see D18).

### D15. Exploration vs execution — Act gravity without nagging

**Decision:** Exploration is first-class; execution has **gentle gravity**, not streaks or guilt timers.

**Mechanisms:**

- Every Thread has a visible **Act** affordance: compose/update pack → run agent (or “mark next physical action”).  
- After meaningful wander (time on Neighborhood/Atlas or N new pins), offer a quiet **“Freeze what you found?”** — dismissible, never modal-blocking.  
- Frontier / “Needs you” prioritizes *actionable* seams near Active Threads, not raw curiosity bait.  
- No dark patterns: no “you haven’t shipped today,” no gamified completion pressure.

Deep wander remains how Alex thinks; the Loom’s job is to make wander **recoverable** and one step from Act.

### D16. Switch-cost metric (v1 operational)

**Decision — measurable claim for v1 validation:**

| Variable | v1 target |
|---|---|
| N — time away | ≥ 24 hours (also spot-check ≥ 10 days for Kill test A) |
| M — interrupts in-session | ≥ 3 Thread switches |
| T — time to resume chosen Thread | ≤ 30 seconds to editable/usable anchor |
| K — clarifying clicks | ≤ 2 from Home to restored cursor |

**Banned if it blows the budget:**

- mandatory preflight wizard after first open of a known workspace  
- blocking ingestion modal  
- forcing scale/Atlas before editor  
- requiring ontology pick to resume  
- dumping global Frontier as the only Home  

Instrumentation in prototypes: stopwatch studies + click counts on Kill tests A/B.

### D17. When to surface epistemic friction

**Decision — mode-sensitive trust:**

| Mode | Epistemic friction |
|---|---|
| **Orient / Resume** | Quiet. Only “while you were away” high-impact items for this Thread. |
| **Explore** | Optional. Proposals behind toggle; evidence on select. |
| **Compose pack / Act** | Loud. Budget, exclusions, stale flags, blocked privacy, why-included. |
| **Review after run** | Loud on high-impact knowledge deltas; quiet on low-confidence bulk. |

Joy stays in continuity and readiness; trust friction appears when the user aims at **agency** (what the model will see / what became “true”).

### D18. OS horizon — anti-sprawl fence

**Decision:** Until Kill tests A and B pass with love, the following are **forbidden** in product IA, Loom metaphor extension, and roadmap commitment:

- mail, calendar, chat, browser history as workspace types  
- system-wide agent OS shell  
- hosted account as required path  
- “replace the operating system” messaging in v1 surfaces  

**Allowed as north-star prose only** (vision section, not requirements): same Thread / Loom / Pack / Run lifecycle could later wrap more digital life sources.

**Design rule:** any future source must map to Arrived → Decoded → Connected → Curated → Operational and remain exportable / non-siloed. If it can’t, it doesn’t enter the Loom.

### D19. Emotional contract — compassionate honesty

**Decision:** Default Home is a **compassionate subset**, not the full mess and not a fake zen garden.

- Show Active + Recently touched + Needs-you for those Threads.  
- Full Open Loop inventory and raw Frontier are available on purpose (“Show all”).  
- Copy tone: neutral, specific, reversible — never shaming (“12 neglected projects”). Prefer “3 Threads waiting” / “Agent left 2 claims to review.”  
- Completed / parked Threads leave Home without drama; parking is a first-class, guilt-free act.

### D20. Signature interaction (crown one)

**Decision:** The signature interaction is **Thread Resume with anchor continuity**.

Restore Thread → same object, cursor, and enough local context to continue — in ≤30 seconds — then optionally zoom scale or Act.

**Demoted (important, not signature):**

| Interaction | Role |
|---|---|
| Semantic zoom Source→Structure→Neighborhood | Exploration amplifier |
| Two-second Capture | Habit loop / ND offload |
| Pack boundary on surface | Execution trust |
| Knowledge Pulse | Readiness / anti-waiting-room |
| Ghost promote/accept | Epistemic hygiene |

If Resume-with-continuity were removed, the product would no longer be Happy Desk for Alex. If zoom polish were removed, it would still be testable.

### D21. Writing Feather → Weave (composition-time loom)

**Intent (what the user wants):** While writing or composing, peek into the fabric around the *current focus* — both relations that **already exist** and relations this draft **may produce** — without leaving flow or opening a separate graph app.

**Decision — product name vs UI chrome**

| Layer | Name | Why |
|---|---|---|
| Concept / delight | **Writing Feather** | The “magic” probe: light, intentional, composition-bound |
| UI label | **Weave** | Instrument tone; avoids cartoon “magic” in chrome |
| Icon | Lucide `feather` | One calm SVG; tooltip explains |

**Decision — what it is / is not**

| Is | Is not |
|---|---|
| Focus-following relational foresight while composing | Autocomplete / rewrite copilot |
| Two bands: **Woven** (now) + **Likely** (anticipated) | Another always-on hairball |
| Explore/compose amplifier | Replacement for Thread Resume or Context Pack |
| List-first peek + optional mini neighborhood | Mandatory ontology work |
| Opt-in intensity (whisper → peek → enter) | Ambient ghost wallpaper |

**Epistemic rule:** Anticipated items are `anticipatory` proposals. They never auto-write canonical edges and **never** enter default retrieval or Context Packs until the user pins, relates, or promotes.

**Placement in the shell**

- Editor (Source) stays primary.  
- Right rail gains a third peer tab beside evidence/pack: **Why | Weave | Pack**.  
- Default tab by mode: Orient → quiet (no forced Weave); Explore/Source writing → Weave available; Act → **Pack** preferred.  
- Full Weave may also **dock under the editor** as a non-modal instrument strip (IDE problems-panel pattern) so Pack can stay visible when needed.  
- Never a blocking modal. Esc dismisses Peek and returns focus to the caret.

**Three intensity levels (progressive disclosure)**

1. **Whisper (ambient)** — optional gutter ticks on lines/blocks with relational density (woven and/or likely). Marks use shape + count, not color alone. Default for new users: **off** (or on only after first explicit Weave use). No panel, no focus steal, debounce ≥400ms while typing.  
2. **Peek (invoke)** — shortcut / Build Shelf feather / click gutter tick / command palette “Weave”. Opens Loom Peek anchored to caret or selection.  
3. **Enter (commit)** — from Peek: open in Neighborhood/Structure, Capture as Open Loop, Relate, Pin to pack (explicit), Dismiss/suppress this class, or “Watch focus” (keep peek pinned to selection while scrolling).

**Peek UI contract**

```text
┌─ Weave · focus: ¶ “use embedded index…” ─────────────── [Woven|Likely|Both] ─ Esc ─┐
│ WOVEN (connected now)              │ LIKELY (may connect)                         │
│ • Decision: …  supports  [path]    │ ◦ Open Loop: …  may close   anticipatory     │
│ • ADR-note.md  links_to            │ ◦ Concept: Surreal…  may mention             │
│                                    │ ◦ Thread: engine spike  may join             │
│ Why: authored link · hop 1         │ Why: semantic+loop match · not confirmed     │
└─ Open neighborhood · Capture · Relate · Pin to pack · Suppress ─────────────────────┘
```

- Cap ~8–12 rows per band; virtualize beyond.  
- Every row: title, type icon/shape, relation verb, hop/distance or “draft”, why-chip, one primary action.  
- **Likely** rows use dashed/dotted stitch pattern + “anticipated” / “may …” verbs — never solid “is connected.”  
- Selecting a row can highlight the span in the editor and preview evidence without leaving Source.  
- Optional one-click “mini hop-ring” of the focus only (≤1 hop woven + likely as ghosts); not the default first paint.

**Anticipation signals (v1 honest set)**

- Semantic neighbors of the current sentence/selection (draft embedding or last-saved span).  
- Open Loops / Decisions whose text matches or contradicts the draft.  
- Explicit incomplete links / wiki targets under the caret.  
- Artifacts frequently co-pinned with this Thread or file in past packs (behavioral, opt-in).  
- Structural parents/siblings (folder, headings) when selection is empty — weaker, labeled.

**Flow / ND rules**

- Typing never steals focus into Weave. Updates refresh the open Peek in place.  
- Whisper never animates per keystroke (batch pulses).  
- No guilt (“you’re ignoring 14 likely connections”).  
- Feather does not compete with ≤30s resume: Home/Resume path leaves Weave closed.  
- Reduced motion: no floating feather; instant panel; ticks static.

**Relationship to existing graph features**

| Feature | Job | Feather/Weave |
|---|---|---|
| Neighborhood / hops | Explore existing local graph | Enter target from Peek |
| Ghost proposals | Indexed inferences awaiting review | Overlaps Likely; Weave is *focus-timed* and includes foresight |
| Context Lens / Pack | What the agent will get | Pin from Weave only explicitly |
| Capture | Offload a thought | Capture from a Likely row → Open Loop |
| Relate | Author an edge | Confirm a Likely stitch into authored/proposed |

**Prototype priority:** After Kill-test path works, Weave Peek (list, two bands, invoke) is the next love-feature for exploration flow. Whisper ticks and mini hop-ring can follow. Not required to pass Kill tests A/B.

**Signature ranking update:** Thread Resume remains crowned. Weave is the **composition signature** (second chair) — what makes writing inside Happy Desk feel like looming, not merely editing a file.

---

## Consolidated principles (from both rounds)

1. **Continuity over spectacle.** Visualize how information becomes usable and how work resumes — not the database.  
2. **Threads are the unit; packs are the bullet.**  
3. **Proposed never contaminates default retrieval.**  
4. **Pack-first to act; Loom-first to orient.**  
5. **Resume ≤30s / ≤2 clicks** beats teaching the model.  
6. **Capture defaults to Open Loop**, refine later.  
7. **Compassionate Home, honest full mess on request.**  
8. **File diff primary; knowledge diff exception-based.**  
9. **Folder/Git/agent wedge before OS sprawl.**  
10. **Kill tests A and B gate confidence** — love and switch-cost, not demo gloss.  
11. **Weave (Feather) peeks at woven + likely around focus** — anticipatory never contaminates packs; whisper → peek → enter.

---

## Mode map (Orient → Explore → Act → Review)

```text
Home (Threads)
   │
   ├─ Resume Thread ──► Orient (quiet; Weave closed)
   │                        │
   │                        ├─ Explore / write ──► Weave whisper→peek→enter
   │                        │         (Loom scales, optional ghosts)
   │                        │
   │                        └─ Act (Pack tab loud) ──► Run agent
   │                                                        │
   └─ Capture (≤2s → Open Loop)                      Review (files loud,
                                                      knowledge selective)
```

---

## Fold-in status

| Decision IDs | Target doc | Status |
|---|---|---|
| North star, D1, D10, D11 | `PRODUCT-BRIEF.md` | Folded (v0.2) |
| D2–D9, D12–D17, D19–D20, mode map | `UX-CONCEPT-KNOWLEDGE-LOOM.md` | Folded (v0.2) |
| D9, D16, D18 scope fence, FRs | `PRD.md` | Folded (v0.2) |
| D11 persona, Kill tests A/B | `PRD.md` + brief | Folded |
| Instrument visual system | `design-system/happy-desk/MASTER.md` | Created (ui-ux-pro-max + Loom override) |
| D21 Writing Feather / Weave | Loom + design-system `pages/weave.md` + PRD note | Folding (v0.3) |

Keep this file as the decision log; update version when grill rounds revise a Decision ID.

---

## Revision log

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-08-05 | Initial decisions from Grill Rounds 1–2 |
| 0.2 | 2026-08-05 | Folded into brief, Loom, PRD, README; design system MASTER (instrument, not AI-purple) |
| 0.3 | 2026-08-05 | D21 Writing Feather → Weave UX/UI integration |
