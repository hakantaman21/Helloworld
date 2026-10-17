// v0.26.0 İletişim saatleri (Hakan, 17.10.2026): kullanıcı, uygulamanın kendi bildirimleri ve arkadaşlarından gelen
// mesaj/bildirimler için AYRI saat aralığı ve günler seçer (Ayarlar › Bildirimler › Gelişmiş).
// Karşı taraf o an kabul etmiyorsa gönderene söylenir: "Orada saat 02:10; mesajın 08:00'de iletilecek."
// Saatler HER ZAMAN kişinin kendi saat diliminde yorumlanır. Saf işlevler: sunucuda da aynen kullanılabilir.
import { al, degistir } from './depo.js';
import { TEST_SOSYAL } from '../veri/test-profiller.js';
import { kuyruga } from './sunucu.js';

const TUM_GUNLER = [0, 1, 2, 3, 4, 5, 6]; // 0 = Pazar (Date.getDay)
export const VARSAYILAN_SAATLER = Object.freeze({
  uygulama: { bas: '08:00', bit: '22:00', gunler: TUM_GUNLER },
  arkadas: { bas: '08:00', bit: '23:00', gunler: TUM_GUNLER },
});
export const SAAT_TURLERI = ['uygulama', 'arkadas'];

const dakika = (saat) => { const [s, d] = String(saat || '00:00').split(':').map(Number); return (s || 0) * 60 + (d || 0); };

// Verilen an, verilen saat diliminde: { gun, dk }.
export function yerelBilesen(an, saatDilimi) {
  const tarih = new Date(an);
  if (!saatDilimi) return { gun: tarih.getDay(), dk: tarih.getHours() * 60 + tarih.getMinutes() };
  try {
    const parca = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: saatDilimi, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(tarih).map((p) => [p.type, p.value]));
    const gun = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parca.weekday);
    return { gun, dk: Number(parca.hour) * 60 + Number(parca.minute) };
  } catch { return { gun: tarih.getDay(), dk: tarih.getHours() * 60 + tarih.getMinutes() }; }
}

// Aralık gece yarısını geçebilir (22:00 → 07:00). bas === bit: bütün gün.
export function aralikta(aralik, { gun, dk }) {
  const a = { ...VARSAYILAN_SAATLER.arkadas, ...(aralik || {}) };
  const b = dakika(a.bas); const s = dakika(a.bit);
  if (b === s) return a.gunler.includes(gun);
  if (b < s) return a.gunler.includes(gun) && dk >= b && dk < s;
  // Gece yarısını geçen aralık: başladığı günün kuralı geçerli.
  if (dk >= b) return a.gunler.includes(gun);
  return dk < s && a.gunler.includes((gun + 6) % 7);
}

// Bir sonraki uygun an (15 dakikalık adımlarla en çok 8 gün ileri). Hiç uygun an yoksa null.
export function sonrakiUygunAn(aralik, saatDilimi, simdi = Date.now()) {
  const ADIM = 15 * 60000;
  let an = Math.ceil(simdi / ADIM) * ADIM;
  for (let i = 0; i < (8 * 24 * 4); i += 1, an += ADIM) {
    if (aralikta(aralik, yerelBilesen(an, saatDilimi))) return an;
  }
  return null;
}

// ---- Benim saatlerim ----
export function benimSaatlerim() {
  const k = (al().profil.ayarlar || {}).bildirimSaatleri || {};
  return Object.fromEntries(SAAT_TURLERI.map((tur) => [tur, { ...VARSAYILAN_SAATLER[tur], ...(k[tur] || {}) }]));
}
export function saatleriAyarla(tur, deger) {
  degistir((v) => { const k = benimSaatlerim(); v.profil.ayarlar.bildirimSaatleri = { ...k, [tur]: { ...k[tur], ...deger } }; });
  kuyruga('ayar', { bildirimSaatleri: benimSaatlerim() });
}
export function saatleriSifirla() { degistir((v) => { delete v.profil.ayarlar.bildirimSaatleri; }); }
// Uygulamanın kendi önerileri, hatırlatmaları ve tebrikleri şu an gönderilebilir mi (cihaz saatiyle).
export function uygulamaBildirimiUygun(simdi = Date.now()) {
  return aralikta(benimSaatlerim().uygulama, yerelBilesen(simdi, null));
}

// ---- Karşı taraf (şimdilik TEST kişileri; sunucuda gerçek kişinin ayarı) ----
export function kisiSaatleri(kimlik) { return { ...VARSAYILAN_SAATLER.arkadas, ...((TEST_SOSYAL[kimlik] || {}).bildirimSaatleri || {}) }; }

// Mesaj gönderilirse ne olur: { simdi: true } ya da { simdi: false, teslim: an, saat: 'SS:DD' (orada), aralik }.
export function teslimDurumu(p, simdi = Date.now()) {
  const aralik = kisiSaatleri(p.kimlik);
  if (aralikta(aralik, yerelBilesen(simdi, p.saatDilimi))) return { simdi: true, aralik };
  return { simdi: false, teslim: sonrakiUygunAn(aralik, p.saatDilimi, simdi), aralik };
}
