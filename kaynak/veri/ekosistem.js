// v0.20.0 Uygulama ailesi: English Prime ve Yoldaş (Hakan'ın diğer uygulamaları). Adresler düzenleme modunda girilir
// (bu sürümde canlı adresler bilinmiyor; boşken kart "adres bekleniyor" der, kullanıcıyı boş sayfaya göndermez).
const UYGULAMALAR = [
  { kimlik: 'english-prime', ad: 'English Prime', ikon: 'kitap', renk: 3,
    kisa: { tr: 'Kelime, gramer ve okuma', en: 'Vocabulary, grammar and reading' },
    aciklama: { tr: 'Türkçe konuşanlar için kapsamlı İngilizce: kelime, gramer, okuma, dinleme ve sınav hazırlığı.', en: 'Comprehensive English for Turkish speakers: vocabulary, grammar, reading, listening and exam prep.' },
    neden: { tr: 'helloworld\'de konuşursun; English Prime temeli (kelime ve gramer) güçlendirir. Hata Hafızan\'daki konuları orada derinlemesine çalışabilirsin.', en: 'You speak in helloworld; English Prime builds the base (vocabulary and grammar). Study the topics from your Mistake Memory in depth there.' } },
  { kimlik: 'yoldas', ad: 'Yoldaş', ikon: 'yz', renk: 5,
    kisa: { tr: 'Akıllı asistan', en: 'Smart assistant' },
    aciklama: { tr: 'Yoldaş Akıllı Asistan: günlük işlerin, planların ve hatırlatmaların için kişisel yardımcın.', en: 'Yoldaş Smart Assistant: your personal helper for daily tasks, plans and reminders.' },
    neden: { tr: 'Pratik saatlerini günlük planına eklemek ve düzenli kalmak için.', en: 'To fit your practice times into your daily plan and stay consistent.' } },
];
// Uygulamalar arası üyelik bilgisi bu anahtarda paylaşılır (aynı alan adında yayımlanan uygulamalar okuyabilir).
// Biçim: { "<uygulama>": { paket, zaman } }. Gerçek doğrulama ödeme sağlayıcısı + sunucu ile yapılacak.
const PAYLASIM_ANAHTARI = 'ekosistem:uyelikler';
const VARSAYILAN_INDIRIM = 20;

export { UYGULAMALAR, PAYLASIM_ANAHTARI, VARSAYILAN_INDIRIM };
