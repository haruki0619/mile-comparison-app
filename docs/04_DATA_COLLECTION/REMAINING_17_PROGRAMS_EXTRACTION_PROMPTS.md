# 残り17プログラム手動データ抽出プロンプト集

## 概要
American Airlines (AAdvantage) のデータ抽出が完了しました。  
残り17プログラムの手動データ抽出を進めます。

---

## 抽出対象プログラム一覧

### 1. Delta Air Lines (SkyMiles)
**プログラム名**: Delta SkyMiles  
**チャート状況**: 完全ダイナミック制（2020年10月以降固定チャート廃止）  
**抽出方法**: delta.com ログイン検索 + スクリーンショット証跡

**テンプレート**:
```
必要マイル数（参考レンジ/片道）:
- NRT⇔LAX: [最安値] - [最高値] マイル
- NRT⇔LHR: [最安値] - [最高値] マイル  
- NRT⇔SIN: [最安値] - [最高値] マイル

参照元: delta.com → Book → "Shop with Miles" 検索結果
YQ: デルタ自社便=0円、パートナー便=運航会社規定
取得日: 2025-07-16
```

---

### 2. Lufthansa (Miles & More)
**プログラム名**: Lufthansa Miles & More  
**チャート状況**: 会員限定公開（ログイン必須）  
**抽出方法**: ログイン後 Mileage Calculator 検索

**テンプレート**:
```
必要マイル数（往復）:
- NRT⇔LAX: [エコノミー], [ビジネス], [ファースト] マイル
- NRT⇔LHR: [エコノミー], [ビジネス], [ファースト] マイル
- NRT⇔SIN: [エコノミー], [ビジネス], [ファースト] マイル

参照元: miles-and-more.com → ログイン → Mileage Calculator
YQ: LH便=Zone H €170片道、YQ高額注意
取得日: 2025-07-16
```

---

### 3. Singapore Airlines (KrisFlyer)
**プログラム名**: Singapore Airlines KrisFlyer  
**チャート状況**: 公式PDF + Mileage Calculator併用  
**抽出方法**: 公式PDF + 電卓照合

**テンプレート**:
```
必要マイル数（往復・Saver Award）:
- NRT⇔LAX: [エコノミー], [ビジネス], [スイート] マイル
- NRT⇔LHR: [エコノミー], [ビジネス], [スイート] マイル  
- NRT⇔SIN: [エコノミー], [ビジネス], [スイート] マイル

参照元: SQ_AwdChart.pdf + KrisFlyer Miles Calculator
YQ: SIA運航便=0円（2017年以降撤廃）
取得日: 2025-07-16
```

---

### 4. Cathay Pacific (Asia Miles)
**プログラム名**: Cathay Pacific Asia Miles  
**チャート状況**: 距離別チャート公開中  
**抽出方法**: 公式距離別チャート + 予約画面YQ確認

**テンプレート**:
```
必要マイル数（往復・Standard Award）:
- NRT⇔LAX: [エコノミー], [プレエコ], [ビジネス], [ファースト] マイル
- NRT⇔LHR: [エコノミー], [プレエコ], [ビジネス], [ファースト] マイル
- NRT⇔SIN: [エコノミー], [プレエコ], [ビジネス], [ファースト] マイル

参照元: cathaypacific.com/airline-award-chart
YQ: 日本発=¥0、HKG復路=HKD1,310（≈¥27,000）
取得日: 2025-07-16
```

---

### 5. Qatar Airways (Privilege Club)
**プログラム名**: Qatar Airways Privilege Club  
**チャート状況**: Avios距離別チャート  
**抽出方法**: PDF + Qcalculator照合

**テンプレート**:
```
必要Avios数（往復・DOH経由）:
- NRT⇔LAX: [エコノミー], [ビジネス], [ファースト] Avios
- NRT⇔LHR: [エコノミー], [ビジネス], [ファースト] Avios
- NRT⇔SIN: [エコノミー], [ビジネス], [-] Avios

参照元: PrivilegeClub_AviosChart_2023-05.pdf
YQ: NRT-DOH=¥7,700、欧米区間=USD130-170
取得日: 2025-07-16
```

---

### 6. Emirates (Skywards)
**プログラム名**: Emirates Skywards  
**チャート状況**: 距離別チャート  
**抽出方法**: 公式チャート + 予約画面

**テンプレート**:
```
必要マイル数（往復・DXB経由）:
- NRT⇔LAX: [エコノミー], [ビジネス], [ファースト] マイル
- NRT⇔LHR: [エコノミー], [ビジネス], [ファースト] マイル
- NRT⇔SIN: [エコノミー], [ビジネス], [-] マイル

参照元: emirates.com Award Chart
YQ: 高額YQ注意（往復¥40,000-80,000）
取得日: 2025-07-16
```

---

### 7. Air Canada (Aeroplan)
**プログラム名**: Air Canada Aeroplan  
**チャート状況**: 距離別固定チャート  
**抽出方法**: 公式PDF + 距離計算

**テンプレート**:
```
必要ポイント数（往復・Saver）:
- NRT⇔LAX: [エコノミー], [プレエコ], [ビジネス], [-] ポイント
- NRT⇔LHR: [エコノミー], [-], [ビジネス], [ファースト] ポイント
- NRT⇔SIN: [エコノミー], [プレエコ], [ビジネス], [-] ポイント

参照元: Aeroplan_Chart_2025-04-01.pdf
YQ: AC便=0円、パートナー便=運航会社規定
取得日: 2025-07-16
```

---

### 8-17. その他9プログラム

**簡易テンプレート**（各プログラム用）:
```
航空会社: [プログラム名]
マイレージプログラム: [正式名称]

必要マイル数（往復）:
- NRT⇔LAX: E:[値] / C:[値] / F:[値]
- NRT⇔LHR: E:[値] / C:[値] / F:[値]  
- NRT⇔SIN: E:[値] / C:[値] / F:[値]

YQ概算: [金額・通貨]
参照元: [URL/PDF名]
データ取得日: 2025-07-16
備考: [特記事項]
```

**対象プログラム**:
8. Qantas Airways (Qantas Frequent Flyer)
9. Air France/KLM (Flying Blue)
10. Turkish Airlines (Miles&Smiles)
11. Etihad Airways (Etihad Guest)
12. Finnair (Finnair Plus)
13. Alaska Airlines (Mileage Plan)
14. Virgin Atlantic (Flying Club)
15. Korean Air (SKYPASS)
16. China Eastern Airlines (Eastern Miles)
17. EVA Air (Infinity MileageLands)

---

## 注意事項

1. **データ品質フラグ**
   - 固定チャート: `verified`
   - ダイナミック制: `verified (dynamic)`
   - 推定値: `preliminary`

2. **YQ（燃油サーチャージ）**
   - 必ず往復金額で記載
   - 運航会社別に分けて記載
   - 0円の場合も明記

3. **ソース明記**
   - URL完全パス
   - PDF名とページ数
   - 検索日時（JST）

4. **三重確認**
   - 公式ソース → 計算 → 再確認
   - 異ソースでのクロスチェック
   - スクリーンショット保存

---

## 進捗管理

- [x] American Airlines (AAdvantage) ✅ 完了
- [ ] Delta Air Lines (SkyMiles)
- [ ] Lufthansa (Miles & More)
- [ ] Singapore Airlines (KrisFlyer)
- [ ] Cathay Pacific (Asia Miles)
- [ ] Qatar Airways (Privilege Club)
- [ ] Emirates (Skywards)
- [ ] Air Canada (Aeroplan)
- [ ] Qantas Airways (Qantas Frequent Flyer)
- [ ] Air France/KLM (Flying Blue)
- [ ] Turkish Airlines (Miles&Smiles)
- [ ] Etihad Airways (Etihad Guest)
- [ ] Finnair (Finnair Plus)
- [ ] Alaska Airlines (Mileage Plan)
- [ ] Virgin Atlantic (Flying Club)
- [ ] Korean Air (SKYPASS)
- [ ] China Eastern Airlines (Eastern Miles)
- [ ] EVA Air (Infinity MileageLands)

**目標**: Phase 1完了まで残り17プログラム → 1日2-3プログラムペースで1週間以内完了予定
