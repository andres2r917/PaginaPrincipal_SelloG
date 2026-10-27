import { useState, useEffect, useRef } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom';
import '../Style/Header.css'
import Group from '../assets/Group.svg'
import { useAuth } from '../Context/AuthContext'
import { useDenuncias } from '../Context/DenunciasContext.jsx'
import { getMisSolicitudes } from '../Services/mascotasService.js'
import Notificaciones from './Notificaciones.jsx'
import { ETIQUETA_TIPO } from '../Utils/estados.js'
import { limpiarTexto } from '../Utils/limpiarTexto.js'

// Páginas a las que se puede saltar desde el buscador
const PAGINAS = [
  { texto: 'Inicio', to: '/home' },
  { texto: 'Adopción', to: '/adopcion' },
  { texto: 'Denuncias', to: '/denuncia' },
]

const Header = () => {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const menuRef = useRef(null)
  const { denuncias, misDenuncias } = useDenuncias()
  const [solicitudes, setSolicitudes] = useState([])

  // Buscador: texto escrito, si el listado está abierto y la sugerencia marcada con el teclado
  const [texto, setTexto] = useState('')
  const [buscadorAbierto, setBuscadorAbierto] = useState(false)
  const [activo, setActivo] = useState(-1)
  const buscadorRef = useRef(null)

  // Cierra el menú al hacer clic fuera de él
  useEffect(() => {
    const cerrarAlClickAfuera = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuAbierto(false)
      if (buscadorRef.current && !buscadorRef.current.contains(e.target)) setBuscadorAbierto(false)
    }
    document.addEventListener('click', cerrarAlClickAfuera)
    return () => document.removeEventListener('click', cerrarAlClickAfuera)
  }, [])

  // Solo el usuario civil envía solicitudes: se consultan al entrar y cada minuto
  const esCivil = usuario?.rol === 'civil'
  useEffect(() => {
    if (!esCivil) return
    let activo = true
    const cargar = () => {
      if (document.hidden) return
      getMisSolicitudes()
        .then((lista) => activo && setSolicitudes(lista))
        .catch(() => {
          // Sin conexión se conservan los avisos que ya estaban
        })
    }
    cargar()
    const temporizador = setInterval(cargar, 60000)
    return () => {
      activo = false
      clearInterval(temporizador)
    }
  }, [esCivil])

  // Avisos del usuario: lo que decidió la fundación y cómo avanzan sus denuncias.
  // El estado va en el id: cada cambio es un aviso nuevo.
  const avisos = !esCivil ? [] : [
    ...solicitudes
      .filter((s) => s.estado !== 'pendiente')
      .map((s) => {
        const texto = {
          aprobada: `¡Tu solicitud por ${s.mascota} fue aprobada!`,
          rechazada: `Tu solicitud por ${s.mascota} no fue aprobada`,
          en_evaluacion: `${s.fundacion} está evaluando tu solicitud por ${s.mascota}`,
        }[s.estado]
        const detalle = {
          aprobada: `${s.fundacion} se pondrá en contacto contigo${s.telefonoFundacion ? ` o llámala al ${s.telefonoFundacion}` : ''}.`,
          rechazada: s.comentarios || s.fundacion,
          en_evaluacion: s.comentarios || undefined,
        }[s.estado]
        const tipo = { aprobada: 'exito', rechazada: 'critico', en_evaluacion: 'info' }[s.estado]
        return { id: `sol-${s.id}-${s.estado}`, texto, detalle, tipo, fecha: s.fecha, to: '/mis-solicitudes' }
      }),
    ...misDenuncias
      .filter((d) => d.estado !== 'pendiente')
      .map((d) => {
        const texto = {
          verificada: 'El equipo verificó tu denuncia',
          en_rescate: `${d.fundacionAsignada?.nombre || 'Una fundación'} se hizo cargo de tu denuncia`,
          resuelta: 'Tu denuncia fue resuelta',
          descartada: 'Tu denuncia fue descartada',
        }[d.estado]
        const tipo = { verificada: 'info', en_rescate: 'exito', resuelta: 'exito', descartada: 'critico' }[d.estado]
        return { id: `den-${d.id}-${d.estado}`, texto, detalle: d.ubicacion, tipo, fecha: d.fecha, to: '/denuncia' }
      }),
  ]

  // Sugerencias: páginas y denuncias que coinciden, más buscar el texto en Adopción o en Denuncias
  const consulta = texto.trim()
  const q = limpiarTexto(consulta)
  const sugerencias = q.length === 0 ? [] : [
    ...PAGINAS
      .filter((pg) => limpiarTexto(pg.texto).includes(q))
      .map((pg) => ({ grupo: 'Páginas', clave: pg.to, titulo: pg.texto, to: pg.to })),
    ...denuncias
      .filter((d) => d.estado !== 'descartada'
        && limpiarTexto(`${ETIQUETA_TIPO[d.tipo] || d.tipo} ${d.descripcion} ${d.ubicacion}`).includes(q))
      .slice(0, 3)
      .map((d) => ({ grupo: 'Denuncias', clave: `d${d.id}`, titulo: ETIQUETA_TIPO[d.tipo] || d.tipo, detalle: d.ubicacion, to: `/denuncia?caso=${d.id}` })),
    { grupo: 'Buscar en', clave: 'adopcion', titulo: `«${consulta}» en Adopción`, to: `/adopcion?buscar=${encodeURIComponent(consulta)}` },
    { grupo: 'Buscar en', clave: 'denuncias', titulo: `«${consulta}» en Denuncias`, to: `/denuncia?buscar=${encodeURIComponent(consulta)}` },
  ]
  const mostrarSugerencias = buscadorAbierto && sugerencias.length > 0

  const irA = (destino) => {
    navigate(destino)
    setTexto('')
    setActivo(-1)
    setBuscadorAbierto(false)
  }

  // Enter: abre la sugerencia marcada o, si no hay ninguna, busca el texto en Adopción
  const enviarBusqueda = (e) => {
    e.preventDefault()
    if (sugerencias.length === 0) return
    irA((sugerencias[activo] ?? sugerencias.find((s) => s.clave === 'adopcion')).to)
  }

  const manejarTeclas = (e) => {
    if (e.key === 'Escape') {
      setBuscadorAbierto(false)
    } else if (e.key === 'ArrowDown' && sugerencias.length) {
      e.preventDefault()
      setActivo((a) => (a + 1) % sugerencias.length)
    } else if (e.key === 'ArrowUp' && sugerencias.length) {
      e.preventDefault()
      setActivo((a) => (a <= 0 ? sugerencias.length - 1 : a - 1))
    }
  }

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
               <img className='group' src={Group} alt="Sello Guardián" />
              <div className="items">
                <NavLink to="/home" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Inicio</NavLink>
                <NavLink to="/adopcion" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Adopcion</NavLink>
                <NavLink to="/denuncia" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Denuncia</NavLink>
              </div>
            </div>
            <div className="search-container" ref={buscadorRef}>
              <div className="search-box">
                <form className="search-input-wrapper" role="search" onSubmit={enviarBusqueda}>
                  <input
                    type="text"
                    placeholder="¿Qué buscas?"
                    aria-label="¿Qué buscas?"
                    autoComplete="off"
                    value={texto}
                    onChange={(e) => { setTexto(e.target.value); setActivo(-1); setBuscadorAbierto(true) }}
                    onFocus={() => setBuscadorAbierto(true)}
                    onKeyDown={manejarTeclas}
                  />
                  <button type="submit" className="search-button" aria-label="Buscar">
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
                </form>

                {mostrarSugerencias && (
                  <ul className="search-dropdown" role="listbox">
                    {sugerencias.map((sug, i) => (
                      <li key={sug.clave} role="presentation">
                        {sug.grupo !== sugerencias[i - 1]?.grupo && (
                          <span className="search-dropdown__grupo">{sug.grupo}</span>
                        )}
                        <button
                          type="button"
                          role="option"
                          aria-selected={i === activo}
                          className={`search-dropdown__item${i === activo ? ' search-dropdown__item--activo' : ''}`}
                          onMouseEnter={() => setActivo(i)}
                          onClick={() => irA(sug.to)}
                        >
                          <strong>{sug.titulo}</strong>
                          {sug.detalle && <small>{sug.detalle}</small>}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="auth-buttons">
              {usuario ? (
                <>
                {esCivil && <Notificaciones key={usuario.id} items={avisos} usuarioId={usuario.id} />}
                <div className="perfil-menu" ref={menuRef}>
                  <button
                    type="button"
                    className="perfil-avatar"
                    onClick={(e) => { e.stopPropagation(); setMenuAbierto((p) => !p) }}
                    aria-label="Menú de perfil"
                    aria-expanded={menuAbierto}
                  >
                    {usuario.foto ? <img src={usuario.foto} alt="Foto de perfil" /> : <span>{inicial}</span>}
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
                      {esCivil && (
                        <Link to="/mis-solicitudes" className="perfil-dropdown__item" onClick={() => setMenuAbierto(false)}>
                          Mis solicitudes
                        </Link>
                      )}
                      <button type="button" className="perfil-dropdown__item perfil-dropdown__logout" onClick={handleLogout}>
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="auth-btn login-btn">Iniciar sesión</Link>
                  <Link to="/registro" className="auth-btn register-btn">Registrarme</Link>
                </>
              )}
            </div>
          </nav>
      </header>
  )
}
export default Header