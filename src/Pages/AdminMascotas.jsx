import React from 'react'
import { Link } from 'react-router-dom'
import {
  FiGrid, FiClipboard, FiDatabase, FiAlertTriangle,
  FiUsers, FiSettings, FiLogOut, FiBell, FiSearch, FiPlus, FiEye, FiEdit2
} from 'react-icons/fi'
import { FaPaw } from 'react-icons/fa'
import '../Style/AdminDashboard.css'
import '../Style/AdminTablas.css'

// TODO: reemplazar por fetch a GET /api/admin/pets cuando exista el endpoint en Laravel
const mascotas = [
  { id: 1, nombre: 'Luna', raza: 'Labrador', edad: '2 años', fundacion: 'Huellitas Felices', estado: 'Disponible' },
  { id: 2, nombre: 'Milan', raza: 'Golden', edad: '1 año', fundacion: 'Patitas al Rescate', estado: 'En proceso' },
  { id: 3, nombre: 'Thor', raza: 'Doberman', edad: '3 años', fundacion: 'Huellitas Felices', estado: 'Adoptado' },
  { id: 4, nombre: 'Coco', raza: 'Beagle', edad: '8 meses', fundacion: 'Amigos Peludos', estado: 'Disponible' },
]

const badgePorEstado = {
  Disponible: 'admin-badge--exito',
  'En proceso': 'admin-badge--pendiente',
  Adoptado: 'admin-badge--neutro',
}

const AdminMascotas = () => {
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
          <Link to="/admin/mascotas" className="admin-nav__item admin-nav__item--active">
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
            <h1 className="admin-title">Mascotas</h1>
            <button className="admin-btn-add">
              <FiPlus /> Agregar mascota
            </button>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Raza</th>
                  <th>Edad</th>
                  <th>Fundación</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {mascotas.map(m => (
                  <tr key={m.id}>
                    <td>{m.nombre}</td>
                    <td>{m.raza}</td>
                    <td>{m.edad}</td>
                    <td>{m.fundacion}</td>
                    <td>
                      <span className={`admin-badge ${badgePorEstado[m.estado]}`}>{m.estado}</span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button className="admin-action-btn" title="Ver detalle">
                          <FiEye />
                        </button>
                        <button className="admin-action-btn" title="Editar">
                          <FiEdit2 />
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

export default AdminMascotas

