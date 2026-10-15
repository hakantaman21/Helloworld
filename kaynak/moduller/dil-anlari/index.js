// Dil Anları: moderasyon ve hesap altyapısı gelene dek güvenli boş durum.
import './anlar.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, altGezinme, ustBaslik, durumKutusu, ikon, yerlestir } from '../../cekirdek/arayuz.js';
import { t } from '../../cekirdek/metin.js';

function ciz(kok, b) {
  kok.classList.add('b-ekran-gezinmeli');
  yerlestir(kok,
    ustBaslik({ baslik: t('anlar.baslik'), alt: t('anlar.alt') }),
    h('section', { class: 'b-kart anl-kart' },
      h('span', { class: 'b-ikon-daire b-ikon-daire-vurgu' }, ikon('sohbet', 22)),
      durumKutusu('bos', t('anlar.aciklama')),
      h('p', { class: 'anl-bilgi' }, t('anlar.guvenlik')),
      h('button', { class: 'b-dugme b-dugme-ana', type: 'button', onClick: () => b.git('/senaryolar') }, t('anlar.basla')),
    ),
    altGezinme('/dil-anlari'),
  );
  return null;
}
export default {
  kimlik: 'dil-anlari',
  surum: '0.2.6',
  onek: 'anl',
  semaSurumu: 1,
  cekirdekServisleri: ['metin'],
  ekranlar: { 'dil-anlari': ekran({ baslikAnahtari: 'ekran.dilAnlari', durumlar: DORT_DURUM, ciz }) },
};
