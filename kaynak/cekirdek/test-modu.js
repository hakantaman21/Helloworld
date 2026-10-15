// Test modu: gerçek topluluk açılmadan önce Bağlantı ve mesajlaşma ekranlarını sınamak için.
// Açıkken test profilleri "TEST" rozetiyle görünür; kapalıyken hiçbir test verisi gösterilmez.
// Test sohbetleri gelişim, seviye ve Hata Hafızası kayıtlarına HİÇ yazılmaz (yalnız v.test alanı).
import { al, degistir } from './depo.js';
import { TEST_PROFILLERI, TEST_ANLARI, TEST_YORUM_KALIPLARI, TEST_HAZIR_YORUMLAR } from '../veri/test-profiller.js';
import { SEVIYE_SIRASI } from './oneri.js';
import { aktifDil } from './metin.js';
import { duzeltmeleriBul, tumunuDuzelt } from './dil/duzeltme-motoru.js';

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
  const engelli = test().engelli || [];
  return testModuAcik() ? TEST_PROFILLERI.filter((p) => !engelli.includes(p.kimlik)) : [];
}

export function testProfili(kimlik) {
  return testModuAcik() ? TEST_PROFILLERI.find((p) => p.kimlik === kimlik) || null : null;
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

export function testMesajEkle(kimlik, mesaj) {
  degistir((v) => {
    const t = { ...test() };
    t.sohbetler = { ...(t.sohbetler || {}) };
    const s = t.sohbetler[kimlik] ? { ...t.sohbetler[kimlik] } : { mesajlar: [] };
    s.mesajlar = [...s.mesajlar, { ...mesaj, zaman: Date.now() }].slice(-MESAJ_SINIRI);
    t.sohbetler[kimlik] = s;
    v.test = t;
  });
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
  const engelli = test().engelli || [];
  const simdi = Date.now();
  const tohum = TEST_ANLARI.filter((a) => !engelli.includes(a.yazar)).map((a) => ({ ...a, zaman: simdi - a.saatOnce * SAAT, profil: TEST_PROFILLERI.find((p) => p.kimlik === a.yazar) }));
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

export function anYorumlari(kimlik) {
  const engelli = test().engelli || [];
  const hazir = (TEST_HAZIR_YORUMLAR[kimlik] || []).filter((y) => !engelli.includes(y.yazar)).map((y) => ({ ...y, hazir: true }));
  return [...hazir, ...((test().yorumlar || {})[kimlik] || [])];
}

export function anYorumEkle(kimlik, yorum) {
  testGuncelle((t) => { t.yorumlar = { ...(t.yorumlar || {}) }; t.yorumlar[kimlik] = [...(t.yorumlar[kimlik] || []), { ...yorum, zaman: Date.now() }].slice(-50); });
}

export function anDuzeltmesi(kimlik) { return (test().duzeltmeler || {})[kimlik] || null; }

export function anDuzelt(kimlik, kaynak, dogru) {
  testGuncelle((t) => { t.duzeltmeler = { ...(t.duzeltmeler || {}), [kimlik]: { kaynak, dogru, zaman: Date.now() } }; });
}

export function anPaylas(metin) {
  const kimlik = 'benim-' + Date.now().toString(36);
  testGuncelle((t) => { t.anlar = [{ kimlik, yazar: 'ben', metin: String(metin).slice(0, 500), zaman: Date.now() }, ...(t.anlar || [])].slice(0, 50); });
  return kimlik;
}

// Kendi gönderisine otomatik test yorumu: sırayla kalıplardan biri.
export function anOtomatikYorum(kimlik) {
  const sira = (test().anlar || []).length;
  const k = TEST_YORUM_KALIPLARI[sira % TEST_YORUM_KALIPLARI.length];
  if ((test().engelli || []).includes(k.yazar)) return;
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
export function aktiflik(p) {
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
  return { puan: Math.min(99, puan), nedenler };
}

export function enIyiEslesmeler() {
  return testProfilleri().map((p) => ({ profil: p, ...eslesme(p) })).sort((a, b) => b.puan - a.puan);
}

// El sallamaya otomatik test yanıtı (kalıp; yapay zekâ değildir).
export function selamYaniti(p) {
  return { kim: 'o', metin: `Hi! 👋 Thanks for the wave, I'm ${p.ad}. How is your day going?`, otomatik: true };
}
