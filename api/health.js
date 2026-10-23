import { configured } from '../lib/passage.js';
export default function handler(_req, res) {
  res.json({ deepgram: !!process.env.DEEPGRAM_API_KEY, mode: 'token', online: configured() });
}
