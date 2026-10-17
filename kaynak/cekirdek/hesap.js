// v0.26.0 Hesap durumu (askıya alma / yeniden açma). Etkisi: test-erisim.js (kimseyle iletişim yok), rehber ve
// kutlamalar (uygulama bildirimi yok), yönlendirici (askı şeridi). Sunucu bağlanınca aynı istek sunucuya gider
// (profil gizlenir, gelen mesajlar reddedilir); silme de sunucuda hesabı ve verileri siler.
import { al, degistir } from './depo.js';
import { kuyruga } from './sunucu.js';

export function hesapAskida() { return Boolean(al().profil.hesapAskida); }
export function hesabiAskiyaAl() { degistir((v) => { v.profil.hesapAskida = Date.now(); }); kuyruga('hesap', { askida: true }); }
export function hesabiAc() { degistir((v) => { v.profil.hesapAskida = null; }); kuyruga('hesap', { askida: false }); }
