import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiCamera } from 'react-icons/fi';
import '../Style/Perfil.css';
// Fondo propio de esta página
const FONDO = 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=1920&q=70';
import { useAuth } from '../Context/AuthContext';

const Perfil = () => {
  const navigate = useNavigate();
  const { usuario, guardarPerfil } = useAuth();

  // Se precargan los datos que ya tenga la sesión
  const [formData, setFormData] = useState({
    documento: usuario?.documento || '',
    fechaNacimiento: usuario?.fechaNacimiento || '',
    tipoVivienda: usuario?.tipoVivienda || '',
    ocupacion: usuario?.ocupacion || '',
    direccion: usuario?.direccion || '',
    salario: usuario?.salario || '',
    telefono: usuario?.telefono || '',
    hijos: usuario?.hijos || '',
  });

  // La foto nueva se guarda como archivo; la vista previa usa la que ya tiene el usuario
  const [fotoNueva, setFotoNueva] = useState(null);
  const [preview, setPreview] = useState(usuario?.foto || null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  // Libera la dirección temporal de la vista previa al cambiarla o salir de la página
  useEffect(() => () => {
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
  }, [preview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('La foto debe pesar máximo 2 MB.');
      return;
    }
    setError('');
    setFotoNueva(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (enviando) return;
    if (!formData.hijos) {
      setError('Indica si tienes hijos.');
      return;
    }
    setEnviando(true);
    setError('');
    try {
      await guardarPerfil(formData, fotoNueva);
      navigate('/home');
    } catch (err) {
      setError(err.message);
      setEnviando(false);
    }
  };

  return (
    <div className="perfil-page">

      <div className="port">
        <img className="portada" src={FONDO} alt="" />
      </div>
      
      <div className="perfil-overlay" />
      <div className="perfil-wrapper">
        <div className="perfil-card">
          <h1 className="perfil-titulo">Mi Perfil</h1>
          <p className="perfil-subtitulo">
            Gestiona y actualiza tus datos personales para tus solicitudes de adopción y contacto.
          </p>
          <form className="perfil-form" onSubmit={handleSubmit}>
            <div className="foto-wrap">
              <div className="foto-circulo">
                <div className="foto-preview">
                  {preview
                    ? <img src={preview} alt="Vista previa" />
                    : <FiUser style={{ fontSize: 44, color: '#C4B5FD' }} />
                  }
                </div>
                <label className="foto-btn" title="Subir foto de perfil">
                  <FiCamera style={{ fontSize: 16 }} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFoto}
                    className="oculto"/>
                </label>
              </div>
              <span className="foto-texto">Subir foto de perfil</span>
            </div>
            <div className="perfil-fila">
              <div className="perfil-grupo">
                <label className="perfil-label" htmlFor="perfil-documento">Documento de identidad</label>
                <input id="perfil-documento"
                  name="documento"
                  type="text"
                  placeholder="Número de documento" aria-label="Número de documento"
                  value={formData.documento}
                  onChange={handleChange}
                  className="perfil-input"
                  required/>
              </div>
              <div className="perfil-grupo">
                <label className="perfil-label" htmlFor="perfil-fechaNacimiento">Fecha de nacimiento</label>
                <input id="perfil-fechaNacimiento"
                  name="fechaNacimiento"
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  className="perfil-input"
                  required/>
              </div>
            </div>
            <div className="perfil-fila">
              <div className="perfil-grupo">
                <label className="perfil-label" htmlFor="perfil-tipoVivienda">Tipo de vivienda</label>
                <select id="perfil-tipoVivienda"
                  name="tipoVivienda"
                  value={formData.tipoVivienda}
                  onChange={handleChange}
                  className="perfil-input perfil-select"
                  required>
                  <option value="">Selecciona...</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="casa">Casa</option>
                  <option value="finca">Finca</option>
                </select>
              </div>
              <div className="perfil-grupo">
                <label className="perfil-label" htmlFor="perfil-ocupacion">Ocupación</label>
                <input id="perfil-ocupacion"
                  name="ocupacion"
                  type="text"
                  placeholder="Ej. Ingeniero, Docente..." aria-label="Ej. Ingeniero, Docente..."
                  value={formData.ocupacion}
                  onChange={handleChange}
                  className="perfil-input"/>
              </div>
            </div>
            <div className="perfil-grupo">
              <label className="perfil-label" htmlFor="perfil-direccion">Dirección de residencia</label>
              <input
                id="perfil-direccion"
                name="direccion"
                type="text"
                placeholder="Ej. Calle 5 # 10-20, Barrio, Ciudad"
                value={formData.direccion}
                onChange={handleChange}
                className="perfil-input"/>
            </div>
            <div className="perfil-fila">
              <div className="perfil-grupo">
                <label className="perfil-label" htmlFor="perfil-salario">Salario aproximado</label>
                <input id="perfil-salario"
                  name="salario"
                  type="number"
                  min="0"
                  placeholder="$ 0 COP" aria-label="Salario aproximado en pesos"
                  value={formData.salario}
                  onChange={handleChange}
                  className="perfil-input"/>
              </div>
              <div className="perfil-grupo">
                <label className="perfil-label" htmlFor="perfil-telefono">Teléfono</label>
                <input id="perfil-telefono"
                  name="telefono"
                  type="tel"
                  placeholder="+57 300 000 0000" aria-label="+57 300 000 0000"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="perfil-input"/>
              </div>
            </div>
            <div className="perfil-grupo">
              <span className="perfil-label">¿Tienes hijos?</span>
              <div className="hijos-opciones">
                <label className="hijos-opcion">
                  <input
                    type="radio"
                    name="hijos"
                    value="si"
                    checked={formData.hijos === 'si'}
                    onChange={handleChange}/>
                  <div className="hijos-card">
                    <span>Sí</span>
                  </div>
                </label>
                <label className="hijos-opcion">
                  <input
                    type="radio"
                    name="hijos"
                    value="no"
                    checked={formData.hijos === 'no'}
                    onChange={handleChange}/>
                  <div className="hijos-card">
                    <span>No</span>
                  </div>
                </label>
              </div>
            </div>
            <div className="perfil-botones">
              {error && <p className="perfil-error" role="alert">{error}</p>}
              <button type="submit" className="btn-completar" disabled={enviando}>
                {enviando ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <Link to="/home" className="btn-omitir">
                Volver al inicio
              </Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Perfil;