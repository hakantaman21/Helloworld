// Koçun önerdiği senaryo: seviyeye uygun ve tamamlanmamış ilk senaryo; hepsi bittiyse uygun ilk senaryo.
import { al } from './depo.js';
import senaryolar from '../veri/senaryolar/index.js';

export const SEVIYE_SIRASI = ['A1', 'A2', 'B1', 'B2', 'C1'];

export function seviyeyeUygunMu(senaryo, seviye) {
  return SEVIYE_SIRASI.indexOf(senaryo.seviye) <= Math.max(SEVIYE_SIRASI.indexOf(seviye), 0) + 1;
}

export function oneriSenaryo() {
  const v = al();
  const uygun = senaryolar.filter((s) => seviyeyeUygunMu(s, v.profil.seviye));
  const yapilmamis = uygun.find((s) => !v.tamamlananSenaryolar[s.kimlik]);
  return { senaryo: yapilmamis || uygun[0] || senaryolar[0], neden: yapilmamis ? 'seviye' : 'tekrar' };
}
