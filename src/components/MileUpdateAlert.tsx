'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Calendar, 
  ExternalLink,
  RefreshCw,
  Info,
  Star,
  Bell
} from 'lucide-react';
import { mileChartManager, MileUpdateEvent } from '../services/mileChartManager';

interface MileUpdateAlertProps {
  onUpdateSubscribe?: (airline: string) => void;
}

export default function MileUpdateAlert({ onUpdateSubscribe }: MileUpdateAlertProps) {
  const [latestUpdates, setLatestUpdates] = useState<MileUpdateEvent[]>([]);
  const [showAllUpdates, setShowAllUpdates] = useState(false);
  const [subscribedAirlines, setSubscribedAirlines] = useState<Set<string>>(new Set());

  useEffect(() => {
    const updates = mileChartManager.getLatestUpdates(10);
    setLatestUpdates(updates);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'decrease': return <TrendingDown className="w-4 h-4 text-green-500" />;
      default: return <RefreshCw className="w-4 h-4 text-blue-500" />;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase': return 'border-red-200 bg-red-50';
      case 'decrease': return 'border-green-200 bg-green-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  const getImpactLevel = (averageIncrease?: number) => {
    if (!averageIncrease) return { level: '情報', color: 'text-blue-600' };
    if (averageIncrease > 15) return { level: '大幅変更', color: 'text-red-600' };
    if (averageIncrease > 5) return { level: '中程度変更', color: 'text-orange-600' };
    return { level: '軽微変更', color: 'text-green-600' };
  };

  const toggleSubscription = (airline: string) => {
    const newSubscribed = new Set(subscribedAirlines);
    if (newSubscribed.has(airline)) {
      newSubscribed.delete(airline);
    } else {
      newSubscribed.add(airline);
      onUpdateSubscribe?.(airline);
    }
    setSubscribedAirlines(newSubscribed);
  };

  const displayedUpdates = showAllUpdates ? latestUpdates : latestUpdates.slice(0, 3);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-orange-600" />
          <h3 className="text-xl font-bold text-gray-800">マイル表更新情報</h3>
          <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
            最新情報
          </span>
        </div>
        <button
          onClick={() => setShowAllUpdates(!showAllUpdates)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
        >
          {showAllUpdates ? '要約表示' : 'すべて表示'}
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* 重要なお知らせ */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-bold text-yellow-800 mb-2">📈 2025年前半の大きな変更</h4>
            <p className="text-sm text-yellow-700 mb-3">
              ANA（6月24日〜）とJAL（6月10日〜）で国際線特典航空券の必要マイル数が大幅に改定されました。
              特に北米・ヨーロッパ路線で10-15%程度の増加となっています。
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded border">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-blue-600 font-bold">ANA</span>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">平均+12.5%</span>
                </div>
                <div className="text-xs text-gray-600">6月24日改定済み</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-red-600 font-bold">JAL</span>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">平均+10.0%</span>
                </div>
                <div className="text-xs text-gray-600">6月10日改定済み</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 更新履歴 */}
      <div className="space-y-4">
        {displayedUpdates.map((update) => {
          const impact = getImpactLevel(update.averageIncrease);
          return (
            <div
              key={update.id}
              className={`border-2 rounded-lg p-4 ${getChangeColor(update.changeType)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getChangeIcon(update.changeType)}
                  <div>
                    <h4 className="font-bold text-gray-800">{update.airline} マイル表改定</h4>
                    <p className="text-sm text-gray-600">{update.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${impact.color}`}>
                    {impact.level}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(update.effectiveDate)}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">影響エリア</div>
                  <div className="flex flex-wrap gap-1">
                    {update.impactedRoutes.map((route, idx) => (
                      <span
                        key={idx}
                        className="bg-white px-2 py-1 rounded text-xs text-gray-700 border"
                      >
                        {route}
                      </span>
                    ))}
                  </div>
                </div>
                {update.averageIncrease && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">平均変動率</div>
                    <div className="text-2xl font-bold text-red-600">
                      +{update.averageIncrease}%
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    発表: {formatDate(update.announcement.date)}
                  </span>
                  {update.announcement.url && (
                    <a
                      href={update.announcement.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                    >
                      詳細
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <button
                  onClick={() => toggleSubscription(update.airline)}
                  className={`px-3 py-1 rounded text-xs transition-colors flex items-center gap-1 ${
                    subscribedAirlines.has(update.airline)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Bell className="w-3 h-3" />
                  {subscribedAirlines.has(update.airline) ? '通知中' : '通知設定'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* アクションボタン */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          最終更新: {formatDate(new Date().toISOString())}
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            更新チェック
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2">
            <Star className="w-4 h-4" />
            お気に入り路線設定
          </button>
        </div>
      </div>

      {/* 対策のアドバイス */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-bold text-blue-800 mb-2">💡 マイル改定への対策</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>早期予約:</strong> マイル改定前に予約を完了させる</li>
          <li>• <strong>柔軟な日程:</strong> オフピーク期間を狙って必要マイルを削減</li>
          <li>• <strong>航空会社比較:</strong> ANA/JALで有利な路線を使い分ける</li>
          <li>• <strong>アライアンス活用:</strong> ワンワールド・スターアライアンス特典も検討</li>
        </ul>
      </div>
    </div>
  );
}
