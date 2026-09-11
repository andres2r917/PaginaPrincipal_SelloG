import React from 'react'
import '../Style/Seccion1.css'
const pets = [
  {
    id: 1,
    name: "Luna",
    type: "Hembra",
    breed: "Labrador",
    age: "2 años",
    location: "Bogotá",
    tag: "Urgente",
    tagColor: "red",
    img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80",
  },
  {
    id: 2,
    name: "Milan",
    type: "Macho",
    breed: "Golden",
    age: "1 año",
    location: "Medellín",
    tag: "Nuevo",
    tagColor: "green",
    img: "https://tse2.mm.bing.net/th/id/OIP.-XYeFswvtJZihDG8W1glgQHaEo?pid=Api&P=0&h=180",
  },
  {
    id: 3,
    name: "Thor",
    type: "Macho",
    breed: "Doberman",
    age: "3 años",
    location: "Cali",
    tag: "Destacado",
    tagColor: "yellow",
    img: "https://tse1.mm.bing.net/th/id/OIP.BeO1Xyw4weSOHsgzyuO36QHaE8?pid=Api&P=0&h=180",
  },
  {
    id: 4,
    name: "Coco",
    type: "Macho",
    breed: "Beagle",
    age: "8 meses",
    location: "Bogotá",
    tag: "Cachorro",
    tagColor: "blue",
    img: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400&q=80",
  },
];
 
const reportes = [
  {
    id: 1,
    titulo: "Canino en abandono",
    descripcion: "Se reporta perro de raza mediana atado sin agua ni alimento en terraza de...",
    tiempo: "Hace 2 horas",
    ubicacion: "Calle 45 #23-10, Bogotá DC",
    reportadoPor: null,
    estado: "Urgente",
    estadoColor: "red",
    tipo: "Maltrato animal",
    img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80",
  },
  {
    id: 2,
    titulo: "Camada de gatos",
    descripcion: "Encontrada caja con 4 gatitos recién nacidos cerca al parque principal....",
    tiempo: "Hace 5 horas",
    ubicacion: "Carrera 7 con Calle 12, Chía",
    reportadoPor: "Carlos Ruiz",
    estado: "En proceso",
    estadoColor: "blue",
    tipo: "Abandono",
    img: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=600&q=80",
  },
  {
    id: 3,
    titulo: "Golden desorientado",
    descripcion: "Se busca dueño de Golden Retriever con collar azul encontrado deambulando p...",
    tiempo: "Ayer",
    ubicacion: "Av. Industrial #4-88, Medellín",
    reportadoPor: null,
    estado: "Atendido",
    estadoColor: "green",
    tipo: "Perro extraviado",
    img: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=600&q=80",
  },
];
 
const iconoEstado = {
  red:   "⚠",
  blue:  "⏳",
  green: "✔",
};
 
const Seccion1 = () => {
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
          <a href="#" className="sec2__ver-todos">Ver todos los reportes →</a>
        </div>
 
        <div className="sec2__grid">
          {reportes.map((r) => (
            <div className="sec2__card" key={r.id}>
              <div className="sec2__card-img-wrap">
                <img src={r.img} alt={r.titulo} className="sec2__card-img" />
                <div className="sec2__card-badges">
                  <span className={`sec2__tag sec2__tag--${r.estadoColor}`}>
                    {iconoEstado[r.estadoColor]} {r.estado.toUpperCase()}
                  </span>
                  <span className="sec2__tag sec2__tag--tipo">{r.tipo}</span>
                </div>
              </div>
 
              <div className="sec2__card-body">
                <div className="sec2__card-top">
                  <h3 className="sec2__reporte-titulo">{r.titulo}</h3>
                  <span className="sec2__tiempo">{r.tiempo}</span>
                </div>
                <p className="sec2__descripcion">{r.descripcion}</p>
                <div className="sec2__meta">
                  <span className="sec2__meta-item">📍 {r.ubicacion}</span>
                  <span className="sec2__meta-item">
                    👤 {r.reportadoPor
                      ? `Reportado por: ${r.reportadoPor}`
                      : <em>Reporte Anónimo</em>}
                  </span>
                </div>
                <button className="sec2__btn">Ver detalles 👁</button>
              </div>
            </div>
          ))}
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
                <button className="sec1__btn">Quiero adoptarlo</button>
              </div>
            </div>
          ))}
        </div>
      </section>
 
    </div>
  )
}
 
export default Seccion1