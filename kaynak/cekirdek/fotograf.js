// Profil fotoğrafları: telefondan seçilen ya da çekilen resim cihazda küçültülür (en uzun kenar 480 px, JPEG)
// ve yalnız bu cihazda saklanır; sunucuya gönderilmez. En çok FOTO_SINIRI fotoğraf.
// v0.14.0: resimler localStorage'da değil IndexedDB'de durur (kota). Profilde yalnız "mdy:<kimlik>" başvurusu tutulur;
// açılışta hepsi belleğe alınır (medyaHazirla), ekran fotoAdresi() ile çizer. IndexedDB yoksa eski yol (veri adresi) sürer.
import { al, degistir } from './depo.js';

const DB_ADI = 'helloworld-medya';
const DEPO = 'foto';
const ONEK = 'mdy:';
const onbellek = new Map();
let db = null;

function dbAc() {
  return new Promise((coz) => {
    try {
      if (!window.indexedDB) { coz(null); return; }
      const istek = indexedDB.open(DB_ADI, 1);
      istek.onupgradeneeded = () => istek.result.createObjectStore(DEPO);
      istek.onsuccess = () => coz(istek.result);
      istek.onerror = () => coz(null);
      istek.onblocked = () => coz(null);
    } catch { coz(null); }
  });
}
function islem(kip, fn) {
  return new Promise((coz) => {
    if (!db) { coz(null); return; }
    try {
      const tx = db.transaction(DEPO, kip);
      const sonuc = fn(tx.objectStore(DEPO));
      tx.oncomplete = () => coz(sonuc && 'result' in sonuc ? sonuc.result : true);
      tx.onerror = () => coz(null);
      tx.onabort = () => coz(null);
    } catch { coz(null); }
  });
}
async function medyaYaz(veri) {
  const kimlik = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
  const tamam = await islem('readwrite', (d) => d.put(veri, kimlik));
  if (!tamam) return veri;
  onbellek.set(kimlik, veri);
  return ONEK + kimlik;
}

// Ekranda <img src> için: başvuruyu gerçek resme çevirir.
export function fotoAdresi(ref) {
  if (!ref) return '';
  return String(ref).startsWith(ONEK) ? (onbellek.get(String(ref).slice(ONEK.length)) || '') : ref;
}

// Açılışta (arka planda): IndexedDB'yi aç, resimleri belleğe al, profildeki eski veri adreslerini taşı.
// Döner: ekranda gösterilecek bir başvurulu fotoğraf varsa true (çağıran açık ekranı yeniler).
export async function medyaHazirla() {
  const bekle = new Promise((coz) => setTimeout(coz, 4000));
  await Promise.race([(async () => {
    db = await dbAc();
    if (!db) return;
    await new Promise((coz) => {
      try {
        const tx = db.transaction(DEPO, 'readonly');
        const imlec = tx.objectStore(DEPO).openCursor();
        imlec.onsuccess = () => { const c = imlec.result; if (c) { onbellek.set(c.key, c.value); c.continue(); } else coz(); };
        imlec.onerror = () => coz();
      } catch { coz(); }
    });
    const p = al().profil;
    const eskiler = (p.fotograflar || []).filter((f) => String(f).startsWith('data:'));
    if (!eskiler.length && !String(p.foto || '').startsWith('data:')) return;
    const harita = new Map();
    for (const f of new Set([...eskiler, ...(String(p.foto || '').startsWith('data:') ? [p.foto] : [])])) harita.set(f, await medyaYaz(f));
    degistir((v) => {
      v.profil.fotograflar = (v.profil.fotograflar || []).map((f) => harita.get(f) || f);
      if (harita.has(v.profil.foto)) v.profil.foto = harita.get(v.profil.foto);
    });
  })(), bekle]);
  // v0.16.0: hiçbir kayıtta geçmeyen (silinmiş gönderi, değiştirilen kapak…) resimler depodan da silinir.
  await yetimleriSil();
  return [...tumBasvurular()].some((k) => onbellek.has(k));
}

// v0.16.0 Verinin tamamında (profil, kapak, Dil Anları gönderileri, mesajlar) geçen "mdy:" başvurularının kimlikleri.
export function tumBasvurular(kok = al()) {
  const kume = new Set();
  const gez = (x) => {
    if (typeof x === 'string') { if (x.startsWith(ONEK)) kume.add(x.slice(ONEK.length)); return; }
    if (Array.isArray(x)) { x.forEach(gez); return; }
    if (x && typeof x === 'object') Object.values(x).forEach(gez);
  };
  gez(kok);
  return kume;
}

async function yetimleriSil() {
  if (!db) return;
  const kullanilan = tumBasvurular();
  for (const kimlik of [...onbellek.keys()]) {
    if (kullanilan.has(kimlik)) continue;
    if (await islem('readwrite', (d) => d.delete(kimlik))) onbellek.delete(kimlik);
  }
}

// Yedek için: başvuruların resimleri { kimlik: veri } olarak.
export function medyaDisaAktar() {
  // v0.16.0: yalnız profil değil, kapak, gönderi ve mesaj fotoğrafları da yedeğe girer.
  const sonuc = {};
  for (const kimlik of tumBasvurular()) if (onbellek.has(kimlik)) sonuc[kimlik] = onbellek.get(kimlik);
  return sonuc;
}
export async function medyaIceAktar(medya) {
  for (const [kimlik, veri] of Object.entries(medya || {})) {
    if (typeof veri !== 'string' || !veri.startsWith('data:image/')) continue;
    if (await islem('readwrite', (d) => d.put(veri, kimlik))) onbellek.set(kimlik, veri);
  }
}
// "Verileri sil": tüm resimler de silinir.
export async function medyaSil() {
  onbellek.clear();
  await islem('readwrite', (d) => d.clear());
}

export const FOTO_SINIRI = 6;
const EN_UZUN_KENAR = 480;
const EN_BUYUK_BOYUT = 220 * 1024;

function dosyaSec() {
  return new Promise((coz) => {
    const girdi = document.createElement('input');
    girdi.type = 'file';
    girdi.accept = 'image/*';
    girdi.addEventListener('change', () => coz(girdi.files && girdi.files[0] ? girdi.files[0] : null), { once: true });
    girdi.click();
  });
}

async function kucult(dosya) {
  const resim = await new Promise((coz, red) => {
    const adres = URL.createObjectURL(dosya);
    const r = new Image();
    r.onload = () => { URL.revokeObjectURL(adres); coz(r); };
    r.onerror = () => { URL.revokeObjectURL(adres); red(new Error('resim')); };
    r.src = adres;
  });
  const oran = Math.min(1, EN_UZUN_KENAR / Math.max(resim.naturalWidth, resim.naturalHeight));
  const tuval = document.createElement('canvas');
  tuval.width = Math.round(resim.naturalWidth * oran);
  tuval.height = Math.round(resim.naturalHeight * oran);
  tuval.getContext('2d').drawImage(resim, 0, 0, tuval.width, tuval.height);
  let kalite = 0.82;
  let veri = tuval.toDataURL('image/jpeg', kalite);
  while (veri.length > EN_BUYUK_BOYUT && kalite > 0.4) { kalite -= 0.12; veri = tuval.toDataURL('image/jpeg', kalite); }
  return veri;
}

// Döner: 'eklendi' | 'vazgecti' | 'sinir' | 'hata'
export async function fotografEkle({ profilYap = false } = {}) {
  const p = al().profil;
  if ((p.fotograflar || []).length >= FOTO_SINIRI && !profilYap) return 'sinir';
  const dosya = await dosyaSec();
  if (!dosya) return 'vazgecti';
  try {
    const veri = await medyaYaz(await kucult(dosya));
    degistir((v) => {
      const liste = (v.profil.fotograflar || []).slice(0, FOTO_SINIRI - 1);
      v.profil.fotograflar = [veri, ...liste];
      if (profilYap || !v.profil.foto) v.profil.foto = veri;
    });
    return 'eklendi';
  } catch {
    return 'hata';
  }
}

export function profilFotografiYap(veri) {
  degistir((v) => { v.profil.foto = veri; });
}

export function fotografSil(veri) {
  if (String(veri).startsWith(ONEK)) { const k = String(veri).slice(ONEK.length); onbellek.delete(k); islem('readwrite', (d) => d.delete(k)); }
  degistir((v) => {
    v.profil.fotograflar = (v.profil.fotograflar || []).filter((f) => f !== veri);
    if (v.profil.foto === veri) v.profil.foto = v.profil.fotograflar[0] || null;
  });
}

// v0.15.0 Dil Anları için çoklu fotoğraf: birden çok resim seçilir, her biri küçültülüp medya deposuna yazılır.
// Döner: başvuru listesi (mdy:… ya da depo yoksa veri adresi). En çok `sinir` resim.
export function dosyalarSec() {
  return new Promise((coz) => {
    const girdi = document.createElement('input');
    girdi.type = 'file';
    girdi.accept = 'image/*';
    girdi.multiple = true;
    girdi.addEventListener('change', () => coz(girdi.files ? [...girdi.files] : []), { once: true });
    girdi.click();
  });
}
export async function fotograflarEkle(sinir = 9) {
  const dosyalar = (await dosyalarSec()).slice(0, sinir);
  const sonuc = [];
  for (const d of dosyalar) {
    try { sonuc.push(await medyaYaz(await kucult(d))); } catch { /* açılamayan resim atlanır */ }
  }
  return sonuc;
}
