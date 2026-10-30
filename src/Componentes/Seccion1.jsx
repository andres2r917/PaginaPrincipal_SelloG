import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DenunciaCard from './Denuncias/DenunciaCard/DenunciaCard.jsx'
import { useDenuncias } from '../Context/DenunciasContext.jsx'
import { getMascotasDisponibles } from '../Services/mascotasService.js'

// Estilos con Tailwind. Los colores de la marca salen de @theme (index.css)
const SECCION = 'bg-fondo px-5 py-12 md:px-10 md:py-20'
const ENCABEZADO = 'mb-10 flex flex-wrap justify-between gap-4'
const ETIQUETA = 'mb-[0.4rem] block text-[0.85rem] font-extrabold tracking-[0.06em] text-primario uppercase'
const TITULO = 'mb-[0.4rem] text-[clamp(1.8rem,3vw,2.5rem)] font-black text-white'
const SUBTITULO = 'text-[1rem] text-[rgba(255,255,255,0.72)]'

const Seccion1 = () => {
  const navigate = useNavigate()
  const { denuncias } = useDenuncias()
  const [mascotas, setMascotas] = useState([])

  // Las 4 mascotas disponibles más recientes
  useEffect(() => {
    getMascotasDisponibles()
      .then((lista) => setMascotas(lista.sort((a, b) => b.id - a.id).slice(0, 4)))
      .catch(() => setMascotas([]))
  }, [])

  // Los 3 casos activos más recientes
  const reportes = denuncias
    .filter((d) => ['pendiente', 'verificada', 'en_rescate'].includes(d.estado))
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 3)

  return (
    <div>

      {/* ── REPORTES RECIENTES ── */}
      <section className={SECCION} id="reportes">
        <div className={`${ENCABEZADO} flex-col items-start md:flex-row md:items-end`}>
          <div>
            <span className={ETIQUETA}>Vigilancia comunitaria</span>
            <h2 className={TITULO}>Reportes Recientes</h2>
            <p className={`max-w-[520px] leading-[1.6] ${SUBTITULO}`}>
              Monitoreo en tiempo real de incidentes reportados por nuestra comunidad.
              Cada reporte es una oportunidad para proteger a los más vulnerables.
            </p>
          </div>
          <Link to="/denuncia" className="self-end text-[0.95rem] font-extrabold whitespace-nowrap text-primario no-underline hover:text-acento hover:underline">Ver todos los reportes →</Link>
        </div>

        <div className="mt-6 flex w-full flex-col gap-5">
          {reportes.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[rgba(196,181,253,0.3)] p-8 text-center text-[#A9B4C8]">Por ahora no hay reportes activos.</p>
          ) : (
            reportes.map((d) => (
              <DenunciaCard
                key={d.id}
                denuncia={d}
                variante="resumen"
                onVerDetalles={(id) => navigate(`/denuncia?caso=${id}`)}
              />
            ))
          )}
        </div>
      </section>

      {/* ── ADOPCIONES ── */}
      <section className={SECCION} id="adopta">
        <div className={`${ENCABEZADO} items-end`}>
          <div>
            <span className={ETIQUETA}>En busca de hogar</span>
            <h2 className={TITULO}>Mascotas en adopción</h2>
            <p className={SUBTITULO}>
              Estos peludos esperan por encontrar una familia que los ame. ¿Podrías ser tú?
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-6 md:grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
          {mascotas.map((pet, i) => (
            <div className="group overflow-hidden rounded-[18px] border border-[rgba(124,58,237,0.25)] bg-[rgba(30,27,46,0.55)] shadow-[0_2px_16px_rgba(0,0,0,0.25)] transition-[translate,box-shadow] duration-[220ms] hover:-translate-y-1.5 hover:border-[rgba(196,181,253,0.5)] hover:shadow-[0_12px_36px_rgba(124,58,237,0.3)]" key={pet.id}>
              <div className="relative h-[210px] overflow-hidden">
                {pet.img && <img src={pet.img} alt={pet.nombre} className="h-full w-full object-cover transition-[scale] duration-[400ms] group-hover:scale-[1.06]" />}
                {i === 0 && <span className="absolute top-3 left-3 rounded-full border border-[rgba(16,185,129,0.5)] bg-[rgba(15,23,42,0.9)] px-[0.7rem] py-[0.22rem] text-[0.72rem] font-extrabold tracking-[0.05em] text-exito-claro uppercase">Nuevo</span>}
              </div>
              <div className="px-[1.2rem] pt-[1.1rem] pb-[1.3rem]">
                <div className="mb-[0.2rem] flex items-center justify-between">
                  <h3 className="text-[1.15rem] font-black text-white">{pet.nombre}</h3>
                  <span className="rounded-full bg-[rgba(255,255,255,0.08)] px-[0.6rem] py-[0.15rem] text-[0.78rem] font-bold text-[rgba(255,255,255,0.7)]">{pet.sexo}</span>
                </div>
                <p className="mb-3 text-[0.85rem] text-[rgba(255,255,255,0.6)]">{pet.raza}</p>
                <div className="mb-4 flex gap-4 text-[0.82rem] font-semibold text-[rgba(255,255,255,0.75)]">
                  <span>{pet.edad}</span>
                  <span>{pet.tamano}</span>
                </div>
                <button
                  type="button"
                  className="w-full cursor-pointer rounded-[10px] bg-primario p-[0.65rem] text-[0.9rem] font-extrabold text-white transition-[background-color,translate] duration-[180ms] hover:-translate-y-px hover:bg-acento hover:text-fondo"
                  onClick={() => navigate(`/adopcion?buscar=${encodeURIComponent(pet.nombre)}`)}
                >
                  Quiero adoptarlo
                </button>
              </div>
            </div>
          ))}
          {mascotas.length === 0 && (
            <p className={SUBTITULO}>Por ahora no hay mascotas disponibles. <Link to="/adopcion">Ver adopción</Link></p>
          )}
        </div>
      </section>

    </div>
  )
}

export default Seccion1