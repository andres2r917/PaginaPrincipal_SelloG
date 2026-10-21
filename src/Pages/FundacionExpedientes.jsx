import { useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { FiSearch, FiX, FiUploadCloud, FiCheck, FiHeart } from 'react-icons/fi'
import { useFundacion } from '../Context/FundacionContext.jsx'
import '../Style/AdminModal.css'

const FundacionExpedientes = () => {
  const { mascotas, agregarMascota, actualizarMascota } = useFundacion()
  const location = useLocation()
  const inputFotoRef = useRef(null)

  const [busqueda, setBusqueda] = useState('')
  const [filtroEspecie, setFiltroEspecie] = useState('todos')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [modalIngreso, setModalIngreso] = useState(() => Boolean(location.state?.abrirModal))
  const [modalGestionar, setModalGestionar] = useState(null)
  const [modalFicha, setModalFicha] = useState(null)
  const [dragFoto, setDragFoto] = useState(false)
  const [modoUrl, setModoUrl] = useState(false)

  const [formIngreso, setFormIngreso] = useState({
    nombre: '',
    especie: 'perro',
    raza: '',
    edadEstimada: '',
    tamano: 'mediano',
    sexo: 'Macho',
    estadoSalud: '',
    descripcion: '',
    fotoUrl: '',
    estadoAdopcion: 'en_cuarentena',
    vacunado: true,
    esterilizado: false,
  })

  const mascotasFiltradas = mascotas.filter((m) => {
    const coincideBusqueda = m.nombre.toLowerCase().includes(busqueda.toLowerCase())
    const coincideEspecie = filtroEspecie === 'todos' || m.especie === filtroEspecie
    const coincideEstado = filtroEstado === 'todos' || m.estadoAdopcion === filtroEstado
    return coincideBusqueda && coincideEspecie && coincideEstado
  })

  const guardarIngreso = (e) => {
    e.preventDefault()
    agregarMascota({
      ...formIngreso,
      fundacionId: 1,
    })
    setModalIngreso(false)
    setFormIngreso({
      nombre: '',
      especie: 'perro',
      raza: '',
      edadEstimada: '',
      tamano: 'mediano',
      sexo: 'Macho',
      estadoSalud: '',
      descripcion: '',
      fotoUrl: '',
      estadoAdopcion: 'en_cuarentena',
      vacunado: true,
      esterilizado: false,
    })
  }

  const [formGestionar, setFormGestionar] = useState({})

  const abrirGestionar = (m) => {
    setFormGestionar({
      estadoAdopcion: m.estadoAdopcion,
      estadoSalud: m.estadoSalud,
      vacunado: Boolean(m.vacunado),
      esterilizado: Boolean(m.esterilizado),
    })
    setModalGestionar(m)
  }

  const guardarGestionar = (e) => {
    e.preventDefault()
    actualizarMascota(modalGestionar.id, formGestionar)
    setModalGestionar(null)
  }

  const etiquetaEstado = {
    en_cuarentena: 'Cuarentena',
    disponible: 'Disponible',
    en_proceso: 'En proceso',
    adoptado: 'Adoptado',
  }

  const claseEstado = {
    en_cuarentena: 'admin-badge--pendiente',
    disponible: 'admin-badge--exito',
    en_proceso: 'admin-badge--neutro',
    adoptado: 'admin-badge--critico',
  }

  return (
    <div>
      <h1 className="admin-title">Expedientes Peluditos</h1>

      {/* Barra de filtros */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        <div className="admin-topbar__search" style={{ flex: 1, minWidth: 200 }}>
          <FiSearch />
          <input
            type="text"
            placeholder="Buscar mascota..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="fnd-filtros" style={{ margin: 0 }}>
          {['todos', 'perro', 'gato', 'ave', 'otro'].map((e) => (
            <button key={e} className={`fnd-chip${filtroEspecie === e ? ' fnd-chip--activo' : ''}`} onClick={() => setFiltroEspecie(e)}>
              {e === 'todos' ? 'Todos' : e.charAt(0).toUpperCase() + e.slice(1)}
            </button>
          ))}
        </div>
        <div className="fnd-filtros" style={{ margin: 0 }}>
          {['todos', 'en_cuarentena', 'disponible', 'en_proceso', 'adoptado'].map((st) => (
            <button key={st} className={`fnd-chip${filtroEstado === st ? ' fnd-chip--activo' : ''}`} onClick={() => setFiltroEstado(st)}>
              {st === 'todos' ? 'Todos' : etiquetaEstado[st]}
            </button>
          ))}
        </div>
      </div>

      {/* Grilla de mascotas */}
      <div className="fnd-grid-mascotas">
        {mascotasFiltradas.map((m) => (
          <div className="fnd-mascota" key={m.id}>
            <div className="fnd-mascota__foto">
              {m.fotoUrl ? <img src={m.fotoUrl} alt={m.nombre} /> : '🐾'}
            </div>
            <div className="fnd-mascota__body">
              <p className="fnd-mascota__nombre">{m.nombre}</p>
              <p className="fnd-mascota__sub">{m.especie} · {m.raza} · {m.edadEstimada}</p>
              <div className="fnd-mascota__chips">
                <span className={`admin-badge ${claseEstado[m.estadoAdopcion]}`}>{etiquetaEstado[m.estadoAdopcion]}</span>
                <span className={`fnd-mascota__chip ${m.vacunado ? 'fnd-chip--vacunado' : 'fnd-chip--sin-vacunas'}`}>
                  {m.vacunado ? '✓ Vacunado' : '⚠ Sin vacunas'}
                </span>
                <span className={`fnd-mascota__chip ${m.esterilizado ? 'fnd-chip--esterilizado' : 'fnd-chip--sin-esterilizar'}`}>
                  {m.esterilizado ? '✓ Esterilizado' : 'Sin esterilizar'}
                </span>
              </div>
              <div className="fnd-mascota__acciones">
                <button className="fnd-btn-gestionar" onClick={() => abrirGestionar(m)}>Gestionar</button>
                <button className="fnd-btn-ficha" onClick={() => setModalFicha(m)}>Ficha técnica</button>
              </div>
            </div>
          </div>
        ))}
        {mascotasFiltradas.length === 0 && (
          <p style={{ color: 'rgba(241,245,249,0.4)', gridColumn: '1/-1' }}>Sin resultados.</p>
        )}
      </div>

      {/* ── MODAL: REGISTRAR INGRESO (DISEÑO IDÉNTICO AL PANEL ADMIN) ── */}
      {modalIngreso && (
        <div className="admin-modal-backdrop" onClick={() => setModalIngreso(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <div className="admin-modal__header-left">
                <span className="admin-modal__icon-badge">➕</span>
                <div>
                  <h2 className="admin-modal__title">Registrar Ingreso de Mascota</h2>
                  <span className="admin-modal__subtitle">
                    Registra un animal rescatado en el refugio de la fundación
                  </span>
                </div>
              </div>
              <button className="admin-modal__close-btn" onClick={() => setModalIngreso(false)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={guardarIngreso}>
              <div className="admin-modal__body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="admin-modal__grid">
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Nombre *</span>
                    <input
                      type="text"
                      className="fnd-modal__input"
                      value={formIngreso.nombre}
                      onChange={(e) => setFormIngreso({ ...formIngreso, nombre: e.target.value })}
                      required
                      placeholder="Ej: Max, Luna"
                      style={{ width: '100%', marginTop: 4 }}
                    />
                  </div>

                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Especie</span>
                    <select
                      className="fnd-modal__input"
                      value={formIngreso.especie}
                      onChange={(e) => setFormIngreso({ ...formIngreso, especie: e.target.value })}
                      style={{ width: '100%', marginTop: 4 }}
                    >
                      <option value="perro" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>Perro</option>
                      <option value="gato" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>Gato</option>
                      <option value="ave" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>Ave</option>
                      <option value="otro" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>Otro</option>
                    </select>
                  </div>

                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Raza *</span>
                    <input
                      type="text"
                      className="fnd-modal__input"
                      value={formIngreso.raza}
                      onChange={(e) => setFormIngreso({ ...formIngreso, raza: e.target.value })}
                      required
                      placeholder="Ej: Criollo, Labrador"
                      style={{ width: '100%', marginTop: 4 }}
                    />
                  </div>

                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Edad estimada *</span>
                    <input
                      type="text"
                      className="fnd-modal__input"
                      value={formIngreso.edadEstimada}
                      onChange={(e) => setFormIngreso({ ...formIngreso, edadEstimada: e.target.value })}
                      required
                      placeholder="Ej: 2 años, 8 meses"
                      style={{ width: '100%', marginTop: 4 }}
                    />
                  </div>

                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Tamaño</span>
                    <select
                      className="fnd-modal__input"
                      value={formIngreso.tamano}
                      onChange={(e) => setFormIngreso({ ...formIngreso, tamano: e.target.value })}
                      style={{ width: '100%', marginTop: 4 }}
                    >
                      <option value="pequeño" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>Pequeño</option>
                      <option value="mediano" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>Mediano</option>
                      <option value="grande" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>Grande</option>
                    </select>
                  </div>

                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Sexo</span>
                    <select
                      className="fnd-modal__input"
                      value={formIngreso.sexo}
                      onChange={(e) => setFormIngreso({ ...formIngreso, sexo: e.target.value })}
                      style={{ width: '100%', marginTop: 4 }}
                    >
                      <option value="Macho" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>Macho</option>
                      <option value="Hembra" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>Hembra</option>
                    </select>
                  </div>

                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Estado de adopción</span>
                    <select
                      className="fnd-modal__input"
                      value={formIngreso.estadoAdopcion}
                      onChange={(e) => setFormIngreso({ ...formIngreso, estadoAdopcion: e.target.value })}
                      style={{ width: '100%', marginTop: 4 }}
                    >
                      <option value="en_cuarentena" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>En cuarentena</option>
                      <option value="disponible" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>Disponible</option>
                      <option value="en_proceso" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>En proceso</option>
                      <option value="adoptado" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>Adoptado</option>
                    </select>
                  </div>
                </div>

                {/* Subida de foto desde PC o URL */}
                <div style={{ marginTop: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span className="admin-detail-label">Foto de la mascota</span>
                    <button
                      type="button"
                      onClick={() => setModoUrl(!modoUrl)}
                      style={{ background: 'none', border: 'none', color: '#C4B5FD', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      {modoUrl ? 'Subir desde mi PC' : 'Pegar URL de imagen'}
                    </button>
                  </div>

                  {modoUrl ? (
                    <input
                      type="url"
                      placeholder="https://ejemplo.com/foto.jpg"
                      className="fnd-modal__input"
                      value={formIngreso.fotoUrl}
                      onChange={(e) => setFormIngreso({ ...formIngreso, fotoUrl: e.target.value })}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    <div>
                      {formIngreso.fotoUrl ? (
                        <div className="fnd-preview-foto">
                          <img src={formIngreso.fotoUrl} alt="Vista previa" />
                          <button
                            type="button"
                            className="fnd-preview-foto__remover"
                            onClick={() => setFormIngreso({ ...formIngreso, fotoUrl: '' })}
                            title="Eliminar foto"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div
                          className={`fnd-dropzone ${dragFoto ? 'fnd-dropzone--drag' : ''}`}
                          onDragOver={(e) => { e.preventDefault(); setDragFoto(true) }}
                          onDragLeave={() => setDragFoto(false)}
                          onDrop={(e) => {
                            e.preventDefault()
                            setDragFoto(false)
                            if (e.dataTransfer.files?.[0]) {
                              const file = e.dataTransfer.files[0]
                              setFormIngreso({ ...formIngreso, fotoUrl: URL.createObjectURL(file) })
                            }
                          }}
                          onClick={() => inputFotoRef.current?.click()}
                        >
                          <FiUploadCloud className="fnd-dropzone__icon" />
                          <p className="fnd-dropzone__texto">
                            <span className="fnd-dropzone__link">Sube una foto</span> desde tu computadora o arrástrala
                          </p>
                          <span className="fnd-dropzone__hint">PNG, JPG o WEBP</span>
                          <input
                            ref={inputFotoRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                const file = e.target.files[0]
                                setFormIngreso({ ...formIngreso, fotoUrl: URL.createObjectURL(file) })
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 14 }}>
                  <span className="admin-detail-label">Estado de salud</span>
                  <input
                    type="text"
                    className="fnd-modal__input"
                    value={formIngreso.estadoSalud}
                    onChange={(e) => setFormIngreso({ ...formIngreso, estadoSalud: e.target.value })}
                    placeholder="Ej: Saludable, esquema de vacunas completo..."
                    style={{ width: '100%', marginTop: 4 }}
                  />
                </div>

                {/* Etiquetas interactivas de Vacunación y Esterilización */}
                <div style={{ marginTop: 14 }}>
                  <span className="admin-detail-label">Etiquetas de Salud & Esterilización (clic para alternar)</span>
                  <div className="admin-tags-group">
                    <button
                      type="button"
                      className={`admin-tag-toggle ${formIngreso.vacunado ? 'admin-tag-toggle--vacunado' : 'admin-tag-toggle--sin-vacunas'}`}
                      onClick={() => setFormIngreso({ ...formIngreso, vacunado: !formIngreso.vacunado })}
                      title="Clic para cambiar estado de vacunación"
                    >
                      {formIngreso.vacunado ? '✓ Vacunado' : '⚠ Sin Vacunas'}
                    </button>
                    <button
                      type="button"
                      className={`admin-tag-toggle ${formIngreso.esterilizado ? 'admin-tag-toggle--esterilizado' : 'admin-tag-toggle--sin-esterilizar'}`}
                      onClick={() => setFormIngreso({ ...formIngreso, esterilizado: !formIngreso.esterilizado })}
                      title="Clic para cambiar estado de esterilización"
                    >
                      {formIngreso.esterilizado ? '✓ Esterilizado' : 'Sin Esterilizar'}
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: 14 }}>
                  <span className="admin-detail-label">Descripción / Personalidad</span>
                  <textarea
                    className="fnd-modal__input"
                    rows="3"
                    value={formIngreso.descripcion}
                    onChange={(e) => setFormIngreso({ ...formIngreso, descripcion: e.target.value })}
                    placeholder="Describe el comportamiento, historia o requerimientos especiales del animal..."
                    style={{ width: '100%', marginTop: 4, resize: 'vertical' }}
                  />
                </div>
              </div>

              <div className="admin-modal__footer">
                <button
                  type="button"
                  className="admin-modal__btn admin-modal__btn--secondary"
                  onClick={() => setModalIngreso(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="admin-modal__btn admin-modal__btn--primary">
                  <FiCheck /> Guardar mascota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Gestionar */}
      {modalGestionar && (
        <div className="admin-modal-backdrop" onClick={() => setModalGestionar(null)}>
          <div className="admin-modal" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <div className="admin-modal__header-left">
                <span className="admin-modal__icon-badge">🐾</span>
                <div>
                  <h2 className="admin-modal__title">Gestionar — {modalGestionar.nombre}</h2>
                  <span className="admin-modal__subtitle">Actualiza estado clínico y de adopción</span>
                </div>
              </div>
              <button className="admin-modal__close-btn" onClick={() => setModalGestionar(null)}><FiX /></button>
            </div>

            <form onSubmit={guardarGestionar}>
              <div className="admin-modal__body">
                <div className="fnd-modal__campo">
                  <label className="fnd-modal__label">Estado de adopción</label>
                  <select
                    className="fnd-modal__input"
                    value={formGestionar.estadoAdopcion}
                    onChange={(e) => setFormGestionar({ ...formGestionar, estadoAdopcion: e.target.value })}
                  >
                    <option value="en_cuarentena" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>Cuarentena</option>
                    <option value="disponible" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>Disponible</option>
                    <option value="en_proceso" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>En proceso</option>
                    <option value="adoptado" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>Adoptado</option>
                  </select>
                </div>

                <div className="fnd-modal__campo">
                  <label className="fnd-modal__label">Estado de salud</label>
                  <input
                    className="fnd-modal__input"
                    value={formGestionar.estadoSalud}
                    onChange={(e) => setFormGestionar({ ...formGestionar, estadoSalud: e.target.value })}
                  />
                </div>

                {/* Etiquetas de salud en gestionar */}
                <div style={{ marginTop: 12 }}>
                  <span className="admin-detail-label">Etiquetas de Salud</span>
                  <div className="admin-tags-group">
                    <button
                      type="button"
                      className={`admin-tag-toggle ${formGestionar.vacunado ? 'admin-tag-toggle--vacunado' : 'admin-tag-toggle--sin-vacunas'}`}
                      onClick={() => setFormGestionar({ ...formGestionar, vacunado: !formGestionar.vacunado })}
                    >
                      {formGestionar.vacunado ? '✓ Vacunado' : '⚠ Sin Vacunas'}
                    </button>
                    <button
                      type="button"
                      className={`admin-tag-toggle ${formGestionar.esterilizado ? 'admin-tag-toggle--esterilizado' : 'admin-tag-toggle--sin-esterilizar'}`}
                      onClick={() => setFormGestionar({ ...formGestionar, esterilizado: !formGestionar.esterilizado })}
                    >
                      {formGestionar.esterilizado ? '✓ Esterilizado' : 'Sin Esterilizar'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="admin-modal__footer">
                <button type="button" className="admin-modal__btn admin-modal__btn--secondary" onClick={() => setModalGestionar(null)}>Cancelar</button>
                <button type="submit" className="admin-modal__btn admin-modal__btn--primary"><FiCheck /> Guardar cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Ficha técnica */}
      {modalFicha && (
        <div className="admin-modal-backdrop" onClick={() => setModalFicha(null)}>
          <div className="admin-modal" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <div className="admin-modal__header-left">
                <span className="admin-modal__icon-badge">📋</span>
                <div>
                  <h2 className="admin-modal__title">Ficha Técnica — {modalFicha.nombre}</h2>
                  <span className="admin-modal__subtitle">Expediente médico y biográfico</span>
                </div>
              </div>
              <button className="admin-modal__close-btn" onClick={() => setModalFicha(null)}><FiX /></button>
            </div>

            <div className="admin-modal__body">
              {modalFicha.fotoUrl && (
                <img
                  src={modalFicha.fotoUrl}
                  alt={modalFicha.nombre}
                  style={{ width: '100%', borderRadius: 12, marginBottom: 16, objectFit: 'cover', maxHeight: 200, border: '1px solid rgba(124, 58, 237, 0.25)' }}
                />
              )}

              <div className="admin-tags-group" style={{ marginBottom: 14 }}>
                <span className={`admin-tag-toggle ${modalFicha.vacunado ? 'admin-tag-toggle--vacunado' : 'admin-tag-toggle--sin-vacunas'}`}>
                  {modalFicha.vacunado ? '✓ Vacunado' : '⚠ Sin Vacunas'}
                </span>
                <span className={`admin-tag-toggle ${modalFicha.esterilizado ? 'admin-tag-toggle--esterilizado' : 'admin-tag-toggle--sin-esterilizar'}`}>
                  {modalFicha.esterilizado ? '✓ Esterilizado' : 'Sin Esterilizar'}
                </span>
              </div>

              <div className="admin-modal__grid">
                {[
                  ['Especie', modalFicha.especie],
                  ['Raza', modalFicha.raza],
                  ['Edad', modalFicha.edadEstimada],
                  ['Tamaño', modalFicha.tamano],
                  ['Salud', modalFicha.estadoSalud],
                  ['Fecha Ingreso', modalFicha.fechaIngreso],
                ].map(([k, v]) => (
                  <div key={k} className="admin-detail-item">
                    <span className="admin-detail-label">{k}</span>
                    <span className="admin-detail-value">{v || '—'}</span>
                  </div>
                ))}
              </div>

              {modalFicha.descripcion && (
                <div style={{ marginTop: 14, background: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 10, border: '1px solid rgba(124,58,237,0.15)' }}>
                  <span className="admin-detail-label">Personalidad & Cuidados</span>
                  <p style={{ color: '#F8FAFC', fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>{modalFicha.descripcion}</p>
                </div>
              )}
            </div>

            <div className="admin-modal__footer">
              <button type="button" className="admin-modal__btn admin-modal__btn--secondary" onClick={() => setModalFicha(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FundacionExpedientes
