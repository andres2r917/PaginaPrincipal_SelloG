import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { crearCapaBase } from '../Utils/mapaBase.js'
import { crearIconoPatica } from '../Utils/iconoPatica.js'

// Patica morada de la paleta (evita el problema de iconos por defecto de Leaflet con Vite)
const ICONO_PIN = crearIconoPatica('#7C3AED')

// Mapa pequeño de solo lectura con la ubicación exacta de la denuncia
const MiniMapaDenuncia = ({ latitud, longitud }) => {
  const contenedor = useRef(null)

  useEffect(() => {
    const mapa = L.map(contenedor.current, {
      center: [latitud, longitud],
      zoom: 16,
      scrollWheelZoom: false,
    })
    crearCapaBase().addTo(mapa)
    L.marker([latitud, longitud], { icon: ICONO_PIN }).addTo(mapa)
    return () => mapa.remove()
  }, [latitud, longitud])

  return <div ref={contenedor} className="dnfeed-minimapa" />
}

export default MiniMapaDenuncia
