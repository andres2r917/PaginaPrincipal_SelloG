import { useState, useEffect, useRef } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom';
import Group from '../assets/Group.svg'
import { useAuth } from '../Context/AuthContext'
import { useDenuncias } from '../Context/DenunciasContext.jsx'
import { getMisSolicitudes } from '../Services/mascotasService.js'
import Notificaciones from './Notificaciones.jsx'
import { ETIQUETA_TIPO } from '../Utils/estados.js'
import { limpiarTexto } from '../Utils/limpiarTexto.js'

// Estilos con Tailwind. Los colores de la marca salen de @theme (index.css)
const NAV_BAR =
  'relative z-50 m-0 flex w-full max-w-none items-center justify-between border-b border-[rgba(124,58,237,0.2)] bg-[#0d0d14] px-12 py-[10px] text-white'
const NAV_ITEM =
  'relative rounded-full px-4 py-[7px] font-medium no-underline transition-[color,background-color] duration-200 ease-[ease]'
const NAV_ITEM_REPOSO = `${NAV_ITEM} text-[rgba(241,245,249,0.65)] hover:bg-[rgba(124,58,237,0.12)] hover:text-white`
// Item activo: pill púrpura sólido
const NAV_ITEM_ACTIVO = `${NAV_ITEM} bg-primario font-semibold text-white`
const BUSCADOR =
  'flex w-[220px] flex-row-reverse items-center gap-2 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] px-[14px] py-[6px] transition-[border-color,background-color] duration-200 ease-[ease] focus-within:border-[rgba(124,58,237,0.55)] focus-within:bg-[rgba(124,58,237,0.08)]'
const BUSCADOR_INPUT =
  'w-full border-none bg-transparent text-[14px] text-white outline-none placeholder:text-[rgba(241,245,249,0.62)] focus-visible:outline-none'
const BUSCADOR_BOTON = 'group flex shrink-0 cursor-pointer items-center justify-center border-none bg-transparent p-0'
const BUSCADOR_ICONO =
  'size-4 text-[rgba(241,245,249,0.62)] transition-[color] duration-200 ease-[ease] group-hover:text-acento'
// Sugerencias del buscador
const SUGERENCIAS =
  'absolute top-[calc(100%+10px)] left-1/2 z-60 w-[340px] max-w-[90vw] -translate-x-1/2 list-none rounded-[14px] border border-[rgba(124,58,237,0.35)] bg-fondo p-2 shadow-[0_16px_40px_rgba(0,0,0,0.5)]'
const SUGERENCIA_GRUPO = 'block px-[10px] pt-2 pb-1 text-[0.7rem] font-extrabold tracking-[0.06em] text-acento uppercase'
const SUGERENCIA =
  'flex w-full cursor-pointer flex-col gap-[2px] rounded-lg border-none px-[10px] py-2 text-left text-[0.85rem] text-texto'
const SUGERENCIA_DETALLE = 'text-[0.75rem] text-[rgba(241,245,249,0.62)]'
// Botones de sesión
const AUTH_BTN =
  'inline-flex cursor-pointer items-center justify-center rounded-full px-[18px] py-2 text-[13.5px] font-semibold whitespace-nowrap no-underline transition-all duration-200 ease-[ease] hover:-translate-y-px active:translate-y-0'
const BTN_LOGIN = `${AUTH_BTN} border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.05)] text-texto-claro backdrop-blur-[8px] hover:border-[rgba(196,181,253,0.45)] hover:bg-[rgba(255,255,255,0.12)] hover:text-white`
const BTN_REGISTRO = `${AUTH_BTN} border border-[rgba(124,58,237,0.6)] bg-primario text-white shadow-[0_0_16px_rgba(124,58,237,0.35)] hover:bg-primario-oscuro hover:shadow-[0_0_24px_rgba(124,58,237,0.55)]`
const LOGO =
  'block h-[clamp(44px,8vh,54px)] w-auto object-contain transition-[scale] duration-300 ease-[ease] hover:scale-[1.08]'
// Avatar y menú de sesión
const AVATAR =
  'flex size-[46px] cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-[rgba(196,181,253,0.95)] bg-transparent bg-[linear-gradient(135deg,rgba(124,58,237,0.96),rgba(168,85,247,0.82))] p-0 font-extrabold text-white shadow-[0_8px_18px_rgba(124,58,237,0.38)] transition-[translate,scale,box-shadow,border-color] duration-200 ease-[ease] hover:-translate-y-px hover:scale-[1.02] hover:border-[rgba(255,255,255,0.9)] hover:shadow-[0_12px_24px_rgba(124,58,237,0.48)]'
const FOTO = 'size-full object-cover'
const MENU =
  'absolute top-[calc(100%+14px)] right-0 z-50 w-[230px] rounded-[18px] border border-[rgba(196,181,253,0.26)] bg-[rgba(15,23,42,0.97)] p-[10px] shadow-[0_18px_40px_rgba(15,23,42,0.52)] backdrop-blur-[10px]'
const MENU_USUARIO =
  'mb-2 flex items-center gap-3 border-b border-[rgba(255,255,255,0.08)] px-[10px] pt-[10px] pb-4'
const MENU_AVATAR =
  'flex size-[42px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-[rgba(196,181,253,0.38)] bg-[linear-gradient(135deg,rgba(124,58,237,0.3),rgba(168,85,247,0.18))] font-bold text-white'
const MENU_ITEM_BASE =
  'block w-full cursor-pointer rounded-[10px] bg-transparent px-3 py-[10px] text-left text-[14px] font-semibold no-underline transition-[background-color,color,translate] duration-200 ease-[ease] hover:translate-x-0.5'
const MENU_ITEM = `${MENU_ITEM_BASE} border-none text-[#e2e8f0] hover:bg-[rgba(124,58,237,0.18)] hover:text-[#f5f3ff]`
const MENU_SALIR = `${MENU_ITEM_BASE} mt-[6px] border-0 border-t border-[rgba(255,255,255,0.08)] text-[#fca5a5] hover:bg-[rgba(239,68,68,0.12)] hover:text-[#fecaca]`

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
          <nav className={NAV_BAR}>
            <div className="flex items-center justify-start gap-12">
               <img className={LOGO} src={Group} alt="Sello Guardián" />
              <div className="flex items-center justify-center gap-1 text-[15px]">
                <NavLink to="/home" className={({ isActive }) => isActive ? NAV_ITEM_ACTIVO : NAV_ITEM_REPOSO}>Inicio</NavLink>
                <NavLink to="/adopcion" className={({ isActive }) => isActive ? NAV_ITEM_ACTIVO : NAV_ITEM_REPOSO}>Adopcion</NavLink>
                <NavLink to="/denuncia" className={({ isActive }) => isActive ? NAV_ITEM_ACTIVO : NAV_ITEM_REPOSO}>Denuncia</NavLink>
              </div>
            </div>
            <div className="flex flex-1 justify-center" ref={buscadorRef}>
              <div className="relative">
                <form className={BUSCADOR} role="search" onSubmit={enviarBusqueda}>
                  <input
                    className={BUSCADOR_INPUT}
                    type="text"
                    placeholder="¿Qué buscas?"
                    aria-label="¿Qué buscas?"
                    autoComplete="off"
                    value={texto}
                    onChange={(e) => { setTexto(e.target.value); setActivo(-1); setBuscadorAbierto(true) }}
                    onFocus={() => setBuscadorAbierto(true)}
                    onKeyDown={manejarTeclas}
                  />
                  <button type="submit" className={BUSCADOR_BOTON} aria-label="Buscar">
                    <svg
                      className={BUSCADOR_ICONO}
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
                  <ul className={SUGERENCIAS} role="listbox">
                    {sugerencias.map((sug, i) => (
                      <li key={sug.clave} role="presentation">
                        {sug.grupo !== sugerencias[i - 1]?.grupo && (
                          <span className={SUGERENCIA_GRUPO}>{sug.grupo}</span>
                        )}
                        <button
                          type="button"
                          role="option"
                          aria-selected={i === activo}
                          className={`${SUGERENCIA} ${i === activo ? 'bg-[rgba(124,58,237,0.25)]' : 'bg-transparent'}`}
                          onMouseEnter={() => setActivo(i)}
                          onClick={() => irA(sug.to)}
                        >
                          <strong>{sug.titulo}</strong>
                          {sug.detalle && <small className={SUGERENCIA_DETALLE}>{sug.detalle}</small>}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="flex items-center gap-[10px] text-[14px]">
              {usuario ? (
                <>
                {esCivil && <Notificaciones key={usuario.id} items={avisos} usuarioId={usuario.id} />}
                <div className="relative z-40" ref={menuRef}>
                  <button
                    type="button"
                    className={AVATAR}
                    onClick={(e) => { e.stopPropagation(); setMenuAbierto((p) => !p) }}
                    aria-label="Menú de perfil"
                    aria-expanded={menuAbierto}
                  >
                    {usuario.foto ? <img className={FOTO} src={usuario.foto} alt="Foto de perfil" /> : <span>{inicial}</span>}
                  </button>

                  {menuAbierto && (
                    <div className={MENU} onClick={(e) => e.stopPropagation()}>
                      <div className={MENU_USUARIO}>
                        <div className={MENU_AVATAR}>
                          {usuario.foto ? <img className={FOTO} src={usuario.foto} alt={usuario.nombre} /> : <span>{inicial}</span>}
                        </div>
                        <div className="flex min-w-0 flex-col gap-[2px]">
                          <strong className="truncate text-[14px] text-texto">{usuario.nombre || 'Usuario'}</strong>
                          <small className="truncate text-[11px] text-[rgba(241,245,249,0.72)]">{usuario.email}</small>
                        </div>
                      </div>
                      <Link to={enlacePanel.to} className={MENU_ITEM} onClick={() => setMenuAbierto(false)}>
                        {enlacePanel.texto}
                      </Link>
                      {esCivil && (
                        <Link to="/mis-solicitudes" className={MENU_ITEM} onClick={() => setMenuAbierto(false)}>
                          Mis solicitudes
                        </Link>
                      )}
                      <button type="button" className={MENU_SALIR} onClick={handleLogout}>
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
                </>
              ) : (
                <>
                  <Link to="/login" className={BTN_LOGIN}>Iniciar sesión</Link>
                  <Link to="/registro" className={BTN_REGISTRO}>Registrarme</Link>
                </>
              )}
            </div>
          </nav>
      </header>
  )
}
export default Header