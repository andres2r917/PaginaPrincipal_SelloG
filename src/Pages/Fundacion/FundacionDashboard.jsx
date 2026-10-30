import { FaPaw } from 'react-icons/fa'
import { FiAlertTriangle, FiCheck } from 'react-icons/fi'
import { useState } from 'react'
import { useFundacion } from '../../Context/FundacionContext.jsx'
import { calcularPuntuacion, claseScore, esPrioritaria } from '../../Utils/puntuacion.js'
import { BADGE_SOLICITUD, distintivo } from '../../Utils/estados.js'
import { BADGE } from '../../Utils/adminEstilos'
import { CARD, CARD_SUBTITULO, TITULO } from '../../Utils/panelEstilos'
import { FND_BADGE, FND_BTN_APROBAR, FND_BTN_FICHA, FND_BTN_GESTIONAR, FND_BTN_REVISAR, FND_DOS_COLS, FND_FILTROS, FND_GRID_MASCOTAS, FND_KANBAN, FND_KANBAN_CABECERA, FND_KANBAN_NOMBRE, FND_KANBAN_SUB, FND_KANBAN_TITULO, FND_KPIS, FND_KPI_BARRA, FND_MASCOTA, FND_MASCOTA_ACCIONES, FND_MASCOTA_CHIPS, FND_MASCOTA_CUERPO, FND_MASCOTA_FOTO, FND_MASCOTA_NOMBRE, FND_MASCOTA_SUB, FND_SCORE, FND_SPARKLINE, FND_TIMELINE, FND_TIMELINE_ACCIONES, FND_TIMELINE_AVATAR, FND_TIMELINE_CUERPO, FND_TIMELINE_ITEM, FND_TIMELINE_MASCOTA, FND_TIMELINE_NOMBRE, fndChip, fndChipMascota, fndKanbanCol, fndKanbanTarjeta, fndRelleno } from '../../Utils/fundacionEstilos'

// Convierte una fecha ISO a texto relativo
const hace = (fechaISO) => {
  const dif = Date.now() - new Date(fechaISO).getTime()
  const min = Math.floor(dif / 60000)
  if (min < 60) return `Hace ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `Hace ${h} h`
  return `Hace ${Math.floor(h / 24)} d`
}

const ESTADOS_KANBAN = [
  { key: 'en_cuarentena', titulo: 'Ingreso & Cuarentena' },
  { key: 'disponible', titulo: 'Listos para Adopción' },
  { key: 'en_proceso', titulo: 'En Proceso de Entrega' },
]

const FundacionDashboard = () => {
  const { mascotas, solicitudes, capacidad, resolverSolicitud } = useFundacion()
  const [filtroMascota, setFiltroMascota] = useState('todos')

  // KPIs
  const enCustodia = mascotas.filter((m) => m.estadoAdopcion !== 'adoptado')
  const solicitudesActivas = solicitudes.filter((s) => ['pendiente', 'en_evaluacion'].includes(s.estado))
  const prioritarias = solicitudesActivas.filter(esPrioritaria)
  const concretadas = mascotas.filter((m) => m.estadoAdopcion === 'adoptado').length
  const porcentajeCapacidad = Math.min(100, Math.round((enCustodia.length / capacidad) * 100))

  // Filtro de mascotas
  const mascotasFiltradas = enCustodia.filter((m) => {
    if (filtroMascota === 'perros') return m.especie === 'perro'
    if (filtroMascota === 'gatos') return m.especie === 'gato'
    if (filtroMascota === 'medicos') return (m.estadoSalud || '').toLowerCase().includes('tratamiento')
    return true
  })

  // Solicitudes recientes (últimas 5)
  const solicitudesRecientes = [...solicitudes]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 5)

  // Datos de sparkline sencillos (valores estáticos de ejemplo)
  const sparkline = [4, 7, 5, 9, 6, 11, 8, 12]
  const maxSp = Math.max(...sparkline)
  const puntosSparkline = sparkline
    .map((v, i) => `${(i / (sparkline.length - 1)) * 58},${22 - (v / maxSp) * 20}`)
    .join(' ')

  return (
    <div>
      <h1 className={TITULO}>Panel General</h1>

      {/* KPIs */}
      <div className={FND_KPIS}>
        <div className={CARD} >
          <p className={CARD_SUBTITULO}>En Custodia</p>
          <p className="mt-1 mb-[6px] text-[28px] font-extrabold text-acento">{enCustodia.length}</p>
          <svg className={FND_SPARKLINE} viewBox="0 0 60 24">
            <polyline fill="none" stroke="#7C3AED" strokeWidth="1.8" points={puntosSparkline} />
          </svg>
        </div>

        <div className={CARD} >
          <p className={CARD_SUBTITULO}>Solicitudes Activas</p>
          <p className="mt-1 mb-[6px] text-[28px] font-extrabold text-acento">{solicitudesActivas.length}</p>
          <p style={{ fontSize: 12, color: '#10B981', marginBottom: 8 }}>{prioritarias.length} prioritarias</p>
          <svg className={FND_SPARKLINE} viewBox="0 0 60 24">
            <polyline fill="none" stroke="#10B981" strokeWidth="1.8" points={puntosSparkline} />
          </svg>
        </div>

        <div className={CARD} >
          <p className={CARD_SUBTITULO}>Adopciones Concretadas</p>
          <p className="mt-1 mb-[6px] text-[28px] font-extrabold text-acento">{concretadas}</p>
          <svg className={FND_SPARKLINE} viewBox="0 0 60 24">
            <polyline fill="none" stroke="#10B981" strokeWidth="1.8" points={puntosSparkline} />
          </svg>
        </div>

        <div className={CARD} >
          <p className={CARD_SUBTITULO}>Capacidad del Refugio</p>
          <p className="mt-1 mb-[6px] text-[28px] font-extrabold text-acento">{porcentajeCapacidad}%</p>
          <p style={{ fontSize: 12, color: 'rgba(241,245,249,0.5)', marginBottom: 6 }}>{enCustodia.length} / {capacidad}</p>
          <div className={FND_KPI_BARRA}>
            <div
              className={fndRelleno(porcentajeCapacidad >= 90)}
              style={{ width: `${porcentajeCapacidad}%` }}
            />
          </div>
        </div>
      </div>

      {/* Dos columnas: mascotas y solicitudes */}
      <div className={FND_DOS_COLS}>

        {/* Animales bajo cuidado */}
        <div className={CARD} >
          <h2 className="mb-3 text-[15px] font-extrabold text-texto">Animales bajo cuidado</h2>
          <div className={FND_FILTROS}>
            {[
              { key: 'todos', label: `Todos (${enCustodia.length})` },
              { key: 'perros', label: 'Perros' },
              { key: 'gatos', label: 'Gatos' },
              { key: 'medicos', label: 'Casos Médicos' },
            ].map((f) => (
              <button
                key={f.key}
                className={fndChip(filtroMascota === f.key)}
                onClick={() => setFiltroMascota(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className={FND_GRID_MASCOTAS}>
            {mascotasFiltradas.slice(0, 6).map((m) => (
              <div className={FND_MASCOTA} key={m.id}>
                <div className={FND_MASCOTA_FOTO}>
                  {m.fotoUrl
                    ? <img src={m.fotoUrl} alt={m.nombre} />
                    : <FaPaw />
                  }
                </div>
                <div className={FND_MASCOTA_CUERPO}>
                  <p className={FND_MASCOTA_NOMBRE}>{m.nombre}</p>
                  <p className={FND_MASCOTA_SUB}>{m.edadEstimada} · {m.raza}</p>
                  <div className={FND_MASCOTA_CHIPS}>
                    <span className={fndChipMascota(m.vacunado ? 'vacunado' : 'sinVacunas')}>
                      {m.vacunado ? <><FiCheck /> Vacunado</> : <><FiAlertTriangle /> Sin vacunas</>}
                    </span>
                    <span className={fndChipMascota(m.esterilizado ? 'esterilizado' : 'sinEsterilizar')}>
                      {m.esterilizado ? <><FiCheck /> Esterilizado</> : 'Sin esterilizar'}
                    </span>
                    {(m.estadoSalud || '').toLowerCase().includes('tratamiento') && (
                      <span className={fndChipMascota('tratamiento')}>Tratamiento</span>
                    )}
                    {m.estadoAdopcion === 'en_cuarentena' && (
                      <span className={fndChipMascota('cuarentena')}>Cuarentena</span>
                    )}
                  </div>
                  <div className={FND_MASCOTA_ACCIONES}>
                    <button className={FND_BTN_GESTIONAR}>Gestionar</button>
                    <button className={FND_BTN_FICHA}>Ficha técnica</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Solicitudes recientes */}
        <div className={CARD} >
          <h2 className="mb-3 text-[15px] font-extrabold text-texto">Solicitudes recientes</h2>
          <div className={FND_TIMELINE}>
            {solicitudesRecientes.map((s) => {
              const punt = calcularPuntuacion(s)
              const badgeSt = distintivo(BADGE_SOLICITUD, s.estado)
              const inicial = (s.adoptante?.nombre || 'A').charAt(0).toUpperCase()
              const mascota = mascotas.find((m) => m.id === s.mascotaId)
              return (
                <div className={FND_TIMELINE_ITEM} key={s.id}>
                  <div className={FND_TIMELINE_AVATAR}>{inicial}</div>
                  <div className={FND_TIMELINE_CUERPO}>
                    <p className={FND_TIMELINE_NOMBRE}>{s.adoptante?.nombre} — {mascota?.nombre}</p>
                    <div className={FND_TIMELINE_ACCIONES}>
                      <span className={`${BADGE} ${badgeSt.cls}`}>{badgeSt.txt}</span>
                      <span className={`${FND_SCORE} ${claseScore(punt)}`}>{punt}%</span>
                      {['pendiente', 'en_evaluacion'].includes(s.estado) && (
                        <>
                          <button className={FND_BTN_APROBAR} onClick={() => resolverSolicitud(s.id, 'aprobada')}>Aprobar</button>
                          <button className={FND_BTN_REVISAR} onClick={() => resolverSolicitud(s.id, 'en_evaluacion')}>Revisar</button>
                        </>
                      )}
                    </div>
                    <span className={FND_TIMELINE_MASCOTA}>{hace(s.fecha)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Pipeline Kanban compacto */}
      <div className={CARD} style={{ padding: '18px', marginBottom: 24 }}>
        <h2 className="mb-3 text-[15px] font-extrabold text-texto">Pipeline operativo</h2>
        <div className={FND_KANBAN}>
          {ESTADOS_KANBAN.map((col) => {
            const lista = mascotas.filter((m) => m.estadoAdopcion === col.key)
            return (
              <div key={col.key} className={fndKanbanCol(false)}>
                <div className={FND_KANBAN_CABECERA}>
                  <span className={FND_KANBAN_TITULO}>{col.titulo}</span>
                  <span className={FND_BADGE}>{lista.length}</span>
                </div>
                {lista.map((m) => (
                  <div className={fndKanbanTarjeta(false)} key={m.id}>
                    <p className={FND_KANBAN_NOMBRE}>{m.nombre}</p>
                    <p className={FND_KANBAN_SUB}>{m.raza} · {m.edadEstimada}</p>
                  </div>
                ))}
                {lista.length === 0 && (
                  <p style={{ fontSize: 12, color: 'rgba(241,245,249,0.3)', textAlign: 'center', marginTop: 16 }}>Sin animales</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default FundacionDashboard
