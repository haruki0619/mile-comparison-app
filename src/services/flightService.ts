import { SearchForm, SearchResult } from '../types';

// 仮の検索API関数
export async function searchFlights(form: SearchForm): Promise<SearchResult> {
  // 実際の実装では API を呼び出す
  await new Promise(resolve => setTimeout(resolve, 1000)); // 1秒待機
  
  return {
    route: {
      departure: form.departure,
      arrival: form.arrival,
      distance: Math.floor(Math.random() * 1000) + 300 // 仮の距離
    },
    date: form.date,
    airlines: [
      {
        airline: 'ANA',
        miles: { 
          regular: 12000, 
          peak: 15000, 
          off: 10000 
        },
        cashPrice: 25000,
        bookingStartDays: 355,
        availableSeats: 5,
        discount: {
          type: 'tokutabi',
          discountedMiles: 10000,
          validUntil: '2025-08-31'
        }
      },
      {
        airline: 'JAL',
        miles: { 
          regular: 12000, 
          peak: 15000, 
          off: 10000 
        },
        cashPrice: 28000,
        bookingStartDays: 330,
        availableSeats: 2
      },
      {
        airline: 'SOLASEED',
        miles: { 
          regular: 8000, 
          peak: 10000, 
          off: 6000 
        },
        cashPrice: 22000,
        bookingStartDays: 60,
        availableSeats: 8
      }
    ],
    season: 'regular'
  };
}

// 価格カレンダー用のデータ取得
export async function getPriceCalendar(route: { departure: string; arrival: string }, month: number, year: number) {
  // 実際の実装では API を呼び出す
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prices: { [key: number]: number } = {};
  
  for (let day = 1; day <= daysInMonth; day++) {
    // ランダムな価格を生成（15000-45000円）
    prices[day] = Math.floor(Math.random() * 30000) + 15000;
  }
  
  return prices;
}

// 現在価格の取得（アラート用）
export async function getCurrentPrice(_departure: string, _arrival: string): Promise<number> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return Math.floor(Math.random() * 40000) + 15000;
}
