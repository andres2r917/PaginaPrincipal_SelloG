import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiBell, FiCheck } from 'react-icons/fi'
import { hace } from '../Utils/tiempo.js'

// Estilos con Tailwind. Los colores de la marca salen de @theme (index.css)
const PANEL =
  'absolute top-[calc(100%+12px)] right-0 z-60 w-[min(300px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-[rgba(196,181,253,0.22)] bg-[rgba(15,23,42,0.98)] shadow-[0_20px_48px_rgba(0,0,0,0.55)] backdrop-blur-[12px] min-[481px]:w-[300px]'
const CABECERA = 'flex items-center justify-between border-b border-[rgba(255,255,255,0.07)] px-4 pt-[14px] pb-[10px]'
const CONTADOR =
  'inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primario px-[5px] text-[11px] font-bold text-white'
const LISTA = 'max-h-[280px] list-none overflow-y-auto py-2'
const VACIO = 'px-4 py-[18px] text-center text-[13px] text-[rgba(241,245,249,0.55)]'
const AVISO =
  'flex w-full cursor-pointer items-start gap-[10px] border-none px-4 py-[10px] text-left text-inherit [font:inherit] transition-[background-color] duration-150 ease-[ease] hover:bg-[rgba(124,58,237,0.1)]'
const AVISO_NUEVO = `${AVISO} bg-[rgba(124,58,237,0.14)]`
const AVISO_LEIDO = `${AVISO} bg-transparent`
const MARCAR =
  'flex w-full cursor-pointer items-center justify-center gap-[6px] border-0 border-t border-[rgba(255,255,255,0.07)] bg-transparent px-4 py-[11px] text-[13px] font-semibold text-acento [font-family:inherit] hover:bg-[rgba(124,58,237,0.12)]'

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
    <div ref={contenedorRef} className="relative">
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
        <div className={PANEL}>
          <div className={CABECERA}>
            <strong className="text-[14px] text-texto">Notificaciones</strong>
            {sinLeer.length > 0 && <span className={CONTADOR}>{sinLeer.length}</span>}
          </div>

          <ul className={LISTA}>
            {ordenados.length === 0 ? (
              <li className={VACIO}>No tienes notificaciones</li>
            ) : ordenados.map((n) => {
              const nueva = !leidas.includes(n.id)
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    className={nueva ? AVISO_NUEVO : AVISO_LEIDO}
                    onClick={() => abrirAviso(n)}
                  >
                    <span className={`admin-activity-dot admin-activity-dot--${n.tipo}`} />
                    <span className="block">
                      <p className="mb-[3px] text-[13px] leading-[1.4] text-[#e2e8f0]">{n.texto}</p>
                      {n.detalle && <small className="mb-[3px] block text-[12px] leading-[1.4] text-[rgba(226,232,240,0.65)]">{n.detalle}</small>}
                      <span className="admin-activity-time">{hace(n.fecha)}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>

          {sinLeer.length > 0 && (
            <button type="button" className={MARCAR} onClick={() => marcarLeidas(ordenados.map((n) => n.id))}>
              <FiCheck /> Marcar todas como leídas
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Notificaciones
