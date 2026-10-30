import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiCamera } from 'react-icons/fi';
// Fondo propio de esta página
const FONDO = 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=1920&q=70';
import { useAuth } from '../Context/AuthContext';

// Estilos con Tailwind. Los colores de la marca salen de @theme (index.css)
const INPUT =
  'box-border w-full rounded-[10px] border border-[rgba(255,255,255,0.14)] bg-[rgba(15,23,42,0.7)] ' +
  'px-3.5 py-2.5 text-[14px] text-texto outline-none focus-visible:outline-none [color-scheme:dark] ' +
  'transition-[border-color,box-shadow,background-color] duration-200 ' +
  'placeholder:text-[rgba(148,163,184,0.5)] ' +
  'focus:border-primario focus:bg-[rgba(15,23,42,0.9)] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.25)]';
const SELECT = `${INPUT} cursor-pointer appearance-none bg-[position:right_14px_center] bg-no-repeat pr-9`;
// Flecha del desplegable (SVG en línea)
const FLECHA = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23C4B5FD' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
};
const FILA = 'grid grid-cols-1 gap-3.5 sm:grid-cols-2';
const GRUPO = 'flex flex-col gap-1.5';
const ETIQUETA = 'text-[12.5px] font-semibold tracking-[0.02em] text-acento';
const OPCION_HIJOS =
  'flex items-center justify-center gap-2 rounded-[10px] border border-[rgba(255,255,255,0.14)] ' +
  'bg-[rgba(15,23,42,0.7)] px-3.5 py-[11px] text-[14px] font-semibold text-texto-gris transition-all duration-200 ' +
  'hover:border-[rgba(124,58,237,0.4)] hover:text-white ' +
  'peer-checked:border-primario peer-checked:bg-[rgba(124,58,237,0.2)] peer-checked:text-white ' +
  'peer-checked:shadow-[0_0_16px_rgba(124,58,237,0.25)] peer-checked:hover:border-primario';

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
    <div className="relative flex min-h-screen items-center justify-center overflow-x-hidden bg-[#0B0F19]">

      <div className="fixed inset-0 z-0 h-full w-full">
        <img className="absolute inset-0 z-0 h-full w-full bg-fondo object-cover brightness-[0.35] contrast-[1.1]" src={FONDO} alt="" />
      </div>

      <div className="fixed inset-0 z-[1] h-full w-full bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.65)_0%,rgba(11,15,25,0.92)_100%)] backdrop-blur-[8px]" />
      <div className="relative z-[2] box-border w-full max-w-[620px] px-3.5 pt-6 pb-10 sm:px-4 sm:py-10">
        <div className="box-border rounded-[20px] border border-[rgba(124,58,237,0.28)] bg-[rgba(15,23,42,0.82)] px-[18px] py-6 shadow-[0_24px_60px_rgba(0,0,0,0.65),0_0_30px_rgba(124,58,237,0.15)] backdrop-blur-[16px] sm:px-8 sm:py-9">
          <h1 className="mb-1.5 text-center text-[26px] font-extrabold tracking-[-0.02em] text-white">Mi Perfil</h1>
          <p className="mb-6 text-center text-[14px] leading-[1.55] text-texto-gris">
            Gestiona y actualiza tus datos personales para tus solicitudes de adopción y contacto.
          </p>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="mb-2 flex flex-col items-center gap-2">
              <div className="relative">
                <div className="flex size-[104px] items-center justify-center overflow-hidden rounded-full border-[3px] border-[rgba(196,181,253,0.4)] bg-[rgba(124,58,237,0.12)] shadow-[0_8px_24px_rgba(0,0,0,0.4),0_0_18px_rgba(124,58,237,0.2)]">
                  {preview
                    ? <img className="h-full w-full object-cover" src={preview} alt="Vista previa" />
                    : <FiUser className="text-[44px] text-acento" />
                  }
                </div>
                <label
                  className="absolute right-0 bottom-0 flex size-[34px] cursor-pointer items-center justify-center rounded-full border-2 border-fondo bg-primario text-white shadow-[0_4px_12px_rgba(124,58,237,0.5)] transition-[scale,background-color] duration-200 hover:scale-110 hover:bg-primario-oscuro"
                  title="Subir foto de perfil"
                >
                  <FiCamera className="text-[16px]" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFoto}
                    className="hidden"/>
                </label>
              </div>
              <span className="text-[13px] font-semibold text-acento">Subir foto de perfil</span>
            </div>
            <div className={FILA}>
              <div className={GRUPO}>
                <label className={ETIQUETA} htmlFor="perfil-documento">Documento de identidad</label>
                <input id="perfil-documento"
                  name="documento"
                  type="text"
                  placeholder="Número de documento" aria-label="Número de documento"
                  value={formData.documento}
                  onChange={handleChange}
                  className={INPUT}
                  required/>
              </div>
              <div className={GRUPO}>
                <label className={ETIQUETA} htmlFor="perfil-fechaNacimiento">Fecha de nacimiento</label>
                <input id="perfil-fechaNacimiento"
                  name="fechaNacimiento"
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  className={INPUT}
                  required/>
              </div>
            </div>
            <div className={FILA}>
              <div className={GRUPO}>
                <label className={ETIQUETA} htmlFor="perfil-tipoVivienda">Tipo de vivienda</label>
                <select id="perfil-tipoVivienda"
                  name="tipoVivienda"
                  value={formData.tipoVivienda}
                  onChange={handleChange}
                  className={SELECT}
                  style={FLECHA}
                  required>
                  <option className="bg-fondo text-texto" value="">Selecciona...</option>
                  <option className="bg-fondo text-texto" value="apartamento">Apartamento</option>
                  <option className="bg-fondo text-texto" value="casa">Casa</option>
                  <option className="bg-fondo text-texto" value="finca">Finca</option>
                </select>
              </div>
              <div className={GRUPO}>
                <label className={ETIQUETA} htmlFor="perfil-ocupacion">Ocupación</label>
                <input id="perfil-ocupacion"
                  name="ocupacion"
                  type="text"
                  placeholder="Ej. Ingeniero, Docente..." aria-label="Ej. Ingeniero, Docente..."
                  value={formData.ocupacion}
                  onChange={handleChange}
                  className={INPUT}/>
              </div>
            </div>
            <div className={GRUPO}>
              <label className={ETIQUETA} htmlFor="perfil-direccion">Dirección de residencia</label>
              <input
                id="perfil-direccion"
                name="direccion"
                type="text"
                placeholder="Ej. Calle 5 # 10-20, Barrio, Ciudad"
                value={formData.direccion}
                onChange={handleChange}
                className={INPUT}/>
            </div>
            <div className={FILA}>
              <div className={GRUPO}>
                <label className={ETIQUETA} htmlFor="perfil-salario">Salario aproximado</label>
                <input id="perfil-salario"
                  name="salario"
                  type="number"
                  min="0"
                  placeholder="$ 0 COP" aria-label="Salario aproximado en pesos"
                  value={formData.salario}
                  onChange={handleChange}
                  className={INPUT}/>
              </div>
              <div className={GRUPO}>
                <label className={ETIQUETA} htmlFor="perfil-telefono">Teléfono</label>
                <input id="perfil-telefono"
                  name="telefono"
                  type="tel"
                  placeholder="+57 300 000 0000" aria-label="+57 300 000 0000"
                  value={formData.telefono}
                  onChange={handleChange}
                  className={INPUT}/>
              </div>
            </div>
            <div className={GRUPO}>
              <span className={ETIQUETA}>¿Tienes hijos?</span>
              <div className="grid grid-cols-2 gap-3">
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="hijos"
                    value="si"
                    checked={formData.hijos === 'si'}
                    onChange={handleChange}
                    className="peer hidden"/>
                  <div className={OPCION_HIJOS}>
                    <span>Sí</span>
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="hijos"
                    value="no"
                    checked={formData.hijos === 'no'}
                    onChange={handleChange}
                    className="peer hidden"/>
                  <div className={OPCION_HIJOS}>
                    <span>No</span>
                  </div>
                </label>
              </div>
            </div>
            <div className="flex flex-col gap-2.5 pt-2.5">
              {error && (
                <p className="mb-3 rounded-[10px] border border-[rgba(225,29,72,0.5)] bg-[rgba(225,29,72,0.15)] px-3.5 py-2.5 text-center text-[14px] text-[#fecdd3]" role="alert">
                  {error}
                </p>
              )}
              <button
                type="submit"
                className="w-full cursor-pointer rounded-full border border-[rgba(124,58,237,0.6)] bg-primario p-3 text-[15px] font-bold text-white shadow-[0_0_20px_rgba(124,58,237,0.35)] transition-all duration-200 hover:-translate-y-px hover:bg-primario-oscuro hover:shadow-[0_0_28px_rgba(124,58,237,0.6)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={enviando}
              >
                {enviando ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <Link
                to="/home"
                className="w-full cursor-pointer bg-transparent p-2 text-center text-[13.5px] font-semibold text-texto-gris no-underline transition-colors duration-200 hover:text-acento"
              >
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