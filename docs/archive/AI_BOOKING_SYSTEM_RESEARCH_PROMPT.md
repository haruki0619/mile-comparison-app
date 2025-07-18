# 航空会社予約システム調査プロンプト（ファクトチェック構造付き）

## 🎯 調査目的
航空券比較サイトから各航空会社の予約ページに、指定された便・日時・条件で直接遷移するためのURL構造とパラメータを調査する。

## 📋 調査対象航空会社リスト

### 国内航空会社
- ANA（全日本空輸）
- JAL（日本航空）
- スカイマーク
- ソラシドエア
- ピーチ
- ジェットスター

### 海外航空会社（主要）
- United Airlines
- American Airlines
- Delta Air Lines
- British Airways
- Singapore Airlines
- Emirates
- Lufthansa
- Cathay Pacific

## 🔍 プロンプト（段階的情報収集）

### Step 1: 基本URL構造調査

```
以下の航空会社について、公式予約サイトのURL構造を調査してください。
必ず最新の公式サイトからの情報のみを使用し、推測や古い情報は含めないでください。

対象航空会社: [航空会社名]

調査項目:
1. 公式予約サイトのベースURL
2. 航空券検索・予約ページのURL構造
3. マイル特典航空券予約ページのURL（存在する場合）
4. URL末尾のパラメータ形式（GET parameters）

出力形式:
```
航空会社: [正式名称]
ベースURL: [https://...]
検索ページ: [https://...]
マイル予約ページ: [https://...] または "なし"
パラメータ形式: [?param1=value1&param2=value2...]
確認日: [YYYY年MM月DD日]
情報源: [公式サイトURL]
```

**重要**: 
- 必ず航空会社の公式サイトから情報を取得してください
- 推測や古い情報、第三者サイトの情報は使用しないでください
- 確認できない項目は「確認不可」と記載してください
```

### Step 2: URLパラメータ詳細調査

```
前回調査した [航空会社名] について、予約URL のパラメータ詳細を調査してください。

調査項目:
1. 出発地パラメータ名と値の形式（空港コード形式）
2. 到着地パラメータ名と値の形式
3. 出発日パラメータ名と日付形式
4. 復路日パラメータ名と日付形式（往復の場合）
5. 乗客数パラメータ（大人・子供・幼児）
6. 座席クラスパラメータと値のマッピング
7. 便名指定パラメータ（存在する場合）
8. 時刻指定パラメータ（存在する場合）

実例で確認:
以下の条件でのURL例を作成し、実際にアクセスして確認してください：
- 出発地: NRT（成田）または最寄りの主要空港
- 到着地: LAX（ロサンゼルス）または主要な長距離路線
- 出発日: 3ヶ月後の平日
- 大人1名、エコノミークラス

出力形式:
```
航空会社: [名称]
パラメータ詳細:
- 出発地: [パラメータ名=値の形式]
- 到着地: [パラメータ名=値の形式]
- 出発日: [パラメータ名=YYYY-MM-DD等の形式]
- 復路日: [パラメータ名=形式] または "片道のみ"
- 乗客数: [adults=1&children=0等]
- 座席クラス: [class=economy等, マッピング表]
- 便名指定: [可能/不可, パラメータ名]
- 時刻指定: [可能/不可, パラメータ名]

実例URL:
[完全なURL例]

動作確認: [正常にページが表示される/エラー/リダイレクト]
確認日: [YYYY年MM月DD日]
```

**ファクトチェック必須**:
- 作成したURLに実際にアクセスして動作確認してください
- エラーページや無効なパラメータの場合は記録してください
- 推測でパラメータを作成しないでください
```

### Step 3: マイル特典航空券URL調査

```
[航空会社名] のマイル特典航空券予約システムについて調査してください。

調査項目:
1. マイル特典航空券専用の予約URLが存在するか
2. 通常予約と同じページでマイル/現金を選択できるか
3. マイル特典航空券予約に必要な追加パラメータ
4. ログイン必須かどうか
5. 外部サイトからの直接リンクが可能か

出力形式:
```
航空会社: [名称]
マイル予約システム:
- 専用URL: [あり/なし, URL]
- 同一ページ切替: [可能/不可]
- 必要パラメータ: [redemption=miles等]
- ログイン要否: [必須/不要]
- 外部リンク: [可能/制限あり/不可]
- 特記事項: [制限事項等]

確認方法:
[実際に確認した手順]

確認日: [YYYY年MM月DD日]
```

**重要**:
- マイル特典航空券は会員ログインが必要な場合が多いため、一般アクセス可能な範囲で確認してください
- セキュリティ制限やログイン要求がある場合は明記してください
```

### Step 4: クロスチェック・検証

```
これまでに収集した [航空会社名] の情報について、以下の検証を行ってください：

検証項目:
1. 異なる路線（国内線・国際線）でのURL構造の一貫性
2. 日付形式の変更（異なる日付での動作確認）
3. 乗客数変更での動作確認
4. 座席クラス変更での動作確認
5. エラーケースの確認（無効な空港コード等）

検証手順:
1. 最低3つの異なる路線でURL作成・動作確認
2. 異なる日付（1ヶ月後、6ヶ月後）での確認
3. 複数乗客（大人2名、子供1名等）での確認
4. 無効なパラメータでのエラー処理確認

出力形式:
```
航空会社: [名称]
検証結果:
✅ 路線間一貫性: [一貫している/差異あり - 詳細]
✅ 日付形式: [一貫している/問題あり - 詳細]
✅ 乗客数対応: [正常/問題あり - 詳細]
✅ クラス変更: [正常/問題あり - 詳細]
❌ エラー処理: [適切/問題あり - 詳細]

最終推奨URL構造:
[テンプレート形式のURL]

注意事項:
[実装時の注意点]

検証完了日: [YYYY年MM月DD日]
```

**品質保証**:
- 推測や仮定に基づく情報は一切含めないでください
- 確認できない項目は「要追加調査」と明記してください
- 全ての情報に確認日時を記録してください
```

## 🛡️ ファクトチェック・品質保証ガイドライン

### 必須検証項目
1. **情報源の確認**: 航空会社公式サイトからの直接取得
2. **実際のURL動作確認**: 作成したURLで実際にアクセス
3. **日付の妥当性**: 情報収集日を明記
4. **複数パターンでの検証**: 異なる条件での動作確認
5. **エラーケースの記録**: 失敗パターンも記録

### 品質チェックリスト
- [ ] 公式サイトから直接情報取得済み
- [ ] 推測や仮定による情報が含まれていない
- [ ] URLの実際の動作確認済み
- [ ] 複数条件での検証済み
- [ ] 情報収集日時が記録されている
- [ ] 不明な項目は「確認不可」と明記されている

### 出力品質基準
- **正確性**: 100% 確認済みの情報のみ
- **完全性**: 調査項目の網羅的確認
- **追跡可能性**: 情報源と確認方法の明記
- **時効性**: 最新情報であることの確認

## 📝 収集情報の統合形式

```typescript
// 最終的に必要な形式
interface AirlineBookingConfig {
  airline: string;
  baseUrl: string;
  searchEndpoint: string;
  awardEndpoint?: string;
  parameters: {
    origin: string;           // パラメータ名
    destination: string;      // パラメータ名
    departureDate: string;    // パラメータ名
    returnDate?: string;      // パラメータ名
    adults: string;          // パラメータ名
    children?: string;       // パラメータ名
    infants?: string;        // パラメータ名
    cabinClass: string;      // パラメータ名
    flightNumber?: string;   // パラメータ名
    redemptionType?: string; // マイル特典用
  };
  formats: {
    dateFormat: string;      // 'YYYY-MM-DD'等
    classValues: Record<string, string>; // {'economy': 'Y'}等
  };
  constraints: {
    loginRequired: boolean;
    externalLinkAllowed: boolean;
    maxAdvanceBooking: number; // 日数
  };
  verified: {
    lastChecked: string;     // ISO date
    verifiedRoutes: string[]; // ['NRT-LAX', 'HND-SIN']
    checkedBy: string;       // 確認者
  };
}
```

この構造化されたプロンプトにより、正確で実装可能な航空会社予約システム情報を収集できます。
