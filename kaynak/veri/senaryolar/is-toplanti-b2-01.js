// Senaryo şablonu: Anayasa bölüm 5. Zorunlu alanlar robot tarafından denetlenir (Y17). v0.16.0'da eklendi (B2).
export default {
  kimlik: "is-toplanti-b2-01",
  alan: "is",
  seviye: "B2",
  baslik: {"tr": "Toplantıda kibarca itiraz etmek", "en": "Disagreeing politely in a meeting"},
  durum: {"tr": "Ekip toplantısında müdürün teslim tarihini bir hafta öne çekmeyi öneriyor. Sen bunun riskli olduğunu düşünüyorsun ve gerekçenle birlikte alternatif sunmalısın.", "en": "In a team meeting your manager suggests moving the deadline a week earlier. You think it is risky and need to give your reasons and an alternative."},
  roller: { koc: {"tr": "Proje müdürü", "en": "Project manager"}, aksan: "İngiliz" },
  gorev: { aciklama: {"tr": "Kibarca katılmadığını söyle, bir gerekçe ver ve somut bir alternatif öner.", "en": "Say politely that you disagree, give a reason and propose a concrete alternative."}, kelimeler: ["risk", "quality", "alternative", "suggest", "instead", "priority"] },
  hedefKaliplar: [{"kalip": "I see your point, but ...", "anahtar": "see your point"}, {"kalip": "The main concern is that ...", "anahtar": "concern"}, {"kalip": "What if we ... instead?", "anahtar": "instead"}],
  anahtarKelimeler: [{"en": "deadline", "tr": "teslim tarihi"}, {"en": "workload", "tr": "iş yükü"}, {"en": "trade-off", "tr": "ödünleşim"}, {"en": "scope", "tr": "kapsam"}, {"en": "realistic", "tr": "gerçekçi"}, {"en": "compromise", "tr": "uzlaşma"}],
  acilis: { koc: "The client asked if we can deliver a week earlier. I think we can do it. What do you think?", ipucu: ["I see your point, but I am worried about the quality.", "I understand why the client wants it, but the timeline is very tight."], dallar: [{"kelimeler": ["quality", "worried", "concern"], "koc": "Fair point. Quality matters to them too."}, {"kelimeler": ["tight", "time", "timeline"], "koc": "Hmm, it is tight, I agree."}] },
  adimlar: [
    { koc: "What exactly is the risk if we try?", ipucu: ["The main concern is that we will not have time to test properly.", "We might have to cut important features."], dallar: [{"kelimeler": ["test", "testing"], "koc": "Right, testing is where we would lose time."}, {"kelimeler": ["features", "cut", "scope"], "koc": "Cutting scope is a real trade-off."}] },
    { koc: "So what do you suggest instead?", ipucu: ["What if we deliver the main features first and the rest a week later?", "We could ask for more people on the team instead."], dallar: [{"kelimeler": ["first", "phase", "main"], "koc": "A phased delivery... that could work."}, {"kelimeler": ["people", "help", "team"], "koc": "Extra people is expensive, but possible."}] },
    { koc: "How should we explain this to the client?", ipucu: ["We can say that we want to give them a product that really works.", "I would be honest and explain the trade-off."], dallar: [{"kelimeler": ["honest", "explain"], "koc": "Honesty usually works best with this client."}, {"kelimeler": ["works", "quality", "product"], "koc": "Good framing."}] },
  ],
  ustAdim: { koc: "The client says it is the earlier date or nothing. Would you still push back?", ipucu: ["I would still explain the risk, but I would offer a smaller first version.", "If we must, I would ask what they can live without."] },
  sapmalar: [],
  seviyeVaryasyonlari: {"alt": "Müdür tek bir soru sorar, kullanıcı yalnız katılmadığını ve bir nedeni söyler.", "ust": "Müdür ısrar eder; kullanıcı uzlaşma noktasını müzakere eder."},
  kapanis: "Thanks for being direct. Let’s propose a phased delivery to the client.",
  karneOdagi: ["want-to", "can-to", "more-better"],
  kulturelNot: {"tr": "İngiliz ve Amerikan iş kültüründe doğrudan \"No\" yerine \"I see your point, but...\" gibi yumuşatıcılarla itiraz edilir; itiraz etmek saygısızlık sayılmaz, alternatif sunmak beklenir.", "en": "In British and American workplaces, people disagree with softeners like \"I see your point, but...\" instead of a direct \"No\"; disagreeing is not rude, and offering an alternative is expected."},
};
