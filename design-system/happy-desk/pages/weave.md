# design-system/happy-desk/pages/weave.md

> Overrides [MASTER.md](../MASTER.md) for the Writing Feather / **Weave** surface (D21).

## Purpose

Composition-time relational foresight around the editor focus: **Woven** (now) + **Likely** (anticipated). Instrument, not chatbot sidebar.

## Chrome

| Element | Spec |
|---|---|
| Label | **Weave** (not “Magic Feather” in UI) |
| Icon | Lucide `feather`, 20–24px, stroke aligned with set |
| Tooltip | “Relations of this focus — woven and likely” |
| Tabs | Peer with **Why** and **Pack** in the right rail |
| Dock alt | Optional strip under editor (non-modal); Esc closes → caret |

## States

| State | Visual |
|---|---|
| Closed | No panel; optional gutter whisper ticks if enabled |
| Peek open | Panel or dock; focus remains in editor unless user tabs in |
| Row hover | Background muted; no layout shift |
| Likely row | Dashed left rule + “anticipated” / “may …” verb; never solid edge color as “true” |
| Woven row | Solid left rule; hop / source label |

## Whisper ticks

- 2–3px marks in editor gutter; density encoded by count or stacked ticks, not hue alone.  
- Default **off** for new users.  
- No per-keyframe animation; batch refresh ≥400ms.  
- Hit target ≥40px tall per line group when clickable.

## Peek list

- Max ~8–12 visible rows per band before scroll/virtualize.  
- Row anatomy: type shape/icon · title (truncate) · verb · why chip · overflow actions.  
- Primary row action: open target or expand why.  
- Destructive/suppress visually separated.

## Motion

- Open/close Peek: 150–200ms opacity + slight translate from rail or dock edge.  
- No floating feather particle effects.  
- `prefers-reduced-motion`: instant show/hide.

## Copy

- Woven header: “Connected now”  
- Likely header: “May connect”  
- Empty Woven: “Nothing woven to this focus yet.”  
- Empty Likely: “No anticipations for this span.”  
- Never: “You’re missing 14 connections.”

## Anti-patterns

- ❌ Auto-pinning Likely into Pack  
- ❌ Replacing Pack tab during Act without user choice  
- ❌ Stealing caret focus on each keystroke refresh  
- ❌ Sparkle / purple “AI magic” styling  
- ❌ Full workspace graph inside Peek  

## Mode defaults

| Mode | Weave |
|---|---|
| Orient / Resume | Closed |
| Explore / Write | Available; whisper per preference |
| Act | Pack tab preferred; Weave one click away |
| Review | Closed unless user opens |
