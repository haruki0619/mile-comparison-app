// マイル価値計算のロジック

export interface MileValueResult {
  program: string;
  requiredMiles: number;
  cashPrice: number;
  fuelSurcharge: number;
  taxes: number;
  totalCost: number;
  valuePerMile: number;
  rating: 'excellent' | 'good' | 'fair' | 'poor' | 'bad';
  recommendation: string;
  features: {
    stopover: string;
    openJaw: boolean;
    changesFee: number;
  };
  isPartnerBooking?: boolean;
  specialNote?: string;
}

export interface MileCalculatorData {
  [key: string]: {
    [cabinClass: string]: {
      miles: number;
      fuelSurcharge: number;
      taxes: number;
      features: {
        stopover: string;
        openJaw: boolean;
        changesFee: number;
      };
      isPartnerBooking?: boolean;
      specialNote?: string;
    };
  };
}

// 路線別のフォールバック価格（API失敗時のみ使用）
export const fallbackPrices: Record<string, number> = {
  'NRT-LAX': 270000, // 年末ピーク
  'NRT-LHR': 240000, // お盆ピーク
  'NRT-ICN': 25000,  // GWピーク
  'NRT-SIN': 62000,  // レギュラーシーズン
  'HND-ITM': 20690,  // 東京-大阪（実測平均）
  'HND-OKA': 32000   // 東京-沖縄（実測平均）
};

// 価値レーティングの計算
export const calculateRating = (valuePerMile: number): 'excellent' | 'good' | 'fair' | 'poor' | 'bad' => {
  if (valuePerMile >= 2.5) return 'excellent';
  if (valuePerMile >= 2.0) return 'good';
  if (valuePerMile >= 1.5) return 'fair';
  if (valuePerMile >= 1.0) return 'poor';
  return 'bad';
};

// レーティングに基づく推奨文言の生成
export const getRecommendation = (rating: string, valuePerMile: number): string => {
  switch (rating) {
    case 'excellent':
      return `優秀な価値! 1マイル=${valuePerMile.toFixed(2)}円で非常にお得です`;
    case 'good':
      return `良い価値です。1マイル=${valuePerMile.toFixed(2)}円で利用価値があります`;
    case 'fair':
      return `普通の価値。1マイル=${valuePerMile.toFixed(2)}円ですが、他の選択肢も検討を`;
    case 'poor':
      return `価値が低め。1マイル=${valuePerMile.toFixed(2)}円。現金の方が良い可能性があります`;
    default:
      return `価値が非常に低い。1マイル=${valuePerMile.toFixed(2)}円。現金購入を強く推奨`;
  }
};

// マイル価値の計算
export const calculateMileValue = (
  cashPrice: number,
  mileData: any,
  cabinClass: string = 'economy'
): MileValueResult[] => {
  const results: MileValueResult[] = [];

  Object.entries(mileData).forEach(([program, data]: [string, any]) => {
    const classData = data[cabinClass];
    if (!classData) return;

    const totalCost = classData.fuelSurcharge + classData.taxes;
    const valuePerMile = (cashPrice - totalCost) / classData.miles;
    const rating = calculateRating(valuePerMile);
    const recommendation = getRecommendation(rating, valuePerMile);

    results.push({
      program,
      requiredMiles: classData.miles,
      cashPrice,
      fuelSurcharge: classData.fuelSurcharge,
      taxes: classData.taxes,
      totalCost,
      valuePerMile: Math.max(0, valuePerMile),
      rating,
      recommendation,
      features: classData.features,
      isPartnerBooking: classData.isPartnerBooking,
      specialNote: classData.specialNote
    });
  });

  return results.sort((a, b) => b.valuePerMile - a.valuePerMile);
};
