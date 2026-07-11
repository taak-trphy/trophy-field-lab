const app = document.getElementById('app');
const meta = document.getElementById('meta');
const menuButton = document.getElementById('menuButton');
const menuPanel = document.getElementById('menuPanel');
const menuScrim = document.getElementById('menuScrim');
let data;

const esc = (v = '') => String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const list = items => `<ul class="plain-list">${items.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
const viewHead = (kicker, title, lead='') => `<header class="view-head"><p class="view-kicker">${esc(kicker)}</p><h1>${esc(title)}</h1>${lead ? `<p class="view-lead">${esc(lead)}</p>` : ''}</header>`;
const zone = (label, title, body) => `<section class="zone"><p class="zone-label">${esc(label)}</p><div class="zone-content"><h2>${esc(title)}</h2>${body}</div></section>`;

function closeMenu() {
  menuPanel.classList.remove('open'); menuScrim.classList.remove('open'); menuButton.classList.remove('open');
  menuButton.setAttribute('aria-expanded','false'); menuPanel.setAttribute('aria-hidden','true');
}
function toggleMenu() {
  const open = !menuPanel.classList.contains('open');
  menuPanel.classList.toggle('open', open); menuScrim.classList.toggle('open', open); menuButton.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open)); menuPanel.setAttribute('aria-hidden', String(!open));
}
menuButton.addEventListener('click', toggleMenu); menuScrim.addEventListener('click', closeMenu);

function homeView() {
  return `${viewHead('OVERVIEW','ホーム','直近の結論、次回の検証、プロジェクト全体の状態。')}
    <section class="conclusion"><p class="label">今日の結論</p><h2>${esc(data.today.conclusion)}</h2><p class="basis">根拠：${esc(data.today.basis)}</p></section>
    ${zone('NEXT','次回試すこと', list(data.nextActions))}
    ${zone('FOUND','今回の発見', list(data.discoveries))}
    ${zone('STATUS','現在の状態', `<div class="metrics"><div class="metric"><strong>${data.project.sessionCount}</strong><span>記録済み釣行</span></div><div class="metric"><strong>${data.fields.reduce((a,b)=>a+b.observations,0)}</strong><span>フィールド観測</span></div></div>`)}
    ${zone('RULE','記録のルール', `<ul class="rule-list">${data.project.rules.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`)}`;
}

function fieldView() {
  return `${viewHead('FIELD DATABASE','フィールド','場所ごとの確認済み事項、成立条件、未解明点。')}
    ${data.fields.map(f => `<article class="record"><div class="record-head"><h2>${esc(f.name)}</h2><div class="record-meta">観測 ${f.observations}回</div></div><div class="tagline">${(f.tags||[]).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div><div class="record-grid"><div class="record-block"><h3>強い条件</h3><p>${esc(f.strong)}</p></div><div class="record-block"><h3>狙い</h3><p>${esc(f.target)}</p></div><div class="record-block"><h3>確認済み</h3>${list(f.known)}</div><div class="record-block"><h3>まだ分からないこと</h3>${list(f.unknown)}</div></div></article>`).join('')}`;
}

function strategyView() {
  const group = (title, items) => `<section class="strategy-block"><h2>${esc(title)}</h2>${items.map(i=>`<dl class="strategy-row"><dt>${esc(i.label)}</dt><dd>${esc(i.text)}</dd></dl>`).join('')}</section>`;
  return `${viewHead('STRATEGY','ストラテジー','潮回り、季節、水の状態から、場所とアプローチを絞る。')}
    ${group('今夜の即断', data.strategy.quick)}
    ${group('潮回り別', data.strategy.tide)}
    ${group('シーズン別', data.strategy.season)}
    ${group('見切り基準', data.strategy.exit)}`;
}

function operationView() {
  return `${viewHead('OPERATION','操作','K9を中心に、各ルアーの操作基準と次回課題を残す。')}
    ${zone('BASE','現在の基準セット', `<p>${esc(data.operation.currentSetup)}</p>`)}
    ${data.operation.skills.map(s=>`<div class="entry"><strong>${esc(s.name)}</strong><p>${esc(s.note)}</p><span class="status">${esc(s.state)}</span></div>`).join('')}`;
}

function tackleView() {
  return `${viewHead('TACKLE & MAINTENANCE','タックル','構成、整備履歴、使用保留事項を一つにまとめる。')}
    ${zone('SYSTEM','メインタックル', `<p>${esc(data.tackle.main)}</p>`)}
    ${zone('MAINTENANCE','メンテナンス', data.tackle.maintenance.map(m=>`<div class="entry"><time>${esc(m.date)}</time><strong>${esc(m.item)}</strong><p>${esc(m.status)}</p><span class="status">施工後 ${m.tripsSince}釣行</span></div>`).join(''))}
    ${zone('NOTE','管理メモ', list(data.tackle.notes))}`;
}

function logView() {
  return `${viewHead('FIELD LOG','ログ','釣果より、次回の再現性につながる事実を優先して残す。')}
    ${data.logs.map((l,i)=>`<article class="record"><div class="record-head"><h2>${esc(l.place)}</h2><div class="record-meta">#${String(data.logs.length-i).padStart(3,'0')}<br>${esc(l.date)}</div></div><div class="record-grid"><div class="record-block"><h3>結果</h3><p>${esc(l.result)}</p></div><div class="record-block"><h3>今日の結論</h3><p>${esc(l.conclusion)}</p></div></div></article>`).join('')}`;
}

const views = { home: homeView, field: fieldView, strategy: strategyView, operation: operationView, tackle: tackleView, log: logView };
function render(view='home') {
  document.querySelectorAll('.menu-panel button[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
  app.innerHTML = views[view](); closeMenu(); window.scrollTo({top:0,behavior:'instant'});
}
document.querySelector('.menu-panel nav').addEventListener('click', e=>{ const btn=e.target.closest('button[data-view]'); if(btn) render(btn.dataset.view); });

fetch('data.json',{cache:'no-store'}).then(r=>{if(!r.ok) throw new Error(`HTTP ${r.status}`); return r.json();}).then(json=>{
  data=json; meta.innerHTML=`更新 ${esc(data.project.updated)}<br>v${esc(data.project.version)}`; render('home');
}).catch(err=>{app.innerHTML=`<div class="error"><strong>データを読み込めませんでした。</strong><p>${esc(err.message)}</p></div>`;});
