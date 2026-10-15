export default {
  kimlik: 'alisveris-market-01',
  alan: 'alisveris',
  seviye: 'A1',
  baslik: { tr: 'Markette ürün aramak', en: 'Finding things at the supermarket' },
  durum: 'Süpermarkettesin; aradığın ürünü bulamıyorsun ve bir görevliye soruyorsun.',
  roller: { koc: 'Market görevlisi', aksan: 'İngiliz' },
  gorev: { aciklama: 'Aradığın ürünün nerede olduğunu sor ve teşekkür et.', kelimeler: ['where', 'milk', 'bread', 'eggs', 'cheese', 'apples', 'water'] },
  hedefKaliplar: [
    { kalip: 'Excuse me, where is the ...?', anahtar: 'Where is' },
    { kalip: 'Do you have ...?', anahtar: 'Do you have' },
    { kalip: 'Thank you very much.', anahtar: 'Thank you' },
  ],
  anahtarKelimeler: [
    { en: 'aisle', tr: 'reyon / koridor' }, { en: 'milk', tr: 'süt' }, { en: 'bread', tr: 'ekmek' },
    { en: 'eggs', tr: 'yumurta' }, { en: 'bag', tr: 'poşet' }, { en: 'checkout', tr: 'kasa' },
  ],
  acilis: {
    koc: 'Hello! Can I help you find something?',
    ipucu: ['Yes, please. Where is the milk?', 'Do you have eggs?'],
    dallar: [
      { kelimeler: ['milk'], koc: 'The milk is in aisle three, next to the cheese.' },
      { kelimeler: ['bread'], koc: 'The bread is at the back of the shop, near the bakery.' },
      { kelimeler: ['egg', 'eggs'], koc: 'Eggs are in aisle two, on the bottom shelf.' },
    ],
  },
  adimlar: [
    {
      koc: 'Do you need anything else?',
      ipucu: ['Yes. Where is the water?', 'No, thank you.'],
      dallar: [{ kelimeler: ['water'], koc: 'Water is near the door.' }, { kelimeler: ['no'], koc: 'Okay!' }],
    },
    {
      koc: 'Would you like a bag at the checkout?',
      ipucu: ['Yes, please.', 'No, thanks. I have a bag.'],
      dallar: [{ kelimeler: ['yes'], koc: 'Sure, bags are ten pence.' }, { kelimeler: ['no', 'have'], koc: 'Great, that’s good for the planet.' }],
    },
  ],
  ustAdim: {
    koc: 'Sorry, we don’t have any fresh bread today. Would you like to try the sliced bread instead?',
    ipucu: ['Yes, that’s fine.', 'No, thanks. I’ll come back tomorrow.'],
  },
  sapmalar: [],
  seviyeVaryasyonlari: {
    alt: 'Koç tek ürün sorar ve cevabı kısa tutar.',
    ust: 'Ürün tükenmiştir; kullanıcı alternatif konuşur.',
  },
  kapanis: 'You’re welcome. Have a nice day!',
  karneOdagi: ['people-are', 'can-to'],
  kulturelNot: 'İngiltere’de marketlerde poşet ücretlidir; kendi çantanı getirmek yaygındır.',
};
