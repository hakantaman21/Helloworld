// Y16: Arayüz metinleri koda yazılmaz; hepsi metinler/ klasöründeki tablolardan gelir.
// Y25: Her tablo aynı anahtarları taşır. Yeni arayüz dili = yeni bir tablo + DILLER listesine bir satır.
import tr from '../metinler/tr.js';
import en from '../metinler/en.js';

const TABLOLAR = { en, tr };
export const ARAYUZ_DILLERI = ['en', 'tr'];
const VARSAYILAN = 'en';

let dil = VARSAYILAN;

// Tarayıcının diline göre ilk arayüz dili; desteklenmiyorsa İngilizce.
export function tarayiciDili() {
  const tercih = (navigator.languages || [navigator.language || VARSAYILAN]).map((d) => String(d).slice(0, 2).toLowerCase());
  return tercih.find((d) => ARAYUZ_DILLERI.includes(d)) || VARSAYILAN;
}

export function dilAyarla(yeni) {
  dil = ARAYUZ_DILLERI.includes(yeni) ? yeni : VARSAYILAN;
  document.documentElement.lang = dil;
}

export function aktifDil() {
  return dil;
}

function bul(tablo, anahtar) {
  let deger = tablo;
  for (const p of anahtar.split('.')) deger = deger == null ? undefined : deger[p];
  return deger;
}

export function t(anahtar, degerler) {
  let deger = bul(TABLOLAR[dil], anahtar);
  if (deger === undefined) deger = bul(TABLOLAR[VARSAYILAN], anahtar);
  if (deger === undefined) {
    console.warn('[metin] eksik anahtar:', anahtar);
    return anahtar;
  }
  if (typeof deger !== 'string' || !degerler) return deger;
  return deger.replace(/\{(\w+)\}/g, (_, ad) => (degerler[ad] !== undefined ? String(degerler[ad]) : `{${ad}}`));
}

// İçerik verisindeki çok dilli alanlar ({ tr, en }) için: aktif dil, yoksa İngilizce, yoksa ilk bulunan.
export function yerel(deger) {
  if (deger == null || typeof deger !== 'object') return deger;
  return deger[dil] || deger[VARSAYILAN] || Object.values(deger)[0];
}
