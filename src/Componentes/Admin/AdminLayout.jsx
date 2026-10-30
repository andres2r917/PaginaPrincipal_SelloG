import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  FiGrid, FiClipboard, FiDatabase, FiAlertTriangle,
  FiUsers, FiSettings, FiLogOut
} from 'react-icons/fi'
import { useAuth } from '../../Context/AuthContext.jsx'
import Group from '../../assets/Group.svg'
import { BRAND, BRAND_LOGO, CONTENT, FOOTER, LAYOUT, NAV, NAV_SALIR, SIDEBAR, navItem } from '../../Utils/panelEstilos'

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
    <div className={LAYOUT}>
      <aside className={SIDEBAR}>
        <Link to="/home" className={BRAND} title="Ir al Inicio">
          <img className={BRAND_LOGO} src={Group} alt="Sello Guardián" />
        </Link>

        <nav className={NAV}>
          {ENLACES.map((e) => (
            <NavLink
              key={e.to}
              to={e.to}
              end={e.exacto}
              className={navItem}
            >
              {e.icono} <span>{e.texto}</span>
            </NavLink>
          ))}
        </nav>

        <button className={NAV_SALIR} onClick={cerrarSesion}>
          <FiLogOut /> <span>Cerrar sesión</span>
        </button>
      </aside>

      <div className={CONTENT}>
        <Outlet />
        <footer className={FOOTER}>
          Sello Guardián 2026. Panel administrativo.
        </footer>
      </div>
    </div>
  )
}

export default AdminLayout
