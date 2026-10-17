// v0.19.0 Rehberlik çekirdeği (veri ve kurallar; çizim yok — çizim cekirdek/rehber-arayuz.js ve moduller/rehber).
//
// 1) KUTU: bildirim ve mesaj kutusu. İki tür öğe vardır:
//    - Saklanan öğeler (v.rehber.kutu): yenilikler, ipuçları, öneriler, hatırlatmalar; başka modüller kutuyaEkle() ile ekler.
//    - Canlı öğeler: KAYNAKLAR'a kayıtlı işlevlerden her okumada yeniden hesaplanır (okunmamış mesajlar, arkadaşlık
//      istekleri, arkadaş haberleri, paylaşımlarına yorumlar, tekrar bekleyen hatalar). Okundu/silindi bilgisi ve ilk
//      görülme zamanı v.rehber.durum'da tutulur; kaynak kendi okundu bilgisini veriyorsa (mesajlar) o esas alınır.
//    Yeni bir bildirim türü eklemek = kutuKaynagiEkle(kat, fn) ile bir kaynak kaydetmek. Ekranlar değişmez.
// 2) KULLANIM: ekran açılışları cihazda sayılır (sunucuya gitmez). Az kullanılan bölümler için nazik öneri üretir.
// 3) YENİ: güncellemeden sonra önceki sürümde olmayan özellikler "Yeni" etiketi taşır (açılınca ya da 14 gün sonra kalkar).
// 4) PLAN: hatırlatma (eksik profil bilgisi), bilgilendirme (ipucu) ve kullanım önerisi — günde en çok bir sistem mesajı.
import { al, degistir } from './depo.js';
import { dinle, yayinla } from './olay-hatti.js';
import { t, yerel } from './metin.js';
import { SURUM } from './surum.js';
import { tarihAnahtari } from './zaman.js';
import { OZELLIKLER, YENILIKLER, HARITA_GRUPLARI } from '../veri/rehber-dizini.js';
import { testModuAcik, testSohbetOzetleri, okunmamis, okunduIsaretle, testAnlari, anYorumlari, testProfiliHam } from './test-modu.js';
import { gelenIstekler, arkadasHaberleri, arkadasYap, istekReddet } from './arkadaslik.js';
import { vadesiGelenler } from './hafiza.js';

const GUN = 86400000;
const YENI_SURESI = 14 * GUN;
const KUTU_SINIRI = 100;
const KUTU_OMRU = 30 * GUN;
const DURUM_SINIRI = 400;
const KATEGORILER = [
  { kimlik: 'mesaj', ikon: 'sohbet', renk: 2 },
  { kimlik: 'arkadas', ikon: 'aile', renk: 1 },
  { kimlik: 'anlar', ikon: 'anlar', renk: 4 },
  { kimlik: 'ogrenme', ikon: 'hafiza', renk: 3 },
  { kimlik: 'hesap', ikon: 'profil', renk: 6 },
  { kimlik: 'uygulama', ikon: 'ipucu', renk: 5 },
];
const AYAR_VARSAYILAN = { ipucu: true, hatirlatma: true, bilgi: true, oneri: true };

// ---- Durum ----
function bos() {
  return { kurulum: Date.now(), sonSurum: SURUM, yeniler: {}, yenilikBekliyor: null, kutu: [], durum: {}, kullanim: {}, gorulenIpucu: [], tur: { tamam: false }, ayar: { ...AYAR_VARSAYILAN }, plan: {}, sonAramalar: [] };
}
function r() {
  const v = al();
  const x = v.rehber && typeof v.rehber === 'object' ? v.rehber : {};
  return { ...bos(), ...x, ayar: { ...AYAR_VARSAYILAN, ...(x.ayar || {}) }, plan: { ...(x.plan || {}) }, tur: { tamam: false, ...(x.tur || {}) } };
}
function guncelle(fn) {
  degistir((v) => { const x = r(); fn(x); v.rehber = x; });
}
const rehberAyari = () => r().ayar;
function rehberAyarla(anahtar, deger) { guncelle((x) => { x.ayar[anahtar] = Boolean(deger); }); }

// ---- Sürüm karşılaştırma ----
function surumSayi(s) { return String(s || '0').split('.').map((n) => Number(n) || 0); }
function surumBuyuk(a, b) {
  const x = surumSayi(a); const y = surumSayi(b);
  for (let i = 0; i < 3; i++) { if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); }
  return false;
}

// ---- Özellik görünürlüğü (test modu gerektirenler) ----
const ozellikGorunur = (o) => !o.test || testModuAcik();
const ozellik = (kimlik) => OZELLIKLER.find((o) => o.kimlik === kimlik) || null;
const grup = (kimlik) => HARITA_GRUPLARI.find((g) => g.kimlik === kimlik) || null;

// ---- Kullanım takibi (yalnız cihazda) ----
const IZ_PARAMETRELERI = ['grup', 'sekme', 'bolum'];
function kullanildi(iz) {
  if (!iz) return;
  guncelle((x) => {
    const k = { ...(x.kullanim[iz] || { n: 0 }) };
    k.n += 1; k.son = Date.now();
    x.kullanim = { ...x.kullanim, [iz]: k };
    // Bu izi taşıyan özelliklerin "Yeni" etiketi kalkar.
    OZELLIKLER.forEach((o) => { if (o.iz === iz && x.yeniler[o.kimlik]) { const y = { ...x.yeniler }; delete y[o.kimlik]; x.yeniler = y; } });
  });
}
function kullanimSayisi(iz) { return iz ? ((r().kullanim[iz] || {}).n || 0) : null; }
function kullanimiSil() { guncelle((x) => { x.kullanim = {}; x.plan = { ...x.plan, oneriGecmis: {} }; }); }

// ---- "Yeni" etiketleri ----
function yeniMi(kimlik) {
  const z = r().yeniler[kimlik];
  return Boolean(z) && Date.now() - z < YENI_SURESI;
}
function yeniGoruldu(kimlik) {
  if (!r().yeniler[kimlik]) return;
  guncelle((x) => { const y = { ...x.yeniler }; delete y[kimlik]; x.yeniler = y; });
}
// Bir adrese (yan menü satırı gibi) giden yeni özellik var mı?
function yolYeniMi(yol) { return OZELLIKLER.some((o) => o.yol === yol && yeniMi(o.kimlik) && ozellikGorunur(o)); }
function bekleyenYenilikler() {
  const x = r();
  if (!x.yenilikBekliyor) return [];
  return YENILIKLER.filter((y) => surumBuyuk(y.surum, x.yenilikBekliyor));
}
function yeniliklerGosterildi() { guncelle((x) => { x.yenilikBekliyor = null; }); }

// Açılışta bir kez: sürüm değiştiyse yeni özellikleri işaretle, yenilikler penceresini sıraya koy, kutuya not düş.
function surumDenetle() {
  const x = r();
  if (x.sonSurum === SURUM) return;
  const onceki = x.sonSurum;
  guncelle((y) => {
    y.sonSurum = SURUM;
    if (!onceki || !al().profil.kurulumTamam) return; // ilk kurulum: her şey zaten yeni, etiket yok
    const simdi = Date.now();
    OZELLIKLER.filter((o) => surumBuyuk(o.surum, onceki)).forEach((o) => { y.yeniler = { ...y.yeniler, [o.kimlik]: simdi }; });
    y.yenilikBekliyor = onceki;
    y.kutu = [kutuOgesi({ kaynak: `yenilik:${SURUM}`, kat: 'uygulama', tur: 'yenilik', ikon: 'hediye', baslik: { m: 'rehber.yenilik.kutuBaslik', d: { s: SURUM } }, metin: { m: 'rehber.yenilik.kutuMetin' }, eylem: 'yenilikler' }), ...y.kutu];
  });
}

// ---- Kutu: saklanan öğeler ----
function kutuOgesi(o) { return { zaman: Date.now(), okundu: false, ...o }; }
function kutuyaEkle(oge) {
  if (!oge || !oge.kaynak || !oge.kat) return;
  guncelle((x) => {
    if (x.kutu.some((k) => k.kaynak === oge.kaynak) || (x.durum[oge.kaynak] || {}).s) return;
    x.kutu = [kutuOgesi(oge), ...x.kutu].slice(0, KUTU_SINIRI);
  });
  yayinla('kutu:degisti');
}

// ---- Kutu: canlı kaynaklar ----
const KAYNAKLAR = [];
function kutuKaynagiEkle(kat, fn) { KAYNAKLAR.push({ kat, fn }); }

const mesajMetni = (m) => (m.metin ? String(m.metin) : m.foto || m.fotolar ? t('rehber.kutu.foto') : '…');
kutuKaynagiEkle('mesaj', () => {
  const sinir = Date.now() - 7 * GUN;
  return testSohbetOzetleri().filter((o) => o.son.kim === 'o' && Number(o.son.zaman || 0) > sinir).map((o) => ({
    kaynak: `mesaj:${o.profil.kimlik}:${o.son.zaman}`, profil: o.profil, baslik: o.profil.ad, metin: mesajMetni(o.son), zaman: Number(o.son.zaman),
    yol: `/mesaj?k=${o.profil.kimlik}`, okundu: !okunmamis(o), okunduYap: () => okunduIsaretle(o.profil.kimlik),
  }));
});
kutuKaynagiEkle('arkadas', () => gelenIstekler().map((p) => ({
  kaynak: `istek:${p.kimlik}`, profil: p, baslik: p.ad, metin: t('rehber.kutu.istekMetni'), yol: '/kesfet?sekme=arkadaslar',
  eylemler: [
    { ad: t('rehber.kutu.kabul'), ana: true, fn: () => arkadasYap(p.kimlik) },
    { ad: t('rehber.kutu.reddet'), fn: () => istekReddet(p.kimlik) },
  ],
})));
kutuKaynagiEkle('arkadas', () => arkadasHaberleri().map((hb) => ({
  kaynak: `haber:${hb.kimlik}`, profil: hb.kisi, baslik: `${hb.kisi.ad} · ${t(`arkadas.haberTuru.${hb.tur}`)}`, metin: yerel(hb.metin) || '', zaman: hb.zaman,
  yol: hb.an ? '/dil-anlari' : `/kisi?k=${hb.kisi.kimlik}`,
})));
kutuKaynagiEkle('anlar', () => testAnlari().filter((a) => a.benim).flatMap((a) => anYorumlari(a.kimlik)
  .map((y, i) => ({ y, i })).filter(({ y }) => y.yazar && y.yazar !== 'ben').map(({ y, i }) => {
    const yazar = testProfiliHam(y.yazar);
    return { kaynak: `yorum:${a.kimlik}:${i}`, profil: yazar, baslik: t('rehber.kutu.yorumBaslik', { ad: yazar ? yazar.ad : '?' }), metin: y.metin || '', zaman: y.zaman || a.zaman, yol: '/dil-anlari' };
  })));
kutuKaynagiEkle('ogrenme', () => {
  const n = vadesiGelenler().length;
  if (!n) return [];
  return [{ kaynak: `tekrar:${tarihAnahtari()}`, ikon: 'hafiza', baslik: t('rehber.kutu.tekrarBaslik', { n }), metin: t('rehber.kutu.tekrarMetni'), yol: '/hafiza' }];
});

// Metin alanları: düz metin, { m: anahtar, d: değerler } (arayüz metni) ya da { tr, en } (içerik).
function metinCoz(x) {
  if (x == null) return '';
  if (typeof x === 'string') return x;
  if (x.m) return t(x.m, x.d);
  return yerel(x) || '';
}

function kutuOgeleri() {
  const x = r();
  const durum = x.durum || {};
  const canli = [];
  for (const k of KAYNAKLAR) {
    let liste = [];
    try { liste = k.fn() || []; } catch (hata) { console.error('[rehber] kaynak', k.kat, hata); }
    liste.forEach((o) => canli.push({ ...o, kat: k.kat, canli: true }));
  }
  const tumu = [
    ...x.kutu.map((o) => ({ ...o, canli: false })),
    ...canli.map((o) => {
      const d = durum[o.kaynak] || {};
      // Kaynak kendi okundu bilgisini veriyorsa (mesajlar: sohbet açılınca okunur) o esastır; yoksa kutudaki işaret.
      return { ...o, zaman: d.z || o.zaman || Date.now(), okundu: typeof o.okundu === 'boolean' ? o.okundu : Boolean(d.o) };
    }),
  ].filter((o) => !(durum[o.kaynak] || {}).s);
  return tumu.map((o) => ({ ...o, baslikMetni: metinCoz(o.baslik), govdeMetni: metinCoz(o.metin) })).sort((a, b) => b.zaman - a.zaman);
}
function okunmamisSayisi() { return kutuOgeleri().filter((o) => !o.okundu).length; }

// Canlı öğelerin ilk görülme zamanı saklanır (zamanı olmayan istekler sıralamada yer değiştirmesin).
function canliZamanlariSakla() {
  const x = r();
  const eksik = [];
  for (const k of KAYNAKLAR) {
    let liste = [];
    try { liste = k.fn() || []; } catch { liste = []; }
    liste.forEach((o) => { if (!(x.durum[o.kaynak] || {}).z) eksik.push([o.kaynak, o.zaman || Date.now()]); });
  }
  if (!eksik.length) return;
  guncelle((y) => {
    const d = { ...y.durum };
    eksik.forEach(([k, z]) => { d[k] = { ...(d[k] || {}), z }; });
    y.durum = durumuBudanmis(d);
  });
}
function durumuBudanmis(d) {
  const girdiler = Object.entries(d);
  if (girdiler.length <= DURUM_SINIRI) return d;
  return Object.fromEntries(girdiler.sort((a, b) => (b[1].z || 0) - (a[1].z || 0)).slice(0, DURUM_SINIRI));
}

// Toplu işlemler: kaynak kimlikleri listesiyle çalışır.
function okunduYap(kaynaklar) {
  const kume = new Set(kaynaklar);
  const ogeler = kutuOgeleri().filter((o) => kume.has(o.kaynak));
  ogeler.forEach((o) => { if (o.okunduYap && !o.okundu) { try { o.okunduYap(); } catch (hata) { console.error(hata); } } });
  guncelle((x) => {
    x.kutu = x.kutu.map((o) => (kume.has(o.kaynak) ? { ...o, okundu: true } : o));
    const d = { ...x.durum };
    ogeler.filter((o) => o.canli).forEach((o) => { d[o.kaynak] = { ...(d[o.kaynak] || {}), o: true, z: (d[o.kaynak] || {}).z || o.zaman }; });
    x.durum = durumuBudanmis(d);
  });
  yayinla('kutu:degisti');
}
function sil(kaynaklar) {
  const kume = new Set(kaynaklar);
  const ogeler = kutuOgeleri().filter((o) => kume.has(o.kaynak));
  guncelle((x) => {
    x.kutu = x.kutu.filter((o) => !kume.has(o.kaynak));
    const d = { ...x.durum };
    // Saklanan öğe de "silindi" diye işaretlenir: aynı kaynak (ör. aynı ipucu) bir daha üretilmez.
    ogeler.forEach((o) => { d[o.kaynak] = { ...(d[o.kaynak] || {}), s: true, z: (d[o.kaynak] || {}).z || o.zaman }; });
    x.durum = durumuBudanmis(d);
  });
  yayinla('kutu:degisti');
}

// ---- Plan: hatırlatma, bilgilendirme, kullanım önerisi ----
const PROFIL_ALANLARI = [
  { alan: 'foto', ikon: 'profil', dolu: (p) => Boolean(p.foto), yol: '/profil' },
  { alan: 'tanitim', ikon: 'kalem', dolu: (p) => Boolean(p.tanitimMetni), yol: '/ayarlar?grup=profil' },
  { alan: 'ilgi', ikon: 'yildiz', dolu: (p) => (p.ilgiler || []).length > 0, yol: '/ayarlar?bolum=ilgi' },
  { alan: 'hedef', ikon: 'hedef', dolu: (p) => Boolean(p.dilHedefi), yol: '/ayarlar?grup=dil' },
  { alan: 'kapak', ikon: 'gorunum', dolu: (p) => Boolean(p.kapak), yol: '/profil' },
];
const HATIRLATMA_ARALIGI = 2 * GUN;
const ALAN_EN_COK = 3;
const ONERI_ARALIGI = 3 * GUN;

function eksikAlanlar() { const p = al().profil; return PROFIL_ALANLARI.filter((a) => !a.dolu(p)); }

// Kullanım bilgisi ancak birkaç günlük takipten sonra anlamlıdır: v0.19.0'a güncelleyen kullanıcının eski kullanımı bilinmez,
// bu yüzden ilk günlerde hiçbir bölüm "açılmadı" sayılmaz (öneri ve harita noktaları bu kurala bağlıdır).
const TAKIP_ESIGI = 3 * GUN;
function kullanimBilinir() { return Date.now() - (r().kurulum || Date.now()) >= TAKIP_ESIGI; }
function hicAcilmadi(iz) { return Boolean(iz) && kullanimBilinir() && !((r().kullanim[iz] || {}).n); }

function oneriAdaylari(n = 3) {
  const x = r();
  const simdi = Date.now();
  if (!kullanimBilinir()) return [];
  const gecmis = x.plan.oneriGecmis || {};
  const sustur = x.plan.susturulan || [];
  return OZELLIKLER
    .filter((o) => o.iz && o.grup !== 'yardim' && ozellikGorunur(o) && !sustur.includes(o.kimlik) && !(gecmis[o.kimlik] && simdi - gecmis[o.kimlik] < 30 * GUN))
    .map((o) => ({ o, k: x.kullanim[o.iz] || { n: 0 } }))
    .filter(({ k }) => k.n === 0 || (k.son && simdi - k.son > 21 * GUN && k.n < 3))
    .sort((a, b) => a.k.n - b.k.n)
    .slice(0, n)
    .map(({ o, k }) => ({ ...o, hicAcilmadi: k.n === 0 }));
}
function oneriSustur(kimlik) { guncelle((x) => { x.plan = { ...x.plan, susturulan: [...new Set([...(x.plan.susturulan || []), kimlik])] }; }); }

function planla() {
  const v = al();
  if (!v.profil.kurulumTamam) return;
  const x = r();
  const simdi = Date.now();
  const bugun = tarihAnahtari();
  const yas = simdi - (x.kurulum || simdi);
  const p = v.profil;

  guncelle((y) => {
    // 1) Bakım: süresi dolan "Yeni" etiketleri, eski ve fazla kutu öğeleri, dolmuş profil alanlarının hatırlatmaları.
    y.yeniler = Object.fromEntries(Object.entries(y.yeniler).filter(([, z]) => simdi - z < YENI_SURESI));
    y.kutu = y.kutu.filter((o) => simdi - o.zaman < KUTU_OMRU).filter((o) => !(o.tur === 'hatirlatma' && PROFIL_ALANLARI.some((a) => `hatirlatma:${a.alan}` === o.kaynak.replace(/:\d+$/, '') && a.dolu(p)))).slice(0, KUTU_SINIRI);

    // Günde en çok bir sistem mesajı; kullanıcı bir şeyi bugün zaten aldıysa sessiz kal.
    if (y.plan.sonSistem === bugun) return;
    const ekle = (oge) => { y.kutu = [kutuOgesi(oge), ...y.kutu].slice(0, KUTU_SINIRI); y.plan = { ...y.plan, sonSistem: bugun }; };

    // 2) Eksik profil bilgisi hatırlatması (zorunlu alanlar hariç; kurulumdan 1 gün sonra; 2 günde bir; alan başına en çok 3 kez).
    const sayac = y.plan.hatirlatmaSay || {};
    const okunmamisHatirlatma = y.kutu.some((o) => o.tur === 'hatirlatma' && !o.okundu);
    if (y.ayar.hatirlatma && yas > GUN && !okunmamisHatirlatma && simdi - (y.plan.sonHatirlatma || 0) > HATIRLATMA_ARALIGI) {
      const a = PROFIL_ALANLARI.find((x2) => !x2.dolu(p) && (sayac[x2.alan] || 0) < ALAN_EN_COK);
      if (a) {
        ekle({ kaynak: `hatirlatma:${a.alan}:${(sayac[a.alan] || 0) + 1}`, kat: 'hesap', tur: 'hatirlatma', ikon: a.ikon, baslik: { m: `rehber.hatirlatma.${a.alan}.baslik` }, metin: { m: `rehber.hatirlatma.${a.alan}.metin` }, yol: a.yol });
        y.plan = { ...y.plan, sonHatirlatma: simdi, hatirlatmaSay: { ...sayac, [a.alan]: (sayac[a.alan] || 0) + 1 } };
        return;
      }
    }

    // 3) Kullanım önerisi: az ya da hiç açılmayan bölüm (kurulumdan 3 gün sonra; 3 günde bir; aynı bölüm 30 günde bir).
    if (y.ayar.oneri && yas > 3 * GUN && simdi - (y.plan.sonOneri || 0) > ONERI_ARALIGI) {
      const [o] = oneriAdaylari(1);
      if (o) {
        ekle({ kaynak: `oneri:${o.kimlik}:${bugun}`, kat: 'uygulama', tur: 'oneri', ikon: o.ikon, ozellik: o.kimlik,
          baslik: { m: o.hicAcilmadi ? 'rehber.oneri.hicBaslik' : 'rehber.oneri.uzunBaslik', d: { ad: yerel(o.ad) } }, metin: o.aciklama, yol: o.yol || null, eylem: o.eylem || null });
        y.plan = { ...y.plan, sonOneri: simdi, oneriGecmis: { ...(y.plan.oneriGecmis || {}), [o.kimlik]: simdi } };
        return;
      }
    }

    // 4) Bilgilendirme: henüz gönderilmemiş bir ipucu (2 günde bir). Ekranda gezinme hareketleri (iz yok) önce.
    if (y.ayar.bilgi && simdi - (y.plan.sonBilgi || 0) > 2 * GUN) {
      const gonderilen = y.plan.bilgiGonderilen || [];
      const aday = [...OZELLIKLER].sort((a, b) => Number(Boolean(a.iz)) - Number(Boolean(b.iz)))
        .find((o) => ozellikGorunur(o) && !gonderilen.includes(o.kimlik) && !['tur', 'yenilikler', 'rehber-ayar'].includes(o.kimlik));
      if (aday) {
        ekle({ kaynak: `bilgi:${aday.kimlik}`, kat: 'uygulama', tur: 'bilgi', ikon: 'ipucu', ozellik: aday.kimlik,
          baslik: { m: 'rehber.bilgi.baslik', d: { ad: yerel(aday.ad) } }, metin: aday.ipucu, yol: aday.yol || null, eylem: aday.eylem || null });
        y.plan = { ...y.plan, sonBilgi: simdi, bilgiGonderilen: [...gonderilen, aday.kimlik] };
      }
    }
  });
  canliZamanlariSakla();
  yayinla('kutu:degisti');
}

// ---- Ekran ipuçları ----
function ekranIpucu(ekranId) {
  const x = r();
  if (!x.ayar.ipucu) return null;
  return OZELLIKLER.find((o) => o.ekranIpucu && o.iz && o.iz.split(':')[0] === ekranId && ozellikGorunur(o) && !x.gorulenIpucu.includes(o.kimlik)) || null;
}
function ipucuGoruldu(kimlik) { guncelle((x) => { if (!x.gorulenIpucu.includes(kimlik)) x.gorulenIpucu = [...x.gorulenIpucu, kimlik]; }); }
function ipuclariniSifirla() { guncelle((x) => { x.gorulenIpucu = []; }); }

// ---- Tur ----
const turDurumu = () => r().tur;
function turBitti() { guncelle((x) => { x.tur = { ...x.tur, tamam: true, zaman: Date.now() }; }); }

// ---- Arama ----
// Türkçe karakterler katlanır: "kilit", "kılıt", "KİLİT" aynı sonucu verir.
function katla(s) {
  return String(s || '').toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ı/g, 'i');
}
function ara(sorgu) {
  const parcalar = katla(sorgu).split(/\s+/).filter(Boolean);
  if (!parcalar.length) return [];
  return OZELLIKLER.filter(ozellikGorunur).map((o) => {
    const ad = katla(yerel(o.ad));
    const anahtar = katla([...(o.anahtar.tr || []), ...(o.anahtar.en || [])].join(' | '));
    const uzun = katla(`${yerel(o.aciklama)} ${yerel(o.ipucu)} ${yerel((grup(o.grup) || {}).ad)}`);
    let puan = 0;
    for (const p of parcalar) {
      if (ad.startsWith(p)) puan += 100;
      else if (ad.includes(p)) puan += 60;
      else if (anahtar.includes(p)) puan += 40;
      else if (uzun.includes(p)) puan += 12;
      else return null;
    }
    return { o, puan };
  }).filter(Boolean).sort((a, b) => b.puan - a.puan).map((x) => x.o);
}
function aramaKaydet(sorgu) {
  const s = String(sorgu || '').trim().slice(0, 40);
  if (s.length < 2) return;
  guncelle((x) => { x.sonAramalar = [s, ...(x.sonAramalar || []).filter((y) => katla(y) !== katla(s))].slice(0, 6); });
}
const sonAramalar = () => r().sonAramalar || [];
function aramalariSil() { guncelle((x) => { x.sonAramalar = []; }); }

// ---- Başlatma ----
const IZLENMEZ = ['karsilama', 'gorusme', 'gelen-arama'];
let sonPlan = 0;
function rehberBaslat() {
  surumDenetle();
  dinle('ekran:degisti', ({ id, parametreler }) => {
    if (IZLENMEZ.includes(id)) return;
    kullanildi(id);
    IZ_PARAMETRELERI.forEach((k) => { if (parametreler && parametreler[k]) kullanildi(`${id}:${parametreler[k]}`); });
    if (Date.now() - sonPlan > 60000) { sonPlan = Date.now(); setTimeout(planla, 400); }
  });
  setInterval(() => { sonPlan = Date.now(); planla(); }, 5 * 60000);
}

export { KATEGORILER, HARITA_GRUPLARI, OZELLIKLER, YENILIKLER, rehberBaslat, rehberAyari, rehberAyarla, surumBuyuk, ozellik, grup, ozellikGorunur, kullanildi, kullanimSayisi, kullanimBilinir, hicAcilmadi, kullanimiSil, yeniMi, yeniGoruldu, yolYeniMi, bekleyenYenilikler, yeniliklerGosterildi, kutuyaEkle, kutuKaynagiEkle, kutuOgeleri, okunmamisSayisi, okunduYap, sil, eksikAlanlar, oneriAdaylari, oneriSustur, planla, ekranIpucu, ipucuGoruldu, ipuclariniSifirla, turDurumu, turBitti, katla, ara, aramaKaydet, sonAramalar, aramalariSil };
