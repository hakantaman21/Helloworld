// v0.20.0 Uygulamalarımız ekranı (/uygulamalar): English Prime ve Yoldaş tanıtımı, çapraz indirim ve (düzenleme modunda)
// uygulama adresleri, indirim oranı ve TEST üyeliği.
import './ekosistem.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, ikon, ikon3d, ustBaslik, yerlestir } from '../../cekirdek/arayuz.js';
import { t, yerel } from '../../cekirdek/metin.js';
import { duyur } from '../../cekirdek/duyuru.js';
import * as eko from '../../cekirdek/ekosistem.js';
import { aktifPaket } from '../../cekirdek/paketler.js';

let duzenle = false;

function ciz(kok, b) {
  kok.classList.add('eko-ekran');
  const yenile = () => ciz(kok, b);
  const diger = eko.digerUyelikler();
  const oran = eko.indirimOrani();
  const kart = (u) => {
    const a = eko.adres(u.kimlik);
    const uyesi = diger.find((d) => d.uygulama.kimlik === u.kimlik);
    return h('article', { class: `eko-kart b-kutu-${u.renk}`, id: `eko-${u.kimlik}`, 'aria-labelledby': `eko-${u.kimlik}-ad` },
      h('div', { class: 'eko-kart-ust' },
        h('span', { class: 'eko-simge' }, ikon3d(u.ikon, 48)),
        h('span', { class: 'eko-kart-ad' }, h('h2', { id: `eko-${u.kimlik}-ad` }, u.ad), h('small', null, yerel(u.kisa)))),
      h('p', null, yerel(u.aciklama)),
      h('p', { class: 'eko-neden' }, ikon('ampul', 16), h('span', null, yerel(u.neden))),
      eko.digerlerindeIndirimVar() ? h('p', { class: 'eko-teklif' }, ikon('yildiz', 16), t('eko.teklifOrada', { n: oran, ad: u.ad, paket: yerel(aktifPaket().ad) })) : null,
      uyesi ? h('p', { class: 'eko-teklif eko-teklif-iyi' }, ikon('onay', 16), t(uyesi.kaynak === 'test' ? 'eko.uyesinTest' : 'eko.uyesin', { ad: u.ad, n: oran })) : null,
      a ? h('a', { class: 'b-dugme b-dugme-ana eko-ac', href: a, target: '_blank', rel: 'noopener noreferrer' }, t('eko.ac', { ad: u.ad }), ikon('sag', 16))
        : h('p', { class: 'eko-not eko-adres-yok' }, t('eko.adresYok')),
      duzenle ? h('div', { class: 'eko-duzenle' },
        h('label', { class: 'eko-pkt-alan' }, h('span', null, t('eko.adresAlan')),
          h('input', { type: 'url', class: 'b-girdi', inputmode: 'url', placeholder: 'https://…', value: eko.ekosistemAyari().adresler[u.kimlik] || '', onChange: (e) => {
            const v = e.currentTarget.value.trim();
            eko.adresAyarla(u.kimlik, v);
            duyur(v && !eko.adres(u.kimlik) ? t('eko.adresGecersiz') : t('paket.kaydedildi'), 2500); yenile();
          } })),
        h('label', { class: 'eko-satir eko-anahtar' },
          h('span', { class: 'eko-satir-metin' }, h('span', { class: 'eko-satir-etiket' }, t('eko.testUyelik', { ad: u.ad })), h('span', { class: 'eko-satir-aciklama' }, t('eko.testUyelikAciklama'))),
          h('input', { type: 'checkbox', class: 'eko-anahtar-girdi', checked: Boolean(eko.ekosistemAyari().test[u.kimlik]), onChange: (e) => { eko.testUyelikAyarla(u.kimlik, e.currentTarget.checked); yenile(); } }),
          h('span', { class: 'eko-anahtar-iz', 'aria-hidden': 'true' }))) : null);
  };

  yerlestir(kok,
    ustBaslik({ baslik: t('eko.baslik'), ikon: 'ekosistem', geri: () => b.geri('/bugun'), alt: t('eko.alt') }),
    eko.buradaIndirimVar() ? h('button', { type: 'button', class: 'eko-serit', onClick: () => b.git('/paketler') },
      ikon3d('hediye', 34), h('span', null, h('b', null, t('eko.buradaBaslik', { n: oran })), h('small', null, t('eko.buradaAlt', { ad: diger.map((d) => d.uygulama.ad).join(', ') }))), ikon('sag', 16)) : null,
    eko.UYGULAMALAR.map(kart),
    h('p', { class: 'eko-not eko-not-kutu' }, t('eko.not')),
    h('label', { class: 'eko-satir eko-anahtar eko-pkt-duzen' },
      h('span', { class: 'eko-satir-metin' }, h('span', { class: 'eko-satir-etiket' }, t('paket.duzenleModu')), h('span', { class: 'eko-satir-aciklama' }, t('eko.duzenleAciklama'))),
      h('input', { type: 'checkbox', class: 'eko-anahtar-girdi', checked: duzenle, onChange: (e) => { duzenle = e.currentTarget.checked; yenile(); } }),
      h('span', { class: 'eko-anahtar-iz', 'aria-hidden': 'true' })),
    duzenle ? h('label', { class: 'eko-pkt-alan' }, h('span', null, t('eko.indirimAlan')),
      h('input', { type: 'number', min: '0', max: '50', step: '1', class: 'b-girdi', value: String(oran), onChange: (e) => { eko.indirimAyarla(e.currentTarget.value); duyur(t('paket.kaydedildi'), 1500); yenile(); } })) : null,
  );
  if (b.p.u) requestAnimationFrame(() => { const el = kok.querySelector(`#eko-${CSS.escape(b.p.u)}`); if (el) el.scrollIntoView({ block: 'start' }); });
  return null;
}

export default {
  kimlik: 'ekosistem',
  surum: '0.20.0',
  onek: 'eko',
  semaSurumu: 1,
  ekranlar: { uygulamalar: ekran({ baslikAnahtari: 'ekran.uygulamalar', durumlar: DORT_DURUM, ciz }) },
};
