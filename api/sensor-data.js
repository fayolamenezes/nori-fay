import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ESP32 posts sensor data here
  if (req.method === 'POST') {
    const reading = {
      ...req.body,
      timestamp: new Date().toISOString(),
    };
    await redis.set('latest_reading', JSON.stringify(reading));
    return res.status(200).json({ ok: true });
  }

  // Dashboard fetches latest reading
  if (req.method === 'GET') {
    const raw = await redis.get('latest_reading');
    const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return res.status(200).json(data ?? null);
  }

  res.status(405).json({ error: 'Method not allowed' });
}