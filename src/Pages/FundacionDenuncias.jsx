import { useState, useRef } from 'react'
import { FiPlus, FiX, FiUploadCloud, FiTrash2, FiCheck, FiAlertTriangle } from 'react-icons/fi'
import { useAuth } from '../Context/AuthContext.jsx'
import { useFundacion } from '../Context/FundacionContext.jsx'
import { useDenuncias } from '../Context/DenunciasContext.jsx'
import { ESTADOS_ACTIVOS, ETIQUETA_TIPO } from '../Data/seedDenuncias.js'
import TarjetaDenuncia from '../Componentes/TarjetaDenuncia.jsx'

const FILTROS = [
  { id: 'disponibles', texto: 'Disponibles' },
  { id: 'mis_casos', texto: 'Mis casos' },
  { id: 'activas', texto: 'Todas las activas' },
]

const FundacionDenuncias = () => {
  const { usuario } = useAuth()
  const { fundacionId } = useFundacion()
  const { denuncias, agregarDenuncia, asignarFundacion, cambiarEstado } = useDenuncias()
  const [filtro, setFiltro] = useState('disponibles')
  const [aviso, setAviso] = useState(null)

  // Modal para reportar denuncia desde el panel
  const [modalReportar, setModalReportar] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [modoUrl, setModoUrl] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const fileInputRef = useRef(null)

  const [formReporte, setFormReporte] = useState({
    tipo: 'maltrato',
    urgencia: 'Media',
    ubicacion: '',
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
  const hacermeCargo = (id) => {
    const resultado = asignarFundacion(id, {
      id: fundacionId,
      nombre: usuario?.nombre || 'Fundación',
      telefono: usuario?.telefono || '',
    })
    if (!resultado.ok) {
      setAviso({ tipo: 'error', texto: resultado.mensaje })
      return
    }
    setAviso({ tipo: 'exito', texto: 'Te asignaste el caso. Ahora aparece como "En proceso de rescate".' })
  }

  const marcarResuelto = (id) => {
    cambiarEstado(id, 'resuelta')
    setAviso({ tipo: 'exito', texto: 'Caso marcado como resuelto.' })
  }

  // Manejo de archivos desde el PC
  const agregarArchivos = (files) => {
    const nuevos = Array.from(files).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
      size: file.size,
    }))
    setArchivos((prev) => [...prev, ...nuevos])
  }

  const agregarPorUrl = () => {
    if (!urlInput.trim()) return
    setArchivos((prev) => [
      ...prev,
      { name: 'Enlace web', url: urlInput.trim(), type: 'image/jpeg', size: 0 },
    ])
    setUrlInput('')
  }

  const eliminarArchivo = (index) => {
    setArchivos((prev) => prev.filter((_, i) => i !== index))
  }

  // Guardar denuncia desde el modal del panel
  const handleSubmitReporte = (e) => {
    e.preventDefault()
    if (!formReporte.ubicacion.trim()) return

    agregarDenuncia(
      {
        tipo: formReporte.tipo,
        urgencia: formReporte.urgencia,
        ubicacion: formReporte.ubicacion,
        descripcion: formReporte.descripcion,
        latitud: 2.4419,
        longitud: -76.6069,
        anonima: formReporte.anonima,
        evidencias: archivos.map((a, i) => ({
          id: i + 1,
          url: a.url,
          tipoArchivo: a.type || 'image/jpeg',
          tamanoBytes: a.size || 0,
        })),
      },
      usuario
    )

    setModalReportar(false)
    setFormReporte({
      tipo: 'maltrato',
      urgencia: 'Media',
      ubicacion: '',
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
        <h1 className="admin-title" style={{ margin: 0 }}>Casos de Denuncia</h1>
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

      {aviso && <div className={`dnfeed-aviso dnfeed-aviso--${aviso.tipo}`}>{aviso.texto}</div>}

      {filtradas.length === 0 ? (
        <p className="dnfeed-vacio">No hay casos en esta vista.</p>
      ) : (
        <div className="dnfeed-lista dnfeed-lista--grid">
          {filtradas.map((d) => (
            <TarjetaDenuncia key={d.id} denuncia={d}>
              {estaDisponible(d) && (
                <button type="button" className="dnfeed-btn dnfeed-btn--primario" onClick={() => hacermeCargo(d.id)}>
                  Hacerme cargo de este caso
                </button>
              )}
              {esMia(d) && d.estado === 'en_rescate' && (
                <button type="button" className="dnfeed-btn dnfeed-btn--secundario" onClick={() => marcarResuelto(d.id)}>
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
          <div className="fnd-modal" style={{ maxWidth: 600 }} onClick={(e) => e.stopPropagation()}>
            <button className="fnd-modal__cerrar" onClick={() => setModalReportar(false)} title="Cerrar ventana">
              <FiX />
            </button>

            <h2 className="fnd-modal__titulo" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <FiAlertTriangle style={{ color: '#E11D48' }} /> Reportar Caso de Denuncia
            </h2>
            <p style={{ color: 'rgba(241, 245, 249, 0.6)', fontSize: 13, marginBottom: 18 }}>
              Registra un caso de maltrato o abandono detectado. Quedará publicado en el sistema con el sello de tu fundación.
            </p>

            <form onSubmit={handleSubmitReporte}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {/* Tipo de caso */}
                <div className="fnd-modal__campo">
                  <label className="fnd-modal__label">Tipo de denuncia *</label>
                  <select
                    className="fnd-modal__input"
                    value={formReporte.tipo}
                    onChange={(e) => setFormReporte({ ...formReporte, tipo: e.target.value })}
                  >
                    <option value="maltrato" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>Maltrato físico</option>
                    <option value="abandono" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>Abandono</option>
                    <option value="negligencia" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>Negligencia</option>
                    <option value="trafico" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>Tráfico de animales</option>
                    <option value="otro" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>Otro</option>
                  </select>
                </div>

                {/* Urgencia */}
                <div className="fnd-modal__campo">
                  <label className="fnd-modal__label">Nivel de urgencia *</label>
                  <select
                    className="fnd-modal__input"
                    value={formReporte.urgencia}
                    onChange={(e) => setFormReporte({ ...formReporte, urgencia: e.target.value })}
                  >
                    <option value="Alta" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>Alta (Peligro inminente)</option>
                    <option value="Media" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>Media</option>
                    <option value="Baja" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>Baja</option>
                  </select>
                </div>
              </div>

              {/* Ubicación */}
              <div className="fnd-modal__campo">
                <label className="fnd-modal__label">Dirección o ubicación del caso *</label>
                <input
                  type="text"
                  className="fnd-modal__input"
                  required
                  placeholder="Ej: Carrera 6 #4-20, Barrio Centro, Popayán"
                  value={formReporte.ubicacion}
                  onChange={(e) => setFormReporte({ ...formReporte, ubicacion: e.target.value })}
                />
              </div>

              {/* Descripción */}
              <div className="fnd-modal__campo">
                <label className="fnd-modal__label">Descripción de los hechos *</label>
                <textarea
                  className="fnd-modal__input"
                  rows="3"
                  required
                  placeholder="Describe la condición del animal, situación de peligro y referencias para ubicar el lugar..."
                  value={formReporte.descripcion}
                  onChange={(e) => setFormReporte({ ...formReporte, descripcion: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Subir fotos / evidencias desde el PC */}
              <div className="fnd-modal__campo">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="fnd-modal__label">Fotos o videos de evidencia</label>
                  <button
                    type="button"
                    onClick={() => setModoUrl(!modoUrl)}
                    style={{ background: 'none', border: 'none', color: '#C4B5FD', fontSize: 11, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {modoUrl ? 'Subir desde mi PC' : 'Agregar por URL'}
                  </button>
                </div>

                {modoUrl ? (
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <input
                      type="url"
                      placeholder="https://ejemplo.com/evidencia.jpg"
                      className="fnd-modal__input"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      className="fnd-btn-primario"
                      onClick={agregarPorUrl}
                      style={{ padding: '0 14px' }}
                    >
                      Añadir
                    </button>
                  </div>
                ) : (
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
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        if (e.target.files?.length) {
                          agregarArchivos(e.target.files)
                        }
                      }}
                    />
                  </div>
                )}

                {/* Vista previa de miniaturas con botón eliminar */}
                {archivos.length > 0 && (
                  <div className="fnd-preview-grid">
                    {archivos.map((archivo, i) => (
                      <div key={i} className="fnd-preview-thumb">
                        {archivo.type?.startsWith('video/') ? (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1e293b', color: '#fff', fontSize: 20 }}>
                            🎥
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
                          ✕
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
                <button type="submit" className="fnd-modal__btn fnd-modal__btn--primario">
                  <FiCheck /> Publicar denuncia
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
