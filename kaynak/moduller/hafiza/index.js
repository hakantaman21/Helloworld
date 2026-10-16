// Hata Hafızası ekranı: hatalar, tekrar durumu ve "Şimdi pratik yap".
import './hafiza.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, ikon, altGezinme, ustBaslik, durumKutusu, yerlestir } from '../../cekirdek/arayuz.js';
import { t, yerel } from '../../cekirdek/metin.js';
import { al } from '../../cekirdek/depo.js';
import { vadesiGelenler, OGRENILDI_SERISI } from '../../cekirdek/hafiza.js';
import { tarihAnahtari, kisaTarih } from '../../cekirdek/zaman.js';
import { duyur } from '../../cekirdek/duyuru.js';

const TURLER = ['tumu', 'kelime', 'gramer', 'telaffuz'];
let secilenTur = 'tumu';

function ogeKarti(k) {
  const bugun = tarihAnahtari();
  const durumEtiketi = k.durum === 'ogrenildi'
    ? h('span', { class: 'b-cip b-cip-iyi' }, t('hafiza.ogrenildi'))
    : k.sonrakiTekrar <= bugun ? h('span', { class: 'b-cip b-cip-vurgu' }, t('hafiza.sirada')) : null;
  return h('article', { class: `b-kart hfz-oge${k.durum === 'ogrenildi' ? ' hfz-oge-ogrenildi' : ''}` },
    h('div', { class: 'hfz-oge-ust' },
      h('span', { class: 'b-ust-etiket' }, `${t(`hafiza.tur.${k.tur}`)} · ${k.seviye}`),
      durumEtiketi,
    ),
    h('p', { class: 'hfz-dogru', lang: 'en' }, k.dogru),
    k.kullanici && k.kullanici !== k.dogru ? h('p', { class: 'b-kucuk', lang: k.tur === 'kelime' ? 'tr' : 'en' }, t('hafiza.sen', { metin: k.kullanici })) : null,
    h('div', { class: 'hfz-alt' },
      h('span', { class: 'b-kucuk' }, t('hafiza.kaynak', { baglam: yerel(k.baglam), tarih: kisaTarih(k.sonGorulme) })),
      h('span', { class: 'hfz-seri', 'aria-label': t('hafiza.tekrar', { n: Math.min(k.seri, OGRENILDI_SERISI) }) },
        Array.from({ length: OGRENILDI_SERISI }, (_, i) => h('span', { class: i < k.seri ? 'hfz-nokta hfz-nokta-dolu' : 'hfz-nokta' }))),
    ),
  );
}

let hafizaArama = '';

function ciz(kok, b) {
  kok.classList.add('b-ekran-gezinmeli');
  const tum = al().hafiza;
  const vadesi = vadesiGelenler();
  const ogrenilen = tum.filter((k) => k.durum === 'ogrenildi').length;
  // v0.13.0: Hata Hafızası içinde metin arama (öğe yüzlerce olunca tür süzgeci yetmez).
  const liste = h('div', { 'aria-live': 'polite' });
  function listeCiz() {
    const ara = hafizaArama.toLocaleLowerCase();
    const filtreli = (secilenTur === 'tumu' ? tum : tum.filter((k) => k.tur === secilenTur))
      .filter((k) => !ara || Object.values(k).some((d) => typeof d === 'string' && d.toLocaleLowerCase().includes(ara)));
    const siralama = [...filtreli].sort((a, c) => {
      if (a.durum !== c.durum) return a.durum === 'aktif' ? -1 : 1;
      return a.sonrakiTekrar < c.sonrakiTekrar ? -1 : 1;
    });
    if (!tum.length) yerlestir(liste, durumKutusu('bos', t('hafiza.bos')));
    else if (!filtreli.length) yerlestir(liste, durumKutusu('bos', t('hafiza.filtreBos')));
    else yerlestir(liste, h('div', { class: 'b-yigin' }, siralama.map(ogeKarti)));
  }
  listeCiz();

  yerlestir(kok, 
    ustBaslik({ tabela: t('gezinme.pratik'), baslik: t('hafiza.baslik'), alt: t('hafiza.alt'), ikon: 'hafiza', geri: () => b.geri('/bugun') }),
    tum.length ? h('div', { class: 'b-kart hfz-ozet', role: 'status' }, t('hafiza.durum', { n: vadesi.length, m: ogrenilen })) : null,
    tum.length ? h('label', { class: 'b-ht-arama' }, ikon('ara', 18),
      h('input', { type: 'search', value: hafizaArama, placeholder: t('ht.ara'), 'aria-label': t('hafiza.ara'), onInput: (e) => { hafizaArama = e.target.value.trim(); listeCiz(); } })) : null,
    h('div', { class: 'b-cipler', role: 'radiogroup', 'aria-label': t('hafiza.turEtiket') },
      TURLER.map((tur) => h('button', {
        class: 'b-dugme b-dugme-cerceve',
        role: 'radio',
        'aria-checked': tur === secilenTur ? 'true' : 'false',
        onClick: () => { secilenTur = tur; ciz(kok, b); },
      }, t(`hafiza.tur.${tur}`))),
    ),
    liste,
    h('button', {
      class: 'b-dugme b-dugme-ana b-ana-eylem',
      onClick: () => {
        if (!vadesi.length) { duyur(t('hafiza.pratikYok')); return; }
        b.git('/gorusme?tur=tekrar');
      },
    }, t('hafiza.pratik')),
    altGezinme('/bugun'),
  );
  return null;
}

export default {
  kimlik: 'hafiza',
  surum: '0.2.0',
  onek: 'hfz',
  semaSurumu: 1,
  cekirdekServisleri: ['depo', 'hafiza'],
  ekranlar: {
    hafiza: ekran({ baslikAnahtari: 'ekran.hafiza', durumlar: DORT_DURUM, ciz }),
  },
};
