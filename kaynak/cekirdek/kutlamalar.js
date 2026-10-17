// v0.26.0 Kutlamalar (Hakan, 17.10.2026): hoş geldin, doğum günü ve üyelik yıldönümü mesajları bildirim kutusuna düşer.
// Uygulama bildirim saatleri içinde, hesap askıda değilken ve her biri yalnız bir kez (kutu kaynak kimliğiyle) üretilir.
// Doğum günü yalnız gün-ay olarak (yıl/yaş tutulmaz) ve isteğe bağlı girilir: Ayarlar › Profil.
import { al } from './depo.js';
import { kutuyaEkle } from './rehber.js';
import { uygulamaBildirimiUygun } from './iletisim-saatleri.js';
import { ayGun } from './arkadaslik.js';
import { t } from './metin.js';

const GUN = 86400000;

export function kutlamalariDenetle(simdi = Date.now()) {
  const v = al();
  const p = v.profil;
  if (!p.kurulumTamam || p.hesapAskida || !uygulamaBildirimiUygun(simdi)) return;
  const bugun = new Date(simdi);
  const yil = bugun.getFullYear();
  const kurulum = (v.rehber && v.rehber.kurulum) || simdi;
  const ad = p.ad || t('kutlama.adYok');
  const ekle = (kaynak, anahtar, d = {}, yol = null) => kutuyaEkle({ kaynak, kat: 'hesap', tur: 'kutlama', ikon: 'hediye',
    baslik: { m: `kutlama.${anahtar}.baslik`, d: { ad, ...d } }, metin: { m: `kutlama.${anahtar}.metin`, d: { ad, ...d } }, yol });

  if (simdi - kurulum < GUN) ekle('kutlama:hosgeldin', 'hosgeldin', {}, '/kilavuz');
  if (p.dogumGunu && p.dogumGunu === ayGun(bugun)) ekle(`kutlama:dogum:${yil}`, 'dogumGunu');

  const k = new Date(kurulum);
  const ayFarki = (yil - k.getFullYear()) * 12 + (bugun.getMonth() - k.getMonth());
  if (bugun.getDate() === k.getDate() && ayFarki > 0) {
    if (ayFarki % 12 === 0) ekle(`kutlama:yil:${yil}`, 'yildonumu', { n: ayFarki / 12 });
    else if (ayFarki === 1 || ayFarki === 6) ekle(`kutlama:ay:${ayFarki}`, 'ayDonumu', { n: ayFarki });
  }
}

export function kutlamalariBaslat() {
  setTimeout(() => kutlamalariDenetle(), 2500);
  setInterval(() => kutlamalariDenetle(), 30 * 60000);
}
