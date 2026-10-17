// v0.17.0 Arkadaşlık, favori, başa sabitleme, arkadaş haberleri ve KARŞILIKLI gizlilik (Hakan, 17.10.2026).
// Şimdilik yalnız TEST MODU kişileriyle çalışır; veri cihazda (v.test). Gerçek topluluk açılınca aynı kurallar sunucuda
// uygulanmalıdır: istemci tarafı gizlilik tek başına güvence değildir.
//
// Karşılıklılık (WhatsApp mantığı): A'nın X bilgisini (arkadaş listesi, son görülme/çevrimiçi) B ancak İKİ YÖNDE de izin
// varsa görür: A, B'ye izin veriyor VE B de A'ya izin veriyor. Kendi bilgisini "kimse"ye kapatan, başkalarınınkini de göremez.
// izinVerir(sahip, bakan) = ayar 'herkes' ya da ('arkadaslar' ve ikisi arkadaş).
// Okundu bilgisi: iki taraf da açıksa okundu (mavi ✓✓) görünür; biri kapalıysa ikisi de yalnız "iletildi"yi görür.
import { al, degistir } from './depo.js';
import { TEST_PROFILLERI, TEST_SOSYAL } from '../veri/test-profiller.js';
import { kisiErisilebilir, erisilebilirler } from './test-erisim.js';
import { t } from './metin.js';

export const SABIT_SINIRI = 3;
export const GIZLILIK_SECENEKLERI = ['herkes', 'arkadaslar', 'kimse'];
export const HABER_TURLERI = ['an', 'seviye', 'seri', 'foto', 'ilgi', 'yardim', 'dogumgunu', 'guvende'];
// v0.26.0 Arkadaş başına tercih: haber türleri + mesaj bildirimi. Varsayılan: hepsi açık.
export const KISI_TERCIH_TURLERI = ['mesaj', ...HABER_TURLERI];
export const ASKI_SURELERI = [1, 7, 30]; // gün
const VARSAYILAN_GIZLILIK = { arkadasListesi: 'arkadaslar', sonGorulme: 'herkes', okundu: true };

const tst = () => al().test || {};
function guncelle(fn) { degistir((v) => { v.test = { ...(v.test || {}) }; fn(v.test); }); }

// ---- Benim ayarlarım ----
export function benimGizlilik() { return { ...VARSAYILAN_GIZLILIK, ...((al().profil.ayarlar || {}).gizlilik || {}) }; }
export function gizlilikAyarla(anahtar, deger) {
  degistir((v) => { v.profil.ayarlar.gizlilik = { ...benimGizlilik(), [anahtar]: deger }; });
}
export function haberTercihleri() {
  const k = (al().profil.ayarlar || {}).arkadasHaberleri || {};
  return Object.fromEntries(HABER_TURLERI.map((t) => [t, k[t] !== false]));
}
export function haberTercihiAyarla(tur, acik) {
  degistir((v) => { v.profil.ayarlar.arkadasHaberleri = { ...haberTercihleri(), [tur]: acik }; });
}

// ---- Arkadaşlık durumu ----
// v0.24.0: listeler erişim politikasından geçer (test modu kapalıyken ya da kişi engelliyken görünmez);
// arkadaşlık ilişkisinin kendisi (arkadasMi) kayıtta korunur — test modu yeniden açılınca geri gelir.
export function arkadaslarim() { return erisilebilirler(tst().arkadaslar); }
export function arkadasMi(kimlik) { return (tst().arkadaslar || []).includes(kimlik); }
export function gelenIstekler() {
  const red = tst().reddedilenIstekler || [];
  return TEST_PROFILLERI.filter((p) => (TEST_SOSYAL[p.kimlik] || {}).istekGonderir && kisiErisilebilir(p.kimlik) && !arkadasMi(p.kimlik) && !red.includes(p.kimlik));
}
// 'arkadas' | 'gonderildi' | 'gelen' | 'yok'
export function arkadasDurumu(kimlik) {
  if (arkadasMi(kimlik)) return 'arkadas';
  if ((tst().istekler || {})[kimlik]) return 'gonderildi';
  if (gelenIstekler().some((p) => p.kimlik === kimlik)) return 'gelen';
  return 'yok';
}
export function gonderilenIstekler() { return Object.keys(tst().istekler || {}); }
export function istekGonder(kimlik) { guncelle((t) => { t.istekler = { ...(t.istekler || {}), [kimlik]: Date.now() }; }); }
export function istekGeriAl(kimlik) { guncelle((t) => { const i = { ...(t.istekler || {}) }; delete i[kimlik]; t.istekler = i; }); }
// Gönderilen isteğin (test) kabulü ya da gelen isteğin kabulü: iki taraf da arkadaş olur.
export function arkadasYap(kimlik) {
  guncelle((t) => {
    t.arkadaslar = [...new Set([...(t.arkadaslar || []), kimlik])];
    const i = { ...(t.istekler || {}) }; delete i[kimlik]; t.istekler = i;
    t.arkadaslikZamani = { ...(t.arkadaslikZamani || {}), [kimlik]: Date.now() };
  });
}
export function istekReddet(kimlik) { guncelle((t) => { t.reddedilenIstekler = [...new Set([...(t.reddedilenIstekler || []), kimlik])]; }); }
export function arkadasliktanCikar(kimlik) {
  guncelle((t) => {
    t.arkadaslar = (t.arkadaslar || []).filter((k) => k !== kimlik);
    t.favoriler = (t.favoriler || []).filter((k) => k !== kimlik);
  });
}

// ---- v0.26.0 Arkadaş başına tercihler ve arkadaşlığı askıya alma ----
// Tercih: bu kişiden hangi haberleri ve mesaj bildirimlerini alayım (varsayılan hepsi). Askı: arkadaşlık sürer ama
// süre bitene kadar o kişiden haber ve bildirim gelmez, sohbet listesinde sessizdir; süre bitince kendiliğinden kalkar.
export function kisiTercihleri(kimlik) {
  const k = ((tst().kisiTercih || {})[kimlik]) || {};
  return Object.fromEntries(KISI_TERCIH_TURLERI.map((t) => [t, k[t] !== false]));
}
export function kisiTercihAyarla(kimlik, tur, acik) {
  guncelle((t) => { t.kisiTercih = { ...(t.kisiTercih || {}), [kimlik]: { ...kisiTercihleri(kimlik), [tur]: acik } }; });
}
export function askiBitisi(kimlik, simdi = Date.now()) {
  const b = (tst().askida || {})[kimlik];
  return b && b > simdi ? b : null;
}
export function askidaMi(kimlik) { return Boolean(askiBitisi(kimlik)); }
export function arkadasligiAskiyaAl(kimlik, gun) {
  guncelle((t) => { t.askida = { ...(t.askida || {}), [kimlik]: Date.now() + gun * 86400000 }; });
}
export function askiyiKaldir(kimlik) { guncelle((t) => { const a = { ...(t.askida || {}) }; delete a[kimlik]; t.askida = a; }); }
// Bu kişiden şu türde bildirim/haber gelsin mi (genel tercih + kişi tercihi + askı).
export function kisidenAl(kimlik, tur) {
  if (askidaMi(kimlik)) return false;
  if (tur !== 'mesaj' && !haberTercihleri()[tur]) return false;
  return kisiTercihleri(kimlik)[tur] !== false;
}

// ---- Favori ve başa sabitleme (sohbet listesinde en çok SABIT_SINIRI kişi) ----
export function favoriMi(kimlik) { return (tst().favoriler || []).includes(kimlik); }
export function favoriDegistir(kimlik) {
  let sonra = false;
  guncelle((t) => { const f = new Set(t.favoriler || []); if (f.has(kimlik)) f.delete(kimlik); else { f.add(kimlik); sonra = true; } t.favoriler = [...f]; });
  return sonra;
}
export function sabitliMi(kimlik) { return (tst().sabitli || []).includes(kimlik); }
// Döner: 'sabitlendi' | 'kaldirildi' | 'sinir'
export function sabitleDegistir(kimlik) {
  const s = tst().sabitli || [];
  if (s.includes(kimlik)) { guncelle((t) => { t.sabitli = (t.sabitli || []).filter((k) => k !== kimlik); }); return 'kaldirildi'; }
  if (s.length >= SABIT_SINIRI) return 'sinir';
  guncelle((t) => { t.sabitli = [...(t.sabitli || []), kimlik]; });
  return 'sabitlendi';
}

// ---- Karşılıklı gizlilik ----
function onunGizliligi(kimlik) { return { ...VARSAYILAN_GIZLILIK, ...((TEST_SOSYAL[kimlik] || {}).gizlilik || {}) }; }
const izinVerir = (ayar, arkadaslar) => ayar === 'herkes' || (ayar === 'arkadaslar' && arkadaslar);

// { gorunur, neden } — neden: 'o' (karşı taraf izin vermiyor) | 'benKimse' / 'benArkadas' (kendi ayarın, karşılıklılık) | null
function karsilikli(anahtar, kimlik) {
  const ark = arkadasMi(kimlik);
  const ben = benimGizlilik()[anahtar];
  const o = onunGizliligi(kimlik)[anahtar];
  // Önce karşı tarafın ayarı (asıl gizleyen o), sonra karşılıklılık gereği seninki.
  if (!izinVerir(o, ark)) return { gorunur: false, neden: 'o' };
  if (!izinVerir(ben, ark)) return { gorunur: false, neden: ben === 'kimse' ? 'benKimse' : 'benArkadas' };
  return { gorunur: true, neden: null };
}
export function arkadasListesiGorunurluk(kimlik) { return karsilikli('arkadasListesi', kimlik); }
export function sonGorulmeGorunurluk(kimlik) { return karsilikli('sonGorulme', kimlik); }
export function okunduGorunur(kimlik) { return benimGizlilik().okundu !== false && onunGizliligi(kimlik).okundu !== false; }

// Kişinin (görünürse) arkadaş listesi: engellenenler ve sen hariç değil — sen de listede olabilirsin.
export function onunArkadaslari(kimlik) {
  const liste = [...((TEST_SOSYAL[kimlik] || {}).arkadaslar || [])];
  if (arkadasMi(kimlik)) liste.unshift('ben');
  return erisilebilirler(liste);
}

// ---- Arkadaş haberleri (yalnız arkadaşların; tercihlere göre süzülür; en yeni üstte) ----
export function arkadasHaberleri() {
  const simdi = Date.now();
  const bugun = ayGun(new Date());
  return arkadaslarim()
    .flatMap((k) => {
      const sos = TEST_SOSYAL[k] || {};
      const kisi = TEST_PROFILLERI.find((p) => p.kimlik === k);
      const liste = (sos.haberler || []).map((hb, i) => ({ ...hb, kimlik: `${k}-${i}`, kisi, zaman: simdi - hb.saatOnce * 3600000 }));
      // v0.26.0 Doğum günü (bugünse) ve "Güvendeyim" bildirimi de arkadaş haberidir.
      if (sos.dogumGunu && sos.dogumGunu === bugun) liste.push({ tur: 'dogumgunu', kimlik: `${k}-dg`, kisi, zaman: simdi - 3600000, metin: t('arkadas.haber.dogumgunu', { ad: kisi ? kisi.ad : '' }) });
      const g = guvendeDurumu(sos.guvende, simdi);
      if (g) liste.push({ tur: 'guvende', kimlik: `${k}-gv`, kisi, zaman: g.zaman, metin: t('arkadas.haber.guvende', { ad: kisi ? kisi.ad : '' }) });
      return liste.filter((hb) => kisidenAl(k, hb.tur));
    })
    .filter((hb) => hb.kisi)
    .sort((a, b) => b.zaman - a.zaman);
}

// ---- v0.26.0 "Güvendeyim" (deprem, afet): GUVENDE_SAAT boyunca görünür. Benim için profil.guvende = zaman.
export const GUVENDE_SAAT = 72;
export function ayGun(tarih) { return `${String(tarih.getMonth() + 1).padStart(2, '0')}-${String(tarih.getDate()).padStart(2, '0')}`; }
export function guvendeDurumu(kayit, simdi = Date.now()) {
  if (!kayit) return null;
  const zaman = typeof kayit === 'number' ? kayit : simdi - (kayit.saatOnce || 0) * 3600000;
  return simdi - zaman < GUVENDE_SAAT * 3600000 ? { zaman, bitis: zaman + GUVENDE_SAAT * 3600000 } : null;
}
export function benGuvendeyim() { return guvendeDurumu(al().profil.guvende); }
export function guvendeAyarla(acik) { degistir((v) => { v.profil.guvende = acik ? Date.now() : null; }); }
export function kisiGuvende(kimlik) { return guvendeDurumu((TEST_SOSYAL[kimlik] || {}).guvende); }

// ---- Mesaj durumu (✓ gönderildi · ✓✓ iletildi · okundu) ----
// Test kişisi: son 2 saatte etkinse mesaj iletilmiş sayılır; ondan sonra yanıt yazdıysa okunmuştur.
export function mesajDurumu(mesajlar, i, profil) {
  const m = mesajlar[i];
  if (!m || m.kim !== 'ben') return null;
  // v0.26.0: karşı tarafın iletişim saati dışında yazılan mesaj, o saat gelene kadar "bekliyor".
  if (m.teslim && m.teslim > Date.now()) return 'bekliyor';
  const sonraYanit = mesajlar.slice(i + 1).some((x) => x.kim === 'o');
  if (sonraYanit) return okunduGorunur(profil.kimlik) ? 'okundu' : 'iletildi';
  return (profil.sonAktifDk || 0) <= 120 ? 'iletildi' : 'gonderildi';
}
