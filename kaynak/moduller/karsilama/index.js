// İlk açılış: 3 adım. 60 saniye içinde koçla ilk cümle (Anayasa bölüm 3).
import './karsilama.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, ikon, yerlestir } from '../../cekirdek/arayuz.js';
import { t } from '../../cekirdek/metin.js';
import { al, degistir } from '../../cekirdek/depo.js';
import { mikrofonIste } from '../../cekirdek/izin.js';
import { destek } from '../../cekirdek/ses/ses-hatti.js';
import { duyur } from '../../cekirdek/duyuru.js';

const BASLANGIC_SEVIYESI = { hic: 'A1', basit: 'A2', rahat: 'B1' };

function ilerleme(adim) {
  return h('div', { class: 'kar-ilerleme' },
    h('div', { class: 'kar-noktalar', 'aria-hidden': 'true' },
      [1, 2, 3].map((n) => h('span', { class: n <= adim ? 'kar-nokta kar-nokta-dolu' : 'kar-nokta' }))),
    h('span', { class: 'b-kucuk' }, t('karsilama.adim', { n: adim })),
  );
}

function kocGorseli() {
  return h('div', { class: 'kar-koc', 'aria-hidden': 'true' }, ikon('dalga', 44, 2.2));
}

function adim1(kok, sonraki) {
  const profil = al().profil;
  let secilen = profil.kendiniTanim;
  const girdi = h('input', { id: 'kar-ad', class: 'b-girdi', type: 'text', autocomplete: 'given-name', placeholder: t('karsilama.adYerTutucu'), value: profil.ad });
  const secenekler = ['hic', 'basit', 'rahat'].map((anahtar) => h('button', {
    class: 'kar-secenek',
    type: 'button',
    role: 'radio',
    'aria-checked': secilen === anahtar ? 'true' : 'false',
    onClick: (e) => {
      secilen = anahtar;
      for (const b of e.currentTarget.parentElement.children) b.setAttribute('aria-checked', 'false');
      e.currentTarget.setAttribute('aria-checked', 'true');
    },
  }, t(`karsilama.his.${anahtar}`)));

  yerlestir(kok, 
    ilerleme(1),
    h('div', { class: 'kar-tanitim' },
      kocGorseli(),
      h('h1', { class: 'b-baslik kar-ortali' }, t('karsilama.merhaba', { koc: t('koc.ad') })),
      h('p', { class: 'b-altbaslik kar-ortali' }, t('karsilama.tanitim')),
    ),
    h('div', { class: 'b-yigin' },
      h('label', { class: 'b-etiket', for: 'kar-ad' }, t('karsilama.adSoru')),
      girdi,
    ),
    h('div', { class: 'b-yigin', role: 'radiogroup', 'aria-labelledby': 'kar-his' },
      h('div', { class: 'b-etiket', id: 'kar-his' }, t('karsilama.hisSoru')),
      secenekler,
    ),
    h('div', { class: 'b-buyut' }),
    h('button', {
      class: 'b-dugme b-dugme-ana',
      onClick: () => {
        const ad = girdi.value.trim();
        if (!ad) { duyur(t('karsilama.adEksik')); girdi.focus(); return; }
        if (!secilen) { duyur(t('karsilama.hisEksik')); return; }
        degistir((v) => {
          v.profil.ad = ad;
          v.profil.kendiniTanim = secilen;
          v.profil.seviye = BASLANGIC_SEVIYESI[secilen];
        });
        sonraki();
      },
    }, t('genel.devam')),
  );
}

function adim2(kok, sonraki) {
  const yaziliyaGec = () => {
    degistir((v) => { v.profil.ayarlar.yaziliMod = true; });
    sonraki();
  };
  yerlestir(kok, 
    ilerleme(2),
    h('div', { class: 'kar-tanitim' },
      h('div', { class: 'kar-koc', 'aria-hidden': 'true' }, ikon('mikrofon', 44, 2)),
      h('h1', { class: 'b-baslik kar-ortali' }, t('karsilama.izinBaslik')),
      h('p', { class: 'b-altbaslik kar-ortali' }, t('karsilama.izinAciklama')),
    ),
    h('div', { class: 'b-buyut' }),
    destek.tanima ? h('button', {
      class: 'b-dugme b-dugme-ana',
      onClick: async () => {
        const sonuc = await mikrofonIste();
        if (sonuc === 'verildi') sonraki();
        else {
          if (sonuc === 'reddedildi') duyur(t('izin.reddedildi'), 5000);
          yaziliyaGec();
        }
      },
    }, t('karsilama.izinVer')) : h('p', { class: 'b-kucuk kar-ortali' }, t('izin.desteklenmiyor')),
    h('button', { class: 'b-dugme b-dugme-cerceve', onClick: yaziliyaGec }, t('karsilama.yaziliDevam')),
  );
}

function adim3(kok, b) {
  const bitir = (tanismaya) => {
    degistir((v) => { v.profil.kurulumTamam = true; });
    if (tanismaya) b.git('/gorusme?tur=tanisma', { degistir: true });
    else b.git('/bugun', { degistir: true });
  };
  yerlestir(kok, 
    ilerleme(3),
    h('div', { class: 'kar-tanitim' },
      kocGorseli(),
      h('h1', { class: 'b-baslik kar-ortali' }, t('karsilama.tanismaBaslik')),
      h('p', { class: 'b-altbaslik kar-ortali' }, t('karsilama.tanismaAciklama')),
    ),
    h('div', { class: 'b-buyut' }),
    h('button', { class: 'b-dugme b-dugme-ana', onClick: () => bitir(true) }, t('karsilama.tanismaBasla')),
    h('button', { class: 'b-dugme b-dugme-cerceve', onClick: () => bitir(false) }, t('karsilama.tanismaAtla')),
  );
}

export default {
  kimlik: 'karsilama',
  surum: '0.1.0',
  onek: 'kar',
  semaSurumu: 1,
  cekirdekServisleri: ['depo', 'izin', 'ses'],
  ekranlar: {
    karsilama: ekran({
      baslikAnahtari: 'ekran.karsilama',
      durumlar: DORT_DURUM,
      ciz(kok, b) {
        kok.classList.add('kar-ekran');
        const goster = (n) => {
          if (n === 1) adim1(kok, () => goster(2));
          else if (n === 2) adim2(kok, () => goster(3));
          else adim3(kok, b);
        };
        goster(1);
      },
    }),
  },
};
