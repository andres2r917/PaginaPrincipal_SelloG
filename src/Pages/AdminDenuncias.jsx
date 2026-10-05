import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext.jsx'
import {
  FiGrid, FiClipboard, FiDatabase, FiAlertTriangle,
  FiUsers, FiSettings, FiLogOut, FiEye
} from 'react-icons/fi'
import { FaPaw } from 'react-icons/fa'
import AdminTopbar from '../Componentes/AdminTopbar.jsx'
import '../Style/AdminDashboard.css'
import '../Style/AdminTablas.css'

// TODO: reemplazar por fetch a GET /api/admin/denunciations cuando exista el endpoint en Laravel
const denuncias = [
  { id: 189, tipo: 'Maltrato animal', ubicacion: 'Calle 45 #23-10, Bogotá', estado: 'Pendiente', urgencia: 'Alta', fecha: '02/09/2026', anonima: true },
  { id: 188, tipo: 'Abandono', ubicacion: 'Carrera 7 con Calle 12, Chía', estado: 'En proceso', urgencia: 'Media', fecha: '01/09/2026', anonima: false },
  { id: 187, tipo: 'Perro extraviado', ubicacion: 'Av. Industrial #4-88, Medellín', estado: 'Atendido', urgencia: 'Baja', fecha: '30/08/2026', anonima: false },
]

const badgePorEstado = {
  Pendiente: 'admin-badge--critico',
  'En proceso': 'admin-badge--pendiente',
  Atendido: 'admin-badge--exito',
}

const badgePorUrgencia = {
  Alta: 'admin-badge--critico',
  Media: 'admin-badge--pendiente',
  Baja: 'admin-badge--neutro',
}

const AdminDenuncias = () => {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  // Cierra la sesión y vuelve al login
  const cerrarSesion = () => { logout(); navigate('/login') }
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
          <Link to="/admin/denuncias" className="admin-nav__item admin-nav__item--active">
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

      <div className="admin-content">
        <AdminTopbar placeholder="Buscar denuncias..." />

        <main className="admin-main">
          <div className="admin-page-header">
            <h1 className="admin-title">Denuncias</h1>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tipo</th>
                  <th>Ubicación</th>
                  <th>Urgencia</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Anónima</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {denuncias.map(d => (
                  <tr key={d.id}>
                    <td>#{d.id}</td>
                    <td>{d.tipo}</td>
                    <td>{d.ubicacion}</td>
                    <td>
                      <span className={`admin-badge ${badgePorUrgencia[d.urgencia]}`}>{d.urgencia}</span>
                    </td>
                    <td>
                      <span className={`admin-badge ${badgePorEstado[d.estado]}`}>{d.estado}</span>
                    </td>
                    <td>{d.fecha}</td>
                    <td>{d.anonima ? 'Sí' : 'No'}</td>
                    <td>
                      <div className="admin-actions">
                        <button className="admin-action-btn" title="Ver detalle">
                          <FiEye />
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

export default AdminDenuncias

