import React from 'react'
import '../Style/Seccion1.css'
const pets = [
  {
    id: 1,
    name: "Luna",
    type: "Hembra",
    breed: "Labrador ",
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
    breed: "Beagle ",
    age: "8 meses",
    location: "Bogotá",
    tag: "Cachorro",
    tagColor: "blue",
    img: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400&q=80",
  },
];
const Seccion1 = () => {
  return (
    <div>
       <section className="sec1" id="adopta">
      <div className="sec1__header">
        <div>
          <span className="sec1__eyebrow">En busca de hogar</span>
          <h2 className="sec1__title">Mascotas en adopción</h2>
          <p className="sec1__subtitle">
            Estos peludos esperan por econtrar una familia que los ame. ¿Podrías ser tú?
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
