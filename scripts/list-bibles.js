// Lists the Bibles your API.Bible key can use, with their ids.  Usage: npm run bibles   or   npm run bibles -- niv
import 'dotenv/config';
const key = process.env.APIBIBLE_KEY;
if (!key) { console.log('Add APIBIBLE_KEY=... to your .env file first.'); process.exit(1); }
const arg = (process.argv[2] || '').toLowerCase();
const isLang = /^[a-z]{3}$/.test(arg); // e.g. npm run bibles -- fra
const filter = isLang ? '' : arg;
const r = await fetch('https://rest.api.bible/v1/bibles?language=' + (isLang ? arg : 'eng'), { headers: { 'api-key': key } });
if (!r.ok) { console.log('API.Bible answered HTTP ' + r.status + '. Check the key.'); process.exit(1); }
const { data } = await r.json();
const rows = data.filter((b) => !filter || (b.name + ' ' + (b.abbreviation || '') + ' ' + (b.abbreviationLocal || '')).toLowerCase().includes(filter));
rows.forEach((b) => console.log((b.abbreviationLocal || b.abbreviation || '?').padEnd(10), b.id.padEnd(22), b.name));
console.log(`\n${rows.length} found. Put the ones you want in .env like:  APIBIBLE_VERSIONS=NIV:<id>,NKJV:<id>`);
