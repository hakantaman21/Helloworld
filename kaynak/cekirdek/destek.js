// v0.26.0 Destek merkezi (Hakan, 17.10.2026): kullanıcı şikâyet, hata, öneri ve görüşlerini kategorili gönderir;
// geçmişini görür, sonuçlanmamış kaydını geri alır; yönetimin yanıtı kaydın altına ve bildirim kutusuna ("Destek") düşer.
// Şimdilik kayıtlar cihazda tutulur (v.destek). Sunucu açılınca: gönderim = sunucuya kayıt, yanıt = yönetici paneli.
// onemSiniflandir saf işlevdir; sunucuda aynen ön ayıklama için kullanılır.
import { al, degistir } from './depo.js';
import { yeniKimlik } from './kimlik.js';
import { kutuyaEkle } from './rehber.js';
import { NEDEN_ONEMI, ACIL_SOZCUKLER, SPAM_SOZCUKLER, TEST_YANITLARI } from '../veri/destek-kurallari.js';
import { testModuAcik } from './test-modu.js';
import { kuyruga } from './sunucu.js';

const TEST_YANIT_GECIKMESI = 8000;

export const DESTEK_SINIRI = 200;
export const GERI_ALINABILIR = ['alindi', 'inceleniyor'];
const SIRA = ['dusuk', 'normal', 'yuksek', 'acil'];
const yuksel = (a, b) => (SIRA.indexOf(b) > SIRA.indexOf(a) ? b : a);

// { onem: 'acil'|'yuksek'|'normal'|'dusuk', yol: 'yonetici'|'otomatik', nedenler: [] }
export function onemSiniflandir({ tur, kategori, metin }) {
  const m = String(metin || '').toLocaleLowerCase('tr');
  const nedenler = [];
  let onem = tur === 'sikayet' ? (NEDEN_ONEMI[kategori] || 'normal') : tur === 'hata' ? 'normal' : 'dusuk';
  if (tur === 'sikayet' && kategori) nedenler.push(`neden:${kategori}`);
  if (ACIL_SOZCUKLER.some((s) => m.includes(s))) { onem = yuksel(onem, 'acil'); nedenler.push('sozcuk:acil'); }
  const spam = tur === 'sikayet' && (kategori === 'spam' || SPAM_SOZCUKLER.filter((s) => m.includes(s)).length >= 2);
  if (spam) nedenler.push('spam');
  // Açık spam (ve acil değilse) otomatik süzgece; diğer her şey insana.
  return { onem, yol: spam && onem !== 'acil' ? 'otomatik' : 'yonetici', nedenler };
}

const v = () => al().destek || { kayitlar: [] };
export function destekKayitlari() { return [...v().kayitlar].sort((a, b) => b.zaman - a.zaman); }
export function acikKayitSayisi() { return v().kayitlar.filter((k) => GERI_ALINABILIR.includes(k.durum)).length; }

// tur: DESTEK_TURLERI; kategori: şikâyet nedeni; hedef: { kimlik, ad, tur: 'kisi'|'an' } (şikâyetlerde)
export function destekGonder({ tur, kategori = null, metin = '', hedef = null }) {
  const kayit = { kimlik: yeniKimlik('d'), tur, kategori, metin: String(metin).slice(0, 2000), hedef, zaman: Date.now(), durum: 'alindi', ...onemSiniflandir({ tur, kategori, metin }), yanitlar: [] };
  degistir((x) => { const d = x.destek || { kayitlar: [] }; x.destek = { ...d, kayitlar: [kayit, ...d.kayitlar].slice(0, DESTEK_SINIRI) }; });
  kuyruga('destek', kayit);
  // TEST modunda yönetici yanıtı benzetimi (akış denensin diye; gerçek değildir, yanıt "TEST ·" ile başlar).
  if (testModuAcik() && kayit.yol !== 'otomatik') setTimeout(() => yanitEkle(kayit.kimlik, TEST_YANITLARI[tur] || TEST_YANITLARI.gorus), TEST_YANIT_GECIKMESI);
  return kayit;
}

function guncelle(kimlik, fn) {
  degistir((x) => { const d = x.destek || { kayitlar: [] }; x.destek = { ...d, kayitlar: d.kayitlar.map((k) => (k.kimlik === kimlik ? fn({ ...k }) : k)) }; });
}

// Döner: geri alındı mı (sonuçlanmış kayıt geri alınamaz).
export function geriAl(kimlik) {
  const k = v().kayitlar.find((x) => x.kimlik === kimlik);
  if (!k || !GERI_ALINABILIR.includes(k.durum)) return false;
  guncelle(kimlik, (x) => ({ ...x, durum: 'geriAlindi', geriAlinma: Date.now() }));
  kuyruga('destekGeriAl', { kimlik });
  return true;
}

// Yönetimden yanıt (sunucuda yönetici paneli; şimdilik TEST benzetimi). Kayıt sonuçlanır, kutuya "Destek" bildirimi düşer.
export function yanitEkle(kimlik, metin, { sonuc = true } = {}) {
  const k = v().kayitlar.find((x) => x.kimlik === kimlik);
  if (!k || k.durum === 'geriAlindi') return;
  guncelle(kimlik, (x) => ({ ...x, durum: sonuc ? 'sonuclandi' : 'inceleniyor', yanitlar: [...(x.yanitlar || []), { zaman: Date.now(), metin }] }));
  kutuyaEkle({ kaynak: `destek:${kimlik}:${(k.yanitlar || []).length + 1}`, kat: 'destek', tur: 'destek', ikon: 'kalem',
    baslik: { m: 'destek.kutuBaslik', d: {} }, metin: metin, yol: `/destek?k=${kimlik}` });
}
