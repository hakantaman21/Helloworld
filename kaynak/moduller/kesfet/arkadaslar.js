// v0.17.0 Bağlan › Arkadaşlar sekmesi: gelen istekler, arkadaş haberleri (tercihlere göre), arkadaşlarım, bekleyen istekler.
// Yalnız TEST kişileri; haberler test verisidir ve TEST rozeti taşır.
import { h, ikon, testAvatar, testEtiketi, goreliZaman, durumKutusu, yerlestir } from '../../cekirdek/arayuz.js';
import { t, yerel } from '../../cekirdek/metin.js';
import { duyur } from '../../cekirdek/duyuru.js';
import { gelenIstekler, arkadasYap, istekReddet, arkadasHaberleri, arkadaslarim, haberTercihleri, gonderilenIstekler } from '../../cekirdek/arkadaslik.js';
import { testProfili } from '../../cekirdek/test-modu.js';
import { TEST_PROFILLERI } from '../../veri/test-profiller.js';
import { rehberDestekleniyor, rehberdenSec, smsAdresi, davetPaylas, davetAdresi } from '../../cekirdek/davet.js';

const HABER_IKON = { an: 'kalem', seviye: 'yildiz', seri: 'saat', foto: 'kamera', ilgi: 'begen', yardim: 'ampul', dogumgunu: 'yildiz', guvende: 'kalkan' };

// v0.26.0 Davet: rehberden çoklu seçim → SMS; ya da paylaşım menüsü / bağlantıyı kopyala.
function davetBolumu() {
  const metin = () => t('davet.smsMetin', { adres: davetAdresi() });
  const sonuc = h('div', { class: 'kft-davet-sonuc' });
  return h('section', { class: 'b-platform kft-ark-bolum kft-davet' },
    h('h2', { class: 'b-grup-etiket kft-ark-baslik' }, h('span', null, t('davet.baslik'))),
    h('p', { class: 'b-kucuk' }, t('davet.rehberAciklama')),
    h('div', { class: 'kft-davet-dugmeler' },
      rehberDestekleniyor() ? h('button', { type: 'button', class: 'b-dugme b-dugme-ana', onClick: async () => {
        const kisiler = await rehberdenSec();
        if (!kisiler.length) return;
        yerlestir(sonuc, h('p', { class: 'b-kucuk' }, t('davet.secildi', { n: kisiler.length, adlar: kisiler.slice(0, 3).map((k) => k.ad).join(', ') })),
          h('a', { class: 'b-dugme b-dugme-ana', href: smsAdresi(kisiler.map((k) => k.tel), metin()) }, ikon('mektup', 18), t('davet.smsGonder', { n: kisiler.length })));
      } }, ikon('kisi', 18), t('davet.rehberden')) : null,
      h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve', onClick: async () => { const r = await davetPaylas(t('davet.metin')); if (r === 'kopyalandi') duyur(t('davet.kopyalandi')); } }, ikon('paylas', 18), t('davet.dugme'))),
    sonuc,
    h('p', { class: 'b-kucuk kft-davet-not' }, rehberDestekleniyor() ? t('davet.gizlilik') : t('davet.rehberYok')));
}

export function arkadasPaneli(b, yenile, satir) {
  const gelen = gelenIstekler();
  const haberler = arkadasHaberleri();
  const arkadaslar = arkadaslarim().map((k) => testProfili(k)).filter(Boolean);
  const bekleyen = gonderilenIstekler().map((k) => TEST_PROFILLERI.find((p) => p.kimlik === k)).filter(Boolean);
  const kapaliTur = Object.entries(haberTercihleri()).filter(([, acik]) => !acik).length;
  const baslik = (metin, sayi) => h('h2', { class: 'b-grup-etiket kft-ark-baslik' }, h('span', null, metin), sayi !== undefined ? h('span', null, String(sayi)) : null);

  return h('div', { class: 'kft-ark' },
    gelen.length ? h('section', { class: 'b-platform kft-ark-bolum' }, baslik(t('arkadas.gelenIstekler'), gelen.length),
      gelen.map((p) => h('div', { class: 'kft-ark-istek' },
        h('button', { type: 'button', class: 'kft-ark-kisi', onClick: () => b.git(`/kisi?k=${p.kimlik}`) }, testAvatar(p, 44), h('span', null, h('b', null, p.ad), ' ', testEtiketi())),
        h('button', { type: 'button', class: 'b-dugme b-dugme-ana kft-ark-dugme', onClick: () => { arkadasYap(p.kimlik); duyur(t('arkadas.artikArkadas', { ad: p.ad })); yenile(); } }, t('arkadas.kabul')),
        h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve kft-ark-dugme', onClick: () => { istekReddet(p.kimlik); duyur(t('arkadas.reddedildi')); yenile(); } }, t('arkadas.reddet'))))) : null,

    h('section', { class: 'b-platform kft-ark-bolum' }, baslik(t('arkadas.haberler'), haberler.length || undefined),
      haberler.length ? haberler.slice(0, 12).map((hb) => h('button', { type: 'button', class: 'kft-ark-haber', onClick: () => b.git(hb.an ? '/dil-anlari' : `/kisi?k=${hb.kisi.kimlik}`) },
        testAvatar(hb.kisi, 40),
        h('span', { class: 'kft-ark-haber-ic' }, h('span', null, h('b', null, hb.kisi.ad), ' ', t(`arkadas.haberTuru.${hb.tur}`)), h('span', { class: 'b-kucuk' }, yerel(hb.metin))),
        h('span', { class: 'kft-ark-haber-sag' }, ikon(HABER_IKON[hb.tur] || 'nokta', 16), h('small', null, goreliZaman(hb.zaman)))))
        : h('p', { class: 'b-kucuk' }, arkadaslar.length ? t('arkadas.haberYok') : t('arkadas.haberIcinArkadas')),
      h('button', { type: 'button', class: 'b-dugme b-dugme-metin kft-ark-tercih', onClick: () => b.git('/ayarlar?grup=gizlilik') }, ikon('ayar', 16), kapaliTur ? t('arkadas.tercihlerKapali', { n: kapaliTur }) : t('arkadas.tercihler'))),

    h('section', { class: 'kft-ark-bolum-duz' }, baslik(t('arkadas.arkadaslarim'), arkadaslar.length),
      arkadaslar.length ? arkadaslar.map((k) => satir(k)) : durumKutusu('bos', t('arkadas.arkadasYok'))),

    davetBolumu(),

    bekleyen.length ? h('section', { class: 'b-platform kft-ark-bolum' }, baslik(t('arkadas.bekleyenIstekler'), bekleyen.length),
      bekleyen.map((p) => h('div', { class: 'kft-ark-istek' }, testAvatar(p, 36), h('span', { class: 'kft-ark-bekle' }, h('b', null, p.ad), h('small', null, t('arkadas.yanitBekleniyor')))))) : null,
  );
}
