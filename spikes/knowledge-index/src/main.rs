//! Phase 0.1 KnowledgeIndex spike against `fixtures/sample-project`.
//!
//! Checks: embed → ingest → BM25 FTS (no contains) → incremental hash-skip → 2-hop → rebuild.

use anyhow::{bail, Context, Result};
use regex::Regex;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::{HashMap, HashSet, VecDeque};
use std::path::{Path, PathBuf};
use surrealdb::engine::local::{Db, Mem, SurrealKv};
use surrealdb::Surreal;
use walkdir::WalkDir;

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Node {
    nid: String,
    kind: String,
    subtype: String,
    uri: String,
    title: String,
    body: String,
    content_hash: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Edge {
    eid: String,
    from_id: String,
    to_id: String,
    kind: String,
    source: String,
    strength: f32,
    confidence: f32,
    review_state: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Hit {
    nid: String,
    uri: String,
    title: String,
    score_hint: String,
}

trait KnowledgeIndex {
    async fn upsert_node(&self, node: &Node) -> Result<()>;
    async fn upsert_edge(&self, edge: &Edge) -> Result<()>;
    async fn search_fts(&self, q: &str, limit: usize) -> Result<Vec<Hit>>;
    async fn neighborhood(&self, id: &str, hops: u8) -> Result<Vec<Node>>;
    async fn get_node(&self, id: &str) -> Result<Option<Node>>;
    async fn rebuild_from_workspace(&self, root: &Path) -> Result<IngestStats>;
}

#[derive(Debug, Default)]
struct IngestStats {
    files: usize,
    nodes: usize,
    edges: usize,
    objects: usize,
    /// File/folder nodes whose content_hash matched an existing record (skipped upsert).
    skipped: usize,
    /// File/folder nodes created or updated this pass.
    upserted: usize,
}

struct SurrealIndex {
    db: Surreal<Db>,
}

impl SurrealIndex {
    async fn open_mem() -> Result<Self> {
        let db = Surreal::new::<Mem>(()).await.context("open mem db")?;
        db.use_ns("happy").use_db("spike").await?;
        let idx = Self { db };
        idx.migrate().await?;
        Ok(idx)
    }

    async fn open_surrealkv(path: &Path) -> Result<Self> {
        if path.exists() {
            std::fs::remove_dir_all(path).ok();
        }
        std::fs::create_dir_all(path)?;
        let db = Surreal::new::<SurrealKv>(path)
            .await
            .context("open SurrealKv db")?;
        db.use_ns("happy").use_db("spike").await?;
        let idx = Self { db };
        idx.migrate().await?;
        Ok(idx)
    }

    async fn migrate(&self) -> Result<()> {
        // Surreal FTS: one SEARCH index per field. A combined title+body index
        // silently fails to match; Phase 0.1 splits them.
        self.db
            .query(
                r#"
                DEFINE TABLE IF NOT EXISTS node SCHEMALESS;
                DEFINE INDEX IF NOT EXISTS node_nid ON node FIELDS nid UNIQUE;
                DEFINE INDEX IF NOT EXISTS node_uri ON node FIELDS uri;
                DEFINE ANALYZER IF NOT EXISTS spike_analyzer TOKENIZERS blank, class FILTERS lowercase, snowball(english);
                DEFINE INDEX IF NOT EXISTS node_title_fts ON node FIELDS title SEARCH ANALYZER spike_analyzer BM25;
                DEFINE INDEX IF NOT EXISTS node_body_fts ON node FIELDS body SEARCH ANALYZER spike_analyzer BM25;

                DEFINE TABLE IF NOT EXISTS edge SCHEMALESS;
                DEFINE INDEX IF NOT EXISTS edge_eid ON edge FIELDS eid UNIQUE;
                DEFINE INDEX IF NOT EXISTS edge_from ON edge FIELDS from_id;
                DEFINE INDEX IF NOT EXISTS edge_to ON edge FIELDS to_id;
                "#,
            )
            .await
            .context("migrate")?;
        Ok(())
    }

    async fn get_node_by_uri(&self, uri: &str) -> Result<Option<Node>> {
        let mut response = self
            .db
            .query(
                "SELECT nid, kind, subtype, uri, title, body, content_hash FROM node WHERE uri = $uri LIMIT 1;",
            )
            .bind(("uri", uri.to_string()))
            .await?;
        let rows: Vec<Node> = response.take(0).unwrap_or_default();
        Ok(rows.into_iter().next())
    }
}

impl KnowledgeIndex for SurrealIndex {
    async fn upsert_node(&self, node: &Node) -> Result<()> {
        self.db
            .query("DELETE node WHERE nid = $nid; CREATE node CONTENT $node;")
            .bind(("nid", node.nid.clone()))
            .bind(("node", node.clone()))
            .await
            .context("upsert_node")?;
        Ok(())
    }

    async fn upsert_edge(&self, edge: &Edge) -> Result<()> {
        self.db
            .query("DELETE edge WHERE eid = $eid; CREATE edge CONTENT $edge;")
            .bind(("eid", edge.eid.clone()))
            .bind(("edge", edge.clone()))
            .await
            .context("upsert_edge")?;
        Ok(())
    }

    async fn search_fts(&self, q: &str, limit: usize) -> Result<Vec<Hit>> {
        // No contains fallback — Phase 0.1 requires BM25 SEARCH hits.
        let mut response = self
            .db
            .query(
                r#"
                SELECT nid, uri, title,
                       search::score(0) AS title_score,
                       search::score(1) AS body_score
                FROM node
                WHERE title @0@ $q OR body @1@ $q
                LIMIT $limit;
                "#,
            )
            .bind(("q", q.to_string()))
            .bind(("limit", limit as i64))
            .await
            .context("search_fts")?;

        #[derive(Deserialize)]
        struct Row {
            nid: String,
            uri: String,
            title: String,
            title_score: Option<f32>,
            body_score: Option<f32>,
        }

        let mut rows: Vec<Row> = response.take(0).unwrap_or_default();
        rows.sort_by(|a, b| {
            let sa = a.title_score.unwrap_or(0.0) + a.body_score.unwrap_or(0.0);
            let sb = b.title_score.unwrap_or(0.0) + b.body_score.unwrap_or(0.0);
            sb.partial_cmp(&sa).unwrap_or(std::cmp::Ordering::Equal)
        });
        Ok(rows
            .into_iter()
            .map(|r| {
                let score = r.title_score.unwrap_or(0.0) + r.body_score.unwrap_or(0.0);
                Hit {
                    nid: r.nid,
                    uri: r.uri,
                    title: r.title,
                    score_hint: format!("{:.4}", score),
                }
            })
            .collect())
    }

    async fn neighborhood(&self, id: &str, hops: u8) -> Result<Vec<Node>> {
        let mut seen = HashSet::new();
        let mut out = Vec::new();
        let mut q = VecDeque::new();
        q.push_back((id.to_string(), 0u8));
        seen.insert(id.to_string());

        while let Some((cur, depth)) = q.pop_front() {
            if let Some(n) = self.get_node(&cur).await? {
                if cur != id {
                    out.push(n);
                }
            }
            if depth >= hops {
                continue;
            }
            let mut response = self
                .db
                .query(
                    r#"
                    SELECT from_id, to_id FROM edge
                    WHERE from_id = $id OR to_id = $id;
                    "#,
                )
                .bind(("id", cur.clone()))
                .await?;

            #[derive(Deserialize)]
            struct E {
                from_id: String,
                to_id: String,
            }
            let edges: Vec<E> = response.take(0).unwrap_or_default();
            for e in edges {
                let next = if e.from_id == cur {
                    e.to_id
                } else {
                    e.from_id
                };
                if seen.insert(next.clone()) {
                    q.push_back((next, depth + 1));
                }
            }
        }
        Ok(out)
    }

    async fn get_node(&self, id: &str) -> Result<Option<Node>> {
        let mut response = self
            .db
            .query("SELECT nid, kind, subtype, uri, title, body, content_hash FROM node WHERE nid = $nid LIMIT 1;")
            .bind(("nid", id.to_string()))
            .await?;
        let rows: Vec<Node> = response.take(0).unwrap_or_default();
        Ok(rows.into_iter().next())
    }

    async fn rebuild_from_workspace(&self, root: &Path) -> Result<IngestStats> {
        self.db.query("DELETE node; DELETE edge;").await?;
        ingest_workspace(self, root).await
    }
}

fn slug_id(prefix: &str, uri: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(uri.as_bytes());
    let digest = format!("{:x}", hasher.finalize());
    format!("{prefix}_{}", &digest[..16])
}
fn content_hash(bytes: &[u8]) -> String {
    let mut hasher = Sha256::new();
    hasher.update(bytes);
    format!("{:x}", hasher.finalize())
}

fn title_from_path(path: &Path) -> String {
    path.file_name()
        .and_then(|s| s.to_str())
        .unwrap_or("untitled")
        .to_string()
}

fn parse_md_links(body: &str) -> Vec<String> {
    let re = Regex::new(r"\[([^\]]*)\]\(([^)]+)\)").unwrap();
    re.captures_iter(body)
        .filter_map(|c| c.get(2).map(|m| m.as_str().to_string()))
        .filter(|t| !t.starts_with("http") && !t.starts_with('#'))
        .collect()
}

fn parse_object_front(body: &str) -> HashMap<String, String> {
    // Tiny YAML-ish key: value parser for fixture objects.
    let mut map = HashMap::new();
    for line in body.lines() {
        if let Some((k, v)) = line.split_once(':') {
            let k = k.trim();
            let v = v.trim();
            if !k.is_empty() && !v.is_empty() && !k.starts_with(' ') {
                map.insert(k.to_string(), v.to_string());
            }
        }
    }
    map
}

async fn upsert_node_if_changed(
    index: &SurrealIndex,
    node: &Node,
    stats: &mut IngestStats,
) -> Result<bool> {
    if let Some(existing) = index.get_node_by_uri(&node.uri).await? {
        if existing.content_hash == node.content_hash {
            stats.skipped += 1;
            return Ok(false);
        }
    }
    index.upsert_node(node).await?;
    stats.upserted += 1;
    stats.nodes += 1;
    Ok(true)
}

async fn ingest_workspace(index: &SurrealIndex, root: &Path) -> Result<IngestStats> {
    let mut stats = IngestStats::default();
    let mut uri_to_id: HashMap<String, String> = HashMap::new();
    let mut pending_links: Vec<(String, String)> = Vec::new();
    // Files whose body changed (or are new) — refresh derived edges for these only.
    let mut dirty_files: HashSet<String> = HashSet::new();

    let skip = |p: &Path| {
        let s = p.to_string_lossy().replace('\\', "/");
        s.contains("/target/") || s.contains("/.spike-data/")
    };

    // Pass 1: files + folders + markdown link discovery
    for entry in WalkDir::new(root).into_iter().filter_map(|e| e.ok()) {
        if !entry.file_type().is_file() {
            continue;
        }
        let path = entry.path();
        if skip(path) {
            continue;
        }
        let rel = path.strip_prefix(root).unwrap_or(path);
        let uri = rel.to_string_lossy().replace('\\', "/");
        let ext = path
            .extension()
            .and_then(|e| e.to_str())
            .unwrap_or("")
            .to_lowercase();

        let is_text = matches!(ext.as_str(), "md" | "rs" | "txt" | "toml");
        if !is_text {
            continue;
        }

        let bytes = std::fs::read(path).with_context(|| format!("read {uri}"))?;
        let body = String::from_utf8_lossy(&bytes).to_string();
        let id = slug_id("file", &uri);

        let (kind, subtype) = if uri.contains(".happy-desk/objects/") {
            let meta = parse_object_front(&body);
            let subtype = meta
                .get("kind")
                .cloned()
                .unwrap_or_else(|| "work_object".into());
            stats.objects += 1;
            ("work_object".into(), subtype)
        } else if ext == "rs" {
            ("artifact".into(), "code".into())
        } else {
            ("artifact".into(), "file".into())
        };

        let title = if kind == "work_object" {
            parse_object_front(&body)
                .get("title")
                .cloned()
                .unwrap_or_else(|| title_from_path(path))
        } else {
            title_from_path(path)
        };

        let node = Node {
            nid: id.clone(),
            kind,
            subtype,
            uri: uri.clone(),
            title,
            body: body.clone(),
            content_hash: content_hash(&bytes),
        };
        let changed = upsert_node_if_changed(index, &node, &mut stats).await?;
        uri_to_id.insert(uri.clone(), id.clone());
        stats.files += 1;
        if changed {
            dirty_files.insert(uri.clone());
        }

        if ext == "md" {
            for target in parse_md_links(&body) {
                pending_links.push((uri.clone(), target));
            }
        }

        if let Some(parent) = Path::new(&uri).parent() {
            let puri = parent.to_string_lossy().replace('\\', "/");
            if !puri.is_empty() && puri != "." {
                if !uri_to_id.contains_key(&puri) {
                    let pid = slug_id("folder", &puri);
                    let folder = Node {
                        nid: pid.clone(),
                        kind: "artifact".into(),
                        subtype: "folder".into(),
                        uri: puri.clone(),
                        title: title_from_path(parent),
                        body: String::new(),
                        content_hash: content_hash(puri.as_bytes()),
                    };
                    let _ = upsert_node_if_changed(index, &folder, &mut stats).await?;
                    uri_to_id.insert(puri.clone(), pid);
                }
                if changed {
                    let eid = slug_id("edge", &format!("contains:{puri}->{uri}"));
                    let edge = Edge {
                        eid,
                        from_id: uri_to_id[&puri].clone(),
                        to_id: id.clone(),
                        kind: "contains".into(),
                        source: "structural".into(),
                        strength: 1.0,
                        confidence: 1.0,
                        review_state: "accepted".into(),
                    };
                    index.upsert_edge(&edge).await?;
                    stats.edges += 1;
                }
            }
        }
    }

    // Pass 2: markdown links → links_to (only for dirty sources)
    for (from_uri, raw_target) in pending_links {
        if !dirty_files.contains(&from_uri) {
            continue;
        }
        let target = raw_target.split('#').next().unwrap_or(&raw_target);
        let resolved = resolve_link(&from_uri, target);
        let Some(to_id) = uri_to_id.get(&resolved).cloned().or_else(|| {
            let with_md = if resolved.ends_with(".md") {
                resolved.clone()
            } else {
                format!("{resolved}.md")
            };
            uri_to_id.get(&with_md).cloned()
        }) else {
            continue;
        };
        let from_id = uri_to_id[&from_uri].clone();
        let eid = slug_id("edge", &format!("links_to:{from_uri}->{resolved}"));
        let edge = Edge {
            eid,
            from_id,
            to_id,
            kind: "links_to".into(),
            source: "authored".into(),
            strength: 0.9,
            confidence: 1.0,
            review_state: "accepted".into(),
        };
        index.upsert_edge(&edge).await?;
        stats.edges += 1;
    }

    // Pass 3: work-object anchors → anchored_in (dirty objects only)
    let object_uris: Vec<(String, String)> = uri_to_id
        .iter()
        .filter(|(uri, _)| uri.contains(".happy-desk/objects/") && dirty_files.contains(*uri))
        .map(|(u, i)| (u.clone(), i.clone()))
        .collect();

    for (uri, id) in object_uris {
        let node = index.get_node(&id).await?.context("object node")?;
        let mut anchors = Vec::new();
        let mut in_anchors = false;
        for line in node.body.lines() {
            if line.trim_start().starts_with("anchors:") {
                in_anchors = true;
                continue;
            }
            if in_anchors {
                let t = line.trim();
                if let Some(rest) = t.strip_prefix("- ") {
                    anchors.push(rest.trim().to_string());
                } else if !t.is_empty() && !t.starts_with('#') && t.contains(':') {
                    break;
                }
            }
        }
        for a in anchors {
            if let Some(to_id) = uri_to_id.get(&a) {
                let eid = slug_id("edge", &format!("anchored_in:{uri}->{a}"));
                let edge = Edge {
                    eid,
                    from_id: id.clone(),
                    to_id: to_id.clone(),
                    kind: "anchored_in".into(),
                    source: "authored".into(),
                    strength: 1.0,
                    confidence: 1.0,
                    review_state: "accepted".into(),
                };
                index.upsert_edge(&edge).await?;
                stats.edges += 1;
            }
        }
    }

    Ok(stats)
}

fn resolve_link(from_uri: &str, target: &str) -> String {
    let target = target.trim_start_matches("./");
    if target.starts_with("../") {
        let mut base = PathBuf::from(from_uri);
        base.pop();
        for part in Path::new(target).components() {
            match part {
                std::path::Component::ParentDir => {
                    base.pop();
                }
                std::path::Component::Normal(p) => base.push(p),
                _ => {}
            }
        }
        return base.to_string_lossy().replace('\\', "/");
    }
    if let Some(parent) = Path::new(from_uri).parent() {
        return parent.join(target).to_string_lossy().replace('\\', "/");
    }
    target.to_string()
}

#[derive(Debug)]
struct CheckResult {
    name: &'static str,
    pass: bool,
    detail: String,
}

async fn run_checks(workspace: &Path, db_path: &Path) -> Result<Vec<CheckResult>> {
    let mut results = Vec::new();

    // 1) Embed on disk (SurrealKV)
    let embed = match SurrealIndex::open_surrealkv(db_path).await {
        Ok(idx) => {
            results.push(CheckResult {
                name: "embed_surrealkv",
                pass: true,
                detail: format!("opened {}", db_path.display()),
            });
            idx
        }
        Err(e) => {
            results.push(CheckResult {
                name: "embed_surrealkv",
                pass: false,
                detail: format!("{e:#}"),
            });
            // Fall back to mem so remaining logic still runs.
            results.push(CheckResult {
                name: "embed_mem_fallback",
                pass: true,
                detail: "using in-memory engine for remaining checks".into(),
            });
            SurrealIndex::open_mem().await?
        }
    };

    // 2) Ingest
    let stats = ingest_workspace(&embed, workspace).await?;
    results.push(CheckResult {
        name: "ingest",
        pass: stats.nodes > 0 && stats.objects >= 2 && stats.upserted > 0,
        detail: format!(
            "files={} upserted={} skipped={} edges={} objects={}",
            stats.files, stats.upserted, stats.skipped, stats.edges, stats.objects
        ),
    });

    // 3) FTS via BM25 (no contains fallback)
    let hits = embed.search_fts("embedded index", 5).await?;
    let fts_has_arch = hits.iter().any(|h| h.uri.contains("architecture.md"));
    let fts_all_bm25 = !hits.is_empty()
        && hits.iter().all(|h| h.score_hint != "contains" && h.score_hint.parse::<f32>().is_ok());
    results.push(CheckResult {
        name: "fts_bm25_no_fallback",
        pass: fts_has_arch && fts_all_bm25,
        detail: if hits.is_empty() {
            "no BM25 hits".into()
        } else {
            hits.iter()
                .map(|h| format!("{} ({})", h.uri, h.score_hint))
                .collect::<Vec<_>>()
                .join(" | ")
        },
    });

    // 4) Incremental ingest — unchanged corpus should hash-skip
    let stats2 = ingest_workspace(&embed, workspace).await?;
    results.push(CheckResult {
        name: "incremental_hash_skip",
        pass: stats2.skipped > 0 && stats2.upserted == 0 && stats2.edges == 0,
        detail: format!(
            "files={} upserted={} skipped={} edges={}",
            stats2.files, stats2.upserted, stats2.skipped, stats2.edges
        ),
    });

    // 5) 2-hop from decision object
    let decision_id = slug_id(
        "file",
        ".happy-desk/objects/decision-embedded-index.md",
    );
    // Windows path in walk uses forward slash after normalize — confirm node exists
    let decision = embed.get_node(&decision_id).await?;
    let decision_id = if decision.is_some() {
        decision_id
    } else {
        // find by uri
        let mut response = embed
            .db
            .query("SELECT nid FROM node WHERE uri CONTAINS 'decision-embedded-index' LIMIT 1;")
            .await?;
        #[derive(Deserialize)]
        struct IdRow {
            nid: String,
        }
        let rows: Vec<IdRow> = response.take(0).unwrap_or_default();
        rows.first().map(|r| r.nid.clone()).unwrap_or(decision_id)
    };

    let neigh = embed.neighborhood(&decision_id, 2).await?;
    let hop_pass = neigh.iter().any(|n| {
        n.uri.contains("architecture.md")
            || n.uri.contains("context-pack")
            || n.uri.contains("loom-notes")
            || n.subtype == "folder"
    });
    results.push(CheckResult {
        name: "two_hop_from_decision",
        pass: hop_pass && !neigh.is_empty(),
        detail: neigh
            .iter()
            .map(|n| format!("{}:{}", n.subtype, n.uri))
            .collect::<Vec<_>>()
            .join(" | "),
    });

    // 6) Rebuild
    let _ = embed.rebuild_from_workspace(workspace).await?;
    let after = embed
        .db
        .query("SELECT count() AS c FROM node WHERE uri CONTAINS 'decision-embedded-index' GROUP ALL;")
        .await;
    let rebuild_pass = match after {
        Ok(mut r) => {
            #[derive(Deserialize)]
            struct C {
                c: Option<i64>,
            }
            let rows: Vec<C> = r.take(0).unwrap_or_default();
            rows.first().and_then(|x| x.c).unwrap_or(0) >= 1
        }
        Err(_) => {
            // simpler existence check
            embed
                .get_node(&decision_id)
                .await?
                .is_some_and(|n| n.uri.contains("decision-embedded-index"))
        }
    };
    results.push(CheckResult {
        name: "rebuild_preserves_authored",
        pass: rebuild_pass,
        detail: if rebuild_pass {
            "decision object present after rebuild".into()
        } else {
            "decision missing after rebuild".into()
        },
    });

    Ok(results)
}

#[tokio::main]
async fn main() -> Result<()> {
    let repo = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("../..")
        .canonicalize()
        .context("repo root")?;
    let workspace = repo.join("fixtures/sample-project");
    if !workspace.exists() {
        bail!("fixture missing: {}", workspace.display());
    }
    let db_path = repo.join("spikes/knowledge-index/.spike-data/surrealkv");

    println!("Happy Desk · KnowledgeIndex spike");
    println!("workspace: {}", workspace.display());
    println!("db:        {}", db_path.display());
    println!();

    let results = run_checks(&workspace, &db_path).await?;
    let mut failed = 0usize;
    for r in &results {
        let mark = if r.pass { "PASS" } else { "FAIL" };
        if !r.pass {
            failed += 1;
        }
        println!("[{mark}] {} — {}", r.name, r.detail);
    }
    println!();
    if failed == 0 {
        println!("All spike checks passed.");
        Ok(())
    } else {
        bail!("{failed} check(s) failed");
    }
}
