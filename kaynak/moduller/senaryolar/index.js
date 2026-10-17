// Senaryolar: 6 yaşam alanı, seviye filtresi, koçun önerisi; alan içinde senaryo listesi.
import './senaryolar.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, ikon, altGezinme, ustBaslik, durumKutusu, yerlestir, goreliZaman } from '../../cekirdek/arayuz.js';
import { t, yerel, aktifDil } from '../../cekirdek/metin.js';
import { al } from '../../cekirdek/depo.js';
import { oneriSenaryo, SEVIYE_SIRASI } from '../../cekirdek/oneri.js';
import senaryolar from '../../veri/senaryolar/index.js';
import alanlar from '../../veri/alanlar.js';
import { senaryoIsareti, raporAc } from '../../cekirdek/senaryo-kart.js';
import { istatistik } from '../../cekirdek/senaryo-istatistik.js';
import { basiliTut } from '../../cekirdek/kisi-eylemleri.js';

// v0.24.0 Alt başlık katalogdan hesaplanır (alan sayısı, en düşük ve en yüksek seviye); yeni senaryo eklenince kendiliğinden doğru kalır.
function katalogOzeti() {
  const seviyeler = senaryolar.map((s) => SEVIYE_SIRASI.indexOf(s.seviye)).filter((i) => i >= 0);
  const alanSayisi = new Set(senaryolar.map((s) => s.alan)).size;
  return t('senaryolar.alt', { alan: alanSayisi, enAlt: SEVIYE_SIRASI[Math.min(...seviyeler)], enUst: SEVIYE_SIRASI[Math.max(...seviyeler)] });
}

// v0.16.0: C1 içerik eklendi; beş seviyenin tamamı seçilebilir.
const GOSTERILEN_SEVIYELER = SEVIYE_SIRASI;
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
  const ist = istatistik(s.kimlik);
  return basiliTut(h('button', { class: 'b-kart b-kart-satir b-kart-tiklanir', type: 'button', onClick: () => b.git(`/gorusme?tur=senaryo&id=${s.kimlik}`) },
    h('span', { class: tamam ? 'b-ikon-daire b-ikon-daire-iyi' : 'b-ikon-daire b-ikon-daire-vurgu' }, ikon(tamam ? 'onay' : 'oynat', 18, 2.5)),
    h('span', { class: 'snr-satir-metin' },
      h('span', { class: 'snr-satir-baslik' }, yerel(s.baslik)),
      aktifDil() !== 'en' ? h('span', { class: 'b-kucuk', lang: 'en' }, s.baslik.en) : null,
      // v0.14.0: süre adım sayısından tahmin edilir; başarı ölçütü (görev) satırda yazar.
      h('span', { class: 'b-kucuk' }, `${s.seviye} · ${t('senaryolar.sureDk', { n: (s.adimlar || []).length + 2 })} · ${yerel(s.roller.koc)}${tamam ? ' · ' + t('senaryolar.tamamlandi') : ''}`),
      h('span', { class: 'b-kucuk snr-gorev' }, `${t('senaryolar.basari')}: ${yerel(s.gorev.aciklama)}`),
      // v0.21.0: denenen senaryo ötekilerden ayrılır; son kullanım ve başarı oranı satırda.
      ist.deneme ? h('span', { class: 'b-kucuk' }, senaryoIsareti(s.kimlik), ' ', t('snk.ozet', { son: goreliZaman(ist.son), n: ist.deneme, oran: ist.oran })) : null,
    ),
  ), () => raporAc(s, { git: b.git }));
}

function anaEkran(kok, b) {
  kok.classList.add('b-ekran-gezinmeli');
  const v = al();
  const seviye = secilenSeviye || (GOSTERILEN_SEVIYELER.includes(v.profil.seviye) ? v.profil.seviye : 'A1');
  const { senaryo: oneri, neden } = oneriSenaryo();
  const alanAdi = (kimlik) => t((alanlar.find((a) => a.kimlik === kimlik) || { metin: 'alanlar.gunluk' }).metin);
  const seviyedekiler = senaryolar.filter((s) => s.seviye === seviye);

  yerlestir(kok, 
    ustBaslik({ tabela: t('gezinme.pratik'), baslik: t('senaryolar.baslik'), alt: katalogOzeti(), ikon: 'senaryo', geri: () => b.geri('/bugun') }),
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
  // v0.26.1: eski/yanlış bağlantı (bilinmeyen alan) hata kutusu göstermez; Senaryolar listesine yönlenir.
  const alan = alanlar.find((a) => a.kimlik === (b.p.id || b.p.alan));
  if (!alan) { b.git('/senaryolar', { degistir: true }); return null; }
  kok.classList.add('b-ekran-gezinmeli');
  const seviye = secilenSeviye || (GOSTERILEN_SEVIYELER.includes(al().profil.seviye) ? al().profil.seviye : 'A1');
  const liste = senaryolar.filter((s) => s.alan === alan.kimlik && s.seviye === seviye);
  // v0.16.0: diğer seviyeler, seçilen seviyeye yakınlığına göre sıralanır; boşsa en yakını önerilir (akış kesilmez).
  const uzaklik = (s) => Math.abs(SEVIYE_SIRASI.indexOf(s.seviye) - SEVIYE_SIRASI.indexOf(seviye));
  const digerSeviyeler = senaryolar.filter((s) => s.alan === alan.kimlik && s.seviye !== seviye).sort((x, y) => uzaklik(x) - uzaklik(y));
  const enYakin = digerSeviyeler[0];

  yerlestir(kok, 
    ustBaslik({ tabela: `${t('gezinme.pratik')} › ${t('senaryolar.baslik')}`, baslik: t(alan.metin), geri: () => b.geri('/senaryolar') }),
    seviyeSecici(seviye, (s) => { secilenSeviye = s; alanEkrani(kok, b); }),
    liste.length ? h('div', { class: 'b-yigin' }, liste.map((s) => senaryoSatiri(s, b)))
      : enYakin ? h('div', { class: 'b-kart snr-yakin' }, h('p', null, t('senaryolar.yakinOner', { s: seviye, y: enYakin.seviye })), senaryoSatiri(enYakin, b))
        : durumKutusu('bos', t('senaryolar.alanBos', { s: seviye })),
    digerSeviyeler.length ? h('div', { class: 'b-yigin' }, digerSeviyeler.filter((s) => liste.length || s !== enYakin).map((s) => senaryoSatiri(s, b))) : null,
    altGezinme('/bugun'),
  );
  return null;
}

export default {
  kimlik: 'senaryolar',
  surum: '0.3.0',
  onek: 'snr',
  semaSurumu: 1,
  cekirdekServisleri: ['depo'],
  ekranlar: {
    senaryolar: ekran({ baslikAnahtari: 'ekran.senaryolar', durumlar: DORT_DURUM, ciz: anaEkran }),
    'senaryolar-alan': ekran({ baslikAnahtari: 'ekran.senaryoAlani', durumlar: DORT_DURUM, ciz: alanEkrani }),
  },
};
