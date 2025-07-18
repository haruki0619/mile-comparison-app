// 空港選択UI（主要空港優先・地域別表示）
// ファクトチェック: 設計書の空港データ要件に基づく実装

'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Star, MapPin } from 'lucide-react';
import { domesticMajorAirports, domesticAirportsByRegion } from '../../data/domesticMiles';
import { internationalMajorAirports, internationalAirportsByRegion } from '../../data/internationalMiles';
import type { FlightType } from './FlightTypeToggle';

interface AirportSelectorProps {
  flightType: FlightType;
  selectedAirport?: string;
  onAirportSelect: (airportCode: string) => void;
  label: string;
  placeholder?: string;
  className?: string;
}

interface Airport {
  code: string;
  name: string;
  region: string;
  priority?: number;
  international?: boolean;
}

export const AirportSelector: React.FC<AirportSelectorProps> = ({
  flightType,
  selectedAirport,
  onAirportSelect,
  label,
  placeholder = '空港を選択...',
  className = ''
}) => {
  // --- State & refs ---
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'major' | 'region'>('major');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // --- 空港データ一元管理 ---
  // majorAirports + internationalAirports + airports.json をマージ
  const airportsJson = require('../../data/airports.json');
  const internationalAirports = require('../../data/internationalMiles').internationalAirports;
  const allAirports = useMemo(() => {
    const airportMap: Record<string, Airport> = {};
    // majorAirports
    const majors = flightType === 'international' ? internationalMajorAirports : domesticMajorAirports;
    majors.forEach(a => {
      airportMap[a.code] = { ...a };
    });
    // internationalAirports（詳細データ）
    if (flightType === 'international' && Array.isArray(internationalAirports)) {
      internationalAirports.forEach((a: any) => {
        airportMap[a.code] = { code: a.code, name: a.name, region: a.region || '', priority: a.priority, international: true };
      });
    }
    // airports.json
    Object.entries(airportsJson).forEach(([code, info]: [string, any]) => {
      airportMap[code] = { code, name: info.name || '', region: airportMap[code]?.region || '', international: flightType === 'international' };
    });
    return Object.values(airportMap);
  }, [flightType]);
  const majorAirports = useMemo(() => {
    return flightType === 'international' ? internationalMajorAirports : domesticMajorAirports;
  }, [flightType]);
  const regionData = useMemo(() => {
    return flightType === 'international' ? internationalAirportsByRegion : domesticAirportsByRegion;
  }, [flightType]);

  // --- ドロップダウン位置計算 ---
  // dropdownStyle初期値は非表示
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({ display: 'none' });
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'absolute',
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        minWidth: Math.max(rect.width, 260),
        maxWidth: 400,
        zIndex: 1000
      });
    } else {
      setDropdownStyle({ display: 'none' });
    }
  }, [isOpen]);

  // --- 外部クリックで閉じる ---
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // --- 検索・フィルタ ---
  const filteredMajorAirports = useMemo(() => {
    if (!searchQuery) return majorAirports.slice(0, 50);
    const filtered = majorAirports.filter(airport =>
      airport.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      airport.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filtered.slice(0, 50);
  }, [majorAirports, searchQuery]);

  // --- 選択空港名 ---
  const selectedAirportName = useMemo(() => {
    const airport = majorAirports.find(a => a.code === selectedAirport);
    return airport ? `${airport.code} - ${airport.name}` : placeholder;
  }, [selectedAirport, majorAirports, placeholder]);

  // --- 選択処理 ---
  const handleAirportSelect = (airportCode: string) => {
    onAirportSelect(airportCode);
    setIsOpen(false);
    setSearchQuery('');
  };

  // --- 検索入力 ---
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setSearchQuery(e.target.value);
  };
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    }
  };

  // --- UI ---
  return (
    <div className={`airport-selector ${className}`}>
      <label className="selector-label">{label}</label>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="selector-button"
        type="button"
      >
        <span className="selected-value">{selectedAirportName}</span>
        <span className={`dropdown-icon ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      {isOpen && typeof window !== 'undefined' && dropdownStyle.top !== undefined && dropdownStyle.left !== undefined && createPortal(
        <div className="dropdown-menu" ref={dropdownRef} style={dropdownStyle}>
          <div className="search-container">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              placeholder="空港名またはコードで検索..."
              className="search-input"
              autoComplete="off"
              spellCheck="false"
            />
          </div>
          <div className="airport-selector-tabs">
            <button
              type="button"
              onClick={() => setActiveTab('major')}
              className={`airport-selector-tab ${activeTab === 'major' ? 'active' : 'inactive'}`}
            >
              <Star className="w-4 h-4 mr-1" />
              主要空港
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('region')}
              className={`airport-selector-tab ${activeTab === 'region' ? 'active' : 'inactive'}`}
            >
              <MapPin className="w-4 h-4 mr-1" />
              地域別
            </button>
          </div>
          <div className="airport-list p-4" style={{maxHeight: '50vh', minHeight: '120px', boxSizing: 'border-box', overflowY: 'auto'}}>
            {activeTab === 'major' ? (
              <div className="airport-grid">
                {filteredMajorAirports.length > 0 ? (
                  filteredMajorAirports.map((airport) => (
                    <button
                      type="button"
                      key={airport.code}
                      onClick={() => handleAirportSelect(airport.code)}
                      className={`airport-item ${selectedAirport === airport.code ? 'selected' : ''}`}
                      style={{textAlign: 'left'}}
                    >
                      <div className="font-semibold text-blue-600" style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{airport.code}</div>
                      <div className="text-sm text-gray-700" style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{airport.name}</div>
                      <div className="text-xs text-gray-500" style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{airport.region}</div>
                    </button>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">検索結果がありません</div>
                )}
              </div>
            ) : (
              <div className="regional-airports">
                {Object.entries(regionData).map(([regionName, regionInfo]) => (
                  <div key={regionName} className="region-group">
                    <h4 className="region-title" style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{regionName}</h4>
                    {flightType === 'international' ? (
                      <div className="region-countries" style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                        <span className="countries-label">対象国・地域:</span>
                        <span className="countries-list">
                          {(regionInfo as any).countries?.join(', ')}
                        </span>
                      </div>
                    ) : null}
                    <div className="region-airports">
                      {(Array.isArray(regionInfo) ? regionInfo : (regionInfo as any).airports || []).map((airportCode: string) => {
                        // 設計書型定義に準拠: 空港コードからname, regionを全空港データから検索
                        const airport = allAirports.find(a => a.code === airportCode);
                        const name = airportsJson[airportCode]?.name || '';
                        return (
                          <button
                            type="button"
                            key={airportCode}
                            onClick={() => handleAirportSelect(airportCode)}
                            className={`airport-item compact ${selectedAirport === airportCode ? 'selected' : ''}`}
                            style={{textAlign: 'left'}}
                          >
                            <div className="font-semibold text-blue-600" style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{airportCode}</div>
                            <div className="text-sm text-gray-700" style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{name}</div>
                            <div className="text-xs text-gray-500" style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{airport && airport.region ? airport.region : ''}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
