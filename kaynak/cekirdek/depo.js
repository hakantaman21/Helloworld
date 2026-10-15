// Tek durum deposu. Veri bu cihazda tutulur; ileride sunucu senkronu bunun üstüne eklenir.
// Kayıt bozulsa ya da tarayıcı depolamayı engellese bile uygulama bellekte çalışmaya devam eder.
import { GUNCEL_SEMA, gocler } from './gocler.js';
import { yayinla } from './olay-hatti.js';

const ANAHTAR = 'kk:veri';
const YEDEK_ANAHTARI = 'kk:yedek';
let veri = null;

function guvenliOku(anahtar) {
  try {
    const metin = localStorage.getItem(anahtar);
    return metin ? JSON.parse(metin) : null;
  } catch (hata) {
    return null;
  }
}

function guvenliYaz(anahtar, deger) {
  try {
    localStorage.setItem(anahtar, JSON.stringify(deger));
    return true;
  } catch (hata) {
    return false;
  }
}

function goc(ham) {
  let surum = (ham && ham.semaSurumu) || 0;
  if (surum >= GUNCEL_SEMA) return ham;
  if (ham) guvenliYaz(YEDEK_ANAHTARI, ham);
  let sonuc = ham;
  for (let s = surum + 1; s <= GUNCEL_SEMA; s++) sonuc = gocler[s](sonuc);
  sonuc.semaSurumu = GUNCEL_SEMA;
  return sonuc;
}

export function yukle() {
  veri = goc(guvenliOku(ANAHTAR));
  guvenliYaz(ANAHTAR, veri);
  return veri;
}

export function al() {
  return veri;
}

export function degistir(fn) {
  fn(veri);
  guvenliYaz(ANAHTAR, veri);
  yayinla('depo:degisti', veri);
}

export function sifirla() {
  try {
    localStorage.removeItem(ANAHTAR);
  } catch (hata) {
    // depolama kapalıysa bellekteki veri yine de sıfırlanır
  }
  veri = goc(null);
  guvenliYaz(ANAHTAR, veri);
  yayinla('depo:degisti', veri);
}

export function disaAktarMetni() {
  return JSON.stringify(veri, null, 2);
}
