// Keşfet: partner bulma ve topluluk. Topluluk açılana kadar (Evre 3) dürüst bir boş durum,
// yapay zekâ partnere tek dokunuşla geçiş ve topluluk kuralları gösterilir.
import './kesfet.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, ikon, altGezinme, ustBaslik, durumKutusu, yzEtiketi, yerlestir } from '../../cekirdek/arayuz.js';
import { t } from '../../cekirdek/metin.js';
import { oneriSenaryo } from '../../cekirdek/oneri.js';

function ciz(kok, b) {
  kok.classList.add('b-ekran-gezinmeli');
  yerlestir(kok,
    ustBaslik({ baslik: t('kesfet.baslik'), alt: t('kesfet.alt') }),

    h('section', { class: 'b-yigin', 'aria-labelledby': 'kft-partner' },
      h('h2', { class: 'b-bolum-baslik', id: 'kft-partner' }, t('kesfet.partnerBaslik')),
      durumKutusu('bos', t('kesfet.partnerBos')),
    ),

    h('section', { class: 'b-kart kft-yz', 'aria-labelledby': 'kft-yz' },
      h('div', { class: 'b-satir' },
        h('h2', { class: 'b-bolum-baslik b-buyut', id: 'kft-yz' }, t('kesfet.yzBaslik')),
        yzEtiketi(),
      ),
      h('p', { class: 'b-kucuk' }, t('kesfet.yzAlt')),
      h('button', { class: 'b-dugme b-dugme-ana', onClick: () => b.git(`/gorusme?tur=senaryo&id=${oneriSenaryo().senaryo.kimlik}`) },
        ikon('mikrofon', 20), t('kesfet.yzDugme')),
    ),

    h('section', { class: 'b-kart', 'aria-labelledby': 'kft-kural' },
      h('div', { class: 'b-satir' },
        h('span', { class: 'b-ikon-daire' }, ikon('kalkan', 18)),
        h('h2', { class: 'b-bolum-baslik', id: 'kft-kural' }, t('kesfet.kurallarBaslik')),
      ),
      h('ul', { class: 'kft-kurallar' }, [1, 2, 3, 4].map((n) => h('li', null, t(`karsilama.kurallar.${n}`)))),
    ),

    altGezinme('/kesfet'),
  );
  return null;
}

export default {
  kimlik: 'kesfet',
  surum: '0.2.0',
  onek: 'kft',
  semaSurumu: 1,
  cekirdekServisleri: ['metin'],
  ekranlar: {
    kesfet: ekran({ baslikAnahtari: 'ekran.kesfet', durumlar: DORT_DURUM, ciz }),
  },
};
