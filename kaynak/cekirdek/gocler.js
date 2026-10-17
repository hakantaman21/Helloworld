// Y7: Veri şeması göçleri. Şema değişince yeni bir numara eklenir, GUNCEL_SEMA bir artar.
// Her göç bir önceki sürümün verisini alır, yenisini döndürür. Göçten önce depo otomatik yedek alır.

export const GUNCEL_SEMA = 20;

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
  // 11 → 12: koyu üst bant rengi ve süzgeç (sekme) biçimi (Ayarlar › Görünüm).
  12: (eski) => ({
    ...eski,
    profil: {
      ...eski.profil,
      ayarlar: { ...eski.profil.ayarlar, bantRengi: eski.profil.ayarlar.bantRengi || 'yesil', suzgecBicimi: eski.profil.ayarlar.suzgecBicimi || 'klasik' },
    },
  }),
  // 12 → 13: tasarım paketi. Varsayılan "akıllı renk": üst bant her sayfanın kendi renginin koyu tonu (yeşil varsayılandan geçilir).
  13: (eski) => ({
    ...eski,
    profil: {
      ...eski.profil,
      ayarlar: {
        ...eski.profil.ayarlar,
        tasarimPaketi: eski.profil.ayarlar.tasarimPaketi || 'akilli',
        bantRengi: !eski.profil.ayarlar.bantRengi || eski.profil.ayarlar.bantRengi === 'yesil' ? 'sayfa' : eski.profil.ayarlar.bantRengi,
      },
    },
  }),
  // 13 → 14: orta düğme basılı tutma ipucunun kaç kez gösterildiği; test sohbetlerinde okunma zamanları.
  14: (eski) => ({
    ...eski,
    profil: { ...eski.profil, ayarlar: { ...eski.profil.ayarlar, ortaIpucu: eski.profil.ayarlar.ortaIpucu || 0 } },
    test: eski.test ? { ...eski.test, okundu: eski.test.okundu || {} } : eski.test,
  }),
  // 14 → 15: koç sesi (cihazdaki İngilizce ses adı ya da null = otomatik) ve Bağlan seçiminin kalıcı kaydı.
  15: (eski) => ({
    ...eski,
    profil: { ...eski.profil, ayarlar: { ...eski.profil.ayarlar, kocSesi: eski.profil.ayarlar.kocSesi || null, kesfetSecimi: eski.profil.ayarlar.kesfetSecimi || null } },
  }),
  // 15 → 16: profil kapak görseli ('sistem-N' ya da 'mdy:<kimlik>'; null = varsayılan sistem kapağı). Dil Anları gönderisinde fotolar dizisi.
  16: (eski) => ({
    ...eski,
    profil: { ...eski.profil, kapak: eski.profil.kapak || null },
    test: eski.test ? { ...eski.test, anlar: (eski.test.anlar || []).map((a) => ({ ...a, fotolar: Array.isArray(a.fotolar) ? a.fotolar : [] })) } : eski.test,
  }),
  // 16 → 17: görüşme kayıtlarına kalıcı kimlik (karne adresi sıra numarasına bağlı kalmasın).
  17: (eski) => {
    const gorusmeler = (eski.gorusmeler || []).map((g, i) => (g && !g.kimlik ? { ...g, kimlik: `g-eski${i}${Math.random().toString(36).slice(2, 6)}` } : g));
    const son = eski.sonGorusme && !eski.sonGorusme.kimlik && gorusmeler[0] && gorusmeler[0].tarih === eski.sonGorusme.tarih ? { ...eski.sonGorusme, kimlik: gorusmeler[0].kimlik } : eski.sonGorusme;
    return { ...eski, gorusmeler, sonGorusme: son };
  },
  // 17 → 18 (v0.19.0): rehberlik durumu — bildirim kutusu, kullanım sayaçları (cihazda), "Yeni" etiketleri, tur, ipucu ayarları.
  // Kurulumu tamamlamış kullanıcı güncelleme yapmıştır: önceki sürüm 0.18.0 sayılır (yenilikler gösterilir, tur kendiliğinden açılmaz).
  // İlk kurulumda sonSurum boş kalır; açılışta güncel sürüm yazılır ve hiçbir şey "Yeni" sayılmaz.
  18: (eski) => {
    const kurulu = Boolean(eski && eski.profil && eski.profil.kurulumTamam);
    return {
      ...eski,
      rehber: eski.rehber || {
        kurulum: Date.now(), sonSurum: kurulu ? '0.18.0' : null, yeniler: {}, yenilikBekliyor: null, kutu: [], durum: {}, kullanim: {},
        gorulenIpucu: [], tur: { tamam: kurulu }, ayar: { ipucu: true, hatirlatma: true, bilgi: true, oneri: true }, plan: {}, sonAramalar: [],
      },
    };
  },
  // 18 → 19 (v0.21.0): senaryo başına kalıcı kullanım özeti (v.senaryoIst). Eski görüşmelerden ve tamamlanan
  // senaryolardan doldurulur. Alanlar cekirdek/senaryo-istatistik.js ile aynıdır (göç depodan önce çalıştığı için
  // o modülü çağıramaz): d deneme · t tamam · i ilk · s son (ms) · sn süre · c cümle · dz düzeltme.
  19: (eski) => {
    if (eski.senaryoIst) return eski;
    const ist = {};
    const zamani = (tarih) => { const z = Date.parse(`${tarih}T12:00:00`); return Number.isFinite(z) ? z : Date.now(); };
    [...(eski.gorusmeler || [])].reverse().forEach((g) => {
      if (!g || g.tur !== 'senaryo' || !g.senaryoId || !(g.cumleler || []).length) return;
      const k = ist[g.senaryoId] || { d: 0, t: 0, i: 0, s: 0, sn: 0, c: 0, dz: 0 };
      const z = zamani(g.tarih);
      k.d += 1; if (g.gorevTamam) k.t += 1; k.i = k.i || z; k.s = Math.max(k.s, z);
      k.sn += Math.round(Number(g.sureSn) || 0); k.c += (g.cumleler || []).length; k.dz += (g.duzeltmeler || []).length;
      ist[g.senaryoId] = k;
    });
    Object.entries(eski.tamamlananSenaryolar || {}).forEach(([id, tarih]) => {
      if (ist[id]) return;
      const z = zamani(tarih);
      ist[id] = { d: 1, t: 1, i: z, s: z, sn: 0, c: 0, dz: 0 };
    });
    return { ...eski, senaryoIst: ist };
  },
  // 19 → 20 (v0.26.0): Destek merkezi (v.destek). Önceki test şikâyetleri geçmişe "alındı" olarak taşınır;
  // alanlar cekirdek/destek.js ile aynıdır (göç depodan önce çalıştığı için o modülü çağıramaz).
  20: (eski) => {
    if (eski.destek) return eski;
    const eskiler = ((eski.test && eski.test.sikayetler) || []).filter((x) => x && typeof x === 'object').map((x, i) => ({
      kimlik: `d-eski${i}`, tur: 'sikayet', kategori: x.neden || null, metin: '', hedef: x.kimlik ? { kimlik: x.kimlik, tur: 'kisi' } : null,
      zaman: Number(x.zaman) || Date.now(), durum: 'alindi', onem: 'normal', yol: 'yonetici', nedenler: [], yanitlar: [],
    }));
    return { ...eski, destek: { kayitlar: eskiler } };
  },
};
