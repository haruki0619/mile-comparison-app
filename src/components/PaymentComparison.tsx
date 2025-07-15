'use client';

import { useState, useMemo } from 'react';
import { Calculator, CreditCard, Plane, TrendingUp, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { MILE_VALUES, CREDIT_CARD_TRANSFERS, POPULAR_ROUTES_MILES } from '../data/globalMiles';

interface PaymentComparisonProps {
  route: {
    departure: string;
    arrival: string;
    date: string;
  };
  passengers: number;
  cabinClass: 'economy' | 'business' | 'first';
}

export default function PaymentComparison({ route, passengers, cabinClass }: PaymentComparisonProps) {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [showDetails, setShowDetails] = useState<string>('');

  // ルートキーの生成
  const routeKey = `${route.departure}-${route.arrival}`;
  const routeData = POPULAR_ROUTES_MILES[routeKey as keyof typeof POPULAR_ROUTES_MILES];

  // 支払いオプションの計算
  const paymentOptions = useMemo(() => {
    if (!routeData) return [];

    const options = [];

    // 現金支払いオプション（仮想データ）
    const estimatedCashPrice = {
      economy: 80000,
      business: 250000,
      first: 450000
    }[cabinClass] * passengers;

    options.push({
      id: 'cash',
      type: 'cash',
      title: '現金支払い',
      amount: estimatedCashPrice,
      currency: '円',
      icon: CreditCard,
      color: 'green',
      description: '通常の航空券購入',
      details: {
        refundable: true,
        changeable: true,
        earnMiles: Math.floor(estimatedCashPrice * 0.01)
      },
      efficiency: 100,
      availability: 'available'
    });

    // 各航空会社のマイル支払いオプション
    Object.entries(routeData).forEach(([airline, mileData]) => {
      if (mileData && typeof mileData === 'object' && cabinClass in mileData) {
        const requiredMiles = (mileData as any)[cabinClass] * passengers;
        const mileValue = MILE_VALUES[airline as keyof typeof MILE_VALUES];
        
        // mileValueが存在しない場合はスキップ
        if (!mileValue || !mileValue.averageValue) {
          console.warn(`Mile value not found for airline: ${airline}`);
          return;
        }
        
        const estimatedValue = requiredMiles * mileValue.averageValue;
        const savings = estimatedCashPrice - estimatedValue;
        const efficiency = Math.round((savings / estimatedCashPrice) * 100);

        options.push({
          id: `miles_${airline}`,
          type: 'miles',
          title: `${airline}マイル`,
          amount: requiredMiles,
          currency: 'マイル',
          icon: Plane,
          color: efficiency > 50 ? 'blue' : efficiency > 25 ? 'yellow' : 'red',
          description: `推定価値: ¥${estimatedValue.toLocaleString()}`,
          details: {
            refundable: false,
            changeable: false,
            earnMiles: 0,
            estimatedValue,
            savings,
            taxes: Math.floor(estimatedCashPrice * 0.1),
            valuePerMile: mileValue.averageValue
          },
          efficiency,
          availability: 'limited'
        });
      }
    });

    // ポイント移行オプション
    Object.entries(CREDIT_CARD_TRANSFERS).forEach(([cardType, transferData]) => {
      transferData.transfers.forEach((transfer) => {
        if ((routeData as any)[transfer.airline]?.[cabinClass]) {
          const requiredMiles = (routeData as any)[transfer.airline][cabinClass] * passengers;
          const [pointsIn, milesOut] = transfer.ratio.split(':').map(Number);
          const requiredPoints = Math.ceil((requiredMiles * pointsIn) / milesOut);
          
          // ボーナスポイント計算（Marriott Bonvoyの場合）
          let finalMiles = requiredMiles;
          if (cardType === 'MARRIOTT_BONVOY' && requiredPoints >= 60000) {
            const bonusMultiplier = Math.floor(requiredPoints / 60000);
            finalMiles += bonusMultiplier * 5000;
          }

          const mileValue = MILE_VALUES[transfer.airline as keyof typeof MILE_VALUES];
          
          // mileValueが存在しない場合はスキップ
          if (!mileValue || !mileValue.averageValue) {
            console.warn(`Mile value not found for transfer airline: ${transfer.airline}`);
            return;
          }
          
          const estimatedValue = finalMiles * mileValue.averageValue;
          const savings = estimatedCashPrice - estimatedValue;
          const efficiency = Math.round((savings / estimatedCashPrice) * 100);

          options.push({
            id: `transfer_${cardType}_${transfer.airline}`,
            type: 'transfer',
            title: `${cardType} → ${transfer.airline}`,
            amount: requiredPoints,
            currency: 'ポイント',
            icon: Calculator,
            color: efficiency > 40 ? 'purple' : efficiency > 20 ? 'yellow' : 'gray',
            description: `${finalMiles.toLocaleString()}マイルに移行`,
            details: {
              refundable: false,
              changeable: false,
              earnMiles: 0,
              transferRatio: parseFloat(transfer.ratio.split(':')[1]),
              transferTime: transfer.time,
              resultingMiles: finalMiles,
              savings
            },
            efficiency,
            availability: 'available'
          });
        }
      });
    });

    return options.sort((a, b) => b.efficiency - a.efficiency);
  }, [route, passengers, cabinClass, routeData]);

  const getColorClasses = (color: string) => {
    const colors = {
      green: 'bg-green-50 border-green-200 text-green-800',
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      red: 'bg-red-50 border-red-200 text-red-800',
      gray: 'bg-gray-50 border-gray-200 text-gray-800'
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  const getAvailabilityIcon = (availability: string) => {
    switch (availability) {
      case 'available':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'limited':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  if (!routeData) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            このルートのデータはまだ利用できません
          </h3>
          <p className="text-gray-600">
            {route.departure} → {route.arrival} のマイル要件データを収集中です。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-3">
          <Calculator className="w-6 h-6" />
          支払方法比較
        </h2>
        <p className="text-indigo-100 mt-1">
          {route.departure} → {route.arrival} | {passengers}名 | {cabinClass}
        </p>
      </div>

      {/* 推奨オプション */}
      {paymentOptions.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-green-800">最推奨オプション</h3>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{paymentOptions[0].title}</h4>
                <p className="text-sm text-gray-600">{paymentOptions[0].description}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {paymentOptions[0].amount.toLocaleString()} {paymentOptions[0].currency}
                </div>
                <div className="text-sm text-green-600 font-medium">
                  効率性: {paymentOptions[0].efficiency}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 全オプション一覧 */}
      <div className="p-6">
        <div className="space-y-4">
          {paymentOptions.map((option, index) => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.id}
                className={`border rounded-lg p-4 transition-all cursor-pointer ${
                  selectedOption === option.id 
                    ? 'ring-2 ring-blue-500 border-blue-300' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedOption(option.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${getColorClasses(option.color)}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{option.title}</h4>
                        {getAvailabilityIcon(option.availability)}
                        {index === 0 && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                            最推奨
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {option.amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">{option.currency}</div>
                    <div className={`text-sm font-medium ${
                      option.efficiency > 50 ? 'text-green-600' :
                      option.efficiency > 25 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      効率性: {option.efficiency}%
                    </div>
                  </div>
                </div>

                {/* 詳細情報 */}
                {selectedOption === option.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {option.type === 'cash' && (
                        <>
                          <div>
                            <span className="font-medium text-gray-700">払い戻し:</span>
                            <span className="ml-2 text-gray-600">
                              {option.details.refundable ? '可能' : '不可'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">変更:</span>
                            <span className="ml-2 text-gray-600">
                              {option.details.changeable ? '可能' : '不可'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">獲得マイル:</span>
                            <span className="ml-2 text-gray-600">
                              約{option.details.earnMiles.toLocaleString()}マイル
                            </span>
                          </div>
                        </>
                      )}
                      
                      {option.type === 'miles' && (
                        <>
                          <div>
                            <span className="font-medium text-gray-700">推定価値:</span>
                            <span className="ml-2 text-gray-600">
                              ¥{(option.details as any).estimatedValue?.toLocaleString() || '0'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">節約額:</span>
                            <span className="ml-2 text-green-600 font-medium">
                              ¥{(option.details as any).savings?.toLocaleString() || '0'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">税金・手数料:</span>
                            <span className="ml-2 text-gray-600">
                              約¥{(option.details as any).taxes?.toLocaleString() || '0'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">1マイル価値:</span>
                            <span className="ml-2 text-gray-600">
                              {(option.details as any).valuePerMile || '0'}円
                            </span>
                          </div>
                        </>
                      )}
                      
                      {option.type === 'transfer' && (
                        <>
                          <div>
                            <span className="font-medium text-gray-700">移行レート:</span>
                            <span className="ml-2 text-gray-600">
                              {(option.details as any).transferRatio || '1:1'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">移行時間:</span>
                            <span className="ml-2 text-gray-600">
                              {(option.details as any).transferTime || '即時'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">取得マイル:</span>
                            <span className="ml-2 text-gray-600">
                              {(option.details as any).resultingMiles?.toLocaleString() || '0'}マイル
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">推定節約:</span>
                            <span className="ml-2 text-green-600 font-medium">
                              ¥{(option.details as any).savings?.toLocaleString() || '0'}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* アクションボタン */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
              価格アラートを設定
            </button>
            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
              予約サイトへ移動
            </button>
            <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
              詳細分析を表示
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
