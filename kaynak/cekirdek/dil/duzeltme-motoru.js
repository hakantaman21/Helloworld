// Demo düzeltme motoru: Türk öğrencilerin en sık yaptığı hataları kurallarla yakalar.
// Gerçek AI koç bağlanınca düzeltmeler oradan gelir; bu motor çevrimdışı yedek olarak kalır.
// Her kural, cümlenin yalnız o hatası düzeltilmiş halini döndürür. Açıklamalar metin tablosundadır (duzeltme.*).
// Not: kesme işareti için regex içinde \x27 kullanılır (robotun metin taraması tırnakla karışmasın diye).

const AP = '[\\x27\\u2019]';

const GECMIS = {
  go: 'went', goes: 'went', eat: 'ate', eats: 'ate', buy: 'bought', buys: 'bought', have: 'had', has: 'had',
  see: 'saw', sees: 'saw', take: 'took', takes: 'took', come: 'came', comes: 'came', get: 'got', gets: 'got',
  make: 'made', makes: 'made', drink: 'drank', drinks: 'drank', meet: 'met', meets: 'met', pay: 'paid', pays: 'paid',
  sleep: 'slept', drive: 'drove', write: 'wrote', speak: 'spoke', find: 'found', give: 'gave', leave: 'left',
  feel: 'felt', do: 'did', does: 'did', visit: 'visited', watch: 'watched', play: 'played', work: 'worked',
  cook: 'cooked', walk: 'walked', study: 'studied', stay: 'stayed', call: 'called', want: 'wanted', like: 'liked',
  need: 'needed', travel: 'traveled', is: 'was', am: 'was', are: 'were', wake: 'woke', run: 'ran', swim: 'swam',
};

const YALIN = {
  went: 'go', ate: 'eat', bought: 'buy', had: 'have', saw: 'see', took: 'take', came: 'come', got: 'get',
  made: 'make', drank: 'drink', met: 'meet', paid: 'pay', slept: 'sleep', drove: 'drive', wrote: 'write',
  spoke: 'speak', found: 'find', gave: 'give', left: 'leave', felt: 'feel', did: 'do', visited: 'visit',
  watched: 'watch', played: 'play', worked: 'work', cooked: 'cook', walked: 'walk', studied: 'study',
  stayed: 'stay', called: 'call', wanted: 'want', liked: 'like', needed: 'need', woke: 'wake', ran: 'run',
};

const UCUNCU_FIILLER = ['go', 'want', 'like', 'work', 'live', 'have', 'do', 'eat', 'drink', 'play', 'watch', 'need',
  'love', 'study', 'read', 'make', 'take', 'get', 'come', 'know', 'think', 'speak', 'cook', 'drive', 'wake', 'sleep'];

function ucuncuTekilHali(fiil) {
  if (fiil === 'have') return 'has';
  if (fiil === 'do') return 'does';
  if (fiil === 'go') return 'goes';
  if (/(ch|sh|ss|x)$/.test(fiil)) return fiil + 'es';
  if (/[^aeiou]y$/.test(fiil)) return fiil.slice(0, -1) + 'ies';
  return fiil + 's';
}

const GECMIS_ISARETI = /\b(yesterday|last (night|week|month|year|weekend|monday|tuesday|wednesday|thursday|friday|saturday|sunday)|ago)\b/i;
// Cümleyi yan cümlelere böler; geçmiş zaman işareti yalnız geçtiği yan cümleyi etkiler.
const AYIRAC = /(\s*(?:,|;|\band\b|\bbut\b|\bso\b|\bbecause\b|\bthen\b)\s*)/i;
function yanCumlelerde(c, fn) {
  return c.split(AYIRAC).map((parca, i) => (i % 2 === 1 ? parca : fn(parca))).join('');
}

const OZNE = '(I|we|you|they|he|she|it|my (?:mother|father|mom|dad|friend|brother|sister|wife|husband|son|daughter|boss|teacher))';

const ING_YALIN = { going: 'go', eating: 'eat', drinking: 'drink', buying: 'buy', having: 'have', doing: 'do', seeing: 'see', getting: 'get', taking: 'take', watching: 'watch', playing: 'play' };

export const KURALLAR = [
  {
    id: 'gecmis-zaman',
    aciklama: 'duzeltme.gecmisZaman',
    uygula(cumle) {
      return yanCumlelerde(cumle, (c) => {
      if (!GECMIS_ISARETI.test(c)) return c;
      const desen = new RegExp(`(?<!\\b(?:did|do|does|didn${AP}t|can|will|would|could|should|must|might|let|to)\\s)\\b${OZNE}\\s+(\\w+)\\b`, 'gi');
      return c.replace(desen, (tum, ozne, fiil) => {
        const gecmis = GECMIS[fiil.toLowerCase()];
        if (!gecmis) return tum;
        if (/^(am|is|are)$/i.test(fiil)) {
          const tekil = /^(I|he|she|it)$/i.test(ozne) || /^my /i.test(ozne);
          return `${ozne} ${tekil ? 'was' : 'were'}`;
        }
        return `${ozne} ${gecmis}`;
      });
      });
    },
  },
  {
    id: 'did-yalin',
    aciklama: 'duzeltme.didGecmis',
    uygula(c) {
      return c.replace(new RegExp(`\\b(didn${AP}t|did not|did)\\s+(\\w+)\\b`, 'gi'), (tum, did, fiil) => {
        const yalin = YALIN[fiil.toLowerCase()];
        return yalin ? `${did} ${yalin}` : tum;
      });
    },
  },
  {
    id: 'ucuncu-tekil',
    aciklama: 'duzeltme.ucuncuTekil',
    uygula(cumle) {
      return yanCumlelerde(cumle, (c) => {
      if (GECMIS_ISARETI.test(c)) return c;
      const desen = new RegExp(`(?<!\\b(?:does|did|can|will|would|could|should|must|might|let|to|make|makes|help|helps)\\s)\\b(he|she|it|my (?:mother|father|mom|dad|friend|brother|sister|wife|husband|son|daughter|boss|teacher))\\s+(${UCUNCU_FIILLER.join('|')})\\b`, 'gi');
      return c.replace(desen, (tum, ozne, fiil) => `${ozne} ${ucuncuTekilHali(fiil.toLowerCase())}`);
      });
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
