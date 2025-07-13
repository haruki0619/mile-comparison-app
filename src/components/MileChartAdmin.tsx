'use client';

import { useState } from 'react';
import { 
  Settings, 
  Plus, 
  Upload, 
  Download, 
  Save,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Globe
} from 'lucide-react';
import { mileChartManager, MileChart, MileUpdateEvent } from '../services/mileChartManager';

interface MileChartAdminProps {
  isAdmin?: boolean;
}

export default function MileChartAdmin({ isAdmin = false }: MileChartAdminProps) {
  const [activeTab, setActiveTab] = useState<'update' | 'history' | 'import'>('update');
  const [newUpdate, setNewUpdate] = useState({
    airline: 'ANA' as 'ANA' | 'JAL',
    changeType: 'increase' as 'increase' | 'decrease' | 'restructure',
    effectiveDate: '',
    description: '',
    impactedRoutes: '',
    averageIncrease: 0,
    announcementDate: '',
    announcementUrl: '',
    summary: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (!isAdmin) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">管理者機能</h3>
        <p className="text-sm text-gray-500">
          マイル表の更新・管理は管理者のみが利用できます
        </p>
      </div>
    );
  }

  const handleSubmitUpdate = async () => {
    setIsSubmitting(true);
    
    // 実際の実装ではAPIエンドポイントに送信
    const updateEvent: MileUpdateEvent = {
      id: `${newUpdate.airline.toLowerCase()}_${Date.now()}`,
      airline: newUpdate.airline,
      changeType: newUpdate.changeType,
      effectiveDate: newUpdate.effectiveDate,
      description: newUpdate.description,
      impactedRoutes: newUpdate.impactedRoutes.split(',').map(r => r.trim()),
      averageIncrease: newUpdate.averageIncrease || undefined,
      announcement: {
        date: newUpdate.announcementDate,
        url: newUpdate.announcementUrl || undefined,
        summary: newUpdate.summary
      }
    };

    try {
      mileChartManager.addUpdateEvent(updateEvent);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
      
      // フォームリセット
      setNewUpdate({
        airline: 'ANA',
        changeType: 'increase',
        effectiveDate: '',
        description: '',
        impactedRoutes: '',
        averageIncrease: 0,
        announcementDate: '',
        announcementUrl: '',
        summary: ''
      });
    } catch (error) {
      console.error('Update submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const exportCurrentData = () => {
    const data = {
      charts: mileChartManager['charts'],
      history: mileChartManager['updateHistory'],
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mile-charts-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-gray-600" />
        <h3 className="text-xl font-bold text-gray-800">マイル表管理</h3>
        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
          管理者専用
        </span>
      </div>

      {/* タブナビゲーション */}
      <div className="flex border-b border-gray-200 mb-6">
        {[
          { id: 'update', label: '更新登録', icon: Plus },
          { id: 'history', label: '更新履歴', icon: Calendar },
          { id: 'import', label: 'データ管理', icon: Upload }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* 更新登録タブ */}
      {activeTab === 'update' && (
        <div className="space-y-6">
          {submitSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">更新情報を正常に登録しました</span>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                航空会社
              </label>
              <select
                value={newUpdate.airline}
                onChange={(e) => setNewUpdate(prev => ({ ...prev, airline: e.target.value as 'ANA' | 'JAL' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ANA">ANA</option>
                <option value="JAL">JAL</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                変更タイプ
              </label>
              <select
                value={newUpdate.changeType}
                onChange={(e) => setNewUpdate(prev => ({ ...prev, changeType: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="increase">マイル数増加</option>
                <option value="decrease">マイル数減少</option>
                <option value="restructure">制度改変</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                適用開始日
              </label>
              <input
                type="date"
                value={newUpdate.effectiveDate}
                onChange={(e) => setNewUpdate(prev => ({ ...prev, effectiveDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                平均変動率（%）
              </label>
              <input
                type="number"
                step="0.1"
                value={newUpdate.averageIncrease}
                onChange={(e) => setNewUpdate(prev => ({ ...prev, averageIncrease: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例: 12.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              変更内容の説明
            </label>
            <textarea
              value={newUpdate.description}
              onChange={(e) => setNewUpdate(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例: ANA国際線特典航空券の必要マイル数改定"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              影響を受ける路線（カンマ区切り）
            </label>
            <input
              type="text"
              value={newUpdate.impactedRoutes}
              onChange={(e) => setNewUpdate(prev => ({ ...prev, impactedRoutes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例: 北米, ヨーロッパ, アジア一部"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                発表日
              </label>
              <input
                type="date"
                value={newUpdate.announcementDate}
                onChange={(e) => setNewUpdate(prev => ({ ...prev, announcementDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                公式発表URL（任意）
              </label>
              <input
                type="url"
                value={newUpdate.announcementUrl}
                onChange={(e) => setNewUpdate(prev => ({ ...prev, announcementUrl: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              発表内容の要約
            </label>
            <textarea
              value={newUpdate.summary}
              onChange={(e) => setNewUpdate(prev => ({ ...prev, summary: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例: 6月24日より国際線特典航空券の必要マイル数を改定します。平均12.5%の増加となります。"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmitUpdate}
              disabled={isSubmitting || !newUpdate.effectiveDate || !newUpdate.description}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  登録中...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  更新情報を登録
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* データ管理タブ */}
      {activeTab === 'import' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="font-medium text-gray-800 mb-2">マイル表データインポート</h4>
              <p className="text-sm text-gray-600 mb-4">
                CSVまたはJSONファイルをアップロード
              </p>
              <input
                type="file"
                accept=".csv,.json"
                className="hidden"
                id="import-file"
              />
              <label
                htmlFor="import-file"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer inline-flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                ファイル選択
              </label>
            </div>

            <div className="border border-gray-300 rounded-lg p-6 text-center">
              <Download className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h4 className="font-medium text-gray-800 mb-2">データエクスポート</h4>
              <p className="text-sm text-gray-600 mb-4">
                現在のマイル表データをバックアップ
              </p>
              <button
                onClick={exportCurrentData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                JSONでエクスポート
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 mb-1">重要事項</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• データのインポート前は必ずバックアップを取得してください</li>
                  <li>• 新しいマイル表は即座にユーザーに表示されます</li>
                  <li>• 変更内容は自動的に更新履歴に記録されます</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
