import { useState } from 'react'
import { FiX } from 'react-icons/fi'
import { useFundacion } from '../../Context/FundacionContext.jsx'
import { calcularPuntuacion, claseScore } from '../../Utils/puntuacion.js'
import { BADGE_SOLICITUD, distintivo } from '../../Utils/estados.js'
import { ACCIONES, BADGE, TABLA } from '../../Utils/adminEstilos'
import { TITULO } from '../../Utils/panelEstilos'
import { FND_AVISO, FND_BTN_APROBAR, FND_BTN_REVISAR, FND_FILTROS, FND_MODAL, FND_MODAL_ACCIONES, FND_MODAL_BTN_APROBAR, FND_MODAL_BTN_REVISAR, FND_MODAL_BTN_SECUNDARIO, FND_MODAL_CAMPO, FND_MODAL_CERRAR, FND_MODAL_FONDO, FND_MODAL_INPUT, FND_MODAL_LABEL, FND_MODAL_TITULO, FND_SCORE, FND_TABLA_WRAP, fndChip } from '../../Utils/fundacionEstilos'

const FundacionAdopciones = () => {
  const { solicitudes, mascotas, resolverSolicitud, actualizarMascota } = useFundacion()
  const [filtro, setFiltro] = useState('todos')
  const [seleccionada, setSeleccionada] = useState(null)
  const [comentario, setComentario] = useState('')
  const [errorComentario, setErrorComentario] = useState('')
  const [aviso, setAviso] = useState('')
  const [guardando, setGuardando] = useState(false)

  const filtradas = solicitudes.filter((s) => filtro === 'todos' || s.estado === filtro)

  const abrirDetalle = (s) => {
    setSeleccionada(s)
    setComentario(s.comentariosFundacion || '')
    setErrorComentario('')
  }

  // Envía la decisión a la API; el modal se cierra solo si se guardó
  const decidir = async (id, estado, comentarios = '') => {
    if (guardando) return false
    setGuardando(true)
    setAviso('')
    const resultado = await resolverSolicitud(id, estado, comentarios)
    setGuardando(false)
    if (!resultado.ok) setAviso(resultado.mensaje)
    return resultado.ok
  }

  const resolver = async (estado) => {
    if (estado === 'rechazada' && !comentario.trim()) {
      setErrorComentario('Escribe un comentario antes de rechazar.')
      return
    }
    if (await decidir(seleccionada.id, estado, comentario)) setSeleccionada(null)
  }

  // La mascota fue entregada: sale del pipeline y cuenta como adopción concretada
  const cerrarAdopcion = async () => {
    if (guardando) return
    setGuardando(true)
    setAviso('')
    const resultado = await actualizarMascota(seleccionada.mascotaId, { estadoAdopcion: 'adoptado' })
    setGuardando(false)
    if (resultado.ok) setSeleccionada(null)
    else setAviso(resultado.mensaje)
  }

  return (
    <div>
      <h1 className={TITULO}>Adopciones</h1>
      {aviso && <p className={FND_AVISO} role="alert">{aviso}</p>}

      {/* Filtro por estado */}
      <div className={FND_FILTROS} style={{ marginBottom: 16 }}>
        {['todos', 'pendiente', 'en_evaluacion', 'aprobada', 'rechazada'].map((e) => (
          <button key={e} className={fndChip(filtro === e)} onClick={() => setFiltro(e)}>
            {e === 'todos' ? 'Todos' : distintivo(BADGE_SOLICITUD, e).txt}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className={FND_TABLA_WRAP}>
        <table className={TABLA}>
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
              const badge = distintivo(BADGE_SOLICITUD, s.estado)
              return (
                <tr key={s.id} style={{ cursor: 'pointer' }} onClick={() => abrirDetalle(s)}>
                  <td>{s.adoptante?.nombre}</td>
                  <td>{mascota?.nombre || '—'}</td>
                  <td>{new Date(s.fecha).toLocaleDateString('es-CO')}</td>
                  <td><span className={`${FND_SCORE} ${claseScore(punt)}`}>{punt}%</span></td>
                  <td><span className={`${BADGE} ${badge.cls}`}>{badge.txt}</span></td>
                  <td>
                    <div className={ACCIONES}>
                      {['pendiente', 'en_evaluacion'].includes(s.estado) && (
                        <>
                          <button className={FND_BTN_APROBAR} onClick={(e) => { e.stopPropagation(); decidir(s.id, 'aprobada', s.comentariosFundacion) }}>Aprobar</button>
                          <button className={FND_BTN_REVISAR} onClick={(e) => { e.stopPropagation(); decidir(s.id, 'en_evaluacion', s.comentariosFundacion) }}>Evaluar</button>
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
        <div className={FND_MODAL_FONDO} onClick={() => setSeleccionada(null)}>
          <div className={FND_MODAL} onClick={(e) => e.stopPropagation()}>
            <button className={FND_MODAL_CERRAR} onClick={() => setSeleccionada(null)}><FiX /></button>
            <h2 className={FND_MODAL_TITULO}>Solicitud #{seleccionada.id}</h2>

            {[['Adoptante', seleccionada.adoptante?.nombre],['Correo', seleccionada.adoptante?.correo || '—'],['Teléfono', seleccionada.adoptante?.telefono || '—'],['Vivienda', seleccionada.adoptante?.tipoVivienda || '—'],['¿Tiene hijos?', seleccionada.adoptante?.hijos === 'si' ? 'Sí' : seleccionada.adoptante?.hijos === 'no' ? 'No' : '—'],['Mensaje', seleccionada.mensaje],['Experiencia', seleccionada.experiencia || '—'],['Tiempo disponible', seleccionada.tiempoDisponible],['Compromiso veterinario', seleccionada.compromisoVeterinario ? 'Sí' : 'No']].map(([k, v]) => (
              <div key={k} style={{ marginBottom: 10 }}>
                <p style={{ fontSize: 11, color: 'rgba(241,245,249,0.5)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{k}</p>
                <p style={{ color: '#f8fafc', fontSize: 13 }}>{v}</p>
              </div>
            ))}

            <div className={FND_MODAL_CAMPO}>
              <label className={FND_MODAL_LABEL} htmlFor="fadop-comentarios-de-la-fundac">Comentarios de la fundación</label>
              <textarea id="fadop-comentarios-de-la-fundac"
 className={`${FND_MODAL_INPUT} resize-y`}
 rows="3"
 value={comentario}
 onChange={(e) => { setComentario(e.target.value); setErrorComentario('') }}
 
 />
              {errorComentario && <p style={{ color: '#E11D48', fontSize: 12, marginTop: 4 }}>{errorComentario}</p>}
            </div>

            <div className={FND_MODAL_ACCIONES}>
              {['pendiente', 'en_evaluacion'].includes(seleccionada.estado) && (
                <>
                  <button className={FND_MODAL_BTN_REVISAR} disabled={guardando} onClick={() => resolver('en_evaluacion')}>En evaluación</button>
                  <button className={FND_MODAL_BTN_SECUNDARIO} disabled={guardando} onClick={() => resolver('rechazada')}>Rechazar</button>
                  <button className={FND_MODAL_BTN_APROBAR} disabled={guardando} onClick={() => resolver('aprobada')}>Aprobar</button>
                </>
              )}
              {seleccionada.estado === 'aprobada' && mascotas.find((m) => m.id === seleccionada.mascotaId)?.estadoAdopcion === 'en_proceso' && (
                <button className={FND_MODAL_BTN_APROBAR} disabled={guardando} onClick={cerrarAdopcion}>Marcar como adoptada</button>
              )}
              {!['pendiente', 'en_evaluacion'].includes(seleccionada.estado) && (
                <button className={FND_MODAL_BTN_SECUNDARIO} onClick={() => setSeleccionada(null)}>Cerrar</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FundacionAdopciones
