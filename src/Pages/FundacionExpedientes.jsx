import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { FiSearch, FiX } from 'react-icons/fi'
import { useFundacion } from '../Context/FundacionContext.jsx'

const FundacionExpedientes = () => {
  const { mascotas, agregarMascota, actualizarMascota } = useFundacion()
  const location = useLocation()

  const [busqueda, setBusqueda] = useState('')
  const [filtroEspecie, setFiltroEspecie] = useState('todos')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [modalIngreso, setModalIngreso] = useState(() => Boolean(location.state?.abrirModal))
  const [modalGestionar, setModalGestionar] = useState(null)
  const [modalFicha, setModalFicha] = useState(null)

  const [formIngreso, setFormIngreso] = useState({
    nombre: '', especie: 'perro', raza: '', edadEstimada: '',
    tamano: 'mediano', estadoSalud: '', descripcion: '', fotoUrl: '',
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
      vacunado: false,
      esterilizado: false,
      fundacionId: 1,
    })
    setModalIngreso(false)
    setFormIngreso({ nombre: '', especie: 'perro', raza: '', edadEstimada: '', tamano: 'mediano', estadoSalud: '', descripcion: '', fotoUrl: '' })
  }

  const [formGestionar, setFormGestionar] = useState({})

  const abrirGestionar = (m) => {
    setFormGestionar({ estadoAdopcion: m.estadoAdopcion, estadoSalud: m.estadoSalud })
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
                {m.vacunado && <span className="fnd-mascota__chip">Vacunado</span>}
                {m.esterilizado && <span className="fnd-mascota__chip">Esterilizado</span>}
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

      {/* Modal: Registrar Ingreso */}
      {modalIngreso && (
        <div className="fnd-modal__fondo" onClick={() => setModalIngreso(false)}>
          <div className="fnd-modal" onClick={(e) => e.stopPropagation()}>
            <button className="fnd-modal__cerrar" onClick={() => setModalIngreso(false)}><FiX /></button>
            <h2 className="fnd-modal__titulo">Registrar Ingreso</h2>
            <form onSubmit={guardarIngreso}>
              {[['nombre','Nombre'],['raza','Raza'],['edadEstimada','Edad estimada'],['estadoSalud','Estado de salud'],['descripcion','Personalidad'],['fotoUrl','Foto (URL)']].map(([campo, etq]) => (
                <div className="fnd-modal__campo" key={campo}>
                  <label className="fnd-modal__label">{etq}</label>
                  <input
                    className="fnd-modal__input"
                    value={formIngreso[campo]}
                    onChange={(e) => setFormIngreso((p) => ({ ...p, [campo]: e.target.value }))}
                    required={['nombre','raza','edadEstimada'].includes(campo)}
                  />
                </div>
              ))}
              <div className="fnd-modal__campo">
                <label className="fnd-modal__label">Especie</label>
                <select className="fnd-modal__input" value={formIngreso.especie} onChange={(e) => setFormIngreso((p) => ({ ...p, especie: e.target.value }))}>
                  <option value="perro">Perro</option>
                  <option value="gato">Gato</option>
                  <option value="ave">Ave</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div className="fnd-modal__campo">
                <label className="fnd-modal__label">Tamaño</label>
                <select className="fnd-modal__input" value={formIngreso.tamano} onChange={(e) => setFormIngreso((p) => ({ ...p, tamano: e.target.value }))}>
                  <option value="pequeño">Pequeño</option>
                  <option value="mediano">Mediano</option>
                  <option value="grande">Grande</option>
                </select>
              </div>
              <div className="fnd-modal__acciones">
                <button type="button" className="fnd-modal__btn fnd-modal__btn--secundario" onClick={() => setModalIngreso(false)}>Cancelar</button>
                <button type="submit" className="fnd-modal__btn fnd-modal__btn--primario">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Gestionar */}
      {modalGestionar && (
        <div className="fnd-modal__fondo" onClick={() => setModalGestionar(null)}>
          <div className="fnd-modal" onClick={(e) => e.stopPropagation()}>
            <button className="fnd-modal__cerrar" onClick={() => setModalGestionar(null)}><FiX /></button>
            <h2 className="fnd-modal__titulo">Gestionar — {modalGestionar.nombre}</h2>
            <form onSubmit={guardarGestionar}>
              <div className="fnd-modal__campo">
                <label className="fnd-modal__label">Estado de adopción</label>
                <select className="fnd-modal__input" value={formGestionar.estadoAdopcion} onChange={(e) => setFormGestionar((p) => ({ ...p, estadoAdopcion: e.target.value }))}>
                  <option value="en_cuarentena">Cuarentena</option>
                  <option value="disponible">Disponible</option>
                  <option value="en_proceso">En proceso</option>
                  <option value="adoptado">Adoptado</option>
                </select>
              </div>
              <div className="fnd-modal__campo">
                <label className="fnd-modal__label">Estado de salud</label>
                <input className="fnd-modal__input" value={formGestionar.estadoSalud} onChange={(e) => setFormGestionar((p) => ({ ...p, estadoSalud: e.target.value }))} />
              </div>
              <div className="fnd-modal__acciones">
                <button type="button" className="fnd-modal__btn fnd-modal__btn--secundario" onClick={() => setModalGestionar(null)}>Cancelar</button>
                <button type="submit" className="fnd-modal__btn fnd-modal__btn--primario">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Ficha técnica */}
      {modalFicha && (
        <div className="fnd-modal__fondo" onClick={() => setModalFicha(null)}>
          <div className="fnd-modal" onClick={(e) => e.stopPropagation()}>
            <button className="fnd-modal__cerrar" onClick={() => setModalFicha(null)}><FiX /></button>
            <h2 className="fnd-modal__titulo">Ficha — {modalFicha.nombre}</h2>
            {modalFicha.fotoUrl && <img src={modalFicha.fotoUrl} alt={modalFicha.nombre} style={{ width: '100%', borderRadius: 10, marginBottom: 16, objectFit: 'cover', maxHeight: 200 }} />}
            {[['Especie', modalFicha.especie],['Raza', modalFicha.raza],['Edad', modalFicha.edadEstimada],['Tamaño', modalFicha.tamano],['Salud', modalFicha.estadoSalud],['Vacunado', modalFicha.vacunado ? 'Sí' : 'No'],['Esterilizado', modalFicha.esterilizado ? 'Sí' : 'No'],['Ingreso', modalFicha.fechaIngreso],['Descripción', modalFicha.descripcion]].map(([k, v]) => (
              <div key={k} style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: 'rgba(241,245,249,0.5)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{k}</span>
                <p style={{ color: '#f8fafc', fontSize: 14 }}>{v || '—'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FundacionExpedientes
