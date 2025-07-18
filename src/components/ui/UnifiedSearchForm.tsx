'use client';

import React, { useState, useCallback } from 'react';
import { Search, Calendar, Globe, MoreHorizontal, ChevronDown } from 'lucide-react';
import { AirportSelector } from './AirportSelector';
import { FlightTypeToggle } from './FlightTypeToggle';

interface UnifiedSearchFormProps {
  onSearch: (searchData: any) => void;
  isLoading?: boolean;
}

interface MileageProgram {
  id: string;
  name: string;
  category: 'all' | 'domestic' | 'international';
}

const MILEAGE_PROGRAMS: MileageProgram[] = [
  { id: 'all', name: 'すべてのプログラム', category: 'all' },
  { id: 'ana', name: 'ANAマイレージクラブ', category: 'domestic' },
  { id: 'jal', name: 'JALマイレージバンク', category: 'domestic' },
  { id: 'united', name: 'United MileagePlus', category: 'international' },
  { id: 'delta', name: 'Delta SkyMiles', category: 'international' },
  { id: 'american', name: 'American AAdvantage', category: 'international' },
  { id: 'singapore', name: 'Singapore KrisFlyer', category: 'international' },
  { id: 'cathay', name: 'Cathay Pacific Asia Miles', category: 'international' },
  { id: 'emirates', name: 'Emirates Skywards', category: 'international' },
  { id: 'lufthansa', name: 'Lufthansa Miles & More', category: 'international' },
  { id: 'british', name: 'British Airways Executive Club', category: 'international' },
];

export function UnifiedSearchForm({ onSearch, isLoading = false }: UnifiedSearchFormProps) {
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    tripType: 'oneway' as 'roundtrip' | 'oneway', // 片道をデフォルトに
    passengers: '1',
    selectedPrograms: ['all'] as string[],
    cabin: 'economy' as 'economy' | 'business' | 'first',
    flightType: 'domestic' as 'domestic' | 'international',
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleInputChange = useCallback((field: string, value: any) => {
    setSearchData(prev => {
      const newData = { ...prev, [field]: value };
      
      // 出発地と到着地の重複チェック
      if ((field === 'from' || field === 'to') && newData.from === newData.to && newData.from !== '') {
        setValidationError('出発地と到着地は異なる空港を選択してください');
      } else {
        setValidationError('');
      }
      
      return newData;
    });
  }, []);

  const handleProgramToggle = useCallback((programId: string) => {
    setSearchData(prev => {
      let newPrograms = [...prev.selectedPrograms];
      
      if (programId === 'all') {
        newPrograms = ['all'];
      } else {
        newPrograms = newPrograms.filter(id => id !== 'all');
        
        if (newPrograms.includes(programId)) {
          newPrograms = newPrograms.filter(id => id !== programId);
        } else {
          newPrograms.push(programId);
        }
        
        if (newPrograms.length === 0) {
          newPrograms = ['all'];
        }
      }
      
      return { ...prev, selectedPrograms: newPrograms };
    });
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション
    if (!searchData.from || !searchData.to || !searchData.departDate) {
      setValidationError('出発地、到着地、出発日はすべて必須です');
      return;
    }
    
    if (searchData.from === searchData.to) {
      setValidationError('出発地と到着地は異なる空港を選択してください');
      return;
    }

    // 日付バリデーション
    const departureDate = new Date(searchData.departDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (departureDate < today) {
      setValidationError('出発日は今日以降を選択してください');
      return;
    }

    // 往復の場合の復路日チェック
    if (searchData.tripType === 'roundtrip') {
      if (!searchData.returnDate) {
        setValidationError('往復の場合は復路日も選択してください');
        return;
      }
      
      const returnDate = new Date(searchData.returnDate);
      if (returnDate <= departureDate) {
        setValidationError('復路日は出発日より後を選択してください');
        return;
      }
    }
    
    setValidationError('');
    
    try {
      await onSearch(searchData);
    } catch (error) {
      if (error instanceof Error) {
        setValidationError(error.message);
      } else {
        setValidationError('検索中にエラーが発生しました');
      }
    }
  }, [searchData, onSearch]);

  return (
    <div className="unified-search-form">
      {/* シンプルなヘッダー */}
      <div className="search-header-simple">
        <h2 className="header-title-simple">フライト検索・マイル比較</h2>
      </div>

      <form onSubmit={handleSubmit} className="search-form">
        {/* エラー表示 */}
        {validationError && (
          <div className="validation-error">
            {validationError}
          </div>
        )}

        {/* 1. 国内線/国際線切替 (アニメーション削除済み) */}
        <div className="flight-type-section">
          <label className="field-label">フライトタイプ</label>
          <div className="simple-toggle-group">
            <button
              type="button"
              onClick={() => handleInputChange('flightType', 'domestic')}
              className={`simple-toggle-button ${searchData.flightType === 'domestic' ? 'active' : ''}`}
            >
              国内線
            </button>
            <button
              type="button"
              onClick={() => handleInputChange('flightType', 'international')}
              className={`simple-toggle-button ${searchData.flightType === 'international' ? 'active' : ''}`}
            >
              国際線
            </button>
          </div>
        </div>

        {/* 2. 旅程タイプ */}
        <div className="trip-duration-toggle">
          <label className="field-label">旅程タイプ</label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                value="oneway"
                checked={searchData.tripType === 'oneway'}
                onChange={(e) => handleInputChange('tripType', e.target.value)}
              />
              <span className="radio-label">片道</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                value="roundtrip"
                checked={searchData.tripType === 'roundtrip'}
                onChange={(e) => handleInputChange('tripType', e.target.value)}
              />
              <span className="radio-label">往復</span>
            </label>
          </div>
        </div>

        {/* 3. 出発地・到着地 */}
        <div className="form-grid">
          {/* 出発地 */}
          <div className="field-group">
            <label className="field-label">出発地</label>
            <AirportSelector
              flightType={searchData.flightType as 'domestic' | 'international'}
              selectedAirport={searchData.from}
              onAirportSelect={(value: string) => handleInputChange('from', value)}
              label="出発地"
              placeholder="出発地を選択"
            />
          </div>

          {/* 到着地 */}
          <div className="field-group">
            <label className="field-label">到着地</label>
            <AirportSelector
              flightType={searchData.flightType as 'domestic' | 'international'}
              selectedAirport={searchData.to}
              onAirportSelect={(value: string) => handleInputChange('to', value)}
              label="到着地"
              placeholder="到着地を選択"
            />
          </div>
        </div>

        {/* 4. 出発日 */}
        <div className="form-grid">
          <div className="field-group">
            <label className="field-label">出発日</label>
            <div className="date-input-wrapper">
              <Calendar className="input-icon" />
              <input
                type="date"
                value={searchData.departDate}
                onChange={(e) => handleInputChange('departDate', e.target.value)}
                className="date-input"
                required
              />
            </div>
          </div>

          {/* 復路日 */}
          {searchData.tripType === 'roundtrip' && (
            <div className="field-group">
              <label className="field-label">復路日</label>
              <div className="date-input-wrapper">
                <Calendar className="input-icon" />
                <input
                  type="date"
                  value={searchData.returnDate}
                  onChange={(e) => handleInputChange('returnDate', e.target.value)}
                  className="date-input"
                  min={searchData.departDate}
                />
              </div>
            </div>
          )}
        </div>

        {/* 詳細オプション */}
        <div className="advanced-section">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="advanced-toggle"
          >
            <span>詳細オプション</span>
            <ChevronDown className={`toggle-icon ${showAdvanced ? 'open' : ''}`} />
          </button>

          {showAdvanced && (
            <div className="advanced-content">
              {/* 人数選択 */}
              <div className="field-group">
                <label className="field-label">人数</label>
                <select
                  value={searchData.passengers}
                  onChange={(e) => handleInputChange('passengers', e.target.value)}
                  className="select-input"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num.toString()}>{num}名</option>
                  ))}
                </select>
              </div>

              {/* 座席クラス */}
              <div className="field-group">
                <label className="field-label">座席クラス</label>
                <select
                  value={searchData.cabin}
                  onChange={(e) => handleInputChange('cabin', e.target.value)}
                  className="select-input"
                >
                  <option value="economy">エコノミー</option>
                  <option value="business">ビジネス</option>
                  <option value="first">ファースト</option>
                </select>
              </div>

              {/* マイレージプログラム選択 */}
              <div className="field-group mileage-program-field full-width">
                <label className="field-label">マイレージプログラム</label>
                <div className="program-grid">
                  {MILEAGE_PROGRAMS.map((program) => (
                    <label key={program.id} className="program-option">
                      <input
                        type="checkbox"
                        checked={searchData.selectedPrograms.includes(program.id)}
                        onChange={() => handleProgramToggle(program.id)}
                        className="program-checkbox"
                      />
                      <span className="program-name">{program.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 検索ボタン */}
        <div className="search-button-container">
          <button
            type="submit"
            disabled={isLoading || !searchData.from || !searchData.to || !searchData.departDate}
            className="search-button"
          >
            {isLoading ? (
              <>
                <div className="loading-spinner" />
                <span>検索中...</span>
              </>
            ) : (
              <>
                <Search className="button-icon" />
                <span>検索する</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
