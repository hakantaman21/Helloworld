// Yasa denetçisi (test robotu): Anayasa'daki yasaları kodda denetler. Bir yasa çiğnenirse derleme durur.
//   node araclar/yasa-denetcisi.mjs                 → kaynak/ klasörünü denetler
//   node araclar/yasa-denetcisi.mjs --dagitim       → derlenmiş dist/ çıktısında sır (anahtar) arar (Y8)
//   node araclar/yasa-denetcisi.mjs --kendini-sina  → bilerek ihlal konmuş örnek klasörde robotun yakaladığını kanıtlar

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const KOK = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const argumanlar = process.argv.slice(2);

// ---------- yardımcılar ----------
function dosyalar(dizin, uzanti) {
  if (!existsSync(dizin)) return [];
  const sonuc = [];
  for (const ad of readdirSync(dizin)) {
    const yol = join(dizin, ad);
    if (statSync(yol).isDirectory()) sonuc.push(...dosyalar(yol, uzanti));
    else if (uzanti.some((u) => ad.endsWith(u))) sonuc.push(yol);
  }
  return sonuc;
}
const oku = (yol) => readFileSync(yol, 'utf8');
const yorumsuzCss = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '');

// JS içindeki metin dizilerini (tırnak ve şablon) çıkarır; yorumları atlar.
function jsMetinleri(kod) {
  const sonuc = [];
  let i = 0;
  let satir = 1;
  while (i < kod.length) {
    const c = kod[i];
    if (c === '\n') { satir++; i++; continue; }
    if (c === '/' && kod[i + 1] === '/') { while (i < kod.length && kod[i] !== '\n') i++; continue; }
    if (c === '/' && kod[i + 1] === '*') { const son = kod.indexOf('*/', i + 2); for (let k = i; k < son; k++) if (kod[k] === '\n') satir++; i = son + 2; continue; }
    if (c === '\'' || c === '"' || c === '`') {
      const tirnak = c;
      let j = i + 1;
      let metin = '';
      const basSatir = satir;
      while (j < kod.length && kod[j] !== tirnak) {
        if (kod[j] === '\\') { metin += kod[j] + kod[j + 1]; j += 2; continue; }
        if (kod[j] === '\n') satir++;
        metin += kod[j];
        j++;
      }
      sonuc.push({ metin, satir: basSatir });
      i = j + 1;
      continue;
    }
    i++;
  }
  return sonuc;
}

function cssKurallari(css) {
  const sonuc = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(yorumsuzCss(css)))) sonuc.push({ secici: m[1].trim(), govde: m[2] });
  return sonuc;
}

function renkGolgesi(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((x) => x + x).join('');
  const [r, g, b] = [0, 2, 4].map((k) => parseInt(h.slice(k, k + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function kontrast(a, b) {
  const [x, y] = [renkGolgesi(a), renkGolgesi(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
function jetonBlogu(css, seciciDeseni) {
  const m = yorumsuzCss(css).match(seciciDeseni);
  if (!m) return null;
  const sonuc = {};
  for (const [, ad, deger] of m[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) sonuc[ad] = deger.trim();
  return sonuc;
}

// ---------- denetimler ----------
function denetle(kaynak, { tam = true } = {}) {
  const sonuclar = [];
  const ekle = (no, ad, hatalar, not) => sonuclar.push({ no, ad, hatalar, not });
  const g = (yol) => relative(KOK, yol).split('\\').join('/');
  const jsDosyalari = dosyalar(kaynak, ['.js']);
  const cssDosyalari = dosyalar(kaynak, ['.css']);
  const icinde = (yol, parca) => yol.split('\\').join('/').includes(parca);

  // Y1
  {
    const h = [];
    for (const d of [...jsDosyalari, ...cssDosyalari]) {
      oku(d).split('\n').forEach((s, i) => { if (s.includes('!important') && !s.trim().startsWith('//') && !s.includes('Y1')) h.push(`${g(d)}:${i + 1}`); });
    }
    ekle('Y1', '!important yasak', h);
  }

  // Y2
  {
    const h = [];
    for (const d of cssDosyalari) {
      const css = yorumsuzCss(oku(d));
      let derinlik = 0;
      let bas = 0;
      for (let i = 0; i < css.length; i++) {
        if (css[i] === '{') { if (derinlik === 0) { const ifade = css.slice(bas, i).trim(); if (!ifade.startsWith('@layer')) h.push(`${g(d)}: katmansız kural "${ifade.slice(0, 40)}"`); } derinlik++; }
        else if (css[i] === '}') { derinlik--; if (derinlik === 0) bas = i + 1; }
        else if (css[i] === ';' && derinlik === 0) { const ifade = css.slice(bas, i).trim(); if (ifade && !ifade.startsWith('@layer')) h.push(`${g(d)}: katmansız ifade "${ifade.slice(0, 40)}"`); bas = i + 1; }
      }
    }
    ekle('Y2', 'Stiller katman sırasıyla yazılır', h);
  }

  // Y3
  {
    const h = [];
    const renkRe = /#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?(?:[0-9a-fA-F]{2})?\b|rgba?\(|hsla?\(/;
    for (const d of cssDosyalari) {
      if (d.endsWith('jetonlar.css') || d.endsWith('tema-koyu.css')) continue;
      yorumsuzCss(oku(d)).split('\n').forEach((s, i) => { if (renkRe.test(s)) h.push(`${g(d)}:${i + 1} ${s.trim()}`); });
    }
    for (const d of jsDosyalari) {
      for (const { metin, satir } of jsMetinleri(oku(d))) if (/^#[0-9a-fA-F]{3,8}$/.test(metin.trim()) || /rgba?\(\s*\d/.test(metin)) h.push(`${g(d)}:${satir} "${metin}"`);
    }
    ekle('Y3', 'Renkler yalnız tasarım jetonlarından gelir', h);
  }

  // Y4 + modül sözleşmesi
  {
    const h = [];
    const modulKlasoru = join(kaynak, 'moduller');
    const klasorler = existsSync(modulKlasoru) ? readdirSync(modulKlasoru).filter((a) => statSync(join(modulKlasoru, a)).isDirectory()) : [];
    for (const k of klasorler) {
      const giris = join(modulKlasoru, k, 'index.js');
      if (!existsSync(giris)) { h.push(`moduller/${k}: index.js yok`); continue; }
      const kod = oku(giris);
      for (const alan of ['kimlik', 'surum', 'onek', 'semaSurumu', 'ekranlar']) if (!new RegExp(`\\b${alan}\\s*:`).test(kod)) h.push(`moduller/${k}: sözleşme alanı eksik: ${alan}`);
      const onek = (kod.match(/onek:\s*'([\w-]+)'/) || [])[1];
      for (const css of dosyalar(join(modulKlasoru, k), ['.css'])) {
        for (const { secici } of cssKurallari(oku(css))) {
          for (const [, sinif] of secici.matchAll(/\.([a-zA-Z][\w-]*)/g)) {
            if (!sinif.startsWith(onek + '-')) h.push(`${g(css)}: ".${sinif}" "${onek}-" önekiyle başlamıyor`);
          }
        }
      }
    }
    const bilesen = join(kaynak, 'stiller', 'bilesenler.css');
    if (existsSync(bilesen)) {
      for (const { secici } of cssKurallari(oku(bilesen))) for (const [, sinif] of secici.matchAll(/\.([a-zA-Z][\w-]*)/g)) if (!sinif.startsWith('b-')) h.push(`stiller/bilesenler.css: ".${sinif}" "b-" önekiyle başlamıyor`);
    }
    ekle('Y4', 'Her modül kendi stil önekini kullanır (+ modül sözleşmesi)', h);
  }

  // Y5
  {
    const h = [];
    for (const d of cssDosyalari) {
      yorumsuzCss(oku(d)).split('\n').forEach((s, i) => {
        const m = s.match(/z-index\s*:\s*([^;]+);/);
        if (m && !/^var\(--z-[\w-]+\)$/.test(m[1].trim())) h.push(`${g(d)}:${i + 1} z-index: ${m[1].trim()}`);
      });
    }
    ekle('Y5', 'Katman sırası sabit ölçekten seçilir', h);
  }

  // Y6 + döngü
  {
    const h = [];
    const grafik = new Map();
    for (const d of jsDosyalari) {
      const bagimlar = [];
      for (const [, yol] of oku(d).matchAll(/^import\s+(?:.+?\s+from\s+)?['"]([^'"]+\.js)['"]/gm)) {
        const hedef = resolve(dirname(d), yol);
        bagimlar.push(hedef);
        const kaynakModul = (relative(join(kaynak, 'moduller'), d).split(/[\\/]/));
        const hedefModul = (relative(join(kaynak, 'moduller'), hedef).split(/[\\/]/));
        const kaynakModulde = !kaynakModul[0].startsWith('..');
        const hedefModulde = !hedefModul[0].startsWith('..');
        if (kaynakModulde && hedefModulde && kaynakModul[0] !== hedefModul[0]) h.push(`${g(d)} → ${g(hedef)} (modüller birbirini çağıramaz)`);
        if (!kaynakModulde && hedefModulde && !d.endsWith('main.js')) h.push(`${g(d)} → ${g(hedef)} (çekirdek modüle bağımlı olamaz)`);
      }
      grafik.set(d, bagimlar);
    }
    const durum = new Map();
    const gez = (d, yol) => {
      if (durum.get(d) === 1) { h.push('döngüsel import: ' + [...yol, d].map(g).join(' → ')); return; }
      if (durum.get(d) === 2) return;
      durum.set(d, 1);
      for (const b of grafik.get(d) || []) gez(b, [...yol, d]);
      durum.set(d, 2);
    };
    for (const d of grafik.keys()) gez(d, []);
    ekle('Y6', 'Modüller birbirine dokunmaz; döngüsel bağımlılık yok', h);
  }

  if (tam) {
    // Y7
    {
      const h = [];
      const gocler = join(kaynak, 'cekirdek', 'gocler.js');
      if (!existsSync(gocler)) h.push('cekirdek/gocler.js yok');
      else {
        const kod = oku(gocler);
        const guncel = Number((kod.match(/GUNCEL_SEMA\s*=\s*(\d+)/) || [])[1]);
        const numaralar = [...kod.matchAll(/^\s{2}(\d+):/gm)].map((m) => Number(m[1]));
        for (let s = 1; s <= guncel; s++) if (!numaralar.includes(s)) h.push(`göç ${s} eksik (GUNCEL_SEMA = ${guncel})`);
        if (numaralar.some((n) => n > guncel)) h.push('GUNCEL_SEMA son göçten küçük');
      }
      const hafiza = join(kaynak, 'cekirdek', 'hafiza.js');
      if (existsSync(hafiza) && !/semaSurumu:\s*KAYIT_SEMA_SURUMU/.test(oku(hafiza))) h.push('Hata Hafızası kaydı şema sürümü taşımıyor');
      ekle('Y7', 'Her veri kaydı şema sürümü taşır; göç yazılır', h);
    }
  }

  // Y8
  {
    const h = [];
    const sirRe = /(sk-ant-[\w-]{10,}|sk-[A-Za-z0-9]{32,}|AIza[0-9A-Za-z_-]{30,}|-----BEGIN [A-Z ]*PRIVATE KEY)/;
    for (const d of [...jsDosyalari, ...cssDosyalari]) oku(d).split('\n').forEach((s, i) => { if (sirRe.test(s)) h.push(`${g(d)}:${i + 1}`); });
    ekle('Y8', 'Anahtar ve sırlar istemci koduna girmez', h);
  }

  // Y9
  {
    const h = [];
    for (const d of jsDosyalari) {
      if (icinde(d, '/cekirdek/ai/')) continue;
      oku(d).split('\n').forEach((s, i) => { if (/\bfetch\(|XMLHttpRequest|new WebSocket|EventSource\(/.test(s) && !s.trim().startsWith('//')) h.push(`${g(d)}:${i + 1}`); });
    }
    ekle('Y9', 'Ağ ve AI çağrıları yalnız AI adaptöründen geçer', h);
  }

  if (tam) {
    // Y10
    {
      const h = [];
      const surum = (oku(join(kaynak, 'cekirdek', 'surum.js')).match(/SURUM = '([^']+)'/) || [])[1];
      const paket = JSON.parse(oku(join(KOK, 'package.json'))).version;
      const degisiklik = existsSync(join(KOK, 'DEGISIKLIKLER.md')) ? (oku(join(KOK, 'DEGISIKLIKLER.md')).match(/^##\s+([\d.]+)/m) || [])[1] : null;
      if (surum !== paket) h.push(`surum.js (${surum}) ≠ package.json (${paket})`);
      if (surum !== degisiklik) h.push(`surum.js (${surum}) ≠ DEGISIKLIKLER.md son kayıt (${degisiklik || 'yok'})`);
      ekle('Y10', 'Sürüm numarası ve değişiklik notu tutarlı', h);
    }
    ekle('Y11', 'İstenmeyen değişiklik yapılmaz', [], 'insan denetimi');
  }

  // Y12
  {
    const h = [];
    for (const d of jsDosyalari) oku(d).split('\n').forEach((s, i) => { if (/MediaRecorder|audio\/(webm|wav|ogg|mp4)/.test(s)) h.push(`${g(d)}:${i + 1}`); });
    ekle('Y12', 'Ses kaydı saklanmaz', h);
  }

  if (tam) {
    // Y13
    {
      const h = [];
      const temel = oku(join(kaynak, 'stiller', 'temel.css'));
      if (!/button[^{]*\{[^}]*min-height:\s*var\(--dokunma\)/.test(yorumsuzCss(temel))) h.push('temel.css: düğmeler için genel min-height: var(--dokunma) kuralı yok');
      const jet = jetonBlogu(oku(join(kaynak, 'stiller', 'jetonlar.css')), /:root\s*\{([\s\S]*?)\}/);
      if (!jet || parseInt(jet['--dokunma'], 10) < 48) h.push('--dokunma jetonu 48px değil');
      for (const d of cssDosyalari) {
        for (const { secici, govde } of cssKurallari(oku(d))) {
          if (!/button|dugme|yuvarlak|secenek|gezinme-oge|ara-alt|ara-gelen-kucuk/.test(secici)) continue;
          for (const [, ozellik, px] of govde.matchAll(/(min-height|height)\s*:\s*(\d+)px/g)) if (Number(px) < 48) h.push(`${g(d)}: "${secici}" ${ozellik}: ${px}px`);
        }
      }
      ekle('Y13', 'Dokunma alanı en az 48×48 piksel', h);
    }

    // Y14
    {
      const h = [];
      const acik = jetonBlogu(oku(join(kaynak, 'stiller', 'jetonlar.css')), /:root\s*\{([\s\S]*?)\}/);
      const koyuCss = oku(join(kaynak, 'stiller', 'tema-koyu.css'));
      const koyu = { ...acik, ...jetonBlogu(koyuCss, /:root\[data-tema="koyu"\]\s*\{([\s\S]*?)\}/) };
      const koyuSistem = jetonBlogu(koyuCss, /:root:not\(\[data-tema="acik"\]\)\s*\{([\s\S]*?)\}/);
      for (const [ad, deger] of Object.entries(koyuSistem || {})) if (koyu[ad] !== deger) h.push(`tema-koyu.css: ${ad} iki koyu blokta farklı`);
      const METIN = 4.5;
      const IKON = 3;
      const ciftler = [
        ['--renk-murekkep', '--renk-zemin', METIN], ['--renk-murekkep', '--renk-yuzey', METIN], ['--renk-murekkep', '--renk-vurgu-acik', METIN],
        ['--renk-soluk', '--renk-yuzey', METIN], ['--renk-soluk', '--renk-zemin', METIN], ['--renk-yuzey', '--renk-murekkep', METIN],
        ['--renk-vurgu-uzerinde', '--renk-vurgu', METIN], ['--renk-vurgu-metin', '--renk-yuzey', METIN], ['--renk-vurgu-metin', '--renk-zemin', METIN],
        ['--renk-vurgu-acik-metin', '--renk-vurgu-acik', METIN], ['--renk-iyi-metin', '--renk-iyi-acik', METIN], ['--renk-iyi-metin', '--renk-yuzey', METIN],
        ['--renk-orta-metin', '--renk-orta-acik', METIN], ['--renk-orta-metin', '--renk-yuzey', METIN], ['--renk-kotu-metin', '--renk-kotu-acik', METIN],
        ['--renk-kotu-metin', '--renk-yuzey', METIN], ['--renk-gece-metin', '--renk-gece', METIN], ['--renk-gece-soluk', '--renk-gece', METIN],
        ['--renk-gece-metin', '--renk-gece-yuzey', METIN], ['--renk-gece-vurgu', '--renk-gece', METIN], ['--renk-gece-metin', '--renk-kotu', METIN],
        ['--renk-gece-metin', '--renk-iyi', IKON], ['--renk-vurgu-uzerinde', '--renk-iyi', IKON], ['--renk-vurgu-metin', '--renk-vurgu-acik', IKON],
      ];
      for (const [tema, jet] of [['açık', acik], ['koyu', koyu]]) {
        for (const [on, arka, esik] of ciftler) {
          const a = jet[on];
          const b = jet[arka];
          if (!a || !b || !a.startsWith('#') || !b.startsWith('#')) { h.push(`${tema}: ${on} / ${arka} tanımsız`); continue; }
          const k = kontrast(a, b);
          if (k < esik) h.push(`${tema}: ${arka} üzerinde ${on} → ${k.toFixed(2)}:1 (en az ${esik}:1)`);
        }
      }
      ekle('Y14', 'Metin kontrastı WCAG AA (açık ve koyu tema)', h);
    }

    // Y15
    {
      const h = [];
      const karne = join(kaynak, 'moduller', 'karne', 'index.js');
      if (existsSync(karne)) for (const s of ['krn-isaret-iyi', 'krn-isaret-orta', 'krn-isaret-kotu']) if (!oku(karne).includes(s)) h.push(`karne: "${s}" işareti yok`);
      const bil = yorumsuzCss(oku(join(kaynak, 'stiller', 'bilesenler.css')));
      if (!/\.b-fark-sil\s*\{[^}]*text-decoration/.test(bil)) h.push('b-fark-sil: renge ek olarak üstü çizili değil');
      if (!/\.b-fark-ekle\s*\{[^}]*text-decoration/.test(bil)) h.push('b-fark-ekle: renge ek olarak altı çizili değil');
      ekle('Y15', 'Renk tek başına anlam taşımaz', h);
    }
  }

  // Y16
  {
    const h = [];
    for (const d of jsDosyalari) {
      if (icinde(d, '/metinler/') || icinde(d, '/veri/')) continue;
      for (const { metin, satir } of jsMetinleri(oku(d))) if (/[çğıöşüÇĞİÖŞÜ]/.test(metin)) h.push(`${g(d)}:${satir} "${metin.slice(0, 50)}"`);
    }
    ekle('Y16', 'Arayüz metni koda yazılmaz', h);
  }

  return sonuclar;
}

async function asenkronDenetimler(kaynak, sonuclar) {
  const ekle = (no, ad, hatalar, not) => sonuclar.push({ no, ad, hatalar, not });
  const g = (yol) => relative(KOK, yol).split('\\').join('/');
  const jsDosyalari = dosyalar(kaynak, ['.js']);
  const ice = async (yol) => (await import(pathToFileURL(yol).href)).default;

  // Y16b: kullanılan her metin anahtarı tabloda var mı?
  {
    const h = [];
    const tablo = await ice(join(kaynak, 'metinler', 'tr.js'));
    const bul = (anahtar) => anahtar.split('.').reduce((d, p) => (d == null ? undefined : d[p]), tablo);
    for (const d of jsDosyalari) {
      const kod = oku(d);
      for (const [, anahtar] of kod.matchAll(/\bt\(\s*'([\w.]+)'/g)) if (typeof bul(anahtar) !== 'string') h.push(`${g(d)}: "${anahtar}" metin tablosunda yok`);
      for (const [, onek] of kod.matchAll(/\bt\(\s*`([\w.]+)\.\$\{/g)) if (typeof bul(onek) !== 'object') h.push(`${g(d)}: "${onek}.*" metin tablosunda yok`);
    }
    for (const [, anahtar] of oku(join(kaynak, 'cekirdek', 'dil', 'duzeltme-motoru.js')).matchAll(/aciklama:\s*'([\w.]+)'/g)) if (typeof bul(anahtar) !== 'string') h.push(`duzeltme-motoru: "${anahtar}" metin tablosunda yok`);
    ekle('Y16b', 'Kullanılan her metin anahtarı tabloda var', h);
  }

  // Y17
  {
    const h = [];
    const senaryolar = await ice(join(kaynak, 'veri', 'senaryolar', 'index.js'));
    const gunluk = await ice(join(kaynak, 'veri', 'gunluk', 'index.js'));
    const alanlar = (await ice(join(kaynak, 'veri', 'alanlar.js'))).map((a) => a.kimlik);
    const kurallar = (await import(pathToFileURL(join(kaynak, 'cekirdek', 'dil', 'duzeltme-motoru.js')).href)).KURALLAR.map((k) => k.id);
    const seviyeler = ['A1', 'A2', 'B1', 'B2', 'C1'];
    const kimlikler = new Set();
    const denetle1 = (s, gunlukMu) => {
      const ad = s.kimlik || '(kimliksiz)';
      const zorunlu = ['kimlik', 'alan', 'seviye', 'baslik', 'durum', 'roller', 'gorev', 'hedefKaliplar', 'anahtarKelimeler', 'acilis', 'adimlar', 'seviyeVaryasyonlari', 'kapanis', 'karneOdagi', 'kulturelNot'];
      for (const alan of zorunlu) if (!(alan in s)) h.push(`${ad}: "${alan}" alanı yok`);
      if (kimlikler.has(s.kimlik)) h.push(`${ad}: kimlik iki kez kullanılmış`);
      kimlikler.add(s.kimlik);
      if (!s.baslik || !s.baslik.tr || !s.baslik.en) h.push(`${ad}: başlık Türkçe ve İngilizce olmalı`);
      const ikiDilli = (d) => d && typeof d === 'object' && d.tr && d.en;
      if (!s.roller || !ikiDilli(s.roller.koc) || !s.roller.aksan) h.push(`${ad}: rol (tr + en) ve aksan eksik`);
      if (!s.gorev || !ikiDilli(s.gorev.aciklama) || !Array.isArray(s.gorev.kelimeler)) h.push(`${ad}: görev açıklaması (tr + en) ve başarı kelimeleri eksik`);
      if (!ikiDilli(s.durum)) h.push(`${ad}: durum tr + en olmalı`);
      if (s.kulturelNot !== null && !ikiDilli(s.kulturelNot)) h.push(`${ad}: kültürel not null ya da tr + en olmalı`);
      if (!s.acilis || !s.acilis.koc) h.push(`${ad}: açılış repliği yok`);
      if (!s.seviyeVaryasyonlari || !s.seviyeVaryasyonlari.alt || !s.seviyeVaryasyonlari.ust) h.push(`${ad}: seviye varyasyonları eksik`);
      for (const k of s.karneOdagi || []) if (!kurallar.includes(k)) h.push(`${ad}: karne odağı "${k}" bilinen bir kural değil`);
      if (!gunlukMu) {
        if (!alanlar.includes(s.alan)) h.push(`${ad}: bilinmeyen yaşam alanı "${s.alan}"`);
        if (!seviyeler.includes(s.seviye)) h.push(`${ad}: bilinmeyen seviye "${s.seviye}"`);
        if ((s.hedefKaliplar || []).length !== 3) h.push(`${ad}: tam 3 hedef kalıp olmalı`);
        const n = (s.anahtarKelimeler || []).length;
        if (n < 5 || n > 8) h.push(`${ad}: 5–8 anahtar kelime olmalı (${n})`);
        if (!(s.adimlar || []).length) h.push(`${ad}: en az bir adım olmalı`);
      }
    };
    senaryolar.forEach((s) => denetle1(s, false));
    Object.values(gunluk).forEach((s) => denetle1(s, true));
    ekle('Y17', 'Her senaryo şablonun zorunlu alanlarını doldurur', h);
  }

  // Y18–Y23
  {
    const h18 = [];
    const kayit = oku(join(kaynak, 'cekirdek', 'modul-kaydi.js'));
    for (const d of ['bos', 'yukleniyor', 'hata', 'cevrimdisi']) if (!new RegExp(`DORT_DURUM = \\[[^\\]]*'${d}'`).test(kayit)) h18.push(`DORT_DURUM içinde "${d}" yok`);
    for (const d of jsDosyalari.filter((x) => x.includes(`${join('kaynak', 'moduller')}`))) {
      const kod = oku(d);
      const ekranSayisi = (kod.match(/\bekran\(\{/g) || []).length;
      const durumSayisi = (kod.match(/durumlar:\s*DORT_DURUM/g) || []).length;
      if (ekranSayisi !== durumSayisi) h18.push(`${g(d)}: ${ekranSayisi} ekran, ${durumSayisi} durum bildirimi`);
    }
    ekle('Y18', 'Her ekranın boş, yükleniyor, hata, çevrimdışı halleri var', h18);

    const h19 = [];
    for (const d of dosyalar(join(kaynak, 'moduller', 'arama'), ['.js'])) if (/farkCiz|krn-/.test(oku(d))) h19.push(g(d));
    ekle('Y19', 'Konuşma ekranında düzeltme gösterilmez', h19);

    const h20 = [];
    const sinir = Number((oku(join(kaynak, 'cekirdek', 'zamanlayici.js')).match(/GUNLUK_BILDIRIM_SINIRI\s*=\s*(\d+)/) || [])[1]);
    if (!(sinir >= 0 && sinir <= 2)) h20.push(`GUNLUK_BILDIRIM_SINIRI = ${sinir}`);
    ekle('Y20', 'Kendiliğinden günde en fazla iki bildirim', h20);

    const h21 = [];
    for (const d of jsDosyalari) {
      if (d.endsWith(join('cekirdek', 'yonlendirici.js'))) continue;
      oku(d).split('\n').forEach((s, i) => { if (/history\.(back|pushState|replaceState|go)\(|location\.hash\s*=[^=]/.test(s)) h21.push(`${g(d)}:${i + 1}`); });
    }
    ekle('Y21', 'Geri her zaman gelinen yere döner (gezinme yalnız yönlendiriciden)', h21);

    const h22 = [];
    for (const d of jsDosyalari) {
      const kod = oku(d);
      if (/getUserMedia\(/.test(kod) && !d.endsWith(join('cekirdek', 'izin.js'))) h22.push(`${g(d)}: getUserMedia izin.js dışında`);
      if (/new\s+(webkit)?SpeechRecognition|new TanimaSinifi/.test(kod) && !d.endsWith(join('ses', 'ses-hatti.js'))) h22.push(`${g(d)}: ses tanıma ses-hatti.js dışında`);
    }
    const ses = join(kaynak, 'cekirdek', 'ses', 'ses-hatti.js');
    if (existsSync(ses) && !/izinDurumu\(\)\s*!==\s*'verildi'/.test(oku(ses))) h22.push('ses-hatti.js dinlemeden önce izni denetlemiyor');
    const izin = join(kaynak, 'cekirdek', 'izin.js');
    if (existsSync(izin) && !/t\('izin\.aciklama'\)/.test(oku(izin))) h22.push('izin.js gerekçe ekranı göstermiyor');
    ekle('Y22', 'İzin, gerekçe ekranı olmadan istenmez', h22);

    const h23 = [];
    const erisim = join(kaynak, 'stiller', 'erisim.css');
    const katmanlar = join(kaynak, 'stiller', 'katmanlar.css');
    if (!existsSync(erisim) || !/prefers-reduced-motion:\s*reduce[\s\S]*animation-duration[\s\S]*transition-duration/.test(oku(erisim))) h23.push('erisim.css "hareketi azalt" kuralı eksik');
    if (existsSync(katmanlar) && !/erisim;/.test(oku(katmanlar))) h23.push('erisim katmanı en son katman değil');
    ekle('Y23', 'Animasyonlar "hareketi azalt" ayarına uyar', h23);
  }

  // Y24: devir kaydı
  {
    const h = [];
    const surum = (oku(join(kaynak, 'cekirdek', 'surum.js')).match(/SURUM = '([^']+)'/) || [])[1];
    const devir = join(KOK, 'DEVIR.md');
    if (!existsSync(devir)) h.push('DEVIR.md yok');
    else {
      const metin = oku(devir);
      if (!/^## Şu anki durum/m.test(metin)) h.push('DEVIR.md: "## Şu anki durum" bölümü yok');
      const bas = metin.search(new RegExp(`^## v${surum.replace(/\./g, '\\.')}\\b`, 'm'));
      if (bas < 0) h.push(`DEVIR.md: v${surum} kaydı yok`);
      else {
        const bolum = metin.slice(bas).split(/\n## /)[0];
        if (!/^- \*\*Yapan:\*\*\s*\S+/m.test(bolum)) h.push(`DEVIR.md: v${surum} kaydında "Yapan" bilgisi yok`);
      }
    }
    ekle('Y24', 'Her sürümün devir kaydı ve yapanı yazılı', h);
  }

  // Y25: arayüz dilleri aynı anahtarları ve aynı yer tutucuları taşır
  {
    const h = [];
    const duzlestir = (o, on = '') => Object.entries(o).flatMap(([k, d]) => (d && typeof d === 'object' ? duzlestir(d, `${on}${k}.`) : [[`${on}${k}`, d]]));
    const tablolar = {};
    for (const ad of dosyalar(join(kaynak, 'metinler'), ['.js'])) {
      tablolar[ad.split(/[\\/]/).pop().replace('.js', '')] = new Map(duzlestir((await import(pathToFileURL(ad).href)).default));
    }
    const diller = Object.keys(tablolar);
    const tum = new Set(diller.flatMap((d) => [...tablolar[d].keys()]));
    for (const anahtar of tum) {
      for (const d of diller) if (!tablolar[d].has(anahtar)) h.push(`${d}.js: "${anahtar}" eksik`);
      const yerTutucular = diller.filter((d) => tablolar[d].has(anahtar)).map((d) => [...String(tablolar[d].get(anahtar)).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(','));
      if (new Set(yerTutucular).size > 1) h.push(`"${anahtar}": yer tutucular dillerde farklı`);
    }
    const metin = oku(join(kaynak, 'cekirdek', 'metin.js'));
    for (const d of diller) if (!new RegExp(`ARAYUZ_DILLERI = \\[[^\\]]*'${d}'`).test(metin)) h.push(`metin.js: "${d}" ARAYUZ_DILLERI listesinde yok`);
    ekle('Y25', 'Her metin anahtarı tüm arayüz dillerinde var', h);
  }

  // Y26: yapay zekâ her zaman etiketli
  {
    const h = [];
    for (const yol of [['moduller', 'arama', 'gorusme.js'], ['moduller', 'arama', 'gelen-arama.js'], ['moduller', 'sohbetler', 'index.js'], ['moduller', 'kesfet', 'index.js']]) {
      const d = join(kaynak, ...yol);
      if (existsSync(d) && !/yzEtiketi\(\)/.test(oku(d))) h.push(`${yol.join('/')}: yapay zekâ etiketi yok`);
    }
    if (!/export function yzEtiketi[\s\S]{0,200}t\('ortak\.yz'\)/.test(oku(join(kaynak, 'cekirdek', 'arayuz.js')))) h.push('arayuz.js: yzEtiketi() ortak.yz metnini kullanmıyor');
    ekle('Y26', 'Yapay zekâ içerikleri her zaman "yapay zekâ" etiketi taşır', h);
  }
  ekle('Y27', '18 yaş altı hesaplar yetişkinlerle eşleşmez', [], 'topluluk modülüyle (Evre 3) robota eklenecek');
  ekle('Y28', 'Her kullanıcı içeriğinde şikâyet ve engelleme var', [], 'topluluk modülüyle (Evre 3) robota eklenecek');
  return sonuclar;
}

function raporla(sonuclar, baslik) {
  console.log(`\n${baslik}`);
  console.log('─'.repeat(64));
  let hataSayisi = 0;
  for (const s of sonuclar) {
    const isaret = s.not ? '•' : s.hatalar.length ? '✗' : '✓';
    console.log(`${isaret} ${s.no.padEnd(5)} ${s.ad}${s.not ? `  (${s.not})` : ''}`);
    for (const x of s.hatalar.slice(0, 12)) console.log(`        ${x}`);
    if (s.hatalar.length > 12) console.log(`        … ve ${s.hatalar.length - 12} tane daha`);
    hataSayisi += s.hatalar.length;
  }
  console.log('─'.repeat(64));
  return hataSayisi;
}

// ---------- çalıştır ----------
if (argumanlar.includes('--kendini-sina')) {
  const ornek = join(KOK, 'araclar', 'ornek-ihlal');
  const sonuc = denetle(ornek, { tam: false });
  raporla(sonuc, 'Robot kendini sınıyor: örnek-ihlal klasörü (bilerek kurallara aykırı)');
  const beklenen = ['Y1', 'Y3', 'Y4', 'Y5', 'Y6', 'Y9', 'Y12', 'Y16'];
  const yakalanmayan = beklenen.filter((no) => !sonuc.find((s) => s.no === no).hatalar.length);
  if (yakalanmayan.length) {
    console.log(`\n✗ Robot şu bilerek konmuş ihlalleri YAKALAYAMADI: ${yakalanmayan.join(', ')}`);
    process.exit(1);
  }
  console.log(`\n✓ Robot bilerek konmuş ${beklenen.length} ihlalin hepsini yakaladı (${beklenen.join(', ')}).`);
  process.exit(0);
}

if (argumanlar.includes('--dagitim')) {
  const dist = join(KOK, 'dist');
  const sirRe = /(sk-ant-[\w-]{10,}|sk-[A-Za-z0-9]{32,}|AIza[0-9A-Za-z_-]{30,}|-----BEGIN [A-Z ]*PRIVATE KEY)/;
  const bulunan = dosyalar(dist, ['.html', '.js']).filter((d) => sirRe.test(oku(d)));
  const n = raporla([{ no: 'Y8', ad: 'Derlenmiş çıktıda anahtar/sır yok', hatalar: bulunan.map((d) => relative(KOK, d)) }], 'Yasa denetçisi: dağıtım çıktısı');
  process.exit(n ? 1 : 0);
}

const kaynak = join(KOK, 'kaynak');
const sonuclar = await asenkronDenetimler(kaynak, denetle(kaynak));
const n = raporla(sonuclar, 'Yasa denetçisi: kaynak/');
if (n) {
  console.log(`\n✗ ${n} ihlal bulundu. Derleme durduruldu.\n`);
  process.exit(1);
}
console.log('\n✓ Tüm yasalar sağlanıyor.\n');
