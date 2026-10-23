import { getPassage } from '../lib/passage.js';
export default async function handler(req, res) {
  const { v, b, c, s, e } = req.query;
  try { res.setHeader('Cache-Control', 'no-store'); res.json(await getPassage(v, b, c, s, e)); }
  catch (err) { res.status(502).json({ error: err.message }); }
}
