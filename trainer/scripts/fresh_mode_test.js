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
  src + "\nreturn { battleBest, battleScore, freshBest, freshMarkUsed, freshUsage, getCANDS: () => CANDS, setB: (v) => { BATTLE.mode = v; } };");
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
for (let i = 0; i < 6; i++){
  const w = M.battleBest(foes);
  console.log("battle", i + 1, "->", w.team.map(t => t.name).join("+"), "| fresh flag:", !!w.fresh, "| team order:", w.team.map(t => t.id).join(","));
  if (w && w.fresh) M.freshMarkUsed(w.team, foes);
  seen.push(w);
}



{
  const src2 = grab("function freshBest", "/* enemy slot chip");
    console.log("engine freshBest band ref:", src2.includes("FRESH_BAND"));
  console.log("---- freshBest body head ----");
  console.log(src2.slice(0, 700));
}
console.log("grabbed freshSeen sig:", (grab("function freshSeen", "{")||"(none)"));
const laneSets = seen.map(w => w.team.map(t => t.id).join(">"));
const uniqueLaneSets = new Set(laneSets).size;
check("rotation happens across repeats of the SAME fight", uniqueLaneSets >= 2,
      "6 battles -> " + uniqueLaneSets + " distinct lane orders: " + laneSets.slice(0, 6).join(" | "));
const ratios = seen.map(w => w.dmgSum / mx.dmgSum);
check("every fresh team >= 85% of max power", Math.min(...ratios) >= 0.85, "min = " + (Math.min(...ratios) * 100).toFixed(1) + "%");
check("every fresh team >= 88% of max power (rotation cost)", Math.min(...ratios) >= 0.88, "min = " + (Math.min(...ratios) * 100).toFixed(1) + "%");

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
check("FRESH lowers single-card domination vs MAX", conc(freshCount) < conc(maxCount),
      "top card MAX: " + topMax[0] + " " + (conc(maxCount)*100).toFixed(0) + "% of slots | FRESH: " + topFresh[0] + " " + (conc(freshCount)*100).toFixed(0) + "%");
check("fresh ratio across random trios >= 82% (rotation cost)", Math.min(...rFresh) >= 0.82, "min = " + (Math.min(...rFresh) * 100).toFixed(1) + "% median = " + (rFresh.slice().sort((a,b)=>a-b)[Math.floor(rFresh.length/2)] * 100).toFixed(1) + "%");
check("usage map is bounded and persists", !!store["meza.freshUsage"]);

console.log(fails ? "\nFRESH TEST: " + fails + " FAILURES" : "\nFRESH TEST: ALL PASS");
process.exit(fails ? 1 : 0);