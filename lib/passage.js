// Fetches licensed translations (ESV, and NIV/NKJV/NLT etc. through API.Bible) on demand.
// Keys stay on the server. Nothing is stored on disk.
const USFM = ['GEN','EXO','LEV','NUM','DEU','JOS','JDG','RUT','1SA','2SA','1KI','2KI','1CH','2CH','EZR','NEH','EST','JOB','PSA','PRO','ECC','SNG','ISA','JER','LAM','EZK','DAN','HOS','JOL','AMO','OBA','JON','MIC','NAM','HAB','ZEP','HAG','ZEC','MAL','MAT','MRK','LUK','JHN','ACT','ROM','1CO','2CO','GAL','EPH','PHP','COL','1TH','2TH','1TI','2TI','TIT','PHM','HEB','JAS','1PE','2PE','1JN','2JN','3JN','JUD','REV'];
const NAMES = ['Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi','Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation'];

// APIBIBLE_VERSIONS="NIV:<bibleId>,NKJV:<bibleId>"
const abIds = () => Object.fromEntries((process.env.APIBIBLE_VERSIONS || '').split(',').filter((x) => x.includes(':')).map((x) => { const [n, id] = x.split(':'); return [n.trim().toUpperCase(), id.trim()]; }));

export function configured() {
  const o = [];
  if (process.env.ESV_API_KEY) o.push('ESV');
  if (process.env.APIBIBLE_KEY) o.push(...Object.keys(abIds()));
  return o;
}

const cache = new Map();
const clean = (t) => String(t || '').replace(/[¶\u00b6]/g, ' ').replace(/\s+/g, ' ').trim();

export async function getPassage(v, b, c, s, e) {
  v = String(v).toUpperCase(); b = +b; c = +c; s = +s; e = +e || s;
  if (!(b >= 0 && b < 66 && c >= 1 && s >= 1 && e >= s && e - s < 40)) throw new Error('bad reference');
  const key = [v, b, c, s, e].join('.');
  if (cache.has(key)) return cache.get(key);
  let out;
  if (v === 'ESV' && process.env.ESV_API_KEY) {
    const q = `${NAMES[b]} ${c}:${s}` + (e > s ? `-${e}` : '');
    const p = new URLSearchParams({ q, 'include-passage-references': 'false', 'include-verse-numbers': 'false', 'include-first-verse-numbers': 'false', 'include-footnotes': 'false', 'include-headings': 'false', 'include-short-copyright': 'false', 'include-selahs': 'false' });
    const r = await fetch('https://api.esv.org/v3/passage/text/?' + p, { headers: { Authorization: 'Token ' + process.env.ESV_API_KEY } });
    if (!r.ok) throw new Error('ESV API ' + r.status);
    const d = await r.json();
    out = { text: clean(d.passages && d.passages[0]), copyright: 'ESV® Bible, © 2001 by Crossway' };
  } else if (process.env.APIBIBLE_KEY && abIds()[v]) {
    const pid = `${USFM[b]}.${c}.${s}` + (e > s ? `-${USFM[b]}.${c}.${e}` : '');
    const p = new URLSearchParams({ 'content-type': 'text', 'include-notes': 'false', 'include-titles': 'false', 'include-chapter-numbers': 'false', 'include-verse-numbers': 'false', 'include-verse-spans': 'false' });
    const r = await fetch(`https://rest.api.bible/v1/bibles/${abIds()[v]}/passages/${pid}?${p}`, { headers: { 'api-key': process.env.APIBIBLE_KEY } });
    if (!r.ok) throw new Error('API.Bible ' + r.status);
    const d = (await r.json()).data;
    out = { text: clean(d.content), copyright: clean(d.copyright).slice(0, 120) };
  } else throw new Error(v + ' is not configured');
  if (!out.text) throw new Error('empty passage');
  if (cache.size > 400) cache.delete(cache.keys().next().value);
  cache.set(key, out);
  return out;
}
