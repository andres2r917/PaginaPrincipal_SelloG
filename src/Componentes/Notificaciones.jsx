import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiBell, FiCheck } from 'react-icons/fi'
import { hace } from '../Utils/tiempo.js'
import '../Style/Notificaciones.css'

// Qué notificaciones ya leyó cada usuario se recuerda en este navegador
const clave = (usuarioId) => `notifLeidas:${usuarioId}`

const leerLeidas = (usuarioId) => {
  try {
    return JSON.parse(localStorage.getItem(clave(usuarioId)) ?? '[]')
  } catch {
    return []
  }
}

const guardarLeidas = (usuarioId, lista) => {
  try {
    localStorage.setItem(clave(usuarioId), JSON.stringify(lista.slice(-200)))
  } catch {
    // Sin almacenamiento disponible: se pierde solo el recuerdo de lo leído
  }
}

// Campana con la lista de avisos. Cada aviso: { id, texto, detalle?, tipo, fecha, to }
// El id debe cambiar cuando el aviso es nuevo (por ejemplo, al cambiar el estado de una solicitud).
// El componente que la usa debe pasar key={usuarioId} para empezar de cero al cambiar de cuenta.
const Notificaciones = ({ items, usuarioId }) => {
  const navigate = useNavigate()
  const contenedorRef = useRef(null)
  const [abierta, setAbierta] = useState(false)
  const [leidas, setLeidas] = useState(() => leerLeidas(usuarioId))

  // Cierra el panel al hacer clic fuera
  useEffect(() => {
    const cerrar = (e) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) setAbierta(false)
    }
    document.addEventListener('click', cerrar)
    return () => document.removeEventListener('click', cerrar)
  }, [])

  const ordenados = [...items].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 12)
  const sinLeer = ordenados.filter((n) => !leidas.includes(n.id))

  const marcarLeidas = (ids) => {
    const nuevas = [...new Set([...leidas, ...ids])]
    setLeidas(nuevas)
    guardarLeidas(usuarioId, nuevas)
  }

  const abrirAviso = (aviso) => {
    marcarLeidas([aviso.id])
    setAbierta(false)
    if (aviso.to) navigate(aviso.to)
  }

  return (
    <div ref={contenedorRef} className="adm-notif-wrap">
      <button
        type="button"
        className="admin-icon-btn"
        onClick={(e) => { e.stopPropagation(); setAbierta((p) => !p) }}
        aria-label={sinLeer.length > 0 ? `Notificaciones, ${sinLeer.length} sin leer` : 'Notificaciones'}
        aria-expanded={abierta}
      >
        <FiBell />
        {sinLeer.length > 0 && <span className="admin-icon-btn__dot" />}
      </button>

      {abierta && (
        <div className="adm-notif-panel">
          <div className="adm-notif-panel__head">
            <strong>Notificaciones</strong>
            {sinLeer.length > 0 && <span className="adm-notif-badge">{sinLeer.length}</span>}
          </div>

          <ul className="adm-notif-list">
            {ordenados.length === 0 ? (
              <li className="notif-vacio">No tienes notificaciones</li>
            ) : ordenados.map((n) => {
              const nueva = !leidas.includes(n.id)
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    className={`adm-notif-item notif-item${nueva ? ' notif-item--nueva' : ''}`}
                    onClick={() => abrirAviso(n)}
                  >
                    <span className={`admin-activity-dot admin-activity-dot--${n.tipo}`} />
                    <span className="adm-notif-item__body">
                      <p>{n.texto}</p>
                      {n.detalle && <small className="notif-detalle">{n.detalle}</small>}
                      <span className="admin-activity-time">{hace(n.fecha)}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>

          {sinLeer.length > 0 && (
            <button type="button" className="notif-marcar" onClick={() => marcarLeidas(ordenados.map((n) => n.id))}>
              <FiCheck /> Marcar todas como leídas
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Notificaciones
