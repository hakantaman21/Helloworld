// İlgi alanı kataloğu (HelloTalk "Hobiler"). Kullanıcı en çok ILGI_SINIRI tane seçer; eşleşmede ortak ilgi sayılır.
// Test profillerindeki ilgiler İngilizce adlarıyla bu kataloğa bağlanır (ilgiKimligi). Yeni ilgi: diziye ekle.
export const ILGI_SINIRI = 8;

export const ILGI_ALANLARI = [
  { kimlik: 'yemek', simge: '🍳', tr: 'Yemek', en: 'Cooking' },
  { kimlik: 'seyahat', simge: '✈️', tr: 'Seyahat', en: 'Travel' },
  { kimlik: 'muzik', simge: '🎵', tr: 'Müzik', en: 'Music' },
  { kimlik: 'film', simge: '🎬', tr: 'Film', en: 'Films' },
  { kimlik: 'dizi', simge: '📺', tr: 'Dizi', en: 'TV series' },
  { kimlik: 'kitap', simge: '📚', tr: 'Kitaplar', en: 'Books' },
  { kimlik: 'futbol', simge: '⚽', tr: 'Futbol', en: 'Football' },
  { kimlik: 'oyun', simge: '🎮', tr: 'Oyunlar', en: 'Games' },
  { kimlik: 'fotograf', simge: '📷', tr: 'Fotoğraf', en: 'Photography' },
  { kimlik: 'tarih', simge: '🏛️', tr: 'Tarih', en: 'History' },
  { kimlik: 'kahve', simge: '☕', tr: 'Kahve', en: 'Coffee' },
  { kimlik: 'kafe', simge: '🧁', tr: 'Kafe', en: 'Cafés' },
  { kimlik: 'yuruyus', simge: '🥾', tr: 'Doğa yürüyüşü', en: 'Hiking' },
  { kimlik: 'kedi', simge: '🐱', tr: 'Kediler', en: 'Cats' },
  { kimlik: 'dans', simge: '💃', tr: 'Dans', en: 'Dance' },
  { kimlik: 'moda', simge: '👗', tr: 'Moda', en: 'Fashion' },
  { kimlik: 'gitar', simge: '🎸', tr: 'Gitar', en: 'Guitar' },
  { kimlik: 'plaj', simge: '🏖️', tr: 'Plaj', en: 'Beach' },
  { kimlik: 'podcast', simge: '🎙️', tr: 'Podcast', en: 'Podcasts' },
  { kimlik: 'sorf', simge: '🏄', tr: 'Sörf', en: 'Surfing' },
  { kimlik: 'yoga', simge: '🧘', tr: 'Yoga', en: 'Yoga' },
  { kimlik: 'kpop', simge: '🎤', tr: 'K-pop', en: 'K-pop' },
  { kimlik: 'cizim', simge: '🎨', tr: 'Çizim', en: 'Drawing' },
  { kimlik: 'teknoloji', simge: '💻', tr: 'Teknoloji', en: 'Technology' },
  { kimlik: 'spor', simge: '🏋️', tr: 'Spor', en: 'Fitness' },
  { kimlik: 'bilim', simge: '🔬', tr: 'Bilim', en: 'Science' },
];

export function ilgiKimligi(ilgi) {
  const bulunan = ILGI_ALANLARI.find((a) => a.en === ilgi.en || a.tr === ilgi.tr);
  return bulunan ? bulunan.kimlik : null;
}
