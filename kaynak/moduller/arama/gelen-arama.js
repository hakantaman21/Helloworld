// "Koç arıyor" ekranı. Uygulama açıkken arama saati gelince ya da Bugün kartından açılır.
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, ikon, yerlestir } from '../../cekirdek/arayuz.js';
import { t } from '../../cekirdek/metin.js';
import { ertele, reddet } from '../../cekirdek/zamanlayici.js';
import { duyur } from '../../cekirdek/duyuru.js';

export const gelenArama = ekran({
  baslikAnahtari: 'ekran.gelenArama',
  durumlar: DORT_DURUM,
  ciz(kok, b) {
    const tur = b.p.tur === 'aksam' ? 'aksam' : 'sabah';
    kok.classList.add('b-ekran-tam', 'ara-gelen');
    if (navigator.vibrate) {
      try { navigator.vibrate([200, 120, 200]); } catch (hata) { /* titreşim desteklenmiyor */ }
    }

    yerlestir(kok, 
      h('p', { class: 'ara-gelen-ust' }, t(`arama.ust.${tur}`)),
      h('div', { class: 'ara-gelen-koc', 'aria-hidden': 'true' }, ikon('dalga', 56, 2)),
      h('h1', { class: 'ara-gelen-ad' }, t('koc.ad')),
      h('p', { class: 'ara-gelen-alt' }, t('arama.geliyor')),
      h('p', { class: 'ara-gelen-konu' }, t(`arama.konu.${tur}`)),
      h('div', { class: 'b-buyut' }),
      h('div', { class: 'ara-gelen-secenekler' },
        h('button', { class: 'ara-gelen-kucuk', onClick: () => b.git(`/gorusme?tur=${tur}&yazili=1`, { degistir: true }) }, t('arama.yazili')),
        h('button', {
          class: 'ara-gelen-kucuk',
          onClick: () => { ertele(tur); duyur(t('arama.ertelendi')); b.geri(); },
        }, t('arama.ertele')),
      ),
      h('div', { class: 'ara-gelen-dugmeler' },
        h('div', { class: 'ara-gelen-sutun' },
          h('button', {
            class: 'ara-yuvarlak ara-reddet',
            'aria-label': t('arama.reddet'),
            onClick: () => { reddet(tur); duyur(t('arama.reddedildi')); b.geri(); },
          }, ikon('kapat', 30, 2.2)),
          h('span', { 'aria-hidden': 'true' }, t('arama.reddet')),
        ),
        h('div', { class: 'ara-gelen-sutun' },
          h('button', {
            class: 'ara-yuvarlak ara-ac',
            'aria-label': t('arama.ac'),
            onClick: () => b.git(`/gorusme?tur=${tur}`, { degistir: true }),
          }, ikon('telefon', 30, 2)),
          h('span', { 'aria-hidden': 'true' }, t('arama.ac')),
        ),
      ),
    );
    return () => { if (navigator.vibrate) { try { navigator.vibrate(0); } catch (hata) { /* yok */ } } };
  },
});
