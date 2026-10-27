import { useEffect, useState } from 'react'
import {
  FiCalendar,
  FiCheck,
  FiEye,
  FiImage,
  FiMail,
  FiMapPin,
  FiPhone,
  FiShield,
  FiX
} from 'react-icons/fi'
import { getFundaciones, verificarFundacion } from '../../Services/adminService.js'
import AdminTopbar from '../../Componentes/Admin/AdminTopbar.jsx'
import '../../Style/Admin/AdminDashboard.css'
import '../../Style/Admin/AdminTablas.css'
import '../../Style/Admin/AdminModal.css'
import { BADGE_FUNDACION, distintivo } from '../../Utils/estados.js'

// La API entrega la fecha en UTC; se muestra en la hora local
const formatearFecha = (iso) => (iso ? new Date(iso).toLocaleDateString('es-CO') : '')

const AdminFundacionRegistros = () => {

  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [aviso, setAviso] = useState('')
  const [solicitudSeleccionadaId, setSolicitudSeleccionadaId] = useState(null)
  // Al rechazar se pide el motivo (la API lo exige)
  const [rechazando, setRechazando] = useState(false)
  const [motivo, setMotivo] = useState('')
  const [guardando, setGuardando] = useState(false)

  const cargar = () =>
    getFundaciones()
      .then(setSolicitudes)
      .catch((error) => setAviso(error.message))
      .finally(() => setCargando(false))

  useEffect(() => {
    cargar()
  }, [])

  const cerrarModal = () => {
    setSolicitudSeleccionadaId(null)
    setRechazando(false)
    setMotivo('')
  }

  // Abre la revisión de una solicitud; con rechazar=true pide directamente el motivo
  const abrirSolicitud = (id, rechazar = false) => {
    setSolicitudSeleccionadaId(id)
    setRechazando(rechazar)
    setMotivo('')
  }

  // Aprueba o rechaza la fundación en la API y vuelve a cargar la lista
  const cambiarEstado = async (id, estado) => {
    if (guardando) return
    if (estado === 'rechazada' && !motivo.trim()) {
      setAviso('Escribe el motivo del rechazo.')
      return
    }
    setGuardando(true)
    setAviso('')
    try {
      await verificarFundacion(id, estado, motivo.trim())
      await cargar()
      cerrarModal()
    } catch (error) {
      setAviso(error.message)
    }
    setGuardando(false)
  }

  const solicitudActiva = solicitudes.find(s => s.id === solicitudSeleccionadaId) || null

  return (
    <>


        <AdminTopbar placeholder="Buscar fundaciones por nombre o cédula..." />

        <main className="admin-main">
          <div className="admin-page-header">
            <h1 className="admin-title">Solicitudes de Registro de Fundaciones</h1>
          </div>

          {aviso && <p className="admin-aviso" role="alert">{aviso}</p>}
          {cargando && <p className="admin-vacio">Cargando fundaciones...</p>}
          {!cargando && solicitudes.length === 0 && !aviso && (
            <p className="admin-vacio">Todavía no hay fundaciones registradas.</p>
          )}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fundación</th>
                  <th>Cédula representante</th>
                  <th>Representante</th>
                  <th>Correo</th>
                  <th>Fecha solicitud</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map(s => (
                  <tr key={s.id}>
                    <td>#{s.id}</td>
                    <td>{s.nombre}</td>
                    <td>{s.cedulaRepresentante}</td>
                    <td>{s.representante}</td>
                    <td>{s.correo}</td>
                    <td>{formatearFecha(s.fechaSolicitud)}</td>
                    <td>
                      <span className={`admin-badge ${distintivo(BADGE_FUNDACION, s.estado).cls}`}>{distintivo(BADGE_FUNDACION, s.estado).txt}</span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        {/* Ver detalles: abre el modal con todos los datos para decidir */}
                        <button
                          className="admin-action-btn"
                          title="Revisar solicitud"
                          onClick={() => abrirSolicitud(s.id)}
                        >
                          <FiEye />
                        </button>
                        {/* Acciones rápidas solo para pendientes */}
                        {s.estado === 'pendiente' && (
                          <>
                            <button
                              className="admin-action-btn admin-action-btn--aprobar"
                              title="Aprobar registro"
                              onClick={() => cambiarEstado(s.id, 'verificada')}
                            >
                              <FiCheck />
                            </button>
                            <button
                              className="admin-action-btn admin-action-btn--rechazar"
                              title="Rechazar registro"
                              onClick={() => abrirSolicitud(s.id, true)}
                            >
                              <FiX />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>


      {/* ── VENTANA MODAL: REVISIÓN DE SOLICITUD DE FUNDACIÓN ── */}
      {solicitudActiva && (
        <div className="admin-modal-backdrop" onClick={cerrarModal}>
          <div className="admin-modal admin-modal--lg" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <div className="admin-modal__header-left">
                <h2 className="admin-modal__title">{solicitudActiva.nombre}</h2>
                <span className={`admin-badge ${distintivo(BADGE_FUNDACION, solicitudActiva.estado).cls}`}>
                  {distintivo(BADGE_FUNDACION, solicitudActiva.estado).txt}
                </span>
              </div>
              <button
                className="admin-modal__close-btn"
                onClick={cerrarModal}
                title="Cerrar"
              >
                <FiX />
              </button>
            </div>

            <div className="admin-modal__body">
              {/* Datos de identificación */}
              <div className="admin-modal__grid">
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Cédula del representante</span>
                  <span className="admin-detail-value">{solicitudActiva.cedulaRepresentante}</span>
                </div>
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Representante legal</span>
                  <span className="admin-detail-value">{solicitudActiva.representante}</span>
                </div>
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Teléfono de contacto</span>
                  <span className="admin-detail-value">
                    <FiPhone className="icono-texto" />
                    {solicitudActiva.telefono}
                  </span>
                </div>
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Correo electrónico</span>
                  <span className="admin-detail-value">
                    <FiMail className="icono-texto" />
                    {solicitudActiva.correo}
                  </span>
                </div>
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Ciudad / Dirección</span>
                  <span className="admin-detail-value">
                    <FiMapPin className="icono-texto" />
                    {solicitudActiva.direccion}
                  </span>
                </div>
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Capacidad del albergue</span>
                  <span className="admin-detail-value">{solicitudActiva.capacidad} animales</span>
                </div>
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Fecha de solicitud</span>
                  <span className="admin-detail-value">
                    <FiCalendar className="icono-texto" />
                    {formatearFecha(solicitudActiva.fechaSolicitud)}
                  </span>
                </div>
              </div>

              {/* Descripción que envió la fundación */}
              <div className="admin-modal__section">
                <span className="admin-modal__section-title">
                  <FiShield className="icono-texto" />
                  Descripción de la fundación (enviada por el solicitante)
                </span>
                <p className="admin-modal__text">
                  {solicitudActiva.descripcion || 'La fundación no escribió una descripción.'}
                </p>
              </div>

              {/* Fotos y videos opcionales que adjuntó al registrarse */}
              <div className="admin-modal__section">
                <span className="admin-modal__section-title">
                  <FiImage className="icono-texto" />
                  Fotos y videos de la fundación (opcional)
                </span>
                {solicitudActiva.evidencias.length === 0 ? (
                  <p className="admin-modal__text">No adjuntó fotos ni videos.</p>
                ) : (
                  <div className="admin-modal__media">
                    {solicitudActiva.evidencias.map((e) =>
                      e.tipoArchivo?.startsWith('video/')
                        ? <video key={e.id} src={e.url} controls preload="metadata" />
                        : (
                          <a key={e.id} href={e.url} target="_blank" rel="noreferrer">
                            <img src={e.url} alt={`Foto de ${solicitudActiva.nombre}`} />
                          </a>
                        )
                    )}
                  </div>
                )}
              </div>

              {solicitudActiva.estado === 'rechazada' && solicitudActiva.motivoRechazo && (
                <div className="admin-modal__section">
                  <span className="admin-modal__section-title">Motivo del rechazo</span>
                  <p className="admin-modal__text">{solicitudActiva.motivoRechazo}</p>
                </div>
              )}

              {/* Motivo: obligatorio para rechazar */}
              {rechazando && (
                <div className="admin-modal__section">
                  <label className="admin-modal__section-title" htmlFor="motivo-rechazo">
                    Motivo del rechazo
                  </label>
                  <textarea
                    id="motivo-rechazo"
                    className="admin-modal__textarea"
                    rows={3}
                    placeholder="Explica por qué se rechaza la solicitud"
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                  />
                </div>
              )}

              {aviso && <p className="admin-aviso" role="alert">{aviso}</p>}
            </div>

            <div className="admin-modal__footer">
              <div className="admin-modal__actions-left">
                {solicitudActiva.estado !== 'verificada' && !rechazando && (
                  <button
                    className="admin-modal__btn admin-modal__btn--success"
                    disabled={guardando}
                    onClick={() => cambiarEstado(solicitudActiva.id, 'verificada')}
                  >
                    <FiCheck /> Aprobar registro — dar acceso a la plataforma
                  </button>
                )}
                {solicitudActiva.estado !== 'rechazada' && !rechazando && (
                  <button
                    className="admin-modal__btn admin-modal__btn--danger"
                    onClick={() => setRechazando(true)}
                  >
                    <FiX /> Rechazar solicitud
                  </button>
                )}
                {rechazando && (
                  <button
                    className="admin-modal__btn admin-modal__btn--danger"
                    disabled={guardando}
                    onClick={() => cambiarEstado(solicitudActiva.id, 'rechazada')}
                  >
                    <FiX /> {guardando ? 'Guardando...' : 'Confirmar rechazo'}
                  </button>
                )}
              </div>
              <button
                className="admin-modal__btn admin-modal__btn--secondary"
                onClick={cerrarModal}
              >
                Cerrar ventana
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  )
}

export default AdminFundacionRegistros


