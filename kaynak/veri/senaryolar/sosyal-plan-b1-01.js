// Senaryo şablonu: Anayasa bölüm 5. v0.20.0'da eklendi (B1).
export default {
  kimlik: "sosyal-plan-b1-01",
  alan: "sosyal",
  seviye: "B1",
  baslik: {"tr": "Hafta sonu planı", "en": "Making weekend plans"},
  durum: {"tr": "Yeni tanıştığın bir arkadaşla hafta sonu için plan yapıyorsunuz.", "en": "You're making weekend plans with a friend you met recently."},
  roller: { koc: {"tr": "Arkadaş", "en": "Friend"}, aksan: "Avustralya" },
  gorev: { aciklama: {"tr": "Bir etkinlik öner, gün ve saati kararlaştır, nerede buluşacağınızı belirle.", "en": "Suggest an activity, agree on a day and time, and decide where to meet."}, kelimeler: ["saturday", "sunday", "free", "meet", "station", "o'clock"] },
  hedefKaliplar: [{"kalip": "Are you free on ...?", "anahtar": "Are you free"}, {"kalip": "Why don't we ...?", "anahtar": "Why don't we"}, {"kalip": "Let's meet at ...", "anahtar": "Let's meet"}],
  anahtarKelimeler: [{"en": "plan", "tr": "plan"}, {"en": "free", "tr": "boş, müsait"}, {"en": "meet up", "tr": "buluşmak"}, {"en": "exhibition", "tr": "sergi"}, {"en": "book tickets", "tr": "bilet ayırtmak"}, {"en": "rain check", "tr": "başka zamana erteleme"}],
  acilis: { koc: "Hey! Have you got any plans for the weekend?", ipucu: ["Not yet. Are you free on Saturday?", "No, why don't we do something together?"], dallar: [{"kelimeler": ["saturday", "free"], "koc": "Saturday works for me!"}, {"kelimeler": ["together", "something"], "koc": "I'd love that."}] },
  adimlar: [
    { koc: "What do you feel like doing?", ipucu: ["Why don't we go to the photography exhibition?", "How about a walk by the sea and then lunch?"], dallar: [{"kelimeler": ["exhibition", "photography"], "koc": "Ooh, I've heard it's great."}, {"kelimeler": ["walk", "sea", "lunch"], "koc": "Sounds lovely, if the weather's nice."}] },
    { koc: "What time suits you?", ipucu: ["Let's meet at eleven o'clock.", "Is two in the afternoon okay for you?"], dallar: [{"kelimeler": ["eleven", "o'clock"], "koc": "Eleven is perfect."}, {"kelimeler": ["two", "afternoon"], "koc": "Two is fine."}] },
    { koc: "Where shall we meet?", ipucu: ["Let's meet in front of the station.", "I can pick you up from your place."], dallar: [{"kelimeler": ["station", "front"], "koc": "Great, see you at the station."}, {"kelimeler": ["pick", "place"], "koc": "That's so kind, thanks!"}] },
  ],
  ustAdim: { koc: "Oh no, I just checked the weather. It's going to rain all day on Saturday. What should we do?", ipucu: ["Let's go to the exhibition, it's indoors anyway.", "Can we take a rain check and go on Sunday instead?"] },
  sapmalar: [],
  seviyeVaryasyonlari: { alt: "Arkadaş her öneriyi hemen kabul eder.", ust: "Hava bozar; kullanıcı yeni bir plan önerir." },
  kapanis: "Awesome, it's a plan! I'll text you on Friday to confirm.",
  karneOdagi: ["want-to", "can-to", "more-better"],
  kulturelNot: {"tr": "Avustralya'da 'Let's catch up' gibi sözler her zaman kesin bir plan demek değildir; gün ve saat söylenince plan gerçek olur.", "en": "In Australia phrases like 'Let's catch up' don't always mean a fixed plan; it becomes real once a day and time are set."},
};
