// Keşfet: HelloTalk'tan ilham alan keşif, Speak'ten tek dokunuş pratik, ELSA'dan telaffuz yolu.
// Gerçek kullanıcı profili, sahte çevrimiçi durumu veya geçersiz telaffuz puanı üretilmez.
import './kesfet.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, ikon, altGezinme, ustBaslik, durumKutusu, yzEtiketi, yerlestir } from '../../cekirdek/arayuz.js';
import { t } from '../../cekirdek/metin.js';
import { oneriSenaryo } from '../../cekirdek/oneri.js';

function ciz(kok, b) {
  kok.classList.add('b-ekran-gezinmeli');
  let secim = 'insan';
  const partner = h('div', { class: 'kft-sonuc', role: 'region', 'aria-live': 'polite' });
  const insanDugme = h('button', { type: 'button', class: 'kft-sekme', onClick: () => sec('insan') }, t('kesfet.insanSekme'));
  const yzDugme = h('button', { type: 'button', class: 'kft-sekme', onClick: () => sec('yz') }, t('kesfet.yzSekme'));
  const konus = () => b.git(`/gorusme?tur=senaryo&id=${oneriSenaryo().senaryo.kimlik}`);
  function sec(yeni) {
    secim = yeni;
    insanDugme.setAttribute('aria-pressed', String(secim === 'insan'));
    yzDugme.setAttribute('aria-pressed', String(secim === 'yz'));
    if (secim === 'insan') {
      yerlestir(partner,
        h('div', { class: 'kft-bilgi' },
          h('span', { class: 'b-ikon-daire' }, ikon('kisi', 22)),
          h('div', null,
            h('h3', { class: 'b-bolum-baslik' }, t('kesfet.partnerBaslik')),
            h('p', { class: 'b-kucuk' }, t('kesfet.eslesmeAciklama')),
          ),
        ),
        h('div', { class: 'kft-etiketler', 'aria-label': t('kesfet.filtreBaslik') },
          ['dil', 'seviye', 'hedef'].map((k) => h('span', { class: 'kft-etiket' }, t('kesfet.filtre.' + k))),
        ),
        durumKutusu('bos', t('kesfet.partnerBos')),
        h('button', { class: 'b-dugme b-dugme-cerceve', type: 'button', onClick: () => sec('yz') }, t('kesfet.yzAlternatif')),
      );
    } else {
      yerlestir(partner,
        h('div', { class: 'kft-bilgi' },
          h('span', { class: 'b-ikon-daire b-ikon-daire-vurgu' }, ikon('dalga', 22)),
          h('div', null,
            h('div', { class: 'b-satir' }, h('h3', { class: 'b-bolum-baslik' }, t('kesfet.yzBaslik')), yzEtiketi()),
            h('p', { class: 'b-kucuk' }, t('kesfet.yzAlt')),
          ),
        ),
        h('p', { class: 'kft-demo-not' }, t('kesfet.demoAciklama')),
        h('button', { class: 'b-dugme b-dugme-ana', type: 'button', onClick: konus }, ikon('mikrofon', 20), t('kesfet.yzDugme')),
      );
    }
  }
  yerlestir(kok,
    ustBaslik({ baslik: t('kesfet.baslik'), alt: t('kesfet.alt') }),
    h('section', { class: 'b-kart kft-hero', 'aria-labelledby': 'kft-giris' },
      h('span', { class: 'b-ust-etiket' }, t('kesfet.heroEtiket')),
      h('h2', { class: 'b-bolum-baslik', id: 'kft-giris' }, t('kesfet.heroBaslik')),
      h('p', { class: 'b-kucuk' }, t('kesfet.heroAlt')),
      h('button', { class: 'b-dugme b-dugme-ana', type: 'button', onClick: konus }, ikon('oynat', 20), t('kesfet.hizliPratik')),
    ),
    h('section', { class: 'b-yigin', 'aria-label': t('kesfet.secimBaslik') },
      h('div', { class: 'kft-sekmeler', role: 'group', 'aria-label': t('kesfet.secimBaslik') }, insanDugme, yzDugme),
      partner,
    ),
    h('section', { class: 'b-kart kft-ogren', 'aria-labelledby': 'kft-telaffuz' },
      h('div', { class: 'b-satir' },
        h('span', { class: 'b-ikon-daire b-ikon-daire-vurgu' }, ikon('ses', 20)),
        h('h2', { class: 'b-bolum-baslik', id: 'kft-telaffuz' }, t('kesfet.telaffuzBaslik')),
      ),
      h('p', { class: 'b-kucuk' }, t('kesfet.telaffuzAlt')),
      h('a', { class: 'b-dugme b-dugme-cerceve', href: '#/senaryolar' }, t('kesfet.senaryoDugme'), ikon('sag', 18)),
    ),
    h('details', { class: 'b-kart kft-kural' },
      h('summary', { class: 'b-bolum-baslik' }, t('kesfet.kurallarBaslik')),
      h('ul', { class: 'kft-kurallar' }, [1, 2, 3, 4].map((n) => h('li', null, t(`karsilama.kurallar.${n}`)))),
    ),
    altGezinme('/kesfet'),
  );
  sec('insan');
  return null;
}

export default {
  kimlik: 'kesfet',
  surum: '0.2.2',
  onek: 'kft',
  semaSurumu: 1,
  cekirdekServisleri: ['metin'],
  ekranlar: {
    kesfet: ekran({ baslikAnahtari: 'ekran.kesfet', durumlar: DORT_DURUM, ciz }),
  },
};
