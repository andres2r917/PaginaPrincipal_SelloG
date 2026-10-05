import { useState, useEffect, useRef } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom';
import '../Style/Header.css'
import Group from '../assets/Group.svg'
import { useAuth } from '../Context/AuthContext'

const Header = () => {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const menuRef = useRef(null)

  // Cierra el menú al hacer clic fuera de él
  useEffect(() => {
    const cerrarAlClickAfuera = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuAbierto(false)
    }
    document.addEventListener('click', cerrarAlClickAfuera)
    return () => document.removeEventListener('click', cerrarAlClickAfuera)
  }, [])

  const handleLogout = () => {
    logout()
    setMenuAbierto(false)
    navigate('/home')
  }

  const inicial =
    usuario?.nombre?.trim()?.charAt(0)?.toUpperCase() ||
    usuario?.email?.charAt(0)?.toUpperCase() || 'U'

  // Enlace principal del menú según el rol
  const enlacePanel =
    usuario?.rol === 'admin' ? { to: '/admin', texto: 'Panel de administración' }
    : usuario?.rol === 'fundacion' ? { to: '/fundacion', texto: 'Panel de fundación' }
    : { to: '/perfil', texto: 'Mi perfil' }

  return (
     <header> 
          <nav className="nav-bar">
            <div className="nav-links">
               <img className='group' src={Group} alt="group" />
              <div className="items">
                <NavLink to="/home" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Inicio</NavLink>
                <NavLink to="/adopcion" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Adopcion</NavLink>
                <NavLink to="/denuncia" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Denuncia</NavLink>
              </div>
            </div>
            <div className="search-container">
              <div className="search-input-wrapper">
                <input type="text" placeholder="¿Qué buscas?" />
                <button className="search-button" aria-label="Buscar">
                  <svg
                    className="search-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                    <line x1="16.65" y1="16.65" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="auth-buttons">
              {usuario ? (
                <div className="perfil-menu" ref={menuRef}>
                  <button
                    type="button"
                    className="perfil-avatar"
                    onClick={(e) => { e.stopPropagation(); setMenuAbierto((p) => !p) }}
                    aria-label="Menú de perfil"
                    aria-expanded={menuAbierto}
                  >
                    {usuario.foto ? <img src={usuario.foto} alt="Perfil" /> : <span>{inicial}</span>}
                  </button>

                  {menuAbierto && (
                    <div className="perfil-dropdown" onClick={(e) => e.stopPropagation()}>
                      <div className="perfil-dropdown__user">
                        <div className="perfil-dropdown__avatar">
                          {usuario.foto ? <img src={usuario.foto} alt={usuario.nombre} /> : <span>{inicial}</span>}
                        </div>
                        <div className="perfil-dropdown__meta">
                          <strong>{usuario.nombre || 'Usuario'}</strong>
                          <small>{usuario.email}</small>
                        </div>
                      </div>
                      <Link to={enlacePanel.to} className="perfil-dropdown__item" onClick={() => setMenuAbierto(false)}>
                        {enlacePanel.texto}
                      </Link>
                      <button type="button" className="perfil-dropdown__item perfil-dropdown__logout" onClick={handleLogout}>
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="auth-btn login-btn">Iniciar sesión</Link>
              )}
            </div>
          </nav>
      </header>
  )
}
export default Header