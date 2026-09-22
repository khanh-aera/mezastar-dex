// ============ Pokédex — Khanh's Collection ============
const ISL = 'island/';
(async function(){
  const [poke, dex, env] = await Promise.all([
    fetch(ISL+'data/pokemon.json').then(r=>r.json()),
    fetch(ISL+'data/pokedex.json').then(r=>r.json()),
    fetch(ISL+'data/enemies.json').then(r=>r.json()),
  ]);
  const typeChart = env.type_chart;
  const enemies = env.enemies;

  const sp = p => ISL + p.sprite;
  const tg = p => ISL + p.tag;
  const byName = {};
  poke.forEach(p => byName[p.name] = p);

  document.getElementById('count').textContent = poke.length + ' Pokémon';

  // ============ GRID + FILTERS ============
  let mode = 'all';
  const gridEl = document.getElementById('grid');

  function gradeLabel(g){ return g==='6'?'6★ Superstar':g==='5'?'5★ Star':g==='4'?'4★':g==='3'?'3★':g==='1'?'Special':'★'+g; }

  function makeCard(p, rank){
    const sup = (p.tier||'').includes('Superstar') ? ' superstar' : '';
    const still = p.animated ? '' : ' still';
    const card = document.createElement('div');
    card.className = 'pcard' + sup + still;
    card.innerHTML = `${rank||''}
      <div class="psprite"><img src="${sp(p)}" alt="${p.name}" loading="lazy"></div>
      <div class="pname">${p.name}</div>
      <div class="ppe">PE ${p.pe}</div>
      <div class="pgrade">${'★'.repeat(p.grade)}</div>`;
    card.addEventListener('click', ()=>openDetail(p));
    return card;
  }

  function buildGrid(){
    gridEl.innerHTML = '';
    const sorted = [...poke].sort((a,b)=>b.pe-a.pe);
    if(mode==='star'){
      ['6','5','4','3','1'].forEach(gr => {
        const group = sorted.filter(p=>String(p.grade)===gr);
        if(!group.length) return;
        const sec = document.createElement('div');
        sec.className = 'gsection'; sec.textContent = gradeLabel(gr);
        gridEl.appendChild(sec);
        group.forEach(p=>gridEl.appendChild(makeCard(p)));
      });
      return;
    }
    let list = sorted;
    if(mode==='main') list = sorted.filter(p=>Number(p.grade)>=5);
    list.forEach((p,i)=>{
      const rank = mode==='power' ? `<span class="prank">#${i+1}</span>` : '';
      gridEl.appendChild(makeCard(p, rank));
    });
  }

  document.querySelectorAll('.filter').forEach(f => f.addEventListener('click', ()=>{
    document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));
    f.classList.add('active');
    mode = f.dataset.f;
    buildGrid();
  }));

  // ============ DETAIL OVERLAY ============
  const detailBackdrop = document.getElementById('detail-backdrop');
  function openDetail(p){
    const d = dex[p.name] || {};
    document.getElementById('d-sprite').src = sp(p);
    document.getElementById('d-name').textContent = p.name;
    document.getElementById('d-genus').textContent = d.genus || '';
    document.getElementById('d-tag').src = tg(p);
    // badges
    const set = p.set==='1' ? 'Stardust V1' : 'Stardust V2';
    const dyn = (p.tier||'').match(/Dynamax|Mega|Z-Move|G-Max/i);
    document.getElementById('d-badges').innerHTML =
      `<span class="badge gold">${'★'.repeat(p.grade)} ${p.grade}★</span><span class="badge">${set}</span>` +
      (dyn ? `<span class="badge">${dyn[0]}</span>` : '');
    // PE + types
    document.getElementById('d-pe').innerHTML = `${p.pe} <small>PE</small>`;
    document.getElementById('d-types').innerHTML = (p.types||[]).map(t=>`<span class="type ${t}">${t}</span>`).join('');
    document.getElementById('d-beats').innerHTML = (p.beats||[]).map(t=>`<span class="chip beat">${t}</span>`).join('') || '<span class="chip">—</span>';
    document.getElementById('d-weak').innerHTML = (p.weak||[]).map(t=>`<span class="chip lose">${t}</span>`).join('') || '<span class="chip">—</span>';
    // pokedex facts
    const facts = [];
    if(d.height_m != null) facts.push(`<div class="d-fact"><span class="k">Height</span><span class="v">${d.height_m} m</span></div>`);
    if(d.weight_kg != null) facts.push(`<div class="d-fact"><span class="k">Weight</span><span class="v">${d.weight_kg} kg</span></div>`);
    if(d.dex) facts.push(`<div class="d-fact"><span class="k">Dex</span><span class="v">#${String(d.dex).padStart(3,'0')}</span></div>`);
    document.getElementById('d-facts').innerHTML = facts.join('') || '<span class="chip">—</span>';
    document.getElementById('d-flavor').textContent = d.flavor || '';
    document.getElementById('d-abilities').innerHTML = (d.abilities||[]).map(a=>`<span class="ab">${a}</span>`).join('') || '';
    detailBackdrop.classList.remove('hidden');
  }
  detailBackdrop.addEventListener('click', e => {
    if(e.target === detailBackdrop || e.target.id === 'detail-close') detailBackdrop.classList.add('hidden');
  });

  // ============ NAV ============
  const navBtns = document.querySelectorAll('.nav-btn');
  const views = { grid: document.getElementById('view-grid'), battle: document.getElementById('view-battle') };
  navBtns.forEach(b => b.addEventListener('click', () => {
    navBtns.forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    Object.entries(views).forEach(([k,el]) => el.classList.toggle('active', k===b.dataset.view));
  }));

  // ============ BATTLE ============
  const slots = document.querySelectorAll('.enemy-slot');
  const pickerBackdrop = document.getElementById('picker-backdrop');
  const pickerList = document.getElementById('picker-list');
  const pickerSearch = document.getElementById('picker-search');
  let enemyTeam = [null,null,null];
  let pickingFor = 0;

  slots.forEach((s,i) => s.addEventListener('click', () => { pickingFor = i; openPicker(); }));
  function openPicker(){
    pickerBackdrop.classList.remove('hidden');
    pickerSearch.value=''; renderPicker(''); pickerSearch.focus();
  }
  function renderPicker(q){
    q = q.toLowerCase(); pickerList.innerHTML = '';
    enemies.filter(e => e.name.toLowerCase().includes(q)).slice(0,60).forEach(e => {
      const d = document.createElement('div');
      d.className = 'pick-item';
      d.innerHTML = `<span class="p-name">${e.name}</span><span class="p-types">${(e.types||[]).map(t=>`<span class="type ${t}">${t}</span>`).join('')}</span>`;
      d.addEventListener('click', ()=>pickEnemy(e));
      pickerList.appendChild(d);
    });
  }
  pickerSearch.addEventListener('input', ()=>renderPicker(pickerSearch.value));
  pickerBackdrop.addEventListener('click', e => { if(e.target===pickerBackdrop) pickerBackdrop.classList.add('hidden'); });

  function pickEnemy(e){
    enemyTeam[pickingFor] = e;
    slots[pickingFor].innerHTML = `<span class="types" style="justify-content:center">${(e.types||[]).map(t=>`<span class="type ${t}">${t}</span>`).join('')}</span><span class="enemy-name">${e.name}</span>`;
    pickerBackdrop.classList.add('hidden');
    computeCounters();
  }

  function scoreType(mine, enemy){
    let sc=0, why=[];
    (mine.types||[]).forEach(mt => {
      (enemy.types||[]).forEach(et => {
        const tc = typeChart[et];
        if(tc){
          if((tc.weak||[]).includes(mt)){ sc+=2; why.push(`${mt} beats ${et}`); }
          if((tc.immune||[]).includes(mt)){ sc+=2; why.push(`${mt} blocks ${et}`); }
          if((tc.resist||[]).includes(mt)){ sc-=1; }
        }
        const mct = typeChart[mt];
        if(mct && (mct.weak||[]).includes(et)){ sc-=2; why.push(`${enemy.name}'s ${et} beats my ${mt}`); }
      });
    });
    return {sc, why};
  }

  function computeCounters(){
    if(enemyTeam.some(e=>!e)) return;
    const scored = poke.map(p => {
      let tot=0, whys=[];
      enemyTeam.forEach(e => { const r=scoreType(p,e); tot+=r.sc; whys=whys.concat(r.why); });
      return { p, sc: tot + p.pe/50, why: [...new Set(whys)] };
    });
    scored.sort((a,b)=>b.sc-a.sc);
    document.getElementById('result-wrap').innerHTML = '<div class="sub" style="padding:0 0 10px">Best counters:</div>' + scored.slice(0,3).map((r,i)=>`
      <div class="rec-card ${i===0?'top':''}">
        <span class="rec-rank">#${i+1}</span>
        <img src="${sp(r.p)}" alt="">
        <div class="rec-body">
          <div class="rec-name">${r.p.name} <small style="color:var(--dim)">PE ${r.p.pe}</small></div>
          <div class="rec-meta">${(r.p.types||[]).map(t=>`<span class="type ${t}">${t}</span>`).join('')}</div>
          <div class="rec-why">${r.why.slice(0,3).join(' · ')||'solid stats'}</div>
        </div>
      </div>`).join('');
  }

  // init
  buildGrid();
})();