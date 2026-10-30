import { useEffect, useState } from 'react'
import { FaPaw } from 'react-icons/fa'
import { FiCheck, FiEye, FiX } from 'react-icons/fi'
import AdminTopbar from '../../Componentes/Admin/AdminTopbar.jsx'
import { getMascotasAdmin } from '../../Services/adminService.js'
import '../../Style/Admin/AdminTablas.css'
import '../../Style/Admin/AdminModal.css'
import { BADGE_MASCOTA, distintivo } from '../../Utils/estados.js'


// Vista de supervisión: las mascotas las crea y edita cada fundación desde su panel
const AdminMascotas = () => {
  const [mascotas, setMascotas] = useState([])
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [detalle, setDetalle] = useState(null)

  useEffect(() => {
    getMascotasAdmin()
      .then(setMascotas)
      .catch((e) => setError(e.message))
  }, [])

  const filtradas = mascotas.filter((m) => {
    const texto = `${m.nombre} ${m.raza} ${m.fundacion} ${m.especie}`.toLowerCase()
    return texto.includes(busqueda.toLowerCase()) && (filtroEstado === 'todos' || m.estadoAdopcion === filtroEstado)
  })

  return (
    <>
      <AdminTopbar
        placeholder="Buscar por nombre, raza o fundación..."
        valor={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <main className="admin-main">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-title">Mascotas en Sistema</h1>
            <p className="admin-subtitulo">
              Animales registrados por las fundaciones. Cada fundación los administra desde su panel.
            </p>
          </div>
        </div>

        {error && <p role="alert" className="text-peligro">{error}</p>}

        <div className="admin-filtros">
          {['todos', 'en_cuarentena', 'disponible', 'en_proceso', 'adoptado'].map((st) => (
            <button
              key={st}
              className={`fnd-chip${filtroEstado === st ? ' fnd-chip--activo' : ''}`}
              onClick={() => setFiltroEstado(st)}
            >
              {st === 'todos' ? 'Todas las mascotas' : BADGE_MASCOTA[st].txt}
            </button>
          ))}
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mascota</th>
                <th>Raza</th>
                <th>Edad</th>
                <th>Fundación</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="admin-celda-vacia">
                    No se encontraron mascotas.
                  </td>
                </tr>
              ) : (
                filtradas.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <div className="mascota-celda">
                        {m.fotoUrl ? (
                          <img src={m.fotoUrl} alt={m.nombre} className="mascota-mini" />
                        ) : (
                          <div className="mascota-mini mascota-mini--vacia">
                            <FaPaw />
                          </div>
                        )}
                        <div>
                          <strong className="mascota-celda__nombre">{m.nombre}</strong>
                          <small className="mascota-celda__sub">{m.especie}</small>
                        </div>
                      </div>
                    </td>
                    <td>{m.raza}</td>
                    <td>{m.edadEstimada}</td>
                    <td>{m.fundacion}</td>
                    <td>
                      <span className={`admin-badge ${distintivo(BADGE_MASCOTA, m.estadoAdopcion).cls}`}>
                        {distintivo(BADGE_MASCOTA, m.estadoAdopcion).txt}
                      </span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button className="admin-action-btn" title="Ver detalles" onClick={() => setDetalle(m)}>
                          <FiEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {detalle && (
        <div className="admin-modal-backdrop" onClick={() => setDetalle(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <div className="admin-modal__header-left">
                <span className="admin-modal__icon-badge"><FaPaw /></span>
                <div>
                  <h2 className="admin-modal__title">{detalle.nombre}</h2>
                  <span className="admin-modal__subtitle">Expediente #{detalle.id} — {detalle.fundacion}</span>
                </div>
              </div>
              <button className="admin-modal__close-btn" onClick={() => setDetalle(null)}><FiX /></button>
            </div>

            <div className="admin-modal__body">
              {detalle.fotoUrl && (
                <div className="mascota-detalle-foto">
                  <img src={detalle.fotoUrl} alt={detalle.nombre} />
                </div>
              )}

              <div className="admin-modal__grid">
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Especie / Raza</span>
                  <span className="admin-detail-value">{detalle.especie} · {detalle.raza}</span>
                </div>
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Edad estimada</span>
                  <span className="admin-detail-value">{detalle.edadEstimada}</span>
                </div>
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Tamaño / Sexo</span>
                  <span className="admin-detail-value">{detalle.tamano} · {detalle.sexo}</span>
                </div>
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Estado actual</span>
                  <span className="admin-detail-value">
                    <span className={`admin-badge ${distintivo(BADGE_MASCOTA, detalle.estadoAdopcion).cls}`}>
                      {distintivo(BADGE_MASCOTA, detalle.estadoAdopcion).txt}
                    </span>
                  </span>
                </div>
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Salud</span>
                  <span className="admin-detail-value">
                    {detalle.estadoSalud || 'Sin novedades médicas'}
                    <span className="detalle-nota">
                      Vacunado: {detalle.vacunado ? <><FiCheck /> Sí</> : <><FiX /> No</>} · Esterilizado: {detalle.esterilizado ? <><FiCheck /> Sí</> : <><FiX /> No</>} · Desparasitado: {detalle.desparasitado ? <><FiCheck /> Sí</> : <><FiX /> No</>}
                    </span>
                  </span>
                </div>
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Fecha de ingreso</span>
                  <span className="admin-detail-value">{new Date(detalle.fechaIngreso).toLocaleDateString('es-CO')}</span>
                </div>
              </div>

              {detalle.descripcion && (
                <div className="admin-detail-block mt-3.5" >
                  <span className="admin-detail-label">Historia</span>
                  <p className="admin-detail-text">{detalle.descripcion}</p>
                </div>
              )}
            </div>

            <div className="admin-modal__footer">
              <button className="admin-modal__btn admin-modal__btn--secondary" onClick={() => setDetalle(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminMascotas
