// Demo düzeltme motoru: Türk öğrencilerin en sık yaptığı hataları kurallarla yakalar.
// Gerçek AI koç bağlanınca düzeltmeler oradan gelir; bu motor çevrimdışı yedek olarak kalır.
// Her kural, cümlenin yalnız o hatası düzeltilmiş halini döndürür. Açıklamalar metin tablosundadır (duzeltme.*).
// Not: kesme işareti için regex içinde \x27 kullanılır (robotun metin taraması tırnakla karışmasın diye).

const AP = '[\\x27\\u2019]';

// v0.24.0 Fiil tabloları elle iki kez yazılmaz: düzensiz fiiller + düzenli fiiller listesinden geçmiş (GECMIS) ve
// ters (YALIN) tablo kurallarla üretilir; 3. tekil (-s/-es/-ies) biçimleri de eklenir. Yeni fiil tek yere bir kez yazılır.
// Bilerek DIŞARIDA: düşünce/aktarma fiilleri (think, know, hope, believe, remember, say, tell, hear…) — "I think he left
// yesterday" doğru bir cümledir, "I thought" yapmak yanlış öğretir. Biçimi değişmeyenler (put, cut, read, let…) da yok.
const DUZENSIZ = {
  go: 'went', eat: 'ate', buy: 'bought', have: 'had', see: 'saw', take: 'took', come: 'came', get: 'got', make: 'made',
  drink: 'drank', meet: 'met', pay: 'paid', sleep: 'slept', drive: 'drove', write: 'wrote', speak: 'spoke', find: 'found',
  give: 'gave', leave: 'left', feel: 'felt', do: 'did', wake: 'woke', run: 'ran', swim: 'swam', begin: 'began',
  bring: 'brought', catch: 'caught', choose: 'chose', forget: 'forgot', keep: 'kept', lose: 'lost', sell: 'sold',
  send: 'sent', sit: 'sat', spend: 'spent', stand: 'stood', teach: 'taught', win: 'won', fly: 'flew', fall: 'fell',
  sing: 'sang', become: 'became', build: 'built', ride: 'rode', wear: 'wore', break: 'broke', grow: 'grew', draw: 'drew',
};
const DUZENLI = ['arrive', 'live', 'love', 'move', 'start', 'finish', 'open', 'close', 'clean', 'help', 'ask', 'answer',
  'listen', 'talk', 'try', 'use', 'wait', 'enjoy', 'learn', 'plan', 'stop', 'decide', 'invite', 'change', 'order', 'book',
  'return', 'rent', 'miss', 'pass', 'hate', 'check', 'visit', 'watch', 'play', 'work', 'cook', 'walk', 'study', 'stay',
  'call', 'want', 'like', 'need', 'travel', 'rain', 'dance', 'laugh', 'cry', 'carry', 'shop', 'chat', 'look', 'fix',
  'borrow', 'join', 'explain', 'prepare', 'practice', 'practise', 'relax', 'repair', 'climb', 'visit', 'paint', 'pray'];
const CIFT_UNSUZ = new Set(['stop', 'plan', 'shop', 'chat', 'prefer']);

function duzenliGecmis(f) {
  if (CIFT_UNSUZ.has(f)) return f + f.slice(-1) + 'ed';
  if (f.endsWith('e')) return f + 'd';
  if (/[^aeiou]y$/.test(f)) return f.slice(0, -1) + 'ied';
  return f + 'ed';
}

function ucuncuTekilHali(fiil) {
  if (fiil === 'have') return 'has';
  if (fiil === 'do') return 'does';
  if (fiil === 'go') return 'goes';
  if (/(ch|sh|ss|x|o)$/.test(fiil)) return fiil + 'es';
  if (/[^aeiou]y$/.test(fiil)) return fiil.slice(0, -1) + 'ies';
  return fiil + 's';
}

const GECMIS = { is: 'was', am: 'was', are: 'were' };
const YALIN = {};
for (const [yalin, gecmis] of [...Object.entries(DUZENSIZ), ...DUZENLI.map((f) => [f, duzenliGecmis(f)])]) {
  GECMIS[yalin] = gecmis;
  GECMIS[ucuncuTekilHali(yalin)] = gecmis;
  YALIN[gecmis] = yalin;
}

const UCUNCU_FIILLER = ['go', 'want', 'like', 'work', 'live', 'have', 'do', 'eat', 'drink', 'play', 'watch', 'need',
  'love', 'study', 'read', 'make', 'take', 'get', 'come', 'know', 'think', 'speak', 'cook', 'drive', 'wake', 'sleep'];


const GECMIS_ISARETI = /\b(yesterday|last (night|week|month|year|weekend|monday|tuesday|wednesday|thursday|friday|saturday|sunday)|ago)\b/i;
// Yan cümle sınırları (baglamliYanCumleler kullanır).
// v0.16.0: although/though/whereas/while/unless/if de yan cümle sınırı ("I work today although I was sick yesterday" bozulmaz).
const AYIRAC = /(\s*(?:,|;|\band\b|\bbut\b|\bso\b|\bbecause\b|\bthen\b|\balthough\b|\bthough\b|\bwhereas\b|\bwhile\b|\bunless\b|\bif\b)\s*)/i;

const AILE = '(?:mother|father|mom|dad|friend|friends|brother|sister|wife|husband|son|daughter|boss|teacher|parents|family)';
const OZNE = `(I|we|you|they|he|she|it|my ${AILE})`;
// did/didn't ile özne arasına giren sahiplik: "Did your brother went" de yakalanır.
const SORU_OZNESI = `(?:I|we|you|they|he|she|it|(?:my|your|his|her|our|their) ${AILE})`;
// Geçmiş zaman bağlamı bağlaçla sonraki yan cümleye taşınır ("Yesterday I went there and buy bread" → bought);
// zıtlık/koşul bildirenlerde (although, while, if…) ve şimdiki/gelecek zaman işareti olan yan cümlede taşınmaz.
const BAGLAMI_TASIYAN = /^\s*(?:,|;|and|then|so|but|because)\s*$/i;
const SIMDI_ISARETI = /\b(today|now|tomorrow|tonight|every|usually|always|often|nowadays|these days|next|at the moment)\b/i;
const YARDIMCI_ONCESI = `(?<!\\b(?:did|do|does|didn${AP}t|can|will|would|could|should|must|might|let|to)\\s)`;

const ING_YALIN = { going: 'go', eating: 'eat', drinking: 'drink', buying: 'buy', having: 'have', doing: 'do', seeing: 'see', getting: 'get', taking: 'take', watching: 'watch', playing: 'play' };

// Yan cümleleri geçmiş zaman bağlamıyla dolaştırır. gecmis: bu yan cümle geçmişi anlatıyor mu; tasinan: bağlam
// önceki yan cümleden mi geldi (kendi işareti yok). Present perfect (since/ever/have + ortaç) bağlamı keser:
// "I have not seen him since yesterday." doğrudur; "had" yapmak yanlış öğretir (v0.13.0).
const PERFECT = new RegExp(`\\b(have|has|haven${AP}t|hasn${AP}t)(\\s+not)?\\s+(been|\\w+ed|\\w+en|seen|done|gone|had|made|got|known|met|bought|left|lost|told|found|come|become|run|sent|spent|heard|said|read|written|eaten)\\b`, 'i');
function baglamliYanCumleler(cumle, fn) {
  const parcalar = cumle.split(AYIRAC);
  let baglam = false;
  for (let i = 0; i < parcalar.length; i += 2) {
    const c = parcalar[i];
    const tasinan = !GECMIS_ISARETI.test(c) && baglam && BAGLAMI_TASIYAN.test(parcalar[i - 1] || '') && !SIMDI_ISARETI.test(c);
    const gecmis = (GECMIS_ISARETI.test(c) || tasinan) && !/\b(since|ever|never|already|yet|just)\b/i.test(c) && !PERFECT.test(c);
    baglam = gecmis;
    parcalar[i] = fn(c, { gecmis, tasinan });
  }
  return parcalar.join('');
}

export const KURALLAR = [
  {
    id: 'gecmis-zaman',
    aciklama: 'duzeltme.gecmisZaman',
    uygula(cumle) {
      return baglamliYanCumleler(cumle, (c, { gecmis, tasinan }) => {
        if (!gecmis) return c;
        const desen = new RegExp(`${YARDIMCI_ONCESI}\\b${OZNE}\\s+(\\w+)\\b`, 'gi');
        let yeni = c.replace(desen, (tum, ozne, fiil) => {
          const g = GECMIS[fiil.toLowerCase()];
          if (!g) return tum;
          if (/^(am|is|are)$/i.test(fiil)) {
            const tekil = /^(I|he|she|it)$/i.test(ozne) || /^my /i.test(ozne);
            return `${ozne} ${tekil ? 'was' : 'were'}`;
          }
          return `${ozne} ${g}`;
        });
        // v0.24.0 Ortak özne: bağlaçtan sonra öznesiz gelen fiil (and buy bread / then go home) öncekinin zamanını alır.
        if (tasinan) {
          yeni = yeni.replace(/^(\s*)((?:also|then|later|finally)\s+)?(\w+)\b/i, (tum, bosluk, zarf, fiil) => {
            const g = GECMIS[fiil.toLowerCase()];
            return g && !/^(am|is|are)$/i.test(fiil) ? `${bosluk}${zarf || ''}${g}` : tum;
          });
        }
        return yeni;
      });
    },
  },
  {
    id: 'did-yalin',
    aciklama: 'duzeltme.didGecmis',
    uygula(c) {
      // v0.24.0: soru biçiminde özne araya girse de ("Did you went", "Didn't your sister came") yakalanır.
      return c.replace(new RegExp(`\\b(didn${AP}t|did not|did)(\\s+${SORU_OZNESI})?(\\s+not)?\\s+(\\w+)\\b`, 'gi'), (tum, did, ozne, degil, fiil) => {
        const yalin = YALIN[fiil.toLowerCase()];
        return yalin ? `${did}${ozne || ''}${degil || ''} ${yalin}` : tum;
      });
    },
  },
  {
    id: 'ucuncu-tekil',
    aciklama: 'duzeltme.ucuncuTekil',
    uygula(cumle) {
      return baglamliYanCumleler(cumle, (c, { gecmis }) => {
      if (gecmis || GECMIS_ISARETI.test(c)) return c;
      const desen = new RegExp(`(?<!\\b(?:does|did|can|will|would|could|should|must|might|let|to|make|makes|help|helps)\\s)\\b(he|she|it|my (?:mother|father|mom|dad|friend|brother|sister|wife|husband|son|daughter|boss|teacher))\\s+(${UCUNCU_FIILLER.join('|')})\\b`, 'gi');
      return c.replace(desen, (tum, ozne, fiil) => `${ozne} ${ucuncuTekilHali(fiil.toLowerCase())}`);
      });
    },
  },
  {
    // v0.16.0 Kesin edat kalıpları: yalnız anlamı belirsiz olmayan, sabit kalıplar (genel edat tahmini YAPILMAZ —
    // yanlış düzeltme riski yüksek). Örn. "married with two kids" doğru olduğu için yalnız "married with him/her" düzeltilir.
    id: 'edat-kalibi',
    aciklama: 'duzeltme.edatKalibi',
    uygula(c) {
      const GUNLER = 'Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday';
      return c
        .replace(/\b(good|bad|better|best|great|terrible)\s+in\s+(English|Turkish|Spanish|French|German|math|maths|sports?|football|cooking|writing|speaking|languages)\b/gi, (t, s, k) => `${s} at ${k}`)
        .replace(/\b(married|engaged)\s+with\s+(him|her)\b/gi, (t, s, k) => `${s} to ${k}`)
        .replace(/\b(depend|depends|depended|depending)\s+of\b/gi, (t, s) => `${s} on`)
        .replace(/\b(interested)\s+(about|on|for)\b/gi, (t, s) => `${s} in`)
        .replace(/\b(listen|listens|listened|listening)\s+(music|the radio|podcasts?)\b/gi, (t, s, k) => `${s} to ${k}`)
        .replace(/\b(discuss|discusses|discussed|discussing)\s+about\b/gi, (t, s) => s)
        .replace(/\b(explain|explains|explained)\s+me\s+(how|why|what|where|when|who)\b/gi, (t, s, k) => `${s} to me ${k}`)
        .replace(/\b(arrive|arrives|arrived|arriving)\s+to\s+(the\s+)?(airport|station|hotel|office|meeting)\b/gi, (t, s, a, k) => `${s} at ${a || ''}${k}`)
        .replace(new RegExp(`\\bin\\s+(${GUNLER})\\b(?!\\s+(?:Street|Road|Avenue|Lane|Square|Park))`, 'g'), (t, g) => `on ${g}`)
        .replace(/\bon\s+((?:19|20)\d\d)\b/g, (t, y) => `in ${y}`);
    },
  },
  {
    id: 'am-agree',
    aciklama: 'duzeltme.amAgree',
    uygula(c) {
      return c
        .replace(new RegExp(`\\b(I am|I${AP}m) not agree\\b`, 'gi'), 'I don’t agree')
        .replace(new RegExp(`\\b(I am|I${AP}m) agree\\b`, 'gi'), 'I agree');
    },
  },
  {
    id: 'meslek-a',
    aciklama: 'duzeltme.meslekA',
    uygula(c) {
      return c.replace(new RegExp(`\\b(I am|I${AP}m|he is|she is|he${AP}s|she${AP}s|you are|you${AP}re|my \\w+ is) (student|teacher|doctor|engineer|nurse|lawyer|driver|manager|designer|developer|accountant|waiter|waitress|architect|officer|chef|pilot)\\b`, 'gi'),
        (tum, ozne, meslek) => `${ozne} ${/^[aeiou]/i.test(meslek) ? 'an' : 'a'} ${meslek}`);
    },
  },
  {
    id: 'how-much',
    aciklama: 'duzeltme.howMuch',
    uygula(c) {
      return c.replace(/\bhow much (is|are) (it|this|that|they|these|those) cost\b/gi,
        (tum, fiil, zamir) => `How much ${/^(they|these|those)$/i.test(zamir) ? 'do' : 'does'} ${zamir} cost`);
    },
  },
  {
    id: 'more-better',
    aciklama: 'duzeltme.moreBetter',
    uygula(c) {
      return c.replace(/\bmore (better|worse|bigger|smaller|cheaper|easier|faster|older|younger|bigger)\b/gi, '$1');
    },
  },
  {
    // v0.13.0 Türkçeden gelen "20 yaşım var" kalıbı. Yalnız "have N years old" biçimi düzeltilir (yüksek kesinlik);
    // "I have 20 years of experience" gibi doğru cümlelere dokunulmaz.
    id: 'yas-kalibi',
    aciklama: 'duzeltme.yasKalibi',
    uygula(c) {
      return c.replace(/\b(I|you|we|they|he|she)\s+(have|has)\s+(\d{1,3})\s+years?\s+old\b/gi, (tum, ozne, _v, n) => {
        const be = /^I$/i.test(ozne) ? 'am' : /^(he|she)$/i.test(ozne) ? 'is' : 'are';
        return `${ozne} ${be} ${n} years old`;
      });
    },
  },
  {
    // v0.13.0 Sayılamayan isimler: Türkçede çoğul olabilen "bilgiler, tavsiyeler, ev ödevleri" İngilizcede tekildir.
    id: 'sayilamaz',
    aciklama: 'duzeltme.sayilamaz',
    uygula(c) {
      return c.replace(/\b(informations|advices|furnitures|homeworks|knowledges|equipments)\b/gi, (k) => k.slice(0, -1));
    },
  },
  {
    id: 'people-are',
    aciklama: 'duzeltme.peopleAre',
    uygula(c) {
      return c.replace(/\bpeople is\b/gi, 'people are').replace(/\bpeople was\b/gi, 'people were');
    },
  },
  {
    id: 'can-to',
    aciklama: 'duzeltme.canTo',
    uygula(c) {
      return c.replace(new RegExp(`\\b(can|can${AP}t|cannot|could|should|must|will) to (\\w+)`, 'gi'), '$1 $2');
    },
  },
  {
    id: 'want-to',
    aciklama: 'duzeltme.wantTo',
    uygula(c) {
      return c.replace(/\b(want|wants|wanted|need|needs) (going|eating|drinking|buying|having|doing|seeing|getting|taking|watching|playing)\b/gi,
        (tum, fiil, ing) => `${fiil} to ${ING_YALIN[ing.toLowerCase()]}`);
    },
  },
];

function cumleBasi(metin) {
  return metin.charAt(0).toUpperCase() + metin.slice(1);
}

// Cümledeki her hata için ayrı bir düzeltme döndürür.
export function duzeltmeleriBul(cumle) {
  const sonuc = [];
  for (const kural of KURALLAR) {
    const yeni = kural.uygula(cumle);
    if (yeni !== cumle) {
      sonuc.push({ kuralId: kural.id, tur: 'gramer', aciklama: kural.aciklama, kullanici: cumle, dogru: cumleBasi(yeni) });
    }
  }
  return sonuc;
}

// Tüm kurallar birlikte uygulanmış hali: koçun doğal tekrarı (recast) için.
export function tumunuDuzelt(cumle) {
  let c = cumle;
  for (const kural of KURALLAR) c = kural.uygula(c);
  return cumleBasi(c);
}

// Türkçe kelime yakalama: sözlükteki kelimeler cümlede geçiyorsa karşılıklarını döndürür.
export function turkceKelimeler(cumle, sozluk) {
  const kelimeler = cumle.toLocaleLowerCase('tr').split(/[^a-zçğıöşü]+/).filter(Boolean);
  const bulunan = [];
  for (const k of kelimeler) {
    if (sozluk[k] && !bulunan.some((b) => b.tr === k)) bulunan.push({ tr: k, en: sozluk[k] });
  }
  return bulunan;
}
