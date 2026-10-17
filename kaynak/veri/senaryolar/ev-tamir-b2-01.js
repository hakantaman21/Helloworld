// Senaryo şablonu: Anayasa bölüm 5. Zorunlu alanlar robot tarafından denetlenir (Y17). v0.16.0'da eklendi (B2).
export default {
  kimlik: "ev-tamir-b2-01",
  alan: "ev",
  seviye: "B2",
  baslik: {"tr": "Ev sahibiyle arıza ve ödeme görüşmesi", "en": "Discussing a repair with your landlord"},
  durum: {"tr": "Kombin üç gündür çalışmıyor ve ev sahibi henüz kimseyi göndermedi. Telefonda sorunu anlatıp bir tarih almalı ve masrafı kimin ödeyeceğini netleştirmelisin.", "en": "Your boiler has not worked for three days and the landlord has not sent anyone yet. On the phone you need to explain the problem, get a date and clarify who pays."},
  roller: { koc: {"tr": "Ev sahibi", "en": "Landlord"}, aksan: "Amerikan" },
  gorev: { aciklama: {"tr": "Sorunu ve ne zamandır sürdüğünü anlat, kesin bir tamir tarihi al ve masrafın kimde olduğunu sor.", "en": "Explain the problem and how long it has lasted, get a firm repair date and ask who covers the cost."}, kelimeler: ["since", "heating", "repair", "date", "contract", "pay"] },
  hedefKaliplar: [{"kalip": "It has been ... since ...", "anahtar": "has been"}, {"kalip": "Could you confirm ...?", "anahtar": "confirm"}, {"kalip": "According to the contract, ...", "anahtar": "according to"}],
  anahtarKelimeler: [{"en": "boiler", "tr": "kombi"}, {"en": "leak", "tr": "sızıntı"}, {"en": "plumber", "tr": "tesisatçı"}, {"en": "tenant", "tr": "kiracı"}, {"en": "urgent", "tr": "acil"}, {"en": "responsible", "tr": "sorumlu"}, {"en": "receipt", "tr": "fiş / makbuz"}],
  acilis: { koc: "Hi, I got your message about the heating. What’s going on exactly?", ipucu: ["The boiler has not been working since Monday.", "There is no hot water and the heating is off."], dallar: [{"kelimeler": ["since", "monday", "days"], "koc": "Since Monday? I didn’t realise it was that long."}, {"kelimeler": ["hot water", "heating"], "koc": "No hot water at all? That’s not good."}] },
  adimlar: [
    { koc: "I’m quite busy this week. Can it wait until next Wednesday?", ipucu: ["I’m afraid it can’t wait. It is really cold in the flat.", "It has been three days already, so it is quite urgent."], dallar: [{"kelimeler": ["cold", "urgent", "can’t wait", "cannot"], "koc": "Okay, I understand it’s urgent."}, {"kelimeler": ["days", "already"], "koc": "Right, three days is a long time."}] },
    { koc: "I can send a plumber on Friday morning. Is that okay?", ipucu: ["Friday is fine. Could you confirm the time, please?", "Is there any chance he could come tomorrow?"], dallar: [{"kelimeler": ["confirm", "time"], "koc": "Let’s say nine o’clock."}, {"kelimeler": ["tomorrow", "earlier", "sooner"], "koc": "I’ll ask him, but I can’t promise."}] },
    { koc: "By the way, who do you think should pay for this?", ipucu: ["According to the contract, repairs to the boiler are the landlord’s responsibility.", "I didn’t damage it, so I don’t think I should pay."], dallar: [{"kelimeler": ["contract", "responsibility", "responsible"], "koc": "Yes, you’re right, it’s in the contract."}, {"kelimeler": ["damage", "didn’t"], "koc": "Fair enough."}] },
  ],
  ustAdim: { koc: "The plumber says the boiler is very old. Should we replace it or repair it again?", ipucu: ["I think replacing it would be better in the long term.", "If it keeps breaking, it will cost more to repair it every time."] },
  sapmalar: [],
  seviyeVaryasyonlari: {"alt": "Ev sahibi hemen bir tarih verir; kullanıcı yalnız sorunu anlatır.", "ust": "Ev sahibi masrafı kiracıya yüklemeye çalışır; kullanıcı sözleşmeye dayanarak itiraz eder."},
  kapanis: "Okay, the plumber will come on Friday at nine, and I’ll cover the cost. Sorry for the trouble.",
  karneOdagi: ["gecmis-zaman", "did-yalin", "can-to"],
  kulturelNot: {"tr": "İngiltere ve ABD'de büyük tamirler çoğunlukla ev sahibinin sorumluluğundadır; konuşmayı sonradan yazılı (e-posta) olarak teyit etmek yaygın ve akıllıcadır.", "en": "In the UK and US, major repairs are usually the landlord’s responsibility; confirming the conversation in writing (by email) afterwards is common and wise."},
};
