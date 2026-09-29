import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiGrid, FiClipboard, FiDatabase, FiAlertTriangle,
  FiUsers, FiSettings, FiLogOut, FiBell, FiSearch, FiSave
} from 'react-icons/fi'
import { FaPaw } from 'react-icons/fa'
import '../Style/AdminDashboard.css'
import '../Style/AdminTablas.css'

const AdminConfiguracion = () => {
  // Estados locales del formulario, aún no conectados al backend
  const [notificaciones, setNotificaciones] = useState(true)
  const [mantenimiento, setMantenimiento] = useState(false)

  // TODO: al enviar, hacer PUT/PATCH a /api/admin/settings cuando exista el endpoint en Laravel
  const guardarCambios = (e) => {
    e.preventDefault()
    console.log('Configuración guardada (pendiente de conectar al backend)')
  }

  return (
    <div className="admin-layout">

      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand__badge"><FaPaw /></span>
          <span className="admin-brand__name">Sello <span>Guardián</span></span>
        </div>

        <nav className="admin-nav">
          <Link to="/admin" className="admin-nav__item">
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
          <Link to="/admin/configuracion" className="admin-nav__item admin-nav__item--active">
            <FiSettings /> <span>Configuración</span>
          </Link>
        </nav>

        <button className="admin-nav__item admin-nav__logout">
          <FiLogOut /> <span>Cerrar sesión</span>
        </button>
      </aside>

      <div className="admin-content">
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

