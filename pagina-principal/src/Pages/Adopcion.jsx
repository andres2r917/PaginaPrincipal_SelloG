import { useState } from "react";
import { Link } from 'react-router-dom';
import '../Style/Adopcion.css';
import portada from '../assets/portada.jpeg'
const animales = [
  {
    id: 1,
    nombre: "Toby",
    raza: "Mestizo",
    edad: "2 años",
    tamano: "Mediano",
    temperamento: "Juguetón",
    salud: "Vacunado",
    historia:
      "Toby llegó al refugio hace 6 meses. Es muy activo y le encanta jugar con pelotas. Se lleva bien con niños y otros perros.",
    img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    nombre: "Luna",
    raza: "Criolla",
    edad: "1 año",
    tamano: "Pequeño",
    temperamento: "Cariñosa",
    salud: "Sin Vacunas",
    historia:
      "Luna es una perrita muy dulce que fue rescatada de la calle. Es cariñosa con todos y le encanta dormir en lugares cómodos.",
    img: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    nombre: "Max",
    raza: "Labrador",
    edad: "3 años",
    tamano: "Grande",
    temperamento: "Tranquilo",
    salud: "Vacunado",
    historia:
      "Max es un perro muy tranquilo y obediente. Ya tiene entrenamiento básico y se adapta bien a apartamentos o casas con patio.",
    img: "https://img.freepik.com/foto-gratis/retrato-lindo-labrador-sentado-cesped_23-2148345981.jpg",
  },
  {
    id: 4,
    nombre: "Nala",
    raza: "Criolla",
    edad: "4 años",
    tamano: "Mediano",
    temperamento: "Tímida",
    salud: "Vacunada",
    historia:
      "Nala tardó un poco en abrirse, pero una vez que confía en ti es la compañera más leal. Prefiere hogares tranquilos sin muchos niños pequeños.",
    img: "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400&h=300&fit=crop",
  },
  {
    id: 5,
    nombre: "Rocky",
    raza: "Mestizo",
    edad: "5 años",
    tamano: "Grande",
    temperamento: "Protector",
    salud: "Vacunado",
    historia:
      "Rocky es un perro maduro, leal y muy protector. Ideal para familias que buscan un compañero confiable y tranquilo.",
    img: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400&h=300&fit=crop",
  },
  {
    id: 6,
    nombre: "Sacha",
    raza: "Criolla",
    edad: "6 meses",
    tamano: "Pequeño",
    temperamento: "Inquieta",
    salud: "Sin Vacunas",
    historia:
      "Mia es una cachorra llena de energía. Necesita mucho ejercicio y estimulación. Perfecta para familias jóvenes con espacio.",
    img: "https://d21tucfpen3j82.cloudfront.net/wp-content/uploads/2024/03/27133737/Conozca-que-es-un-perro-criollo-y-sus-caracteristicas.jpg",
  },
  {
    id: 7,
    nombre: "Milan",
    raza: "Doberman",
    edad: "8 meses",
    tamano: "Grande",
    temperamento: "Obediente",
    salud: "Vacunado",
    historia:
      "Milan es un cachorro lleno de energía. Necesita mucho ejercicio y estimulación. Perfecta para familias jóvenes con espacio.",
    img: "https://cdn.pixabay.com/photo/2019/10/08/11/10/doberman-pinscher-4534710_1280.jpg",
  },
  {
    id: 8,
    nombre: "Balto",
    raza: "Husky",
    edad: "1 año",
    tamano: "Grande",
    temperamento: "Inquieto",
    salud: "Vacunado",
    historia:
      "Balto es un cachorro lleno de energía. Necesita mucho ejercicio y estimulación. Perfecta para familias jóvenes con espacio.",
    img: "https://tse1.mm.bing.net/th/id/OIP.iu_Z6fcSBMddwDiuhtXnqwHaE7?rs=1&pid=ImgDetMain&o=7&rm=3",
  },
];
 
const FORM_INICIAL = {
  mensaje_presentacion: "",
  experiencia_mascotas: "",
  tiempo_disponible: "",
  compromiso_veterinario: false,
  acepta_terminos: false,
};
 
/* ── Tarjeta de animal ── */
const AnimalCard = ({ animal, onVerDetalles }) => (
  <div className="glass-effect animal-card">
    <img src={animal.img} alt={animal.nombre} />
    <h3>{animal.nombre}</h3>
    <p>{animal.edad} - {animal.temperamento}</p>
    <button className="btn-ver-detalles" onClick={() => onVerDetalles(animal)}>
      Ver Detalles
    </button>
  </div>
);
 
/* ── Info del animal (columna izquierda) ── */
const AnimalInfo = ({ animal }) => (
  <div className="modal-izquierda">
    <img src={animal.img} alt={animal.nombre} />
    <h2>{animal.nombre}</h2>
    <div className="modal-badges">
      <span className="badge badge-green">{animal.raza}</span>
      <span className="badge badge-cyan">{animal.edad}</span>
      <span className="badge badge-violet">{animal.tamano}</span>
    </div>
    <div className="modal-info-row">
      <div className="modal-info-item">
        <label>Temperamento</label>
        <span>{animal.temperamento}</span>
      </div>
      <div className="modal-info-item">
        <label>Salud</label>
        <span>{animal.salud}</span>
      </div>
    </div>
    <div className="modal-historia">
      <h5>Historia</h5>
      <p>{animal.historia}</p>
    </div>
  </div>
);
 
/* ── Formulario de adopción ── */
const FormularioAdopcion = ({ animal, formData, onChange, onSubmit }) => (
  <div className="modal-derecha">
    <h3 className="form-titulo">Formulario de Adopción</h3>
    <p className="form-subtitulo">
      Completa los siguientes detalles para iniciar tu proceso de solicitud. Buscamos el hogar perfecto para {animal.nombre}.
    </p>
 
    <form onSubmit={onSubmit}>
 
      {/* Mensaje de presentación */}
      <div className="form-grupo">
        <label>¿Por qué quieres adoptar?</label>
        <textarea
          name="mensaje_presentacion"
          rows="3"
          placeholder="Cuéntanos tu motivación y por qué serías un buen hogar..."
          value={formData.mensaje_presentacion}
          onChange={onChange}
          required
        />
      </div>
 
      {/* Experiencia con mascotas */}
      <div className="form-grupo">
        <label>¿Has tenido mascotas antes?</label>
        <select
          name="experiencia_mascotas"
          value={formData.experiencia_mascotas}
          onChange={onChange}
          required
        >
          <option value="">Selecciona una opción</option>
          <option value="nunca">Nunca he tenido mascotas</option>
          <option value="perros">Sí, he tenido perros</option>
          <option value="gatos">Sí, he tenido gatos</option>
          <option value="varios">Sí, he tenido varios animales</option>
          <option value="actualmente">Actualmente tengo mascotas</option>
        </select>
      </div>
 
      {/* Tiempo disponible */}
      <div className="form-grupo">
        <label>¿Cuánto tiempo le dedicarías al día?</label>
        <select
          name="tiempo_disponible"
          value={formData.tiempo_disponible}
          onChange={onChange}
          required
        >
          <option value="">Selecciona una opción</option>
          <option value="menos2">Menos de 2 horas</option>
          <option value="2a4">Entre 2 y 4 horas</option>
          <option value="4a6">Entre 4 y 6 horas</option>
          <option value="mas6">Más de 6 horas</option>
          <option value="todo">Estoy en casa todo el día</option>
        </select>
      </div>
 
      {/* Checkboxes */}
      <div className="form-grupo">
        <label>Compromisos</label>
        <div className="checkbox-grupo">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="compromiso_veterinario"
              checked={formData.compromiso_veterinario}
              onChange={onChange}
            />
            <span>Me comprometo a llevar la mascota al veterinario regularmente</span>
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="acepta_terminos"
              checked={formData.acepta_terminos}
              onChange={onChange}
              required
            />
            <span>Acepto los términos y condiciones del proceso de adopción</span>
          </label>
        </div>
      </div>
 
      <button
        type="submit"
        className="btn-enviar"
        disabled={!formData.acepta_terminos}
      >
        Enviar Solicitud de Adopción
      </button>
    </form>
  </div>
);
 
/* ── Mensaje de éxito ── */
const MensajeExito = ({ onCerrar }) => (
  <div className="modal-exito">
    <div className="exito-icono">✓</div>
    <h3>¡Solicitud enviada!</h3>
    <p>
      Nos pondremos en contacto contigo pronto para continuar el proceso de adopción.
    </p>
    <button className="btn-ver-detalles" onClick={onCerrar}>
      Cerrar
    </button>
  </div>
);
 
/* ── Página principal ── */
const Adopcion = () => {
  const [animalSeleccionado, setAnimalSeleccionado] = useState(null);
  const [formData, setFormData] = useState(FORM_INICIAL);
  const [enviado, setEnviado] = useState(false);
 
  const abrirModal = (animal) => {
    setAnimalSeleccionado(animal);
    setFormData(FORM_INICIAL);
    setEnviado(false);
  };
 
  const cerrarModal = () => {
    setAnimalSeleccionado(null);
    setEnviado(false);
  };
 
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Solicitud enviada:", {
      animal: animalSeleccionado.nombre,
      ...formData,
    });
    setEnviado(true);
  };
 
  return (
    <>
      <section className="hero">
        <div>
          <img className="portada" src={portada} alt="portada" />
        </div>
        <div className="grid-adopcion">
          {animales.map((animal) => (
            <AnimalCard
              key={animal.id}
              animal={animal}
              onVerDetalles={abrirModal}
            />
          ))}
        </div>
      </section>
 
      {animalSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-adopcion" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={cerrarModal}>✕</button>
            <AnimalInfo animal={animalSeleccionado} />
            {!enviado ? (
              <FormularioAdopcion
                animal={animalSeleccionado}
                formData={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
              />
            ) : (
              <MensajeExito onCerrar={cerrarModal} />
            )}
          </div>
        </div>
      )}
    </>
  );
};
 
export default Adopcion;