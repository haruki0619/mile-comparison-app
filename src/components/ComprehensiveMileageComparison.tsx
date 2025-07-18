/**
 * 統合マイレージ特典航空券比較コンポーネント - 簡素化版
 */

'use client';

import React, { useState, useMemo } from 'react';
import { Plane, Calculator, Info } from 'lucide-react';

interface Route {
  departure: string;
  arrival: string;
}

interface ComprehensiveMileageComparisonProps {
  defaultRoute?: Route;
  className?: string;
}

// 簡素化されたサンプルデータ
const sampleData = {
  ANA: {
    name: 'ANA マイレージクラブ',
    alliance: 'Star Alliance',
    internationalRoutes: {
      'NRT-LAX': {
        economy: { regular: 40000 },
        business: { regular: 85000 }
      }
    }
  },
  JAL: {
    name: 'JAL マイレージバンク',
    alliance: 'oneworld',
    internationalRoutes: {
      'NRT-LAX': {
        economy: { regular: 40000 },
        business: { regular: 80000 }
      }
    }
  }
};

export default function ComprehensiveMileageComparison({
  defaultRoute = { departure: 'NRT', arrival: 'LAX' },
  className = ''
}: ComprehensiveMileageComparisonProps) {
  const [selectedRoute, setSelectedRoute] = useState(`${defaultRoute.departure}-${defaultRoute.arrival}`);
  const [selectedClass, setSelectedClass] = useState<'economy' | 'business' | 'first'>('economy');

  const comparisonData = useMemo(() => {
    const results: any[] = [];
    
    Object.entries(sampleData).forEach(([code, program]) => {
      const route = program.internationalRoutes[selectedRoute as keyof typeof program.internationalRoutes];
      if (route && (route as any)[selectedClass]) {
        results.push({
          code,
          name: program.name,
          alliance: program.alliance,
          miles: (route as any)[selectedClass].regular,
          status: 'available'
        });
      }
    });

    return results.sort((a, b) => a.miles - b.miles);
  }, [selectedRoute, selectedClass]);

  return (
    <div className={`max-w-6xl mx-auto p-6 ${className}`}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
          <div className="flex items-center space-x-3">
            <Plane className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">マイレージ特典航空券 統合比較</h1>
              <p className="text-blue-100 mt-1">22の主要プログラムを一括比較</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                路線
              </label>
              <select
                value={selectedRoute}
                onChange={(e) => setSelectedRoute(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="NRT-LAX">成田 ⇔ ロサンゼルス</option>
                <option value="NRT-LHR">成田 ⇔ ロンドン</option>
                <option value="NRT-SIN">成田 ⇔ シンガポール</option>
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
          </div>

          <div className="space-y-4">
            {comparisonData.map((item, index) => (
              <div key={item.code} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.alliance}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">
                      {item.miles.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">マイル</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {comparisonData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Info className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>選択された条件のデータがありません</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
