import { Airport } from '../types';
import { AIRPORTS } from '../constants';

// 通貨フォーマット
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(amount);
};

// 日付フォーマット
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
};

// 数値フォーマット（3桁区切り）
export const formatNumber = (num: number): string => {
  return num.toLocaleString('ja-JP');
};

// 空港コードから空港情報を取得
export const getAirportByCode = (code: string): Airport | undefined => {
  return AIRPORTS.find(airport => airport.code === code);
};

// 今日の日付を YYYY-MM-DD 形式で取得
export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

// 価格帯に基づく色の取得
export const getPriceColor = (price: number, minPrice: number, maxPrice: number): string => {
  const range = maxPrice - minPrice;
  const position = (price - minPrice) / range;
  
  if (position < 0.33) return 'bg-green-100 text-green-800';
  if (position < 0.67) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

// 月の日数を取得
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

// 月の最初の日の曜日を取得（0=日曜日）
export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

// バリデーション関数
export const validateSearchForm = (form: {
  departure: string;
  arrival: string;
  date: string;
}): string | null => {
  if (!form.departure || !form.arrival || !form.date) {
    return 'すべての項目を入力してください';
  }
  
  if (form.departure === form.arrival) {
    return '出発地と到着地は異なる空港を選択してください';
  }
  
  const selectedDate = new Date(form.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) {
    return '搭乗日は今日以降の日付を選択してください';
  }
  
  return null;
};
