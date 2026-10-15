// Hata tekrarı oturumu: adımlar Hata Hafızası'ndaki vadesi gelen öğelerden oluşturulur.
export default {
  kimlik: 'gunluk-tekrar',
  alan: 'gunluk',
  seviye: 'tum',
  baslik: { tr: 'Hata tekrarı', en: 'Error Memory practice' },
  durum: { tr: 'Koç, Hata Hafızası\u2019ndaki öğeleri yeni sorular içinde tekrar kullandırır.', en: 'The coach has the user reuse Error Memory items in new questions.' },
  roller: { koc: { tr: 'Koç', en: 'Coach' }, aksan: 'Amerikan' },
  gorev: { aciklama: { tr: 'Her soruda öğeyi doğru biçimde kullan.', en: 'Use each item correctly in your answer.' }, kelimeler: [] },
  hedefKaliplar: [],
  anahtarKelimeler: [],
  acilis: {
    koc: 'Hi {ad}! Let’s practise a few things from your Error Memory. Ready?',
    ipucu: ['Yes, I’m ready.'],
    dallar: [{ kelimeler: ['yes', 'ready', 'ok', 'okay', 'sure'], koc: 'Great, here we go.' }],
  },
  adimlar: [],
  sapmalar: [],
  seviyeVaryasyonlari: { alt: 'Sorular kısa tutulur.', ust: 'Takip sorusu eklenir.' },
  kapanis: 'Well done, {ad}! These will come back in a few days, so you never forget them.',
  karneOdagi: [],
  kulturelNot: null,
};
