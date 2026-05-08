import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Style/Adopcion.css';
const animales = [
  {
    id: 1,
    nombre: "Toby",
    raza: "Criollo",
    edad: "2 años",
    tamano: "Mediano",
    temperamento: "Juguetón",
    salud: "Vacunado",
    historia: "Toby llegó a nosotros siendo un cachorro. Es muy juguetón y se lleva bien con niños y otros perros. Busca una familia activa que le dé el amor que merece.",
    img: "/Imagenes/Perro1.png"
  },
  {
    id: 2,
    nombre: "Luna",
    raza: "Mestiza",
    edad: "1 año",
    tamano: "Pequeño",
    temperamento: "Cariñosa",
    salud: "Sin Vacunas",
    historia: "Luna es una perrita muy dulce que fue rescatada de la calle. Es cariñosa con todos y le encanta dormir en lugares cómodos.",
    img: "/Imagenes/Perro1.png"
  },
  {
    id: 3,
    nombre: "Max",
    raza: "Labrador",
    edad: "3 años",
    tamano: "Grande",
    temperamento: "Tranquilo",
    salud: "Vacunado",
    historia: "Max es un perro muy tranquilo y obediente. Ya tiene entrenamiento básico y se adapta bien a apartamentos o casas con patio.",
    img: "/Imagenes/Perro1.png"
  },
  {
    id: 4,
    nombre: "Nala",
    raza: "Criolla",
    edad: "4 años",
    tamano: "Mediano",
    temperamento: "Tímida",
    salud: "Vacunada",
    historia: "Nala tardó un poco en abrirse, pero una vez que confía en ti es la compañera más leal. Prefiere hogares tranquilos sin muchos niños pequeños.",
    img: "/Imagenes/Perro1.png"
  },
  {
    id: 5,
    nombre: "Rocky",
    raza: "Mestizo",
    edad: "5 años",
    tamano: "Grande",
    temperamento: "Protector",
    salud: "Vacunado",
    historia: "Rocky es un perro maduro, leal y muy protector. Ideal para familias que buscan un compañero confiable y tranquilo.",
    img: "/Imagenes/Perro1.png"
  },
  {
    id: 6,
    nombre: "Mia",
    raza: "Criolla",
    edad: "6 meses",
    tamano: "Pequeño",
    temperamento: "Inquieta",
    salud: "Sin Vacunas",
    historia: "Mia es una cachorra llena de energía. Necesita mucho ejercicio y estimulación. Perfecta para familias jóvenes con espacio.",
    img: "/Imagenes/Perro1.png"
  }
];

const formInicial = {
  nombre: '',
  cc: '',
  profesion: '',
  edad: '',
  telefono: '',
  direccion: '',
  tipoCasa: 'Apartamento',
  salario: '',
  hijos: 'no',
  motivacion: ''
};

const Adopcion = () => {
  const [animalSeleccionado, setAnimalSeleccionado] = useState(null);
  const [formData, setFormData] = useState(formInicial);
  const [enviado, setEnviado] = useState(false);

  const abrirModal = (animal) => {
    setAnimalSeleccionado(animal);
    setFormData(formInicial);
    setEnviado(false);
  };

  const cerrarModal = () => {
    setAnimalSeleccionado(null);
    setEnviado(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Solicitud enviada:", { animal: animalSeleccionado.nombre, ...formData });
    setEnviado(true);
  };

  return (
    <>
      {/* NAVBAR */}
      <header className="Navbar">
        <nav className="links">
          <Link to="/">Home</Link>
          <Link to="/denuncias">Denuncia</Link>
          <Link to="/adopcion">Adopcion</Link>
        </nav>
        <div className="navbar-derecha">
          <div className="Buscador">
            <input type="text" placeholder="¿Quieres Buscar?" />
            <button><i className="fa-solid fa-magnifying-glass"></i></button>
          </div>
          <Link to="/perfil" className="Perfil">
            <h2>Perfil</h2>
            <i className="fa-solid fa-user"></i>
          </Link>
        </div>
      </header>

      {/* HERO + GRID */}
      <section className="hero" style={{ backgroundImage: "url('/Imagenes/Adopcion.jpg')" }}>
        <div className="grid-adopcion">
          {animales.map((animal) => (
            <div key={animal.id} className="glass-effect animal-card">
              <img src={animal.img} alt={animal.nombre} />
              <h3>{animal.nombre}</h3>
              <p>{animal.edad} - {animal.temperamento}</p>
              <button className="btn-ver-detalles" onClick={() => abrirModal(animal)}>
                Ver Detalles
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL */}
      {animalSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-adopcion" onClick={(e) => e.stopPropagation()}>

            <button className="modal-close" onClick={cerrarModal}>✕</button>

            {/* IZQUIERDA — Info del animal */}
            <div className="modal-izquierda">
              <img src={animalSeleccionado.img} alt={animalSeleccionado.nombre} />
              <h2>{animalSeleccionado.nombre}</h2>
              <div className="modal-badges">
                <span className="badge badge-green">{animalSeleccionado.raza}</span>
                <span className="badge badge-cyan">{animalSeleccionado.edad}</span>
                <span className="badge badge-violet">{animalSeleccionado.tamano}</span>
              </div>
              <div className="modal-info-row">
                <div className="modal-info-item">
                  <label>Temperamento</label>
                  <span>{animalSeleccionado.temperamento}</span>
                </div>
                <div className="modal-info-item">
                  <label>Salud</label>
                  <span>{animalSeleccionado.salud}</span>
                </div>
              </div>
              <div className="modal-historia">
                <h5>Historia</h5>
                <p>{animalSeleccionado.historia}</p>
              </div>
            </div>

            {/* DERECHA — Formulario o mensaje de éxito */}
            {!enviado ? (
              <div className="modal-derecha">
                <h3 className="form-titulo">Formulario de Adopción</h3>
                <p className="form-subtitulo">Completa los datos para adoptar a {animalSeleccionado.nombre}</p>

                <form onSubmit={handleSubmit}>
                  <div className="form-fila">
                    <div className="form-grupo col-2">
                      <label>Nombre Completo</label>
                      <input name="nombre" type="text" placeholder="Tu nombre completo"
                        value={formData.nombre} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="form-fila">
                    <div className="form-grupo">
                      <label>CC (Cédula de Ciudadanía)</label>
                      <input name="cc" type="text" placeholder="Número de documento"
                        value={formData.cc} onChange={handleChange} required />
                    </div>
                    <div className="form-grupo">
                      <label>Profesión</label>
                      <input name="profesion" type="text" placeholder="Tu ocupación"
                        value={formData.profesion} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="form-fila">
                    <div className="form-grupo">
                      <label>Edad</label>
                      <input name="edad" type="number" placeholder="Años"
                        value={formData.edad} onChange={handleChange} required />
                    </div>
                    <div className="form-grupo">
                      <label>Teléfono</label>
                      <input name="telefono" type="text" placeholder="+57 300 000 0000"
                        value={formData.telefono} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="form-fila">
                    <div className="form-grupo col-2">
                      <label>Dirección</label>
                      <input name="direccion" type="text" placeholder="Ejemplo: Calle 68 AN #13-79, Popayán"
                        value={formData.direccion} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="form-fila">
                    <div className="form-grupo">
                      <label>Tipo de casa</label>
                      <select name="tipoCasa" value={formData.tipoCasa} onChange={handleChange}>
                        <option>Apartamento</option>
                        <option>Casa con patio</option>
                        <option>Casa sin patio</option>
                        <option>Finca</option>
                      </select>
                    </div>
                    <div className="form-grupo">
                      <label>Salario aproximado</label>
                      <input name="salario" type="text" placeholder="$ 0 COP"
                        value={formData.salario} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="form-fila">
                    <div className="form-grupo">
                      <label>¿Tienes hijos?</label>
                      <div className="radio-opciones">
                        <span>
                          <input type="radio" name="hijos" value="si"
                            checked={formData.hijos === 'si'} onChange={handleChange} /> Sí
                        </span>
                        <span>
                          <input type="radio" name="hijos" value="no"
                            checked={formData.hijos === 'no'} onChange={handleChange} /> No
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="form-grupo">
                    <label>¿Por qué quieres adoptar?</label>
                    <textarea name="motivacion" rows="3" placeholder="Cuéntanos tu motivación..."
                      value={formData.motivacion} onChange={handleChange} />
                  </div>

                  <button type="submit" className="btn-enviar">
                    Enviar Solicitud de Adopción
                  </button>
                </form>
              </div>
            ) : (
              /* MENSAJE DE ÉXITO */
              <div className="modal-exito">
                <div className="exito-icono">✓</div>
                <h3>¡Solicitud enviada!</h3>
                <p>Nos pondremos en contacto contigo pronto para continuar el proceso de adopción.</p>
                <button className="btn-ver-detalles" onClick={cerrarModal}>Cerrar</button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
};

export default Adopcion;