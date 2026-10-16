// Senaryo şablonu: Anayasa bölüm 5. Zorunlu alanlar robot tarafından denetlenir (Y17). v0.12.0'da eklendi.
export default {
  kimlik: "sosyal-tanisma-01",
  alan: "sosyal",
  seviye: "A1",
  baslik: {"tr": "Bir partide tanışma", "en": "Meeting someone at a party"},
  durum: {"tr": "Bir arkadaşının doğum günü partisindesin ve yeni biriyle tanışıyorsun.", "en": "You are at a friend's birthday party and meeting someone new."},
  roller: { koc: {"tr": "Yeni tanıştığın kişi", "en": "A new friend"}, aksan: "Avustralya" },
  gorev: { aciklama: {"tr": "Kendini tanıt, nereli olduğunu ve neyi sevdiğini söyle.", "en": "Introduce yourself, say where you are from and what you like."}, kelimeler: ["name", "from", "like", "music", "work", "friend"] },
  hedefKaliplar: [{"kalip": "My name is ...", "anahtar": "My name"}, {"kalip": "I am from ...", "anahtar": "I am from"}, {"kalip": "I like ...", "anahtar": "I like"}],
  anahtarKelimeler: [{"en": "nice to meet you", "tr": "tanıştığıma memnun oldum"}, {"en": "hobby", "tr": "hobi"}, {"en": "weekend", "tr": "hafta sonu"}, {"en": "music", "tr": "müzik"}, {"en": "friend", "tr": "arkadaş"}],
  acilis: { koc: "Hi! I am Mia. I don't think we have met. What is your name?", ipucu: ["My name is Hakan.", "Hi Mia, I am Ayşe."], dallar: [{"kelimeler": ["name", "am"], "koc": "Nice to meet you!"}] },
  adimlar: [
    { koc: "Where are you from?", ipucu: ["I am from Turkey.", "I am from Izmir."], dallar: [{"kelimeler": ["turkey", "izmir", "istanbul", "ankara"], "koc": "Oh, I would love to visit."}] },
    { koc: "How do you know Sam?", ipucu: ["We work together.", "He is my neighbour."], dallar: [{"kelimeler": ["work"], "koc": "Ah, colleagues!"}, {"kelimeler": ["neighbour"], "koc": "Lucky you, he is so nice."}] },
    { koc: "What do you like doing at the weekend?", ipucu: ["I like music and films.", "I like walking by the sea."], dallar: [{"kelimeler": ["music", "films"], "koc": "Me too!"}, {"kelimeler": ["walking", "sea"], "koc": "That sounds lovely."}] },
  ],
  ustAdim: { koc: "Some friends are going to a concert next Saturday. Do you want to come with us?", ipucu: ["Yes, I would love to. What time?", "Thank you, but I am busy on Saturday."] },
  sapmalar: [],
  seviyeVaryasyonlari: { alt: "Kişi tek kelimelik cevaplarla da devam eder.", ust: "Kişi bir davette bulunur; kullanıcı kabul eder ya da kibarca reddeder." },
  kapanis: "It was great to meet you. Enjoy the party!",
  karneOdagi: ["people-are", "am-agree", "want-to"],
  kulturelNot: {"tr": "Avustralya'da tanışınca ilk adla hitap etmek normaldir; \"mate\" samimi bir sesleniştir.", "en": "In Australia using first names is normal; \"mate\" is a friendly way to address someone."},
};
