// Tema yalnız <html data-tema> özniteliğini değiştirir; renkler jetonlardan gelir (Y3).
import { al } from './depo.js';
import { dinle } from './olay-hatti.js';

export function temaUygula() {
  const ayarlar = al().profil.ayarlar;
  const tercih = ayarlar.tema;
  const kok = document.documentElement;
  kok.setAttribute('data-gorunum', ayarlar.gorunum === 'kompakt' ? 'kompakt' : 'dengeli');
  kok.setAttribute('data-yazi', ayarlar.yaziBoyutu === 'buyuk' ? 'buyuk' : 'normal');
  if (ayarlar.secimRengi && ayarlar.secimRengi !== 'altin') kok.setAttribute('data-secim', ayarlar.secimRengi); else kok.removeAttribute('data-secim');
  if (ayarlar.zemin && ayarlar.zemin !== 'varsayilan') kok.setAttribute('data-zemin', ayarlar.zemin); else kok.removeAttribute('data-zemin');
  kok.setAttribute('data-bant', ayarlar.bantRengi || 'sayfa');
  kok.setAttribute('data-suzgec', ayarlar.suzgecBicimi || 'klasik');
  if (tercih === 'sistem') kok.removeAttribute('data-tema');
  else kok.setAttribute('data-tema', tercih);
}

export function temaBaslat() {
  temaUygula();
  dinle('depo:degisti', temaUygula);
}

// Tuval gibi CSS dışı çizimler için jeton değerini okur.
export function jeton(ad) {
  return getComputedStyle(document.documentElement).getPropertyValue(ad).trim();
}
