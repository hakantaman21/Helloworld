// v0.16.0 Topluluk kuralları (Hakan, 17.10.2026): kişiler birbirini rahatsız etmesin; sohbet karşılıklıysa sürsün.
// Saf işlevler: yalnız mesaj listesine ve zamana bakar, hiçbir şey yazmaz. Bugün test sohbetlerinde cihazda uygulanır;
// gerçek topluluk açılınca AYNI kurallar sunucuda da uygulanmalıdır (istemci tarafı kural tek başına aşılabilir).
//
// 1. Yanıtsız mesaj sınırı: karşı taraf yanıt vermeden art arda en çok YANITSIZ_SINIR mesaj. Sonra yanıt beklenir;
//    yanıt gelmezse haftada bir mesaj daha gönderilebilir.
// 2. Fotoğraf: iki taraf da en az FOTO_KARSILIKLI mesaj yazdıktan sonra.
// 3. İletişim bilgisi (telefon numarası, e-posta): sohbet en az ILETISIM_GUN gün sürdükten ve iki taraf da en az
//    ILETISIM_KARSILIKLI mesaj yazdıktan sonra. Öncesinde bu tür mesaj gönderilmez, nedeni söylenir.

export const YANITSIZ_SINIR = 5;
export const GUN = 86400000;
export const YANITSIZ_BEKLEME = 7 * GUN;
export const FOTO_KARSILIKLI = 5;
export const ILETISIM_GUN = 7;
export const ILETISIM_KARSILIKLI = 10;

// Son gelen mesajdan bu yana art arda gönderilen mesaj sayısı.
export function yanitsizSayisi(mesajlar) {
  let n = 0;
  for (let i = mesajlar.length - 1; i >= 0 && mesajlar[i].kim === 'ben'; i -= 1) n += 1;
  return n;
}

// { izin, kalan } ya da { izin: false, acilis } (bir sonraki mesajın gönderilebileceği an).
export function mesajIzni(mesajlar, simdi = Date.now()) {
  const n = yanitsizSayisi(mesajlar);
  if (n < YANITSIZ_SINIR) return { izin: true, kalan: YANITSIZ_SINIR - n };
  const acilis = mesajlar[mesajlar.length - 1].zaman + YANITSIZ_BEKLEME;
  return simdi >= acilis ? { izin: true, kalan: 1, haftalik: true } : { izin: false, acilis };
}

// İki tarafın da yazdığı mesaj sayısının küçüğü ("karşılıklı mesaj").
export function karsilikliSayi(mesajlar) {
  let ben = 0;
  let o = 0;
  for (const m of mesajlar) { if (m.kim === 'ben') ben += 1; else if (m.kim === 'o') o += 1; }
  return Math.min(ben, o);
}

export function fotoIzni(mesajlar) {
  const n = karsilikliSayi(mesajlar);
  return { izin: n >= FOTO_KARSILIKLI, n, gerekli: FOTO_KARSILIKLI };
}

// Telefon: en az 7 rakam (boşluk, tire, nokta, parantez ve + ayırıcı olabilir). E-posta: ad@alan.uzanti.
const TELEFON = /(?:\+?\d[\s().-]*){7,}/;
const EPOSTA = /[^\s@]+@[^\s@]+\.[a-z]{2,}/i;
export function iletisimBilgisiVar(metin) {
  return TELEFON.test(String(metin)) || EPOSTA.test(String(metin));
}

// baslangic: sohbetin ilk mesajının zamanı (eski mesajlar listeden düşse de saklanır).
export function iletisimIzni(mesajlar, baslangic, simdi = Date.now()) {
  const ilk = baslangic || (mesajlar[0] && mesajlar[0].zaman) || simdi;
  const acilis = ilk + ILETISIM_GUN * GUN;
  const n = karsilikliSayi(mesajlar);
  return { izin: simdi >= acilis && n >= ILETISIM_KARSILIKLI, acilis, n, gerekli: ILETISIM_KARSILIKLI, kalanGun: Math.max(0, Math.ceil((acilis - simdi) / GUN)) };
}
