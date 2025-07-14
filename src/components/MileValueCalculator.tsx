import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';

// マイル価値計算コンポーネント（2025年版ガイドライン準拠）
interface MileValueCalculatorProps {
  route?: string;
  className?: string;
}

interface MileValueResult {
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

export const MileValueCalculator: React.FC<MileValueCalculatorProps> = ({
  route = 'NRT-LAX',
  className = ''
}) => {
  const [cashPrice, setCashPrice] = useState<number>(20690); // HND-ITM 実測値に変更
  const [selectedClass, setSelectedClass] = useState<'economy' | 'business' | 'first'>('economy');
  const [selectedRoute, setSelectedRoute] = useState<string>('HND-ITM');
  const [results, setResults] = useState<MileValueResult[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [priceSource, setPriceSource] = useState<'api' | 'fallback' | 'manual'>('manual'); // 価格データのソース
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null); // デバッグ情報追加

  // 路線別のフォールバック価格（API失敗時のみ使用）
  const fallbackPrices = {
    'NRT-LAX': 270000, // 年末ピーク
    'NRT-LHR': 240000, // お盆ピーク
    'NRT-ICN': 25000,  // GWピーク
    'NRT-SIN': 62000,  // レギュラーシーズン
    'HND-ITM': 20690,  // 東京-大阪（実測平均）
    'HND-OKA': 32000   // 東京-沖縄（実測平均）
  };

  // API価格取得関数（実装例）
  const fetchPriceFromAPI = async (route: string): Promise<{ price: number; source: 'api' } | null> => {
    setIsLoadingPrice(true);
    try {
      // TODO: 実際のAPI呼び出し
      // const response = await fetch(`/api/flights/search?route=${route}`);
      // const data = await response.json();
      // return { price: data.averagePrice, source: 'api' };
      
      // 現在はAPIが未実装のため、意図的にnullを返す
      await new Promise(resolve => setTimeout(resolve, 1000)); // API呼び出しをシミュレート
      return null;
    } catch (error) {
      console.warn('Price API failed:', error);
      return null;
    } finally {
      setIsLoadingPrice(false);
    }
  };

  // 価格データ取得（API優先、フォールバック使用）
  const loadPriceData = async (route: string) => {
    // 1. まずAPIから取得を試行
    const apiResult = await fetchPriceFromAPI(route);
    
    if (apiResult) {
      setCashPrice(apiResult.price);
      setPriceSource('api');
    } else {
      // 2. API失敗時はフォールバックデータを使用
      const fallbackPrice = fallbackPrices[route as keyof typeof fallbackPrices];
      if (fallbackPrice) {
        setCashPrice(fallbackPrice);
        setPriceSource('fallback');
      }
    }
  };

  // マイルプログラムデータ（2025年7月14日実測データ）
  const milePrograms = {
    'ana': {
      name: 'ANA マイレージクラブ',
      routes: {
        'NRT-LAX': { 
          economy: { miles: 72000, fuelSurcharge: 46200, taxes: 12800 }, // Hシーズン
          business: { miles: 135000, fuelSurcharge: 46200, taxes: 12800 }
        },
        'NRT-LHR': {
          economy: { miles: 78000, fuelSurcharge: 46200, taxes: 15000 }, // Hシーズン
          business: { miles: 150000, fuelSurcharge: 46200, taxes: 15000 }
        },
        'NRT-ICN': {
          economy: { miles: 24000, fuelSurcharge: 7400, taxes: 3000 }, // Hシーズン・GW
          business: { miles: 48000, fuelSurcharge: 7400, taxes: 3000 }
        },
        'NRT-SIN': {
          economy: { miles: 35000, fuelSurcharge: 31000, taxes: 8000 }, // Rシーズン
          business: { miles: 70000, fuelSurcharge: 31000, taxes: 8000 }
        },
        'HND-ITM': {
          economy: { miles: 9500, fuelSurcharge: 0, taxes: 2000 }, // 国内線・YQ無し（実測値に修正）
        },
        'HND-OKA': {
          economy: { miles: 18000, fuelSurcharge: 0, taxes: 2000 }, // 国内線・YQ無し
        }
      },
      features: { stopover: '不可', openJaw: true, changesFee: 3300 }
    },
    'jal': {
      name: 'JAL マイレージバンク',
      routes: {
        'NRT-LAX': {
          economy: { miles: 54000, fuelSurcharge: 66000, taxes: 12800 }, // PLUS変動制最安
          business: { miles: 108000, fuelSurcharge: 66000, taxes: 12800 }
        },
        'NRT-LHR': {
          economy: { miles: 54000, fuelSurcharge: 66000, taxes: 15000 }, // PLUS変動制
          business: { miles: 108000, fuelSurcharge: 66000, taxes: 15000 }
        },
        'NRT-ICN': {
          economy: { miles: 15000, fuelSurcharge: 10000, taxes: 3000 },
          business: { miles: 30000, fuelSurcharge: 10000, taxes: 3000 }
        },
        'NRT-SIN': {
          economy: { miles: 26000, fuelSurcharge: 45000, taxes: 8000 },
          business: { miles: 52000, fuelSurcharge: 45000, taxes: 8000 }
        },
        'HND-ITM': {
          economy: { miles: 12000, fuelSurcharge: 0, taxes: 2000 }, // 国内線・YQ無し
        },
        'HND-OKA': {
          economy: { miles: 15000, fuelSurcharge: 0, taxes: 2000 }, // 国内線・YQ無し
        }
      },
      features: { stopover: '不可', openJaw: true, changesFee: 3300 }
    },
    'united': {
      name: 'United MileagePlus',
      routes: {
        'NRT-LAX': {
          economy: { miles: 80000, fuelSurcharge: 0, taxes: 12800 }, // YQ無料
          business: { miles: 180000, fuelSurcharge: 0, taxes: 12800 }
        },
        'NRT-LHR': {
          economy: { miles: 80000, fuelSurcharge: 0, taxes: 15000 }, // YQ無料
          business: { miles: 180000, fuelSurcharge: 0, taxes: 15000 }
        },
        'NRT-ICN': {
          economy: { miles: 22000, fuelSurcharge: 0, taxes: 3000 },
          business: { miles: 44000, fuelSurcharge: 0, taxes: 3000 }
        },
        'NRT-SIN': {
          economy: { miles: 40000, fuelSurcharge: 0, taxes: 8000 },
          business: { miles: 80000, fuelSurcharge: 0, taxes: 8000 }
        },
        'HND-ITM': {
          economy: { miles: 10000, fuelSurcharge: 0, taxes: 2000 }, // 国内線パートナー・短距離特化
        },
        'HND-OKA': {
          economy: { miles: 14000, fuelSurcharge: 0, taxes: 2000 }, // 国内線パートナー
        }
      },
      features: { stopover: 'Excursionist Perk', openJaw: true, changesFee: 0 }
    },
    'ba': {
      name: 'British Airways Avios',
      routes: {
        'NRT-LAX': {
          economy: { miles: 80000, fuelSurcharge: 66000, taxes: 12800 }, // Peak
          business: { miles: 160000, fuelSurcharge: 66000, taxes: 12800 }
        },
        'NRT-LHR': {
          economy: { miles: 80000, fuelSurcharge: 66000, taxes: 15000 }, // Peak
          business: { miles: 160000, fuelSurcharge: 66000, taxes: 15000 }
        },
        'NRT-ICN': {
          economy: { miles: 15000, fuelSurcharge: 7400, taxes: 3000 },
          business: { miles: 30000, fuelSurcharge: 7400, taxes: 3000 }
        },
        'NRT-SIN': {
          economy: { miles: 30000, fuelSurcharge: 46200, taxes: 8000 },
          business: { miles: 60000, fuelSurcharge: 46200, taxes: 8000 }
        },
        'HND-ITM': {
          economy: { miles: 6000, fuelSurcharge: 0, taxes: 2000 }, // 短距離特化の威力
        },
        'HND-OKA': {
          economy: { miles: 10000, fuelSurcharge: 0, taxes: 2000 }, // Avios短距離メリット
        }
      },
      features: { stopover: '1回/複数都市可', openJaw: true, changesFee: 5500 }
    },
    'singapore': {
      name: 'Singapore KrisFlyer',
      routes: {
        'NRT-LAX': {
          economy: { miles: 80000, fuelSurcharge: 46200, taxes: 12800 },
          business: { miles: 160000, fuelSurcharge: 46200, taxes: 12800 }
        },
        'NRT-LHR': {
          economy: { miles: 80000, fuelSurcharge: 46200, taxes: 15000 },
          business: { miles: 160000, fuelSurcharge: 46200, taxes: 15000 }
        },
        'NRT-SIN': {
          economy: { miles: 30000, fuelSurcharge: 31000, taxes: 8000 },
          business: { miles: 60000, fuelSurcharge: 31000, taxes: 8000 }
        },
        'NRT-ICN': {
          economy: { miles: 20000, fuelSurcharge: 7400, taxes: 3000 },
          business: { miles: 40000, fuelSurcharge: 7400, taxes: 3000 }
        },
        'HND-ITM': {
          economy: { miles: 12000, fuelSurcharge: 0, taxes: 2000 },
        },
        'HND-OKA': {
          economy: { miles: 18000, fuelSurcharge: 0, taxes: 2000 },
        }
      },
      features: { stopover: 'Saver 1回/Standard 2回', openJaw: true, changesFee: 3750 }
    },
    'virgin': {
      name: 'Virgin Atlantic → ANA',
      routes: {
        'NRT-LAX': {
          economy: { miles: 60000, fuelSurcharge: 46200, taxes: 12800 }, // 往復
          business: { miles: 90000, fuelSurcharge: 46200, taxes: 12800 } // 往復45k×2
        },
        'NRT-LHR': {
          economy: { miles: 60000, fuelSurcharge: 46200, taxes: 15000 },
          business: { miles: 90000, fuelSurcharge: 46200, taxes: 15000 } // 破格レート
        },
        'NRT-ICN': {
          economy: { miles: 30000, fuelSurcharge: 7400, taxes: 3000 },
          business: { miles: 45000, fuelSurcharge: 7400, taxes: 3000 }
        },
        'NRT-SIN': {
          economy: { miles: 45000, fuelSurcharge: 31000, taxes: 8000 },
          business: { miles: 67500, fuelSurcharge: 31000, taxes: 8000 }
        },
        'HND-ITM': {
          economy: { miles: 12000, fuelSurcharge: 0, taxes: 2000 },
        },
        'HND-OKA': {
          economy: { miles: 18000, fuelSurcharge: 0, taxes: 2000 },
        }
      },
      features: { stopover: 'ANA規定準拠', openJaw: true, changesFee: 7500 }
    },
    'alaska': {
      name: 'Alaska → JAL',
      routes: {
        'NRT-LAX': {
          economy: { miles: 100000, fuelSurcharge: 0, taxes: 12800 }, // YQ無料
          business: { miles: 120000, fuelSurcharge: 0, taxes: 12800 } // 60k×2
        },
        'NRT-LHR': {
          economy: { miles: 90000, fuelSurcharge: 0, taxes: 15000 },
          business: { miles: 110000, fuelSurcharge: 0, taxes: 15000 } // 55k×2
        },
        'NRT-ICN': {
          economy: { miles: 50000, fuelSurcharge: 0, taxes: 3000 },
          business: { miles: 100000, fuelSurcharge: 0, taxes: 3000 }
        },
        'NRT-SIN': {
          economy: { miles: 80000, fuelSurcharge: 0, taxes: 8000 },
          business: { miles: 120000, fuelSurcharge: 0, taxes: 8000 }
        },
        'HND-ITM': {
          economy: { miles: 12000, fuelSurcharge: 0, taxes: 2000 },
        },
        'HND-OKA': {
          economy: { miles: 15000, fuelSurcharge: 0, taxes: 2000 },
        }
      },
      features: { stopover: 'JAL規定準拠', openJaw: true, changesFee: 6250 }
    },
    'aeroplan': {
      name: 'Air Canada Aeroplan',
      routes: {
        'NRT-LAX': {
          economy: { miles: 75000, fuelSurcharge: 0, taxes: 12800 }, // YQ無料
          business: { miles: 140000, fuelSurcharge: 0, taxes: 12800 }
        },
        'NRT-LHR': {
          economy: { miles: 75000, fuelSurcharge: 0, taxes: 15000 },
          business: { miles: 140000, fuelSurcharge: 0, taxes: 15000 }
        },
        'NRT-ICN': {
          economy: { miles: 35000, fuelSurcharge: 0, taxes: 3000 },
          business: { miles: 70000, fuelSurcharge: 0, taxes: 3000 }
        },
        'NRT-SIN': {
          economy: { miles: 75000, fuelSurcharge: 0, taxes: 8000 },
          business: { miles: 140000, fuelSurcharge: 0, taxes: 8000 }
        },
        'HND-ITM': {
          economy: { miles: 25000, fuelSurcharge: 0, taxes: 2000 },
        },
        'HND-OKA': {
          economy: { miles: 35000, fuelSurcharge: 0, taxes: 2000 },
        }
      },
      features: { stopover: '1回+5000マイル', openJaw: true, changesFee: 0 }
    }
  };

  // 価値判定関数
  const getRating = (valuePerMile: number): 'excellent' | 'good' | 'fair' | 'poor' | 'bad' => {
    if (valuePerMile >= 3.0) return 'excellent';
    if (valuePerMile >= 2.0) return 'good';
    if (valuePerMile >= 1.5) return 'fair';
    if (valuePerMile >= 1.0) return 'poor';
    return 'bad';
  };

  // 推奨アクション
  const getRecommendation = (rating: string): string => {
    switch (rating) {
      case 'excellent': return '🌟 即座にマイル利用推奨';
      case 'good': return '✅ マイル利用推奨';
      case 'fair': return '⚠️ 条件次第で検討';
      case 'poor': return '🤔 現金購入検討';
      case 'bad': return '❌ 現金購入推奨';
      default: return '';
    }
  };

  // 評価色
  const getRatingColor = (rating: string): string => {
    switch (rating) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'fair': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-orange-600 bg-orange-50';
      case 'bad': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // 計算実行
  const calculateMileValue = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const calculatedResults: MileValueResult[] = [];
      
      console.log('🔍 === 計算開始 ===');
      console.log(`🔍 パラメータ: 路線=${selectedRoute}, クラス=${selectedClass}, 価格=${cashPrice}円`);
      console.log(`🔍 マイルプログラム総数: ${Object.keys(milePrograms).length}`);
      console.log(`🔍 プログラム一覧: ${Object.keys(milePrograms).join(', ')}`);
      
      Object.entries(milePrograms).forEach(([programId, program], programIndex) => {
        console.log(`\n🔍 [${programIndex + 1}/${Object.keys(milePrograms).length}] === ${programId} (${program.name}) ===`);
        
        // 路線データの確認
        const routeData = program.routes[selectedRoute as keyof typeof program.routes];
        if (!routeData) {
          console.log(`❌ [${programId}] 路線データなし: ${selectedRoute}`);
          console.log(`❌ [${programId}] 利用可能路線: ${Object.keys(program.routes).join(', ')}`);
          return;
        }
        
        console.log(`✅ [${programId}] 路線データ発見: ${JSON.stringify(routeData)}`);
        
        // クラスデータの確認
        const classData = routeData[selectedClass as keyof typeof routeData];
        if (!classData) {
          console.log(`❌ [${programId}] クラスデータなし: ${selectedClass}`);
          console.log(`❌ [${programId}] 利用可能クラス: ${Object.keys(routeData).join(', ')}`);
          return;
        }
        
        console.log(`✅ [${programId}] クラスデータ発見: ${JSON.stringify(classData)}`);
        
        // 計算処理
        const { miles, fuelSurcharge, taxes } = classData;
        const totalCost = fuelSurcharge + taxes;
        const valuePerMile = Math.max(0, (cashPrice - totalCost) / miles);
        const rating = getRating(valuePerMile);
        
        console.log(`📊 [${programId}] 計算詳細:`);
        console.log(`    必要マイル: ${miles.toLocaleString()}マイル`);
        console.log(`    燃油: ${fuelSurcharge.toLocaleString()}円`);
        console.log(`    税金: ${taxes.toLocaleString()}円`);
        console.log(`    自己負担: ${totalCost.toLocaleString()}円`);
        console.log(`    価値: ${valuePerMile.toFixed(3)}円/マイル`);
        console.log(`    評価: ${rating}`);
        
        // 結果作成
        const result = {
          program: program.name,
          requiredMiles: miles,
          cashPrice,
          fuelSurcharge,
          taxes,
          totalCost,
          valuePerMile,
          rating,
          recommendation: getRecommendation(rating),
          features: program.features,
          isPartnerBooking: program.name.includes('→'),
          specialNote: getSpecialNote(program.name)
        };
        
        // 重複チェック
        const existingIndex = calculatedResults.findIndex(r => r.program === result.program);
        if (existingIndex >= 0) {
          console.error(`🚨 [${programId}] 重複検出! 既存プログラム: ${result.program}`);
          console.error(`🚨 [${programId}] 既存データ: ${JSON.stringify(calculatedResults[existingIndex])}`);
          console.error(`🚨 [${programId}] 新データ: ${JSON.stringify(result)}`);
        } else {
          console.log(`➕ [${programId}] 結果配列に追加: ${result.program}`);
          calculatedResults.push(result);
        }
      });
      
      console.log('\n🔍 === 計算完了 ===');
      console.log(`📋 最終結果数: ${calculatedResults.length}`);
      console.log(`📋 プログラム一覧: ${calculatedResults.map(r => r.program).join(', ')}`);
      
      // 重複の最終確認
      const programNames = calculatedResults.map(r => r.program);
      const uniquePrograms = [...new Set(programNames)];
      
      if (programNames.length !== uniquePrograms.length) {
        console.error('🚨 === 重複エラー検出 ===');
        console.error(`🚨 総数: ${programNames.length}, ユニーク数: ${uniquePrograms.length}`);
        console.error(`🚨 重複プログラム: ${programNames.filter((name, index) => programNames.indexOf(name) !== index)}`);
        
        // 重複除去処理
        const deduplicatedResults: MileValueResult[] = [];
        calculatedResults.forEach(result => {
          const exists = deduplicatedResults.find(r => r.program === result.program);
          if (!exists) {
            deduplicatedResults.push(result);
          }
        });
        
        console.log(`🔧 重複除去後: ${deduplicatedResults.length}件`);
        console.log(`🔧 除去後一覧: ${deduplicatedResults.map(r => r.program).join(', ')}`);
        
        // 価値順でソート
        deduplicatedResults.sort((a, b) => b.valuePerMile - a.valuePerMile);
        setResults(deduplicatedResults);
      } else {
        // 正常な場合は価値順でソート
        calculatedResults.sort((a, b) => b.valuePerMile - a.valuePerMile);
        console.log(`� ソート後一覧: ${calculatedResults.map((r, i) => `${i+1}. ${r.program} (${r.valuePerMile.toFixed(2)}円/マイル)`).join(', ')}`);
        setResults(calculatedResults);
      }
      
      setIsCalculating(false);
      console.log('🔍 === 処理完了 ===\n');
    }, 1000);
  };

  // 特別注記の取得
  const getSpecialNote = (program: string): string => {
    if (program.includes('Virgin Atlantic')) {
      return '📞 電話発券必須・業界最安水準';
    }
    if (program.includes('Alaska')) {
      return '⚠️ 2024年収益制移行予定・YQ無料';
    }
    if (program.includes('Aeroplan')) {
      return '✈️ Stopover+5kマイル・YQ無料';
    }
    if (program.includes('British Airways') && (selectedRoute === 'HND-ITM' || selectedRoute === 'HND-OKA')) {
      return '🎯 短距離国内線で威力発揮';
    }
    return '';
  };

  useEffect(() => {
    calculateMileValue();
  }, [cashPrice, selectedClass, selectedRoute]);

  // 初回ロード時にデフォルト路線の価格を取得
  useEffect(() => {
    loadPriceData(selectedRoute);
  }, []); // 初回のみ実行

  // 路線変更時の価格自動更新
  useEffect(() => {
    loadPriceData(selectedRoute);
  }, [selectedRoute]);

  // 手動価格変更時のソース更新
  const handlePriceChange = (newPrice: number) => {
    setCashPrice(newPrice);
    setPriceSource('manual');
  };

  // 路線名の表示用変換
  const getRouteDisplayName = (routeCode: string): string => {
    const routeNames = {
      'NRT-LAX': '東京⇔ロサンゼルス（年末ピーク）',
      'NRT-LHR': '東京⇔ロンドン（お盆ピーク）',
      'NRT-ICN': '東京⇔ソウル（GWピーク）',
      'NRT-SIN': '東京⇔シンガポール（レギュラー）',
      'HND-ITM': '東京⇔大阪（通常期）',
      'HND-OKA': '東京⇔沖縄（通常期）'
    };
    return routeNames[routeCode as keyof typeof routeNames] || routeCode;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          💰 マイル価値計算機（2025年版）
        </h2>
        
        {/* 入力セクション */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              路線
            </label>
            <select
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <optgroup label="国際線">
                <option value="NRT-LAX">東京⇔ロサンゼルス</option>
                <option value="NRT-LHR">東京⇔ロンドン</option>
                <option value="NRT-ICN">東京⇔ソウル</option>
                <option value="NRT-SIN">東京⇔シンガポール</option>
              </optgroup>
              <optgroup label="国内線">
                <option value="HND-ITM">東京⇔大阪</option>
                <option value="HND-OKA">東京⇔沖縄</option>
              </optgroup>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              現金価格（28日前平均）
            </label>
            <div className="relative">
              <input
                type="number"
                value={cashPrice}
                onChange={(e) => handlePriceChange(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="270000"
              />
              {isLoadingPrice && (
                <div className="absolute right-3 top-2">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-gray-500">円（往復・税込）</p>
              {priceSource === 'fallback' && (
                <p className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                  ⚠️ 仮データ使用中
                </p>
              )}
              {priceSource === 'api' && (
                <p className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                  ✅ API取得済み
                </p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              座席クラス
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value as 'economy' | 'business' | 'first')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="economy">エコノミー</option>
              <option value="business">ビジネス</option>
              <option value="first">ファースト</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              シーズン情報
            </label>
            <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-700 text-sm">
              {getRouteDisplayName(selectedRoute).split('（')[1]?.replace('）', '') || 'レギュラー'}
            </div>
          </div>
        </div>

        {/* 計算公式表示 */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">📊 計算公式</h3>
          <p className="text-blue-800 text-sm">
            価値(円/マイル) = (航空券現金価格 - 自己負担額) ÷ 必要マイル数
          </p>
          <p className="text-blue-700 text-xs mt-1">
            ※自己負担額 = 燃油サーチャージ + 税金・手数料
          </p>
        </div>

        {/* データソース警告 */}
        {priceSource === 'fallback' && (
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-orange-500 text-lg">⚠️</span>
              </div>
              <div className="ml-3">
                <h4 className="text-orange-800 font-medium text-sm">仮データを使用中</h4>
                <p className="text-orange-700 text-xs mt-1">
                  現在、リアルタイム価格APIからのデータ取得ができません。表示されている価格は過去の実測データに基づく参考値です。
                  正確な価格は各航空会社の公式サイトや旅行予約サイトでご確認ください。
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* 結果表示 */}
      {isCalculating ? (
        <Card className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">計算中...</span>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {results.length === 0 && (
            <Card className="p-6">
              <div className="text-center text-gray-500">
                データがありません。路線を選択してください。
              </div>
            </Card>
          )}
          
          {/* デバッグ情報の表示 */}
          <Card className="p-4 bg-yellow-50 border border-yellow-200">
            <h4 className="font-medium text-yellow-800 mb-2">🔍 デバッグ情報</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>結果数:</strong> {results.length}
              </div>
              <div>
                <strong>選択路線:</strong> {selectedRoute}
              </div>
              <div>
                <strong>選択クラス:</strong> {selectedClass}
              </div>
              <div className="md:col-span-3">
                <strong>プログラム一覧:</strong> {results.map(r => r.program).join(', ')}
              </div>
              <div className="md:col-span-3">
                <strong>マイル価値順:</strong><br />
                {results.map((r, i) => `${i+1}. ${r.program}: ${r.valuePerMile.toFixed(2)}円/マイル`).join('\n')}
              </div>
            </div>
          </Card>
          
          {results.map((result, index) => {
            return (
            <Card key={`${result.program}-${index}-${result.requiredMiles}`} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {index === 0 && '🏆 '}
                    {result.isPartnerBooking && '🤝 '}
                    {result.program}
                    <span className="text-xs text-gray-400 ml-2">[#{index + 1}]</span>
                    <span className="text-xs text-orange-400 ml-2">[ID: {result.program}-{result.requiredMiles}]</span>
                  </h3>
                  <p className="text-sm text-gray-600">{result.recommendation}</p>
                  {result.specialNote && (
                    <p className="text-xs text-blue-600 mt-1 font-medium">{result.specialNote}</p>
                  )}
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRatingColor(result.rating)}`}>
                  {result.valuePerMile.toFixed(2)}円/マイル
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">必要マイル数</p>
                  <p className="font-semibold text-gray-900">{result.requiredMiles.toLocaleString()}マイル</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">燃油サーチャージ</p>
                  <p className="font-semibold text-gray-900">¥{result.fuelSurcharge.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">税金・手数料</p>
                  <p className="font-semibold text-gray-900">¥{result.taxes.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">自己負担額合計</p>
                  <p className="font-semibold text-red-600">¥{result.totalCost.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    ストップオーバー: {result.features.stopover} | 
                    オープンジョー: {result.features.openJaw ? '可' : '不可'} | 
                    変更手数料: ¥{result.features.changesFee.toLocaleString()}
                  </span>
                </div>
              </div>
              
              {/* 計算詳細 */}
              <div className="mt-3 text-xs text-gray-500 bg-gray-50 p-3 rounded">
                計算: (¥{cashPrice.toLocaleString()} - ¥{result.totalCost.toLocaleString()}) ÷ {result.requiredMiles.toLocaleString()}マイル = {result.valuePerMile.toFixed(2)}円/マイル
              </div>

              {/* 燃油サーチャージ説明 */}
              {result.fuelSurcharge === 0 && (
                <div className="mt-2 text-xs text-green-600 bg-green-50 p-2 rounded">
                  ✈️ {selectedRoute.includes('HND-') || selectedRoute.includes('NRT-ICN') ? '国内線のため' : 'プログラム特典で'}燃油サーチャージ無料
                </div>
              )}
            </Card>
            );
          })}
        </div>
      )}

      {/* ガイドライン参照 */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="font-semibold text-gray-900 mb-3">🎯 判定基準（2025年版ガイドライン）</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-sm">
          <div className="text-center">
            <div className="text-green-600 font-medium">🌟 Excellent</div>
            <div className="text-gray-600">3.0円+</div>
            <div className="text-xs text-gray-500">即座利用</div>
          </div>
          <div className="text-center">
            <div className="text-blue-600 font-medium">✅ Good</div>
            <div className="text-gray-600">2.0-2.9円</div>
            <div className="text-xs text-gray-500">利用推奨</div>
          </div>
          <div className="text-center">
            <div className="text-yellow-600 font-medium">⚠️ Fair</div>
            <div className="text-gray-600">1.5-1.9円</div>
            <div className="text-xs text-gray-500">条件次第</div>
          </div>
          <div className="text-center">
            <div className="text-orange-600 font-medium">🤔 Poor</div>
            <div className="text-gray-600">1.0-1.4円</div>
            <div className="text-xs text-gray-500">現金検討</div>
          </div>
          <div className="text-center">
            <div className="text-red-600 font-medium">❌ Bad</div>
            <div className="text-gray-600">1.0円未満</div>
            <div className="text-xs text-gray-500">現金推奨</div>
          </div>
        </div>
      </Card>

      {/* パートナー発券の説明 */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50">
        <h3 className="font-semibold text-gray-900 mb-3">🤝 パートナー発券の特別メリット</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-purple-800 mb-2">高価値プログラム</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• <strong>Virgin Atlantic → ANA</strong>: 業界最安水準</li>
              <li>• <strong>Alaska → JAL</strong>: YQ無料で大幅節約</li>
              <li>• <strong>Aeroplan</strong>: YQ無料＋Stopover可</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-purple-800 mb-2">注意事項</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• 電話発券必須（手数料あり）</li>
              <li>• パートナー枠の空席制限</li>
              <li>• 改定リスクの定期確認必要</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* 検索結果の現実性について */}
      <Card className="p-6 bg-gradient-to-r from-orange-50 to-red-50">
        <h3 className="font-semibold text-gray-900 mb-3">🔍 価格データ取得について</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-orange-800 mb-2">データ取得の優先順位</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• <strong>1. リアルタイムAPI</strong>: 最新の市場価格</li>
              <li>• <strong>2. フォールバックデータ</strong>: 過去実測値（緊急時のみ）</li>
              <li>• <strong>3. 手動入力</strong>: ユーザー独自価格</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-orange-800 mb-2">現実的な価格バリエーション</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• <strong>東京-大阪</strong>: ¥15,000〜¥25,000</li>
              <li>• <strong>東京-沖縄</strong>: ¥20,000〜¥40,000</li>
              <li>• <strong>時間帯・航空会社</strong>: 大きな価格差あり</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-3 bg-orange-100 rounded-lg">
          <p className="text-orange-800 text-xs">
            <strong>💡 推奨</strong>: 計算結果は参考値として使用し、実際の発券前には複数のサイトで最新価格をご確認ください。
            特に「仮データ使用中」の表示がある場合は、価格の再確認が特に重要です。
          </p>
        </div>
      </Card>
    </div>
  );
};
