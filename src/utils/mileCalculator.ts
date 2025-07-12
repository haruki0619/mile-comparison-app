import { 
  SearchForm, 
  SearchResult, 
  AirlineMileInfo, 
  Airline, 
  Route 
} from '../types';
import { 
  airports, 
  routes, 
  anaMileChart, 
  jalMileChart, 
  solaseedMileChart,
  getDistanceCategory,
  getSolaseedDistanceCategory,
  getSeason 
} from '../data';

// デバッグ用ログ関数
const debugLog = (message: string, data?: unknown) => {
  console.log(`🧮 [MileCalculator] ${message}`, data || '');
};

// 路線検索
export function findRoute(departure: string, arrival: string): Route | null {
  debugLog('Finding route', { departure, arrival });
  const route = routes.find(route => 
    (route.departure === departure && route.arrival === arrival) ||
    (route.departure === arrival && route.arrival === departure)
  ) || null;
  debugLog('Route found', route);
  return route;
}

// 空港情報を取得
export function getAirport(code: string) {
  debugLog('Getting airport', code);
  const airport = airports.find(airport => airport.code === code);
  debugLog('Airport found', airport);
  return airport;
}

// 航空会社別マイル計算
export function calculateMiles(airline: Airline, distance: number, season: 'regular' | 'peak' | 'off'): number {
  let mileChart;
  let distanceCategory;

  switch (airline) {
    case 'ANA':
      mileChart = anaMileChart;
      distanceCategory = getDistanceCategory(distance);
      break;
    case 'JAL':
      mileChart = jalMileChart;
      distanceCategory = getDistanceCategory(distance);
      break;
    case 'SOLASEED':
      mileChart = solaseedMileChart;
      distanceCategory = getSolaseedDistanceCategory(distance);
      break;
    default:
      return 0;
  }

  const requirement = mileChart[distanceCategory];
  if (!requirement) return 0;

  return requirement[season];
}

// 予約開始日を取得
export function getBookingStartDays(airline: Airline): number {
  switch (airline) {
    case 'ANA':
      return 355; // 搭乗日の355日前
    case 'JAL':
      return 360; // 搭乗日の360日前
    case 'SOLASEED':
      return 90;  // 搭乗日の90日前
    default:
      return 0;
  }
}

// 現金価格の概算（実際のAPIがない場合のモック）
export function estimateCashPrice(airline: Airline, distance: number, season: 'regular' | 'peak' | 'off'): number {
  let basePrice;
  
  // 距離による基本料金
  if (distance <= 300) basePrice = 15000;
  else if (distance <= 600) basePrice = 25000;
  else if (distance <= 800) basePrice = 35000;
  else if (distance <= 1000) basePrice = 40000;
  else if (distance <= 2000) basePrice = 50000;
  else basePrice = 60000;

  // 航空会社による調整
  switch (airline) {
    case 'ANA':
      basePrice *= 1.1; // ANAは少し高め
      break;
    case 'JAL':
      basePrice *= 1.05; // JALは標準
      break;
    case 'SOLASEED':
      basePrice *= 0.85; // ソラシドエアは安め
      break;
  }

  // シーズンによる調整
  switch (season) {
    case 'peak':
      basePrice *= 1.5;
      break;
    case 'off':
      basePrice *= 0.8;
      break;
    default:
      break;
  }

  return Math.round(basePrice);
}

// ディスカウント情報を取得（モック）
export function getDiscountInfo(airline: Airline, route: Route, date: string) {
  // 実際にはAPIやデータベースから取得
  // ここではランダムにディスカウントを適用
  const random = Math.random();
  
  if (random < 0.3) { // 30%の確率でディスカウント
    const discountTypes = ['tokutabi', 'timesale', 'campaign'] as const;
    const type = discountTypes[Math.floor(Math.random() * discountTypes.length)];
    
    return {
      type,
      discountedMiles: Math.round(calculateMiles(airline, route.distance, getSeason(date)) * 0.7),
      validUntil: '2025-08-31'
    };
  }
  
  return undefined;
}

// メインの検索機能
export async function searchFlights(searchForm: SearchForm): Promise<SearchResult | null> {
  debugLog('=== SEARCH FLIGHTS START ===');
  debugLog('Search form received', searchForm);
  
  // 1秒の遅延を追加してローディング状態をテスト
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const route = findRoute(searchForm.departure, searchForm.arrival);
  if (!route) {
    debugLog('❌ Route not found');
    throw new Error(`路線が見つかりません: ${searchForm.departure} → ${searchForm.arrival}`);
  }
  debugLog('✅ Route found', route);

  const season = getSeason(searchForm.date);
  debugLog('Season determined', season);
  
  const airlines: Airline[] = ['ANA', 'JAL', 'SOLASEED'];
  debugLog('Processing airlines', airlines);
  
  const airlineResults: AirlineMileInfo[] = airlines.map(airline => {
    debugLog(`Processing ${airline}`);
    
    const cashPrice = estimateCashPrice(airline, route.distance, season);
    const bookingStartDays = getBookingStartDays(airline);
    const discount = getDiscountInfo(airline, route, searchForm.date);

    const result = {
      airline,
      miles: {
        regular: calculateMiles(airline, route.distance, 'regular'),
        peak: calculateMiles(airline, route.distance, 'peak'),
        off: calculateMiles(airline, route.distance, 'off'),
      },
      cashPrice,
      bookingStartDays,
      discount,
    };
    
    debugLog(`${airline} result`, result);
    return result;
  });

  const finalResult = {
    route,
    date: searchForm.date,
    airlines: airlineResults,
    season,
  };
  
  debugLog('=== SEARCH FLIGHTS COMPLETE ===', finalResult);
  return finalResult;
}

// 予約開始日を計算
export function calculateBookingStartDate(flightDate: string, daysBefore: number): string {
  const date = new Date(flightDate);
  date.setDate(date.getDate() - daysBefore);
  return date.toISOString().split('T')[0];
}

// マイルと現金の比較（マイルの価値計算）
export function calculateMileValue(miles: number, cashPrice: number): number {
  if (miles === 0) return 0;
  return cashPrice / miles;
}
