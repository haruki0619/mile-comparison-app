// 予約システム実装テスト
// 実行方法: node test-booking-system.mjs

import { BookingUrlGenerator } from '../src/utils/bookingUrlGenerator.js';

console.log('🔍 予約システム実装テスト開始\n');

// テストケース1: ANA 現金予約（POST方式）
console.log('=== テスト1: ANA 現金予約 ===');
const anaRequest = {
  airline: 'ANA',
  route: { departure: 'NRT', arrival: 'LAX' },
  dates: { departure: '2025-10-15' },
  passengers: { adults: 1 },
  preferences: { cabinClass: 'economy', redemptionType: 'cash' }
};

const anaResult = BookingUrlGenerator.generateUrl(anaRequest);
console.log('URL:', anaResult.url);
console.log('有効:', anaResult.isValid);
console.log('警告:', anaResult.warnings);
console.log('ログイン要否:', anaResult.metadata.requiresLogin);
console.log('サポート機能:', anaResult.metadata.supportedFeatures);
console.log('');

// テストケース2: JAL マイル特典予約
console.log('=== テスト2: JAL マイル特典予約 ===');
const jalMileRequest = {
  airline: 'JAL',
  route: { departure: 'HND', arrival: 'SIN' },
  dates: { departure: '2025-12-01' },
  passengers: { adults: 2 },
  preferences: { cabinClass: 'business', redemptionType: 'miles' }
};

const jalResult = BookingUrlGenerator.generateUrl(jalMileRequest);
console.log('URL:', jalResult.url);
console.log('有効:', jalResult.isValid);
console.log('警告:', jalResult.warnings);
console.log('ログイン要否:', jalResult.metadata.requiresLogin);
console.log('');

// テストケース3: Delta マイル特典（特殊パラメータ）
console.log('=== テスト3: Delta マイル特典（特殊パラメータ） ===');
const deltaRequest = {
  airline: 'DELTA',
  route: { departure: 'NRT', arrival: 'SEA' },
  dates: { departure: '2025-11-20' },
  passengers: { adults: 1 },
  preferences: { cabinClass: 'economy', redemptionType: 'miles' },
  tracking: { referralCode: 'mile-compass', affiliateId: 'MC001' }
};

const deltaResult = BookingUrlGenerator.generateUrl(deltaRequest);
console.log('URL:', deltaResult.url);
console.log('有効:', deltaResult.isValid);
console.log('警告:', deltaResult.warnings);
console.log('外部リンク可能:', deltaResult.metadata.supportedFeatures.includes('external_linking'));
console.log('');

// テストケース4: 未対応航空会社
console.log('=== テスト4: 未対応航空会社 ===');
const unknownRequest = {
  airline: 'UNKNOWN',
  route: { departure: 'NRT', arrival: 'LAX' },
  dates: { departure: '2025-10-15' },
  passengers: { adults: 1 },
  preferences: { cabinClass: 'economy', redemptionType: 'cash' }
};

const unknownResult = BookingUrlGenerator.generateUrl(unknownRequest);
console.log('URL:', unknownResult.url);
console.log('有効:', unknownResult.isValid);
console.log('警告:', unknownResult.warnings);
console.log('');

// テストケース5: 日付検証（早すぎる予約）
console.log('=== テスト5: 日付検証テスト ===');
const futureRequest = {
  airline: 'ANA',
  route: { departure: 'NRT', arrival: 'LAX' },
  dates: { departure: '2026-07-16' }, // 1年後
  passengers: { adults: 1 },
  preferences: { cabinClass: 'economy', redemptionType: 'cash' }
};

const futureResult = BookingUrlGenerator.generateUrl(futureRequest);
console.log('URL:', futureResult.url);
console.log('有効:', futureResult.isValid);
console.log('警告:', futureResult.warnings);
console.log('');

console.log('✅ テスト完了');
console.log('');
console.log('📊 サマリー:');
console.log('- ANA: 検索フォームページリダイレクト (POST方式)');
console.log('- JAL: マイル特典専用ページリダイレクト + ログイン警告');
console.log('- Delta: awardTravel=true パラメータ + トラッキング情報付与');
console.log('- 未対応: エラーハンドリング');
console.log('- 日付検証: 予約期間制限チェック');
