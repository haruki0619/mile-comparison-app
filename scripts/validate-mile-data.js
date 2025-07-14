// マイルデータ検証スクリプト
const fs = require('fs');
const path = require('path');

// テスト対象の路線とシーズンの組み合わせ
const testCases = [
  // 国内線
  { departure: 'HND', arrival: 'ITM', season: 'regular', description: '東京-大阪（レギュラー）' },
  { departure: 'HND', arrival: 'ITM', season: 'peak', description: '東京-大阪（ピーク）' },
  { departure: 'HND', arrival: 'ITM', season: 'off', description: '東京-大阪（オフ）' },
  
  { departure: 'HND', arrival: 'OKA', season: 'regular', description: '東京-沖縄（レギュラー）' },
  { departure: 'HND', arrival: 'OKA', season: 'peak', description: '東京-沖縄（ピーク）' },
  { departure: 'HND', arrival: 'OKA', season: 'off', description: '東京-沖縄（オフ）' },
  
  { departure: 'ITM', arrival: 'CTS', season: 'regular', description: '大阪-札幌（レギュラー）' },
  { departure: 'ITM', arrival: 'CTS', season: 'peak', description: '大阪-札幌（ピーク）' },
  { departure: 'ITM', arrival: 'CTS', season: 'off', description: '大阪-札幌（オフ）' },
  
  // 国際線
  { departure: 'NRT', arrival: 'LAX', season: 'regular', description: '成田-ロサンゼルス（レギュラー）' },
  { departure: 'NRT', arrival: 'LAX', season: 'peak', description: '成田-ロサンゼルス（ピーク）' },
  { departure: 'NRT', arrival: 'LAX', season: 'off', description: '成田-ロサンゼルス（オフ）' },
  
  { departure: 'NRT', arrival: 'ICN', season: 'regular', description: '成田-ソウル（レギュラー）' },
  { departure: 'NRT', arrival: 'ICN', season: 'peak', description: '成田-ソウル（ピーク）' },
  { departure: 'NRT', arrival: 'ICN', season: 'off', description: '成田-ソウル（オフ）' },
];

// マイル計算結果を検証する関数
async function validateMileCalculation(testCase) {
  const { departure, arrival, season, description } = testCase;
  
  try {
    // Node.js用のfetchポリフィル（Node.js 18+では不要だが、念のため確認）
    const fetchModule = globalThis.fetch || (await import('node-fetch')).default;
    
    // API呼び出し
    const response = await fetchModule('http://localhost:3000/api/flights/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        departure,
        arrival,
        date: '2025-09-15', // 固定日付でテスト
        passengers: 1
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${response.statusText}\nResponse: ${errorText}`);
    }
    
    const data = await response.json();
    
    // レスポンス構造をデバッグ出力
    console.log(`📊 完全なAPIレスポンス for ${description}:`);
    console.log(JSON.stringify(data, null, 2));
    
    // データ構造の確認
    if (!data) {
      throw new Error('APIレスポンスが空です');
    }
    
    // 新しいレスポンス構造に対応（data.data.airlines または data.airlines）
    let resultData = data;
    if (data.data) {
      resultData = data.data; // ネストされたデータ構造の場合
    }
    
    if (!resultData.airlines) {
      throw new Error(`airlines プロパティが見つかりません。レスポンス構造: ${JSON.stringify(Object.keys(data))}, データ部分: ${JSON.stringify(Object.keys(resultData))}`);
    }
    
    if (!Array.isArray(resultData.airlines)) {
      throw new Error(`airlines が配列ではありません。型: ${typeof resultData.airlines}, 値: ${resultData.airlines}`);
    }
    
    // 結果の検証
    const result = {
      testCase: description,
      route: `${departure} → ${arrival}`,
      season: resultData.season,
      expectedSeason: season,
      airlines: resultData.airlines.map(airline => ({
        name: airline.airline,
        miles: airline.miles,
        currentSeasonMiles: airline.miles ? airline.miles[resultData.season] : 'N/A',
        distance: resultData.route?.distance || 'N/A'
      })),
      distance: resultData.route?.distance,
      isValid: resultData.season === season,
      timestamp: new Date().toISOString(),
      rawResponse: data // デバッグ用に生のレスポンスも保存
    };
    
    return result;
  } catch (error) {
    console.error(`❌ Error details for ${description}:`, error);
    return {
      testCase: description,
      route: `${departure} → ${arrival}`,
      error: error.message,
      errorStack: error.stack,
      timestamp: new Date().toISOString()
    };
  }
}

// すべてのテストケースを実行
async function runAllTests() {
  console.log('🧪 マイルデータ検証テストを開始します...\n');
  
  const results = [];
  
  // デバッグ用に最初の1つだけテスト
  const firstTestCase = testCases[0];
  console.log(`📋 デバッグテスト: ${firstTestCase.description}`);
  const result = await validateMileCalculation(firstTestCase);
  results.push(result);
  
  // 結果の表示
  if (result.error) {
    console.log(`❌ エラー: ${result.error}`);
    if (result.errorStack) {
      console.log(`📋 スタックトレース:\n${result.errorStack}`);
    }
  } else {
    console.log(`✅ 成功: ${result.route} | シーズン: ${result.season}`);
    result.airlines.forEach(airline => {
      console.log(`   ${airline.name}: ${airline.currentSeasonMiles}マイル`);
    });
  }
  
  // 最初のテストが成功した場合のみ残りを実行
  if (!result.error) {
    console.log('\n🎯 最初のテストが成功しました。残りのテストを実行します...\n');
    
    for (let i = 1; i < testCases.length; i++) {
      const testCase = testCases[i];
      console.log(`📋 テスト中: ${testCase.description}`);
      const testResult = await validateMileCalculation(testCase);
      results.push(testResult);
      
      // 結果の表示
      if (testResult.error) {
        console.log(`❌ エラー: ${testResult.error}`);
      } else {
        console.log(`✅ 成功: ${testResult.route} | シーズン: ${testResult.season}`);
        testResult.airlines.forEach(airline => {
          console.log(`   ${airline.name}: ${airline.currentSeasonMiles}マイル`);
        });
      }
      console.log('');
      
      // API制限を考慮して少し待機
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } else {
    console.log('\n❌ 最初のテストが失敗したため、残りのテストをスキップします。');
  }
  
  // 結果をJSONファイルに保存
  const outputPath = path.join(__dirname, '..', 'test-results', `mile-validation-${Date.now()}.json`);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  
  console.log(`📊 テスト結果を保存しました: ${outputPath}`);
  
  // サマリーの表示
  const successCount = results.filter(r => !r.error).length;
  const errorCount = results.filter(r => r.error).length;
  
  console.log('\n📈 テスト結果サマリー:');
  console.log(`✅ 成功: ${successCount}件`);
  console.log(`❌ エラー: ${errorCount}件`);
  console.log(`📊 総テスト数: ${results.length}件`);
  
  return results;
}

// スクリプト実行
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests, validateMileCalculation };
