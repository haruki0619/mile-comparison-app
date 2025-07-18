// マイル価値計算機 - 簡素化されたメインコンポーネント
import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { MileValueDisplay } from './ui/MileValueDisplay';
import { 
  MileValueResult, 
  fallbackPrices, 
  calculateMileValue 
} from './utils/mileValueCalculations';

interface MileValueCalculatorProps {
  route?: string;
  className?: string;
}

// 簡素化されたマイルデータ（実際のデータベースから取得する代わり）
const sampleMileData = {
  'ANA': {
    economy: { miles: 10000, fuelSurcharge: 0, taxes: 3300, features: { stopover: '1回無料', openJaw: true, changesFee: 3300 } },
    business: { miles: 15000, fuelSurcharge: 0, taxes: 3300, features: { stopover: '1回無料', openJaw: true, changesFee: 3300 } }
  },
  'JAL': {
    economy: { miles: 10000, fuelSurcharge: 0, taxes: 3300, features: { stopover: '1回無料', openJaw: true, changesFee: 3300 } },
    business: { miles: 15000, fuelSurcharge: 0, taxes: 3300, features: { stopover: '1回無料', openJaw: true, changesFee: 3300 } }
  }
};

export const MileValueCalculator: React.FC<MileValueCalculatorProps> = ({
  route = 'HND-ITM',
  className = ''
}) => {
  const [cashPrice, setCashPrice] = useState<number>(20690);
  const [selectedClass, setSelectedClass] = useState<'economy' | 'business' | 'first'>('economy');
  const [selectedRoute, setSelectedRoute] = useState<string>(route);
  const [results, setResults] = useState<MileValueResult[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  // 計算実行
  const handleCalculate = async () => {
    setIsCalculating(true);
    
    try {
      // 計算ロジックを実行
      const calculatedResults = calculateMileValue(cashPrice, sampleMileData, selectedClass);
      setResults(calculatedResults);
    } catch (error) {
      console.error('計算エラー:', error);
      setResults([]);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          マイル価値計算機
        </h2>

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
              <option value="HND-ITM">羽田 ⇔ 伊丹</option>
              <option value="HND-OKA">羽田 ⇔ 沖縄</option>
              <option value="NRT-LAX">成田 ⇔ ロサンゼルス</option>
              <option value="NRT-LHR">成田 ⇔ ロンドン</option>
            </select>
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
              現金価格 (円)
            </label>
            <input
              type="number"
              value={cashPrice}
              onChange={(e) => setCashPrice(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="例: 20690"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleCalculate}
              disabled={isCalculating}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isCalculating ? '計算中...' : '計算'}
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p>💡 ヒント: 現金価格は検索サイトで確認した実際の料金を入力してください</p>
        </div>
      </Card>

      <MileValueDisplay results={results} isCalculating={isCalculating} />
    </div>
  );
};
