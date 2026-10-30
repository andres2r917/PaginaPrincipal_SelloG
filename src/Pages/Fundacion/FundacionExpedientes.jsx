import { FaPaw } from 'react-icons/fa'
import { useState } from 'react'
import { FiAlertTriangle, FiCheck, FiClipboard, FiPlus, FiSearch, FiShield, FiX } from 'react-icons/fi'
import { useFundacion } from '../../Context/FundacionContext.jsx'
import CamposMascota from '../../Componentes/Fundacion/CamposMascota.jsx'
import '../../Style/Admin/AdminModal.css'
import { BADGE_MASCOTA, distintivo } from '../../Utils/estados.js'

// Valores con los que arranca el formulario de ingreso (y a los que vuelve después de guardar)
const FORM_INGRESO_INICIAL = {
  nombre: '',
  especie: 'perro',
  raza: '',
  edadEstimada: '',
  tamano: 'mediano',
  sexo: 'Macho',
  temperamento: '',
  convivencia: '',
  estadoSalud: '',
  descripcion: '',
  fotoUrl: '',
  estadoAdopcion: 'en_cuarentena',
  vacunado: true,
  esterilizado: false,
  desparasitado: false,
  foto: null,
}

const FundacionExpedientes = () => {
  const { mascotas, agregarMascota, actualizarMascota } = useFundacion()

  const [busqueda, setBusqueda] = useState('')
  const [filtroEspecie, setFiltroEspecie] = useState('todos')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [modalIngreso, setModalIngreso] = useState(false)
  const [modalGestionar, setModalGestionar] = useState(null)
  const [modalFicha, setModalFicha] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [aviso, setAviso] = useState('')

  const [formIngreso, setFormIngreso] = useState(FORM_INGRESO_INICIAL)

  const mascotasFiltradas = mascotas.filter((m) => {
    const coincideBusqueda = m.nombre.toLowerCase().includes(busqueda.toLowerCase())
    const coincideEspecie = filtroEspecie === 'todos' || m.especie === filtroEspecie
    const coincideEstado = filtroEstado === 'todos' || m.estadoAdopcion === filtroEstado
    return coincideBusqueda && coincideEspecie && coincideEstado
  })

  const guardarIngreso = async (e) => {
    e.preventDefault()
    if (enviando) return
    setEnviando(true)
    setAviso('')
    const resultado = await agregarMascota({
      ...formIngreso,
      // Con archivo se sube la foto; si no, solo viaja el enlace pegado (nunca la vista previa temporal)
      fotoUrl: formIngreso.foto ? '' : formIngreso.fotoUrl,
    })
    setEnviando(false)
    if (!resultado.ok) {
      setAviso(resultado.mensaje)
      return
    }
    setModalIngreso(false)
    setFormIngreso(FORM_INGRESO_INICIAL)
  }

  const [formGestionar, setFormGestionar] = useState({})

  const abrirGestionar = (m) => {
    setAviso('')
    setFormGestionar({
      nombre: m.nombre,
      especie: m.especie,
      raza: m.raza,
      edadEstimada: m.edadEstimada,
      tamano: (m.tamano || 'mediano').toLowerCase(),
      sexo: m.sexo || 'Macho',
      temperamento: m.temperamento,
      convivencia: m.convivencia,
      estadoAdopcion: m.estadoAdopcion,
      estadoSalud: m.estadoSalud,
      descripcion: m.descripcion,
      fotoUrl: m.fotoUrl || '',
      foto: null,
      vacunado: Boolean(m.vacunado),
      esterilizado: Boolean(m.esterilizado),
      desparasitado: Boolean(m.desparasitado),
    })
    setModalGestionar(m)
  }

  const guardarGestionar = async (e) => {
    e.preventDefault()
    if (enviando) return
    setEnviando(true)
    setAviso('')
    // Con foto nueva viaja el archivo; si no, el enlace (vacío = quitar la foto)
    const resultado = await actualizarMascota(modalGestionar.id, {
      ...formGestionar,
      fotoUrl: formGestionar.foto ? undefined : formGestionar.fotoUrl,
    })
    setEnviando(false)
    if (!resultado.ok) {
      setAviso(resultado.mensaje)
      return
    }
    setModalGestionar(null)
  }

  const fechaLocal = (iso) => (iso ? new Date(iso).toLocaleDateString('es-CO') : '—')

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <h1 className="admin-title sin-margen">Expedientes Peluditos</h1>
        {/* Abre el modal para registrar el ingreso de una mascota */}
        <button type="button" className="fnd-btn-primario" onClick={() => setModalIngreso(true)}>
          <FiPlus /> Registrar Ingreso
        </button>
      </div>
      {aviso && !modalIngreso && !modalGestionar && <p className="fnd-aviso fnd-aviso--error" role="alert">{aviso}</p>}

      {/* Barra de filtros */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        <div className="admin-topbar__search" style={{ flex: 1, minWidth: 200 }}>
          <FiSearch />
          <input
            type="text"
            placeholder="Buscar mascota..." aria-label="Buscar mascota..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="fnd-filtros sin-margen" >
          {['todos', 'perro', 'gato', 'ave', 'otro'].map((e) => (
            <button key={e} className={`fnd-chip${filtroEspecie === e ? ' fnd-chip--activo' : ''}`} onClick={() => setFiltroEspecie(e)}>
              {e === 'todos' ? 'Todos' : e.charAt(0).toUpperCase() + e.slice(1)}
            </button>
          ))}
        </div>
        <div className="fnd-filtros sin-margen" >
          {['todos', 'en_cuarentena', 'disponible', 'en_proceso', 'adoptado'].map((st) => (
            <button key={st} className={`fnd-chip${filtroEstado === st ? ' fnd-chip--activo' : ''}`} onClick={() => setFiltroEstado(st)}>
              {st === 'todos' ? 'Todos' : BADGE_MASCOTA[st].txt}
            </button>
          ))}
        </div>
      </div>

      {/* Grilla de mascotas */}
      <div className="fnd-grid-mascotas">
        {mascotasFiltradas.map((m) => (
          <div className="fnd-mascota" key={m.id}>
            <div className="fnd-mascota__foto">
              {m.fotoUrl ? <img src={m.fotoUrl} alt={m.nombre} /> : <FaPaw />}
            </div>
            <div className="fnd-mascota__body">
              <p className="fnd-mascota__nombre">{m.nombre}</p>
              <p className="fnd-mascota__sub">{m.especie} · {m.raza} · {m.edadEstimada}</p>
              <div className="fnd-mascota__chips">
                <span className={`admin-badge ${distintivo(BADGE_MASCOTA, m.estadoAdopcion).cls}`}>{distintivo(BADGE_MASCOTA, m.estadoAdopcion).txt}</span>
                <span className={`fnd-mascota__chip ${m.vacunado ? 'fnd-chip--vacunado' : 'fnd-chip--sin-vacunas'}`}>
                  {m.vacunado ? <><FiCheck /> Vacunado</> : <><FiAlertTriangle /> Sin vacunas</>}
                </span>
                <span className={`fnd-mascota__chip ${m.esterilizado ? 'fnd-chip--esterilizado' : 'fnd-chip--sin-esterilizar'}`}>
                  {m.esterilizado ? <><FiCheck /> Esterilizado</> : 'Sin esterilizar'}
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
                <span className="admin-modal__icon-badge"><FiPlus /></span>
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
              <div className="admin-modal__body admin-modal__body--scroll" >
                <CamposMascota form={formIngreso} setForm={setFormIngreso} />
                {aviso && <p className="fnd-aviso fnd-aviso--error" role="alert">{aviso}</p>}
              </div>

              <div className="admin-modal__footer">
                <button
                  type="button"
                  className="admin-modal__btn admin-modal__btn--secondary"
                  onClick={() => setModalIngreso(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="admin-modal__btn admin-modal__btn--primary" disabled={enviando}>
                  <FiCheck /> {enviando ? 'Guardando...' : 'Guardar mascota'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Gestionar (edita la mascota completa, con los mismos campos que el ingreso) */}
      {modalGestionar && (
        <div className="admin-modal-backdrop" onClick={() => setModalGestionar(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <div className="admin-modal__header-left">
                <span className="admin-modal__icon-badge"><FaPaw /></span>
                <div>
                  <h2 className="admin-modal__title">Gestionar — {modalGestionar.nombre}</h2>
                  <span className="admin-modal__subtitle">Edita los datos, la salud, la foto y el estado de adopción</span>
                </div>
              </div>
              <button className="admin-modal__close-btn" onClick={() => setModalGestionar(null)}><FiX /></button>
            </div>

            <form onSubmit={guardarGestionar}>
              <div className="admin-modal__body admin-modal__body--scroll" >
                <CamposMascota form={formGestionar} setForm={setFormGestionar} />
                {aviso && <p className="fnd-aviso fnd-aviso--error" role="alert">{aviso}</p>}
              </div>

              <div className="admin-modal__footer">
                <button type="button" className="admin-modal__btn admin-modal__btn--secondary" onClick={() => setModalGestionar(null)}>Cancelar</button>
                <button type="submit" className="admin-modal__btn admin-modal__btn--primary" disabled={enviando}>
                  <FiCheck /> {enviando ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Ficha técnica */}
      {modalFicha && (
        <div className="admin-modal-backdrop" onClick={() => setModalFicha(null)}>
          <div className="admin-modal modal-angosto" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <div className="admin-modal__header-left">
                <span className="admin-modal__icon-badge"><FiClipboard /></span>
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
                  {modalFicha.vacunado ? <><FiCheck /> Vacunado</> : <><FiAlertTriangle /> Sin Vacunas</>}
                </span>
                <span className={`admin-tag-toggle ${modalFicha.esterilizado ? 'admin-tag-toggle--esterilizado' : 'admin-tag-toggle--sin-esterilizar'}`}>
                  {modalFicha.esterilizado ? <><FiCheck /> Esterilizado</> : 'Sin Esterilizar'}
                </span>
                <span className={`admin-tag-toggle ${modalFicha.desparasitado ? 'admin-tag-toggle--desparasitado' : 'admin-tag-toggle--sin-desparasitar'}`}>
                  {modalFicha.desparasitado ? <><FiShield /> Desparasitado</> : <><FiAlertTriangle /> Sin desparasitar</>}
                </span>
              </div>

              <div className="admin-modal__grid">
                {[
                  ['Especie', modalFicha.especie],
                  ['Raza', modalFicha.raza],
                  ['Edad', modalFicha.edadEstimada],
                  ['Tamaño', modalFicha.tamano],
                  ['Sexo', modalFicha.sexo],
                  ['Temperamento', modalFicha.temperamento],
                  ['Convivencia', modalFicha.convivencia],
                  ['Salud', modalFicha.estadoSalud],
                  ['Fecha Ingreso', fechaLocal(modalFicha.fechaIngreso)],
                ].map(([k, v]) => (
                  <div key={k} className="admin-detail-item">
                    <span className="admin-detail-label">{k}</span>
                    <span className="admin-detail-value">{v || '—'}</span>
                  </div>
                ))}
              </div>

              {modalFicha.descripcion && (
                <div style={{ marginTop: 14, background: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 10, border: '1px solid rgba(124,58,237,0.15)' }}>
                  <span className="admin-detail-label">Historia</span>
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
