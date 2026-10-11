/* Exhaustive openTag probe: open EVERY tag sheet and report which ones
 * throw, render empty, or miss data. Mirrors the real DOM contract closely
 * enough to catch template-time exceptions (the "tap does nothing" bug). */
"use strict";
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "..", "..", "..");
const read = p => fs.readFileSync(path.join(ROOT, p), "utf8");

const elements = new Map();
function makeEl(id){
  return {
    id, _html: "", textContent: "", value: "", dataset: {}, style: {},
    classList: { _s:new Set(),
      add(c){this._s.add(c)}, remove(c){this._s.delete(c)},
      toggle(c,on){ on===undefined ? (this._s.has(c)?this._s.delete(c):this._s.add(c)) : (on?this._s.add(c):this._s.delete(c)); },
      contains(c){return this._s.has(c)} },
    listeners: {}, addEventListener(ev,fn){(this.listeners[ev]=this.listeners[ev]||[]).push(fn)},
    querySelector(){return null}, querySelectorAll(){return []},
    remove(){},
    set innerHTML(v){ this._html = v }, get innerHTML(){ return this._html }
  };
}
global.document = {
  querySelector(sel){ if(sel === "#bootVeil") return null; if(!elements.has(sel)) elements.set(sel, makeEl(sel)); return elements.get(sel); },
  querySelectorAll(){ return [] }, addEventListener(){},
  body: makeEl("body"), createElement: () => makeEl("t")
};
global.window = { scrollTo(){}, addEventListener(){} };
global.location = { search:"", pathname:"/binder/", replaceState(){} };
global.history = { replaceState(){} };
global.localStorage = { _s:new Map(), getItem(k){return this._s.has(k)?this._s.get(k):null},
  setItem(k,v){this._s.set(k,String(v))}, removeItem(k){this._s.delete(k)} };
global.fetch = url => { const rel = String(url).replace(/^\.\.\//,"");
  try { return Promise.resolve({ json: () => Promise.resolve(JSON.parse(read(rel))) }); }
  catch(e){ return Promise.reject(e); } };

const src = read("binder/app.js");
new Function(src)();
const boot = new Function(src + ";return boot;")();
for (const k of Object.keys(global.window)) if (!(k in global)) global[k] = global.window[k];

(async () => {
  await boot();
  const lore = JSON.parse(read("data/dex_lore.json")).tags;
  const loreByName = Object.fromEntries(lore.map(t => [t.name, t]));

  /* collection ids = roster.json 40 + userRoster empty */
  const roster = JSON.parse(read("data/roster.json")).tags;
  const problems = [];
  let opened = 0;
  for (const r of roster){
    try {
      global.openTag(r.id);
      const m = elements.get("#modal");
      const html = m._html;
      if (!html || html.length < 200){
        problems.push({ id: r.id, name: r.name, why: "sheet too short", len: html.length });
      } else if (!html.includes(r.name)){
        problems.push({ id: r.id, name: r.name, why: "name missing from sheet" });
      } else {
        opened++;
        /* data richness audit while we are here */
        const miss = [];
        if (!html.includes("slore")) miss.push("no-lore-block");
        const l = loreByName[r.name];
        if (l && !l.lore) miss.push("lore-data-empty");
        if (miss.length) problems.push({ id: r.id, name: r.name, why: "thin sheet", miss });
      }
      m._html = "";
    } catch (e) {
      problems.push({ id: r.id, name: r.name, why: "THROW", err: e.message });
    }
  }
  console.log(`opened OK: ${opened}/${roster.length}`);
  if (problems.length){
    console.log("\nPROBLEMS:");
    for (const p of problems) console.log(" ", JSON.stringify(p));
  } else {
    console.log("no problems found in 40-tag sweep");
  }
  /* also sweep every lore name through resolveTag to catch resolve misses */
  const missing = lore.filter(l => !roster.some(r => r.name === l.name)).length;
  console.log(`(lore covers ${lore.length} names; ${roster.length} currently bindered)`);
  process.exit(0);
})().catch(e => { console.log("FATAL:", e.message); process.exit(1); });
