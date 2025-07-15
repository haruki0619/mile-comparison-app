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
    // 検索結果の詳細分析
    let resultAnalysis = 'null';
    if (searchResult) {
      try {
        const result = searchResult as any;
        if (result.airlines && Array.isArray(result.airlines)) {
          const airlineNames = result.airlines.map((a: any, index: number) => 
            `${index + 1}. ${a.airline || a.name || 'Unknown'}`
          ).join(', ');
          resultAnalysis = `${result.airlines.length} airlines: [${airlineNames}]`;
          
          // 重複チェック
          const airlineSet = new Set(result.airlines.map((a: any) => a.airline || a.name));
          if (airlineSet.size !== result.airlines.length) {
            resultAnalysis += ` ⚠️ DUPLICATES DETECTED!`;
          }
        } else {
          resultAnalysis = 'invalid structure';
        }
      } catch (e) {
        resultAnalysis = `error parsing: ${e}`;
      }
    }

    const debugData: DebugInfo = {
      timestamp: new Date().toISOString(),
      activeTab,
      searchResult: resultAnalysis,
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
      if (searchResult) {
        console.log('🔍 Detailed Search Result:', searchResult);
      }
    }
  }, [activeTab, searchResult, isLoading, error, debugMode]);

  return (
    <>
      {/* デバッグパネル */}
      {debugMode && (
        <div className="fixed top-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 max-w-md z-50 text-xs overflow-y-auto max-h-96">
          <h3 className="font-bold text-red-800 mb-2 flex items-center gap-1">
            <Bug className="w-4 h-4" />
            デバッグ情報（検索結果問題調査）
          </h3>
          <div className="space-y-2">
            <div>
              <strong>検索結果:</strong>
              <pre className="text-red-700 bg-red-100 p-2 rounded mt-1">
                {debugInfo.searchResult}
              </pre>
            </div>
            <div>
              <strong>Loading:</strong> {debugInfo.isLoading ? 'Yes' : 'No'}
            </div>
            {debugInfo.error && (
              <div>
                <strong>Error:</strong>
                <pre className="text-red-700 bg-red-100 p-2 rounded mt-1">
                  {debugInfo.error}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* デバッグトグルボタン */}
      <button
        onClick={() => setDebugMode(!debugMode)}
        className="fixed bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full z-40 transition-colors"
        title="デバッグモード切り替え（ANA重複問題調査）"
      >
        <Bug className="w-5 h-5" />
      </button>
    </>
  );
}
