#!/usr/bin/env node
/**
 * 国際線対応距離テーブル自動生成スクリプト
 * 国内線 + 国際線の両方の距離を計算
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

console.log('🚀 距離テーブル生成開始（国内線 + 国際線）...');

// 国内空港 + 国際空港の座標データ（OpenFlightsデータ）
const airportsWithCoordinates = {
  // 日本国内空港
  'HND': { lat: 35.5494, lon: 139.7798, name: '羽田空港' },
  'NRT': { lat: 35.7647, lon: 140.3864, name: '成田国際空港' },
  'ITM': { lat: 34.7847, lon: 135.4383, name: '大阪国際空港（伊丹）' },
  'KIX': { lat: 34.4347, lon: 135.2442, name: '関西国際空港' },
  'CTS': { lat: 42.7747, lon: 141.6922, name: '新千歳空港' },
  'FUK': { lat: 33.5858, lon: 130.4511, name: '福岡空港' },
  'OKA': { lat: 26.1958, lon: 127.6458, name: '那覇空港' },
  'NGO': { lat: 35.2553, lon: 136.9242, name: '中部国際空港（セントレア）' },
  'KMJ': { lat: 31.8036, lon: 130.7192, name: '鹿児島空港' },
  'KOJ': { lat: 31.8036, lon: 130.7192, name: '鹿児島空港' },
  'MYJ': { lat: 34.0831, lon: 131.7619, name: '宮崎空港' },
  'TAK': { lat: 33.6289, lon: 131.0350, name: '高松空港' },
  'KCZ': { lat: 35.4139, lon: 136.4089, name: '小松空港' },
  'AOJ': { lat: 40.7347, lon: 140.6906, name: '青森空港' },
  'AXT': { lat: 39.6156, lon: 140.2186, name: '秋田空港' },
  'SDJ': { lat: 38.1394, lon: 140.9167, name: '仙台空港' },
  'HIJ': { lat: 34.4364, lon: 132.9194, name: '広島空港' },
  'OKJ': { lat: 36.1661, lon: 140.4147, name: '茨城空港' },
  'MYZ': { lat: 24.7828, lon: 125.2947, name: '宮古空港' },
  'OIT': { lat: 33.4794, lon: 131.7372, name: '大分空港' },
  'HKD': { lat: 41.7700, lon: 140.8222, name: '函館空港' },
  'AKJ': { lat: 43.6706, lon: 142.4475, name: '旭川空港' },
  'KMQ': { lat: 34.2142, lon: 133.8550, name: '小松島空港' },
  'TOY': { lat: 36.6483, lon: 137.1875, name: '富山空港' },
  'FSZ': { lat: 34.7647, lon: 134.1667, name: '静岡空港' },
  'MMJ': { lat: 32.8367, lon: 129.9133, name: '松本空港' },
  'ISG': { lat: 24.3364, lon: 124.1867, name: '石垣空港' },
  'MMY': { lat: 25.8444, lon: 131.2631, name: '宮古島空港' },
  'ASJ': { lat: 28.4308, lon: 129.7119, name: '奄美空港' },
  'TKN': { lat: 27.8364, lon: 128.8831, name: '徳之島空港' },
  'KKX': { lat: 31.3631, lon: 130.6589, name: '喜界島空港' },
  'TNE': { lat: 30.6058, lon: 130.9911, name: '種子島空港' },
  'YAK': { lat: 30.3856, lon: 130.6589, name: '屋久島空港' },
  'OBO': { lat: 44.1183, lon: 143.2172, name: '帯広空港' },
  'KUH': { lat: 43.0414, lon: 144.1931, name: '釧路空港' },
  'MMB': { lat: 43.8808, lon: 144.1639, name: '女満別空港' },
  'UBJ': { lat: 33.9306, lon: 131.2789, name: '宇部空港' },
  'DNA': { lat: 25.9444, lon: 131.2631, name: '与那国空港' },
  'SHI': { lat: 26.8958, lon: 128.4011, name: '粟国空港' },
  'KJP': { lat: 26.3639, lon: 127.7683, name: '慶良間空港' },
  'OKE': { lat: 26.5958, lon: 128.0281, name: '沖永良部空港' },
  'NGS': { lat: 32.9169, lon: 129.9136, name: '長崎空港' },
  
  // 国際空港（主要都市）
  // 北米
  'LAX': { lat: 33.9425, lon: -118.4081, name: 'ロサンゼルス国際空港' },
  'JFK': { lat: 40.6413, lon: -73.7781, name: 'ジョン・F・ケネディ国際空港' },
  'SFO': { lat: 37.6213, lon: -122.3790, name: 'サンフランシスコ国際空港' },
  'YVR': { lat: 49.1947, lon: -123.1814, name: 'バンクーバー国際空港' },
  'SEA': { lat: 47.4502, lon: -122.3088, name: 'シアトル・タコマ国際空港' },
  'DFW': { lat: 32.8998, lon: -97.0403, name: 'ダラス・フォートワース国際空港' },
  
  // ヨーロッパ
  'LHR': { lat: 51.4700, lon: -0.4543, name: 'ヒースロー空港' },
  'CDG': { lat: 49.0097, lon: 2.5479, name: 'シャルル・ド・ゴール空港' },
  'FRA': { lat: 49.6133, lon: 8.5622, name: 'フランクフルト空港' },
  'AMS': { lat: 52.3105, lon: 4.7683, name: 'アムステルダム・スキポール空港' },
  'ZUR': { lat: 47.4647, lon: 8.5492, name: 'チューリッヒ空港' },
  'MUC': { lat: 48.3537, lon: 11.7750, name: 'ミュンヘン空港' },
  
  // アジア
  'ICN': { lat: 37.4602, lon: 126.4407, name: '仁川国際空港' },
  'TPE': { lat: 25.0797, lon: 121.2342, name: '台湾桃園国際空港' },
  'HKG': { lat: 22.3080, lon: 113.9185, name: '香港国際空港' },
  'SIN': { lat: 1.3644, lon: 103.9915, name: 'チャンギ国際空港' },
  'BKK': { lat: 13.6900, lon: 100.7501, name: 'スワンナプーム国際空港' },
  'KUL': { lat: 2.7456, lon: 101.7072, name: 'クアラルンプール国際空港' },
  'MNL': { lat: 14.5086, lon: 121.0194, name: 'ニノイ・アキノ国際空港' },
  'PVG': { lat: 31.1443, lon: 121.8083, name: '上海浦東国際空港' },
  'PEK': { lat: 40.0799, lon: 116.6031, name: '北京首都国際空港' },
  'DEL': { lat: 28.5562, lon: 77.1000, name: 'インディラ・ガンディー国際空港' },
  
  // オセアニア
  'SYD': { lat: -33.9399, lon: 151.1753, name: 'シドニー国際空港' },
  'MEL': { lat: -37.6690, lon: 144.8410, name: 'メルボルン空港' },
  'AKL': { lat: -37.0082, lon: 174.7850, name: 'オークランド空港' },
  
  // その他
  'DXB': { lat: 25.2532, lon: 55.3657, name: 'ドバイ国際空港' },
  'DOH': { lat: 25.2731, lon: 51.6080, name: 'ハマド国際空港' }
};

// 路線データを抽出する関数
function extractRoutes() {
  console.log('📂 data/index.tsから国内路線データを抽出中...');
  
  const dataIndexPath = path.join(__dirname, '..', 'src', 'data', 'index.ts');
  
  if (!fs.existsSync(dataIndexPath)) {
    console.error('❌ data/index.ts が見つかりません');
    return [];
  }
  
  const content = fs.readFileSync(dataIndexPath, 'utf8');
  
  // 国内路線のパターンを抽出（より包括的なパターン）
  const domesticRoutePattern = /['"](HND|NRT|ITM|KIX|CTS|FUK|OKA|NGO|KMJ|KOJ|MYJ|TAK|KCZ|AOJ|AXT|SDJ|HIJ|OKJ|MYZ|OIT|HKD|AKJ|KMQ|TOY|FSZ|MMJ|ISG|MMY|ASJ|TKN|KKX|TNE|YAK|OBO|KUH|MMB|UBJ|DNA|SHI|KJP|OKE|NGS)-(HND|NRT|ITM|KIX|CTS|FUK|OKA|NGO|KMJ|KOJ|MYJ|TAK|KCZ|AOJ|AXT|SDJ|HIJ|OKJ|MYZ|OIT|HKD|AKJ|KMQ|TOY|FSZ|MMJ|ISG|MMY|ASJ|TKN|KKX|TNE|YAK|OBO|KUH|MMB|UBJ|DNA|SHI|KJP|OKE|NGS)['"][:\s]/g;
  
  const matches = content.match(domesticRoutePattern) || [];
  
  const routes = matches.map(match => {
    const routeMatch = match.match(/([A-Z]{3})-([A-Z]{3})/);
    if (routeMatch) {
      return { departure: routeMatch[1], arrival: routeMatch[2] };
    }
    return null;
  }).filter(Boolean);
  
  console.log(`✅ ${routes.length}路線を抽出しました`);
  return routes;
}

// 国際線路線データを抽出する関数
function extractInternationalRoutes() {
  console.log('📂 data/internationalMiles.tsから国際路線データを抽出中...');
  
  const internationalMilesPath = path.join(__dirname, '..', 'src', 'data', 'internationalMiles.ts');
  
  if (!fs.existsSync(internationalMilesPath)) {
    console.error('❌ data/internationalMiles.ts が見つかりません');
    return [];
  }
  
  const content = fs.readFileSync(internationalMilesPath, 'utf8');
  
  // 国際路線のパターンを抽出
  const internationalRoutePattern = /departure:\s*['"](HND|NRT|ITM|KIX|CTS|FUK|OKA|NGO)['"]\s*,\s*arrival:\s*['"](LAX|JFK|SFO|YVR|SEA|DFW|LHR|CDG|FRA|AMS|ZUR|MUC|ICN|TPE|HKG|SIN|BKK|KUL|MNL|PVG|PEK|DEL|SYD|MEL|AKL|DXB|DOH)['"]/g;
  
  const matches = content.match(internationalRoutePattern) || [];
  
  const routes = matches.map(match => {
    const routeMatch = match.match(/departure:\s*['"](.*?)['"]\s*,\s*arrival:\s*['"](.*?)['"]/);
    if (routeMatch) {
      return { departure: routeMatch[1], arrival: routeMatch[2] };
    }
    return null;
  }).filter(Boolean);
  
  console.log(`✅ ${routes.length}国際路線を抽出しました`);
  return routes;
}

// 一般的な日本-海外主要都市の路線を追加
function getCommonInternationalRoutes() {
  const japaneseAirports = ['HND', 'NRT', 'KIX', 'ITM', 'CTS', 'FUK', 'OKA', 'NGO'];
  const internationalAirports = [
    // 北米
    'LAX', 'JFK', 'SFO', 'YVR', 'SEA', 'DFW',
    // ヨーロッパ  
    'LHR', 'CDG', 'FRA', 'AMS', 'ZUR', 'MUC',
    // アジア
    'ICN', 'TPE', 'HKG', 'SIN', 'BKK', 'KUL', 'MNL', 'PVG', 'PEK', 'DEL',
    // オセアニア
    'SYD', 'MEL', 'AKL',
    // 中東
    'DXB', 'DOH'
  ];
  
  const routes = [];
  
  // 主要な国際路線のみを追加（実際に運航されている路線）
  const actualRoutes = [
    // 羽田
    { departure: 'HND', arrival: 'LAX' },
    { departure: 'HND', arrival: 'JFK' },
    { departure: 'HND', arrival: 'SFO' },
    { departure: 'HND', arrival: 'YVR' },
    { departure: 'HND', arrival: 'LHR' },
    { departure: 'HND', arrival: 'CDG' },
    { departure: 'HND', arrival: 'FRA' },
    { departure: 'HND', arrival: 'ICN' },
    { departure: 'HND', arrival: 'TPE' },
    { departure: 'HND', arrival: 'HKG' },
    { departure: 'HND', arrival: 'SIN' },
    { departure: 'HND', arrival: 'BKK' },
    { departure: 'HND', arrival: 'SYD' },
    
    // 成田
    { departure: 'NRT', arrival: 'LAX' },
    { departure: 'NRT', arrival: 'JFK' },
    { departure: 'NRT', arrival: 'SFO' },
    { departure: 'NRT', arrival: 'YVR' },
    { departure: 'NRT', arrival: 'SEA' },
    { departure: 'NRT', arrival: 'DFW' },
    { departure: 'NRT', arrival: 'LHR' },
    { departure: 'NRT', arrival: 'CDG' },
    { departure: 'NRT', arrival: 'FRA' },
    { departure: 'NRT', arrival: 'AMS' },
    { departure: 'NRT', arrival: 'ZUR' },
    { departure: 'NRT', arrival: 'MUC' },
    { departure: 'NRT', arrival: 'ICN' },
    { departure: 'NRT', arrival: 'TPE' },
    { departure: 'NRT', arrival: 'HKG' },
    { departure: 'NRT', arrival: 'SIN' },
    { departure: 'NRT', arrival: 'BKK' },
    { departure: 'NRT', arrival: 'KUL' },
    { departure: 'NRT', arrival: 'MNL' },
    { departure: 'NRT', arrival: 'PVG' },
    { departure: 'NRT', arrival: 'PEK' },
    { departure: 'NRT', arrival: 'DEL' },
    { departure: 'NRT', arrival: 'SYD' },
    { departure: 'NRT', arrival: 'MEL' },
    { departure: 'NRT', arrival: 'AKL' },
    { departure: 'NRT', arrival: 'DXB' },
    { departure: 'NRT', arrival: 'DOH' },
    
    // 関西
    { departure: 'KIX', arrival: 'LAX' },
    { departure: 'KIX', arrival: 'SFO' },
    { departure: 'KIX', arrival: 'YVR' },
    { departure: 'KIX', arrival: 'LHR' },
    { departure: 'KIX', arrival: 'CDG' },
    { departure: 'KIX', arrival: 'FRA' },
    { departure: 'KIX', arrival: 'ICN' },
    { departure: 'KIX', arrival: 'TPE' },
    { departure: 'KIX', arrival: 'HKG' },
    { departure: 'KIX', arrival: 'SIN' },
    { departure: 'KIX', arrival: 'BKK' },
    { departure: 'KIX', arrival: 'KUL' },
    { departure: 'KIX', arrival: 'PVG' },
    { departure: 'KIX', arrival: 'PEK' },
    { departure: 'KIX', arrival: 'SYD' },
    
    // 中部
    { departure: 'NGO', arrival: 'LAX' },
    { departure: 'NGO', arrival: 'YVR' },
    { departure: 'NGO', arrival: 'LHR' },
    { departure: 'NGO', arrival: 'FRA' },
    { departure: 'NGO', arrival: 'ICN' },
    { departure: 'NGO', arrival: 'TPE' },
    { departure: 'NGO', arrival: 'HKG' },
    { departure: 'NGO', arrival: 'SIN' },
    { departure: 'NGO', arrival: 'BKK' },
    
    // 福岡
    { departure: 'FUK', arrival: 'ICN' },
    { departure: 'FUK', arrival: 'TPE' },
    { departure: 'FUK', arrival: 'HKG' },
    { departure: 'FUK', arrival: 'SIN' },
    { departure: 'FUK', arrival: 'BKK' },
    
    // 新千歳
    { departure: 'CTS', arrival: 'ICN' },
    { departure: 'CTS', arrival: 'TPE' },
    { departure: 'CTS', arrival: 'HKG' },
    
    // 那覇
    { departure: 'OKA', arrival: 'ICN' },
    { departure: 'OKA', arrival: 'TPE' },
    { departure: 'OKA', arrival: 'HKG' }
  ];
  
  console.log(`✅ ${actualRoutes.length}の主要国際路線を追加しました`);
  return actualRoutes;
}

// 距離テーブルを生成
function generateDistanceTable() {
  // 既存の国内線距離テーブルを読み込み
  const existingDistancesPath = path.join(__dirname, '..', 'src', 'data', 'distances.json');
  let existingDistances = {};
  
  if (fs.existsSync(existingDistancesPath)) {
    try {
      const existingContent = fs.readFileSync(existingDistancesPath, 'utf8');
      existingDistances = JSON.parse(existingContent);
      console.log(`📂 既存の国内線距離テーブルを読み込み: ${Object.keys(existingDistances).length / 2}路線`);
    } catch (error) {
      console.warn('⚠️ 既存の距離テーブル読み込みに失敗:', error.message);
    }
  }
  
  const domesticRoutes = extractRoutes();
  const extractedInternationalRoutes = extractInternationalRoutes();
  const commonInternationalRoutes = getCommonInternationalRoutes();
  
  // 重複を除去して結合
  const allInternationalRoutes = [];
  const seenRoutes = new Set();
  
  [...extractedInternationalRoutes, ...commonInternationalRoutes].forEach(route => {
    const key = `${route.departure}-${route.arrival}`;
    if (!seenRoutes.has(key)) {
      seenRoutes.add(key);
      allInternationalRoutes.push(route);
    }
  });
  
  const allRoutes = [...domesticRoutes, ...allInternationalRoutes];
  
  console.log(`📊 処理対象: 国内線${domesticRoutes.length}路線 + 国際線${allInternationalRoutes.length}路線 = 合計${allRoutes.length}路線`);
  
  // 既存の距離データから開始
  const distances = { ...existingDistances };
  let calculated = 0;
  let skipped = 0;
  let fromExisting = Object.keys(existingDistances).length / 2;
  
  allRoutes.forEach(route => {
    const dep = route.departure;
    const arr = route.arrival;
    const key = `${dep}-${arr}`;
    const reverseKey = `${arr}-${dep}`;
    
    // 既に存在する場合はスキップ
    if (distances[key] || distances[reverseKey]) {
      return;
    }
    
    const airport1 = airportsWithCoordinates[dep];
    const airport2 = airportsWithCoordinates[arr];
    
    if (!airport1 || !airport2) {
      console.warn(`⚠️ 座標不明: ${dep} (${airport1 ? '✓' : '✗'}) -> ${arr} (${airport2 ? '✓' : '✗'})`);
      skipped++;
      return;
    }
    
    const distance = Math.round(haversine(
      airport1.lat, airport1.lon,
      airport2.lat, airport2.lon
    ));
    
    // 両方向の距離を保存
    distances[`${dep}-${arr}`] = distance;
    distances[`${arr}-${dep}`] = distance;
    
    const routeType = ['LAX', 'JFK', 'SFO', 'YVR', 'SEA', 'DFW', 'LHR', 'CDG', 'FRA', 'AMS', 'ZUR', 'MUC', 'ICN', 'TPE', 'HKG', 'SIN', 'BKK', 'KUL', 'MNL', 'PVG', 'PEK', 'DEL', 'SYD', 'MEL', 'AKL', 'DXB', 'DOH'].includes(arr) ? '🌏' : '✈️';
    
    console.log(`${routeType} ${dep}-${arr}: ${distance}km`);
    calculated++;
  });
  
  console.log(`📊 生成完了:`);
  console.log(`  既存データ: ${fromExisting}ペア`);
  console.log(`  新規計算: ${calculated}ペア`);
  console.log(`  スキップ: ${skipped}ペア`);
  console.log(`  総距離エントリ: ${Object.keys(distances).length}件`);
  
  return distances;
}

// 空港座標辞書を生成
function generateAirportsDictionary() {
  console.log('🏢 空港座標辞書生成...');
  
  const airports = {};
  let count = 0;
  
  Object.entries(airportsWithCoordinates).forEach(([code, data]) => {
    airports[code] = {
      lat: data.lat,
      lon: data.lon,
      name: data.name
    };
    count++;
  });
  
  console.log(`✅ ${count}空港の座標を登録`);
  return airports;
}

// メイン処理
function main() {
  try {
    // 距離テーブル生成
    const distances = generateDistanceTable();
    
    // ファイルに保存
    const distancesPath = path.join(__dirname, '..', 'src', 'data', 'distances.json');
    fs.writeFileSync(distancesPath, JSON.stringify(distances, null, 2), 'utf8');
    console.log(`💾 ${distancesPath} に保存完了`);
    
    // 空港座標辞書生成
    const airports = generateAirportsDictionary();
    
    // ファイルに保存
    const airportsPath = path.join(__dirname, '..', 'src', 'data', 'airports.json');
    fs.writeFileSync(airportsPath, JSON.stringify(airports, null, 2), 'utf8');
    console.log(`💾 ${airportsPath} に保存完了`);
    
    console.log(`\n🎉 距離テーブル生成完了！`);
    console.log(`次は flightService.ts の getEstimatedDistance() を更新してください。`);
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

// 実行
main();
