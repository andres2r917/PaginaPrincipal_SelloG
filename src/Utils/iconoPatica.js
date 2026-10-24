import L from 'leaflet';

// Pin en forma de gota con una patica (sirve para perro o gato).
// El color debe ser de la paleta: '#7C3AED' (morado) o '#10B981' (verde).
export function crearIconoPatica(color = '#7C3AED') {
  return L.divIcon({
    className: '',
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="48" viewBox="0 0 36 48"
        style="filter: drop-shadow(0 2px 3px rgba(0,0,0,0.5));">
        <path d="M18 0C8.06 0 0 8.06 0 18c0 12.44 18 30 18 30S36 30.44 36 18C36 8.06 27.94 0 18 0z"
          fill="${color}"/>
        <ellipse cx="18" cy="22.8" rx="5.6" ry="4.4" fill="#ffffff"/>
        <ellipse cx="10.6" cy="17.6" rx="2.3" ry="3" transform="rotate(-22 10.6 17.6)" fill="#ffffff"/>
        <ellipse cx="14.7" cy="12.2" rx="2.4" ry="3.2" transform="rotate(-8 14.7 12.2)" fill="#ffffff"/>
        <ellipse cx="21.3" cy="12.2" rx="2.4" ry="3.2" transform="rotate(8 21.3 12.2)" fill="#ffffff"/>
        <ellipse cx="25.4" cy="17.6" rx="2.3" ry="3" transform="rotate(22 25.4 17.6)" fill="#ffffff"/>
      </svg>
    `,
    iconSize: [36, 48],
    iconAnchor: [18, 48],
    popupAnchor: [0, -48],
  });
}
