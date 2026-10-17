// Tek durum deposu. Veri bu cihazda tutulur; ileride sunucu senkronu bunun üstüne eklenir.
// Kayıt bozulsa ya da tarayıcı depolamayı engellese bile uygulama bellekte çalışmaya devam eder.
import { GUNCEL_SEMA, gocler } from './gocler.js';
import { yayinla } from './olay-hatti.js';
import { sozlesmeDenetle } from './veri-sozlesmesi.js';

const ANAHTAR = 'kk:veri';
const YEDEK_ANAHTARI = 'kk:yedek';
let veri = null;
// v0.24.0 Sekmeler arası tutarlılık: diske en son yazdığımız/okuduğumuz metin. Diskteki metin farklıysa başka bir
// sekme yazmıştır; değişiklik o güncel veriye uygulanır (son yazan öncekinin değişikliğini ezmez).
let sonMetin = null;

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
    const metin = JSON.stringify(deger);
    localStorage.setItem(anahtar, metin);
    if (anahtar === ANAHTAR) sonMetin = metin;
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

// v0.24.0 Açılış onarımı: sürümü güncel olsa da kayıt sözleşmeye göre denetlenir. Uyumsuz alan şablondaki değerle
// değiştirilir, geri kalan veri korunur; onarımdan önceki ham kayıt kk:bozuk altına saklanır ve kullanıcıya söylenir.
let onarildi = false;
function okuVeOnar(ham) {
  let okunan = null;
  if (ham) {
    try { okunan = JSON.parse(ham); } catch { guvenliYazHam(BOZUK_ANAHTARI, ham); bozukKurtarildi = true; }
  }
  if (okunan !== null && (typeof okunan !== 'object' || Array.isArray(okunan))) { guvenliYazHam(BOZUK_ANAHTARI, ham); bozukKurtarildi = true; okunan = null; }
  let sonuc;
  try { sonuc = goc(okunan); } catch { if (ham) { guvenliYazHam(BOZUK_ANAHTARI, ham); bozukKurtarildi = true; } sonuc = goc(null); }
  const { sorunlar } = sozlesmeDenetle(sonuc, goc(null, false), true);
  if (sorunlar.length) {
    if (ham) guvenliYazHam(BOZUK_ANAHTARI, ham);
    onarildi = true;
    console.warn('[depo] onarim', sorunlar.slice(0, 20));
  }
  return sonuc;
}

export function yukle() {
  // v0.13.0: kayıt okunamıyorsa (bozuk JSON) sessizce silinmez; ham metin kk:bozuk altına saklanır ve kullanıcıya söylenir.
  let ham = null;
  try { ham = localStorage.getItem(ANAHTAR); } catch { ham = null; }
  veri = okuVeOnar(ham);
  sonMetin = ham;
  guvenliYaz(ANAHTAR, veri);
  sekmeEsitlemeBaslat();
  return veri;
}

// Başka sekme kaydı değiştirdiyse bu sekmedeki veri de yenilenir ve ekran yeniden çizilir.
let esitlemeKuruldu = false;
function sekmeEsitlemeBaslat() {
  if (esitlemeKuruldu || typeof window === 'undefined' || typeof window.addEventListener !== 'function') return;
  esitlemeKuruldu = true;
  // Olaydaki değer değil, diskin ŞU ANKİ hali okunur: olaylar gecikmeli ve sırayla gelir, eski bir değeri benimsemek
  // yeni yazılmış değişikliği geri alırdı. Ekran burada yeniden çizilmez (çizim kullanım izi yazar; iki sekme birbirini
  // sonsuza dek tetiklerdi); veri bellekte günceldir, bir sonraki ekranda ve her yazmada görünür.
  window.addEventListener('storage', (e) => {
    if (e.key !== ANAHTAR) return;
    if (diskiDenetle()) yayinla('depo:degisti', veri);
  });
}
function diskiBenimse(metin) {
  try { veri = okuVeOnar(metin); sonMetin = metin; } catch { /* okunamadı: bellekteki veriyle devam */ }
}
function diskiDenetle() {
  let disk;
  try { disk = localStorage.getItem(ANAHTAR); } catch { return false; }
  if (disk === null || sonMetin === null || disk === sonMetin) return false;
  diskiBenimse(disk);
  return true;
}

function guvenliYazHam(anahtar, metin) {
  try { localStorage.setItem(anahtar, metin); return true; } catch { return false; }
}

// Açılışta bozuk kayıt bulunduysa bir kez true döner (main.js duyurur).
export function bozukKayitVardi() { const v = bozukKurtarildi; bozukKurtarildi = false; return v; }
// Açılışta kayıt onarıldıysa bir kez true döner (bozuk alanlar şablondan tamamlandı; ham kayıt kk:bozuk'ta).
export function kayitOnarildi() { const v = onarildi && !bozukKurtarildi; onarildi = false; return v; }

export function al() {
  return veri;
}

export function degistir(fn) {
  diskiDenetle();
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
// v0.24.0: aynı kural iç içe koleksiyonlara da uygulanır (veri-sozlesmesi.js); açılış onarımıyla ortak sözleşme.
const tur = (x) => (Array.isArray(x) ? 'dizi' : x === null || x === undefined ? 'yok' : typeof x);
function dogrula(aday) {
  const p = aday.profil;
  if (tur(p) !== 'object' || tur(p.ayarlar) !== 'object' || typeof p.kurulumTamam !== 'boolean') return 'eksik';
  const { sorunlar } = sozlesmeDenetle(aday, goc(null, false), false);
  return sorunlar.length ? 'bicim' : null;
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
