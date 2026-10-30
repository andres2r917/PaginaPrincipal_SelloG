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
import { BADGE_FUNDACION, distintivo } from '../../Utils/estados.js'
import { ACCIONES, ACCION_APROBAR, ACCION_BTN, ACCION_RECHAZAR, AVISO, BADGE, BTN_EXITO, BTN_PELIGRO, BTN_SECUNDARIO, DETALLE_ITEM, DETALLE_LABEL, DETALLE_VALOR, MODAL_ACCIONES_IZQ, MODAL_CABECERA, MODAL_CABECERA_IZQ, MODAL_CERRAR, MODAL_CUERPO, MODAL_FONDO, MODAL_GRID, MODAL_LG, MODAL_MEDIA, MODAL_PIE, MODAL_SECCION, MODAL_SECCION_TITULO, MODAL_TEXTAREA, MODAL_TEXTO, MODAL_TITULO, PAGE_HEADER, TABLA, TABLA_WRAP, VACIO } from '../../Utils/adminEstilos'
import { MAIN, TITULO } from '../../Utils/panelEstilos'

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

        <main className={MAIN}>
          <div className={PAGE_HEADER}>
            <h1 className={TITULO}>Solicitudes de Registro de Fundaciones</h1>
          </div>

          {aviso && <p className={AVISO} role="alert">{aviso}</p>}
          {cargando && <p className={VACIO}>Cargando fundaciones...</p>}
          {!cargando && solicitudes.length === 0 && !aviso && (
            <p className={VACIO}>Todavía no hay fundaciones registradas.</p>
          )}

          <div className={TABLA_WRAP}>
            <table className={TABLA}>
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
                      <span className={`${BADGE} ${distintivo(BADGE_FUNDACION, s.estado).cls}`}>{distintivo(BADGE_FUNDACION, s.estado).txt}</span>
                    </td>
                    <td>
                      <div className={ACCIONES}>
                        {/* Ver detalles: abre el modal con todos los datos para decidir */}
                        <button
                          className={ACCION_BTN}
                          title="Revisar solicitud"
                          onClick={() => abrirSolicitud(s.id)}
                        >
                          <FiEye />
                        </button>
                        {/* Acciones rápidas solo para pendientes */}
                        {s.estado === 'pendiente' && (
                          <>
                            <button
                              className={ACCION_APROBAR}
                              title="Aprobar registro"
                              onClick={() => cambiarEstado(s.id, 'verificada')}
                            >
                              <FiCheck />
                            </button>
                            <button
                              className={ACCION_RECHAZAR}
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
        <div className={MODAL_FONDO} onClick={cerrarModal}>
          <div className={MODAL_LG} onClick={e => e.stopPropagation()}>
            <div className={MODAL_CABECERA}>
              <div className={MODAL_CABECERA_IZQ}>
                <h2 className={MODAL_TITULO}>{solicitudActiva.nombre}</h2>
                <span className={`${BADGE} ${distintivo(BADGE_FUNDACION, solicitudActiva.estado).cls}`}>
                  {distintivo(BADGE_FUNDACION, solicitudActiva.estado).txt}
                </span>
              </div>
              <button
                className={MODAL_CERRAR}
                onClick={cerrarModal}
                title="Cerrar"
              >
                <FiX />
              </button>
            </div>

            <div className={MODAL_CUERPO}>
              {/* Datos de identificación */}
              <div className={MODAL_GRID}>
                <div className={DETALLE_ITEM}>
                  <span className={DETALLE_LABEL}>Cédula del representante</span>
                  <span className={DETALLE_VALOR}>{solicitudActiva.cedulaRepresentante}</span>
                </div>
                <div className={DETALLE_ITEM}>
                  <span className={DETALLE_LABEL}>Representante legal</span>
                  <span className={DETALLE_VALOR}>{solicitudActiva.representante}</span>
                </div>
                <div className={DETALLE_ITEM}>
                  <span className={DETALLE_LABEL}>Teléfono de contacto</span>
                  <span className={DETALLE_VALOR}>
                    <FiPhone className="mr-1.5 align-middle" />
                    {solicitudActiva.telefono}
                  </span>
                </div>
                <div className={DETALLE_ITEM}>
                  <span className={DETALLE_LABEL}>Correo electrónico</span>
                  <span className={DETALLE_VALOR}>
                    <FiMail className="mr-1.5 align-middle" />
                    {solicitudActiva.correo}
                  </span>
                </div>
                <div className={DETALLE_ITEM}>
                  <span className={DETALLE_LABEL}>Ciudad / Dirección</span>
                  <span className={DETALLE_VALOR}>
                    <FiMapPin className="mr-1.5 align-middle" />
                    {solicitudActiva.direccion}
                  </span>
                </div>
                <div className={DETALLE_ITEM}>
                  <span className={DETALLE_LABEL}>Capacidad del albergue</span>
                  <span className={DETALLE_VALOR}>{solicitudActiva.capacidad} animales</span>
                </div>
                <div className={DETALLE_ITEM}>
                  <span className={DETALLE_LABEL}>Fecha de solicitud</span>
                  <span className={DETALLE_VALOR}>
                    <FiCalendar className="mr-1.5 align-middle" />
                    {formatearFecha(solicitudActiva.fechaSolicitud)}
                  </span>
                </div>
              </div>

              {/* Descripción que envió la fundación */}
              <div className={MODAL_SECCION}>
                <span className={MODAL_SECCION_TITULO}>
                  <FiShield className="mr-1.5 align-middle" />
                  Descripción de la fundación (enviada por el solicitante)
                </span>
                <p className={MODAL_TEXTO}>
                  {solicitudActiva.descripcion || 'La fundación no escribió una descripción.'}
                </p>
              </div>

              {/* Fotos y videos opcionales que adjuntó al registrarse */}
              <div className={MODAL_SECCION}>
                <span className={MODAL_SECCION_TITULO}>
                  <FiImage className="mr-1.5 align-middle" />
                  Fotos y videos de la fundación (opcional)
                </span>
                {solicitudActiva.evidencias.length === 0 ? (
                  <p className={MODAL_TEXTO}>No adjuntó fotos ni videos.</p>
                ) : (
                  <div className={MODAL_MEDIA}>
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
                <div className={MODAL_SECCION}>
                  <span className={MODAL_SECCION_TITULO}>Motivo del rechazo</span>
                  <p className={MODAL_TEXTO}>{solicitudActiva.motivoRechazo}</p>
                </div>
              )}

              {/* Motivo: obligatorio para rechazar */}
              {rechazando && (
                <div className={MODAL_SECCION}>
                  <label className={MODAL_SECCION_TITULO} htmlFor="motivo-rechazo">
                    Motivo del rechazo
                  </label>
                  <textarea
                    id="motivo-rechazo"
                    className={MODAL_TEXTAREA}
                    rows={3}
                    placeholder="Explica por qué se rechaza la solicitud"
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                  />
                </div>
              )}

              {aviso && <p className={AVISO} role="alert">{aviso}</p>}
            </div>

            <div className={MODAL_PIE}>
              <div className={MODAL_ACCIONES_IZQ}>
                {solicitudActiva.estado !== 'verificada' && !rechazando && (
                  <button
                    className={BTN_EXITO}
                    disabled={guardando}
                    onClick={() => cambiarEstado(solicitudActiva.id, 'verificada')}
                  >
                    <FiCheck /> Aprobar registro — dar acceso a la plataforma
                  </button>
                )}
                {solicitudActiva.estado !== 'rechazada' && !rechazando && (
                  <button
                    className={BTN_PELIGRO}
                    onClick={() => setRechazando(true)}
                  >
                    <FiX /> Rechazar solicitud
                  </button>
                )}
                {rechazando && (
                  <button
                    className={BTN_PELIGRO}
                    disabled={guardando}
                    onClick={() => cambiarEstado(solicitudActiva.id, 'rechazada')}
                  >
                    <FiX /> {guardando ? 'Guardando...' : 'Confirmar rechazo'}
                  </button>
                )}
              </div>
              <button
                className={BTN_SECUNDARIO}
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


