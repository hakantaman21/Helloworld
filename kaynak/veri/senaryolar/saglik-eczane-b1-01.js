// Senaryo şablonu: Anayasa bölüm 5. v0.20.0'da eklendi (B1).
export default {
  kimlik: "saglik-eczane-b1-01",
  alan: "saglik",
  seviye: "B1",
  baslik: {"tr": "Eczanede", "en": "At the pharmacy"},
  durum: {"tr": "Birkaç gündür boğazın ağrıyor; eczacıdan reçetesiz bir şey istiyorsun.", "en": "You've had a sore throat for a few days; you ask the pharmacist for something over the counter."},
  roller: { koc: {"tr": "Eczacı", "en": "Pharmacist"}, aksan: "Amerikan" },
  gorev: { aciklama: {"tr": "Belirtilerini ve ne zamandır sürdüğünü anlat, ilacı nasıl kullanacağını sor.", "en": "Describe your symptoms and how long you've had them, and ask how to take the medicine."}, kelimeler: ["throat", "days", "fever", "allergic", "tablets", "times"] },
  hedefKaliplar: [{"kalip": "I've had ... for ... days.", "anahtar": "I've had"}, {"kalip": "How often should I take it?", "anahtar": "How often"}, {"kalip": "Is it safe to ...?", "anahtar": "Is it safe"}],
  anahtarKelimeler: [{"en": "sore throat", "tr": "boğaz ağrısı"}, {"en": "fever", "tr": "ateş"}, {"en": "prescription", "tr": "reçete"}, {"en": "side effects", "tr": "yan etkiler"}, {"en": "allergic", "tr": "alerjik"}, {"en": "dose", "tr": "doz"}],
  acilis: { koc: "Hi, what can I do for you?", ipucu: ["I've had a sore throat for three days.", "I need something for a bad cough."], dallar: [{"kelimeler": ["throat", "days"], "koc": "Okay, let me ask you a few questions."}, {"kelimeler": ["cough"], "koc": "Is it a dry cough?"}] },
  adimlar: [
    { koc: "Do you have a fever or any other symptoms?", ipucu: ["No fever, but I feel a bit tired.", "I had a slight fever last night."], dallar: [{"kelimeler": ["no", "tired"], "koc": "That's common with a cold."}, {"kelimeler": ["fever"], "koc": "Keep an eye on your temperature."}] },
    { koc: "Are you allergic to any medicine?", ipucu: ["Not that I know of.", "Yes, I'm allergic to penicillin."], dallar: [{"kelimeler": ["not", "no"], "koc": "Good, then these lozenges are fine."}, {"kelimeler": ["allergic", "penicillin"], "koc": "Thanks for telling me. These don't contain it."}] },
    { koc: "Here you go. Do you have any questions about them?", ipucu: ["How often should I take them?", "Is it safe to drive after taking them?"], dallar: [{"kelimeler": ["often", "times"], "koc": "One every three hours, no more than eight a day."}, {"kelimeler": ["safe", "drive"], "koc": "Yes, they won't make you sleepy."}] },
  ],
  ustAdim: { koc: "If it isn't better in a week, what do you think you should do?", ipucu: ["I should see a doctor.", "I'll make an appointment if it gets worse."] },
  sapmalar: [],
  seviyeVaryasyonlari: { alt: "Eczacı evet/hayır soruları sorar.", ust: "Eczacı ne zaman doktora gitmesi gerektiğini kullanıcının söylemesini ister." },
  kapanis: "Get some rest and drink plenty of water. Feel better soon!",
  karneOdagi: ["how-much", "can-to", "ucuncu-tekil"],
  kulturelNot: {"tr": "ABD'de birçok ağrı kesici ve boğaz pastili reçetesiz satılır; eczacıya danışmak ücretsizdir. Bu bir dil pratiğidir, tıbbi tavsiye değildir.", "en": "In the US many painkillers and throat lozenges are sold over the counter; asking the pharmacist is free. This is language practice, not medical advice."},
};
