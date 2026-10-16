// Senaryo şablonu: Anayasa bölüm 5. Zorunlu alanlar robot tarafından denetlenir (Y17). v0.12.0'da eklendi.
export default {
  kimlik: "ev-kira-01",
  alan: "ev",
  seviye: "A2",
  baslik: {"tr": "Kiralık daireye bakmak", "en": "Viewing a flat to rent"},
  durum: {"tr": "Kiralık bir daireyi görmeye geldin; ev sahibiyle konuşuyorsun.", "en": "You are viewing a flat to rent and talking to the landlord."},
  roller: { koc: {"tr": "Ev sahibi", "en": "Landlord"}, aksan: "İngiliz" },
  gorev: { aciklama: {"tr": "Kirayı, faturaları ve taşınma tarihini sor.", "en": "Ask about the rent, the bills and the move-in date."}, kelimeler: ["rent", "bills", "month", "deposit", "furnished", "kitchen"] },
  hedefKaliplar: [{"kalip": "How much is the rent?", "anahtar": "How much"}, {"kalip": "Are the bills included?", "anahtar": "included"}, {"kalip": "When can I move in?", "anahtar": "move in"}],
  anahtarKelimeler: [{"en": "rent", "tr": "kira"}, {"en": "deposit", "tr": "depozito"}, {"en": "bills", "tr": "faturalar"}, {"en": "furnished", "tr": "eşyalı"}, {"en": "landlord", "tr": "ev sahibi"}, {"en": "neighbour", "tr": "komşu"}],
  acilis: { koc: "Hello, come in! This is the flat. What would you like to know?", ipucu: ["How much is the rent?", "Is it furnished?"], dallar: [{"kelimeler": ["rent", "much"], "koc": "Good question, let me tell you."}, {"kelimeler": ["furnished"], "koc": "Yes, it comes with furniture."}] },
  adimlar: [
    { koc: "The rent is nine hundred pounds a month. Do you have any questions about the bills?", ipucu: ["Are the bills included?", "How much are the bills?"], dallar: [{"kelimeler": ["included"], "koc": "Water is included, but electricity is not."}, {"kelimeler": ["much", "bills"], "koc": "About eighty pounds a month."}] },
    { koc: "There is also a deposit of one month. Is that okay for you?", ipucu: ["Yes, that is okay.", "Can I pay it in two parts?"], dallar: [{"kelimeler": ["yes", "okay"], "koc": "Great."}, {"kelimeler": ["two", "parts"], "koc": "Hmm, I think we can talk about that."}] },
    { koc: "When would you like to move in?", ipucu: ["Next month, if possible.", "When can I move in?"], dallar: [{"kelimeler": ["next", "month"], "koc": "Next month works for me."}, {"kelimeler": ["when"], "koc": "It is free from the first of the month."}] },
  ],
  ustAdim: { koc: "Another person also wants the flat. Can you tell me a little about yourself and your job?", ipucu: ["I work as a teacher and I am very tidy.", "I am a quiet person and I pay on time."] },
  sapmalar: [],
  seviyeVaryasyonlari: { alt: "Ev sahibi kısa ve net sorular sorar.", ust: "Ev sahibi başka bir adayı söyler; kullanıcı kendini tanıtıp ikna eder." },
  kapanis: "Thank you for coming. I will call you tomorrow.",
  karneOdagi: ["how-much", "want-to", "meslek-a"],
  kulturelNot: {"tr": "İngiltere'de kira çoğu zaman aylık (pcm) yazılır; faturaların dahil olup olmadığını mutlaka sor.", "en": "In the UK rent is often shown per month (pcm); always ask if bills are included."},
};
