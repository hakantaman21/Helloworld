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
