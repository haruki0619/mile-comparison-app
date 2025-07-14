/**
 * マイル価値分析ユーティリティ
 * 実際の現金価格とマイル数から価値を計算し、最適な選択肢を提案
 */

export interface MileValueAnalysis {
  airline: string;
  cashPrice: number;
  milesRequired: number;
  mileValue: number; // 1マイルあたりの価値（円）
  recommendation: 'cash' | 'miles' | 'neutral';
  savingsAmount: number; // 節約額
  efficiency: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface PriceComparisonResult {
  route: string;
  date: string;
  analysis: MileValueAnalysis[];
  bestCashOption: MileValueAnalysis;
  bestMileOption: MileValueAnalysis;
  overallRecommendation: string;
}

/**
 * マイル価値を計算（1マイルあたりの価値）
 */
export function calculateMileValue(cashPrice: number, milesRequired: number): number {
  if (milesRequired === 0) return 0;
  return Math.round((cashPrice / milesRequired) * 100) / 100;
}

/**
 * マイル効率を評価
 */
export function evaluateMileEfficiency(mileValue: number): 'excellent' | 'good' | 'fair' | 'poor' {
  if (mileValue >= 2.0) return 'excellent';
  if (mileValue >= 1.5) return 'good';
  if (mileValue >= 1.0) return 'fair';
  return 'poor';
}

/**
 * 支払い方法の推奨を決定
 */
export function getPaymentRecommendation(mileValue: number): 'cash' | 'miles' | 'neutral' {
  if (mileValue >= 1.5) return 'miles'; // マイル価値が高い
  if (mileValue < 1.0) return 'cash';   // マイル価値が低い
  return 'neutral'; // どちらでも良い
}

/**
 * 節約額を計算
 */
export function calculateSavings(
  cashPrice: number, 
  milesRequired: number, 
  mileValue: number,
  recommendation: 'cash' | 'miles' | 'neutral'
): number {
  if (recommendation === 'miles') {
    // マイル使用時の価値 - 実際のマイル価値（1.5円/マイルと仮定）
    const standardMileValue = 1.5;
    return Math.round((mileValue - standardMileValue) * milesRequired);
  }
  if (recommendation === 'cash') {
    // 現金の方が得な場合、マイルを使わずに済む価値
    return Math.round(milesRequired * 1.5 - cashPrice);
  }
  return 0;
}

/**
 * 包括的なマイル価値分析を実行
 */
export function analyzeMileValue(
  route: string,
  date: string,
  airlines: Array<{
    airline: string;
    cashPrice: number;
    miles: {
      regular: number;
      peak: number;
      off: number;
    };
  }>
): PriceComparisonResult {
  const analysis: MileValueAnalysis[] = airlines.map(airline => {
    // 現在のシーズンに応じたマイル数を使用（今回はレギュラーを使用）
    const milesRequired = airline.miles.regular;
    const mileValue = calculateMileValue(airline.cashPrice, milesRequired);
    const recommendation = getPaymentRecommendation(mileValue);
    const efficiency = evaluateMileEfficiency(mileValue);
    const savingsAmount = calculateSavings(
      airline.cashPrice, 
      milesRequired, 
      mileValue, 
      recommendation
    );

    return {
      airline: airline.airline,
      cashPrice: airline.cashPrice,
      milesRequired,
      mileValue,
      recommendation,
      savingsAmount,
      efficiency
    };
  });

  // 最適オプションを決定
  const cashOptions = analysis.filter(a => a.recommendation === 'cash');
  const mileOptions = analysis.filter(a => a.recommendation === 'miles');
  
  const bestCashOption = cashOptions.length > 0 
    ? cashOptions.reduce((best, current) => 
        current.cashPrice < best.cashPrice ? current : best
      )
    : analysis.reduce((best, current) => 
        current.cashPrice < best.cashPrice ? current : best
      );

  const bestMileOption = mileOptions.length > 0
    ? mileOptions.reduce((best, current) => 
        current.mileValue > best.mileValue ? current : best
      )
    : analysis.reduce((best, current) => 
        current.mileValue > best.mileValue ? current : best
      );

  // 総合推奨
  let overallRecommendation: string;
  if (bestMileOption.mileValue >= 1.8) {
    overallRecommendation = `${bestMileOption.airline}のマイル特典航空券がお得です（1マイル=${bestMileOption.mileValue}円相当）`;
  } else if (bestCashOption.cashPrice <= 25000) {
    overallRecommendation = `${bestCashOption.airline}の現金購入がお得です（¥${bestCashOption.cashPrice.toLocaleString()}）`;
  } else {
    overallRecommendation = '現金とマイルどちらでも大きな差はありません';
  }

  return {
    route,
    date,
    analysis,
    bestCashOption,
    bestMileOption,
    overallRecommendation
  };
}

/**
 * 実際のテスト結果を使用したマイル価値検証
 */
export function validateMileData(
  testResults: Array<{
    route: string;
    actualPrices: Array<{ airline: string; price: number }>;
    calculatedMiles: Array<{ airline: string; miles: number }>;
  }>
): Array<{
  route: string;
  discrepancies: Array<{
    airline: string;
    expectedMileValue: number;
    actualMileValue: number;
    difference: number;
    severity: 'low' | 'medium' | 'high';
  }>;
}> {
  return testResults.map(test => {
    const discrepancies = test.actualPrices.map(price => {
      const mileData = test.calculatedMiles.find(m => m.airline === price.airline);
      if (!mileData) return null;

      const actualMileValue = calculateMileValue(price.price, mileData.miles);
      const expectedMileValue = 1.5; // 標準的なマイル価値
      const difference = Math.abs(actualMileValue - expectedMileValue);
      
      let severity: 'low' | 'medium' | 'high';
      if (difference > 1.0) severity = 'high';
      else if (difference > 0.5) severity = 'medium';
      else severity = 'low';

      return {
        airline: price.airline,
        expectedMileValue,
        actualMileValue,
        difference,
        severity
      };
    }).filter(Boolean) as any[];

    return {
      route: test.route,
      discrepancies
    };
  });
}
