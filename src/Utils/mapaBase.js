import L from 'leaflet';
import '../Style/MapaBase.css';

// CARTO ahora exige una clave gratuita para sus mapas. Si existe VITE_CARTO_KEY se usa
// el mapa oscuro de CARTO; si no, OpenStreetMap (sin clave) con los colores suavizados por CSS.
const CLAVE_CARTO = import.meta.env.VITE_CARTO_KEY;

export function crearCapaBase() {
  if (CLAVE_CARTO) {
    return L.tileLayer(
      `https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=${CLAVE_CARTO}`,
      {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19,
      }
    );
  }

  return L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
    className: 'capa-mapa-suave',
  });
}
