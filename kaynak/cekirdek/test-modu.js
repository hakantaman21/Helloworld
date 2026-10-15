// Test modu: gerçek topluluk açılmadan önce Bağlantı ve mesajlaşma ekranlarını sınamak için.
// Açıkken test profilleri "TEST" rozetiyle görünür; kapalıyken hiçbir test verisi gösterilmez.
// Test sohbetleri gelişim, seviye ve Hata Hafızası kayıtlarına HİÇ yazılmaz (yalnız v.test alanı).
import { al, degistir } from './depo.js';
import { TEST_PROFILLERI } from '../veri/test-profiller.js';
import { duzeltmeleriBul, tumunuDuzelt } from './dil/duzeltme-motoru.js';

const MESAJ_SINIRI = 200;

function test() {
  return al().test || { acik: false, sohbetler: {}, engelli: [], sikayetler: [] };
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
  degistir((v) => { v.test = { acik: testModuAcik(), sohbetler: {}, engelli: [], sikayetler: [] }; });
}
