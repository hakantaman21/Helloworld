// Senaryo şablonu: Anayasa bölüm 5. v0.20.0'da eklendi (B1).
export default {
  kimlik: "alisveris-iade-b1-01",
  alan: "alisveris",
  seviye: "B1",
  baslik: {"tr": "Ürün iadesi", "en": "Returning an item"},
  durum: {"tr": "Geçen hafta aldığın kulaklık bozuk çıktı; mağazaya geri götürdün.", "en": "The headphones you bought last week are faulty; you take them back to the shop."},
  roller: { koc: {"tr": "Mağaza çalışanı", "en": "Shop assistant"}, aksan: "İngiliz" },
  gorev: { aciklama: {"tr": "Sorunu anlat, ne zaman aldığını söyle ve para iadesi ya da değişim iste.", "en": "Explain the problem, say when you bought it and ask for a refund or an exchange."}, kelimeler: ["receipt", "refund", "exchange", "broken", "bought", "work"] },
  hedefKaliplar: [{"kalip": "I bought this ... ago.", "anahtar": "I bought"}, {"kalip": "It doesn't work properly.", "anahtar": "doesn't work"}, {"kalip": "Would it be possible to ...?", "anahtar": "Would it be possible"}],
  anahtarKelimeler: [{"en": "receipt", "tr": "fiş"}, {"en": "refund", "tr": "para iadesi"}, {"en": "exchange", "tr": "değişim"}, {"en": "faulty", "tr": "kusurlu"}, {"en": "warranty", "tr": "garanti"}, {"en": "store credit", "tr": "mağaza kredisi"}],
  acilis: { koc: "Hi there, how can I help you today?", ipucu: ["I bought these headphones last week, but they don't work properly.", "I'd like to return this, please."], dallar: [{"kelimeler": ["work", "broken", "problem"], "koc": "Oh, I'm sorry to hear that."}, {"kelimeler": ["return"], "koc": "Sure, let's have a look."}] },
  adimlar: [
    { koc: "What exactly is the problem with them?", ipucu: ["The left side stopped working after two days.", "The sound keeps cutting out."], dallar: [{"kelimeler": ["left", "side", "stopped"], "koc": "That sounds like a fault."}, {"kelimeler": ["sound", "cutting"], "koc": "I see, that shouldn't happen."}] },
    { koc: "Do you have the receipt with you?", ipucu: ["Yes, here it is.", "I paid by card, so I have it on my phone."], dallar: [{"kelimeler": ["here", "yes"], "koc": "Perfect, thank you."}, {"kelimeler": ["card", "phone"], "koc": "That's fine, I can find it."}] },
    { koc: "Would you prefer a refund or an exchange?", ipucu: ["I'd prefer a refund, please.", "Could I exchange them for a different model?"], dallar: [{"kelimeler": ["refund"], "koc": "No problem, I'll refund it to your card."}, {"kelimeler": ["exchange", "model", "different"], "koc": "Of course, let me show you some options."}] },
  ],
  ustAdim: { koc: "I'm afraid we can only offer store credit, because the box is damaged. What do you think?", ipucu: ["The box was already damaged when I bought it.", "I understand, but could I speak to the manager, please?"] },
  sapmalar: [],
  seviyeVaryasyonlari: { alt: "Çalışan kısa sorular sorar ve hemen iade eder.", ust: "Çalışan yalnız mağaza kredisi önerir; kullanıcı kibarca itiraz eder." },
  kapanis: "All done. Sorry again for the trouble, and have a nice day!",
  karneOdagi: ["gecmis-zaman", "did-yalin", "want-to"],
  kulturelNot: {"tr": "İngiltere'de kusurlu ürünlerde fiş varsa genellikle 30 gün içinde tam para iadesi istenebilir.", "en": "In the UK you can usually ask for a full refund for faulty goods within 30 days if you have proof of purchase."},
};
