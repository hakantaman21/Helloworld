// TEST MODU içeriği: gerçek kişi DEĞİLDİR. Yalnız Ayarlar › Test modu açıkken görünür; her yerde "TEST" rozeti taşır.
// Yanıtlar önceden yazılmış kalıplardır (yapay zekâ değildir) ve "Otomatik test yanıtı" diye etiketlenir.
// Amaç: gerçek topluluk açılmadan önce Bağlantı ve mesajlaşma ekranlarını uçtan uca sınamak.
// Yeni test profili eklemek: diziye bir nesne ekle. Kod değişmez.

export const TEST_PROFILLERI = [
  {
    kimlik: 'test-lucia', kullanici: 'lucia.cocina', yas: 27, cinsiyet: 'k', saatDilimi: 'Europe/Madrid', sonAktifDk: 0, katildiGun: 412, meslek: { tr: 'Hemşire', en: 'Nurse' }, gezilecek: ['Istanbul', 'Kyoto'], rozetler: ['hizli', 'musait'], ad: 'Lucía', bas: 'L', renk: 1, bayrak: '🇪🇸', ten: 2, sac: 1, sacTip: 'uzun', ulke: { tr: 'İspanya · Valensiya', en: 'Spain · Valencia' },
    anaDil: 'es', ogrenilenDil: 'en', seviye: 'B1',
    ilgi: [{ tr: 'Yemek', en: 'Cooking' }, { tr: 'Seyahat', en: 'Travel' }, { tr: 'Fotoğraf', en: 'Photography' }],
    tanitim: { tr: 'Hemşireyim, iş için İngilizcemi geliştiriyorum. Akşamları yazışmayı severim.', en: 'I am a nurse improving my English for work. I like chatting in the evenings.' },
    yanitlar: ['That sounds nice! What did you do after that?', 'Haha, I understand you. In Spain we say the same thing.', 'Can you tell me more? I want to practise my questions too.'],
  },
  {
    kimlik: 'test-kenji', kullanici: 'kenji_osaka', yas: 20, cinsiyet: 'e', saatDilimi: 'Asia/Tokyo', sonAktifDk: 7, katildiGun: 38, meslek: { tr: 'Üniversite öğrencisi', en: 'University student' }, gezilecek: ['London', 'Istanbul'], rozetler: ['yeni'], ad: 'Kenji', bas: 'K', renk: 2, bayrak: '🇯🇵', ten: 1, sac: 4, sacTip: 'kisa', ulke: { tr: 'Japonya · Osaka', en: 'Japan · Osaka' },
    anaDil: 'ja', ogrenilenDil: 'en', seviye: 'A2',
    ilgi: [{ tr: 'Oyunlar', en: 'Games' }, { tr: 'Futbol', en: 'Football' }, { tr: 'Müzik', en: 'Music' }],
    tanitim: { tr: 'Üniversite öğrencisiyim. Yavaş yazarım, sabırlı olursan sevinirim.', en: 'University student. I type slowly, thank you for being patient.' },
    yanitlar: ['Oh, really? I like it too.', 'Sorry, my English is not good. Can you say it simple?', 'What is your favourite one?'],
  },
  {
    kimlik: 'test-amira', kullanici: 'amira.reads', yas: 31, cinsiyet: 'k', saatDilimi: 'Africa/Cairo', sonAktifDk: 0, katildiGun: 901, meslek: { tr: 'Öğretmen', en: 'Teacher' }, gezilecek: ['Istanbul', 'Edinburgh'], rozetler: ['hizli', 'ciddi'], ad: 'Amira', bas: 'A', renk: 3, bayrak: '🇪🇬', ten: 3, sac: 1, sacTip: 'ortu', ulke: { tr: 'Mısır · Kahire', en: 'Egypt · Cairo' },
    anaDil: 'ar', ogrenilenDil: 'en', seviye: 'B2',
    ilgi: [{ tr: 'Kitaplar', en: 'Books' }, { tr: 'Tarih', en: 'History' }, { tr: 'Kahve', en: 'Coffee' }],
    tanitim: { tr: 'Öğretmenim. Doğal konuşma kalıplarını öğrenmek istiyorum.', en: 'I am a teacher. I want to learn natural phrases people really use.' },
    yanitlar: ['Interesting! By the way, a more natural way to say it might be different. Shall I suggest one?', 'I have been to Istanbul once. The food was amazing.', 'What kind of books do you read?'],
  },
  {
    kimlik: 'test-tom', kullanici: 'tom_leeds', yas: 34, cinsiyet: 'e', saatDilimi: 'Europe/London', sonAktifDk: 3, katildiGun: 640, meslek: { tr: 'Yazılımcı', en: 'Software developer' }, gezilecek: ['Cappadocia', 'Izmir'], rozetler: ['hizli', 'musait', 'ciddi'], ad: 'Tom', bas: 'T', renk: 4, bayrak: '🇬🇧', ten: 1, sac: 3, sacTip: 'kisa', ulke: { tr: 'İngiltere · Leeds', en: 'United Kingdom · Leeds' },
    anaDil: 'en', ogrenilenDil: 'tr', seviye: 'A1',
    ilgi: [{ tr: 'Doğa yürüyüşü', en: 'Hiking' }, { tr: 'Kediler', en: 'Cats' }, { tr: 'Yemek', en: 'Cooking' }],
    tanitim: { tr: 'Ana dilim İngilizce, Türkçe öğreniyorum. Senin İngilizcene yardım ederim.', en: 'Native English speaker learning Turkish. Happy to help with your English.' },
    yanitlar: ['Nice one! That was very clear.', 'Quick tip: we usually say it a bit shorter in everyday English.', 'How do you say that in Turkish?'],
  },
  {
    kimlik: 'test-marie', kullanici: 'marie.lyon', yas: 24, cinsiyet: 'k', saatDilimi: 'Europe/Paris', sonAktifDk: 95, katildiGun: 210, meslek: { tr: 'Tasarımcı', en: 'Designer' }, gezilecek: ['New York', 'Istanbul'], rozetler: ['musait'], ad: 'Marie', bas: 'M', renk: 5, bayrak: '🇫🇷', ten: 1, sac: 2, sacTip: 'topuz', ulke: { tr: 'Fransa · Lyon', en: 'France · Lyon' },
    anaDil: 'fr', ogrenilenDil: 'en', seviye: 'B1',
    ilgi: [{ tr: 'Film', en: 'Films' }, { tr: 'Dans', en: 'Dance' }, { tr: 'Moda', en: 'Fashion' }],
    tanitim: { tr: 'Sesli mesajla pratik yapmayı seviyorum; telaffuzum üzerinde çalışıyorum.', en: 'I like practising with voice messages; I am working on my pronunciation.' },
    yanitlar: ['Ah, I love that film too!', 'My weekend was quiet. I went to the market and cooked.', 'Do you prefer films in English with or without subtitles?'],
  },
  {
    kimlik: 'test-carlos', kullanici: 'carlos.poa', yas: 29, cinsiyet: 'e', saatDilimi: 'America/Sao_Paulo', sonAktifDk: 1440, katildiGun: 75, meslek: { tr: 'Muhasebeci', en: 'Accountant' }, gezilecek: ['Toronto', 'Lisbon'], rozetler: ['ciddi'], ad: 'Carlos', bas: 'C', renk: 6, bayrak: '🇧🇷', ten: 4, sac: 4, sacTip: 'kisa', ulke: { tr: 'Brezilya · Porto Alegre', en: 'Brazil · Porto Alegre' },
    anaDil: 'pt', ogrenilenDil: 'en', seviye: 'A2',
    ilgi: [{ tr: 'Futbol', en: 'Football' }, { tr: 'Gitar', en: 'Guitar' }, { tr: 'Plaj', en: 'Beach' }],
    tanitim: { tr: 'İş görüşmesine hazırlanıyorum; kısa sorularla pratik yapalım.', en: 'Preparing for a job interview; let us practise with short questions.' },
    yanitlar: ['Good question! Let me think...', 'For my interview, they will ask about my experience. Can you ask me a question?', 'Thank you, this is very helpful for me.'],
  },
  {
    kimlik: 'test-emma', kullanici: 'emma.turkce', yas: 26, cinsiyet: 'k', saatDilimi: 'America/Chicago', sonAktifDk: 0, katildiGun: 155, meslek: { tr: 'Gazeteci', en: 'Journalist' }, gezilecek: ['Istanbul', 'Bodrum'], rozetler: ['hizli', 'musait'],
    ad: 'Emma', bas: 'E', renk: 2, bayrak: '🇺🇸', ten: 1, sac: 3, sacTip: 'uzun', ulke: { tr: 'ABD · Chicago', en: 'United States · Chicago' },
    anaDil: 'en', ogrenilenDil: 'tr', seviye: 'A2',
    ilgi: [{ tr: 'Yemek', en: 'Cooking' }, { tr: 'Seyahat', en: 'Travel' }, { tr: 'Podcast', en: 'Podcasts' }],
    tanitim: { tr: 'Gelecek yıl İstanbul\'a taşınıyorum. Türkçe öğrenirken İngilizcene yardım edebilirim.', en: 'Moving to Istanbul next year. Happy to help with your English while I learn Turkish.' },
    yanitlar: ['That is a great sentence! Only one small thing: we usually say it like this.', 'How do you say "see you later" in Turkish?', 'I love Turkish breakfast. What is your favourite part?'],
  },
  {
    kimlik: 'test-jack', kullanici: 'jack_sydney', yas: 38, cinsiyet: 'e', saatDilimi: 'Australia/Sydney', sonAktifDk: 22, katildiGun: 1210, meslek: { tr: 'Aşçı', en: 'Chef' }, gezilecek: ['Antalya', 'Gaziantep'], rozetler: ['ciddi'],
    ad: 'Jack', bas: 'J', renk: 4, bayrak: '🇦🇺', ten: 2, sac: 2, sacTip: 'kisa', ulke: { tr: 'Avustralya · Sidney', en: 'Australia · Sydney' },
    anaDil: 'en', ogrenilenDil: 'tr', seviye: 'A1',
    ilgi: [{ tr: 'Yemek', en: 'Cooking' }, { tr: 'Sörf', en: 'Surfing' }, { tr: 'Futbol', en: 'Football' }],
    tanitim: { tr: 'Türk mutfağına hayranım. Yavaş ve sade İngilizceyle konuşurum.', en: 'Big fan of Turkish food. I speak slow, simple English.' },
    yanitlar: ['G\'day! Nice to meet you.', 'Australians say "no worries" a lot. It means "it is okay".', 'What should I cook first: kebab or lahmacun?'],
  },
  {
    kimlik: 'test-priya', kullanici: 'priya.speaks', yas: 23, cinsiyet: 'k', saatDilimi: 'Asia/Kolkata', sonAktifDk: 0, katildiGun: 64, meslek: { tr: 'Mühendislik öğrencisi', en: 'Engineering student' }, gezilecek: ['Istanbul', 'Paris'], rozetler: ['yeni', 'musait'],
    ad: 'Priya', bas: 'P', renk: 5, bayrak: '🇮🇳', ten: 3, sac: 4, sacTip: 'topuz', ulke: { tr: 'Hindistan · Pune', en: 'India · Pune' },
    anaDil: 'en', ogrenilenDil: 'tr', seviye: 'A1',
    ilgi: [{ tr: 'Dizi', en: 'TV series' }, { tr: 'Yoga', en: 'Yoga' }, { tr: 'Müzik', en: 'Music' }],
    tanitim: { tr: 'Türk dizileriyle Türkçeye başladım. Her gün kısa sesli mesajla pratik yapmak isterim.', en: 'I started Turkish with Turkish TV series. I would like short daily voice-message practice.' },
    yanitlar: ['Merhaba! Is that correct?', 'Your English is very good. Where did you learn it?', 'Which Turkish series do you recommend?'],
  },
  {
    kimlik: 'test-yuna', kullanici: 'yuna.seoul', yas: 22, cinsiyet: 'k', saatDilimi: 'Asia/Seoul', sonAktifDk: 240, katildiGun: 18, meslek: { tr: 'Öğrenci', en: 'Student' }, gezilecek: ['Istanbul', 'Sydney'], rozetler: ['yeni'],
    ad: 'Yuna', bas: 'Y', renk: 1, bayrak: '🇰🇷', ten: 1, sac: 4, sacTip: 'uzun', ulke: { tr: 'Güney Kore · Seul', en: 'South Korea · Seoul' },
    anaDil: 'ko', ogrenilenDil: 'en', seviye: 'A2',
    ilgi: [{ tr: 'K-pop', en: 'K-pop' }, { tr: 'Kafe', en: 'Cafés' }, { tr: 'Çizim', en: 'Drawing' }],
    tanitim: { tr: 'İngilizce konuşurken utanıyorum, birlikte yavaş yavaş pratik yapalım.', en: 'I get shy speaking English. Let us practise slowly together.' },
    yanitlar: ['Hello! Nice to meet you :)', 'I like cafés too. Do you drink coffee or tea?', 'Sorry, can you explain this word?'],
  },
];

// Mesaj ekranındaki konu önerileri: kullanıcıya fikir verir, dokununca İngilizce açılış cümlesi kutuya yazılır.
export const TEST_KONULARI = [
  { baslik: { tr: 'Hafta sonu', en: 'Weekend' }, cumle: 'What did you do last weekend?' },
  { baslik: { tr: 'Yemek', en: 'Food' }, cumle: 'What is a typical breakfast in your country?' },
  { baslik: { tr: 'İş ve okul', en: 'Work and study' }, cumle: 'Why are you learning English?' },
];

// Dil Anları (HelloTalk "Moments" benzeri) TEST gönderileri. Bazı cümlelerde bilerek hata vardır:
// kullanıcı "Düzelt" ile düzeltme pratiği yapabilsin diye. saatOnce: gönderinin kaç saat önce paylaşıldığı (göreli).
// Beğeni ve yorum sayıları uydurulmaz: yalnız bu cihazdaki etkileşimler sayılır.
export const TEST_ANLARI = [
  { kimlik: 'an-1', duzeltilebilir: true, gorsel: { ikon: 'yildiz', kutu: 1, yazi: { tr: 'Sinema gecesi', en: 'Movie night' } }, yazar: 'test-kenji', saatOnce: 1, etiket: { tr: 'Günlük', en: 'Daily life' }, metin: 'Yesterday I go to the cinema with my friends. The film was very funny!' },
  { kimlik: 'an-2', gorsel: { ikon: 'hediye', kutu: 2, yazi: { tr: 'Ev yapımı paella', en: 'Homemade paella' } }, yazar: 'test-lucia', saatOnce: 3, etiket: { tr: 'Yemek', en: 'Food' }, metin: 'I made paella for my family today. What is a famous dish in your country?' },
  { kimlik: 'an-3', duzeltilebilir: true, gorsel: { ikon: 'hedef', kutu: 4, yazi: { tr: 'Yarın: iş görüşmesi', en: 'Tomorrow: interview' } }, yazar: 'test-carlos', saatOnce: 5, etiket: { tr: 'İş', en: 'Work' }, metin: 'Tomorrow I have a job interview. He want me to speak English. I am nervous!' },
  { kimlik: 'an-4', yazar: 'test-tom', saatOnce: 8, etiket: { tr: 'İpucu', en: 'Tip' }, metin: 'Native speaker tip: we often say "I\'m good, thanks" instead of "I am fine". Any questions? Happy to help!' },
  { kimlik: 'an-5', gorsel: { ikon: 'kitap', kutu: 3, yazi: { tr: 'İstanbul tarihi', en: 'History of Istanbul' } }, yazar: 'test-amira', saatOnce: 20, etiket: { tr: 'Kitap', en: 'Books' }, metin: 'I just finished a book about the history of Istanbul. Has anyone been there? I want to visit next year.' },
  { kimlik: 'an-7', yazar: 'test-emma', saatOnce: 2, duzeltilebilir: true, etiket: { tr: 'Türkçe', en: 'Turkish' }, gorsel: { ikon: 'kalem', kutu: 6, yazi: { tr: 'Türkçe defterim', en: 'My Turkish notebook' } }, metin: 'Bugün kahvaltı yaptım ve çay içtim. Türkçe çok güzel bir dil! (Is this correct? 🙏)' },
  { kimlik: 'an-8', yazar: 'test-priya', saatOnce: 11, etiket: { tr: 'Soru', en: 'Question' }, metin: 'How do you say "I miss you" in Turkish? Is it "seni özledim"?' },
  { kimlik: 'an-6', gorsel: { ikon: 'ses', kutu: 5, yazi: { tr: 'world · squirrel', en: 'world · squirrel' } }, yazar: 'test-marie', saatOnce: 26, etiket: { tr: 'Telaffuz', en: 'Pronunciation' }, metin: 'Which word is harder for you: "world" or "squirrel"? For me it is squirrel!' },
];

// Gönderilere önceden yazılmış TEST yorumları (yalnız test kullanıcıları arasında; gerçek değildir).
export const TEST_HAZIR_YORUMLAR = {
  'an-1': [{ yazar: 'test-tom', metin: 'Nice! Small fix: "Yesterday I went to the cinema."' }, { yazar: 'test-marie', metin: 'Which film did you watch?' }],
  'an-2': [{ yazar: 'test-jack', metin: 'Paella is amazing. Recipe please!' }],
  'an-3': [{ yazar: 'test-emma', metin: 'Good luck! Tip: "They want me to speak English."' }, { yazar: 'test-amira', metin: 'You will do great, Carlos.' }],
  'an-5': [{ yazar: 'test-lucia', metin: 'I went last year. Visit Balat!' }],
  'an-7': [{ yazar: 'test-tom', metin: 'Very good Turkish, Emma!' }],
};

// Kullanıcının kendi gönderisine gelen otomatik test yorumları (yazar, metin). "Otomatik test yanıtı" diye etiketlenir.
export const TEST_YORUM_KALIPLARI = [
  { yazar: 'test-tom', metin: 'Nice post! Your English is clear.' },
  { yazar: 'test-lucia', metin: 'Interesting! I would like to know more.' },
  { yazar: 'test-amira', metin: 'Thanks for sharing. Where did you learn that?' },
];
