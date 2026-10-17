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
];

let hata = 0;
for (const c of DOGRU) { const r = tumunuDuzelt(c); if (r !== c) { hata += 1; console.log(`✗ Doğru cümle değiştirildi: "${c}" → "${r}"`); } }
for (const [c, b] of YANLIS) { const r = tumunuDuzelt(c); if (r !== b) { hata += 1; console.log(`✗ Beklenen düzeltme yok: "${c}" → "${r}" (beklenen "${b}")`); } }
if (hata) { console.log(`✗ Düzeltme sınaması: ${hata} sorun.`); process.exit(1); }
console.log(`✓ Düzeltme sınaması: ${DOGRU.length} doğru cümleye dokunulmadı, ${YANLIS.length} hata düzeltildi.`);
