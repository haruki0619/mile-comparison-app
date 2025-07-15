// 🚀 Next.js API Route for Real API Integration
// pages/api/flights/search.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { AmadeusClient } from '../../../src/services/apiClients/amadeusClient';
import { RakutenTravelClient } from '../../../src/services/apiClients/rakutenClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { departure, arrival, date, passengers } = req.body;

    // 環境変数からAPI認証情報を取得
    const amadeusClient = new AmadeusClient(
      process.env.AMADEUS_CLIENT_ID!,
      process.env.AMADEUS_CLIENT_SECRET!
    );

    const rakutenClient = new RakutenTravelClient(
      process.env.RAKUTEN_APP_ID!,
      process.env.RAKUTEN_APP_SECRET!,
      process.env.RAKUTEN_AFFILIATE_ID!
    );

    // 並行してAPIを呼び出し
    const [amadeusResults, rakutenResults] = await Promise.allSettled([
      amadeusClient.searchFlights({
        originLocationCode: departure,
        destinationLocationCode: arrival,
        departureDate: date,
        adults: passengers,
        currencyCode: 'JPY'
      }),
      rakutenClient.search({
        route: { departure, arrival },
        date,
        passengers,
        cabinClass: 'economy'
      })
    ]);

    // 結果をマージして返す
    const flights = [];
    
    if (amadeusResults.status === 'fulfilled') {
      flights.push(...amadeusResults.value.data);
    }
    
    if (rakutenResults.status === 'fulfilled') {
      flights.push(...rakutenResults.value.data);
    }

    res.status(200).json({
      success: true,
      data: flights,
      sources: ['amadeus', 'rakuten'],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('API Route Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
