// Modül sözleşmesi: her modül kimlik, sürüm, stil öneki, şema sürümü ve ekranlarını bildirir.
// Bir modül bayrakla kapatılırsa ekranları kaydedilmez; uygulama diğerleriyle çalışmaya devam eder.

// Y18: her ekran dört hali tanımlamak zorundadır.
export const DORT_DURUM = ['bos', 'yukleniyor', 'hata', 'cevrimdisi'];

const ekranlar = {};
const moduller = [];

export function ekran(tanim) {
  for (const d of DORT_DURUM) {
    if (!tanim.durumlar || !tanim.durumlar.includes(d)) throw new Error(`ekran durumu eksik: ${d}`);
  }
  if (typeof tanim.ciz !== 'function') throw new Error('ekranda ciz() yok');
  return tanim;
}

export function kaydet(modul, kapaliModuller = []) {
  for (const alan of ['kimlik', 'surum', 'onek', 'semaSurumu', 'ekranlar']) {
    if (modul[alan] === undefined) throw new Error(`modul sozlesmesi eksik: ${alan}`);
  }
  if (kapaliModuller.includes(modul.kimlik)) return;
  moduller.push(modul);
  for (const id of Object.keys(modul.ekranlar)) {
    if (ekranlar[id]) throw new Error(`ayni ekran iki kez kayitli: ${id}`);
    ekranlar[id] = { ...modul.ekranlar[id], modul: modul.kimlik };
  }
}

export function ekranAl(id) {
  return ekranlar[id] || null;
}

export function kayitliModuller() {
  return moduller.map((m) => ({ kimlik: m.kimlik, surum: m.surum }));
}
