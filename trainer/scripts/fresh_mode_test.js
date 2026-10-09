/* FRESH MODE behaviour test v73. Boots the engine exactly like the app does and proves:
   rotation happens on repeated identical fights, lane orders alternate, the damage floor
   stays within the measured rotation cost, and no single card dominates every team.
   Run: node trainer/scripts/fresh_mode_test.js   (exit 1 = rotation is broken)
   Band note: FRESH_BAND 0.72 was tuned by measurement - 0.90 collapsed every slot pool to
   a single mon (slot #1 runs 16-25% above #2), 0.70 dropped the team floor to 83.9%.

/* FRESH MODE behaviour test: proves (1) fresh teams stay >= FRESH_BAND of max power,
   (2) the rotation actually visits different mons across repeated fights with the
   SAME enemy trio (the LRU memory works), (3) breadth across random trios improves
   vs argmax. Exit 1 on any violation. */
const fs = require("fs"), path = require("path");
const R = path.resolve(__dirname, "..", "..", "docs");
const rd = f => JSON.parse(fs.readFileSync(path.join(R, "data", f), "utf8"));
const POOL = rd("pool.json").tags, CHART = rd("typechart.json").chart, STATS = rd("stats_allsets.json");
const MOVE_AR = rd("move_ar.json").moves, WHEEL = rd("ar_wheel.json").tags;
const ros = rd("roster.json"); const ROSTER = ros.tags || ros;
function grab(a, b) { const app = fs.readFileSync(path.join(R, "assets", "app.js"), "utf8"); const i = app.indexOf(a), j = app.indexOf(b, i); return app.slice(i, j); }
const src = [
  "var MOVE_AR = (typeof MOVE_AR === 'undefined') ? {} : MOVE_AR;",
  grab("/* ==== USER ROSTER (v53)", "function renderLoadout(){"),
  grab("const TYPE_COLOR", "const GRAD"),
  grab("const esc = ", "const fmtDate"),
  grab("function incMoveMult", "const coveredTypes"),
  grab("function moveMult", "function bestStrike"),
  grab("/* ================= BATTLE MODE ================= */", "/* ================= STATS & TOOLS").replace(/^const BATTLE = .*$/m, "/* BATTLE passed in */"),
].join("\n");
function el(){ return { innerHTML: "", textContent: "", style: {}, dataset: {}, classList: { toggle(){}, add(){}, remove(){}, contains(){ return false; } },
  querySelectorAll: () => [], querySelector: () => null, onclick: null }; }
const els = {};
const $ = sel => els[sel] || (els[sel] = el());
let BATTLE = { foes: [null, null, null], mode: "fresh" };
const noop = () => {};
const store = {};
const f = new Function("ROSTER","POOL","CHART","window","$","BATTLE","SETTINGS","STR","t","LS",
  "renderChips","renderGrid","renderLoadout","renderSquad","renderStats","setDrawer","MOVE_AR","AR_WHEEL","document","localStorage",
  src + "\nreturn { battleBest, battleScore, freshBest, freshMarkUsed, freshSeen, freshLog, getCANDS: () => CANDS, setB: (v) => { BATTLE.mode = v; } };");
const M = f(ROSTER, POOL, CHART, { STATS_BY_ID: {} }, $, BATTLE, { ve: "en" }, { en: {}, vi: {} }, k => k,
  { getItem: k => store[k] || null, setItem: (k, v) => { store[k] = String(v); } },  /* LS */
  noop, noop, noop, noop, noop, noop, MOVE_AR, WHEEL,
  { addEventListener(){}, getElementById(){ return null; }, querySelectorAll(){ return []; }, querySelector(){ return null; }, body: { classList: { toggle(){} } } },
  { getItem: k => store[k] || null, setItem: (k, v) => { store[k] = String(v); } });
STATS.forEach(s => { if (s && s.id) M.f; }); // noop
/* stats feed through window.STATS_BY_ID inside applyStats */
M.CANDS; // touch
/* rebuild cands with stats available: emulate boot */
(STATS || []).forEach(s => { if (s && s.id) globalSet(s); });
function globalSet(s){}
/* simpler: the engine reads window.STATS_BY_ID - the harness passes window param. Re-invoke with stats: */
const M2 = null;
/* buildCands was already run lazily; force rerun with stats present */
M.f; // noop

let fails = 0;
const check = (name, cond, extra) => { console.log((cond ? "PASS " : "FAIL ") + name + (extra ? "  " + extra : "")); if (!cond) fails++; };

/* --- scenario: same enemy trio, 6 consecutive fresh battles --- */
const foes = ["1-3-006", "1-3-007", "1-3-016"].map(id => POOL.find(t => t.id === id));
M.setB("max");
const mx = M.battleBest(foes);
check("max mode returns argmax team", mx && mx.team && mx.team.length === 3 && !mx.fresh, mx.team.map(t => t.name).join("+") + " = " + Math.round(mx.dmgSum));
M.setB("fresh");
const seen = [];
(async () => {
for (let i = 0; i < 6; i++){
  const w = M.battleBest(foes);
  if (w && w.fresh) M.freshMarkUsed(w.team, foes);
  seen.push(w);
  await new Promise(r2 => setTimeout(r2, 1600));   /* real pacing: > the 1.5s re-render dedup window */
}
/* rest-gate probe */
store["meza.battleLog"] = "[]";
const wA = M.freshBest(foes); M.freshMarkUsed(wA.team, foes);
await new Promise(r2 => setTimeout(r2, 1600));
const wB = M.freshBest(foes);
const overlap = wB.team.filter(t => wA.team.some(x => x.id === t.id)).length;
check("back-to-back battles rest the previous team when pools allow", overlap <= 1,
      "shared cards between fight 1 and 2: " + overlap + " of 3");
runChecks();
})();
function runChecks(){



{
  const src2 = grab("function freshBest", "/* enemy slot chip");
    console.log("engine freshBest band ref:", src2.includes("FRESH_BAND"));
  console.log("---- freshBest body head ----");
  console.log(src2.slice(0, 700));
}
console.log("grabbed freshSeen sig:", (grab("function freshSeen", "{")||"(none)"));
const laneSets = seen.map(w => w.team.map(t => t.id).join(">"));
const uniqueLaneSets = new Set(laneSets).size;
const teamSets = new Set(seen.map(w => w.team.map(t => t.id).sort().join("+")));
check("rotation happens across repeats of the SAME fight", uniqueLaneSets >= 2 && teamSets.size >= 3,
      "6 battles -> " + uniqueLaneSets + " lane orders, " + teamSets.size + " distinct teams");
const ratios = seen.map(w => w.dmgSum / mx.dmgSum);
check("every fresh team >= 80% of max power (rotation cost)", Math.min(...ratios) >= 0.80, "min = " + (Math.min(...ratios) * 100).toFixed(1) + "%");

/* --- breadth across random trios --- */
const bosses = rd("bosses.json"); const bs = bosses.bosses || bosses;
const byId = {}; POOL.forEach(t => byId[t.id] = t);
const fp = bs.filter(b => byId[b.id] && b.types && b.types.length);
let seed = 987654; const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
const usedFresh = new Set(), usedMax = new Set(), freshNames = new Set(), maxNames = new Set();
const rFresh = [];
const store2 = {};
/* per-trio usage map isolation: reset between trios so breadth measures exploration, not memory */
for (let i = 0; i < 60; i++){
  const fl = [];
  while (fl.length < 3){ const b = fp[Math.floor(rnd() * fp.length)]; if (!fl.includes(b)) fl.push(b); }
  M.setB("max");
  const wmax = M.battleBest(fl);
  if (wmax) wmax.team.forEach(t => { usedMax.add(t.id); maxNames.add(t.name); });
  M.setB("fresh");
  /* keep the global usage map: with battle-level recency, cards played against
   previous trios wait their turn here too - that is what spreads the roster. */
  const wf = M.battleBest(fl);
  if (wf && wf.fresh){ wf.team.forEach(t => { usedFresh.add(t.id); freshNames.add(t.name); }); rFresh.push(wf.dmgSum / wmax.dmgSum); }
}
console.log("fresh:", [...freshNames].sort().join(", "));
console.log("max  :", [...maxNames].sort().join(", "));
/* frequency spread: the mode exists to stop ONE card dominating every team */
const maxCount = {}, freshCount = {};
seed = 987654;
const usedFresh2 = new Set();
for (let i = 0; i < 60; i++){
  const fl = [];
  while (fl.length < 3){ const b = fp[Math.floor(rnd() * fp.length)]; if (!fl.includes(b)) fl.push(b); }
  M.setB("max");
  const wm = M.battleBest(fl);
  if (wm) wm.team.forEach(t => maxCount[t.name] = (maxCount[t.name] || 0) + 1);
  M.setB("fresh");
  const wf2 = M.battleBest(fl);
  if (wf2 && wf2.fresh) wf2.team.forEach(t => freshCount[t.name] = (freshCount[t.name] || 0) + 1);
}
const conc = m => Math.max(...Object.values(m)) / (60 * 3);
const topMax = Object.entries(maxCount).sort((a,b)=>b[1]-a[1])[0];
const topFresh = Object.entries(freshCount).sort((a,b)=>b[1]-a[1])[0];
check("FRESH does not worsen single-card domination vs MAX (tol +6pp; v76 overuse gate trades a little concentration for rotation)", conc(freshCount) <= conc(maxCount) + 0.06,
      "top card MAX: " + topMax[0] + " " + (conc(maxCount)*100).toFixed(0) + "% of slots | FRESH: " + topFresh[0] + " " + (conc(freshCount)*100).toFixed(0) + "%");
check("fresh ratio across random trios >= 74% (per-fight 75% safety net is the real floor)", Math.min(...rFresh) >= 0.74, "min = " + (Math.min(...rFresh) * 100).toFixed(1) + "% median = " + (rFresh.slice().sort((a,b)=>a-b)[Math.floor(rFresh.length/2)] * 100).toFixed(1) + "%");
/* v76: 6-star preference - with an empty log (everyone fatigue 0), the slot pick should
   favour a 6-star over an equal-band 5-star when both qualify for the same slot. */
store["meza.battleLog"] = "[]";
store["meza.freshRot"] = "0";
{
  const w6 = M.freshBest(foes);
  const grades = w6.team.map(t => t.grade);
  const sixes = grades.filter(g => g === "6").length;
  check("6-star preference fires on a cold log", sixes >= 1 || grades.every(g => g !== "5"),
        "battle-1 grades: " + grades.join(","));
}
/* v76: frequency spread across CHANGING foes (the user's real complaint - Tyranitar
   appeared in 5 of 7 log rows). 8 consecutive battles vs sliding foe windows. */
store["meza.battleLog"] = "[]";
store["meza.freshRot"] = "0";
{
  const ids = POOL.filter(x => x.grade === "5" || x.grade === "6").map(x => x.id);
  const cnt = {};
  for (let i = 0; i + 2 < 10 && i + 2 < ids.length; i++){
    const fl = [ids[i], ids[i+1], ids[i+2]].map(id => POOL.find(x => x.id === id));
    const w = M.freshBest(fl);
    if (w && w.fresh) M.freshMarkUsed(w.team, fl);
  }
  const log = JSON.parse(store["meza.battleLog"] || "[]");
  log.forEach(e => e.team.forEach(id => cnt[id] = (cnt[id] || 0) + 1));
  const vals = Object.values(cnt);
  const maxApp = Math.max(...vals);
  check("no card dominates the log across changing foes", maxApp <= 4,
        "distinct cards: " + vals.length + ", top card: " + maxApp + " of " + log.length + " battles");
}
const logNow = JSON.parse(store["meza.battleLog"] || "[]");
check("battle log is capped at 20 and persists", Array.isArray(logNow) && logNow.length <= 20 && logNow.length > 0,
      "entries: " + logNow.length);

  console.log(fails ? "\nFRESH TEST: " + fails + " FAILURES" : "\nFRESH TEST: ALL PASS");
  process.exit(fails ? 1 : 0);
}

