import { FaPaw } from 'react-icons/fa'
import { useState } from 'react'
import { FiAlertTriangle, FiCheck, FiClipboard, FiPlus, FiSearch, FiShield, FiX } from 'react-icons/fi'
import { useFundacion } from '../../Context/FundacionContext.jsx'
import CamposMascota from '../../Componentes/Fundacion/CamposMascota.jsx'
import { BADGE_MASCOTA, distintivo } from '../../Utils/estados.js'
import { BADGE, BTN_PRIMARIO, BTN_SECUNDARIO, DETALLE_ITEM, DETALLE_LABEL, DETALLE_VALOR, ETIQUETAS, MODAL, MODAL_CABECERA, MODAL_CABECERA_IZQ, MODAL_CERRAR, MODAL_CUERPO, MODAL_FONDO, MODAL_GRID, MODAL_PIE, MODAL_TITULO, etiqueta } from '../../Utils/adminEstilos'
import { TITULO, TOPBAR_SEARCH } from '../../Utils/panelEstilos'
import { FND_AVISO, FND_BTN_FICHA, FND_BTN_GESTIONAR, FND_BTN_PRIMARIO, FND_FILTROS, FND_GRID_MASCOTAS, FND_MASCOTA, FND_MASCOTA_ACCIONES, FND_MASCOTA_CHIPS, FND_MASCOTA_CUERPO, FND_MASCOTA_FOTO, FND_MASCOTA_NOMBRE, FND_MASCOTA_SUB, fndChip, fndChipMascota } from '../../Utils/fundacionEstilos'

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
        <h1 className={TITULO}>Expedientes Peluditos</h1>
        {/* Abre el modal para registrar el ingreso de una mascota */}
        <button type="button" className={FND_BTN_PRIMARIO} onClick={() => setModalIngreso(true)}>
          <FiPlus /> Registrar Ingreso
        </button>
      </div>
      {aviso && !modalIngreso && !modalGestionar && <p className={FND_AVISO} role="alert">{aviso}</p>}

      {/* Barra de filtros */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        <div className={TOPBAR_SEARCH} style={{ flex: 1, minWidth: 200 }}>
          <FiSearch />
          <input
            type="text"
            placeholder="Buscar mascota..." aria-label="Buscar mascota..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className={FND_FILTROS} >
          {['todos', 'perro', 'gato', 'ave', 'otro'].map((e) => (
            <button key={e} className={fndChip(filtroEspecie === e)} onClick={() => setFiltroEspecie(e)}>
              {e === 'todos' ? 'Todos' : e.charAt(0).toUpperCase() + e.slice(1)}
            </button>
          ))}
        </div>
        <div className={FND_FILTROS} >
          {['todos', 'en_cuarentena', 'disponible', 'en_proceso', 'adoptado'].map((st) => (
            <button key={st} className={fndChip(filtroEstado === st)} onClick={() => setFiltroEstado(st)}>
              {st === 'todos' ? 'Todos' : BADGE_MASCOTA[st].txt}
            </button>
          ))}
        </div>
      </div>

      {/* Grilla de mascotas */}
      <div className={FND_GRID_MASCOTAS}>
        {mascotasFiltradas.map((m) => (
          <div className={FND_MASCOTA} key={m.id}>
            <div className={FND_MASCOTA_FOTO}>
              {m.fotoUrl ? <img src={m.fotoUrl} alt={m.nombre} /> : <FaPaw />}
            </div>
            <div className={FND_MASCOTA_CUERPO}>
              <p className={FND_MASCOTA_NOMBRE}>{m.nombre}</p>
              <p className={FND_MASCOTA_SUB}>{m.especie} · {m.raza} · {m.edadEstimada}</p>
              <div className={FND_MASCOTA_CHIPS}>
                <span className={`${BADGE} ${distintivo(BADGE_MASCOTA, m.estadoAdopcion).cls}`}>{distintivo(BADGE_MASCOTA, m.estadoAdopcion).txt}</span>
                <span className={fndChipMascota(m.vacunado ? 'vacunado' : 'sinVacunas')}>
                  {m.vacunado ? <><FiCheck /> Vacunado</> : <><FiAlertTriangle /> Sin vacunas</>}
                </span>
                <span className={fndChipMascota(m.esterilizado ? 'esterilizado' : 'sinEsterilizar')}>
                  {m.esterilizado ? <><FiCheck /> Esterilizado</> : 'Sin esterilizar'}
                </span>
              </div>
              <div className={FND_MASCOTA_ACCIONES}>
                <button className={FND_BTN_GESTIONAR} onClick={() => abrirGestionar(m)}>Gestionar</button>
                <button className={FND_BTN_FICHA} onClick={() => setModalFicha(m)}>Ficha técnica</button>
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
        <div className={MODAL_FONDO} onClick={() => setModalIngreso(false)}>
          <div className={MODAL} onClick={(e) => e.stopPropagation()}>
            <div className={MODAL_CABECERA}>
              <div className={MODAL_CABECERA_IZQ}>
                <span className="admin-modal__icon-badge"><FiPlus /></span>
                <div>
                  <h2 className={MODAL_TITULO}>Registrar Ingreso de Mascota</h2>
                  <span className="admin-modal__subtitle">
                    Registra un animal rescatado en el refugio de la fundación
                  </span>
                </div>
              </div>
              <button className={MODAL_CERRAR} onClick={() => setModalIngreso(false)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={guardarIngreso}>
              <div className={`${MODAL_CUERPO} max-h-[70vh] overflow-y-auto`} >
                <CamposMascota form={formIngreso} setForm={setFormIngreso} />
                {aviso && <p className={FND_AVISO} role="alert">{aviso}</p>}
              </div>

              <div className={MODAL_PIE}>
                <button
                  type="button"
                  className={BTN_SECUNDARIO}
                  onClick={() => setModalIngreso(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className={BTN_PRIMARIO} disabled={enviando}>
                  <FiCheck /> {enviando ? 'Guardando...' : 'Guardar mascota'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Gestionar (edita la mascota completa, con los mismos campos que el ingreso) */}
      {modalGestionar && (
        <div className={MODAL_FONDO} onClick={() => setModalGestionar(null)}>
          <div className={MODAL} onClick={(e) => e.stopPropagation()}>
            <div className={MODAL_CABECERA}>
              <div className={MODAL_CABECERA_IZQ}>
                <span className="admin-modal__icon-badge"><FaPaw /></span>
                <div>
                  <h2 className={MODAL_TITULO}>Gestionar — {modalGestionar.nombre}</h2>
                  <span className="admin-modal__subtitle">Edita los datos, la salud, la foto y el estado de adopción</span>
                </div>
              </div>
              <button className={MODAL_CERRAR} onClick={() => setModalGestionar(null)}><FiX /></button>
            </div>

            <form onSubmit={guardarGestionar}>
              <div className={`${MODAL_CUERPO} max-h-[70vh] overflow-y-auto`} >
                <CamposMascota form={formGestionar} setForm={setFormGestionar} />
                {aviso && <p className={FND_AVISO} role="alert">{aviso}</p>}
              </div>

              <div className={MODAL_PIE}>
                <button type="button" className={BTN_SECUNDARIO} onClick={() => setModalGestionar(null)}>Cancelar</button>
                <button type="submit" className={BTN_PRIMARIO} disabled={enviando}>
                  <FiCheck /> {enviando ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Ficha técnica */}
      {modalFicha && (
        <div className={MODAL_FONDO} onClick={() => setModalFicha(null)}>
          <div className={`${MODAL} max-w-[520px]`} onClick={(e) => e.stopPropagation()}>
            <div className={MODAL_CABECERA}>
              <div className={MODAL_CABECERA_IZQ}>
                <span className="admin-modal__icon-badge"><FiClipboard /></span>
                <div>
                  <h2 className={MODAL_TITULO}>Ficha Técnica — {modalFicha.nombre}</h2>
                  <span className="admin-modal__subtitle">Expediente médico y biográfico</span>
                </div>
              </div>
              <button className={MODAL_CERRAR} onClick={() => setModalFicha(null)}><FiX /></button>
            </div>

            <div className={MODAL_CUERPO}>
              {modalFicha.fotoUrl && (
                <img
                  src={modalFicha.fotoUrl}
                  alt={modalFicha.nombre}
                  style={{ width: '100%', borderRadius: 12, marginBottom: 16, objectFit: 'cover', maxHeight: 200, border: '1px solid rgba(124, 58, 237, 0.25)' }}
                />
              )}

              <div className={ETIQUETAS} style={{ marginBottom: 14 }}>
                <span className={etiqueta(modalFicha.vacunado ? 'vacunado' : 'sinVacunas')}>
                  {modalFicha.vacunado ? <><FiCheck /> Vacunado</> : <><FiAlertTriangle /> Sin Vacunas</>}
                </span>
                <span className={etiqueta(modalFicha.esterilizado ? 'esterilizado' : 'sinEsterilizar')}>
                  {modalFicha.esterilizado ? <><FiCheck /> Esterilizado</> : 'Sin Esterilizar'}
                </span>
                <span className={etiqueta(modalFicha.desparasitado ? 'desparasitado' : 'sinDesparasitar')}>
                  {modalFicha.desparasitado ? <><FiShield /> Desparasitado</> : <><FiAlertTriangle /> Sin desparasitar</>}
                </span>
              </div>

              <div className={MODAL_GRID}>
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
                  <div key={k} className={DETALLE_ITEM}>
                    <span className={DETALLE_LABEL}>{k}</span>
                    <span className={DETALLE_VALOR}>{v || '—'}</span>
                  </div>
                ))}
              </div>

              {modalFicha.descripcion && (
                <div style={{ marginTop: 14, background: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 10, border: '1px solid rgba(124,58,237,0.15)' }}>
                  <span className={DETALLE_LABEL}>Historia</span>
                  <p style={{ color: '#F8FAFC', fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>{modalFicha.descripcion}</p>
                </div>
              )}
            </div>

            <div className={MODAL_PIE}>
              <button type="button" className={BTN_SECUNDARIO} onClick={() => setModalFicha(null)}>
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
