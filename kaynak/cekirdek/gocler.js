// Y7: Veri şeması göçleri. Şema değişince yeni bir numara eklenir, GUNCEL_SEMA bir artar.
// Her göç bir önceki sürümün verisini alır, yenisini döndürür. Göçten önce depo otomatik yedek alır.

export const GUNCEL_SEMA = 2;

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
};
