// ============ Pokédex Island ============
(async function(){
  const [poke, env] = await Promise.all([
    fetch('data/pokemon.json').then(r=>r.json()),
    fetch('data/enemies.json').then(r=>r.json()),
  ]);
  const typeChart = env.type_chart;
  const enemies = env.enemies;
  window.__POKE = poke;

  const layer = document.getElementById('sprites-layer');
  document.getElementById('island-count').textContent = poke.length + ' Pokémon collected';

  // ============ TIME OF DAY ============
  function setTimeOfDay(){
    const h = new Date().getHours();
    const b = document.body;
    b.classList.remove('day','noon','dusk','night');
    if(h >= 18 || h < 5) b.classList.add('night');
    else if(h >= 5 && h < 7) b.classList.add('dusk');
    else if(h >= 11 && h < 15) b.classList.add('noon');
    else if(h >= 7 && h < 18) b.classList.add('day');
    return { isNight: h >= 18 || h < 5, h };
  }
  let tod = setTimeOfDay();
  setInterval(()=>{ tod = setTimeOfDay(); }, 60000);

  // ============ stars & clouds ============
  function stars(){
    const c = document.querySelector('.sky-stars');
    for(let i=0;i<46;i++){
      const s = document.createElement('span');
      s.style.left = Math.random()*100 + '%';
      s.style.top = Math.random()*45 + '%';
      s.style.animationDelay = Math.random()*3 + 's';
      c.appendChild(s);
    }
  }
  function clouds(){
    const c = document.getElementById('clouds');
    for(let i=0;i<4;i++){
      const s = document.createElement('span');
      s.style.width = (70+Math.random()*60) + 'px';
      s.style.height = '22px';
      s.style.top = (6+Math.random()*24) + '%';
      s.style.animationDelay = (Math.random()*40) + 's';
      s.style.animationDuration = (35+Math.random()*40) + 's';
      c.appendChild(s);
    }
  }

  // ============ ISLAND SPAWN MANAGER ============
  const active = new Map(); // name -> {el,p,x,y,vx,vy,rest}
  const TARGET = 11;

  function sizeFor(p){
    const h = p.height || 1.0;
    const s = Math.max(0.55, Math.min(1.7, 0.55 + h*0.3));
    return Math.round(56 * s);
  }

  function anchorFor(p){
    const W = layer.clientWidth, H = layer.clientHeight;
    const types = p.types || [];
    if(types.includes('Water')) {
      return { x: W*0.06 + Math.random()*90, y: H*0.72 + Math.random()*20 };
    }
    if(types.includes('Fire')) {
      return { x: W*0.5 + (Math.random()-0.5)*70, y: H*0.6 + Math.random()*24 };
    }
    const ang = Math.random()*Math.PI*2;
    const r = (0.2 + Math.random()*0.6) * Math.min(W,H);
    return { x: W/2 + Math.cos(ang)*r*0.85, y: H*0.55 + Math.sin(ang)*r*0.28 + H*0.05 };
  }

  function spawnPokemon(p){
    if(active.has(p.name)) return;
    const el = document.createElement('div');
    el.className = 'sprite ' + (p.animated ? 'walk' : 'still') + ' spawning';
    const sz = sizeFor(p);
    el.style.width = sz + 'px';
    el.style.height = sz + 'px';
    el.style.zIndex = 3 + Math.round(p.pe/10);
    const img = document.createElement('img');
    img.src = p.sprite; img.alt = p.name; img.draggable = false;
    el.appendChild(img);
    el.addEventListener('click', ()=>openPopup(p));
    layer.appendChild(el);

    const a = anchorFor(p);
    const state = {
      el, p, x: a.x, y: a.y,
      vx:(Math.random()-0.5)*18, vy:(Math.random()-0.5)*12,
      rest: 0, _last: performance.now(), flip: 1,
    };
    el.style.transform = `translate(${a.x}px,${a.y}px) scaleX(1)`;
    requestAnimationFrame(()=> el.classList.remove('spawning'));
    active.set(p.name, state);
  }

  function despawnPokemon(name){
    const s = active.get(name);
    if(!s) return;
    s.el.classList.add('spawning');
    active.delete(name);
    setTimeout(()=>{ s.el.remove(); }, 800);
  }

  // type-biased spawn weight by time of day
  const NIGHT_TYPES = ['Psychic','Ghost','Dark','Fairy','Ice','Dragon'];
  const DAY_TYPES = ['Grass','Fire','Bug','Flying','Electric','Normal'];
  function spawnWeight(p){
    const types = p.types || [];
    let w = 1;
    if(tod.isNight){
      if(types.some(t=>NIGHT_TYPES.includes(t))) w += 1.6;
    } else {
      if(types.some(t=>DAY_TYPES.includes(t))) w += 1.6;
    }
    return w;
  }

  function pickWeighted(){
    const avail = poke.filter(p => !active.has(p.name));
    if(!avail.length) return null;
    const weights = avail.map(spawnWeight);
    const total = weights.reduce((a,b)=>a+b,0);
    let r = Math.random()*total;
    for(let i=0;i<avail.length;i++){ r -= weights[i]; if(r<=0) return avail[i]; }
    return avail[avail.length-1];
  }

  // occasional "type wave": spawn a few of the same type together
  let waveCooldown = 4;
  function rotate(){
    // spawn
    let spawnCount = 1 + (Math.random()<0.3 ? 1 : 0);
    if(waveCooldown-- <= 0){
      waveCooldown = 5 + Math.floor(Math.random()*4);
      // pick a random type present in roster
      const typeSet = [...new Set(poke.flatMap(p=>p.types||[]))];
      const type = typeSet[Math.floor(Math.random()*typeSet.length)];
      const ofType = poke.filter(p => !active.has(p.name) && (p.types||[]).includes(type));
      if(ofType.length){
        ofType.slice(0,2).forEach(p=>spawnPokemon(p));
        spawnCount = 0;
      }
    }
    for(let i=0;i<spawnCount;i++){
      const p = pickWeighted();
      if(p) spawnPokemon(p);
    }
    // despawn extras to keep it calm
    while(active.size > TARGET){
      const names = [...active.keys()];
      despawnPokemon(names[Math.floor(Math.random()*names.length)]);
    }
    // ensure minimum population
    for(let i=active.size; i<Math.min(TARGET, 9); i++){
      const p = pickWeighted();
      if(p) spawnPokemon(p);
    }
  }

  // ============ MOVEMENT ============
  function step(now){
    active.forEach(s => {
      const W = layer.clientWidth, H = layer.clientHeight;
      const dt = Math.min(0.05, (now - s._last)/1000); s._last = now;
      // idle pauses
      if(s.rest > 0){
        s.rest -= dt*1000;
        if(s.rest <= 0){
          s.vx = (Math.random()-0.5)*18;
          s.vy = (Math.random()-0.5)*12;
        } else {
          s.vx = 0; s.vy = 0;
        }
      } else if(Math.random() < 0.003){
        s.rest = 1500 + Math.random()*3500;
      }
      s.x += s.vx*dt;
      s.y += s.vy*dt;
      const pad = 10;
      if(s.x < pad){ s.x=pad; s.vx=Math.abs(s.vx); }
      if(s.x > W-56){ s.x=W-56; s.vx=-Math.abs(s.vx); }
      if(s.y < H*0.36){ s.y=H*0.36; s.vy=Math.abs(s.vy); }
      if(s.y > H-46){ s.y=H-46; s.vy=-Math.abs(s.vy); }
      if(s.vx > 1) s.flip = 1; else if(s.vx < -1) s.flip = -1;
      s.el.style.transform = `translate(${s.x}px,${s.y}px) scaleX(${s.flip})`;
    });
    requestAnimationFrame(step);
  }

  // ============ POPUP ============
  const popupBackdrop = document.getElementById('popup-backdrop');
  function openPopup(p){
    document.getElementById('popup-tag-img').src = p.tag;
    document.getElementById('popup-name').textContent = p.name;
    const stars = '★'.repeat(p.grade);
    const set = 'Set ' + p.set + (p.set==='1'?' (V1)':' (V2)');
    document.getElementById('popup-meta').textContent = `${stars}  ·  ${set}`;
    const dyn = (p.tier||'').match(/Dynamax|Mega|Z-Move|G-Max/i);
    document.getElementById('popup-pe').innerHTML = p.pe + (dyn ? ` <small style="color:var(--fire)">${dyn[0]}</small>` : '');
    document.getElementById('popup-types').innerHTML = (p.types||[]).map(t=>`<span class="type ${t}">${t}</span>`).join('');
    document.getElementById('popup-beats').innerHTML = (p.beats||[]).map(t=>`<span class="chip beat">${t}</span>`).join('') || '<span class="chip">—</span>';
    document.getElementById('popup-weak').innerHTML = (p.weak||[]).map(t=>`<span class="chip lose">${t}</span>`).join('') || '<span class="chip">—</span>';
    popupBackdrop.classList.remove('hidden');
  }
  popupBackdrop.addEventListener('click', e => {
    if(e.target === popupBackdrop || e.target.id === 'popup-close') popupBackdrop.classList.add('hidden');
  });

  // ============ NAV ============
  const navBtns = document.querySelectorAll('.nav-btn');
  const views = { island: document.getElementById('view-island'), battle: document.getElementById('view-battle'), grid: document.getElementById('view-grid') };
  let gridMode = 'all';
  navBtns.forEach(b => b.addEventListener('click', () => {
    navBtns.forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    const v = b.dataset.view;
    Object.entries(views).forEach(([k,el]) => el.classList.toggle('active', k===v));
    if(v==='grid') buildGrid(gridMode);
  }));

  // ============ GRID (with filters) ============
  function gradeLabel(g){ return g==='6'?'6★ Superstar':g==='5'?'5★ Star':g==='4'?'4★':g==='3'?'3★':g==='1'?'Special':'★'+g; }
  function cardHTML(p, extra){
    const sup = (p.tier||'').includes('Superstar') ? ' superstar' : '';
    return `<div class="grid-card${sup}" data-name="${p.name}">
      ${extra||''}<img src="${p.sprite}" alt=""><div class="gname">${p.name}</div><div class="g-pe">PE ${p.pe}</div>
    </div>`;
  }
  function buildGrid(mode){
    const g = document.getElementById('grid');
    g.innerHTML = '';
    const sorted = [...poke].sort((a,b)=>b.pe-a.pe);
    let list = sorted;
    if(mode==='main') list = sorted.filter(p => Number(p.grade) >= 5);
    if(mode==='power') list = sorted;
    if(mode==='star'){
      const order = ['6','5','4','3','1'];
      order.forEach(gr => {
        const group = sorted.filter(p=>String(p.grade)===gr);
        if(!group.length) return;
        const sec = document.createElement('div');
        sec.className = 'gsection';
        sec.textContent = gradeLabel(gr);
        g.appendChild(sec);
        group.forEach(p=>{
          const c = document.createElement('div');
          c.innerHTML = cardHTML(p);
          c.firstElementChild.addEventListener('click', ()=>openPopup(p));
          g.appendChild(c.firstElementChild);
        });
      });
      document.getElementById('grid-count').textContent = poke.length + ' tags · grouped by star';
      return;
    }
    list.forEach((p,i)=>{
      const c = document.createElement('div');
      const rank = (mode==='power') ? `<span class="g-rank">#${i+1}</span>` : '';
      c.innerHTML = cardHTML(p, rank);
      c.firstElementChild.addEventListener('click', ()=>openPopup(p));
      g.appendChild(c.firstElementChild);
    });
    const label = mode==='main' ? (list.length+' main-roster tags (5★+)') : (list.length+' tags · by power');
    document.getElementById('grid-count').textContent = mode==='all' ? poke.length+' tags collected' : label;
  }
  document.querySelectorAll('.filter').forEach(f => f.addEventListener('click', ()=>{
    document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));
    f.classList.add('active');
    gridMode = f.dataset.f;
    buildGrid(gridMode);
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
    pickerSearch.value = ''; renderPicker(''); pickerSearch.focus();
  }
  function renderPicker(q){
    q = q.toLowerCase(); pickerList.innerHTML = '';
    enemies.filter(e => e.name.toLowerCase().includes(q)).slice(0,60).forEach(e => {
      const d = document.createElement('div');
      d.className = 'pick-item';
      d.innerHTML = `<span class="p-name">${e.name}</span><span class="p-types">${(e.types||[]).map(t=>`<span class="type ${t}">${t}</span>`).join('')}</span>`;
      d.addEventListener('click', () => pickEnemy(e));
      pickerList.appendChild(d);
    });
  }
  pickerSearch.addEventListener('input', ()=>renderPicker(pickerSearch.value));
  pickerBackdrop.addEventListener('click', e => { if(e.target===pickerBackdrop) pickerBackdrop.classList.add('hidden'); });

  function pickEnemy(e){
    enemyTeam[pickingFor] = e;
    const s = slots[pickingFor];
    s.innerHTML = `<span class="types" style="justify-content:center">${(e.types||[]).map(t=>`<span class="type ${t}">${t}</span>`).join('')}</span><span class="enemy-name">${e.name}</span>`;
    pickerBackdrop.classList.add('hidden');
    computeCounters();
  }

  function scoreType(mine, enemy){
    let sc = 0, why = [];
    (mine.types||[]).forEach(mt => {
      (enemy.types||[]).forEach(et => {
        const tc = typeChart[et];
        if(tc){
          if((tc.weak||[]).includes(mt)){ sc += 2; why.push(`${mt} beats ${et}`); }
          if((tc.immune||[]).includes(mt)){ sc += 2; why.push(`${mt} blocks ${et}`); }
          if((tc.resist||[]).includes(mt)){ sc -= 1; }
        }
        const mct = typeChart[mt];
        if(mct && (mct.weak||[]).includes(et)){ sc -= 2; why.push(`${enemy.name}'s ${et} beats my ${mt}`); }
      });
    });
    return {sc, why};
  }

  function computeCounters(){
    if(enemyTeam.some(e=>!e)) return;
    const scored = poke.map(p => {
      let tot=0, whys=[];
      enemyTeam.forEach(e => { const r = scoreType(p,e); tot += r.sc; whys = whys.concat(r.why); });
      const peBonus = p.pe / 50;
      return { p, sc: tot + peBonus, why: [...new Set(whys)] };
    });
    scored.sort((a,b)=>b.sc-a.sc);
    const top = scored.slice(0,3);
    const wrap = document.getElementById('result-wrap');
    wrap.innerHTML = '<div class="sub" style="padding:0 0 10px">Best counters:</div>' + top.map((r,i)=>{
      return `<div class="rec-card ${i===0?'top':''}">
        <span class="rec-rank">#${i+1}</span>
        <img src="${r.p.sprite}" alt="">
        <div class="rec-body">
          <div class="rec-name">${r.p.name} <small style="color:var(--dim)">PE ${r.p.pe}</small></div>
          <div class="rec-meta">${(r.p.types||[]).map(t=>`<span class="type ${t}">${t}</span>`).join('')}</div>
          <div class="rec-why">${r.why.slice(0,3).join(' · ')||'solid stats'}</div>
        </div>
      </div>`;
    }).join('');
  }

  // ============ INIT ============
  stars();
  clouds();
  // initial population
  for(let i=0;i<TARGET;i++){ const p = pickWeighted(); if(p) spawnPokemon(p); }
  requestAnimationFrame(step);
  setInterval(rotate, 20000);
  window.addEventListener('resize', ()=>{});
})();