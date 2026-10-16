// Senaryo şablonu: Anayasa bölüm 5. Zorunlu alanlar robot tarafından denetlenir (Y17). v0.12.0'da eklendi.
export default {
  kimlik: "resmi-banka-01",
  alan: "resmi",
  seviye: "A2",
  baslik: {"tr": "Bankada hesap açma", "en": "Opening a bank account"},
  durum: {"tr": "Yeni taşındığın şehirde banka hesabı açmak istiyorsun.", "en": "You want to open a bank account in the city you just moved to."},
  roller: { koc: {"tr": "Banka görevlisi", "en": "Bank clerk"}, aksan: "İngiliz" },
  gorev: { aciklama: {"tr": "Hesap türünü söyle, gerekli belgeleri ve kartın ne zaman geleceğini sor.", "en": "Say what account you want, ask about documents and when the card will arrive."}, kelimeler: ["account", "passport", "address", "card", "online", "fee"] },
  hedefKaliplar: [{"kalip": "I would like to open ...", "anahtar": "open"}, {"kalip": "What documents do I need?", "anahtar": "documents"}, {"kalip": "When will my card arrive?", "anahtar": "When will"}],
  anahtarKelimeler: [{"en": "current account", "tr": "vadesiz hesap"}, {"en": "savings account", "tr": "birikim hesabı"}, {"en": "proof of address", "tr": "adres belgesi"}, {"en": "monthly fee", "tr": "aylık ücret"}, {"en": "debit card", "tr": "banka kartı"}, {"en": "online banking", "tr": "internet bankacılığı"}],
  acilis: { koc: "Good morning. How can I help you today?", ipucu: ["I would like to open a bank account.", "I want to open a current account."], dallar: [{"kelimeler": ["open", "account"], "koc": "Of course, I can help with that."}] },
  adimlar: [
    { koc: "Is it a current account or a savings account?", ipucu: ["A current account, please.", "What is the difference?"], dallar: [{"kelimeler": ["current"], "koc": "A current account, okay."}, {"kelimeler": ["difference"], "koc": "A current account is for everyday spending."}] },
    { koc: "Do you have your documents with you?", ipucu: ["What documents do I need?", "I have my passport."], dallar: [{"kelimeler": ["documents", "need"], "koc": "Your passport and a proof of address, like a bill."}, {"kelimeler": ["passport"], "koc": "Good, and a proof of address too."}] },
    { koc: "Is there anything else you would like to ask?", ipucu: ["When will my card arrive?", "Is there a monthly fee?"], dallar: [{"kelimeler": ["card", "arrive"], "koc": "In five to seven working days."}, {"kelimeler": ["fee", "monthly"], "koc": "No, this account is free."}] },
  ],
  ustAdim: { koc: "Your proof of address is older than three months, so I cannot accept it. What can you bring instead?", ipucu: ["I can bring a new bill tomorrow.", "Can I use my rental contract?"] },
  sapmalar: [],
  seviyeVaryasyonlari: { alt: "Görevli tek belge sorar, kısa ilerler.", ust: "Belge kabul edilmez; kullanıcı alternatif önerir." },
  kapanis: "All done. Welcome to the bank!",
  karneOdagi: ["want-to", "how-much", "ucuncu-tekil"],
  kulturelNot: {"tr": "İngiltere'de banka hesabı için genellikle son üç aya ait adres belgesi (fatura, kira sözleşmesi) istenir.", "en": "UK banks usually ask for proof of address from the last three months (a bill or tenancy agreement)."},
};
