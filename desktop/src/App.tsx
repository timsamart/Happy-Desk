import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { threads, type Thread } from "./threads";
import "./App.css";

type View = "home" | "thread";

function App() {
  const [view, setView] = useState<View>("home");
  const [active, setActive] = useState<Thread | null>(null);
  const [workspace, setWorkspace] = useState("fixtures/sample-project");
  const [captureHint, setCaptureHint] = useState<string | null>(null);

  useEffect(() => {
    invoke<string>("get_workspace_label")
      .then(setWorkspace)
      .catch(() => {
        /* browser-only vite preview: keep default label */
      });
  }, []);

  function resume(thread: Thread) {
    setActive(thread);
    setView("thread");
    setCaptureHint(null);
  }

  function goHome() {
    setView("home");
    setActive(null);
  }

  function capture() {
    setCaptureHint("Capture → Open Loop (stub). Full Capture lands in a later Phase 1 increment.");
  }

  const activeThreads = threads.filter((t) => t.group === "active");
  const recentThreads = threads.filter((t) => t.group === "recent");

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          Happy Desk <span className="proto">Phase 1 · Living Folder toe-dip</span>
        </div>
        <div className="top-actions">
          <button type="button" className="btn ghost" onClick={capture}>
            Capture
          </button>
          <button type="button" className="btn ghost" onClick={goHome}>
            Home
          </button>
        </div>
      </header>

      <div className="pulse" role="status">
        Knowledge Pulse · exact search ready · semantic offline · graph candidates deferred · 0 blocking
      </div>

      {captureHint && (
        <div className="banner" role="status">
          {captureHint}
        </div>
      )}

      {view === "home" ? (
        <section className="view">
          <aside className="rail">
            <h2>Workspace</h2>
            <p className="muted path">{workspace}</p>
            <ul className="nav-list">
              <li className="active">Threads</li>
              <li className="muted">Files</li>
              <li className="muted">Open loops</li>
            </ul>
          </aside>
          <main className="main">
            <header className="main-head">
              <h1>Home</h1>
              <p className="lede">
                Active + recent only. Resume restores the Thread cursor — ≤2 clicks from here.
              </p>
            </header>
            <div className="needs">
              Needs you · Agent left 2 claims on <strong>Engine spike</strong>
            </div>
            <h3 className="section-label">Active</h3>
            <ul className="thread-list" aria-label="Active threads">
              {activeThreads.map((t) => (
                <li key={t.id}>
                  <button type="button" className="thread-row" onClick={() => resume(t)}>
                    <span className="thread-title">
                      {t.title}
                      {t.needsYou && <span className="badge">needs you</span>}
                    </span>
                    <span className="thread-meta">{t.meta}</span>
                  </button>
                </li>
              ))}
            </ul>
            <h3 className="section-label">Recently touched</h3>
            <ul className="thread-list" aria-label="Recent threads">
              {recentThreads.map((t) => (
                <li key={t.id}>
                  <button type="button" className="thread-row" onClick={() => resume(t)}>
                    <span className="thread-title">{t.title}</span>
                    <span className="thread-meta">{t.meta}</span>
                  </button>
                </li>
              ))}
            </ul>
          </main>
        </section>
      ) : (
        active && (
          <section className="view workspace">
            <aside className="rail">
              <button type="button" className="linkish" onClick={goHome}>
                ← Threads
              </button>
              <h2>{active.title}</h2>
              <p className="muted">{active.meta}</p>
              <ul className="nav-list">
                <li className="active">Source</li>
                <li className="muted">Structure</li>
                <li className="muted">Neighborhood</li>
              </ul>
              <div className="shelf">
                <button type="button" className="btn ghost small" onClick={capture}>
                  Capture
                </button>
                <button type="button" className="btn primary small" disabled title="Pack / Act later">
                  Act
                </button>
              </div>
            </aside>
            <main className="main">
              <header className="main-head">
                <h1>Source</h1>
                <p className="lede">Markdown editor lands next — stub body for resume continuity.</p>
              </header>
              <article className="source-stub">
                <p>{active.body}</p>
              </article>
            </main>
            <aside className="lens muted-pane">
              <h3 className="section-label">Lens</h3>
              <p className="muted">Neighborhood and Weave deferred. Home resume path is the toe-dip.</p>
            </aside>
          </section>
        )
      )}
    </div>
  );
}

export default App;
