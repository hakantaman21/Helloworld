// Senaryolar: 6 yaşam alanı, seviye filtresi, koçun önerisi; alan içinde senaryo listesi.
import './senaryolar.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, ikon, altGezinme, ustBaslik, durumKutusu, yerlestir } from '../../cekirdek/arayuz.js';
import { t, yerel, aktifDil } from '../../cekirdek/metin.js';
import { al } from '../../cekirdek/depo.js';
import { oneriSenaryo, SEVIYE_SIRASI } from '../../cekirdek/oneri.js';
import senaryolar from '../../veri/senaryolar/index.js';
import alanlar from '../../veri/alanlar.js';

const GOSTERILEN_SEVIYELER = SEVIYE_SIRASI.slice(0, 4);
let secilenSeviye = null; // ekranlar arasında hatırlanır (oturum boyunca)

function seviyeSecici(aktif, degisti) {
  return h('div', { class: 'b-cipler', role: 'radiogroup', 'aria-label': t('senaryolar.seviyeEtiket') },
    GOSTERILEN_SEVIYELER.map((s) => h('button', {
      class: 'b-dugme b-dugme-cerceve snr-seviye',
      role: 'radio',
      'aria-checked': s === aktif ? 'true' : 'false',
      onClick: () => degisti(s),
    }, s)));
}

function senaryoSatiri(s, b) {
  const tamam = Boolean(al().tamamlananSenaryolar[s.kimlik]);
  return h('button', { class: 'b-kart b-kart-satir b-kart-tiklanir', type: 'button', onClick: () => b.git(`/gorusme?tur=senaryo&id=${s.kimlik}`) },
    h('span', { class: tamam ? 'b-ikon-daire b-ikon-daire-iyi' : 'b-ikon-daire b-ikon-daire-vurgu' }, ikon(tamam ? 'onay' : 'oynat', 18, 2.5)),
    h('span', { class: 'snr-satir-metin' },
      h('span', { class: 'snr-satir-baslik' }, yerel(s.baslik)),
      aktifDil() !== 'en' ? h('span', { class: 'b-kucuk', lang: 'en' }, s.baslik.en) : null,
      h('span', { class: 'b-kucuk' }, `${s.seviye} · ${t('senaryolar.sure')} · ${yerel(s.roller.koc)}${tamam ? ' · ' + t('senaryolar.tamamlandi') : ''}`),
    ),
  );
}

function anaEkran(kok, b) {
  kok.classList.add('b-ekran-gezinmeli');
  const v = al();
  const seviye = secilenSeviye || (GOSTERILEN_SEVIYELER.includes(v.profil.seviye) ? v.profil.seviye : 'A1');
  const { senaryo: oneri, neden } = oneriSenaryo();
  const alanAdi = (kimlik) => t((alanlar.find((a) => a.kimlik === kimlik) || { metin: 'alanlar.gunluk' }).metin);
  const seviyedekiler = senaryolar.filter((s) => s.seviye === seviye);

  yerlestir(kok, 
    ustBaslik({ tabela: t('gezinme.pratik'), baslik: t('senaryolar.baslik'), alt: t('senaryolar.alt'), geri: () => b.geri('/bugun') }),
    seviyeSecici(seviye, (s) => { secilenSeviye = s; anaEkran(kok, b); }),
    h('button', { class: 'b-kart b-kart-vurgulu b-kart-tiklanir snr-oneri', type: 'button', onClick: () => b.git(`/gorusme?tur=senaryo&id=${oneri.kimlik}`) },
      h('span', { class: 'b-ust-etiket snr-oneri-etiket' }, t('senaryolar.oneri')),
      h('span', { class: 'snr-oneri-baslik' }, yerel(oneri.baslik)),
      h('span', { class: 'b-kucuk' }, t('senaryolar.oneriAlt', { alan: alanAdi(oneri.alan), seviye: oneri.seviye, rol: yerel(oneri.roller.koc) })),
      h('span', null, t('senaryolar.neden', { neden: t(neden === 'seviye' ? 'senaryolar.nedenSeviye' : 'senaryolar.nedenTekrar') })),
    ),
    h('div', { class: 'b-izgara-2' },
      alanlar.map((a) => {
        const alandaki = seviyedekiler.filter((s) => s.alan === a.kimlik);
        const yapilan = alandaki.filter((s) => v.tamamlananSenaryolar[s.kimlik]).length;
        return h('a', { class: `b-kart snr-alan${alandaki.length ? '' : ' snr-alan-bos'}`, href: `#/senaryolar/alan?id=${a.kimlik}` },
          h('span', { class: 'snr-alan-ad' }, t(a.metin)),
          h('span', { class: 'b-kucuk' }, alandaki.length ? t('senaryolar.sayac', { x: yapilan, y: alandaki.length }) : t('senaryolar.yakinda')),
        );
      }),
    ),
    seviyedekiler.length ? null : durumKutusu('bos', t('senaryolar.hicYok', { s: seviye })),
    altGezinme('/bugun'),
  );
  return null;
}

function alanEkrani(kok, b) {
  const alan = alanlar.find((a) => a.kimlik === b.p.id);
  if (!alan) {
    yerlestir(kok, durumKutusu('hata', t('genel.hata'), { metin: t('genel.geri'), fn: () => b.geri('/senaryolar') }));
    return null;
  }
  kok.classList.add('b-ekran-gezinmeli');
  const seviye = secilenSeviye || (GOSTERILEN_SEVIYELER.includes(al().profil.seviye) ? al().profil.seviye : 'A1');
  const liste = senaryolar.filter((s) => s.alan === alan.kimlik && s.seviye === seviye);
  const digerSeviyeler = senaryolar.filter((s) => s.alan === alan.kimlik && s.seviye !== seviye);

  yerlestir(kok, 
    ustBaslik({ tabela: `${t('gezinme.pratik')} › ${t('senaryolar.baslik')}`, baslik: t(alan.metin), geri: () => b.geri('/senaryolar') }),
    seviyeSecici(seviye, (s) => { secilenSeviye = s; alanEkrani(kok, b); }),
    liste.length ? h('div', { class: 'b-yigin' }, liste.map((s) => senaryoSatiri(s, b))) : durumKutusu('bos', t('senaryolar.alanBos', { s: seviye })),
    digerSeviyeler.length ? h('div', { class: 'b-yigin' }, digerSeviyeler.map((s) => senaryoSatiri(s, b))) : null,
    altGezinme('/bugun'),
  );
  return null;
}

export default {
  kimlik: 'senaryolar',
  surum: '0.2.0',
  onek: 'snr',
  semaSurumu: 1,
  cekirdekServisleri: ['depo'],
  ekranlar: {
    senaryolar: ekran({ baslikAnahtari: 'ekran.senaryolar', durumlar: DORT_DURUM, ciz: anaEkran }),
    'senaryolar-alan': ekran({ baslikAnahtari: 'ekran.senaryoAlani', durumlar: DORT_DURUM, ciz: alanEkrani }),
  },
};
