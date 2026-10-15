// Sabah araması: kullanıcı gününü İngilizce anlatır.
export default {
  kimlik: 'gunluk-sabah',
  alan: 'gunluk',
  seviye: 'tum',
  baslik: { tr: 'Sabah araması', en: 'Morning call' },
  durum: 'Koç sabah arar; kullanıcı gününü ve planlarını anlatır.',
  roller: { koc: 'Koç', aksan: 'Amerikan' },
  gorev: { aciklama: 'Bugün yapacağın en az iki şeyi söyle.', kelimeler: ['going to', 'will', 'plan', 'today', 'have to', 'want to'] },
  hedefKaliplar: [
    { kalip: 'Today I’m going to ...', anahtar: 'going to' },
    { kalip: 'First I have to ..., then ...', anahtar: 'have to' },
    { kalip: 'I want to ... this evening.', anahtar: 'want to' },
  ],
  anahtarKelimeler: [
    { en: 'meeting', tr: 'toplantı' }, { en: 'errand', tr: 'ayak işi' }, { en: 'busy', tr: 'meşgul' },
    { en: 'free time', tr: 'boş zaman' }, { en: 'plan', tr: 'plan' },
  ],
  acilis: {
    koc: 'Good morning, {ad}! How did you sleep?',
    ipucu: ['I slept well, thanks.', 'Not very well. I’m a bit tired.'],
    dallar: [
      { kelimeler: ['well', 'good', 'great', 'fine'], koc: 'Good to hear.' },
      { kelimeler: ['tired', 'bad', 'not'], koc: 'Oh, I’m sorry. Coffee might help!' },
    ],
  },
  adimlar: [
    {
      koc: 'So, what are you going to do today?',
      ipucu: ['Today I’m going to work.', 'First I have to go shopping, then I’m going to study.'],
      dallar: [{ kelimeler: ['work', 'office', 'meeting'], koc: 'A work day, then.' }, { kelimeler: ['study', 'school', 'class'], koc: 'Study time, nice.' }],
    },
    {
      koc: 'Sounds like a full day. What is the most important thing for you today?',
      ipucu: ['The most important thing is ...', 'I really need to finish ...'],
      dallar: [],
    },
    {
      koc: 'And what do you want to do this evening, just for you?',
      ipucu: ['I want to watch a film.', 'I want to relax and read a book.'],
      dallar: [{ kelimeler: ['film', 'movie', 'watch'], koc: 'A film sounds relaxing.' }, { kelimeler: ['read', 'book'], koc: 'Reading is a great way to end the day.' }],
    },
  ],
  sapmalar: [],
  seviyeVaryasyonlari: {
    alt: 'Koç tek bir planı sorar.',
    ust: 'Koç planlardaki olası bir aksiliği sorar.',
  },
  kapanis: 'Great talking to you, {ad}. Have a good day, and I’ll call you this evening!',
  karneOdagi: ['want-to', 'ucuncu-tekil'],
  kulturelNot: null,
};
