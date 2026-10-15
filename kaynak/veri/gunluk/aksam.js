// Akşam araması: gün nasıl geçti. Hata Hafızası öğeleri kapanıştan önce sohbetin içine gizlenir.
export default {
  kimlik: 'gunluk-aksam',
  alan: 'gunluk',
  seviye: 'tum',
  baslik: { tr: 'Akşam araması', en: 'Evening call' },
  durum: { tr: 'Koç akşam arar; kullanıcı gününün nasıl geçtiğini geçmiş zamanla anlatır.', en: 'The coach calls in the evening; the user describes the day in the past tense.' },
  roller: { koc: { tr: 'Koç', en: 'Coach' }, aksan: 'Amerikan' },
  gorev: { aciklama: { tr: 'Bugün yaptığın en az iki şeyi geçmiş zamanla anlat.', en: 'Describe at least two things you did today, in the past tense.' }, kelimeler: ['went', 'had', 'did', 'was', 'were', 'worked', 'watched', 'ate', 'met'] },
  hedefKaliplar: [
    { kalip: 'Today I went to ...', anahtar: 'went' },
    { kalip: 'It was really ...', anahtar: 'It was' },
    { kalip: 'After that, I ...', anahtar: 'After that' },
  ],
  anahtarKelimeler: [
    { en: 'tired', tr: 'yorgun' }, { en: 'busy', tr: 'yoğun' }, { en: 'relaxing', tr: 'dinlendirici' },
    { en: 'after that', tr: 'ondan sonra' }, { en: 'finally', tr: 'sonunda' },
  ],
  acilis: {
    koc: 'Hi {ad}, it’s me again! How was your day?',
    ipucu: ['It was good, thanks.', 'It was a busy day.'],
    dallar: [
      { kelimeler: ['good', 'great', 'nice', 'fine'], koc: 'I’m glad to hear that.' },
      { kelimeler: ['busy', 'tired', 'bad', 'long'], koc: 'Sounds like a long day.' },
    ],
  },
  adimlar: [
    {
      koc: 'Tell me, what did you do today?',
      ipucu: ['Today I went to work.', 'I had a meeting, and after that I went shopping.'],
      dallar: [],
    },
    {
      koc: 'And what was the best part of your day?',
      ipucu: ['The best part was ...', 'I really enjoyed ...'],
      dallar: [],
    },
  ],
  sapmalar: [],
  seviyeVaryasyonlari: {
    alt: 'Koç tek bir olay sorar.',
    ust: 'Koç olayların sırasını ve nedenlerini sorar.',
  },
  kapanis: 'Thanks for sharing, {ad}. Sleep well, and talk to you tomorrow morning!',
  karneOdagi: ['gecmis-zaman', 'did-yalin'],
  kulturelNot: null,
};
