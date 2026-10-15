// Ölçüm: AI çağrı sayısı ve tahmini maliyet (Y9). Gerçek sağlayıcı gelince maliyet buradan izlenir.
import { degistir } from './depo.js';

export function aiCagrisiKaydet(maliyet) {
  degistir((v) => {
    v.olcum.aiCagrisi += 1;
    v.olcum.tahminiMaliyet = Math.round((v.olcum.tahminiMaliyet + maliyet) * 10000) / 10000;
  });
}
