# Konuşma Koçu — Geliştirici Kuralları

Bu dosya, projede çalışan herkes içindir: insan, Claude (hangi hesaptan olursa olsun), Grok ya da başka bir yapay zekâ.
Kuralların tamamı ve gerekçeleri **Konuşma Koçu — Anayasa** belgesindedir. Burada özetlenen yasaları test robotu
her derlemede denetler; çiğnenen yasa varsa derleme durur.

## Çalışma düzeni

1. Yalnız istenen değişiklik yapılır (Y11). Fırsattan istifade ek düzenleme yapılmaz.
2. Her teslimde iki sürüm birlikte verilir: Chrome'da açılan tek dosya (`teslim/`) ve Vercel'e giden proje.
3. Önce Chrome'da denenir; "okey" gelmeden GitHub'a gönderilmez.
4. Her teslimde sürüm bir artar: `kaynak/cekirdek/surum.js`, `package.json`, `DEGISIKLIKLER.md` (Y10).
5. Bir sürüm reddedilirse atılır; istekler önceki sürüm üzerinden yeniden yapılır.
6. Oturum biterken devir notu yazılır (README.md içindeki "Devir notu" bölümü güncellenir).

## Komutlar

| Komut | Ne yapar |
| --- | --- |
| `npm run derle` | Robotu çalıştırır, sonra tek dosya ve `dist/` üretir |
| `npm run denetle` | Yalnız robotu çalıştırır |
| `npm run robot-sinama` | Robotun bilerek konmuş ihlalleri yakaladığını kanıtlar |

Paket kurulumu gerekmez; yalnız Node.js yeterlidir.

## Yasalar (özet)

| No | Yasa |
| --- | --- |
| Y1 | `!important` yasak |
| Y2 | Her CSS dosyası `@layer` içinde yazılır; sıra `katmanlar.css`'te ilan edilir |
| Y3 | Renk değerleri yalnız `jetonlar.css` ve `tema-koyu.css`'te; başka yerde `var(--renk-…)` |
| Y4 | Modül stil sınıfları modülün önekiyle başlar (`bgn-`, `ara-`, `krn-`…); ortak bileşenler `b-` |
| Y5 | `z-index` yalnız `var(--z-…)` ölçeğinden |
| Y6 | Modüller birbirini import etmez; yalnız `cekirdek/` ve `veri/` kullanılır; döngüsel import yok |
| Y7 | Depo şeması değişince `gocler.js`'e yeni göç eklenir, `GUNCEL_SEMA` bir artar |
| Y8 | Hiçbir anahtar/sır istemci koduna yazılmaz |
| Y9 | Ağ ve AI çağrıları yalnız `cekirdek/ai/` içinden |
| Y10 | Sürüm üç yerde aynı |
| Y11 | İstenmeyen değişiklik yok (insan denetimi) |
| Y12 | Ses kaydı saklanmaz (`MediaRecorder` yasak) |
| Y13 | Dokunma alanı en az 48 piksel |
| Y14 | Metin kontrastı WCAG AA, açık ve koyu temada |
| Y15 | Renk tek başına anlam taşımaz |
| Y16 | Arayüz metni koda yazılmaz; `metinler/tr.js` + `t('anahtar')` |
| Y17 | Senaryolar şablonun zorunlu alanlarını doldurur |
| Y18 | Her ekran `ekran({ durumlar: DORT_DURUM, … })` ile tanımlanır |
| Y19 | Görüşme ekranında düzeltme gösterilmez |
| Y20 | Uygulama kendiliğinden günde en fazla iki bildirim |
| Y21 | Gezinme yalnız yönlendiriciden (`b.git`, `b.geri`) |
| Y22 | Mikrofon izni yalnız `izin.js` üzerinden, gerekçe ekranıyla |
| Y23 | Animasyonlar "hareketi azalt" ayarına uyar |

## Kod yazım kuralları (derleyici bunlara güvenir)

- `import` ve `export` satırları **satır başında ve tek satırda** yazılır.
  - `import a from './a.js';` · `import { b, c as d } from './x.js';` · `import './stil.css';`
  - `export default …` · `export function ad(` · `export const ad =` · `export { a, b };`
- `export let` ile dışarı verilen bir değer sonradan değiştirilmez (canlı bağ yoktur).
- Regex içinde tırnak işareti gerekiyorsa `\x27` kullanılır (robotun metin taraması karışmasın).
- Yeni bir ekran: `moduller/<ad>/index.js` + `<ad>.css`, `main.js`'teki listeye bir satır.
- Yeni bir senaryo: `veri/senaryolar/<kimlik>.js` + `veri/senaryolar/index.js`'e bir satır. Kod değişmez.
- Yeni bir arayüz metni: önce `metinler/tr.js`'e anahtar, sonra kodda `t('anahtar')`.
