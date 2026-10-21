import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../Style/Seccion1.css'
import DenunciaCard from './DenunciaCard/DenunciaCard.jsx'
import { getDenuncias } from '../Services/denunciasService.js'

// Mascotas en adopción. Ciudades actualizadas a municipios del Cauca.
const pets = [
  {
    id: 'm-001',
    name: "Luna",
    type: "Hembra",
    breed: "Labrador",
    age: "2 años",
    location: "Popayán",
    tag: "Urgente",
    tagColor: "red",
    img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80",
  },
  {
    id: 'm-002',
    name: "Milan",
    type: "Macho",
    breed: "Golden",
    age: "1 año",
    location: "Timbío",
    tag: "Nuevo",
    tagColor: "green",
    img: "https://tse2.mm.bing.net/th/id/OIP.-XYeFswvtJZihDG8W1glgQHaEo?pid=Api&P=0&h=180",
  },
  {
    id: 'm-003',
    name: "Thor",
    type: "Macho",
    breed: "Doberman",
    age: "3 años",
    location: "Cajibío",
    tag: "Destacado",
    tagColor: "yellow",
    img: "https://tse1.mm.bing.net/th/id/OIP.BeO1Xyw4weSOHsgzyuO36QHaE8?pid=Api&P=0&h=180",
  },
  {
    id: 'm-004',
    name: "Coco",
    type: "Macho",
    breed: "Beagle",
    age: "8 meses",
    location: "Piendamó",
    tag: "Cachorro",
    tagColor: "blue",
    img: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400&q=80",
  },
];

const Seccion1 = () => {
  const navigate = useNavigate()
  const [reportes, setReportes] = useState([])

  useEffect(() => {
    let activo = true
    getDenuncias().then((lista) => {
      if (!activo) return
      // Los 3 casos activos más recientes
      const recientes = lista
        .filter((d) => d.estado !== 'resuelta')
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 3)
      setReportes(recientes)
    })
    return () => { activo = false }
  }, [])

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
          {pets.map((pet) => (
            <div className="sec1__card" key={pet.id}>
              <div className="sec1__card-img-wrap">
                <img src={pet.img} alt={pet.name} className="sec1__card-img" />
                <span className={`sec1__tag sec1__tag--${pet.tagColor}`}>{pet.tag}</span>
              </div>
              <div className="sec1__card-body">
                <div className="sec1__card-top">
                  <h3 className="sec1__pet-name">{pet.name}</h3>
                  <span className="sec1__pet-type">{pet.type}</span>
                </div>
                <p className="sec1__pet-breed">{pet.breed}</p>
                <div className="sec1__card-meta">
                  <span>{pet.age}</span>
                  <span>{pet.location}</span>
                </div>
                <button
                  type="button"
                  className="sec1__btn"
                  onClick={() => navigate(`/adopcion?mascota=${pet.id}`)}
                >
                  Quiero adoptarlo
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}

export default Seccion1