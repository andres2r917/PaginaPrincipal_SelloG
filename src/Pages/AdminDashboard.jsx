import React from 'react'
import { Link } from 'react-router-dom'
import {FiGrid, FiClipboard, FiDatabase, FiAlertTriangle,
  FiUsers, FiSettings, FiLogOut, FiBell, FiSearch, FiMoreHorizontal} from 'react-icons/fi'
import { FaPaw } from 'react-icons/fa'
import '../Style/AdminDashboard.css'

// TODO: reemplazar por fetch a GET /api/admin/dashboard cuando exista el endpoint en Laravel
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

const usuariosTrend = [12, 18, 15, 24, 20, 28, 26, 32]

const actividadReciente = [
  { id: 1, texto: 'Solicitud de adopción #2458', estado: 'Aprobada', tipo: 'exito', tiempo: 'Hace 26 min' },
  { id: 2, texto: 'Nueva denuncia registrada — Zona Norte', estado: null, tipo: 'info', tiempo: 'Hace 40 min' },
  { id: 3, texto: 'Nueva mascota agregada: Max (Perro)', estado: null, tipo: 'info', tiempo: 'Hace 1 h' },
  { id: 4, texto: 'Fundación "Huellitas Felices" registrada', estado: 'Pendiente', tipo: 'pendiente', tiempo: 'Hace 3 h' },
]

const AdminDashboard = () => {
  const maxBar = 25
  const maxTrend = Math.max(...usuariosTrend)

  return (
    <div className="admin-layout">

      {/* ── SIDEBAR ── */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand__badge"><FaPaw /></span>
          <span className="admin-brand__name">Sello <span>Guardián</span></span>
        </div>

        <nav className="admin-nav">
          <Link to="/admin" className="admin-nav__item admin-nav__item--active">
            <FiGrid /> <span>Dashboard</span>
          </Link>
          <Link to="/admin/adopciones" className="admin-nav__item">
            <FiClipboard /> <span>Solicitudes de Adopción</span>
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

        <button className="admin-nav__item admin-nav__logout">
          <FiLogOut /> <span>Cerrar sesión</span>
        </button>
      </aside>

      {/* ── CONTENIDO ── */}
      <div className="admin-content">

        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar__search">
            <FiSearch />
            <input type="text" placeholder="Buscar denuncias, mascotas, usuarios..." />
          </div>
          <div className="admin-topbar__actions">
            <button className="admin-icon-btn">
              <FiBell />
              <span className="admin-icon-btn__dot" />
            </button>
            <div className="admin-avatar">A</div>
          </div>
        </header>

        <main className="admin-main">
          <h1 className="admin-title">Dashboard</h1>

          <div className="admin-grid">

            {/* Estado Guardián */}
            <section className="admin-card admin-card--status">
              <div className="admin-card__head">
                <div>
                  <h2>Estado Guardián</h2>
                  <p className="admin-card__subtitle">Métricas de protección activas</p>
                </div>
                <select className="admin-select" defaultValue="proteccion">
                  <option value="proteccion">Protección</option>
                  <option value="adopcion">Adopción</option>
                </select>
              </div>

              <div className="admin-stat-row">
                <div className="admin-stat admin-stat--primary">
                  <span className="admin-stat__num">47</span>
                  <span className="admin-stat__label">Denuncias activas</span>
                </div>
                <div className="admin-stat admin-stat--secondary">
                  <span className="admin-stat__num">4.2</span>
                  <span className="admin-stat__label">Días resp. promedio</span>
                </div>
              </div>

              <div className="admin-mini-chart">
                <p className="admin-mini-chart__title">Actividad de protección</p>
                <svg viewBox="0 0 300 80" preserveAspectRatio="none" className="admin-area-svg">
                  <defs>
                    <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.55" />
                      <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polyline
                    fill="url(#areaFill)"
                    stroke="#C4B5FD"
                    strokeWidth="2"
                    points="0,55 40,35 80,50 120,20 160,40 200,15 240,45 280,25 300,25 300,80 0,80"
                  />
                </svg>
              </div>
            </section>

            {/* Actividad Reciente */}
            <section className="admin-card admin-card--activity">
              <div className="admin-card__head">
                <h2>Actividad Reciente</h2>
                <button className="admin-icon-btn admin-icon-btn--ghost"><FiMoreHorizontal /></button>
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
                <select className="admin-select" defaultValue="reportes">
                  <option value="reportes">Gráficos</option>
                </select>
              </div>
              <p className="admin-mini-chart__title">Adopciones vs. Denuncias mensuales</p>
              <div className="admin-bar-chart">
                {monthlyData.map(d => (
                  <div className="admin-bar-group" key={d.mes}>
                    <div className="admin-bar-pair">
                      <div
                        className="admin-bar admin-bar--primary"
                        style={{ height: `${(d.adopciones / maxBar) * 100}%` }}
                        title={`Adopciones: ${d.adopciones}`}
                      />
                      <div
                        className="admin-bar admin-bar--secondary"
                        style={{ height: `${(d.denuncias / maxBar) * 100}%` }}
                        title={`Denuncias: ${d.denuncias}`}
                      />
                    </div>
                    <span className="admin-bar-label">{d.mes}</span>
                  </div>
                ))}
              </div>
              <div className="admin-legend">
                <span><i className="admin-legend__dot admin-legend__dot--primary" /> Adopciones</span>
                <span><i className="admin-legend__dot admin-legend__dot--secondary" /> Denuncias</span>
              </div>
            </section>

            {/* Alertas y Notificaciones */}
            <section className="admin-card admin-card--alerts">
              <div className="admin-card__head">
                <h2>Alertas y Notificaciones</h2>
                <button className="admin-icon-btn admin-icon-btn--ghost"><FiMoreHorizontal /></button>
              </div>

              <div className="admin-alert admin-alert--info">
                <FiAlertTriangle />
                <div>
                  <strong>Fundación pendiente</strong>
                  <p>"Huellitas Felices" espera verificación de documentos.</p>
                </div>
              </div>

              <div className="admin-alert admin-alert--critical">
                <FiAlertTriangle />
                <div>
                  <strong>Denuncia urgente sin atender</strong>
                  <p>Reporte #189 lleva más de 24h sin asignar.</p>
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