// Senaryo şablonu: Anayasa bölüm 5. Zorunlu alanlar robot tarafından denetlenir (Y17).
export default {
  kimlik: 'alisveris-kafe-01',
  alan: 'alisveris',
  seviye: 'A2',
  baslik: { tr: 'Kafede sipariş', en: 'Ordering at a café' },
  durum: { tr: 'Bir kafedesin; kendine içecek ve atıştırmalık sipariş ediyorsun.', en: 'You are at a café, ordering a drink and a snack.' },
  roller: { koc: { tr: 'Barista', en: 'Barista' }, aksan: 'Amerikan' },
  gorev: { aciklama: { tr: 'Bir içecek sipariş et, boyutunu söyle ve ödemeyi yap.', en: 'Order a drink, say the size and pay.' }, kelimeler: ['coffee', 'latte', 'tea', 'cappuccino', 'americano', 'tea', 'water', 'juice'] },
  hedefKaliplar: [
    { kalip: 'I’d like a ..., please.', anahtar: 'I\u2019d like' },
    { kalip: 'Can I have a ...?', anahtar: 'Can I have' },
    { kalip: 'How much is it?', anahtar: 'How much' },
  ],
  anahtarKelimeler: [
    { en: 'latte', tr: 'sütlü kahve' }, { en: 'small', tr: 'küçük' }, { en: 'large', tr: 'büyük' },
    { en: 'to go', tr: 'paket / götürmek üzere' }, { en: 'for here', tr: 'burada' }, { en: 'card', tr: 'kart' },
    { en: 'receipt', tr: 'fiş' }, { en: 'sugar', tr: 'şeker' },
  ],
  acilis: {
    koc: 'Hi there! Welcome to Bean Corner. What can I get for you today?',
    ipucu: ['I’d like a latte, please.', 'Can I have a cappuccino?'],
    dallar: [
      { kelimeler: ['latte', 'cappuccino', 'americano', 'coffee'], koc: 'Great choice.' },
      { kelimeler: ['tea'], koc: 'Tea, lovely.' },
    ],
  },
  adimlar: [
    {
      koc: 'What size would you like? Small, medium or large?',
      ipucu: ['A small one, please.', 'Large, please.'],
      dallar: [{ kelimeler: ['large', 'big'], koc: 'A large one, perfect for a long day.' }, { kelimeler: ['small'], koc: 'A small one, sure.' }],
    },
    {
      koc: 'Is that for here or to go?',
      ipucu: ['For here, please.', 'To go, please.'],
      dallar: [{ kelimeler: ['go'], koc: 'To go, okay. I’ll put a lid on it.' }, { kelimeler: ['here'], koc: 'For here, great. Find a nice table.' }],
    },
    {
      koc: 'Would you like anything else? We have fresh muffins today.',
      ipucu: ['No, thank you.', 'Yes, can I have a muffin?'],
      dallar: [{ kelimeler: ['muffin', 'yes'], koc: 'A muffin, good idea. They’re still warm.' }, { kelimeler: ['no', 'nothing'], koc: 'No problem.' }],
    },
    {
      koc: 'That’s six dollars fifty. Cash or card?',
      ipucu: ['Card, please.', 'How much is it again?'],
      dallar: [{ kelimeler: ['card'], koc: 'Card is fine. Just tap here.' }, { kelimeler: ['cash'], koc: 'Cash, sure. Here’s your change.' }],
    },
  ],
  ustAdim: {
    koc: 'Oh, I’m sorry, we just ran out of oat milk. Is regular milk okay, or would you like something else?',
    ipucu: ['Regular milk is fine.', 'Could I have almond milk instead?'],
  },
  sapmalar: [],
  seviyeVaryasyonlari: {
    alt: 'Koç kısa ve evet/hayır cevaplanabilir sorular sorar.',
    ust: 'Koç beklenmedik bir aksilik çıkarır (süt bitti) ve kullanıcıdan alternatif ister.',
  },
  kapanis: 'Here you go! Have a wonderful day.',
  karneOdagi: ['how-much', 'want-to', 'can-to'],
  kulturelNot: { tr: 'ABD\u2019de kafelerde bahşiş kutusu ya da ödeme ekranında bahşiş seçeneği sık görülür; zorunlu değildir.', en: 'In US cafés you often see a tip jar or a tip option on the payment screen; tipping is not required.' },
};
