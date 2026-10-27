import { FiCheckCircle, FiClock, FiHome, FiLifeBuoy, FiMapPin, FiPhone } from 'react-icons/fi'
import { useState } from 'react'
import '../../Style/DenunciaFeed.css'
import { useDenuncias } from '../../Context/DenunciasContext.jsx'
import { ETIQUETA_TIPO, ESTADOS_ACTIVOS } from '../../Utils/estados.js'
import { tiempoRelativo } from '../../Utils/tiempoRelativo.js'
import MiniMapaDenuncia from './MiniMapaDenuncia.jsx'
import { crearUrlRuta } from '../../Utils/urlRuta.js'

// Etiqueta de verificación visible en cada tarjeta
const ETIQUETA_ESTADO = {
  pendiente: <><FiClock /> Sin verificar aún</>,
  verificada: <><FiCheckCircle /> Verificada por el equipo</>,
  en_rescate: <><FiLifeBuoy /> En proceso de rescate</>,
  resuelta: 'Resuelta',
  descartada: 'Descartada',
}

const TarjetaDenuncia = ({ denuncia, children }) => {
  const { telefonoEmergencia } = useDenuncias()
  const [mapaVisible, setMapaVisible] = useState(false)

  const { fundacionAsignada, reportadoPor, evidencias } = denuncia

  // Contacto: teléfono de la fundación asignada; si no hay, la línea general de emergencia
  const telefono = fundacionAsignada?.telefono || telefonoEmergencia
  const puedeContactar = ESTADOS_ACTIVOS.includes(denuncia.estado) && Boolean(telefono)
  const textoContacto = fundacionAsignada ? `Llamar a ${fundacionAsignada.nombre}` : 'Línea de emergencia'
  const urlComoLlegar = crearUrlRuta(denuncia.latitud, denuncia.longitud, denuncia.ubicacion)

  return (
    <article className="dnfeed-card">
      <header className="dnfeed-card__head">
        <h3 className="dnfeed-card__titulo">{ETIQUETA_TIPO[denuncia.tipo] || denuncia.tipo}</h3>
        <div className="dnfeed-card__badges">
          <span className={`dnfeed-badge dnfeed-badge--urgencia-${denuncia.urgencia.toLowerCase()}`}>
            Urgencia {denuncia.urgencia}
          </span>
          <span className={`dnfeed-badge dnfeed-badge--${denuncia.estado}`}>
            {ETIQUETA_ESTADO[denuncia.estado]}
          </span>
        </div>
      </header>

      <p className="dnfeed-card__meta">
        {reportadoPor.tipo === 'fundacion' ? (
          <span className="dnfeed-reportero dnfeed-reportero--fundacion"><FiHome /> Reportado por {reportadoPor.nombre}</span>
        ) : (
          <span className="dnfeed-reportero">{reportadoPor.nombre}</span>
        )}
        <span> · {tiempoRelativo(denuncia.fecha)}</span>
      </p>

      <p className="dnfeed-card__desc">{denuncia.descripcion}</p>

      {/* Ubicación exacta: visible a propósito para que la comunidad cercana pueda ir a verificar o ayudar */}
      <p className="dnfeed-card__ubicacion"><FiMapPin /> {denuncia.ubicacion}</p>
      <div className="dnfeed-card__acciones">
        <button type="button" className="dnfeed-btn dnfeed-btn--secundario" onClick={() => setMapaVisible((v) => !v)}>
          {mapaVisible ? 'Ocultar mapa' : 'Ver en el mapa'}
        </button>
        <a className="dnfeed-btn dnfeed-btn--secundario" href={urlComoLlegar} target="_blank" rel="noreferrer">
          Cómo llegar
        </a>
      </div>
      {mapaVisible && <MiniMapaDenuncia latitud={denuncia.latitud} longitud={denuncia.longitud} />}

      {/* Evidencia: imágenes y videos */}
      {evidencias.length > 0 && (
        <div className="dnfeed-evidencias">
          {evidencias.map((ev) =>
            ev.tipoArchivo?.startsWith('video/') ? (
              <video key={ev.id} src={ev.url} controls preload="metadata" className="dnfeed-evidencia" />
            ) : (
              <a key={ev.id} href={ev.url} target="_blank" rel="noreferrer">
                <img src={ev.url} alt="Evidencia de la denuncia" className="dnfeed-evidencia" loading="lazy" />
              </a>
            )
          )}
        </div>
      )}

      {fundacionAsignada && (
        <p className="dnfeed-card__asignada">
          Caso asignado a <strong>{fundacionAsignada.nombre}</strong>
          {denuncia.fechaAsignacion && <> · {tiempoRelativo(denuncia.fechaAsignacion)}</>}
        </p>
      )}

      <footer className="dnfeed-card__acciones">
        {puedeContactar && (
          <a className="dnfeed-btn dnfeed-btn--contacto" href={`tel:${telefono.replace(/\s+/g, '')}`}>
            <FiPhone /> {textoContacto}
          </a>
        )}
        {children}
      </footer>
    </article>
  )
}

export default TarjetaDenuncia
