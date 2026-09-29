import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiGrid, FiClipboard, FiDatabase, FiAlertTriangle,
  FiUsers, FiSettings, FiLogOut, FiBell, FiSearch, FiEye
} from 'react-icons/fi'
import { FaPaw } from 'react-icons/fa'
import '../Style/AdminDashboard.css'
import '../Style/AdminTablas.css'

// TODO: reemplazar por fetch a GET /api/admin/usercivils, /api/admin/foundations y /api/admin/administrators
const civiles = [
  { id: 1, nombre: 'Carlos Ruiz', correo: 'carlos.ruiz@mail.com', ciudad: 'Bogotá', estado: 'Activo' },
  { id: 2, nombre: 'Ana Torres', correo: 'ana.torres@mail.com', ciudad: 'Medellín', estado: 'Activo' },
]

const fundaciones = [
  { id: 1, nombre: 'Huellitas Felices', nit: '900123456-1', ciudad: 'Bogotá', estado: 'Verificada' },
  { id: 2, nombre: 'Patitas al Rescate', nit: '900654321-2', ciudad: 'Cali', estado: 'Pendiente' },
]

const administradores = [
  { id: 1, nombre: 'Admin Principal', correo: 'admin@selloguardian.com', rol: 'Superadmin' },
]

const badgePorEstado = {
  Activo: 'admin-badge--exito',
  Verificada: 'admin-badge--exito',
  Pendiente: 'admin-badge--pendiente',
}

const AdminUsuarios = () => {
  // Controla qué pestaña está activa: civiles, fundaciones o administradores
  const [tabActiva, setTabActiva] = useState('civiles')

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
          <Link to="/admin/usuarios" className="admin-nav__item admin-nav__item--active">
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
            <h1 className="admin-title">Usuarios y Fundaciones</h1>
          </div>

          <div className="admin-tabs">
            <button
              className={`admin-tab ${tabActiva === 'civiles' ? 'admin-tab--active' : ''}`}
              onClick={() => setTabActiva('civiles')}
            >
              Civiles
            </button>
            <button
              className={`admin-tab ${tabActiva === 'fundaciones' ? 'admin-tab--active' : ''}`}
              onClick={() => setTabActiva('fundaciones')}
            >
              Fundaciones
            </button>
            <button
              className={`admin-tab ${tabActiva === 'administradores' ? 'admin-tab--active' : ''}`}
              onClick={() => setTabActiva('administradores')}
            >
              Administradores
            </button>
          </div>

          {tabActiva === 'civiles' && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Ciudad</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {civiles.map(c => (
                    <tr key={c.id}>
                      <td>{c.nombre}</td>
                      <td>{c.correo}</td>
                      <td>{c.ciudad}</td>
                      <td><span className={`admin-badge ${badgePorEstado[c.estado]}`}>{c.estado}</span></td>
                      <td>
                        <div className="admin-actions">
                          <button className="admin-action-btn" title="Ver detalle"><FiEye /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tabActiva === 'fundaciones' && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>NIT</th>
                    <th>Ciudad</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {fundaciones.map(f => (
                    <tr key={f.id}>
                      <td>{f.nombre}</td>
                      <td>{f.nit}</td>
                      <td>{f.ciudad}</td>
                      <td><span className={`admin-badge ${badgePorEstado[f.estado]}`}>{f.estado}</span></td>
                      <td>
                        <div className="admin-actions">
                          <button className="admin-action-btn" title="Ver detalle"><FiEye /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tabActiva === 'administradores' && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {administradores.map(a => (
                    <tr key={a.id}>
                      <td>{a.nombre}</td>
                      <td>{a.correo}</td>
                      <td>{a.rol}</td>
                      <td>
                        <div className="admin-actions">
                          <button className="admin-action-btn" title="Ver detalle"><FiEye /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>

        <footer className="admin-footer">
          Sello Guardián 2026. Panel administrativo.
        </footer>
      </div>
    </div>
  )
}

export default AdminUsuarios

