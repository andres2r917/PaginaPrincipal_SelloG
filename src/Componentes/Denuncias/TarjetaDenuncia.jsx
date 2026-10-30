import { FiCheckCircle, FiClock, FiHome, FiLifeBuoy, FiMapPin, FiPhone } from 'react-icons/fi'
import { useState } from 'react'
import * as E from '../../Utils/denunciaEstilos.js'
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
    <article className={E.CARD}>
      <header className={E.CARD_CABECERA}>
        <h3 className={E.CARD_TITULO}>{ETIQUETA_TIPO[denuncia.tipo] || denuncia.tipo}</h3>
        <div className={E.CARD_BADGES}>
          <span className={`${E.BADGE} ${E.BADGE_COLOR[`urgencia-${denuncia.urgencia.toLowerCase()}`] ?? ''}`}>
            Urgencia {denuncia.urgencia}
          </span>
          <span className={`${E.BADGE} ${E.BADGE_COLOR[denuncia.estado] ?? ''}`}>
            {ETIQUETA_ESTADO[denuncia.estado]}
          </span>
        </div>
      </header>

      <p className={E.CARD_META}>
        {reportadoPor.tipo === 'fundacion' ? (
          <span className={E.REPORTERO_FUNDACION}><FiHome /> Reportado por {reportadoPor.nombre}</span>
        ) : (
          <span>{reportadoPor.nombre}</span>
        )}
        <span> · {tiempoRelativo(denuncia.fecha)}</span>
      </p>

      <p className={E.CARD_DESC}>{denuncia.descripcion}</p>

      {/* Ubicación exacta: visible a propósito para que la comunidad cercana pueda ir a verificar o ayudar */}
      <p className={E.CARD_UBICACION}><FiMapPin /> {denuncia.ubicacion}</p>
      <div className={E.CARD_ACCIONES}>
        <button type="button" className={E.FEED_BTN_SECUNDARIO} onClick={() => setMapaVisible((v) => !v)}>
          {mapaVisible ? 'Ocultar mapa' : 'Ver en el mapa'}
        </button>
        <a className={E.FEED_BTN_SECUNDARIO} href={urlComoLlegar} target="_blank" rel="noreferrer">
          Cómo llegar
        </a>
      </div>
      {mapaVisible && <MiniMapaDenuncia latitud={denuncia.latitud} longitud={denuncia.longitud} />}

      {/* Evidencia: imágenes y videos */}
      {evidencias.length > 0 && (
        <div className={E.EVIDENCIAS}>
          {evidencias.map((ev) =>
            ev.tipoArchivo?.startsWith('video/') ? (
              <video key={ev.id} src={ev.url} controls preload="metadata" className={E.EVIDENCIA} />
            ) : (
              <a key={ev.id} href={ev.url} target="_blank" rel="noreferrer">
                <img src={ev.url} alt="Evidencia de la denuncia" className={E.EVIDENCIA} loading="lazy" />
              </a>
            )
          )}
        </div>
      )}

      {fundacionAsignada && (
        <p className={E.CARD_ASIGNADA}>
          Caso asignado a <strong>{fundacionAsignada.nombre}</strong>
          {denuncia.fechaAsignacion && <> · {tiempoRelativo(denuncia.fechaAsignacion)}</>}
        </p>
      )}

      <footer className={E.CARD_ACCIONES}>
        {puedeContactar && (
          <a className={E.FEED_BTN_CONTACTO} href={`tel:${telefono.replace(/\s+/g, '')}`}>
            <FiPhone /> {textoContacto}
          </a>
        )}
        {children}
      </footer>
    </article>
  )
}

export default TarjetaDenuncia
