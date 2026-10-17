// v0.21.0 Senaryo kartları (tek yerde, her ekran aynı bileşeni kullanır):
//   kareKart  — yatay şeritte iki tanesi bir ekrana sığan sade kart (dokun: başlat · basılı tut: rapor)
//   genisKart — tam sayfa ya da alta açılan listede geniş "sohbet kartı": durum, görev, sözcükler, kullanım bilgisi
//   senaryoIsareti — denenen/tamamlanan senaryoyu ötekilerden ayıran belirteç
//   raporAc — kullanım raporu (alt pencere): başarı oranı, deneme, son kullanım, süre, son görüşmeler
import { h, ikon, ikon3d, goreliZaman } from './arayuz.js';
import { t, yerel, aktifDil } from './metin.js';
import { basiliTut } from './kisi-eylemleri.js';
import { istatistik, sonGorusmeler } from './senaryo-istatistik.js';
import alanlar from '../veri/alanlar.js';

const ALAN_IKON = { ev: 'aile', alisveris: 'hediye', ulasim: 'hedef', saglik: 'yildiz', is: 'kupa', sosyal: 'sohbet', teknoloji: 'yz', egitim: 'kitap', resmi: 'kalem' };
const alanAdi = (k) => { const a = alanlar.find((x) => x.kimlik === k); return a ? t(a.metin) : ''; };
const baslat = (s, git) => git(`/gorusme?tur=senaryo&id=${s.kimlik}`);
const sureDk = (s) => (s.adimlar || []).length + 2;

function senaryoIsareti(id, { kisa = false, kose = false } = {}) {
  const i = istatistik(id);
  if (!i.durum) return null;
  const ad = i.durum === 'tamam' ? t('snk.isaret.tamam') : t('snk.isaret.denendi');
  return h('span', { class: `b-snk-isaret b-snk-isaret-${i.durum}${kose ? ' b-snk-kose' : ''}`, title: ad, 'aria-label': ad }, ikon(i.durum === 'tamam' ? 'onay' : 'degis', 12, 3), kisa ? null : h('span', null, ad));
}

function sureYazi(sn) {
  const dk = Math.round(sn / 60);
  return dk < 1 ? t('snk.sureSn', { n: sn }) : t('snk.sureDk', { n: dk });
}
function tarihYazi(z) {
  return z ? new Date(z).toLocaleDateString(aktifDil() === 'tr' ? 'tr-TR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';
}
function ozetSatiri(id) {
  const i = istatistik(id);
  if (!i.deneme) return h('p', { class: 'b-snk-ozet b-snk-ozet-bos' }, ikon('yildiz', 14), t('snk.henuzYok'));
  return h('p', { class: 'b-snk-ozet' }, ikon('saat', 14),
    t('snk.ozet', { son: goreliZaman(i.son), n: i.deneme, oran: i.oran }));
}

function kareKart(s, { git, renk = 1 }) {
  const kart = h('button', { type: 'button', class: `b-snk-kare b-kutu-${renk}`, 'aria-label': `${yerel(s.baslik)} · ${s.seviye}`, onClick: () => baslat(s, git) },
    h('span', { class: 'b-snk-kare-ust' }, h('span', { class: 'b-snk-hap' }, s.seviye), senaryoIsareti(s.kimlik, { kisa: true })),
    ikon3d(ALAN_IKON[s.alan] || 'senaryo', 40),
    h('b', { class: 'b-snk-kare-baslik' }, yerel(s.baslik)),
    h('small', { class: 'b-snk-kare-alt' }, yerel(s.roller.koc)));
  return basiliTut(kart, () => raporAc(s, { git }));
}

function genisKart(s, { git, ekBilgi = null }) {
  const kelimeler = (s.anahtarKelimeler || []).slice(0, 4);
  const kart = h('article', { class: 'b-snk-genis', 'aria-labelledby': `b-snk-${s.kimlik}` },
    h('div', { class: 'b-snk-genis-ust' },
      h('span', { class: 'b-snk-genis-simge b-kutu-2' }, ikon3d(ALAN_IKON[s.alan] || 'senaryo', 40)),
      h('span', { class: 'b-snk-genis-ad' },
        h('h3', { id: `b-snk-${s.kimlik}` }, yerel(s.baslik)),
        aktifDil() !== 'en' ? h('small', { lang: 'en' }, s.baslik.en) : null,
        h('span', { class: 'b-snk-hapler' }, h('span', { class: 'b-snk-hap' }, s.seviye), h('span', { class: 'b-snk-hap' }, yerel(s.roller.koc)), h('span', { class: 'b-snk-hap' }, t('snk.dk', { n: sureDk(s) })), senaryoIsareti(s.kimlik))),
    ),
    h('p', { class: 'b-snk-durum' }, yerel(s.durum)),
    h('p', { class: 'b-snk-gorev' }, h('b', null, t('snk.gorev')), ' ', yerel(s.gorev.aciklama)),
    kelimeler.length ? h('ul', { class: 'b-snk-kelimeler', 'aria-label': t('snk.kelimeler') }, kelimeler.map((k) => h('li', null, h('span', { lang: 'en' }, k.en), aktifDil() === 'en' ? null : h('small', null, k.tr)))) : null,
    ekBilgi,
    ozetSatiri(s.kimlik),
    h('div', { class: 'b-snk-eylemler' },
      h('button', { type: 'button', class: 'b-dugme b-dugme-ana b-snk-baslat', onClick: () => baslat(s, git) }, ikon('mikrofon', 18), istatistik(s.kimlik).deneme ? t('snk.tekrarBaslat') : t('snk.baslat')),
      h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve b-snk-rapor-dugme', onClick: () => raporAc(s, { git }) }, ikon('grafik', 18), t('snk.rapor'))));
  return basiliTut(kart, () => raporAc(s, { git }));
}

// Kullanım raporu: ekranın üstünde açılan alt pencere (geri tuşu ve boş alan kapatır).
function raporAc(s, { git }) {
  const i = istatistik(s.kimlik);
  const kapat = () => { perde.remove(); document.removeEventListener('keydown', tus); };
  const tus = (e) => { if (e.key === 'Escape') kapat(); };
  const kutu = (etiket, deger, alt) => h('div', { class: 'b-snk-rapor-kutu' }, h('small', null, etiket), h('b', null, deger), alt ? h('span', null, alt) : null);
  const gorusmeler = sonGorusmeler(s.kimlik);
  const perde = h('div', { class: 'b-alt-pencere-perde', onClick: (e) => { if (e.target === perde) kapat(); } },
    h('div', { class: 'b-alt-pencere b-snk-rapor', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'b-snk-rapor-baslik' },
      h('div', { class: 'b-alt-pencere-tutamak', 'aria-hidden': 'true' }),
      h('div', { class: 'b-alt-pencere-ust' },
        h('h2', { class: 'b-alt-pencere-baslik', id: 'b-snk-rapor-baslik' }, ikon3d(ALAN_IKON[s.alan] || 'senaryo', 28), yerel(s.baslik)),
        h('button', { type: 'button', class: 'b-ht-ikon b-ht-ikon-saydam', 'aria-label': t('genel.kapat'), onClick: kapat }, ikon('kapat', 20))),
      h('div', { class: 'b-alt-pencere-ic' },
        h('p', { class: 'b-snk-rapor-alt' }, `${alanAdi(s.alan)} · ${s.seviye} · ${yerel(s.roller.koc)}`, ' ', senaryoIsareti(s.kimlik)),
        i.deneme ? [
          h('div', { class: 'b-snk-oran', role: 'img', 'aria-label': t('snk.oranEtiket', { n: i.oran }) },
            h('div', { class: 'b-snk-oran-ust' }, h('span', null, t('snk.basariOrani')), h('b', null, `%${i.oran}`)),
            h('div', { class: 'b-snk-oran-cubuk' }, h('i', { style: `width:${i.oran}%` })),
            h('small', null, t('snk.oranAciklama', { t: i.tamam, d: i.deneme }))),
          h('div', { class: 'b-snk-rapor-izgara' },
            kutu(t('snk.sonKullanim'), goreliZaman(i.son), tarihYazi(i.son)),
            kutu(t('snk.ilkDeneme'), tarihYazi(i.ilk)),
            kutu(t('snk.deneme'), String(i.deneme), t('snk.tamamN', { n: i.tamam })),
            kutu(t('snk.toplamSure'), sureYazi(i.sureSn)),
            kutu(t('snk.cumle'), String(i.cumle)),
            kutu(t('snk.duzeltme'), i.duzeltmeOrani == null ? '—' : String(i.duzeltmeOrani), t('snk.duzeltmeAlt'))),
          gorusmeler.length ? h('section', { class: 'b-snk-gecmis' }, h('h3', { class: 'b-grup-etiket' }, t('snk.sonGorusmeler')),
            gorusmeler.map((g) => h('button', { type: 'button', class: 'b-snk-gecmis-satir', onClick: () => { kapat(); git(`/karne?g=${g.kimlik}`); } },
              ikon(g.gorevTamam ? 'onay' : 'degis', 16), h('span', null, `${tarihYazi(Date.parse(`${g.tarih}T12:00:00`))} · ${sureYazi(g.sureSn || 0)} · ${t('snk.cumleN', { n: (g.cumleler || []).length })}`), ikon('sag', 14)))) : null,
          h('p', { class: 'ayr-not' }, t('snk.demoNotu')),
        ] : h('p', { class: 'b-snk-rapor-bos' }, t('snk.raporBos')),
        h('div', { class: 'b-snk-rapor-alt-dugmeler' },
          h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve', onClick: kapat }, t('genel.kapat')),
          h('button', { type: 'button', class: 'b-dugme b-dugme-ana', onClick: () => { kapat(); baslat(s, git); } }, ikon('mikrofon', 18), i.deneme ? t('snk.tekrarBaslat') : t('snk.baslat'))))));
  document.addEventListener('keydown', tus);
  document.body.append(perde);
  const d = perde.querySelector('.b-dugme-ana'); if (d) d.focus();
}

export { ALAN_IKON, senaryoIsareti, kareKart, genisKart, raporAc };
