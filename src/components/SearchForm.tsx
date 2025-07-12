'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { SearchForm as SearchFormType } from '../types';
import { AIRPORTS, PASSENGER_OPTIONS } from '../constants';
import { getTodayString, validateSearchForm } from '../utils';

interface SearchFormProps {
  onSearch: (data: SearchFormType) => void;
  isLoading?: boolean;
}

export default function SearchForm({ onSearch, isLoading = false }: SearchFormProps) {
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const form = { departure, arrival, date, passengers };
    const validationError = validateSearchForm(form);
    
    if (validationError) {
      alert(validationError);
      return;
    }

    onSearch(form);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Search className="h-5 w-5" />
        航空券・マイル検索
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 出発地・到着地 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              出発地
            </label>
            <select
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isLoading}
            >
              <option value="">空港を選択してください</option>
              {AIRPORTS.map((airport) => (
                <option key={airport.code} value={airport.code}>
                  {airport.city} - {airport.name} ({airport.code})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              到着地
            </label>
            <select
              value={arrival}
              onChange={(e) => setArrival(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isLoading}
            >
              <option value="">空港を選択してください</option>
              {AIRPORTS.map((airport) => (
                <option key={airport.code} value={airport.code}>
                  {airport.city} - {airport.name} ({airport.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 搭乗日・人数 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              搭乗日
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={getTodayString()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              人数
            </label>
            <select
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            >
              {PASSENGER_OPTIONS.map((num) => (
                <option key={num} value={num}>
                  {num}名
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 検索ボタン */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              検索中...
            </>
          ) : (
            <>
              <Search className="h-5 w-5" />
              検索
            </>
          )}
        </button>
      </form>
    </div>
  );
}
