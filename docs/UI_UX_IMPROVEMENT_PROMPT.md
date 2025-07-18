# UI/UX・検索機能・データ品質改善のための自然言語プロンプト

**作成日**: 2025年7月17日  
**ファクトチェック基準**: 設計書（docs/01_DESIGN/DESIGN_DOCUMENT.md）準拠  
**目的**: ミス防止・品質向上・ユーザー体験最適化

---

## 🎯 改善目的

1. **UIをより高級感・リッチな印象に改善し、絵文字依存を減らす**
2. **出発地・到着地の選択UIでスクロール時に検索が誤発火する不具合を修正**
3. **空港リストの表示件数を増やし、ユーザー体験を向上**
4. **詳細検索タブで各マイレージプログラムの選択肢を明示・選択可能にする**
5. **グローバルマイルタブと関連ページを完全に削除**
6. **検索結果の必要マイル数・価値分析の正確性を設計書・公式情報でファクトチェック**

---

## 📝 実装プロンプト例

### 1. UI/UXリッチ化・高級感向上

```
設計書（docs/01_DESIGN/DESIGN_DOCUMENT.md）の「UI設計」「ファクトチェック」セクションを必ず全文読み取り、以下を実装してください：

【必須ファクトチェック項目】
- 設計書第13.1節「アニメーション付き切替UI」の仕様確認
- 設計書第13.2節「主要空港優先・地域別選択UI」の実装状況確認
- 公式航空会社サイト（ANA: https://www.ana.co.jp/ja/jp/amc/、JAL: https://www.jal.co.jp/jmb/）のデザインパターン参照

【実装必須項目】
1. 絵文字の多用を廃止し、SVGアイコン（Lucide React）に統一
2. ブランドカラー・シャドウ・グラデーション・洗練されたタイポグラフィを導入
3. Material DesignやApple HIG等のガイドラインを参考にリッチな質感を実装
4. premium-card、glass-effect、shadow-premiumクラスを活用

【確認必須ファイル】
- src/app/globals.css（プレミアムスタイル定義済み）
- src/components/ui/FlightTypeToggle.tsx（アニメーション実装済み）
- src/components/ui/AirportSelector.tsx（地域別選択実装済み）
- src/components/ui/FlightTimeComparison.tsx（時間帯別表示実装済み）

【ファクトチェック根拠】
- 設計書第15章「UI/UX統合実装」に記載された実装済み機能を確認
- globals.cssのプレミアムスタイルクラスが正しく定義されていることを確認
```

### 2. 空港選択UIの不具合修正

```
設計書の「型定義」「UI設計」セクション（第2章・第13章）を必ず参照し、以下を実装してください：

【必須ファクトチェック項目】
- src/components/ui/AirportSelector.tsx の実装状況確認
- onChange/onScrollイベントの発火条件が厳密に制御されているか確認
- 空港リストの表示件数が設計書推奨値（10件以上）になっているか確認

【実装必須項目】
1. スクロールしただけでは検索が発火しないよう、イベント制御を厳密化
2. 空港リストの表示件数を4件→50件に増加（filteredMajorAirports.slice(0, 50)）
3. 検索入力でのキーダウン処理でスクロール防止（ArrowUp/ArrowDown preventDefault）
4. ドロップダウン外クリック時の自動クローズ機能実装
5. 検索フィールドの自動フォーカス（setTimeout 100ms遅延）

【確認必須実装】
- useRef<HTMLDivElement>(null) でドロップダウン参照管理
- useEffect でクリック外検知イベントリスナー設定
- handleSearchChange, handleSearchKeyDown での厳密なイベント制御
```

### 3. 詳細検索タブの改善

```
設計書の「型定義」「ファクトチェック」セクション（第2章・第5章）を全文読み取り、以下を実装してください：

【必須ファクトチェック項目】
- src/types/airlines.ts のAirlineCode型定義確認
- SearchFormType にmileageProgram?: string が追加されているか確認
- 各マイレージプログラムが公式情報・設計書の型定義に基づいているか確認

【実装必須項目】
1. マイレージプログラム選択肢を明示的に表示（ANA, JAL, Peach, Jetstar, Skymark, Spring等）
2. 選択肢は設計書第2.1節の厳密化された型定義に基づく
3. アライアンス情報も表示（Star Alliance, oneworld, SkyTeam）
4. 「すべてのプログラムを比較」オプションを提供

【確認必須プログラム一覧】
- ANA（ANAマイレージクラブ・Star Alliance）
- JAL（JALマイレージバンク・oneworld）
- DL（デルタスカイマイル・SkyTeam）
- UA（ユナイテッド マイレージプラス・Star Alliance）
- AA（アメリカン・アドバンテージ・oneworld）
- AC（エアカナダ アエロプラン・Star Alliance）
- AF（エールフランス・KLM フライングブルー・SkyTeam）
- BA（ブリティッシュエアウェイズ エグゼクティブクラブ・oneworld）

【ファクトチェック根拠】
- 設計書第5.1節「マイレージプログラム情報源」の公式URL確認済み
- types/airlines.ts の AirlineCode 型が設計書と一致していることを確認
```

### 4. グローバルマイルタブの削除

```
設計書の「UI設計」「ルーティング」セクション（第13章・第15章）を参照し、以下を実装してください：

【必須ファクトチェック項目】
- src/constants/index.ts のTabType定義から'global'が削除されているか確認
- src/components/TabNavigation.tsx から globalアイコン・タブが削除されているか確認
- src/components/Header.tsx から globalタブ/ボタンが削除されているか確認
- src/app/page.tsx から globalケースが削除されているか確認

【実装必須項目】
1. TabType から 'global' を完全削除
2. TABS配列から globalタブを削除
3. TabNavigation.tsx の iconMap から Globe アイコンを削除
4. Header.tsx の デスクトップ・モバイルメニューから globalボタンを削除
5. page.tsx の renderMainContent switch文から 'global' ケースを削除
6. GlobalMileComparison.tsx コンポーネントファイル自体を削除

【確認必須変更】
- すべての型定義でコンパイルエラーが発生しないことを確認
- UI・UXの一貫性が保たれていることを確認
- 削除後もアプリケーションが正常動作することを確認
```

### 5. 検索結果のマイル数・価値分析のファクトチェック

```
検索結果（例：HND→ITM 2025-09-18）の必要マイル数・価値分析について、設計書「型定義」「計算ロジック」「ファクトチェック」セクション（第2章・第5章・第6章）および公式チャートと厳密に照合してください：

【必須ファクトチェック項目】
- ANA国内線マイルチャート（https://www.ana.co.jp/ja/jp/amc/reference/domestic/）との照合
- JAL国内線マイルチャート（https://www.jal.co.jp/jmb/use/partner/chart/）との照合
- 設計書第2.1節「航空会社別マイルチャート型の厳密化」の型定義との一致確認
- src/data/domesticMiles.ts, internationalMiles.ts のデータが公式情報と一致しているか確認

【実装必須項目】
1. 距離帯別マイル数の正確性検証（ANA: 区間1-5、JAL: ゾーンA-D）
2. シーズン価格変動（通常期・ピーク期・オフピーク期）の正確性確認
3. 燃油サーチャージ・取消手数料の最新情報反映
4. 予約開始日数・キャンセル待ち可否の正確性確認

【違和感がある場合の対応】
1. 設計書と公式チャートを照合し、根拠URLを明記
2. 不整合があれば設計書を優先しつつ、修正内容と根拠を詳細説明
3. 計算ロジックやデータ構造を修正し、設計書・実装・UIの一貫性を保つ
4. ファクトチェック結果をコメントで明記

【確認必須公式情報源】
- ANA公式: https://www.ana.co.jp/ja/jp/amc/reference/domestic/
- JAL公式: https://www.jal.co.jp/jmb/use/partner/chart/
- Peach公式: https://www.flypeach.com/
- 国交省航空局: https://www.mlit.go.jp/koku/
- 設計書第5.1節「マイレージプログラム情報源」記載の全URL
```

### 6. マイレージプログラム選択UIの横幅・CSS適用遅延の修正

```
設計書「UI設計」「型定義」セクション（第2章・第13章・第15章）を必ず全文読み取り、以下を厳密に実装・ファクトチェックしてください：

【必須ファクトチェック項目】
- src/components/ui/UnifiedSearchForm.tsx のマイレージプログラム選択UIのレイアウト状況確認
- 検索ボックス（select要素）がフォーム幅からはみ出していないか、設計書の推奨レイアウトと一致しているか
- 横幅（width, max-width, grid設定）が設計書の推奨値（例: 480px以上、form全体で100%）になっているか
- CSSの適用タイミング（SSR/CSR）で一瞬レイアウトが崩れる現象が発生していないか
- globals.css, UnifiedSearchForm.tsx のスタイル定義が設計書の「初期表示」「遅延適用」要件を満たしているか

【実装必須項目】
1. マイレージプログラム選択ボックスの横幅をフォーム全体に合わせて拡張（grid-column: 1 / -1, full-width クラス適用）
2. select要素・ラベル・ヘルプテキストの余白・配置を設計書通りに調整（padding, margin最適化）
3. レスポンシブ対応（モバイル時もはみ出しが発生しないようmax-width, min-widthを厳密設定、iOS対応でfont-size: 16px）
4. CSS-in-JS/グローバルCSSの適用タイミングを最適化し、ページリロード時の一瞬のレイアウト崩れ（FOUT/FOUC）を完全に防止（useLayoutEffect, 初期インラインスタイル適用）
5. SSR/CSRのhydration差分を解消（opacity transition, isStylesLoaded state管理）

【確認必須実装】
- globals.css, UnifiedSearchForm.tsx のスタイル定義が設計書の「フォームレイアウト」「初期表示」要件と一致
- select要素のwidth: 100%, grid-column: 1 / -1, margin, paddingが設計書の推奨値
- ページリロード時に一瞬でもレイアウトが崩れないことを実機・開発サーバーで確認
- 変更後も全てのコンパイル・型チェック・UIテストが正常に通過すること
- モバイル（iOS/Android）でのズーム防止・レスポンシブ表示が正常に動作すること

【ファクトチェック根拠】
- 設計書第13.3節「詳細検索UIレイアウト」・第15章「UI/UX統合実装」・第2章「型定義」参照
- globals.css, UnifiedSearchForm.tsx のスタイル定義と設計書の一致を確認
- 公式航空会社サイトのUIパターン（ANA, JAL）も参考にすること
```

---

## 🛡️ ファクトチェック・根拠

### 設計書確認必須項目
- **設計書（docs/01_DESIGN/DESIGN_DOCUMENT.md）**：全693行の「型定義」「UI設計」「ファクトチェック」セクション
- **第2章**：型安全性（TypeScript型定義の厳密化）
- **第5章**：ファクトチェック（公式情報・根拠の明示）
- **第13章**：UI/UX改善（国内線・国際線分離対応）
- **第15章**：UI/UX統合実装（メインページ統合）

### 公式情報源
- **ANA公式**: https://www.ana.co.jp/ja/jp/amc/reference/domestic/
- **JAL公式**: https://www.jal.co.jp/jmb/use/partner/chart/
- **Peach公式**: https://www.flypeach.com/
- **国交省航空局**: https://www.mlit.go.jp/koku/
- **Material Design**: https://material.io/design
- **Apple HIG**: https://developer.apple.com/design/human-interface-guidelines/
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/Understanding/

### 型定義確認必須ファイル
- **src/types/airlines.ts**：AirlineCode型、厳密化された航空会社型定義
- **src/types/index.ts**：SearchFormType にmileageProgram追加済み
- **src/types/core.ts**：基本型定義、MileOption、CabinClassMiles

---

## ⚠️ 実装注意事項

### 必須確認事項
1. **設計書を全文読み取り**、型定義・UI設計・ファクトチェックの根拠を明記
2. **公式情報と設計書の不一致**があれば、設計書を優先しつつ根拠URLを明記し、修正内容を説明
3. **すべての改善**はUI/UX・データ品質・検索体験の向上を目的とし、ミス防止のためファクトチェックを徹底
4. **実装済み機能**（設計書第15章記載）を確認し、重複実装を避ける

### 期待される効果
1. **UI の高級感・リッチさ向上**、ブランドイメージ強化
2. **空港選択体験の向上**と誤動作防止
3. **マイレージプログラム選択の明確化**
4. **不要なタブ・ページの削除**によるUI/UXの一貫性
5. **必要マイル数・価値分析の正確性・信頼性向上**（ファクトチェック保証）

---

## 🚀 実装優先順位

### 🔥 最高優先（即座に実装）
1. **絵文字→SVGアイコン統一**（既存premium-card、glass-effectクラス活用）
2. **空港選択UIの不具合修正**（スクロール誤発火防止・表示件数増加）
3. **マイレージプログラム選択明示化**（設計書型定義準拠）

### ⭐ 高優先（今週中に実装）
4. **グローバルマイルタブ完全削除**（コード・UI・型定義から除去）
5. **検索結果マイル数ファクトチェック**（公式情報との照合・修正）

### 📋 継続改善（次週以降）
6. **レスポンシブデザイン最適化**
7. **アクセシビリティ向上**（WCAG 2.1準拠）
8. **パフォーマンス監視・改善**

---

*このプロンプトを使用することで、設計書・公式情報に基づく厳密なファクトチェックとUI/UX・検索機能・データ品質の改善が確実に実現されます。*
