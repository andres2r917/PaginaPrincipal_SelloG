import { useEffect, useState } from 'react'
import { FaPaw } from 'react-icons/fa'
import { FiCheck, FiEye, FiX } from 'react-icons/fi'
import AdminTopbar from '../../Componentes/Admin/AdminTopbar.jsx'
import { getMascotasAdmin } from '../../Services/adminService.js'
import { BADGE_MASCOTA, distintivo } from '../../Utils/estados.js'
import { ACCIONES, ACCION_BTN, BADGE, BTN_SECUNDARIO, CELDA_VACIA, DETALLE_ITEM, DETALLE_LABEL, DETALLE_NOTA, DETALLE_VALOR, FILTROS, MASCOTA_CELDA, MASCOTA_FOTO, MASCOTA_MINI, MASCOTA_MINI_VACIA, MASCOTA_NOMBRE, MASCOTA_SUB, MODAL, MODAL_CABECERA, MODAL_CABECERA_IZQ, MODAL_CERRAR, MODAL_CUERPO, MODAL_FONDO, MODAL_GRID, MODAL_PIE, MODAL_TITULO, PAGE_HEADER, SUBTITULO, TABLA, TABLA_WRAP } from '../../Utils/adminEstilos'
import { MAIN, TITULO } from '../../Utils/panelEstilos'
import { fndChip } from '../../Utils/fundacionEstilos'


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

      <main className={MAIN}>
        <div className={PAGE_HEADER}>
          <div>
            <h1 className={TITULO}>Mascotas en Sistema</h1>
            <p className={SUBTITULO}>
              Animales registrados por las fundaciones. Cada fundación los administra desde su panel.
            </p>
          </div>
        </div>

        {error && <p role="alert" className="text-peligro">{error}</p>}

        <div className={FILTROS}>
          {['todos', 'en_cuarentena', 'disponible', 'en_proceso', 'adoptado'].map((st) => (
            <button
              key={st}
              className={fndChip(filtroEstado === st)}
              onClick={() => setFiltroEstado(st)}
            >
              {st === 'todos' ? 'Todas las mascotas' : BADGE_MASCOTA[st].txt}
            </button>
          ))}
        </div>

        <div className={TABLA_WRAP}>
          <table className={TABLA}>
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
                  <td colSpan="6" className={CELDA_VACIA}>
                    No se encontraron mascotas.
                  </td>
                </tr>
              ) : (
                filtradas.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <div className={MASCOTA_CELDA}>
                        {m.fotoUrl ? (
                          <img src={m.fotoUrl} alt={m.nombre} className={MASCOTA_MINI} />
                        ) : (
                          <div className={MASCOTA_MINI_VACIA}>
                            <FaPaw />
                          </div>
                        )}
                        <div>
                          <strong className={MASCOTA_NOMBRE}>{m.nombre}</strong>
                          <small className={MASCOTA_SUB}>{m.especie}</small>
                        </div>
                      </div>
                    </td>
                    <td>{m.raza}</td>
                    <td>{m.edadEstimada}</td>
                    <td>{m.fundacion}</td>
                    <td>
                      <span className={`${BADGE} ${distintivo(BADGE_MASCOTA, m.estadoAdopcion).cls}`}>
                        {distintivo(BADGE_MASCOTA, m.estadoAdopcion).txt}
                      </span>
                    </td>
                    <td>
                      <div className={ACCIONES}>
                        <button className={ACCION_BTN} title="Ver detalles" onClick={() => setDetalle(m)}>
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
        <div className={MODAL_FONDO} onClick={() => setDetalle(null)}>
          <div className={MODAL} onClick={(e) => e.stopPropagation()}>
            <div className={MODAL_CABECERA}>
              <div className={MODAL_CABECERA_IZQ}>
                <span className="admin-modal__icon-badge"><FaPaw /></span>
                <div>
                  <h2 className={MODAL_TITULO}>{detalle.nombre}</h2>
                  <span className="admin-modal__subtitle">Expediente #{detalle.id} — {detalle.fundacion}</span>
                </div>
              </div>
              <button className={MODAL_CERRAR} onClick={() => setDetalle(null)}><FiX /></button>
            </div>

            <div className={MODAL_CUERPO}>
              {detalle.fotoUrl && (
                <div className={MASCOTA_FOTO}>
                  <img src={detalle.fotoUrl} alt={detalle.nombre} />
                </div>
              )}

              <div className={MODAL_GRID}>
                <div className={DETALLE_ITEM}>
                  <span className={DETALLE_LABEL}>Especie / Raza</span>
                  <span className={DETALLE_VALOR}>{detalle.especie} · {detalle.raza}</span>
                </div>
                <div className={DETALLE_ITEM}>
                  <span className={DETALLE_LABEL}>Edad estimada</span>
                  <span className={DETALLE_VALOR}>{detalle.edadEstimada}</span>
                </div>
                <div className={DETALLE_ITEM}>
                  <span className={DETALLE_LABEL}>Tamaño / Sexo</span>
                  <span className={DETALLE_VALOR}>{detalle.tamano} · {detalle.sexo}</span>
                </div>
                <div className={DETALLE_ITEM}>
                  <span className={DETALLE_LABEL}>Estado actual</span>
                  <span className={DETALLE_VALOR}>
                    <span className={`${BADGE} ${distintivo(BADGE_MASCOTA, detalle.estadoAdopcion).cls}`}>
                      {distintivo(BADGE_MASCOTA, detalle.estadoAdopcion).txt}
                    </span>
                  </span>
                </div>
                <div className={DETALLE_ITEM}>
                  <span className={DETALLE_LABEL}>Salud</span>
                  <span className={DETALLE_VALOR}>
                    {detalle.estadoSalud || 'Sin novedades médicas'}
                    <span className={DETALLE_NOTA}>
                      Vacunado: {detalle.vacunado ? <><FiCheck /> Sí</> : <><FiX /> No</>} · Esterilizado: {detalle.esterilizado ? <><FiCheck /> Sí</> : <><FiX /> No</>} · Desparasitado: {detalle.desparasitado ? <><FiCheck /> Sí</> : <><FiX /> No</>}
                    </span>
                  </span>
                </div>
                <div className={DETALLE_ITEM}>
                  <span className={DETALLE_LABEL}>Fecha de ingreso</span>
                  <span className={DETALLE_VALOR}>{new Date(detalle.fechaIngreso).toLocaleDateString('es-CO')}</span>
                </div>
              </div>

              {detalle.descripcion && (
                <div className="admin-detail-block mt-3.5" >
                  <span className={DETALLE_LABEL}>Historia</span>
                  <p className="admin-detail-text">{detalle.descripcion}</p>
                </div>
              )}
            </div>

            <div className={MODAL_PIE}>
              <button className={BTN_SECUNDARIO} onClick={() => setDetalle(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminMascotas
