// Senaryo şablonu: Anayasa bölüm 5. Zorunlu alanlar robot tarafından denetlenir (Y17). v0.16.0'da eklendi (C1).
export default {
  kimlik: "egitim-seminer-c1-01",
  alan: "egitim",
  seviye: "C1",
  baslik: {"tr": "Seminerde bir araştırmayı eleştirmek", "en": "Critiquing a study in a seminar"},
  durum: {"tr": "Yüksek lisans seminerinde, sosyal medyanın mutluluğu azalttığını öne süren bir makale tartışılıyor. Bulguları özetleyip yöntemine yapıcı bir eleştiri getirmelisin.", "en": "In a master’s seminar the class is discussing a paper claiming that social media reduces happiness. You need to summarise the findings and offer a constructive critique of the method."},
  roller: { koc: {"tr": "Seminer hocası", "en": "Seminar tutor"}, aksan: "İngiliz" },
  gorev: { aciklama: {"tr": "Bulguyu tek cümlede özetle, bir yöntem sınırlılığını göster ve daha iyi bir araştırma tasarımı öner.", "en": "Summarise the finding in one sentence, point out a methodological limitation and propose a better research design."}, kelimeler: ["sample", "correlation", "causation", "limitation", "longitudinal", "evidence"] },
  hedefKaliplar: [{"kalip": "The authors argue that ...", "anahtar": "argue that"}, {"kalip": "One limitation is that ...", "anahtar": "limitation"}, {"kalip": "A more robust approach would be to ...", "anahtar": "more robust"}],
  anahtarKelimeler: [{"en": "sample size", "tr": "örneklem büyüklüğü"}, {"en": "correlation", "tr": "korelasyon / ilişki"}, {"en": "causation", "tr": "nedensellik"}, {"en": "self-reported", "tr": "beyana dayalı"}, {"en": "longitudinal", "tr": "boylamsal"}, {"en": "control group", "tr": "kontrol grubu"}, {"en": "generalise", "tr": "genellemek"}],
  acilis: { koc: "Let’s start. Could someone summarise the main finding of the paper?", ipucu: ["The authors argue that heavy social media use is linked to lower happiness.", "In short, people who spend more time on social media report feeling less happy."], dallar: [{"kelimeler": ["argue", "linked", "lower"], "koc": "Good, and notice the word \"linked\"."}, {"kelimeler": ["report", "less happy", "time"], "koc": "Yes, they report it themselves, note that."}] },
  adimlar: [
    { koc: "Do you find the evidence convincing?", ipucu: ["Not entirely; one limitation is that the data is self-reported.", "The sample is quite small and only includes university students."], dallar: [{"kelimeler": ["limitation", "self-reported", "self reported"], "koc": "A classic weakness, yes."}, {"kelimeler": ["sample", "small", "students"], "koc": "So can we generalise from it?"}] },
    { koc: "The authors seem to suggest that social media causes unhappiness. Is that justified?", ipucu: ["Not really; they show a correlation, but correlation is not causation.", "Unhappy people might use social media more, so the direction could be reversed."], dallar: [{"kelimeler": ["correlation", "causation"], "koc": "Exactly the distinction I wanted."}, {"kelimeler": ["reversed", "direction", "unhappy people"], "koc": "Reverse causality, well spotted."}] },
    { koc: "How would you design a better study?", ipucu: ["A more robust approach would be a longitudinal study that follows the same people for years.", "We could use an experiment with a control group that stops using social media for a month."], dallar: [{"kelimeler": ["longitudinal", "years", "follows"], "koc": "That would help with direction."}, {"kelimeler": ["experiment", "control", "month"], "koc": "An intervention study, nice."}] },
  ],
  ustAdim: { koc: "Some say these studies are pointless because social media changes so fast. Do you agree?", ipucu: ["Partly, but the underlying question about attention and wellbeing remains relevant.", "I disagree; even if platforms change, the methods we develop can still be applied."] },
  sapmalar: [],
  seviyeVaryasyonlari: {"alt": "Hoca özet ister ve tek bir zayıflık sorar.", "ust": "Hoca öğrencinin önerdiği tasarımı da eleştirir; öğrenci savunur."},
  kapanis: "Excellent discussion. For next week, find one longitudinal study and compare it with this one.",
  karneOdagi: ["people-are", "ucuncu-tekil", "more-better"],
  kulturelNot: {"tr": "İngiliz akademik ortamında hocanın ya da yazarın görüşüne kanıtla itiraz etmek beklenir ve takdir edilir; \"I’d argue that...\" gibi ifadeler eleştiriyi kişisel değil akademik kılar.", "en": "In British academic settings, challenging the tutor’s or author’s view with evidence is expected and valued; phrases like \"I’d argue that...\" keep criticism academic rather than personal."},
};
