// Senaryo şablonu: Anayasa bölüm 5. v0.20.0'da eklendi (B1).
export default {
  kimlik: "ev-komsu-b1-01",
  alan: "ev",
  seviye: "B1",
  baslik: {"tr": "Gürültülü komşu", "en": "A noisy neighbour"},
  durum: {"tr": "Üst kattaki komşu her gece geç saatlere kadar müzik açıyor; kibarca konuşmaya gittin.", "en": "Your upstairs neighbour plays music late every night; you go to talk politely."},
  roller: { koc: {"tr": "Komşu", "en": "Neighbour"}, aksan: "İngiliz" },
  gorev: { aciklama: {"tr": "Kendini tanıt, sorunu kibarca anlat ve ikiniz için de uygun bir çözüm öner.", "en": "Introduce yourself, explain the problem politely and suggest a solution that works for both of you."}, kelimeler: ["downstairs", "music", "late", "sleep", "work", "after"] },
  hedefKaliplar: [{"kalip": "I'm sorry to bother you, but ...", "anahtar": "sorry to bother"}, {"kalip": "Would you mind ...ing?", "anahtar": "Would you mind"}, {"kalip": "How about ...?", "anahtar": "How about"}],
  anahtarKelimeler: [{"en": "neighbour", "tr": "komşu"}, {"en": "noise", "tr": "gürültü"}, {"en": "turn down", "tr": "sesini kısmak"}, {"en": "early shift", "tr": "erken vardiya"}, {"en": "compromise", "tr": "orta yol"}, {"en": "weekend", "tr": "hafta sonu"}],
  acilis: { koc: "Oh, hello! Can I help you?", ipucu: ["Hi, I'm Deniz from the flat downstairs. Sorry to bother you.", "Hello, I live below you. Have you got a minute?"], dallar: [{"kelimeler": ["downstairs", "flat", "below"], "koc": "Nice to meet you!"}, {"kelimeler": ["minute", "bother"], "koc": "Sure, what's up?"}] },
  adimlar: [
    { koc: "Is everything okay?", ipucu: ["The music is quite loud at night, and I can't sleep.", "I start work very early, so the noise after midnight is hard for me."], dallar: [{"kelimeler": ["music", "loud", "sleep"], "koc": "Oh no, I didn't realise it was that loud."}, {"kelimeler": ["work", "early", "midnight"], "koc": "I'm sorry, I didn't know."}] },
    { koc: "I usually practise guitar in the evenings. What would work for you?", ipucu: ["Would you mind stopping by eleven on weekdays?", "How about using headphones after ten?"], dallar: [{"kelimeler": ["eleven", "stopping", "weekdays"], "koc": "Eleven is fine with me."}, {"kelimeler": ["headphones", "ten"], "koc": "That's a good idea."}] },
    { koc: "And what about the weekends?", ipucu: ["Weekends are no problem for me.", "Maybe until midnight on Saturdays?"], dallar: [{"kelimeler": ["problem", "weekends", "no"], "koc": "Great, thanks for being so understanding."}, {"kelimeler": ["midnight", "saturdays"], "koc": "Deal."}] },
  ],
  ustAdim: { koc: "Actually, the noise might come from the flat next door, not mine. How can we find out?", ipucu: ["Could we listen together tonight around eleven?", "Maybe we should ask the building manager."] },
  sapmalar: [],
  seviyeVaryasyonlari: { alt: "Komşu hemen anlayış gösterir.", ust: "Komşu gürültünün kendisinden gelmediğini söyler; kullanıcı birlikte çözüm arar." },
  kapanis: "Thanks for coming to talk to me instead of complaining. Let me know if it happens again!",
  karneOdagi: ["can-to", "want-to", "people-are"],
  kulturelNot: {"tr": "İngiltere'de bir sorunu önce yüz yüze ve yumuşak bir dille ('Sorry to bother you…') açmak, doğrudan şikâyet etmekten daha yaygındır.", "en": "In the UK it is common to raise a problem face to face first, softly ('Sorry to bother you…'), rather than complaining straight away."},
};
