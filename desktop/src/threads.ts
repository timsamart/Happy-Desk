/** Fixture-aligned Threads — see fixtures/sample-project/FIXTURE.md */
export type Thread = {
  id: string;
  title: string;
  group: "active" | "recent";
  meta: string;
  needsYou: boolean;
  body: string;
};

export const threads: Thread[] = [
  {
    id: "engine",
    title: "Engine spike",
    group: "active",
    meta: "Anchor · docs/architecture.md · 2h ago",
    needsYou: true,
    body: "We should use an embedded index for Happy Desk so the graph, FTS, and vectors stay local and rebuildable.",
  },
  {
    id: "loom",
    title: "Loom UX copy",
    group: "active",
    meta: "Anchor · docs/loom-notes.md · yesterday",
    needsYou: false,
    body: "Signature interaction is Thread Resume. Weave is second chair — composition-time foresight, not the home screen.",
  },
  {
    id: "pack",
    title: "Context Pack contract",
    group: "active",
    meta: "Anchor · docs/context-pack.md · 3d ago",
    needsYou: false,
    body: "Packs must be inspectable: pins, exclusions, budget, hashes. Ranked list alone must be enough to Act.",
  },
  {
    id: "readme",
    title: "README tone",
    group: "recent",
    meta: "Parked · README.md · 5d ago",
    needsYou: false,
    body: "Continuity workspace framing — not another AI chat.",
  },
];
