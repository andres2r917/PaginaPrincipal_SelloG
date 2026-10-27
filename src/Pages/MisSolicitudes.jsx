import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaPaw } from 'react-icons/fa'
import { getMisSolicitudes } from '../Services/mascotasService.js'
import '../Style/MisSolicitudes.css'

const FONDO = 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=1920&q=70'

const ETIQUETAS = {
  pendiente: 'Pendiente',
  en_evaluacion: 'En evaluación',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
  adoptada: 'Adopción completada',
}

const MENSAJES = {
  pendiente: 'La fundación aún no ha revisado tu solicitud.',
  en_evaluacion: 'La fundación está evaluando tu solicitud.',
  aprobada: 'La fundación se pondrá en contacto contigo para coordinar la entrega.',
  rechazada: 'Esta vez la fundación no pudo aprobar tu solicitud.',
  adoptada: '¡La adopción se completó! Gracias por darle un hogar.',
}

const MisSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getMisSolicitudes()
      .then(setSolicitudes)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false))
  }, [])

  return (
    <div className="ms-page">
      <div className="ms-fondo" style={{ backgroundImage: `url(${FONDO})` }} />
      <div className="ms-contenido">
        <h1 className="ms-titulo">Mis solicitudes</h1>
        <p className="ms-sub">Aquí ves en qué va cada solicitud de adopción que enviaste.</p>

        {cargando && <p className="ms-cargando">Cargando…</p>}
        {error && <p className="ms-error" role="alert">{error}</p>}

        {!cargando && !error && solicitudes.length === 0 && (
          <p className="ms-vacio">
            Aún no has enviado solicitudes. <Link to="/adopcion">Conoce a los peluditos en adopción</Link>
          </p>
        )}

        <div className="ms-lista">
          {solicitudes.map((s) => {
            // Si la fundación ya entregó la mascota, la solicitud aprobada queda como completada
            const estado = s.estado === 'aprobada' && s.mascotaAdoptada ? 'adoptada' : s.estado
            return (
              <div key={s.id} className="ms-card">
                {s.mascotaFoto
                  ? <img className="ms-foto" src={s.mascotaFoto} alt={s.mascota} />
                  : <div className="ms-foto"><FaPaw /></div>}
                <div className="ms-info">
                  <div className="ms-cabecera">
                    <div>
                      <p className="ms-mascota">{s.mascota}</p>
                      <p className="ms-meta">
                        {s.fundacion} · Enviada el {new Date(s.enviada).toLocaleDateString('es-CO')}
                      </p>
                    </div>
                    <span className={`ms-estado ms-estado--${estado}`}>{ETIQUETAS[estado]}</span>
                  </div>
                  <p className="ms-mensaje">{MENSAJES[estado]}</p>
                  {s.comentarios && <p className="ms-comentario">{s.fundacion}: {s.comentarios}</p>}
                  {estado === 'aprobada' && s.telefonoFundacion && (
                    <p className="ms-meta" style={{ marginTop: 8 }}>Contacto de la fundación: {s.telefonoFundacion}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MisSolicitudes
