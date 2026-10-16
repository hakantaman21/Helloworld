// Senaryo şablonu: Anayasa bölüm 5. Zorunlu alanlar robot tarafından denetlenir (Y17). v0.16.0'da eklendi (C1).
export default {
  kimlik: "is-sunum-c1-01",
  alan: "is",
  seviye: "C1",
  baslik: {"tr": "Sunum sonrası zor sorular", "en": "Handling tough questions after a presentation"},
  durum: {"tr": "Yönetim kuruluna yeni bir yatırım önerisi sundun. Bir yönetici rakamlarına şüpheyle yaklaşıyor. Sakin kalıp kanıta dayanarak yanıtlamalı, bilmediğini de dürüstçe söylemelisin.", "en": "You have presented a new investment proposal to the board. One director is sceptical about your numbers. You must stay calm, answer with evidence and admit honestly what you do not know."},
  roller: { koc: {"tr": "Yönetim kurulu üyesi", "en": "Board member"}, aksan: "İngiliz" },
  gorev: { aciklama: {"tr": "Soruyu yeniden ifade et, verine dayanarak yanıtla, bir belirsizliği kabul et ve nasıl takip edeceğini söyle.", "en": "Reframe the question, answer with your data, acknowledge an uncertainty and say how you will follow up."}, kelimeler: ["evidence", "assumption", "estimate", "follow up", "data", "scenario"] },
  hedefKaliplar: [{"kalip": "If I understand you correctly, ...", "anahtar": "understand you correctly"}, {"kalip": "The figures are based on ...", "anahtar": "based on"}, {"kalip": "I don’t have that figure to hand, but ...", "anahtar": "to hand"}],
  anahtarKelimeler: [{"en": "assumption", "tr": "varsayım"}, {"en": "projection", "tr": "öngörü"}, {"en": "conservative estimate", "tr": "temkinli tahmin"}, {"en": "break-even", "tr": "başa baş noktası"}, {"en": "sensitivity", "tr": "duyarlılık"}, {"en": "stakeholder", "tr": "paydaş"}, {"en": "mitigate", "tr": "hafifletmek"}],
  acilis: { koc: "Frankly, a forty percent growth rate looks optimistic. Where does that number come from?", ipucu: ["If I understand you correctly, you’re asking how realistic the growth figure is.", "The figures are based on our results in two pilot markets."], dallar: [{"kelimeler": ["understand", "asking", "realistic"], "koc": "Yes, that’s precisely my question."}, {"kelimeler": ["based", "pilot", "markets"], "koc": "Two markets is a small sample, isn’t it?"}] },
  adimlar: [
    { koc: "Two pilot markets hardly prove anything. What if growth is half of that?", ipucu: ["That’s a fair point. Even at twenty percent, we break even in year three.", "We modelled a conservative scenario as well, and the project is still profitable."], dallar: [{"kelimeler": ["fair", "twenty", "break even", "break-even"], "koc": "Alright, that’s reassuring."}, {"kelimeler": ["conservative", "scenario", "modelled"], "koc": "I’d like to see that scenario."}] },
    { koc: "And what are the main risks you haven’t mentioned?", ipucu: ["The main risk is regulatory change; we would mitigate it with local partners.", "Currency fluctuations could affect our margins, so we would hedge part of the exposure."], dallar: [{"kelimeler": ["regulatory", "partners", "mitigate"], "koc": "Good, you’ve thought about it."}, {"kelimeler": ["currency", "hedge", "margins"], "koc": "Sensible."}] },
    { koc: "What was the customer acquisition cost in the pilots?", ipucu: ["I don’t have that figure to hand, but I can send it to the board by Friday.", "I’d rather not guess; I will follow up with the exact number this afternoon."], dallar: [{"kelimeler": ["to hand", "friday", "send"], "koc": "Please do."}, {"kelimeler": ["guess", "follow up", "exact"], "koc": "I appreciate the honesty."}] },
  ],
  ustAdim: { koc: "Why should we invest now rather than wait another year?", ipucu: ["Waiting would give competitors a head start, and the cost of entry is likely to rise.", "Delaying reduces the risk slightly, but we would lose the advantage we built in the pilots."] },
  sapmalar: [],
  seviyeVaryasyonlari: {"alt": "Yönetici tek bir rakam sorar; kullanıcı kaynağını açıklar.", "ust": "Yönetici art arda üç itiraz getirir; kullanıcı önceliklendirerek yanıtlar."},
  kapanis: "Thank you. Send us the conservative scenario and the acquisition costs, and we’ll decide next month.",
  karneOdagi: ["more-better", "gecmis-zaman", "people-are"],
  kulturelNot: {"tr": "İngiliz iş kültüründe \"I don’t know\" demek zayıflık değildir; bilmediğini kabul edip \"I’ll come back to you on that\" diyerek takip sözü vermek güven yaratır.", "en": "In British business culture admitting you don’t know is not a weakness; saying \"I’ll come back to you on that\" and following up builds trust."},
};
