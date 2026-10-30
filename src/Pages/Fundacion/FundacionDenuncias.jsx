import { useState, useRef } from 'react'
import { FiAlertTriangle, FiCheck, FiPlus, FiUploadCloud, FiVideo, FiX } from 'react-icons/fi'
import { useFundacion } from '../../Context/FundacionContext.jsx'
import { useDenuncias } from '../../Context/DenunciasContext.jsx'
import { ESTADOS_ACTIVOS } from '../../Utils/estados.js'
import TarjetaDenuncia from '../../Componentes/Denuncias/TarjetaDenuncia.jsx'
import { SelectorUbicacion } from '../../Componentes/Denuncias/DenunciaFormulario.jsx'
import * as E from '../../Utils/denunciaEstilos.js'

const FILTROS = [
  { id: 'disponibles', texto: 'Disponibles' },
  { id: 'mis_casos', texto: 'Mis casos' },
  { id: 'activas', texto: 'Todas las activas' },
]

const FundacionDenuncias = () => {
  const { fundacionId } = useFundacion()
  const { denuncias, agregarDenuncia, asignarFundacion, cambiarEstado } = useDenuncias()
  const [filtro, setFiltro] = useState('disponibles')
  const [aviso, setAviso] = useState(null)
  const [enviando, setEnviando] = useState(false)

  // Modal para reportar denuncia desde el panel
  const [modalReportar, setModalReportar] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const [formReporte, setFormReporte] = useState({
    tipo: 'maltrato',
    urgencia: 'Media',
    ubicacion: '',
    latitud: null,
    longitud: null,
    descripcion: '',
    anonima: false,
  })

  const [archivos, setArchivos] = useState([])

  const esMia = (d) => d.fundacionAsignada?.id === fundacionId
  const estaDisponible = (d) => !d.fundacionAsignada && ['pendiente', 'verificada'].includes(d.estado)

  const filtradas = denuncias
    .filter((d) => {
      if (filtro === 'disponibles') return estaDisponible(d)
      if (filtro === 'mis_casos') return esMia(d)
      return ESTADOS_ACTIVOS.includes(d.estado)
    })
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

  // "Hacerme cargo": gana la primera fundación; si otra se adelantó se muestra el aviso del 409
  const hacermeCargo = async (id) => {
    const resultado = await asignarFundacion(id, { id: fundacionId })
    if (!resultado.ok) {
      setAviso({ tipo: 'error', texto: resultado.mensaje })
      return
    }
    setAviso({ tipo: 'exito', texto: 'Te asignaste el caso. Ahora aparece como "En proceso de rescate".' })
  }

  const marcarResuelto = async (id) => {
    const resultado = await cambiarEstado(id, 'resuelta')
    setAviso(resultado.ok
      ? { tipo: 'exito', texto: 'Caso marcado como resuelto.' }
      : { tipo: 'error', texto: resultado.mensaje })
  }

  // Manejo de archivos desde el PC
  const agregarArchivos = (files) => {
    const nuevos = Array.from(files).map((file) => ({
      file,
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
      size: file.size,
    }))
    setArchivos((prev) => [...prev, ...nuevos])
  }

  const eliminarArchivo = (index) => {
    setArchivos((prev) => prev.filter((_, i) => i !== index))
  }

  // Guardar denuncia desde el modal del panel
  const handleSubmitReporte = async (e) => {
    e.preventDefault()
    if (enviando) return
    if (!formReporte.ubicacion.trim()) {
      setAviso({ tipo: 'error', texto: 'Busca la dirección o haz clic en el mapa para marcar la ubicación.' })
      return
    }

    setEnviando(true)
    try {
      // La API toma la fundación del token: la denuncia queda a nombre de tu fundación
      await agregarDenuncia({
        tipo: formReporte.tipo,
        urgencia: formReporte.urgencia,
        ubicacion: formReporte.ubicacion,
        descripcion: formReporte.descripcion,
        latitud: formReporte.latitud,
        longitud: formReporte.longitud,
        anonima: formReporte.anonima,
        archivos: archivos.map((a) => a.file),
      })
    } catch (error) {
      setAviso({ tipo: 'error', texto: error.message })
      setEnviando(false)
      return
    }

    setEnviando(false)
    setModalReportar(false)
    setFormReporte({
      tipo: 'maltrato',
      urgencia: 'Media',
      ubicacion: '',
      latitud: null,
      longitud: null,
      descripcion: '',
      anonima: false,
    })
    setArchivos([])
    setAviso({
      tipo: 'exito',
      texto: '¡Denuncia reportada exitosamente! Se ha publicado en el sistema a nombre de tu fundación.',
    })
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <h1 className="admin-title sin-margen" >Casos de Denuncia</h1>
        {/* Despliega la ventana modal para realizar la denuncia sin salir del panel */}
        <button
          type="button"
          className="fnd-btn-primario"
          onClick={() => { setModalReportar(true); setAviso(null) }}
        >
          <FiPlus /> Reportar una denuncia
        </button>
      </div>

      <div className="fnd-filtros">
        {FILTROS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`fnd-chip${filtro === f.id ? ' fnd-chip--activo' : ''}`}
            onClick={() => { setFiltro(f.id); setAviso(null) }}
          >
            {f.texto}
          </button>
        ))}
      </div>

      {aviso && <div className={`${E.AVISO} ${E.AVISO_COLOR[aviso.tipo] ?? ''}`}>{aviso.texto}</div>}

      {filtradas.length === 0 ? (
        <p className={E.VACIO}>No hay casos en esta vista.</p>
      ) : (
        <div className={E.LISTA_GRID}>
          {filtradas.map((d) => (
            <TarjetaDenuncia key={d.id} denuncia={d}>
              {estaDisponible(d) && (
                <button type="button" className={E.FEED_BTN_PRIMARIO} onClick={() => hacermeCargo(d.id)}>
                  Hacerme cargo de este caso
                </button>
              )}
              {esMia(d) && d.estado === 'en_rescate' && (
                <button type="button" className={E.FEED_BTN_SECUNDARIO} onClick={() => marcarResuelto(d.id)}>
                  Marcar como resuelto
                </button>
              )}
            </TarjetaDenuncia>
          ))}
        </div>
      )}

      {/* ── VENTANA MODAL PARA REALIZAR DENUNCIA DESDE EL PANEL ── */}
      {modalReportar && (
        <div className="fnd-modal__fondo" onClick={() => setModalReportar(false)}>
          <div className="fnd-modal modal-medio" onClick={(e) => e.stopPropagation()}>
            <button className="fnd-modal__cerrar" onClick={() => setModalReportar(false)} title="Cerrar ventana">
              <FiX />
            </button>

            <h2 className="fnd-modal__titulo" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <FiAlertTriangle className="texto-error" /> Reportar Caso de Denuncia
            </h2>
            <p style={{ color: 'rgba(241, 245, 249, 0.6)', fontSize: 13, marginBottom: 18 }}>
              Registra un caso de maltrato o abandono detectado. Quedará publicado en el sistema con el sello de tu fundación.
            </p>

            <form onSubmit={handleSubmitReporte}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {/* Tipo de caso */}
                <div className="fnd-modal__campo">
                  <label className="fnd-modal__label" htmlFor="fden-tipo-de-denuncia">Tipo de denuncia *</label>
                  <select id="fden-tipo-de-denuncia"
                    className="fnd-modal__input"
                    value={formReporte.tipo}
                    onChange={(e) => setFormReporte({ ...formReporte, tipo: e.target.value })}
                  >
                    <option value="maltrato">Maltrato físico</option>
                    <option value="abandono">Abandono</option>
                    <option value="negligencia">Negligencia</option>
                    <option value="trafico">Tráfico de animales</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                {/* Urgencia */}
                <div className="fnd-modal__campo">
                  <label className="fnd-modal__label" htmlFor="fden-nivel-de-urgencia">Nivel de urgencia *</label>
                  <select id="fden-nivel-de-urgencia"
                    className="fnd-modal__input"
                    value={formReporte.urgencia}
                    onChange={(e) => setFormReporte({ ...formReporte, urgencia: e.target.value })}
                  >
                    <option value="Alta">Alta (Peligro inminente)</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>
              </div>

              {/* Ubicación */}
              <div className="fnd-modal__campo">
                <span className="fnd-modal__label">Dirección o ubicación del caso *</span>
                <SelectorUbicacion
                  oscuro
                  onCambio={(u) => setFormReporte((prev) => ({ ...prev, ...u }))}
                />
              </div>

              {/* Descripción */}
              <div className="fnd-modal__campo">
                <label className="fnd-modal__label" htmlFor="fden-descripcion-de-los-hecho">Descripción de los hechos *</label>
                <textarea id="fden-descripcion-de-los-hecho"
 className="fnd-modal__input campo-redimensionable"
 rows="3"
 required
 placeholder="Describe la condición del animal, situación de peligro y referencias para ubicar el lugar..." aria-label="Describe la condición del animal, situación de peligro y referencias para ubicar el lugar..."
 value={formReporte.descripcion}
 onChange={(e) => setFormReporte({ ...formReporte, descripcion: e.target.value })}
 
 />
              </div>

              {/* Subir fotos / evidencias desde el PC */}
              <div className="fnd-modal__campo">
                <span className="fnd-modal__label">Fotos o videos de evidencia</span>

                  <div
                    className={`fnd-dropzone ${dragOver ? 'fnd-dropzone--drag' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault()
                      setDragOver(false)
                      if (e.dataTransfer.files?.length) {
                        agregarArchivos(e.dataTransfer.files)
                      }
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FiUploadCloud className="fnd-dropzone__icon" />
                    <p className="fnd-dropzone__texto">
                      <span className="fnd-dropzone__link">Sube fotos o videos</span> desde tu PC
                    </p>
                    <span className="fnd-dropzone__hint">Arrastra archivos aquí o haz clic para seleccionarlos</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      className="oculto"
                      onChange={(e) => {
                        if (e.target.files?.length) {
                          agregarArchivos(e.target.files)
                        }
                      }}
                    />
                  </div>

                {/* Vista previa de miniaturas con botón eliminar */}
                {archivos.length > 0 && (
                  <div className="fnd-preview-grid">
                    {archivos.map((archivo, i) => (
                      <div key={i} className="fnd-preview-thumb">
                        {archivo.type?.startsWith('video/') ? (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1e293b', color: '#fff', fontSize: 20 }}>
                            <FiVideo />
                          </div>
                        ) : (
                          <img src={archivo.url} alt={archivo.name} />
                        )}
                        <button
                          type="button"
                          className="fnd-preview-thumb__remover"
                          onClick={() => eliminarArchivo(i)}
                          title="Quitar archivo"
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Opción anónima */}
              <div style={{ marginTop: 8, marginBottom: 18 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'rgba(241, 245, 249, 0.8)' }}>
                  <input
                    type="checkbox"
                    checked={formReporte.anonima}
                    onChange={(e) => setFormReporte({ ...formReporte, anonima: e.target.checked })}
                  />
                  <span>Reportar de forma anónima (oculta el nombre de la fundación en el feed público)</span>
                </label>
              </div>

              {/* Acciones */}
              <div className="fnd-modal__acciones">
                <button
                  type="button"
                  className="fnd-modal__btn fnd-modal__btn--secundario"
                  onClick={() => setModalReportar(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="fnd-modal__btn fnd-modal__btn--primario" disabled={enviando}>
                  <FiCheck /> {enviando ? 'Publicando...' : 'Publicar denuncia'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default FundacionDenuncias
