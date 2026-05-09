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
    raza: "Huscky",
    edad: "1 año",
    tamano: "Grande",
    temperamento: "Inquieto",
    salud: "Vacunado",
    historia:
      "Bol es una cachorro lleno de energía. Necesita mucho ejercicio y estimulación. Perfecta para familias jóvenes con espacio.",
    img: "https://tse1.mm.bing.net/th/id/OIP.iu_Z6fcSBMddwDiuhtXnqwHaE7?rs=1&pid=ImgDetMain&o=7&rm=3",
  },

];

const FORM_INICIAL = {
  nombre: "",
  cc: "",
  profesion: "",
  edad: "",
  telefono: "",
  direccion: "",
  tipoCasa: "Apartamento",
  salario: "",
  hijos: "no",
  motivacion: "",
};


const AnimalCard = ({ animal, onVerDetalles }) => (
  <div className="glass-effect animal-card">
    <img src={animal.img} alt={animal.nombre} />
    <h3>{animal.nombre}</h3>
    <p>
      {animal.edad} - {animal.temperamento}
    </p>
    <button className="btn-ver-detalles" onClick={() => onVerDetalles(animal)}>
      Ver Detalles
    </button>
  </div>
);

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

const FormularioAdopcion = ({ animal, formData, onChange, onSubmit }) => (
  <div className="modal-derecha">
    <h3 className="form-titulo">Formulario de Adopción</h3>
    <p className="form-subtitulo">
      Completa los datos para adoptar a {animal.nombre}
    </p>

    <form onSubmit={onSubmit}>
      <div className="form-fila">
        <div className="form-grupo col-2">
          <label>Nombre Completo</label>
          <input
            name="nombre"
            type="text"
            placeholder="Tu nombre completo"
            value={formData.nombre}
            onChange={onChange}
            required
          />
        </div>
      </div>

      {/* CC y Profesión */}
      <div className="form-fila">
        <div className="form-grupo">
          <label>CC (Cédula de Ciudadanía)</label>
          <input
            name="cc"
            type="text"
            placeholder="Número de documento"
            value={formData.cc}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-grupo">
          <label>Profesión</label>
          <input
            name="profesion"
            type="text"
            placeholder="Tu ocupación"
            value={formData.profesion}
            onChange={onChange}
          />
        </div>
      </div>

      {/* Edad y Teléfono */}
      <div className="form-fila">
        <div className="form-grupo">
          <label>Edad</label>
          <input
            name="edad"
            type="number"
            placeholder="Años"
            value={formData.edad}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-grupo">
          <label>Teléfono</label>
          <input
            name="telefono"
            type="text"
            placeholder="+57 300 000 0000"
            value={formData.telefono}
            onChange={onChange}
          />
        </div>
      </div>

      {/* Dirección */}
      <div className="form-fila">
        <div className="form-grupo col-2">
          <label>Dirección</label>
          <input
            name="direccion"
            type="text"
            placeholder="Ejemplo: Calle 68 AN #13-79, Popayán"
            value={formData.direccion}
            onChange={onChange}
          />
        </div>
      </div>

      {/* Tipo de casa y Salario */}
      <div className="form-fila">
        <div className="form-grupo">
          <label>Tipo de casa</label>
          <select
            name="tipoCasa"
            value={formData.tipoCasa}
            onChange={onChange}
          >
            <option>Apartamento</option>
            <option>Casa con patio</option>
            <option>Casa sin patio</option>
            <option>Finca</option>
          </select>
        </div>
        <div className="form-grupo">
          <label>Salario aproximado</label>
          <input
            name="salario"
            type="text"
            placeholder="$ 0 COP"
            value={formData.salario}
            onChange={onChange}
          />
        </div>
      </div>

      {/* Hijos */}
      <div className="form-fila">
        <div className="form-grupo">
          <label>¿Tienes hijos?</label>
          <div className="radio-opciones">
            <span>
              <input
                type="radio"
                name="hijos"
                value="si"
                checked={formData.hijos === "si"}
                onChange={onChange}
              />{" "}
              Sí
            </span>
            <span>
              <input
                type="radio"
                name="hijos"
                value="no"
                checked={formData.hijos === "no"}
                onChange={onChange}
              />{" "}
              No
            </span>
          </div>
        </div>
      </div>

      <div className="form-grupo">
        <label>¿Por qué quieres adoptar?</label>
        <textarea
          name="motivacion"
          rows="3"
          placeholder="Cuéntanos tu motivación..."
          value={formData.motivacion}
          onChange={onChange}
        />
      </div>

      <button type="submit" className="btn-enviar">
        Enviar Solicitud de Adopción
      </button>
    </form>
  </div>
);

const MensajeExito = ({ onCerrar }) => (
  <div className="modal-exito">
    <div className="exito-icono">✓</div>
    <h3>¡Solicitud enviada!</h3>
    <p>
      Nos pondremos en contacto contigo pronto para continuar el proceso de
      adopción.
    </p>
    <button className="btn-ver-detalles" onClick={onCerrar}>
      Cerrar
    </button>
  </div>
);


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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
            <img className='portada' src={portada} alt="portada"/>
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

      {/* ── MODAL ── */}
      {animalSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div
            className="modal-adopcion"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={cerrarModal}>
              ✕
            </button>

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