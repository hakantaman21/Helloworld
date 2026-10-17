// v0.24.0 Veri sözleşmesi: kaydın her yerde aynı kuralla denetlenmesi (açılış, geri yükleme, sekmeler arası eşitleme).
// Kaynak: boş kurulumun şablonu (gocler.js'in ürettiği) + şablonda boş görünen koleksiyonların öğe kuralları (EK).
// İki kip:
//   onar = false (geri yükleme): ilk uyumsuzlukta sorun döner, hiçbir şey değişmez → yedek reddedilir.
//   onar = true  (açılış): uyumsuz alan şablondaki değerle değiştirilir, bozuk öğe atılır; geri kalan veri korunur.
// Kural dili: şablondaki değerin türü beklenen türdür. null şablon "her tür olabilir" demektir.
// EK: dizi(öğe) · sozluk(değer) · 'metin' · 'nesne' · alt nesne kuralı ({ alan: kural }).

const tur = (x) => (Array.isArray(x) ? 'dizi' : x === null || x === undefined ? 'yok' : typeof x);
const dizi = (oge) => ({ tip: 'dizi', oge });
const sozluk = (deger) => ({ tip: 'sozluk', deger });
const NESNE = 'nesne';
const METIN = 'metin';

// Şablonda boş dizi/nesne olarak duran ya da sonradan (tembel) eklenen alanların öğe kuralları.
// Yeni bir koleksiyon eklendiğinde buraya bir satır eklenir; açılış ve geri yükleme kendiliğinden denetler.
export const EK = {
  hafiza: dizi(NESNE),
  itirazlar: dizi(NESNE),
  gorusmeler: dizi(NESNE),
  kayitliCumleler: dizi(NESNE),
  gunluk: sozluk(NESNE),
  aramaDurumu: sozluk(NESNE),
  tamamlananSenaryolar: sozluk(null),
  senaryoIst: sozluk(NESNE),
  destek: { kayitlar: dizi(NESNE) },
  demoArsivi: { hafiza: dizi(NESNE), gorusmeler: dizi(NESNE), gunluk: sozluk(NESNE) },
  rehber: { kutu: dizi(NESNE), durum: sozluk(NESNE), kullanim: sozluk(NESNE), gorulenIpucu: dizi(METIN), sonAramalar: dizi(METIN) },
  test: {
    sohbetler: sozluk({ mesajlar: dizi(NESNE) }),
    engelli: dizi(METIN), arkadaslar: dizi(METIN), sabitli: dizi(METIN), favoriler: dizi(METIN), takip: dizi(METIN),
    selamlar: dizi(METIN), begeniler: dizi(METIN), reddedilenIstekler: dizi(METIN),
    sikayetler: dizi(NESNE), anlar: dizi(NESNE), yorumlar: sozluk(dizi(NESNE)),
    duzeltmeler: sozluk(NESNE), istekler: sozluk(null), okundu: sozluk(null), arkadaslikZamani: sozluk(null),
  },
};

const kopya = (x) => (x === undefined ? undefined : JSON.parse(JSON.stringify(x)));

function kuralaUyar(deger, kural) {
  if (kural === null) return true;
  if (kural === NESNE) return tur(deger) === 'object';
  if (kural === METIN) return typeof deger === 'string';
  if (kural.tip === 'dizi') return tur(deger) === 'dizi';
  return tur(deger) === 'object'; // sozluk ya da alt nesne kuralı
}

// EK kuralını uygular. Dönen: sorun yolu (onar=false) ya da null.
function ekDenetle(deger, kural, yol, onar, sorunlar) {
  if (kural === null || kural === NESNE || kural === METIN) return;
  if (kural.tip === 'dizi') {
    const bozuk = deger.filter((x) => !kuralaUyar(x, kural.oge));
    if (bozuk.length) {
      sorunlar.push(`${yol}[]`);
      if (onar) { const temiz = deger.filter((x) => kuralaUyar(x, kural.oge)); deger.splice(0, deger.length, ...temiz); }
    }
    if (typeof kural.oge === 'object' && kural.oge) deger.forEach((x, i) => { if (kuralaUyar(x, kural.oge)) ekDenetle(x, kural.oge, `${yol}[${i}]`, onar, sorunlar); });
    return;
  }
  if (kural.tip === 'sozluk') {
    for (const [k, x] of Object.entries(deger)) {
      if (!kuralaUyar(x, kural.deger)) { sorunlar.push(`${yol}.${k}`); if (onar) delete deger[k]; continue; }
      if (kural.deger && typeof kural.deger === 'object') ekDenetle(x, kural.deger, `${yol}.${k}`, onar, sorunlar);
    }
    return;
  }
  // Alt nesne kuralı: yalnız var olan alanlar denetlenir (tembel alanlar yoksa sorun değildir).
  for (const [k, alt] of Object.entries(kural)) {
    if (!(k in deger) || deger[k] === undefined) continue;
    if (!kuralaUyar(deger[k], alt)) {
      sorunlar.push(`${yol}.${k}`);
      if (onar) { if (alt && alt.tip === 'dizi') deger[k] = []; else if (alt === METIN) deger[k] = ''; else deger[k] = {}; }
      continue;
    }
    ekDenetle(deger[k], alt, `${yol}.${k}`, onar, sorunlar);
  }
}

function sablonaGore(aday, sablon, ek, yol, onar, sorunlar) {
  for (const [k, s] of Object.entries(sablon)) {
    if (k === 'semaSurumu') continue;
    const altYol = yol ? `${yol}.${k}` : k;
    if (!(k in aday) || aday[k] === undefined) { aday[k] = kopya(s); continue; }
    const st = tur(s);
    const at = tur(aday[k]);
    // Basit alanda (metin/sayı/mantıksal) boş değer zararsızdır: kodlar boşu zaten karşılar. Sessizce şablona çekilir.
    if (at === 'yok' && st !== 'yok' && st !== 'object' && st !== 'dizi') { aday[k] = kopya(s); continue; }
    if (st !== 'yok' && at !== st) {
      sorunlar.push(altYol);
      if (!onar) return;
      aday[k] = kopya(s);
      continue;
    }
    if (at === 'yok') continue;
    const altEk = ek && typeof ek === 'object' && !ek.tip ? ek[k] : undefined;
    const altNesneKurali = altEk && typeof altEk === 'object' && !altEk.tip;
    // Alt nesne: şablon alanları ve EK'teki tembel alanlar özyinelemeyle; dizi/sözlük kuralları doğrudan.
    if (st === 'object' && (Object.keys(s).length || altNesneKurali)) sablonaGore(aday[k], s, altNesneKurali ? altEk : undefined, altYol, onar, sorunlar);
    else if (altEk !== undefined) ekDenetle(aday[k], altEk, altYol, onar, sorunlar);
    if (!onar && sorunlar.length) return;
  }
  // Şablonda olmayan ama EK'te kuralı olan (tembel) alanlar.
  if (ek && typeof ek === 'object' && !ek.tip) {
    for (const [k, alt] of Object.entries(ek)) {
      if (k in sablon || !(k in aday) || aday[k] === undefined) continue;
      const altYol = yol ? `${yol}.${k}` : k;
      if (!kuralaUyar(aday[k], alt)) { sorunlar.push(altYol); if (!onar) return; delete aday[k]; continue; }
      ekDenetle(aday[k], alt, altYol, onar, sorunlar);
      if (!onar && sorunlar.length) return;
    }
  }
}

// Döner: { sorunlar: ['profil', 'test.sohbetler.x', ...] }. onar=true ise aday yerinde düzeltilir.
export function sozlesmeDenetle(aday, sablon, onar) {
  const sorunlar = [];
  sablonaGore(aday, sablon, EK, '', onar, sorunlar);
  return { sorunlar };
}
