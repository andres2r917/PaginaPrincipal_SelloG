import { useState, useEffect, useRef } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  FiGrid, FiFileText, FiColumns, FiUsers, FiActivity, FiHeart,
  FiAlertTriangle, FiBarChart2, FiSettings, FiLogOut, FiBell, FiSearch, FiPlus, FiX, FiUser,
} from 'react-icons/fi'
import { FaPaw } from 'react-icons/fa'
import { useAuth } from '../Context/AuthContext.jsx'
import { useFundacion } from '../Context/FundacionContext.jsx'
import '../Style/AdminDashboard.css'
import '../Style/FundacionPanel.css'

const FundacionLayout = () => {
  const { usuario, logout, actualizarUsuario } = useAuth()
  const { mascotas, solicitudes } = useFundacion()
  const navigate = useNavigate()
  const buscadorRef = useRef(null)
  const notifRef = useRef(null)

  const pendientes = solicitudes.filter((s) => ['pendiente', 'en_evaluacion'].includes(s.estado)).length

  const [notifAbierta, setNotifAbierta] = useState(false)
  const [perfilAbierto, setPerfilAbierto] = useState(false)
  const [formPerfil, setFormPerfil] = useState({ nombre: usuario?.nombre || '', email: usuario?.email || '' })
  const [guardado, setGuardado] = useState(false)

  // Atajo Ctrl+K enfoca el buscador
  useEffect(() => {
    const atajo = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        buscadorRef.current?.focus()
      }
    }
    window.addEventListener('keydown', atajo)
    return () => window.removeEventListener('keydown', atajo)
  }, [])

  // Cierra el panel de notificaciones al hacer clic fuera
  useEffect(() => {
    const cerrar = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifAbierta(false)
    }
    document.addEventListener('click', cerrar)
    return () => document.removeEventListener('click', cerrar)
  }, [])

  // Cierra la sesión y vuelve al login
  const cerrarSesion = () => { logout(); navigate('/login') }

  const abrirPerfil = () => {
    setFormPerfil({ nombre: usuario?.nombre || '', email: usuario?.email || '' })
    setGuardado(false)
    setPerfilAbierto(true)
  }

  const guardarPerfil = (e) => {
    e.preventDefault()
    actualizarUsuario(formPerfil)
    setGuardado(true)
  }

  // Notificaciones basadas en solicitudes reales
  const notifSolicitudes = solicitudes
    .filter((s) => ['pendiente', 'en_evaluacion'].includes(s.estado))
    .slice(0, 5)
    .map((s) => ({
      id: s.id,
      texto: `Solicitud de ${s.adoptante?.nombre || 'adoptante'} para ${mascotas.find((m) => m.id === s.mascotaId)?.nombre || 'mascota'}`,
      tipo: s.estado === 'pendiente' ? 'pendiente' : 'info',
      tiempo: 'Pendiente de revisión',
    }))

  const items = [
    { to: '/fundacion', texto: 'Panel General', icono: <FiGrid />, fin: true },
    { to: '/fundacion/expedientes', texto: 'Expedientes Peluditos', icono: <FiFileText />, badge: mascotas.length },
    { to: '/fundacion/pipeline', texto: 'Pipeline de Peluditos', icono: <FiColumns /> },
    { to: '/fundacion/adopciones', texto: 'Adopciones', icono: <FiUsers />, badge: pendientes },
    { to: '/fundacion/historial-medico', texto: 'Historial Médico', icono: <FiActivity /> },
    { to: '/fundacion/donaciones', texto: 'Donaciones & Recursos', icono: <FiHeart /> },
    { to: '/fundacion/denuncias', texto: 'Casos de Denuncia', icono: <FiAlertTriangle /> },
    { to: '/fundacion/metricas', texto: 'Métricas & Auditoría', icono: <FiBarChart2 /> },
    { to: '/fundacion/ajustes', texto: 'Ajustes de Sede', icono: <FiSettings /> },
  ]

  const inicial = usuario?.nombre?.trim()?.charAt(0)?.toUpperCase() || 'F'

  return (
    <>
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <span className="admin-brand__badge"><FaPaw /></span>
            <span className="admin-brand__name">Sello <span>Guardián</span></span>
          </div>

          <nav className="admin-nav">
            {items.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.fin}
                className={({ isActive }) => `admin-nav__item${isActive ? ' admin-nav__item--active' : ''}`}
              >
                {it.icono} <span>{it.texto}</span>
                {it.badge > 0 && <span className="fnd-badge">{it.badge}</span>}
              </NavLink>
            ))}
          </nav>

          {/* Bloque de usuario al pie del menú */}
          <div className="fnd-usuario">
            <button className="admin-avatar adm-avatar-btn" onClick={abrirPerfil} aria-label="Editar perfil" title="Mi perfil">
              {usuario?.foto
                ? <img src={usuario.foto} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                : inicial}
            </button>
            <div className="fnd-usuario__meta">
              <strong>{usuario?.nombre}</strong>
              <small>Fundación</small>
            </div>
            <button className="admin-icon-btn" onClick={cerrarSesion} aria-label="Cerrar sesión">
              <FiLogOut />
            </button>
          </div>
        </aside>

        <div className="admin-content">
          <header className="admin-topbar">
            <div className="fnd-breadcrumb">
              Sello Guardián <span>›</span> <strong>{usuario?.nombre}</strong>
            </div>

            <div className="admin-topbar__search">
              <FiSearch />
              <input ref={buscadorRef} type="text" placeholder="Buscar animal o expediente..." />
              <kbd className="fnd-kbd">Ctrl K</kbd>
            </div>

            <div className="admin-topbar__actions">
              <select className="admin-select" defaultValue="mes">
                <option value="mes">Este mes</option>
                <option value="trimestre">Últimos 3 meses</option>
                <option value="anio">Este año</option>
              </select>

              {/* Campana con dropdown de notificaciones */}
              <div ref={notifRef} className="adm-notif-wrap">
                <button
                  className="admin-icon-btn"
                  onClick={(e) => { e.stopPropagation(); setNotifAbierta((p) => !p) }}
                  aria-label="Notificaciones"
                  aria-expanded={notifAbierta}
                >
                  <FiBell />
                  {pendientes > 0 && <span className="admin-icon-btn__dot" />}
                </button>

                {notifAbierta && (
                  <div className="adm-notif-panel">
                    <div className="adm-notif-panel__head">
                      <strong>Notificaciones</strong>
                      {notifSolicitudes.length > 0 && <span className="adm-notif-badge">{notifSolicitudes.length}</span>}
                    </div>
                    <ul className="adm-notif-list">
                      {notifSolicitudes.length === 0 ? (
                        <li style={{ padding: '16px', color: 'rgba(241,245,249,0.5)', fontSize: 13, textAlign: 'center' }}>
                          Sin notificaciones pendientes
                        </li>
                      ) : notifSolicitudes.map((n) => (
                        <li key={n.id} className="adm-notif-item">
                          <span className={`admin-activity-dot admin-activity-dot--${n.tipo}`} />
                          <div className="adm-notif-item__body">
                            <p>{n.texto}</p>
                            <span className="admin-activity-time">{n.tiempo}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Abre el modal de nuevo ingreso en Expedientes */}
              <button
                className="fnd-btn-primario"
                onClick={() => navigate('/fundacion/expedientes', { state: { abrirModal: true } })}
              >
                <FiPlus /> Registrar Ingreso
              </button>
            </div>
          </header>

          {/* Aquí se renderiza cada página del panel */}
          <main className="admin-main">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Modal de perfil de fundación */}
      {perfilAbierto && (
        <div className="fnd-modal__fondo" onClick={() => setPerfilAbierto(false)}>
          <div className="fnd-modal adm-perfil-modal" onClick={(e) => e.stopPropagation()}>
            <button className="fnd-modal__cerrar" onClick={() => setPerfilAbierto(false)}>
              <FiX />
            </button>

            <div className="adm-perfil-modal__cabecera">
              <div className="adm-perfil-modal__avatar">
                {usuario?.foto ? <img src={usuario.foto} alt="Perfil" /> : <FiUser size={28} />}
              </div>
              <div>
                <h2 className="fnd-modal__titulo" style={{ marginBottom: 2 }}>Mi perfil</h2>
                <span className="admin-badge--neutro" style={{ fontSize: 12 }}>Fundación</span>
              </div>
            </div>

            <form onSubmit={guardarPerfil}>
              <div className="fnd-modal__campo">
                <label className="fnd-modal__label">Nombre de la fundación</label>
                <input
                  className="fnd-modal__input"
                  value={formPerfil.nombre}
                  onChange={(e) => { setFormPerfil((p) => ({ ...p, nombre: e.target.value })); setGuardado(false) }}
                  required
                />
              </div>
              <div className="fnd-modal__campo">
                <label className="fnd-modal__label">Correo electrónico</label>
                <input
                  className="fnd-modal__input"
                  type="email"
                  value={formPerfil.email}
                  onChange={(e) => { setFormPerfil((p) => ({ ...p, email: e.target.value })); setGuardado(false) }}
                  required
                />
              </div>
              <div className="fnd-modal__acciones">
                {guardado && <span className="adm-perfil-modal__ok">✓ Cambios guardados</span>}
                <button type="button" className="fnd-modal__btn fnd-modal__btn--secundario" onClick={() => setPerfilAbierto(false)}>
                  Cancelar
                </button>
                <button type="submit" className="fnd-modal__btn fnd-modal__btn--primario">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default FundacionLayout

