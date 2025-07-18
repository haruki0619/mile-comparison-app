import { Airport, MileProgram } from '../types';

// 地域別に整理された包括的な空港リスト
export const AIRPORTS: Airport[] = [
  // === 関東 ===
  { code: 'HND', name: '羽田空港', city: '東京', region: '関東' },
  { code: 'NRT', name: '成田国際空港', city: '東京', region: '関東' },
  { code: 'IBR', name: '茨城空港', city: '茨城', region: '関東' },

  // === 関西 ===
  { code: 'KIX', name: '関西国際空港', city: '大阪', region: '関西' },
  { code: 'ITM', name: '大阪国際空港（伊丹）', city: '大阪', region: '関西' },
  { code: 'UKB', name: '神戸空港', city: '神戸', region: '関西' },

  // === 中部 ===
  { code: 'NGO', name: '中部国際空港', city: '名古屋', region: '中部' },
  { code: 'KMQ', name: '小松空港', city: '小松', region: '中部' },
  { code: 'TOY', name: '富山空港', city: '富山', region: '中部' },
  { code: 'NTQ', name: '能登空港', city: '輪島', region: '中部' },

  // === 北海道 ===
  { code: 'CTS', name: '新千歳空港', city: '札幌', region: '北海道' },
  { code: 'AKJ', name: '旭川空港', city: '旭川', region: '北海道' },
  { code: 'HKD', name: '函館空港', city: '函館', region: '北海道' },
  { code: 'OBO', name: '帯広空港', city: '帯広', region: '北海道' },
  { code: 'KUH', name: '釧路空港', city: '釧路', region: '北海道' },
  { code: 'MMB', name: '女満別空港', city: '網走', region: '北海道' },
  { code: 'RIS', name: '利尻空港', city: '利尻', region: '北海道' },
  { code: 'SHB', name: '中標津空港', city: '中標津', region: '北海道' },
  { code: 'WKJ', name: '稚内空港', city: '稚内', region: '北海道' },

  // === 東北 ===
  { code: 'SDJ', name: '仙台国際空港', city: '仙台', region: '東北' },
  { code: 'AOJ', name: '青森空港', city: '青森', region: '東北' },
  { code: 'AXT', name: '秋田空港', city: '秋田', region: '東北' },
  { code: 'SYO', name: '庄内空港', city: '庄内', region: '東北' },
  { code: 'HNA', name: '花巻空港', city: '花巻', region: '東北' },
  { code: 'GAJ', name: '山形空港', city: '山形', region: '東北' },
  { code: 'ONJ', name: '大館能代空港', city: '大館', region: '東北' },

  // === 中国 ===
  { code: 'HIJ', name: '広島空港', city: '広島', region: '中国' },
  { code: 'UBJ', name: '宇部山口空港', city: '宇部', region: '中国' },
  { code: 'OKJ', name: '岡山桃太郎空港', city: '岡山', region: '中国' },
  { code: 'IWJ', name: '岩国錦帯橋空港', city: '岩国', region: '中国' },
  { code: 'TTJ', name: '鳥取砂丘コナン空港', city: '鳥取', region: '中国' },

  // === 四国 ===
  { code: 'TAK', name: '高松空港', city: '高松', region: '四国' },
  { code: 'KCZ', name: '高知龍馬空港', city: '高知', region: '四国' },
  { code: 'MYJ', name: '松山空港', city: '松山', region: '四国' },

  // === 九州 ===
  { code: 'FUK', name: '福岡空港', city: '福岡', region: '九州' },
  { code: 'KMJ', name: '熊本空港', city: '熊本', region: '九州' },
  { code: 'KOJ', name: '鹿児島空港', city: '鹿児島', region: '九州' },
  { code: 'OIT', name: '大分空港', city: '大分', region: '九州' },
  { code: 'NGS', name: '長崎空港', city: '長崎', region: '九州' },
  { code: 'ASJ', name: '奄美空港', city: '奄美', region: '九州' },
  { code: 'TNE', name: '種子島空港', city: '種子島', region: '九州' },

  // === 沖縄 ===
  { code: 'OKA', name: '那覇空港', city: '那覇', region: '沖縄' },
  { code: 'MMY', name: '宮古空港', city: '宮古島', region: '沖縄' },
  { code: 'ISG', name: '石垣空港', city: '石垣', region: '沖縄' },
  { code: 'AGJ', name: '粟国空港', city: '粟国', region: '沖縄' },
  { code: 'KJP', name: '久米島空港', city: '久米島', region: '沖縄' },
  { code: 'SHI', name: '下地島空港', city: '下地島', region: '沖縄' },

  // === アジア主要都市 ===
  { code: 'ICN', name: '仁川国際空港', city: 'ソウル', region: 'アジア' },
  { code: 'TPE', name: '桃園国際空港', city: '台北', region: 'アジア' },
  { code: 'BKK', name: 'スワンナプーム国際空港', city: 'バンコク', region: 'アジア' },
  { code: 'SIN', name: 'チャンギ国際空港', city: 'シンガポール', region: 'アジア' },
  { code: 'HKG', name: '香港国際空港', city: '香港', region: 'アジア' },
  { code: 'PEK', name: '北京首都国際空港', city: '北京', region: 'アジア' },
  { code: 'PVG', name: '上海浦東国際空港', city: '上海', region: 'アジア' },
  { code: 'CAN', name: '広州白雲国際空港', city: '広州', region: 'アジア' },
  { code: 'KUL', name: 'クアラルンプール国際空港', city: 'クアラルンプール', region: 'アジア' },
  { code: 'CGK', name: 'スカルノ・ハッタ国際空港', city: 'ジャカルタ', region: 'アジア' },
  { code: 'MNL', name: 'ニノイ・アキノ国際空港', city: 'マニラ', region: 'アジア' },

  // === 北米主要都市 ===
  { code: 'LAX', name: 'ロサンゼルス国際空港', city: 'ロサンゼルス', region: '北米' },
  { code: 'SFO', name: 'サンフランシスコ国際空港', city: 'サンフランシスコ', region: '北米' },
  { code: 'SEA', name: 'シアトル・タコマ国際空港', city: 'シアトル', region: '北米' },
  { code: 'LAS', name: 'マッカラン国際空港', city: 'ラスベガス', region: '北米' },
  { code: 'PHX', name: 'フェニックス・スカイハーバー国際空港', city: 'フェニックス', region: '北米' },
  { code: 'DEN', name: 'デンバー国際空港', city: 'デンバー', region: '北米' },
  { code: 'DFW', name: 'ダラス・フォートワース国際空港', city: 'ダラス', region: '北米' },
  { code: 'ORD', name: 'オヘア国際空港', city: 'シカゴ', region: '北米' },
  { code: 'JFK', name: 'ジョン・F・ケネディ国際空港', city: 'ニューヨーク', region: '北米' },
  { code: 'LGA', name: 'ラガーディア空港', city: 'ニューヨーク', region: '北米' },
  { code: 'EWR', name: 'ニューアーク・リバティー国際空港', city: 'ニューヨーク', region: '北米' },
  { code: 'IAD', name: 'ワシントン・ダレス国際空港', city: 'ワシントンD.C.', region: '北米' },
  { code: 'BOS', name: 'ボストン・ローガン国際空港', city: 'ボストン', region: '北米' },
  { code: 'MIA', name: 'マイアミ国際空港', city: 'マイアミ', region: '北米' },

  // === ヨーロッパ主要都市 ===
  { code: 'LHR', name: 'ヒースロー空港', city: 'ロンドン', region: 'ヨーロッパ' },
  { code: 'LGW', name: 'ガトウィック空港', city: 'ロンドン', region: 'ヨーロッパ' },
  { code: 'CDG', name: 'シャルル・ド・ゴール空港', city: 'パリ', region: 'ヨーロッパ' },
  { code: 'ORY', name: 'オルリー空港', city: 'パリ', region: 'ヨーロッパ' },
  { code: 'FRA', name: 'フランクフルト空港', city: 'フランクフルト', region: 'ヨーロッパ' },
  { code: 'MUC', name: 'ミュンヘン空港', city: 'ミュンヘン', region: 'ヨーロッパ' },
  { code: 'AMS', name: 'アムステルダム・スキポール空港', city: 'アムステルダム', region: 'ヨーロッパ' },
  { code: 'FCO', name: 'フィウミチーノ空港', city: 'ローマ', region: 'ヨーロッパ' },
  { code: 'ARN', name: 'アーランダ空港', city: 'ストックホルム', region: 'ヨーロッパ' },
  { code: 'CPH', name: 'コペンハーゲン・カストラップ空港', city: 'コペンハーゲン', region: 'ヨーロッパ' },
  { code: 'ZRH', name: 'チューリッヒ空港', city: 'チューリッヒ', region: 'ヨーロッパ' },
  { code: 'VIE', name: 'ウィーン国際空港', city: 'ウィーン', region: 'ヨーロッパ' },

  // === オセアニア ===
  { code: 'SYD', name: 'シドニー・キングスフォード・スミス空港', city: 'シドニー', region: 'オセアニア' },
  { code: 'MEL', name: 'メルボルン空港', city: 'メルボルン', region: 'オセアニア' },
  { code: 'BNE', name: 'ブリスベン空港', city: 'ブリスベン', region: 'オセアニア' },
  { code: 'AKL', name: 'オークランド空港', city: 'オークランド', region: 'オセアニア' },
  { code: 'CHC', name: 'クライストチャーチ空港', city: 'クライストチャーチ', region: 'オセアニア' },
];

// マイルプログラム定義
export const MILE_PROGRAMS: MileProgram[] = [
  { 
    name: 'ANA', 
    transferRatio: 1, 
    redemptionValue: 1.5,
    description: 'ANAマイレージクラブ'
  },
  { 
    name: 'JAL', 
    transferRatio: 1, 
    redemptionValue: 1.5,
    description: 'JALマイレージバンク'
  },
  { 
    name: 'ソラシドエア', 
    transferRatio: 1, 
    redemptionValue: 1.2,
    description: 'ソラシドエアマイレージクラブ'
  }
];

// 人数選択オプション
export const PASSENGER_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// タブタイプ
export type TabType = 'search' | 'calendar' | 'alerts' | 'calculator' | 'validator' | 'transfer' | 'casestudy';

export const TABS = [
  { id: 'search', label: '検索・比較', icon: 'Plane' },
  { id: 'calendar', label: '価格カレンダー', icon: 'Calendar' },
  { id: 'alerts', label: '価格アラート', icon: 'Bell' },
  { id: 'calculator', label: '価値計算機', icon: 'Calculator' },
  { id: 'transfer', label: '転送計算機', icon: 'ArrowRightLeft' },
  { id: 'casestudy', label: 'ケーススタディ', icon: 'BookOpen' },
  { id: 'validator', label: 'データ検証', icon: 'TestTube' }
] as const;
