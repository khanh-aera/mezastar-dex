/* ===== MEZASTAR BINDER · app ===== */
const TYPE_COLOR = {
  Normal:"#b8bec9", Fire:"#ff8a4c", Water:"#59a8ff", Electric:"#ffd93d", Grass:"#6ede6a",
  Ice:"#7fe4e6", Fighting:"#ff6b6b", Poison:"#c07bff", Ground:"#e0b26a", Flying:"#9fb8ff",
  Psychic:"#ff7bc0", Bug:"#a8c93a", Rock:"#c9a86a", Ghost:"#8f7bff", Dragon:"#6b8cff",
  Dark:"#8a7f9c", Steel:"#a8b8c9", Fairy:"#ffa4e0"
};
const GRAD = { 6:"linear-gradient(96deg,#ffd76a,#ff9de2)", 5:"linear-gradient(96deg,#9dff6a,#5ce1ff)", 4:"linear-gradient(96deg,#8fb8ff,#c9a2ff)" };

let ROSTER = [], BOSSES = [], CHART = {}, TYPES = [];
let state = { tab:"binder", q:"", type:null, sort:"pe", boss:null, bfilter:"" };

const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const pill = t => `<span class="pill" style="background:${TYPE_COLOR[t]||"#9aa"};color:#080b17">${t}</span>`;
const stars = g => "★".repeat(Math.max(0, Math.min(6, parseInt(g||0)))) || "";

function offMult(attTypes, bossTypes){
  let best = 0;
  for (const a of attTypes){
    let m = 1; for (const b of bossTypes) m *= (CHART[a]?.[b] ?? 1);
    if (m > best) best = m;
  }
  return best;
}
function incomingMult(bossTypes, mine){
  let best = 0;
  for (const b of bossTypes) for (const d of mine) best = Math.max(best, CHART[b]?.[d] ?? 1);
  return best || 1;
}

/* ---------------- binder ---------------- */
function renderChips(){
  const present = [...new Set(ROSTER.flatMap(t => t.types))].sort();
  $("#typeChips").innerHTML = `<span class="chip ${!state.type?"on":""}" data-t="">All types</span>` +
    present.map(t => `<span class="chip ${state.type===t?"on":""}" data-t="${t}" style="${state.type===t?`background:${TYPE_COLOR[t]}`:""}">${t}</span>`).join("");
  $("#typeChips").querySelectorAll(".chip").forEach(c => c.onclick = () => { state.type = c.dataset.t || null; renderChips(); renderGrid(); });
}
function filtered(){
  const q = state.q.trim().toLowerCase();
  let list = ROSTER.filter(t => {
    if (state.type && !t.types.includes(state.type)) return false;
    if (!q) return true;
    return (t.name + " " + t.id + " " + t.types.join(" ") + " " + t.tier + " " + t.ability).toLowerCase().includes(q);
  });
  list.sort((a,b) => state.sort === "name" ? a.name.localeCompare(b.name) : b.pe - a.pe);
  return list;
}
function dupeNames(){
  const c = {}; ROSTER.forEach(t => c[t.name] = (c[t.name]||0)+1);
  return new Set(Object.keys(c).filter(n => c[n] > 1));
}
function renderGrid(){
  const list = filtered(), dupes = dupeNames();
  if (!list.length){ $("#grid").innerHTML = `<div class="empty">No tag matches that.</div>`; return; }
  $("#grid").innerHTML = list.map((t,i) => `
    <article class="card" data-i="${ROSTER.indexOf(t)}" style="--glow:${(TYPE_COLOR[t.types[0]]||"#7aa2ff")}66">
      <div class="halo"></div>
      <div class="pe">PE ${t.pe}</div>
      <div class="stars">${stars(t.grade)}</div>
      ${t.img ? `<img src="${t.img}" alt="${esc(t.name)}" loading="${i<8?"eager":"lazy"}">` : ""}
      <div class="cname">${esc(t.name)}</div>
      <div class="cid">${esc(t.id)}${t.ability?" · "+esc(t.ability):""}</div>
      <div class="pills">${t.types.map(pill).join("")}</div>
      ${dupes.has(t.name) ? `<span class="dupe">DUPLICATE</span>` : ""}
    </article>`).join("");
  $("#grid").querySelectorAll(".card").forEach(c => c.onclick = () => openTag(+c.dataset.i));
}

/* ---------------- tag modal ---------------- */
function openTag(i){
  const t = ROSTER[i];
  const strong = t.beats.length ? t.beats : [];
  const partners = ROSTER.filter(o => o.name !== t.name && o.types.some(x => !t.types.includes(x))).slice(0,3);
  $("#modal").innerHTML = `
    <button class="close" id="x">×</button>
    <div class="mherow">
      <div class="mart" style="background:radial-gradient(circle at 50% 20%,${(TYPE_COLOR[t.types[0]]||"#7aa2ff")}33,transparent 70%),rgba(255,255,255,.05)">
        ${t.img ? `<img src="${t.img}" alt="${esc(t.name)}">` : ""}
      </div>
      <div class="minfo">
        <div class="role">${esc(t.tier || "Tag")} · Grade ${esc(t.grade||"?")}</div>
        <h2 class="hname">${esc(t.name)}</h2>
        <div class="ptypes">${t.types.map(pill).join("")}</div>
        <div class="kv">
          <div><span>Poké Energy</span><b>${t.pe}</b></div>
          <div><span>Tag ID</span><b>${esc(t.id)}</b></div>
          <div><span>Grade</span><b>${stars(t.grade) || "-"}</b></div>
          <div><span>Ability</span><b>${esc(t.ability || "not listed")}</b></div>
        </div>
      </div>
    </div>
    ${t.moves ? `<div class="sect"><h3>Moves</h3><div class="hint">${esc(t.moves)}</div></div>` : ""}
    <div class="sect"><h3>Hits bosses for double damage</h3>
      <div class="tagsin">${strong.length ? strong.map(x => `<span class="tin" style="background:${TYPE_COLOR[x]}">${x} 2x</span>`).join("") : `<span class="hint">No super effective coverage.</span>`}</div>
    </div>
    <div class="sect"><h3>Careful: takes double damage from</h3>
      <div class="tagsin">${t.weak.length ? t.weak.map(x => `<span class="tin" style="background:${TYPE_COLOR[x]}">${x}</span>`).join("") : `<span class="hint">Nothing hits it for 2x.</span>`}</div>
    </div>
    ${t.resist.length ? `<div class="sect"><h3>Resists</h3><div class="tagsin">${t.resist.map(x => `<span class="tin" style="background:${TYPE_COLOR[x]}">${x}</span>`).join("")}</div></div>` : ""}
    ${t.weak.length >= 5 ? `<div class="note warn">This one is fragile: ${t.weak.length} types hit it for double damage. Send it out when the boss cannot punish it.</div>` : ""}
    ${t.weak.length && t.weak.length <= 1 ? `<div class="note good">Very safe tag, only ${t.weak[0]} threatens it. A good opener.</div>` : ""}
    <div class="sect"><h3>Pairs well with</h3>
      ${partners.map(p => `<div class="route"><img src="${p.img}" alt=""><div><div class="rn">${esc(p.name)}</div><div class="rs">PE ${p.pe} · ${esc(p.types.join(" / "))}</div></div></div>`).join("")}
    </div>`;
  $("#scrim").classList.add("on");
  $("#x").onclick = closeModal;
}
function closeModal(){ $("#scrim").classList.remove("on"); }
$("#scrim")?.addEventListener?.("click", e => { if (e.target.id === "scrim") closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

/* ---------------- boss counter ---------------- */
/* Vietnam machines only run Stardust Version 2, so the boss list defaults to VN tags.
   The other sets stay in the database for reference and are revealed by the VN only button. */
let ALLSETS = false;
function bossList(){ return ALLSETS ? BOSSES : BOSSES.filter(b => b.vn); }
function lev(a, b){
  const m = a.length, n = b.length;
  if (Math.abs(m - n) > 3) return 99;
  let prev = Array.from({length:n+1}, (_,i) => i), cur = new Array(n+1);
  for (let i = 1; i <= m; i++){
    cur[0] = i;
    for (let j = 1; j <= n; j++){
      cur[j] = Math.min(prev[j] + 1, cur[j-1] + 1, prev[j-1] + (a[i-1] === b[j-1] ? 0 : 1));
    }
    [prev, cur] = [cur, prev];
  }
  return prev[n];
}
function resolveBoss(q){
  const s = (q||"").trim().toLowerCase(); if (!s) return null;
  /* search every set so a name still resolves if he types one that is not on VN machines yet */
  const L = BOSSES;
  return L.find(b => b.name.toLowerCase() === s)
      || L.find(b => b.name.toLowerCase().startsWith(s))
      || L.find(b => b.name.toLowerCase().includes(s))
      || L.filter(b => lev(s, b.name.toLowerCase()) <= (s.length > 5 ? 2 : 1))
          .sort((x,y) => lev(s, x.name.toLowerCase()) - lev(s, y.name.toLowerCase()))[0]
      || null;
}
function counterFor(boss){
  const rows = ROSTER.map(t => {
    const o = offMult(t.types, boss.types), inc = incomingMult(boss.types, t.types);
    let why = [];
    t.types.forEach(at => { let m = 1; boss.types.forEach(bt => m *= (CHART[at]?.[bt] ?? 1)); if (m >= 2) why.push(`${at} ${m}x`); });
    return { t, o, inc, why };
  }).sort((a,b) => b.o - a.o || a.inc - b.inc || b.t.pe - a.t.pe);
  const top = rows[0];
  const seen = new Set();
  const alts = rows.filter(r => r.o === top.o && r.t.name !== top.t.name)
                   .filter(r => !seen.has(r.t.name) && seen.add(r.t.name))
                   .slice(0, 3);
  const seenAvoid = new Set();
  const avoid = ROSTER.filter(t => incomingMult(boss.types, t.types) >= 2 && t.name !== top.t.name)
                     .sort((a,b) => b.pe - a.pe)
                     .filter(t => !seenAvoid.has(t.name) && seenAvoid.add(t.name)).slice(0,4);
  return { top, alts, avoid, rows };
}
function routeRow(t, mult, sub){
  return `<div class="route"><img src="${t.img}" alt="">
    <div><div class="rn">${esc(t.name)}</div><div class="rs">${sub}</div></div>
    <div class="badge" style="background:${mult>=4?"linear-gradient(96deg,#ffd76a,#ff9de2)":"linear-gradient(96deg,#9dff6a,#5ce1ff)"}">${mult ? mult+"x" : "PE"}</div></div>`;
}
function renderBossResult(){
  const el = $("#bossResult");
  if (!state.boss){ el.innerHTML = `<div class="glass hero"><div class="hint">Pick the boss you met and I will show the best tag from your binder, plus what to leave in the bag.</div></div>`; return; }
  const b = state.boss, r = counterFor(b), t = r.top.t;
  const good = r.top.o >= 2;
  el.innerHTML = `
    <div class="glass hero">
      <div class="pickrow">
        <div class="pickart" style="background:radial-gradient(circle at 50% 25%,${(TYPE_COLOR[t.types[0]]||"#7aa2ff")}44,transparent 72%),rgba(255,255,255,.06)">
          ${t.img ? `<img src="${t.img}" alt="${esc(t.name)}">` : ""}
          <div class="mult">${good ? (r.top.o>=4?"4x":"2x") : "PE"}</div>
          <span class="lbl">Your pick</span>
        </div>
        <div style="flex:1;min-width:210px">
          <div class="role">Boss: ${esc(b.name)} · ${esc(b.types.join(" / "))}${b.version ? " · "+esc(b.version)+(b.vn?" (VN machine)":"") : ""}</div>
          <h2 class="picktitle">${esc(t.name)}</h2>
          <div class="ptypes">${t.types.map(pill).join("")}</div>
          <div class="hint">${good
            ? `Your strongest answer: <b>${r.top.why.join(", ")}</b> on this boss, at PE ${t.pe}.`
            : `Nothing in your binder hits this boss for double damage. This is your safest high PE option instead.`}</div>
          ${t.ability ? `<div class="note good">Triggers ${esc(t.ability)}</div>` : ""}
          ${r.top.inc >= 2 ? `<div class="note warn">Careful: this boss hits ${esc(t.name)} for double damage too.</div>` : ""}
        </div>
        ${b.img ? `<div class="pickart bossart" style="background:radial-gradient(circle at 50% 80%,${(TYPE_COLOR[b.types[0]]||"#7aa2ff")}33,transparent 72%),rgba(255,255,255,.04)">
          <img src="${b.img}" alt="${esc(b.name)}"><span class="lbl">Boss</span></div>` : ""}
      </div>
      ${!b.vn ? `<div class="note warn"><b>Heads up:</b> ${esc(b.name)} is from ${esc(b.version || "another set")}. Vietnam machines only run Stardust Version 2 right now, so you cannot meet it yet. The counters below still show what would work.</div>` : ""}
      ${r.alts.length ? `<div class="sect"><h3>Also works</h3>${r.alts.map(a => routeRow(a.t, a.o, `PE ${a.t.pe} · ${a.why.join(", ") || a.t.types.join(" / ")}`)).join("")}</div>` : ""}
      ${r.avoid.length ? `<div class="note bad"><b>Leave in the bag:</b> ${r.avoid.map(x => esc(x.name)).join(", ")} (this boss hits them for double damage).</div>` : ""}
    </div>`;
}
function renderBossGrid(){
  const q = state.bfilter.trim().toLowerCase();
  const pool = bossList();
  const list = pool.filter(b => !q || b.name.toLowerCase().includes(q)).slice(0, 90);
  const pc = $("#poolCount");
  if (pc) pc.innerHTML = ALLSETS
    ? `${BOSSES.length} bosses, all sets · <b>${BOSSES.filter(b=>b.vn).length}</b> are on VN machines`
    : `<b>${pool.length}</b> bosses in play in Vietnam`;
  const tg = $("#setToggle"); if (tg) tg.classList.toggle("act", ALLSETS);
  $("#bossGrid").innerHTML = list.map(b => `<div class="bcard ${state.boss&&state.boss.name===b.name?"on":""}" data-n="${esc(b.name)}">
      ${b.img ? `<img src="${b.img}" alt="" loading="lazy">` : ""}<div class="bn">${esc(b.name)}</div>
      <div class="pn" style="font-size:10px;color:var(--dim)">${esc(b.types.join("/"))}${b.vn?'<span style="color:#9dff6a"> · VN</span>':'<span style="color:#ff9aad"> · '+esc(b.version||"")+'</span>'}</div></div>`).join("")
      || `<div class="empty">No boss with that name in the database.</div>`;
  $("#bossGrid").querySelectorAll(".bcard").forEach(c => c.onclick = () => { selectBoss(c.dataset.n); });
}
function selectBoss(name, keepFilter){
  state.boss = resolveBoss(name);
  if (!keepFilter){ state.bfilter = ""; }
  document.querySelectorAll("#bossChips .chip").forEach(c => c.classList.toggle("on", c.dataset.n === name));
  renderBossResult(); renderBossGrid();
  const el = $("#bossResult");
  if (el) el.scrollIntoView({behavior:"smooth", block:"nearest"});
}

/* ---------------- loadout ---------------- */
function byName(n){ return ROSTER.find(t => t.name === n) || ROSTER[0]; }
function renderLoadout(){
  const trio = [["Snorlax","LEAD","Only one weakness in the game. Survives anything, holds Dynamax."],
                ["Kyurem","CLOSER","Your highest PE. 2x into Grass, Ground, Flying, Dragon. Never lead with it."],
                ["Lucario","FLEX","Unlocks Normal, Ice, Rock, Dark, Steel, Fairy. Holds Mega Evolution."]];
  const variants = [
    ["Max coverage","Kyurem + Gardevoir + Lucario","12 of 18 boss types at 398 PE. No tank, and Gardevoir is fragile."],
    ["Z-Move build","Kyurem + Snorlax + Torterra","10 of 18 at 412 PE, fires a Z-Move. Torterra is weak to 7 types, keep it in the back."],
    ["Z-Move, safer art","Kyurem + Snorlax + Empoleon","8 of 18 at 414 PE. Covers Fire, Ice, Rock and Fairy you otherwise miss."]
  ];
  const bag = ["Gardevoir","Torterra","Drednaw","Meowscarada","Empoleon"];
  $("#loadout").innerHTML = `
    <div class="glass hero">
      <div class="role" style="margin-bottom:10px">Default loadout · blind boss</div>
      ${trio.map(([n,role,why]) => { const t = byName(n); return `
        <div class="setcard glass">
          <img src="${t.img}" alt="">
          <div style="flex:1;min-width:170px">
            <div class="role">${role}</div>
            <div class="rn" style="font-family:'Chakra Petch';font-size:18px">${esc(t.name)} <span style="color:var(--gold)">PE ${t.pe}</span></div>
            <div class="rs hint">${why}</div>
            <div class="pills">${t.types.map(pill).join("")}</div>
          </div>
        </div>`; }).join("")}
      <div class="note good">Total 418 PE · covers 10 of 18 boss types · your Kyurem + Snorlax pair alone only covers 4, so the third slot is the whole coverage lever.</div>
    </div>
    <div class="glass hero">
      <div class="role" style="margin-bottom:10px">Variants</div>
      ${variants.map(([name,list,why]) => `
        <div class="setcard glass" style="align-items:flex-start">
          <div style="flex:1;min-width:190px">
            <div class="rn" style="font-family:'Chakra Petch';font-size:16px">${name}</div>
            <div class="rs hint">${list}<br>${why}</div>
          </div>
        </div>`).join("")}
      <div class="note warn">Only one Z-Move per session, so carrying Torterra and Empoleon together wastes a slot.</div>
    </div>
    <div class="glass hero">
      <div class="role" style="margin-bottom:10px">Spare bag · swap before loading</div>
      ${bag.map(n => { const t = byName(n); return `
        <div class="route"><img src="${t.img}" alt="">
          <div><div class="rn">${esc(t.name)}</div><div class="rs">PE ${t.pe} · ${esc(t.types.join(" / "))}${t.beats.length?" · 2x into "+esc(t.beats.join(", ")):""}</div></div></div>`; }).join("")}
      <div class="note good">Trigger budget: Dynamax on Snorlax, Mega on Lucario, Z-Move once (Torterra or Empoleon).</div>
      <div class="note warn">Kyurem is weak to 7 types. If the boss is Dragon, Fighting, Fairy, Fire, Ice, Rock or Steel, keep it for last or leave it out.</div>
    </div>`;
}

/* ---------------- wiring ---------------- */
function tab(name){
  state.tab = name;
  document.querySelectorAll("nav.tabs button").forEach(b => b.classList.toggle("on", b.dataset.tab === name));
  document.querySelectorAll(".panel").forEach(p => p.classList.toggle("on", p.id === "p-" + name));
}
document.querySelectorAll("nav.tabs button").forEach(b => b.onclick = () => tab(b.dataset.tab));
$("#q").oninput = e => { state.q = e.target.value; renderGrid(); };
$("#sortBtn").onclick = () => { state.sort = "pe"; $("#sortBtn").classList.add("act"); $("#sortName").classList.remove("act"); renderGrid(); };
$("#sortName").onclick = () => { state.sort = "name"; $("#sortName").classList.add("act"); $("#sortBtn").classList.remove("act"); renderGrid(); };
$("#bq").oninput = e => {
  state.bfilter = e.target.value;
  const m = resolveBoss(state.bfilter);
  if (m) state.boss = m;
  renderBossResult();
  renderBossGrid();
};
$("#bq").onkeydown = e => { if (e.key === "Enter"){ const m = resolveBoss(state.bfilter); if (m) selectBoss(m.name); } };
$("#clearBoss").onclick = () => { state.bfilter = ""; state.boss = null; $("#bq").value = ""; selectBoss("", true); };

(async function init(){
  try{
    const [ro, bo, tc] = await Promise.all([
      fetch("data/roster.json").then(r => r.json()),
      fetch("data/bosses.json").then(r => r.json()),
      fetch("data/typechart.json").then(r => r.json())
    ]);
    ROSTER = ro.tags; BOSSES = bo.bosses; CHART = tc.chart; TYPES = tc.types;
    $("#sCount").textContent = ROSTER.length;
    $("#sPe").textContent = ROSTER.reduce((s,t) => s + t.pe, 0);
    $("#sType").textContent = [...new Set(ROSTER.flatMap(t => t.types))].length;
    const quick = ["Kyurem","Koraidon","Reshiram","Zekrom","Kommo-o","Tyranitar","Metagross","Alolan Ninetales","Skeledirge","Drifblim","Leafeon","Infernape"];
    $("#bossChips").innerHTML = quick.map(n => `<span class="chip" data-n="${n}">${n}</span>`).join("");
    $("#bossChips").querySelectorAll(".chip").forEach(c => c.onclick = () => { $("#bq").value = c.dataset.n; selectBoss(c.dataset.n); });
    $("#setToggle").onclick = () => { ALLSETS = !ALLSETS; renderBossGrid(); };
    renderChips(); renderGrid(); renderBossResult(); renderBossGrid(); renderLoadout();
  }catch(err){
    document.querySelectorAll(".spin").forEach(s => s.outerHTML = `<div class="empty">Could not load the binder data: ${err.message}</div>`);
  }
})();
