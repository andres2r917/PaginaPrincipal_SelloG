import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext.jsx'
import { useDenuncias } from '../Context/DenunciasContext.jsx'
import {
  FiGrid, FiClipboard, FiDatabase, FiAlertTriangle,
  FiUsers, FiSettings, FiLogOut, FiSave
} from 'react-icons/fi'
import Group from '../assets/Group.svg'
import AdminTopbar from '../Componentes/AdminTopbar.jsx'
import '../Style/AdminDashboard.css'
import '../Style/AdminTablas.css'

const AdminConfiguracion = () => {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  // Cierra la sesión y vuelve al login
  const cerrarSesion = () => { logout(); navigate('/login') }
  // Estados locales del formulario, aún no conectados al backend
  const { telefonoEmergencia, actualizarTelefonoEmergencia } = useDenuncias()
  const [notificaciones, setNotificaciones] = useState(true)
  const [mantenimiento, setMantenimiento] = useState(false)
  // Teléfono de emergencia (platform_settings.Telefono_emergencia): contacto de respaldo del feed de denuncias
  const [telefono, setTelefono] = useState(telefonoEmergencia)

  // TODO: al enviar, hacer PUT/PATCH a /api/admin/settings cuando exista el endpoint en Laravel
  const guardarCambios = (e) => {
    e.preventDefault()
    actualizarTelefonoEmergencia(telefono.trim())
    console.log('Configuración guardada (pendiente de conectar al backend)')
  }

  return (
    <div className="admin-layout">

      <aside className="admin-sidebar">
        <Link to="/home" className="admin-brand" title="Ir al Inicio">
          <img className="admin-brand__logo" src={Group} alt="Sello Guardián" />
        </Link>

        <nav className="admin-nav">
          <Link to="/admin" className="admin-nav__item">
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
          <Link to="/admin/configuracion" className="admin-nav__item admin-nav__item--active">
            <FiSettings /> <span>Configuración</span>
          </Link>
        </nav>

        <button className="admin-nav__item admin-nav__logout" onClick={cerrarSesion}>
          <FiLogOut /> <span>Cerrar sesión</span>
        </button>
      </aside>

      <div className="admin-content">
        <AdminTopbar placeholder="Buscar configuración..." />

        <main className="admin-main">
          <div className="admin-page-header">
            <h1 className="admin-title">Configuración</h1>
          </div>

          <form className="admin-form" onSubmit={guardarCambios}>
            <div className="admin-form-group">
              <label>Nombre de la plataforma</label>
              <input className="admin-input" type="text" defaultValue="Sello Guardián" />
            </div>

            <div className="admin-form-group">
              <label>Correo de soporte</label>
              <input className="admin-input" type="email" defaultValue="soporte@selloguardian.com" />
            </div>

            <div className="admin-form-group">
              <label>Teléfono de emergencia (contacto de rescate)</label>
              <input
                className="admin-input"
                type="tel"
                placeholder="+57 300 000 0000"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>

            <div className="admin-toggle-row">
              <span>Notificaciones por correo</span>
              <div
                className={`admin-toggle ${notificaciones ? 'admin-toggle--on' : ''}`}
                onClick={() => setNotificaciones(!notificaciones)}
              >
                <div className="admin-toggle__dot" />
              </div>
            </div>

            <div className="admin-toggle-row">
              <span>Modo mantenimiento</span>
              <div
                className={`admin-toggle ${mantenimiento ? 'admin-toggle--on' : ''}`}
                onClick={() => setMantenimiento(!mantenimiento)}
              >
                <div className="admin-toggle__dot" />
              </div>
            </div>

            <button type="submit" className="admin-save-btn">
              <FiSave /> Guardar cambios
            </button>
          </form>
        </main>

        <footer className="admin-footer">
          Sello Guardián 2026. Panel administrativo.
        </footer>
      </div>
    </div>
  )
}

export default AdminConfiguracion

