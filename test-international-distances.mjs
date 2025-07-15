// 国際線距離計算テスト

// 距離データをインポート
import distancesData from '../src/data/distances.json';

console.log('🌏 国際線距離テスト開始');

// テストケース
const testCases = [
  { from: 'HND', to: 'LAX', expected: 8813 },
  { from: 'NRT', to: 'JFK', expected: 10830 },
  { from: 'KIX', to: 'ICN', expected: 860 },
  { from: 'FUK', to: 'TPE', expected: 1300 },
  { from: 'OKA', to: 'HKG', expected: 1456 }
];

console.log('📊 テスト結果:');
testCases.forEach(test => {
  const key = `${test.from}-${test.to}`;
  const distance = distancesData[key];
  
  const status = distance ? '✅' : '❌';
  const diff = distance ? Math.abs(distance - test.expected) : 'N/A';
  
  console.log(`${status} ${test.from} → ${test.to}: ${distance || 'なし'}km (期待値: ${test.expected}km, 差: ${diff}km)`);
});

console.log('\n🧮 利用可能な国際線距離データ数:');
const internationalRoutes = Object.keys(distancesData).filter(key => {
  const [from, to] = key.split('-');
  const international = ['LAX', 'JFK', 'SFO', 'YVR', 'ICN', 'TPE', 'HKG', 'SIN', 'BKK', 'LHR', 'CDG', 'FRA'];
  return international.includes(from) || international.includes(to);
});

console.log(`国際線路線: ${internationalRoutes.length / 2}路線（双方向: ${internationalRoutes.length}エントリ）`);

export {};
