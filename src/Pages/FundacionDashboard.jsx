import { useState } from 'react'
import { useFundacion } from '../Context/FundacionContext.jsx'
import { calcularPuntuacion } from '../Utils/puntuacion.js'

// Convierte una fecha ISO a texto relativo
const hace = (fechaISO) => {
  const dif = Date.now() - new Date(fechaISO).getTime()
  const min = Math.floor(dif / 60000)
  if (min < 60) return `Hace ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `Hace ${h} h`
  return `Hace ${Math.floor(h / 24)} d`
}

// Clase de puntuación según el puntaje
const claseScore = (p) => p >= 85 ? 'fnd-score--alta' : p >= 60 ? 'fnd-score--media' : 'fnd-score--baja'

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
  const prioritarias = solicitudesActivas.filter((s) => calcularPuntuacion(s) >= 85)
  const concretadas = solicitudes.filter((s) => s.estado === 'aprobada').length
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

  const badgeEstado = {
    pendiente: { cls: 'admin-badge--pendiente', txt: 'Pendiente' },
    en_evaluacion: { cls: 'admin-badge--neutro', txt: 'En evaluación' },
    aprobada: { cls: 'admin-badge--exito', txt: 'Aprobada' },
    rechazada: { cls: 'admin-badge--critico', txt: 'Rechazada' },
  }

  return (
    <div>
      <h1 className="admin-title">Panel General</h1>

      {/* KPIs */}
      <div className="fnd-kpis">
        <div className="admin-card" style={{ padding: '18px' }}>
          <p className="admin-card__subtitle">En Custodia</p>
          <p style={{ fontSize: 28, fontWeight: 800, color: '#C4B5FD', margin: '4px 0 8px' }}>{enCustodia.length}</p>
          <svg className="fnd-sparkline" viewBox="0 0 60 24">
            <polyline fill="none" stroke="#7C3AED" strokeWidth="1.8" points={puntosSparkline} />
          </svg>
        </div>

        <div className="admin-card" style={{ padding: '18px' }}>
          <p className="admin-card__subtitle">Solicitudes Activas</p>
          <p style={{ fontSize: 28, fontWeight: 800, color: '#C4B5FD', margin: '4px 0 4px' }}>{solicitudesActivas.length}</p>
          <p style={{ fontSize: 12, color: '#10B981', marginBottom: 8 }}>{prioritarias.length} prioritarias</p>
          <svg className="fnd-sparkline" viewBox="0 0 60 24">
            <polyline fill="none" stroke="#10B981" strokeWidth="1.8" points={puntosSparkline} />
          </svg>
        </div>

        <div className="admin-card" style={{ padding: '18px' }}>
          <p className="admin-card__subtitle">Adopciones Concretadas</p>
          <p style={{ fontSize: 28, fontWeight: 800, color: '#C4B5FD', margin: '4px 0 8px' }}>{concretadas}</p>
          <svg className="fnd-sparkline" viewBox="0 0 60 24">
            <polyline fill="none" stroke="#10B981" strokeWidth="1.8" points={puntosSparkline} />
          </svg>
        </div>

        <div className="admin-card" style={{ padding: '18px' }}>
          <p className="admin-card__subtitle">Capacidad del Refugio</p>
          <p style={{ fontSize: 28, fontWeight: 800, color: '#C4B5FD', margin: '4px 0 4px' }}>{porcentajeCapacidad}%</p>
          <p style={{ fontSize: 12, color: 'rgba(241,245,249,0.5)', marginBottom: 6 }}>{enCustodia.length} / {capacidad}</p>
          <div className="fnd-kpi__barra">
            <div
              className={`fnd-kpi__relleno${porcentajeCapacidad >= 90 ? ' fnd-kpi__relleno--critico' : ''}`}
              style={{ width: `${porcentajeCapacidad}%` }}
            />
          </div>
        </div>
      </div>

      {/* Dos columnas: mascotas y solicitudes */}
      <div className="fnd-dos-cols">

        {/* Animales bajo cuidado */}
        <div className="admin-card" style={{ padding: '18px' }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc', marginBottom: 12 }}>Animales bajo cuidado</h2>
          <div className="fnd-filtros">
            {[
              { key: 'todos', label: `Todos (${enCustodia.length})` },
              { key: 'perros', label: 'Perros' },
              { key: 'gatos', label: 'Gatos' },
              { key: 'medicos', label: 'Casos Médicos' },
            ].map((f) => (
              <button
                key={f.key}
                className={`fnd-chip${filtroMascota === f.key ? ' fnd-chip--activo' : ''}`}
                onClick={() => setFiltroMascota(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="fnd-grid-mascotas">
            {mascotasFiltradas.slice(0, 6).map((m) => (
              <div className="fnd-mascota" key={m.id}>
                <div className="fnd-mascota__foto">
                  {m.fotoUrl
                    ? <img src={m.fotoUrl} alt={m.nombre} />
                    : '🐾'
                  }
                </div>
                <div className="fnd-mascota__body">
                  <p className="fnd-mascota__nombre">{m.nombre}</p>
                  <p className="fnd-mascota__sub">{m.edadEstimada} · {m.raza}</p>
                  <div className="fnd-mascota__chips">
                    {m.vacunado && <span className="fnd-mascota__chip">Vacunado</span>}
                    {m.esterilizado && <span className="fnd-mascota__chip">Esterilizado</span>}
                    {(m.estadoSalud || '').toLowerCase().includes('tratamiento') && (
                      <span className="fnd-mascota__chip fnd-mascota__chip--tratamiento">Tratamiento</span>
                    )}
                    {m.estadoAdopcion === 'en_cuarentena' && (
                      <span className="fnd-mascota__chip fnd-mascota__chip--cuarentena">Cuarentena</span>
                    )}
                  </div>
                  <div className="fnd-mascota__acciones">
                    <button className="fnd-btn-gestionar">Gestionar</button>
                    <button className="fnd-btn-ficha">Ficha técnica</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Solicitudes recientes */}
        <div className="admin-card" style={{ padding: '18px' }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc', marginBottom: 12 }}>Solicitudes recientes</h2>
          <div className="fnd-timeline">
            {solicitudesRecientes.map((s) => {
              const punt = calcularPuntuacion(s)
              const badgeSt = badgeEstado[s.estado] || { cls: 'admin-badge--neutro', txt: s.estado }
              const inicial = (s.adoptante?.nombre || 'A').charAt(0).toUpperCase()
              const mascota = mascotas.find((m) => m.id === s.mascotaId)
              return (
                <div className="fnd-timeline__item" key={s.id}>
                  <div className="fnd-timeline__avatar">{inicial}</div>
                  <div className="fnd-timeline__body">
                    <p className="fnd-timeline__nombre">{s.adoptante?.nombre} — {mascota?.nombre}</p>
                    <div className="fnd-timeline__acciones">
                      <span className={`admin-badge ${badgeSt.cls}`}>{badgeSt.txt}</span>
                      <span className={`fnd-score ${claseScore(punt)}`}>{punt}%</span>
                      {['pendiente', 'en_evaluacion'].includes(s.estado) && (
                        <>
                          <button className="fnd-btn-aprobar" onClick={() => resolverSolicitud(s.id, 'aprobada')}>Aprobar</button>
                          <button className="fnd-btn-revisar" onClick={() => resolverSolicitud(s.id, 'en_evaluacion')}>Revisar</button>
                        </>
                      )}
                    </div>
                    <span className="fnd-timeline__mascota">{hace(s.fecha)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Pipeline Kanban compacto */}
      <div className="admin-card" style={{ padding: '18px', marginBottom: 24 }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc', marginBottom: 16 }}>Pipeline operativo</h2>
        <div className="fnd-kanban">
          {ESTADOS_KANBAN.map((col) => {
            const lista = mascotas.filter((m) => m.estadoAdopcion === col.key)
            return (
              <div key={col.key} className="fnd-kanban__col">
                <div className="fnd-kanban__col-header">
                  <span className="fnd-kanban__col-titulo">{col.titulo}</span>
                  <span className="fnd-badge">{lista.length}</span>
                </div>
                {lista.map((m) => (
                  <div className="fnd-kanban__tarjeta" key={m.id}>
                    <p className="fnd-kanban__tarjeta-nombre">{m.nombre}</p>
                    <p className="fnd-kanban__tarjeta-sub">{m.raza} · {m.edadEstimada}</p>
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
