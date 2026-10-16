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

function goc(ham, yedekle = true) {
  let surum = (ham && ham.semaSurumu) || 0;
  if (surum >= GUNCEL_SEMA) return ham;
  if (ham && yedekle) guvenliYaz(YEDEK_ANAHTARI, ham);
  let sonuc = ham;
  for (let s = surum + 1; s <= GUNCEL_SEMA; s++) sonuc = gocler[s](sonuc);
  sonuc.semaSurumu = GUNCEL_SEMA;
  return sonuc;
}

const BOZUK_ANAHTARI = 'kk:bozuk';
let bozukKurtarildi = false;

export function yukle() {
  // v0.13.0: kayıt okunamıyorsa (bozuk JSON) sessizce silinmez; ham metin kk:bozuk altına saklanır ve kullanıcıya söylenir.
  let ham = null;
  try { ham = localStorage.getItem(ANAHTAR); } catch { ham = null; }
  let okunan = null;
  if (ham) {
    try { okunan = JSON.parse(ham); } catch { guvenliYazHam(BOZUK_ANAHTARI, ham); bozukKurtarildi = true; }
  }
  veri = goc(okunan);
  guvenliYaz(ANAHTAR, veri);
  return veri;
}

function guvenliYazHam(anahtar, metin) {
  try { localStorage.setItem(anahtar, metin); return true; } catch { return false; }
}

// Açılışta bozuk kayıt bulunduysa bir kez true döner (main.js duyurur).
export function bozukKayitVardi() { const v = bozukKurtarildi; bozukKurtarildi = false; return v; }

export function al() {
  return veri;
}

export function degistir(fn) {
  fn(veri);
  // v0.13.0: yazma başarısızsa (kota dolu, depolama kapalı) sessiz kalınmaz; ekran "kaydedilemedi" der.
  if (!guvenliYaz(ANAHTAR, veri)) yayinla('depo:yazilamadi', null);
  yayinla('depo:degisti', veri);
}

export function sifirla() {
  try {
    // "Verileri sil": ana kayıt, göç yedeği ve bozuk kayıt kopyası birlikte silinir (başka uygulamaların anahtarlarına dokunulmaz).
    [ANAHTAR, YEDEK_ANAHTARI, BOZUK_ANAHTARI].forEach((a) => localStorage.removeItem(a));
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

// v0.13.0 Geri yükleme: dışa aktarılan JSON doğrulanır, göçten geçirilir ve kaydedilir. Başarısızsa mevcut veri değişmez.
// v0.16.0 Doğrulama: göçten sonra veri, boş kurulumun şablonuyla karşılaştırılır. Zorunlu alan yoksa ya da bir alanın
// türü şablondan farklıysa (dizi yerine nesne gibi) yedek reddedilir; zararsız eksikler şablondan tamamlanır.
const tur = (x) => (Array.isArray(x) ? 'dizi' : x === null || x === undefined ? 'yok' : typeof x);
function sablonaUydur(aday, sablon) {
  for (const [k, v] of Object.entries(sablon)) {
    if (k === 'semaSurumu') continue;
    if (!(k in aday) || aday[k] === undefined) { aday[k] = v; continue; }
    const a = tur(aday[k]); const s = tur(v);
    if (a !== 'yok' && s !== 'yok' && a !== s) return false;
  }
  return true;
}
function dogrula(aday) {
  const p = aday.profil;
  if (tur(p) !== 'object' || tur(p.ayarlar) !== 'object' || typeof p.kurulumTamam !== 'boolean') return 'eksik';
  const sablon = goc(null, false);
  if (!sablonaUydur(aday, sablon) || !sablonaUydur(p, sablon.profil) || !sablonaUydur(p.ayarlar, sablon.profil.ayarlar)) return 'bicim';
  if (!['gorusmeler', 'hafiza', 'itirazlar'].every((k) => aday[k].every((x) => tur(x) === 'object'))) return 'bicim';
  return null;
}

// v0.16.0 İki aşamalı geri yükleme: önce hazırla (hiçbir şey yazılmaz), sonra uygula. Ayarlar ekranı fotoğrafları
// yalnız hazırlık başarılıysa yazar; böylece reddedilen bir yedek fotoğraf deposuna da dokunmaz.
export function iceAktarHazirla(metin) {
  let aday;
  try { aday = JSON.parse(metin); } catch { return { tamam: false, neden: 'json' }; }
  if (!aday || typeof aday !== 'object' || Array.isArray(aday) || !aday.profil || typeof aday.profil !== 'object' || !(aday.semaSurumu >= 1)) return { tamam: false, neden: 'bicim' };
  if ((aday.semaSurumu || 0) > GUNCEL_SEMA) return { tamam: false, neden: 'yeni' };
  const medya = aday.medya && typeof aday.medya === 'object' ? aday.medya : null;
  delete aday.medya;
  let yeni;
  try { yeni = goc(JSON.parse(JSON.stringify(aday)), false); } catch { return { tamam: false, neden: 'bicim' }; }
  const sorun = dogrula(yeni);
  if (sorun) return { tamam: false, neden: sorun };
  return { tamam: true, veri: yeni, medya };
}

export function iceAktarUygula(hazir) {
  if (!hazir || !hazir.tamam) return { tamam: false, neden: (hazir && hazir.neden) || 'bicim' };
  if (!guvenliYaz(ANAHTAR, hazir.veri)) return { tamam: false, neden: 'yazma' };
  veri = hazir.veri;
  yayinla('depo:degisti', veri);
  return { tamam: true };
}

export function iceAktar(metin) {
  return iceAktarUygula(iceAktarHazirla(metin));
}
