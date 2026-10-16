// Y7: Veri şeması göçleri. Şema değişince yeni bir numara eklenir, GUNCEL_SEMA bir artar.
// Her göç bir önceki sürümün verisini alır, yenisini döndürür. Göçten önce depo otomatik yedek alır.

export const GUNCEL_SEMA = 11;

export const gocler = {
  // 0 → 1: ilk kurulum (boş depo)
  1: (eski) => ({
    ...(eski || {}),
    profil: {
      ad: '',
      kendiniTanim: null,
      seviye: 'A1',
      kurulumTamam: false,
      tanismaYapildi: false,
      mikrofonIzni: 'sorulmadi',
      ayarlar: {
        sabahSaati: '08:30',
        aksamSaati: '21:00',
        duzeltmeYogunlugu: 'orta',
        kocHizi: 'normal',
        tema: 'sistem',
        yaziliMod: false,
        saglayici: 'demo',
      },
    },
    hafiza: [],
    itirazlar: [],
    gunluk: {},
    gorusmeler: [],
    sonGorusme: null,
    yarimKalan: null,
    tamamlananSenaryolar: {},
    aramaDurumu: {},
    olcum: { aiCagrisi: 0, tahminiMaliyet: 0 },
  }),

  // 1 → 2: platform yönü (v0.2.0). Arayüz dili, ana dil, öğrenilen dil, rol ve 18 yaş / topluluk kuralları onayı.
  2: (eski) => ({
    ...eski,
    profil: {
      ...eski.profil,
      anaDil: eski.profil.anaDil || null,
      ogrenilenDil: 'en',
      rol: eski.profil.rol || 'ogrenen',
      yasOnayi: false,
      ayarlar: { ...eski.profil.ayarlar, arayuzDili: eski.profil.ayarlar.arayuzDili || null },
    },
  }),
  // 2 → 3: önceki sürümlerde yalnız demo vardı. Eski kanıtı arşivle, ölçüm diye kullanma.
  3: (eski) => {
    const temizle = (g) => g ? { ...g, saglayici: 'demo', olcumDurumu: 'demo', akicilik: null, telaffuz: null, seviyeTahmini: null, eklenenHafiza: 0 } : null;
    return {
      ...eski,
      demoArsivi: { hafiza: eski.hafiza, gunluk: eski.gunluk, gorusmeler: eski.gorusmeler, sonGorusme: eski.sonGorusme },
      hafiza: [],
      gunluk: Object.fromEntries(Object.entries(eski.gunluk || {}).map(([k, g]) => [k, { ...g, akicilik: [] }])),
      gorusmeler: (eski.gorusmeler || []).map(temizle),
      sonGorusme: temizle(eski.sonGorusme),
    };
  },
  // 3 → 4: kullanıcı görünüm tercihi. Eski kayıtlar korunur.
  4: (eski) => ({
    ...eski,
    profil: {
      ...eski.profil,
      ayarlar: { ...eski.profil.ayarlar, gorunum: eski.profil.ayarlar.gorunum || 'dengeli' },
    },
  }),
  // 4 → 5: kişisel dil hedefi; mevcut kayıtları değiştirmeden alan ekle.
  5: (eski) => ({
    ...eski,
    profil: { ...eski.profil, dilHedefi: eski.profil.dilHedefi || '' },
  }),
  // 5 → 6: "Kendimi tanıtıyorum" metni ayrı alana taşınır. kendiniTanim ilk açılıştaki konuşma rahatlığıdır
  // (hic/basit/rahat); v0.2.7 taslağında tanıtım metni de aynı alana yazılıyordu. Kod dışı değer tanıtıma taşınır.
  6: (eski) => {
    const kt = eski.profil.kendiniTanim, kod = ['hic', 'basit', 'rahat'].includes(kt);
    return {
      ...eski,
      profil: { ...eski.profil, kendiniTanim: kod ? kt : null, tanitimMetni: eski.profil.tanitimMetni || (kod || !kt ? '' : String(kt).slice(0, 300)) },
    };
  },
  // 6 → 7: test modu alanı (varsayılan kapalı). Test verisi gelişim kayıtlarından ayrı tutulur.
  7: (eski) => ({
    ...eski,
    test: eski.test || { acik: false, sohbetler: {}, engelli: [], sikayetler: [] },
  }),
  // 7 → 8: kullanıcının ilgi alanları (katalog kimlikleri; eşleşmede ortak ilgi için). Varsayılan boş.
  8: (eski) => ({
    ...eski,
    profil: { ...eski.profil, ilgiler: Array.isArray(eski.profil.ilgiler) ? eski.profil.ilgiler : [] },
  }),
  // 8 → 9: misafir girişi işareti, yazı boyutu ve gönderim öncesi düzeltme önerisi tercihi (varsayılan açık).
  9: (eski) => ({
    ...eski,
    profil: {
      ...eski.profil,
      misafir: Boolean(eski.profil.misafir),
      ayarlar: {
        ...eski.profil.ayarlar,
        yaziBoyutu: eski.profil.ayarlar.yaziBoyutu || 'normal',
        gonderimOneri: eski.profil.ayarlar.gonderimOneri !== false,
      },
    },
  }),
  // 9 → 10: profil fotoğrafları (cihazda, küçültülmüş JPEG) ve kaydedilen cümleler (cümle defteri).
  10: (eski) => ({
    ...eski,
    profil: { ...eski.profil, foto: eski.profil.foto || null, fotograflar: Array.isArray(eski.profil.fotograflar) ? eski.profil.fotograflar : [] },
    kayitliCumleler: Array.isArray(eski.kayitliCumleler) ? eski.kayitliCumleler : [],
  }),
  // 10 → 11: seçim rengi, zemin rengi ve orta düğme ataması (Ayarlar › Görünüm). Varsayılanlar mevcut görünümü korur.
  11: (eski) => ({
    ...eski,
    profil: {
      ...eski.profil,
      ayarlar: { ...eski.profil.ayarlar, secimRengi: eski.profil.ayarlar.secimRengi || 'altin', zemin: eski.profil.ayarlar.zemin || 'varsayilan', ortaDugme: eski.profil.ayarlar.ortaDugme || 'pratik' },
    },
  }),
};
