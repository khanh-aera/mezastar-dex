// ============ Pokédex Island ============
(async function(){
  const [poke, env] = await Promise.all([
    fetch('data/pokemon.json').then(r=>r.json()),
    fetch('data/enemies.json').then(r=>r.json()),
  ]);
  const typeChart = env.type_chart;
  const enemies = env.enemies;
  window.__POKE = poke;

  // ---- populate island count ----
  document.getElementById('island-count').textContent = poke.length + ' Pokémon';

  // ============ ISLAND: spawn sprites ============
  const layer = document.getElementById('sprites-layer');
  const sprites = [];

  function spawnSprites(){
    // subtle size by tier: superstars bigger
    poke.forEach((p, i) => {
      const el = document.createElement('div');
      el.className = 'sprite ' + (p.animated ? 'walk' : 'still');
      const scale = (p.tier && p.tier.includes('Superstar')) ? 1.35 : (p.grade >= 5 ? 1.15 : 1.0);
      el.style.width = (60 * scale) + 'px';
      el.style.height = (60 * scale) + 'px';
      el.style.zIndex = 3 + p.pe; // stronger on top
      const img = document.createElement('img');
      img.src = p.sprite;
      img.alt = p.name;
      img.draggable = false;
      el.appendChild(img);
      el.addEventListener('click', () => openPopup(p));
      layer.appendChild(el);
      sprites.push({ el, p, x: 0, y: 0, tx: 0, ty: 0, dir: 1, t: Math.random()*4000 });
    });
  }

  function layout(){
    const W = layer.clientWidth, H = layer.clientHeight;
    // place around campfire (center-bottom), spread lower area
    sprites.forEach(s => {
      if(!s._init){
        s._init = true;
        const ang = Math.random()*Math.PI*2;
        const r = (Math.random()*0.75 + 0.15) * Math.min(W,H);
        s.x = W/2 + Math.cos(ang)*r*0.85 - 30;
        s.y = H*0.5 + Math.sin(ang)*r*0.3 + H*0.08;
        s.vx = (Math.random()-0.5)*28;
        s.vy = (Math.random()-0.5)*20;
        s._nextDir = 2000;
        s._last = performance.now();
      }
      s.x = Math.max(8, Math.min(W-56, s.x));
      s.y = Math.max(H*0.32, Math.min(H-40, s.y));
    });
  }

  function step(now){
    sprites.forEach(s => {
      const W = layer.clientWidth, H = layer.clientHeight;
      if(!s._last) s._last = now;
      const dt = Math.min(0.05, (now - s._last)/1000); s._last = now;
      // occasional direction change
      s._nextDir -= dt*1000;
      if(s._nextDir <= 0){
        s.vx = (Math.random()-0.5)*32;
        s.vy = (Math.random()-0.5)*22;
        s._nextDir = 2500 + Math.random()*5000;
      }
      s.x += s.vx*dt;
      s.y += s.vy*dt;
      // keep inside island bounds
      if(s.x < 8){ s.x=8; s.vx=Math.abs(s.vx); }
      if(s.x > W-56){ s.x=W-56; s.vx=-Math.abs(s.vx); }
      if(s.y < H*0.32){ s.y=H*0.32; s.vy=Math.abs(s.vy); }
      if(s.y > H-40){ s.y=H-40; s.vy=-Math.abs(s.vy); }
      const flip = s.vx < -1 ? -1 : (s.vx > 1 ? 1 : s.dir);
      s.el.style.transform = `translate(${s.x}px,${s.y}px) scaleX(${flip})`;
    });
    requestAnimationFrame(step);
  }

  // stars
  function stars(){
    const c = document.querySelector('.sky-stars');
    for(let i=0;i<40;i++){
      const s = document.createElement('span');
      s.style.left = Math.random()*100 + '%';
      s.style.top = Math.random()*45 + '%';
      s.style.animationDelay = Math.random()*3 + 's';
      c.appendChild(s);
    }
  }

  // ============ WRAPPER: use transform-only positioning ============
  function wrapSprites(){
    // reposition absolutely using translate on fixed base
    sprites.forEach(s => { s.el.style.left='0'; s.el.style.top='0'; });
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
  navBtns.forEach(b => b.addEventListener('click', () => {
    navBtns.forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    const v = b.dataset.view;
    Object.entries(views).forEach(([k,el]) => el.classList.toggle('active', k===v));
    if(v==='grid') buildGrid();
  }));

  // ============ GRID ============
  function buildGrid(){
    const g = document.getElementById('grid');
    g.innerHTML = '';
    document.getElementById('grid-count').textContent = poke.length + ' tags collected';
    [...poke].sort((a,b)=>b.pe-a.pe).forEach(p=>{
      const c = document.createElement('div');
      c.className = 'grid-card';
      c.innerHTML = `<img src="${p.sprite}" alt=""><div class="g-name">${p.name}</div><div class="g-pe">PE ${p.pe}</div>`;
      c.addEventListener('click', ()=>openPopup(p));
      g.appendChild(c);
    });
  }

  // ============ BATTLE ============
  const slots = document.querySelectorAll('.enemy-slot');
  const pickerBackdrop = document.getElementById('picker-backdrop');
  const pickerList = document.getElementById('picker-list');
  const pickerSearch = document.getElementById('picker-search');
  let enemyTeam = [null,null,null];
  let pickingFor = 0;

  slots.forEach((s,i) => s.addEventListener('click', () => {
    pickingFor = i; openPicker();
  }));

  function openPicker(){
    pickerBackdrop.classList.remove('hidden');
    pickerSearch.value = '';
    renderPicker('');
    pickerSearch.focus();
  }
  function renderPicker(q){
    q = q.toLowerCase();
    pickerList.innerHTML = '';
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
    s.innerHTML = `<span class="p-types" style="justify-content:center">${(e.types||[]).map(t=>`<span class="type ${t}">${t}</span>`).join('')}</span><span class="enemy-name">${e.name}</span>`;
    pickerBackdrop.classList.add('hidden');
    computeCounters();
  }

  // ---- type effectiveness: my types vs enemy types ----
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
        // enemy attacking me
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
      enemyTeam.forEach(e => {
        const r = scoreType(p, e);
        tot += r.sc; whys = whys.concat(r.why);
      });
      // PE tiebreak
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
  spawnSprites();
  stars();
  layout();
  wrapSprites();
  requestAnimationFrame(step);
  window.addEventListener('resize', layout);
})();