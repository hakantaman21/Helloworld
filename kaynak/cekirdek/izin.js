// Y22: Mikrofon izni hiçbir zaman gerekçe ekranı olmadan istenmez. getUserMedia yalnız bu dosyada çağrılır.
import { al, degistir } from './depo.js';
import { h } from './arayuz.js';
import { t } from './metin.js';

export function izinDurumu() {
  return al().profil.mikrofonIzni;
}

function kaydet(durum) {
  degistir((v) => { v.profil.mikrofonIzni = durum; });
}

async function tarayicidanIste() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    // Eski tarayıcılarda ses tanıma kendi iznini ister.
    kaydet('verildi');
    return 'verildi';
  }
  try {
    const akis = await navigator.mediaDevices.getUserMedia({ audio: true });
    akis.getTracks().forEach((iz) => iz.stop());
    kaydet('verildi');
    return 'verildi';
  } catch (hata) {
    kaydet('reddedildi');
    return 'reddedildi';
  }
}

// Önce neden gerektiğini anlatan pencere, sonra tarayıcının izin sorusu.
// Dönüş: 'verildi' | 'reddedildi' | 'yazili'
export function mikrofonIste() {
  if (izinDurumu() === 'verildi') return Promise.resolve('verildi');
  return new Promise((coz) => {
    const perde = h('div', { class: 'b-perde', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'izin-baslik' },
      h('div', { class: 'b-pencere' },
        h('h2', { class: 'b-bolum-baslik', id: 'izin-baslik' }, t('izin.baslik')),
        h('p', null, t('izin.aciklama')),
        h('div', { class: 'b-yigin' },
          h('button', {
            class: 'b-dugme b-dugme-ana',
            onClick: async () => { perde.remove(); coz(await tarayicidanIste()); },
          }, t('izin.ver')),
          h('button', {
            class: 'b-dugme b-dugme-cerceve', 'data-vazgec': '',
            onClick: () => { perde.remove(); coz('yazili'); },
          }, t('izin.yazili')),
        ),
      ),
    );
    document.body.append(perde);
    perde.querySelector('button').focus();
  });
}
