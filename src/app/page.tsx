'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';

// Components
import Header from '../components/Header';
import TabNavigation from '../components/TabNavigation';
import Footer from '../components/Footer';
import DebugPanel from '../components/DebugPanel';
import SearchForm from '../components/SearchForm';
import SearchResults from '../components/SearchResults';
import PriceCalendar from '../components/PriceCalendar';
import PriceAlert from '../components/PriceAlert';
import ValueCalculator from '../components/ValueCalculator';

// Types and services
import { SearchForm as SearchFormType, SearchResult } from '../types';
import { TabType } from '../constants';
import { searchFlights } from '../services/flightService';

export default function Home() {
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('search');
  
  // 検索条件の永続化
  const [lastSearchForm, setLastSearchForm] = useState<SearchFormType | null>(null);
  
  // アラート登録用の選択されたオファー（ポップアップ制御用）
  const [selectedOfferForAlert, setSelectedOfferForAlert] = useState<any>(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const handleSearch = async (form: SearchFormType) => {
    console.log('🔍 Search initiated:', form);
    setIsLoading(true);
    setError(null);
    setLastSearchForm(form); // 検索条件を保存
    
    try {
      console.log('🔍 Calling searchFlights...');
      const result = await searchFlights(form);
      console.log('✅ Search completed:', result);
      setSearchResult(result);
    } catch (err) {
      console.error('❌ Search error:', err);
      setError(err instanceof Error ? err.message : '検索中にエラーが発生しました');
    } finally {
      console.log('🏁 Search finished');
      setIsLoading(false);
    }
  };

  const handleDateSelect = (date: Date) => {
    if (lastSearchForm) {
      const updatedForm = {
        ...lastSearchForm,
        date: date.toISOString().split('T')[0],
      };
      handleSearch(updatedForm);
      setActiveTab('search');
    }
  };

  // アラート登録ハンドラー（ポップアップ形式）
  const handleCreateAlert = (offer: any) => {
    setSelectedOfferForAlert(offer);
    setIsAlertModalOpen(true);
  };

  // アラートモーダルを閉じる
  const handleCloseAlertModal = () => {
    setIsAlertModalOpen(false);
    setSelectedOfferForAlert(null);
  };

  // カレンダーページへの便利な遷移（検索日付付き）
  const handleViewCalendar = (searchDate?: string) => {
    let targetDate: Date | undefined;
    
    if (searchDate) {
      targetDate = new Date(searchDate);
    } else if (lastSearchForm?.date) {
      targetDate = new Date(lastSearchForm.date);
    }
    
    setActiveTab('calendar');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'search':
        return (
          <>
            {/* 検索フォーム */}
            <SearchForm onSearch={handleSearch} isLoading={isLoading} />

            {/* ローディング */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="text-gray-800">検索中...</span>
                  </div>
                </div>
              </div>
            )}

            {/* エラー表示 */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                <div className="flex items-center space-x-2">
                  <div className="bg-red-100 p-2 rounded-full">
                    <MapPin className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-red-800 font-semibold">検索エラー</h3>
                    <p className="text-red-600">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 検索結果 */}
            {searchResult && !isLoading && (
              <SearchResults 
                result={searchResult} 
                onCreateAlert={handleCreateAlert}
                onViewCalendar={handleViewCalendar}
              />
            )}

            {/* 初期状態のヘルプ */}
            {!searchResult && !isLoading && !error && (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="max-w-2xl mx-auto">
                  <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-blue-600" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    航空券・マイル検索を始めましょう
                  </h2>
                  
                  <p className="text-gray-800 mb-6">
                    出発地・到着地・搭乗日を選択して、ANA・JAL・ソラシドエアの
                    マイル要件と現金価格を一括比較できます。
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="text-center">
                      <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                        <span className="text-green-600 font-bold">1</span>
                      </div>
                      <h3 className="font-semibold text-gray-800">検索</h3>
                      <p className="text-sm text-gray-800">
                        出発地・到着地・日程を入力
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                        <span className="text-blue-600 font-bold">2</span>
                      </div>
                      <h3 className="font-semibold text-gray-800">比較</h3>
                      <p className="text-sm text-gray-800">
                        各社のマイル・価格を比較
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                        <span className="text-purple-600 font-bold">3</span>
                      </div>
                      <h3 className="font-semibold text-gray-800">予約</h3>
                      <p className="text-sm text-gray-800">
                        最適な選択肢で予約
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        );

      case 'calendar':
        const targetDate = lastSearchForm?.date ? new Date(lastSearchForm.date) : undefined;
        return (
          <PriceCalendar 
            departure={lastSearchForm?.departure || searchResult?.route.departure || 'HND'}
            arrival={lastSearchForm?.arrival || searchResult?.route.arrival || 'CTS'}
            onDateSelect={handleDateSelect}
            lastSearchDate={lastSearchForm?.date}
            searchRoute={lastSearchForm ? { departure: lastSearchForm.departure, arrival: lastSearchForm.arrival } : undefined}
            targetDate={targetDate}
          />
        );

      case 'alerts':
        return <PriceAlert />;

      case 'calculator':
        return (
          <ValueCalculator 
            departure={searchResult?.route.departure || 'HND'}
            arrival={searchResult?.route.arrival || 'CTS'}
            cashPrice={searchResult?.airlines[0]?.cashPrice || 25000}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </main>

      {/* アラートモーダル（ポップアップ） */}
      {isAlertModalOpen && (
        <PriceAlert 
          prefilledOffer={selectedOfferForAlert}
          isModalOpen={isAlertModalOpen}
          onClose={handleCloseAlertModal}
        />
      )}

      <Footer />
      
      <DebugPanel 
        activeTab={activeTab}
        searchResult={searchResult}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
