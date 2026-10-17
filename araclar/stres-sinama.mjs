// v0.26.1 Stres ve değişmez sınaması (derlemede çalışır; `node araclar/stres-sinama.mjs [kullanici] [adim]`).
// Kaynak modüller doğrudan (Node, sahte localStorage) çalıştırılır; binlerce sanal kullanıcı rastgele ama tekrarlanabilir
// (tohumlu) davranışlar yapar, her adımdan sonra uygulamanın değişmezleri denetlenir. Ayrıca: saat dilimi/iletişim saati
// kaba kuvvetle, sayı türü (telefon mu?) üretilmiş örneklerle, gramer motoru eşgüçlülükle, göç ve yedek bozma, iki sekme.
// Bir değişmez bozulursa derleme durur. Yeni özellik ekleyen, buraya değişmezini de ekler.
import { performance } from 'node:perf_hooks';

const KULLANICI = Number(process.argv[2]) || Number(process.env.STRES_KULLANICI) || 2000;
const ADIM = Number(process.argv[3]) || 40;

// ---- Ortam: tarayıcı yerine en küçük taklit ----
const disk = new Map();
globalThis.localStorage = { getItem: (k) => (disk.has(k) ? disk.get(k) : null), setItem: (k, v) => disk.set(k, String(v)), removeItem: (k) => disk.delete(k), clear: () => disk.clear() };
globalThis.window = { addEventListener() {}, matchMedia: () => ({ matches: false, addEventListener() {} }) };
globalThis.document = { hidden: false, documentElement: { setAttribute() {}, removeAttribute() {}, dataset: {} }, addEventListener() {}, getElementById: () => null, querySelectorAll: () => [] };
if (!globalThis.navigator) globalThis.navigator = { languages: ['tr'], userAgent: 'node' };
console.warn = () => {}; // onarım uyarıları sınamada gürültü
const gercekZamanlayici = globalThis.setTimeout;
globalThis.setTimeout = () => 0; // TEST yanıt benzetimleri ve gecikmeler sınamada çalışmaz
globalThis.setInterval = () => 0;

const K = '../kaynak/';
const depo = await import(`${K}cekirdek/depo.js`);
const { GUNCEL_SEMA, gocler } = await import(`${K}cekirdek/gocler.js`);
const { sozlesmeDenetle } = await import(`${K}cekirdek/veri-sozlesmesi.js`);
const tm = await import(`${K}cekirdek/test-modu.js`);
const ark = await import(`${K}cekirdek/arkadaslik.js`);
const erisim = await import(`${K}cekirdek/test-erisim.js`);
const kural = await import(`${K}cekirdek/topluluk-kurallari.js`);
const saat = await import(`${K}cekirdek/iletisim-saatleri.js`);
const destek = await import(`${K}cekirdek/destek.js`);
const hesap = await import(`${K}cekirdek/hesap.js`);
const sunucu = await import(`${K}cekirdek/sunucu.js`);
const hafiza = await import(`${K}cekirdek/hafiza.js`);
const { yeniKimlik } = await import(`${K}cekirdek/kimlik.js`);
const { tumunuDuzelt } = await import(`${K}cekirdek/dil/duzeltme-motoru.js`);
const { TEST_PROFILLERI } = await import(`${K}veri/test-profiller.js`);
const { SIKAYET_NEDENLERI, DESTEK_TURLERI } = await import(`${K}veri/destek-kurallari.js`);

// ---- Tohumlu rastgele ----
let tohum = 2610;
const rnd = () => ((tohum = (Math.imul(tohum, 1664525) + 1013904223) >>> 0) / 4294967296);
const sec = (dizi) => dizi[Math.floor(rnd() * dizi.length)];
const kisi = () => sec(TEST_PROFILLERI).kimlik;
const SAAT_DILIMLERI = ['Europe/Istanbul', 'Asia/Tokyo', 'America/Sao_Paulo', 'Australia/Sydney', 'Pacific/Auckland', 'America/Los_Angeles', 'Asia/Kolkata', 'UTC'];
const ss = () => `${String(Math.floor(rnd() * 24)).padStart(2, '0')}:${sec(['00', '15', '30', '45'])}`;

const sonuc = [];
let toplamHata = 0;
function bolum(ad, fn) {
  const bas = performance.now();
  const r = fn();
  const ms = Math.round(performance.now() - bas);
  toplamHata += r.hata;
  sonuc.push({ ad, ...r, ms });
}

// ---- 1) Sanal kullanıcılar: rastgele eylemler + her adımda değişmezler ----
bolum('Sanal kullanıcı davranışı', () => {
  let hata = 0; let denetim = 0; let eylem = 0; const ornekler = [];
  const bildir = (k, ad, ayrinti) => { hata += 1; if (ornekler.length < 8) ornekler.push(`${k}/${ad}: ${ayrinti}`); };
  const EYLEMLER = [
    () => tm.testMesajEkle(kisi(), { kim: rnd() < 0.5 ? 'ben' : 'o', metin: `m${rnd()}` }),
    () => ark.arkadasYap(kisi()), () => ark.arkadasliktanCikar(kisi()), () => ark.favoriDegistir(kisi()), () => ark.sabitleDegistir(kisi()),
    () => ark.arkadasligiAskiyaAl(kisi(), sec([1, 7, 30])), () => ark.askiyiKaldir(kisi()),
    () => ark.kisiTercihAyarla(kisi(), sec(ark.KISI_TERCIH_TURLERI), rnd() < 0.5),
    () => tm.testEngelle(kisi()), () => tm.testEngelKaldir(kisi()),
    () => tm.anYorumEkle(`an-${1 + Math.floor(rnd() * 8)}`, { yazar: rnd() < 0.5 ? 'ben' : kisi(), metin: 'y' }),
    () => tm.anBegen(`an-${1 + Math.floor(rnd() * 8)}`), () => tm.anPaylas(`p${rnd()}`),
    () => destek.destekGonder({ tur: sec(DESTEK_TURLERI), kategori: sec(SIKAYET_NEDENLERI), metin: sec(['spam http www.x kripto', 'beni tehdit etti', 'iyi uygulama', '']) }),
    () => { const k = sec(destek.destekKayitlari()); if (k) destek.geriAl(k.kimlik); },
    () => { const k = sec(destek.destekKayitlari()); if (k) destek.yanitEkle(k.kimlik, 'tamam'); },
    () => (rnd() < 0.5 ? hesap.hesabiAskiyaAl() : hesap.hesabiAc()),
    () => ark.guvendeAyarla(rnd() < 0.5),
    () => saat.saatleriAyarla(sec(saat.SAAT_TURLERI), { bas: ss(), bit: ss() }),
    () => tm.testModuAyarla(rnd() < 0.8),
    () => ark.gizlilikAyarla(sec(['arkadasListesi', 'sonGorulme']), sec(ark.GIZLILIK_SECENEKLERI)),
    () => hafiza.hafizayaEkle([hafiza.kayitOlustur({ tur: 'gramer', dogru: sec(['I went', 'She goes', 'I agree']), kullanici: 'x', seviye: 'A1', kaynak: 'stres' })]),
  ];
  for (let u = 0; u < KULLANICI; u += 1) {
    depo.sifirla();
    depo.degistir((v) => { v.profil.kurulumTamam = true; v.profil.yasOnayi = true; });
    tm.testModuAyarla(true);
    for (let a = 0; a < ADIM; a += 1) {
      try { sec(EYLEMLER)(); } catch (e) { bildir(u, 'istisna', e.message); continue; }
      eylem += 1;
      const v = depo.al(); const t = v.test || {};
      const d = (ad, kosul, ayrinti = '') => { denetim += 1; if (!kosul) bildir(u, ad, ayrinti); };
      const acik = Boolean(t.acik) && !v.profil.hesapAskida;
      d('sabit≤3', (t.sabitli || []).length <= ark.SABIT_SINIRI);
      d('arkadas tekil', new Set(t.arkadaslar || []).size === (t.arkadaslar || []).length);
      d('mesaj≤200', Object.values(t.sohbetler || {}).every((s) => s.mesajlar.length <= 200));
      d('destek≤sinir', (v.destek.kayitlar || []).length <= destek.DESTEK_SINIRI);
      d('destek kimlik tekil', new Set(v.destek.kayitlar.map((k) => k.kimlik)).size === v.destek.kayitlar.length);
      d('giden≤sinir', (v.giden || []).length <= 500);
      for (const p of TEST_PROFILLERI) {
        const engelli = (t.engelli || []).includes(p.kimlik);
        if (engelli || !acik) {
          d('erişilemeyen görünmez', tm.testProfili(p.kimlik) === null, p.kimlik);
          d('erişilemeyen istek yok', !ark.gelenIstekler().some((x) => x.kimlik === p.kimlik), p.kimlik);
          d('erişilemeyen haber yok', !ark.arkadasHaberleri().some((x) => x.kisi.kimlik === p.kimlik), p.kimlik);
          d('erişilemeyen yorum yok', !tm.anYorumlari('an-1').some((y) => y.yazar === p.kimlik), p.kimlik);
        }
        if (ark.askidaMi(p.kimlik)) d('askıda haber yok', !ark.arkadasHaberleri().some((x) => x.kisi.kimlik === p.kimlik), p.kimlik);
      }
      if (!acik) d('kapalıyken test listesi boş', tm.testProfilleri().length === 0);
      if (a % 10 === 9) {
        { const so = sozlesmeDenetle(JSON.parse(JSON.stringify(v)), goc0(), false).sorunlar; d('sözleşme geçerli', so.length === 0, JSON.stringify(so)); }
        d('yedek gidip gelir', depo.iceAktarHazirla(depo.disaAktarMetni()).tamam);
      }
    }
  }
  return { hata, ayrinti: `${KULLANICI} kullanıcı × ${ADIM} adım = ${eylem} eylem, ${denetim} değişmez denetimi`, ornekler };
});

function goc0() { let v = null; for (let s = 1; s <= GUNCEL_SEMA; s += 1) v = gocler[s](v); v.semaSurumu = GUNCEL_SEMA; return v; }

// ---- 2) İletişim saatleri: kaba kuvvetle karşılaştırma ----
bolum('İletişim saatleri (saat dilimi)', () => {
  let hata = 0; const ornekler = []; const N = 20000;
  const dk = (s) => { const [a, b] = s.split(':').map(Number); return a * 60 + b; };
  const referans = (ar, gun, m) => {
    const b = dk(ar.bas); const s = dk(ar.bit);
    if (b === s) return ar.gunler.includes(gun);
    if (b < s) return ar.gunler.includes(gun) && m >= b && m < s;
    return (m >= b && ar.gunler.includes(gun)) || (m < s && ar.gunler.includes((gun + 6) % 7));
  };
  for (let i = 0; i < N; i += 1) {
    const ar = { bas: ss(), bit: ss(), gunler: [0, 1, 2, 3, 4, 5, 6].filter(() => rnd() < 0.7) };
    if (!ar.gunler.length) ar.gunler = [3];
    const tz = sec(SAAT_DILIMLERI);
    const an = Date.UTC(2026, Math.floor(rnd() * 12), 1 + Math.floor(rnd() * 28), Math.floor(rnd() * 24), Math.floor(rnd() * 60));
    const yb = saat.yerelBilesen(an, tz);
    if (saat.aralikta(ar, yb) !== referans(ar, yb.gun, yb.dk)) { hata += 1; if (ornekler.length < 5) ornekler.push(JSON.stringify({ ar, tz, an })); }
    if (i % 20 === 0) {
      const sonraki = saat.sonrakiUygunAn(ar, tz, an);
      if (sonraki !== null) {
        if (!saat.aralikta(ar, saat.yerelBilesen(sonraki, tz))) { hata += 1; ornekler.push(`sonraki aralık dışı ${JSON.stringify({ ar, tz })}`); }
        if (sonraki - 15 * 60000 >= an && saat.aralikta(ar, saat.yerelBilesen(sonraki - 15 * 60000, tz))) { hata += 1; ornekler.push(`sonraki en erken değil ${JSON.stringify({ ar, tz })}`); }
      }
    }
  }
  return { hata, ayrinti: `${N} rastgele aralık × an × saat dilimi kaba kuvvetle; ${N / 20} "sonraki uygun an"`, ornekler };
});

// ---- 3) Sayı türü: telefon mu? ----
bolum('İletişim süzgeci (sayı türü)', () => {
  let hata = 0; const ornekler = []; let n = 0;
  const r = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  const rak = (k) => Array.from({ length: k }, () => r(0, 9)).join('');
  const telefonlar = () => sec([
    () => `05${r(30, 59)} ${rak(3)} ${rak(2)} ${rak(2)}`, () => `+90 5${r(30, 59)} ${rak(3)} ${rak(4)}`, () => `05${r(30, 59)}${rak(7)}`,
    () => `(0${r(212, 232)}) ${rak(3)} ${rak(2)} ${rak(2)}`, () => `5${r(30, 59)}-${rak(3)}-${rak(4)}`, () => `+44 7${rak(3)} ${rak(6)}`, () => `+1 (${rak(3)}) ${rak(3)}-${rak(4)}`,
  ])();
  const telefonOlmayanlar = () => sec([
    () => `${r(1950, 2030)}-${r(1950, 2030)}`, () => `${r(1, 28)}.${r(1, 12)}.${r(1990, 2030)}`, () => `${r(1990, 2030)}-${String(r(1, 12)).padStart(2, '0')}-${String(r(1, 28)).padStart(2, '0')}`,
    () => `${r(0, 9)}.${rak(r(7, 12))}`, () => `${r(0, 3)}.${r(0, 40)}.${r(0, 9)}.${rak(4)}`, () => `${r(1, 999)}.${rak(3)}.${rak(3)} TL`, () => `${r(1, 99)}.${rak(2)}`,
  ])();
  for (let i = 0; i < 10000; i += 1) {
    const tel = telefonlar(); const sayi = telefonOlmayanlar(); n += 2;
    if (!kural.iletisimBilgisiVar(`ara beni ${tel}`)) { hata += 1; if (ornekler.length < 6) ornekler.push(`kaçtı: ${tel}`); }
    if (kural.iletisimBilgisiVar(`bak: ${sayi}`)) { hata += 1; if (ornekler.length < 6) ornekler.push(`yanlış engel: ${sayi}`); }
  }
  return { hata, ayrinti: `${n} üretilmiş örnek (telefon biçimleri ↔ yıl, tarih, ondalık, sürüm, tutar)`, ornekler };
});

// ---- 4) Gramer motoru: çökme yok, eşgüçlü ----
bolum('Düzeltme motoru (25.000 cümle)', () => {
  let hata = 0; const ornekler = [];
  const OZ = ['I', 'you', 'he', 'she', 'we', 'they', 'my friend', 'Did you', 'Didn\'t she'];
  const FI = ['go', 'went', 'buy', 'bought', 'arrive', 'study', 'play', 'think', 'is', 'have', 'stop', 'like'];
  const SO = ['yesterday', 'every day', 'last week', 'tomorrow', 'now', 'since 2020', ''];
  const BA = [' and ', ', then ', ' but ', ' because ', ' although ', ' if '];
  for (let i = 0; i < 25000; i += 1) {
    let c = `${sec(OZ)} ${sec(FI)} to school ${sec(SO)}`;
    if (rnd() < 0.5) c += `${sec(BA)}${rnd() < 0.5 ? `${sec(OZ)} ` : ''}${sec(FI)} bread ${sec(SO)}`;
    try {
      const a = tumunuDuzelt(c); const b2 = tumunuDuzelt(a);
      if (a !== b2) { hata += 1; if (ornekler.length < 5) ornekler.push(`eşgüçlü değil: "${c}" → "${a}" → "${b2}"`); }
    } catch (e) { hata += 1; if (ornekler.length < 5) ornekler.push(`istisna: ${c}: ${e.message}`); }
  }
  return { hata, ayrinti: 'rastgele özne/fiil/zaman/bağlaç; düzeltmenin düzeltmesi aynı kalmalı', ornekler };
});

// ---- 5) Göç ve bozuk kayıt ----
bolum('Göç ve bozuk kayıt (açılış onarımı)', () => {
  let hata = 0; const ornekler = []; let n = 0;
  const DEGERLER = [null, 0, 'x', [], {}, true, [null, 5], { a: 1 }];
  const YOLLAR = ['profil', 'profil.ayarlar', 'hafiza', 'gorusmeler', 'test', 'test.sohbetler', 'test.engelli', 'destek', 'destek.kayitlar', 'giden', 'rehber', 'rehber.kutu', 'gunluk', 'senaryoIst'];
  for (let s = 0; s <= GUNCEL_SEMA; s += 1) {
    for (let i = 0; i < 60; i += 1) {
      let v = null; for (let k = 1; k <= s; k += 1) v = gocler[k](v); if (v) v.semaSurumu = s;
      if (v && rnd() < 0.8) { const yol = sec(YOLLAR).split('.'); let z = v; for (const p of yol.slice(0, -1)) z = z && typeof z === 'object' ? z[p] : null; if (z && typeof z === 'object') z[yol[yol.length - 1]] = sec(DEGERLER); }
      disk.clear(); disk.set('kk:veri', v === null ? sec(['{bozuk', '[]', '42', 'null']) : JSON.stringify(v)); n += 1;
      try {
        depo.yukle(); const y = depo.al();
        if (y.semaSurumu !== GUNCEL_SEMA || typeof y.profil.ayarlar !== 'object') throw new Error('eksik');
        const sorun = sozlesmeDenetle(JSON.parse(JSON.stringify(y)), goc0(), false).sorunlar;
        if (sorun.length) throw new Error(`onarım sonrası sözleşme: ${sorun.slice(0, 3)}`);
        depo.degistir((x) => { x.profil.ad = 'ok'; });
      } catch (e) { hata += 1; if (ornekler.length < 6) ornekler.push(`şema ${s}: ${e.message}`); }
    }
  }
  depo.bozukKayitVardi(); depo.kayitOnarildi();
  return { hata, ayrinti: `${n} kayıt (0–${GUNCEL_SEMA} her şemadan, %80'i rastgele bozulmuş)`, ornekler };
});

// ---- 6) Yedek bozma ----
bolum('Yedek geri yükleme (bozma)', () => {
  let hata = 0; const ornekler = []; let kabul = 0; let ret = 0;
  depo.sifirla(); depo.degistir((v) => { v.profil.kurulumTamam = true; });
  const temel = depo.disaAktarMetni();
  for (let i = 0; i < 5000; i += 1) {
    const v = JSON.parse(temel);
    const yollar = []; const gez = (o, y) => { if (!o || typeof o !== 'object' || y.split('.').length > 4) return; for (const k of Object.keys(o)) { const yy = y ? `${y}.${k}` : k; yollar.push(yy); gez(o[k], yy); } }; gez(v, '');
    const yol = sec(yollar).split('.'); let z = v; for (const p of yol.slice(0, -1)) z = z[p]; z[yol[yol.length - 1]] = sec([null, 0, 'x', [], {}, true, [1], { q: [] }]);
    try { const r = depo.iceAktarHazirla(JSON.stringify(v)); if (r.tamam) { kabul += 1; if (sozlesmeDenetle(JSON.parse(JSON.stringify(r.veri)), goc0(), false).sorunlar.length) { hata += 1; ornekler.push(`geçersiz kabul: ${yol.join('.')}`); } } else ret += 1; } catch (e) { hata += 1; if (ornekler.length < 6) ornekler.push(`istisna ${yol.join('.')}: ${e.message}`); }
  }
  return { hata, ayrinti: `5000 rastgele bozulmuş yedek: ${kabul} kabul (zararsız), ${ret} ret; istisna yok`, ornekler };
});

// ---- 7) Destek ön ayıklama ----
bolum('Destek ön ayıklama', () => {
  let hata = 0; const ornekler = [];
  const VAKALAR = [
    [{ tur: 'sikayet', kategori: 'guvenlik', metin: '' }, 'acil', 'yonetici'], [{ tur: 'sikayet', kategori: 'resit', metin: '' }, 'acil', 'yonetici'],
    [{ tur: 'sikayet', kategori: 'spam', metin: 'www.x.com kripto' }, 'dusuk', 'otomatik'], [{ tur: 'sikayet', kategori: 'spam', metin: 'beni tehdit etti' }, 'acil', 'yonetici'],
    [{ tur: 'sikayet', kategori: 'taciz', metin: '' }, 'yuksek', 'yonetici'], [{ tur: 'hata', metin: 'çöküyor' }, 'normal', 'yonetici'],
    [{ tur: 'oneri', metin: 'güzel olur' }, 'dusuk', 'yonetici'], [{ tur: 'gorus', metin: 'my son is 12 years old' }, 'acil', 'yonetici'],
  ];
  for (const [g, onem, yol] of VAKALAR) { const r = destek.onemSiniflandir(g); if (r.onem !== onem || r.yol !== yol) { hata += 1; ornekler.push(`${JSON.stringify(g)} → ${r.onem}/${r.yol} (beklenen ${onem}/${yol})`); } }
  return { hata, ayrinti: `${VAKALAR.length} etiketli vaka`, ornekler };
});

// ---- 8) Giden kutusu: tekil kimlik, sıra, yeniden deneme ----
bolum('Giden kutusu (sunucu kuyruğu)', () => {
  let hata = 0; const ornekler = [];
  depo.sifirla();
  for (let i = 0; i < 700; i += 1) sunucu.kuyruga(sec(sunucu.KANALLAR), { i });
  const g = sunucu.bekleyenler();
  if (g.length !== 500) { hata += 1; ornekler.push(`sınır: ${g.length}`); }
  if (new Set(g.map((x) => x.kimlik)).size !== g.length) { hata += 1; ornekler.push('kimlik tekil değil'); }
  if (g[g.length - 1].veri.i !== 699) { hata += 1; ornekler.push('sıra bozuk'); }
  const kimlikler = new Set(); for (let i = 0; i < 100000; i += 1) kimlikler.add(yeniKimlik('x'));
  if (kimlikler.size !== 100000) { hata += 1; ornekler.push(`100.000 kimlikte çakışma: ${100000 - kimlikler.size}`); }
  return { hata, ayrinti: '700 iş → son 500, tekil, sıralı; 100.000 kimlik çakışmasız', ornekler };
});

// ---- 9) İki sekme ----
bolum('İki sekme (kaybolan değişiklik)', () => {
  let hata = 0; const ornekler = [];
  return { hata, ayrinti: 'tarayıcı sınamasında (Playwright, gerçek iki sekme) yapılır', ornekler, atlandi: true };
});

// ---- 10) Hız ----
bolum('Yazma hızı (büyük kayıt)', () => {
  depo.sifirla(); tm.testModuAyarla(true);
  for (let i = 0; i < 2000; i += 1) tm.testMesajEkle(TEST_PROFILLERI[i % 10].kimlik, { kim: i % 2 ? 'ben' : 'o', metin: 'x'.repeat(200) });
  const boyut = disk.get('kk:veri').length;
  const bas = performance.now(); for (let i = 0; i < 50; i += 1) depo.degistir((v) => { v.profil.ad = `a${i}`; });
  const ms = (performance.now() - bas) / 50;
  return { hata: ms > 150 ? 1 : 0, ayrinti: `${Math.round(boyut / 1024)} KB kayıt, yazma başına ${ms.toFixed(1)} ms (sınır 150 ms)`, ornekler: [] };
});

globalThis.setTimeout = gercekZamanlayici;
for (const s of sonuc) {
  console.log(`${s.atlandi ? '•' : s.hata ? '✗' : '✓'} ${s.ad}: ${s.ayrinti} · ${s.ms} ms${s.hata ? ` · ${s.hata} hata` : ''}`);
  for (const o of (s.ornekler || [])) console.log(`    ${o}`);
}
if (toplamHata) { console.log(`✗ Stres sınaması: ${toplamHata} hata.`); process.exit(1); }
console.log('✓ Stres sınaması: bütün değişmezler tuttu.');
