
"use strict";
const fs = require("fs"), path = require("path");
const ROOT = 'C:\\Users\\ankha\\AppData\\Local\\hermes\\profiles\\cg-bro\\workspace\\mezastar-dex';
const read = p => fs.readFileSync(path.join(ROOT, p), "utf8");
const elements = new Map();
function makeEl(id){ const el = { id, _html:"", textContent:"", value:"", dataset:{},
  classList:{ _s:new Set(), add(c){this._s.add(c)}, remove(c){this._s.delete(c)}, toggle(c,on){}, contains(c){return this._s.has(c)} },
  style:{}, listeners:{}, addEventListener(ev,fn){(this.listeners[ev]=this.listeners[ev]||[]).push(fn)},
  querySelector(){return null}, querySelectorAll(){return []},
  set innerHTML(v){this._html=v}, get innerHTML(){return this._html} }; return el; }
global.document = { querySelector(sel){ if(!elements.has(sel)) elements.set(sel, makeEl(sel)); return elements.get(sel); },
  querySelectorAll(){return []}, addEventListener(){}, body: makeEl("body"), createElement:()=>makeEl("t") };
global.window = { scrollTo(){}, addEventListener(){} };
global.location = { search: "?support=blastoise", pathname:"/binder/", replaceState(){} };
global.localStorage = { _s:new Map(), getItem(k){return this._s.has(k)?this._s.get(k):null}, setItem(k,v){this._s.set(k,String(v))}, removeItem(k){this._s.delete(k)} };
global.fetch = url => { const rel = String(url).replace(/^\.\.\//, "");
  try { return Promise.resolve({ json: () => Promise.resolve(JSON.parse(read(rel))) }); }
  catch(e){ return Promise.reject(e); } };
const src = read("binder/app.js");
new Function(src)();   // defines window.openSupport + runs wiring
const boot = new Function(src + ";return boot;")();
(async () => {
  await boot();
  const m = elements.get("#modal");
  console.log("modal has content:", m.innerHTML.length > 0);
  console.log("mentions Blastoise:", m.innerHTML.includes("Blastoise"));
  console.log("first 300:", m.innerHTML.slice(0, 300));
})().catch(e => console.log("FATAL", e.message));
