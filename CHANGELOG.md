# Changelog

## v0.8.4 — Casting & 2026-07-12 log refinement
- HOMEの「今日の結論」を、バット荷重とルアーの飛行姿勢に関する知見へ更新
- OPERATIONに「キャスティング」を追加
- 2026年7月12日の鮫洲橋ログへ、Hi使用時の強めのバックラッシュ2回と飛行姿勢の観測を追加
- K9 HiとLowの重量差によるキャストタイミングの違いを、次回検証項目として追加
- ロングスライドの「水を噛む姿勢」に関する知見を維持
- 誤って含まれていたROCKET関連の記録を削除


## v0.8.3 — Lure system categories
- OTHERを廃止し、手持ちルアーを役割別に再分類
- KLASH 9 Low / Hi と TiNY KLASH Lowを個別に整理
- TiNY KLASHはLowレッドヘッドのみ所持として反映
- GLIDE BAIT / CRANK BAIT / PENCIL BAIT / WAKE・SURFACE BAITを追加
- anolu FをCRANK BAITへ分類
- ルアー欄の補助見出しをLURE SYSTEMへ変更

## v0.8.2 — Tackle hierarchy refinement
- TACKLEの「現在のシステム」直下にあった重複サマリーを削除
- ROD / REEL / MAIN LINE / LEADER / LURE の個別情報から直接読み始められる構成に整理
- 既存の編集的なタイポグラフィと余白設計は維持

## v0.8.1 — Editorial Typography
- 各ページのファーストビュー見出しを `FIELD / FIELD STRATEGY / OPERATION / TACKLE / LOG` に統一
- フィールド詳細でも最初に `FIELD` を表示し、その下のコンテンツとして日本語の場所名を配置
- ページ導入部の余白とタイポグラフィを強化
- ページ状態保持、更新ボタン、ログタイトルなど既存機能を維持

# CHANGELOG

## v0.7.0 — Information Architecture & UX

### Added
- URL hash routing for HOME / FIELD / FIELD STRATEGY / OPERATION / TACKLE / LOG.
- Last-view restoration for iPhone home-screen launch and browser reload.
- Structured tackle system, lure library, field gear, and hold/check information.

### Changed
- Full-screen menu labels changed to English.
- Data refresh now preserves the current page and scroll position.
- TACKLE page rebuilt around the actual current equipment and maintenance workflow.

# CHANGELOG

## v0.6.8
- 釣行ログに、その日の象徴的な出来事を示すタイトルを追加
- ログ一覧ではタイトルを主役にし、場所・日付・結論を補助情報として整理
- ホーム画面の大きな「TROPHY / FIELD LAB」タイトルブロックを削除
- ヘッダーのブランド表示は維持し、ホームは「今日の結論」から始まる構成へ変更

## v0.6.7
- メニューに「ログ」を追加
- 釣行日ごとの「釣行アーカイブ」を新設
- すべて／月別で時系列ログを切り替え可能
- 各ログを開くと、結果・潮・水質・ベイト・ルアー操作を確認できる構成に変更
- スマホでは一覧性を保ちながら詳細を段階表示

## v0.6.6
- iPhoneホーム画面表示でUPDATEとMENUが改行される問題を修正
- スマホヘッダーを3列固定にし、セーフエリアとタップ領域を調整
- 「今日の結論」の文字サイズと行間をスマホ向けに調整

## v0.6.6
- 2026年7月9日の誤った約60cmキャッチ記録を削除し、K9 Low／ノーマルテール・モードBでロングスライドのコツを掴んだ実釣ログへ訂正
- 鮫洲橋でのシーバスキャッチを2026年6月18日の1匹のみとして整理
- 亀島川の極狭ピン検証ログは日付を「2026年7月某日」へ修正して保持
- ホームの「今日の結論」と勝島運河・鮫洲橋の知見／未解明項目を、訂正後の確定情報に更新
- CSS / JavaScriptのキャッシュバージョンを0.6.6へ更新

## v0.6.4
- 2026年7月8日：鮫洲橋、小潮上げ、澄み潮、マイクロイナッコと複数ボイルのノーフィッシュログを追加
- 現場での自作シャローリップ＋トランスファーBへの変更と、試した操作を詳細保存
- 2026年6月18日：鮫洲橋、中潮上げ止まり付近、K9 SIREN／トランスファーモードBへの着水直後の約60cm反応を追加
- 勝島運河・鮫洲橋の観測数と既知／未解明項目を更新

## v0.6.3
- メニュー名を「ストラテジー」から「フィールドストラテジー」へ変更
- ページ見出しも「フィールドストラテジー」に統一
- 「今夜の即断」を「現時点の見立て」へ変更し、リアルタイム情報との誤認を防止
- 説明文を「現在の仮説」から「現在の見立て」へ調整

## v0.6.2
- iPhoneホーム画面から復帰した際に `data.json` を自動再取得
- データ取得時にキャッシュを回避するタイムスタンプを付与
- ヘッダーにUPDATEボタンを追加
- 更新結果を画面右下の短い通知で表示
- CSS / JavaScriptにバージョン番号を付け、デザイン更新時の古い資産キャッシュを回避

## v0.6.1
- 2026年4月5日の座標ログを「多摩川・くじら池運動公園」として正式分類
- フィールド名、タグ、概要、未解明項目を更新
- ログのフィールド紐付けを `tamagawa-kujiraike` に変更

## v0.6.0
- 2026年4月22日：芝浦・港南エリアのタイニークラッシュ／足元デッドでのマルタウグイ反応を追加
- 2026年4月17日：K9 Low SIREN／大潮下げ5〜6分の表層リアバイトを追加
- 2026年4月5日：ジョイクロ168のデッドウォークで足元の雷魚反応を追加
- 各ログに緯度経度を保存
- 芝浦・港南フィールドの既知情報を更新
- 場所名未確定の座標ログ用フィールドを追加

## v0.5.0
- Editorial Redesign

## v0.8.1 — 2026-07-12
- 2026年7月12日の鮫洲橋朝マヅメ釣行を追加
- LowモードBの「水を噛む姿勢」を操作原理として更新
- Hi／ノーマルリップ／Vテール／デジ巻きの表層チェイスを追加
- 勝島・鮫洲橋の知見と未解明項目を更新
- PEにシュッ等のメンテナンス経過を1釣行へ更新
- 六郷・多摩川下流を現在のスタイルでは見送りに変更
- 第一京浜×山手通り付近の河川を調査候補として追加
