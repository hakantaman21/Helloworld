// Y7: Veri şeması göçleri. Şema değişince yeni bir numara eklenir, GUNCEL_SEMA bir artar.
// Her göç bir önceki sürümün verisini alır, yenisini döndürür. Göçten önce depo otomatik yedek alır.

export const GUNCEL_SEMA = 1;

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
};
