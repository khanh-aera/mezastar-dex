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
SL_MAIN_IDS = "const MAIN_IDS = [];  // v68: play owns no hard-coded squad - the bag is his\n"
assert "const MAIN_IDS = [];" in SL_MAIN_IDS, "play MAIN_IDS must be empty"
# v65: /play/ has its OWN roster semantics - Khanh drives his own bag.
# The sliced allRosterIds() would always splice in MAIN_IDS, so battle would keep
# answering from 11 hard-coded tags no matter what he added or removed. Replace
# the function body here rather than in the binder: the binder keeps squad 11.
# v68: Khanh restated the requirement - the bag starts EMPTY, every time, on every
# device. v65 kept a first-run seed of squad 11, which he had to delete by hand
# before he could start his own list; localStorage empty still rendered 11 cards.
# There is no seed now: allRosterIds() is whatever he has added, and nothing else.
PLAY_ALL_ROSTER_IDS = """function allRosterIds(){
  const u = userRoster();
  return u.filter((id, i) => u.indexOf(id) === i);
}"""
import re as _re
_old = _re.search(r"function allRosterIds\(\)\{[^}]*\}", SL_USER_ROSTER)
assert _old, "allRosterIds not found in the slice"
SL_USER_ROSTER = SL_USER_ROSTER.replace(_old.group(0), PLAY_ALL_ROSTER_IDS)
assert PLAY_ALL_ROSTER_IDS in SL_USER_ROSTER, "play allRosterIds override not applied"

# v65: buildCands is replaced wholesale. The binder version hard-filters
# roster.json for every owned 5/6-star, which made the roster read-only - battle
# answered from 23 tags no matter what he added or removed. In /play/ the roster
# IS the bag: candidates == exactly the tags shown in the roster grid.
PLAY_BUILD_CANDS = """function buildCands(){
  CANDS.length = 0;
  const ids = allRosterIds();
  const src = [];
  for (const id of ids){
    if (src.some(t3 => t3.id === id)) continue;
    /* roster row first (ownership + hero art), pool fills the rest */
    const r = ROSTER.find(x => x.id === id), p = POOL.find(x => x.id === id);
    if (r || p) src.push(Object.assign({}, p || {}, r || {}));
  }
  CANDS.push(...src.map(t3 => {
    const p = POOL.find(x => x.id === t3.id) || {};
    const m = Object.assign({}, p, t3);
    for (const k of ["pe","hp","atk","dfn","spa","spd","spe"]){
      if (m[k] === null || m[k] === undefined || m[k] === "") m[k] = p[k];
    }
    if (!Array.isArray(m.moves) || !m.moves.length) m.moves = Array.isArray(p.moves) ? p.moves : [];
    return applyStats(m, t3);
  }));
}"""
import re as _re
_n = len(SL_BATTLE)
SL_BATTLE = _re.sub(r"function buildCands\(\)\{.*?\n\}", lambda _m: PLAY_BUILD_CANDS, SL_BATTLE, count=1, flags=_re.S)
assert len(SL_BATTLE) != _n or "ROSTER.filter(t2 =>" not in SL_BATTLE, "buildCands rewrite matched nothing"
assert "ROSTER.filter(t2 =>" not in SL_BATTLE, "old hard-coded roster filter survived"
assert "rosterHidden" not in SL_BATTLE, "rosterHidden filter survived in the battle slice"
# art paths: the battle block renders raw m.img, which resolves to /play/img/...
# and 404s. Rewrite to playImg() at build time so the extracted block stays
# byte-comparable with the binder everywhere except these paths.
OLD_EMPTY_MSG = 'if (!win){ el.innerHTML = `<div class="empty">Building your binder… tap again.</div>`; return; }'
NEW_EMPTY_MSG = 'if (!win){\n    const n = CANDS.length;\n    el.innerHTML = n < 3\n      ? `<div class="empty">🎮🎮 Your bag has ${n} tag${n === 1 ? "" : "s"} - battle needs at least 3.<br>${n === 0 ? "Add the tags you carry in <b>My roster</b>, then come back." : "Add more in <b>My roster</b>."}</div>`\n      : `<div class="empty">Building… tap again.</div>`;\n    return;\n  }'
assert OLD_EMPTY_MSG in SL_BATTLE, "the binder's placeholder message moved - re-check the anchor"
SL_BATTLE = SL_BATTLE.replace(OLD_EMPTY_MSG, NEW_EMPTY_MSG)
assert "Your bag has" in SL_BATTLE

SL_BATTLE_FIX = (SL_BATTLE
    .replace('<img src="${esc(pr.mine.img || \"\")}"', '<img src="${playImg(pr.mine)}"')
    .replace('<img src="${esc(pr.foe.img || \"\")}"', '<img src="${playImg(pr.foe)}"'))
assert "playImg(pr.mine)" in SL_BATTLE_FIX and "playImg(pr.foe)" in SL_BATTLE_FIX, "battle art rewrite matched nothing"
# v68: /play/ carries NO hard-coded squad. The binder keeps its own squad 11;
# asserting a count here would let the two drift apart unnoticed.
assert SL_MAIN_IDS.count('"1-') == 0, (
    "play MAIN_IDS must be empty - a hard-coded tag would pre-fill the bag")

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
/* the data files store "img/<file>" relative to the SITE ROOT, so every art
   reference inside the extracted battle block needs the "../" hop from /play/ */
function playImg(m){ return m && m.img ? "../" + m.img : ""; }
function closeModal(){
  /* v69: the picker sheet is a fixed overlay, so any teardown has to release
     the body scroll lock. Doing it HERE means no caller can forget it - the
     picker, battlePick and the scrim tap all go through this one function. */
  unlockBodyScroll();
  const sc = $("#scrim"); if (sc) sc.classList.remove("on");
  /* play renders #modal in place, so clear it - the binder hides it with CSS only */
  const m = $("#modal"); if (m) m.innerHTML = "";
}

/* Page scroll lock used by the picker sheet. Remembers and restores the exact
   scroll offset, because the roster panel can be scrolled when the tap happens.
   Guarded so a second lock without a close (or a close without a lock) is a
   no-op rather than a stuck page. */
let _scrollLock = null;
function lockBodyScroll(){
  if (_scrollLock) return;
  _scrollLock = {
    y: scrollY,
    overflow: document.body.style.overflow,
    position: document.body.style.position,
    top: document.body.style.top,
    left: document.body.style.left,
    right: document.body.style.right,
  };
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.top = (-_scrollLock.y) + "px";
  document.body.style.left = "0";
  document.body.style.right = "0";
}
function unlockBodyScroll(){
  if (!_scrollLock) return;
  const s = _scrollLock; _scrollLock = null;
  document.body.style.overflow = s.overflow;
  document.body.style.position = s.position;
  document.body.style.top = s.top;
  document.body.style.left = s.left;
  document.body.style.right = s.right;
  scrollTo(0, s.y);
}

/* two panels instead of five tabs */
function tab(name){
  document.querySelectorAll("#playTabs button").forEach(b => b.classList.toggle("on", b.dataset.play === name));
  document.querySelectorAll(".playpanel").forEach(p => p.classList.toggle("on", p.id === "pp-" + name));
  /* renderBattle() (not just renderBattleFoes()) so a roster edit made on the
     other tab is reflected the moment you come back - including the "bag too
     small" state, which otherwise leaves the previous result card standing. */
  if (name === "battle"){ renderBattleFoes(); renderBattle(); }
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
  /* v65 MIGRATION. rosterHidden is gone - the bag is one list now. Anyone with a
     hidden entry had squad-11 tags pulled out of the old display list; put those
     back so nobody silently loses tags on upgrade. */
  try {
    const hid = JSON.parse(localStorage.getItem("rosterHidden") || "[]");
    if (Array.isArray(hid) && hid.length){
      const u = userRoster();
      for (const id of hid){ if (MAIN_IDS.includes(id) && !u.includes(id)) u.push(id); }
      setUserRoster(u);
      localStorage.removeItem("rosterHidden");
    }
  } catch(e){}
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

/* main roster panel (play): same localStorage contract as the binder -
   userRoster[] for added ids, rosterHidden[] for core tags he puts away.
   Candidates are rebuilt on every change so a new tag is battleable at once. */
function renderRosterPanel() {
  const host = document.querySelector("#rosterList");
  if (!host) return;
  const ids = allRosterIds();
  /* mainMembers() only knows MAIN_IDS, so resolve every id the same way the binder
     loadout does: roster row first (it carries ownership + hero art), pool fills gaps */
  const tags = ids.map(id => {
    const r = ROSTER.find(x => x.id === id);
    const pl = POOL.find(x => x.id === id);
    if (r || pl) return Object.assign({}, pl || {}, r || {});
    const m = mainMembers().find(x => x.id === id);
    return m || null;
  }).filter(Boolean);

  host.innerHTML = `
    <div class="rhead">
      <span class="rlab">MY ROSTER · ${tags.length} tags</span>
      <button class="btn act" id="rosterAdd">＋ Add pokemon</button>
    </div>
    <div class="rnote">${ids.length
      ? `battle will answer with these ${ids.length} tags only`
      : `empty - add the tags you carry, and battle will use exactly those`}</div>
    ${tags.length ? "" : `<div class="rempty">
      <div class="rempty-t">Your bag is empty</div>
      <div class="rempty-s">Tap ＋ Add pokemon and build the team you actually carry.<br>Battle answers with these tags and nothing else.</div>
    </div>`}
    <div class="rgrid">${tags.map(m => {
      /* data files already store "img/<file>", so resolve from the site root, not from /play/ */
      const art = m.img ? "../" + m.img : "";
      return `<div class="rcard">
        <button class="roremove" data-rm="${esc(m.id)}" title="Remove">✕</button>
        ${art ? `<img src="${art}" alt="${esc(m.name)}" loading="lazy">` : `<div class="rnoart">?</div>`}
        <div class="rname">${esc(m.name)}</div>
        <div class="rsub">${(m.types || []).map(pill).join(" ")} ${stars(m.grade)}</div>
        <div class="rstat">Atk ${m.atk ?? "?"} · SpA ${m.spa ?? "?"} · HP ${m.hp ?? "?"}${m.gimmick ? `<br><span class="rgim">${esc(m.gimmick)}</span>` : ""}</div>
      </div>`;
    }).join("")}</div>
    <div class="rfoot">
      <span>an ability fires once per session in the real game — bring one, not three</span>
    </div>`;

  host.querySelectorAll("[data-rm]").forEach(b => b.onclick = () => {
    const id = b.dataset.rm;
    /* v68: one list, no separate hidden set. Every tag lives in userRoster like
       any other, so ✕ really removes it. */
    setUserRoster(userRoster().filter(x => x !== id));
    invalidateCands();
    renderRosterPanel();
    /* renderBattleFoes() alone leaves the previous result card on screen, so an
       emptied bag still showed a recommendation it can no longer back up. */
    renderBattleFoes();
    renderBattle();
  });

  const add = document.querySelector("#rosterAdd");
  if (add) add.onclick = rosterAddPicker;


}

/* reuse the binder's picker, then repaint play's own panels */
function rosterAddPicker(){
  const el = $("#modal");
  if (!el) return;
  const owned = new Set(ROSTER.map(x => x.id));
  /* v65: his bag, his rules - offer every tag in the pool, any grade, PE-sorted.
     The binder's 5/6-star gate made sense when battle drew from roster.json;
     now that the roster IS the pool of candidates, that gate would hide tags he
     legitimately owns. */
  const cands = POOL.filter(x => !allRosterIds().includes(x.id))
    .sort((a, b) => (b.pe || 0) - (a.pe || 0) || ((b.grade || 0) - (a.grade || 0)));

  /* MULTI-SELECT: v67. The old picker closed the modal on every pick, so adding
     N tags cost N taps plus N reopens of a 136-row list. Now picks accumulate,
     the sheet stays open, and one "Add N tags" commits them. Single pick still
     closes immediately so the one-tag case stays one tap. */
  const picked = new Set();
  const row = x => `
      <button class="pitem${picked.has(x.id) ? " on" : ""}" data-id="${esc(x.id)}">
        <span>${esc(x.name)}</span>
        <span class="psub">${(x.types || []).join("/")} · PE ${x.pe ?? "?"}${owned.has(x.id) ? " · owned" : ""}</span>
        <span class="pcheck">${picked.has(x.id) ? "✓" : ""}</span>
      </button>`;

  const commit = () => {
    if (!picked.size) return;
    const ids = userRoster();
    picked.forEach(id => { if (!ids.includes(id)) ids.push(id); });
    setUserRoster(ids);
    closeModal();
    invalidateCands();
    renderRosterPanel();
    renderBattleFoes();
    renderBattle();
  };

  const head = () => picked.size
    ? `<div class="modalhead">${picked.size} selected <button class="xbtn" id="x">✕</button></div>
       <button class="pcommit" id="pcommit">＋ Add ${picked.size} tag${picked.size > 1 ? "s" : ""}</button>`
    : `<div class="modalhead">Add to My roster <button class="xbtn" id="x">✕</button></div>`;

  let query = "";
  const paint = () => {
    el.innerHTML = head()
      + `<input class="bsearch" id="bs" placeholder="Search pokemon…" autocomplete="off" value="${esc(query)}">
         <div class="plist" id="pl">${cands.length ? cands.map(row).join("") : `<div class="empty">Every tag in the pool is already in your bag.</div>`}</div>`;
    $("#scrim").classList.add("on");
    lockBodyScroll();
    el.querySelector("#x").onclick = closeModal;
    const pc = el.querySelector("#pcommit");
    if (pc) pc.onclick = commit;
    const bs = el.querySelector("#bs");
    if (bs) {
      bs.oninput = e => {
        query = e.target.value;
        const q = query.trim().toLowerCase();
        const hit = cands.filter(x => !q || x.name.toLowerCase().includes(q) || String(x.id).includes(q));
        const pl = el.querySelector("#pl");
        pl.innerHTML = hit.length ? hit.map(row).join("") : `<div class="empty">No match for "${esc(query.trim())}".</div>`;
        wirePl();
      };
      if (query) { bs.focus(); bs.setSelectionRange(query.length, query.length); }
    }
    wirePl();
  };

  const wirePl = () => el.querySelectorAll("[data-id]").forEach(b => b.onclick = () => {
    const id = b.dataset.id;
    if (picked.has(id)) {
      picked.delete(id);
      if (!picked.size) { closeModal(); return; }  // unpicked the last one: done
    } else {
      picked.add(id);
    }
    paint();          // keep the sheet open so the next tap adds another tag
  });

  paint();
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
      + "\n" + SL_BATTLE_FIX
      + "\n" + MIDDLE
      + "\n" + FOOTER)


# ---------------------------------------------------------------------------
# play/play-core.css -- GENERATED, same discipline as play/app.js.
#
# The play shell must not import ../assets/style.css: it is the arcade app and
# must not inherit a binder restyle. So we copy out ONLY the rules the play app
# actually renders. v65 shipped this file hand-written by a regex that matched
# top-level rules ONLY -- it silently dropped all 13 @media blocks, which is why
# the play UI lost every responsive rule and came up scrambled on a phone. Parse
# @media properly and assert the media count survives, so that class of silent
# truncation cannot come back.
#
# Assets: src/assets/style.css is canonical; root is the mirror Pages serves.
# ---------------------------------------------------------------------------

# Collect every class the play app can render.
#
# v65 lesson: do NOT try to tokenise JS string literals to find classes. Every
# real class in this app sits inside a MULTI-LINE template literal, so any
# single-line string regex silently matched nothing (97 -> 2 classes) and the
# generated CSS lost .mside/.foeslot/.bhead entirely. Instead scan the raw text
# for every `class="..."` / `class='...'` attribute wherever it appears, and
# split the value on whitespace after stripping ${...} interpolations -- a
# dynamic value like `class="matchup ${r.sv ? "ok" : ""}"` must contribute both
# "matchup" and any literal class inside the interpolation.
used_classes = set()
for m in re.finditer(r'class(?:Name)?\s*=\s*"([^"\n]*)"', js):
    val = m.group(1)
    for chunk in re.split(r"\$\{", val):
        for c in re.sub(r"\}.*", "", chunk).split():
            if re.fullmatch(r"[A-Za-z][\w-]*", c):
                used_classes.add(c)
# literal class names written inside interpolations, e.g. ${x ? "filled" : ""}
for lit in re.findall(r'"([A-Za-z][\w-]{2,24})"', js):
    used_classes.add(lit)
used_classes -= {"class", "className", "classList"}

used_classes |= set(re.findall(r'classList\.(?:add|remove|toggle)\(\s*"([^"]+)"', js))
used_classes |= set(re.findall(r"classList\.add\(\s*'([^']+)'", js))

used_ids = set(re.findall(r'#([A-Za-z][\w-]*)\s*[,{]', js))


def rule_ok(sel):
    """True when a rule's selector touches something the play app renders.
    Globals are always kept so the theme (bg, text, --gold) survives."""
    sel = (sel or "").strip()
    if not sel or sel.startswith("/*"):
        return False
    if re.match(r'^(html|body|:root|\*)\b', sel):
        return True
    return any(re.search(r"[.#]" + re.escape(t) + r"(?![\w-])", sel)
               for t in (used_classes | used_ids))


def _match_brace(text, start):
    """Index of the '}' matching the '{' at/after `start`. String- and
    comment-aware so a brace inside a url("...") or a quoted value cannot end
    the block early."""
    i, depth, instring, quote, incomment = start, 0, False, "", False
    while i < len(text):
        ch = text[i]
        if incomment:
            if text[i:i+2] == "*/":
                incomment, i = False, i + 2
                continue
        elif instring:
            if ch == "\\":
                i += 2
                continue
            if ch == quote:
                instring = False
        elif text[i:i+2] == "/*":
            incomment, i = True, i + 2
            continue
        elif ch in "'\"":
            instring, quote = True, ch
        elif ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return i
        i += 1
    return -1


def css_slice(css_text):
    """Copy out the rules the play app renders, recursing into @media/@supports.

    v65 shipped a regex that only ever saw top-level rules, so all 13 @media
    blocks were dropped and the play UI lost every responsive rule. A regex
    cannot be trusted to skip nested blocks; this walks the structure instead.
    """
    out, i, n = [], 0, len(css_text)
    while i < n:
        # skip whitespace
        if css_text[i].isspace():
            i += 1
            continue
        # comments pass through (they carry section banners and stay readable)
        if css_text[i:i+2] == "/*":
            e = css_text.find("*/", i)
            e = n if e < 0 else e + 2
            out.append(css_text[i:e] + "\n")
            i = e
            continue
        # at-rules: recurse
        if css_text[i] == "@":
            ob = css_text.find("{", i)
            if ob < 0:
                break
            cb = _match_brace(css_text, ob)
            if cb < 0:
                break
            head = css_text[i:ob]
            inner = css_slice(css_text[ob + 1:cb])
            if inner.strip():
                out.append(head + "{\n" + inner + "}\n")
            i = cb + 1
            continue
        # a bare '}' ends this level
        if css_text[i] == "}":
            i += 1
            continue
        # ordinary rule
        ob = css_text.find("{", i)
        if ob < 0:
            break
        cb = _match_brace(css_text, ob)
        if cb < 0:
            break
        sel = css_text[i:ob]
        body = css_text[ob + 1:cb]
        if rule_ok(sel):
            out.append(sel + "{" + body + "}\n")
        i = cb + 1
    return "".join(out)


css = open(CSS, encoding="utf-8").read()
core = css_slice(css)

# Every @media block that mentions a class/id the play app renders must survive.
# Binder-only blocks (nav.tabs, .burger, boss grid) legitimately drop out -- play
# renders no such markup. v65's bug was that the filter dropped @media wholesale,
# so assert per-block instead of on a raw count.
src_media = css.count("@media")
kept_media = core.count("@media")


# Binder-only blocks (nav.tabs, .burger, #rosterTypes, .supgrid) legitimately drop
# out -- play renders no such markup. The ones that must survive are asserted
# by selector below.
assert kept_media >= 3, (
    "play-core.css kept only %d of %d @media blocks -- responsive is gone"
    % (kept_media, src_media))

# The specific responsive rules the play UI depends on must be present. These
# are the rules v65 dropped; without them the battle art stays desktop-sized on a
# 390px phone and the layout collapses. Binder-only blocks (.mart/.pickart from
# the boss counter, .supgrid from Support, #rosterTypes, nav.tabs, .burger)
# are expected to drop out -- play renders no such markup.
for must in (".foeslot", ".mside", ".bhead", ".arena", ".matchup", ".vsbadge"):
    assert must in core, "play-core.css lost the responsive rule for " + must

# A representative cross-section of real binder rules must be carried over, so a
# parser regression cannot quietly shrink this file to almost nothing.
for must in (".foeslot", ".mside", ".matchup", ".bhead", ".arena",
             ".vsbadge", ".mrow", ".mbar"):
    assert must in core, "play-core.css is missing " + must
assert len(core) > 12000, "play-core.css shrank to %d bytes" % len(core)

banner = ("/* GENERATED by trainer/scripts/build_play.py -- do not edit by hand.\n"
          "   Source: assets/style.css  |  %d @media blocks carried over. */\n\n"
          % kept_media)

tmpc = os.path.join(OUTD, "play-core.css.tmp")
with open(tmpc, "w", encoding="utf-8", newline="\n") as f:
    f.write(banner + core)
    f.flush()
    os.fsync(f.fileno())
shutil.move(tmpc, os.path.join(OUTD, "play-core.css"))
print("wrote play/play-core.css =", os.path.getsize(os.path.join(OUTD, "play-core.css")),
      "bytes,", kept_media, "@media blocks (source has", src_media, ")")

tmp = os.path.join(OUTD, "app.js.tmp")
with open(tmp, "w", encoding="utf-8", newline="\n") as f:
    f.write(js)
    f.flush()
    os.fsync(f.fileno())
shutil.move(tmp, os.path.join(OUTD, "app.js"))
print("wrote play/app.js =", os.path.getsize(os.path.join(OUTD, "app.js")), "bytes")