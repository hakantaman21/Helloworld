// Sohbet başlığındaki hızlı yanıt önerileri (HelloTalk / akıllı yanıt esinli). Kural tabanlıdır, yapay zekâ değildir.
// Karşı tarafın son mesajına göre ilk eşleşen kalıp seçilir; dokununca öneri yazı kutusuna gelir, kullanıcı düzenleyip gönderir.
// Öneriler öğrenilen dilde (İngilizce) yazılır: kalıp cümle pratiği de olsun diye.
export const ACILIS_ONERILERI = ['Hi! 👋 How are you?', 'Where are you from?', 'Why are you learning a new language?', 'What do you do for fun?'];

export const YANIT_KALIPLARI = [
  { desen: /how (are you|is your day|was your day)|day going/i, oneriler: ["I'm good, thanks! And you?", 'Pretty busy today 😅', 'Great, thanks for asking!'] },
  { desen: /favou?rite/i, oneriler: ['My favourite is…', 'Hard to choose!', 'What about yours?'] },
  { desen: /how do you say|in turkish/i, oneriler: ['In Turkish we say…', 'Good question! It is…', 'Let me write it for you:'] },
  { desen: /where.*(from|live)/i, oneriler: ["I'm from Turkey 🇹🇷", 'I live in Istanbul. And you?', 'Have you ever been to Turkey?'] },
  { desen: /thank/i, oneriler: ["You're welcome! 😊", 'No problem!', 'Happy to help.'] },
  { desen: /(sorry|explain|simple)/i, oneriler: ['No worries!', 'Let me say it more simply:', 'Take your time 🙂'] },
  { desen: /\?\s*$/, oneriler: ['Yes, I do!', 'Not really. And you?', 'Good question, let me think…', 'Can you explain that?'] },
];

export const GENEL_ONERILER = ["That's interesting!", 'Tell me more 🙂', 'Haha, really?', 'Same here!'];

export function hizliYanitlar(sonMesaj) {
  if (!sonMesaj) return ACILIS_ONERILERI;
  const kalip = YANIT_KALIPLARI.find((k) => k.desen.test(sonMesaj.metin));
  return kalip ? kalip.oneriler : GENEL_ONERILER;
}
