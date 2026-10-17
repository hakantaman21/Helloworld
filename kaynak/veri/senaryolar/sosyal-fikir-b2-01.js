// Senaryo şablonu: Anayasa bölüm 5. Zorunlu alanlar robot tarafından denetlenir (Y17). v0.16.0'da eklendi (B2).
export default {
  kimlik: "sosyal-fikir-b2-01",
  alan: "sosyal",
  seviye: "B2",
  baslik: {"tr": "Uzaktan çalışma üzerine fikir tartışması", "en": "Discussing remote work"},
  durum: {"tr": "Bir arkadaş toplantısında uzaktan çalışmanın iyi mi kötü mü olduğu konuşuluyor. Görüşünü örnekle savun, karşı görüşü de kabul et.", "en": "At a get-together, friends are discussing whether remote work is good or bad. Defend your view with an example and acknowledge the other side."},
  roller: { koc: {"tr": "Arkadaş", "en": "Friend"}, aksan: "Avustralya" },
  gorev: { aciklama: {"tr": "Görüşünü bir örnekle açıkla, karşı tarafın bir noktasını kabul et ve sonuç cümlesi kur.", "en": "Explain your view with an example, acknowledge one point from the other side and give a conclusion."}, kelimeler: ["example", "however", "on the other hand", "overall", "personally", "although"] },
  hedefKaliplar: [{"kalip": "Personally, I think ...", "anahtar": "personally"}, {"kalip": "On the other hand, ...", "anahtar": "on the other hand"}, {"kalip": "Overall, ...", "anahtar": "overall"}],
  anahtarKelimeler: [{"en": "commute", "tr": "işe gidiş geliş"}, {"en": "isolated", "tr": "yalnız / kopuk"}, {"en": "flexibility", "tr": "esneklik"}, {"en": "productivity", "tr": "verimlilik"}, {"en": "boundary", "tr": "sınır"}, {"en": "colleague", "tr": "iş arkadaşı"}],
  acilis: { koc: "Honestly, I think working from home is making people lazy. What do you reckon?", ipucu: ["Personally, I think it depends on the person.", "I don’t really agree. I work better at home."], dallar: [{"kelimeler": ["depends", "person"], "koc": "Hmm, maybe it depends, yeah."}, {"kelimeler": ["agree", "better", "home"], "koc": "Really? Why is that?"}] },
  adimlar: [
    { koc: "Can you give me an example from your own life?", ipucu: ["For example, I save two hours a day because I don’t commute.", "When I work from home, I can focus without interruptions."], dallar: [{"kelimeler": ["commute", "hours", "save"], "koc": "Two hours a day is a lot, fair enough."}, {"kelimeler": ["focus", "interruptions", "quiet"], "koc": "Okay, fewer interruptions, I get that."}] },
    { koc: "But don’t you feel isolated? I’d miss my colleagues.", ipucu: ["That’s true, on the other hand I see my friends more in the evenings.", "You’re right, sometimes I feel a bit isolated, so I go to the office twice a week."], dallar: [{"kelimeler": ["true", "right", "isolated"], "koc": "See? I knew it wasn’t perfect."}, {"kelimeler": ["office", "twice", "hybrid"], "koc": "So, a bit of both then."}] },
    { koc: "So what’s your final answer — good or bad?", ipucu: ["Overall, I think it’s good if people set clear boundaries.", "Overall, a mix of home and office is the best option."], dallar: [{"kelimeler": ["overall", "boundaries", "mix"], "koc": "That’s a pretty balanced answer."}, {"kelimeler": ["best", "option", "good"], "koc": "Fair enough."}] },
  ],
  ustAdim: { koc: "Some companies now want everyone back in the office five days a week. Is that fair?", ipucu: ["I don’t think it’s fair, because people built their lives around remote work.", "It might be fair for some jobs, although it should be discussed with the staff."] },
  sapmalar: [],
  seviyeVaryasyonlari: {"alt": "Arkadaş evet/hayır soruları sorar; kullanıcı kısa gerekçeler verir.", "ust": "Arkadaş sert karşı görüşler getirir; kullanıcı ikna etmeye çalışır."},
  kapanis: "Alright, you’ve half convinced me. Another round of coffee?",
  karneOdagi: ["people-are", "more-better", "ucuncu-tekil"],
  kulturelNot: {"tr": "Avustralya ve İngiltere'de arkadaş sohbetlerinde fikir ayrılığı rahatça dile getirilir; \"What do you reckon?\" (Ne dersin?) gündelik ve samimidir.", "en": "In Australia and the UK, friends openly disagree in casual chats; \"What do you reckon?\" is an informal, friendly way to ask for an opinion."},
};
