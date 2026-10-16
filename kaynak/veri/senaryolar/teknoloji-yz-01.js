// Senaryo şablonu: Anayasa bölüm 5. Zorunlu alanlar robot tarafından denetlenir (Y17). v0.12.0'da eklendi.
export default {
  kimlik: "teknoloji-yz-01",
  alan: "teknoloji",
  seviye: "B1",
  baslik: {"tr": "Yapay zekâ aracı toplantısı", "en": "Meeting about an AI tool"},
  durum: {"tr": "Ekibin yeni bir yapay zekâ aracını kullanmaya başlıyor; toplantıda yöneticine ne için kullanacağını anlatıyorsun.", "en": "Your team is starting to use a new AI tool; in a meeting you explain to your manager what you will use it for."},
  roller: { koc: {"tr": "Ekip yöneticisi", "en": "Team manager"}, aksan: "Amerikan" },
  gorev: { aciklama: {"tr": "Aracı hangi işte kullanacağını, nasıl kontrol edeceğini ve bir riskini anlat.", "en": "Explain which task you will use it for, how you will check it and one risk."}, kelimeler: ["summary", "check", "data", "email", "report", "draft"] },
  hedefKaliplar: [{"kalip": "I want to use it for ...", "anahtar": "use it for"}, {"kalip": "I will check ... before ...", "anahtar": "check"}, {"kalip": "One risk is that ...", "anahtar": "risk"}],
  anahtarKelimeler: [{"en": "summary", "tr": "özet"}, {"en": "draft", "tr": "taslak"}, {"en": "prompt", "tr": "komut / istem"}, {"en": "accuracy", "tr": "doğruluk"}, {"en": "privacy", "tr": "gizlilik"}, {"en": "customer data", "tr": "müşteri verisi"}, {"en": "workflow", "tr": "iş akışı"}],
  acilis: { koc: "Okay, everyone has access to the new AI assistant now. How do you want to use it in your work?", ipucu: ["I want to use it for meeting summaries.", "I want to use it to write first drafts of emails."], dallar: [{"kelimeler": ["summary", "summaries", "summarize", "summarise"], "koc": "Summaries could save us a lot of time."}, {"kelimeler": ["email", "draft"], "koc": "Email drafts, nice idea."}] },
  adimlar: [
    { koc: "How will you make sure the output is correct?", ipucu: ["I will check the facts before I send anything.", "I will compare it with the original notes."], dallar: [{"kelimeler": ["check", "facts"], "koc": "Good, never send without checking."}, {"kelimeler": ["compare", "notes"], "koc": "Smart."}] },
    { koc: "What kind of information should we not put into it?", ipucu: ["We should not share customer data.", "Passwords and private numbers."], dallar: [{"kelimeler": ["customer", "data", "private"], "koc": "Exactly, privacy first."}, {"kelimeler": ["password"], "koc": "Absolutely."}] },
    { koc: "Can you write a good prompt for a weekly report? Say it out loud.", ipucu: ["Summarize these notes in five short points for my manager.", "Write a short weekly report with progress, problems and next steps."], dallar: [{"kelimeler": ["summary", "summarize", "summarise", "points"], "koc": "Clear and short, I like it."}, {"kelimeler": ["report", "steps"], "koc": "That is a well-structured prompt."}] },
  ],
  ustAdim: { koc: "Someone in the team thinks AI will replace our jobs. What would you say to them?", ipucu: ["I think it helps us with boring tasks, but people still make decisions.", "We need to learn new skills, so the tool is useful for us."] },
  sapmalar: [],
  seviyeVaryasyonlari: { alt: "Yönetici basit, tek konulu sorular sorar.", ust: "Yönetici bir itiraz getirir; kullanıcı görüşünü savunur." },
  kapanis: "Great ideas. Let's try it for two weeks and talk again.",
  karneOdagi: ["want-to", "can-to", "more-better"],
  kulturelNot: {"tr": "İş yerlerinde yapay zekâ kullanırken şirketin veri kurallarına uymak beklenir; çıktıyı kontrol etmek senin sorumluluğundur.", "en": "At work you are expected to follow company data rules when using AI; checking the output is your responsibility."},
};
