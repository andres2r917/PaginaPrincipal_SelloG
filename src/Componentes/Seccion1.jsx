import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../Style/Seccion1.css'
import DenunciaCard from './Denuncias/DenunciaCard/DenunciaCard.jsx'
import { useDenuncias } from '../Context/DenunciasContext.jsx'
import { getMascotasDisponibles } from '../Services/mascotasService.js'

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
      <section className="sec2" id="reportes">
        <div className="sec2__header">
          <div>
            <span className="sec2__eyebrow">Vigilancia comunitaria</span>
            <h2 className="sec2__title">Reportes Recientes</h2>
            <p className="sec2__subtitle">
              Monitoreo en tiempo real de incidentes reportados por nuestra comunidad.
              Cada reporte es una oportunidad para proteger a los más vulnerables.
            </p>
          </div>
          <Link to="/denuncia" className="sec2__ver-todos">Ver todos los reportes →</Link>
        </div>

        <div className="home-reportes-lista">
          {reportes.length === 0 ? (
            <p className="home-reportes-vacio">Por ahora no hay reportes activos.</p>
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
      <section className="sec1" id="adopta">
        <div className="sec1__header">
          <div>
            <span className="sec1__eyebrow">En busca de hogar</span>
            <h2 className="sec1__title">Mascotas en adopción</h2>
            <p className="sec1__subtitle">
              Estos peludos esperan por encontrar una familia que los ame. ¿Podrías ser tú?
            </p>
          </div>
        </div>

        <div className="sec1__grid">
          {mascotas.map((pet, i) => (
            <div className="sec1__card" key={pet.id}>
              <div className="sec1__card-img-wrap">
                {pet.img && <img src={pet.img} alt={pet.nombre} className="sec1__card-img" />}
                {i === 0 && <span className="sec1__tag sec1__tag--green">Nuevo</span>}
              </div>
              <div className="sec1__card-body">
                <div className="sec1__card-top">
                  <h3 className="sec1__pet-name">{pet.nombre}</h3>
                  <span className="sec1__pet-type">{pet.sexo}</span>
                </div>
                <p className="sec1__pet-breed">{pet.raza}</p>
                <div className="sec1__card-meta">
                  <span>{pet.edad}</span>
                  <span>{pet.tamano}</span>
                </div>
                <button
                  type="button"
                  className="sec1__btn"
                  onClick={() => navigate(`/adopcion?buscar=${encodeURIComponent(pet.nombre)}`)}
                >
                  Quiero adoptarlo
                </button>
              </div>
            </div>
          ))}
          {mascotas.length === 0 && (
            <p className="sec1__subtitle">Por ahora no hay mascotas disponibles. <Link to="/adopcion">Ver adopción</Link></p>
          )}
        </div>
      </section>

    </div>
  )
}

export default Seccion1