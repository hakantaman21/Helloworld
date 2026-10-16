// Telaffuz çalışması (v0.14.0): dinle → söyle → tanınan metni karşılaştır → hedefli tekrar → yeniden dene.
// Dürüstlük: tarayıcının ses tanıması TELAFFUZ PUANI DEĞİLDİR. Ekranda yalnız "tanınan sözcükler" gösterilir; puan verilmez.
// Cümleler: senaryoların ipucu cümleleri + Hata Hafızasındaki telaffuz öğeleri. Mikrofon yoksa "dinle ve sesli tekrar et" kipi.
import './telaffuz.css';
import { ekran, DORT_DURUM } from '../../cekirdek/modul-kaydi.js';
import { h, ikon, altGezinme, ustBaslik, yerlestir, sekmeler } from '../../cekirdek/arayuz.js';
import { t, yerel } from '../../cekirdek/metin.js';
import { al } from '../../cekirdek/depo.js';
import { duyur } from '../../cekirdek/duyuru.js';
import { destek, soyle, dinle, sus } from '../../cekirdek/ses/ses-hatti.js';
import { izinDurumu, mikrofonIste } from '../../cekirdek/izin.js';
import { cumleKayitli, cumleKaydetDegistir } from '../../cekirdek/cumle-defteri.js';
import senaryolar from '../../veri/senaryolar/index.js';

const BOSLUK = ' ';
const KESME = String.fromCharCode(39);
const normal = (m) => String(m).toLocaleLowerCase('en').replace(/’/g, KESME).replace(/[^a-z0-9\u0027]+/g, BOSLUK).trim();

function cumleler(kaynak) {
  if (kaynak === 'hafiza') return (al().hafiza || []).filter((k) => k.tur === 'telaffuz' && k.dogru).map((k) => ({ metin: k.dogru, kaynak: t('hafiza.baslik') }));
  const benimSeviyem = al().profil.seviye;
  const yalnizSeviyem = kaynak === 'seviye';
  const liste = [];
  for (const s of senaryolar) {
    if (yalnizSeviyem && s.seviye !== benimSeviyem) continue;
    for (const adim of [s.acilis, ...(s.adimlar || [])]) for (const c of adim.ipucu || []) if (c.split(BOSLUK).length >= 3) liste.push({ metin: c, kaynak: yerel(s.baslik) });
  }
  return liste;
}

// Sözcük karşılaştırması: hedefteki her sözcük tanınan metinde var mı? (sıra gözetmez; puan değil, ipucu)
function karsilastir(hedef, taninan) {
  const tanSet = new Set(normal(taninan).split(BOSLUK));
  return hedef.split(/\s+/).map((ham) => ({ ham, tamam: tanSet.has(normal(ham)) }));
}

let kaynakSecimi = 'seviye';
let sira = 0;

function ciz(kok, b) {
  kok.classList.add('b-ekran-gezinmeli');
  const hiz = al().profil.ayarlar.kocHizi || 'normal';
  const kart = h('section', { class: 'b-kart tlf-kart', 'aria-live': 'polite' });
  let dinleniyor = false;

  function kartCiz(sonuc) {
    const liste = cumleler(kaynakSecimi);
    if (!liste.length) {
      yerlestir(kart, h('p', null, kaynakSecimi === 'hafiza' ? t('telaffuz.hafizaBos') : t('telaffuz.bos')));
      return;
    }
    const c = liste[((sira % liste.length) + liste.length) % liste.length];
    const kayitli = cumleKayitli(c.metin);
    yerlestir(kart,
      h('span', { class: 'b-ust-etiket' }, `${(sira % liste.length) + 1} / ${liste.length} · ${c.kaynak}`),
      h('p', { class: 'tlf-cumle', lang: 'en' }, sonuc ? sonuc.sozcukler.map((s) => h('span', { class: s.tamam ? 'tlf-tamam' : 'tlf-eksik' }, s.ham, ' ')) : c.metin),
      sonuc ? h('div', { class: 'tlf-sonuc' },
        h('small', null, t('telaffuz.taninan')), h('p', { lang: 'en' }, sonuc.metin || '—'),
        h('p', { class: 'b-kucuk' }, sonuc.sozcukler.every((s) => s.tamam) ? t('telaffuz.hepsi') : t('telaffuz.eksikler', { n: sonuc.sozcukler.filter((s) => !s.tamam).length })),
        h('p', { class: 'b-kucuk tlf-not' }, t('telaffuz.puanDegil'))) : null,
      h('div', { class: 'tlf-eylemler' },
        h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve', onClick: () => soyle(c.metin, hiz) }, ikon('hoparlor', 18), t('telaffuz.dinle')),
        h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve', onClick: () => soyle(c.metin, 'yavas') }, ikon('hoparlor', 18), t('telaffuz.yavas')),
        destek.tanima
          ? h('button', { type: 'button', class: 'b-dugme b-dugme-ana', 'aria-pressed': String(dinleniyor), onClick: () => soyleVeKarsilastir(c.metin) }, ikon('mikrofon', 18), dinleniyor ? t('telaffuz.dinliyorum') : sonuc ? t('telaffuz.tekrarDene') : t('telaffuz.soyle'))
          : h('p', { class: 'b-kucuk' }, t('telaffuz.tanimaYok'))),
      h('div', { class: 'tlf-eylemler' },
        h('button', { type: 'button', class: 'b-dugme', onClick: () => { sira -= 1; kartCiz(); } }, ikon('sol', 18), t('telaffuz.onceki')),
        h('button', { type: 'button', class: 'b-dugme', 'aria-pressed': String(kayitli), onClick: () => { cumleKaydetDegistir(c.metin, c.kaynak); kartCiz(sonuc); } }, ikon('yerImi', 18), kayitli ? t('telaffuz.kayitli') : t('telaffuz.kaydet')),
        h('button', { type: 'button', class: 'b-dugme', onClick: () => { sira += 1; kartCiz(); } }, t('telaffuz.sonraki'), ikon('sag', 18))),
    );
  }

  async function soyleVeKarsilastir(hedef) {
    if (dinleniyor) return;
    if (izinDurumu() !== 'verildi') {
      const s = await mikrofonIste();
      if (s !== 'verildi') { duyur(t('telaffuz.izinYok')); return; }
    }
    sus();
    dinleniyor = true; kartCiz();
    try {
      dinle({
        onSonuc: ({ metin }) => { dinleniyor = false; kartCiz({ metin, sozcukler: karsilastir(hedef, metin) }); },
        onHata: () => { dinleniyor = false; kartCiz(); duyur(t('telaffuz.duyulmadi')); },
        sessizlikMs: 5000,
      });
    } catch { dinleniyor = false; kartCiz(); duyur(t('telaffuz.tanimaYok')); }
  }

  yerlestir(kok,
    ustBaslik({ tabela: t('gezinme.pratik'), baslik: t('telaffuz.baslik'), alt: t('telaffuz.alt'), ikon: 'telaffuz', geri: () => b.geri('/bugun') }),
    sekmeler([['seviye', t('telaffuz.kaynak.seviye')], ['tum', t('telaffuz.kaynak.tum')], ['hafiza', t('telaffuz.kaynak.hafiza')]], kaynakSecimi, (id) => { kaynakSecimi = id; sira = 0; kartCiz(); }, { tur: 'hap', etiket: t('telaffuz.kaynakEtiket') }),
    kart,
    h('p', { class: 'b-kucuk' }, t('telaffuz.nasil')),
    altGezinme('/bugun'),
  );
  kartCiz();
  return () => sus();
}

export default {
  kimlik: 'telaffuz',
  surum: '0.1.0',
  onek: 'tlf',
  semaSurumu: 1,
  cekirdekServisleri: ['depo', 'metin'],
  ekranlar: { telaffuz: ekran({ baslikAnahtari: 'ekran.telaffuz', durumlar: DORT_DURUM, ciz }) },
};
