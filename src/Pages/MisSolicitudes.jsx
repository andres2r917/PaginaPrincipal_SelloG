import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaPaw } from 'react-icons/fa'
import { getMisSolicitudes } from '../Services/mascotasService.js'

const FONDO = 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=1920&q=70'

const ETIQUETAS = {
  pendiente: 'Pendiente',
  en_evaluacion: 'En evaluación',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
  adoptada: 'Adopción completada',
}

// Estilos con Tailwind. Los colores salen de las variables de Style/variables.css
const META = 'text-[13px] text-(color:--color-texto-gris)'
const ESTADO_CLASES = {
  pendiente: 'bg-[rgba(245,158,11,0.18)] text-[#FBBF24]',
  en_evaluacion: 'bg-[rgba(124,58,237,0.2)] text-(color:--color-acento)',
  aprobada: 'bg-[rgba(16,185,129,0.2)] text-[#34D399]',
  rechazada: 'bg-[rgba(225,29,72,0.2)] text-[#FB7185]',
  adoptada: 'bg-[rgba(16,185,129,0.3)] text-(color:--color-exito-claro)',
}
const FOTO =
  'flex h-24 w-24 shrink-0 grow-0 basis-24 items-center justify-center rounded-xl object-cover ' +
  'bg-[rgba(124,58,237,0.15)] text-[32px] text-(color:--color-acento) ' +
  'max-[520px]:h-40 max-[520px]:w-full max-[520px]:basis-auto'

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
    <div className="relative min-h-screen bg-[#0B0F19] px-4 pt-[110px] pb-[60px]">
      <div className="fixed inset-0 z-0 bg-cover bg-center brightness-[0.3]" style={{ backgroundImage: `url(${FONDO})` }} />
      <div className="relative z-[1] mx-auto max-w-[820px] text-(color:--color-texto)">
        <h1 className="mb-1.5 text-[28px] font-extrabold">Mis solicitudes</h1>
        <p className={`mb-6 ${META.replace('text-[13px]','text-[14px]')}`}>Aquí ves en qué va cada solicitud de adopción que enviaste.</p>

        {cargando && <p className="px-4 py-10 text-center text-(color:--color-texto-gris)">Cargando…</p>}
        {error && <p className="p-4 text-center text-[#FB7185]" role="alert">{error}</p>}

        {!cargando && !error && solicitudes.length === 0 && (
          <p className="px-4 py-10 text-center text-(color:--color-texto-gris)">
            Aún no has enviado solicitudes. <Link className="font-bold text-(color:--color-acento)" to="/adopcion">Conoce a los peluditos en adopción</Link>
          </p>
        )}

        <div className="flex flex-col gap-4">
          {solicitudes.map((s) => {
            // Si la fundación ya entregó la mascota, la solicitud aprobada queda como completada
            const estado = s.estado === 'aprobada' && s.mascotaAdoptada ? 'adoptada' : s.estado
            return (
              <div key={s.id} className="flex gap-4 rounded-[14px] border border-[rgba(124,58,237,0.28)] bg-[rgba(15,23,42,0.85)] p-4 max-[520px]:flex-col">
                {s.mascotaFoto
                  ? <img className={FOTO} src={s.mascotaFoto} alt={s.mascota} />
                  : <div className={FOTO}><FaPaw /></div>}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2.5">
                    <div>
                      <p className="text-[18px] font-bold">{s.mascota}</p>
                      <p className={`mt-0.5 ${META}`}>
                        {s.fundacion} · Enviada el {new Date(s.enviada).toLocaleDateString('es-CO')}
                      </p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[12px] font-bold whitespace-nowrap ${ESTADO_CLASES[estado]}`}>{ETIQUETAS[estado]}</span>
                  </div>
                  <p className="mt-2.5 text-[13px] leading-[1.5] text-[#E2E8F0]">{MENSAJES[estado]}</p>
                  {s.comentarios && <p className="mt-2.5 rounded-md border-l-[3px] border-(color:--color-primario) bg-[rgba(255,255,255,0.05)] px-3 py-2.5 text-[13px]">{s.fundacion}: {s.comentarios}</p>}
                  {estado === 'aprobada' && s.telefonoFundacion && (
                    <p className={`mt-2 ${META}`}>Contacto de la fundación: {s.telefonoFundacion}</p>
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
