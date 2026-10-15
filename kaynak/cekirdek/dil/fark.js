// Kelime düzeyinde fark: kullanıcının cümlesi ile doğru cümleyi karşılaştırır.
// Sonuç: [{ tur: 'ayni' | 'sil' | 'ekle', metin }]

function sade(kelime) {
  return kelime.toLowerCase().replace(/[.,!?;:]+$/g, '');
}

export function kelimeFarki(kaynak, hedef) {
  const a = kaynak.trim().split(/\s+/).filter(Boolean);
  const b = hedef.trim().split(/\s+/).filter(Boolean);
  const n = a.length;
  const m = b.length;
  const tablo = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      tablo[i][j] = sade(a[i]) === sade(b[j]) ? tablo[i + 1][j + 1] + 1 : Math.max(tablo[i + 1][j], tablo[i][j + 1]);
    }
  }
  const sonuc = [];
  const itele = (tur, metin) => {
    const son = sonuc[sonuc.length - 1];
    if (son && son.tur === tur) son.metin += ' ' + metin;
    else sonuc.push({ tur, metin });
  };
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (sade(a[i]) === sade(b[j])) { itele('ayni', b[j]); i++; j++; }
    else if (tablo[i + 1][j] >= tablo[i][j + 1]) { itele('sil', a[i]); i++; }
    else { itele('ekle', b[j]); j++; }
  }
  while (i < n) { itele('sil', a[i]); i++; }
  while (j < m) { itele('ekle', b[j]); j++; }
  return sonuc;
}

// İki cümlenin kelime benzerliği (0–1). Telaffuz tekrarlarında kullanılır.
export function benzerlik(a, b) {
  const x = a.trim().split(/\s+/).map(sade);
  const y = b.trim().split(/\s+/).map(sade);
  if (!x.length || !y.length) return 0;
  const kume = new Set(y);
  const ortak = x.filter((k) => kume.has(k)).length;
  return ortak / Math.max(x.length, y.length);
}
