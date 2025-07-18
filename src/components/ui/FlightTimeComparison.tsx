// 時間帯別便表示コンポーネント
// ファクトチェック: 設計書の時間帯比較要件に基づく実装

'use client';

import { useState, useMemo } from 'react';
import { Clock, TrendingUp, Calendar, Sunrise, Sun, CloudSun, Sunset, Moon } from 'lucide-react';
import { domesticFlightTimes } from '../../data/domesticMiles';

interface FlightOption {
  id: string;
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  aircraft: string;
  duration: string;
  miles: number;
  cashPrice?: number;
  availability: 'available' | 'limited' | 'waitlist' | 'unavailable';
  timeCategory: string;
}

interface FlightTimeComparisonProps {
  flights: FlightOption[];
  onFlightSelect?: (flight: FlightOption) => void;
  selectedFlight?: string;
  className?: string;
}

export const FlightTimeComparison: React.FC<FlightTimeComparisonProps> = ({
  flights,
  onFlightSelect,
  selectedFlight,
  className = ''
}) => {
  const [viewMode, setViewMode] = useState<'timeline' | 'category'>('timeline');
  const [sortBy, setSortBy] = useState<'time' | 'miles' | 'price'>('time');

  // 時間帯に対応するアイコンを取得
  const getTimeIcon = (timeCode: string) => {
    switch (timeCode) {
      case 'early': return <Sunrise className="w-4 h-4" />;
      case 'morning': return <Sun className="w-4 h-4" />;
      case 'afternoon': return <CloudSun className="w-4 h-4" />;
      case 'evening': return <Sunset className="w-4 h-4" />;
      case 'night': return <Moon className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // 時間帯別にフライトをグループ化
  const flightsByTimeCategory = useMemo(() => {
    const grouped: Record<string, FlightOption[]> = {};
    
    domesticFlightTimes.forEach(timeSlot => {
      grouped[timeSlot.code] = flights.filter(flight => 
        flight.timeCategory === timeSlot.code
      );
    });
    
    return grouped;
  }, [flights]);

  // ソート済みフライト
  const sortedFlights = useMemo(() => {
    const sorted = [...flights];
    
    switch (sortBy) {
      case 'time':
        return sorted.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
      case 'miles':
        return sorted.sort((a, b) => a.miles - b.miles);
      case 'price':
        return sorted.sort((a, b) => (a.cashPrice || 0) - (b.cashPrice || 0));
      default:
        return sorted;
    }
  }, [flights, sortBy]);

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return '#10b981';
      case 'limited': return '#f59e0b';
      case 'waitlist': return '#ef4444';
      case 'unavailable': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available': return '空席あり';
      case 'limited': return '残席僅か';
      case 'waitlist': return 'キャンセル待ち';
      case 'unavailable': return '満席';
      default: return '不明';
    }
  };

  return (
    <div className={`flight-time-comparison ${className}`}>
      {/* ヘッダー */}
      <div className="comparison-header">
        <h3 className="title">
          <Clock className="w-5 h-5 mr-2" />
          時間帯別便比較
        </h3>
        
        <div className="controls">
          {/* 表示モード切替 */}
          <div className="view-mode-toggle">
            <button
              onClick={() => setViewMode('timeline')}
              className={`mode-button ${viewMode === 'timeline' ? 'active' : ''}`}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              タイムライン表示
            </button>
            <button
              onClick={() => setViewMode('category')}
              className={`mode-button ${viewMode === 'category' ? 'active' : ''}`}
            >
              <Calendar className="w-4 h-4 mr-1" />
              時間帯別表示
            </button>
          </div>
          
          {/* ソート選択 */}
          <div className="sort-selector">
            <label>並び順:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className="sort-select"
            >
              <option value="time">出発時刻順</option>
              <option value="miles">必要マイル順</option>
              <option value="price">価格順</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* フライト表示 */}
      {viewMode === 'timeline' ? (
        <div className="timeline-view">
          <div className="timeline-header">
            <div className="time-slots">
              {domesticFlightTimes.map(timeSlot => (
                <div key={timeSlot.code} className="time-slot">
                  <span className="time-icon">{getTimeIcon(timeSlot.code)}</span>
                  <span className="time-name">{timeSlot.name}</span>
                  <span className="time-range">{timeSlot.timeRange}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flights-timeline">
            {sortedFlights.map((flight, index) => (
              <div
                key={flight.id}
                onClick={() => onFlightSelect?.(flight)}
                className={`flight-time-item animate-slide-in-up ${selectedFlight === flight.id ? 'selected' : ''}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flight-time">
                  <span className="departure-time">{flight.departureTime}</span>
                  <span className="duration">{flight.duration}</span>
                  <span className="arrival-time">{flight.arrivalTime}</span>
                </div>
                
                <div className="flight-info">
                  <div className="airline-info">
                    <span className="airline">{flight.airline}</span>
                    <span className="flight-number">{flight.flightNumber}</span>
                  </div>
                  <span className="aircraft">{flight.aircraft}</span>
                </div>
                
                <div className="flight-details">
                  <div className="miles-info">
                    <span className="miles">{flight.miles.toLocaleString()}</span>
                    <span className="miles-label">マイル</span>
                  </div>
                  {flight.cashPrice && (
                    <div className="price-info">
                      <span className="price">¥{flight.cashPrice.toLocaleString()}</span>
                    </div>
                  )}
                </div>
                
                <div 
                  className="availability-badge"
                  style={{ backgroundColor: getAvailabilityColor(flight.availability) }}
                >
                  {getAvailabilityText(flight.availability)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="category-view">
          {domesticFlightTimes.map(timeSlot => {
            const categoryFlights = flightsByTimeCategory[timeSlot.code] || [];
            
            return (
              <div key={timeSlot.code} className="time-category">
                <div className="category-header">
                  <span className="category-icon">{getTimeIcon(timeSlot.code)}</span>
                  <span className="category-name">{timeSlot.name}</span>
                  <span className="category-range">{timeSlot.timeRange}</span>
                  <span className="flight-count">({categoryFlights.length}便)</span>
                </div>
                
                <div className="category-flights">
                  {categoryFlights.length > 0 ? (
                    categoryFlights.map((flight, index) => (
                      <div
                        key={flight.id}
                        onClick={() => onFlightSelect?.(flight)}
                        className={`flight-card category ${selectedFlight === flight.id ? 'selected' : ''}`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flight-basic">
                          <span className="time">{flight.departureTime} → {flight.arrivalTime}</span>
                          <span className="airline-flight">{flight.airline} {flight.flightNumber}</span>
                        </div>
                        
                        <div className="flight-metrics">
                          <span className="miles">{flight.miles.toLocaleString()}マイル</span>
                          {flight.cashPrice && (
                            <span className="price">¥{flight.cashPrice.toLocaleString()}</span>
                          )}
                          <span 
                            className="availability"
                            style={{ color: getAvailabilityColor(flight.availability) }}
                          >
                            {getAvailabilityText(flight.availability)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-flights">この時間帯に運航便はありません</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <style jsx>{`
        .flight-time-comparison {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .comparison-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-bottom: 1px solid #e5e7eb;
        }
        
        .title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
        }
        
        .controls {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        
        .view-mode-toggle {
          display: flex;
          background: white;
          border-radius: 8px;
          padding: 2px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .mode-button {
          padding: 0.5rem 0.75rem;
          border: none;
          background: transparent;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          color: #6b7280;
        }
        
        .mode-button.active {
          background: #3b82f6;
          color: white;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
        }
        
        .sort-selector {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }
        
        .sort-select {
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
        }
        
        .timeline-view {
          padding: 1.5rem;
        }
        
        .timeline-header {
          margin-bottom: 1.5rem;
        }
        
        .time-slots {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }
        
        .time-slot {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }
        
        .time-icon {
          font-size: 1.5rem;
          margin-bottom: 0.25rem;
        }
        
        .time-name {
          font-weight: 600;
          font-size: 0.875rem;
          color: #374151;
        }
        
        .time-range {
          font-size: 0.75rem;
          color: #6b7280;
        }
        
        .flights-timeline {
          display: grid;
          gap: 1rem;
        }
        
        .flight-card {
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          animation: slideInUp 0.5s ease forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        
        @keyframes slideInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .flight-card:hover {
          border-color: #3b82f6;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
          transform: translateY(-2px);
        }
        
        .flight-card.selected {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.05);
        }
        
        .flight-card.timeline {
          display: grid;
          grid-template-columns: auto 1fr auto auto;
          gap: 1rem;
          align-items: center;
        }
        
        .flight-time {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }
        
        .departure-time,
        .arrival-time {
          font-weight: 600;
          font-size: 1rem;
          color: #374151;
        }
        
        .duration {
          font-size: 0.75rem;
          color: #6b7280;
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }
        
        .flight-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .airline-info {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        
        .airline {
          font-weight: 600;
          color: #374151;
        }
        
        .flight-number {
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.875rem;
          color: #6b7280;
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }
        
        .aircraft {
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        .flight-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .miles-info {
          display: flex;
          flex-direction: column;
          align-items: end;
        }
        
        .miles {
          font-weight: 600;
          font-size: 1.125rem;
          color: #3b82f6;
        }
        
        .miles-label {
          font-size: 0.75rem;
          color: #6b7280;
        }
        
        .price-info .price {
          font-weight: 600;
          color: #059669;
        }
        
        .availability-badge {
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          text-align: center;
        }
        
        .category-view {
          padding: 1rem;
        }
        
        .time-category {
          margin-bottom: 2rem;
        }
        
        .time-category:last-child {
          margin-bottom: 0;
        }
        
        .category-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 8px;
          margin-bottom: 1rem;
        }
        
        .category-icon {
          font-size: 1.25rem;
        }
        
        .category-name {
          font-weight: 600;
          color: #374151;
        }
        
        .category-range {
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        .flight-count {
          font-size: 0.875rem;
          color: #6b7280;
          margin-left: auto;
        }
        
        .category-flights {
          display: grid;
          gap: 0.75rem;
        }
        
        .flight-card.category {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 1rem;
          align-items: center;
        }
        
        .flight-basic {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .time {
          font-weight: 600;
          color: #374151;
        }
        
        .airline-flight {
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        .flight-metrics {
          display: flex;
          gap: 1rem;
          align-items: center;
          font-size: 0.875rem;
        }
        
        .flight-metrics .miles {
          font-weight: 600;
          color: #3b82f6;
        }
        
        .flight-metrics .price {
          font-weight: 600;
          color: #059669;
        }
        
        .availability {
          font-weight: 600;
        }
        
        .no-flights {
          padding: 2rem;
          text-align: center;
          color: #6b7280;
          font-style: italic;
          background: #f9fafb;
          border-radius: 8px;
          border: 1px dashed #d1d5db;
        }
        
        /* レスポンシブ対応 */
        @media (max-width: 768px) {
          .comparison-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }
          
          .controls {
            flex-direction: column;
            gap: 0.75rem;
          }
          
          .view-mode-toggle {
            justify-content: center;
          }
          
          .flight-card.timeline {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
          
          .time-slots {
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          }
          
          .flight-card.category {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
          
          .flight-metrics {
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
};
