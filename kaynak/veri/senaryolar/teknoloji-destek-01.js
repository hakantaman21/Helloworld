// Senaryo şablonu: Anayasa bölüm 5. Zorunlu alanlar robot tarafından denetlenir (Y17). v0.12.0'da eklendi.
export default {
  kimlik: "teknoloji-destek-01",
  alan: "teknoloji",
  seviye: "A2",
  baslik: {"tr": "Teknik destek araması", "en": "Calling tech support"},
  durum: {"tr": "İnternetin çalışmıyor; servis sağlayıcının destek hattını arıyorsun.", "en": "Your internet is not working; you call your provider's support line."},
  roller: { koc: {"tr": "Destek görevlisi", "en": "Support agent"}, aksan: "İngiliz" },
  gorev: { aciklama: {"tr": "Sorunu anlat, denediklerini söyle ve ne zaman düzeleceğini sor.", "en": "Describe the problem, say what you tried and ask when it will be fixed."}, kelimeler: ["internet", "router", "light", "restart", "password", "engineer"] },
  hedefKaliplar: [{"kalip": "My ... is not working.", "anahtar": "not working"}, {"kalip": "I have already tried ...", "anahtar": "already tried"}, {"kalip": "When will it be fixed?", "anahtar": "When will"}],
  anahtarKelimeler: [{"en": "router", "tr": "modem"}, {"en": "restart", "tr": "yeniden başlatmak"}, {"en": "connection", "tr": "bağlantı"}, {"en": "engineer", "tr": "teknisyen"}, {"en": "account number", "tr": "hesap numarası"}],
  acilis: { koc: "Hello, you are through to customer support. How can I help you today?", ipucu: ["My internet is not working.", "My Wi-Fi is very slow."], dallar: [{"kelimeler": ["internet", "working"], "koc": "I am sorry to hear that."}, {"kelimeler": ["slow"], "koc": "Slow Wi-Fi, okay."}] },
  adimlar: [
    { koc: "Have you tried restarting the router?", ipucu: ["Yes, I have already tried that.", "No, how do I do that?"], dallar: [{"kelimeler": ["yes", "tried"], "koc": "Thank you."}, {"kelimeler": ["no", "how"], "koc": "Just turn it off, wait ten seconds and turn it on."}] },
    { koc: "What colour is the light on the router?", ipucu: ["It is red.", "It is orange and it is blinking."], dallar: [{"kelimeler": ["red"], "koc": "Red means there is no connection."}, {"kelimeler": ["orange", "blinking"], "koc": "Okay, it is trying to connect."}] },
    { koc: "I can see a problem in your area. Our engineers are working on it.", ipucu: ["When will it be fixed?", "How long will it take?"], dallar: [{"kelimeler": ["when", "long"], "koc": "It should be fixed by six o'clock this evening."}] },
  ],
  ustAdim: { koc: "If it is not fixed by tonight, we can send an engineer tomorrow. What time are you at home?", ipucu: ["I am at home after five.", "Can the engineer come in the morning?"] },
  sapmalar: [],
  seviyeVaryasyonlari: { alt: "Görevli kısa sorular sorar ve tek tek ilerler.", ust: "Görevli teknisyen randevusu önerir; kullanıcı uygun saati ayarlar." },
  kapanis: "Thank you for your patience. Have a good day.",
  karneOdagi: ["gecmis-zaman", "did-yalin", "can-to"],
  kulturelNot: {"tr": "İngiltere'de destek hatlarında önce hesap numaranı ya da posta kodunu sorarlar; hazır tutmak işi hızlandırır.", "en": "UK support lines usually ask for your account number or postcode first; having it ready saves time."},
};
