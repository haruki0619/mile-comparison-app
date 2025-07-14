/**
 * マイルデータ分析実行スクリプト
 * テスト結果に基づいてマイルチャートの問題を特定し、修正提案を生成
 */

const { runMileDataAnalysis } = require('../src/utils/mileDataCorrector');

console.log('🔍 マイルデータ分析実行中...\n');

try {
  const analysis = runMileDataAnalysis();
  
  console.log('\n' + '='.repeat(60));
  console.log('📋 分析結果に基づく推奨アクション');
  console.log('='.repeat(60));
  
  if (analysis.issues.length > 0) {
    console.log('\n🎯 優先修正項目:');
    
    // 高優先度の問題
    const highPriorityIssues = analysis.issues.filter(issue => issue.severity === 'high');
    if (highPriorityIssues.length > 0) {
      console.log('\n🔴 HIGH PRIORITY:');
      highPriorityIssues.forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue.route} - ${issue.airline}`);
        console.log(`     問題: ${issue.issue}`);
        console.log(`     対応: ${issue.suggestion}`);
      });
    }
    
    // 中優先度の問題
    const mediumPriorityIssues = analysis.issues.filter(issue => issue.severity === 'medium');
    if (mediumPriorityIssues.length > 0) {
      console.log('\n🟡 MEDIUM PRIORITY:');
      mediumPriorityIssues.forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue.route} - ${issue.airline}`);
        console.log(`     問題: ${issue.issue}`);
        console.log(`     対応: ${issue.suggestion}`);
      });
    }
  }
  
  console.log('\n🚀 次のステップ:');
  console.log('1. src/data/index.ts のマイルチャートを修正');
  console.log('2. マイル価値計算ロジックの改善');
  console.log('3. 実際の価格データとの継続的同期');
  console.log('4. シーズン別価格変動の精密化');
  
} catch (error) {
  console.error('❌ 分析実行エラー:', error);
}
