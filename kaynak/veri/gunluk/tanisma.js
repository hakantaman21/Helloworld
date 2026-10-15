// Tanışma: ilk açılıştaki 1 dakikalık sohbet. Seviye bu sohbetten tahmin edilir.
export default {
  kimlik: 'gunluk-tanisma',
  alan: 'gunluk',
  seviye: 'tum',
  baslik: { tr: 'Tanışma', en: 'Getting to know you' },
  durum: 'Koç kendini tanıtır ve kullanıcıyı tanımaya çalışır.',
  roller: { koc: 'Koç', aksan: 'Amerikan' },
  gorev: { aciklama: 'Kendini birkaç cümleyle tanıt.', kelimeler: ['i am', 'i’m', 'im', 'my name', 'i live', 'i work', 'i like'] },
  hedefKaliplar: [
    { kalip: 'I’m from ...', anahtar: 'I\u2019m from' },
    { kalip: 'I work as a ... / I’m a student.', anahtar: 'I work' },
    { kalip: 'In my free time, I like ...', anahtar: 'I like' },
  ],
  anahtarKelimeler: [
    { en: 'hometown', tr: 'memleket' }, { en: 'job', tr: 'iş' }, { en: 'hobby', tr: 'hobi' },
  ],
  acilis: {
    koc: 'Hi {ad}! I’m your English coach. Nice to meet you. Where are you from?',
    ipucu: ['I’m from Istanbul.', 'I live in Ankara.'],
    dallar: [{ kelimeler: ['from', 'live'], koc: 'Oh, nice!' }],
  },
  adimlar: [
    {
      koc: 'What do you do? Do you work or study?',
      ipucu: ['I work as a nurse.', 'I’m a student.'],
      dallar: [{ kelimeler: ['work', 'job'], koc: 'Interesting.' }, { kelimeler: ['student', 'study', 'school', 'university'], koc: 'A student, great.' }],
    },
    {
      koc: 'And what do you like to do in your free time?',
      ipucu: ['I like reading.', 'In my free time, I like walking and cooking.'],
      dallar: [],
    },
  ],
  sapmalar: [],
  seviyeVaryasyonlari: {
    alt: 'Koç çok kısa sorular sorar.',
    ust: 'Koç takip soruları sorar.',
  },
  kapanis: 'Thank you, {ad}. I already know you a little better. We’ll talk every day!',
  karneOdagi: ['meslek-a', 'ucuncu-tekil'],
  kulturelNot: null,
};
