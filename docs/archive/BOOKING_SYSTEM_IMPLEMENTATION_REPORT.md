# 予約システム実装レポート（2025年7月16日）

## 📋 実装概要

航空会社予約システム調査（Step 1-4）の結果に基づき、現実的で実用的な予約リンクシステムを実装しました。

## 🔍 調査結果サマリー

### 主要発見事項

1. **GET パラメータによる直接ディープリンク不可**
   - 国内6社・海外8社すべてがPOST方式またはJavaScript依存
   - 公開URLパラメータでの区間・日程指定は原則不可能

2. **例外：一部限定的サポート**
   - **Delta Air Lines**: `awardTravel=true` パラメータのみ利用可能
   - **Lufthansa**: Partner Deeplinks API で正式サポート（要認証）

3. **マイル特典航空券の制約**
   - ほぼ全社で会員ログイン必須
   - 外部からの直接リンクは大幅に制限

## 🛠️ 実装アプローチ

### 現実的対応方針

実際の調査結果を受け、以下の実用的アプローチを採用：

1. **検索フォームページへのリダイレクト**
   - 直接パラメータ指定不可の航空会社は検索ページにリダイレクト
   - ユーザーには事前に警告を表示

2. **特殊パラメータの活用**
   - Delta の `awardTravel=true` など確認できたパラメータを実装
   - 将来的なAPI対応への拡張性を確保

3. **警告システムの充実**
   - ログイン要否の事前通知
   - POST方式の制約に関する説明
   - 予約有効期限の確認

## 📁 実装ファイル

### 1. BookingUrlGenerator (`src/utils/bookingUrlGenerator.ts`)

```typescript
// 調査済み航空会社設定
export const AIRLINE_CONFIGS: Record<string, BookingSystemConfig> = {
  'ANA': {
    // POST方式のため検索フォームページにリダイレクト
    urls: {
      search: 'https://www.ana.co.jp/en/us/plan-book/',
      award: 'https://www.ana.co.jp/en/us/amc/international-flight-awards/'
    },
    constraints: {
      loginRequired: true, // Award検索
      externalLinkAllowed: false
    }
  },
  'DELTA': {
    // 唯一のGETパラメータサポート
    urls: {
      search: 'https://www.delta.com/flight-search/book-a-flight',
      award: 'https://www.delta.com/flight-search/book-a-flight?awardTravel=true'
    },
    constraints: {
      externalLinkAllowed: true // awardTravelパラメータのみ
    }
  }
  // ... 他14社
}
```

### 2. BookingButton コンポーネント (`src/components/BookingButton.tsx`)

- **事前警告システム**: POST方式制約の説明
- **ログイン要否通知**: マイル特典予約時の注意
- **エラーハンドリング**: 失敗時の代替案提示

## 🎯 対応航空会社一覧

| 航空会社 | GET パラメータ | マイル特典 | ログイン要否 | 実装状況 |
|----------|---------------|-----------|-------------|----------|
| **国内航空会社** ||||
| ANA | ❌ POST方式 | ✅ 専用URL | 🔐 必須 | ✅ 実装済み |
| JAL | ❌ POST方式 | ✅ 専用URL | 🔐 必須 | ✅ 実装済み |
| スカイマーク | ❌ POST方式 | ❌ なし | ⭕ 不要 | ✅ 実装済み |
| ソラシドエア | ❌ POST方式 | ✅ 会員限定 | 🔐 必須 | ✅ 実装済み |
| ピーチ | ❌ POST方式 | ❌ なし | ⭕ 不要 | ✅ 実装済み |
| ジェットスター | ❌ POST方式 | ❌ なし | ⭕ 不要 | ✅ 実装済み |
| **海外航空会社** ||||
| United Airlines | ❌ POST方式 | ✅ 専用URL | 🔐 必須 | ✅ 実装済み |
| American Airlines | ❌ POST方式 | ✅ 専用URL | 🔐 必須 | ✅ 実装済み |
| **Delta Air Lines** | ⚡ awardTravel | ✅ 専用URL | 🔐 必須 | ✅ 実装済み |
| British Airways | ❌ POST方式 | ✅ 会員限定 | 🔐 必須 | ✅ 実装済み |
| Singapore Airlines | ❌ POST方式 | ✅ 会員限定 | 🔐 必須 | ✅ 実装済み |
| Emirates | ❌ POST方式 | ✅ 会員限定 | 🔐 必須 | ✅ 実装済み |
| **Lufthansa** | 🔗 API対応 | ✅ 専用URL | 🔐 必須 | ⚠️ API要認証 |
| Cathay Pacific | ❌ POST方式 | ✅ 会員限定 | 🔐 必須 | ✅ 実装済み |

## 🔮 将来拡張計画

### 短期対応（1-3ヶ月）

1. **NDC API 統合**
   - ANA、JAL、United等のNDC APIを試験導入
   - 暗号化ディープリンク生成システム

2. **メタサーチ提携**
   - Skyscanner、Kayak等との提携リンク
   - アフィリエイト収益化の検討

### 中期対応（3-6ヶ月）

1. **Lufthansa Deeplinks API**
   - Partner認証取得
   - 完全パラメータ対応の実装

2. **ユーザー体験向上**
   - ワンクリック予約フロー
   - 会員ログイン状態の自動判定

### 長期対応（6ヶ月以上）

1. **独自API開発**
   - プロキシサーバー経由での予約処理
   - リアルタイム在庫確認

2. **AI予約アシスタント**
   - 最適な予約タイミング提案
   - 価格変動アラート

## ⚠️ 制約事項と注意点

### 技術的制約

1. **POST方式制約**
   - 大多数の航空会社で直接パラメータ指定不可
   - 検索フォームでの手動入力が必要

2. **JavaScript依存**
   - SPA化された予約サイトでの制約
   - ブラウザ互換性要件

3. **セッション管理**
   - 会員ログイン状態の維持困難
   - タイムアウト時の再認証必要

### 法的・規約制約

1. **利用規約遵守**
   - スクレイピング禁止条項
   - API使用許諾の取得必要

2. **データ保護**
   - 個人情報の取り扱い
   - GDPR等法規制への対応

## 📊 実装効果測定

### 成功指標

- **リンク成功率**: 85%以上（警告表示含む）
- **ユーザー完了率**: 70%以上（実際の予約完了）
- **エラー率**: 5%以下

### 測定方法

- Google Analytics カスタムイベント
- 航空会社別成功率の追跡
- ユーザーフィードバック収集

## 🎉 まとめ

現段階で **技術的に可能な範囲での実装が完了** しました。完全なディープリンクは制約がありますが、以下の成果を達成：

✅ **実用的な予約フロー** - 検索フォームページへの適切な誘導  
✅ **ユーザー体験向上** - 事前警告とスムーズな遷移  
✅ **拡張性確保** - 将来的なAPI対応への準備完了  
✅ **エラーハンドリング** - 失敗時の適切な代替案提示  

**次のステップ**: NDC API との統合検討、メタサーチ提携の推進

---
*作成日: 2025年7月16日*  
*調査期間: Step 1-4 完了*  
*検証航空会社: 国内6社・海外8社*
