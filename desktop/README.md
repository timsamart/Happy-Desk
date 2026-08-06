# Happy Desk desktop (Phase 1 toe-dip)

Tauri 2 + React/TypeScript shell for **Living Folder + Home**.

Authority: [`docs/PHASE-1.md`](../docs/PHASE-1.md) · design tokens from [`design-system/happy-desk/MASTER.md`](../design-system/happy-desk/MASTER.md).

## Develop

```bash
npm install
npm run tauri dev
```

Frontend-only (no native window):

```bash
npm run dev
```

## Verify

```bash
npm run build
cargo check --manifest-path src-tauri/Cargo.toml
```

## Toe-dip scope

- Home with fixture-aligned Threads (`fixtures/sample-project`)
- Resume → Thread source stub
- Capture affordance (stub)
- Quiet Knowledge Pulse strip
- `get_workspace_label` Tauri command

Not yet: folder picker, explorer, CodeMirror, watcher, KnowledgeIndex IPC.
