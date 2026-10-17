// Senaryo şablonu: Anayasa bölüm 5. Zorunlu alanlar robot tarafından denetlenir (Y17). v0.16.0'da eklendi (C1).
export default {
  kimlik: "is-maas-c1-01",
  alan: "is",
  seviye: "C1",
  baslik: {"tr": "İş teklifinde maaş pazarlığı", "en": "Negotiating a job offer"},
  durum: {"tr": "Uluslararası bir şirketten teklif aldın ama maaş beklentinin altında. İlişkiyi bozmadan, gerekçeyle daha iyi bir paket için pazarlık etmelisin.", "en": "You have received an offer from an international company, but the salary is below your expectations. You need to negotiate a better package with reasons, without damaging the relationship."},
  roller: { koc: {"tr": "İnsan kaynakları müdürü", "en": "HR manager"}, aksan: "Amerikan" },
  gorev: { aciklama: {"tr": "Teklife olumlu başla, piyasa verisiyle karşı teklif ver ve maaş dışı bir seçenek de öner.", "en": "Start positively, make a counter-offer backed by market data and suggest a non-salary option as well."}, kelimeler: ["counter", "market", "range", "package", "flexible", "benefits"] },
  hedefKaliplar: [{"kalip": "I’m very excited about the role, and ...", "anahtar": "excited about"}, {"kalip": "Based on my research, the market range is ...", "anahtar": "market range"}, {"kalip": "Would there be any flexibility on ...?", "anahtar": "flexibility"}],
  anahtarKelimeler: [{"en": "counter-offer", "tr": "karşı teklif"}, {"en": "salary range", "tr": "maaş aralığı"}, {"en": "benefits", "tr": "yan haklar"}, {"en": "signing bonus", "tr": "imza primi"}, {"en": "remote days", "tr": "uzaktan çalışma günleri"}, {"en": "review", "tr": "değerlendirme"}, {"en": "leverage", "tr": "pazarlık gücü"}],
  acilis: { koc: "We’re delighted to offer you the position at sixty thousand. How does that sound?", ipucu: ["I’m very excited about the role, and I’d like to discuss the salary a little.", "Thank you, I’m really pleased. Based on my research, the market range is a bit higher."], dallar: [{"kelimeler": ["excited", "discuss", "salary"], "koc": "Of course, let’s talk about it."}, {"kelimeler": ["research", "market", "range", "higher"], "koc": "I see. What range are you seeing?"}] },
  adimlar: [
    { koc: "What figure did you have in mind?", ipucu: ["Based on my experience and the market data, I was expecting around seventy thousand.", "Something closer to sixty-eight would reflect the responsibilities of the role."], dallar: [{"kelimeler": ["seventy", "experience", "market"], "koc": "That’s above our budget, I’m afraid."}, {"kelimeler": ["sixty-eight", "responsibilities"], "koc": "That might be possible."}] },
    { koc: "Our budget for this role is quite fixed. Is there anything else that matters to you?", ipucu: ["Would there be any flexibility on remote days or a signing bonus?", "If the salary is fixed, a salary review after six months would be important to me."], dallar: [{"kelimeler": ["remote", "bonus", "flexibility"], "koc": "We could offer two remote days."}, {"kelimeler": ["review", "six months"], "koc": "A six-month review is something we can do."}] },
    { koc: "If we can do sixty-five plus a review at six months, would you accept?", ipucu: ["That sounds like a fair compromise; could you send it to me in writing?", "I’m close to yes. Could you add one more remote day?"], dallar: [{"kelimeler": ["fair", "writing", "compromise"], "koc": "Absolutely, I’ll send it today."}, {"kelimeler": ["remote", "close", "add"], "koc": "Let me check with the team."}] },
  ],
  ustAdim: { koc: "Another candidate has accepted a lower salary. Why should we pay you more?", ipucu: ["Because I bring specific experience that will shorten the onboarding time.", "I understand, but my results in my last role show the value I can add quickly."] },
  sapmalar: [],
  seviyeVaryasyonlari: {"alt": "İK müdürü hemen esneklik gösterir; kullanıcı yalnız rakamını ve gerekçesini söyler.", "ust": "İK müdürü baskı kurar; kullanıcı sakin kalıp değerini savunur."},
  kapanis: "Great. I’ll send the revised offer this afternoon. We’re looking forward to working with you.",
  karneOdagi: ["want-to", "can-to", "more-better"],
  kulturelNot: {"tr": "ABD ve İngiltere'de teklif sonrası kibar bir karşı teklif vermek olağandır ve teklifin geri çekilmesine nadiren yol açar; rakamı piyasa verisine dayandırmak ve nihai teklifi yazılı istemek beklenir.", "en": "In the US and UK, making a polite counter-offer is normal and rarely leads to the offer being withdrawn; backing your figure with market data and asking for the final offer in writing is expected."},
};
