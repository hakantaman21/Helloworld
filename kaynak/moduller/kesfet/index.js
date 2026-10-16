// Bağlantı (HelloTalk "Dil Ortakları Bul" düzeni): metin sekmeleri, dil hapları, süzgeç paneli, otomatik eşleşme
// ve el sallama (selam). Hesap ve sunucu olmadan gerçek kişi gösterilmez.
// Test modunda TEST rozetli sanal kullanıcılar listelenir; yaş, çevrimiçi durumu ve rozetler de TEST verisidir.
import './kesfet.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, ikon, ikon3d, altGezinme, durumKutusu, yerlestir, testEtiketi, testAvatar, htUst, htIkon, sekmeler, dilCifti, goreliZaman } from '../../cekirdek/arayuz.js';
import { t, yerel } from '../../cekirdek/metin.js';
import { al } from '../../cekirdek/depo.js';
import { duyur } from '../../cekirdek/duyuru.js';
import { testModuAcik, testModuAyarla, testProfilleri, aktiflik, eslesme, enIyiEslesmeler, selamVer, selamVerildi, selamYaniti, testMesajEkle, ortakIlgiler } from '../../cekirdek/test-modu.js';
import { SEVIYE_SIRASI } from '../../cekirdek/oneri.js';
import { aktiflikMetni, yasRozeti, rozetler } from '../../cekirdek/test-gorunum.js';

const SELAM_YANIT_GECIKMESI = 1500;
const YAS_ARALIKLARI = { tum: [0, 200], genc: [18, 25], orta: [26, 35], ust: [36, 200] };

function selamla(p, yenile) {
  selamVer(p.kimlik, t('ht.selamMetni'));
  duyur(t('ht.selamGitti', { ad: p.ad }), 3000);
  setTimeout(() => testMesajEkle(p.kimlik, selamYaniti(p)), SELAM_YANIT_GECIKMESI);
  yenile();
}

function suz(liste, d) {
  const ben = al().profil;
  const benimSeviye = SEVIYE_SIRASI.indexOf(ben.seviye);
  let sonuc = liste;
  if (d.dil === 'hedef') sonuc = sonuc.filter((k) => k.anaDil === (ben.ogrenilenDil || 'en'));
  if (d.dil === 'benimDilim') sonuc = sonuc.filter((k) => ben.anaDil && k.ogrenilenDil === ben.anaDil);
  if (d.sekme === 'cevrimici') sonuc = sonuc.filter((k) => aktiflik(k).cevrimici);
  if (d.sekme === 'yeni') sonuc = sonuc.filter((k) => k.katildiGun <= 90);
  if (d.sekme === 'yakin') sonuc = sonuc.filter((k) => Math.abs(SEVIYE_SIRASI.indexOf(k.seviye) - benimSeviye) <= 1);
  const [alt, ust] = YAS_ARALIKLARI[d.yas];
  sonuc = sonuc.filter((k) => k.yas >= alt && k.yas <= ust);
  if (d.cinsiyet !== 'tum') sonuc = sonuc.filter((k) => k.cinsiyet === d.cinsiyet);
  if (d.hizli) sonuc = sonuc.filter((k) => (k.rozetler || []).includes('hizli'));
  if (d.sekme === 'uygun') sonuc = [...sonuc].sort((a, b) => eslesme(b).puan - eslesme(a).puan);
  else sonuc = [...sonuc].sort((a, b) => aktiflik(a).dk - aktiflik(b).dk);
  return sonuc;
}

function satir(k, b, yenile) {
  const a = aktiflik(k);
  const selamlandi = selamVerildi(k.kimlik);
  return h('div', { class: 'kft-satir' },
    h('button', { type: 'button', class: 'kft-satir-ana', onClick: () => b.git(`/kisi?k=${k.kimlik}`), 'aria-label': `${k.ad} · ${t('test.rozet')} · ${t('test.profiliGor')}` },
      h('span', { class: 'kft-av-sutun' }, testAvatar(k, 60, { cevrimici: a.cevrimici }), a.cevrimici ? null : h('span', { class: 'b-aktiflik kft-aktiflik' }, aktiflikMetni(k))),
      h('span', { class: 'b-liste-ic' },
        h('span', { class: 'b-liste-ust' }, h('b', null, k.ad), yasRozeti(k), testEtiketi()),
        dilCifti(k.anaDil, k.ogrenilenDil, k.seviye),
        h('span', { class: 'kft-tanitim b-iki-satir' }, yerel(k.tanitim)),
        h('span', { class: 'b-etiketler' },
          ortakIlgiler(k).slice(0, 2).map((i) => h('span', { class: 'b-etiket-hap b-etiket-hap-iyi' }, `♥ ${yerel(i)}`)),
          rozetler(k)),
      ),
    ),
    h('button', { type: 'button', class: `kft-el${selamlandi ? ' kft-el-tamam' : ''}`, 'aria-label': selamlandi ? t('ht.mesajGonder', { ad: k.ad }) : t('ht.selamVer', { ad: k.ad }), title: selamlandi ? t('test.mesajYaz') : t('ht.selam'),
      onClick: () => (selamlandi ? b.git(`/mesaj?k=${k.kimlik}`) : selamla(k, yenile)) }, ikon(selamlandi ? 'sohbet' : 'el', 22)),
  );
}

function eslesmeKarti(sonuc, b, { sonraki, kapat, yenile }) {
  const p = sonuc.profil;
  return h('section', { class: 'b-kart kft-eslesme', 'aria-labelledby': 'kft-eslesme-baslik' },
    h('div', { class: 'kft-eslesme-ust' },
      ikon3d('seri', 28),
      h('h2', { class: 'b-bolum-baslik kft-eslesme-baslik', id: 'kft-eslesme-baslik' }, t('ht.eslesmeBaslik')),
      h('button', { type: 'button', class: 'b-ht-ikon kft-kapat', 'aria-label': t('genel.kapat'), onClick: kapat }, ikon('kapat', 18)),
    ),
    h('div', { class: 'kft-eslesme-kisi' },
      testAvatar(p, 64, { cevrimici: aktiflik(p).cevrimici }),
      h('div', { class: 'b-liste-ic' },
        h('span', { class: 'b-liste-ust' }, h('b', null, p.ad), yasRozeti(p), testEtiketi()),
        dilCifti(p.anaDil, p.ogrenilenDil, p.seviye),
        h('span', { class: 'b-kucuk' }, `${yerel(p.ulke)} · ${aktiflikMetni(p)}`),
      ),
      h('span', { class: 'kft-puan', style: `--kft-puan:${sonuc.puan}%`, 'aria-label': t('ht.uyum', { n: sonuc.puan }) }, h('b', null, `%${sonuc.puan}`), h('small', null, t('ht.uyumKisa'))),
    ),
    h('ul', { class: 'kft-nedenler' }, sonuc.nedenler.map((n) => h('li', null, ikon('onay', 14), t(`ht.neden.${n}`, { dil: t(`diller.${n === 'karsilikli' ? p.ogrenilenDil : p.anaDil}`), ortak: sonuc.ortak.map((i) => yerel(i)).join(', ') })))),
    h('div', { class: 'kft-eslesme-eylem' },
      h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve kft-eylem-dugme', onClick: sonraki }, t('ht.sonraki')),
      h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve kft-eylem-dugme', onClick: () => b.git(`/kisi?k=${p.kimlik}`) }, t('test.profiliGor')),
      h('button', { type: 'button', class: 'b-dugme b-dugme-ana kft-eslesme-selam kft-eylem-dugme', onClick: () => { if (!selamVerildi(p.kimlik)) selamla(p, yenile); b.git(`/mesaj?k=${p.kimlik}`); } }, ikon('el', 18), t('ht.selam')),
    ),
    h('p', { class: 'b-kucuk' }, t('ht.eslesmeAciklama')),
  );
}

function testsizCiz(kok, b) {
  yerlestir(kok,
    htUst({ baslik: t('ht.ortakBul') }),
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
}

function ciz(kok, b) {
  kok.classList.add('b-ekran-gezinmeli');
  if (!testModuAcik()) { testsizCiz(kok, b); return null; }

  const ben = al().profil;
  const durum = { sekme: 'tum', dil: 'hedef', yas: 'tum', cinsiyet: 'tum', hizli: false, panel: false, eslesmeSira: -1 };
  const liste = h('div', { class: 'b-liste kft-liste', 'aria-live': 'polite' });
  const panelAlani = h('div');
  const eslesmeAlani = h('div');
  let suzgecDugmesi;

  function panelCiz() {
    const etkin = ['yas', 'cinsiyet'].filter((k) => durum[k] !== 'tum').length + (durum.hizli ? 1 : 0);
    yerlestir(suzgecDugmesi, ikon('suzgec', 22), etkin ? h('span', { class: 'b-ht-rozet' }, String(etkin)) : null);
    if (!durum.panel) { yerlestir(panelAlani); return; }
    yerlestir(panelAlani, h('section', { class: 'b-kart kft-panel', 'aria-label': t('ht.suzgecler') },
      h('span', { class: 'b-ust-etiket' }, t('ht.yas')),
      sekmeler(Object.keys(YAS_ARALIKLARI).map((k) => [k, t(`ht.yasAralik.${k}`)]), durum.yas, (id) => { durum.yas = id; yenile(); }, { tur: 'hap' }),
      h('span', { class: 'b-ust-etiket' }, t('ht.cinsiyet')),
      sekmeler([['tum', t('ht.cins.tum')], ['k', t('ht.cins.k')], ['e', t('ht.cins.e')]], durum.cinsiyet, (id) => { durum.cinsiyet = id; yenile(); }, { tur: 'hap' }),
      h('label', { class: 'kft-anahtar' },
        h('input', { type: 'checkbox', checked: durum.hizli, onChange: (e) => { durum.hizli = e.currentTarget.checked; yenile(); } }),
        h('span', null, t('ht.yalnizHizli'))),
    ));
  }

  function eslesmeCiz() {
    if (durum.eslesmeSira < 0) { yerlestir(eslesmeAlani); return; }
    const sirali = enIyiEslesmeler();
    if (!sirali.length) { yerlestir(eslesmeAlani, durumKutusu('bos', t('test.hepsiEngelli'))); return; }
    const sonuc = sirali[durum.eslesmeSira % sirali.length];
    yerlestir(eslesmeAlani, eslesmeKarti(sonuc, b, {
      sonraki: () => { durum.eslesmeSira += 1; eslesmeCiz(); },
      kapat: () => { durum.eslesmeSira = -1; eslesmeCiz(); },
      yenile,
    }));
  }

  function yenile() {
    panelCiz();
    const kisiler = suz(testProfilleri(), durum);
    yerlestir(liste, kisiler.length ? kisiler.map((k) => satir(k, b, yenile)) : durumKutusu('bos', testProfilleri().length ? t('kesfet.suzgecBos') : t('test.hepsiEngelli')));
  }

  suzgecDugmesi = htIkon('suzgec', t('ht.suzgecler'), () => { durum.panel = !durum.panel; panelCiz(); });
  yerlestir(kok,
    htUst({
      sol: htIkon(ikon3d('seri', 30), t('ht.eslesmeBaslik'), () => { durum.eslesmeSira = durum.eslesmeSira < 0 ? 0 : -1; eslesmeCiz(); if (durum.eslesmeSira >= 0) eslesmeAlani.scrollIntoView({ block: 'nearest' }); }),
      baslik: t('ht.ortakBul'),
      sag: suzgecDugmesi,
    }),
    sekmeler([['tum', t('kesfet.suzgec.tum')], ['uygun', t('ht.sanaUygun')], ['cevrimici', t('ht.cevrimici')], ['yeni', t('ht.yeni')], ['yakin', t('kesfet.suzgec.seviye')]], durum.sekme, (id) => { durum.sekme = id; yenile(); }, { etiket: t('kesfet.filtreBaslik') }),
    sekmeler([
      ['hedef', t(`diller.${ben.ogrenilenDil || 'en'}`)],
      ['benimDilim', t('ht.dilimiOgrenen', { dil: t(`diller.${ben.anaDil || 'tr'}`) })],
      ['tum', t('ht.tumDiller')],
    ], durum.dil, (id) => { durum.dil = id; yenile(); }, { tur: 'hap', etiket: t('ht.dil') }),
    panelAlani,
    durum.eslesmeSira < 0 ? h('button', { type: 'button', class: 'kft-eslesme-serit', onClick: () => { durum.eslesmeSira = 0; eslesmeCiz(); } },
      ikon3d('seri', 26), h('span', null, h('b', null, t('ht.eslesmeBaslik')), h('small', null, t('ht.eslesmeSerit'))), ikon('sag', 18)) : null,
    eslesmeAlani,
    (ben.ilgiler || []).length ? null : h('button', { type: 'button', class: 'kft-ilgi-davet', onClick: () => b.git('/ayarlar?bolum=ilgi') }, '♥ ', t('ilgi.davet'), ikon('sag', 16)),
    h('p', { class: 'kft-uyari' }, testEtiketi(), ' ', t('ht.testNotu')),
    liste,
    h('details', { class: 'b-kart kft-kural' },
      h('summary', { class: 'b-bolum-baslik' }, t('kesfet.kurallarBaslik')),
      h('ul', { class: 'kft-kurallar' }, [1, 2, 3, 4].map((n) => h('li', null, t(`karsilama.kurallar.${n}`)))),
    ),
    altGezinme('/kesfet'),
  );
  yenile();
  if (b.p.eslesme) { durum.eslesmeSira = 0; eslesmeCiz(); }
  return null;
}

export default {
  kimlik: 'kesfet',
  surum: '0.4.0',
  onek: 'kft',
  semaSurumu: 1,
  cekirdekServisleri: ['metin', 'depo', 'test-modu'],
  ekranlar: {
    kesfet: ekran({ baslikAnahtari: 'ekran.kesfet', durumlar: DORT_DURUM, ciz }),
  },
};
