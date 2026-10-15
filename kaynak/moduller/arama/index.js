// Arama modülü: "Koç arıyor" ve görüşme ekranları.
import './arama.css';
import { gelenArama } from './gelen-arama.js';
import { gorusme } from './gorusme.js';

export default {
  kimlik: 'arama',
  surum: '0.2.0',
  onek: 'ara',
  semaSurumu: 1,
  cekirdekServisleri: ['depo', 'ai', 'ses', 'izin', 'hafiza', 'zamanlayici'],
  ekranlar: {
    'gelen-arama': gelenArama,
    gorusme,
  },
};
