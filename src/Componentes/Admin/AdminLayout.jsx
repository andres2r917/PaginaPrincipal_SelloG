import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  FiGrid, FiClipboard, FiDatabase, FiAlertTriangle,
  FiUsers, FiSettings, FiLogOut
} from 'react-icons/fi'
import { useAuth } from '../../Context/AuthContext.jsx'
import Group from '../../assets/Group.svg'
import '../../Style/Admin/AdminDashboard.css'

const ENLACES = [
  { to: '/admin', texto: 'Dashboard', icono: <FiGrid />, exacto: true },
  { to: '/admin/adopciones', texto: 'Registro de Fundaciones', icono: <FiClipboard /> },
  { to: '/admin/mascotas', texto: 'Mascotas', icono: <FiDatabase /> },
  { to: '/admin/denuncias', texto: 'Denuncias', icono: <FiAlertTriangle /> },
  { to: '/admin/usuarios', texto: 'Usuarios y Fundaciones', icono: <FiUsers /> },
  { to: '/admin/configuracion', texto: 'Configuración', icono: <FiSettings /> },
]

// Menú lateral y pie compartidos por todas las pantallas del panel de administración
const AdminLayout = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const cerrarSesion = () => { logout(); navigate('/login') }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Link to="/home" className="admin-brand" title="Ir al Inicio">
          <img className="admin-brand__logo" src={Group} alt="Sello Guardián" />
        </Link>

        <nav className="admin-nav">
          {ENLACES.map((e) => (
            <NavLink
              key={e.to}
              to={e.to}
              end={e.exacto}
              className={({ isActive }) => `admin-nav__item${isActive ? ' admin-nav__item--active' : ''}`}
            >
              {e.icono} <span>{e.texto}</span>
            </NavLink>
          ))}
        </nav>

        <button className="admin-nav__item admin-nav__logout" onClick={cerrarSesion}>
          <FiLogOut /> <span>Cerrar sesión</span>
        </button>
      </aside>

      <div className="admin-content">
        <Outlet />
        <footer className="admin-footer">
          Sello Guardián 2026. Panel administrativo.
        </footer>
      </div>
    </div>
  )
}

export default AdminLayout
