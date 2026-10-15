// Bağlantı: yalnızca gerçek kişi keşfi (HelloTalk "Dil ortakları bul" esinli liste ve süzgeçler).
// Hesap ve sunucu olmadan gerçek kişi gösterilmez; sahte çevrimiçi durumu veya puan üretilmez.
// Test modunda TEST rozetli sanal kullanıcılar listelenir; karta dokununca profil, oradan mesaj.
import './kesfet.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, ikon, altGezinme, ustBaslik, durumKutusu, yerlestir, testEtiketi, testAvatar } from '../../cekirdek/arayuz.js';
import { t, yerel } from '../../cekirdek/metin.js';
import { al } from '../../cekirdek/depo.js';
import { duyur } from '../../cekirdek/duyuru.js';
import { testModuAcik, testModuAyarla, testProfilleri } from '../../cekirdek/test-modu.js';
import { SEVIYE_SIRASI } from '../../cekirdek/oneri.js';

const SUZGECLER = ['tum', 'anaDil', 'seviye', 'degisim'];

function suz(liste, suzgec) {
  const p = al().profil;
  const benimSeviye = SEVIYE_SIRASI.indexOf(p.seviye);
  if (suzgec === 'anaDil') return liste.filter((k) => k.anaDil === (p.ogrenilenDil || 'en'));
  if (suzgec === 'seviye') return liste.filter((k) => Math.abs(SEVIYE_SIRASI.indexOf(k.seviye) - benimSeviye) <= 1);
  // Dil değişimi: benim ana dilimi öğrenen kişiler (karşılıklı yardım)
  if (suzgec === 'degisim') return liste.filter((k) => p.anaDil && k.ogrenilenDil === p.anaDil);
  return liste;
}

function satir(k, b) {
  return h('button', { type: 'button', class: 'b-kart kft-kisi', onClick: () => b.git(`/kisi?k=${k.kimlik}`), 'aria-label': `${k.ad} · ${t('test.rozet')} · ${t('test.profiliGor')}` },
    testAvatar(k, 52),
    h('span', { class: 'kft-kisi-ic' },
      h('span', { class: 'kft-kisi-ad' }, h('b', null, k.ad), testEtiketi()),
      h('span', { class: 'kft-dil' },
        h('span', { class: 'kft-dil-ana' }, t(`diller.${k.anaDil}`)),
        ikon('sag', 14),
        h('span', { class: 'kft-dil-ogr' }, `${t(`diller.${k.ogrenilenDil}`)} · ${k.seviye}`),
      ),
      h('span', { class: 'kft-kisi-tanitim' }, yerel(k.tanitim)),
      h('span', { class: 'kft-kisi-alt' }, yerel(k.ulke), ' · ', k.ilgi.map((i) => yerel(i)).join(', ')),
    ),
    ikon('sag', 18),
  );
}

function ciz(kok, b) {
  kok.classList.add('b-ekran-gezinmeli');
  if (!testModuAcik()) {
    yerlestir(kok,
      ustBaslik({ baslik: t('kesfet.baslik'), alt: t('kesfet.alt') }),
      h('section', { class: 'b-kart kft-hero', 'aria-labelledby': 'kft-giris' },
        h('span', { class: 'b-ust-etiket' }, t('kesfet.heroEtiket')),
        h('h2', { class: 'b-bolum-baslik', id: 'kft-giris' }, t('kesfet.heroBaslik')),
        h('p', { class: 'b-kucuk kft-hero-alt' }, t('kesfet.heroAlt')),
        durumKutusu('bos', t('kesfet.partnerBos')),
      ),
      h('section', { class: 'b-kart kft-davet' },
        h('div', { class: 'kft-davet-bas' }, testEtiketi(), h('h2', { class: 'b-bolum-baslik' }, t('test.davetBaslik'))),
        h('p', { class: 'b-kucuk' }, t('test.davetAciklama')),
        h('button', { type: 'button', class: 'b-dugme b-dugme-ana', onClick: () => { testModuAyarla(true); duyur(t('test.acildi'), 3000); b.git('/kesfet', { degistir: true }); } }, ikon('kisi', 20), t('test.davetDugme')),
      ),
      h('details', { class: 'b-kart kft-kural' },
        h('summary', { class: 'b-bolum-baslik' }, t('kesfet.kurallarBaslik')),
        h('ul', { class: 'kft-kurallar' }, [1, 2, 3, 4].map((n) => h('li', null, t(`karsilama.kurallar.${n}`)))),
      ),
      altGezinme('/kesfet'),
    );
    return null;
  }

  let suzgec = 'tum';
  const liste = h('div', { class: 'kft-liste', 'aria-live': 'polite' });
  const dugmeler = {};
  function yenile() {
    Object.entries(dugmeler).forEach(([k, d]) => d.setAttribute('aria-pressed', String(k === suzgec)));
    const kisiler = suz(testProfilleri(), suzgec);
    yerlestir(liste, kisiler.length ? kisiler.map((k) => satir(k, b)) : durumKutusu('bos', testProfilleri().length ? t('kesfet.suzgecBos') : t('test.hepsiEngelli')));
  }
  yerlestir(kok,
    ustBaslik({ baslik: t('kesfet.baslik'), alt: t('kesfet.alt') }),
    h('div', { class: 'kft-uyari' }, testEtiketi(), h('span', null, t('test.profillerAciklama'))),
    h('div', { class: 'kft-suzgecler', role: 'group', 'aria-label': t('kesfet.filtreBaslik') },
      SUZGECLER.map((s) => { const d = h('button', { type: 'button', class: 'kft-suzgec', 'aria-pressed': String(s === suzgec), onClick: () => { suzgec = s; yenile(); } }, t(`kesfet.suzgec.${s}`)); dugmeler[s] = d; return d; }),
    ),
    liste,
    h('details', { class: 'b-kart kft-kural' },
      h('summary', { class: 'b-bolum-baslik' }, t('kesfet.kurallarBaslik')),
      h('ul', { class: 'kft-kurallar' }, [1, 2, 3, 4].map((n) => h('li', null, t(`karsilama.kurallar.${n}`)))),
    ),
    altGezinme('/kesfet'),
  );
  yenile();
  return null;
}

export default {
  kimlik: 'kesfet',
  surum: '0.2.9',
  onek: 'kft',
  semaSurumu: 1,
  cekirdekServisleri: ['metin', 'depo', 'test-modu'],
  ekranlar: {
    kesfet: ekran({ baslikAnahtari: 'ekran.kesfet', durumlar: DORT_DURUM, ciz }),
  },
};
