'use client';

import { Plane, Award } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Plane className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                マイル比較アプリ
              </h1>
              <p className="text-sm text-gray-600">
                日本国内線のマイル・運賃を簡単比較 + 便利ツール
              </p>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Award className="h-4 w-4" />
              <span>ANA・JAL・ソラシドエア対応</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
