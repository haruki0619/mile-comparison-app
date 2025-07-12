'use client';

import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, TrendingDown, TrendingUp } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { ja } from 'date-fns/locale';

interface FlightPrice {
  date: Date;
  anaMiles: number;
  jalMiles: number;
  solaseedMiles: number;
  cashPrice: number;
}

interface PriceCalendarProps {
  departure: string;
  arrival: string;
  onDateSelect: (date: Date) => void;
}

export default function PriceCalendar({ departure, arrival, onDateSelect }: PriceCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 仮のデータ生成（実際は API から取得）
  const generateMockPrices = (date: Date): FlightPrice => {
    const baseAna = 12000;
    const baseJal = 12500;
    const baseSolaseed = 10000;
    const baseCash = 25000;
    
    // 曜日や日付による価格変動をシミュレート
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const multiplier = isWeekend ? 1.3 : 1.0;
    
    return {
      date,
      anaMiles: Math.round(baseAna * multiplier * (0.8 + Math.random() * 0.4)),
      jalMiles: Math.round(baseJal * multiplier * (0.8 + Math.random() * 0.4)),
      solaseedMiles: Math.round(baseSolaseed * multiplier * (0.8 + Math.random() * 0.4)),
      cashPrice: Math.round(baseCash * multiplier * (0.8 + Math.random() * 0.4))
    };
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const prices = calendarDays.map(generateMockPrices);
  const minAnaPrice = Math.min(...prices.map(p => p.anaMiles));
  const maxAnaPrice = Math.max(...prices.map(p => p.anaMiles));

  const getPriceColor = (miles: number) => {
    const ratio = (miles - minAnaPrice) / (maxAnaPrice - minAnaPrice);
    if (ratio < 0.3) return 'bg-green-100 text-green-800 border-green-200';
    if (ratio < 0.7) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const handleDateClick = (price: FlightPrice) => {
    setSelectedDate(price.date);
    onDateSelect(price.date);
  };

  const previousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-600" />
          価格カレンダー
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-semibold min-w-[120px] text-center">
            {format(currentMonth, 'yyyy年M月', { locale: ja })}
          </h3>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {departure && arrival && (
        <div className="mb-4 text-center text-gray-600">
          {departure} → {arrival} の価格推移
        </div>
      )}

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['日', '月', '火', '水', '木', '金', '土'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7 gap-2">
        {prices.map(price => (
          <div
            key={price.date.toISOString()}
            onClick={() => handleDateClick(price)}
            className={`
              relative p-2 border-2 rounded-lg cursor-pointer transition-all hover:scale-105
              ${getPriceColor(price.anaMiles)}
              ${selectedDate && isSameDay(selectedDate, price.date) ? 'ring-2 ring-blue-500' : ''}
              ${price.date < new Date() ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <div className="text-center">
              <div className="text-sm font-semibold">
                {format(price.date, 'd')}
              </div>
              <div className="text-xs mt-1">
                <div className="font-medium">ANA</div>
                <div>{price.anaMiles.toLocaleString()}</div>
              </div>
              
              {/* 価格トレンドアイコン */}
              <div className="absolute top-1 right-1">
                {price.anaMiles === minAnaPrice ? (
                  <TrendingDown className="w-3 h-3 text-green-600" />
                ) : price.anaMiles === maxAnaPrice ? (
                  <TrendingUp className="w-3 h-3 text-red-600" />
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 凡例 */}
      <div className="mt-6 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
          <span>安い</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
          <span>普通</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
          <span>高い</span>
        </div>
      </div>

      {/* 選択された日の詳細 */}
      {selectedDate && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-3">
            {format(selectedDate, 'M月d日(E)', { locale: ja })} の詳細価格
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(() => {
              const price = prices.find(p => isSameDay(p.date, selectedDate));
              if (!price) return null;
              
              return (
                <>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">ANA</div>
                    <div className="text-lg font-semibold text-blue-600">
                      {price.anaMiles.toLocaleString()}マイル
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">JAL</div>
                    <div className="text-lg font-semibold text-red-600">
                      {price.jalMiles.toLocaleString()}マイル
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">ソラシド</div>
                    <div className="text-lg font-semibold text-green-600">
                      {price.solaseedMiles.toLocaleString()}マイル
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">現金価格</div>
                    <div className="text-lg font-semibold text-gray-800">
                      ¥{price.cashPrice.toLocaleString()}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
