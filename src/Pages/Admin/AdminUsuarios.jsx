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
import { BADGE_FUNDACION, distintivo } from '../../Utils/estados.js'
import { ACCIONES, ACCION_BTN, BADGE, BADGE_COLOR, BTN_EXITO, BTN_SECUNDARIO, DETALLE_ITEM, DETALLE_LABEL, DETALLE_VALOR, MODAL_ACCIONES_IZQ, MODAL_CABECERA, MODAL_CABECERA_IZQ, MODAL_CERRAR, MODAL_CUERPO, MODAL_FONDO, MODAL_GRID, MODAL_LG, MODAL_PIE, MODAL_SECCION, MODAL_SECCION_TITULO, MODAL_TEXTO, MODAL_TITULO, PAGE_HEADER, TABLA, TABLA_WRAP, TABS, TAB_ACTIVA, TAB_REPOSO } from '../../Utils/adminEstilos'
import { MAIN, TITULO } from '../../Utils/panelEstilos'

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

        <main className={MAIN}>
          <div className={PAGE_HEADER}>
            <h1 className={TITULO}>Usuarios y Fundaciones</h1>
          </div>

          <div className={TABS}>
            {[['civiles', 'Civiles'], ['fundaciones', 'Fundaciones'], ['administradores', 'Administradores']].map(([clave, texto]) => (
              <button
                key={clave}
                className={tabActiva === clave ? TAB_ACTIVA : TAB_REPOSO}
                onClick={() => setTabActiva(clave)}
              >
                {texto}
              </button>
            ))}
          </div>

          {error && <p role="alert" className="mb-3 text-peligro">{error}</p>}

          {tabActiva === 'civiles' && (
            <div className={TABLA_WRAP}>
              <table className={TABLA}>
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
                        <div className={ACCIONES}>
                          <button className={ACCION_BTN} title="Ver detalle" onClick={() => setModalData({ tipo: 'civil', id: c.id })}>
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
            <div className={TABLA_WRAP}>
              <table className={TABLA}>
                <thead>
                  <tr><th>Nombre</th><th>Cédula Representante</th><th>Teléfono</th><th>Estado</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                  {fundaciones.map(f => (
                    <tr key={f.id}>
                      <td>{f.nombre}</td>
                      <td>{f.cedulaRepresentante}</td>
                      <td>{f.telefono}</td>
                      <td><span className={`${BADGE} ${distintivo(BADGE_FUNDACION, f.estado).cls}`}>{distintivo(BADGE_FUNDACION, f.estado).txt}</span></td>
                      <td>
                        <div className={ACCIONES}>
                          <button className={ACCION_BTN} title="Ver detalle" onClick={() => setModalData({ tipo: 'fundacion', id: f.id })}>
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
            <div className={TABLA_WRAP}>
              <table className={TABLA}>
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
                        <div className={ACCIONES}>
                          <button className={ACCION_BTN} title="Ver detalle" onClick={() => setModalData({ tipo: 'admin', id: a.id })}>
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
        <div className={MODAL_FONDO} onClick={() => setModalData(null)}>
          <div className={MODAL_LG} onClick={(e) => e.stopPropagation()}>
            <div className={MODAL_CABECERA}>
              <div className={MODAL_CABECERA_IZQ}>
                <h2 className={MODAL_TITULO}>
                  {modalData.tipo === 'civil' && `Usuario: ${itemActivo.nombre}`}
                  {modalData.tipo === 'fundacion' && `Fundación: ${itemActivo.nombre}`}
                  {modalData.tipo === 'admin' && `Administrador: ${itemActivo.nombre}`}
                </h2>
                {modalData.tipo === 'fundacion' && (
                  <span className={`${BADGE} ${distintivo(BADGE_FUNDACION, itemActivo.estado).cls}`}>
                    {distintivo(BADGE_FUNDACION, itemActivo.estado).txt}
                  </span>
                )}
                {modalData.tipo === 'admin' && (
                  <span className={`${BADGE} ${BADGE_COLOR.info}`}>{itemActivo.nivel}</span>
                )}
              </div>
              <button className={MODAL_CERRAR} onClick={() => setModalData(null)} title="Cerrar modal">
                <FiX />
              </button>
            </div>

            <div className={MODAL_CUERPO}>
              {modalData.tipo === 'civil' && (
                <>
                  <div className={MODAL_GRID}>
                    <div className={DETALLE_ITEM}>
                      <span className={DETALLE_LABEL}>Correo electrónico</span>
                      <span className={DETALLE_VALOR}>
                        <FiMail className="mr-1.5 align-middle" />
                        {itemActivo.correo}
                      </span>
                    </div>
                    <div className={DETALLE_ITEM}>
                      <span className={DETALLE_LABEL}>Teléfono de contacto</span>
                      <span className={DETALLE_VALOR}>
                        <FiPhone className="mr-1.5 align-middle" />
                        {itemActivo.telefono || '—'}
                      </span>
                    </div>
                    <div className={DETALLE_ITEM}>
                      <span className={DETALLE_LABEL}>Dirección</span>
                      <span className={DETALLE_VALOR}>
                        <FiMapPin className="mr-1.5 align-middle" />
                        {itemActivo.direccion || '—'}
                      </span>
                    </div>
                    <div className={DETALLE_ITEM}>
                      <span className={DETALLE_LABEL}>Fecha de registro</span>
                      <span className={DETALLE_VALOR}>
                        <FiCalendar className="mr-1.5 align-middle" />
                        {new Date(itemActivo.fechaRegistro).toLocaleDateString('es-CO')}
                      </span>
                    </div>
                  </div>

                  <div className={MODAL_SECCION}>
                    <span className={MODAL_SECCION_TITULO}>
                      <FiActivity className="mr-1.5 align-middle" />
                      Actividad en la plataforma
                    </span>
                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                      <div className={DETALLE_ITEM} style={{ flex: '1 1 180px' }}>
                        <span className={DETALLE_LABEL}>Denuncias radicadas</span>
                        <span className={DETALLE_VALOR} style={{ fontSize: '1.2rem', color: '#C4B5FD' }}>
                          {itemActivo.denuncias} casos reportados
                        </span>
                      </div>
                      <div className={DETALLE_ITEM} style={{ flex: '1 1 180px' }}>
                        <span className={DETALLE_LABEL}>Vivienda / Ocupación</span>
                        <span className={DETALLE_VALOR}>
                          {itemActivo.vivienda || '—'} / {itemActivo.ocupacion || '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {modalData.tipo === 'fundacion' && (
                <>
                  <div className={MODAL_GRID}>
                    <div className={DETALLE_ITEM}>
                      <span className={DETALLE_LABEL}>Cédula del Representante</span>
                      <span className={DETALLE_VALOR}>{itemActivo.cedulaRepresentante}</span>
                    </div>
                    <div className={DETALLE_ITEM}>
                      <span className={DETALLE_LABEL}>Representante legal</span>
                      <span className={DETALLE_VALOR}>{itemActivo.representante}</span>
                    </div>
                    <div className={DETALLE_ITEM}>
                      <span className={DETALLE_LABEL}>Teléfono institucional</span>
                      <span className={DETALLE_VALOR}>
                        <FiPhone className="mr-1.5 align-middle" />
                        {itemActivo.telefono}
                      </span>
                    </div>
                    <div className={DETALLE_ITEM}>
                      <span className={DETALLE_LABEL}>Correo institucional</span>
                      <span className={DETALLE_VALOR}>
                        <FiMail className="mr-1.5 align-middle" />
                        {itemActivo.correo}
                      </span>
                    </div>
                    <div className={DETALLE_ITEM}>
                      <span className={DETALLE_LABEL}>Sede / Ubicación</span>
                      <span className={DETALLE_VALOR}>
                        <FiMapPin className="mr-1.5 align-middle" />
                        {itemActivo.direccion}
                      </span>
                    </div>
                    <div className={DETALLE_ITEM}>
                      <span className={DETALLE_LABEL}>Capacidad de albergue</span>
                      <span className={DETALLE_VALOR}>{itemActivo.capacidad} animales</span>
                    </div>
                  </div>

                  {itemActivo.motivoRechazo && (
                    <div className={MODAL_SECCION}>
                      <span className={MODAL_SECCION_TITULO}>Motivo del rechazo</span>
                      <p className={MODAL_TEXTO}>{itemActivo.motivoRechazo}</p>
                    </div>
                  )}
                  {itemActivo.evidencias.length > 0 && (
                    <div className={MODAL_SECCION}>
                      <span className={MODAL_SECCION_TITULO}>
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
                <div className={MODAL_GRID}>
                  <div className={DETALLE_ITEM}>
                    <span className={DETALLE_LABEL}>Correo institucional</span>
                    <span className={DETALLE_VALOR}>{itemActivo.correo}</span>
                  </div>
                  <div className={DETALLE_ITEM}>
                    <span className={DETALLE_LABEL}>
                      <FiShield className="mr-1.5 align-middle" />
                      Nivel de acceso
                    </span>
                    <span className={DETALLE_VALOR}>{itemActivo.nivel}</span>
                  </div>
                </div>
              )}
            </div>

            <div className={MODAL_PIE}>
              <div className={MODAL_ACCIONES_IZQ}>
                {modalData.tipo === 'fundacion' && itemActivo.estado === 'pendiente' && (
                  <Link to="/admin/adopciones" className={BTN_EXITO}>
                    <FiCheck /> Revisar en Registro de Fundaciones
                  </Link>
                )}
              </div>
              <button className={BTN_SECUNDARIO} onClick={() => setModalData(null)}>
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
