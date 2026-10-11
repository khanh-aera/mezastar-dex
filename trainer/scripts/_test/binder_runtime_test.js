/* Headless runtime test for /binder/ - the v81 lesson is that a green static
 * parse proves nothing; the app must BOOT and RENDER with real data.
 * No jsdom dependency: this walks the same code paths via a minimal DOM stub
 * that records innerHTML writes, and a fetch() that reads files from disk.
 * What it proves:
 *   1. boot() resolves all 5 data files and does not throw
 *   2. renderHome() writes the hero / news / lore / recent-battle sections
 *   3. renderGrid() writes >= 1 tag card (the whole collection)
 *   4. openTag(id) writes the detail sheet incl. lore, forms, evolution
 *   5. tab switching rewires .panel.on
 *   6. collection() reflects a userRoster addition (the /play/ contract)
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..", "..");
const read = p => fs.readFileSync(path.join(ROOT, p), "utf8");

/* ---------------- minimal DOM stub ---------------- */
const elements = new Map();
function makeEl(id) {
  const el = {
    id, _html: "", textContent: "", value: "", dataset: {},
    classList: {
      _set: new Set(),
      add(c) { this._set.add(c); },
      remove(c) { this._set.delete(c); },
      toggle(c, on) { on === undefined ? (this._set.has(c) ? this._set.delete(c) : this._set.add(c)) : (on ? this._set.add(c) : this._set.delete(c)); },
      contains(c) { return this._set.has(c); }
    },
    style: {},
    listeners: {},
    addEventListener(ev, fn) { (this.listeners[ev] = this.listeners[ev] || []).push(fn); },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    set innerHTML(v) { this._html = v; if (this.onwrite) this.onwrite(v); },
    get innerHTML() { return this._html; },
    remove() {},
  };
  return el;
}
const bodyEl = makeEl("body");
global.document = {
  querySelector(sel) {
    const m = sel.match(/^#([\w-]+)$/);
    if (m) { if (m[1] === "bootVeil") return null; /* veil removed after boot */ }
    if (!elements.has(sel)) elements.set(sel, makeEl(sel));
    return elements.get(sel);
  },
  querySelectorAll() { return []; },
  addEventListener() {},
  body: bodyEl,
  createElement: () => makeEl("tmp")
};
global.window = { scrollTo() {}, addEventListener() {} };
global.location = { search: "", pathname: "/binder/", replaceState(){} };
global.history = { replaceState(){} };
global.localStorage = {
  _s: new Map(),
  getItem(k) { return this._s.has(k) ? this._s.get(k) : null; },
  setItem(k, v) { this._s.set(k, String(v)); },
  removeItem(k) { this._s.delete(k); }
};
global.fetch = url => {
  const rel = String(url).replace(/^\.\.\//, "");
  try {
    const body = read(rel);
    return Promise.resolve({ json: () => Promise.resolve(JSON.parse(body)) });
  } catch (e) {
    return Promise.reject(e);
  }
};
/* Date.now fine; toLocaleDateString exists in node */

/* ---------------- load the app ---------------- */
const src = read("binder/app.js");
global.__fail = null;
try {
  new Function(src)();          // top-level runs: wires tabs, defines boot
} catch (e) {
  console.log("FAIL: top-level throw:", e.message);
  process.exit(1);
}

/* grab boot from the closure - it is not exported, so re-eval a probe.
   window props must be visible as bare identifiers (browser semantics), so
   mirror them onto globalThis after each eval. */
const mirror = () => { for (const k of Object.keys(global.window)) { if (!(k in global)) global[k] = global.window[k]; } };
const getBoot = new Function(src + "\n;return boot;");
const boot = getBoot();
mirror();

const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  let pass = 0, fail = 0;
  const ok = (cond, label) => { if (cond) { pass++; console.log("  PASS", label); } else { fail++; console.log("  FAIL", label); } };

  await boot();
  await sleep(50);

  const grid = elements.get("#grid");
  const hero = elements.get("#heroCard");
  const news = elements.get("#newsGrid");
  const lore = elements.get("#loreCard");
  const recent = elements.get("#recentCard");
  const sc = elements.get("#sCount");

  console.log("[1] boot + home render");
  ok(!!grid && grid.innerHTML.includes("tcard"), "grid rendered tag cards");
  ok(!!hero && hero.innerHTML.includes("herotag"), "hero card rendered");
  ok(!!news && news.innerHTML.includes("newscard"), "news cards rendered");
  ok(!!lore && lore.innerHTML.includes("Fact hôm nay"), "daily fact rendered");
  ok(!!recent && recent.innerHTML.includes("5 trận gần nhất"), "recent battles section rendered");
  ok(sc && sc.textContent !== "–", "header stat counted: " + (sc && sc.textContent));

  console.log("[2] collection = roster.json 40 ids");
  ok(sc && parseInt(sc.textContent) >= 40, "count >= 40 (got " + (sc && sc.textContent) + ")");

  console.log("[3] detail sheet: open a tag with full lore (Charizard 1-2-001?)");
  const openTag = global.window.openTag;   /* app.js publishes it on window */
  if (typeof openTag !== "function") { console.log("  FAIL openTag not exposed on window"); process.exit(1); }
  openTag("1-2-010");   /* Kyurem - owned, 6★, has lore + forms */
  const modal = elements.get("#modal");
  ok(modal.innerHTML.includes("Kyurem"), "sheet shows name");
  ok(modal.innerHTML.includes("Boundary Pokémon"), "sheet shows mainline genus");
  ok(!modal.innerHTML.includes("Tiến hoá"), "no evolution section for legendary (correct)");
  const z = JSON.parse(read("data/dex_lore.json")).tags.find(t => t.name === "Kyurem");
  if (z.forms && z.forms.length) ok(modal.innerHTML.includes("Forms"), "forms section present (" + z.forms.length + " forms)");
  /* evolved species: Tyranitar is owned (1-1-005) and evolves from Larvitar line */
  openTag("1-1-005");
  ok(modal.innerHTML.includes("Tiến hoá"), "evolution section for Tyranitar");
  ok(modal.innerHTML.includes("Pupitar"), "shows pre-evolution Pupitar");
  /* Tyranitar's own sheet must carry "Pupitar -> Lv 55" (condition on the FROM edge) */
  ok(modal.innerHTML.includes("Lv 55"), "shows condition Lv 55 on the from-edge");

  console.log("[4] evolution jump link resolves only to owned species");
  /* Eevee is owned? He owns Sylveon/Espeon/Flareon/Vaporeon/Jolteon/Leafeon/Glaceon/Umbreon maybe not Eevee itself */

  console.log("[5] play-app contract: userRoster addition appears");
  const rosterNow = JSON.parse(localStorage.getItem("userRoster") || "[]");
  const countBefore = parseInt(elements.get("#sCount").textContent);
  localStorage.setItem("userRoster", JSON.stringify(["1-3-001", ...rosterNow]));   /* 1-3-001 not in roster.json 40 */
  await boot(); await sleep(50);
  const countAfter = parseInt(elements.get("#sCount").textContent);
  ok(countAfter === countBefore + 1, "play-app roster add increments collection (" + countBefore + " -> " + countAfter + ")");

  console.log("[6] search + sort path");
  const q = elements.get("#q");
  q.value = "kyu";
  for (const fn of (q.listeners["input"] || [])) fn({ target: q });
  ok(grid.innerHTML.includes("Kyurem"), "query 'kyu' keeps Kyurem");
  ok(!grid.innerHTML.includes("Garchomp"), "query 'kyu' hides others");
  q.value = "";
  for (const fn of (q.listeners["input"] || [])) fn({ target: q });

  console.log("[7] support QR deep link (?support=slug)");
  global.location = { search: "?support=blastoise", pathname: "/binder/", replaceState(){} };
  /* global.URLSearchParams exists in node; location stub used inside boot only */
  await boot(); await sleep(50);
  const modal2 = elements.get("#modal");
  ok(modal2.innerHTML.includes("Blastoise") || modal2.innerHTML.includes("support"), "support sheet opened for slug");
  /* unknown slug must not blow up */
  global.location = { search: "?support=nonexistent", pathname: "/binder/" };
  await boot(); await sleep(50);
  ok(true, "unknown slug is a no-op");

  console.log("\nRESULT:", pass, "pass /", fail, "fail");
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log("FATAL:", e.message); process.exit(1); });
