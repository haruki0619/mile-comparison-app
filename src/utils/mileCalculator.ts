import { 
  SearchForm, 
  SearchResult, 
  AirlineMileInfo, 
  Airline 
} from '../types/index';
import { Route, RouteData } from '../types/core';
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
import { 
  internationalAirports,
  internationalRoutes,
  internationalMileCharts,
  getInternationalRegion,
  fuelSurcharge,
  getFuelSurcharge,
  getInternationalMiles,
  otherAirlinesMileChart
} from '../data/internationalMiles';

// デバッグ用ログ関数
const debugLog = (message: string, data?: unknown) => {
  console.log(`🧮 [MileCalculator] ${message}`, data || '');
};

// 路線検索（国内線・国際線対応）
export function findRoute(departure: string, arrival: string): RouteData | null {
  debugLog('Finding route', { departure, arrival });
  
  // 国内線路線を先に検索
  let route = routes.find(route => 
    (route.departure === departure && route.arrival === arrival) ||
    (route.departure === arrival && route.arrival === departure)
  );
  
  // 国内線で見つからない場合は国際線を検索
  if (!route) {
    const intlRoute = internationalRoutes.find(route => 
      (route.departure === departure && route.arrival === arrival) ||
      (route.departure === arrival && route.arrival === departure)
    );
    if (intlRoute) {
      route = intlRoute;
    }
  }
  
  debugLog('Route found', route);
  return route || null;
}

// 空港情報を取得（国内線・国際線対応）
export function getAirport(code: string) {
  debugLog('Getting airport', code);
  
  // 国内空港を先に検索
  let airport = (airports as any)[code];
  
  // 国内空港で見つからない場合は国際空港を検索
  if (!airport) {
    airport = (internationalAirports as any)[code];
  }
  
  debugLog('Airport found', airport);
  return airport;
}

// 国際線かどうかを判定
export function isInternationalRoute(departure: string, arrival: string): boolean {
  const domesticCodes = Object.keys(airports);
  const isDepartureInternational = !domesticCodes.includes(departure);
  const isArrivalInternational = !domesticCodes.includes(arrival);
  
  return isDepartureInternational || isArrivalInternational;
}

// 航空会社別マイル計算（国内線・国際線・他社対応）
export function calculateMiles(
  airline: Airline, 
  distance: number, 
  season: 'regular' | 'peak' | 'off',
  departure?: string,
  arrival?: string
): number {
  debugLog('Calculating miles', { airline, distance, season, departure, arrival });
  
  // 国際線の場合
  if (departure && arrival && isInternationalRoute(departure, arrival)) {
    const intlMiles = getInternationalMiles(airline, departure, arrival, season);
    if (intlMiles && intlMiles > 0) {
      debugLog('International miles calculated', intlMiles);
      return intlMiles;
    }
  }
  
  // 国内線の場合
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
      // その他の航空会社をチェック
      if (otherAirlinesMileChart[airline]) {
        mileChart = otherAirlinesMileChart[airline];
        distanceCategory = getDistanceCategory(distance);
      } else {
        debugLog('Unknown airline', airline);
        return 0;
      }
  }

  const requirement = (mileChart as any)[distanceCategory];
  if (!requirement) {
    debugLog('No requirement found for distance category', distanceCategory);
    return 0;
  }

  const miles = (requirement as any)[season];
  debugLog('Domestic miles calculated', miles);
  return miles;
}

// 予約開始日を取得（全航空会社対応）
export function getBookingStartDays(airline: Airline): number {
  switch (airline) {
    case 'ANA':
      return 355; // 搭乗日の355日前
    case 'JAL':
      return 360; // 搭乗日の360日前
    case 'SOLASEED':
      return 90;  // 搭乗日の90日前
    case 'Peach':
    case 'Jetstar':
    case 'Vanilla':
    case 'Spring':
      return 180; // LCC各社は約半年前
    default:
      return 90;  // その他は3ヶ月前
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
export function getDiscountInfo(airline: Airline, route: RouteData, date: string): {
  type: 'tokutabi' | 'timesale' | 'campaign';
  discountedMiles: number;
  validUntil: string;
} | undefined {
  // 実際にはAPIやデータベースから取得
  // ここではランダムにディスカウントを適用
  const random = Math.random();
  
  if (random < 0.3) { // 30%の確率でディスカウント
    const discountTypes: ('tokutabi' | 'timesale' | 'campaign')[] = ['tokutabi', 'timesale', 'campaign'];
    const randomIndex = Math.floor(Math.random() * discountTypes.length);
    const selectedType = discountTypes[randomIndex];
    
    if (selectedType) {
      return {
        type: selectedType,
        discountedMiles: Math.round(calculateMiles(airline, route.distance || 500, getSeason(date)) * 0.7),
        validUntil: '2025-08-31'
      };
    }
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
  
  // 路線タイプに応じて航空会社を選択
  const isIntl = isInternationalRoute(searchForm.departure, searchForm.arrival);
  let airlines: Airline[];
  
  if (isIntl) {
    // 国際線の場合はANA・JALのみ
    airlines = ['ANA', 'JAL'];
  } else {
    // 国内線の場合は全社対応
    airlines = ['ANA', 'JAL', 'SOLASEED', 'Peach', 'Jetstar'];
  }
  
  debugLog('Processing airlines', { airlines, isInternational: isIntl });
  
  const airlineResults: AirlineMileInfo[] = airlines.map(airline => {
    debugLog(`Processing ${airline}`);
    
    const cashPrice = estimateCashPrice(airline, route.distance || 500, season);
    const bookingStartDays = getBookingStartDays(airline);
    const discount = getDiscountInfo(airline, route, searchForm.date);
    
    // 国際線の場合は燃油サーチャージを追加
    const fuelSurcharge = isIntl ? getFuelSurcharge(airline, searchForm.departure, searchForm.arrival) : undefined;

    const result: AirlineMileInfo = {
      airline,
      miles: {
        regular: calculateMiles(airline, route.distance || 500, 'regular', searchForm.departure, searchForm.arrival),
        peak: calculateMiles(airline, route.distance || 500, 'peak', searchForm.departure, searchForm.arrival),
        off: calculateMiles(airline, route.distance || 500, 'off', searchForm.departure, searchForm.arrival),
      },
      cashPrice,
      bookingStartDays,
      ...(fuelSurcharge && { fuelSurcharge }),
      ...(discount && { discount }), // discountがある場合のみ追加
    };
    
    debugLog(`${airline} result`, result);
    return result;
  });

  const finalResult = {
    flights: [], // 空の配列として初期化
    total: airlineResults.length, // 航空会社数
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
  const result = date.toISOString().split('T')[0];
  return result || flightDate; // フォールバック
}

// マイルと現金の比較（マイルの価値計算）
export function calculateMileValue(miles: number, cashPrice: number): number {
  if (miles === 0) return 0;
  return cashPrice / miles;
}
