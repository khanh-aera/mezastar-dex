"""Build /play/app.js from slices of the binder's app.js.

Design rule: the battle engine itself is EXTRACTED, never retyped, so the play app
cannot drift from the copy that battle_test_suite.js and battle_tab_harness.js verify.
Only the thin shell around it (state, boot, render entry points) is new.
"""
import os, re, shutil

R = r"C:\Users\ankha\AppData\Local\hermes\profiles\cg-bro\workspace\mezastar-dex"
SRC = os.path.join(R, "docs", "assets", "app.js")
CSS = os.path.join(R, "docs", "assets", "style.css")
OUTD = os.path.join(R, "play")
os.makedirs(OUTD, exist_ok=True)

s = open(SRC, encoding="utf-8", errors="replace").read()
lines = s.split("\n")


def idx(prefix):
    return next(i for i, l in enumerate(lines) if l.startswith(prefix))


def block(a, b):
    return "\n".join(lines[a:b]).rstrip() + "\n"


def chunk(start, end_marker):
    return "\n".join(lines[start:end_marker]).rstrip() + "\n"


def block_to(prefix, closing):
    """from the line starting with `prefix` through the first line equal to `closing`"""
    a = idx(prefix)
    for j in range(a, len(lines)):
        if lines[j].strip() == closing:
            return "\n".join(lines[a:j + 1]).rstrip() + "\n"
    raise SystemExit("closing %r not found after %r" % (closing, prefix))


SL_BATTLE = block(idx("/* ================= BATTLE MODE"), idx("/* ================= STATS & TOOLS"))
# foe art is stored as "img/<file>"; from /play/ that needs one level up
SL_BATTLE = SL_BATTLE.replace('src="${esc(f.img || "")}"', 'src="${f.img ? "../" + f.img : ""}"')
assert 'src="${f.img ? "../" + f.img : ""}"' in SL_BATTLE, "foe art path not rewritten"
SL_MOVE_MULT = block(idx("/* ==== move-based damage"), idx("/* best strike of a member"))
SL_INC = "\n".join(lines[idx("function incMoveMult"):idx("const coveredTypes")]).rstrip() + "\n"
SL_USER_ROSTER = "\n".join(lines[idx("function userRoster()"):idx("function renderLoadout(){")]).rstrip() + "\n"
assert "allRosterIds" in SL_USER_ROSTER, "allRosterIds got cut off"
SL_MAIN_MEMBERS = block(idx("function mainMembers()"), idx("/* best single tag in the main roster"))
SL_MAIN_IDS = block_to("const MAIN_IDS = [", "];")
assert SL_MAIN_IDS.count('"1-') == 11, "MAIN_IDS lost entries: %d" % SL_MAIN_IDS.count('"1-')

# TYPE_COLOR / TYPE_ICON are tiny; take them verbatim so pill() renders identically.
tc = block(idx("const TYPE_COLOR = {"), idx("const GRAD = {"))
ti = "\n".join(lines[idx("const TYPE_ICON = {"):idx("const TYPE_COLOR = {")]).rstrip() + "\n"

HEADER = '''/* ===== MEZASTAR PLAY · arcade companion =====
   Battle + Main Roster only, extracted from the binder's app.js so the damage
   engine is identical. Served from /play/ - see docs/index.html for the binder.

   Damage model (v62): damage reads the tag's OFFENSIVE STAT, Atk for Physical
   moves and SpA for Special. PE is an energy scale, not a damage input.
   dmg = offStat x typeMult x roulette(AR%) x gimmickCoef
   Sources: Bulbapedia (battle flow, Atk/SpA vs Def/SpD, AoE) and the Kaizen
   Hayashi community sheet (roulette values, measured gimmick coefficients).
   The exact arcade constant and mitigation curve are NOT published, so every
   number here is an estimate - use the toggle below to compare against the
   cabinet. */

/* ---------- small helpers (verbatim from the binder) ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>\\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const pill = tp => `<span class="pill" style="background:${TYPE_COLOR[tp]||"#9aa"};color:#080b17">${tp}</span>`;
const stars = g => "\\u2605".repeat(Math.max(0, Math.min(6, parseInt(g||0)))) || "";
'''

MIDDLE = '''

/* ---------- state ---------- */
let ROSTER = [], POOL = [], BOSSES = [], CHART = {}, TYPES = [];
let STATS_BY_ID = {}, MOVE_AR = {};
let OWNED = {};

const LS = {
  get: (k, d) => { try { const v = localStorage.getItem("meza." + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set: (k, v) => { try { localStorage.setItem("meza." + k, JSON.stringify(v)); } catch (e) {} }
};

const MAIN_IDS_PLACEHOLDER = 0;

/* ---------- glue the binder's battle block needs ---------- */
function invalidateCands(){ BSC.clear(); CANDS.length = 0; buildCands(); }

/* the binder closes a full-screen modal; play has no modal, so this is a no-op
   that keeps the extracted block's contract intact */
function closeModal(){ const sc = $("#scrim"); if (sc) sc.classList.remove("on"); }

/* two panels instead of five tabs */
function tab(name){
  document.querySelectorAll("#playTabs button").forEach(b => b.classList.toggle("on", b.dataset.play === name));
  document.querySelectorAll(".playpanel").forEach(p => p.classList.toggle("on", p.id === "pp-" + name));
  if (name === "battle") renderBattleFoes();
  if (name === "roster") renderRosterPanel();
}
'''

FOOTER = '''

/* ---------- boot ---------- */
async function boot() {
  try {
    const [ro, po, bo, tcj, sst, mar] = await Promise.all([
      fetch("../data/roster.json").then(r => r.json()).catch(() => ({ tags: [] })),
      fetch("../data/pool.json").then(r => r.json()).catch(() => ({ tags: [] })),
      fetch("../data/bosses.json").then(r => r.json()).catch(() => []),
      fetch("../data/typechart.json").then(r => r.json()).catch(() => ({ chart: {}, types: [] })),
      fetch("../data/stats_allsets.json").then(r => r.json()).catch(() => []),
      fetch("../data/move_ar.json").then(r => r.json()).then(j => j.moves || {}).catch(() => ({}))
    ]);
    ROSTER = ro.tags || [];
    POOL = po.tags || [];
    BOSSES = Array.isArray(bo) ? bo : (bo.bosses || []);
    CHART = tcj.chart || {};
    TYPES = tcj.types || Object.keys(CHART);
    STATS_BY_ID = {};
    (Array.isArray(sst) ? sst : []).forEach(r => { if (r && r.id) STATS_BY_ID[r.id] = r; });
    MOVE_AR = mar || {};
  } catch (e) {
    document.querySelector("#battleBox").innerHTML =
      '<div class="empty">Could not load tag data. Check your connection and reload.</div>';
    return;
  }
  invalidateCands();
  buildCands();
  wire();
  renderBattleFoes();
  /* clear the boot placeholder: the battle block only re-renders once all 3 foes
     are picked, so without this the "Loading" line would sit there forever */
  renderBattle();
  renderRosterPanel();
}

function wire() {
  document.querySelectorAll("#playTabs button").forEach(b => {
    b.onclick = () => {
      document.querySelectorAll("#playTabs button").forEach(x => x.classList.toggle("on", x === b));
      document.querySelectorAll(".playpanel").forEach(p => p.classList.toggle("on", p.id === "pp-" + b.dataset.play));
      if (b.dataset.play === "battle") renderBattleFoes();
      if (b.dataset.play === "roster") renderRosterPanel();
    };
  });
}

/* ---------- main roster panel ---------- */
function renderRosterPanel() {
  const host = document.querySelector("#rosterList");
  if (!host) return;
  const ids = allRosterIds();
  const tags = ids.map(id => {
    const r = ROSTER.find(x => x.id === id);
    const p = POOL.find(x => x.id === id);
    return mainMembers().find(m => m.id === id) || Object.assign({}, p || {}, r || {});
  }).filter(Boolean);

  host.innerHTML = `
    <div class="rhead">
      <span class="rlab">MAIN ROSTER · ${tags.length} tags</span>
      <span class="rnote">battle draws from all ${CANDS.length}</span>
    </div>
    <div class="rgrid">${tags.map(m => {
      /* data files already store "img/<file>", so resolve from the site root, not from /play/ */
      const art = m.img ? "../" + m.img : "";
      return `<div class="rcard">
        ${art ? `<img src="${art}" alt="${esc(m.name)}" loading="lazy">` : `<div class="rnoart">?</div>`}
        <div class="rname">${esc(m.name)}</div>
        <div class="rsub">${(m.types || []).map(pill).join(" ")} ${stars(m.grade)}</div>
        <div class="rstat">Atk ${m.atk ?? "?"} · SpA ${m.spa ?? "?"} · HP ${m.hp ?? "?"}${m.gimmick ? `<br><span class="rgim">${esc(m.gimmick)}</span>` : ""}</div>
      </div>`;
    }).join("")}</div>
    <div class="rfoot">
      <span>tags marked with an ability fire it once per session in the real game</span>
    </div>`;
}

document.addEventListener("DOMContentLoaded", boot);
'''

js = (HEADER
      + ti
      + tc
      + "\n" + SL_MAIN_IDS
      + "\n" + SL_USER_ROSTER
      + "\n" + SL_INC
      + "\n" + SL_MOVE_MULT
      + "\n" + SL_MAIN_MEMBERS
      + "\n" + SL_BATTLE
      + "\n" + MIDDLE
      + "\n" + FOOTER)

tmp = os.path.join(OUTD, "app.js.tmp")
with open(tmp, "w", encoding="utf-8", newline="\n") as f:
    f.write(js)
    f.flush()
    os.fsync(f.fileno())
shutil.move(tmp, os.path.join(OUTD, "app.js"))
print("wrote play/app.js =", os.path.getsize(os.path.join(OUTD, "app.js")), "bytes")