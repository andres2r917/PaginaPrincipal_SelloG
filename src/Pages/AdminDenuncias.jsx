import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext.jsx'
import { useDenuncias } from '../Context/DenunciasContext.jsx'
import { ETIQUETA_TIPO } from '../Data/seedDenuncias.js'
import {
  FiGrid, FiClipboard, FiDatabase, FiAlertTriangle,
  FiUsers, FiSettings, FiLogOut, FiEye, FiCheck, FiX,
  FiMapPin, FiCalendar, FiUser, FiExternalLink, FiShield
} from 'react-icons/fi'
import Group from '../assets/Group.svg'
import AdminTopbar from '../Componentes/AdminTopbar.jsx'
import '../Style/AdminDashboard.css'
import '../Style/AdminTablas.css'
import '../Style/AdminModal.css'

// Estados definidos en Laravel (Estado_denuncia)
const badgePorEstado = {
  pendiente: { cls: 'admin-badge--pendiente', txt: 'Pendiente' },
  verificada: { cls: 'admin-badge--exito', txt: 'Verificada' },
  en_rescate: { cls: 'admin-badge--info', txt: 'En rescate' },
  resuelta: { cls: 'admin-badge--neutro', txt: 'Resuelta' },
  descartada: { cls: 'admin-badge--critico', txt: 'Descartada' },
}

const badgePorUrgencia = {
  Alta: 'admin-badge--critico',
  Media: 'admin-badge--pendiente',
  Baja: 'admin-badge--neutro',
  alta: 'admin-badge--critico',
  media: 'admin-badge--pendiente',
  baja: 'admin-badge--neutro',
}

const fundacionesDisponibles = [
  { id: 1, nombre: 'Huellitas Felices', telefono: '+57 310 000 0001' },
  { id: 2, nombre: 'Patitas al Rescate', telefono: '+57 311 000 0002' },
]

const AdminDenuncias = () => {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const { denuncias, cambiarEstado, asignarFundacion } = useDenuncias()
  const [denunciaSeleccionadaId, setDenunciaSeleccionadaId] = useState(null)

  // Cierra la sesión y vuelve al login
  const cerrarSesion = () => { logout(); navigate('/login') }

  // Denuncia actualmente abierta en el modal (dinámica según el estado en contexto)
  const denunciaSeleccionada = denuncias.find(d => d.id === denunciaSeleccionadaId) || null

  const listaEvidencias = denunciaSeleccionada
    ? (Array.isArray(denunciaSeleccionada.evidencia) && denunciaSeleccionada.evidencia.length > 0
        ? denunciaSeleccionada.evidencia
        : (Array.isArray(denunciaSeleccionada.evidencias) ? denunciaSeleccionada.evidencias : []))
    : []

  const ubicacionTexto = denunciaSeleccionada?.ubicacion || denunciaSeleccionada?.direccion || 'Popayán, Cauca'
  const latFinal = denunciaSeleccionada?.latitud ?? denunciaSeleccionada?.lat ?? null
  const lngFinal = denunciaSeleccionada?.longitud ?? denunciaSeleccionada?.lng ?? null
  const urlMaps = latFinal != null && lngFinal != null
    ? `https://www.google.com/maps/search/?api=1&query=${latFinal},${lngFinal}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ubicacionTexto)}`

  return (
    <div className="admin-layout">

      <aside className="admin-sidebar">
        <Link to="/home" className="admin-brand" title="Ir al Inicio">
          <img className="admin-brand__logo" src={Group} alt="Sello Guardián" />
        </Link>

        <nav className="admin-nav">
          <Link to="/admin" className="admin-nav__item">
            <FiGrid /> <span>Dashboard</span>
          </Link>
          <Link to="/admin/adopciones" className="admin-nav__item">
            <FiClipboard /> <span>Registro de Fundaciones</span>
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
                    <td>{ETIQUETA_TIPO[d.tipo] || d.tipo}</td>
                    <td>{d.ubicacion || d.direccion}</td>
                    <td>
                      <span className={`admin-badge ${badgePorUrgencia[d.urgencia] || 'admin-badge--neutro'}`}>{d.urgencia}</span>
                    </td>
                    <td>
                      <span className={`admin-badge ${badgePorEstado[d.estado]?.cls || 'admin-badge--neutro'}`}>
                        {badgePorEstado[d.estado]?.txt || d.estado}
                      </span>
                      {d.fundacionAsignada && (
                        <div style={{ fontSize: 12, opacity: 0.7 }}>{d.fundacionAsignada.nombre}</div>
                      )}
                    </td>
                    <td>{new Date(d.fecha).toLocaleDateString('es-CO')}</td>
                    <td>{d.anonima ? 'Sí' : 'No'}</td>
                    <td>
                      <div className="admin-actions">
                        <button
                          className="admin-action-btn"
                          title="Ver detalle"
                          onClick={() => setDenunciaSeleccionadaId(d.id)}
                        >
                          <FiEye />
                        </button>
                        {d.estado === 'pendiente' && (
                          <button
                            className="admin-action-btn"
                            title="Verificar evidencia"
                            onClick={() => cambiarEstado(d.id, 'verificada')}
                          >
                            <FiCheck />
                          </button>
                        )}
                        {['pendiente', 'verificada'].includes(d.estado) && (
                          <button
                            className="admin-action-btn"
                            title="Descartar"
                            onClick={() => cambiarEstado(d.id, 'descartada')}
                          >
                            <FiX />
                          </button>
                        )}
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

      {/* ── VENTANA MODAL DE DETALLES DE DENUNCIA ── */}
      {denunciaSeleccionada && (
        <div className="admin-modal-backdrop" onClick={() => setDenunciaSeleccionadaId(null)}>
          <div className="admin-modal admin-modal--lg" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <div className="admin-modal__header-left">
                <h2 className="admin-modal__title">
                  Denuncia #{denunciaSeleccionada.id}
                </h2>
                <span className={`admin-badge ${badgePorUrgencia[denunciaSeleccionada.urgencia] || 'admin-badge--neutro'}`}>
                  Urgencia {denunciaSeleccionada.urgencia}
                </span>
                <span className={`admin-badge ${badgePorEstado[denunciaSeleccionada.estado]?.cls || 'admin-badge--neutro'}`}>
                  {badgePorEstado[denunciaSeleccionada.estado]?.txt || denunciaSeleccionada.estado}
                </span>
              </div>
              <button
                className="admin-modal__close-btn"
                onClick={() => setDenunciaSeleccionadaId(null)}
                title="Cerrar modal"
              >
                ✕
              </button>
            </div>

            <div className="admin-modal__body">
              {/* Grid de información clave */}
              <div className="admin-modal__grid">
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Tipo de denuncia</span>
                  <span className="admin-detail-value">
                    {ETIQUETA_TIPO[denunciaSeleccionada.tipo] || denunciaSeleccionada.tipo}
                  </span>
                </div>

                <div className="admin-detail-item">
                  <span className="admin-detail-label">Fecha y hora de reporte</span>
                  <span className="admin-detail-value">
                    <FiCalendar style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    {new Date(denunciaSeleccionada.fecha).toLocaleString('es-CO')}
                  </span>
                </div>

                <div className="admin-detail-item">
                  <span className="admin-detail-label">Denunciante</span>
                  <span className="admin-detail-value">
                    <FiUser style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    {denunciaSeleccionada.anonima
                      ? 'Denuncia anónima (identidad protegida)'
                      : (denunciaSeleccionada.reportadoPor?.nombre || denunciaSeleccionada.autor || 'Usuario registrado')}
                  </span>
                </div>

                <div className="admin-detail-item">
                  <span className="admin-detail-label">Fundación asignada</span>
                  <span className="admin-detail-value">
                    <FiShield style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    {denunciaSeleccionada.fundacionAsignada
                      ? `${denunciaSeleccionada.fundacionAsignada.nombre} (${denunciaSeleccionada.fundacionAsignada.telefono || 'Sin tel.'})`
                      : 'Sin fundación asignada'}
                  </span>
                </div>
              </div>

              {/* Ubicación */}
              <div className="admin-modal__section">
                <span className="admin-modal__section-title">Ubicación de los hechos</span>
                <p className="admin-modal__text" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiMapPin style={{ color: '#C4B5FD', flexShrink: 0 }} />
                  <span>{ubicacionTexto}</span>
                </p>
                <div>
                  <a
                    href={urlMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-modal__btn admin-modal__btn--secondary"
                    style={{ fontSize: '0.82rem', marginTop: '4px' }}
                  >
                    <FiExternalLink /> Ver ubicación en Google Maps
                  </a>
                </div>
              </div>

              {/* Descripción */}
              <div className="admin-modal__section">
                <span className="admin-modal__section-title">Descripción del incidente</span>
                <p className="admin-modal__text">
                  {denunciaSeleccionada.descripcion || 'Sin descripción detallada provista.'}
                </p>
              </div>

              {/* Evidencias fotográficas */}
              <div className="admin-modal__section">
                <span className="admin-modal__section-title">Evidencias fotográficas ({listaEvidencias.length})</span>
                {listaEvidencias.length === 0 ? (
                  <p className="admin-modal__text" style={{ fontStyle: 'italic', color: '#94A3B8' }}>
                    Este caso no cuenta con archivos fotográficos adjuntos.
                  </p>
                ) : (
                  <div className="admin-modal__gallery">
                    {listaEvidencias.map((ev, idx) => {
                      const urlFoto = typeof ev === 'string' ? ev : ev?.url
                      return (
                        <a key={idx} href={urlFoto} target="_blank" rel="noopener noreferrer" title="Ver imagen completa">
                          <img
                            src={urlFoto}
                            alt={`Evidencia ${idx + 1}`}
                            className="admin-modal__gallery-img"
                            loading="lazy"
                          />
                        </a>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Asignación de fundación */}
              {!denunciaSeleccionada.fundacionAsignada && denunciaSeleccionada.estado !== 'descartada' && (
                <div className="admin-modal__section">
                  <span className="admin-modal__section-title">Asignar a una fundación de rescate</span>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                    {fundacionesDisponibles.map(f => (
                      <button
                        key={f.id}
                        type="button"
                        className="admin-modal__btn admin-modal__btn--secondary"
                        onClick={() => asignarFundacion(denunciaSeleccionada.id, f)}
                      >
                        Asignar a {f.nombre}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="admin-modal__footer">
              <div className="admin-modal__actions-left">
                {denunciaSeleccionada.estado === 'pendiente' && (
                  <button
                    className="admin-modal__btn admin-modal__btn--success"
                    onClick={() => cambiarEstado(denunciaSeleccionada.id, 'verificada')}
                  >
                    <FiCheck /> Marcar como Verificada
                  </button>
                )}

                {denunciaSeleccionada.estado === 'verificada' && (
                  <button
                    className="admin-modal__btn admin-modal__btn--primary"
                    onClick={() => cambiarEstado(denunciaSeleccionada.id, 'en_rescate')}
                  >
                    Pasar a "En rescate"
                  </button>
                )}

                {['verificada', 'en_rescate'].includes(denunciaSeleccionada.estado) && (
                  <button
                    className="admin-modal__btn admin-modal__btn--success"
                    onClick={() => cambiarEstado(denunciaSeleccionada.id, 'resuelta')}
                  >
                    <FiCheck /> Marcar como Resuelta
                  </button>
                )}

                {denunciaSeleccionada.estado !== 'descartada' && denunciaSeleccionada.estado !== 'resuelta' && (
                  <button
                    className="admin-modal__btn admin-modal__btn--danger"
                    onClick={() => cambiarEstado(denunciaSeleccionada.id, 'descartada')}
                  >
                    <FiX /> Descartar reporte
                  </button>
                )}
              </div>

              <button
                className="admin-modal__btn admin-modal__btn--secondary"
                onClick={() => setDenunciaSeleccionadaId(null)}
              >
                Cerrar ventana
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminDenuncias


