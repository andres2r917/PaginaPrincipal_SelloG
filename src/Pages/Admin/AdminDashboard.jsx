import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDenuncias } from '../../Context/DenunciasContext.jsx'
import { getEstadisticas } from '../../Services/adminService.js'
import { hace } from '../../Utils/tiempo.js'
import {
  FiAlertTriangle,
  FiCheckCircle
} from 'react-icons/fi'
import AdminTopbar from '../../Componentes/Admin/AdminTopbar.jsx'
import '../../Style/Admin/AdminDashboard.css'
import { BADGE_DENUNCIA } from '../../Utils/estados.js'

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

// Denuncias de cada uno de los últimos 6 meses
const denunciasPorMes = (denuncias) => {
  const hoy = new Date()
  return Array.from({ length: 6 }, (_, i) => {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - (5 - i), 1)
    const total = denuncias.filter((d) => {
      const f = new Date(d.fecha)
      return f.getFullYear() === fecha.getFullYear() && f.getMonth() === fecha.getMonth()
    }).length
    return { mes: MESES[fecha.getMonth()], denuncias: total }
  })
}

const AdminDashboard = () => {
  const { denuncias } = useDenuncias()
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [modoMetricas, setModoMetricas] = useState('proteccion') // 'proteccion' | 'adopcion'

  useEffect(() => {
    getEstadisticas()
      .then(setStats)
      .catch((e) => setError(e.message))
  }, [])

  const s = stats ?? {}
  const denunciasUrgentes = denuncias.filter((d) => d.urgencia?.toLowerCase() === 'alta' && ['pendiente', 'verificada'].includes(d.estado))
  const actividad = [...denuncias].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 5)
  const datosGrafico = denunciasPorMes(denuncias)
  const maxBar = Math.max(1, ...datosGrafico.map((d) => d.denuncias))


  return (
    <>



        {/* Topbar */}
        <AdminTopbar placeholder="Buscar denuncias, mascotas, usuarios..." />

        <main className="admin-main">
          <h1 className="admin-title">Dashboard</h1>

          <div className="admin-grid">

            {/* Estado Guardián */}
            <section className="admin-card admin-card--status">
              <div className="admin-card__head">
                <div>
                  <h2>Estado Guardián</h2>
                  <p className="admin-card__subtitle">
                    {modoMetricas === 'proteccion' ? 'Métricas de protección activas' : 'Métricas de adopción y rescate'}
                  </p>
                </div>
                <select
                  className="admin-select"
                  value={modoMetricas}
                  onChange={(e) => setModoMetricas(e.target.value)}
                >
                  <option value="proteccion">Protección</option>
                  <option value="adopcion">Adopción</option>
                </select>
              </div>

              {error && <p role="alert" style={{ color: '#E11D48', fontSize: 13 }}>{error}</p>}

              {modoMetricas === 'proteccion' ? (
                <div className="admin-stat-row">
                  <div className="admin-stat admin-stat--primary">
                    <span className="admin-stat__num">{s.denuncias_activas ?? '—'}</span>
                    <span className="admin-stat__label">Denuncias activas en curso</span>
                  </div>
                  <div className="admin-stat admin-stat--secondary">
                    <span className="admin-stat__num">{s.casos_resueltos ?? '—'}</span>
                    <span className="admin-stat__label">Casos resueltos con éxito</span>
                  </div>
                </div>
              ) : (
                <div className="admin-stat-row">
                  <div className="admin-stat admin-stat--primary" style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
                    <span className="admin-stat__num">{s.adopciones_concretadas ?? '—'}</span>
                    <span className="admin-stat__label">Adopciones concretadas</span>
                  </div>
                  <div className="admin-stat admin-stat--secondary">
                    <span className="admin-stat__num">{s.mascotas_disponibles ?? '—'}</span>
                    <span className="admin-stat__label">Mascotas disponibles</span>
                  </div>
                </div>
              )}

              <div className="admin-stat-row" style={{ marginTop: 12 }}>
                <div className="admin-stat admin-stat--secondary">
                  <span className="admin-stat__num">{s.tasa_resolucion ?? '—'}%</span>
                  <span className="admin-stat__label">Denuncias válidas resueltas</span>
                </div>
                <div className="admin-stat admin-stat--secondary">
                  <span className="admin-stat__num">{s.usuarios_civiles ?? '—'}</span>
                  <span className="admin-stat__label">Usuarios registrados</span>
                </div>
              </div>
            </section>

            {/* Actividad Reciente */}
            <section className="admin-card admin-card--activity">
              <div className="admin-card__head">
                <h2>Actividad Reciente</h2>
              </div>
              <ul className="admin-activity-list">
                {actividad.map((d) => (
                  <li key={d.id} className="admin-activity-item">
                    <span className={`admin-activity-dot admin-activity-dot--${BADGE_DENUNCIA[d.estado]?.punto || 'info'}`} />
                    <div className="admin-activity-body">
                      <p>
                        Denuncia #{d.id} — {d.ubicacion}
                        <span className={`admin-tag admin-tag--${BADGE_DENUNCIA[d.estado]?.punto || 'info'}`}> {d.estado.replace('_', ' ')}</span>
                      </p>
                      <span className="admin-activity-time">{hace(d.fecha)}</span>
                    </div>
                  </li>
                ))}
                {actividad.length === 0 && <li className="admin-activity-item"><p>Aún no hay denuncias.</p></li>}
              </ul>
            </section>

            {/* Reportes: barras */}
            <section className="admin-card admin-card--reports">
              <div className="admin-card__head">
                <h2>Resumen de Reportes</h2>
              </div>
              <p className="admin-mini-chart__title">Denuncias de los últimos 6 meses</p>
              <div className="admin-bar-chart">
                {datosGrafico.map((d) => (
                  <div className="admin-bar-group" key={d.mes}>
                    <div className="admin-bar-pair">
                      <div
                        className="admin-bar admin-bar--secondary"
                        style={{ height: `${(d.denuncias / maxBar) * 100}%` }}
                        title={`Denuncias en ${d.mes}: ${d.denuncias}`}
                      />
                    </div>
                    <span className="admin-bar-label">{d.mes} ({d.denuncias})</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Alertas y Notificaciones */}
            <section className="admin-card admin-card--alerts">
              <div className="admin-card__head">
                <h2>Alertas y Notificaciones</h2>
              </div>

              {denunciasUrgentes.length > 0 ? (
                <div className="admin-alert admin-alert--critical">
                  <FiAlertTriangle />
                  <div>
                    <strong>Denuncia urgente pendiente (#{denunciasUrgentes[0].id})</strong>
                    <p>{denunciasUrgentes[0].descripcion.slice(0, 75)}...</p>
                  </div>
                </div>
              ) : (
                <div className="admin-alert admin-alert--info" style={{ borderColor: 'rgba(16, 185, 129, 0.4)' }}>
                  <FiCheckCircle style={{ color: '#10B981' }} />
                  <div>
                    <strong>Sin denuncias críticas sin atender</strong>
                    <p>Todos los reportes urgentes han sido verificados o asignados.</p>
                  </div>
                </div>
              )}

              {s.fundaciones_pendientes > 0 && (
                <Link to="/admin/adopciones" className="admin-alert admin-alert--info" style={{ textDecoration: 'none' }}>
                  <FiAlertTriangle />
                  <div>
                    <strong>Fundaciones por verificar: {s.fundaciones_pendientes}</strong>
                    <p>Revisa los registros pendientes en "Registro de Fundaciones".</p>
                  </div>
                </Link>
              )}
            </section>

          </div>
        </main>

    </>
  )
}

export default AdminDashboard