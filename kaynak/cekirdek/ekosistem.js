// v0.20.0 Uygulama ailesi ve çapraz indirim.
// - helloworld'de ücretli üye (paketinde "ekosistemIndirimi" olan) English Prime ve Yoldaş'ta indirim teklifi görür.
// - English Prime ya da Yoldaş'ta ücretli üye olan helloworld paketlerinde indirimli fiyat görür.
// Diğer uygulamanın üyeliği şimdilik iki yoldan bilinir: (1) aynı alan adındaki uygulamaların ortak kaydı
// (PAYLASIM_ANAHTARI), (2) düzenleme modundaki TEST anahtarı. İndirim ödeme bağlanana kadar yalnız gösterilir.
import { al, degistir } from './depo.js';
import { dinle } from './olay-hatti.js';
import { UYGULAMALAR, PAYLASIM_ANAHTARI, VARSAYILAN_INDIRIM } from '../veri/ekosistem.js';
import { aktifPaketKimligi, ozellikVar } from './paketler.js';

const BEN = 'helloworld';
function ayar() { const e = (al().profil.ayarlar || {}).ekosistem || {}; return { adresler: {}, indirim: VARSAYILAN_INDIRIM, test: {}, ...e }; }
function ayarla(fn) { degistir((v) => { const e = JSON.parse(JSON.stringify(ayar())); fn(e); v.profil.ayarlar.ekosistem = e; }); }

const indirimOrani = () => Math.max(0, Math.min(50, Number(ayar().indirim) || 0));
function adres(kimlik) {
  const a = String(ayar().adresler[kimlik] || '').trim();
  return /^https:\/\/[^\s]+$/i.test(a) || /^http:\/\/localhost[^\s]*$/i.test(a) ? a : '';
}
function adresAyarla(kimlik, deger) { ayarla((e) => { e.adresler[kimlik] = String(deger || '').trim(); }); }
function indirimAyarla(n) { ayarla((e) => { e.indirim = Math.max(0, Math.min(50, Math.round(Number(n) || 0))); }); }
function testUyelikAyarla(kimlik, acik) { ayarla((e) => { e.test[kimlik] = Boolean(acik); }); }

function paylasimiOku() { try { return JSON.parse(localStorage.getItem(PAYLASIM_ANAHTARI) || '{}') || {}; } catch { return {}; } }
// Benim üyeliğimi ortak kayda yazar (diğer uygulamalar okuyabilsin). Ücretsizse kayıt silinir.
function uyeligimiYayinla() {
  try {
    const k = paylasimiOku();
    const p = aktifPaketKimligi();
    const yeni = { ...k };
    if (p === 'ucretsiz') delete yeni[BEN]; else yeni[BEN] = { paket: p, zaman: (k[BEN] && k[BEN].paket === p) ? k[BEN].zaman : Date.now() };
    if (JSON.stringify(yeni) !== JSON.stringify(k)) localStorage.setItem(PAYLASIM_ANAHTARI, JSON.stringify(yeni));
  } catch { /* depolama kapalı: paylaşım yok */ }
}

// Diğer uygulamalardaki ücretli üyelikler: [{ uygulama, kaynak: 'paylasim' | 'test' }]
function digerUyelikler() {
  const k = paylasimiOku();
  const test = ayar().test;
  return UYGULAMALAR.flatMap((u) => {
    if (k[u.kimlik] && k[u.kimlik].paket && k[u.kimlik].paket !== 'ucretsiz') return [{ uygulama: u, kaynak: 'paylasim' }];
    if (test[u.kimlik]) return [{ uygulama: u, kaynak: 'test' }];
    return [];
  });
}
const buradaIndirimVar = () => digerUyelikler().length > 0 && indirimOrani() > 0;
const digerlerindeIndirimVar = () => ozellikVar('ekosistemIndirimi') && indirimOrani() > 0;
const indirimliFiyat = (fiyat) => Math.round(fiyat * (100 - indirimOrani()) / 100);

function ekosistemBaslat() {
  uyeligimiYayinla();
  dinle('depo:degisti', uyeligimiYayinla);
}

export { UYGULAMALAR, ayar as ekosistemAyari, indirimOrani, adres, adresAyarla, indirimAyarla, testUyelikAyarla, digerUyelikler, buradaIndirimVar, digerlerindeIndirimVar, indirimliFiyat, ekosistemBaslat };
