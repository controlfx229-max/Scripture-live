const [KJV,ASV,BSB,RV1909,FRDARBY]=await Promise.all(['kjv','asv','bsb','rv1909','frdarby'].map(n=>fetch('data/'+n+'.json').then(r=>r.json())));const BS={KJV,ASV,BSB,RV1909,FRDARBY};let V='KJV',B=BS.KJV;
const BOOKS=["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"];
//PARSER_START
const ES=["Génesis", "Éxodo", "Levítico", "Números", "Deuteronomio", "Josué", "Jueces", "Rut", "1 Samuel", "2 Samuel", "1 Reyes", "2 Reyes", "1 Crónicas", "2 Crónicas", "Esdras", "Nehemías", "Ester", "Job", "Salmos", "Proverbios", "Eclesiastés", "Cantares", "Isaías", "Jeremías", "Lamentaciones", "Ezequiel", "Daniel", "Oseas", "Joel", "Amós", "Abdías", "Jonás", "Miqueas", "Nahúm", "Habacuc", "Sofonías", "Hageo", "Zacarías", "Malaquías", "Mateo", "Marcos", "Lucas", "Juan", "Hechos", "Romanos", "1 Corintios", "2 Corintios", "Gálatas", "Efesios", "Filipenses", "Colosenses", "1 Tesalonicenses", "2 Tesalonicenses", "1 Timoteo", "2 Timoteo", "Tito", "Filemón", "Hebreos", "Santiago", "1 Pedro", "2 Pedro", "1 Juan", "2 Juan", "3 Juan", "Judas", "Apocalipsis"],FR=["Genèse", "Exode", "Lévitique", "Nombres", "Deutéronome", "Josué", "Juges", "Ruth", "1 Samuel", "2 Samuel", "1 Rois", "2 Rois", "1 Chroniques", "2 Chroniques", "Esdras", "Néhémie", "Esther", "Job", "Psaumes", "Proverbes", "Ecclésiaste", "Cantique des Cantiques", "Ésaïe", "Jérémie", "Lamentations", "Ézéchiel", "Daniel", "Osée", "Joël", "Amos", "Abdias", "Jonas", "Michée", "Nahum", "Habacuc", "Sophonie", "Aggée", "Zacharie", "Malachie", "Matthieu", "Marc", "Luc", "Jean", "Actes", "Romains", "1 Corinthiens", "2 Corinthiens", "Galates", "Éphésiens", "Philippiens", "Colossiens", "1 Thessaloniciens", "2 Thessaloniciens", "1 Timothée", "2 Timothée", "Tite", "Philémon", "Hébreux", "Jacques", "1 Pierre", "2 Pierre", "1 Jean", "2 Jean", "3 Jean", "Jude", "Apocalypse"];
const BN={RV1909:ES,FRDARBY:FR},VLABEL={RV1909:'Reina-Valera 1909',FRDARBY:'Bible Darby (français)'};
const strip=x=>x.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const ALIAS={};BOOKS.forEach((n,i)=>ALIAS[n.toLowerCase()]=i);
const EX={psalm:18,"song of songs":21,"songs of solomon":21,"song of song":21,canticles:21,revelations:65,"revelation of john":65,"acts of the apostles":43,gen:0,ex:1,exo:1,exod:1,lev:2,num:3,deut:4,josh:5,judg:6,"1 sam":8,"2 sam":9,"1 kgs":10,"2 kgs":11,"1 chron":12,"2 chron":13,neh:15,esth:16,ps:18,psa:18,prov:19,eccl:20,eccles:20,isa:22,jer:23,lam:24,ezek:25,dan:26,hos:27,obad:30,mic:32,nah:33,hab:34,zeph:35,hag:36,zech:37,mal:38,matt:39,mt:39,mk:40,lk:41,jn:42,rom:44,"1 cor":45,"2 cor":46,gal:47,eph:48,phil:49,col:50,"1 thess":51,"2 thess":52,"1 thes":51,"2 thes":52,"1 tim":53,"2 tim":54,tit:55,philem:56,heb:57,jas:58,"1 pet":59,"2 pet":60,"1 jn":61,"2 jn":62,"3 jn":63,rev:65};
Object.assign(ALIAS,EX);
Object.assign(ALIAS,{mach:40,marc:40,mock:40,mac:40,march:40,mart:40,mathew:39,mathews:39,isiah:22,isaih:22,ezekial:25,habakuk:34,colosians:50,proverb:19,roman:44,hebrew:57,galatian:47,ephesian:48,philippian:49,colossian:50,"1 corinthian":45,"2 corinthian":46,"1 thessalonian":51,"2 thessalonian":52,jeremia:23,mach:40,mak:40,jon:42,luk:41});
[ES,FR].forEach(a=>a.forEach((n,i)=>ALIAS[strip(n)]=i));Object.assign(ALIAS,{salmo:18,psaume:18,cantar:21,cantique:21,'cantar de los cantares':21,revelacion:65,apocalipse:65,'1 juan':61});
const SINGLE=new Set([30,56,62,63,64]);
const ONES={zero:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19};
const TENS={twenty:20,thirty:30,forty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90};
function words2num(t){const tk=t.split(' '),o=[];
 for(let i=0;i<tk.length;){let n=0,last='',j=i;
  for(;j<tk.length;j++){const w=tk[j];
   if(w in TENS&&(last===''||last==='h')){n+=TENS[w];last='t'}
   else if(w in ONES&&(last===''||last==='h'||(last==='t'&&ONES[w]>0&&ONES[w]<10))){n+=ONES[w];last=ONES[w]<10?'o':'n'}
   else if(w==='hundred'&&last==='o'&&n<10){n*=100;last='h'}
   else if(w==='and'&&last==='h'&&(tk[j+1] in ONES||tk[j+1] in TENS)){}
   else break}
  if(j>i){o.push(String(n));i=j}else{o.push(tk[i]);i++}}
 return o.join(' ')}
function norm(t){t=t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/(\d+)\s*:\s*(\d+)/g,'$1 $2').replace(/[^a-z0-9\s-]/g,' ').replace(/-/g,' to ').replace(/\bversus\b/g,'verse').replace(/\b(first|1st)\b/g,'1').replace(/\b(second|2nd)\b/g,'2').replace(/\b(third|3rd)\b/g,'3');
 return words2num(t.trim().replace(/\s+/g,' '))}
const NAMES=Object.keys(ALIAS).sort((a,b)=>b.length-a.length).map(k=>k.replace(/ /g,'\\s+')).join('|');
const REFRE=`\\b(${NAMES})\\b(?:\\s+(?:chapter|chap))?\\s+(\\d+)(?:\\s+(?:verses?|versiculos?|versos?|versets?|vs|v)\\s+(\\d+)(?:\\s+(?:to|through|thru)\\s+(\\d+))?|\\s+(\\d+)(?:\\s+(?:to|through|thru)\\s+(\\d+))?)?`;
function split(b,s){for(let k=1;k<s.length;k++){const vs=s.slice(k);if(vs[0]==='0')continue;const c=+s.slice(0,k),v=+vs;if(c>=1&&c<=nCh(b)&&v>=1&&v<=nV(b,c))return[c,v]}return null}
function parse(raw){
 const t=norm(raw),ev=[];let m;
 const re=new RegExp(REFRE,'g');
 while((m=re.exec(t))){const bi=ALIAS[m[1].replace(/\s+/g,' ')];let c=+m[2],v=1,e=1;
  if(m[3]){v=+m[3];e=m[4]?+m[4]:v}else if(m[5]){v=+m[5];e=m[6]?+m[6]:v}
  else if(SINGLE.has(bi)&&!/chap/.test(m[0])){v=c;e=c;c=1}
  else if(c>nCh(bi)){const sp=split(bi,m[2]);if(sp){c=sp[0];v=sp[1];e=v}}
  ev.push({i:m.index,e:re.lastIndex,a:{t:'ref',b:bi,c,v,e}})}
 const r2=new RegExp(`\\b(${NAMES})\\b\\s+(?:verses?|versiculos?|versos?|versets?|vs)\\s+(\\d+)(?:\\s+(?:to|through|thru)\\s+(\\d+))?`,'g');
 while((m=r2.exec(t))){const bi=ALIAS[m[1].replace(/\s+/g,' ')];if(SINGLE.has(bi)&&!ev.some(x=>m.index>=x.i&&m.index<x.e))ev.push({i:m.index,e:r2.lastIndex,a:{t:'ref',b:bi,c:1,v:+m[2],e:m[3]?+m[3]:+m[2]}})}
 const free=i=>!ev.some(x=>i>=x.i&&i<x.e);
 const add=(r,fn)=>{const g=new RegExp(r,'g');let m;while((m=g.exec(t))){if(free(m.index))ev.push({i:m.index,e:g.lastIndex,a:fn(m)})}};
 add(/\b(?:next|following) verse\b/,()=>({t:'rel',d:1}));
 add(/\b(?:previous|prior) verse\b|\b(?:go )?back (?:one|1) verse\b/,()=>({t:'rel',d:-1}));
 add(/\bnext chapter\b/,()=>({t:'ch',d:1}));
 add(/\b(?:previous|prior) chapter\b/,()=>({t:'ch',d:-1}));
 add(/\bchapter (\d+)(?: verse (\d+))?/,m=>({t:'abs',c:+m[1],v:m[2]?+m[2]:1,e:0}));
 add(/\b(?:verses?|versiculos?|versos?|versets?|vs) (\d+)(?: (?:to|through|thru) (\d+))?/,m=>({t:'abs',v:+m[1],e:m[2]?+m[2]:0}));
 const vm=/\b(?:read|show|switch to|use|in|from)(?: the)? (niv|esv|nkjv|nlt|nasb|csb|amp|msg|kjv|asv|bsb|king james|american standard|berean standard|berean)\b/.exec(t);
 const wm=/\b(?:read|show|switch to|use)(?: in)?(?: the)? (web|world english|spanish|reina valera|french|darby)\b/.exec(t);
 const ver=vm?({'king james':'KJV','american standard':'ASV','berean standard':'BSB','berean':'BSB'}[vm[1]]||vm[1].toUpperCase()):(wm?{'web':'WEB','world english':'WEB',spanish:'RV1909','reina valera':'RV1909',french:'FRDARBY',darby:'FRDARBY'}[wm[1]]:null);
 ev.sort((a,b)=>a.i-b.i);const last=ev[ev.length-1];
 if(!last&&!ver)return null;
 return{act:last?last.a:null,ver,sig:JSON.stringify([last&&last.a,ver])}}
const nCh=b=>B[b].length,nV=(b,c)=>B[b][c-1].length;
function fix(b,c,v){for(;;){if(v<1){c--;if(c<1){b--;if(b<0)return null;c=nCh(b)}v=nV(b,c)}else if(v>nV(b,c)){v=1;c++;if(c>nCh(b)){b++;if(b>65)return null;c=1}}else return{b,c,v,e:v}}}
function resolve(a,S){
 if(a.t==='ref'){const{b,c,v}=a;if(c<1||c>nCh(b)||v<1||v>nV(b,c))return{err:`${BOOKS[b]} ${c}:${v} doesn’t exist`};return{b,c,v,e:Math.min(Math.max(a.e,v),nV(b,c))}}
 if(!S)return{err:'No passage open yet'};
 if(a.t==='rel')return fix(S.b,S.c,a.d>0?S.e+1:S.v-1)||{err:'End of the Bible'};
 if(a.t==='ch'){let b=S.b,c=S.c+a.d;if(c>nCh(b)){b++;c=1}if(c<1){b--;if(b>=0)c=nCh(b)}if(b<0||b>65)return{err:'No such chapter'};return{b,c,v:1,e:1}}
 const c=a.c||S.c;if(c<1||c>nCh(S.b)||a.v<1||a.v>nV(S.b,c))return{err:`${a.c?'Chapter '+c+' ':''}Verse ${a.v} doesn’t exist in ${BOOKS[S.b]} ${c}`};
 return{b:S.b,c,v:a.v,e:Math.min(Math.max(a.e||a.v,a.v),nV(S.b,c))}}
//PARSER_END
const $=id=>document.getElementById(id);
const store=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){}};
let S=null,hist=[],pend=null,bc=null;
try{bc=new BroadcastChannel('scripture-live')}catch(e){}
const isDisplay=location.hash==='#display';if(isDisplay)document.body.classList.add('display');
function label(s){return`${(BN[V]||BOOKS)[s.b]} ${s.c}:${s.v}`+(s.e>s.v?`–${s.e}`:'')}
function fit(){const t=$('txt'),h=$('stage').clientHeight;let f=h*.11;t.style.fontSize=f+'px';while(t.offsetHeight>h*.62&&f>10){f-=2;t.style.fontSize=f+'px'}$('ref').style.fontSize=Math.max(14,h*.065)+'px'}
let ONLINE=[];const OC=new Map();
async function onlineText(s,vn){const k=[vn,s.b,s.c,s.v,s.e].join('.');if(OC.has(k))return OC.get(k);
 const r=await fetch(`/api/passage?v=${vn}&b=${s.b}&c=${s.c}&s=${s.v}&e=${s.e}`);if(!r.ok)throw new Error('x');const d=await r.json();OC.set(k,d);return d}
function local(s,vn){const vs=BS[vn][s.b][s.c-1];let h='';for(let v=s.v;v<=s.e;v++)h+=(s.e>s.v?`<sup>${v}</sup>`:'')+(vs[v-1]||'[not in this translation]')+' ';$('txt').innerHTML=h;fit()}
function draw(s){$('ver').textContent=VLABEL[V]||V;if(!s){$('ref').textContent='Ready';$('txt').textContent='Say a scripture…';return}
 $('ref').textContent=label(s);if(BS[V])return local(s,V);
 const mv=V;$('txt').textContent='…';
 onlineText(s,mv).then(d=>{if(S!==s||V!==mv)return;$('ver').textContent=mv+(d.copyright?' · '+d.copyright:'');$('txt').textContent=d.text;fit();
  const p=fix(s.b,s.c,s.e+1);if(p)onlineText({b:p.b,c:p.c,v:p.v,e:p.v},mv).catch(()=>{})})
 .catch(()=>{if(S!==s||V!==mv)return;$('ver').textContent='KJV (since '+mv+' is unavailable)';local(s,'KJV')})}
function log(msg,err){const li=document.createElement('li');if(err)li.className='e';li.innerHTML=`<small>${new Date().toLocaleTimeString()}</small> ${msg}`;$('log').prepend(li);while($('log').children.length>40)$('log').lastChild.remove()}
function show(s,src){if(S)hist.push(S);S=s;draw(s);bc&&bc.postMessage({s,v:V});log(`${label(s)} <small>(${src})</small>`)}
function setSug(s,txt){pend=s;$('sug').classList.toggle('show',!!s);$('sugT').textContent=s?`Suggested${s.q?' (quote match)':''}: ${label(s)}`:''}
function commit(r,src){const res=resolve(r.act,S);
 if(res.err){if(src!=='voice-live')log(res.err,1);return}
 if($('mode').value==='manual'&&src.startsWith('voice'))setSug(res);else{setSug(null);show(res,src)}}
function setVer(v){if(!BS[v]&&!ONLINE.includes(v)){log(`${v} isn’t installed yet (licence needed).`,1);$('vsel').value=V;return}
 V=v;B=BS[v]||BS.KJV;$('vsel').value=v;if(S){S={...S};S.v=Math.min(S.v,nV(S.b,S.c));S.e=Math.min(Math.max(S.e,S.v),nV(S.b,S.c))}draw(S);bc&&bc.postMessage({s:S,v:V});log('Version → '+v)}
$('vsel').onchange=()=>setVer($('vsel').value);
function applyParsed(p,src){if(p.ver&&p.ver!==V)setVer(p.ver);if(p.act)commit(p,src)}
// quote recognition: tolerant word matching (endings ignored) finds the verse when no reference is spoken
let IDX=null;const MOD={thee:'you',thou:'you',ye:'you',thy:'your',thine:'your',unto:'to',hath:'has',doth:'does',dost:'do',shalt:'shall',wilt:'will',art:'are',hast:'have',whithersoever:'wherever',whosoever:'whoever',whatsoever:'whatever'};const stem=w=>w.length>3?w.replace(/(eth|est|ing|ed|es|s|d|e)$/,''):w;
const wd=s=>s.toLowerCase().replace(/[^a-z\s]/g,' ').split(/\s+/).filter(Boolean).map(w=>MOD[w]||w).map(stem);
function buildIdx(){IDX=new Map();const jobs=['KJV','BSB'].flatMap(n=>BS.KJV.map((bk,b)=>[n,b]));
 (function step(){const j=jobs.shift();if(!j)return;const b=j[1];BS[j[0]][b].forEach((ch,c)=>ch.forEach((tx,v)=>{const w=wd(tx),id=b*1e6+(c+1)*1e3+v+1;
  for(let i=0;i+1<w.length;i++){const k=w[i]+' '+w[i+1];const a=IDX.get(k);a?a.push(id):IDX.set(k,[id])}}));setTimeout(step,0)})()}
setTimeout(buildIdx,800);
function quote(txt){const w=wd(txt);if(w.length<6||!IDX)return null;const votes=new Map(),hits=new Map();let max=0;
 for(let i=0;i+1<w.length;i++){const a=IDX.get(w[i]+' '+w[i+1]);if(!a||a.length>400)continue;const wt=1/a.length;max+=wt;for(const id of new Set(a)){votes.set(id,(votes.get(id)||0)+wt);hits.set(id,(hits.get(id)||0)+1)}}
 let best=0,bid=0;for(const[k,c]of votes)if(c>best||(c===best&&k<bid)){best=c;bid=k}
 return!max||hits.get(bid)<2?null:{b:Math.floor(bid/1e6),c:Math.floor(bid%1e6/1e3),v:bid%1e3,conf:best/max,best:hits.get(bid)}}
const dis=new Map();let lastQ=0,sugTimer=0;
const dismiss=()=>{if(pend)dis.set(pend.b+'.'+pend.c+'.'+pend.v,Date.now());setSug(null)};
// Quotes are only checked on finished phrases, never repeat the verse on screen or one you dismissed, and change at most every 3 s
function tryQuote(txt){const qm=$('qmode').value;if(qm==='off')return;const q=quote(txt);if(!q||q.conf<.6||q.best<3)return;
 const k=q.b+'.'+q.c+'.'+q.v;if(S&&S.b===q.b&&S.c===q.c&&S.v===q.v)return;if(Date.now()-(dis.get(k)||0)<60000)return;
 if(Date.now()-lastQ<3000)return;lastQ=Date.now();const s={b:q.b,c:q.c,v:q.v,e:q.v,q:1};
 if(qm==='auto'&&q.conf>=.9&&q.best>=4&&$('mode').value==='auto'){setSug(null);show(s,'quote match')}
 else{setSug(s);clearTimeout(sugTimer);sugTimer=setTimeout(()=>setSug(null),15000)}}
let qt=0;
// voice handling: interim results are debounced, final results apply instantly, repeats are ignored
let lastId=-1,lastSig='',timer=0;
function heard(txt,fin,id){$('live').textContent=txt;const p=parse(txt);if(!p){if(fin)tryQuote(txt);return}
 clearTimeout(timer);const go=()=>{if(id===lastId&&p.sig===lastSig)return;lastId=id;lastSig=p.sig;applyParsed(p,fin?'voice':'voice-live')};
 fin?go():timer=setTimeout(go,380)}
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;let rec=null,on=false,ws=null,mr=null,stream=null,dgId=0,recent=[];
const setMicUI=(a,msg)=>{$('mic').textContent=a?'⏹ Stop listening':'🎤 Start listening';$('mic').classList.toggle('on',a);$('status').textContent=msg};
let DGMODE='proxy',PROTO='bearer',fails=0;
const TERMS=["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","Samuel","Kings","Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John","Acts","Romans","Corinthians","Galatians","Ephesians","Philippians","Colossians","Thessalonians","Timothy","Titus","Philemon","Hebrews","James","Peter","Jude","Revelation","chapter","verse","next verse","previous verse"];
const DGLANG={'en-GH':'en','en-NG':'en','en-US':'en-US','en-GB':'en-GB'};
// Deepgram engine: mic audio -> our server (/stt) -> Deepgram. The API key never reaches the browser.
async function dgStart(){
 try{stream=stream||await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true}})}catch(e){on=false;setMicUI(false,'Mic blocked – allow it in the address bar');return}
 let me,opened=false;
 if(DGMODE==='token'){ // Vercel: get a 30-second token, then talk to Deepgram directly
  let tk;try{tk=(await(await fetch('/api/token')).json()).token}catch(e){}
  if(!tk){on=false;setMicUI(false,'No Deepgram token – check DEEPGRAM_API_KEY on Vercel');return}
  const q=new URLSearchParams({model:'nova-3',language:DGLANG[$('lang').value],interim_results:'true',endpointing:'300',punctuate:'false',smart_format:'false',numerals:'false'});
  TERMS.forEach(t=>q.append('keyterm',t));
  me=ws=new WebSocket('wss://api.deepgram.com/v1/listen?'+q,[PROTO,tk]);
 }else me=ws=new WebSocket((location.protocol==='https:'?'wss://':'ws://')+location.host+'/stt?lang='+DGLANG[$('lang').value]);
 me.onopen=()=>{opened=true;fails=0;lastId=-1;lastSig='';mr=new MediaRecorder(stream,{mimeType:'audio/webm;codecs=opus'});mr.ondataavailable=e=>{if(e.data.size&&me.readyState===1)me.send(e.data)};mr.start(200);setMicUI(true,'Listening (Deepgram)…')};
 me.onmessage=e=>{const d=JSON.parse(e.data);
  if(d.type==='ProxyError'){log(d.message,1);setMicUI(true,'Deepgram error');return}
  if(d.type!=='Results')return;const t=(d.channel.alternatives[0]||{}).transcript;if(!t)return;
  const now=Date.now();recent=recent.filter(r=>now-r.t<4000);const full=(recent.map(r=>r.x).join(' ')+' '+t).trim();
  heard(full,d.is_final,dgId);
  if(d.is_final){dgId++;const p=parse(full);if(p&&p.act)recent=[];else recent.push({x:t,t:now})}};
 me.onclose=()=>{try{mr&&mr.state!=='inactive'&&mr.stop()}catch(e){}if(!(on&&ws===me))return;
  if(!opened){fails++;if(PROTO==='bearer')PROTO='token';if(fails>3){on=false;setMicUI(false,'Could not connect to Deepgram');log('Could not connect to Deepgram. Check the API key (Member permission) and internet.',1);return}}
  setTimeout(dgStart,1000)}}
function dgStop(){try{mr&&mr.stop()}catch(e){}const w=ws;ws=null;w&&w.close();stream&&stream.getTracks().forEach(t=>t.stop());stream=null}
function srStart(){if(!SR){on=false;setMicUI(false,'Use Chrome or Edge');return}
 rec=new SR();rec.continuous=true;rec.interimResults=true;rec.lang=$('lang').value;
 rec.onstart=()=>{lastId=-1;lastSig='';setMicUI(true,'Listening (browser)…')};
 rec.onresult=e=>{const i=e.results.length-1,r=e.results[i];heard(r[0].transcript,r.isFinal,i)};
 rec.onerror=e=>setMicUI(on,e.error==='not-allowed'?'Mic blocked – allow it in the address bar':'Mic: '+e.error);
 rec.onend=()=>{if(on)try{rec.start()}catch(e){}};rec.start()}
function mic(){if(on){on=false;rec&&rec.stop();dgStop();setMicUI(false,'Mic off');return}
 on=true;$('engine').value==='dg'?dgStart():srStart()}
$('mic').onclick=mic;
$('lang').onchange=()=>{store('lang',$('lang').value);if(on){mic();mic()}};
$('mode').onchange=()=>{store('mode',$('mode').value);setSug(null)};
function nav(d){const r=resolve({t:'rel',d},S);r.err?log(r.err,1):show(r,'button')}
$('prev').onclick=()=>nav(-1);$('next').onclick=()=>nav(1);
$('undo').onclick=()=>{if(!hist.length)return;S=hist.pop();draw(S);bc&&bc.postMessage({s:S,v:V});log('Undo → '+label(S))};
$('go').onkeydown=e=>{if(e.key==='Enter'){const p=parse($('go').value);if(!p)log('Couldn’t find a scripture in that',1);else applyParsed(p,'typed');$('go').value=''}};
$('sugOk').onclick=()=>{if(pend){const s=pend;setSug(null);show(s,'confirmed')}};$('sugNo').onclick=()=>dismiss();
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='SELECT')return;
 if(e.key==='ArrowRight')nav(1);else if(e.key==='ArrowLeft')nav(-1);else if(e.key==='Enter')$('sugOk').click();else if(e.key==='Escape')dismiss()});
$('pop').onclick=()=>window.open(location.href.split('#')[0]+'#display','scripture-display','popup,width=1280,height=720');
$('stage').onclick=()=>{try{document.fullscreenElement?document.exitFullscreen():$('stage').requestFullscreen()}catch(e){}};
if(bc)bc.onmessage=e=>{const d=e.data;if(d.ping)lp=Date.now();if(d.hello&&!isDisplay&&S)bc.postMessage({s:S,v:V});if('s'in d&&isDisplay){if(d.v){V=d.v;B=BS[V]||BS.KJV}S=d.s;draw(S)}};
if(isDisplay&&bc)bc.postMessage({hello:1});
let lp=0;if(bc&&!isDisplay)setInterval(()=>bc.postMessage({ping:1}),2000);if(isDisplay)setInterval(()=>$('link').classList.toggle('ok',Date.now()-lp<5000),1000);
addEventListener('resize',fit);
try{const l=store('lang'),m=store('mode');if(l)$('lang').value=l;if(m)$('mode').value=m}catch(e){}
fit();
fetch('/api/health').then(r=>r.json()).then(h=>{DGMODE=h.mode||'proxy';ONLINE=h.online||[];ONLINE.forEach(n=>{const o=document.createElement('option');o.textContent=n;$('vsel').appendChild(o)});if(!h.deepgram){$('engine').value='browser';log('Deepgram key not set – using the browser engine. Add DEEPGRAM_API_KEY to .env and restart.',1)}}).catch(()=>{$('engine').value='browser'});
