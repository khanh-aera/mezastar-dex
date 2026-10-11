/* MEZASTAR BINDER - at-home companion (v83)
   Two tabs: Home (what's new, cool facts, recent battles) and My Binder
   (his full collection with mainline lore / forms / evolutions from PokeAPI).

   Data contract (all static JSON, same origin):
     ../data/roster.json    40 owned tags incl. V3 additions
     ../data/pool.json      147 playable tags (bag picker + stat fallbacks)
     ../data/dex_lore.json  301 encyclopedia rows built by build_dex_data.py
     ../data/support.json   86 support-ticket records (Home "ending soon" strip)
     ../data/bosses.json    boss list (Home count)

   Collection source of truth: localStorage["userRoster"] - the SAME key the
   /play/ app writes when he adds tags at the arcade. Nothing here writes that
   key; additions made in the play app appear here on next load. */
"use strict";

const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

const TYPE_COLOR = {
  Normal:"#9299a1",Fire:"#ff7043",Water:"#42a5f5",Electric:"#ffee58",Grass:"#66bb6a",
  Ice:"#4dd0e1",Fighting:"#ec407a",Poison:"#ab47bc",Ground:"#d4b106",Flying:"#7986cb",
  Psychic:"#ba68c8",Bug:"#9ccc65",Rock:"#a1887f",Ghost:"#7e57c2",Dragon:"#5c6bc0",
  Dark:"#6d4c41",Steel:"#90a4ae",Fairy:"#f48fb1"
};
const GRAD = { "6":"linear-gradient(135deg,#ffd76a,#ff9d3c)", "5":"linear-gradient(135deg,#c7e6ff,#7fb2ff)", "4":"linear-gradient(135deg,#e2d1ff,#a97fff)", "3":"linear-gradient(135deg,#d8ffe0,#7fd99a)", "1":"linear-gradient(135deg,#eee,#bbb)" };
const GRADE_STARS = g => "★".repeat(Math.max(0, Math.min(6, parseInt(g || 0))));
const pill = tp => `<span class="pill" style="background:${TYPE_COLOR[tp] || "#9aa"};color:#080b17">${tp}</span>`;

/* ---------------- state ---------------- */
let ROSTER = [], POOL = [], LORE = {}, SUPPORTS = [], BOSS_COUNT = 0;
let SUP_TICKETS = [];   /* data/support.json entries - ?support= deep links from the 74 printed QRs */
let SORT = "pe", FILTER_GRADE = "all", QUERY = "";
const LS = {
  get(k, d){ try { const v = localStorage.getItem("meza." + k); return v === null ? d : JSON.parse(v); } catch(e){ return d; } },
  set(k, v){ try { localStorage.setItem("meza." + k, JSON.stringify(v)); } catch(e){} }
};

function bootStage(msg){ const el = $("#bootSub"); if (el) el.textContent = msg; }
function bootDone(){ const v = $("#bootVeil"); if (!v) return; v.classList.add("off"); setTimeout(() => v.remove(), 450); }
function bootFail(msg){
  const v = $("#bootVeil"); if (!v) return;
  v.classList.add("err");
  const t = v.querySelector(".boottitle"); if (t) t.textContent = "Không tải được dữ liệu";
  bootStage(msg + " — kiểm tra mạng rồi thử lại");
}

/* ---------------- collection resolution ----------------
   His collection = userRoster ids (play app owns this list). Each id resolves
   against roster.json first (hero art + ownership), pool.json fills stats. */
function userRoster(){
  try { return JSON.parse(localStorage.getItem("userRoster") || "[]"); } catch(e){ return []; }
}
function resolveTag(id){
  const r = ROSTER.find(x => x.id === id);
  const p = POOL.find(x => x.id === id);
  if (!r && !p) return null;
  return Object.assign({}, p || {}, r || {});
}
function collection(){
  const ids = userRoster();
  const seen = new Set(), out = [];
  for (const id of ids){
    if (seen.has(id)) continue;
    seen.add(id);
    const t = resolveTag(id);
    if (t) out.push(t);
  }
  /* roster.json 40 ids ARE his physical binder even before he taps them into
     the play app - the at-home app shows the paper collection, not just the bag */
  for (const r of ROSTER){
    if (!seen.has(r.id)){ seen.add(r.id); out.push(r); }
  }
  return out;
}
function loreFor(tag){
  return LORE[tag.name] || null;
}
function artFor(tag){
  /* roster/pool art is "img/<file>" from the site root - one hop up from /binder/ */
  return tag.img ? "../" + tag.img : "";
}
function spriteFor(lore){
  /* prefer the animated island sprite by species slug */
  return lore && lore.slug ? "../island/sprites/" + lore.slug + ".gif" : "";
}

/* ---------------- HOME ---------------- */
function renderHome(){
  const col = collection();
  const pe = col.reduce((s, t) => s + (parseInt(t.pe) || 0), 0);
  const v3 = col.filter(t => String(t.id).startsWith("1-3-")).length;
  $("#sCount").textContent = col.length;
  $("#sPe").textContent = pe;
  $("#sV3").textContent = v3;

  const stars = t => GRADE_STARS(t.grade);
  const hero = col.slice().sort((a, b) => (b.pe || 0) - (a.pe || 0))[0];
  const heroLore = hero ? loreFor(hero) : null;
  $("#heroCard").innerHTML = hero ? `
    <div class="herotag" onclick="openTag('${esc(hero.id)}')">
      <img src="${artFor(hero)}" alt="${esc(hero.name)}">
      <div class="herometa">
        <div class="hgrade">${stars(hero)} <span>${(hero.tier || "").replace(" Pokémon", "")}</span></div>
        <div class="hname">${esc(hero.name)}</div>
        <div class="hpe">PE ${hero.pe ?? "?"}</div>
        <div class="hpills">${(hero.types || []).map(pill).join("")}</div>
        ${heroLore && heroLore.genus ? `<div class="hgenus">${esc(heroLore.genus)} · Gen ${heroLore.gen}</div>` : ""}
      </div>
    </div>
    <div class="herolabel">🏆 Tag mạnh nhất bộ sưu tập</div>` : `
    <div class="herolabel">Binder trống - thêm tag ở app <a href="../play/">/play/</a></div>`;

  /* news: computed from local data, never invented */
  const news = [];
  news.push({ icon:"🆕", title:"Stardust V3 đã lên máy", body:"Bản V3 (70 tag mới, bảng 1-3-xxx) đã chạy trên máy tại VN từ 30/09/2026. Binder của bạn đã có <b>" + v3 + " tag V3</b>.", cls:"hot" });
  news.push({ icon:"⚔️", title:"App chơi", body:`<a href="../play/">/play/</a> — chọn 3 đối thủ, nhận đội mạnh nhất + hỗ trợ đề xuất. Thêm tag mới ngay tại đó, binder này tự cập nhật.`, cls:"" });
  news.push({ icon:"🗂️", title:"Bộ sưu tập", body:`${col.length} tag · tổng PE <b>${pe}</b> · ${col.filter(t => t.grade === "6").length} thẻ 6★ / ${col.filter(t => t.grade === "5").length} thẻ 5★.`, cls:"" });
  const bossline = BOSS_COUNT ? `<div class="miniboss">${BOSS_COUNT} boss trong data battle.</div>` : "";
  $("#newsGrid").innerHTML = news.map(n => `
    <div class="newscard glass ${n.cls}">
      <div class="nicon">${n.icon}</div>
      <div class="ntitle">${n.title}</div>
      <div class="nbody">${n.body}</div>
      ${bossline}
    </div>`).join("");

  /* cool fact: rotate daily through the collection's lore */
  const keyed = col.map(t => ({ t, l: loreFor(t) })).filter(x => x.l && x.l.lore);
  if (keyed.length){
    const day = Math.floor(Date.now() / 86400000);
    const pick = keyed[day % keyed.length];
    $("#loreCard").innerHTML = `
      <div class="loretag">💡 Fact hôm nay · ${esc(pick.t.name)}</div>
      <div class="loretext">${esc(pick.l.lore)}</div>
      <div class="loremeta">dex #${pick.l.dex} · Gen ${pick.l.gen} · ${esc(pick.l.genus || "")}${pick.l.height ? ` · ${pick.l.height} m · ${pick.l.weight} kg` : ""}</div>`;
  } else {
    $("#loreCard").innerHTML = `<div class="loretag">💡 Fact hôm nay</div><div class="loretext">Chưa có lore cho bộ sưu tập hiện tại.</div>`;
  }

  /* recent battles: play app writes meza.battleLog {ts, foes[], team[], mode} */
  let log = LS.get("battleLog", []);
  const names = ids => ids.map(id => { const t = resolveTag(id); return t ? t.name : id; });
  $("#recentCard").innerHTML = `
    <div class="loretag">📜 5 trận gần nhất</div>
    ${log.length ? log.slice(0, 5).map(e => `
      <div class="logrow">
        <span class="logmode">${e.mode === "max" ? "🔥 Max" : "🍃 Fresh"}</span>
        <span class="logfoes">vs ${names(e.foes || []).join(", ")}</span>
        <span class="logteam">${names(e.team || []).join(" · ")}</span>
        <span class="logdate">${new Date(e.ts).toLocaleDateString("vi-VN")}</span>
      </div>`).join("")
    : `<div class="loretext">Chưa có trận nào được log. Chơi ở <a href="../play/">/play/</a> thì lịch sử sẽ hiện ở đây.</div>`}`;
}

/* ---------------- MY BINDER grid ---------------- */
function renderGrid(){
  const col = collection();
  let rows = col;
  if (FILTER_GRADE !== "all") rows = rows.filter(t => String(t.grade) === FILTER_GRADE);
  if (QUERY.trim()){
    const q = QUERY.trim().toLowerCase();
    rows = rows.filter(t =>
      t.name.toLowerCase().includes(q) ||
      String(t.id).includes(q) ||
      (t.types || []).some(x => x.toLowerCase().includes(q)) ||
      String(t.pe || "").includes(q));
  }
  const cmp = {
    pe:   (a, b) => (b.pe || 0) - (a.pe || 0) || a.name.localeCompare(b.name),
    name: (a, b) => a.name.localeCompare(b.name),
    dex:  (a, b) => ((loreFor(a) || {}).dex || 9999) - ((loreFor(b) || {}).dex || 9999) || a.name.localeCompare(b.name)
  }[SORT];
  rows = rows.slice().sort(cmp);

  const grades = [...new Set(col.map(t => String(t.grade)))].sort();
  $("#gradeChips").innerHTML = ["all", ...grades].map(g =>
    `<button class="chip ${FILTER_GRADE === g ? "on" : ""}" data-g="${g}">${g === "all" ? "Tất cả" : GRADE_STARS(g) || g}</button>`).join("");
  $("#gradeChips").querySelectorAll(".chip").forEach(b => b.onclick = () => { FILTER_GRADE = b.dataset.g; renderGrid(); });

  $("#grid").innerHTML = rows.length ? rows.map(t => {
    const l = loreFor(t);
    return `
    <article class="tcard" data-id="${esc(t.id)}" onclick="openTag('${esc(t.id)}')">
      <div class="tart" style="background:${GRAD[String(t.grade)] || GRAD["3"]}">
        ${artFor(t) ? `<img src="${artFor(t)}" alt="${esc(t.name)}" loading="lazy">` : `<div class="tq">?</div>`}
        <span class="tpe">PE ${t.pe ?? "?"}</span>
      </div>
      <div class="tname">${esc(t.name)}</div>
      <div class="tsub">${GRADE_STARS(t.grade)} ${(t.tier || "").replace(" Pokémon", "")}</div>
      <div class="tpills">${(t.types || []).map(pill).join("")}</div>
      ${l ? `<div class="tdex">#${l.dex} · G${l.gen}${l.forms && l.forms.length ? ` · ${l.forms.length} form` : ""}</div>` : `<div class="tdex">—</div>`}
    </article>`;
  }).join("") : `<div class="empty">Không có tag nào khớp.</div>`;
}

/* ---------------- detail sheet ----------------
   Rich sheet (v85): ALL media is vendored into /dexmedia/ in this repo -
   artwork .webp, animated sprite .gif, cry .m4a (ogg does not play on iOS).
   No hotlinks: raw.githubusercontent.com was unreachable on his mobile ISP,
   which is why "the pokemon info is not show". The sheet is themed per type
   (game-dex feel): background glow, colored stat bars, dex number watermark. */
const STAT_COLOR = v => v >= 110 ? "#4dd0e1" : v >= 80 ? "#7fd99a" : v >= 50 ? "#ffd76a" : "#ff8a5c";
window.openTag = function(id){
  const t = resolveTag(id);
  if (!t) return;
  const l = loreFor(t);
  const forms = (l && l.forms || []).map(f => `
    <button class="formchip ${f.mega ? "mega" : ""} ${f.gmax ? "gmax" : ""}" data-form="${esc(f.id)}">${esc(f.name)}</button>`).join("");
  const sprite = l && l.slug ? `../island/sprites/${l.slug}.gif` : "";
  const dex = l && l.dex;
  const artwork = dex ? `../dexmedia/art/${dex}.webp` : "";
  const anim = dex ? `../dexmedia/anim/${dex}.gif` : "";
  const cry = dex ? `../dexmedia/cry/${dex}.m4a` : "";
  const mainType = (t.types || [])[0];
  const tint = TYPE_COLOR[mainType] || "#7fb2ff";
  const BST = l && l.baseStats ? l.baseStats.hp + l.baseStats.atk + l.baseStats.def + l.baseStats.spa + l.baseStats.spd + l.baseStats.spe : 0;
  const statBar = (label, v, max) => `
    <div class="statrow"><span class="statlabel">${label}</span>
      <span class="statval">${v}</span>
      <div class="statbar"><i style="width:${Math.min(100, Math.round(v / max * 100))}%;background:${STAT_COLOR(v)}"></i></div>
    </div>`;
  const statsBlock = l && l.baseStats ? `
    <div class="ssect">📊 Base stats <span class="bst">BST ${BST}</span></div>
    <div class="stats">
      ${statBar("HP", l.baseStats.hp, 255)}${statBar("Attack", l.baseStats.atk, 190)}
      ${statBar("Defense", l.baseStats.def, 250)}${statBar("Sp.Atk", l.baseStats.spa, 194)}
      ${statBar("Sp.Def", l.baseStats.spd, 250)}${statBar("Speed", l.baseStats.spe, 200)}
    </div>` : "";
  const abilBlock = l && l.abilities && l.abilities.length ? `
    <div class="ssect">✨ Abilities</div>
    <div class="abils">${l.abilities.map(a => `
      <div class="abil ${a.hidden ? "hiddenab" : ""}">
        <b>${esc(a.name)}</b>${a.hidden ? ` <span class="hiddentag">hidden</span>` : ""}
        ${a.flavor ? `<div class="abilflavor">${esc(a.flavor)}</div>` : ""}
      </div>`).join("")}</div>` : "";
  const breedChips = l ? [
    l.eggGroups && l.eggGroups.length ? `🥚 ${l.eggGroups.map(esc).join(", ")}` : "",
    l.growthRate ? `📈 ${esc(l.growthRate)} growth` : "",
    l.habitat ? `🌍 ${esc(l.habitat)}` : "",
    l.legendary ? `🌟 Legendary` : "",
    l.mythical ? `✨ Mythical` : "",
  ].filter(Boolean).map(c => `<span>${c}</span>`).join("") : "";
  $(`#modal`).innerHTML = `
    <div class="sheet" style="--tint:${tint}">
      <button class="xbtn" id="x">✕</button>
      <div class="dexnum">#${dex ?? "???"}</div>
      <div class="heroart" style="background:linear-gradient(160deg, ${tint}33 0%, transparent 55%), ${GRAD[String(t.grade)] || GRAD["3"]}">
        ${artwork ? `<img class="artmain" src="${artwork}" alt="${esc(t.name)}" onerror="this.style.display='none'">` : ""}
        ${anim ? `<img class="artsprite" src="${anim}" alt="" onerror="this.src='${sprite}';this.onerror=()=>this.style.display='none'">` : (sprite ? `<img class="artsprite" src="${sprite}" alt="" onerror="this.style.display='none'">` : "")}
        ${cry ? `<button class="crybtn" id="cryBtn" title="Nghe tiếng kêu">🔊</button>` : ""}
        <img class="artscan" src="${artFor(t)}" alt="" onerror="this.style.display='none'">
      </div>
      <div class="smeta">
        <div class="sgrade">${GRADE_STARS(t.grade)} <span>${esc((t.tier || "").replace(" Pokémon", ""))}</span></div>
        <div class="sname">${esc(t.name)}</div>
        <div class="sid">${esc(t.id)} · PE ${t.pe ?? "?"}</div>
        <div class="spills">${(t.types || []).map(pill).join("")}</div>
        ${l ? `<div class="sdex">dex #${l.dex} · Gen ${l.gen} · ${esc(l.genus || "")}</div>` : ""}
        ${l && l.height ? `<div class="sdex">${l.height} m · ${l.weight} kg</div>` : ""}
        ${breedChips ? `<div class="breedchips">${breedChips}</div>` : ""}
      </div>

      ${l && l.lore ? `<div class="slore">“${esc(l.lore)}”</div>` : `<div class="slore dim">Chưa có lore mainline cho thẻ này.</div>`}

      ${statsBlock}
      ${abilBlock}

      ${forms ? `<div class="ssect">🔄 Forms (${(l.forms || []).length})</div><div class="formrow">${forms}</div>` : ""}

      ${l && (l.evolvesFrom || (l.evolvesInto || []).length) ? `
        <div class="ssect">🧬 Tiến hoá</div>
        <div class="evorow">
          ${l.evolvesFrom ? `<button class="evolink" data-goto="${esc(l.evolvesFrom.slug)}">← ${esc(l.evolvesFrom.name)}${l.evolvesFrom.condition ? ` <i>${esc(l.evolvesFrom.condition)}</i>` : ""}</button>` : `<span class="evobase">base form</span>`}
          ${(l.evolvesInto || []).map(e => `<button class="evolink" data-goto="${esc(e.toSlug)}">${esc(e.to)} <i>${esc(e.condition)}</i></button>`).join("")}
        </div>` : ""}

      <div class="ssect">📊 Trong máy</div>
      <div class="beats">
        <div><b>Đánh mạnh (beats)</b><div class="bp">${(t.beats || []).map(pill).join("") || "—"}</div></div>
        <div><b>Yếu với (weak)</b><div class="bp">${(t.weak || []).map(pill).join("") || "—"}</div></div>
        ${t.moves && t.moves.length ? `<div><b>Move</b><div class="bp">${(Array.isArray(t.moves) ? t.moves.map(m => m.name || m).join(" · ") : t.moves)}</div></div>` : ""}
      </div>

      <div class="ssrc">Nguồn: PE/grade/tier là Mezastar (sheet + đo máy) · artwork/sprite/tiếng kêu/stats/lore là mainline qua PokeAPI (<i>wiki-community</i>), media tự host trong repo.</div>
    </div>`;
  $("#scrim").classList.add("on");
  document.body.style.overflow = "hidden";
  $("#x").onclick = closeModal;
  const cb = $("#cryBtn");
  if (cb) cb.onclick = () => {
    try {
      let a = document.getElementById("cryAudio");
      if (!a){
        a = document.createElement("audio"); a.id = "cryAudio";
        a.src = cry; a.preload = "none"; document.body.appendChild(a);
      }
      a.currentTime = 0; a.play().catch(() => {});
    } catch(e){}
  };
  $("#modal").querySelectorAll("[data-goto]").forEach(b => b.onclick = () => {
    const slug = b.dataset.goto;
    /* jump to an owned tag with that species; if he doesn't own any form of it,
       keep the sheet open rather than dumping him back to the grid */
    const col = collection();
    const hit = col.find(c => loreFor(c) && loreFor(c).slug === slug);
    if (hit) openTag(hit.id);
  });
  $("#modal").querySelectorAll(".formchip").forEach(b => b.onclick = () => {
    b.classList.toggle("picked");
  });
};
function closeModal(){
  $("#scrim").classList.remove("on");
  $("#modal").innerHTML = "";
  document.body.style.overflow = "";
}
$("#scrim").addEventListener("click", e => { if (e.target.id === "scrim") closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

/* ---------------- support card sheet (QR deep links) ---------------- */
window.openSupport = function(slug){
  const list = SUP_TICKETS.filter(x => x.slug === slug);
  if (!list.length){ return; }
  const u = list[list.length - 1];
  const types = u.types || [];
  $("#modal").innerHTML = `
    <div class="sheet">
      <button class="xbtn" id="x">✕</button>
      <div class="shead">
        <div class="sart" style="background:rgba(255,255,255,.06)">
          <img src="${u.img ? (u.img.startsWith("http") ? u.img : "../" + u.img) : ""}" alt="${esc(u.name)}">
        </div>
        <div class="smeta">
          <div class="sgrade">🎫 SUPPORT TICKET</div>
          <div class="sname">${esc(u.name)}</div>
          <div class="sid">${esc(u.set || "")}${u.firstSet && u.firstSet !== u.set ? ` · first: ${esc(u.firstSet)}` : ""}</div>
          <div class="spills">${types.map(pill).join("")}</div>
          <div class="sdex">offered ${u.timesOffered || 1}×${u.lastValid ? ` · valid to ${esc(u.lastValid)}` : ""}</div>
        </div>
      </div>
      <div class="ssect">⚔️ Move</div>
      <div class="slore" style="font-style:normal"><b>${esc(u.move || "?")}</b> ${u.moveType ? `<span class="pill" style="background:${TYPE_COLOR[u.moveType] || "#9aa"};color:#080b17">${esc(u.moveType)}</span>` : ""}</div>
      ${u.rawSource ? `<div class="ssect">📌 Nguồn</div><div class="loretext">${esc(u.rawSource)}</div>` : ""}
      <div class="ssrc">Dữ liệu ticket: tổng hợp từ Bulbapedia set records (<i>wiki-community</i>). Mã QR thật trên vé là duy nhất mỗi thành viên và không được công bố.</div>
    </div>`;
  $("#scrim").classList.add("on");
  document.body.style.overflow = "hidden";
  $("#x").onclick = closeModal;
  history.replaceState(null, "", location.pathname);   /* scrub the param so refresh is clean */
};

/* ---------------- tabs + wiring ---------------- */
function tab(name){
  document.querySelectorAll("nav.tabs button").forEach(b => b.classList.toggle("on", b.dataset.tab === name));
  document.querySelectorAll(".panel").forEach(p => p.classList.toggle("on", p.id === "p-" + name));
  window.scrollTo(0, 0);
}
document.querySelectorAll("nav.tabs button").forEach(b => b.onclick = () => tab(b.dataset.tab));
document.querySelectorAll("#sortBtn,#sortName,#sortDex").forEach(b => b.onclick = () => {
  SORT = b.dataset.sort;
  document.querySelectorAll(".tools .btn").forEach(x => x.classList.toggle("act", x === b));
  renderGrid();
});
$("#q").addEventListener("input", e => { QUERY = e.target.value; renderGrid(); });

/* ---------------- boot ---------------- */
async function boot(){
  bootStage("roster · pool · dex lore");
  try {
    const [ro, po, lo, su, bo] = await Promise.all([
      fetch("../data/roster.json").then(r => r.json()).catch(() => ({ tags: [] })),
      fetch("../data/pool.json").then(r => r.json()).catch(() => ({ tags: [] })),
      fetch("../data/dex_lore.json").then(r => r.json()).catch(() => ({ tags: [] })),
      fetch("../data/support.json").then(r => r.json()).catch(() => ({ entries: [] })),
      fetch("../data/bosses.json").then(r => r.json()).catch(() => ({ count: 0 }))
    ]);
    ROSTER = ro.tags || [];
    POOL = po.tags || [];
    LORE = {};
    for (const t of (lo.tags || [])) LORE[t.name] = t;
    SUPPORTS = su.entries || [];
    SUP_TICKETS = su.entries || [];
    BOSS_COUNT = bo.count || (bo.bosses ? bo.bosses.length : 0);
    if (!ROSTER.length && !POOL.length) throw new Error("roster.json và pool.json đều rỗng");
  } catch (e) {
    bootFail("một số file không tải được");
    return;
  }
  renderHome();
  renderGrid();
  bootDone();
  /* 74 physical QRs scan to the old root URL with ?support=<slug>; root now
     hands those off here. Open the card as a sheet so the scan still lands
     on exactly that support Pokemon. */
  const slug = new URLSearchParams(location.search).get("support");
  if (slug) openSupport(slug);
}
document.addEventListener("DOMContentLoaded", boot);
