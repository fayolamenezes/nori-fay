let latestReading = null;

export default function handler(req, res) {
  // Allow ESP32 to POST data
  if (req.method === 'POST') {
    latestReading = {
      ...req.body,
      timestamp: new Date().toISOString()
    };
    return res.status(200).json({ ok: true });
  }

  // Dashboard fetches latest reading
  if (req.method === 'GET') {
    if (!latestReading) {
      return res.status(200).json(null);
    }
    return res.status(200).json(latestReading);
  }

  res.status(405).json({ error: 'Method not allowed' });
}