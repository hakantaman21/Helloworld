// v0.16.0 Düzeltme motoru sınaması (derlemede çalışır). İki havuz:
//  - DOGRU: doğru cümleler. Motor bunlara DOKUNMAMALI (yanlış düzeltme, kaçırılan hatadan daha zararlıdır).
//  - YANLIS: [cümle, beklenen düzeltme].
// Yeni kural eklerken iki havuza da örnek ekle; bir doğru cümle değişirse derleme durur.
import { tumunuDuzelt } from '../kaynak/cekirdek/dil/duzeltme-motoru.js';

const DOGRU = [
  'I have not seen him since yesterday.', 'I work today although I was sick yesterday.', 'He is married with two kids.',
  'I live in London.', 'I am good at cooking.', 'I listen to music.', 'It depends on you.', 'The meeting is in the office.',
  'I will see you on Monday.', 'I was born in 1995.', 'She is interested in art.', 'I stayed in Monday Street.',
  'I went to the cinema yesterday.', 'I am 20 years old.', 'I have ten years of experience.', 'I need some information.',
  'I agree with you.', 'She works in a hospital.', 'We were tired last night.', 'I have just finished my homework.',
  'If it rains tomorrow, I stay at home.', 'My friend lives in Izmir.', 'Did you go there last week?',
  // v0.24.0 (ChatGPT/Grok/Gemini sınamaları sonrası)
  'I think he left yesterday.', 'Yesterday I went there but today I stay home.', 'I did my homework yesterday.',
  'I go to the gym and play tennis.', 'I hope you had a good time yesterday.',
];
const YANLIS = [
  ['I go to cafe yesterday.', 'I went to cafe yesterday.'],
  ['I have 20 years old.', 'I am 20 years old.'],
  ['I need some informations.', 'I need some information.'],
  ['I am agree with you.', 'I agree with you.'],
  ['She is good in English.', 'She is good at English.'],
  ['I listen music every day.', 'I listen to music every day.'],
  ['It depends of the weather.', 'It depends on the weather.'],
  ['See you in Monday.', 'See you on Monday.'],
  ['I was born on 1995.', 'I was born in 1995.'],
  ['We discussed about the plan.', 'We discussed the plan.'],
  // v0.24.0: did + özne + V2, düzenli fiil (arrive), ortak özne ve bağlaçla taşınan geçmiş zaman
  ['Did you went to school?', 'Did you go to school?'],
  ["Didn't your sister came yesterday?", "Didn't your sister come yesterday?"],
  ['We arrive to the airport yesterday.', 'We arrived at the airport yesterday.'],
  ['Yesterday I go to the market and buy bread.', 'Yesterday I went to the market and bought bread.'],
  ['Last week we visit Izmir, then stay at a hotel.', 'Last week we visited Izmir, then stayed at a hotel.'],
  ['Yesterday I go home and he go to work.', 'Yesterday I went home and he went to work.'],
];

// v0.24.0 İletişim bilgisi süzgeci: telefon/e-posta yakalanır; yıl, tarih, ondalık, sürüm ve tutar engellenmez.
import { iletisimBilgisiVar } from '../kaynak/cekirdek/topluluk-kurallari.js';
const ILETISIM_VAR = ['0532 123 45 67', '+90 532 123 4567', '05321234567', '(0212) 555 12 34', '0532.123.45.67', 'ali@ornek.com'];
const ILETISIM_YOK = ['2019-2024', '3.1415926535', '1.22.0.3456', '1995 2018', '17.10.2026', '2026-10-17', '1.250.000 TL', '12.50'];

let hata = 0;
for (const c of DOGRU) { const r = tumunuDuzelt(c); if (r !== c) { hata += 1; console.log(`✗ Doğru cümle değiştirildi: "${c}" → "${r}"`); } }
for (const m of ILETISIM_VAR) if (!iletisimBilgisiVar(m)) { hata += 1; console.log(`✗ İletişim bilgisi kaçtı: "${m}"`); }
for (const m of ILETISIM_YOK) if (iletisimBilgisiVar(m)) { hata += 1; console.log(`✗ Sayı yanlışlıkla iletişim sayıldı: "${m}"`); }
for (const [c, b] of YANLIS) { const r = tumunuDuzelt(c); if (r !== b) { hata += 1; console.log(`✗ Beklenen düzeltme yok: "${c}" → "${r}" (beklenen "${b}")`); } }
if (hata) { console.log(`✗ Düzeltme sınaması: ${hata} sorun.`); process.exit(1); }
console.log(`✓ Düzeltme sınaması: ${DOGRU.length} doğru cümleye dokunulmadı, ${YANLIS.length} hata düzeltildi.`);
