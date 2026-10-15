export default {
  kimlik: 'ulasim-yol-01',
  alan: 'ulasim',
  seviye: 'A1',
  baslik: { tr: 'Yol sormak', en: 'Asking for directions' },
  durum: 'Yabancı bir şehirdesin ve tren istasyonuna nasıl gideceğini bir yerel halka soruyorsun.',
  roller: { koc: 'Yoldan geçen biri', aksan: 'İngiliz' },
  gorev: { aciklama: 'İstasyonun yolunu sor, tarifi anladığını göster ve teşekkür et.', kelimeler: ['station', 'where', 'left', 'right', 'straight'] },
  hedefKaliplar: [
    { kalip: 'Excuse me, how do I get to the ...?', anahtar: 'How do I get' },
    { kalip: 'Is it far from here?', anahtar: 'Is it far' },
    { kalip: 'So I turn left, and then ...?', anahtar: 'turn left' },
  ],
  anahtarKelimeler: [
    { en: 'station', tr: 'istasyon' }, { en: 'turn left', tr: 'sola dön' }, { en: 'turn right', tr: 'sağa dön' },
    { en: 'go straight', tr: 'düz git' }, { en: 'corner', tr: 'köşe' }, { en: 'far', tr: 'uzak' },
  ],
  acilis: {
    koc: 'Hi! You look a bit lost. Can I help you?',
    ipucu: ['Yes, please. How do I get to the station?', 'Where is the train station?'],
    dallar: [{ kelimeler: ['station', 'train'], koc: 'The train station? Sure.' }],
  },
  adimlar: [
    {
      koc: 'Go straight down this street, then turn left at the bank.',
      ipucu: ['So I go straight and turn left?', 'Is it far from here?'],
      dallar: [{ kelimeler: ['far'], koc: 'No, it’s not far. About five minutes on foot.' }, { kelimeler: ['left', 'straight'], koc: 'Yes, exactly.' }],
    },
    {
      koc: 'After the bank, the station is on your right. You can’t miss it.',
      ipucu: ['Thank you so much!', 'On my right. Got it, thanks.'],
      dallar: [{ kelimeler: ['thank', 'thanks'], koc: 'You’re very welcome.' }],
    },
  ],
  ustAdim: {
    koc: 'Oh wait, the main entrance is closed today because of repairs. You need to use the side door. Is that clear?',
    ipucu: ['So I use the side door?', 'Sorry, which door?'],
  },
  sapmalar: [],
  seviyeVaryasyonlari: {
    alt: 'Tarif tek adımlıdır ve yavaş söylenir.',
    ust: 'Ana giriş kapalıdır; kullanıcı yeni tarifi teyit eder.',
  },
  kapanis: 'Have a good trip!',
  karneOdagi: ['can-to', 'want-to'],
  kulturelNot: 'İngiltere’de yol sorarken “Excuse me” ile başlamak çok önemlidir; doğrudan soru kaba algılanabilir.',
};
