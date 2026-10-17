// Senaryo şablonu: Anayasa bölüm 5. Zorunlu alanlar robot tarafından denetlenir (Y17). v0.16.0'da eklendi (B2).
export default {
  kimlik: "ulasim-ucus-b2-01",
  alan: "ulasim",
  seviye: "B2",
  baslik: {"tr": "İptal edilen uçuş için yeni rezervasyon", "en": "Rebooking a cancelled flight"},
  durum: {"tr": "Uçuşun iptal edildi ve yarın sabah önemli bir toplantın var. Havalimanı kontuarında seni bugün götürecek bir çözüm ve haklarını istemelisin.", "en": "Your flight was cancelled and you have an important meeting tomorrow morning. At the airport desk you need a solution that gets you there today and ask about your rights."},
  roller: { koc: {"tr": "Havayolu görevlisi", "en": "Airline agent"}, aksan: "İngiliz" },
  gorev: { aciklama: {"tr": "Durumunu açıkla, bugün için en az bir seçenek iste ve otel ya da tazminat hakkını sor.", "en": "Explain your situation, ask for at least one option for today and ask about hotel or compensation."}, kelimeler: ["today", "option", "connection", "compensation", "hotel", "voucher"] },
  hedefKaliplar: [{"kalip": "Is there any way I could ...?", "anahtar": "is there any way"}, {"kalip": "I would appreciate it if ...", "anahtar": "appreciate"}, {"kalip": "Am I entitled to ...?", "anahtar": "entitled"}],
  anahtarKelimeler: [{"en": "cancelled", "tr": "iptal edildi"}, {"en": "rebook", "tr": "yeniden rezervasyon yapmak"}, {"en": "connection", "tr": "aktarma"}, {"en": "compensation", "tr": "tazminat"}, {"en": "voucher", "tr": "kupon"}, {"en": "boarding pass", "tr": "biniş kartı"}, {"en": "delay", "tr": "rötar"}],
  acilis: { koc: "I’m sorry, the 6 pm flight to Manchester has been cancelled. How can I help you?", ipucu: ["I have a meeting at nine tomorrow, so I really need to get there tonight.", "Is there any way I could fly today?"], dallar: [{"kelimeler": ["tonight", "today", "meeting"], "koc": "I see, let me look at today’s options."}, {"kelimeler": ["any way", "fly"], "koc": "Let me check what we have."}] },
  adimlar: [
    { koc: "There is a flight via Amsterdam that lands at midnight. Would that work?", ipucu: ["Yes, that works. Is the connection time long enough?", "I would appreciate it if you could check the train as well."], dallar: [{"kelimeler": ["connection", "time", "long"], "koc": "You have an hour and ten minutes, which is fine."}, {"kelimeler": ["train", "appreciate", "check"], "koc": "There is a train at eight, but it takes four hours."}] },
    { koc: "Shall I book the Amsterdam option for you?", ipucu: ["Yes, please. Could you also print my new boarding pass?", "Yes, but could I get a seat near the front? I need to make the connection."], dallar: [{"kelimeler": ["boarding", "print"], "koc": "Of course, here you are."}, {"kelimeler": ["seat", "front"], "koc": "I’ll do my best."}] },
    { koc: "Is there anything else I can help you with?", ipucu: ["Am I entitled to any compensation for the cancellation?", "Could I get a meal voucher? I will wait for three hours."], dallar: [{"kelimeler": ["entitled", "compensation"], "koc": "You can claim on our website; here is the form."}, {"kelimeler": ["voucher", "meal"], "koc": "Yes, here is a voucher for fifteen pounds."}] },
  ],
  ustAdim: { koc: "The Amsterdam flight is now delayed too. What would you like to do?", ipucu: ["In that case, I would rather take the train tonight.", "Could you put me on the first flight tomorrow morning and give me a hotel?"] },
  sapmalar: [],
  seviyeVaryasyonlari: {"alt": "Görevli tek bir seçenek sunar; kullanıcı kabul eder ve teşekkür eder.", "ust": "Görevli tazminat konusunda belirsiz konuşur; kullanıcı haklarını net biçimde sorar."},
  kapanis: "You’re all set. Good luck with your meeting tomorrow.",
  karneOdagi: ["can-to", "want-to", "how-much"],
  kulturelNot: {"tr": "Avrupa'da kalkan uçuşlarda iptal ve uzun rötarlarda yolcuya yemek, gerekirse otel ve belirli koşullarda tazminat hakkı tanınır (AB/İngiltere yolcu hakları). Kibar ama net istemek beklenir.", "en": "For flights departing from Europe, passengers have rights to meals, a hotel if needed and, in some cases, compensation after cancellations or long delays (EU/UK passenger rights). Asking politely but clearly is expected."},
};
