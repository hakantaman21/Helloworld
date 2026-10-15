// Tema yalnız <html data-tema> özniteliğini değiştirir; renkler jetonlardan gelir (Y3).
import { al } from './depo.js';
import { dinle } from './olay-hatti.js';

export function temaUygula() {
  const ayarlar = al().profil.ayarlar;
  const tercih = ayarlar.tema;
  const kok = document.documentElement;
  kok.setAttribute('data-gorunum', ayarlar.gorunum === 'kompakt' ? 'kompakt' : 'dengeli');
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
