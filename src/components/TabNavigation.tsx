'use client';

import { Plane, Calendar, Bell, Calculator } from 'lucide-react';
import { TabType } from '../constants';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const iconMap = {
  Plane,
  Calendar,
  Bell,
  Calculator
};

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: 'search' as const, label: '検索・比較', icon: 'Plane' as const },
    { id: 'calendar' as const, label: '価格カレンダー', icon: 'Calendar' as const },
    { id: 'alerts' as const, label: '価格アラート', icon: 'Bell' as const },
    { id: 'calculator' as const, label: '価値計算機', icon: 'Calculator' as const }
  ];

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const IconComponent = iconMap[tab.icon];
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
