// 航空会社別のマイルチャート型定義
import { MileOption, CabinClassMiles } from './core';

// すべての航空会社型をエクスポート
export type AirlineCode = 'ANA' | 'JAL' | 'UA' | 'AA' | 'DL' | 'LH' | 'BA' | 'AF' | 'SQ' | 'CX' | 'TG' | 'QR' | 'EK';

// ユニオン型で全航空会社のマイルチャートを統合
export type AnyAirlineMileChart = 
  | ANAMileChart
  | JALMileChart
  | UnitedMileChart
  | AmericanMileChart
  | DeltaMileChart
  | LufthansaMileChart
  | BritishAirwaysMileChart
  | AirFranceMileChart
  | SingaporeMileChart
  | CathayMileChart
  | ThaiMileChart
  | QatarMileChart
  | EmiratesMileChart;

// 航空会社コードから型を取得するヘルパー型
export type AirlineMileChartByCode<T extends AirlineCode> = 
  T extends 'ANA' ? ANAMileChart :
  T extends 'JAL' ? JALMileChart :
  T extends 'UA' ? UnitedMileChart :
  T extends 'AA' ? AmericanMileChart :
  T extends 'DL' ? DeltaMileChart :
  T extends 'LH' ? LufthansaMileChart :
  T extends 'BA' ? BritishAirwaysMileChart :
  T extends 'AF' ? AirFranceMileChart :
  T extends 'SQ' ? SingaporeMileChart :
  T extends 'CX' ? CathayMileChart :
  T extends 'TG' ? ThaiMileChart :
  T extends 'QR' ? QatarMileChart :
  T extends 'EK' ? EmiratesMileChart :
  never;

// ANA（全日空）のマイルチャート型
export interface ANAMileChart {
  alliance: 'StarAlliance';
  program: 'ANAMileageClub';
  currency: 'JPY';
  
  // 国内線（距離帯別）
  domestic: {
    zone1: MileOption; // 0-300マイル（区間1）
    zone2: MileOption; // 301-600マイル（区間2）
    zone3: MileOption; // 601-1000マイル（区間3）
    zone4: MileOption; // 1001-2000マイル（区間4）
    zone5: MileOption; // 2001マイル以上（区間5）
  };
  
  // 国際線（地域別）
  international: {
    asia: CabinClassMiles;
    north_america: CabinClassMiles;
    europe: CabinClassMiles;
    oceania: CabinClassMiles;
    africa: CabinClassMiles;
    south_america: CabinClassMiles;
  };
  
  // ANAの特徴的なシステム
  specialAwards: {
    oneWay: boolean; // 片道特典
    mixedCabin: boolean; // ミックスクラス
    upgradeAwards: boolean; // アップグレード特典
  };
  
  seasonalPricing: boolean; // シーズン価格変動
  partnerBooking: {
    advance: number; // 予約開始日数
    waitlist: boolean; // キャンセル待ち
  };
  
  // 燃油サーチャージ
  fuelSurcharge: {
    domestic: number;
    international: boolean; // 路線により変動
  };
}

// JAL（日本航空）のマイルチャート型
export interface JALMileChart {
  alliance: 'OneWorld';
  program: 'JALMileageBank';
  currency: 'JPY';
  
  // 国内線（距離帯別）
  domestic: {
    zone1: MileOption; // 0-600マイル（ゾーンA）
    zone2: MileOption; // 601-1200マイル（ゾーンB） 
    zone3: MileOption; // 1201-2000マイル（ゾーンC）
    zone4: MileOption; // 2001マイル以上（ゾーンD）
  };
  
  // 国際線（地域別）
  international: {
    asia: CabinClassMiles;
    north_america: CabinClassMiles;
    europe: CabinClassMiles;
    oceania: CabinClassMiles;
    africa: CabinClassMiles;
    south_america: CabinClassMiles;
  };
  
  // JALの特徴的なシステム
  specialFeatures: {
    discountMileage: boolean; // ディスカウントマイル
    plusOne: boolean; // PLUS ONEサービス
    anywhereButJapan: boolean; // Japan発以外の特典
  };
  
  // どこかにマイル
  mysteryDestination: {
    available: boolean;
    discount: number; // 割引率
    destinations: number; // 候補地数
  };
  
  seasonalVariation: boolean;
  advanceBooking: number; // 予約開始日数
}

// 世界主要マイレージプログラムの型定義
export interface GlobalMileChart {
  // 日本系
  ANA: ANAMileChart;
  JAL: JALMileChart;
  
  // アメリカ系
  UA: UnitedMileChart;
  AA: AmericanMileChart;
  DL: DeltaMileChart;
  
  // ヨーロッパ系
  LH: LufthansaMileChart;
  BA: BritishAirwaysMileChart;
  AF: AirFranceMileChart;
  
  // アジア系
  SQ: SingaporeMileChart;
  CX: CathayMileChart;
  TG: ThaiMileChart;
  
  // 中東系
  QR: QatarMileChart;
  EK: EmiratesMileChart;
}

// ユナイテッド航空のマイルチャート
export interface UnitedMileChart {
  alliance: 'StarAlliance';
  partners: string[];
  currency: 'USD';
  
  domestic: {
    short: MileOption;  // 700マイル以下
    medium: MileOption; // 701-2100マイル
    long: MileOption;   // 2101マイル以上
  };
  
  international: {
    asia: CabinClassMiles;
    europe: CabinClassMiles;
    oceania: CabinClassMiles;
    africa: CabinClassMiles;
    south_america: CabinClassMiles;
  };
  
  // UAの特徴的なシステム
  dynamicPricing: boolean;
  excursionist: boolean; // エクスカーショニスト特典
  openJaw: boolean;      // オープンジョー対応
  stopovers: number;     // ストップオーバー可能数
}

// アメリカン航空の特徴
export interface AmericanMileChart {
  alliance: 'OneWorld';
  partners: string[];
  
  // AAの特徴的システム
  webSpecial: {
    discount: number; // ウェブスペシャル割引率
    availability: string[];
  };
  
  offPeak: {
    discount: number;
    months: string[];
  };
  
  peak: {
    surcharge: number;
    months: string[];
  };
  
  // 動的価格制導入
  dynamicPricing: boolean;
  milesOrPoints: boolean; // マイル+ポイント併用可能
}

// シンガポール航空の特徴
export interface SingaporeMileChart {
  alliance: 'StarAlliance';
  program: 'KrisFlyer';
  
  // SQの特徴的システム
  spontaneousEscapes: {
    discount: number; // 直前割引率
    bookingWindow: number; // 予約可能期間（日前）
  };
  
  advantageAwards: {
    premiumCabinDiscount: number;
    eligibility: string[];
  };
  
  // プリファードシート
  preferredSeats: boolean;
  waitlist: boolean;
}

// デルタ航空の特徴
export interface DeltaMileChart {
  alliance: 'SkyTeam';
  program: 'SkyMiles';
  currency: 'USD';
  
  // デルタの完全動的価格制
  dynamicPricing: {
    enabled: true;
    priceRange: {
      min: number;
      max: number;
    };
    demandBased: boolean;
  };
  
  // パートナー航空会社
  partners: {
    skyTeam: string[];
    others: string[];
  };
  
  // デルタの特徴的サービス
  payWithMiles: {
    enabled: boolean;
    ratio: number; // 1セント当たりのマイル数
  };
  
  upgrades: {
    complimentary: boolean;
    mileUpgrades: boolean;
    cashAndMiles: boolean;
  };
  
  flexibleBooking: boolean;
  noBlackoutDates: boolean;
}

// ルフトハンザの特徴
export interface LufthansaMileChart {
  alliance: 'StarAlliance';
  program: 'MilesAndMore';
  currency: 'EUR';
  
  // 地域別マイルチャート
  regions: {
    europe: CabinClassMiles;
    intercontinental: CabinClassMiles;
    domestic_germany: CabinClassMiles;
  };
  
  // ルフトハンザの特徴的システム
  milesBargains: {
    discount: number; // 特価特典の割引率
    availability: string[];
  };
  
  // ヨーロッパ内特典の特徴
  europeFeatures: {
    flexibleDates: boolean;
    openJaw: boolean;
    multiCity: boolean;
  };
  
  partnerAccess: {
    starAlliance: boolean;
    others: string[];
  };
  
  seasonalPricing: boolean;
}

// ブリティッシュエアウェイズの特徴
export interface BritishAirwaysMileChart {
  alliance: 'OneWorld';
  program: 'ExecutiveClub';
  currency: 'GBP';
  
  // BAの距離ベース価格制
  distanceBased: {
    enabled: true;
    bands: {
      band1: { maxMiles: 650, miles: MileOption };
      band2: { maxMiles: 1151, miles: MileOption };
      band3: { maxMiles: 2000, miles: MileOption };
      band4: { maxMiles: 3000, miles: MileOption };
      band5: { maxMiles: 4000, miles: MileOption };
      band6: { maxMiles: 5500, miles: MileOption };
      band7: { maxMiles: 6500, miles: MileOption };
      band8: { maxMiles: 7000, miles: MileOption };
      band9: { maxMiles: 999999, miles: MileOption };
    };
  };
  
  // BAの特徴的サービス
  peakOffPeak: {
    enabled: boolean;
    peakSurcharge: number;
    offPeakDiscount: number;
  };
  
  householdAccount: boolean;
  upgradeVouchers: boolean;
  flexibleBooking: boolean;
}

// カタール航空の特徴
export interface QatarMileChart {
  alliance: 'OneWorld';
  program: 'PrivilegeClub';
  currency: 'USD';
  
  // 地域別チャート
  regional: {
    middle_east: CabinClassMiles;
    asia: CabinClassMiles;
    europe: CabinClassMiles;
    africa: CabinClassMiles;
    north_america: CabinClassMiles;
    south_america: CabinClassMiles;
    oceania: CabinClassMiles;
  };
  
  // カタールの特徴的サービス
  qsuites: {
    available: boolean;
    premium: boolean;
  };
  
  stopoverProgram: {
    doha: boolean;
    complimentary: boolean;
  };
  
  flexibleDates: boolean;
  familyTransfers: boolean;
}

// エミレーツ航空の特徴
export interface EmiratesMileChart {
  alliance: 'none'; // 独立系
  program: 'Skywards';
  currency: 'USD';
  
  // エミレーツの特徴的な地域区分
  regions: {
    within_middle_east: CabinClassMiles;
    middle_east_to_europe: CabinClassMiles;
    middle_east_to_asia: CabinClassMiles;
    middle_east_to_africa: CabinClassMiles;
    middle_east_to_americas: CabinClassMiles;
    middle_east_to_oceania: CabinClassMiles;
    intercontinental: CabinClassMiles;
  };
  
  // エミレーツの特徴的サービス
  flexRewards: {
    enabled: boolean;
    discount: number; // Cash+Milesの割引
  };
  
  upgradeRewards: {
    bidding: boolean;
    miles: boolean;
  };
  
  stopoverDubai: {
    complimentary: boolean;
    hotel: boolean;
  };
  
  familyPooling: boolean;
  noExpiry: boolean; // マイル有効期限なし（条件付き）
}

// キャセイパシフィック航空の特徴
export interface CathayMileChart {
  alliance: 'OneWorld';
  program: 'AsiaMiles';
  currency: 'HKD';
  
  // 地域別マイルチャート
  regions: {
    asia_1: CabinClassMiles; // 短距離アジア
    asia_2: CabinClassMiles; // 中距離アジア
    north_america: CabinClassMiles;
    europe: CabinClassMiles;
    south_west_pacific: CabinClassMiles;
    africa_middle_east: CabinClassMiles;
  };
  
  // キャセイの特徴的サービス
  payWithMiles: {
    enabled: boolean;
    flexibleDates: boolean;
    noBlackout: boolean;
  };
  
  asiaMilesExpiry: {
    years: number;
    activityExtension: boolean;
  };
  
  familyTransfer: {
    enabled: boolean;
    relationships: string[];
  };
  
  stopoverHongKong: boolean;
  openJaw: boolean;
}

// タイ国際航空の特徴
export interface ThaiMileChart {
  alliance: 'StarAlliance';
  program: 'RoyalOrchidPlus';
  currency: 'THB';
  
  // 地域別マイルチャート
  regions: {
    domestic_thailand: CabinClassMiles;
    southeast_asia: CabinClassMiles;
    northeast_asia: CabinClassMiles;
    south_asia: CabinClassMiles;
    europe: CabinClassMiles;
    north_america: CabinClassMiles;
    oceania: CabinClassMiles;
  };
  
  // タイ航空の特徴的サービス
  royalOrchidPlus: {
    familyPooling: boolean;
    mileTransfer: boolean;
    statusMatch: boolean;
  };
  
  // バンコク経由の特典
  bangkokStopover: {
    complimentary: boolean;
    extendedStay: boolean;
  };
  
  // 東南アジア特化の特典
  asianTravel: {
    multiDestination: boolean;
    flexibleRouting: boolean;
  };
  
  seasonalVariation: boolean;
}

// エールフランスの特徴
export interface AirFranceMileChart {
  alliance: 'SkyTeam';
  program: 'FlyingBlue';
  currency: 'EUR';
  
  // 地域別マイルチャート
  regions: {
    europe: CabinClassMiles;
    north_africa_middle_east: CabinClassMiles;
    sub_saharan_africa: CabinClassMiles;
    north_america: CabinClassMiles;
    south_america: CabinClassMiles;
    asia_oceania: CabinClassMiles;
    caribbean_indian_ocean: CabinClassMiles;
  };
  
  // エールフランス・KLMの特徴的サービス
  flyingBlue: {
    monthlyPromos: boolean; // 月替わりプロモ
    flexibleDates: boolean;
    noBlackout: boolean;
  };
  
  // ヨーロッパ系の特徴
  europeanFeatures: {
    shortHaul: {
      enabled: boolean;
      milesRequired: number;
    };
    flexibleTickets: boolean;
  };
  
  partnerNetwork: {
    skyTeam: boolean;
    airFranceKlm: boolean;
    others: string[];
  };
  
  experienceRewards: boolean; // 体験型特典
}
