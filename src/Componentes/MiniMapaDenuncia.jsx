import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Pin morado de la paleta, mismo estilo divIcon que usa el formulario (evita el problema de iconos por defecto con Vite)
const ICONO_PIN = L.divIcon({
  className: '',
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="48" viewBox="0 0 36 48">
      <path d="M18 0C8.06 0 0 8.06 0 18c0 12.44 18 30 18 30S36 30.44 36 18C36 8.06 27.94 0 18 0z" fill="#7C3AED"/>
      <circle cx="18" cy="18" r="7" fill="#ffffff" opacity="0.95"/>
    </svg>
  `,
  iconSize: [36, 48],
  iconAnchor: [18, 48],
})

// Mapa pequeño de solo lectura con la ubicación exacta de la denuncia
const MiniMapaDenuncia = ({ latitud, longitud }) => {
  const contenedor = useRef(null)

  useEffect(() => {
    const mapa = L.map(contenedor.current, {
      center: [latitud, longitud],
      zoom: 16,
      scrollWheelZoom: false,
    })
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 19,
    }).addTo(mapa)
    L.marker([latitud, longitud], { icon: ICONO_PIN }).addTo(mapa)
    return () => mapa.remove()
  }, [latitud, longitud])

  return <div ref={contenedor} className="dnfeed-minimapa" />
}

export default MiniMapaDenuncia
