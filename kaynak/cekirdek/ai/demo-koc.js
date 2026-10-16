// Demo koç: sunucu yokken çalışan, senaryo verisine dayalı koç.
// Gerçek AI sağlayıcısı aynı arayüzü (acilis, cevapla, ipucu, durum, bitir) uygular ve adaptöre takılır.
import senaryolar from '../../veri/senaryolar/index.js';
import gunlukSenaryolar from '../../veri/gunluk/index.js';
import sozluk from '../../veri/sozluk.js';
import tekrarSorulari from '../../veri/tekrar-sorulari.js';
import kocDili from '../../veri/koc-dili.js';
import { duzeltmeleriBul, tumunuDuzelt, turkceKelimeler } from '../dil/duzeltme-motoru.js';
import { kelimeFarki, benzerlik } from '../dil/fark.js';

const SEVIYE_SIRASI = ['A1', 'A2', 'B1', 'B2', 'C1'];
const AKSAM_HAFIZA_SINIRI = 3;
const TEKRAR_SINIRI = 5;

function normal(metin) {
  return metin.toLowerCase()
    .replace(/[’\x27]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function iceriyor(metin, kelimeler) {
  const m = ` ${normal(metin)} `;
  return kelimeler.some((k) => m.includes(` ${normal(k)} `));
}

function rastgele(dizi) {
  return dizi[Math.floor(Math.random() * dizi.length)];
}

function cumleIci(c) {
  let s = c.trim();
  if (!/^I\b/.test(s)) s = s.charAt(0).toLowerCase() + s.slice(1);
  if (!/[.!?]$/.test(s)) s += '.';
  return s;
}

export function senaryoBul(id) {
  return senaryolar.find((s) => s.kimlik === id) || null;
}

function soruOlustur(oge) {
  const sablon = tekrarSorulari[oge.kuralId] || tekrarSorulari[oge.tur] || tekrarSorulari.kelime;
  return sablon.replace('{tr}', oge.kullanici).replace('{dogru}', oge.dogru);
}

function hafizaAdimi(oge) {
  return {
    koc: soruOlustur(oge),
    ipucu: [oge.dogru],
    dallar: [],
    hafizaId: oge.id,
    hafizaTur: oge.tur,
    kuralId: oge.kuralId,
    dogru: oge.dogru,
  };
}

export const demoSaglayici = {
  kimlik: 'demo',
  cagriMaliyeti: 0,

  oturumAc({ tur, senaryoId, profil, hafizaOgeleri = [], yazili = false, onceki = null }) {
    const kaynak = tur === 'senaryo' ? senaryoBul(senaryoId) : gunlukSenaryolar[tur];
    if (!kaynak) throw new Error('senaryo-yok');

    const uygunOgeler = hafizaOgeleri.filter((o) => !(yazili && o.tur === 'telaffuz'));
    let akis = [kaynak.acilis, ...kaynak.adimlar];
    if (tur === 'tekrar') akis = [kaynak.acilis, ...uygunOgeler.slice(0, TEKRAR_SINIRI).map(hafizaAdimi)];
    if (tur === 'aksam') akis = akis.concat(uygunOgeler.slice(0, AKSAM_HAFIZA_SINIRI).map(hafizaAdimi));
    const ustSeviye = SEVIYE_SIRASI.indexOf(profil.seviye) >= SEVIYE_SIRASI.indexOf('B1');
    if (ustSeviye && kaynak.ustAdim) akis.splice(akis.length - 1, 0, { ...kaynak.ustAdim, dallar: [] });

    const doldur = (s) => s.replace(/\{ad\}/g, profil.ad || 'there');
    const ovulenKaliplar = new Set();
    const durum = onceki || {
      i: 0,
      cumleler: [],
      duzeltmeler: [],
      ceviriler: [],
      kullanilanKelimeler: [],
      hafizaSonuclari: [],
      gorevTamam: false,
    };

    return {
      kaynak,

      acilis() {
        return { metin: doldur(akis[durum.i].koc) };
      },

      cevapla(metin, guven = 0) {
        const kisa = normal(metin).split(' ').length <= 6;
        if (!normal(metin)) return { metin: kocDili.bosCevap, bitti: false, ceviriler: [] };
        if (kisa && iceriyor(metin, kocDili.anlamadim.kelimeler)) {
          return { metin: `${kocDili.anlamadim.koc} ${doldur(akis[durum.i].koc)}`, yavas: true, bitti: false, ceviriler: [] };
        }

        durum.cumleler.push({ metin, guven, adim: durum.i });
        const bulunan = duzeltmeleriBul(metin);
        durum.duzeltmeler.push(...bulunan.map((d) => ({ ...d, segmentler: kelimeFarki(d.kullanici, d.dogru) })));
        const ceviriler = turkceKelimeler(metin, sozluk);
        for (const c of ceviriler) if (!durum.ceviriler.some((x) => x.tr === c.tr)) durum.ceviriler.push(c);
        for (const k of kaynak.anahtarKelimeler) {
          if (iceriyor(metin, [k.en]) && !durum.kullanilanKelimeler.includes(k.en)) durum.kullanilanKelimeler.push(k.en);
        }
        if (!durum.gorevTamam && iceriyor(metin, kaynak.gorev.kelimeler)) durum.gorevTamam = true;

        const adim = akis[durum.i];
        if (adim.hafizaId) {
          let basari;
          if (adim.hafizaTur === 'telaffuz') basari = guven >= 0.8 && benzerlik(metin, adim.dogru) >= 0.8;
          else if (adim.hafizaTur === 'kelime') basari = iceriyor(metin, [adim.dogru]);
          else basari = !bulunan.some((d) => d.kuralId === adim.kuralId);
          durum.hafizaSonuclari.push({ id: adim.hafizaId, basari });
        }

        const parcalar = [];
        if (bulunan.length) {
          parcalar.push(rastgele(kocDili.dogalTekrar).replace('{cumle}', cumleIci(tumunuDuzelt(metin))));
        } else {
          const kalip = kaynak.hedefKaliplar.find((k) => !ovulenKaliplar.has(k.anahtar) && iceriyor(metin, [k.anahtar]));
          if (kalip) {
            ovulenKaliplar.add(kalip.anahtar);
            parcalar.push(kocDili.kalipOvgusu.replace('{kalip}', kalip.anahtar));
          }
        }
        const dal = (adim.dallar || []).find((d) => iceriyor(metin, d.kelimeler));
        if (dal) parcalar.push(dal.koc);
        // v0.14.0 Sapma onarımı: kullanıcı soruya cevap vermek yerine kendisi soru sorduysa koç bunu kabul eder
        // ve AYNI soruyu bir kez yeniden sorar (ilerlemez). Her adımda en çok bir kez. Yanlış alarm riskini düşük tutmak için
        // konu dışı cevap tahmini yapılmaz (anahtar kelime eşleşmesi buna yetecek kadar güvenilir değil).
        const beklenen = (adim.dallar || []).length > 0;
        const kendiSorusu = /\?\s*$/.test(metin.trim());
        if (!dal && !bulunan.length && beklenen && !(durum.sapma || {})[durum.i] && kendiSorusu && !parcalar.length) {
          durum.sapma = { ...(durum.sapma || {}), [durum.i]: true };
          return { metin: `${kendiSorusu ? kocDili.sapma.soru : kocDili.sapma.konu} ${doldur(adim.koc)}`, bitti: false, ceviriler };
        }
        if (!bulunan.length && !dal && !parcalar.length) parcalar.push(rastgele(kocDili.genelOvgu));

        durum.i += 1;
        const bitti = durum.i >= akis.length;
        parcalar.push(doldur(bitti ? kaynak.kapanis : akis[durum.i].koc));
        return { metin: parcalar.join(' '), bitti, ceviriler };
      },

      ipucu() {
        const adim = akis[Math.min(durum.i, akis.length - 1)];
        return {
          kaliplar: (adim.ipucu && adim.ipucu.length ? adim.ipucu : kaynak.hedefKaliplar.map((k) => k.kalip)).slice(0, 2),
          ceviriler: durum.ceviriler.slice(-2),
        };
      },

      ilerleme() {
        return { adim: durum.i, toplam: akis.length };
      },

      durum() {
        return JSON.parse(JSON.stringify(durum));
      },

      bitir(sureSn) {
        const odak = kaynak.karneOdagi || [];
        const duzeltmeler = [...durum.duzeltmeler].sort((a, b) => Number(odak.includes(b.kuralId)) - Number(odak.includes(a.kuralId)));


        return {
          tur,
          senaryoId: kaynak.kimlik,
          baslik: kaynak.baslik,
          seviye: kaynak.seviye === 'tum' ? profil.seviye : kaynak.seviye,
          sureSn,
          yazili,
          cumleler: durum.cumleler,
          duzeltmeler,
          ceviriler: durum.ceviriler,
          yeniKelimeler: durum.kullanilanKelimeler,
          gorevTamam: durum.gorevTamam,
          saglayici: 'demo',
          olcumDurumu: 'demo',
          akicilik: null,
          telaffuz: null,
          hafizaSonuclari: durum.hafizaSonuclari,
          seviyeTahmini: null,
          kulturelNot: kaynak.kulturelNot || null,
        };
      },
    };
  },
};
