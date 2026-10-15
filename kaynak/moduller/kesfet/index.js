// Bağlantı: yalnızca gerçek kişi keşfi; hesap ve sunucu olmadan sahte kişi gösterilmez.
// Gerçek kullanıcı profili, sahte çevrimiçi durumu veya geçersiz telaffuz puanı üretilmez.
import './kesfet.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, ikon, altGezinme, ustBaslik, durumKutusu, yerlestir } from '../../cekirdek/arayuz.js';
import { t } from '../../cekirdek/metin.js';

function ciz(kok, b) {
  kok.classList.add('b-ekran-gezinmeli');
  yerlestir(kok,
    ustBaslik({ baslik: t('kesfet.baslik'), alt: t('kesfet.alt') }),
    h('section', { class: 'b-kart kft-hero', 'aria-labelledby': 'kft-giris' },
      h('span', { class: 'b-ust-etiket' }, t('kesfet.heroEtiket')),
      h('h2', { class: 'b-bolum-baslik', id: 'kft-giris' }, t('kesfet.heroBaslik')),
      h('p', { class: 'b-kucuk kft-hero-alt' }, t('kesfet.heroAlt')),
    ),
    h('section', { class: 'b-kart kft-sonuc', 'aria-label': t('kesfet.partnerBaslik') },
      h('div', { class: 'kft-bilgi' },
        h('span', { class: 'b-ikon-daire' }, ikon('kisi', 22)),
        h('div', null,
          h('h3', { class: 'b-bolum-baslik' }, t('kesfet.partnerBaslik')),
          h('p', { class: 'b-kucuk' }, t('kesfet.eslesmeAciklama')),
        ),
      ),
      h('div', { class: 'kft-etiketler', 'aria-label': t('kesfet.filtreBaslik') },
        [t('kesfet.filtre.dil'), t('kesfet.filtre.seviye'), t('kesfet.filtre.hedef')].map((metin) => h('span', { class: 'kft-etiket' }, metin)),
      ),
      durumKutusu('bos', t('kesfet.partnerBos')),
    ),
    h('details', { class: 'b-kart kft-kural' },
      h('summary', { class: 'b-bolum-baslik' }, t('kesfet.kurallarBaslik')),
      h('ul', { class: 'kft-kurallar' }, [1, 2, 3, 4].map((n) => h('li', null, t(`karsilama.kurallar.${n}`)))),
    ),
    altGezinme('/kesfet'),
  );
  return null;
}

export default {
  kimlik: 'kesfet',
  surum: '0.2.7',
  onek: 'kft',
  semaSurumu: 1,
  cekirdekServisleri: ['metin'],
  ekranlar: {
    kesfet: ekran({ baslikAnahtari: 'ekran.kesfet', durumlar: DORT_DURUM, ciz }),
  },
};
