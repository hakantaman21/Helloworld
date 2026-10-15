// Bağlantı: yalnızca gerçek kişi keşfi; hesap ve sunucu olmadan sahte kişi gösterilmez.
// Gerçek kullanıcı profili, sahte çevrimiçi durumu veya geçersiz telaffuz puanı üretilmez.
import './kesfet.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, ikon, altGezinme, ustBaslik, durumKutusu, yerlestir, testEtiketi } from '../../cekirdek/arayuz.js';
import { t, yerel } from '../../cekirdek/metin.js';
import { testModuAcik, testProfilleri } from '../../cekirdek/test-modu.js';

// Test modu açıkken: TEST rozetli profil kartları. Gerçek kişi değildir; mesaj ekranına götürür.
function testKarti(p, b) {
  return h('article', { class: 'b-kart kft-test-kart', 'aria-label': `${p.ad} · ${t('test.rozet')}` },
    h('div', { class: 'kft-test-ust' },
      h('span', { class: `kft-av kft-av-${p.renk}`, 'aria-hidden': 'true' }, p.bas),
      h('div', { class: 'kft-test-kim' },
        h('div', { class: 'kft-test-ad' }, h('b', null, p.ad), testEtiketi()),
        h('span', { class: 'b-kucuk' }, yerel(p.ulke)),
      ),
    ),
    h('p', { class: 'b-kucuk kft-test-dil' }, t('test.dilSatiri', { ana: t(`diller.${p.anaDil}`), ogr: t(`diller.${p.ogrenilenDil}`), seviye: p.seviye })),
    h('p', { class: 'kft-test-tanitim' }, yerel(p.tanitim)),
    h('div', { class: 'kft-etiketler' }, p.ilgi.map((i) => h('span', { class: 'kft-etiket' }, yerel(i)))),
    h('button', { type: 'button', class: 'b-dugme b-dugme-ana', onClick: () => b.git(`/mesaj?k=${p.kimlik}`) }, ikon('sohbet', 20), t('test.mesajYaz')),
  );
}

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
    testModuAcik() ? h('section', { class: 'b-yigin kft-test', 'aria-labelledby': 'kft-test-baslik' },
      h('div', { class: 'b-kart kft-test-uyari' },
        h('h2', { class: 'b-bolum-baslik kft-test-baslik', id: 'kft-test-baslik' }, testEtiketi(), ' ', t('test.profillerBaslik')),
        h('p', { class: 'b-kucuk' }, t('test.profillerAciklama')),
      ),
      testProfilleri().length ? testProfilleri().map((p) => testKarti(p, b)) : durumKutusu('bos', t('test.hepsiEngelli')),
    ) : null,
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
  surum: '0.2.8',
  onek: 'kft',
  semaSurumu: 1,
  cekirdekServisleri: ['metin', 'test-modu'],
  ekranlar: {
    kesfet: ekran({ baslikAnahtari: 'ekran.kesfet', durumlar: DORT_DURUM, ciz }),
  },
};
