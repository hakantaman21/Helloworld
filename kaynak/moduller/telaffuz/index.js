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
import { kayitOlustur, hafizayaEkle } from '../../cekirdek/hafiza.js';
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

// v0.16.0 Sıralı hizalama (düzenleme uzaklığı): hedef ve tanınan sözcükler sırayla eşlenir. Sonuç parçaları:
// tamam · eksik (hedefte var, duyulmadı) · farkli (yerine başka sözcük duyuldu) · fazla (hedefte yok, duyuldu).
// "happy am I" artık "I am happy" sayılmaz; "I can not help" içindeki "not" fazla olarak görünür. Puan değildir.
function karsilastir(hedef, taninan) {
  const H = hedef.split(/\s+/).filter(Boolean);
  const Hn = H.map(normal);
  const T = normal(taninan).split(BOSLUK).filter(Boolean);
  const n = H.length; const m = T.length;
  const d = Array.from({ length: n + 1 }, (_, i) => Array.from({ length: m + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= n; i += 1) for (let j = 1; j <= m; j += 1) {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (Hn[i - 1] === T[j - 1] ? 0 : 1));
  }
  const parcalar = [];
  let i = n; let j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + (Hn[i - 1] === T[j - 1] ? 0 : 1)) {
      parcalar.unshift(Hn[i - 1] === T[j - 1] ? { tur: 'tamam', ham: H[i - 1] } : { tur: 'farkli', ham: H[i - 1], duyulan: T[j - 1] });
      i -= 1; j -= 1;
    } else if (i > 0 && d[i][j] === d[i - 1][j] + 1) { parcalar.unshift({ tur: 'eksik', ham: H[i - 1] }); i -= 1; }
    else { parcalar.unshift({ tur: 'fazla', ham: T[j - 1] }); j -= 1; }
  }
  return parcalar;
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
      h('p', { class: 'tlf-cumle', lang: 'en' }, sonuc ? sonuc.sozcukler.map((s) => (s.tur === 'fazla'
        ? h('span', { class: 'tlf-fazla', title: t('telaffuz.fazlaEtiket') }, `+${s.ham}`, ' ')
        : h('span', { class: `tlf-${s.tur}` }, s.ham, s.tur === 'farkli' ? h('small', { class: 'tlf-duyulan' }, s.duyulan) : null, ' '))) : c.metin),
      sonuc ? sonucKutusu(c, sonuc) : null,
      h('div', { class: 'tlf-eylemler' },
        h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve', onClick: () => soyle(c.metin, hiz) }, ikon('hoparlor', 18), t('telaffuz.dinle')),
        h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve', onClick: () => soyle(c.metin, 'yavas') }, ikon('hoparlor', 18), t('telaffuz.yavas')),
        destek.tanima
          ? h('button', { type: 'button', class: 'b-dugme b-dugme-ana', 'aria-pressed': String(dinleniyor), onClick: () => soyleVeKarsilastir(c.metin) }, ikon('mikrofon', 18), dinleniyor ? t('telaffuz.dinliyorum') : sonuc ? t('telaffuz.tekrarDene') : t('telaffuz.soyle'))
          : h('p', { class: 'b-kucuk' }, t('telaffuz.tanimaYok'))),
      h('div', { class: 'tlf-eylemler' },
        h('button', { type: 'button', class: 'b-dugme', onClick: () => { dinlemeyiDurdur(); sira -= 1; kartCiz(); } }, ikon('sol', 18), t('telaffuz.onceki')),
        h('button', { type: 'button', class: 'b-dugme', 'aria-pressed': String(kayitli), onClick: () => { cumleKaydetDegistir(c.metin, c.kaynak); kartCiz(sonuc); } }, ikon('yerImi', 18), kayitli ? t('telaffuz.kayitli') : t('telaffuz.kaydet')),
        h('button', { type: 'button', class: 'b-dugme', onClick: () => { dinlemeyiDurdur(); sira += 1; kartCiz(); } }, t('telaffuz.sonraki'), ikon('sag', 18))),
    );
  }

  function sonucKutusu(c, sonuc) {
    const say = (tur) => sonuc.sozcukler.filter((s) => s.tur === tur).length;
    const hepsi = sonuc.sozcukler.every((s) => s.tur === 'tamam');
    const kacan = sonuc.sozcukler.filter((s) => s.tur === 'eksik' || s.tur === 'farkli').map((s) => s.ham);
    return h('div', { class: 'tlf-sonuc' },
      h('small', null, t('telaffuz.taninan')), h('p', { lang: 'en' }, sonuc.metin || '—'),
      h('p', { class: 'b-kucuk' }, hepsi ? t('telaffuz.hepsi') : t('telaffuz.ozet', { eksik: say('eksik'), farkli: say('farkli'), fazla: say('fazla') })),
      hepsi ? null : h('div', { class: 'tlf-eylemler' },
        kacan.length ? h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve', onClick: () => soyle(kacan.join(' '), 'yavas') }, ikon('hoparlor', 18), t('telaffuz.kacaniDinle')) : null,
        h('button', { type: 'button', class: 'b-dugme b-dugme-cerceve', onClick: () => {
          // Kullanıcının seçimiyle (otomatik değil): ses tanımanın yanılgısı kullanıcının hatası sayılmaz.
          const eklenen = hafizayaEkle([kayitOlustur({ tur: 'telaffuz', dogru: c.metin, kullanici: sonuc.metin, baglam: c.kaynak, seviye: al().profil.seviye, kaynak: 'telaffuz', kuralId: null })]);
          duyur(eklenen ? t('telaffuz.hafizayaEklendi') : t('telaffuz.hafizadaVar'), 2500);
        } }, ikon('arti', 18), t('telaffuz.hafizayaEkle'))),
      h('p', { class: 'b-kucuk tlf-not' }, t('telaffuz.puanDegil')));
  }

  // v0.16.0: dinleme ekrandan çıkınca ya da cümle değişince durdurulur; eski cümlenin sonucu yeni karta yazılmaz.
  let dinleyici = null;
  function dinlemeyiDurdur() { if (dinleyici) { try { dinleyici.iptal(); } catch { /* bitmiş */ } dinleyici = null; } dinleniyor = false; }

  async function soyleVeKarsilastir(hedef) {
    if (dinleniyor) return;
    if (izinDurumu() !== 'verildi') {
      const s = await mikrofonIste();
      if (s !== 'verildi') { duyur(t('telaffuz.izinYok')); return; }
    }
    sus();
    dinleniyor = true; kartCiz();
    const bu = sira;
    try {
      dinleyici = dinle({
        onSonuc: ({ metin }) => { dinleyici = null; dinleniyor = false; if (bu === sira) kartCiz({ metin, sozcukler: karsilastir(hedef, metin) }); },
        onHata: () => { dinleyici = null; dinleniyor = false; kartCiz(); duyur(t('telaffuz.duyulmadi')); },
        sessizlikMs: 5000,
      });
    } catch { dinleyici = null; dinleniyor = false; kartCiz(); duyur(t('telaffuz.tanimaYok')); }
  }

  yerlestir(kok,
    ustBaslik({ tabela: t('gezinme.pratik'), baslik: t('telaffuz.baslik'), alt: t('telaffuz.alt'), ikon: 'telaffuz', geri: () => b.geri('/bugun') }),
    sekmeler([['seviye', t('telaffuz.kaynak.seviye')], ['tum', t('telaffuz.kaynak.tum')], ['hafiza', t('telaffuz.kaynak.hafiza')]], kaynakSecimi, (id) => { dinlemeyiDurdur(); kaynakSecimi = id; sira = 0; kartCiz(); }, { tur: 'hap', etiket: t('telaffuz.kaynakEtiket') }),
    kart,
    h('p', { class: 'b-kucuk' }, t('telaffuz.nasil')),
    altGezinme('/bugun'),
  );
  kartCiz();
  return () => { dinlemeyiDurdur(); sus(); };
}

export default {
  kimlik: 'telaffuz',
  surum: '0.2.0',
  onek: 'tlf',
  semaSurumu: 1,
  cekirdekServisleri: ['depo', 'metin'],
  ekranlar: { telaffuz: ekran({ baslikAnahtari: 'ekran.telaffuz', durumlar: DORT_DURUM, ciz }) },
};
