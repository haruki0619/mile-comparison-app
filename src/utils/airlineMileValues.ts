// 航空会社別マイル基準価値データ（2025年7月版）
// 各航空会社のマイルプログラムの実質価値を定義

export interface AirlineMileValue {
  programName: string;
  baseValue: number; // 基準価値（円/マイル）
  minValue: number;  // 最低価値
  maxValue: number;  // 最高価値
  averageValue: number; // 平均価値
  notes: string[];
  transferPartners?: string[];
}

// 航空会社別マイル価値データベース
export const airlineMileValues: { [airline: string]: AirlineMileValue } = {
  'ANA': {
    programName: 'ANAマイレージクラブ',
    baseValue: 2.0, // 基準価値
    minValue: 1.0,  // 国内線普通席利用時
    maxValue: 8.0,  // 国際線ファーストクラス利用時
    averageValue: 2.5,
    notes: [
      '国内線: 1.5-2.5円/マイル',
      '国際線エコノミー: 2.0-4.0円/マイル', 
      '国際線ビジネス: 4.0-6.0円/マイル',
      'ファーストクラス: 6.0-8.0円/マイル',
      'とく旅マイル利用時は価値上昇'
    ],
    transferPartners: ['SPGアメックス', 'マリオット', 'ヒルトン']
  },
  'JAL': {
    programName: 'JALマイレージバンク',
    baseValue: 2.2, // 基準価値（PLUSで改善）
    minValue: 1.2,
    maxValue: 7.5,
    averageValue: 2.8,
    notes: [
      'Award Ticket PLUS導入で価値向上',
      '国内線: 1.5-2.8円/マイル',
      '国際線エコノミー: 2.2-4.5円/マイル',
      '国際線ビジネス: 4.5-6.5円/マイル',
      'PLUS変動制により季節・需要で変動'
    ],
    transferPartners: ['SPGアメックス', 'マリオット', 'ヒルトン']
  },
  'United': {
    programName: 'MileagePlus',
    baseValue: 1.8,
    minValue: 0.8,
    maxValue: 6.0,
    averageValue: 2.1,
    notes: [
      '燃油サーチャージ無料が大きなメリット',
      '変動制導入で価格変動大',
      'パートナー航空会社利用で価値向上',
      'Excursionist Perkで多都市旅行に有利'
    ],
    transferPartners: ['チェース', 'マリオット', 'IHG']
  },
  'British': {
    programName: 'British Airways Avios',
    baseValue: 1.5,
    minValue: 0.8,
    maxValue: 4.0,
    averageValue: 1.8,
    notes: [
      '短距離路線で威力発揮',
      '距離ベース制で効率的',
      '燃油サーチャージ高額',
      '日本国内線でも利用可能'
    ],
    transferPartners: ['チェース', 'アメックス', 'マリオット', 'IHG']
  },
  'Singapore': {
    programName: 'KrisFlyer',
    baseValue: 2.0,
    minValue: 1.0,
    maxValue: 5.5,
    averageValue: 2.3,
    notes: [
      '固定制でシンプル',
      '比較的取りやすい',
      'ストップオーバー制度充実',
      'シンガポール航空の品質高'
    ],
    transferPartners: ['チェース', 'アメックス', 'マリオット']
  },
  'Virgin': {
    programName: 'Virgin Atlantic → ANA特典',
    baseValue: 3.0, // ANA特典利用時の高価値
    minValue: 2.0,
    maxValue: 6.0,
    averageValue: 3.2,
    notes: [
      'ANA特典で破格レート',
      '特にビジネスクラスで威力',
      'ANAより安いマイル数',
      '入手ルート限定的'
    ],
    transferPartners: ['チェース', 'アメックス', 'キャピタルワン']
  },
  'Alaska': {
    programName: 'Alaska Mileage Plan',
    baseValue: 2.5,
    minValue: 1.5,
    maxValue: 5.0,
    averageValue: 2.8,
    notes: [
      'JAL特典で燃油無料',
      'パートナー航空会社豊富',
      'ストップオーバー制度あり',
      '変更手数料無料'
    ],
    transferPartners: ['マリオット', 'ボンボイ']
  },
  'Aeroplan': {
    programName: 'Air Canada Aeroplan',
    baseValue: 1.8,
    minValue: 1.0,
    maxValue: 4.5,
    averageValue: 2.0,
    notes: [
      '燃油サーチャージ無料',
      'エアカナダ以外でも利用可',
      'ストップオーバー制度あり',
      '変更手数料無料'
    ],
    transferPartners: ['アメックス', 'チェース', 'マリオット']
  },
  // マイル制度なし航空会社
  'Skymark': {
    programName: 'マイル制度なし',
    baseValue: 0,
    minValue: 0,
    maxValue: 0,
    averageValue: 0,
    notes: ['スカイマークはマイル制度を提供していません'],
    transferPartners: []
  },
  'Peach': {
    programName: 'Peach Points（マイル制度なし）',
    baseValue: 0,
    minValue: 0,
    maxValue: 0,
    averageValue: 0,
    notes: ['ピーチはポイント制でマイル制度はありません'],
    transferPartners: []
  },
  'Jetstar': {
    programName: 'マイル制度なし',
    baseValue: 0,
    minValue: 0,
    maxValue: 0,
    averageValue: 0,
    notes: ['ジェットスターはマイル制度を提供していません'],
    transferPartners: []
  },
  'Solaseed': {
    programName: 'ソラシドエアマイル',
    baseValue: 1.0,
    minValue: 0.8,
    maxValue: 1.5,
    averageValue: 1.1,
    notes: [
      'ANAマイルへの移行可能',
      '独自の特典航空券あり',
      '価値は限定的'
    ],
    transferPartners: ['ANA']
  }
};

// 航空会社名から正規化されたキーに変換
export function normalizeAirlineKey(airlineName: string): string {
  const mapping: { [key: string]: string } = {
    'ANA': 'ANA',
    'JAL': 'JAL', 
    'ユナイテッド航空': 'United',
    'United': 'United',
    'ブリティッシュ・エアウェイズ': 'British',
    'British Airways': 'British',
    'シンガポール航空': 'Singapore',
    'Singapore Airlines': 'Singapore',
    'Virgin Atlantic': 'Virgin',
    'Alaska Airlines': 'Alaska',
    'Air Canada': 'Aeroplan',
    'スカイマーク': 'Skymark',
    'ピーチ': 'Peach',
    'ジェットスター': 'Jetstar',
    'Jetstar': 'Jetstar',
    'ソラシドエア': 'Solaseed',
    'SOLASEED': 'Solaseed'
  };
  
  console.log(`🔑 normalizeAirlineKey: "${airlineName}" -> "${mapping[airlineName] || airlineName}"`);
  return mapping[airlineName] || airlineName; // デフォルトは元の名前をそのまま返す
}

// 特定ルートでのマイル価値を計算
export function calculateSpecificMileValue(
  airlineName: string,
  cashPrice: number,
  requiredMiles: number,
  fees: number = 0
): {
  valuePerMile: number;
  interpretation: string;
  recommendation: string;
  comparisonWithBaseline: string;
} {
  const normalizedKey = normalizeAirlineKey(airlineName);
  const airlineData = airlineMileValues[normalizedKey];
  
  if (!airlineData || requiredMiles === 0) {
    return {
      valuePerMile: 0,
      interpretation: 'マイル制度なし',
      recommendation: '現金購入のみ可能',
      comparisonWithBaseline: 'N/A'
    };
  }
  
  // 実際の価値計算
  const valuePerMile = (cashPrice - fees) / requiredMiles;
  const baseValue = airlineData.baseValue;
  
  // 解釈を生成
  let interpretation = '';
  let recommendation = '';
  
  if (valuePerMile >= airlineData.maxValue * 0.8) {
    interpretation = '非常に高価値';
    recommendation = '即座にマイル利用を強く推奨';
  } else if (valuePerMile >= baseValue * 1.5) {
    interpretation = '高価値';
    recommendation = 'マイル利用推奨';
  } else if (valuePerMile >= baseValue) {
    interpretation = '標準的価値';
    recommendation = 'マイル利用検討可';
  } else if (valuePerMile >= baseValue * 0.7) {
    interpretation = '低価値';
    recommendation = 'マイル利用は慎重に検討';
  } else {
    interpretation = '非常に低価値';
    recommendation = '現金購入を強く推奨';
  }
  
  // ベースラインとの比較
  const ratio = valuePerMile / baseValue;
  let comparisonWithBaseline = '';
  
  if (ratio >= 1.5) {
    comparisonWithBaseline = `基準値の${ratio.toFixed(1)}倍（大幅に高価値）`;
  } else if (ratio >= 1.2) {
    comparisonWithBaseline = `基準値の${ratio.toFixed(1)}倍（高価値）`;
  } else if (ratio >= 0.8) {
    comparisonWithBaseline = `基準値程度（標準的）`;
  } else if (ratio >= 0.5) {
    comparisonWithBaseline = `基準値の${ratio.toFixed(1)}倍（低価値）`;
  } else {
    comparisonWithBaseline = `基準値の${ratio.toFixed(1)}倍（大幅に低価値）`;
  }
  
  return {
    valuePerMile,
    interpretation,
    recommendation,
    comparisonWithBaseline
  };
}

// マイル制度の有無をチェック
export function hasMileProgram(airlineName: string): boolean {
  const normalizedKey = normalizeAirlineKey(airlineName);
  const airlineData = airlineMileValues[normalizedKey];
  return airlineData ? airlineData.baseValue > 0 : false;
}

// 航空会社の基準マイル価値を取得
export function getBaselineMileValue(airlineName: string): number {
  const normalizedKey = normalizeAirlineKey(airlineName);
  const airlineData = airlineMileValues[normalizedKey];
  return airlineData?.baseValue || 0;
}
