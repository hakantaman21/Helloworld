// Senaryo şablonu: Anayasa bölüm 5. Zorunlu alanlar robot tarafından denetlenir (Y17). v0.12.0'da eklendi.
export default {
  kimlik: "ulasim-otel-01",
  alan: "ulasim",
  seviye: "A2",
  baslik: {"tr": "Otelde giriş", "en": "Hotel check-in"},
  durum: {"tr": "Uzun bir yolculuktan sonra otele vardın; resepsiyonda giriş yapıyorsun.", "en": "You arrive at the hotel after a long trip and check in at reception."},
  roller: { koc: {"tr": "Resepsiyon görevlisi", "en": "Receptionist"}, aksan: "Amerikan" },
  gorev: { aciklama: {"tr": "Rezervasyonunu söyle, kahvaltı ve Wi-Fi'yi sor, odaya yardım iste.", "en": "Give your booking, ask about breakfast and Wi-Fi, and ask for help with the room."}, kelimeler: ["booking", "name", "breakfast", "wifi", "room", "key"] },
  hedefKaliplar: [{"kalip": "I have a booking under ...", "anahtar": "booking"}, {"kalip": "What time is breakfast?", "anahtar": "What time"}, {"kalip": "Could you help me with ...?", "anahtar": "Could you"}],
  anahtarKelimeler: [{"en": "booking", "tr": "rezervasyon"}, {"en": "check-in", "tr": "giriş"}, {"en": "check-out", "tr": "çıkış"}, {"en": "key card", "tr": "oda kartı"}, {"en": "lift / elevator", "tr": "asansör"}, {"en": "luggage", "tr": "bagaj"}],
  acilis: { koc: "Good evening and welcome! Do you have a reservation with us?", ipucu: ["Yes, I have a booking under Kaya.", "Yes, for three nights."], dallar: [{"kelimeler": ["booking", "reservation", "kaya"], "koc": "Let me find it."}, {"kelimeler": ["nights"], "koc": "Three nights, lovely."}] },
  adimlar: [
    { koc: "I found it. Can I see your passport, please?", ipucu: ["Yes, here you are.", "Sure, one moment."], dallar: [{"kelimeler": ["here", "sure"], "koc": "Thank you."}] },
    { koc: "Your room is on the fifth floor. Do you have any questions?", ipucu: ["What time is breakfast?", "What is the Wi-Fi password?"], dallar: [{"kelimeler": ["breakfast"], "koc": "Breakfast is from seven to ten."}, {"kelimeler": ["wifi", "wi", "fi", "password"], "koc": "It is on your key card holder."}] },
    { koc: "Would you like help with your luggage?", ipucu: ["Yes, please. My bag is very heavy.", "No, thank you. I am fine."], dallar: [{"kelimeler": ["yes", "heavy"], "koc": "Our porter will bring it up."}, {"kelimeler": ["no"], "koc": "No problem."}] },
  ],
  ustAdim: { koc: "I am very sorry, your room is not ready yet. It will be ready in one hour. What would you like to do?", ipucu: ["Can I leave my bags here and have a coffee?", "Is there a free room now?"] },
  sapmalar: [],
  seviyeVaryasyonlari: { alt: "Görevli adım adım ve yavaş ilerler.", ust: "Oda hazır değildir; kullanıcı çözüm ister." },
  kapanis: "Here is your key card. Enjoy your stay!",
  karneOdagi: ["can-to", "how-much", "want-to"],
  kulturelNot: {"tr": "ABD otellerinde bagajı taşıyan görevliye çanta başına birkaç dolar bahşiş vermek yaygındır.", "en": "In US hotels it is common to tip the porter a few dollars per bag."},
};
