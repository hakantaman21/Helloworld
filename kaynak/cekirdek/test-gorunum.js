// Test profillerinin HelloTalk tarzı küçük görünüm parçaları (yaş rozeti, etkinlik metni, rozet hapları).
// Birden çok modül kullanır; modüller birbirini içe aktaramadığı için çekirdekte durur (Y6).
import { h } from './arayuz.js';
import { t } from './metin.js';
import { goreliZaman } from './arayuz.js';
import { aktiflik } from './test-modu.js';

export function aktiflikMetni(p) {
  const a = aktiflik(p);
  return a.cevrimici ? t('ht.cevrimiciSimdi') : t('ht.aktifOnce', { zaman: goreliZaman(Date.now() - a.dk * 60000) });
}

export function yasRozeti(p) {
  return h('span', { class: `b-yas b-yas-${p.cinsiyet || 'k'}`, title: t('ht.yas') }, p.cinsiyet === 'e' ? '♂' : '♀', String(p.yas));
}

export function rozetler(p) {
  return h('span', { class: 'b-etiketler' }, (p.rozetler || []).map((r) => h('span', { class: `b-etiket-hap ${r === 'yeni' ? 'b-etiket-hap-iyi' : r === 'ciddi' ? 'b-etiket-hap-soluk' : ''}` }, t(`ht.rozet.${r}`))));
}

