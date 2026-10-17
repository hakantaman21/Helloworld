// v0.19.0 Rehber modülü: bildirim ve mesaj kutusu (/kutu), uygulamada arama (/ara), ipuçları ve kılavuz (/kilavuz),
// uygulama haritası (/harita). Hepsi tek özellik dizininden (veri/rehber-dizini.js) beslenir.
import './rehber.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, ikon, ikon3d, ustBaslik, yerlestir, sekmeler, goreliZaman, testAvatar, onayIste, durumKutusu } from '../../cekirdek/arayuz.js';
import { t, yerel } from '../../cekirdek/metin.js';
import { duyur } from '../../cekirdek/duyuru.js';
import * as rehber from '../../cekirdek/rehber.js';
import { yeniEtiketi, ozellikAc, turBaslat, yeniliklerAc } from '../../cekirdek/rehber-arayuz.js';
import { testModuAcik, testProfilleri } from '../../cekirdek/test-modu.js';
import { ONERILEN_ARAMALAR } from '../../veri/rehber-dizini.js';

const grupRengi = (kimlik) => (rehber.grup(kimlik) || {}).renk || 2;

// ================= Kutu =================
let secimModu = false;
let secili = new Set();

function kutuCiz(kok, b) {
  kok.classList.add('rhb-ekran');
  const kat = rehber.KATEGORILER.some((k) => k.kimlik === b.p.kat) ? b.p.kat : 'tum';
  const yenile = () => kutuCiz(kok, b);
  const tum = rehber.kutuOgeleri();
  const say = (k) => tum.filter((o) => o.kat === k);
  const goster = kat === 'tum' ? tum : say(kat);
  const okunmamis = goster.filter((o) => !o.okundu);
  // Seçim yalnız görünen öğeler arasında kalır (kategori değişince eski seçim taşınmaz).
  secili = new Set([...secili].filter((k) => goster.some((o) => o.kaynak === k)));
  const secimBitir = () => { secimModu = false; secili = new Set(); yenile(); };

  const ogeSatiri = (o) => {
    const kategori = rehber.KATEGORILER.find((k) => k.kimlik === o.kat) || rehber.KATEGORILER[5];
    const sec = h('input', { type: 'checkbox', class: 'rhb-kutu-sec', checked: secili.has(o.kaynak), 'aria-label': t('rehber.kutu.secEtiket', { b: o.baslikMetni }),
      onChange: (e) => { if (e.currentTarget.checked) secili.add(o.kaynak); else secili.delete(o.kaynak); yenile(); } });
    const ac = () => {
      if (secimModu) { sec.checked = !sec.checked; sec.dispatchEvent(new Event('change')); return; }
      rehber.okunduYap([o.kaynak]);
      if (o.eylem === 'yenilikler') { yeniliklerAc({ tumu: true }); yenile(); return; }
      if (o.ozellik && !o.yol) { ozellikAc(rehber.ozellik(o.ozellik), b.git); return; }
      if (o.yol) b.git(o.yol); else yenile();
    };
    // Basılı tutunca seçim modu açılır ve bu öğe seçilir.
    let zaman = null;
    const satir = h('div', { class: `rhb-kutu-oge${o.okundu ? '' : ' rhb-okunmamis'}${secili.has(o.kaynak) ? ' rhb-secili' : ''}` },
      secimModu ? sec : null,
      h('button', { type: 'button', class: 'rhb-kutu-ana', onClick: ac,
        onPointerdown: () => { zaman = setTimeout(() => { zaman = null; if (!secimModu) { secimModu = true; secili.add(o.kaynak); if (navigator.vibrate) navigator.vibrate(15); yenile(); } }, 520); },
        onPointerup: () => clearTimeout(zaman), onPointerleave: () => clearTimeout(zaman), onPointercancel: () => clearTimeout(zaman),
        onContextmenu: (e) => e.preventDefault() },
        h('span', { class: `rhb-kutu-simge b-kutu-${kategori.renk}` }, o.profil ? testAvatar(o.profil, 40) : ikon3d(o.ikon || kategori.ikon, 30)),
        h('span', { class: 'rhb-kutu-metin' },
          h('span', { class: 'rhb-kutu-ust' }, h('b', null, o.baslikMetni), h('time', null, goreliZaman(o.zaman))),
          o.govdeMetni ? h('span', { class: 'rhb-kutu-govde' }, o.govdeMetni) : null),
        o.okundu ? null : h('span', { class: 'rhb-kutu-nokta', 'aria-label': t('rehber.kutu.okunmadi') })),
      !secimModu && (o.eylemler || o.tur === 'oneri') ? h('div', { class: 'rhb-kutu-eylemler' },
        (o.eylemler || []).map((e) => h('button', { type: 'button', class: `b-dugme ${e.ana ? 'b-dugme-ana' : 'b-dugme-cerceve'} rhb-kucuk`, onClick: () => { e.fn(); rehber.okunduYap([o.kaynak]); duyur(t('rehber.kutu.yapildi'), 1500); yenile(); } }, e.ad)),
        o.tur === 'oneri' ? h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve rhb-kucuk', onClick: () => { rehber.oneriSustur(o.ozellik); rehber.sil([o.kaynak]); duyur(t('rehber.oneri.susturuldu'), 2500); yenile(); } }, t('rehber.oneri.onerme')) : null) : null);
    return satir;
  };

  const kategoriBaslik = (k, liste) => h('h2', { class: 'rhb-kutu-kat' },
    ikon3d(k.ikon, 22), h('span', null, t(`rehber.kat.${k.kimlik}`)),
    h('small', null, liste.filter((o) => !o.okundu).length ? t('rehber.kutu.katOzet', { n: liste.length, u: liste.filter((o) => !o.okundu).length }) : String(liste.length)),
    h('button', { type: 'button', class: 'rhb-kutu-kat-sil', 'aria-label': t('rehber.kutu.katSil', { k: t(`rehber.kat.${k.kimlik}`) }), onClick: async () => {
      if (!(await onayIste({ metin: t('rehber.kutu.katSilOnay', { k: t(`rehber.kat.${k.kimlik}`), n: liste.length }), evet: t('rehber.kutu.sil'), hayir: t('genel.vazgec') }))) return;
      rehber.sil(liste.map((o) => o.kaynak)); duyur(t('rehber.kutu.silindi', { n: liste.length }), 2000); yenile();
    } }, ikon('kapat', 16)));

  const listeAlani = !goster.length
    ? durumKutusu('bos', kat === 'tum' ? t('rehber.kutu.bos') : t('rehber.kutu.katBos'))
    : kat === 'tum'
      ? rehber.KATEGORILER.map((k) => { const l = say(k.kimlik); return l.length ? h('section', { class: 'rhb-kutu-bolum' }, kategoriBaslik(k, l), h('div', { class: 'rhb-kutu-liste' }, l.map(ogeSatiri))) : null; })
      : h('div', { class: 'rhb-kutu-liste' }, goster.map(ogeSatiri));

  const hepsiSecili = goster.length > 0 && goster.every((o) => secili.has(o.kaynak));
  const arac = secimModu
    ? h('div', { class: 'rhb-kutu-arac rhb-kutu-arac-secim', role: 'toolbar', 'aria-label': t('rehber.kutu.secimArac') },
      h('label', { class: 'rhb-kutu-tumu' }, h('input', { type: 'checkbox', checked: hepsiSecili, onChange: (e) => { secili = e.currentTarget.checked ? new Set(goster.map((o) => o.kaynak)) : new Set(); yenile(); } }), t('rehber.kutu.tumunuSec')),
      h('span', { class: 'rhb-kutu-secili-say', 'aria-live': 'polite' }, t('rehber.kutu.seciliN', { n: secili.size })),
      h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve rhb-kucuk', disabled: !secili.size, onClick: () => { rehber.okunduYap([...secili]); duyur(t('rehber.kutu.okunduYapildi', { n: secili.size }), 1800); secimBitir(); } }, t('rehber.kutu.okunduYap')),
      h('button', { type: 'button', class: 'b-dugme rhb-kucuk rhb-tehlike', disabled: !secili.size, onClick: async () => {
        const n = secili.size;
        if (!(await onayIste({ metin: t('rehber.kutu.silOnay', { n }), evet: t('rehber.kutu.sil'), hayir: t('genel.vazgec') }))) return;
        rehber.sil([...secili]); duyur(t('rehber.kutu.silindi', { n }), 2000); secimBitir();
      } }, t('rehber.kutu.silN', { n: secili.size })))
    : okunmamis.length ? h('div', { class: 'rhb-kutu-arac' },
      h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve rhb-kucuk', onClick: () => { rehber.okunduYap(okunmamis.map((o) => o.kaynak)); duyur(t('rehber.kutu.okunduYapildi', { n: okunmamis.length }), 1800); yenile(); } }, ikon('onay', 16), t('rehber.kutu.tumunuOku', { n: okunmamis.length }))) : null;

  yerlestir(kok,
    ustBaslik({ baslik: t('rehber.kutu.baslik'), ikon: 'mektup', geri: () => b.geri('/bugun'),
      sag: goster.length ? h('button', { type: 'button', class: 'rhb-ust-dugme', 'aria-pressed': String(secimModu), onClick: () => { if (secimModu) secimBitir(); else { secimModu = true; yenile(); } } }, secimModu ? t('genel.vazgec') : t('rehber.kutu.sec')) : null }),
    sekmeler([['tum', tum.length ? `${t('rehber.kat.tum')} · ${tum.length}` : t('rehber.kat.tum')], ...rehber.KATEGORILER.filter((k) => say(k.kimlik).length).map((k) => {
      const u = say(k.kimlik).filter((o) => !o.okundu).length;
      return [k.kimlik, u ? `${t(`rehber.kat.${k.kimlik}`)} · ${u}` : t(`rehber.kat.${k.kimlik}`)];
    })], kat, (id) => { secili = new Set(); b.git(id === 'tum' ? '/kutu' : `/kutu?kat=${id}`, { degistir: true }); }, { tur: 'hap', etiket: t('rehber.kutu.kategoriler') }),
    arac,
    listeAlani,
    h('p', { class: 'rhb-not rhb-dipnot' }, t('rehber.kutu.dipnot')),
  );
  return () => { secimModu = false; secili = new Set(); };
}

// ================= Ara =================
function vurgula(metin, sorgu) {
  const parcalar = rehber.katla(sorgu).split(/\s+/).filter((p) => p.length > 1);
  if (!parcalar.length) return metin;
  const katli = rehber.katla(metin);
  // Katlama karakter sayısını korur (ı→i, ç→c…); bu yüzden konumlar asıl metne aynen uygulanır.
  const isaret = new Array(metin.length).fill(false);
  parcalar.forEach((p) => { let i = katli.indexOf(p); while (i >= 0) { for (let j = i; j < i + p.length && j < metin.length; j++) isaret[j] = true; i = katli.indexOf(p, i + p.length); } });
  const cikti = []; let i = 0;
  while (i < metin.length) { const v = isaret[i]; let j = i; while (j < metin.length && isaret[j] === v) j++; cikti.push(v ? h('mark', null, metin.slice(i, j)) : metin.slice(i, j)); i = j; }
  return cikti;
}


function araCiz(kok, b) {
  kok.classList.add('rhb-ekran');
  let sorgu = b.p.q || '';
  const sonuc = h('div', { class: 'rhb-ara-sonuc', 'aria-live': 'polite' });
  const girdi = h('input', { type: 'search', class: 'rhb-ara-girdi', value: sorgu, placeholder: t('rehber.ara.yerTutucu'), 'aria-label': t('rehber.ara.baslik'), enterkeyhint: 'search',
    onInput: (e) => { sorgu = e.currentTarget.value; ciz(); }, onKeydown: (e) => { if (e.key === 'Enter') { const ilk = sonuc.querySelector('.rhb-ara-oge'); if (ilk) ilk.click(); } } });
  const ac = (o) => { rehber.aramaKaydet(sorgu); ozellikAc(o, b.git); };
  const cip = (metin, fn) => h('button', { type: 'button', class: 'rhb-cip', onClick: fn }, metin);

  function ciz() {
    const s = sorgu.trim();
    if (!s) {
      const son = rehber.sonAramalar();
      yerlestir(sonuc,
        son.length ? h('section', { class: 'rhb-ara-bolum' },
          h('div', { class: 'rhb-ara-baslik' }, h('h2', null, t('rehber.ara.son')), h('button', { type: 'button', class: 'rhb-baglanti', onClick: () => { rehber.aramalariSil(); ciz(); } }, t('rehber.ara.sonSil'))),
          h('div', { class: 'rhb-cipler' }, son.map((x) => cip(x, () => { sorgu = x; girdi.value = x; ciz(); })))) : null,
        h('section', { class: 'rhb-ara-bolum' }, h('h2', null, t('rehber.ara.onerilen')),
          h('div', { class: 'rhb-cipler' }, (yerel(ONERILEN_ARAMALAR) || []).map((x) => cip(x, () => { sorgu = x; girdi.value = x; ciz(); })))),
        h('div', { class: 'rhb-karolar' },
          h('button', { type: 'button', class: 'rhb-karo', onClick: () => b.git('/harita') }, ikon3d('hedef', 34), h('b', null, t('rehber.harita.baslik')), h('small', null, t('rehber.harita.kisa'))),
          h('button', { type: 'button', class: 'rhb-karo', onClick: () => b.git('/kilavuz') }, ikon3d('kitap', 34), h('b', null, t('rehber.kilavuz.baslik')), h('small', null, t('rehber.kilavuz.kisa')))));
      return;
    }
    const bulunan = rehber.ara(s);
    const k = rehber.katla(s);
    const kisiler = testModuAcik() && k.length > 1 ? testProfilleri().filter((p) => rehber.katla(p.ad).includes(k)).slice(0, 5) : [];
    if (!bulunan.length && !kisiler.length) {
      yerlestir(sonuc, durumKutusu('bos', t('rehber.ara.yok', { q: s }), { metin: t('rehber.harita.baslik'), fn: () => b.git('/harita') }));
      return;
    }
    yerlestir(sonuc,
      h('p', { class: 'rhb-ara-say' }, t('rehber.ara.sonucN', { n: bulunan.length + kisiler.length })),
      bulunan.map((o) => {
        const g = rehber.grup(o.grup);
        return h('button', { type: 'button', class: 'rhb-ara-oge', style: `--rhb-renk: var(--renk-kutu-${grupRengi(o.grup)})`, onClick: () => ac(o) },
          h('span', { class: `rhb-ara-simge b-kutu-${grupRengi(o.grup)}` }, ikon3d(o.ikon, 30)),
          h('span', { class: 'rhb-ara-metin' },
            h('span', { class: 'rhb-ara-ad' }, h('b', null, vurgula(yerel(o.ad), s)), yeniEtiketi(o.kimlik)),
            h('span', { class: 'rhb-ara-aciklama' }, vurgula(yerel(o.aciklama), s)),
            h('span', { class: 'rhb-ara-yer' }, g ? yerel(g.ad) : '')),
          ikon('sag', 16));
      }),
      kisiler.length ? h('section', { class: 'rhb-ara-bolum' }, h('h2', null, t('rehber.ara.kisiler')),
        kisiler.map((p) => h('button', { type: 'button', class: 'rhb-ara-oge', onClick: () => { rehber.aramaKaydet(sorgu); b.git(`/kisi?k=${p.kimlik}`); } },
          testAvatar(p, 36), h('span', { class: 'rhb-ara-metin' }, h('b', null, vurgula(p.ad, s)), h('span', { class: 'rhb-ara-yer' }, t('test.rozet'))), ikon('sag', 16)))) : null);
  }

  yerlestir(kok,
    ustBaslik({ baslik: t('rehber.ara.baslik'), ikon: 'arama', geri: () => b.geri('/bugun') }),
    h('label', { class: 'b-ht-arama rhb-ara-kutu' }, ikon('ara', 18), girdi),
    sonuc);
  ciz();
  requestAnimationFrame(() => girdi.focus());
  return null;
}

// ================= Kılavuz =================
function kilavuzCiz(kok, b) {
  kok.classList.add('rhb-ekran');
  const acik = b.p.grup || null;
  const senin = rehber.oneriAdaylari(3);
  const ozellikKarti = (o) => h('article', { class: 'rhb-kil-oz', id: `rhb-oz-${o.kimlik}` },
    h('div', { class: 'rhb-kil-oz-ust' },
      h('span', { class: `rhb-kil-simge b-kutu-${grupRengi(o.grup)}` }, ikon3d(o.ikon, 30)),
      h('h3', null, yerel(o.ad), yeniEtiketi(o.kimlik), o.test && !testModuAcik() ? h('span', { class: 'b-etiket-hap b-etiket-hap-soluk' }, t('rehber.testNotu')) : null)),
    h('p', null, yerel(o.aciklama)),
    h('p', { class: 'rhb-kil-ipucu' }, ikon('ampul', 16), h('span', null, yerel(o.ipucu))),
    (o.yol || o.eylem) && rehber.ozellikGorunur(o) ? h('button', { type: 'button', class: 'rhb-baglanti rhb-kil-ac', onClick: () => ozellikAc(o, b.git) }, o.eylem === 'tur' ? t('rehber.tur.baslat') : t('rehber.ac'), ikon('sag', 14)) : null);

  yerlestir(kok,
    ustBaslik({ baslik: t('rehber.kilavuz.baslik'), ikon: 'kitap', geri: () => b.geri('/bugun'), alt: t('rehber.kilavuz.alt') }),
    h('div', { class: 'rhb-karolar rhb-karolar-4' },
      h('button', { type: 'button', class: 'rhb-karo', onClick: () => turBaslat(b.git) }, ikon3d('ipucu', 34), h('b', null, t('rehber.tur.baslik')), h('small', null, t('rehber.tur.kisa'))),
      h('button', { type: 'button', class: 'rhb-karo', onClick: () => b.git('/ara') }, ikon3d('arama', 34), h('b', null, t('rehber.ara.baslik')), h('small', null, t('rehber.ara.kisa'))),
      h('button', { type: 'button', class: 'rhb-karo', onClick: () => b.git('/harita') }, ikon3d('hedef', 34), h('b', null, t('rehber.harita.baslik')), h('small', null, t('rehber.harita.kisa'))),
      h('button', { type: 'button', class: 'rhb-karo', onClick: () => yeniliklerAc({ tumu: true }) }, ikon3d('hediye', 34), h('b', null, t('rehber.yenilik.baslik')), h('small', null, t('rehber.yenilik.kisa')))),
    senin.length ? h('section', { class: 'rhb-kil-senin' },
      h('h2', { class: 'rhb-bolum-baslik' }, t('rehber.kilavuz.senin')),
      h('p', { class: 'rhb-not' }, t('rehber.kilavuz.seninAlt')),
      h('div', { class: 'rhb-cipler' }, senin.map((o) => h('button', { type: 'button', class: 'rhb-cip rhb-cip-ikonlu', onClick: () => ozellikAc(o, b.git) }, ikon3d(o.ikon, 20), yerel(o.ad))))) : null,
    rehber.HARITA_GRUPLARI.map((g) => {
      const liste = rehber.OZELLIKLER.filter((o) => o.grup === g.kimlik);
      const yeni = liste.filter((o) => rehber.yeniMi(o.kimlik)).length;
      return h('details', { class: 'rhb-kil-grup', id: `rhb-g-${g.kimlik}`, open: acik === g.kimlik },
        h('summary', { class: 'rhb-kil-ozet' },
          h('span', { class: `rhb-kil-simge b-kutu-${g.renk}` }, ikon3d(g.ikon, 30)),
          h('span', { class: 'rhb-kil-ozet-metin' }, h('b', null, yerel(g.ad)), h('small', null, `${yerel(g.alt)} · ${t('rehber.ozellikN', { n: liste.length })}`)),
          yeni ? h('span', { class: 'b-yeni' }, t('rehber.yeniN', { n: yeni })) : null,
          ikon('asagi', 18)),
        h('div', { class: 'rhb-kil-ic' }, liste.map(ozellikKarti)));
    }),
    h('p', { class: 'rhb-not rhb-dipnot' }, t('rehber.kilavuz.dipnot')),
  );
  if (b.p.oz) requestAnimationFrame(() => { const el = kok.querySelector(`#rhb-oz-${CSS.escape(b.p.oz)}`); if (el) { el.closest('details').open = true; el.scrollIntoView({ block: 'center' }); } });
  return null;
}

// ================= Uygulama haritası =================
function haritaCiz(kok, b) {
  kok.classList.add('rhb-ekran');
  yerlestir(kok,
    ustBaslik({ baslik: t('rehber.harita.baslik'), ikon: 'hedef', geri: () => b.geri('/bugun'), alt: t('rehber.harita.alt') }),
    rehber.kullanimBilinir() ? h('p', { class: 'rhb-harita-lejant' }, h('span', { class: 'rhb-harita-nokta', 'aria-hidden': 'true' }), t('rehber.harita.lejant')) : null,
    rehber.HARITA_GRUPLARI.map((g, i) => h('section', { class: `rhb-harita-grup b-kutu-${g.renk}`, 'aria-labelledby': `rhb-h-${g.kimlik}` },
      h('header', { class: 'rhb-harita-ust' },
        h('span', { class: 'rhb-harita-no', 'aria-hidden': 'true' }, String(i + 1)),
        ikon3d(g.ikon, 32),
        h('span', { class: 'rhb-harita-ad' }, h('h2', { id: `rhb-h-${g.kimlik}` }, yerel(g.ad)), h('small', null, yerel(g.alt)))),
      h('ol', { class: 'rhb-harita-liste' }, rehber.OZELLIKLER.filter((o) => o.grup === g.kimlik && rehber.ozellikGorunur(o)).map((o) => {
        const acilmadi = rehber.hicAcilmadi(o.iz);
        return h('li', null, h('button', { type: 'button', class: 'rhb-harita-oge', onClick: () => ozellikAc(o, b.git) },
          ikon3d(o.ikon, 24),
          h('span', { class: 'rhb-harita-oge-metin' }, h('b', null, yerel(o.ad), yeniEtiketi(o.kimlik)), h('small', null, yerel(o.aciklama))),
          acilmadi ? h('span', { class: 'rhb-harita-nokta', title: t('rehber.harita.acilmadi'), 'aria-label': t('rehber.harita.acilmadi') }) : null,
          ikon('sag', 14)));
      })))),
    h('p', { class: 'rhb-not rhb-dipnot' }, t('rehber.harita.dipnot')),
  );
  return null;
}

export default {
  kimlik: 'rehber',
  surum: '0.19.0',
  onek: 'rhb',
  semaSurumu: 1,
  ekranlar: {
    // Kutuda mesaj önizlemeleri var: "Kişiler ve sohbetler" kilit kapsamına girer.
    kutu: ekran({ baslikAnahtari: 'ekran.kutu', durumlar: DORT_DURUM, ciz: kutuCiz, kilitKapsami: 'kisiler' }),
    ara: ekran({ baslikAnahtari: 'ekran.ara', durumlar: DORT_DURUM, ciz: araCiz }),
    kilavuz: ekran({ baslikAnahtari: 'ekran.kilavuz', durumlar: DORT_DURUM, ciz: kilavuzCiz }),
    harita: ekran({ baslikAnahtari: 'ekran.harita', durumlar: DORT_DURUM, ciz: haritaCiz }),
  },
};
