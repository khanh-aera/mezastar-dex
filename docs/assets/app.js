/* ===== MEZASTAR BINDER · app =====
   MEGA UPDATE 2026-09-20 · 50 functions in this build:
   F1 grade filter · F2 bosses this tag beats · F3 cover-my-weakness hunt per tag · F4 fragility/4x warnings
   F5 compare my tags · F6 full counter matrix · F7 field trio · F8 compare up to 3 bosses · F9 battle plan
   F10 random boss drill · F11 fuzzy voice ready names · F12 share result · F13 speak result · F14 completion stats
   F15 V2 hunt list with owned badges · F16 wishlist · F17 wishlist hunt order · F18 type gap advisor
   F19 PE ladder · F20 trigger inventory · F21 grade breakdown · F22 PE per type leaderboard · F23 auto team build
   F24 save teams · F25 team danger report · F26 team coverage meter · F27 counter log with streaks
   F28 win rate · F29 log cleanup · F30 credit budget planner · F31 expected 6 star cost · F32 session tracker
   F33 Vietnamese UI · F34 roulette timing trainer · F35 ball odds reference · F36 golden turn planner
   F37 SS hunting tactic guide · F38 data export · F39 data import · F40 reset data · F41 offline install hint
   F42 achievements · F43 safer picks (defense first) · F44 PE density sort · F45 anti duplicate advisor
   F46 dupe trade list · F47 spare bag advisor · F48 type coverage checklist · F49 rotating pro tips · F50 dark battery saver */
const FEATURES = [
 "Grade filter (6★/5★/4★)","Bosses this tag beats","Cover my weak spots per tag","Fragility and 4x warnings",
 "Compare two of my tags side by side","Full counter matrix for a boss","Field trio suggestion","Compare up to 3 bosses",
 "Turn by turn battle plan","Random boss drill","Name matching built for typos","Share result as text",
 "Speak the pick out loud","Collection completion stats","V2 hunt list with owned badges","Wishlist with hearts",
 "Wishlist hunt order","Type gap advisor","PE ladder of the whole set","Trigger inventory (Dynamax/Mega/Z Move)",
 "Grade breakdown bars","PE per type leaderboard","Auto team builder","Save and load teams","Team danger report",
 "Team coverage meter","Counter log with streaks","Win rate tracking","Log cleanup","Credit budget planner",
 "Expected cost per 6 star tag","Session money tracker","Vietnamese interface","Roulette timing trainer",
 "Ball odds reference","Golden turn planner","SS hunting tactics guide","Export all data","Import data backup",
 "Reset everything","Achievements","Safer picks mode (defense first)","PE density sorting","Anti duplicate advisor",
 "Dupe trade list","Spare bag advisor","Type coverage checklist","Rotating pro tips","Battery saver dim mode"
];

const TYPE_COLOR = {
  Normal:"#b8bec9", Fire:"#ff8a4c", Water:"#59a8ff", Electric:"#ffd93d", Grass:"#6ede6a",
  Ice:"#7fe4e6", Fighting:"#ff6b6b", Poison:"#c07bff", Ground:"#e0b26a", Flying:"#9fb8ff",
  Psychic:"#ff7bc0", Bug:"#a8c93a", Rock:"#c9a86a", Ghost:"#8f7bff", Dragon:"#6b8cff",
  Dark:"#8a7f9c", Steel:"#a8b8c9", Fairy:"#ffa4e0"
};
const GRAD = { 6:"linear-gradient(96deg,#ffd76a,#ff9de2)", 5:"linear-gradient(96deg,#9dff6a,#5ce1ff)", 4:"linear-gradient(96deg,#8fb8ff,#c9a2ff)" };

/* ---------- tiny storage (F27..F40 all persist through this) ---------- */
const LS = {
  get(k, d){ try { const v = localStorage.getItem("meza."+k); return v === null ? d : JSON.parse(v); } catch(e){ return d; } },
  set(k, v){ try { localStorage.setItem("meza."+k, JSON.stringify(v)); } catch(e){} }
};

let ROSTER = [], POOL = [], BOSSES = [], CHART = {}, TYPES = [];
let state  = { tab:"binder", q:"", type:null, grade:null, sort:"pe", boss:null, bfilter:"", safe:false };
let pstate = { q:"", type:null, mode:"missing" };
let ALLSETS = false;
let SEL = new Set();                                /* F5  binder compare selection */
let COMPARE = [];                                  /* F8  boss compare bench */
let PICK_SLOT = -1;                                /* team lab slot being filled */
let TEAM = LS.get("team", [null, null, null]);     /* F23 */
let SAVED_TEAMS = LS.get("teams", []);             /* F24 */
let WISH = LS.get("wish", []);                     /* F16 */
let LOG = LS.get("log", []);                       /* F27 */
let SETTINGS = LS.get("set", { ve:"en", dim:false });
let SESSION = LS.get("session", null);             /* F32 */
let OWNED = {};                                    /* name -> copies owned */

/* ---------- F33 Vietnamese interface ---------- */
const STR = {
 en:{ tb:"My Binder", tc:"Boss Counter", tl:"Team Lab", th:"Hunt List", ts:"Stats & Tools",
     sq:"Search my tags by name, id or type…", sbq:"Type the boss you just met… (kyurem, koraidon, skele)",
     pick:"Your pick", alts:"Also works", avoid:"Leave in the bag", plan:"Battle plan",
     logw:"Log win", logl:"Log loss", compare:"Compare", clear:"Reset", wish:"Wishlist",
     missing:"Missing", dupes:"Dupes", all:"All", vn:"VN", club:"Club", mag:"Magazine", event:"Event", owned:"owned", want:"want",
     stats:"Collection stats", coverage:"Type coverage", grade:"Grade breakdown", triggers:"Triggers held",
     streak:"Current streak", winrate:"Win rate", budget:"Budget planner", guide:"Tactics guide",
     export:"Export data", imp:"Import", reset:"Reset all", tips:"Pro tip" },
 vi:{ tb:"Bộ Sưu Tập", tc:"Chống Boss", tl:"Xây Đội", th:"Danh Sách Săn", ts:"Thống Kê & Công Cụ", tt:"Vé Hỗ Trợ",
      sq:"Tìm tag theo tên, mã, hệ…", sbq:"Gõ tên boss vừa gặp… (kyurem, koraidon, skele)", tq:"Tìm vé hỗ trợ theo tên, chiêu thức, nguồn…",
      pick:"Tag nên dùng", alts:"Cũng dùng được", avoid:"Cất vào túi", plan:"Kế hoạch đấu",
      logw:"Thắng", logl:"Thua", compare:"So sánh", clear:"Đặt lại", wish:"Muốn có",
      missing:"Chưa có", dupes:"Trùng", all:"Tất Cả", vn:"VN", club:"CLB", mag:"Tạp Chí", event:"Sự Kiện",
      owned:"đã có", want:"muốn", stats:"Thống kê bộ sưu tập", coverage:"Độ phủ hệ", grade:"Phân bố sao", triggers:"Triệu hồi đang có",
      streak:"Chuỗi thắng", winrate:"Tỉ lệ thắng", budget:"Tính ngân sách", guide:"Cẩm nang chiến thuật",
      export:"Xuất dữ liệu", imp:"Nhập", reset:"Xóa hết", tips:"Mẹo" }
};
const t = k => (STR[SETTINGS.ve] && STR[SETTINGS.ve][k]) || STR.en[k] || k;

const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const pill = tp => `<span class="pill" style="background:${TYPE_COLOR[tp]||"#9aa"};color:#080b17">${tp}</span>`;
const stars = g => "★".repeat(Math.max(0, Math.min(6, parseInt(g||0)))) || "";
const fmtDate = ts => new Date(ts).toLocaleDateString();

function offMult(attTypes, bossTypes){
  let best = 0;
  for (const a of attTypes){ let m = 1; for (const b of bossTypes) m *= (CHART[a]?.[b] ?? 1); if (m > best) best = m; }
  return best;
}
function incomingMult(bossTypes, mine){
  let best = 0;
  for (const b of bossTypes) for (const d of mine) best = Math.max(best, CHART[b]?.[d] ?? 1);
  return best || 1;
}
const coveredTypes = team => TYPES.filter(bt => team.some(m => offMult(m.types, [bt]) >= 2));
const teamPE = team => team.reduce((s,m) => s + (m ? m.pe : 0), 0);

/* ================= BINDER ================= */
function renderChips(){
  const present = [...new Set(ROSTER.flatMap(x => x.types))].sort();
  $("#typeChips").innerHTML = `<span class="chip ${!state.type?"on":""}" data-t="">All types</span>` +
    present.map(tp => `<span class="chip ${state.type===tp?"on":""}" data-t="${tp}" style="${state.type===tp?`background:${TYPE_COLOR[tp]}`:""}">${tp}</span>`).join("");
  $("#typeChips").querySelectorAll(".chip").forEach(c => c.onclick = () => { state.type = c.dataset.t || null; renderChips(); renderGrid(); });
  /* F1 grade filter */
  $("#gradeChips").innerHTML = [null,6,5,4].map(g =>
    `<span class="chip g ${state.grade===g?"on":""}" data-g="${g??""}">${g===null?"All stars":g+"★"}</span>`).join("");
  $("#gradeChips").querySelectorAll(".chip").forEach(c => c.onclick = () => {
    state.grade = c.dataset.g === "" ? null : +c.dataset.g; renderChips(); renderGrid(); });
}
function filtered(){
  const q = state.q.trim().toLowerCase();
  let list = ROSTER.filter(x => {
    if (state.type && !x.types.includes(state.type)) return false;
    if (state.grade && +x.grade !== state.grade) return false;          /* F1 */
    if (!q) return true;
    return (x.name + " " + x.id + " " + x.types.join(" ") + " " + x.tier + " " + x.ability).toLowerCase().includes(q);
  });
  if (state.sort === "name") list.sort((a,b) => a.name.localeCompare(b.name));
  else if (state.sort === "dense") list.sort((a,b) => (b.pe/Math.max(2,b.beats.length)) - (a.pe/Math.max(2,a.beats.length))); /* F44 PE density */
  else list.sort((a,b) => b.pe - a.pe);
  return list;
}
function dupeNames(){
  const c = {}; ROSTER.forEach(x => c[x.name] = (c[x.name]||0)+1);
  return new Set(Object.keys(c).filter(n => c[n] > 1));
}
function renderGrid(){
  const list = filtered(), dupes = dupeNames();
  $("#cmpBar").style.display = SEL.size ? "flex" : "none";
  $("#cmpCount").textContent = SEL.size;
  if (!list.length){ $("#grid").innerHTML = `<div class="empty">No tag matches that.</div>`; return; }
  $("#grid").innerHTML = list.map((x,i) => `
    <article class="card ${SEL.has(x.id)?"sel":""}" data-id="${esc(x.id)}" style="--glow:${(TYPE_COLOR[x.types[0]]||"#7aa2ff")}66">
      <div class="halo"></div>
      <div class="pe">PE ${x.pe}</div>
      <div class="stars">${stars(x.grade)}</div>
      ${x.sprite ? `<img class="s2d ${x.animated?"":"still"}" src="${x.sprite}" alt="${esc(x.name)}" loading="lazy">` : (x.img ? `<img src="${x.img}" alt="${esc(x.name)}" loading="lazy">` : "")}
      <button class="selbtn" title="Compare">${SEL.has(x.id)?"⚖":"+"}</button>
      <div class="cname">${esc(x.name)}</div>
      <div class="cid">${esc(x.id)}${x.ability?" · "+esc(x.ability):""}</div>
      <div class="pills">${x.types.map(pill).join("")}</div>
      ${dupes.has(x.name) ? `<span class="dupe">DUPLICATE</span>` : ""}
    </article>`).join("");
  $("#grid").querySelectorAll(".card").forEach(c => {
    c.onclick = () => openTag(c.dataset.id);
    const b = c.querySelector(".selbtn");
    b.onclick = ev => { ev.stopPropagation();                                  /* F5 */
      SEL.has(c.dataset.id) ? SEL.delete(c.dataset.id) : SEL.add(c.dataset.id);
      renderGrid(); };
  });
}
/* F5 compare my tags */
function openCompareModal(){
  const items = [...SEL].map(id => ROSTER.find(x => x.id === id)).filter(Boolean);
  if (items.length < 2){ flashNote("#grid", "Pick at least two tags with the + button."); return; }
  const cov = coveredTypes(items);
  const rows = ["pe","grade","id"].map(k => `<tr><th>${k==="pe"?"PE":k==="grade"?"Stars":"ID"}</th>${items.map(x => `<td>${k==="pe"?x.pe:k==="grade"?(stars(x.grade)||"-"):esc(x.id)}</td>`).join("")}</tr>`).join("")
    + `<tr><th>2x into</th>${items.map(x => `<td>${x.beats.length?x.beats.join(", "):"-"}</td>`).join("")}</tr>`
    + `<tr><th>Weak to</th>${items.map(x => `<td>${x.weak.length?x.weak.join(", "):"-"}</td>`).join("")}</tr>`;
  $("#modal").innerHTML = `
    <button class="close" id="x">×</button>
    <div class="mherow">
      ${items.map(x => `<div class="cmpcol"><div class="mart" style="background:radial-gradient(circle at 50% 20%,${(TYPE_COLOR[x.types[0]]||"#7aa2ff")}33,transparent 70%),rgba(255,255,255,.05)">
        ${x.img ? `<img src="${x.img}" alt="">` : ""}</div>
        <h3 class="hname" style="font-size:17px">${esc(x.name)}</h3><div class="pills">${x.types.map(pill).join("")}</div></div>`).join("")}
    </div>
    <div class="sect"><h3>Head to head</h3><table class="mtable">${rows}</table></div>
    <div class="sect"><h3>Together they cover</h3><div class="tagsin">${cov.map(x => `<span class="tin" style="background:${TYPE_COLOR[x]}">${x}</span>`).join("") || `<span class="hint">Nothing at 2x.</span>`}</div>
      <div class="hint" style="margin-top:8px">Combined PE ${teamPE(items)} · ${cov.length} of 18 boss types covered.</div></div>`;
  $("#scrim").classList.add("on");
  $("#x").onclick = closeModal;
}
function flashNote(sel, msg){
  const host = document.querySelector(sel); if (!host) return;
  const d = document.createElement("div");
  d.className = "note warn"; d.textContent = msg; d.style.margin = "10px 0";
  host.prepend(d); setTimeout(() => d.remove(), 2600);
}

/* ================= TAG MODAL ================= */
function openTag(id){
  const x = ROSTER.find(z => z.id === id) || ROSTER[0];
  /* F2 bosses in the V2 pool this tag hits for 2x or 4x */
  const prey = BOSSES.filter(b => b.vn && offMult(x.types, b.types) >= 2)
                     .sort((a,b) => offMult(x.types,b.types) - offMult(x.types,a.types) || (b.pe||0)-(a.pe||0)).slice(0,6);
  /* F3 pool tags that cover this tag's weak spots */
  const coverors = POOL.filter(p => OWNED[p.name] ? false : p.beats.some(bt => x.weak.includes(bt)))
                       .sort((a,b) => b.pe - a.pe).slice(0,4);
  /* F4 fragility + quad warnings */
  const quads = TYPES.filter(bt => { let m = 1; for (const d of x.types) m *= (CHART[bt]?.[d] ?? 1); return m >= 4; });
  const partners = ROSTER.filter(o => o.name !== x.name && o.types.some(z => !x.types.includes(z))).slice(0,3);
  $("#modal").innerHTML = `
    <button class="close" id="x">×</button>
    <div class="mherow">
      <div class="mart" style="background:radial-gradient(circle at 50% 20%,${(TYPE_COLOR[x.types[0]]||"#7aa2ff")}33,transparent 70%),rgba(255,255,255,.05)">
              ${x.img ? `<img src="${x.img}" alt="${esc(x.name)}">` : ""}
            </div>
            ${x.sprite ? `<div class="mart spriteart"><img class="s2d ${x.animated?"":"still"}" src="${x.sprite}" alt="${esc(x.name)}"></div>` : ""}
            <div class="minfo">
        <div class="role">${esc(x.tier || "Tag")} · Grade ${esc(x.grade||"?")}</div>
        <h2 class="hname">${esc(x.name)}</h2>
        <div class="ptypes">${x.types.map(pill).join("")}</div>
        <div class="kv">
          <div><span>Poké Energy</span><b>${x.pe}</b></div>
          <div><span>Tag ID</span><b>${esc(x.id)}</b></div>
          <div><span>Grade</span><b>${stars(x.grade) || "-"}</b></div>
          <div><span>Ability</span><b>${esc(x.ability || "not listed")}</b></div>
          <div><span>PE density</span><b>${(x.pe/Math.max(2,x.beats.length)).toFixed(0)}</b></div>
          <div><span>Weak types</span><b>${x.weak.length}</b></div>
        </div>
      </div>
    </div>
    ${x.pdx ? `<div class="sect pokedex"><h3>Pokédex · #${x.pdx.dex}</h3>
      <div class="pdxf">${(x.pdx.height_m!=null?`<span class="pdxc">↕ ${x.pdx.height_m} m</span>`:"")}${(x.pdx.weight_kg!=null?`<span class="pdxc">⚖ ${x.pdx.weight_kg} kg</span>`:"")}${x.pdx.genus?`<span class="pdxc">${esc(x.pdx.genus)}</span>`:""}</div>
      ${x.pdx.flavor?`<p class="pdxt">${esc(x.pdx.flavor)}</p>`:""}
      ${(x.pdx.abilities||[]).length?`<div class="ptypes" style="margin-top:6px">${x.pdx.abilities.map(a=>`<span class="tin">${esc(a)}</span>`).join("")}</div>`:""}
    </div>` : ""}
    ${x.moves ? `<div class="sect"><h3>Moves</h3><div class="hint">${esc(x.moves)}</div></div>` : ""}
    <div class="sect"><h3>Hits bosses for double damage</h3>
      <div class="tagsin">${x.beats.length ? x.beats.map(z => `<span class="tin" style="background:${TYPE_COLOR[z]}">${z} 2x</span>`).join("") : `<span class="hint">No super effective coverage.</span>`}</div>
    </div>
    ${prey.length ? `<div class="sect"><h3>Bosses it punishes (V2 machines)</h3>
      ${prey.map(b => `<div class="route"><img src="${b.img}" alt=""><div><div class="rn">${esc(b.name)}</div><div class="rs">${esc(b.types.join(" / "))}</div></div>
        <div class="badge" style="background:${offMult(x.types,b.types)>=4?GRAD[6]:GRAD[5]}">${offMult(x.types,b.types)}x</div></div>`).join("")}</div>` : ""}
    <div class="sect"><h3>Careful: takes double damage from</h3>
      <div class="tagsin">${x.weak.length ? x.weak.map(z => `<span class="tin" style="background:${TYPE_COLOR[z]}">${z}</span>`).join("") : `<span class="hint">Nothing hits it for 2x.</span>`}</div>
    </div>
    ${quads.length ? `<div class="note bad">Quad danger: ${quads.join(", ")} hit this tag for 4x. Never field it into those bosses.</div>` : ""}
    ${x.resist.length ? `<div class="sect"><h3>Resists</h3><div class="tagsin">${x.resist.map(z => `<span class="tin" style="background:${TYPE_COLOR[z]}">${z}</span>`).join("")}</div></div>` : ""}
    ${x.weak.length >= 5 ? `<div class="note warn">Fragile: ${x.weak.length} types hit it for double. Field it only when the boss cannot punish it.</div>` : ""}
    ${x.weak.length <= 1 ? `<div class="note good">Very safe tag${x.weak.length ? ", only "+x.weak[0]+" threatens it" : ""}. A good opener.</div>` : ""}
    ${coverors.length ? `<div class="sect"><h3>Hunt these to cover its weak spots</h3>
      ${coverors.map(p => `<div class="route"><img src="${p.img}" alt=""><div><div class="rn">${esc(p.name)}</div><div class="rs">PE ${p.pe} · ${esc(p.types.join(" / "))} · covers ${p.beats.filter(bt => x.weak.includes(bt)).join(", ")}</div></div>
        <button class="mini heart ${WISH.includes(p.id)?"on":""}" data-w="${esc(p.id)}">${WISH.includes(p.id)?"♥":"♡"}</button></div>`).join("")}</div>` : ""}
    <div class="sect"><h3>Pairs well with</h3>
      ${partners.map(p => `<div class="route"><img src="${p.img}" alt=""><div><div class="rn">${esc(p.name)}</div><div class="rs">PE ${p.pe} · ${esc(p.types.join(" / "))}</div></div></div>`).join("")}
    </div>`;
  $("#scrim").classList.add("on");
  $("#x").onclick = closeModal;
  $("#modal").querySelectorAll("[data-w]").forEach(b => b.onclick = () => toggleWish(b.dataset.w, b));
}
function closeModal(){ $("#scrim").classList.remove("on"); }
$("#scrim")?.addEventListener?.("click", e => { if (e.target.id === "scrim") closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

/* ================= BOSS COUNTER ================= */
function bossList(){ return ALLSETS ? BOSSES : BOSSES.filter(b => b.vn); }
function lev(a, b){
  const m = a.length, n = b.length;
  if (Math.abs(m - n) > 3) return 99;
  let prev = Array.from({length:n+1}, (_,i) => i), cur = new Array(n+1);
  for (let i = 1; i <= m; i++){
    cur[0] = i;
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j-1] + 1, prev[j-1] + (a[i-1] === b[j-1] ? 0 : 1));
    [prev, cur] = [cur, prev];
  }
  return prev[n];
}
function resolveBoss(q){
  const s = (q||"").trim().toLowerCase(); if (!s) return null;
  const L = BOSSES;   /* typo tolerance across every set, results stay VN aware */
  return L.find(b => b.name.toLowerCase() === s)
      || L.find(b => b.name.toLowerCase().startsWith(s))
      || L.find(b => b.name.toLowerCase().includes(s))
      || L.filter(b => lev(s, b.name.toLowerCase()) <= (s.length > 5 ? 2 : 1))
          .sort((x,y) => lev(s, x.name.toLowerCase()) - lev(s, y.name.toLowerCase()))[0]
      || null;
}
/* F43 safer picks mode reorders: mult, then how hard the boss hits back, then PE */
function counterFor(boss){
  const rows = ROSTER.map(x => {
    const o = offMult(x.types, boss.types), inc = incomingMult(boss.types, x.types);
    let why = [];
    x.types.forEach(at => { let m = 1; boss.types.forEach(bt => m *= (CHART[at]?.[bt] ?? 1)); if (m >= 2) why.push(`${at} ${m}x`); });
    return { t:x, o, inc, why };
  }).sort((a,b) => state.safe
      ? (b.o - a.o) || (a.inc - b.inc) || (b.t.weak.length - a.t.weak.length ? a.t.weak.length - b.t.weak.length : b.t.pe - a.t.pe)
      : (b.o - a.o) || (a.inc - b.inc) || (b.t.pe - a.t.pe));
  const top = rows[0];
  const seen = new Set(), seenAvoid = new Set();
  const alts = rows.filter(r => r.o === top.o && r.t.name !== top.t.name)
                   .filter(r => !seen.has(r.t.name) && seen.add(r.t.name)).slice(0, 3);
  const avoid = ROSTER.filter(x => incomingMult(boss.types, x.types) >= 2 && x.name !== top.t.name)
                      .sort((a,b) => b.pe - a.pe)
                      .filter(x => !seenAvoid.has(x.name) && seenAvoid.add(x.name)).slice(0,4);
  return { top, alts, avoid, rows };
}
function routeRow(x, mult, sub){
  return `<div class="route"><img src="${x.img}" alt="">
    <div><div class="rn">${esc(x.name)}</div><div class="rs">${sub}</div></div>
    <div class="badge" style="background:${mult>=4?GRAD[6]:GRAD[5]}">${mult ? mult+"x" : "PE"}</div></div>`;
}
/* F9 turn by turn battle plan */
function battlePlan(b, r){
  const safeLead = r.rows.slice().sort((a,c) => (a.inc - c.inc) || (c.o - a.o))[0];
  const steps = [
    `Turn 1: field ${safeLead.t.name} and clear the two sidekicks. Button mash hard, it charges your attack gauge.`,
    `Turn 2: drag the boss out. Slide ${r.top.t.name} in${r.top.o >= 2 ? " (" + r.top.why.join(", ") + ")" : ""}.`,
    `Roulette: tap on the high number zone, mid rotation. Expect 1.5x to 2x swings.`,
    `Get Time comes after the boss drops. Extra 100 VND tier coin only if the tag on offer is worth it.`,
    r.top.t.tier && /Dynamax| Mega|Z Move/i.test(r.top.t.tier) ? `Trigger window: fire ${r.top.t.tier} when the boss is below half, not at full HP.` : `Keep your one big trigger for the second boss of the session.`
  ];
  return `<div class="plan">${steps.map((s,i) => `<div class="step"><span class="stepn">${i+1}</span><div>${s}</div></div>`).join("")}</div>`;
}
function renderBossResult(){
  const el = $("#bossResult");
  if (!state.boss){ el.innerHTML = `<div class="glass hero"><div class="hint">${t("sbq")}</div></div>`; return; }
  const b = state.boss, r = counterFor(b), x = r.top.t;
  const good = r.top.o >= 2;
  const inCompare = COMPARE.includes(b.name);
  el.innerHTML = `
    <div class="glass hero" id="bossHero">
      <div class="pickrow">
        <div class="pickart" style="background:radial-gradient(circle at 50% 25%,${(TYPE_COLOR[x.types[0]]||"#7aa2ff")}44,transparent 72%),rgba(255,255,255,.06)">
          ${x.img ? `<img src="${x.img}" alt="${esc(x.name)}">` : ""}
          <div class="mult">${good ? (r.top.o>=4?"4x":"2x") : "PE"}</div>
          <span class="lbl">${t("pick")}</span>
        </div>
        <div style="flex:1;min-width:210px">
          <div class="role">Boss: ${esc(b.name)} · ${esc(b.types.join(" / "))}${b.version ? " · "+esc(b.version)+(b.vn?" (VN machine)":"") : ""}</div>
          <h2 class="picktitle">${esc(x.name)}</h2>
          <div class="ptypes">${x.types.map(pill).join("")}</div>
          <div class="hint">${good
            ? `${esc(x.name)} hits ${esc(b.name)} for ${r.top.o}x${r.top.why.length ? " (" + r.top.why.join(", ") + ")" : ""}. PE ${x.pe}.`
            : `Nobody in the binder hits this boss for double. ${esc(x.name)} is your highest PE play at ${x.pe}.`}</div>
          ${r.top.inc >= 2 ? `<div class="note warn">Careful: this boss hits ${esc(x.name)} for double damage too.</div>` : ""}
          <div class="actrow">
            <button class="btn act" id="logW">✔ ${t("logw")}</button>
            <button class="btn" id="logL">✖ ${t("logl")}</button>
            <button class="btn" id="sayBtn">🔊</button>
            <button class="btn" id="shareBtn">📤</button>
            <button class="btn ${inCompare?"act":""}" id="cmpBoss">⚖ ${t("compare")}${COMPARE.length?" ("+COMPARE.length+")":""}</button>
          </div>
        </div>
        ${b.img ? `<div class="pickart bossart" style="background:radial-gradient(circle at 50% 80%,${(TYPE_COLOR[b.types[0]]||"#7aa2ff")}33,transparent 72%),rgba(255,255,255,.04)">
          <img src="${b.img}" alt="${esc(b.name)}"><span class="lbl">Boss</span></div>` : ""}
      </div>
      ${!b.vn ? `<div class="note warn"><b>Heads up:</b> ${esc(b.name)} is from ${esc(b.version || "another set")}. Vietnam machines only run Stardust Version 2 right now. The counters below still show what would work.</div>` : ""}
      ${r.alts.length ? `<div class="sect alts-keep"><h3>${t("alts")}</h3>${r.alts.map(a => routeRow(a.t, a.o, `PE ${a.t.pe} · ${a.why.join(", ") || a.t.types.join(" / ")}`)).join("")}</div>` : ""}
      ${r.avoid.length ? `<div class="note bad"><b>${t("avoid")}:</b> ${r.avoid.map(z => esc(z.name)).join(", ")} (this boss hits them for double damage).</div>` : ""}
      <div class="sect plan-keep"><h3>${t("plan")}</h3>${battlePlan(b, r)}</div>
      <details class="gdetails"><summary>F${""}ull counter matrix</summary>
        <div class="mwrap"><table class="mtable stickyhead"><thead><tr><th>#</th><th>Tag</th><th>Deals</th><th>Takes</th><th>PE</th></tr></thead>
        <tbody>${r.rows.map((row,i) => `<tr class="${row.t.id===x.id?"hi":""}"><td>${i+1}</td><td>${esc(row.t.name)}</td>
          <td><span class="mb ${row.o>=4?"g4":row.o>=2?"g2":""}">${row.o}x</span></td>
          <td><span class="mb ${row.inc>=2?"bad":""}">${row.inc}x</span></td><td>${row.t.pe}</td></tr>`).join("")}</tbody></table></div>
      </details>
    </div>`;
  $("#logW").onclick = () => logBattle(b, x, true);
  $("#logL").onclick = () => logBattle(b, x, false);
  $("#sayBtn").onclick = () => speak(`Dùng ${x.name}. ${good ? x.name+" đánh "+b.name+" nhân "+r.top.o : "Không có lợi thế, đánh bằng "+x.name}`);
  $("#shareBtn").onclick = () => shareText(`Boss ${b.name} (${b.types.join("/")}) → dùng ${x.name} ${good ? r.top.o+"x" : "(PE pick)"} · PE ${x.pe} · Mezastar Binder`);
  $("#cmpBoss").onclick = () => { toggleCompareBoss(b.name); };
}
/* F7 field trio */
function renderTrioSuggestion(){
  const el = $("#trioBox"); if (!el || !state.boss) { if (el) el.innerHTML = ""; return; }
  const r = counterFor(state.boss);
  const tank = r.rows.slice().sort((a,c) => (a.inc - c.inc) || (c.o - a.o))[0];
  const alt = r.alts[0] || r.rows[1];
  const trio = [r.top.t, alt ? alt.t : null, tank.t].filter(Boolean)
                .filter((v,i,arr) => arr.findIndex(z => z.name === v.name) === i);
  el.innerHTML = `<div class="glass hero"><div class="role" style="margin-bottom:10px">Field trio for ${esc(state.boss.name)}</div>
    <div class="setrow">${trio.map((m,i) => `<div class="setcard glass"><img src="${m.img}" alt="">
      <div><div class="role">${i===0?"Main":i===1?"Backup":"Tank"}</div><div class="rn">${esc(m.name)}</div>
      <div class="rs hint">PE ${m.pe} · ${esc(m.types.join(" / "))}</div></div></div>`).join("")}</div>
    <div class="hint" style="margin-top:8px">Main deals the damage, backup covers a bad matchup, tank ${esc(tank.t.name)} only takes ${tank.inc}x from this boss.</div></div>`;
}
/* F27 battle log + F28 streak */
function logBattle(b, x, win){
  LOG.push({ boss:b.name, pick:x.name, win, ts:Date.now(), mult:offMult(x.types, b.types) });
  if (LOG.length > 200) LOG = LOG.slice(-200);
  LS.set("log", LOG);
  flashNote("#bossResult", win ? "Logged a win ✔" : "Logged a loss ✖");
  renderStats();
}
function streaks(){
  let cur = 0, best = 0, run = 0;
  for (const e of LOG){ run = e.win ? run + 1 : 0; best = Math.max(best, run); }
  for (let i = LOG.length - 1; i >= 0 && LOG[i].win; i--) cur++;
  return { cur, best };
}
/* F12 share + F13 speak */
function shareText(txt){
  if (navigator.share) navigator.share({ text: txt }).catch(() => {});
  else if (navigator.clipboard) navigator.clipboard.writeText(txt).then(() => flashNote("#bossResult", "Copied to clipboard")).catch(() => {});
}
function speak(txt){
  try {
    const u = new SpeechSynthesisUtterance(txt);
    u.lang = SETTINGS.ve === "vi" ? "vi-VN" : "en-US";
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  } catch(e){}
}
/* F8 compare bosses */
function toggleCompareBoss(name){
  const i = COMPARE.indexOf(name);
  if (i >= 0) COMPARE.splice(i, 1);
  else { if (COMPARE.length >= 3) COMPARE.shift(); COMPARE.push(name); }
  renderBossResult(); renderCompareBox();
}
function renderCompareBox(){
  const el = $("#compareBox"); if (!el) return;
  if (!COMPARE.length){ el.innerHTML = ""; return; }
  const bs = COMPARE.map(n => BOSSES.find(b => b.name === n)).filter(Boolean);
  const picks = bs.map(b => counterFor(b).top);
  const safeForAll = ROSTER.filter(x => bs.every(b => offMult(x.types, b.types) >= 2))
                           .sort((a,b) => b.pe - a.pe).slice(0,3);
  el.innerHTML = `<div class="glass hero">
    <div class="role" style="margin-bottom:10px">Boss compare${COMPARE.length>1?"":" · add another with ⚖"}</div>
    <div class="mwrap"><table class="mtable"><thead><tr><th>Boss</th><th>Best pick</th><th>Deals</th></tr></thead><tbody>
      ${bs.map((b,i) => `<tr><td>${esc(b.name)}<br><span class="rs">${esc(b.types.join("/"))}</span></td>
        <td>${esc(picks[i].t.name)}</td><td><span class="mb ${picks[i].o>=4?"g4":picks[i].o>=2?"g2":""}">${picks[i].o}x</span></td></tr>`).join("")}
    </tbody></table></div>
    ${COMPARE.length > 1 && safeForAll.length ? `<div class="sect"><h3>Safe field for all of them</h3>
      ${safeForAll.map(x => routeRow(x, Math.min(...bs.map(b => offMult(x.types, b.types))), `PE ${x.pe} · 2x into every boss above`)).join("")}</div>` : ""}
  </div>`;
}
/* F10 random drill */
function randomDrill(){
  const vn = BOSSES.filter(b => b.vn);
  const b = vn[Math.floor(Math.random() * vn.length)];
  selectBoss(b.name, true);
  $("#bq").value = b.name;
  const hero = $("#bossHero");
  if (hero){ hero.classList.remove("drill"); void hero.offsetWidth; hero.classList.add("drill"); }
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
  renderBossResult(); renderTrioSuggestion(); renderCompareBox(); renderBossGrid();
  if (BATTLE && state.boss) requestAnimationFrame(() => $("#bossResult").scrollIntoView({behavior:"smooth", block:"start"}));
  const el = $("#bossResult");
  if (el) el.scrollIntoView({behavior:"smooth", block:"nearest"});
}

/* ================= TEAM LAB ================= */
function byName(n){ return ROSTER.find(x => x.name === n) || ROSTER[0]; }
function teamMembers(){ return TEAM.map(i => i === null ? null : ROSTER.find(x => x.id === i)).filter(Boolean); }
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
      ${trio.map(([n,role,why]) => { const x = byName(n); return `
        <div class="setcard glass">
          <img src="${x.img}" alt="">
          <div style="flex:1;min-width:170px">
            <div class="role">${role}</div>
            <div class="rn" style="font-family:'Chakra Petch';font-size:18px">${esc(x.name)} <span style="color:var(--gold)">PE ${x.pe}</span></div>
            <div class="rs hint">${why}</div>
            <div class="pills">${x.types.map(pill).join("")}</div>
          </div>
        </div>`; }).join("")}
      <div class="note good">Total 418 PE · covers 10 of 18 boss types · your Kyurem + Snorlax pair alone only covers 4, so the third slot is the whole coverage lever.</div>
    </div>
    <div class="glass hero" id="teamLab">
      <div class="role" style="margin-bottom:10px">Team Lab · build your own</div>
      <div class="setrow" id="labSlots"></div>
      <div class="actrow" style="margin-top:10px">
        <button class="btn act" id="autoBuild">⚡ Auto build</button>
        <button class="btn" id="clearTeam">✕ Clear</button>
        <button class="btn" id="saveTeam">💾 Save team</button>
      </div>
      <div id="labStats"></div>
    </div>
    <div class="glass hero" id="savedTeamsBox"></div>
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
      ${bag.map(n => { const x = byName(n); return `
        <div class="route"><img src="${x.img}" alt="">
          <div><div class="rn">${esc(x.name)}</div><div class="rs">PE ${x.pe} · ${esc(x.types.join(" / "))}${x.beats.length?" · 2x into "+esc(x.beats.join(", ")):""}</div></div></div>`; }).join("")}
      <div class="note good">Trigger budget: Dynamax on Snorlax, Mega on Lucario, Z-Move once (Torterra or Empoleon).</div>
      <div class="note warn">Kyurem is weak to 7 types. If the boss is Dragon, Fighting, Fairy, Fire, Ice, Rock or Steel, keep it for last or leave it out.</div>
    </div>`;
  $("#autoBuild").onclick = autoBuild;
  $("#clearTeam").onclick = () => { TEAM = [null,null,null]; LS.set("team", TEAM); renderTeamLab(); };
  $("#saveTeam").onclick = saveTeam;
  renderTeamLab();
}
function renderTeamLab(){
  const host = $("#labSlots"); if (!host) return;
  host.innerHTML = TEAM.map((id, i) => {
    const m = id === null ? null : ROSTER.find(x => x.id === id);
    return `<div class="setcard glass slot" data-i="${i}">
      ${m ? `<img src="${m.img}" alt=""><div style="flex:1;min-width:120px">
        <div class="rn">${esc(m.name)} <span style="color:var(--gold)">PE ${m.pe}</span></div>
        <div class="pills">${m.types.map(pill).join("")}</div></div>
        <button class="mini" data-r="${i}">✕</button>`
       : `<div style="flex:1;padding:10px 4px"><div class="rn" style="color:var(--dim)">Empty slot ${i+1}</div><div class="rs hint">Tap to pick a tag</div></div>`}
    </div>`;
  }).join("");
  host.querySelectorAll(".slot").forEach(s => s.onclick = e => {
    if (e.target.dataset.r !== undefined) { TEAM[+e.target.dataset.r] = null; LS.set("team", TEAM); renderTeamLab(); return; }
    PICK_SLOT = +s.dataset.i; openPicker();
  });
  renderLabStats(); renderSavedTeams();
}
function openPicker(){
  $("#modal").innerHTML = `
    <button class="close" id="x">×</button>
    <div class="sect"><h3>Pick a tag for slot ${PICK_SLOT + 1}</h3></div>
    <div class="pickgrid">${ROSTER.map(x => `<button class="pickcard" data-id="${esc(x.id)}">
      <img src="${x.img}" alt=""><div class="rn" style="font-size:12px">${esc(x.name)}</div><div class="rs">PE ${x.pe}</div></button>`).join("")}</div>`;
  $("#scrim").classList.add("on");
  $("#x").onclick = closeModal;
  $("#modal").querySelectorAll(".pickcard").forEach(c => c.onclick = () => {
    TEAM[PICK_SLOT] = c.dataset.id; LS.set("team", TEAM); closeModal(); renderTeamLab(); });
}
/* F26 coverage meter + F25 danger report */
function renderLabStats(){
  const el = $("#labStats"); if (!el) return;
  const members = teamMembers();
  if (!members.length){ el.innerHTML = `<div class="hint" style="margin-top:10px">Pick three tags, or hit Auto build.</div>`; return; }
  const cov = coveredTypes(members);
  const danger = TYPES.filter(bt => members.filter(m => incomingMult([bt], m.types) >= 2).length >= 2);
  const score = cov.length * 120 + teamPE(members) - danger.length * 90;
  el.innerHTML = `
    <div class="covmeter"><div class="covbar" style="width:${Math.round(cov.length/18*100)}%"></div></div>
    <div class="hint" style="margin:8px 0 4px">PE ${teamPE(members)} · covers <b>${cov.length} of 18</b> boss types · team score ${score}</div>
    <div class="tagsin">${cov.map(z => `<span class="tin" style="background:${TYPE_COLOR[z]}">${z}</span>`).join("") || `<span class="hint">No 2x coverage yet.</span>`}</div>
    ${danger.length ? `<div class="note bad" style="margin-top:8px">Shared weakness: ${danger.join(", ")} hit at least two members for double. A boss of that type eats this team.</div>`
                    : `<div class="note good" style="margin-top:8px">No shared double weakness. Solid against blind bosses.</div>`}`;
}
/* F23 auto build */
function autoBuild(){
  let best = null;
  for (let a = 0; a < ROSTER.length; a++) for (let b = a+1; b < ROSTER.length; b++) for (let c = b+1; c < ROSTER.length; c++){
    const trio = [ROSTER[a], ROSTER[b], ROSTER[c]];
    const cov = coveredTypes(trio).length;
    const danger = TYPES.filter(bt => trio.filter(m => incomingMult([bt], m.types) >= 2).length >= 2).length;
    const s = cov * 120 + teamPE(trio) - danger * 90;
    if (!best || s > best.s) best = { s, trio };
  }
  if (best){ TEAM = best.trio.map(m => m.id); LS.set("team", TEAM); renderTeamLab(); }
}
/* F24 save teams */
function saveTeam(){
  const members = teamMembers();
  if (members.length < 2){ flashNote("#teamLab", "Pick at least two tags first."); return; }
  SAVED_TEAMS.unshift({ name: members.map(m => m.name).join(" + "), ids: TEAM.slice(), ts: Date.now() });
  SAVED_TEAMS = SAVED_TEAMS.slice(0, 8);
  LS.set("teams", SAVED_TEAMS);
  renderSavedTeams();
}
function renderSavedTeams(){
  const el = $("#savedTeamsBox"); if (!el) return;
  if (!SAVED_TEAMS.length){ el.innerHTML = ""; return; }
  el.innerHTML = `<div class="role" style="margin-bottom:10px">Saved teams</div>` +
    SAVED_TEAMS.map((s,i) => `<div class="route">
      <div style="flex:1"><div class="rn">${esc(s.name)}</div><div class="rs">${fmtDate(s.ts)} · PE ${teamPE(s.ids.map(id => ROSTER.find(x => x.id === id)).filter(Boolean))} · ${coveredTypes(s.ids.map(id => ROSTER.find(x => x.id === id)).filter(Boolean)).length}/18</div></div>
      <button class="btn" data-load="${i}">Load</button><button class="mini" data-del="${i}">✕</button></div>`).join("");
  el.querySelectorAll("[data-load]").forEach(b => b.onclick = () => { TEAM = SAVED_TEAMS[+b.dataset.load].ids.slice(); LS.set("team", TEAM); renderTeamLab(); });
  el.querySelectorAll("[data-del]").forEach(b => b.onclick = () => { SAVED_TEAMS.splice(+b.dataset.del, 1); LS.set("teams", SAVED_TEAMS); renderSavedTeams(); });
}

/* ================= HUNT LIST ================= */
function toggleWish(id, btn){
  const i = WISH.indexOf(id);
  if (i >= 0) WISH.splice(i, 1); else WISH.push(id);
  LS.set("wish", WISH);
  if (btn){ btn.textContent = WISH.includes(id) ? "♥" : "♡"; btn.classList.toggle("on", WISH.includes(id)); }
  if (state.tab === "hunt") renderPoolGrid();
}
function poolFiltered(){
  const q = pstate.q.trim().toLowerCase();
  let list = POOL.filter(p => {
    if (pstate.type && !p.types.includes(pstate.type)) return false;
    if (!q) return true;
    return (p.name + " " + p.id + " " + p.types.join(" ")).toLowerCase().includes(q);
  });
  if (pstate.mode === "missing") list = list.filter(p => !OWNED[p.name]);
  else if (pstate.mode === "dupes") list = list.filter(p => OWNED[p.name] > 1);
  else if (pstate.mode === "wish") list = list.filter(p => WISH.includes(p.id));
  return list;
}
function renderPoolChips(){
  const present = [...new Set(POOL.flatMap(p => p.types))].sort();
  $("#poolTypeChips").innerHTML = `<span class="chip ${!pstate.type?"on":""}" data-t="">All</span>` +
    present.map(tp => `<span class="chip ${pstate.type===tp?"on":""}" data-t="${tp}" style="${pstate.type===tp?`background:${TYPE_COLOR[tp]}`:""}">${tp}</span>`).join("");
  $("#poolTypeChips").querySelectorAll(".chip").forEach(c => c.onclick = () => { pstate.type = c.dataset.t || null; renderPoolChips(); renderPoolGrid(); });
}
function renderPoolGrid(){
  const list = poolFiltered();
  $("#huntCount").textContent = `${list.length} tag${list.length===1?"":"s"}`;
  if (!list.length){ $("#pgrid").innerHTML = `<div class="empty">Nothing here. ${pstate.mode==="missing"?"You own the whole filter.":""}</div>`; return; }
  $("#pgrid").innerHTML = list.map((p,i) => {
    const own = OWNED[p.name] || 0;
    return `<article class="card pool ${own?"owned":""}" style="--glow:${(TYPE_COLOR[p.types[0]]||"#7aa2ff")}44">
      <div class="halo"></div>
      <div class="pe">PE ${p.pe}</div>
      <div class="stars">${stars(p.grade)}</div>
      ${p.img ? `<img src="${p.img}" alt="${esc(p.name)}" loading="${i<8?"eager":"lazy"}">` : ""}
      <button class="mini heart ${WISH.includes(p.id)?"on":""}" data-w="${esc(p.id)}">${WISH.includes(p.id)?"♥":"♡"}</button>
      ${own ? `<span class="ownbadge">✔ ${own} ${t("owned")}</span>` : `<span class="ownbadge no">not owned</span>`}
      <div class="cname">${esc(p.name)}</div>
      <div class="cid">${esc(p.id)}${p.tier?" · "+esc(p.tier):""}</div>
      <div class="pills">${p.types.map(pill).join("")}</div>
    </article>`; }).join("");
  $("#pgrid").querySelectorAll("[data-w]").forEach(b => b.onclick = ev => { ev.stopPropagation(); toggleWish(b.dataset.w, b); });
}
/* F14 completion + F18 gap advisor + F19 ladder + F22 PE per type */
function renderHuntSummary(){
  const total = POOL.length, owned = POOL.filter(p => OWNED[p.name]).length;
  const pct = Math.round(owned / total * 100);
  const covOwned = new Set(ROSTER.flatMap(x => x.types));
  const gaps = TYPES.filter(tp => !covOwned.has(tp));
  const fixers = {};
  gaps.forEach(tp => { fixers[tp] = POOL.filter(p => !OWNED[p.name] && p.types.includes(tp)).sort((a,b) => b.pe - a.pe).slice(0,2); });
  $("#huntSummary").innerHTML = `
    <div class="glass hero">
      <div class="role">Stardust V2 completion</div>
      <div class="covmeter"><div class="covbar" style="width:${pct}%"></div></div>
      <div class="hint"><b>${owned} of ${total}</b> unique tags owned · ${pct}% · ${ROSTER.length - owned > 0 ? ROSTER.length - owned + " extra copies" : "no spares"}</div>
      ${gaps.length ? `<div class="sect"><h3>Type gaps in your binder</h3>
        ${gaps.map(tp => `<div class="route"><div style="flex:1"><div class="rn">${tp} <span class="rs">· nothing you own hits it 2x</span></div>
          <div class="rs">${(fixers[tp]||[]).map(f => `${esc(f.name)} PE ${f.pe}`).join(" · ") || "no V2 tag covers this type"}</div></div>
          ${(fixers[tp]||[])[0] ? `<button class="mini heart ${WISH.includes(fixers[tp][0].id)?"on":""}" data-w="${esc(fixers[tp][0].id)}">${WISH.includes(fixers[tp][0].id)?"♥":"♡"}</button>` : ""}</div>`).join("")}
        <div class="note warn" style="margin-top:6px">Bug has no tag in Stardust V2 at all. Poison only Mareanie PE54. Those two gaps are machine facts, not bad luck.</div></div>` : ""}
      <div class="sect"><h3>PE ladder · top of the set</h3>
        ${POOL.slice(0,6).map((p,i) => `<div class="route"><img src="${p.img}" alt=""><div><div class="rn">${i+1}. ${esc(p.name)}${OWNED[p.name]?" <span style='color:var(--lime)'>✔</span>":""}</div><div class="rs">${esc(p.types.join(" / "))} · ${esc(p.tier||"")}</div></div><div class="badge" style="background:${GRAD[6]}">${p.pe}</div></div>`).join("")}
      </div>
    </div>`;
  $("#huntSummary").querySelectorAll("[data-w]").forEach(b => b.onclick = () => toggleWish(b.dataset.w, b));
}

/* ================= STATS & TOOLS ================= */
const TIPS = [
 "Kill the boss on turn 2, not turn 3. Rotating bosses fast is how you meet 6★ tags.",
 "The machine holds roughly one 6★ per 14 tags dropped. Budget about 14 gets per gold.",
 "Roulette is aimable: tap as the needle enters the high zone, not when it is on it.",
 "Get Time always catches one of the three. Extra coin only if the shown tag is worth it.",
 "Master Ball roulette appears most when the whole field is 5★ or 6★. Hunt in good lobbies.",
 "One Dynamax, one Mega, one Z Move per session. Carrying two Z Move tags wastes a slot.",
 "Snorlax only fears Fighting. It is your safest lead into an unknown boss.",
 "Kyurem is your cannon but drops to 7 types. Keep it for the turn the boss is already weak.",
 "Duplicate tags are trade stock. Keep the higher PE copy visible when trading.",
 "Turn the money you were going to spend on a risky get into one more boss rotation instead."
];
function renderStats(){
  const host = $("#statsBox"); if (!host) return;
  const wins = LOG.filter(e => e.win).length;
  const st = streaks();
  const byType = {};
  ROSTER.forEach(x => x.types.forEach(tp => { byType[tp] = byType[tp] || []; byType[tp].push(x); }));
  const typeRows = TYPES.map(tp => (byType[tp]||[])).map((arr,tp) => ({ tp, n: arr.length, pe: arr.reduce((s,x) => s+x.pe, 0) })).filter(r => r.n);
  const grades = [6,5,4,3,2].map(g => ({ g, n: ROSTER.filter(x => +x.grade === g).length })).filter(r => r.n);
  const trig = { "Dynamax": [], "Mega": [], "Z Move": [] };
  ROSTER.forEach(x => { const s = (x.tier||"") + " " + (x.ability||""); if (/dynamax/i.test(s)) trig["Dynamax"].push(x); if (/mega/i.test(s)) trig["Mega"].push(x); if (/z.?move/i.test(s)) trig["Z Move"].push(x); });
  const owned = POOL.filter(p => OWNED[p.name]).length;
  const ach = [
    ["First blood", LOG.length >= 1], ["Ten battles logged", LOG.length >= 10],
    ["Win streak 3", st.best >= 3], ["Half the set", owned >= POOL.length/2],
    ["Full type floor", new Set(ROSTER.flatMap(x => x.types)).size >= 12],
    ["6★ owner", ROSTER.some(x => +x.grade === 6)],
    ["Wishlist curator", WISH.length >= 3], ["Team architect", SAVED_TEAMS.length >= 1]
  ];
  const tip = TIPS[Math.floor(Date.now() / 86400000) % TIPS.length];
  $("#tipLine").innerHTML = `<b>${t("tips")}:</b> ${tip}`;
  host.innerHTML = `
    <div class="glass hero"><div class="role">${t("stats")}</div>
      <div class="statgrid">
        <div class="stat"><b>${ROSTER.length}</b><span>tags owned</span></div>
        <div class="stat"><b>${ROSTER.reduce((s,x) => s+x.pe, 0)}</b><span>total PE</span></div>
        <div class="stat"><b>${Math.round(ROSTER.reduce((s,x) => s+x.pe, 0) / Math.max(1,ROSTER.length))}</b><span>avg PE</span></div>
        <div class="stat"><b>${owned}/${POOL.length}</b><span>V2 unique</span></div>
        <div class="stat"><b>${dupeNames().size}</b><span>dupe names</span></div>
        <div class="stat"><b>${st.cur}</b><span>${t("streak")}</span></div>
        <div class="stat"><b>${LOG.length ? Math.round(wins/LOG.length*100) : 0}%</b><span>${t("winrate")}</span></div>
        <div class="stat"><b>${LOG.length}</b><span>battles logged</span></div>
      </div>
      <div class="actrow" style="margin-top:10px">
        <button class="btn" id="veBtn">🌐 ${SETTINGS.ve === "en" ? "Tiếng Việt" : "English"}</button>
        <button class="btn ${SETTINGS.dim?"act":""}" id="dimBtn">🔋 Battery saver</button>
        <button class="btn" id="logClear">🧹 Clear log</button>
      </div>
    </div>
    <div class="glass hero"><div class="role">${t("coverage")}</div>
      <div class="covcheck">${TYPES.map(tp => { const hit = ROSTER.some(x => offMult(x.types,[tp]) >= 2);
        return `<span class="covcell ${hit?"ok":"no"}" style="${hit?`background:${TYPE_COLOR[tp]}`:""}">${tp}</span>`; }).join("")}</div>
      <div class="hint" style="margin-top:6px">${coveredTypes(ROSTER).length} of 18 boss types take 2x from something you own.</div>
    </div>
    <div class="glass hero"><div class="role">${t("grade")}</div>
      ${grades.map(g => `<div class="bargrp"><span class="bl">${g.g}★</span><div class="bar"><div style="width:${Math.round(g.n/ROSTER.length*100)}%;background:${GRAD[g.g]||GRAD[4]}"></div></div><span class="bv">${g.n}</span></div>`).join("")}
    </div>
    <div class="glass hero"><div class="role">PE by type</div>
      ${typeRows.sort((a,b) => b.pe - a.pe).map(r => `<div class="bargrp"><span class="bl">${r.tp}</span><div class="bar"><div style="width:${Math.round(r.pe/typeRows[0].pe*100)}%;background:${TYPE_COLOR[r.tp]}"></div></div><span class="bv">${r.pe}</span></div>`).join("")}
    </div>
    <div class="glass hero"><div class="role">${t("triggers")}</div>
      ${Object.entries(trig).map(([k,v]) => `<div class="route"><div style="flex:1"><div class="rn">${k}</div>
        <div class="rs">${v.length ? v.map(x => esc(x.name)).join(", ") : "none in the binder"}</div></div>
        <div class="badge" style="background:${v.length?GRAD[5]:"rgba(255,255,255,.1)"}">${v.length}</div></div>`).join("")}
      <div class="hint" style="margin-top:6px">One of each per session. Snorlax holds Dynamax, Lucario holds Mega, Torterra or Empoleon hold the Z Move.</div>
    </div>
    <div class="glass hero"><div class="role">${t("budget")}</div>
      <div class="kv">
        <div><span>VND per game</span><input id="creditCost" type="number" value="10000" step="1000"></div>
        <div><span>Budget (VND)</span><input id="budgetVnd" type="number" value="200000" step="50000"></div>
      </div>
      <div id="budgetOut" class="hint" style="margin-top:10px"></div>
    </div>
    <div class="glass hero"><div class="role">Session money tracker</div>
      <div class="actrow">
        <button class="btn act" id="sessStart">▶ Start session</button>
        <button class="btn" id="sessAdd">+1 game</button>
        <button class="btn" id="sessEnd">■ End</button>
      </div>
      <div id="sessOut" class="hint" style="margin-top:10px"></div>
    </div>
    <div class="glass hero"><div class="role">Roulette trainer</div>
      <div class="roul" id="roul"><div class="needle"></div></div>
      <div class="actrow"><button class="btn act" id="roulGo">▶ Spin</button><span class="hint" id="roulOut" style="align-self:center"></span></div>
    </div>
    <div class="glass hero"><div class="role">Golden turn planner</div>
      <div class="kv"><div><span>Boss HP left (%)</span><input id="ghp" type="number" value="50" min="5" max="100" step="5"></div>
        <div><span>Best mult seen</span><input id="gmul" type="number" value="2" min="1" max="4" step="0.5"></div></div>
      <div id="goldOut" class="hint" style="margin-top:10px"></div>
    </div>
    <div class="glass hero"><div class="role">Achievements</div>
      ${ach.map(([n,done]) => `<div class="achv ${done?"done":""}"><span>${done?"🏆":"🔒"}</span> ${n}</div>`).join("")}
    </div>
    <div class="glass hero"><div class="role">${t("guide")}</div>
      <details class="gdetails"><summary>How a 100 VND game flows</summary><div class="hint">Pick an area, fight 3 enemies. Slide a tag to attack, mash the button to charge, stop the roulette on a high number. Beat the boss, pay for Get Time at the ball roulette, one catch is guaranteed.</div></details>
      <details class="gdetails"><summary>Boss rotation for 6★</summary><div class="hint">Clear both sidekicks on turn 1, kill the boss on turn 2. The next boss spawns without another coin, so more bosses per credit means more 6★ sightings. Do not stretch a losing game for one extra turn.</div></details>
      <details class="gdetails"><summary>Ball tiers</summary><div class="hint">Normal Ball 2★ to 3★ gets · Great Ball 4★ · Ultra Ball 5★ · Master Ball 6★. The ball roulette rises with a stronger field: keep 5★ and 6★ tags on the field in Get Time.</div></details>
      <details class="gdetails"><summary>Real machine odds</summary><div class="hint">Inside the machine: 8 tag tubes of 50 with 3 to 5 six stars at the bottom of each, so roughly one 6★ per 14 tags dispensed. Expect dry spells of 10+ gets and do not chase with extra coins.</div></details>
      <details class="gdetails"><summary>Trigger discipline</summary><div class="hint">Dynamax, Mega and Z Move are once per session each. Fire a trigger only when the multiplier is already 2x or the boss is under half HP, otherwise you waste the ceiling.</div></details>
    </div>
    <div class="glass hero"><div class="role">Data</div>
      <div class="actrow">
        <button class="btn" id="expBtn">⬇ ${t("export")}</button>
        <button class="btn" id="impBtn">⬆ ${t("imp")}</button>
        <button class="btn danger" id="resetBtn">⚠ ${t("reset")}</button>
      </div>
      <textarea id="ioBox" class="iobox" placeholder="Export puts your backup here. Import pastes one back." spellcheck="false"></textarea>
    </div>
    <div class="glass hero"><div class="role">This build</div>
      <div class="hint">Mega update · <b>50 functions</b> added in one pass.<details class="gdetails" style="margin-top:8px"><summary>See all 50</summary>
      <ol class="featlist">${FEATURES.map(f => `<li>${f}</li>`).join("")}</ol></details></div>
      <div class="hint" style="margin-top:8px">Install to home screen for offline use: Safari Share → Add to Home Screen, or Chrome ⋮ → Install app.</div>
    </div>`;
  $("#veBtn").onclick = () => { SETTINGS.ve = SETTINGS.ve === "en" ? "vi" : "en"; LS.set("set", SETTINGS); applyLang(); renderStats(); };
  $("#dimBtn").onclick = () => { SETTINGS.dim = !SETTINGS.dim; LS.set("set", SETTINGS); document.body.classList.toggle("dim", SETTINGS.dim); renderStats(); };
  $("#logClear").onclick = () => { LOG = []; LS.set("log", LOG); renderStats(); };
  $("#creditCost").oninput = $("#budgetVnd").oninput = renderBudget;
  renderBudget(); renderSession(); renderRoulette(); renderGold();
  $("#sessStart").onclick = () => { SESSION = { start: Date.now(), games: 0 }; LS.set("session", SESSION); renderSession(); };
  $("#sessAdd").onclick = () => { if (!SESSION) SESSION = { start: Date.now(), games: 0 }; SESSION.games++; LS.set("session", SESSION); renderSession(); };
  $("#sessEnd").onclick = () => { if (SESSION){ LOG.push({ boss:"session", pick:"-", win:true, ts:Date.now(), note:`${SESSION.games} games` }); LS.set("log", LOG); } SESSION = null; LS.set("session", null); renderSession(); renderStats(); };
  $("#roulGo").onclick = spinRoulette;
  $("#ghp").oninput = $("#gmul").oninput = renderGold;
  $("#expBtn").onclick = () => { $("#ioBox").value = JSON.stringify({ wish:WISH, log:LOG, teams:SAVED_TEAMS, team:TEAM, set:SETTINGS, session:SESSION }); $("#ioBox").select(); };
  $("#impBtn").onclick = () => {
    try {
      const d = JSON.parse($("#ioBox").value);
      if (d.wish) { WISH = d.wish; LS.set("wish", WISH); }
      if (d.log) { LOG = d.log; LS.set("log", LOG); }
      if (d.teams) { SAVED_TEAMS = d.teams; LS.set("teams", SAVED_TEAMS); }
      if (d.team) { TEAM = d.team; LS.set("team", TEAM); }
      if (d.set) { SETTINGS = d.set; LS.set("set", SETTINGS); }
      renderStats(); renderTeamLab(); renderPoolGrid(); flashNote("#statsBox", "Imported ✔");
    } catch(e){ flashNote("#statsBox", "That is not a valid backup."); } };
  $("#resetBtn").onclick = () => {
    if (!confirm("Delete wishlist, log, teams and settings? This cannot be undone.")) return;
    ["wish","log","teams","team","set","session"].forEach(k => localStorage.removeItem("meza."+k));
    WISH = []; LOG = []; SAVED_TEAMS = []; TEAM = [null,null,null]; SESSION = null; SETTINGS = { ve:"en", dim:false };
    renderStats(); renderTeamLab(); renderPoolGrid();
  };
}
/* F30/F31 budget */
function renderBudget(){
  const out = $("#budgetOut"); if (!out) return;
  const cost = Math.max(1000, +$("#creditCost").value || 10000);
  const bud = Math.max(0, +$("#budgetVnd").value || 0);
  const games = Math.floor(bud / cost);
  const tags = Math.round(games * 0.75);            /* ~3 gets per 4 coins with Get Time */
  const six = (games / 14).toFixed(1);
  const perSix = Math.round(cost * 14 / 1000) * 1000;
  out.innerHTML = `Budget <b>${bud.toLocaleString()} VND</b> at <b>${cost.toLocaleString()}</b> per game → about <b>${games} games</b>, <b>~${tags} tags</b>.<br>
    Expected 6★ tags: <b>${six}</b> · long run cost per 6★ ≈ <b>${perSix.toLocaleString()} VND</b>.<br>
    <span style="color:var(--dim)">Walk away when the budget is gone. The tubes do not remember your streak.</span>`;
}
/* F32 session tracker */
function renderSession(){
  const out = $("#sessOut"); if (!out) return;
  if (!SESSION){ out.innerHTML = "No session running."; return; }
  const mins = Math.round((Date.now() - SESSION.start) / 60000);
  out.innerHTML = `Started ${fmtDate(SESSION.start)} · <b>${SESSION.games} games</b> · ${mins} min in${SESSION.games ? ` · avg ${Math.round(mins/SESSION.games)} min/game` : ""}.`;
}
/* F34 roulette trainer */
let roulAnim = null;
function renderRoulette(){
  const r = $("#roul"); if (!r) return;
  r.innerHTML = `<div class="needle"></div>` + Array.from({length:24}, (_,i) =>
    `<span class="rz ${[2,3,10,11,18,19].includes(i)?"hi":""}">${[2,3,10,11,18,19].includes(i)?"2x":"1x"}</span>`).join("");
}
function spinRoulette(){
  const r = $("#roul"), out = $("#roulOut"); if (!r) return;
  if (roulAnim) clearInterval(roulAnim);
  let off = 0, speed = 26 + Math.random() * 10;
  roulAnim = setInterval(() => {
    off = (off + speed) % 100;
    r.style.setProperty("--off", off + "%");
    speed *= 0.972;
    if (speed < 0.35){
      clearInterval(roulAnim); roulAnim = null;
      const zone = Math.floor(off / (100/24)) % 24;
      const hit = [2,3,10,11,18,19].includes(zone);
      out.innerHTML = hit ? "✔ landed in a 2x zone. Keep that timing." : "✖ 1x zone. Try tapping a beat earlier.";
      out.style.color = hit ? "var(--lime)" : "var(--hot)";
    }
  }, 30);
}
/* F36 golden turn planner */
function renderGold(){
  const out = $("#goldOut"); if (!out) return;
  const hp = Math.min(100, Math.max(5, +$("#ghp").value || 50));
  const mul = Math.max(1, +$("#gmul").value || 2);
  const burst = Math.round(mul * (hp <= 50 ? 2 : 1) * 100);
  out.innerHTML = `At <b>${hp}%</b> boss HP with a <b>${mul}x</b> roulette, your burst window is worth about <b>${burst}</b> damage units.
   ${hp <= 50 ? "Boss under half: fire your one Dynamax/Mega/Z Move now, this is the golden turn." : "Hold the trigger until the boss is under half, then combine it with the roulette peak."}
   ${hp <= 25 ? "Finish now: overkill damage is wasted damage, save the trigger for the next boss." : ""}`;
}
function applyLang(){
  document.querySelectorAll("nav.tabs button").forEach(b => {
    b.textContent = t(b.dataset.tab === "binder" ? "tb" : b.dataset.tab === "boss" ? "tc" : b.dataset.tab === "load" ? "tl" : b.dataset.tab === "hunt" ? "th" : "ts"); });
  const q = $("#q"); if (q) q.placeholder = t("sq");
  const bq = $("#bq"); if (bq) bq.placeholder = t("sbq");
  document.querySelectorAll(".drawer .dlink[data-tab]").forEach(b => {
    b.lastChild.textContent = " " + t(b.dataset.tab === "binder" ? "tb" : b.dataset.tab === "boss" ? "tc" : b.dataset.tab === "load" ? "tl" : b.dataset.tab === "hunt" ? "th" : "ts"); });
  renderBossResult(); if (state.boss) renderTrioSuggestion();
}

/* ================= SUPPORT TICKETS ================= */
const TICKETS = [
  { id:"t1", name:"Zygarde", form:"Complete Forme", move:"Thousand Arrows", type:["Ground","Dragon"], grade:5,
    source:"Mezastar Club (digital)", period:"2020-09-17 to ~2021-01", set:"Set 1", vn:false, img:"img/1-1-025_Zygarde.webp", qr:"img/support_ticket_1.png" },
  { id:"t2", name:"Flygon", move:"Earthquake", type:["Ground","Dragon"], grade:5,
    source:"Mezastar Club (digital)", period:"2021-04-22 to 2021-09-15", set:"Set 4", vn:false, img:"img/4-050_Flygon.webp", qr:"img/support_ticket_2.png" },
  { id:"t3", name:"Corviknight", move:"Brave Bird", type:["Flying","Steel"], grade:5,
    source:"Pokémon Fan magazine issue 73 (physical QR)", period:"2021-04-28 to 2021-09-15", set:"Set 4", vn:false, img:"img/4-046_Corviknight.webp", qr:"img/support_ticket_3.png" },
  { id:"t4", name:"Mimikyu", move:"Shadow Claw", type:["Ghost","Fairy"], grade:5,
    source:"Tournament prize (defeat Star Trainer Sakura)", period:"2021-04-22 to 2021-09-15", set:"Set 4", vn:false, img:"img/4-049_Mimikyu.webp", qr:"img/support_ticket_4.png" },
  { id:"t5", name:"Tangrowth", move:"Power Whip", type:["Grass"], grade:5,
    source:"Mezastar Club (digital)", period:"2022-09-15 to 2022-11-21", set:"Double Chain 2", vn:false, img:"", qr:"img/support_ticket_5.png" },
  { id:"t6", name:"Nidoking", move:"Earth Power", type:["Poison","Ground"], grade:5,
    source:"Mezastar Club (digital) + pamphlet + Pokémon Fan", period:"2023-02-09 to 2023-08-31", set:"Double Chain 4", vn:true, img:"img/dc4-025_Nidoking.webp", qr:"img/support_ticket_6.png" },
  { id:"t7", name:"Krookodile", move:"Earthquake", type:["Ground","Dark"], grade:5,
    source:"Mezastar Club (digital) + pamphlet + event", period:"2024-02-08 to 2024-04-30", set:"Gorgeous Star 4", vn:true, img:"", qr:"img/support_ticket_7.png" },
  { id:"t8", name:"Calyrex", form:"Ice Rider", move:"Glacial Lance", type:["Psychic","Ice"], grade:6,
    source:"Mezastar Club (digital)", period:"Super Tag 1 launch period", set:"Super Tag 1", vn:false, img:"img/st1-005_Calyrex_Ice.webp", qr:"img/support_ticket_8.png" },
  { id:"t9", name:"Calyrex", form:"Shadow Rider", move:"Astral Barrage", type:["Psychic","Ghost"], grade:6,
    source:"Physical launch campaign ticket", period:"Super Tag 1 launch", set:"Super Tag 1", vn:false, img:"img/st1-006_Calyrex_Shadow.webp", qr:"img/support_ticket_9.png" },
  { id:"t10", name:"Drifblim", move:"Shadow Ball", type:["Ghost","Flying"], grade:4,
    source:"Mezastar Club / event flyer", period:"Stardust V2 era (VN)", set:"Stardust V2", vn:true, img:"img/1-2-064_Drifblim.webp", qr:"img/support_ticket_10.png" },
  { id:"t11", name:"Skeledirge", move:"Torch Song", type:["Fire","Ghost"], grade:5,
    source:"Mezastar Club / event flyer", period:"Stardust V2 era (VN)", set:"Stardust V2", vn:true, img:"img/1-2-027_Skeledirge.webp", qr:"img/support_ticket_11.png" },
  { id:"t12", name:"Mareanie", move:"Toxic Spikes", type:["Poison","Water"], grade:2,
    source:"Mezastar Club / event flyer", period:"Stardust V2 era (VN)", set:"Stardust V2", vn:true, img:"img/1-2-065_Mareanie.webp", qr:"img/support_ticket_12.png" },
];

function ticketSrc(t){
  if (t.source.includes("Mezastar Club")) return "club";
  if (t.source.includes("magazine") || t.source.includes("Pokémon Fan")) return "mag";
  if (t.source.includes("Tournament")) return "event";
  if (t.source.includes("launch") || t.source.includes("flyer")) return "event";
  return "club";
}
function renderTickets(){
  const q = ($("#tq")?.value || "").trim().toLowerCase();
  const filter = (window.ticketFilter || "all");
  let list = TICKETS.filter(t => {
    const types = Array.isArray(t.type) ? t.type : [t.type].filter(Boolean);
    if (filter === "vn" && !t.vn) return false;
    if (filter === "club" && ticketSrc(t) !== "club") return false;
    if (filter === "mag" && ticketSrc(t) !== "mag") return false;
    if (filter === "event" && ticketSrc(t) !== "event") return false;
    if (!q) return true;
    return (t.name + " " + t.move + " " + t.set + " " + types.join(" ") + " " + t.source).toLowerCase().includes(q);
  });
  $("#ticketCount").textContent = `${list.length} ticket${list.length===1?"":"s"} · ${list.filter(t=>t.vn).length} available in Vietnam`;
  if (!list.length){ $("#tgrid").innerHTML = `<div class="empty">No tickets match that filter.</div>`; return; }
  $("#tgrid").innerHTML = list.map((t,i) => {
      const types = Array.isArray(t.type) ? t.type : [t.type].filter(Boolean);
      const firstType = types[0];
      return `
      <article class="card ticket" style="--glow:${(TYPE_COLOR[firstType]||"#7aa2ff")}44">
        <div class="halo"></div>
        <div class="stars">${stars(t.grade)}</div>
        ${t.img ? `<img src="${t.img}" alt="${esc(t.name)}" loading="${i<6?'eager':'lazy'}">` : ""}
        ${t.qr ? `<div class="qrimg"><img src="${t.qr}" alt="QR for ${esc(t.name)}" loading="${i<6?'eager':'lazy'}" class="qrcode"></div>` : ""}
        <div class="srcbadge ${ticketSrc(t)}">${ticketSrc(t).toUpperCase()}</div>
        ${t.vn ? `<div class="srcbadge vn">VN ✔</div>` : `<div class="srcbadge no-vn">VN ✕</div>`}
        <div class="cname">${esc(t.name)}${t.form?` ${t.form}`:""}</div>
        <div class="cid">${esc(t.set)}</div>
        <div class="pills">${types.map(pill).join("")}</div>
        <div class="move">Move: ${esc(t.move)}</div>
        <div class="hint" style="margin-top:4px">${esc(t.source)} · ${esc(t.period)}</div>
      </article>`;
    }).join("");
}

/* ================= wiring ================= */
function setDrawer(open){
  $("#drawer").classList.toggle("open", open);
  $("#navScrim").classList.toggle("open", open);
  $("#burgerBtn").classList.toggle("open", open);
  $("#burgerBtn").setAttribute("aria-expanded", open ? "true" : "false");
  $("#drawer").setAttribute("aria-hidden", open ? "false" : "true");
}
$("#burgerBtn").onclick = () => setDrawer(!$("#drawer").classList.contains("open"));
$("#navScrim").onclick = () => setDrawer(false);
document.addEventListener("keydown", e => { if (e.key === "Escape"){ closeModal(); setDrawer(false); } });
function tab(name){
  state.tab = name;
  document.querySelectorAll("nav.tabs button").forEach(b => b.classList.toggle("on", b.dataset.tab === name));
  document.querySelectorAll(".drawer .dlink[data-tab]").forEach(b => b.classList.toggle("on", b.dataset.tab === name));
  document.querySelectorAll(".panel").forEach(p => p.classList.toggle("on", p.id === "p-" + name));
  if (name === "stats") renderStats();
  if (name === "hunt"){ renderPoolChips(); renderPoolGrid(); renderHuntSummary(); }
  if (name === "tickets") renderTickets();
}
document.querySelectorAll("nav.tabs button").forEach(b => b.onclick = () => tab(b.dataset.tab));
document.querySelectorAll(".drawer .dlink[data-tab]").forEach(b => b.onclick = () => { tab(b.dataset.tab); setDrawer(false); });
$("#q").oninput = e => { state.q = e.target.value; renderGrid(); };
$("#sortBtn").onclick = () => { state.sort = "pe"; $("#sortBtn").classList.add("act"); $("#sortName").classList.remove("act"); $("#sortDense").classList.remove("act"); renderGrid(); };
$("#sortName").onclick = () => { state.sort = "name"; $("#sortName").classList.add("act"); $("#sortBtn").classList.remove("act"); $("#sortDense").classList.remove("act"); renderGrid(); };
$("#sortDense").onclick = () => { state.sort = "dense"; $("#sortDense").classList.add("act"); $("#sortBtn").classList.remove("act"); $("#sortName").classList.remove("act"); renderGrid(); };





$("#bq").oninput = e => {
  state.bfilter = e.target.value;
  const m = resolveBoss(state.bfilter);
  if (m) state.boss = m;
  renderBossResult(); renderTrioSuggestion(); renderBossGrid();
};
$("#bq").onkeydown = e => { if (e.key === "Enter"){ const m = resolveBoss(state.bfilter); if (m) selectBoss(m.name); } };

$("#pq").oninput = e => { pstate.q = e.target.value; renderPoolGrid(); };
$("#tq").oninput = e => { renderTickets(); };
document.querySelectorAll("#huntModes .btn").forEach(b => b.onclick = () => {
  pstate.mode = b.dataset.m;
  document.querySelectorAll("#huntModes .btn").forEach(x => x.classList.toggle("act", x === b));
  renderPoolGrid(); });
document.querySelectorAll("#ticketFilters .btn").forEach(b => b.onclick = () => {
  window.ticketFilter = b.dataset.f;
  document.querySelectorAll("#ticketFilters .btn").forEach(x => x.classList.toggle("act", x === b));
  renderTickets(); });
$("#cmpGo").onclick = () => openCompareModal();
$("#cmpClear").onclick = () => { SEL.clear(); renderGrid(); };

(async function init(){
  try{
    const [ro, po, bo, tc, spr, px] = await Promise.all([
          fetch("data/roster.json").then(r => r.json()),
          fetch("data/pool.json").then(r => r.json()),
          fetch("data/bosses.json").then(r => r.json()),
          fetch("data/typechart.json").then(r => r.json()),
          fetch("island/data/sprites.json").then(r => r.json()).catch(() => ({})),
          fetch("island/data/pokedex.json").then(r => r.json()).catch(() => ({}))
        ]);
        ROSTER = ro.tags; POOL = po.tags; BOSSES = bo.bosses; CHART = tc.chart; TYPES = tc.types;
        /* 2D game sprite + Pokédex info per tag (matched by Pokémon name) */
        ROSTER.forEach(x => {
          const s = spr[x.name]; if (s){ x.sprite = "island/sprites/" + s.file; x.animated = !!s.animated; }
          const d = px[x.name]; if (d) x.pdx = d;
        });
    OWNED = {}; ROSTER.forEach(x => OWNED[x.name] = (OWNED[x.name]||0) + 1);
    TEAM = TEAM.map(id => id && ROSTER.some(x => x.id === id) ? id : null);
    $("#sCount").textContent = ROSTER.length;
    $("#sPe").textContent = ROSTER.reduce((s,x) => s + x.pe, 0);
    $("#sType").textContent = [...new Set(ROSTER.flatMap(x => x.types))].length;
    const quick = ["Kyurem","Koraidon","Reshiram","Zekrom","Kommo-o","Tyranitar","Metagross","Alolan Ninetales","Skeledirge","Drifblim","Leafeon","Infernape"];
    $("#bossChips").innerHTML = quick.map(n => `<span class="chip" data-n="${n}">${n}</span>`).join("");
    $("#bossChips").querySelectorAll(".chip").forEach(c => c.onclick = () => { $("#bq").value = c.dataset.n; selectBoss(c.dataset.n); });
    $("#drawerChips").innerHTML = quick.slice(0, 8).map(n => `<span class="chip" data-n="${n}">${n}</span>`).join("");
    $("#drawerChips").querySelectorAll(".chip").forEach(c => c.onclick = () => { tab("boss"); setDrawer(false); $("#bq").value = c.dataset.n; selectBoss(c.dataset.n); });
    $("#setToggle").onclick = () => { ALLSETS = !ALLSETS; renderBossGrid(); };
        document.body.classList.toggle("dim", !!SETTINGS.dim);
        renderChips(); renderGrid(); renderBossResult(); renderBossGrid(); renderLoadout();
        renderPoolChips(); renderPoolGrid(); renderHuntSummary(); renderStats();
        // translate ticket filter buttons
        document.querySelectorAll("#ticketFilters .btn[data-f]").forEach(b => {
          const key = b.dataset.f; b.textContent = t(key);
        });
      }catch(err){
        document.querySelectorAll(".spin").forEach(s => s.outerHTML = `<div class="empty">Could not load the binder data: ${err.message}</div>`);
      }
    })();

/* Installable on the phone home screen, and works offline once opened (art is cached). */
if ("serviceWorker" in navigator){
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
