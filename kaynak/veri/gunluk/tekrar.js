// Hata tekrarı oturumu: adımlar Hata Hafızası'ndaki vadesi gelen öğelerden oluşturulur.
export default {
  kimlik: 'gunluk-tekrar',
  alan: 'gunluk',
  seviye: 'tum',
  baslik: { tr: 'Hata tekrarı', en: 'Error Memory practice' },
  durum: 'Koç, Hata Hafızası’ndaki öğeleri yeni sorular içinde tekrar kullandırır.',
  roller: { koc: 'Koç', aksan: 'Amerikan' },
  gorev: { aciklama: 'Her soruda öğeyi doğru biçimde kullan.', kelimeler: [] },
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
