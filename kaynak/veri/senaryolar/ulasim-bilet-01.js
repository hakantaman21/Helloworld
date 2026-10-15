export default {
  kimlik: 'ulasim-bilet-01',
  alan: 'ulasim',
  seviye: 'A2',
  baslik: { tr: 'Tren bileti almak', en: 'Buying a train ticket' },
  durum: { tr: 'Tren istasyonundaki gişedesin; başka bir şehre bilet alıyorsun.', en: 'You are at the station ticket office, buying a ticket to another city.' },
  roller: { koc: { tr: 'Gişe görevlisi', en: 'Ticket clerk' }, aksan: 'İngiliz' },
  gorev: { aciklama: { tr: 'Gideceğin yeri ve saati söyle, bilet türünü seç ve peronu öğren.', en: 'Say where and when you want to go, choose the ticket type and find out the platform.' }, kelimeler: ['ticket', 'return', 'single', 'one-way', 'platform'] },
  hedefKaliplar: [
    { kalip: 'I’d like a return ticket to ..., please.', anahtar: 'ticket to' },
    { kalip: 'What time is the next train?', anahtar: 'What time' },
    { kalip: 'Which platform does it leave from?', anahtar: 'Which platform' },
  ],
  anahtarKelimeler: [
    { en: 'single', tr: 'tek yön' }, { en: 'return', tr: 'gidiş-dönüş' }, { en: 'platform', tr: 'peron' },
    { en: 'departure', tr: 'kalkış' }, { en: 'delay', tr: 'rötar' }, { en: 'change trains', tr: 'aktarma yapmak' },
  ],
  acilis: {
    koc: 'Good morning. Where would you like to go?',
    ipucu: ['I’d like a ticket to Oxford, please.', 'A ticket to Brighton, please.'],
    dallar: [{ kelimeler: ['ticket', 'to'], koc: 'Okay.' }],
  },
  adimlar: [
    {
      koc: 'Single or return?',
      ipucu: ['A return ticket, please.', 'Just single, please.'],
      dallar: [{ kelimeler: ['return'], koc: 'A return. When are you coming back?' }, { kelimeler: ['single', 'one'], koc: 'A single ticket.' }],
    },
    {
      koc: 'The next train leaves at ten fifteen. Is that okay?',
      ipucu: ['Yes, that’s perfect.', 'Is there an earlier train?'],
      dallar: [{ kelimeler: ['earlier'], koc: 'Sorry, ten fifteen is the earliest.' }, { kelimeler: ['yes', 'okay', 'ok', 'perfect'], koc: 'Great.' }],
    },
    {
      koc: 'That’s twenty-four pounds. Anything else I can help with?',
      ipucu: ['Which platform does it leave from?', 'Do I need to change trains?'],
      dallar: [{ kelimeler: ['platform'], koc: 'It leaves from platform four.' }, { kelimeler: ['change'], koc: 'No, it’s a direct train.' }],
    },
  ],
  ustAdim: {
    koc: 'I’m afraid the ten fifteen is delayed by twenty minutes. Do you still want this train?',
    ipucu: ['That’s okay, I’ll wait.', 'Is there another option?'],
  },
  sapmalar: [],
  seviyeVaryasyonlari: {
    alt: 'Görevli seçenekleri tek tek ve yavaş sorar.',
    ust: 'Tren rötarlıdır; kullanıcı karar verir.',
  },
  kapanis: 'Here’s your ticket. Have a nice journey!',
  karneOdagi: ['want-to', 'how-much'],
  kulturelNot: { tr: 'İngiltere’de “return” gidiş-dönüş, “single” tek yön demektir; ABD’de “round trip” ve “one-way” denir.', en: 'In the UK, “return” means a round trip and “single” means one-way; in the US people say “round trip” and “one-way”.' },
};
