const app = document.getElementById('app');
const meta = document.getElementById('meta');
let data;

const esc = (v = '') => String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const list = items => `<ul class="list">${items.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
const card = (title, body) => `<section class="card"><h2>${esc(title)}</h2>${body}</section>`;

function homeView() {
  return `
    <section class="hero">
      <p class="eyebrow">今日の結論</p>
      <h1>${esc(data.today.conclusion)}</h1>
      <p class="note">根拠：${esc(data.today.basis)}</p>
    </section>
    <div class="grid two">
      ${card('次回試すこと', list(data.nextActions))}
      ${card('今回の発見', list(data.discoveries))}
      ${card('現在の状態', `<div class="kpi"><div><strong>${data.project.sessionCount}</strong><span>記録済み釣行</span></div><div><strong>${data.fields.reduce((a,b)=>a+b.observations,0)}</strong><span>フィールド観測</span></div></div>`)}
      ${card('記録のルール', list(data.project.rules))}
    </div>`;
}

function fieldView() {
  return `<p class="section-title">フィールド別の確認済み事項と未解明点</p><div class="grid">${data.fields.map(f => card(f.name, `
    <div class="tag-row"><span class="tag">観測 ${f.observations}回</span></div>
    <h3>分かったこと</h3>${list(f.known)}
    <h3>まだ分からないこと</h3>${list(f.unknown)}
  `)).join('')}</div>`;
}

function k9View() {
  return `${card('現在の基準セット', `<p>${esc(data.k9.currentSetup)}</p>`)}
    <p class="section-title">操作技術</p>
    <div class="card">${data.k9.skills.map(s => `<div class="entry"><strong>${esc(s.name)}</strong><span class="status">${esc(s.state)}</span></div>`).join('')}</div>`;
}

function tackleView() {
  return `${card('メインタックル', `<p>${esc(data.tackle.main)}</p>`)}
    <p class="section-title">メンテナンス</p>
    <div class="card">${data.tackle.maintenance.map(m => `<div class="entry"><time>${esc(m.date)}</time><strong>${esc(m.item)}</strong><p>${esc(m.status)}</p><p class="small">施工後 ${m.tripsSince}釣行</p></div>`).join('')}</div>
    <p class="section-title">注意事項</p>${card('管理メモ', list(data.tackle.notes))}`;
}

function logView() {
  return `<p class="section-title">釣行記録</p><div class="card">${data.logs.map((l, i) => `<div class="entry"><time>#${String(data.logs.length-i).padStart(3,'0')} / ${esc(l.date)}</time><strong>${esc(l.place)}</strong><p>${esc(l.result)}</p><h3>今日の結論</h3><p>${esc(l.conclusion)}</p></div>`).join('')}</div>`;
}

const views = { home: homeView, field: fieldView, k9: k9View, tackle: tackleView, log: logView };
function render(view = 'home') {
  document.querySelectorAll('.bottom-nav button').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  app.innerHTML = views[view]();
  window.scrollTo({top:0, behavior:'instant'});
}

document.querySelector('.bottom-nav').addEventListener('click', e => {
  const btn = e.target.closest('button[data-view]');
  if (btn) render(btn.dataset.view);
});

fetch('data.json', {cache: 'no-store'})
  .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
  .then(json => {
    data = json;
    meta.innerHTML = `更新 ${esc(data.project.updated)}<br>v${esc(data.project.version)}`;
    render('home');
  })
  .catch(err => {
    app.innerHTML = `<div class="error"><strong>データを読み込めませんでした。</strong><p class="small">${esc(err.message)}。GitHub Pages公開後に再読み込みしてください。</p></div>`;
  });
