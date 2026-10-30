import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiAlertCircle, FiArrowLeft, FiEye, FiEyeOff, FiInfo, FiLock, FiMail, FiPaperclip, FiX } from 'react-icons/fi';
import { registrarFundacion } from '../Services/authService.js';
import * as A from '../Utils/accesoEstilos.js';

const PASOS = ['Organización', 'Representante', 'Cuenta'];

// Límites de los archivos opcionales (los mismos que valida la API)
const MAX_ARCHIVOS = 5;
const MAX_BYTES = 20 * 1024 * 1024;
const TIPOS = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];

const RegistroFundacion = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [paso, setPaso] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '',
    cedulaRepresentante: '',
    representante: '',
    telefono: '',
    ciudad: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [verPassword, setVerPassword] = useState(false);
  const [error, setError] = useState('');
  const [archivos, setArchivos] = useState([]);
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Fotos o videos de la fundación: son opcionales, solo ayudan al admin a verificarla
  const handleArchivos = (e) => {
    const nuevos = Array.from(e.target.files);
    e.target.value = '';
    const validos = nuevos.filter((f) => TIPOS.includes(f.type) && f.size <= MAX_BYTES);
    const todos = [...archivos, ...validos];

    if (validos.length < nuevos.length) {
      setError('Solo se aceptan fotos (JPG, PNG, WEBP) o videos (MP4, WEBM) de máximo 20 MB.');
    } else if (todos.length > MAX_ARCHIVOS) {
      setError(`Puedes adjuntar máximo ${MAX_ARCHIVOS} archivos.`);
    } else {
      setError('');
    }
    setArchivos(todos.slice(0, MAX_ARCHIVOS));
  };

  const quitarArchivo = (indice) => setArchivos((prev) => prev.filter((_, i) => i !== indice));

  // Avanza solo si los campos del paso actual están completos
  const siguiente = () => {
    if (formRef.current.reportValidity()) setPaso(paso + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Enter en los primeros pasos también avanza en vez de enviar
    if (paso < PASOS.length) {
      setPaso(paso + 1);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setError('');
    if (enviando) return;
    setEnviando(true);
    try {
      // La fundación queda pendiente hasta que el administrador la verifique
      await registrarFundacion({
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
        cedulaRepresentante: formData.cedulaRepresentante,
        representante: formData.representante,
        telefono: formData.telefono,
        ciudad: formData.ciudad,
        archivos,
      });
      navigate('/login', { state: { mensajeExito: 'Solicitud enviada. Un administrador verificará tu fundación.' } });
    } catch (err) {
      setError(err.message);
      setEnviando(false);
    }
  };

  return (
    <div className={A.PANEL}>
      <Link to="/registro" className={A.VOLVER}><FiArrowLeft /> Cambiar tipo de cuenta</Link>

      <header className={A.CABECERA}>
        <h1 className={A.H1}>Registrar fundación</h1>
        <p className={A.CABECERA_TEXTO}>Paso {paso} de {PASOS.length}</p>
      </header>

      <ol className={A.PASOS}>
        {PASOS.map((texto, i) => (
          <li key={texto} className={i + 1 < paso ? A.PASO_HECHO : i + 1 === paso ? A.PASO_ACTIVO : A.PASO_PENDIENTE}>
            {i + 1}. {texto}
          </li>
        ))}
      </ol>

      <form className={A.FORM} ref={formRef} onSubmit={handleSubmit}>
        {paso === 1 && (
          <>
            <div className={A.GRUPO}>
              <label className={A.LABEL} htmlFor="nombre">Nombre de la fundación</label>
              <div className={A.CAMPO}>
                <input className={A.INPUT} id="nombre" name="nombre" type="text" placeholder="Ej: Huellitas Felices"
                  value={formData.nombre} onChange={handleChange} required />
              </div>
            </div>
            <div className={A.GRUPO}>
              <label className={A.LABEL} htmlFor="ciudad">Ciudad / Dirección</label>
              <div className={A.CAMPO}>
                <input className={A.INPUT} id="ciudad" name="ciudad" type="text" placeholder="Ciudad y dirección de la sede"
                  value={formData.ciudad} onChange={handleChange} required />
              </div>
            </div>
            <div className={A.GRUPO}>
              <label className={A.LABEL} htmlFor="telefono">Teléfono de contacto</label>
              <div className={A.CAMPO}>
                <input className={A.INPUT} id="telefono" name="telefono" type="tel" placeholder="+57 300 000 0000"
                  value={formData.telefono} onChange={handleChange} required />
              </div>
            </div>
            <div className={A.GRUPO}>
              <span className={A.LABEL}>Fotos o videos de la fundación <em className={A.OPCIONAL}>(opcional)</em></span>
              <label className={A.ADJUNTAR}>
                <FiPaperclip /> Adjuntar archivos
                <input className={A.ADJUNTAR_INPUT} type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" multiple
                  onChange={handleArchivos} disabled={archivos.length >= MAX_ARCHIVOS} />
              </label>
              <p className={A.AYUDA}>Ayudan al administrador a conocer tu refugio. Hasta {MAX_ARCHIVOS} archivos de 20 MB.</p>
              {archivos.length > 0 && (
                <ul className={A.ARCHIVOS}>
                  {archivos.map((archivo, i) => (
                    <li key={`${archivo.name}-${i}`} className={A.ARCHIVO}>
                      <span className={A.ARCHIVO_NOMBRE}>{archivo.name}</span>
                      <button type="button" className={A.ARCHIVO_QUITAR} onClick={() => quitarArchivo(i)} aria-label={`Quitar ${archivo.name}`}><FiX /></button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        {paso === 2 && (
          <>
            <div className={A.GRUPO}>
              <label className={A.LABEL} htmlFor="representante">Representante legal</label>
              <div className={A.CAMPO}>
                <input className={A.INPUT} id="representante" name="representante" type="text" placeholder="Nombre y apellidos"
                  value={formData.representante} onChange={handleChange} required />
              </div>
            </div>
            <div className={A.GRUPO}>
              <label className={A.LABEL} htmlFor="cedulaRepresentante">Cédula del representante</label>
              <div className={A.CAMPO}>
                <input className={A.INPUT} id="cedulaRepresentante" name="cedulaRepresentante" type="text" placeholder="Número de cédula"
                  value={formData.cedulaRepresentante} onChange={handleChange} required />
              </div>
            </div>
          </>
        )}

        {paso === 3 && (
          <>
            <div className={A.GRUPO}>
              <label className={A.LABEL} htmlFor="email">Correo electrónico</label>
              <div className={A.CAMPO}>
                <FiMail />
                <input className={A.INPUT} id="email" name="email" type="email" autoComplete="email" placeholder="contacto@fundacion.org"
                  value={formData.email} onChange={handleChange} required />
              </div>
            </div>
            <div className={A.FILA}>
              <div className={A.GRUPO}>
                <label className={A.LABEL} htmlFor="password">Contraseña</label>
                <div className={A.CAMPO}>
                  <FiLock />
                  <input className={A.INPUT} id="password" name="password" type={verPassword ? 'text' : 'password'} autoComplete="new-password"
                    placeholder="Mínimo 8 caracteres" minLength={8}
                    value={formData.password} onChange={handleChange} required />
                  <button type="button" className={A.OJO} onClick={() => setVerPassword(!verPassword)}
                    aria-label={verPassword ? 'Ocultar contraseñas' : 'Mostrar contraseñas'}>
                    {verPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
              <div className={A.GRUPO}>
                <label className={A.LABEL} htmlFor="confirmPassword">Confirmar contraseña</label>
                <div className={A.CAMPO}>
                  <FiLock />
                  <input className={A.INPUT} id="confirmPassword" name="confirmPassword" type={verPassword ? 'text' : 'password'} autoComplete="new-password"
                    placeholder="Repite tu contraseña"
                    value={formData.confirmPassword} onChange={handleChange} required />
                </div>
              </div>
            </div>
            <div className={A.AVISO_OK}>
              <FiInfo /> Un administrador verificará tu fundación antes de que puedas ingresar al panel.
            </div>
          </>
        )}

        {error && <div className={A.AVISO_ERROR} role="alert"><FiAlertCircle /> {error}</div>}

        <div className={A.ACCIONES}>
          {paso > 1 && (
            <button type="button" className={A.BTN_SECUNDARIO} onClick={() => setPaso(paso - 1)}>Atrás</button>
          )}
          {paso < PASOS.length ? (
            <button type="button" className={A.BTN_ACCION} onClick={siguiente}>Siguiente</button>
          ) : (
            <button type="submit" className={A.BTN_ACCION} disabled={enviando}>{enviando ? 'Enviando...' : 'Enviar solicitud'}</button>
          )}
        </div>
      </form>

      <p className={A.PIE}>
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className={A.ENLACE}>Inicia sesión</Link>
      </p>
    </div>
  );
};

export default RegistroFundacion;
