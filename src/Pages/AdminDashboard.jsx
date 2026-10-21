import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext.jsx'
import { useDenuncias } from '../Context/DenunciasContext.jsx'
import {
  FiGrid, FiClipboard, FiDatabase, FiAlertTriangle,
  FiUsers, FiSettings, FiLogOut, FiMoreHorizontal, FiTrendingUp, FiCheckCircle
} from 'react-icons/fi'
import Group from '../assets/Group.svg'
import AdminTopbar from '../Componentes/AdminTopbar.jsx'
import '../Style/AdminDashboard.css'

const monthlyData = [
  { mes: 'Ene', adopciones: 14, denuncias: 9 },
  { mes: 'Feb', adopciones: 18, denuncias: 12 },
  { mes: 'Mar', adopciones: 12, denuncias: 15 },
  { mes: 'Abr', adopciones: 20, denuncias: 10 },
  { mes: 'May', adopciones: 16, denuncias: 13 },
  { mes: 'Jun', adopciones: 19, denuncias: 8 },
  { mes: 'Jul', adopciones: 15, denuncias: 14 },
  { mes: 'Ago', adopciones: 22, denuncias: 11 },
]

const actividadReciente = [
  { id: 1, texto: 'Solicitud de adopción #2458', estado: 'Aprobada', tipo: 'exito', tiempo: 'Hace 26 min' },
  { id: 2, texto: 'Nueva denuncia registrada — Popayán Centro', estado: null, tipo: 'info', tiempo: 'Hace 40 min' },
  { id: 3, texto: 'Nueva mascota agregada: Max (Labrador)', estado: null, tipo: 'info', tiempo: 'Hace 1 h' },
  { id: 4, texto: 'Fundación "Huellitas Felices" registrada', estado: 'Pendiente', tipo: 'pendiente', tiempo: 'Hace 3 h' },
]

const AdminDashboard = () => {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const { denuncias } = useDenuncias()

  // Estados interactivos para filtros
  const [modoMetricas, setModoMetricas] = useState('proteccion') // 'proteccion' | 'adopcion'
  const [filtroGrafico, setFiltroGrafico] = useState('todos') // 'todos' | 'ultimos' | 'adopciones' | 'denuncias'

  // Métricas calculadas en tiempo real desde el contexto de denuncias
  const denunciasActivas = denuncias.filter(d => ['pendiente', 'verificada', 'en_rescate', 'abierta', 'en_proceso'].includes(d.estado)).length
  const denunciasResueltas = denuncias.filter(d => d.estado === 'resuelta').length
  const denunciasUrgentes = denuncias.filter(d => (d.urgencia === 'Alta' || d.urgencia === 'alta') && d.estado !== 'descartada' && d.estado !== 'resuelta')

  const cerrarSesion = () => { logout(); navigate('/login') }

  // Filtrado de datos del gráfico de barras según el selector
  const datosGrafico = (() => {
    if (filtroGrafico === 'ultimos') return monthlyData.slice(-4)
    return monthlyData
  })()

  const maxBar = 25

  return (
    <div className="admin-layout">

      {/* ── SIDEBAR ── */}
      <aside className="admin-sidebar">
        <Link to="/home" className="admin-brand" title="Ir al Inicio">
          <img className="admin-brand__logo" src={Group} alt="Sello Guardián" />
        </Link>

        <nav className="admin-nav">
          <Link to="/admin" className="admin-nav__item admin-nav__item--active">
            <FiGrid /> <span>Dashboard</span>
          </Link>
          <Link to="/admin/adopciones" className="admin-nav__item">
            <FiClipboard /> <span>Registro de Fundaciones</span>
          </Link>
          <Link to="/admin/mascotas" className="admin-nav__item">
            <FiDatabase /> <span>Mascotas</span>
          </Link>
          <Link to="/admin/denuncias" className="admin-nav__item">
            <FiAlertTriangle /> <span>Denuncias</span>
          </Link>
          <Link to="/admin/usuarios" className="admin-nav__item">
            <FiUsers /> <span>Usuarios y Fundaciones</span>
          </Link>
          <Link to="/admin/configuracion" className="admin-nav__item">
            <FiSettings /> <span>Configuración</span>
          </Link>
        </nav>

        <button className="admin-nav__item admin-nav__logout" onClick={cerrarSesion}>
          <FiLogOut /> <span>Cerrar sesión</span>
        </button>
      </aside>

      {/* ── CONTENIDO ── */}
      <div className="admin-content">

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

              {modoMetricas === 'proteccion' ? (
                <div className="admin-stat-row">
                  <div className="admin-stat admin-stat--primary">
                    <span className="admin-stat__num">{denunciasActivas}</span>
                    <span className="admin-stat__label">Denuncias activas en curso</span>
                  </div>
                  <div className="admin-stat admin-stat--secondary">
                    <span className="admin-stat__num">{denunciasResueltas}</span>
                    <span className="admin-stat__label">Casos resueltos con éxito</span>
                  </div>
                </div>
              ) : (
                <div className="admin-stat-row">
                  <div className="admin-stat admin-stat--primary" style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
                    <span className="admin-stat__num">18</span>
                    <span className="admin-stat__label">Adopciones concretadas</span>
                  </div>
                  <div className="admin-stat admin-stat--secondary">
                    <span className="admin-stat__num">92%</span>
                    <span className="admin-stat__label">Tasa de respuesta positiva</span>
                  </div>
                </div>
              )}

              <div className="admin-mini-chart">
                <p className="admin-mini-chart__title">
                  {modoMetricas === 'proteccion' ? 'Tendencia de reportes comunitarios' : 'Curva mensual de solicitudes de adopción'}
                </p>
                <svg viewBox="0 0 300 80" preserveAspectRatio="none" className="admin-area-svg">
                  <defs>
                    <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={modoMetricas === 'proteccion' ? '#7C3AED' : '#10B981'} stopOpacity="0.55" />
                      <stop offset="100%" stopColor={modoMetricas === 'proteccion' ? '#7C3AED' : '#10B981'} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polyline
                    fill="url(#areaFill)"
                    stroke={modoMetricas === 'proteccion' ? '#C4B5FD' : '#6EE7B7'}
                    strokeWidth="2.5"
                    points={modoMetricas === 'proteccion'
                      ? "0,55 40,35 80,50 120,20 160,40 200,15 240,45 280,25 300,25 300,80 0,80"
                      : "0,65 40,55 80,45 120,38 160,30 200,22 240,18 280,12 300,10 300,80 0,80"
                    }
                  />
                </svg>
              </div>
            </section>

            {/* Actividad Reciente */}
            <section className="admin-card admin-card--activity">
              <div className="admin-card__head">
                <h2>Actividad Reciente</h2>
                <button className="admin-icon-btn admin-icon-btn--ghost" title="Ver más actividad"><FiMoreHorizontal /></button>
              </div>
              <ul className="admin-activity-list">
                {actividadReciente.map(item => (
                  <li key={item.id} className="admin-activity-item">
                    <span className={`admin-activity-dot admin-activity-dot--${item.tipo}`} />
                    <div className="admin-activity-body">
                      <p>
                        {item.texto}
                        {item.estado && (
                          <span className={`admin-tag admin-tag--${item.tipo}`}> {item.estado}</span>
                        )}
                      </p>
                      <span className="admin-activity-time">{item.tiempo}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Reportes: barras */}
            <section className="admin-card admin-card--reports">
              <div className="admin-card__head">
                <h2>Resumen de Reportes</h2>
                <select
                  className="admin-select"
                  value={filtroGrafico}
                  onChange={(e) => setFiltroGrafico(e.target.value)}
                >
                  <option value="todos">Todos los meses</option>
                  <option value="ultimos">Últimos 4 meses</option>
                  <option value="adopciones">Solo Adopciones</option>
                  <option value="denuncias">Solo Denuncias</option>
                </select>
              </div>
              <p className="admin-mini-chart__title">
                {filtroGrafico === 'adopciones' ? 'Adopciones mensuales' : filtroGrafico === 'denuncias' ? 'Denuncias mensuales' : 'Adopciones vs. Denuncias mensuales'}
              </p>
              <div className="admin-bar-chart">
                {datosGrafico.map(d => (
                  <div className="admin-bar-group" key={d.mes}>
                    <div className="admin-bar-pair">
                      {filtroGrafico !== 'denuncias' && (
                        <div
                          className="admin-bar admin-bar--primary"
                          style={{ height: `${(d.adopciones / maxBar) * 100}%` }}
                          title={`Adopciones en ${d.mes}: ${d.adopciones}`}
                        />
                      )}
                      {filtroGrafico !== 'adopciones' && (
                        <div
                          className="admin-bar admin-bar--secondary"
                          style={{ height: `${(d.denuncias / maxBar) * 100}%` }}
                          title={`Denuncias en ${d.mes}: ${d.denuncias}`}
                        />
                      )}
                    </div>
                    <span className="admin-bar-label">{d.mes}</span>
                  </div>
                ))}
              </div>
              <div className="admin-legend">
                {filtroGrafico !== 'denuncias' && (
                  <span><i className="admin-legend__dot admin-legend__dot--primary" /> Adopciones</span>
                )}
                {filtroGrafico !== 'adopciones' && (
                  <span><i className="admin-legend__dot admin-legend__dot--secondary" /> Denuncias</span>
                )}
              </div>
            </section>

            {/* Alertas y Notificaciones */}
            <section className="admin-card admin-card--alerts">
              <div className="admin-card__head">
                <h2>Alertas y Notificaciones</h2>
                <button className="admin-icon-btn admin-icon-btn--ghost" title="Opciones"><FiMoreHorizontal /></button>
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

              <div className="admin-alert admin-alert--info">
                <FiAlertTriangle />
                <div>
                  <strong>Fundación pendiente</strong>
                  <p>"Patitas al Rescate" espera verificación de personería jurídica.</p>
                </div>
              </div>
            </section>

          </div>
        </main>

        <footer className="admin-footer">
          Sello Guardián 2026. Panel administrativo.
        </footer>
      </div>
    </div>
  )
}

export default AdminDashboard