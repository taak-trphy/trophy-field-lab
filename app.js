const app=document.getElementById('app');const meta=document.getElementById('meta');const refreshButton=document.getElementById('refreshButton');const updateToast=document.getElementById('updateToast');const menuButton=document.getElementById('menuButton');const menuPanel=document.getElementById('menuPanel');const menuScrim=document.getElementById('menuScrim');const menuClose=document.getElementById('menuClose');let data;let currentView='home';let selectedFieldId=null;let activeFilters={season:'すべて',tide:'すべて',condition:'すべて'};let activeLogMonth='すべて';
const esc=(v='')=>String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const fieldById=id=>data.fields.find(f=>f.id===id);const logsForField=id=>data.logs.filter(l=>l.fieldId===id).sort((a,b)=>b.date.localeCompare(a.date));
const lineList=items=>`<ul class="line-list">${(items||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
const intro=(index,title,lead)=>`<header class="view-intro"><div class="topline"><p class="eyebrow">${esc(index)} / TROPHY FIELD LAB</p><p class="eyebrow">UPDATED ${esc(data.project.updated)}</p></div><h1>${esc(title)}</h1>${lead?`<p>${esc(lead)}</p>`:''}</header>`;
function closeMenu(){menuPanel.classList.remove('open');menuScrim.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuPanel.setAttribute('aria-hidden','true')}function toggleMenu(){const o=!menuPanel.classList.contains('open');menuPanel.classList.toggle('open',o);menuScrim.classList.toggle('open',o);menuButton.setAttribute('aria-expanded',String(o));menuPanel.setAttribute('aria-hidden',String(!o))}menuButton.addEventListener('click',toggleMenu);menuClose.addEventListener('click',closeMenu);menuScrim.addEventListener('click',closeMenu);
function logRow(l){const tags=[l.season,l.tide,l.phase,l.water,l.bait].filter(Boolean);return `<article class="log-row"><time>${esc(l.dateLabel||l.date)}${l.time?`<br>${esc(l.time)}`:''}</time><div><p class="log-place">${esc(l.place)}</p><h3>${esc(l.title||l.place)}</h3><p class="log-summary">${esc(l.conclusion)}</p><div class="log-tags">${tags.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div></div><div class="log-result"><span>結果</span><strong>${esc(l.result)}</strong><span>${esc(l.method)}</span></div></article>`}
function section(no,title,body,count=''){return `<section class="section"><div class="section-head"><span class="section-no">${esc(no)}</span><h2>${esc(title)}</h2><span class="section-count">${esc(count)}</span></div>${body}</section>`}
function homeView(){const recent=[...data.logs].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3);const obs=data.fields.reduce((a,b)=>a+b.observations,0);return `<section class="statement home-statement"><div class="statement-label">TODAY'S CONCLUSION</div><div><h2>${esc(data.today.conclusion)}</h2><p>根拠：${esc(data.today.basis)}</p></div></section>${section('01','次回試すこと',`<div class="split-list">${lineList(data.nextActions)}${lineList(data.discoveries)}</div>`,'NEXT / FOUND')}${section('02','現在の状態',`<div class="metric-strip"><div class="metric"><strong>${data.logs.length}</strong><span>記録済み釣行</span></div><div class="metric"><strong>${data.fields.length}</strong><span>登録フィールド</span></div><div class="metric"><strong>${obs}</strong><span>観測回数</span></div></div>`,'STATUS')}${section('03','最近の釣行',`<div class="log-list">${recent.map(logRow).join('')}</div>`,'DATE ORDER')}${section('04','記録のルール',lineList(data.project.rules),'PROJECT RULES')}`}
function fieldIndexView(){return `${intro('02','FIELD','場所ごとの現在の知見、未解明点、シーズン別ストラテジー、過去ログを同じ導線で見る。')}<section class="section"><div class="editorial-list">${data.fields.map((f,i)=>`<button class="editorial-row" data-field-id="${esc(f.id)}"><span class="index">${String(i+1).padStart(2,'0')}</span><div><strong>${esc(f.name)}</strong><p>${esc(f.summary)}</p></div><span class="meta-right">${logsForField(f.id).length} LOG<br>${f.observations} OBS.</span></button>`).join('')}</div></section>`}
function fieldDetailView(id){const f=fieldById(id);if(!f)return fieldIndexView();const logs=logsForField(id);return `<div class="back-row"><button class="text-button" data-back-field>← FIELD INDEX</button></div>${intro('02','FIELD','場所ごとの観測と実釣記録。')}<section class="field-identity"><p class="eyebrow">FIELD PROFILE</p><h2>${esc(f.name)}</h2><p>${esc(f.summary)}</p></section><div class="field-stats"><div class="field-stat"><b>${f.observations}</b><span>観測回数</span></div><div class="field-stat"><b>${logs.length}</b><span>関連ログ</span></div><div class="field-stat"><b>${esc(f.strong.split('。')[0])}</b><span>強い条件</span></div><div class="field-stat"><b>${(f.tags||[])[0]||'-'}</b><span>分類</span></div></div>${section('01','現在の狙い',`<div class="knowledge-grid"><div class="knowledge-col"><h3>強い条件</h3><p>${esc(f.strong)}</p></div><div class="knowledge-col"><h3>狙い</h3><p>${esc(f.target)}</p></div></div>`)}${section('02','シーズン別ストラテジー',`<dl class="strategy-table">${(f.seasonStrategy||[]).map(i=>`<div class="strategy-row"><dt>${esc(i.label)}</dt><dd>${esc(i.text)}</dd></div>`).join('')}</dl>`)}${section('03','知見と未解明',`<div class="knowledge-grid"><div class="knowledge-col"><h3>分かったこと</h3>${lineList(f.known)}</div><div class="knowledge-col"><h3>まだ分からないこと</h3>${lineList(f.unknown)}</div></div>`)}${section('04','この場所の釣行履歴',logs.length?`<div class="log-list">${logs.map(logRow).join('')}</div>`:'<p>この場所の釣行ログはまだありません。</p>','NEWEST FIRST')}`}
function fieldView(){return selectedFieldId?fieldDetailView(selectedFieldId):fieldIndexView()}
function strategyTable(title,items){return `<section class="section"><div class="section-head"><span class="section-no">—</span><h2>${esc(title)}</h2></div><dl class="strategy-table">${items.map(i=>`<div class="strategy-row"><dt>${esc(i.label)}</dt><dd>${esc(i.text)}</dd></div>`).join('')}</dl></section>`}
function filterButtons(key,values){return `<div class="filter-row">${values.map(v=>`<button class="filter-button ${activeFilters[key]===v?'active':''}" data-filter-key="${key}" data-filter-value="${esc(v)}">${esc(v)}</button>`).join('')}</div>`}
function filteredLogs(){return [...data.logs].filter(l=>(activeFilters.season==='すべて'||l.season===activeFilters.season)&&(activeFilters.tide==='すべて'||l.tide===activeFilters.tide)&&(activeFilters.condition==='すべて'||(l.conditions||[]).includes(activeFilters.condition))).sort((a,b)=>b.date.localeCompare(a.date))}
function strategyView(){const seasons=['すべて',...new Set(data.logs.map(l=>l.season).filter(Boolean))];const tides=['すべて',...new Set(data.logs.map(l=>l.tide).filter(Boolean))];const conditions=['すべて',...new Set(data.logs.flatMap(l=>l.conditions||[]))];const logs=filteredLogs();return `${intro('03','FIELD STRATEGY','条件を入口にして、過去の実釣ログと現在の見立てへ戻る。')}${strategyTable('現時点の見立て',data.strategy.quick)}${strategyTable('潮回り別',data.strategy.tide)}${strategyTable('シーズン別',data.strategy.season)}<section class="section"><div class="section-head"><span class="section-no">04</span><h2>条件から過去ログを見る</h2><span class="section-count">${logs.length} LOG</span></div><div class="filter-block"><h3>季節</h3>${filterButtons('season',seasons)}</div><div class="filter-block"><h3>潮回り</h3>${filterButtons('tide',tides)}</div><div class="filter-block"><h3>条件</h3>${filterButtons('condition',conditions)}</div><div class="log-list">${logs.length?logs.map(logRow).join(''):'<p>該当ログはありません。</p>'}</div></section>`}
function operationView(){return `${intro('04','OPERATION','K9を中心に、各ルアーの操作基準と未解決課題を記録する。')}${section('01','現在の基準セット',`<p>${esc(data.operation.currentSetup)}</p>`)}<section class="section"><div class="section-head"><span class="section-no">02</span><h2>操作項目</h2><span class="section-count">${data.operation.skills.length} ITEMS</span></div><div class="entry-list">${data.operation.skills.map(s=>`<div class="entry"><strong>${esc(s.name)}</strong><p>${esc(s.note)}</p><span class="status">${esc(s.state)}</span></div>`).join('')}</div></section>`}
function tackleView(){return `${intro('05','TACKLE','現在のシステム、ルアー構成、フィールドギア、整備履歴を一つにまとめる。')}${section('01','現在のシステム',`<div class="spec-grid">${data.tackle.system.map(i=>`<div class="spec-item"><span>${esc(i.label)}</span><strong>${esc(i.name)}</strong><p>${esc(i.note)}</p></div>`).join('')}</div>`,'CURRENT SYSTEM')}${section('02','ルアー構成',`<div class="tackle-groups">${data.tackle.lures.map(g=>`<div class="tackle-group"><span>${esc(g.group)}</span><strong>${esc(g.items)}</strong><p>${esc(g.note)}</p></div>`).join('')}</div>`,'LURE SYSTEM')}${section('03','フィールドギア',`<div class="entry-list">${data.tackle.fieldGear.map(g=>`<div class="entry"><strong>${esc(g.item)}</strong><p>${esc(g.note)}</p><span class="status">${esc(g.status)}</span></div>`).join('')}</div>`,'CARRY SYSTEM')}<section class="section"><div class="section-head"><span class="section-no">04</span><h2>メンテナンス</h2><span class="section-count">MAINTENANCE</span></div><div class="entry-list">${data.tackle.maintenance.map(m=>`<div class="entry"><strong>${esc(m.item)}</strong><p>${esc(m.date)} / ${esc(m.status)}</p>${m.note?`<p>${esc(m.note)}</p>`:''}<span class="status">${esc(m.counter||(`施工後 ${m.tripsSince}釣行`))}</span></div>`).join('')}</div></section>${section('05','使用保留・確認事項',lineList(data.tackle.holds),'HOLD / CHECK')}`}
function logMonthKey(l){if((l.dateLabel||'').includes('7月某日'))return '2026-07';return String(l.date||'').slice(0,7)}
function logArchiveItem(l,index){const tags=[l.tide,l.phase,l.water,l.bait].filter(v=>v&&v!=='記録なし');return `<details class="archive-item"><summary><span class="archive-index">${String(index+1).padStart(2,'0')}</span><time>${esc(l.dateLabel||l.date)}${l.time&&l.time!=='記録なし'?` / ${esc(l.time)}`:''}</time><div><strong>${esc(l.title||l.place)}</strong><span class="archive-place">${esc(l.place)}</span><p>${esc(l.conclusion)}</p></div><span class="archive-toggle">＋</span></summary><div class="archive-detail"><dl><div><dt>結果</dt><dd>${esc(l.result)}</dd></div><div><dt>潮・タイミング</dt><dd>${esc([l.tide,l.phase].filter(v=>v&&v!=='記録なし').join(' / ')||'記録なし')}</dd></div><div><dt>水質・ベイト</dt><dd>${esc([l.water,l.bait].filter(v=>v&&v!=='記録なし').join(' / ')||'記録なし')}</dd></div><div><dt>ルアー・操作</dt><dd>${esc(l.method||'記録なし')}</dd></div></dl>${tags.length?`<div class="log-tags">${tags.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>`:''}</div></details>`}
function logView(){const all=[...data.logs].sort((a,b)=>b.date.localeCompare(a.date));const months=['すべて',...new Set(all.map(logMonthKey))];const logs=activeLogMonth==='すべて'?all:all.filter(l=>logMonthKey(l)===activeLogMonth);return `${intro('06','LOG','釣りに行った日ごとに、条件・操作・結果・その日の結論を時系列で読み返す。')}<section class="section archive-filter"><div class="section-head"><span class="section-no">01</span><h2>日付から見る</h2><span class="section-count">${logs.length} LOG</span></div><div class="month-tabs">${months.map(m=>`<button class="month-tab ${activeLogMonth===m?'active':''}" data-log-month="${esc(m)}">${m==='すべて'?'すべて':m.replace('-',' / ')}</button>`).join('')}</div><div class="archive-list">${logs.map(logArchiveItem).join('')}</div></section>`}

const views={home:homeView,field:fieldView,strategy:strategyView,operation:operationView,tackle:tackleView,log:logView};
const validViews=new Set(Object.keys(views));
function routeString(view=currentView,fieldId=selectedFieldId){return view==='field'&&fieldId?`#field/${encodeURIComponent(fieldId)}`:`#${view}`}
function readRoute(){
  const raw=(window.location.hash||localStorage.getItem('trophyLastRoute')||'#home').replace(/^#/,'');
  const [viewRaw,fieldRaw]=raw.split('/');
  const view=validViews.has(viewRaw)?viewRaw:'home';
  return {view,fieldId:view==='field'&&fieldRaw?decodeURIComponent(fieldRaw):null};
}
function saveRoute(){const route=routeString();localStorage.setItem('trophyLastRoute',route)}
function render(view=currentView,{scroll=true,updateRoute=true}={}){
  currentView=validViews.has(view)?view:'home';
  document.querySelectorAll('.menu-panel button[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===currentView));
  app.innerHTML=views[currentView]();
  closeMenu();
  if(updateRoute){
    const next=routeString();
    if(window.location.hash!==next)history.pushState(null,'',next);
    saveRoute();
  }
  if(scroll)window.scrollTo({top:0,behavior:'instant'});
}
function navigate(view,{fieldId=null,replace=false}={}){
  currentView=validViews.has(view)?view:'home';
  selectedFieldId=currentView==='field'?fieldId:null;
  const next=routeString(currentView,selectedFieldId);
  if(replace)history.replaceState(null,'',next);else if(window.location.hash!==next)history.pushState(null,'',next);
  saveRoute();
  render(currentView,{scroll:true,updateRoute:false});
}
function restoreRoute({replace=false,scroll=true}={}){
  const route=readRoute();
  currentView=route.view;
  selectedFieldId=route.fieldId;
  if(replace&&!window.location.hash)history.replaceState(null,'',routeString());
  render(currentView,{scroll,updateRoute:false});
  saveRoute();
}
document.querySelector('.menu-panel nav').addEventListener('click',e=>{const b=e.target.closest('button[data-view]');if(b)navigate(b.dataset.view)});
document.addEventListener('click',e=>{const l=e.target.closest('[data-view-link]');if(l){e.preventDefault();navigate(l.dataset.viewLink)}});
app.addEventListener('click',e=>{
  const f=e.target.closest('[data-field-id]');if(f){navigate('field',{fieldId:f.dataset.fieldId});return}
  if(e.target.closest('[data-back-field]')){navigate('field');return}
  const b=e.target.closest('[data-filter-key]');if(b){activeFilters[b.dataset.filterKey]=b.dataset.filterValue;render('strategy',{scroll:false});return}
  const m=e.target.closest('[data-log-month]');if(m){activeLogMonth=m.dataset.logMonth;render('log',{scroll:false})}
});
window.addEventListener('popstate',()=>{if(data)restoreRoute({scroll:true})});
window.addEventListener('hashchange',()=>{if(data)restoreRoute({scroll:true})});
let toastTimer;
function showToast(message){updateToast.textContent=message;updateToast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>updateToast.classList.remove('show'),1800)}
function updateMeta(){meta.innerHTML=`UPDATED ${esc(data.project.updated)}<br>V${esc(data.project.version)}`}
async function loadData({initial=false,notify=false}={}){
  const scrollY=window.scrollY;
  refreshButton.classList.add('loading');refreshButton.disabled=true;
  try{
    const r=await fetch(`data.json?v=${Date.now()}`,{cache:'no-store',headers:{'Cache-Control':'no-cache'}});
    if(!r.ok)throw new Error(`HTTP ${r.status}`);
    const next=await r.json();
    const previousVersion=data?.project?.version;const previousUpdated=data?.project?.updated;
    data=next;updateMeta();
    if(initial){restoreRoute({replace:true,scroll:true})}
    else{render(currentView,{scroll:false,updateRoute:false});requestAnimationFrame(()=>window.scrollTo(0,scrollY));if(notify)showToast(previousVersion!==data.project.version||previousUpdated!==data.project.updated?'最新版に更新しました':'最新の状態です')}
    refreshButton.classList.add('updated');setTimeout(()=>refreshButton.classList.remove('updated'),1200)
  }catch(err){
    if(initial)app.innerHTML=`<div class="error"><strong>データを読み込めませんでした。</strong><p>${esc(err.message)}</p></div>`;
    else showToast('更新を確認できませんでした')
  }finally{refreshButton.classList.remove('loading');refreshButton.disabled=false}
}
refreshButton.addEventListener('click',()=>loadData({notify:true}));
window.addEventListener('pageshow',()=>{if(data)loadData()});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&data)loadData()});
const currentBuild='0.8.6';
if(sessionStorage.getItem('trophyBuild')!==currentBuild){sessionStorage.setItem('trophyBuild',currentBuild)}
loadData({initial:true});
