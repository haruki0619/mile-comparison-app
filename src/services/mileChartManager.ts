// マイル表の動的管理システム
export interface MileChart {
  id: string;
  airline: 'ANA' | 'JAL';
  class: 'economy' | 'business' | 'premium' | 'first';
  direction: 'oneWay' | 'roundTrip';
  effectiveDate: string; // 適用開始日
  expiryDate?: string; // 適用終了日
  version: string; // バージョン管理
  lastUpdated: string;
  routes: MileRoute[];
}

export interface MileRoute {
  region: string;
  destinations: string[];
  seasons: {
    low?: number;      // ローシーズン/オフピーク
    regular: number;   // レギュラーシーズン
    high?: number;     // ハイシーズン/ピーク
  };
  notes?: string[];
}

export interface MileUpdateEvent {
  id: string;
  airline: 'ANA' | 'JAL';
  changeType: 'increase' | 'decrease' | 'restructure';
  effectiveDate: string;
  description: string;
  impactedRoutes: string[];
  averageIncrease?: number; // 平均上昇率
  announcement: {
    date: string;
    url?: string;
    summary: string;
  };
}

// 最新のマイル表データ（2025年7月時点）
export const CURRENT_MILE_CHARTS: MileChart[] = [
  {
    id: 'ana_economy_2025_06',
    airline: 'ANA',
    class: 'economy',
    direction: 'oneWay',
    effectiveDate: '2025-06-24',
    version: '2025.06.24',
    lastUpdated: '2025-06-24T00:00:00Z',
    routes: [
      {
        region: 'アジア',
        destinations: ['韓国', 'フィリピン', '台湾', '香港'],
        seasons: { regular: 17000 }
      },
      {
        region: 'アジア',
        destinations: ['中国', 'タイ', 'ベトナム', 'ミャンマー'],
        seasons: { low: 15000, regular: 20000, high: 25000 }
      },
      {
        region: 'アジア',
        destinations: ['シンガポール', 'マレーシア', 'インドネシア'],
        seasons: { low: 17500, regular: 23000, high: 30000 }
      },
      {
        region: 'アジア',
        destinations: ['インド'],
        seasons: { low: 22500, regular: 30000, high: 37500 }
      },
      {
        region: 'グアム・サイパン',
        destinations: ['グアム', 'サイパン'],
        seasons: { regular: 10000 }
      },
      {
        region: 'ハワイ',
        destinations: ['ホノルル', 'コナ'],
        seasons: { low: 35000, regular: 40000, high: 43000 }
      },
      {
        region: '北米西海岸',
        destinations: ['ロサンゼルス', 'サンフランシスコ', 'シアトル', 'サンノゼ', 'バンクーバー'],
        seasons: { low: 40000, regular: 50000, high: 55000 }
      },
      {
        region: '北米東海岸',
        destinations: ['ニューヨーク', 'ワシントン', 'シカゴ'],
        seasons: { low: 45000, regular: 55000, high: 60000 }
      },
      {
        region: 'ヨーロッパ',
        destinations: ['ロンドン', 'パリ', 'フランクフルト', 'ミュンヘン', 'ブリュッセル', 'ウィーン'],
        seasons: { low: 45000, regular: 55000, high: 60000 }
      },
      {
        region: 'オセアニア',
        destinations: ['シドニー', 'パース'],
        seasons: { low: 37500, regular: 45000, high: 50000 }
      }
    ]
  },
  {
    id: 'jal_economy_2025_06',
    airline: 'JAL',
    class: 'economy',
    direction: 'oneWay',
    effectiveDate: '2025-06-10',
    version: '2025.06.10',
    lastUpdated: '2025-06-10T00:00:00Z',
    routes: [
      {
        region: 'アジア',
        destinations: ['韓国', 'フィリピン', '台湾', '香港', '中国', 'タイ'],
        seasons: { regular: 17500 }
      },
      {
        region: 'アジア',
        destinations: ['シンガポール', 'マレーシア', 'インドネシア', 'ベトナム'],
        seasons: { low: 20000, regular: 25000, high: 30000 }
      },
      {
        region: 'インド',
        destinations: ['デリー', 'バンガロール'],
        seasons: { low: 27500, regular: 35000, high: 42500 }
      },
      {
        region: 'グアム',
        destinations: ['グアム'],
        seasons: { regular: 10000 }
      },
      {
        region: 'ハワイ',
        destinations: ['ホノルル', 'コナ'],
        seasons: { low: 40000, regular: 44000, high: 48000 }
      },
      {
        region: '北米西海岸',
        destinations: ['ロサンゼルス', 'サンフランシスコ', 'シアトル', 'サンディエゴ', 'バンクーバー'],
        seasons: { low: 50000, regular: 60000, high: 65000 }
      },
      {
        region: '北米東海岸',
        destinations: ['ニューヨーク', 'ボストン', 'ダラス'],
        seasons: { low: 55000, regular: 65000, high: 70000 }
      },
      {
        region: 'ヨーロッパ',
        destinations: ['ロンドン', 'パリ', 'フランクフルト', 'ヘルシンキ'],
        seasons: { low: 52500, regular: 62500, high: 67500 }
      },
      {
        region: 'オセアニア',
        destinations: ['シドニー', 'メルボルン'],
        seasons: { low: 40000, regular: 48000, high: 52000 }
      }
    ]
  }
];

// マイル表の更新履歴
export const MILE_UPDATE_HISTORY: MileUpdateEvent[] = [
  {
    id: 'ana_increase_2025_06',
    airline: 'ANA',
    changeType: 'increase',
    effectiveDate: '2025-06-24',
    description: 'ANA国際線特典航空券の必要マイル数改定',
    impactedRoutes: ['北米', 'ヨーロッパ', 'アジア一部'],
    averageIncrease: 12.5,
    announcement: {
      date: '2025-04-15',
      url: 'https://www.ana.co.jp/ja/jp/amc/news/mile-chart-update/',
      summary: '6月24日より国際線特典航空券の必要マイル数を改定します。平均12.5%の増加となります。'
    }
  },
  {
    id: 'jal_increase_2025_06',
    airline: 'JAL',
    changeType: 'increase',
    effectiveDate: '2025-06-10',
    description: 'JAL国際線特典航空券の必要マイル数改定',
    impactedRoutes: ['ハワイ', '北米', 'ヨーロッパ'],
    averageIncrease: 10.0,
    announcement: {
      date: '2025-03-20',
      url: 'https://www.jal.co.jp/jalmile/news/mile-chart-2025/',
      summary: '6月10日よりJAL国際線特典航空券の必要マイル数を改定いたします。'
    }
  }
];

// マイル表検索・比較機能
export class MileChartManager {
  private charts: MileChart[] = CURRENT_MILE_CHARTS;
  private updateHistory: MileUpdateEvent[] = MILE_UPDATE_HISTORY;

  // 特定の路線と日付での最安マイル数を検索
  findBestMileOption(destination: string, travelDate: string, travelClass: string = 'economy') {
    const results: Array<{
      airline: string;
      miles: number;
      season: string;
      isBest: boolean;
      chart: MileChart;
    }> = [];

    for (const chart of this.charts) {
      if (chart.class !== travelClass) continue;
      
      for (const route of chart.routes) {
        if (route.destinations.some(dest => 
          dest.toLowerCase().includes(destination.toLowerCase()) ||
          destination.toLowerCase().includes(dest.toLowerCase())
        )) {
          const season = this.determineSeason(travelDate, chart.airline);
          const miles = route.seasons[season] || route.seasons.regular;
          
          results.push({
            airline: chart.airline,
            miles,
            season,
            isBest: false,
            chart
          });
        }
      }
    }

    // 最安値を特定
    if (results.length > 0) {
      const minMiles = Math.min(...results.map(r => r.miles));
      results.forEach(r => {
        r.isBest = r.miles === minMiles;
      });
    }

    return results.sort((a, b) => a.miles - b.miles);
  }

  // シーズン判定（簡易版）
  private determineSeason(travelDate: string, airline: 'ANA' | 'JAL'): 'low' | 'regular' | 'high' {
    const date = new Date(travelDate);
    const month = date.getMonth() + 1;

    // 簡易的なシーズン判定（実際はより複雑）
    if (month >= 12 || month <= 1) return 'high'; // 年末年始
    if (month >= 7 && month <= 8) return 'high';  // 夏休み
    if (month >= 4 && month <= 5) return 'high';  // GW期間
    if (month >= 2 && month <= 3) return 'low';   // 閑散期
    return 'regular';
  }

  // 最新の更新情報を取得
  getLatestUpdates(limit: number = 5) {
    return this.updateHistory
      .sort((a, b) => new Date(b.announcement.date).getTime() - new Date(a.announcement.date).getTime())
      .slice(0, limit);
  }

  // マイル表の比較分析
  compareAirlines(destination: string, travelClass: string = 'economy') {
    const anaCharts = this.charts.filter(c => c.airline === 'ANA' && c.class === travelClass);
    const jalCharts = this.charts.filter(c => c.airline === 'JAL' && c.class === travelClass);

    const comparison = {
      destination,
      travelClass,
      ana: this.findRouteInCharts(anaCharts, destination),
      jal: this.findRouteInCharts(jalCharts, destination),
      recommendation: '',
      savings: 0
    };

    if (comparison.ana && comparison.jal) {
      const anaMin = Math.min(...Object.values(comparison.ana.seasons).filter(v => v > 0));
      const jalMin = Math.min(...Object.values(comparison.jal.seasons).filter(v => v > 0));
      
      if (anaMin < jalMin) {
        comparison.recommendation = 'ANA';
        comparison.savings = jalMin - anaMin;
      } else if (jalMin < anaMin) {
        comparison.recommendation = 'JAL';
        comparison.savings = anaMin - jalMin;
      } else {
        comparison.recommendation = '同じ';
        comparison.savings = 0;
      }
    }

    return comparison;
  }

  private findRouteInCharts(charts: MileChart[], destination: string) {
    for (const chart of charts) {
      for (const route of chart.routes) {
        if (route.destinations.some(dest => 
          dest.toLowerCase().includes(destination.toLowerCase()) ||
          destination.toLowerCase().includes(dest.toLowerCase())
        )) {
          return route;
        }
      }
    }
    return null;
  }

  // 新しいマイル表を追加（管理者用）
  addMileChart(chart: MileChart) {
    this.charts.push(chart);
    this.charts.sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime());
  }

  // 更新情報を追加
  addUpdateEvent(event: MileUpdateEvent) {
    this.updateHistory.push(event);
  }
}

export const mileChartManager = new MileChartManager();
