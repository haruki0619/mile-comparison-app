'use client';

import { useState } from 'react';
import { Compass, Search, Calendar, Bell, Calculator, TestTube, Menu } from 'lucide-react';

interface HeaderProps {
  onViewModeChange?: (mode: 'search' | 'calendar' | 'alerts' | 'calculator' | 'validator') => void;
  currentMode?: string;
}

export default function Header({ onViewModeChange, currentMode = 'search' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (mode: 'search' | 'calendar' | 'alerts' | 'calculator' | 'validator') => {
    onViewModeChange?.(mode);
    setIsMobileMenuOpen(false);
  };
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg">
              <Compass className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                マイルコンパス
              </h1>
              
              {/* Navigation Menu */}
              <nav className="hidden md:flex items-center space-x-1">
                <button 
                  onClick={() => handleNavClick('search')}
                  className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentMode === 'search' 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Search className="h-4 w-4" />
                  <span>検索・比較</span>
                </button>
                <button 
                  onClick={() => handleNavClick('calendar')}
                  className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentMode === 'calendar' 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  <span>価格カレンダー</span>
                </button>
                <button 
                  onClick={() => handleNavClick('alerts')}
                  className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentMode === 'alerts' 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Bell className="h-4 w-4" />
                  <span>価格アラート</span>
                </button>
                <button 
                  onClick={() => handleNavClick('calculator')}
                  className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentMode === 'calculator' 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Calculator className="h-4 w-4" />
                  <span>価値計算機</span>
                </button>
                <button 
                  onClick={() => handleNavClick('validator')}
                  className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentMode === 'validator' 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <TestTube className="h-4 w-4" />
                  <span>データ検証</span>
                </button>
              </nav>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Status Indicators - 簡潔化 */}
          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span className="font-medium text-green-600">Live</span>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="font-medium text-blue-600">ANA・JAL対応</span>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              <button 
                onClick={() => handleNavClick('search')}
                className={`w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentMode === 'search' 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Search className="h-4 w-4" />
                <span>検索・比較</span>
              </button>
              <button 
                onClick={() => handleNavClick('calendar')}
                className={`w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentMode === 'calendar' 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Calendar className="h-4 w-4" />
                <span>価格カレンダー</span>
              </button>
              <button 
                onClick={() => handleNavClick('alerts')}
                className={`w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentMode === 'alerts' 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Bell className="h-4 w-4" />
                <span>価格アラート</span>
              </button>
              <button 
                onClick={() => handleNavClick('calculator')}
                className={`w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentMode === 'calculator' 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Calculator className="h-4 w-4" />
                <span>価値計算機</span>
              </button>
              <button 
                onClick={() => handleNavClick('validator')}
                className={`w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentMode === 'validator' 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <TestTube className="h-4 w-4" />
                <span>データ検証</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
