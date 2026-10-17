// Test modu: gerçek topluluk açılmadan önce Bağlantı ve mesajlaşma ekranlarını sınamak için.
// Açıkken test profilleri "TEST" rozetiyle görünür; kapalıyken hiçbir test verisi gösterilmez.
// Test sohbetleri gelişim, seviye ve Hata Hafızası kayıtlarına HİÇ yazılmaz (yalnız v.test alanı).
import { al, degistir } from './depo.js';
import { TEST_PROFILLERI, TEST_ANLARI, TEST_YORUM_KALIPLARI, TEST_HAZIR_YORUMLAR } from '../veri/test-profiller.js';
import { SEVIYE_SIRASI } from './oneri.js';
import { aktifDil } from './metin.js';
import { ilgiKimligi } from '../veri/ilgi-alanlari.js';
import { sonGorulmeGorunurluk } from './arkadaslik.js';
import { duzeltmeleriBul, tumunuDuzelt } from './dil/duzeltme-motoru.js';
import { kisiErisilebilir, erisilebilirler } from './test-erisim.js';
import { yeniKimlik } from './kimlik.js';

const MESAJ_SINIRI = 200;

function test() {
  return { anlar: [], begeniler: [], yorumlar: {}, duzeltmeler: {}, takip: [], selamlar: [], ...(al().test || { acik: false, sohbetler: {}, engelli: [], sikayetler: [] }) };
}

function testGuncelle(fn) {
  degistir((v) => { const t = { ...test() }; fn(t); v.test = t; });
}

export function testModuAcik() {
  return Boolean(test().acik);
}

export function testModuAyarla(acik) {
  degistir((v) => { v.test = { ...test(), acik: Boolean(acik) }; });
}

export function testProfilleri() {
  return erisilebilirler(TEST_PROFILLERI, (p) => p.kimlik);
}

// v0.16.0 Gerçek engelleme: engellenen kişi yalnız listeden değil, doğrudan adresle de açılmaz (profil, mesaj, selam).
export function testProfili(kimlik) {
  if (!kisiErisilebilir(kimlik)) return null;
  return TEST_PROFILLERI.find((p) => p.kimlik === kimlik) || null;
}

// Ayarlar › Engellenenler için (engeli kaldırma listesi).
export function engellenenler() {
  const engelli = test().engelli || [];
  return TEST_PROFILLERI.filter((p) => engelli.includes(p.kimlik));
}

export function testEngelKaldir(kimlik) {
  degistir((v) => { const t = { ...test() }; t.engelli = (t.engelli || []).filter((k) => k !== kimlik); v.test = t; });
}

// Sohbetin ilk mesaj zamanı (iletişim bilgisi kuralı için; eski mesajlar listeden düşse de korunur).
export function testSohbetBaslangici(kimlik) {
  const s = (test().sohbetler || {})[kimlik];
  return s ? s.baslangic || (s.mesajlar[0] && s.mesajlar[0].zaman) || null : null;
}

// Test kişisi yanıt verir mi: son 30 dakikada etkin olanlar otomatik yanıt verir, diğerleri vermez
// (yanıtsız mesaj sınırı gerçekçi biçimde sınanabilsin diye).
export function testYanitVerir(profil) {
  return (profil.sonAktifDk || 0) <= 30;
}

export function testMesajlari(kimlik) {
  return ((test().sohbetler || {})[kimlik] || { mesajlar: [] }).mesajlar;
}

// Son mesajı olan test sohbetleri (Sohbetler listesi için), en yeni üstte.
export function testSohbetOzetleri() {
  if (!testModuAcik()) return [];
  const s = test().sohbetler || {};
  return testProfilleri()
    .filter((p) => s[p.kimlik] && s[p.kimlik].mesajlar.length)
    .map((p) => ({ profil: p, son: s[p.kimlik].mesajlar[s[p.kimlik].mesajlar.length - 1] }))
    .sort((a, b) => b.son.zaman - a.son.zaman);
}

// v0.24.0: yazma noktasında erişim politikası — engellenen kişiye/kişiden (gecikmeli otomatik yanıt dahil) ya da test modu
// kapalıyken mesaj kaydedilmez. Döner: kaydedildi mi.
export function testMesajEkle(kimlik, mesaj) {
  if (!kisiErisilebilir(kimlik)) return false;
  degistir((v) => {
    const t = { ...test() };
    t.sohbetler = { ...(t.sohbetler || {}) };
    const s = t.sohbetler[kimlik] ? { ...t.sohbetler[kimlik] } : { mesajlar: [] };
    s.baslangic = s.baslangic || (s.mesajlar[0] && s.mesajlar[0].zaman) || Date.now();
    s.mesajlar = [...s.mesajlar, { ...mesaj, zaman: Date.now() }].slice(-MESAJ_SINIRI);
    t.sohbetler[kimlik] = s;
    v.test = t;
  });
  return true;
}

// Gönderim öncesi düzeltme önerisi (isteğe bağlı): yerel kurallarla, ağ çağrısı yok.
export function gonderimOncesiOneri(metin) {
  const bulunan = duzeltmeleriBul(metin);
  if (!bulunan.length) return null;
  return { dogru: tumunuDuzelt(metin), aciklamalar: bulunan.map((d) => d.aciklama) };
}

// Otomatik test yanıtı: kalıptan seçilir; kullanıcının cümlesinde kural hatası varsa partner düzeltmesi eklenir
// (HelloTalk'taki "mesaj içi düzeltme" deneyimini sınamak için). Yapay zekâ değildir.
export function otomatikYanit(profil, kullaniciMetni) {
  const sira = testMesajlari(profil.kimlik).filter((m) => m.kim === 'o').length;
  const yanit = { kim: 'o', metin: profil.yanitlar[sira % profil.yanitlar.length], otomatik: true };
  const bulunan = duzeltmeleriBul(kullaniciMetni);
  if (bulunan.length) yanit.duzeltme = { kaynak: kullaniciMetni, dogru: tumunuDuzelt(kullaniciMetni) };
  return yanit;
}

export function testEngelle(kimlik) {
  degistir((v) => { const t = { ...test() }; t.engelli = [...new Set([...(t.engelli || []), kimlik])]; v.test = t; });
}

export function testSikayet(kimlik, neden) {
  degistir((v) => { const t = { ...test() }; t.sikayetler = [...(t.sikayetler || []), { kimlik, neden, zaman: Date.now() }].slice(-50); v.test = t; });
}

export function testVerileriniSil() {
  degistir((v) => { v.test = { acik: testModuAcik(), sohbetler: {}, engelli: [], sikayetler: [], anlar: [], begeniler: [], yorumlar: {}, duzeltmeler: {}, takip: [], selamlar: [] }; });
}

// ---- Dil Anları (test) ----
const SAAT = 3600000;

// Akış: kullanıcının kendi gönderileri + test gönderileri, en yeni üstte. Engellenen yazarlar gizlenir.
export function testAnlari() {
  if (!testModuAcik()) return [];
  const simdi = Date.now();
  const tohum = erisilebilirler(TEST_ANLARI, (a) => a.yazar).map((a) => ({ ...a, zaman: simdi - a.saatOnce * SAAT, profil: TEST_PROFILLERI.find((p) => p.kimlik === a.yazar) }));
  const benim = (test().anlar || []).map((a) => ({ ...a, benim: true }));
  return [...benim, ...tohum].sort((a, b) => b.zaman - a.zaman);
}

export function testYazarAnlari(kimlik) {
  return testAnlari().filter((a) => a.yazar === kimlik);
}

export function anBegenildi(kimlik) { return (test().begeniler || []).includes(kimlik); }

export function anBegen(kimlik) {
  testGuncelle((t) => { const b = new Set(t.begeniler || []); if (b.has(kimlik)) b.delete(kimlik); else b.add(kimlik); t.begeniler = [...b]; });
}

// v0.24.0: hazır ve sonradan kaydedilen yorumlar aynı erişim süzgecinden geçer (engellenen yazar hiçbir yerde görünmez).
export function anYorumlari(kimlik) {
  const hazir = (TEST_HAZIR_YORUMLAR[kimlik] || []).map((y) => ({ ...y, hazir: true }));
  return erisilebilirler([...hazir, ...((test().yorumlar || {})[kimlik] || [])], (y) => y.yazar);
}

export function anYorumEkle(kimlik, yorum) {
  if (!kisiErisilebilir(yorum.yazar)) return;
  testGuncelle((t) => { t.yorumlar = { ...(t.yorumlar || {}) }; t.yorumlar[kimlik] = [...(t.yorumlar[kimlik] || []), { ...yorum, zaman: Date.now() }].slice(-50); });
}

export function anDuzeltmesi(kimlik) { return (test().duzeltmeler || {})[kimlik] || null; }

export function anDuzelt(kimlik, kaynak, dogru) {
  testGuncelle((t) => { t.duzeltmeler = { ...(t.duzeltmeler || {}), [kimlik]: { kaynak, dogru, zaman: Date.now() } }; });
}

export function anPaylas(metin, fotolar = []) {
  const kimlik = yeniKimlik('benim');
  testGuncelle((t) => { t.anlar = [{ kimlik, yazar: 'ben', metin: String(metin).slice(0, 500), fotolar: fotolar.slice(0, 9), zaman: Date.now() }, ...(t.anlar || [])].slice(0, 50); });
  return kimlik;
}

// Kendi gönderisine otomatik test yorumu: sırayla kalıplardan biri.
export function anOtomatikYorum(kimlik) {
  const sira = (test().anlar || []).length;
  const k = TEST_YORUM_KALIPLARI[sira % TEST_YORUM_KALIPLARI.length];
  anYorumEkle(kimlik, { yazar: k.yazar, metin: k.metin, otomatik: true });
}

export function testProfiliHam(kimlik) {
  return TEST_PROFILLERI.find((p) => p.kimlik === kimlik) || null;
}

// ---- Takip ve selam (HelloTalk "takip et" / "el salla") ----
export function takipte(kimlik) { return (test().takip || []).includes(kimlik); }
export function takipDegistir(kimlik) {
  testGuncelle((t) => { const k = new Set(t.takip || []); if (k.has(kimlik)) k.delete(kimlik); else k.add(kimlik); t.takip = [...k]; });
  return takipte(kimlik);
}
export function takipSayisi() { return (test().takip || []).length; }
export function selamVerildi(kimlik) { return (test().selamlar || []).includes(kimlik); }
export function selamVer(kimlik, metin) {
  testGuncelle((t) => { t.selamlar = [...new Set([...(t.selamlar || []), kimlik])]; });
  testMesajEkle(kimlik, { kim: 'ben', metin, selam: true });
}

// ---- Etkinlik (TEST verisi: profillerdeki sonAktifDk alanından; gerçek kişi durumu değildir) ----
// v0.17.0: son görülme/çevrimiçi bilgisi karşılıklı gizliliğe tabidir; görünmüyorsa "gizli" döner (sıralamada sona).
export function aktiflik(p) {
  if (!sonGorulmeGorunurluk(p.kimlik).gorunur) return { cevrimici: false, dk: 1e9, gizli: true };
  const dk = Number(p.sonAktifDk || 0);
  if (dk <= 0) return { cevrimici: true, dk: 0 };
  return { cevrimici: false, dk };
}

// Kişinin şehrindeki yerel saat (HelloTalk profilindeki saat rozeti).
export function yerelSaat(p) {
  try {
    return new Intl.DateTimeFormat(aktifDil() === 'tr' ? 'tr-TR' : 'en-GB', { hour: '2-digit', minute: '2-digit', timeZone: p.saatDilimi }).format(new Date());
  } catch { return ''; }
}

// v0.12.1 Yakın zaman dilimi (HelloTalk "Yakın Zaman Dilimi"): kişinin saati ile cihaz saati arasındaki fark (saat).
// Konum bilgisi tutulmaz; "yakında" yerine saat dilimine bakılır (aynı saatlerde müsait olma olasılığı).
export function saatFarki(p) {
  try {
    const simdi = new Date();
    const orada = new Date(simdi.toLocaleString('en-US', { timeZone: p.saatDilimi }));
    const burada = new Date(simdi.toLocaleString('en-US'));
    return Math.abs(Math.round((orada - burada) / 3600000));
  } catch { return 99; }
}
export const YAKIN_SAAT_FARKI = 3;

// v0.14.0 Eşleşme puanı kural toplamıdır; bilimsel bir olasılık gibi "%93" gösterilmez, sözlü düzeye çevrilir.
export function uyumDuzeyi(puan) { return puan >= 80 ? 'cok' : puan >= 60 ? 'iyi' : 'olasi'; }

// v0.13.0 Gerçek okunma durumu: sohbet açılınca o ana kadarki mesajlar okundu sayılır.
export function okunduIsaretle(kimlik) {
  const son = testMesajlari(kimlik).reduce((m, x) => Math.max(m, Number(x.zaman || 0)), 0);
  testGuncelle((t) => { t.okundu = { ...(t.okundu || {}), [kimlik]: Math.max(Date.now(), son) }; });
}
export function okunmamis(ozet) {
  return ozet.son.kim !== 'ben' && Number(ozet.son.zaman || 0) > Number(((test().okundu || {})[ozet.profil.kimlik]) || 0);
}

// ---- Otomatik eşleşme: dil değişimi uyumu + seviye + etkinlik ----
// Puan bir kural toplamıdır (yapay zekâ değildir). Nedenler ekranda açıkça yazılır.
export function eslesme(p, ben = al().profil) {
  const nedenler = [];
  let puan = 10;
  if (ben.ogrenilenDil && p.anaDil === ben.ogrenilenDil) { puan += 40; nedenler.push('anaDil'); }
  if (ben.anaDil && p.ogrenilenDil === ben.anaDil) { puan += 25; nedenler.push('karsilikli'); }
  const fark = Math.abs(SEVIYE_SIRASI.indexOf(p.seviye) - SEVIYE_SIRASI.indexOf(ben.seviye));
  if (fark <= 1) { puan += 8; nedenler.push('seviye'); }
  const a = aktiflik(p);
  if (a.cevrimici || a.dk < 60) { puan += 6; nedenler.push('aktif'); }
  if ((p.rozetler || []).includes('hizli')) { puan += 4; nedenler.push('hizli'); }
  const ortak = ortakIlgiler(p, ben);
  if (ortak.length) { puan += Math.min(12, ortak.length * 6); nedenler.push('ilgi'); }
  return { puan: Math.min(99, puan), nedenler, ortak };
}

export function enIyiEslesmeler() {
  return testProfilleri().map((p) => ({ profil: p, ...eslesme(p) })).sort((a, b) => b.puan - a.puan);
}

// El sallamaya otomatik test yanıtı (kalıp; yapay zekâ değildir).
export function selamYaniti(p) {
  return { kim: 'o', metin: `Hi! 👋 Thanks for the wave, I'm ${p.ad}. How is your day going?`, otomatik: true };
}

// Kullanıcının seçtiği ilgilerle test profilinin ilgilerinin kesişimi (profildeki {tr,en} nesneleri döner).
export function ortakIlgiler(p, ben = al().profil) {
  const benim = new Set(ben.ilgiler || []);
  return (p.ilgi || []).filter((i) => benim.has(ilgiKimligi(i)));
}
