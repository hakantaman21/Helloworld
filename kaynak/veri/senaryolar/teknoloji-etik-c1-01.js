// Senaryo şablonu: Anayasa bölüm 5. Zorunlu alanlar robot tarafından denetlenir (Y17). v0.16.0'da eklendi (C1).
export default {
  kimlik: "teknoloji-etik-c1-01",
  alan: "teknoloji",
  seviye: "C1",
  baslik: {"tr": "Şirket yapay zekâ politikası tartışması", "en": "Debating a company AI policy"},
  durum: {"tr": "Şirketin, müşteri e-postalarına yapay zekâyla otomatik yanıt verilmesini tartışan bir komitede yer alıyorsun. Faydaları ve riskleri tartıp koşullu bir öneri sunmalısın.", "en": "You sit on a committee discussing whether customer emails should be answered automatically by AI. You must weigh the benefits and risks and make a conditional recommendation."},
  roller: { koc: {"tr": "Komite başkanı", "en": "Committee chair"}, aksan: "Amerikan" },
  gorev: { aciklama: {"tr": "Bir faydayı ve bir riski karşılaştır, koşullu bir öneri yap (\"... şartıyla\") ve nasıl ölçüleceğini söyle.", "en": "Compare one benefit and one risk, make a conditional recommendation (\"provided that...\") and say how it will be measured."}, kelimeler: ["provided that", "transparency", "oversight", "bias", "accountable", "measure"] },
  hedefKaliplar: [{"kalip": "While ..., we also need to ...", "anahtar": "while"}, {"kalip": "I would support it provided that ...", "anahtar": "provided that"}, {"kalip": "We could measure this by ...", "anahtar": "measure"}],
  anahtarKelimeler: [{"en": "oversight", "tr": "denetim / gözetim"}, {"en": "accountability", "tr": "hesap verebilirlik"}, {"en": "bias", "tr": "önyargı"}, {"en": "transparency", "tr": "şeffaflık"}, {"en": "disclose", "tr": "açıklamak"}, {"en": "opt out", "tr": "vazgeçme hakkı"}, {"en": "pilot", "tr": "deneme uygulaması"}],
  acilis: { koc: "Automating replies could cut response times from two days to two minutes. Should we go ahead?", ipucu: ["While the speed is impressive, we also need to think about mistakes.", "I would support it provided that a person reviews sensitive cases."], dallar: [{"kelimeler": ["while", "speed", "mistakes"], "koc": "Mistakes are exactly my worry too."}, {"kelimeler": ["provided", "person", "reviews"], "koc": "Human review for sensitive cases, noted."}] },
  adimlar: [
    { koc: "Should customers be told that they are talking to an AI?", ipucu: ["Yes, we should disclose it clearly; otherwise we risk losing their trust.", "Transparency is essential, and customers should be able to reach a human."], dallar: [{"kelimeler": ["disclose", "trust", "clearly"], "koc": "Agreed, no hidden bots."}, {"kelimeler": ["transparency", "human", "reach"], "koc": "Good, an easy way to reach a person."}] },
    { koc: "Who is accountable if the AI gives wrong information?", ipucu: ["The company remains accountable, so the team owning the tool must check its answers.", "We are, not the vendor; that’s why we need clear oversight."], dallar: [{"kelimeler": ["accountable", "company", "team"], "koc": "Right, we can’t blame the software."}, {"kelimeler": ["vendor", "oversight"], "koc": "Exactly."}] },
    { koc: "How would we know if it’s working well?", ipucu: ["We could measure this by customer satisfaction and the number of corrected answers.", "We should run a three-month pilot and compare complaint rates."], dallar: [{"kelimeler": ["measure", "satisfaction", "corrected"], "koc": "Concrete metrics, good."}, {"kelimeler": ["pilot", "compare", "complaint"], "koc": "A pilot makes sense."}] },
  ],
  ustAdim: { koc: "Some argue that automation will cost jobs in our support team. How do you respond?", ipucu: ["It may change the roles rather than remove them, provided that we retrain people for complex cases.", "That concern is legitimate, so the savings should partly fund training."] },
  sapmalar: [],
  seviyeVaryasyonlari: {"alt": "Başkan yalnız evet/hayır ve tek gerekçe ister.", "ust": "Başkan etik ve hukuki itirazları üst üste getirir; kullanıcı dengeli bir politika önerir."},
  kapanis: "Thank you. We’ll draft a policy with disclosure, human review and a three-month pilot.",
  karneOdagi: ["more-better", "people-are", "can-to"],
  kulturelNot: {"tr": "Kurumsal İngilizcede güçlü görüşler bile \"provided that\", \"while\" gibi koşul ve denge ifadeleriyle sunulur; bu, kararsızlık değil profesyonelliktir.", "en": "In corporate English even strong views are framed with conditions and balance (\"provided that\", \"while\"); this signals professionalism, not indecision."},
};
