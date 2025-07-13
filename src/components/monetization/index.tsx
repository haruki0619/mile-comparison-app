// 収益化コンポーネント集 - マネタイゼーション
'use client';

import { useState } from 'react';
import { ExternalLink, CreditCard, Star, Gift, TrendingUp, Shield } from 'lucide-react';

// クレジットカードアフィリエイト用の型定義
interface CreditCardOffer {
  id: string;
  cardName: string;
  issuer: 'JAL' | 'ANA' | 'Amex' | 'Chase' | 'Rakuten' | 'MUFG';
  signupBonus: number;
  annualFee: number;
  mileEarnRate: number;
  affiliateLink: string;
  commission: number;
  targetAirlines: string[];
  features: string[];
  rating: number; // 1-5
  imageUrl?: string;
}

interface BookingProvider {
  provider: 'Expedia' | '楽天トラベル' | 'Booking.com' | 'Skyscanner' | 'Kiwi.com';
  affiliateId: string;
  commission: string;
  deepLink: string;
  logoUrl?: string;
  trustScore: number; // 1-5
}

// 1. クレジットカード推奨コンポーネント
export const CreditCardRecommendation = ({ 
  targetAirlines = ['JAL', 'ANA'], 
  userProfile 
}: {
  targetAirlines: string[];
  userProfile?: any;
}) => {
  const creditCardOffers: CreditCardOffer[] = [
    {
      id: 'jal-club-a',
      cardName: 'JALカード CLUB-Aゴールドカード',
      issuer: 'JAL',
      signupBonus: 5000,
      annualFee: 17600,
      mileEarnRate: 1.0,
      affiliateLink: 'https://affiliate.jal.co.jp/card-gold?ref=mile-compass',
      commission: 12000,
      targetAirlines: ['JAL'],
      features: ['ラウンジアクセス', 'マイル期限延長', '海外旅行保険'],
      rating: 4.5
    },
    {
      id: 'ana-amex-gold',
      cardName: 'ANAアメリカン・エキスプレス・ゴールド・カード',
      issuer: 'ANA',
      signupBonus: 10000,
      annualFee: 34100,
      mileEarnRate: 1.0,
      affiliateLink: 'https://affiliate.ana.co.jp/amex-gold?ref=mile-compass',
      commission: 15000,
      targetAirlines: ['ANA'],
      features: ['継続ボーナス', 'フライトボーナス25%', 'ラウンジアクセス'],
      rating: 4.7
    },
    {
      id: 'spg-amex',
      cardName: 'スターウッド プリファード ゲスト アメリカン・エキスプレス・カード',
      issuer: 'Amex',
      signupBonus: 30000,
      annualFee: 34100,
      mileEarnRate: 1.25,
      affiliateLink: 'https://affiliate.amex.co.jp/spg?ref=mile-compass',
      commission: 18000,
      targetAirlines: ['JAL', 'ANA', 'UA', 'Delta', 'AA'],
      features: ['ホテル上級会員', '毎年無料宿泊', 'マイル交換25%ボーナス'],
      rating: 4.8
    }
  ];

  const recommendedCards = creditCardOffers.filter(card => 
    card.targetAirlines.some(airline => targetAirlines.includes(airline))
  ).slice(0, 3);

  const trackCardClick = (cardId: string) => {
    // Google Analytics またはカスタム追跡
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'affiliate_click', {
        event_category: 'Credit Card',
        event_label: cardId,
        value: creditCardOffers.find(c => c.id === cardId)?.commission || 0
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-xl mt-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
          <CreditCard className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">
          💳 このルートでもっとお得にマイルを貯めるなら
        </h3>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        {recommendedCards.map(card => (
          <div key={card.id} className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">{card.cardName}</h4>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3 h-3 ${i < Math.floor(card.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="text-xs text-gray-600 ml-1">{card.rating}</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full">
                限定特典
              </div>
            </div>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">入会ボーナス</span>
                <span className="font-semibold text-green-600">{card.signupBonus.toLocaleString()}マイル</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">還元率</span>
                <span className="font-semibold">{card.mileEarnRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">年会費</span>
                <span className="font-semibold">¥{card.annualFee.toLocaleString()}</span>
              </div>
            </div>

            <div className="mb-4">
              <h5 className="text-xs font-medium text-gray-700 mb-2">主要特典</h5>
              <div className="space-y-1">
                {card.features.slice(0, 2).map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                    <Shield className="w-3 h-3 text-green-500" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            <a
              href={card.affiliateLink}
              target="_blank"
              rel="nofollow noopener"
              onClick={() => trackCardClick(card.id)}
              className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-center py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Gift className="w-4 h-4" />
              詳細・申込み
            </a>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          ※ アフィリエイトリンクです。お客様に追加料金は発生しません。
        </p>
      </div>
    </div>
  );
};

// 2. 航空券予約アフィリエイトボタン
export const BookingAffiliateButtons = ({ 
  flightData 
}: { 
  flightData?: any 
}) => {
  const bookingProviders: BookingProvider[] = [
    {
      provider: 'Expedia',
      affiliateId: 'EXPEDIA_PARTNER_ID',
      commission: '3-7%',
      deepLink: `https://expedia.com/flights?affiliate=mile-compass&route=${flightData?.route}`,
      trustScore: 4.5
    },
    {
      provider: '楽天トラベル',
      affiliateId: 'RAKUTEN_AFFILIATE_ID',
      commission: '1%',
      deepLink: `https://travel.rakuten.co.jp/airline/?affiliate=mile-compass`,
      trustScore: 4.2
    },
    {
      provider: 'Skyscanner',
      affiliateId: 'SKYSCANNER_PARTNER_ID',
      commission: 'CPC',
      deepLink: `https://skyscanner.jp/flights?affiliate=mile-compass`,
      trustScore: 4.7
    }
  ];

  const trackBookingClick = (provider: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'affiliate_click', {
        event_category: 'Flight Booking',
        event_label: provider
      });
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 mt-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-green-600" />
        <h4 className="font-bold text-gray-800">この便を予約する</h4>
      </div>
      
      <div className="grid md:grid-cols-3 gap-3">
        {bookingProviders.map(provider => (
          <a
            key={provider.provider}
            href={provider.deepLink}
            target="_blank"
            rel="nofollow noopener"
            onClick={() => trackBookingClick(provider.provider)}
            className="group bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white p-4 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-3"
          >
            <ExternalLink className="w-4 h-4" />
            <div className="text-center">
              <div className="font-semibold">{provider.provider}</div>
              <div className="text-xs opacity-90">
                信頼度: {provider.trustScore}/5
              </div>
            </div>
          </a>
        ))}
      </div>
      
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-500">
          各サイトの最新価格をご確認ください。価格は変動する場合があります。
        </p>
      </div>
    </div>
  );
};

// 3. プレミアム機能アップセル
export const PremiumFeatureUpsell = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 mt-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="text-center">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Star className="w-8 h-8" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          🚀 プレミアム会員になって、さらにお得に！
        </h3>
        
        <p className="text-gray-600 mb-4">
          無制限価格アラート、高度な分析機能、広告非表示で快適な検索体験を
        </p>
        
        <div className="grid md:grid-cols-3 gap-4 mb-6 text-sm">
          <div className="bg-white p-3 rounded-lg">
            <div className="font-semibold text-purple-600">無制限アラート</div>
            <div className="text-gray-600">価格変動を見逃さない</div>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <div className="font-semibold text-purple-600">高度な分析</div>
            <div className="text-gray-600">マイル価値の推移分析</div>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <div className="font-semibold text-purple-600">広告非表示</div>
            <div className="text-gray-600">クリーンな検索体験</div>
          </div>
        </div>
        
        <div className="flex justify-center gap-4">
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-bold transition-all transform hover:scale-105">
            月額¥980で始める
          </button>
          <button className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-3 rounded-lg font-bold transition-all">
            14日間無料トライアル
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-3">
          いつでもキャンセル可能 | 30日間返金保証
        </p>
      </div>
    </div>
  );
};

// 4. ASP管理・収益追跡フック
export const useAffiliateTracking = () => {
  const trackConversion = (type: 'credit_card' | 'flight_booking' | 'premium_signup', data: any) => {
    // Google Analytics 4 イベント送信
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        event_category: type,
        event_label: data.provider || data.cardId,
        value: data.commission || data.price,
        currency: 'JPY'
      });
    }
    
    // カスタム収益追跡（自社システム）
    fetch('/api/track-conversion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        data,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
      })
    }).catch(console.error);
  };

  return { trackConversion };
};

export default {
  CreditCardRecommendation,
  BookingAffiliateButtons,
  PremiumFeatureUpsell,
  useAffiliateTracking
};
