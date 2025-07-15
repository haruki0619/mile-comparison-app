import React, { useState, useRef } from 'react';
import { Card, Text, Button } from './ui';
import { Download, Play, RotateCcw, CheckCircle, XCircle } from 'lucide-react';

interface TestCase {
  id: string;
  departure: string;
  arrival: string;
  description: string;
  expectedMiles?: { [key: string]: number };
}

interface TestResult {
  testCase: TestCase;
  status: 'pending' | 'running' | 'success' | 'error';
  data?: any;
  error?: string;
  timestamp?: string;
}

const MileDataValidator = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);

  // テストケース定義
  const testCases: TestCase[] = [
    // 国内線
    { id: 'hnd-itm', departure: 'HND', arrival: 'ITM', description: '東京-大阪' },
    { id: 'hnd-oka', departure: 'HND', arrival: 'OKA', description: '東京-沖縄' },
    { id: 'itm-cts', departure: 'ITM', arrival: 'CTS', description: '大阪-札幌' },
    { id: 'hnd-fuk', departure: 'HND', arrival: 'FUK', description: '東京-福岡' },
    { id: 'ngo-oka', departure: 'NGO', arrival: 'OKA', description: '名古屋-沖縄' },
    
    // 国際線
    { id: 'nrt-lax', departure: 'NRT', arrival: 'LAX', description: '成田-ロサンゼルス' },
    { id: 'nrt-icn', departure: 'NRT', arrival: 'ICN', description: '成田-ソウル' },
    { id: 'kix-bkk', departure: 'KIX', arrival: 'BKK', description: '関西-バンコク' },
    { id: 'nrt-lhr', departure: 'NRT', arrival: 'LHR', description: '成田-ロンドン' },
    { id: 'hnd-pvg', departure: 'HND', arrival: 'PVG', description: '羽田-上海' },
  ];

  // 単一テストケースの実行
  const runSingleTest = async (testCase: TestCase): Promise<TestResult> => {
    try {
      setTestResults(prev => prev.map(r => 
        r.testCase.id === testCase.id 
          ? { ...r, status: 'running' as const }
          : r
      ));

      const response = await fetch('/api/flights/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          departure: testCase.departure,
          arrival: testCase.arrival,
          date: '2025-09-15',
          passengers: 1
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('🔍 API Response:', responseData);

      // レスポンス形式をチェックして適切にデータを取得
      let data;
      if (responseData.success && responseData.data) {
        data = responseData.data;
      } else {
        data = responseData;
      }

      // データ形式のバリデーション
      if (!data) {
        throw new Error('No data received from API');
      }

      return {
        testCase,
        status: 'success',
        data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('🚨 Test error:', error);
      return {
        testCase,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  };

  // 全テストの実行
  const runAllTests = async () => {
    setIsRunning(true);
    
    // 初期化
    const initialResults = testCases.map(testCase => ({
      testCase,
      status: 'pending' as const
    }));
    setTestResults(initialResults);

    // 順次実行
    for (const testCase of testCases) {
      const result = await runSingleTest(testCase);
      setTestResults(prev => prev.map(r => 
        r.testCase.id === testCase.id ? result : r
      ));
      
      // API制限を考慮して待機
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    setIsRunning(false);
  };

  // 選択したテストのみ実行
  const runSelectedTests = async () => {
    if (selectedTests.length === 0) return;
    
    setIsRunning(true);
    const selectedTestCases = testCases.filter(tc => selectedTests.includes(tc.id));
    
    for (const testCase of selectedTestCases) {
      const result = await runSingleTest(testCase);
      setTestResults(prev => {
        const existing = prev.find(r => r.testCase.id === testCase.id);
        if (existing) {
          return prev.map(r => r.testCase.id === testCase.id ? result : r);
        } else {
          return [...prev, result];
        }
      });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    setIsRunning(false);
  };

  // 結果のダウンロード
  const downloadResults = () => {
    const dataStr = JSON.stringify(testResults, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mile-validation-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // リセット
  const resetResults = () => {
    setTestResults([]);
    setSelectedTests([]);
  };

  const toggleTestSelection = (testId: string) => {
    setSelectedTests(prev => 
      prev.includes(testId) 
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running': return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default: return <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />;
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">マイルデータ検証ツール</h2>
          <Text variant="muted">すべての路線とマイル計算の正確性をテストします</Text>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={runAllTests} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            全テスト実行
          </Button>
          
          <Button 
            onClick={runSelectedTests}
            disabled={isRunning || selectedTests.length === 0}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            選択実行 ({selectedTests.length})
          </Button>
          
          <Button 
            onClick={downloadResults}
            disabled={testResults.length === 0}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            結果DL
          </Button>
          
          <Button 
            onClick={resetResults}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            リセット
          </Button>
        </div>
      </div>

      {/* テストケース選択 */}
      <div className="space-y-3">
        <h3 className="font-semibold">テストケース選択</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {testCases.map(testCase => (
            <label 
              key={testCase.id}
              className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-50"
            >
              <input 
                type="checkbox"
                checked={selectedTests.includes(testCase.id)}
                onChange={() => toggleTestSelection(testCase.id)}
                className="rounded"
              />
              <span className="text-sm">{testCase.description}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 結果表示 */}
      {testResults.length > 0 && (
        <div className="space-y-3" ref={resultsRef}>
          <h3 className="font-semibold">テスト結果</h3>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {testResults.map((result, index) => (
              <div 
                key={result.testCase.id}
                className="p-3 border rounded-lg space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.status)}
                    <span className="font-medium">{result.testCase.description}</span>
                    <span className="text-sm text-gray-500">
                      {result.testCase.departure} → {result.testCase.arrival}
                    </span>
                  </div>
                  {result.timestamp && (
                    <span className="text-xs text-gray-500">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  )}
                </div>

                {result.status === 'success' && result.data && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <strong>シーズン:</strong> {result.data.season || 'レギュラー'}
                    </div>
                    <div>
                      <strong>距離:</strong> {result.data.route?.distance || 'N/A'}km
                    </div>
                    <div>
                      <strong>航空会社数:</strong> {result.data.airlines?.length || 0}社
                    </div>
                    
                    {result.data.airlines && result.data.airlines.length > 0 && (
                      <div className="md:col-span-3">
                        <strong>マイル数:</strong>
                        <div className="mt-1 space-y-1">
                          {result.data.airlines.map((airline: any, idx: number) => (
                            <div key={idx} className="flex justify-between text-xs bg-gray-50 p-2 rounded">
                              <span>{airline.airline || airline.name}</span>
                              <span>
                                オフ: {airline.miles?.off?.toLocaleString() || 'N/A'} | 
                                通常: {airline.miles?.regular?.toLocaleString() || 'N/A'} | 
                                ピーク: {airline.miles?.peak?.toLocaleString() || 'N/A'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* デバッグ用データ表示 */}
                    <div className="md:col-span-3 mt-2 p-2 bg-gray-100 rounded text-xs">
                      <strong>Raw Data:</strong>
                      <pre className="mt-1 overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {result.status === 'error' && (
                  <div className="text-red-600 text-sm">
                    <strong>エラー:</strong> {result.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 進行状況 */}
      {isRunning && (
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-blue-600 font-medium">テスト実行中...</div>
          <div className="text-sm text-blue-500 mt-1">
            API制限を考慮して順次実行しています
          </div>
        </div>
      )}
    </Card>
  );
};

export default MileDataValidator;
