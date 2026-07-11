const app = document.getElementById('app');
const meta = document.getElementById('meta');
const menuButton = document.getElementById('menuButton');
const menuPanel = document.getElementById('menuPanel');
const menuScrim = document.getElementById('menuScrim');
let data;
let currentView = 'home';
let selectedFieldId = null;
let activeFilters = { season: 'すべて', tide: 'すべて', condition: 'すべて' };

const esc = (v = '') => String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const list = items => `<ul class="plain-list">${items.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
const viewHead = (kicker, title, lead='') => `<header class="view-head"><p class="view-kicker">${esc(kicker)}</p><h1>${esc(title)}</h1>${lead ? `<p class="view-lead">${esc(lead)}</p>` : ''}</header>`;
const zone = (label, title, body) => `<section class="zone"><p class="zone-label">${esc(label)}</p><div class="zone-content"><h2>${esc(title)}</h2>${body}</div></section>`;
const fieldById = id => data.fields.find(f => f.id === id);
const logsForField = id => data.logs.filter(l => l.fieldId === id).sort((a,b)=>b.date.localeCompare(a.date));

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

function logCard(l) {
  return `<article class="log-entry"><div class="log-entry-head"><time>${esc(l.date)}<br>${esc(l.time || '')}</time><div><h3>${esc(l.place)}</h3><div class="tagline">${[l.season,l.tide,l.phase,l.water,l.bait].filter(Boolean).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div><dl class="log-facts"><dt>釣り方</dt><dd>${esc(l.method)}</dd><dt>結果</dt><dd>${esc(l.result)}</dd></dl><p class="log-conclusion"><strong>今日の結論：</strong>${esc(l.conclusion)}</p></div></div></article>`;
}

function homeView() {
  const recent = [...data.logs].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3);
  return `${viewHead('OVERVIEW','ホーム','直近の結論、次回の検証、プロジェクト全体の状態。')}
    <section class="conclusion"><p class="label">今日の結論</p><h2>${esc(data.today.conclusion)}</h2><p class="basis">根拠：${esc(data.today.basis)}</p></section>
    ${zone('NEXT','次回試すこと', list(data.nextActions))}
    ${zone('FOUND','今回の発見', list(data.discoveries))}
    ${zone('STATUS','現在の状態', `<div class="metrics"><div class="metric"><strong>${data.logs.length}</strong><span>記録済み釣行</span></div><div class="metric"><strong>${data.fields.reduce((a,b)=>a+b.observations,0)}</strong><span>フィールド観測</span></div></div>`)}
    <div class="section-title"><h2>最近の釣行</h2><span>日付順</span></div>${recent.map(logCard).join('')}
    ${zone('RULE','記録のルール', `<ul class="rule-list">${data.project.rules.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`)}`;
}

function fieldIndexView() {
  return `${viewHead('FIELD DATABASE','フィールド','場所ごとのストラテジーと、過去の釣行を同じページで確認する。')}
    <section class="field-index">${data.fields.map(f => `<button class="field-link" data-field-id="${esc(f.id)}"><strong>${esc(f.name)}</strong><span>${logsForField(f.id).length} LOG / 観測 ${f.observations}</span></button>`).join('')}</section>`;
}

function fieldDetailView(fieldId) {
  const f = fieldById(fieldId);
  if (!f) return fieldIndexView();
  const logs = logsForField(fieldId);
  const seasonRows = (f.seasonStrategy || []).map(i=>`<dl class="strategy-row"><dt>${esc(i.label)}</dt><dd>${esc(i.text)}</dd></dl>`).join('');
  return `<div class="back-row"><button class="text-button" data-back-field>← フィールド一覧</button></div>
    ${viewHead('FIELD DETAIL',f.name,`${f.summary}　観測 ${f.observations}回。`)}
    <div class="tagline">${(f.tags||[]).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>
    ${zone('CONDITION','強い条件', `<p>${esc(f.strong)}</p>`)}
    ${zone('TARGET','狙い', `<p>${esc(f.target)}</p>`)}
    <section class="strategy-block"><h2>シーズン別ストラテジー</h2>${seasonRows || '<p class="empty">まだ記録がありません。</p>'}</section>
    <div class="record-grid"><div class="record-block"><h3>分かったこと</h3>${list(f.known)}</div><div class="record-block"><h3>まだ分からないこと</h3>${list(f.unknown)}</div></div>
    <div class="section-title"><h2>この場所の釣行履歴</h2><span>新しい順</span></div>
    ${logs.length ? logs.map(logCard).join('') : '<p class="empty">この場所の釣行ログはまだありません。</p>'}`;
}

function fieldView() { return selectedFieldId ? fieldDetailView(selectedFieldId) : fieldIndexView(); }

function strategyInfo() {
  const group = (title, items) => `<section class="strategy-block"><h2>${esc(title)}</h2>${items.map(i=>`<dl class="strategy-row"><dt>${esc(i.label)}</dt><dd>${esc(i.text)}</dd></dl>`).join('')}</section>`;
  return `${group('今夜の即断', data.strategy.quick)}${group('潮回り別', data.strategy.tide)}${group('シーズン別', data.strategy.season)}${group('見切り基準', data.strategy.exit)}`;
}
function filterButtons(key, values) {
  return `<div class="filter-row">${values.map(v=>`<button class="filter-button ${activeFilters[key]===v?'active':''}" data-filter-key="${key}" data-filter-value="${esc(v)}">${esc(v)}</button>`).join('')}</div>`;
}
function filteredLogs() {
  return [...data.logs].filter(l =>
    (activeFilters.season === 'すべて' || l.season === activeFilters.season) &&
    (activeFilters.tide === 'すべて' || l.tide === activeFilters.tide) &&
    (activeFilters.condition === 'すべて' || (l.conditions || []).includes(activeFilters.condition))
  ).sort((a,b)=>b.date.localeCompare(a.date));
}
function strategyView() {
  const seasons = ['すべて', ...new Set(data.logs.map(l=>l.season).filter(Boolean))];
  const tides = ['すべて', ...new Set(data.logs.map(l=>l.tide).filter(Boolean))];
  const conditions = ['すべて', ...new Set(data.logs.flatMap(l=>l.conditions || []))];
  const logs = filteredLogs();
  return `${viewHead('STRATEGY','ストラテジー','条件から釣り場と過去ログを逆引きする。')}
    ${strategyInfo()}
    <div class="section-title"><h2>条件から過去ログを見る</h2><span>${logs.length}件</span></div>
    <section class="filter-group"><h2>季節</h2>${filterButtons('season', seasons)}</section>
    <section class="filter-group"><h2>潮回り</h2>${filterButtons('tide', tides)}</section>
    <section class="filter-group"><h2>条件</h2>${filterButtons('condition', conditions)}</section>
    ${logs.length ? logs.map(logCard).join('') : '<p class="empty">該当する釣行ログはありません。</p>'}`;
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

const views = { home: homeView, field: fieldView, strategy: strategyView, operation: operationView, tackle: tackleView };
function render(view=currentView) {
  currentView = view;
  document.querySelectorAll('.menu-panel button[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
  app.innerHTML = views[view](); closeMenu(); window.scrollTo({top:0,behavior:'instant'});
}
document.querySelector('.menu-panel nav').addEventListener('click', e=>{ const btn=e.target.closest('button[data-view]'); if(btn){ if(btn.dataset.view !== 'field') selectedFieldId = null; render(btn.dataset.view); } });
app.addEventListener('click', e=>{
  const fieldBtn = e.target.closest('[data-field-id]');
  if(fieldBtn){ selectedFieldId = fieldBtn.dataset.fieldId; render('field'); return; }
  if(e.target.closest('[data-back-field]')){ selectedFieldId = null; render('field'); return; }
  const filterBtn = e.target.closest('[data-filter-key]');
  if(filterBtn){ activeFilters[filterBtn.dataset.filterKey] = filterBtn.dataset.filterValue; render('strategy'); }
});

fetch('data.json',{cache:'no-store'}).then(r=>{if(!r.ok) throw new Error(`HTTP ${r.status}`); return r.json();}).then(json=>{
  data=json; meta.innerHTML=`更新 ${esc(data.project.updated)}<br>v${esc(data.project.version)}`; render('home');
}).catch(err=>{app.innerHTML=`<div class="error"><strong>データを読み込めませんでした。</strong><p>${esc(err.message)}</p></div>`;});
