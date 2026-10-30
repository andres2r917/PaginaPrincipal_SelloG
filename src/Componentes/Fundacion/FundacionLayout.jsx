import { useState, useEffect, useRef } from 'react'
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom'
import {
  FiActivity,
  FiAlertTriangle,
  FiBarChart2,
  FiCheck,
  FiColumns,
  FiFileText,
  FiGrid,
  FiHeart,
  FiLogOut,
  FiSearch,
  FiSettings,
  FiUser,
  FiUsers,
  FiX
} from 'react-icons/fi'
import Group from '../../assets/Group.svg'
import { useAuth } from '../../Context/AuthContext.jsx'
import { useFundacion } from '../../Context/FundacionContext.jsx'
import { useDenuncias } from '../../Context/DenunciasContext.jsx'
import { ETIQUETA_TIPO } from '../../Utils/estados.js'
import Notificaciones from '../Notificaciones.jsx'
import '../../Style/Fundacion/FundacionPanel.css'
import { BADGE_COLOR } from '../../Utils/adminEstilos'
import { AVATAR_BTN, BRAND, BRAND_LOGO, CONTENT, ICON_BTN, LAYOUT, MAIN, NAV, PERFIL_AVATAR, PERFIL_CABECERA, PERFIL_OK, SELECT, SIDEBAR, TOPBAR, TOPBAR_ACCIONES, TOPBAR_SEARCH, navItem } from '../../Utils/panelEstilos'

const FundacionLayout = () => {
  const { usuario, logout, guardarPerfilFundacion } = useAuth()
  const { mascotas, solicitudes } = useFundacion()
  const { denuncias } = useDenuncias()
  const navigate = useNavigate()
  const buscadorRef = useRef(null)

  const pendientes = solicitudes.filter((s) => ['pendiente', 'en_evaluacion'].includes(s.estado)).length

  const [perfilAbierto, setPerfilAbierto] = useState(false)
  const [formPerfil, setFormPerfil] = useState({ nombre: usuario?.nombre || '', email: usuario?.email || '' })
  const [guardado, setGuardado] = useState(false)
  const [errorPerfil, setErrorPerfil] = useState('')

  // Atajo Ctrl+K enfoca el buscador
  useEffect(() => {
    const atajo = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        buscadorRef.current?.focus()
      }
    }
    window.addEventListener('keydown', atajo)
    return () => window.removeEventListener('keydown', atajo)
  }, [])

  // Cierra la sesión y vuelve al login
  const cerrarSesion = () => { logout(); navigate('/login') }

  const abrirPerfil = () => {
    setFormPerfil({ nombre: usuario?.nombre || '', email: usuario?.email || '' })
    setGuardado(false)
    setErrorPerfil('')
    setPerfilAbierto(true)
  }

  // El nombre de la organización se guarda en la API
  const guardarPerfil = async (e) => {
    e.preventDefault()
    setErrorPerfil('')
    try {
      await guardarPerfilFundacion({ nombre: formPerfil.nombre })
      setGuardado(true)
    } catch (error) {
      setErrorPerfil(error.message)
    }
  }

  // Avisos reales: solicitudes por revisar y denuncias que nadie ha tomado
  const avisos = [
    ...solicitudes
      .filter((s) => ['pendiente', 'en_evaluacion'].includes(s.estado))
      .map((s) => ({
        id: `sol-${s.id}`,
        texto: `Solicitud de ${s.adoptante?.nombre || 'un adoptante'} por ${mascotas.find((m) => m.id === s.mascotaId)?.nombre || 'una mascota'}`,
        detalle: s.estado === 'pendiente' ? 'Pendiente de revisión' : 'En evaluación',
        tipo: 'pendiente',
        fecha: s.fecha,
        to: '/fundacion/adopciones',
      })),
    ...denuncias
      .filter((d) => !d.fundacionAsignada && ['pendiente', 'verificada'].includes(d.estado))
      .map((d) => ({
        id: `den-${d.id}`,
        texto: `Denuncia sin atender: ${ETIQUETA_TIPO[d.tipo] || d.tipo}`,
        detalle: d.ubicacion,
        tipo: d.urgencia === 'Alta' ? 'critico' : 'info',
        fecha: d.fecha,
        to: '/fundacion/denuncias',
      })),
  ]

  const items = [
    { to: '/fundacion', texto: 'Panel General', icono: <FiGrid />, fin: true },
    { to: '/fundacion/expedientes', texto: 'Expedientes Peluditos', icono: <FiFileText />, badge: mascotas.length },
    { to: '/fundacion/pipeline', texto: 'Pipeline de Peluditos', icono: <FiColumns /> },
    { to: '/fundacion/adopciones', texto: 'Adopciones', icono: <FiUsers />, badge: pendientes },
    { to: '/fundacion/historial-medico', texto: 'Historial Médico', icono: <FiActivity /> },
    { to: '/fundacion/donaciones', texto: 'Donaciones & Recursos', icono: <FiHeart /> },
    { to: '/fundacion/denuncias', texto: 'Casos de Denuncia', icono: <FiAlertTriangle /> },
    { to: '/fundacion/metricas', texto: 'Métricas & Auditoría', icono: <FiBarChart2 /> },
    { to: '/fundacion/ajustes', texto: 'Ajustes de Refugio', icono: <FiSettings /> },
  ]

  const inicial = usuario?.nombre?.trim()?.charAt(0)?.toUpperCase() || 'F'

  return (
    <>
      <div className={LAYOUT}>
        <aside className={SIDEBAR}>
          <Link to="/home" className={BRAND} title="Ir al Inicio">
            <img className={BRAND_LOGO} src={Group} alt="Sello Guardián" />
          </Link>

          <nav className={NAV}>
            {items.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.fin}
                className={navItem}
              >
                {it.icono} <span>{it.texto}</span>
                {it.badge > 0 && <span className="fnd-badge">{it.badge}</span>}
              </NavLink>
            ))}
          </nav>

          {/* Bloque de usuario al pie del menú */}
          <div className="fnd-usuario">
            <button className={AVATAR_BTN} onClick={abrirPerfil} aria-label="Editar perfil" title="Mi perfil">
              {usuario?.foto
                ? <img src={usuario.foto} alt="Foto de perfil" className="size-full rounded-full object-cover" />
                : inicial}
            </button>
            <div className="fnd-usuario__meta">
              <strong>{usuario?.nombre}</strong>
              <small>Fundación</small>
            </div>
            <button className={ICON_BTN} onClick={cerrarSesion} aria-label="Cerrar sesión">
              <FiLogOut />
            </button>
          </div>
        </aside>

        <div className={CONTENT}>
          <header className={TOPBAR}>
            <div className="fnd-breadcrumb">
              Sello Guardián <span>›</span> <strong>{usuario?.nombre}</strong>
            </div>

            <div className={TOPBAR_SEARCH}>
              <FiSearch />
              <input ref={buscadorRef} type="text" placeholder="Buscar animal o expediente..." aria-label="Buscar animal o expediente..." />
              <kbd className="fnd-kbd">Ctrl K</kbd>
            </div>

            <div className={TOPBAR_ACCIONES}>
              <select className={SELECT} defaultValue="mes">
                <option value="mes">Este mes</option>
                <option value="trimestre">Últimos 3 meses</option>
                <option value="anio">Este año</option>
              </select>

              {/* Campana: avisos reales; lo que ya leíste se recuerda en este navegador */}
              <Notificaciones key={usuario?.id} items={avisos} usuarioId={usuario?.id} />
            </div>
          </header>

          {/* Aquí se renderiza cada página del panel */}
          <main className={MAIN}>
            <Outlet />
          </main>
        </div>
      </div>

      {/* Modal de perfil de fundación */}
      {perfilAbierto && (
        <div className="fnd-modal__fondo" onClick={() => setPerfilAbierto(false)}>
          <div className={`fnd-modal`} onClick={(e) => e.stopPropagation()}>
            <button className="fnd-modal__cerrar" onClick={() => setPerfilAbierto(false)}>
              <FiX />
            </button>

            <div className={PERFIL_CABECERA}>
              <div className={PERFIL_AVATAR}>
                {usuario?.foto ? <img src={usuario.foto} alt="Foto de perfil" /> : <FiUser size={28} />}
              </div>
              <div>
                <h2 className="fnd-modal__titulo" style={{ marginBottom: 2 }}>Mi perfil</h2>
                <span className={BADGE_COLOR.neutro} style={{ fontSize: 12 }}>Fundación</span>
              </div>
            </div>

            <form onSubmit={guardarPerfil}>
              <div className="fnd-modal__campo">
                <label className="fnd-modal__label" htmlFor="fperfil-nombre-de-la-fundacion">Nombre de la fundación</label>
                <input id="fperfil-nombre-de-la-fundacion"
                  className="fnd-modal__input"
                  value={formPerfil.nombre}
                  onChange={(e) => { setFormPerfil((p) => ({ ...p, nombre: e.target.value })); setGuardado(false) }}
                  required
                />
              </div>
              <div className="fnd-modal__campo">
                <label className="fnd-modal__label" htmlFor="fperfil-correo-de-acceso">Correo de acceso</label>
                <input id="fperfil-correo-de-acceso"
                  className="fnd-modal__input"
                  type="email"
                  value={formPerfil.email}
                  readOnly
                  aria-readonly="true"
                  title="El correo de acceso no se puede cambiar desde aquí"
                />
              </div>
              {errorPerfil && <p className="fnd-aviso fnd-aviso--error" role="alert">{errorPerfil}</p>}
              <div className="fnd-modal__acciones">
                {guardado && <span className={PERFIL_OK}><FiCheck /> Cambios guardados</span>}
                <button type="button" className="fnd-modal__btn fnd-modal__btn--secundario" onClick={() => setPerfilAbierto(false)}>
                  Cancelar
                </button>
                <button type="submit" className="fnd-modal__btn fnd-modal__btn--primario">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default FundacionLayout

