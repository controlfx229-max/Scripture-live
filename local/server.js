import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { getPassage, configured } from '../lib/passage.js';

const KEY = process.env.DEEPGRAM_API_KEY;
const PORT = process.env.PORT || 3000;
// Words Deepgram should listen out for (Nova-3 "keyterm" boosting)
const TERMS = ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "Samuel", "Kings", "Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi", "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "Thessalonians", "Timothy", "Titus", "Philemon", "Hebrews", "James", "Peter", "Jude", "Revelation", "chapter", "verse", "next verse", "previous verse"];

const app = express();
app.use(express.static('public'));
app.get('/api/health', (_req, res) => res.json({ deepgram: !!KEY, online: configured() }));
app.get('/api/passage', async (req, res) => {
  const { v, b, c, s, e } = req.query;
  try { res.json(await getPassage(v, b, c, s, e)); } catch (err) { res.status(502).json({ error: err.message }); }
});

const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/stt' });

wss.on('connection', (client, req) => {
  const send = (o) => client.readyState === 1 && client.send(JSON.stringify(o));
  if (!KEY) { send({ type: 'ProxyError', message: 'DEEPGRAM_API_KEY missing in .env' }); return client.close(); }
  const lang = new URL(req.url, 'http://x').searchParams.get('lang') || 'en';
  const q = new URLSearchParams({
    model: 'nova-3', language: lang, interim_results: 'true', endpointing: '300',
    punctuate: 'false', smart_format: 'false', numerals: 'false',
  });
  TERMS.forEach((t) => q.append('keyterm', t));
  const dg = new WebSocket('wss://api.deepgram.com/v1/listen?' + q, { headers: { Authorization: 'Token ' + KEY } });
  const pending = [];
  dg.on('open', () => { pending.forEach((m) => dg.send(m)); pending.length = 0; });
  client.on('message', (m, isBinary) => (dg.readyState === 1 ? dg.send(m, { binary: isBinary }) : pending.push(m)));
  dg.on('message', (m) => client.readyState === 1 && client.send(m.toString()));
  dg.on('unexpected-response', (_r, res) => { send({ type: 'ProxyError', message: 'Deepgram refused the connection (HTTP ' + res.statusCode + '). Check your API key.' }); client.close(); });
  dg.on('error', (e) => { send({ type: 'ProxyError', message: e.message }); client.close(); });
  dg.on('close', () => client.close());
  const ka = setInterval(() => dg.readyState === 1 && dg.send(JSON.stringify({ type: 'KeepAlive' })), 8000);
  client.on('close', () => { clearInterval(ka); dg.close(); });
});

server.listen(PORT, () => console.log('Scripture Live running → http://localhost:' + PORT));
