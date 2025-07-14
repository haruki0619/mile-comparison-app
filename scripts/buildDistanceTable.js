#!/usr/bin/env node
/**
 * 距離テーブル自動生成スクリプト
 * OpenFlightsデータから日本国内空港の座標を取得し、全ペアの距離を計算
 */

const fs = require('fs');
const path = require('path');

// 地球半径 [km]
const R = 6371;

/**
 * Haversine公式による大圏距離計算
 */
function haversine(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/**
 * 日本国内主要空港の座標データ
 * OpenFlights airports.datから抽出
 */
const japaneseAirports = {
  // 関東
  'HND': { lat: 35.5494, lon: 139.7798, name: '羽田空港' },
  'NRT': { lat: 35.7647, lon: 140.3864, name: '成田国際空港' },
  
  // 中部
  'NGO': { lat: 34.8584, lon: 136.8054, name: '中部国際空港' },
  'KMQ': { lat: 36.3946, lon: 136.4063, name: '小松空港' },
  'TOY': { lat: 36.6483, lon: 137.1871, name: '富山空港' },
  
  // 関西
  'ITM': { lat: 34.7847, lon: 135.4381, name: '伊丹空港' },
  'KIX': { lat: 34.4347, lon: 135.2441, name: '関西国際空港' },
  'UKB': { lat: 35.1325, lon: 136.1647, name: '神戸空港' },
  
  // 北海道
  'CTS': { lat: 42.7753, lon: 141.6922, name: '新千歳空港' },
  'HKD': { lat: 41.7700, lon: 140.8219, name: '函館空港' },
  'AKJ': { lat: 43.6708, lon: 142.4475, name: '旭川空港' },
  'OBO': { lat: 44.1178, lon: 144.1636, name: '帯広空港' },
  'KUH': { lat: 43.0414, lon: 144.1947, name: '釧路空港' },
  'MMB': { lat: 43.8806, lon: 144.1641, name: '女満別空港' },
  
  // 九州・沖縄
  'FUK': { lat: 33.5856, lon: 130.4506, name: '福岡空港' },
  'KMJ': { lat: 31.8036, lon: 130.7194, name: '鹿児島空港' },
  'KOJ': { lat: 31.8036, lon: 130.7194, name: '鹿児島空港' },
  'OKA': { lat: 26.1958, lon: 127.6458, name: '那覇空港' },
  'MYZ': { lat: 24.7828, lon: 125.2956, name: '宮古空港' },
  'ISG': { lat: 24.3975, lon: 124.2458, name: '石垣空港' },
  'MMY': { lat: 28.3231, lon: 129.7853, name: '久米島空港' },
  'OIT': { lat: 33.4794, lon: 131.7367, name: '大分空港' },
  'KMI': { lat: 32.8372, lon: 130.8547, name: '熊本空港' },
  'NGS': { lat: 32.9169, lon: 129.9136, name: '長崎空港' },
  
  // 東北
  'SDJ': { lat: 38.1397, lon: 140.9167, name: '仙台空港' },
  'AOJ': { lat: 40.7347, lon: 140.6906, name: '青森空港' },
  'AXT': { lat: 39.6156, lon: 140.2189, name: '秋田空港' },
  'HIJ': { lat: 34.4361, lon: 132.9194, name: '広島空港' },
  'YGJ': { lat: 35.4917, lon: 133.2356, name: '米子空港' },
  'TAK': { lat: 35.1725, lon: 134.0164, name: '但馬空港' },
  'KCZ': { lat: 35.7114, lon: 139.7881, name: '高知空港' },
  'MYJ': { lat: 33.8275, lon: 132.6997, name: '松山空港' },
  'TKS': { lat: 34.1331, lon: 134.6064, name: '徳島空港' },
  'FSZ': { lat: 34.5131, lon: 131.0311, name: '山口宇部空港' },
  'IWJ': { lat: 39.7131, lon: 141.1347, name: '岩手花巻空港' },
  'SHM': { lat: 34.5864, lon: 136.9747, name: '志摩空港' },
  'NKM': { lat: 37.9558, lon: 139.1206, name: '新潟空港' },
  'MSJ': { lat: 36.1661, lon: 140.4147, name: '茨城空港' },
  'GAJ': { lat: 36.4017, lon: 136.8706, name: '小松空港' },
  'HAC': { lat: 35.7744, lon: 140.6586, name: '八丈島空港' },
  'OGN': { lat: 36.4181, lon: 136.9022, name: '能登空港' },
  'MMJ': { lat: 33.9931, lon: 131.0347, name: '大分空港' },
  'UBJ': { lat: 33.9306, lon: 131.2789, name: '宇部空港' },
  'DNA': { lat: 25.9444, lon: 131.2631, name: '与那国空港' },
  'SHI': { lat: 26.8958, lon: 128.4011, name: '粟国空港' },
  'KJP': { lat: 26.3639, lon: 127.7683, name: '慶良間空港' },
  'OKE': { lat: 26.5958, lon: 128.0281, name: '沖永良部空港' },
  'ASJ': { lat: 28.4308, lon: 129.7119, name: '奄美空港' },
  'TKN': { lat: 27.8364, lon: 128.8831, name: '徳之島空港' },
  'KKX': { lat: 31.3631, lon: 130.6589, name: '喜界島空港' },
  'TNE': { lat: 30.6058, lon: 130.9911, name: '種子島空港' },
  'YAK': { lat: 30.3856, lon: 130.6589, name: '屋久島空港' },
  
  // 不足していた空港を追加
  'OKJ': { lat: 36.1661, lon: 140.4147, name: '茨城空港' }, // 茨城空港（IBR→OKJ）
  'MSJ': { lat: 36.1661, lon: 140.4147, name: '茨城空港' }   // 同上（代替コード）
};

/**
 * 既存routes.tsから路線ペアを読み込み（存在しない場合は主要ペアを生成）
 */
function getRoutePairs() {
  // Node.jsではTypeScriptファイルを直接読めないので、
  // src/data/index.tsからルート情報を抽出する
  const dataIndexPath = path.join(__dirname, '../src/data/index.ts');
  
  try {
    if (fs.existsSync(dataIndexPath)) {
      const content = fs.readFileSync(dataIndexPath, 'utf8');
      console.log('📂 data/index.tsから路線データを抽出中...');
      
      // TypeScriptファイルから路線データを正規表現で抽出
      const routeMatches = content.match(/{ departure: '([A-Z]{3})', arrival: '([A-Z]{3})'[^}]*}/g);
      
      if (routeMatches && routeMatches.length > 0) {
        const pairs = routeMatches.map(match => {
          const depMatch = match.match(/departure: '([A-Z]{3})'/);
          const arrMatch = match.match(/arrival: '([A-Z]{3})'/);
          return [depMatch[1], arrMatch[1]];
        }).filter(pair => pair[0] && pair[1]);
        
        console.log(`✅ ${pairs.length}路線を抽出しました`);
        return pairs;
      }
    }
  } catch (error) {
    console.warn('⚠️ data/index.tsの読み込みに失敗:', error.message);
  }
  
  console.warn('⚠️ 既存路線データが見つからないため、主要ペアを生成します');
  
  // フォールバック: 主要空港コードのリスト
  const majorAirports = [
    'HND', 'NRT', 'ITM', 'KIX', 'NGO', 'CTS', 'FUK', 'OKA',
    'SDJ', 'HIJ', 'KMJ', 'KOJ', 'MYJ', 'TAK', 'KCZ', 'AOJ',
    'AXT', 'OKJ', 'MYZ', 'OIT', 'HKD', 'AKJ', 'KMQ', 'TOY',
    'FSZ', 'MMJ', 'NGS', 'ASJ', 'ISG', 'MMY', 'DNA'
  ];
  const pairs = [];
  
  // 主要空港間の全ペアを生成
  for (let i = 0; i < majorAirports.length; i++) {
    for (let j = i + 1; j < majorAirports.length; j++) {
      pairs.push([majorAirports[i], majorAirports[j]]);
    }
  }
  
  console.log(`📊 生成されたペア数: ${pairs.length}`);
  return pairs;
}

/**
 * 距離テーブルを生成
 */
function buildDistanceTable() {
  console.log('🚀 距離テーブル生成開始...');
  
  const pairs = getRoutePairs();
  const distances = {};
  let calculatedCount = 0;
  let skippedCount = 0;
  
  pairs.forEach(([departure, arrival]) => {
    const airport1 = japaneseAirports[departure];
    const airport2 = japaneseAirports[arrival];
    
    if (!airport1 || !airport2) {
      console.warn(`⚠️ 座標不明: ${departure} -> ${arrival}`);
      skippedCount++;
      return;
    }
    
    const distance = Math.round(haversine(
      airport1.lat, airport1.lon,
      airport2.lat, airport2.lon
    ));
    
    // 双方向で登録
    distances[`${departure}-${arrival}`] = distance;
    distances[`${arrival}-${departure}`] = distance;
    
    calculatedCount++;
    console.log(`✈️ ${departure}-${arrival}: ${distance}km`);
  });
  
  console.log(`\n📊 生成完了:`);
  console.log(`  計算済み: ${calculatedCount}ペア`);
  console.log(`  スキップ: ${skippedCount}ペア`);
  console.log(`  総距離エントリ: ${Object.keys(distances).length}件`);
  
  return distances;
}

/**
 * 空港座標辞書を生成
 */
function buildAirportsData() {
  console.log('🏢 空港座標辞書生成...');
  
  const airportsData = {};
  Object.entries(japaneseAirports).forEach(([code, data]) => {
    airportsData[code] = {
      lat: data.lat,
      lon: data.lon,
      name: data.name
    };
  });
  
  console.log(`✅ ${Object.keys(airportsData).length}空港の座標を登録`);
  return airportsData;
}

/**
 * メイン実行
 */
function main() {
  try {
    // データディレクトリを作成
    const dataDir = path.join(__dirname, '../src/data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // 距離テーブル生成
    const distances = buildDistanceTable();
    const distancesPath = path.join(dataDir, 'distances.json');
    fs.writeFileSync(distancesPath, JSON.stringify(distances, null, 2));
    console.log(`💾 ${distancesPath} に保存完了`);
    
    // 空港座標辞書生成
    const airports = buildAirportsData();
    const airportsPath = path.join(dataDir, 'airports.json');
    fs.writeFileSync(airportsPath, JSON.stringify(airports, null, 2));
    console.log(`💾 ${airportsPath} に保存完了`);
    
    console.log('\n🎉 距離テーブル生成完了！');
    console.log('次は flightService.ts の getEstimatedDistance() を更新してください。');
    
  } catch (error) {
    console.error('❌ エラー:', error);
    process.exit(1);
  }
}

// 実行
if (require.main === module) {
  main();
}

module.exports = { buildDistanceTable, buildAirportsData, haversine, japaneseAirports };
