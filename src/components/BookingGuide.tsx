'use client';

import { useState } from 'react';
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  ExternalLink, 
  Info, 
  Clock,
  Calendar,
  CreditCard,
  Phone,
  Globe
} from 'lucide-react';

interface BookingStep {
  id: string;
  title: string;
  description: string;
  time: string;
  url?: string;
  tips: string[];
  completed: boolean;
}

interface BookingGuideProps {
  airline: string;
  bookingType: 'alliance' | 'direct' | 'partner';
  onStepComplete?: (stepId: string) => void;
}

export default function BookingGuide({ airline, bookingType, onStepComplete }: BookingGuideProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const generateSteps = (): BookingStep[] => {
    switch (bookingType) {
      case 'alliance':
        return [
          {
            id: 'search_availability',
            title: 'ワンワールド特典航空券の空席確認',
            description: 'JAL公式サイトでワンワールド特典航空券の空席を検索',
            time: '5-10分',
            url: 'https://www.jal.co.jp/jalmile/use/jal/dom_int/oneworld/',
            tips: [
              '複数の日程で検索してみる',
              '早朝・深夜便も確認',
              'ビジネスクラスの空席状況もチェック'
            ],
            completed: completedSteps.has('search_availability')
          },
          {
            id: 'prepare_account',
            title: 'JMB会員情報の確認',
            description: 'マイレージバンク会員番号とパスワードを準備',
            time: '2-3分',
            tips: [
              'マイル残高を事前確認',
              'クレジットカード情報も準備',
              'パスポート情報を手元に用意'
            ],
            completed: completedSteps.has('prepare_account')
          },
          {
            id: 'book_ticket',
            title: '特典航空券の予約',
            description: 'ワンワールド特典航空券として予約手続き',
            time: '10-15分',
            tips: [
              '途中でタイムアウトしないよう注意',
              '座席指定も同時に行う',
              '予約後は必ず確認メールを保存'
            ],
            completed: completedSteps.has('book_ticket')
          },
          {
            id: 'payment',
            title: '諸費用の支払い',
            description: '税金・サーチャージ等の現金部分を決済',
            time: '3-5分',
            tips: [
              'クレジットカード決済推奨',
              '領収書は必ず保存',
              '支払い完了メールを確認'
            ],
            completed: completedSteps.has('payment')
          },
          {
            id: 'confirmation',
            title: '予約確認・チェックイン準備',
            description: 'Eチケットの確認とチェックイン手続きの準備',
            time: '5分',
            tips: [
              'Eチケット番号をメモ',
              'JALアプリで予約確認',
              '24時間前からのオンラインチェックイン準備'
            ],
            completed: completedSteps.has('confirmation')
          }
        ];

      case 'partner':
        return [
          {
            id: 'check_partner',
            title: '提携航空会社の確認',
            description: 'JMB提携航空会社での特典航空券利用条件確認',
            time: '5分',
            tips: [
              'マイル交換レートを確認',
              '提携会社の予約サイトをチェック',
              '必要マイル数の最終確認'
            ],
            completed: completedSteps.has('check_partner')
          },
          {
            id: 'reserve_partner',
            title: '提携会社サイトで予約',
            description: '提携航空会社の公式サイトまたは電話で予約',
            time: '15-20分',
            url: 'https://www.jal.co.jp/jalmile/use/partner/',
            tips: [
              '電話予約の場合は待ち時間を考慮',
              'JMB会員番号を手元に準備',
              '予約クラスの制限に注意'
            ],
            completed: completedSteps.has('reserve_partner')
          },
          {
            id: 'mile_transfer',
            title: 'マイルの交換手続き',
            description: 'JALマイルから提携会社マイルへの交換申請',
            time: '10分',
            tips: [
              '交換には数日かかる場合がある',
              '交換手数料の確認',
              '交換完了通知メールを保存'
            ],
            completed: completedSteps.has('mile_transfer')
          },
          {
            id: 'final_booking',
            title: '最終予約確定',
            description: 'マイル交換完了後の最終予約確定手続き',
            time: '5-10分',
            tips: [
              '交換されたマイルの反映確認',
              'Eチケットの発行確認',
              '予約詳細の保存'
            ],
            completed: completedSteps.has('final_booking')
          }
        ];

      default: // direct
        return [
          {
            id: 'jal_search',
            title: 'JAL公式サイトで空席確認',
            description: 'JAL特典航空券の空席状況を確認',
            time: '5分',
            url: 'https://www.jal.co.jp/jalmile/use/jal/',
            tips: [
              '国際線特典航空券カテゴリを選択',
              '柔軟な日程で検索',
              'クラスごとの空席状況を確認'
            ],
            completed: completedSteps.has('jal_search')
          },
          {
            id: 'domestic_separate',
            title: '国内線の別途手配（必要な場合）',
            description: '米国内線等は別途現金またはマイルで予約',
            time: '15-30分',
            tips: [
              'アメリカン航空などパートナーで検索',
              '乗り継ぎ時間を十分に確保',
              '別途予約なので荷物の受け取りに注意'
            ],
            completed: completedSteps.has('domestic_separate')
          },
          {
            id: 'jal_booking',
            title: 'JAL特典航空券の予約',
            description: '国際線部分をJAL特典航空券で予約',
            time: '10-15分',
            tips: [
              '座席指定も忘れずに',
              '特別食の申し込み',
              'マイル口座の残高確認'
            ],
            completed: completedSteps.has('jal_booking')
          },
          {
            id: 'high_fees_payment',
            title: '高額諸費用の支払い',
            description: '税金・サーチャージ（約44,280円）の決済',
            time: '5分',
            tips: [
              '諸費用が高額なことを再確認',
              'マイル+現金の組み合わせ効率を検討',
              '支払い方法の選択（カード推奨）'
            ],
            completed: completedSteps.has('high_fees_payment')
          }
        ];
    }
  };

  const steps = generateSteps();
  const completionRate = (completedSteps.size / steps.length) * 100;

  const toggleStep = (stepId: string) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
      onStepComplete?.(stepId);
    }
    setCompletedSteps(newCompleted);
  };

  const getBookingTypeInfo = () => {
    switch (bookingType) {
      case 'alliance':
        return {
          title: 'ワンワールド特典航空券 予約ガイド',
          description: 'マイルと現金のバランスが最適なお得な予約方法',
          color: 'bg-green-50 border-green-200 text-green-800'
        };
      case 'partner':
        return {
          title: 'JMB提携特典航空券 予約ガイド', 
          description: '諸費用を抑えたい方におすすめの予約方法',
          color: 'bg-blue-50 border-blue-200 text-blue-800'
        };
      default:
        return {
          title: 'JAL特典航空券 予約ガイド',
          description: 'マイル数は少ないが諸費用が高い予約方法',
          color: 'bg-orange-50 border-orange-200 text-orange-800'
        };
    }
  };

  const typeInfo = getBookingTypeInfo();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className={`p-4 rounded-lg border-2 mb-6 ${typeInfo.color}`}>
        <h3 className="text-xl font-bold mb-2">{typeInfo.title}</h3>
        <p className="text-sm">{typeInfo.description}</p>
        
        <div className="mt-4 flex items-center gap-4">
          <div className="flex-1 bg-white rounded-full h-2">
            <div 
              className="bg-current h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <span className="text-sm font-medium">
            {Math.round(completionRate)}% 完了
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`border rounded-lg p-4 transition-all ${
              step.completed 
                ? 'border-green-300 bg-green-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-4">
              <button
                onClick={() => toggleStep(step.id)}
                className="mt-1 flex-shrink-0"
              >
                {step.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
              </button>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                    ステップ {index + 1}
                  </span>
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <Clock className="w-3 h-3" />
                    {step.time}
                  </div>
                </div>

                <h4 className="font-semibold text-gray-800 mb-2">{step.title}</h4>
                <p className="text-gray-600 text-sm mb-3">{step.description}</p>

                {step.url && (
                  <a
                    href={step.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors mb-3"
                  >
                    <Globe className="w-3 h-3" />
                    公式サイトを開く
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                <div className="space-y-1">
                  {step.tips.map((tip, tipIndex) => (
                    <div key={tipIndex} className="flex items-start gap-2 text-xs text-gray-600">
                      <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="text-sm text-yellow-800">
              <strong>💡 重要なお知らせ:</strong> 
              特典航空券の予約は在庫状況により確保できない場合があります。
              また、マイルの有効期限やキャンセル規定もご確認ください。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
