/**
 * 実際のテスト結果に基づくマイルデータ修正提案
 */

import { analyzeMileValue, validateMileData } from './mileValueAnalyzer';

// テスト結果から抽出された実際の価格データ
export const actualPriceData = {
  'HND-ITM': {
    route: '東京-大阪',
    airlines: [
      { airline: 'ANA', price: 20690, source: 'amadeus' },
      { airline: 'ソラシドエア', price: 22770, source: 'rakuten' },
      { airline: 'スカイマーク', price: 24750, source: 'rakuten' },
      { airline: 'ジェットスター・ジャパン', price: 26730, source: 'rakuten' }
    ]
  },
  'HND-OKA': {
    route: '東京-沖縄',
    airlines: [
      { airline: 'ANA', price: 34190, source: 'amadeus' },
      { airline: 'ソラシドエア', price: 31050, source: 'rakuten' },
      { airline: 'スカイマーク', price: 33750, source: 'rakuten' },
      { airline: 'ジェットスター・ジャパン', price: 36450, source: 'rakuten' }
    ]
  },
  'ITM-CTS': {
    route: '大阪-札幌',
    airlines: [
      { airline: 'ANA', price: 34610, source: 'amadeus' },
      { airline: 'JAL', price: 43114, source: 'amadeus' },
      { airline: 'ソラシドエア', price: 45540, source: 'rakuten' },
      { airline: 'スカイマーク', price: 49500, source: 'rakuten' },
      { airline: 'ジェットスター・ジャパン', price: 53460, source: 'rakuten' }
    ]
  },
  'HND-FUK': {
    route: '東京-福岡',
    airlines: [
      { airline: 'ANA', price: 31060, source: 'amadeus' }
    ]
  }
};

// 現在のマイルチャートデータ
export const currentMileCharts = {
  'ANA': {
    '0-300': { regular: 5000, peak: 6000, off: 5000 },
    '301-600': { regular: 10000, peak: 12000, off: 9000 },
    '601-800': { regular: 15000, peak: 18000, off: 12000 },
    '801-1000': { regular: 17000, peak: 20000, off: 15000 },
    '1001-2000': { regular: 20000, peak: 23000, off: 17000 }
  },
  'JAL': {
    '0-300': { regular: 6000, peak: 7500, off: 6000 },
    '301-600': { regular: 12000, peak: 15000, off: 10000 },
    '601-800': { regular: 15000, peak: 20000, off: 12000 },
    '801-1000': { regular: 17000, peak: 22000, off: 15000 },
    '1001-2000': { regular: 20000, peak: 25000, off: 17000 }
  },
  'ソラシドエア': {
    '0-300': { regular: 5000, peak: 6000, off: 5000 },
    '301-600': { regular: 10000, peak: 12000, off: 8000 },
    '601-800': { regular: 14000, peak: 17000, off: 11000 },
    '801-1000': { regular: 16000, peak: 19000, off: 13000 },
    '1001+': { regular: 18000, peak: 21000, off: 15000 }
  }
};

// 距離カテゴリの取得
function getDistanceCategory(distance: number): string {
  if (distance <= 300) return '0-300';
  if (distance <= 600) return '301-600';
  if (distance <= 800) return '601-800';
  if (distance <= 1000) return '801-1000';
  if (distance <= 2000) return '1001-2000';
  return '2001+';
}

// 路線距離データ
const routeDistances: { [key: string]: number } = {
  'HND-ITM': 280,  // 東京-大阪
  'HND-OKA': 1550, // 東京-沖縄  
  'ITM-CTS': 830,  // 大阪-札幌
  'HND-FUK': 880   // 東京-福岡
};

/**
 * マイル価値分析レポートを生成
 */
export function generateMileValueReport() {
  const reports: any[] = [];
  
  Object.entries(actualPriceData).forEach(([routeCode, routeData]) => {
    const distance = routeDistances[routeCode] || 500;
    const distanceCategory = getDistanceCategory(distance);
    
    console.log(`\n📊 ${routeData.route} (${routeCode}) - 距離: ${distance}km`);
    console.log('=' .repeat(50));
    
    routeData.airlines.forEach(airline => {
      const mileChart = currentMileCharts[airline.airline as keyof typeof currentMileCharts];
      if (!mileChart) {
        console.log(`⚠️  ${airline.airline}: マイルチャートが見つかりません`);
        return;
      }
      
      const mileRequirement = mileChart[distanceCategory as keyof typeof mileChart] || 
                             mileChart['301-600']; // フォールバック
      
      if (!mileRequirement) {
        console.log(`⚠️  ${airline.airline}: 距離カテゴリ "${distanceCategory}" が見つかりません`);
        return;
      }
      
      const regularMiles = mileRequirement.regular;
      const mileValue = (airline.price / regularMiles).toFixed(2);
      
      let recommendation = '';
      let status = '';
      
      if (parseFloat(mileValue) >= 2.0) {
        recommendation = 'マイル特典がお得';
        status = '🟢 優秀';
      } else if (parseFloat(mileValue) >= 1.5) {
        recommendation = 'マイル特典が良い';
        status = '🟡 良好';
      } else if (parseFloat(mileValue) >= 1.0) {
        recommendation = 'どちらでも可';
        status = '🟠 普通';
      } else {
        recommendation = '現金購入がお得';
        status = '🔴 マイル効率悪';
      }
      
      console.log(`${airline.airline}:`);
      console.log(`  現金価格: ¥${airline.price.toLocaleString()}`);
      console.log(`  必要マイル: ${regularMiles.toLocaleString()}マイル`);
      console.log(`  マイル価値: ${mileValue}円/マイル ${status}`);
      console.log(`  推奨: ${recommendation}`);
      console.log(`  データ元: ${airline.source}`);
      console.log('');
      
      reports.push({
        route: routeData.route,
        routeCode,
        airline: airline.airline,
        cashPrice: airline.price,
        requiredMiles: regularMiles,
        mileValue: parseFloat(mileValue),
        recommendation,
        status,
        distance,
        distanceCategory,
        source: airline.source
      });
    });
  });
  
  return reports;
}

/**
 * 修正が必要なマイルデータを特定
 */
export function identifyMileDataIssues() {
  const issues: any[] = [];
  const reports = generateMileValueReport();
  
  console.log('\n🔍 マイルデータの問題分析');
  console.log('=' .repeat(50));
  
  // 問題のあるマイル価値（1.0円/マイル未満または3.0円/マイル以上）を特定
  reports.forEach(report => {
    if (report.mileValue < 1.0) {
      issues.push({
        type: 'low_value',
        severity: 'high',
        route: report.route,
        airline: report.airline,
        issue: `マイル価値が低すぎます (${report.mileValue}円/マイル)`,
        suggestion: `必要マイル数を${Math.round(report.requiredMiles * 0.7)}マイルに減らすことを推奨`,
        currentMiles: report.requiredMiles,
        suggestedMiles: Math.round(report.requiredMiles * 0.7)
      });
    } else if (report.mileValue > 3.0) {
      issues.push({
        type: 'high_value',
        severity: 'medium',
        route: report.route,
        airline: report.airline,
        issue: `マイル価値が高すぎる可能性があります (${report.mileValue}円/マイル)`,
        suggestion: '実際の価格データを再確認してください',
        currentMiles: report.requiredMiles,
        suggestedMiles: report.requiredMiles
      });
    }
    
    // 同一路線での航空会社間の大きな差を特定
    const sameRouteReports = reports.filter(r => r.routeCode === report.routeCode);
    if (sameRouteReports.length > 1) {
      const mileValues = sameRouteReports.map(r => r.mileValue);
      const maxValue = Math.max(...mileValues);
      const minValue = Math.min(...mileValues);
      
      if (maxValue / minValue > 2.0) {
        issues.push({
          type: 'inconsistency',
          severity: 'medium',
          route: report.route,
          airline: 'all',
          issue: `同一路線で航空会社間のマイル価値の差が大きすぎます (${minValue.toFixed(2)} - ${maxValue.toFixed(2)}円/マイル)`,
          suggestion: 'マイルチャートまたは価格データの見直しが必要です'
        });
      }
    }
  });
  
  // 問題をコンソールに出力
  if (issues.length === 0) {
    console.log('✅ 深刻な問題は見つかりませんでした');
  } else {
    issues.forEach((issue, index) => {
      console.log(`\n${index + 1}. ${issue.severity.toUpperCase()}: ${issue.issue}`);
      console.log(`   路線: ${issue.route} (${issue.airline})`);
      console.log(`   提案: ${issue.suggestion}`);
      if (issue.currentMiles && issue.suggestedMiles) {
        console.log(`   現在: ${issue.currentMiles}マイル → 推奨: ${issue.suggestedMiles}マイル`);
      }
    });
  }
  
  return issues;
}

/**
 * 修正されたマイルチャートを生成
 */
export function generateCorrectedMileChart() {
  const issues = identifyMileDataIssues();
  const corrections: any[] = [];
  
  console.log('\n🔧 マイルチャート修正提案');
  console.log('=' .repeat(50));
  
  issues.filter(issue => issue.type === 'low_value').forEach(issue => {
    corrections.push({
      airline: issue.airline,
      route: issue.route,
      currentMiles: issue.currentMiles,
      suggestedMiles: issue.suggestedMiles,
      reason: 'マイル価値改善のため'
    });
  });
  
  if (corrections.length === 0) {
    console.log('✅ 現在のマイルチャートは適切です');
  } else {
    console.log('以下の修正を推奨します:');
    corrections.forEach((correction, index) => {
      console.log(`\n${index + 1}. ${correction.airline} - ${correction.route}`);
      console.log(`   ${correction.currentMiles}マイル → ${correction.suggestedMiles}マイル`);
      console.log(`   理由: ${correction.reason}`);
    });
  }
  
  return corrections;
}

// 分析を実行してレポートを出力
export function runMileDataAnalysis() {
  console.log('🚀 マイルデータ分析を開始します...\n');
  
  const reports = generateMileValueReport();
  const issues = identifyMileDataIssues();
  const corrections = generateCorrectedMileChart();
  
  console.log('\n📈 分析完了サマリー');
  console.log('=' .repeat(50));
  console.log(`✅ 分析対象: ${reports.length}件`);
  console.log(`⚠️  問題発見: ${issues.length}件`);
  console.log(`🔧 修正提案: ${corrections.length}件`);
  
  return {
    reports,
    issues,
    corrections
  };
}
