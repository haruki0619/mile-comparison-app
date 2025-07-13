'use client';

import { Compass, Award, Star, TrendingUp } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2.5 rounded-xl shadow-lg">
              <Compass className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                マイルコンパス
              </h1>
              <p className="text-sm text-gray-600 hidden sm:block">
                航空マイル最適化プラットフォーム
              </p>
            </div>
          </div>
          
          {/* Features & Stats */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1.5 text-gray-600">
                <Award className="h-4 w-4 text-blue-600" />
                <span>ANA・JAL対応</span>
              </div>
              <div className="flex items-center space-x-1.5 text-gray-600">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span>最新レート反映</span>
              </div>
              <div className="flex items-center space-x-1.5 text-gray-600">
                <Star className="h-4 w-4 text-yellow-600" />
                <span>無料利用</span>
              </div>
            </div>
          </div>

          {/* Mobile Features */}
          <div className="md:hidden flex items-center space-x-2 text-xs text-gray-600">
            <Award className="h-4 w-4 text-blue-600" />
            <span>ANA・JAL対応</span>
          </div>
        </div>
      </div>
      
      {/* Sub-header with key benefits */}
      <div className="bg-blue-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-center md:justify-start space-x-6 text-xs text-blue-700">
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>2025年6月改定対応済み</span>
            </span>
            <span className="hidden sm:flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>リアルタイム比較</span>
            </span>
            <span className="hidden md:flex items-center space-x-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>パターン最適化</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
