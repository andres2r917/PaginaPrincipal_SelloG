import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiActivity,
  FiCalendar,
  FiCheck,
  FiEye,
  FiFileText,
  FiMail,
  FiMapPin,
  FiPhone,
  FiShield,
  FiX
} from 'react-icons/fi'
import { getCiviles, getAdministradores, getFundaciones } from '../../Services/adminService.js'
import AdminTopbar from '../../Componentes/Admin/AdminTopbar.jsx'
import '../../Style/Admin/AdminDashboard.css'
import '../../Style/Admin/AdminTablas.css'
import '../../Style/Admin/AdminModal.css'
import { BADGE_FUNDACION, distintivo } from '../../Utils/estados.js'

const AdminUsuarios = () => {

  const [tabActiva, setTabActiva] = useState('civiles')
  const [civiles, setCiviles] = useState([])
  const [fundaciones, setFundaciones] = useState([])
  const [administradores, setAdministradores] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getCiviles(), getFundaciones(), getAdministradores()])
      .then(([c, f, a]) => {
        setCiviles(c)
        setFundaciones(f)
        setAdministradores(a)
      })
      .catch((e) => setError(e.message))
  }, [])

  // Control del modal: { tipo: 'civil' | 'fundacion' | 'admin', id: number }
  const [modalData, setModalData] = useState(null)

  // Entidad actualmente abierta en el modal
  const itemActivo = modalData
    ? (modalData.tipo === 'civil'
        ? civiles.find(c => c.id === modalData.id)
        : modalData.tipo === 'fundacion'
          ? fundaciones.find(f => f.id === modalData.id)
          : administradores.find(a => a.id === modalData.id))
    : null

  return (
    <>


        <AdminTopbar placeholder="Buscar usuarios y fundaciones..." />

        <main className="admin-main">
          <div className="admin-page-header">
            <h1 className="admin-title">Usuarios y Fundaciones</h1>
          </div>

          <div className="admin-tabs">
            {[['civiles', 'Civiles'], ['fundaciones', 'Fundaciones'], ['administradores', 'Administradores']].map(([clave, texto]) => (
              <button
                key={clave}
                className={`admin-tab ${tabActiva === clave ? 'admin-tab--active' : ''}`}
                onClick={() => setTabActiva(clave)}
              >
                {texto}
              </button>
            ))}
          </div>

          {error && <p role="alert" className="mb-3 text-peligro">{error}</p>}

          {tabActiva === 'civiles' && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>Nombre</th><th>Correo</th><th>Teléfono</th><th>Denuncias</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                  {civiles.map(c => (
                    <tr key={c.id}>
                      <td>{c.nombre}</td>
                      <td>{c.correo}</td>
                      <td>{c.telefono || '—'}</td>
                      <td>{c.denuncias}</td>
                      <td>
                        <div className="admin-actions">
                          <button className="admin-action-btn" title="Ver detalle" onClick={() => setModalData({ tipo: 'civil', id: c.id })}>
                            <FiEye />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tabActiva === 'fundaciones' && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>Nombre</th><th>Cédula Representante</th><th>Teléfono</th><th>Estado</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                  {fundaciones.map(f => (
                    <tr key={f.id}>
                      <td>{f.nombre}</td>
                      <td>{f.cedulaRepresentante}</td>
                      <td>{f.telefono}</td>
                      <td><span className={`admin-badge ${distintivo(BADGE_FUNDACION, f.estado).cls}`}>{distintivo(BADGE_FUNDACION, f.estado).txt}</span></td>
                      <td>
                        <div className="admin-actions">
                          <button className="admin-action-btn" title="Ver detalle" onClick={() => setModalData({ tipo: 'fundacion', id: f.id })}>
                            <FiEye />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tabActiva === 'administradores' && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>Nombre</th><th>Correo</th><th>Nivel de acceso</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                  {administradores.map(a => (
                    <tr key={a.id}>
                      <td>{a.nombre}</td>
                      <td>{a.correo}</td>
                      <td>{a.nivel}</td>
                      <td>
                        <div className="admin-actions">
                          <button className="admin-action-btn" title="Ver detalle" onClick={() => setModalData({ tipo: 'admin', id: a.id })}>
                            <FiEye />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>


      {/* ── MODAL DE DETALLE ── */}
      {modalData && itemActivo && (
        <div className="admin-modal-backdrop" onClick={() => setModalData(null)}>
          <div className="admin-modal admin-modal--lg" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <div className="admin-modal__header-left">
                <h2 className="admin-modal__title">
                  {modalData.tipo === 'civil' && `Usuario: ${itemActivo.nombre}`}
                  {modalData.tipo === 'fundacion' && `Fundación: ${itemActivo.nombre}`}
                  {modalData.tipo === 'admin' && `Administrador: ${itemActivo.nombre}`}
                </h2>
                {modalData.tipo === 'fundacion' && (
                  <span className={`admin-badge ${distintivo(BADGE_FUNDACION, itemActivo.estado).cls}`}>
                    {distintivo(BADGE_FUNDACION, itemActivo.estado).txt}
                  </span>
                )}
                {modalData.tipo === 'admin' && (
                  <span className="admin-badge admin-badge--info">{itemActivo.nivel}</span>
                )}
              </div>
              <button className="admin-modal__close-btn" onClick={() => setModalData(null)} title="Cerrar modal">
                <FiX />
              </button>
            </div>

            <div className="admin-modal__body">
              {modalData.tipo === 'civil' && (
                <>
                  <div className="admin-modal__grid">
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Correo electrónico</span>
                      <span className="admin-detail-value">
                        <FiMail className="mr-1.5 align-middle" />
                        {itemActivo.correo}
                      </span>
                    </div>
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Teléfono de contacto</span>
                      <span className="admin-detail-value">
                        <FiPhone className="mr-1.5 align-middle" />
                        {itemActivo.telefono || '—'}
                      </span>
                    </div>
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Dirección</span>
                      <span className="admin-detail-value">
                        <FiMapPin className="mr-1.5 align-middle" />
                        {itemActivo.direccion || '—'}
                      </span>
                    </div>
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Fecha de registro</span>
                      <span className="admin-detail-value">
                        <FiCalendar className="mr-1.5 align-middle" />
                        {new Date(itemActivo.fechaRegistro).toLocaleDateString('es-CO')}
                      </span>
                    </div>
                  </div>

                  <div className="admin-modal__section">
                    <span className="admin-modal__section-title">
                      <FiActivity className="mr-1.5 align-middle" />
                      Actividad en la plataforma
                    </span>
                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                      <div className="admin-detail-item" style={{ flex: '1 1 180px' }}>
                        <span className="admin-detail-label">Denuncias radicadas</span>
                        <span className="admin-detail-value" style={{ fontSize: '1.2rem', color: '#C4B5FD' }}>
                          {itemActivo.denuncias} casos reportados
                        </span>
                      </div>
                      <div className="admin-detail-item" style={{ flex: '1 1 180px' }}>
                        <span className="admin-detail-label">Vivienda / Ocupación</span>
                        <span className="admin-detail-value">
                          {itemActivo.vivienda || '—'} / {itemActivo.ocupacion || '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {modalData.tipo === 'fundacion' && (
                <>
                  <div className="admin-modal__grid">
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Cédula del Representante</span>
                      <span className="admin-detail-value">{itemActivo.cedulaRepresentante}</span>
                    </div>
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Representante legal</span>
                      <span className="admin-detail-value">{itemActivo.representante}</span>
                    </div>
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Teléfono institucional</span>
                      <span className="admin-detail-value">
                        <FiPhone className="mr-1.5 align-middle" />
                        {itemActivo.telefono}
                      </span>
                    </div>
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Correo institucional</span>
                      <span className="admin-detail-value">
                        <FiMail className="mr-1.5 align-middle" />
                        {itemActivo.correo}
                      </span>
                    </div>
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Sede / Ubicación</span>
                      <span className="admin-detail-value">
                        <FiMapPin className="mr-1.5 align-middle" />
                        {itemActivo.direccion}
                      </span>
                    </div>
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Capacidad de albergue</span>
                      <span className="admin-detail-value">{itemActivo.capacidad} animales</span>
                    </div>
                  </div>

                  {itemActivo.motivoRechazo && (
                    <div className="admin-modal__section">
                      <span className="admin-modal__section-title">Motivo del rechazo</span>
                      <p className="admin-modal__text">{itemActivo.motivoRechazo}</p>
                    </div>
                  )}
                  {itemActivo.evidencias.length > 0 && (
                    <div className="admin-modal__section">
                      <span className="admin-modal__section-title">
                        <FiFileText className="mr-1.5 align-middle" />
                        Archivos adjuntos en el registro
                      </span>
                      <ul style={{ margin: '0.4rem 0 0', paddingLeft: '1.2rem', color: '#CBD5E1', lineHeight: '1.7' }}>
                        {itemActivo.evidencias.map((ev, i) => (
                          <li key={ev.id}>
                            <a href={ev.url} target="_blank" rel="noreferrer" style={{ color: '#C4B5FD' }}>Archivo {i + 1} ({ev.tipoArchivo})</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}

              {modalData.tipo === 'admin' && (
                <div className="admin-modal__grid">
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Correo institucional</span>
                    <span className="admin-detail-value">{itemActivo.correo}</span>
                  </div>
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">
                      <FiShield className="mr-1.5 align-middle" />
                      Nivel de acceso
                    </span>
                    <span className="admin-detail-value">{itemActivo.nivel}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="admin-modal__footer">
              <div className="admin-modal__actions-left">
                {modalData.tipo === 'fundacion' && itemActivo.estado === 'pendiente' && (
                  <Link to="/admin/adopciones" className="admin-modal__btn admin-modal__btn--success">
                    <FiCheck /> Revisar en Registro de Fundaciones
                  </Link>
                )}
              </div>
              <button className="admin-modal__btn admin-modal__btn--secondary" onClick={() => setModalData(null)}>
                Cerrar ventana
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  )
}

export default AdminUsuarios
