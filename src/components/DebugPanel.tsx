'use client';

import { useState, useEffect } from 'react';
import { Bug } from 'lucide-react';
import { TabType } from '../constants';

interface DebugPanelProps {
  activeTab: TabType;
  searchResult: unknown;
  isLoading: boolean;
  error: string | null;
}

interface DebugInfo {
  timestamp: string;
  activeTab: TabType;
  searchResult: string;
  isLoading: boolean;
  error: string | null;
  components: {
    [key: string]: string;
  };
  environment: {
    userAgent: string;
    url: string;
  };
}

export default function DebugPanel({ activeTab, searchResult, isLoading, error }: DebugPanelProps) {
  const [debugMode, setDebugMode] = useState(false);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    timestamp: '',
    activeTab,
    searchResult: 'null',
    isLoading,
    error,
    components: {},
    environment: { userAgent: '', url: '' }
  });

  // デバッグ情報の収集
  useEffect(() => {
    const debugData: DebugInfo = {
      timestamp: new Date().toISOString(),
      activeTab,
      searchResult: searchResult ? 'present' : 'null',
      isLoading,
      error,
      components: {
        SearchForm: 'loaded',
        SearchResults: 'loaded', 
        PriceCalendar: 'loaded',
        PriceAlert: 'loaded',
        ValueCalculator: 'loaded'
      },
      environment: {
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR',
        url: typeof window !== 'undefined' ? window.location.href : 'SSR'
      }
    };
    setDebugInfo(debugData);
    
    if (debugMode) {
      console.log('🐛 Debug Info:', debugData);
    }
  }, [activeTab, searchResult, isLoading, error, debugMode]);

  return (
    <>
      {/* デバッグパネル */}
      {debugMode && (
        <div className="fixed top-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 max-w-md z-50 text-xs">
          <h3 className="font-bold text-red-800 mb-2 flex items-center gap-1">
            <Bug className="w-4 h-4" />
            デバッグ情報
          </h3>
          <pre className="text-red-700 overflow-auto max-h-40">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}

      {/* デバッグトグルボタン */}
      <button
        onClick={() => setDebugMode(!debugMode)}
        className="fixed bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full z-40 transition-colors"
        title="デバッグモード切り替え"
      >
        <Bug className="w-5 h-5" />
      </button>
    </>
  );
}
