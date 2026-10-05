import { useState } from 'react'
import { FiX } from 'react-icons/fi'
import { useFundacion } from '../Context/FundacionContext.jsx'
import { calcularPuntuacion } from '../Utils/puntuacion.js'

const etiquetaEstado = {
  pendiente: { cls: 'admin-badge--pendiente', txt: 'Pendiente' },
  en_evaluacion: { cls: 'admin-badge--neutro', txt: 'En evaluación' },
  aprobada: { cls: 'admin-badge--exito', txt: 'Aprobada' },
  rechazada: { cls: 'admin-badge--critico', txt: 'Rechazada' },
}

const claseScore = (p) => p >= 85 ? 'fnd-score--alta' : p >= 60 ? 'fnd-score--media' : 'fnd-score--baja'

const FundacionAdopciones = () => {
  const { solicitudes, mascotas, resolverSolicitud } = useFundacion()
  const [filtro, setFiltro] = useState('todos')
  const [seleccionada, setSeleccionada] = useState(null)
  const [comentario, setComentario] = useState('')
  const [errorComentario, setErrorComentario] = useState('')

  const filtradas = solicitudes.filter((s) => filtro === 'todos' || s.estado === filtro)

  const abrirDetalle = (s) => {
    setSeleccionada(s)
    setComentario(s.comentariosFundacion || '')
    setErrorComentario('')
  }

  const resolver = (estado) => {
    if (estado === 'rechazada' && !comentario.trim()) {
      setErrorComentario('Escribe un comentario antes de rechazar.')
      return
    }
    resolverSolicitud(seleccionada.id, estado, comentario)
    setSeleccionada(null)
  }

  return (
    <div>
      <h1 className="admin-title">Adopciones</h1>

      {/* Filtro por estado */}
      <div className="fnd-filtros" style={{ marginBottom: 16 }}>
        {['todos', 'pendiente', 'en_evaluacion', 'aprobada', 'rechazada'].map((e) => (
          <button key={e} className={`fnd-chip${filtro === e ? ' fnd-chip--activo' : ''}`} onClick={() => setFiltro(e)}>
            {e === 'todos' ? 'Todos' : etiquetaEstado[e]?.txt || e}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="fnd-tabla-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Adoptante</th>
              <th>Mascota</th>
              <th>Fecha</th>
              <th>Puntuación</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map((s) => {
              const punt = calcularPuntuacion(s)
              const mascota = mascotas.find((m) => m.id === s.mascotaId)
              const badge = etiquetaEstado[s.estado] || { cls: 'admin-badge--neutro', txt: s.estado }
              return (
                <tr key={s.id} style={{ cursor: 'pointer' }} onClick={() => abrirDetalle(s)}>
                  <td>{s.adoptante?.nombre}</td>
                  <td>{mascota?.nombre || '—'}</td>
                  <td>{new Date(s.fecha).toLocaleDateString('es-CO')}</td>
                  <td><span className={`fnd-score ${claseScore(punt)}`}>{punt}%</span></td>
                  <td><span className={`admin-badge ${badge.cls}`}>{badge.txt}</span></td>
                  <td>
                    <div className="admin-actions">
                      {['pendiente', 'en_evaluacion'].includes(s.estado) && (
                        <>
                          <button className="fnd-btn-aprobar" onClick={(e) => { e.stopPropagation(); resolverSolicitud(s.id, 'aprobada') }}>Aprobar</button>
                          <button className="fnd-btn-revisar" onClick={(e) => { e.stopPropagation(); resolverSolicitud(s.id, 'en_evaluacion') }}>Evaluar</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtradas.length === 0 && (
          <p style={{ textAlign: 'center', padding: 24, color: 'rgba(241,245,249,0.4)' }}>Sin solicitudes.</p>
        )}
      </div>

      {/* Modal de detalle */}
      {seleccionada && (
        <div className="fnd-modal__fondo" onClick={() => setSeleccionada(null)}>
          <div className="fnd-modal" onClick={(e) => e.stopPropagation()}>
            <button className="fnd-modal__cerrar" onClick={() => setSeleccionada(null)}><FiX /></button>
            <h2 className="fnd-modal__titulo">Solicitud #{seleccionada.id}</h2>

            {[['Adoptante', seleccionada.adoptante?.nombre],['Vivienda', seleccionada.adoptante?.tipoVivienda],['Mensaje', seleccionada.mensaje],['Experiencia', seleccionada.experiencia || '—'],['Tiempo disponible', seleccionada.tiempoDisponible],['Compromiso veterinario', seleccionada.compromisoVeterinario ? 'Sí' : 'No']].map(([k, v]) => (
              <div key={k} style={{ marginBottom: 10 }}>
                <p style={{ fontSize: 11, color: 'rgba(241,245,249,0.5)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{k}</p>
                <p style={{ color: '#f8fafc', fontSize: 13 }}>{v}</p>
              </div>
            ))}

            <div className="fnd-modal__campo">
              <label className="fnd-modal__label">Comentarios de la fundación</label>
              <textarea
                className="fnd-modal__input"
                rows="3"
                value={comentario}
                onChange={(e) => { setComentario(e.target.value); setErrorComentario('') }}
                style={{ resize: 'vertical' }}
              />
              {errorComentario && <p style={{ color: '#E11D48', fontSize: 12, marginTop: 4 }}>{errorComentario}</p>}
            </div>

            <div className="fnd-modal__acciones">
              {['pendiente', 'en_evaluacion'].includes(seleccionada.estado) && (
                <>
                  <button className="fnd-btn-revisar fnd-modal__btn" onClick={() => resolver('en_evaluacion')}>En evaluación</button>
                  <button className="fnd-modal__btn fnd-modal__btn--secundario" onClick={() => resolver('rechazada')}>Rechazar</button>
                  <button className="fnd-btn-aprobar fnd-modal__btn" onClick={() => resolver('aprobada')}>Aprobar</button>
                </>
              )}
              {!['pendiente', 'en_evaluacion'].includes(seleccionada.estado) && (
                <button className="fnd-modal__btn fnd-modal__btn--secundario" onClick={() => setSeleccionada(null)}>Cerrar</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FundacionAdopciones
