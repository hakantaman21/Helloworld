// v0.21.0 Senaryo başına kalıcı kullanım bilgisi: deneme, tamamlama, ilk/son kullanım, süre, cümle ve düzeltme sayısı.
// Görüşme kayıtları (v.gorusmeler) yalnız son 30'u tutar; bu yüzden özet ayrı ve sınırsız saklanır (v.senaryoIst).
// Başarı oranı = görevi tamamlanan deneme / toplam deneme. Bir deneme = senaryoda en az bir cümle kurulan görüşme.
import { al } from './depo.js';

const bos = () => ({ d: 0, t: 0, i: 0, s: 0, sn: 0, c: 0, dz: 0 });

// Göç ve sonucuIsle içinden çağrılır: veriyi doğrudan değiştirir (iç içe yazma olmasın diye degistir() kullanmaz).
function isle(v, ozet, zaman = Date.now()) {
  if (!ozet || ozet.tur !== 'senaryo' || !ozet.senaryoId) return;
  const k = { ...bos(), ...((v.senaryoIst || {})[ozet.senaryoId] || {}) };
  k.d += 1;
  if (ozet.gorevTamam) k.t += 1;
  k.i = k.i || zaman;
  k.s = Math.max(k.s || 0, zaman);
  k.sn += Math.round(Number(ozet.sureSn) || 0);
  k.c += (ozet.cumleler || []).length;
  k.dz += (ozet.duzeltmeler || []).length;
  v.senaryoIst = { ...(v.senaryoIst || {}), [ozet.senaryoId]: k };
}

function istatistik(id) {
  const k = { ...bos(), ...((al().senaryoIst || {})[id] || {}) };
  return {
    deneme: k.d, tamam: k.t, ilk: k.i || null, son: k.s || null, sureSn: k.sn, cumle: k.c, duzeltme: k.dz,
    oran: k.d ? Math.round((k.t / k.d) * 100) : null,
    duzeltmeOrani: k.c ? Math.round((k.dz / k.c) * 10) / 10 : null,
    // 'tamam': en az bir kez görevi tamamladı · 'denendi': denedi ama tamamlamadı · null: hiç denemedi
    durum: k.t ? 'tamam' : k.d ? 'denendi' : null,
  };
}
function sonGorusmeler(id, n = 3) {
  return (al().gorusmeler || []).filter((g) => g && g.tur === 'senaryo' && g.senaryoId === id).slice(0, n);
}

export { isle, istatistik, sonGorusmeler };
