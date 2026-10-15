// Konuşma karnesi: konuşma bitince düzeltmeler, telaffuz ve Hata Hafızası'na eklenenler burada toplanır.
import './karne.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, ikon, durumKutusu, farkCiz, yerlestir } from '../../cekirdek/arayuz.js';
import { t, yerel } from '../../cekirdek/metin.js';
import { al, degistir } from '../../cekirdek/depo.js';
import { itirazEt } from '../../cekirdek/hafiza.js';
import { siradaki } from '../../cekirdek/gunluk.js';
import { oneriSenaryo } from '../../cekirdek/oneri.js';
import { soyle, destek } from '../../cekirdek/ses/ses-hatti.js';
import { duyur } from '../../cekirdek/duyuru.js';

const YOGUNLUK = { az: 1, orta: 3, cok: Infinity };

// Y15: renk hiçbir zaman tek başına anlam taşımaz; her seviyenin bir işareti vardır.
function telaffuzSeviyesi(puan) {
  if (puan >= 80) return { sinif: 'krn-isaret-iyi', ikon: 'onay', etiket: t('karne.seviye.iyi') };
  if (puan >= 60) return { sinif: 'krn-isaret-orta', ikon: 'nokta', etiket: t('karne.seviye.orta') };
  return { sinif: 'krn-isaret-kotu', ikon: 'dalgaCizgi', etiket: t('karne.seviye.kotu') };
}

function olcu(deger, etiket, not) {
  return h('div', { class: 'b-kart krn-olcu' },
    h('span', { class: 'krn-olcu-deger' }, deger),
    h('span', { class: 'b-kucuk' }, etiket),
    not ? h('span', { class: 'krn-olcu-not' }, not) : null,
  );
}

function duzeltmeKarti(d, kaldir) {
  const kart = h('article', { class: 'b-kart krn-duzeltme' },
    farkCiz(d.segmentler),
    h('p', { class: 'b-kucuk' }, t(d.aciklama)),
    h('div', { class: 'b-cipler' },
      destek.sentez ? h('button', { class: 'b-dugme', onClick: () => soyle(d.dogru, 'yavas') }, ikon('ses', 18), t('karne.tekrarEt')) : null,
      h('button', {
        class: 'b-dugme b-dugme-cerceve',
        onClick: () => {
          itirazEt({ kuralId: d.kuralId, kullanici: d.kullanici, dogru: d.dogru });
          kaldir(d);
          kart.remove();
          duyur(t('karne.yanlisAlindi'));
        },
      }, t('karne.yanlis')),
    ),
  );
  return kart;
}

function ciz(kok, b) {
  const v = al();
  const g = v.sonGorusme;
  kok.classList.add('krn-ekran');
  if (!g) {
    yerlestir(kok, 
      h('header', { class: 'b-ust' }, h('div', { class: 'b-ust-metin' }, h('h1', { class: 'b-baslik' }, t('karne.baslik')))),
      durumKutusu('bos', t('karne.bos'), { metin: t('karne.bugunDon'), fn: () => b.git('/bugun') }),
    );
    return null;
  }

  const sinir = YOGUNLUK[v.profil.ayarlar.duzeltmeYogunlugu] || 3;
  let hepsi = false;
  const duzeltmeListesi = h('div', { class: 'b-yigin' });
  const tumuDugmesi = h('button', { class: 'b-dugme b-dugme-metin krn-tumu' });

  const kaldir = (d) => {
    degistir((x) => {
      x.sonGorusme.duzeltmeler = x.sonGorusme.duzeltmeler.filter((y) => !(y.kuralId === d.kuralId && y.kullanici === d.kullanici));
    });
    duzeltmeleriCiz();
  };

  function duzeltmeleriCiz() {
    const liste = al().sonGorusme.duzeltmeler;
    if (!liste.length) {
      yerlestir(duzeltmeListesi, h('div', { class: 'b-kart b-kart-satir' }, h('span', { class: 'b-ikon-daire b-ikon-daire-iyi' }, ikon('onay', 18, 2.5)), t('karne.duzeltmeYok')));
      tumuDugmesi.hidden = true;
      return;
    }
    const gosterilen = hepsi ? liste : liste.slice(0, sinir);
    yerlestir(duzeltmeListesi, ...gosterilen.map((d) => duzeltmeKarti(d, kaldir)));
    tumuDugmesi.hidden = liste.length <= sinir;
    tumuDugmesi.textContent = hepsi ? t('karne.azGoster') : t('karne.tumunuGor', { n: liste.length });
  }
  tumuDugmesi.addEventListener('click', () => { hepsi = !hepsi; duzeltmeleriCiz(); });
  duzeltmeleriCiz();

  let telaffuzIcerik;
  if (g.yazili) telaffuzIcerik = durumKutusu('bos', t('karne.telaffuzYazili'));
  else if (!g.telaffuz || !g.telaffuz.length) telaffuzIcerik = durumKutusu('bos', t('karne.telaffuzBos'));
  else {
    telaffuzIcerik = h('div', { class: 'b-kart krn-telaffuz' },
      g.telaffuz.map((p) => {
        const s = telaffuzSeviyesi(p.puan);
        return h('div', { class: 'krn-telaffuz-satir' },
          h('span', { class: `krn-isaret ${s.sinif}`, title: s.etiket }, ikon(s.ikon, 16, 2.6), h('span', { class: 'b-gizli' }, s.etiket)),
          h('span', { class: `krn-telaffuz-metin ${s.sinif}`, lang: 'en' }, p.metin),
          h('span', { class: 'b-kucuk krn-puan' }, t('karne.puan', { n: p.puan })),
          destek.sentez ? h('button', { class: 'b-dugme b-dugme-cerceve b-dugme-yuvarlak', 'aria-label': t('karne.dinleTekrar'), onClick: () => soyle(p.metin, 'yavas') }, ikon('ses', 18)) : null,
        );
      }),
      h('div', { class: 'krn-lejant' },
        ['iyi', 'orta', 'kotu'].map((k) => {
          const s = telaffuzSeviyesi(k === 'iyi' ? 90 : k === 'orta' ? 70 : 40);
          return h('span', { class: `krn-lejant-oge ${s.sinif}` }, ikon(s.ikon, 14, 2.6), s.etiket);
        }),
      ),
      h('p', { class: 'b-kucuk' }, t('karne.telaffuzNot')),
    );
  }

  const sira = siradaki();
  const siraMetni = sira === 'senaryo'
    ? t('karne.sirada', { metin: t('bugun.siradaMetin.senaryo', { ad: yerel(oneriSenaryo().senaryo.baslik) }) })
    : sira ? t('karne.sirada', { metin: t(`bugun.siradaMetin.${sira}`, { saat: v.profil.ayarlar[sira === 'sabah' ? 'sabahSaati' : 'aksamSaati'] }) })
    : t('karne.siradaTamam');
  const dakika = Math.max(0.1, Math.round((g.sureSn / 60) * 10) / 10);

  yerlestir(kok, 
    h('header', { class: 'b-ust' },
      h('div', { class: 'b-ust-metin' },
        h('div', { class: 'b-tabela' }, t('karne.tabela', { baslik: yerel(g.baslik) })),
        h('h1', { class: 'b-baslik' }, t('karne.baslik')),
        h('p', { class: 'b-altbaslik' }, g.gorevTamam ? t('karne.ozetIyi') : t('karne.ozetDevam')),
      ),
    ),
    g.tur === 'tanisma' && g.cumleler.length ? h('div', { class: 'b-kart b-cip-vurgu' }, t('karne.seviyeBelirlendi', { s: g.seviyeTahmini })) : null,
    h('div', { class: 'b-izgara-3' },
      olcu(t('karne.dakika', { n: dakika }), t('karne.konustun')),
      olcu(String(g.akicilik), t('karne.akicilik'), t('karne.demoNot')),
      olcu(String(g.yeniKelimeler.length), t('karne.yeniKelime')),
    ),
    h('section', { class: 'b-yigin', 'aria-labelledby': 'krn-duz' },
      h('h2', { class: 'b-bolum-baslik', id: 'krn-duz' }, t('karne.duzeltmeBaslik')),
      duzeltmeListesi,
      tumuDugmesi,
      g.ceviriler.length ? h('div', { class: 'b-kart' },
        h('span', { class: 'b-ust-etiket' }, t('karne.ceviriBaslik')),
        h('div', { class: 'b-cipler' }, g.ceviriler.map((c) => h('span', { class: 'b-cip' }, t('gorusme.ipucuCeviri', { tr: c.tr, en: c.en })))),
      ) : null,
    ),
    h('section', { class: 'b-yigin', 'aria-labelledby': 'krn-tel' },
      h('h2', { class: 'b-bolum-baslik', id: 'krn-tel' }, t('karne.telaffuzBaslik')),
      telaffuzIcerik,
    ),
    h('div', { class: g.eklenenHafiza ? 'b-kart krn-hafiza' : 'b-kart' },
      g.eklenenHafiza ? t('karne.hafizaEklendi', { n: g.eklenenHafiza }) : t('karne.hafizaYok')),
    g.kulturelNot ? h('div', { class: 'b-kart' }, h('span', { class: 'b-ust-etiket' }, t('karne.kulturelNot')), h('p', null, yerel(g.kulturelNot))) : null,
    h('div', { class: 'b-yigin krn-son' },
      h('p', { class: 'b-kucuk krn-ortali' }, siraMetni),
      h('button', { class: 'b-dugme b-dugme-ana', onClick: () => b.git('/bugun') }, t('karne.bugunDon')),
    ),
  );
  return null;
}

export default {
  kimlik: 'karne',
  surum: '0.2.0',
  onek: 'krn',
  semaSurumu: 1,
  cekirdekServisleri: ['depo', 'hafiza', 'ses'],
  ekranlar: {
    karne: ekran({ baslikAnahtari: 'ekran.karne', durumlar: DORT_DURUM, ciz }),
  },
};
