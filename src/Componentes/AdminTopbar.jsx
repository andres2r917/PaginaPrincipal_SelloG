import { useState, useRef, useEffect } from 'react'
import { FiSearch, FiBell, FiX, FiUser } from 'react-icons/fi'
import { useAuth } from '../Context/AuthContext.jsx'

// Notificaciones de ejemplo (se pueden pasar por prop para personalizarlas por página)
const NOTIF_DEFAULT = [
  { id: 1, texto: 'Solicitud de adopción #2458 aprobada', tipo: 'exito', tiempo: 'Hace 26 min' },
  { id: 2, texto: 'Nueva denuncia registrada — Zona Norte', tipo: 'info', tiempo: 'Hace 40 min' },
  { id: 3, texto: 'Nueva mascota agregada: Max (Perro)', tipo: 'info', tiempo: 'Hace 1 h' },
  { id: 4, texto: 'Fundación "Huellitas Felices" pendiente de verificación', tipo: 'pendiente', tiempo: 'Hace 3 h' },
]

const AdminTopbar = ({ placeholder = 'Buscar...', notificaciones = NOTIF_DEFAULT }) => {
  const { usuario, actualizarUsuario } = useAuth()

  const [notifAbierta, setNotifAbierta] = useState(false)
  const [perfilAbierto, setPerfilAbierto] = useState(false)
  const [formPerfil, setFormPerfil] = useState({
    nombre: usuario?.nombre || '',
    email: usuario?.email || '',
  })
  const [guardado, setGuardado] = useState(false)

  const notifRef = useRef(null)
  const inicial =
    usuario?.nombre?.trim()?.charAt(0)?.toUpperCase() ||
    usuario?.email?.charAt(0)?.toUpperCase() || 'A'

  // Cierra el panel de notificaciones al hacer clic fuera
  useEffect(() => {
    const cerrar = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifAbierta(false)
      }
    }
    document.addEventListener('click', cerrar)
    return () => document.removeEventListener('click', cerrar)
  }, [])

  const abrirPerfil = () => {
    // Sincroniza el form con los datos actuales de la sesión al abrir
    setFormPerfil({ nombre: usuario?.nombre || '', email: usuario?.email || '' })
    setGuardado(false)
    setPerfilAbierto(true)
  }

  const guardarPerfil = (e) => {
    e.preventDefault()
    actualizarUsuario(formPerfil)
    setGuardado(true)
  }

  return (
    <>
      <header className="admin-topbar">
        <div className="admin-topbar__search">
          <FiSearch />
          <input type="text" placeholder={placeholder} />
        </div>

        <div className="admin-topbar__actions">
          {/* Campana de notificaciones */}
          <div ref={notifRef} className="adm-notif-wrap">
            <button
              className="admin-icon-btn"
              onClick={(e) => { e.stopPropagation(); setNotifAbierta((p) => !p) }}
              aria-label="Notificaciones"
              aria-expanded={notifAbierta}
            >
              <FiBell />
              {notificaciones.length > 0 && <span className="admin-icon-btn__dot" />}
            </button>

            {notifAbierta && (
              <div className="adm-notif-panel">
                <div className="adm-notif-panel__head">
                  <strong>Notificaciones</strong>
                  <span className="adm-notif-badge">{notificaciones.length}</span>
                </div>
                <ul className="adm-notif-list">
                  {notificaciones.map((n) => (
                    <li key={n.id} className="adm-notif-item">
                      <span className={`admin-activity-dot admin-activity-dot--${n.tipo}`} />
                      <div className="adm-notif-item__body">
                        <p>{n.texto}</p>
                        <span className="admin-activity-time">{n.tiempo}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Avatar — abre modal de perfil */}
          <button
            className="admin-avatar adm-avatar-btn"
            onClick={abrirPerfil}
            aria-label="Editar perfil"
            title="Mi perfil"
          >
            {usuario?.foto
              ? <img src={usuario.foto} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              : inicial}
          </button>
        </div>
      </header>

      {/* Modal de perfil */}
      {perfilAbierto && (
        <div className="fnd-modal__fondo" onClick={() => setPerfilAbierto(false)}>
          <div className="fnd-modal adm-perfil-modal" onClick={(e) => e.stopPropagation()}>
            <button className="fnd-modal__cerrar" onClick={() => setPerfilAbierto(false)}>
              <FiX />
            </button>

            {/* Cabecera del modal */}
            <div className="adm-perfil-modal__cabecera">
              <div className="adm-perfil-modal__avatar">
                {usuario?.foto
                  ? <img src={usuario.foto} alt="Perfil" />
                  : <FiUser size={28} />}
              </div>
              <div>
                <h2 className="fnd-modal__titulo" style={{ marginBottom: 2 }}>Mi perfil</h2>
                <span className="admin-badge--neutro" style={{ fontSize: 12 }}>
                  {usuario?.rol === 'admin' ? 'Administrador' : 'Fundación'}
                </span>
              </div>
            </div>

            <form onSubmit={guardarPerfil}>
              <div className="fnd-modal__campo">
                <label className="fnd-modal__label">Nombre</label>
                <input
                  className="fnd-modal__input"
                  value={formPerfil.nombre}
                  onChange={(e) => { setFormPerfil((p) => ({ ...p, nombre: e.target.value })); setGuardado(false) }}
                  required
                />
              </div>
              <div className="fnd-modal__campo">
                <label className="fnd-modal__label">Correo electrónico</label>
                <input
                  className="fnd-modal__input"
                  type="email"
                  value={formPerfil.email}
                  onChange={(e) => { setFormPerfil((p) => ({ ...p, email: e.target.value })); setGuardado(false) }}
                  required
                />
              </div>

              <div className="fnd-modal__acciones">
                {guardado && <span className="adm-perfil-modal__ok">✓ Cambios guardados</span>}
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

export default AdminTopbar
