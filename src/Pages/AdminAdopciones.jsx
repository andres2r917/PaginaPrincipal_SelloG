import React from 'react'
import { Link } from 'react-router-dom'
import {
  FiGrid, FiClipboard, FiDatabase, FiAlertTriangle,
  FiUsers, FiSettings, FiLogOut, FiBell, FiSearch, FiCheck, FiX
} from 'react-icons/fi'
import { FaPaw } from 'react-icons/fa'
import '../Style/AdminDashboard.css'
import '../Style/AdminTablas.css'

// TODO: reemplazar por fetch a GET /api/admin/adoption-applications cuando exista el endpoint en Laravel
const solicitudes = [
  { id: 101, mascota: 'Luna', solicitante: 'Carlos Ruiz', fundacion: 'Huellitas Felices', fecha: '02/09/2026', estado: 'Pendiente' },
  { id: 102, mascota: 'Milan', solicitante: 'Ana Torres', fundacion: 'Patitas al Rescate', fecha: '01/09/2026', estado: 'Aprobada' },
  { id: 103, mascota: 'Thor', solicitante: 'Julián Pérez', fundacion: 'Huellitas Felices', fecha: '30/08/2026', estado: 'Rechazada' },
  { id: 104, mascota: 'Coco', solicitante: 'María Gómez', fundacion: 'Amigos Peludos', fecha: '29/08/2026', estado: 'Pendiente' },
]

const badgePorEstado = {
  Pendiente: 'admin-badge--pendiente',
  Aprobada: 'admin-badge--exito',
  Rechazada: 'admin-badge--critico',
}

const AdminAdopciones = () => {
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
          <Link to="/admin/adopciones" className="admin-nav__item admin-nav__item--active">
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
            <h1 className="admin-title">Solicitudes de Adopción</h1>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Mascota</th>
                  <th>Solicitante</th>
                  <th>Fundación</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map(s => (
                  <tr key={s.id}>
                    <td>#{s.id}</td>
                    <td>{s.mascota}</td>
                    <td>{s.solicitante}</td>
                    <td>{s.fundacion}</td>
                    <td>{s.fecha}</td>
                    <td>
                      <span className={`admin-badge ${badgePorEstado[s.estado]}`}>{s.estado}</span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button className="admin-action-btn admin-action-btn--aprobar" title="Aprobar">
                          <FiCheck />
                        </button>
                        <button className="admin-action-btn admin-action-btn--rechazar" title="Rechazar">
                          <FiX />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        <footer className="admin-footer">
          Sello Guardián 2026. Panel administrativo.
        </footer>
      </div>
    </div>
  )
}

export default AdminAdopciones

