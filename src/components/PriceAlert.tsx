'use client';

import { useState, useEffect } from 'react';
import { Bell, Mail, Trash2, Plus } from 'lucide-react';

interface PriceAlert {
  id: string;
  departure: string;
  arrival: string;
  targetMiles: number;
  currentMiles: number;
  airline: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
}

interface PriceAlertProps {
  prefilledOffer?: {
    airline: string;
    route: { departure: string; arrival: string };
    date: string;
    price: number;
    miles: number;
  };
  isModalOpen?: boolean;
  onClose?: () => void;
}

export default function PriceAlert({ prefilledOffer, isModalOpen: propIsModalOpen = false, onClose }: PriceAlertProps) {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(propIsModalOpen);
  const [newAlert, setNewAlert] = useState({
    departure: prefilledOffer?.route.departure || '',
    arrival: prefilledOffer?.route.arrival || '',
    targetMiles: prefilledOffer?.miles ? String(Math.floor(prefilledOffer.miles * 0.9)) : '', // 10%安い価格を目標に
    airline: prefilledOffer?.airline || '',
    email: ''
  });

  // 事前入力されたオファーがある場合、自動でモーダルを開く
  useEffect(() => {
    if (prefilledOffer || propIsModalOpen) {
      setIsModalOpen(true);
    }
  }, [prefilledOffer, propIsModalOpen]);

  const addAlert = () => {
    if (newAlert.departure && newAlert.arrival && newAlert.targetMiles && newAlert.email) {
      const alert: PriceAlert = {
        id: Date.now().toString(),
        departure: newAlert.departure,
        arrival: newAlert.arrival,
        targetMiles: parseInt(newAlert.targetMiles),
        currentMiles: Math.floor(Math.random() * 15000) + 10000, // ダミーデータ
        airline: newAlert.airline,
        email: newAlert.email,
        isActive: true,
        createdAt: new Date()
      };
      
      setAlerts(prev => [...prev, alert]);
      setNewAlert({ departure: '', arrival: '', targetMiles: '', airline: '', email: '' });
      setIsModalOpen(false);
      onClose && onClose();
    }
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const toggleAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  // モーダルのみモード（ポップアップ形式）
  if (propIsModalOpen || prefilledOffer) {
    return (
      <>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold mb-4">価格アラートを追加</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">出発地</label>
                  <select
                    value={newAlert.departure}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, departure: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">選択してください</option>
                    <option value="HND">羽田空港 (HND)</option>
                    <option value="NRT">成田国際空港 (NRT)</option>
                    <option value="ITM">大阪国際空港（伊丹） (ITM)</option>
                    <option value="KIX">関西国際空港 (KIX)</option>
                    <option value="NGO">中部国際空港 (NGO)</option>
                    <option value="CTS">新千歳空港 (CTS)</option>
                    <option value="FUK">福岡空港 (FUK)</option>
                    <option value="OKA">那覇空港 (OKA)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">到着地</label>
                  <select
                    value={newAlert.arrival}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, arrival: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">選択してください</option>
                    <option value="HND">羽田空港 (HND)</option>
                    <option value="NRT">成田国際空港 (NRT)</option>
                    <option value="ITM">大阪国際空港（伊丹） (ITM)</option>
                    <option value="KIX">関西国際空港 (KIX)</option>
                    <option value="NGO">中部国際空港 (NGO)</option>
                    <option value="CTS">新千歳空港 (CTS)</option>
                    <option value="FUK">福岡空港 (FUK)</option>
                    <option value="OKA">那覇空港 (OKA)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">航空会社</label>
                  <select
                    value={newAlert.airline}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, airline: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">すべて</option>
                    <option value="ANA">ANA</option>
                    <option value="JAL">JAL</option>
                    <option value="Solaseed">ソラシド</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">目標マイル数</label>
                  <input
                    type="number"
                    value={newAlert.targetMiles}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, targetMiles: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="例: 12000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">通知先メールアドレス</label>
                  <input
                    type="email"
                    value={newAlert.email}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    onClose && onClose();
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={addAlert}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  追加
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // 通常のアラート管理ページ
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Bell className="w-6 h-6 text-blue-600" />
          価格アラート
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          アラート追加
        </button>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-8 text-gray-700">
          <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>設定されたアラートはありません</p>
          <p className="text-sm">価格が下がったときに通知を受け取りましょう</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map(alert => (
            <div key={alert.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {alert.departure} → {alert.arrival}
                    </h3>
                    {alert.airline && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {alert.airline}
                      </span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded ${
                      alert.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {alert.isActive ? '有効' : '無効'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 space-y-1">
                    <span>目標: {alert.targetMiles.toLocaleString()}マイル</span>
                    <span>現在: {alert.currentMiles.toLocaleString()}マイル</span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {alert.email}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${Math.min((alert.targetMiles / alert.currentMiles) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-800">
                        {alert.currentMiles <= alert.targetMiles ? '目標達成!' : 
                          `あと${(alert.currentMiles - alert.targetMiles).toLocaleString()}マイル`}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAlert(alert.id)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      alert.isActive 
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {alert.isActive ? '無効化' : '有効化'}
                  </button>
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* アラート追加モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">価格アラートを追加</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">出発地</label>
                <select
                  value={newAlert.departure}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, departure: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  <option value="HND">羽田空港 (HND)</option>
                  <option value="NRT">成田国際空港 (NRT)</option>
                  <option value="ITM">大阪国際空港（伊丹） (ITM)</option>
                  <option value="KIX">関西国際空港 (KIX)</option>
                  <option value="NGO">中部国際空港 (NGO)</option>
                  <option value="CTS">新千歳空港 (CTS)</option>
                  <option value="FUK">福岡空港 (FUK)</option>
                  <option value="OKA">那覇空港 (OKA)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">到着地</label>
                <select
                  value={newAlert.arrival}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, arrival: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  <option value="HND">羽田空港 (HND)</option>
                  <option value="NRT">成田国際空港 (NRT)</option>
                  <option value="ITM">大阪国際空港（伊丹） (ITM)</option>
                  <option value="KIX">関西国際空港 (KIX)</option>
                  <option value="NGO">中部国際空港 (NGO)</option>
                  <option value="CTS">新千歳空港 (CTS)</option>
                  <option value="FUK">福岡空港 (FUK)</option>
                  <option value="OKA">那覇空港 (OKA)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">航空会社</label>
                <select
                  value={newAlert.airline}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, airline: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">すべて</option>
                  <option value="ANA">ANA</option>
                  <option value="JAL">JAL</option>
                  <option value="Solaseed">ソラシド</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">目標マイル数</label>
                <input
                  type="number"
                  value={newAlert.targetMiles}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, targetMiles: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="例: 12000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">通知先メールアドレス</label>
                <input
                  type="email"
                  value={newAlert.email}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  onClose && onClose();
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={addAlert}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                追加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
