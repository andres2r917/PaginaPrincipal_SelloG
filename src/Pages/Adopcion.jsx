import { FiAlertTriangle, FiCheck, FiCheckCircle, FiHeart, FiHome, FiShield, FiX } from 'react-icons/fi';
import { FaPaw } from 'react-icons/fa';
// Página de adopción — muestra los animales disponibles para adoptar
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import * as A from '../Utils/adopcionEstilos.js';
import { limpiarTexto } from '../Utils/limpiarTexto.js';
import { useAuth } from '../Context/AuthContext.jsx';
import { getMascotasDisponibles, solicitarAdopcion } from '../Services/mascotasService.js';
// Fondo propio de esta página
const FONDO = 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=1920&q=70'
// Lo que se elige en el formulario es el mismo texto que se guarda: así la fundación lo lee tal cual
const EXPERIENCIAS = [
  'Nunca he tenido mascotas',
  'Sí, he tenido perros',
  'Sí, he tenido gatos',
  'Sí, he tenido varios animales',
  'Actualmente tengo mascotas',
];
const TIEMPOS = [
  'Menos de 2 horas',
  'Entre 2 y 4 horas',
  'Entre 4 y 6 horas',
  'Más de 6 horas',
  'Estoy en casa todo el día',
];

const FORM_INICIAL = {
  mensaje_presentacion: "",
  experiencia_mascotas: "",
  tiempo_disponible: "",
  compromiso_veterinario: false,
  acepta_terminos: false,
};

/* ── Foto del animal (si la fundación no subió una, se muestra una huella) ── */
const FotoAnimal = ({ animal, claseImg }) =>
  animal.img
    ? <img className={claseImg} src={animal.img} alt={`Foto de ${animal.nombre}`} />
    : (
      <div className={A.SIN_FOTO} role="img" aria-label={`${animal.nombre} aún no tiene foto`}>
        <FaPaw />
      </div>
    );

/* ── Tarjeta de animal ── */
const AnimalCard = ({ animal, esFavorito, onFavorito, onVerDetalles }) => (
  <div className={A.TARJETA}>
    <div className={A.TARJETA_FOTO}>
      <FotoAnimal animal={animal} claseImg={A.TARJETA_IMG} />
      <span className={A.TARJETA_ETIQUETA}>{animal.sexo} · {animal.tamano}</span>
      <button
        type="button"
        className={A.favorito(esFavorito)}
        onClick={() => onFavorito(animal.id)}
        aria-label="Guardar en favoritos"
      >
        <FiHeart />
      </button>
      {animal.vacunado && (
        <span className={A.TARJETA_VACUNADO}><FiCheck /> Vacunado</span>
      )}
    </div>
    <h3 className={A.TARJETA_NOMBRE}>{animal.nombre}</h3>
    <p className={A.TARJETA_DATOS}>{animal.edad} - {animal.temperamento}</p>
    <button className={A.BTN_VER} onClick={() => onVerDetalles(animal)}>
      Ver Detalles
    </button>
  </div>
);

/* ── Datos de las garantías y de los filtros ── */
const GARANTIAS = [
  { icono: <FiCheckCircle />, titulo: 'Salud revisada', texto: 'Cada ficha indica vacunas, esterilización y desparasitación.' },
  { icono: <FiHome />, titulo: 'Fundaciones verificadas', texto: 'Solo organizaciones aprobadas por nuestro equipo publican animales.' },
  { icono: <FiHeart />, titulo: 'Proceso acompañado', texto: 'La fundación te guía desde la solicitud hasta la entrega.' },
]

/* ── Info del animal (columna izquierda) ── */
const AnimalInfo = ({ animal }) => (
  <div className={A.INFO}>
    <FotoAnimal animal={animal} claseImg={A.INFO_IMG} />
    <h2 className={A.INFO_NOMBRE}>{animal.nombre}</h2>

    <div className={A.FICHA_SECCION}>
      <div className={A.FICHA_BLOQUE}>
        <span className={A.FICHA_ETIQUETA}>Ficha Básica</span>
        <div className={A.FICHA_GRUPO}>
          <span className={A.insignia('verde')}>{animal.raza}</span>
          <span className={A.insignia('cian')}>{animal.edad}</span>
          <span className={A.insignia('violeta')}>{animal.sexo || 'Macho'}</span>
          <span className={A.insignia('violeta')}>{animal.tamano}</span>
        </div>
      </div>

      <div className={A.FICHA_BLOQUE}>
        <span className={A.FICHA_ETIQUETA}>Salud & Cuidados</span>
        <div className={A.FICHA_GRUPO}>
          <span className={A.insignia(animal.vacunado ? 'vacunado' : 'sinVacunas')}>
            {animal.vacunado ? <><FiCheck /> Vacunado</> : <><FiAlertTriangle /> Sin Vacunas</>}
          </span>
          <span className={A.insignia(animal.esterilizado ? 'esterilizado' : 'sinEsterilizar')}>
            {animal.esterilizado ? <><FiCheck /> Esterilizado</> : 'Sin Esterilizar'}
          </span>
          <span className={A.insignia(animal.desparasitado ? 'desparasitado' : 'sinDesparasitar')}>
            {animal.desparasitado ? <><FiShield /> Desparasitado</> : <><FiAlertTriangle /> Sin desparasitar</>}
          </span>
        </div>
      </div>
    </div>

    <div className={A.DATOS}>
      <div className={A.DATO}>
        <label className={A.DATO_ETIQUETA}>Temperamento</label>
        <span className={A.DATO_VALOR}>{animal.temperamento}</span>
      </div>
      <div className={A.DATO}>
        <label className={A.DATO_ETIQUETA}>Convivencia</label>
        <span className={A.DATO_VALOR}>{animal.convivencia || 'Apto para todo hogar'}</span>
      </div>
    </div>
    <div className={A.HISTORIA}>
      <h5 className={A.HISTORIA_TITULO}>Historia</h5>
      <p className={A.HISTORIA_TEXTO}>{animal.historia}</p>
    </div>
  </div>
);
 
/* ── Formulario de adopción ── */
const FormularioAdopcion = ({ animal, formData, onChange, onSubmit, enviando, error }) => {
  const { usuario } = useAuth();

  // Solo un usuario civil con el perfil completo puede solicitar (la API también lo exige)
  if (!usuario) {
    return (
      <div className={A.FORMULARIO_PANEL}>
        <h3 className={A.FORM_TITULO}>Inicia sesión para adoptar</h3>
        <p className={A.FORM_SUBTITULO}>Necesitas una cuenta para enviar tu solicitud por {animal.nombre}.</p>
        <Link to="/login" className={`${A.BTN_ENVIAR} ${A.BTN_ENLACE}`}>Iniciar sesión</Link>
      </div>
    );
  }
  if (usuario.rol !== 'civil') {
    return (
      <div className={A.FORMULARIO_PANEL}>
        <h3 className={A.FORM_TITULO}>Solo cuentas de usuario</h3>
        <p className={A.FORM_SUBTITULO}>Las solicitudes de adopción las envían los usuarios, no las fundaciones ni los administradores.</p>
      </div>
    );
  }
  if (!usuario.perfilCompleto) {
    return (
      <div className={A.FORMULARIO_PANEL}>
        <h3 className={A.FORM_TITULO}>Completa tu perfil primero</h3>
        <p className={A.FORM_SUBTITULO}>La fundación necesita conocer tus datos para evaluar la solicitud por {animal.nombre}.</p>
        <Link to="/perfil" className={`${A.BTN_ENVIAR} ${A.BTN_ENLACE}`}>Completar mi perfil</Link>
      </div>
    );
  }

  return (
  <div className={A.FORMULARIO_PANEL}>
    <h3 className={A.FORM_TITULO}>Formulario de Adopción</h3>
    <p className={A.FORM_SUBTITULO}>
      Completa los siguientes detalles para iniciar tu proceso de solicitud. Buscamos el hogar perfecto para {animal.nombre}.
    </p>
 
    <form className={A.FORMULARIO} onSubmit={onSubmit}>
 
      {/* Mensaje de presentación */}
      <div className={A.FORM_GRUPO}>
        <label className={A.FORM_ETIQUETA} htmlFor="adop-mensaje_presentacion">¿Por qué quieres adoptar?</label>
        <textarea id="adop-mensaje_presentacion"
          className={A.FORM_CAMPO}
          name="mensaje_presentacion"
          rows="3"
          placeholder="Cuéntanos tu motivación y por qué serías un buen hogar..." aria-label="Cuéntanos tu motivación y por qué serías un buen hogar..."
          value={formData.mensaje_presentacion}
          onChange={onChange}
          required
        />
      </div>
 
      {/* Experiencia con mascotas */}
      <div className={A.FORM_GRUPO}>
        <label className={A.FORM_ETIQUETA} htmlFor="adop-experiencia_mascotas">¿Has tenido mascotas antes?</label>
        <select id="adop-experiencia_mascotas"
          className={A.FORM_CAMPO}
          name="experiencia_mascotas"
          value={formData.experiencia_mascotas}
          onChange={onChange}
          required
        >
          <option value="">Selecciona una opción</option>
          {EXPERIENCIAS.map((texto) => <option key={texto} value={texto}>{texto}</option>)}
        </select>
      </div>
 
      {/* Tiempo disponible */}
      <div className={A.FORM_GRUPO}>
        <label className={A.FORM_ETIQUETA} htmlFor="adop-tiempo_disponible">¿Cuánto tiempo le dedicarías al día?</label>
        <select id="adop-tiempo_disponible"
          className={A.FORM_CAMPO}
          name="tiempo_disponible"
          value={formData.tiempo_disponible}
          onChange={onChange}
          required
        >
          <option value="">Selecciona una opción</option>
          {TIEMPOS.map((texto) => <option key={texto} value={texto}>{texto}</option>)}
        </select>
      </div>
 
      {/* Checkboxes */}
      <div className={A.FORM_GRUPO}>
        <label className={A.FORM_ETIQUETA}>Compromisos</label>
        <div className={A.CASILLAS}>
          <label className={A.CASILLA}>
            <input
              type="checkbox"
              className={A.CASILLA_CAJA}
              name="compromiso_veterinario"
              checked={formData.compromiso_veterinario}
              onChange={onChange}
            />
            <span className={A.CASILLA_TEXTO}>Me comprometo a llevar la mascota al veterinario regularmente</span>
          </label>
          <label className={A.CASILLA}>
            <input
              type="checkbox"
              className={A.CASILLA_CAJA}
              name="acepta_terminos"
              checked={formData.acepta_terminos}
              onChange={onChange}
              required
            />
            <span className={A.CASILLA_TEXTO}>Acepto los términos y condiciones del proceso de adopción</span>
          </label>
        </div>
      </div>
 
      {error && <p className={A.ERROR} role="alert">{error}</p>}
      <button
        type="submit"
        className={A.BTN_ENVIAR}
        disabled={!formData.acepta_terminos || enviando}
      >
        {enviando ? 'Enviando...' : 'Enviar Solicitud de Adopción'}
      </button>
    </form>
  </div>
  );
};
 
/* ── Mensaje de éxito ── */
const MensajeExito = ({ onCerrar }) => (
  <div className={A.EXITO}>
    <div className={A.EXITO_ICONO}><FiCheck /></div>
    <h3 className={A.EXITO_TITULO}>¡Solicitud enviada!</h3>
    <p className={A.EXITO_TEXTO}>
      Nos pondremos en contacto contigo pronto para continuar el proceso de adopción.
    </p>
    <button className={A.BTN_VER} onClick={onCerrar}>
      Cerrar
    </button>
  </div>
);
 
/* ── Página principal ── */
const Adopcion = () => {
  const [animales, setAnimales] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState('');
  const [animalSeleccionado, setAnimalSeleccionado] = useState(null);
  const [formData, setFormData] = useState(FORM_INICIAL);
  const [enviado, setEnviado] = useState(false);
  const [especie, setEspecie] = useState('todos');
  const [raza, setRaza] = useState('todos');
  const [tamano, setTamano] = useState('todos');
  const [sexo, setSexo] = useState('todos');
  const [favoritos, setFavoritos] = useState([]);

  // Los animales disponibles vienen de la API
  useEffect(() => {
    getMascotasDisponibles()
      .then(setAnimales)
      .catch((error) => setErrorCarga(error.message))
      .finally(() => setCargando(false));
  }, []);

  // Texto que llega desde la barra de búsqueda del encabezado (?buscar=...)
  const [searchParams, setSearchParams] = useSearchParams();
  const buscar = searchParams.get('buscar') || '';
  const palabras = limpiarTexto(buscar).split(/\s+/).filter(Boolean);

  // Las opciones salen de los propios animales: sirve para cualquier especie que se publique
  const especies = [...new Set(animales.map((a) => a.especie))];
  const razas = [...new Set(
    animales.filter((a) => especie === 'todos' || a.especie === especie).map((a) => a.raza)
  )];

  const animalesFiltrados = animales.filter((a) =>
    (especie === 'todos' || a.especie === especie) &&
    (raza === 'todos' || a.raza === raza) &&
    (tamano === 'todos' || a.tamano === tamano) &&
    (sexo === 'todos' || a.sexo === sexo) &&
    palabras.every((p) => limpiarTexto(`${a.nombre} ${a.raza} ${a.especie} ${a.temperamento} ${a.tamano} ${a.sexo}`).includes(p))
  );

  const elegirEspecie = (valor) => { setEspecie(valor); setRaza('todos') };

  const limpiarFiltros = () => { setEspecie('todos'); setRaza('todos'); setTamano('todos'); setSexo('todos'); setSearchParams({}) };

  const alternarFavorito = (id) =>
    setFavoritos((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);

  const abrirModal = (animal) => {
    setAnimalSeleccionado(animal);
    setFormData(FORM_INICIAL);
    setEnviado(false);
    setErrorEnvio('');
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
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (enviando) return;
    setEnviando(true);
    setErrorEnvio('');
    try {
      await solicitarAdopcion(animalSeleccionado.id, formData);
      setEnviado(true);
    } catch (error) {
      setErrorEnvio(error.message);
    }
    setEnviando(false);
  };
 
  return (
    <>
      <section className={A.HERO}>
        <div>
          <img className={A.PORTADA} src={FONDO} alt="" />
        </div>

        <div className={A.CONTENIDO}>
          <header className={A.ENCABEZADO}>
            <h1 className={A.ENCABEZADO_TITULO}>Encuentra a tu nuevo mejor amigo</h1>
            <p className={A.ENCABEZADO_TEXTO}>
              <strong className={A.ENCABEZADO_DESTACADO}>{animales.length} peluditos</strong> esperan un hogar. Conoce su historia y envía tu solicitud de adopción.
            </p>
          </header>

          <div className={A.GARANTIAS_GRID}>
            {GARANTIAS.map((g) => (
              <div className={A.GARANTIA} key={g.titulo}>
                <span className={A.GARANTIA_ICONO}>{g.icono}</span>
                <div>
                  <strong className={A.GARANTIA_TITULO}>{g.titulo}</strong>
                  <small className={A.GARANTIA_TEXTO}>{g.texto}</small>
                </div>
              </div>
            ))}
          </div>

          <div className={A.FILTROS}>
            <div className={A.FILTRO_GRUPO}>
              {['todos', ...especies].map((e) => (
                <button
                  key={e}
                  type="button"
                  className={A.chip(especie === e)}
                  onClick={() => elegirEspecie(e)}
                >
                  {e === 'todos' ? 'Todos' : e}
                </button>
              ))}
            </div>
            <div className={A.FILTRO_GRUPO}>
              <select className={A.FILTRO_SELECT} value={raza} onChange={(e) => setRaza(e.target.value)} aria-label="Filtrar por raza">
                <option value="todos">Todas las razas</option>
                {razas.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <select className={A.FILTRO_SELECT} value={tamano} onChange={(e) => setTamano(e.target.value)} aria-label="Filtrar por tamaño">
                <option value="todos">Todos los tamaños</option>
                <option value="Pequeño">Pequeño</option>
                <option value="Mediano">Mediano</option>
                <option value="Grande">Grande</option>
              </select>
              <select className={A.FILTRO_SELECT} value={sexo} onChange={(e) => setSexo(e.target.value)} aria-label="Filtrar por sexo">
                <option value="todos">Macho y hembra</option>
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </select>
            </div>
            {buscar && (
              <button type="button" className={A.CHIP_ACTIVO} onClick={() => setSearchParams({})}>
                Búsqueda: «{buscar}» <FiX />
              </button>
            )}
            <span className={A.CONTADOR}>
              {animalesFiltrados.length} {animalesFiltrados.length === 1 ? 'resultado' : 'resultados'}
            </span>
          </div>

          {cargando && <p className={A.ESTADO}>Cargando animales...</p>}
          {errorCarga && <p className={A.ERROR} role="alert">{errorCarga}</p>}

          {animalesFiltrados.length > 0 ? (
            <div className={A.GRID}>
              {animalesFiltrados.map((animal) => (
                <AnimalCard
                  key={animal.id}
                  animal={animal}
                  esFavorito={favoritos.includes(animal.id)}
                  onFavorito={alternarFavorito}
                  onVerDetalles={abrirModal}
                />
              ))}
            </div>
          ) : !cargando && !errorCarga && (
            <div className={A.VACIO}>
              <p>{animales.length === 0 ? 'Por ahora no hay animales disponibles para adopción.' : 'No encontramos animales con esos filtros.'}</p>
              <button type="button" className={A.BTN_LIMPIAR} onClick={limpiarFiltros}>Limpiar filtros</button>
            </div>
          )}

          <div className={A.CTA}>
            <div>
              <strong className={A.CTA_TITULO}>¿Eres una fundación?</strong>
              <small className={A.CTA_TEXTO}>Registra tu organización y publica a tus animales para que encuentren hogar.</small>
            </div>
            <Link to="/registro/registroFundacion" className={A.CTA_BOTON}>Registrar mi fundación</Link>
          </div>
        </div>
      </section>

      {animalSeleccionado && (
        <div className={A.OVERLAY} onClick={cerrarModal}>
          <div className={A.MODAL} onClick={(e) => e.stopPropagation()}>
            <button className={A.MODAL_CERRAR} onClick={cerrarModal} aria-label="Cerrar"><FiX /></button>
            <AnimalInfo animal={animalSeleccionado} />
            {!enviado ? (
              <FormularioAdopcion
                animal={animalSeleccionado}
                formData={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                enviando={enviando}
                error={errorEnvio}
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