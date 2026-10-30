import { useState } from 'react'
import { useDenuncias } from '../../Context/DenunciasContext.jsx'
import { BADGE_DENUNCIA, ETIQUETA_TIPO, distintivo } from '../../Utils/estados.js'
import {
  FiCalendar,
  FiCheck,
  FiExternalLink,
  FiEye,
  FiMapPin,
  FiShield,
  FiUser,
  FiX
} from 'react-icons/fi'
import AdminTopbar from '../../Componentes/Admin/AdminTopbar.jsx'
import { ACCIONES, ACCION_BTN, BADGE, BADGE_COLOR, BTN_EXITO, BTN_PELIGRO, BTN_PRIMARIO, BTN_SECUNDARIO, DETALLE_ITEM, DETALLE_LABEL, DETALLE_VALOR, MODAL_ACCIONES_IZQ, MODAL_CABECERA, MODAL_CABECERA_IZQ, MODAL_CERRAR, MODAL_CUERPO, MODAL_FONDO, MODAL_GALERIA, MODAL_GALERIA_IMG, MODAL_GRID, MODAL_LG, MODAL_PIE, MODAL_SECCION, MODAL_SECCION_TITULO, MODAL_TEXTO, MODAL_TITULO, PAGE_HEADER, TABLA, TABLA_WRAP } from '../../Utils/adminEstilos'
import { MAIN, TITULO } from '../../Utils/panelEstilos'

const badgePorUrgencia = {
  Alta: BADGE_COLOR.critico,
  Media: BADGE_COLOR.pendiente,
  Baja: BADGE_COLOR.neutro,
  alta: BADGE_COLOR.critico,
  media: BADGE_COLOR.pendiente,
  baja: BADGE_COLOR.neutro,
}

const fundacionesDisponibles = [
  { id: 1, nombre: 'Huellitas Felices', telefono: '+57 310 000 0001' },
  { id: 2, nombre: 'Patitas al Rescate', telefono: '+57 311 000 0002' },
]

const AdminDenuncias = () => {
  const { denuncias, cambiarEstado, asignarFundacion } = useDenuncias()
  const [denunciaSeleccionadaId, setDenunciaSeleccionadaId] = useState(null)

  // Cierra la sesión y vuelve al login

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
    <>


        <AdminTopbar placeholder="Buscar denuncias..." />

        <main className={MAIN}>
          <div className={PAGE_HEADER}>
            <h1 className={TITULO}>Denuncias</h1>
          </div>

          <div className={TABLA_WRAP}>
            <table className={TABLA}>
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
                      <span className={`${BADGE} ${badgePorUrgencia[d.urgencia] || BADGE_COLOR.neutro}`}>{d.urgencia}</span>
                    </td>
                    <td>
                      <span className={`${BADGE} ${distintivo(BADGE_DENUNCIA, d.estado).cls}`}>
                        {distintivo(BADGE_DENUNCIA, d.estado).txt}
                      </span>
                      {d.fundacionAsignada && (
                        <div style={{ fontSize: 12, opacity: 0.7 }}>{d.fundacionAsignada.nombre}</div>
                      )}
                    </td>
                    <td>{new Date(d.fecha).toLocaleDateString('es-CO')}</td>
                    <td>{d.anonima ? 'Sí' : 'No'}</td>
                    <td>
                      <div className={ACCIONES}>
                        <button
                          className={ACCION_BTN}
                          title="Ver detalle"
                          onClick={() => setDenunciaSeleccionadaId(d.id)}
                        >
                          <FiEye />
                        </button>
                        {d.estado === 'pendiente' && (
                          <button
                            className={ACCION_BTN}
                            title="Verificar evidencia"
                            onClick={() => cambiarEstado(d.id, 'verificada')}
                          >
                            <FiCheck />
                          </button>
                        )}
                        {['pendiente', 'verificada'].includes(d.estado) && (
                          <button
                            className={ACCION_BTN}
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


      {/* ── VENTANA MODAL DE DETALLES DE DENUNCIA ── */}
      {denunciaSeleccionada && (
        <div className={MODAL_FONDO} onClick={() => setDenunciaSeleccionadaId(null)}>
          <div className={MODAL_LG} onClick={(e) => e.stopPropagation()}>
            <div className={MODAL_CABECERA}>
              <div className={MODAL_CABECERA_IZQ}>
                <h2 className={MODAL_TITULO}>
                  Denuncia #{denunciaSeleccionada.id}
                </h2>
                <span className={`${BADGE} ${badgePorUrgencia[denunciaSeleccionada.urgencia] || BADGE_COLOR.neutro}`}>
                  Urgencia {denunciaSeleccionada.urgencia}
                </span>
                <span className={`${BADGE} ${distintivo(BADGE_DENUNCIA, denunciaSeleccionada.estado).cls}`}>
                  {distintivo(BADGE_DENUNCIA, denunciaSeleccionada.estado).txt}
                </span>
              </div>
              <button
                className={MODAL_CERRAR}
                onClick={() => setDenunciaSeleccionadaId(null)}
                title="Cerrar modal"
              >
                <FiX />
              </button>
            </div>

            <div className={MODAL_CUERPO}>
              {/* Grid de información clave */}
              <div className={MODAL_GRID}>
                <div className={DETALLE_ITEM}>
                  <span className={DETALLE_LABEL}>Tipo de denuncia</span>
                  <span className={DETALLE_VALOR}>
                    {ETIQUETA_TIPO[denunciaSeleccionada.tipo] || denunciaSeleccionada.tipo}
                  </span>
                </div>

                <div className={DETALLE_ITEM}>
                  <span className={DETALLE_LABEL}>Fecha y hora de reporte</span>
                  <span className={DETALLE_VALOR}>
                    <FiCalendar className="mr-1.5 align-middle" />
                    {new Date(denunciaSeleccionada.fecha).toLocaleString('es-CO')}
                  </span>
                </div>

                <div className={DETALLE_ITEM}>
                  <span className={DETALLE_LABEL}>Denunciante</span>
                  <span className={DETALLE_VALOR}>
                    <FiUser className="mr-1.5 align-middle" />
                    {denunciaSeleccionada.anonima
                      ? 'Denuncia anónima (identidad protegida)'
                      : (denunciaSeleccionada.reportadoPor?.nombre || denunciaSeleccionada.autor || 'Usuario registrado')}
                  </span>
                </div>

                <div className={DETALLE_ITEM}>
                  <span className={DETALLE_LABEL}>Fundación asignada</span>
                  <span className={DETALLE_VALOR}>
                    <FiShield className="mr-1.5 align-middle" />
                    {denunciaSeleccionada.fundacionAsignada
                      ? `${denunciaSeleccionada.fundacionAsignada.nombre} (${denunciaSeleccionada.fundacionAsignada.telefono || 'Sin tel.'})`
                      : 'Sin fundación asignada'}
                  </span>
                </div>
              </div>

              {/* Ubicación */}
              <div className={MODAL_SECCION}>
                <span className={MODAL_SECCION_TITULO}>Ubicación de los hechos</span>
                <p className={MODAL_TEXTO} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiMapPin style={{ color: '#C4B5FD', flexShrink: 0 }} />
                  <span>{ubicacionTexto}</span>
                </p>
                <div>
                  <a
                    href={urlMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={BTN_SECUNDARIO}
                    style={{ fontSize: '0.82rem', marginTop: '4px' }}
                  >
                    <FiExternalLink /> Ver ubicación en Google Maps
                  </a>
                </div>
              </div>

              {/* Descripción */}
              <div className={MODAL_SECCION}>
                <span className={MODAL_SECCION_TITULO}>Descripción del incidente</span>
                <p className={MODAL_TEXTO}>
                  {denunciaSeleccionada.descripcion || 'Sin descripción detallada provista.'}
                </p>
              </div>

              {/* Evidencias fotográficas */}
              <div className={MODAL_SECCION}>
                <span className={MODAL_SECCION_TITULO}>Evidencias fotográficas ({listaEvidencias.length})</span>
                {listaEvidencias.length === 0 ? (
                  <p className={MODAL_TEXTO} style={{ fontStyle: 'italic', color: '#94A3B8' }}>
                    Este caso no cuenta con archivos fotográficos adjuntos.
                  </p>
                ) : (
                  <div className={MODAL_GALERIA}>
                    {listaEvidencias.map((ev, idx) => {
                      const urlFoto = typeof ev === 'string' ? ev : ev?.url
                      return (
                        <a key={idx} href={urlFoto} target="_blank" rel="noopener noreferrer" title="Ver imagen completa">
                          <img
                            src={urlFoto}
                            alt={`Evidencia ${idx + 1}`}
                            className={MODAL_GALERIA_IMG}
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
                <div className={MODAL_SECCION}>
                  <span className={MODAL_SECCION_TITULO}>Asignar a una fundación de rescate</span>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                    {fundacionesDisponibles.map(f => (
                      <button
                        key={f.id}
                        type="button"
                        className={BTN_SECUNDARIO}
                        onClick={() => asignarFundacion(denunciaSeleccionada.id, f)}
                      >
                        Asignar a {f.nombre}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={MODAL_PIE}>
              <div className={MODAL_ACCIONES_IZQ}>
                {denunciaSeleccionada.estado === 'pendiente' && (
                  <button
                    className={BTN_EXITO}
                    onClick={() => cambiarEstado(denunciaSeleccionada.id, 'verificada')}
                  >
                    <FiCheck /> Marcar como Verificada
                  </button>
                )}

                {denunciaSeleccionada.estado === 'verificada' && (
                  <button
                    className={BTN_PRIMARIO}
                    onClick={() => cambiarEstado(denunciaSeleccionada.id, 'en_rescate')}
                  >
                    Pasar a "En rescate"
                  </button>
                )}

                {['verificada', 'en_rescate'].includes(denunciaSeleccionada.estado) && (
                  <button
                    className={BTN_EXITO}
                    onClick={() => cambiarEstado(denunciaSeleccionada.id, 'resuelta')}
                  >
                    <FiCheck /> Marcar como Resuelta
                  </button>
                )}

                {denunciaSeleccionada.estado !== 'descartada' && denunciaSeleccionada.estado !== 'resuelta' && (
                  <button
                    className={BTN_PELIGRO}
                    onClick={() => cambiarEstado(denunciaSeleccionada.id, 'descartada')}
                  >
                    <FiX /> Descartar reporte
                  </button>
                )}
              </div>

              <button
                className={BTN_SECUNDARIO}
                onClick={() => setDenunciaSeleccionadaId(null)}
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

export default AdminDenuncias


