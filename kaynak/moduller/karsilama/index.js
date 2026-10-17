// İlk açılış: 4 adım (Anayasa bölüm 4). 1) dil, ad, ana dil, rol  2) konuşma rahatlığı + 18 yaş ve kurallar
// 3) mikrofon izni (gerekçeyle)  4) yapay zekâ partnerle 1 dakikalık tanışma.
import './karsilama.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, ikon, yerlestir, logo } from '../../cekirdek/arayuz.js';
import { t, dilAyarla, aktifDil, ARAYUZ_DILLERI } from '../../cekirdek/metin.js';
import { al, degistir } from '../../cekirdek/depo.js';
import { mikrofonIste } from '../../cekirdek/izin.js';
import { destek } from '../../cekirdek/ses/ses-hatti.js';
import { duyur } from '../../cekirdek/duyuru.js';

const BASLANGIC_SEVIYESI = { hic: 'A1', basit: 'A2', rahat: 'B1' };
const ANA_DILLER = ['tr', 'en', 'es', 'ar', 'de', 'fr', 'ru', 'pt', 'fa', 'diger'];

function ilerleme(adim) {
  return h('div', { class: 'kar-ilerleme' },
    h('div', { class: 'kar-noktalar', 'aria-hidden': 'true' },
      [1, 2, 3, 4].map((n) => h('span', { class: n <= adim ? 'kar-nokta kar-nokta-dolu' : 'kar-nokta' }))),
    h('span', { class: 'b-kucuk' }, t('karsilama.adim', { n: adim })),
  );
}

function secenekGrubu(etiketId, secenekler, secili, secildi) {
  return h('div', { class: 'b-yigin', role: 'radiogroup', 'aria-labelledby': etiketId },
    secenekler.map(([deger, metin]) => h('button', {
      class: 'kar-secenek',
      type: 'button',
      role: 'radio',
      'aria-checked': secili === deger ? 'true' : 'false',
      onClick: (e) => {
        for (const b of e.currentTarget.parentElement.children) b.setAttribute('aria-checked', 'false');
        e.currentTarget.setAttribute('aria-checked', 'true');
        secildi(deger);
      },
    }, metin)));
}

function adim1(kok, sonraki, yenidenCiz, b) {
  const profil = al().profil;
  let rol = profil.rol || null;
  const girdi = h('input', { id: 'kar-ad', class: 'b-girdi', type: 'text', autocomplete: 'given-name', placeholder: t('karsilama.adYerTutucu'), value: profil.ad });
  const anaDil = h('select', { id: 'kar-anadil', class: 'b-girdi' },
    h('option', { value: '' }, '—'),
    ANA_DILLER.map((d) => h('option', { value: d, selected: profil.anaDil === d }, t(`diller.${d}`))));

  yerlestir(kok,
    ilerleme(1),
    h('div', { class: 'b-cipler kar-dil', role: 'radiogroup', 'aria-label': t('karsilama.dilSoru') },
      ARAYUZ_DILLERI.map((d) => h('button', {
        class: 'b-dugme b-dugme-cerceve',
        role: 'radio',
        'aria-checked': d === aktifDil() ? 'true' : 'false',
        onClick: () => {
          degistir((v) => { v.profil.ayarlar.arayuzDili = d; v.profil.ad = girdi.value.trim(); v.profil.anaDil = anaDil.value || null; v.profil.rol = rol; });
          dilAyarla(d);
          yenidenCiz();
        },
      }, d.toUpperCase()))),
    h('div', { class: 'kar-tanitim' },
      h('div', { class: 'kar-logo' }, logo(84)),
      h('h1', { class: 'b-baslik kar-ortali' }, t('karsilama.merhaba')),
      h('p', { class: 'b-altbaslik kar-ortali' }, t('karsilama.tanitim')),
    ),
    h('div', { class: 'b-yigin' }, h('label', { class: 'b-etiket', for: 'kar-ad' }, t('karsilama.adSoru')), girdi),
    h('div', { class: 'b-yigin' }, h('label', { class: 'b-etiket', for: 'kar-anadil' }, t('karsilama.anaDilSoru')), anaDil),
    h('div', { class: 'b-yigin' },
      h('div', { class: 'b-etiket', id: 'kar-rol' }, t('karsilama.rolSoru')),
      secenekGrubu('kar-rol', [['ogrenen', t('karsilama.rol.ogrenen')], ['yardimci', t('karsilama.rol.yardimci')]], rol, (r) => { rol = r; }),
    ),
    h('div', { class: 'b-buyut' }),
    h('button', {
      class: 'b-dugme b-dugme-ana',
      onClick: () => {
        const ad = girdi.value.trim();
        if (!ad) { duyur(t('karsilama.adEksik')); girdi.focus(); return; }
        if (!anaDil.value) { duyur(t('karsilama.anaDilEksik')); anaDil.focus(); return; }
        if (!rol) { duyur(t('karsilama.rolEksik')); return; }
        degistir((v) => {
          v.profil.ad = ad;
          v.profil.anaDil = anaDil.value;
          v.profil.rol = rol;
          v.profil.ayarlar.arayuzDili = aktifDil();
        });
        sonraki();
      },
    }, t('genel.devam')),
    h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve kar-misafir', onClick: () => misafirGirisi(b) }, ikon('kisi', 18), t('misafir.dugme')),
    h('p', { class: 'b-kucuk kar-ortali' }, t('misafir.aciklama')),
  );
}

// Misafir girişi: adımları atlar, makul varsayılanlarla başlar. 18 yaş onayı yine zorunludur (topluluk güvenliği).
// Ad, dil ve ilgi alanları sonra Ayarlar'dan tamamlanır; misafir işareti Ayarlar'da gösterilir.
// v0.16.0: arayüz dili ana dil değildir. Türkçe arayüzde ana dil Türkçe varsayılır (onaylanabilir); başka arayüz
// dillerinde misafirden ana dili seçmesi istenir. Öğrenilen dil şimdilik her zaman İngilizce (koç yalnız İngilizce);
// ana dili İngilizce olan misafir "İngilizce öğrenenlere yardımcı" rolüyle girer.
function misafirPenceresi() {
  return new Promise((coz) => {
    const dil = aktifDil();
    const sec = h('select', { class: 'b-girdi', id: 'kar-m-anadil', 'aria-label': t('karsilama.anaDilSoru') },
      h('option', { value: '' }, '—'),
      ANA_DILLER.map((d) => h('option', { value: d, selected: dil === 'tr' && d === 'tr' }, t(`diller.${d}`))));
    const kapat = (sonuc) => { perde.remove(); coz(sonuc); };
    const perde = h('div', { class: 'b-perde', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'kar-m-baslik' },
      h('div', { class: 'b-pencere' },
        h('h2', { class: 'b-bolum-baslik', id: 'kar-m-baslik' }, t('misafir.onayBaslik')),
        h('label', { class: 'b-etiket', for: 'kar-m-anadil' }, t('karsilama.anaDilSoru')), sec,
        h('p', null, t('misafir.onayMetin')),
        h('div', { class: 'b-yigin' },
          h('button', { class: 'b-dugme b-dugme-ana', onClick: () => { if (!sec.value) { duyur(t('karsilama.anaDilEksik')); sec.focus(); return; } kapat(sec.value); } }, t('misafir.onayEvet')),
          h('button', { class: 'b-dugme b-dugme-cerceve', 'data-vazgec': '', onClick: () => kapat(null) }, t('genel.vazgec'))),
      ));
    document.body.append(perde);
    sec.focus();
  });
}

async function misafirGirisi(b) {
  const anaDil = await misafirPenceresi();
  if (!anaDil) return;
  const dil = aktifDil();
  degistir((v) => {
    const p = v.profil;
    p.misafir = true;
    p.ad = p.ad || t('misafir.ad');
    p.anaDil = anaDil;
    p.ogrenilenDil = 'en';
    p.rol = p.rol || (anaDil === 'en' ? 'yardimci' : 'ogrenen');
    p.kendiniTanim = p.kendiniTanim || 'basit';
    if (!p.tanismaYapildi) p.seviye = BASLANGIC_SEVIYESI[p.kendiniTanim];
    p.yasOnayi = true;
    p.ayarlar.arayuzDili = dil;
    p.ayarlar.yaziliMod = !destek.tanima;
    p.kurulumTamam = true;
  });
  duyur(t('misafir.hosgeldin'), 3500);
  b.git('/bugun', { degistir: true });
}

function adim2(kok, sonraki) {
  const profil = al().profil;
  let his = profil.kendiniTanim;
  const onay = h('input', { id: 'kar-onay', type: 'checkbox', checked: profil.yasOnayi });
  yerlestir(kok,
    ilerleme(2),
    h('div', { class: 'b-yigin' },
      h('div', { class: 'b-etiket', id: 'kar-his' }, t('karsilama.hisSoru')),
      secenekGrubu('kar-his', ['hic', 'basit', 'rahat'].map((k) => [k, t(`karsilama.his.${k}`)]), his, (k) => { his = k; }),
    ),
    h('section', { class: 'b-kart kar-kurallar', 'aria-labelledby': 'kar-kural-baslik' },
      h('div', { class: 'b-satir' }, h('span', { class: 'b-ikon-daire' }, ikon('kalkan', 18)), h('h2', { class: 'b-bolum-baslik', id: 'kar-kural-baslik' }, t('karsilama.kurallarBaslik'))),
      h('ul', { class: 'kar-kural-liste' }, [1, 2, 3, 4].map((n) => h('li', null, t(`karsilama.kurallar.${n}`)))),
      h('label', { class: 'kar-onay', for: 'kar-onay' }, onay, h('span', null, t('karsilama.yasOnay'))),
    ),
    h('div', { class: 'b-buyut' }),
    h('button', {
      class: 'b-dugme b-dugme-ana',
      onClick: () => {
        if (!his) { duyur(t('karsilama.hisEksik')); return; }
        if (!onay.checked) { duyur(t('karsilama.yasEksik'), 4500); onay.focus(); return; }
        degistir((v) => {
          v.profil.kendiniTanim = his;
          if (!v.profil.tanismaYapildi) v.profil.seviye = BASLANGIC_SEVIYESI[his];
          v.profil.yasOnayi = true;
        });
        sonraki();
      },
    }, t('genel.devam')),
  );
}

function adim3(kok, sonraki) {
  const yaziliyaGec = () => {
    degistir((v) => { v.profil.ayarlar.yaziliMod = true; });
    sonraki();
  };
  yerlestir(kok,
    ilerleme(3),
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
        if (sonuc === 'verildi') {
          degistir((v) => { v.profil.ayarlar.yaziliMod = false; });
          sonraki();
        } else {
          if (sonuc === 'reddedildi') duyur(t('izin.reddedildi'), 5000);
          yaziliyaGec();
        }
      },
    }, t('karsilama.izinVer')) : h('p', { class: 'b-kucuk kar-ortali' }, t('izin.desteklenmiyor')),
    h('button', { class: 'b-dugme b-dugme-cerceve', onClick: yaziliyaGec }, t('karsilama.yaziliDevam')),
  );
}

function adim4(kok, b) {
  const bitir = (tanismaya) => {
    degistir((v) => { v.profil.kurulumTamam = true; });
    if (tanismaya) b.git('/gorusme?tur=tanisma', { degistir: true });
    else b.git('/bugun', { degistir: true });
  };
  yerlestir(kok,
    ilerleme(4),
    h('div', { class: 'kar-tanitim' },
      h('div', { class: 'kar-koc', 'aria-hidden': 'true' }, ikon('dalga', 44, 2.2)),
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
  surum: '0.6.0',
  onek: 'kar',
  semaSurumu: 2,
  cekirdekServisleri: ['depo', 'izin', 'ses', 'metin'],
  ekranlar: {
    karsilama: ekran({
      baslikAnahtari: 'ekran.karsilama',
      durumlar: DORT_DURUM,
      ciz(kok, b) {
        kok.classList.add('kar-ekran');
        const goster = (n) => {
          if (n === 1) adim1(kok, () => goster(2), () => goster(1), b);
          else if (n === 2) adim2(kok, () => goster(3));
          else if (n === 3) adim3(kok, () => goster(4));
          else adim4(kok, b);
        };
        goster(1);
      },
    }),
  },
};
