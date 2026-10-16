// Koçun dili (Anayasa bölüm 5): sıcak, kısa cümleli, övgüsü belirli. Düzeltmeyi doğal tekrar (recast) ile yapar.
export default {
  dogalTekrar: ['Oh, {cumle}', 'Ah, I see. {cumle}', 'Right, {cumle}'],
  kalipOvgusu: 'You used “{kalip}” perfectly.',
  // v0.13.0: kural bir hata bulamadı diye cümle doğru sayılmaz; koç burada övmez, nötr onaylar (yanlış İngilizceyi övmemek için).
  genelOvgu: ['I see.', 'Okay.', 'Got it.', 'Thanks for telling me.'],
  anlamadim: {
    kelimeler: ['don’t understand', 'dont understand', 'do not understand', 'pardon', 'again', 'repeat', 'slowly'],
    koc: 'No problem. Let me say it again, more slowly.',
  },
  // v0.14.0 Sapma: kullanıcı kendi sorusunu sorarsa ya da konudan çıkarsa koç kabul eder, soruyu bir kez yineler.
  sapma: { soru: 'Good question! Let me come back to it in a minute.', konu: 'Interesting! Let\u2019s stay with our situation for a moment.' },
  bosCevap: 'Take your time. You can say just a few words.',
};
