// Söz dizimi denetimi (v0.13.0): kaynak/ altındaki her .js dosyası `node --check` ile denetlenir.
// Paketleyici dosyaları ayrıştırmadığı için bir yazım hatası (ör. eksik parantez) tarayıcıya kadar ulaşabiliyordu.
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const kok = new URL('../kaynak/', import.meta.url).pathname;
const dosyalar = [];
(function gez(d) { for (const a of readdirSync(d)) { const y = join(d, a); if (statSync(y).isDirectory()) gez(y); else if (y.endsWith('.js')) dosyalar.push(y); } })(kok);
let hata = 0;
for (const d of dosyalar) {
  try { execFileSync(process.execPath, ['--check', d], { stdio: 'pipe' }); }
  catch (e) { hata += 1; console.error(`✗ ${d.replace(kok, 'kaynak/')}\n${String(e.stderr).split('\n').slice(0, 4).join('\n')}`); }
}
if (hata) { console.error(`\n✗ ${hata} dosyada söz dizimi hatası. Derleme durduruldu.`); process.exit(1); }
console.log(`✓ Söz dizimi: ${dosyalar.length} dosya temiz.`);

// v0.22.0 İçe/dışa aktarım uyumu: `import { a } from './x.js'` için x.js gerçekten `a`yı dışa veriyor mu?
// Paketleyici adları denetlemediği için eksik bir `export` tarayıcıda "… is not a function" olarak ortaya çıkıyordu.
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
const disari = (yol) => {
  const kod = readFileSync(yol, 'utf8');
  const adlar = new Set([...kod.matchAll(/^export\s+(?:async\s+)?(?:function\*?|const|let|var|class)\s+([\w$]+)/gm)].map((m) => m[1]));
  for (const [, liste] of kod.matchAll(/^export\s*\{([^}]*)\}/gm)) for (const x of liste.split(',')) { const a = x.trim().split(/\s+as\s+/).pop(); if (a) adlar.add(a); }
  if (/^export default/m.test(kod)) adlar.add('default');
  return adlar;
};
let uyumsuz = 0;
for (const d of dosyalar) {
  for (const [, ifade, yol] of readFileSync(d, 'utf8').matchAll(/^import\s+(.+?)\s+from\s+'([^']+\.js)';/gm)) {
    const hedef = resolve(dirname(d), yol);
    if (!existsSync(hedef)) { uyumsuz += 1; console.error(`✗ ${d.replace(kok, 'kaynak/')}: bulunamadı ${yol}`); continue; }
    const var_ = disari(hedef);
    const suslu = ifade.match(/\{([^}]*)\}/);
    for (const x of suslu ? suslu[1].split(',') : []) { const ad = x.trim().split(/\s+as\s+/)[0]; if (ad && !var_.has(ad)) { uyumsuz += 1; console.error(`✗ ${d.replace(kok, 'kaynak/')}: "${ad}" ${yol} içinde dışa verilmiyor`); } }
    const varsayilan = ifade.replace(/\{[^}]*\}/, '').replace(/,/g, '').trim();
    if (varsayilan && !varsayilan.startsWith('*') && !var_.has('default')) { uyumsuz += 1; console.error(`✗ ${d.replace(kok, 'kaynak/')}: ${yol} varsayılan dışa aktarım vermiyor`); }
  }
}
if (uyumsuz) { console.error(`\n✗ ${uyumsuz} içe aktarım karşılıksız. Derleme durduruldu.`); process.exit(1); }
console.log('✓ İçe/dışa aktarımlar uyumlu.');
