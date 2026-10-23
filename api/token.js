// Vercel function: gives the browser a short-lived Deepgram token (the real key never leaves the server).
// The key needs at least "Member" permission in the Deepgram console.
export default async function handler(_req, res) {
  const KEY = process.env.DEEPGRAM_API_KEY;
  if (!KEY) return res.status(500).json({ error: 'DEEPGRAM_API_KEY is not set' });
  try {
    const r = await fetch('https://api.deepgram.com/v1/auth/grant', {
      method: 'POST',
      headers: { Authorization: 'Token ' + KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ttl_seconds: 30 }),
    });
    const d = await r.json();
    if (!r.ok) return res.status(502).json({ error: d.err_msg || 'Deepgram refused – the key needs Member permission' });
    res.setHeader('Cache-Control', 'no-store');
    res.json({ token: d.access_token });
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
}
