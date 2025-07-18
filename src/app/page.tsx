'use client';

import { useState } from 'react';
import { MapPin, TrendingUp, Award } from 'lucide-react';

// Components
import Header from '../components/Header';
import Footer from '../components/Footer';
import DebugPanel from '../components/DebugPanel';
import MileDataValidator from '../components/MileDataValidator';
import SearchForm from '../components/SearchForm';
import EnhancedSearchForm from '../components/EnhancedSearchForm';
import AdvancedSearchForm from '../components/AdvancedSearchForm';
import { UnifiedSearchForm } from '../components/ui/UnifiedSearchForm';
import SearchResults from '../components/SearchResults';
import PaymentComparison from '../components/PaymentComparison';
import UnifiedMileComparison from '../components/UnifiedMileComparison';
import PriceCalendar from '../components/PriceCalendar';
import PriceAlert from '../components/PriceAlert';
import ValueCalculator from '../components/ValueCalculator';
import MileTransferCalculator from '../components/MileTransferCalculator';
import TransferCaseStudy from '../components/TransferCaseStudy';

// Types and services  
import { searchFlights } from '../services/flightService';

// 簡素化された型定義（UnifiedSearchFormとの互換性のため拡張）
interface SearchFormType {
  departure: string;
  arrival: string;
  date: string;
  passengers: number;
  flightType?: 'domestic' | 'international';
  cabinClass?: 'economy' | 'premium_economy' | 'business' | 'first';
  isRoundTrip?: boolean;
  returnDate?: string;
  mileageProgram?: string; // ファクトチェック: 設計書「型定義」準拠
}

interface SearchResult {
  flights: any[];
  total: number;
  route?: {
    departure: string;
    arrival: string;
  };
  airlines?: any[];
}

export default function Home() {
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'search' | 'calendar' | 'alerts' | 'calculator' | 'validator' | 'transfer' | 'casestudy'>('search');
  // 検索条件の永続化
  const [lastSearchForm, setLastSearchForm] = useState<SearchFormType | null>(null);
  // アラート登録用の選択されたオファー（ポップアップ制御用）
  const [selectedOfferForAlert, setSelectedOfferForAlert] = useState<any>(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const handleSearch = async (form: SearchFormType | any) => {
    console.log('🔍 Search initiated:', form);
    setIsLoading(true);
    setError(null);
    
    // UnifiedSearchFormのデータをSearchFormTypeに変換
    const searchForm: SearchFormType = {
      departure: form.departure,
      arrival: form.arrival,
      date: form.departureDate || form.date,
      passengers: form.passengerCount || form.passengers || 1,
      flightType: form.flightType,
      cabinClass: form.cabinClass,
      isRoundTrip: form.isRoundTrip,
      returnDate: form.returnDate,
      mileageProgram: form.mileageProgram // 詳細検索タブで選択された場合
    };
    
    setLastSearchForm(searchForm); // 検索条件を保存
    
    try {
      console.log('🔍 Calling searchFlights...');
      const result = await searchFlights(searchForm);
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
    if (lastSearchForm?.date) {
      const updatedForm = {
        ...lastSearchForm,
        date: date.toISOString().split('T')[0],
      };
      // 日付のバリデーション
      if (updatedForm.date) {
        handleSearch(updatedForm as SearchFormType);
      } else {
        setError('日付を選択してください');
      }
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

  // ビューモード切り替えハンドラー
  const handleViewModeChange = (mode: 'search' | 'calendar' | 'alerts' | 'calculator' | 'validator' | 'transfer' | 'casestudy') => {
    setViewMode(mode);
  };

  // 検索フォームとグローバルマイルの国内線・国際線切り替え統合
  const renderMainContent = () => {
    switch (viewMode) {
      case 'search':
        return (
          <>
            {/* 統合検索フォーム（国内線・国際線分離対応） */}
            <UnifiedSearchForm 
              onSearch={handleSearch} 
              isLoading={isLoading}
              className="mb-6 premium-card"
            />

            {/* ローディング */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="bg-white rounded-xl shadow-premium p-8 glass-effect">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="text-gray-800">検索中...</span>
                  </div>
                </div>
              </div>
            )}

            {/* エラー表示 */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 shadow-lg">
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

            {/* 検索結果エリア - 明確な境界 */}
            {searchResult && !isLoading && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-1 mt-8 premium-card">
                <div className="bg-white rounded-lg shadow-premium">
                  {/* 検索結果コンテンツ */}
                  <div className="p-6">
                    <SearchResults 
                      result={searchResult} 
                      lastSearchForm={lastSearchForm}
                      onCreateAlert={handleCreateAlert}
                      onViewCalendar={handleViewCalendar}
                    />
                    {/* 統合マイル比較 */}
                    <div className="mt-6">
                      <UnifiedMileComparison 
                        result={searchResult}
                        onSelectOption={(option) => {
                          console.log('Selected mile option:', option);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 比較分析セクション - 検索結果がある場合のみ表示 */}
            {searchResult && lastSearchForm && !isLoading && (
              <div className="mt-8 space-y-6">
                {/* 支払方法比較 */}
                <div className="bg-gray-50 rounded-xl p-6 premium-card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                    支払方法比較
                  </h3>
                  <PaymentComparison
                    route={{
                      departure: lastSearchForm.departure,
                      arrival: lastSearchForm.arrival,
                      date: lastSearchForm.date
                    }}
                    passengers={lastSearchForm.passengers}
                    cabinClass="economy"
                  />
                </div>
              </div>
            )}

            {/* 初期状態のヘルプ */}
            {!searchResult && !isLoading && !error && (
              <div className="bg-white rounded-xl shadow-premium p-8 text-center mt-8 glass-effect">
                <div className="max-w-2xl mx-auto">
                  <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Award className="h-8 w-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4" style={{letterSpacing:'-0.01em'}}>
                    航空券・マイル検索を始めましょう
                  </h2>
                  <p className="text-gray-800 mb-6">
                    出発地・到着地・搭乗日を選択して、ANA・JAL・Peach・Jetstar・Skymark等
                    ファクトチェック済みのマイル要件と現金価格を一括比較できます。
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="text-center premium-card">
                      <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                        <span className="text-green-600 font-bold">1</span>
                      </div>
                      <h3 className="font-semibold text-gray-800">検索</h3>
                      <p className="text-sm text-gray-800">
                        出発地・到着地・日程を入力
                      </p>
                    </div>
                    <div className="text-center premium-card">
                      <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                        <span className="text-blue-600 font-bold">2</span>
                      </div>
                      <h3 className="font-semibold text-gray-800">比較</h3>
                      <p className="text-sm text-gray-800">
                        各社のマイル・価格を比較
                      </p>
                    </div>
                    <div className="text-center premium-card">
                      <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                        <span className="text-purple-600 font-bold">3</span>
                      </div>
                      <h3 className="font-semibold text-gray-800">予約</h3>
                      <p className="text-sm text-gray-800">
                        最適な選択肢で予約
                      </p>
                    </div>
                  </div>
                  {/* ファクトチェック根拠: 設計書「UI設計」「型定義」「ファクトチェック」, ANA/JAL公式, Material Design, Apple HIG */}
                </div>
              </div>
            )}
          </>
        );

      case 'calendar':
        const targetDate = lastSearchForm?.date ? new Date(lastSearchForm.date) : new Date();
        return (
          <PriceCalendar 
            departure={lastSearchForm?.departure || searchResult?.route?.departure || 'HND'}
            arrival={lastSearchForm?.arrival || searchResult?.route?.arrival || 'CTS'}
            onDateSelect={handleDateSelect}
            lastSearchDate={lastSearchForm?.date || ''}
            searchRoute={lastSearchForm ? { departure: lastSearchForm.departure, arrival: lastSearchForm.arrival } : { departure: 'HND', arrival: 'CTS' }}
            targetDate={targetDate}
          />
        );

      case 'alerts':
        return <PriceAlert />;

      case 'calculator':
        return (
          <ValueCalculator 
            departure={searchResult?.route?.departure || 'HND'}
            arrival={searchResult?.route?.arrival || 'CTS'}
            cashPrice={searchResult?.airlines?.[0]?.cashPrice || 25000}
          />
        );

      case 'validator':
        return <MileDataValidator />;

      case 'transfer':
        return <MileTransferCalculator />;

      case 'casestudy':
        return <TransferCaseStudy />;

      default:
        return null;
    }
  };

  // カレンダーページへの便利な遷移（検索日付付き）
  const handleViewCalendar = (searchDate?: string) => {
    setViewMode('calendar');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header onViewModeChange={handleViewModeChange} currentMode={viewMode} />
      
      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderMainContent()}
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
        searchResult={searchResult}
        isLoading={isLoading}
        error={error}
        activeTab={viewMode}
      />
    </div>
  );
}
