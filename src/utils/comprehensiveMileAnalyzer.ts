import { foreignAirlineDetails } from '../data/foreignAirlines';

// 包括的マイル価値分析機能（2025年版）
export interface MileValueAnalysis {
  programId: string;
  programName: string;
  alliance: string;
  route: string;
  requiredMiles: number;
  cashPrice: number;
  totalCost: number; // マイル + 税金・サーチャージ
  valuePerMile: number; // 円/マイル
  efficiency: 'excellent' | 'good' | 'fair' | 'poor';
  recommendation: 'use_miles' | 'buy_cash' | 'consider_alternatives';
  features: {
    stopover: string;
    openJaw: boolean;
    changesFee: number;
  };
}

export interface RouteComparison {
  route: string;
  analyses: MileValueAnalysis[];
  bestMileOption: MileValueAnalysis | null;
  cashAlternative: {
    price: number;
    airline: string;
  };
}

// 燃油サーチャージ・税金データ（2025年7月現在）
const fuelSurcharges: { [route: string]: { [airline: string]: number } } = {
  'NRT-LAX': {
    united: 0,
    ana: 46200,
    jal: 66000,
    singapore: 34000,
    british_airways: 52500, // GBP350相当
    american: 66000,
    cathay_pacific: 44000,
    delta: 0,
  },
  'NRT-LHR': {
    united: 0,
    ana: 46200,
    jal: 66000,
    singapore: 34000,
    british_airways: 46200, // GBP310相当
    american: 66000,
    cathay_pacific: 44000,
    flying_blue: 46000,
    emirates: 33000,
  },
  'NRT-ICN': {
    united: 0,
    ana: 4400,
    jal: 7000,
    singapore: 3000,
    british_airways: 7000,
    american: 7000,
    cathay_pacific: 7000,
    delta: 4400,
    flying_blue: 4400,
  },
  'NRT-SIN': {
    ana: 22000,
    jal: 22000,
    singapore: 22000,
    cathay_pacific: 22000,
    flying_blue: 22000,
  },
};

// マイル価値効率判定
export function calculateMileEfficiency(valuePerMile: number): 'excellent' | 'good' | 'fair' | 'poor' {
  if (valuePerMile >= 3.0) return 'excellent';
  if (valuePerMile >= 2.0) return 'good';
  if (valuePerMile >= 1.5) return 'fair';
  return 'poor';
}

// 推奨判定ロジック
export function getRecommendation(
  valuePerMile: number,
  efficiency: 'excellent' | 'good' | 'fair' | 'poor',
  totalCost: number,
  cashPrice: number
): 'use_miles' | 'buy_cash' | 'consider_alternatives' {
  // 効率が良く、総コストが現金価格の80%以下なら推奨
  if (efficiency === 'excellent' && totalCost < cashPrice * 0.8) {
    return 'use_miles';
  }
  
  // 効率が良いが、総コストが現金価格と同程度なら代替案検討
  if (efficiency === 'good' && totalCost > cashPrice * 0.9) {
    return 'consider_alternatives';
  }
  
  // 効率が悪い場合は現金購入推奨
  if (efficiency === 'poor') {
    return 'buy_cash';
  }
  
  // その他は代替案検討
  return 'consider_alternatives';
}

// 包括的マイル価値分析
export function analyzeMileValue(
  route: string,
  cashPrice: number,
  targetClass: 'economy' | 'business' | 'first' = 'economy'
): RouteComparison {
  const analyses: MileValueAnalysis[] = [];
  
  // 各航空会社のマイルプログラムを分析
  for (const airline of foreignAirlineDetails) {
    const routeData = airline.routes[route];
    if (!routeData) continue;
    
    const requiredMiles = routeData[targetClass];
    if (!requiredMiles) continue;
    
    // 燃油サーチャージ・税金計算
    const airlineSurcharge = fuelSurcharges[route]?.[airline.id] || 0;
    const baseTaxes = 10000; // 基本空港税・諸税
    const totalTaxes = airlineSurcharge + baseTaxes;
    
    const totalCost = totalTaxes; // マイルは現金換算しない
    const valuePerMile = Math.max(0, (cashPrice - totalCost) / requiredMiles);
    const efficiency = calculateMileEfficiency(valuePerMile);
    const recommendation = getRecommendation(valuePerMile, efficiency, totalCost, cashPrice);
    
    const analysis: MileValueAnalysis = {
      programId: airline.id,
      programName: `${airline.name} ${airline.program}`,
      alliance: airline.alliance,
      route,
      requiredMiles,
      cashPrice,
      totalCost,
      valuePerMile,
      efficiency,
      recommendation,
      features: {
        stopover: airline.features.stopover,
        openJaw: airline.features.openJaw,
        changesFee: airline.features.changesFee,
      },
    };
    
    analyses.push(analysis);
  }
  
  // 最良のマイルオプションを特定
  const recommendedOptions = analyses.filter(a => a.recommendation === 'use_miles');
  const sortedAnalyses = analyses.sort((a, b) => b.valuePerMile - a.valuePerMile);
  
  let bestMileOption: MileValueAnalysis | null = null;
  if (recommendedOptions.length > 0) {
    const sorted = recommendedOptions.sort((a, b) => b.valuePerMile - a.valuePerMile);
    bestMileOption = sorted[0] || null;
  } else if (sortedAnalyses.length > 0) {
    bestMileOption = sortedAnalyses[0] || null;
  }
  
  return {
    route,
    analyses: sortedAnalyses,
    bestMileOption,
    cashAlternative: {
      price: cashPrice,
      airline: 'LCC/格安航空券',
    },
  };
}

// 複数路線での横断比較
export function compareMultipleRoutes(
  routes: Array<{ route: string; cashPrice: number }>,
  targetClass: 'economy' | 'business' | 'first' = 'economy'
): RouteComparison[] {
  return routes.map(({ route, cashPrice }) => 
    analyzeMileValue(route, cashPrice, targetClass)
  );
}

// マイル貯蓄戦略分析
export interface MileAccumulationStrategy {
  programId: string;
  programName: string;
  alliance: string;
  creditCards: string[];
  transferOptions: Array<{
    source: string;
    rate: number;
    bonus: number;
    minimum: number;
  }>;
  milesExpiry: string;
  estimatedAnnualEarning: number;
  targetRoute: string;
  timeToTarget: number; // 月数
  recommendation: string;
}

// マイル貯蓄戦略分析
export function analyzeMileAccumulation(
  targetRoute: string,
  targetMiles: number,
  annualSpending: number = 2000000, // 年間200万円
  currentMiles: { [programId: string]: number } = {}
): MileAccumulationStrategy[] {
  const strategies: MileAccumulationStrategy[] = [];
  
  for (const airline of foreignAirlineDetails) {
    const currentProgram = currentMiles[airline.id] || 0;
    const remainingMiles = Math.max(0, targetMiles - currentProgram);
    
    // クレジットカード利用による年間獲得見込み
    const creditCardEarning = annualSpending * 0.01; // 1%還元と仮定
    
    // ポイント移行による獲得見込み
    const transferOptions = Object.entries(airline.transferRates).map(([source, data]) => ({
      source,
      rate: data.rate,
      bonus: data.bonus,
      minimum: data.minimum,
    }));
    
    const estimatedAnnualEarning = creditCardEarning;
    const timeToTarget = Math.ceil(remainingMiles / estimatedAnnualEarning);
    
    let recommendation = '';
    if (timeToTarget <= 12) {
      recommendation = '1年以内に達成可能 - 推奨';
    } else if (timeToTarget <= 24) {
      recommendation = '2年以内に達成可能 - 検討価値あり';
    } else {
      recommendation = '長期戦略が必要 - 他の選択肢も検討';
    }
    
    strategies.push({
      programId: airline.id,
      programName: `${airline.name} ${airline.program}`,
      alliance: airline.alliance,
      creditCards: airline.creditCards,
      transferOptions,
      milesExpiry: airline.milesExpiry,
      estimatedAnnualEarning,
      targetRoute,
      timeToTarget,
      recommendation,
    });
  }
  
  return strategies.sort((a, b) => a.timeToTarget - b.timeToTarget);
}

// アライアンス別最適化戦略
export function getAllianceOptimization(alliance: 'star' | 'oneworld' | 'skyteam'): {
  airlines: string[];
  transferStrategies: string[];
  routeFlexibility: string[];
  recommendations: string[];
} {
  const allianceData = {
    star: {
      airlines: ['ANA', 'United', 'Singapore', 'Lufthansa', 'Thai', 'Air Canada'],
      transferStrategies: [
        'Marriott Bonvoy → 各プログラム（3:1 + ボーナス）',
        'アメックスMR → Singapore/ANA（1:1）',
        'ANAマイル → United（相互利用可能）',
      ],
      routeFlexibility: [
        'ANA便をUnited/Singaporeマイルで予約',
        'United便をANAマイルで予約（YQ無料）',
        'タイ経由でヨーロッパ・オーストラリア',
      ],
      recommendations: [
        'United：YQ無料、無期限マイル',
        'ANA：日本発着豊富、サービス品質',
        'Singapore：ストップオーバー柔軟',
      ],
    },
    oneworld: {
      airlines: ['JAL', 'American', 'British Airways', 'Cathay Pacific', 'Qantas'],
      transferStrategies: [
        'アメックスMR → British Airways Avios（1:1）',
        'Marriott Bonvoy → 各プログラム（3:1）',
        'JALマイル → British Airways相互利用',
      ],
      routeFlexibility: [
        'JAL便をAmerican/BA Aviosで予約',
        'BA Avios距離ベース制を活用',
        'Cathay Pacific Asia Miles無期限化',
      ],
      recommendations: [
        'Cathay Pacific：無期限マイル、柔軟性',
        'British Airways：距離ベース、アメックス連携',
        'JAL：日本発着充実、国内線強い',
      ],
    },
    skyteam: {
      airlines: ['Delta', 'Air France/KLM', 'Korean Air', 'China Eastern'],
      transferStrategies: [
        'アメックスMR → Flying Blue（1:1）',
        'Marriott Bonvoy → 各プログラム（3:1）',
        'Delta SkyMiles無期限活用',
      ],
      routeFlexibility: [
        'Korean Air経由アジア・ヨーロッパ',
        'KLM/Air France欧州ネットワーク',
        'Delta北米路線充実',
      ],
      recommendations: [
        'Delta：無期限マイル、YQ無料',
        'Flying Blue：アメックス連携、欧州強い',
        'Korean Air：アジア路線充実',
      ],
    },
  };
  
  return allianceData[alliance];
}
