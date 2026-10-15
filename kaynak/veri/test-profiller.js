// TEST MODU içeriği: gerçek kişi DEĞİLDİR. Yalnız Ayarlar › Test modu açıkken görünür; her yerde "TEST" rozeti taşır.
// Yanıtlar önceden yazılmış kalıplardır (yapay zekâ değildir) ve "Otomatik test yanıtı" diye etiketlenir.
// Amaç: gerçek topluluk açılmadan önce Bağlantı ve mesajlaşma ekranlarını uçtan uca sınamak.
// Yeni test profili eklemek: diziye bir nesne ekle. Kod değişmez.

export const TEST_PROFILLERI = [
  {
    kimlik: 'test-lucia', ad: 'Lucía', bas: 'L', renk: 1, ulke: { tr: 'İspanya · Valensiya', en: 'Spain · Valencia' },
    anaDil: 'es', ogrenilenDil: 'en', seviye: 'B1',
    ilgi: [{ tr: 'Yemek', en: 'Cooking' }, { tr: 'Seyahat', en: 'Travel' }, { tr: 'Fotoğraf', en: 'Photography' }],
    tanitim: { tr: 'Hemşireyim, iş için İngilizcemi geliştiriyorum. Akşamları yazışmayı severim.', en: 'I am a nurse improving my English for work. I like chatting in the evenings.' },
    yanitlar: ['That sounds nice! What did you do after that?', 'Haha, I understand you. In Spain we say the same thing.', 'Can you tell me more? I want to practise my questions too.'],
  },
  {
    kimlik: 'test-kenji', ad: 'Kenji', bas: 'K', renk: 2, ulke: { tr: 'Japonya · Osaka', en: 'Japan · Osaka' },
    anaDil: 'ja', ogrenilenDil: 'en', seviye: 'A2',
    ilgi: [{ tr: 'Oyunlar', en: 'Games' }, { tr: 'Futbol', en: 'Football' }, { tr: 'Müzik', en: 'Music' }],
    tanitim: { tr: 'Üniversite öğrencisiyim. Yavaş yazarım, sabırlı olursan sevinirim.', en: 'University student. I type slowly, thank you for being patient.' },
    yanitlar: ['Oh, really? I like it too.', 'Sorry, my English is not good. Can you say it simple?', 'What is your favourite one?'],
  },
  {
    kimlik: 'test-amira', ad: 'Amira', bas: 'A', renk: 3, ulke: { tr: 'Mısır · Kahire', en: 'Egypt · Cairo' },
    anaDil: 'ar', ogrenilenDil: 'en', seviye: 'B2',
    ilgi: [{ tr: 'Kitaplar', en: 'Books' }, { tr: 'Tarih', en: 'History' }, { tr: 'Kahve', en: 'Coffee' }],
    tanitim: { tr: 'Öğretmenim. Doğal konuşma kalıplarını öğrenmek istiyorum.', en: 'I am a teacher. I want to learn natural phrases people really use.' },
    yanitlar: ['Interesting! By the way, a more natural way to say it might be different. Shall I suggest one?', 'I have been to Istanbul once. The food was amazing.', 'What kind of books do you read?'],
  },
  {
    kimlik: 'test-tom', ad: 'Tom', bas: 'T', renk: 4, ulke: { tr: 'İngiltere · Leeds', en: 'United Kingdom · Leeds' },
    anaDil: 'en', ogrenilenDil: 'tr', seviye: 'A1',
    ilgi: [{ tr: 'Doğa yürüyüşü', en: 'Hiking' }, { tr: 'Kediler', en: 'Cats' }, { tr: 'Yemek', en: 'Cooking' }],
    tanitim: { tr: 'Ana dilim İngilizce, Türkçe öğreniyorum. Senin İngilizcene yardım ederim.', en: 'Native English speaker learning Turkish. Happy to help with your English.' },
    yanitlar: ['Nice one! That was very clear.', 'Quick tip: we usually say it a bit shorter in everyday English.', 'How do you say that in Turkish?'],
  },
  {
    kimlik: 'test-marie', ad: 'Marie', bas: 'M', renk: 5, ulke: { tr: 'Fransa · Lyon', en: 'France · Lyon' },
    anaDil: 'fr', ogrenilenDil: 'en', seviye: 'B1',
    ilgi: [{ tr: 'Film', en: 'Films' }, { tr: 'Dans', en: 'Dance' }, { tr: 'Moda', en: 'Fashion' }],
    tanitim: { tr: 'Sesli mesajla pratik yapmayı seviyorum; telaffuzum üzerinde çalışıyorum.', en: 'I like practising with voice messages; I am working on my pronunciation.' },
    yanitlar: ['Ah, I love that film too!', 'My weekend was quiet. I went to the market and cooked.', 'Do you prefer films in English with or without subtitles?'],
  },
  {
    kimlik: 'test-carlos', ad: 'Carlos', bas: 'C', renk: 6, ulke: { tr: 'Brezilya · Porto Alegre', en: 'Brazil · Porto Alegre' },
    anaDil: 'pt', ogrenilenDil: 'en', seviye: 'A2',
    ilgi: [{ tr: 'Futbol', en: 'Football' }, { tr: 'Gitar', en: 'Guitar' }, { tr: 'Plaj', en: 'Beach' }],
    tanitim: { tr: 'İş görüşmesine hazırlanıyorum; kısa sorularla pratik yapalım.', en: 'Preparing for a job interview; let us practise with short questions.' },
    yanitlar: ['Good question! Let me think...', 'For my interview, they will ask about my experience. Can you ask me a question?', 'Thank you, this is very helpful for me.'],
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
  { kimlik: 'an-1', yazar: 'test-kenji', saatOnce: 1, etiket: { tr: 'Günlük', en: 'Daily life' }, metin: 'Yesterday I go to the cinema with my friends. The film was very funny!' },
  { kimlik: 'an-2', yazar: 'test-lucia', saatOnce: 3, etiket: { tr: 'Yemek', en: 'Food' }, metin: 'I made paella for my family today. What is a famous dish in your country?' },
  { kimlik: 'an-3', yazar: 'test-carlos', saatOnce: 5, etiket: { tr: 'İş', en: 'Work' }, metin: 'Tomorrow I have a job interview. He want me to speak English. I am nervous!' },
  { kimlik: 'an-4', yazar: 'test-tom', saatOnce: 8, etiket: { tr: 'İpucu', en: 'Tip' }, metin: 'Native speaker tip: we often say "I\'m good, thanks" instead of "I am fine". Any questions? Happy to help!' },
  { kimlik: 'an-5', yazar: 'test-amira', saatOnce: 20, etiket: { tr: 'Kitap', en: 'Books' }, metin: 'I just finished a book about the history of Istanbul. Has anyone been there? I want to visit next year.' },
  { kimlik: 'an-6', yazar: 'test-marie', saatOnce: 26, etiket: { tr: 'Telaffuz', en: 'Pronunciation' }, metin: 'Which word is harder for you: "world" or "squirrel"? For me it is squirrel!' },
];

// Kullanıcının kendi gönderisine gelen otomatik test yorumları (yazar, metin). "Otomatik test yanıtı" diye etiketlenir.
export const TEST_YORUM_KALIPLARI = [
  { yazar: 'test-tom', metin: 'Nice post! Your English is clear.' },
  { yazar: 'test-lucia', metin: 'Interesting! I would like to know more.' },
  { yazar: 'test-amira', metin: 'Thanks for sharing. Where did you learn that?' },
];
