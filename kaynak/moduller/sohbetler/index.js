// Sohbetler: yapay zekâ partneri ve gerçek kişilerle konuşmalar tek listede.
// Gerçek kişiler bölümü topluluk açılana kadar (Evre 3) boş durum gösterir.
import './sohbetler.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, ikon, altGezinme, ustBaslik, durumKutusu, yzEtiketi, yerlestir } from '../../cekirdek/arayuz.js';
import { t, yerel } from '../../cekirdek/metin.js';
import { al } from '../../cekirdek/depo.js';
import { oneriSenaryo } from '../../cekirdek/oneri.js';
import { kisaTarih } from '../../cekirdek/zaman.js';

const SON_KONUSMA_SAYISI = 5;

function ciz(kok, b) {
  kok.classList.add('b-ekran-gezinmeli');
  const gecmis = al().gorusmeler.slice(0, SON_KONUSMA_SAYISI);
  const baslat = () => b.git(`/gorusme?tur=senaryo&id=${oneriSenaryo().senaryo.kimlik}`);

  yerlestir(kok,
    ustBaslik({ baslik: t('sohbetler.baslik'), alt: t('sohbetler.alt') }),

    h('section', { class: 'b-yigin', 'aria-labelledby': 'shb-yz' },
      h('h2', { class: 'b-bolum-baslik', id: 'shb-yz' }, t('sohbetler.yzBolum')),
      h('button', { class: 'b-kart b-kart-satir b-kart-tiklanir b-kart-vurgulu', type: 'button', onClick: baslat },
        h('span', { class: 'shb-avatar shb-avatar-yz', 'aria-hidden': 'true' }, ikon('dalga', 22, 2.2)),
        h('span', { class: 'shb-metin' },
          h('span', { class: 'shb-ad' }, t('sohbetler.yzKart', { koc: t('koc.ad') })),
          h('span', { class: 'b-kucuk' }, t('sohbetler.yzKartAlt')),
        ),
        yzEtiketi(),
      ),
    ),

    h('section', { class: 'b-yigin', 'aria-labelledby': 'shb-gecmis' },
      h('h2', { class: 'b-bolum-baslik', id: 'shb-gecmis' }, t('sohbetler.gecmisBolum')),
      gecmis.length
        ? h('div', { class: 'b-yigin' }, gecmis.map((g) => h('div', { class: 'b-kart b-kart-satir' },
          h('span', { class: 'shb-avatar shb-avatar-yz', 'aria-hidden': 'true' }, ikon('dalga', 18, 2.2)),
          h('span', { class: 'shb-metin' },
            h('span', { class: 'shb-ad' }, yerel(g.baslik)),
            h('span', { class: 'b-kucuk' }, `${kisaTarih(g.tarih)} · ${t('genel.dk', { n: Math.max(0.1, Math.round((g.sureSn / 60) * 10) / 10) })}`),
          ),
          yzEtiketi(),
        )))
        : durumKutusu('bos', t('sohbetler.gecmisBos')),
    ),

    h('section', { class: 'b-yigin', 'aria-labelledby': 'shb-insan' },
      h('h2', { class: 'b-bolum-baslik', id: 'shb-insan' }, t('sohbetler.insanBolum')),
      durumKutusu('bos', t('sohbetler.insanBos'), { metin: t('sohbetler.kesfeteGit'), fn: () => b.git('/kesfet') }),
    ),

    altGezinme('/sohbetler'),
  );
  return null;
}

export default {
  kimlik: 'sohbetler',
  surum: '0.2.0',
  onek: 'shb',
  semaSurumu: 1,
  cekirdekServisleri: ['depo', 'metin'],
  ekranlar: {
    sohbetler: ekran({ baslikAnahtari: 'ekran.sohbetler', durumlar: DORT_DURUM, ciz }),
  },
};
