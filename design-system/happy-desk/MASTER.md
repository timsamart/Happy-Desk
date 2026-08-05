# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Happy Desk  
**Generated:** 2026-08-05  
**Revised:** 2026-08-05 (override — instrument aesthetic; reject AI-purple defaults)  
**Category:** Desktop productivity / knowledge instrument / agent context layer  
**Authority:** [docs/GRILL-DECISIONS.md](../../docs/GRILL-DECISIONS.md) · [docs/UX-CONCEPT-KNOWLEDGE-LOOM.md](../../docs/UX-CONCEPT-KNOWLEDGE-LOOM.md)

---

## Product UI thesis

Happy Desk is a **calm professional instrument** (debugger / mapping tool / audio workstation energy), not a chatbot landing page and not a social knowledge app. Density is disciplined; chrome is quiet until Act/Review needs trust friction. Continuity motion beats spectacle.

**Signature interaction:** Thread Resume with anchor continuity (≤30s, ≤2 clicks from Home).

**Primary CTA per mode:** Resume / Continue on Home & Orient; **Act** (pack → run) on Thread; Capture always reachable; **Weave** while writing (Explore).

**Composition signature (second chair):** Writing Feather → Weave peek (woven + likely).

---

## Style

| Choice | Decision | Source |
|---|---|---|
| Primary style | Professional instrument + Swiss Modernism 2.0 discipline | Grill + Loom + ui-ux-pro-max style search |
| Density | Data-dense desktop (comfortable + compact modes) | Loom + Data-Dense Dashboard guidance |
| Not | AI-Native purple chat UI, glassmorphism, neon graph glow, emoji icons | Anti-patterns |

**Keywords:** calm, exact, keyboard-first, progressive disclosure, spatial continuity, high information density, restrained chrome.

---

## Color Palette

Aligned with Loom tokens and Professional SaaS / trust-blue recommendation (`#0369A1` accent on `#F8FAFC`).

### Light

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Background | `#F8FAFC` | `--color-background` |
| Foreground | `#020617` | `--color-foreground` |
| Surface / Card | `#FFFFFF` | `--color-surface` |
| Muted | `#E8ECF1` | `--color-muted` |
| Muted foreground | `#64748B` | `--color-muted-foreground` |
| Border | `#E2E8F0` | `--color-border` |
| Primary / focus | `#0369A1` | `--color-primary` |
| On primary | `#FFFFFF` | `--color-on-primary` |
| Ring | `#0369A1` | `--color-ring` |
| Destructive | `#DC2626` | `--color-destructive` |
| Success (semantic only) | `#15803D` | `--color-success` |
| Warning (semantic only) | `#B45309` | `--color-warning` |

### Dark

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Background | `#0F172A` | `--color-background` |
| Foreground | `#F8FAFC` | `--color-foreground` |
| Surface | `#1E293B` | `--color-surface` |
| Border | `#334155` | `--color-border` |
| Primary / focus | `#38BDF8` | `--color-primary` |
| On primary | `#0F172A` | `--color-on-primary` |

**Rules:** Semantic colors reserved for active Lens meanings; never encode type/confidence/strength by color alone (shape + label + pattern). No purple primary. No cream/terracotta “AI default” look.

---

## Typography

| Role | Family | Notes |
|------|--------|-------|
| UI + reading | **IBM Plex Sans** | Instrument readability; not Inter/Roboto/system default stack as brand |
| Paths, IDs, scores, code | **IBM Plex Mono** | Tabular where useful for scores/budgets |

**Scale (desktop):** 12 / 14 / 16 / 18 / 24 / 32. Body ≥14px; comfortable mode 16px body. Line-height ~1.5 for prose; denser (~1.35) for lists/tables. Editor measure 65–75 characters when not in code mode.

---

## Spacing & layout

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` | Tight inline |
| `--space-sm` | `8px` | Icon gaps, dense lists |
| `--space-md` | `16px` | Standard padding |
| `--space-lg` | `24px` | Pane padding |
| `--space-xl` | `32px` | Section breaks |

- 8px base rhythm; 12-column mental grid for pane chrome.  
- Touch / pointer targets ≥40px desktop, ≥44px touch mode.  
- Resizable panes with minimum readable widths.  
- Reserve layout space for async Pulse / lists (no CLS jumps).

---

## Elevation & chrome

Restrained. Prefer 1px borders over multi-layer shadows. No glassmorphism, no floating-card excess, no neon graph glow.

| Level | Usage |
|-------|-------|
| Flat + border | Default panes, lists, Home threads |
| `--shadow-sm` | Menus, popovers only |
| Scrim 40–60% | Modals / sheets only |

**Cards:** Default no cards. Use list rows and panes. Cards only when they are the interaction container (e.g. Thread row as hit target is a row, not a marketing card).

---

## Motion

| Token | Value |
|-------|-------|
| Continuity morph | 150–250ms transform/opacity |
| Micro feedback | 150–200ms ease-out |
| Exit | ~60–70% of enter duration |

- Motion expresses **cause → effect** and **spatial continuity** (Thread resume, scale zoom).  
- Animate ≤1–2 key elements per view.  
- `prefers-reduced-motion: reduce` → immediate transitions + persistent breadcrumbs; no morph.  
- Never block input during animation; animations interruptible.

---

## Icons

One SVG set (**Lucide**). No emoji as controls. Consistent stroke; filled vs outline by hierarchy only.

---

## Interaction & accessibility (non-negotiable)

From ui-ux-pro-max UX domain + Loom a11y:

- Visible focus rings (2–4px); never remove without replacement.  
- Full keyboard paths; graph always has list/table equivalent.  
- Color not sole indicator.  
- Text contrast ≥4.5:1 (AA); large text ≥3:1.  
- Icon-only buttons need `aria-label`.  
- Progressive disclosure: Orient quiet → Explore optional → Act/Review loud (D17).  
- Loading >300ms: Pulse / skeleton / determinate coverage — never fake % when total grows.  
- Virtualize lists ≥50 items; default neighborhood cap 300 nodes.  
- Escape routes on every modal; confirm dismiss with unsaved capture/pack edits.  
- Primary action singular per screen region (Home → Resume; Thread → Act).

---

## Component notes

### Buttons

```css
.btn-primary {
  background: var(--color-primary);
  color: var(--color-on-primary);
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 600;
  transition: background 150ms ease-out, box-shadow 150ms ease-out;
  cursor: pointer;
  min-height: 40px;
}
.btn-primary:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-ring) 35%, transparent);
}
.btn-secondary {
  background: transparent;
  color: var(--color-foreground);
  border: 1px solid var(--color-border);
  padding: 10px 16px;
  border-radius: 6px;
  min-height: 40px;
  cursor: pointer;
}
```

### Thread row (Home)

- Title, last-touched, optional “Needs you” badge (count + text, not color alone).  
- One-line “while you were away” when present.  
- Park / Act as secondary; row click = Resume.

### Knowledge Pulse

- Thin expandable band; never a blocking modal after known-workspace open.  
- Capability coverage language, not vanity percent.

### Context Pack boundary

- Visible boundary on surface + ordered manifest; budget always visible in Act mode.

---

## Anti-patterns (Do NOT Use)

- ❌ AI purple / indigo / pink “generation” palettes as brand  
- ❌ Inter / Roboto / Arial as the intentional brand stack  
- ❌ Emoji as icons  
- ❌ Global force-directed hairball as default  
- ❌ Blocking ingestion wizard after safe preflight  
- ❌ Universal “AI confidence” score color  
- ❌ Invisible agent retrieval payloads  
- ❌ Shame copy (“12 neglected projects”)  
- ❌ Gamified streaks / “you haven’t shipped”  
- ❌ Glassmorphism, neon glow, decorative gradients as main visual idea  
- ❌ Teaching three epistemic axes on day one  
- ❌ Mail/calendar/chat/OS-shell IA before Kill tests A/B pass  

---

## Page / surface map

| Surface | Overrides file (optional) | Mode |
|---------|---------------------------|------|
| Home (Threads) | `pages/home.md` | Orient |
| Continuous knowledge surface | `pages/loom-surface.md` | Orient / Explore |
| Weave (Writing Feather) | `pages/weave.md` | Explore / Write |
| Context Lens / Pack | `pages/context-pack.md` | Act |
| Agent Dock + Review | `pages/agent-review.md` | Review |
| Capture | overlay | always |

---

## Pre-Delivery Checklist

- [ ] No emojis as icons (Lucide SVG)  
- [ ] `cursor-pointer` on clickable elements  
- [ ] Focus visible; keyboard parity for graph ops  
- [ ] Contrast AA light + dark tested separately  
- [ ] `prefers-reduced-motion` respected  
- [ ] Pulse / async regions reserve space (no layout jump)  
- [ ] Touch targets ≥40/44px  
- [ ] Home shows compassionate subset only  
- [ ] Proposed ghosts off by default in Orient  
- [ ] Pack Act mode shows budget + why-included  
