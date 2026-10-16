// Senaryo şablonu: Anayasa bölüm 5. Zorunlu alanlar robot tarafından denetlenir (Y17). v0.12.0'da eklendi.
export default {
  kimlik: "egitim-kurs-01",
  alan: "egitim",
  seviye: "A2",
  baslik: {"tr": "Dil kursuna kayıt", "en": "Enrolling in a language course"},
  durum: {"tr": "Bir dil okulunun danışma masasındasın; kursa kaydolmak istiyorsun.", "en": "You are at a language school's front desk and want to sign up for a course."},
  roller: { koc: {"tr": "Okul danışmanı", "en": "School adviser"}, aksan: "İrlanda" },
  gorev: { aciklama: {"tr": "Seviyeni söyle, ders saatlerini ve ücreti sor, bir sınıf seç.", "en": "Say your level, ask about class times and the fee, and choose a class."}, kelimeler: ["course", "level", "evening", "morning", "fee", "week"] },
  hedefKaliplar: [{"kalip": "I would like to join a ... course.", "anahtar": "I would like"}, {"kalip": "What time are the classes?", "anahtar": "What time"}, {"kalip": "How much does it cost?", "anahtar": "How much"}],
  anahtarKelimeler: [{"en": "course", "tr": "kurs"}, {"en": "level test", "tr": "seviye sınavı"}, {"en": "fee", "tr": "ücret"}, {"en": "timetable", "tr": "ders programı"}, {"en": "certificate", "tr": "sertifika"}, {"en": "beginner", "tr": "başlangıç"}],
  acilis: { koc: "Hi, welcome to Green Street Language School. How can I help?", ipucu: ["I would like to join an English course.", "I want to improve my speaking."], dallar: [{"kelimeler": ["course", "join"], "koc": "Great, we have lots of courses."}, {"kelimeler": ["speaking"], "koc": "Our conversation classes are perfect for that."}] },
  adimlar: [
    { koc: "What is your level, do you know?", ipucu: ["I think I am A2.", "I am not sure. Can I take a test?"], dallar: [{"kelimeler": ["a2", "think"], "koc": "Okay, pre-intermediate."}, {"kelimeler": ["test", "sure"], "koc": "Of course, the test takes twenty minutes."}] },
    { koc: "We have morning classes and evening classes. Which is better for you?", ipucu: ["Evening is better, I work in the day.", "What time are the morning classes?"], dallar: [{"kelimeler": ["evening", "work"], "koc": "The evening class is from six to eight."}, {"kelimeler": ["morning", "time"], "koc": "They are from nine to twelve."}] },
    { koc: "The course is ten weeks long. Would you like to know the fee?", ipucu: ["Yes, how much does it cost?", "Is there a discount for students?"], dallar: [{"kelimeler": ["much", "cost"], "koc": "It is four hundred euros."}, {"kelimeler": ["discount", "students"], "koc": "Yes, ten percent for students."}] },
  ],
  ustAdim: { koc: "The evening class is full this term. You can join the waiting list or start online. What would you prefer?", ipucu: ["I will join the waiting list.", "Can I try the online class first?"] },
  sapmalar: [],
  seviyeVaryasyonlari: { alt: "Danışman seçenekleri tek tek sunar.", ust: "Danışman sınıfın dolu olduğunu söyler; kullanıcı alternatif seçer." },
  kapanis: "Perfect, you are all signed up. See you on Monday!",
  karneOdagi: ["how-much", "want-to", "ucuncu-tekil"],
  kulturelNot: {"tr": "İrlanda'da birçok dil okulu ilk derste seviye sınavı yapar; sertifika için devam şartı olabilir.", "en": "Many language schools in Ireland test your level on the first day; certificates may require attendance."},
};
