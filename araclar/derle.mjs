// Derleyici: kaynak/ klasöründeki modülleri tek bir HTML dosyasında birleştirir. Bağımlılık gerektirmez.
//
// Kaynak yazım kuralları (KURALLAR.md):
//  - import satırları tek satırdır ve satır başında durur:  import a from './a.js';  import { b, c as d } from './x.js';  import './stil.css';
//  - export satır başında durur: export default ..., export function ad(, export const ad =, export class Ad, export { a, b };
//  - Döngüsel import yasaktır (derleyici durdurur).
//
// Çıktılar: dist/index.html (Vercel), dist/ altında genel/ dosyaları, teslim/KonusmaKocu-v<SURUM>.html (Chrome'da tek dosya)

import { readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const KAYNAK = join(KOK, 'kaynak');
const DAGITIM = join(KOK, 'dist');
const TESLIM = join(KOK, 'teslim');

const IMPORT_RE = /^import\s+(?:(.+?)\s+from\s+)?['"]([^'"]+)['"];?\s*$/;
const EXPORT_DEFAULT_RE = /^export default\s+/;
const EXPORT_BILDIRIM_RE = /^export\s+((?:async\s+)?function\*?|const|let|var|class)\s+([A-Za-z_$][\w$]*)/;
const EXPORT_LISTE_RE = /^export\s*\{([^}]*)\}\s*(?:from\s+['"]([^'"]+)['"])?;?\s*$/;

function hata(mesaj) {
  console.error('\n[derle] HATA: ' + mesaj + '\n');
  process.exit(1);
}

function kimlik(dosya) {
  return relative(KAYNAK, dosya).split('\\').join('/');
}

function coz(kimden, yol) {
  if (!yol.startsWith('.')) hata(`yalnız göreli yollar desteklenir: "${yol}" (${kimlik(kimden)})`);
  const tam = resolve(dirname(kimden), yol);
  if (!existsSync(tam)) hata(`bulunamadı: "${yol}" (${kimlik(kimden)})`);
  return tam;
}

const moduller = new Map(); // kimlik -> kod
const cssSirasi = [];
const ziyaret = new Set();
const yigin = [];

function isle(dosya) {
  const id = kimlik(dosya);
  if (moduller.has(id)) return;
  if (ziyaret.has(id)) hata(`döngüsel import: ${[...yigin, id].join(' -> ')}`);
  ziyaret.add(id);
  yigin.push(id);

  const satirlar = readFileSync(dosya, 'utf8').split('\n');
  const disari = [];
  const cikti = satirlar.map((satir, no) => {
    const im = satir.match(IMPORT_RE);
    if (im) {
      const [, ifade, yol] = im;
      const hedef = coz(dosya, yol);
      if (yol.endsWith('.css')) {
        const cid = kimlik(hedef);
        if (!cssSirasi.includes(cid)) cssSirasi.push(cid);
        return '';
      }
      isle(hedef);
      const hid = JSON.stringify(kimlik(hedef));
      if (!ifade) return `__gerekli(${hid});`;
      const parcalar = [];
      let kalan = ifade.trim();
      const ns = kalan.match(/^\*\s+as\s+([\w$]+)$/);
      if (ns) return `const ${ns[1]} = __gerekli(${hid});`;
      const suslu = kalan.match(/\{([^}]*)\}/);
      const varsayilan = kalan.replace(/\{[^}]*\}/, '').replace(/,/g, '').trim();
      if (varsayilan) parcalar.push(`const ${varsayilan} = __gerekli(${hid}).default;`);
      if (suslu) {
        const adlar = suslu[1].split(',').map((s) => s.trim()).filter(Boolean)
          .map((s) => { const [a, b] = s.split(/\s+as\s+/); return b ? `${a}: ${b}` : a; });
        parcalar.push(`const { ${adlar.join(', ')} } = __gerekli(${hid});`);
      }
      return parcalar.join(' ');
    }
    if (EXPORT_DEFAULT_RE.test(satir)) return satir.replace(EXPORT_DEFAULT_RE, '__m.default = ');
    const eb = satir.match(EXPORT_BILDIRIM_RE);
    if (eb) { disari.push([eb[2], eb[2]]); return satir.replace(/^export\s+/, ''); }
    const el = satir.match(EXPORT_LISTE_RE);
    if (el) {
      const adlar = el[1].split(',').map((s) => s.trim()).filter(Boolean).map((s) => { const [a, b] = s.split(/\s+as\s+/); return [a, b || a]; });
      if (el[2]) {
        const hedef = coz(dosya, el[2]);
        isle(hedef);
        return adlar.map(([a, b]) => `__m.${b} = __gerekli(${JSON.stringify(kimlik(hedef))}).${a};`).join(' ');
      }
      for (const [a, b] of adlar) disari.push([a, b]);
      return '';
    }
    if (/^\s*(import|export)\s/.test(satir) && !/^\s*\/\//.test(satir)) {
      hata(`desteklenmeyen import/export biçimi: ${id}:${no + 1}\n  ${satir.trim()}`);
    }
    return satir;
  });

  const govde = cikti.join('\n') + '\n' + disari.map(([a, b]) => `__m.${b} = ${a};`).join('\n');
  moduller.set(id, govde);
  yigin.pop();
}

isle(join(KAYNAK, 'main.js'));

const betik = [
  '(function () {',
  '"use strict";',
  'var __tanim = {}; var __onbellek = {};',
  'function __gerekli(id) { if (__onbellek[id]) return __onbellek[id]; var m = {}; __onbellek[id] = m; __tanim[id](m, __gerekli); return m; }',
  ...[...moduller.entries()].map(([id, kod]) => `__tanim[${JSON.stringify(id)}] = function (__m, __gerekli) {\n${kod}\n};`),
  '__gerekli("main.js");',
  '})();',
].join('\n').replace(/<\/script/gi, '<\\/script');

const stil = cssSirasi.map((id) => `/* ${id} */\n` + readFileSync(join(KAYNAK, id), 'utf8')).join('\n');
const sablon = readFileSync(join(KAYNAK, 'index.html'), 'utf8');
const html = sablon
  .replace('/*@@STIL@@*/', () => stil)
  .replace('/*@@BETIK@@*/', () => betik);

const surum = readFileSync(join(KAYNAK, 'cekirdek', 'surum.js'), 'utf8').match(/SURUM = '([^']+)'/)[1];

mkdirSync(DAGITIM, { recursive: true });
mkdirSync(TESLIM, { recursive: true });
writeFileSync(join(DAGITIM, 'index.html'), html);
const genel = join(KOK, 'genel');
if (existsSync(genel)) {
  for (const ad of readdirSync(genel)) {
    if (statSync(join(genel, ad)).isFile()) copyFileSync(join(genel, ad), join(DAGITIM, ad));
  }
}
const tekDosya = join(TESLIM, `KonusmaKocu-v${surum}.html`);
// Tek dosya sürümünde yanında dosya olmadığı için manifest çıkarılır, simge dosyanın içine gömülür.
const simge = existsSync(join(genel, 'simge.svg')) ? readFileSync(join(genel, 'simge.svg'), 'utf8') : '';
const tekDosyaHtml = html
  .replace(/<link rel="manifest"[^>]*>\n?/, '')
  .replace(/<link rel="icon"[^>]*>/, simge ? `<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(simge)}">` : '');
writeFileSync(tekDosya, tekDosyaHtml);

console.log(`[derle] ${moduller.size} JS modülü, ${cssSirasi.length} stil dosyası birleştirildi.`);
console.log(`[derle] dist/index.html  ${(html.length / 1024).toFixed(1)} KB`);
console.log(`[derle] ${posix.join('teslim', `KonusmaKocu-v${surum}.html`)}  (Chrome'da çift tıklayıp açılır)`);
