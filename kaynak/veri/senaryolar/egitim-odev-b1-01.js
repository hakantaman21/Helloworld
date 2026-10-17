// Senaryo şablonu: Anayasa bölüm 5. v0.20.0'da eklendi (B1).
export default {
  kimlik: "egitim-odev-b1-01",
  alan: "egitim",
  seviye: "B1",
  baslik: {"tr": "Ödev için ek süre", "en": "Asking for an extension"},
  durum: {"tr": "Ödevinin teslim tarihi yarın ama hastalandığın için bitiremedin; öğretmeninle konuşuyorsun.", "en": "Your assignment is due tomorrow but you couldn't finish because you were ill; you talk to your teacher."},
  roller: { koc: {"tr": "Öğretmen", "en": "Teacher"}, aksan: "Amerikan" },
  gorev: { aciklama: {"tr": "Durumu açıkla, ne kadar bitirdiğini söyle ve makul bir ek süre iste.", "en": "Explain the situation, say how much you've done and ask for a reasonable extension."}, kelimeler: ["assignment", "ill", "finished", "deadline", "extension", "friday"] },
  hedefKaliplar: [{"kalip": "I was wondering if I could ...", "anahtar": "I was wondering"}, {"kalip": "I've already finished ...", "anahtar": "already finished"}, {"kalip": "I'll make sure that ...", "anahtar": "make sure"}],
  anahtarKelimeler: [{"en": "assignment", "tr": "ödev"}, {"en": "deadline", "tr": "son teslim tarihi"}, {"en": "extension", "tr": "ek süre"}, {"en": "draft", "tr": "taslak"}, {"en": "doctor's note", "tr": "doktor raporu"}, {"en": "submit", "tr": "teslim etmek"}],
  acilis: { koc: "Hi, come in. What can I do for you?", ipucu: ["I was wondering if I could get a few more days for the essay.", "I need to talk to you about the assignment."], dallar: [{"kelimeler": ["days", "wondering", "essay"], "koc": "Okay, tell me what happened."}, {"kelimeler": ["assignment", "talk"], "koc": "Sure, what's going on?"}] },
  adimlar: [
    { koc: "Why couldn't you finish it on time?", ipucu: ["I was ill for most of last week.", "I had a high fever and couldn't work for four days."], dallar: [{"kelimeler": ["ill", "week"], "koc": "I'm sorry to hear that. Are you feeling better?"}, {"kelimeler": ["fever", "days"], "koc": "That sounds tough."}] },
    { koc: "How much have you done so far?", ipucu: ["I've already finished the first draft.", "I've done the research, but I still need to write the conclusion."], dallar: [{"kelimeler": ["draft", "finished"], "koc": "Good, that's a solid start."}, {"kelimeler": ["research", "conclusion"], "koc": "So you're more than halfway."}] },
    { koc: "When do you think you could hand it in?", ipucu: ["Could I submit it on Friday?", "I'll make sure it's ready by Monday morning."], dallar: [{"kelimeler": ["friday"], "koc": "Friday is fine."}, {"kelimeler": ["monday", "ready"], "koc": "Monday is the latest I can accept."}] },
  ],
  ustAdim: { koc: "The school rules say I need a doctor's note for an extension. What can you do?", ipucu: ["I can bring the note from my doctor tomorrow.", "I didn't go to a doctor. Is there another way?"] },
  sapmalar: [],
  seviyeVaryasyonlari: { alt: "Öğretmen anlayışlıdır, hemen ek süre verir.", ust: "Öğretmen doktor raporu ister; kullanıcı çözüm önerir." },
  kapanis: "Alright, I'll update the deadline for you. Take care of yourself!",
  karneOdagi: ["gecmis-zaman", "did-yalin", "can-to"],
  kulturelNot: {"tr": "ABD'de ek süreyi son günü beklemeden, gerekçe ve önerilen yeni tarihle birlikte istemek saygılı ve olağan kabul edilir.", "en": "In the US asking for an extension early, with a reason and a proposed new date, is seen as respectful and normal."},
};
