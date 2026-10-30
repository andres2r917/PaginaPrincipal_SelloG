import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaPaw } from 'react-icons/fa';
import { FiAlertCircle, FiCheckCircle, FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi';
import * as A from '../Utils/accesoEstilos.js';
import { useAuth } from '../Context/AuthContext';

// Foto del panel lateral (Registro usa otras distintas)
const FOTO = 'https://images.pexels.com/photos/3628100/pexels-photo-3628100.jpeg?cs=srgb&dl=pexels-edd1egalaxy-3628100.jpg&fm=jpg';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [verPassword, setVerPassword] = useState(false);

  const mensajeExito = location.state?.mensajeExito;

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    remember: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCredentials({ ...credentials, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      // El rol lo determina la credencial: login devuelve la ruta de inicio
      const ruta = await login(credentials.email, credentials.password);
      navigate(ruta, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={A.PAGINA} style={A.FONDO_PAGINA}>
      <div className={A.TARJETA}>
        <div className={A.VISUAL}>
          <img className={A.VISUAL_IMG} src={FOTO} alt="" />
          <div className={A.VISUAL_CAPA}>
            <span className={A.VISUAL_CHIP}><FaPaw /> Sello Guardián</span>
            <h2 className={A.VISUAL_TITULO}>Tu compromiso cambia vidas.</h2>
            <p className={A.VISUAL_SUBTITULO}>
              Cada ingreso nos acerca un paso más a encontrar el hogar perfecto para quienes más lo necesitan.
            </p>
          </div>
        </div>

        <div className={A.PANEL}>
          <header className={A.CABECERA}>
            <h1 className={A.H1}>Bienvenido de nuevo</h1>
            <p className={A.CABECERA_TEXTO}>Inicia sesión para denunciar, adoptar y seguir tus casos.</p>
          </header>

          <form className={A.FORM} onSubmit={handleSubmit}>
            {mensajeExito && (
              <div className={A.AVISO_OK} role="status"><FiCheckCircle /> {mensajeExito}</div>
            )}
            {error && (
              <div className={A.AVISO_ERROR} role="alert"><FiAlertCircle /> {error}</div>
            )}

            <div className={A.GRUPO}>
              <label className={A.LABEL} htmlFor="email">Correo electrónico</label>
              <div className={A.CAMPO}>
                <FiMail />
                <input className={A.INPUT} id="email" name="email" type="email" autoComplete="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={credentials.email} onChange={handleChange} required />
              </div>
            </div>

            <div className={A.GRUPO}>
              <div className={A.LABEL_FILA}>
                <label className={A.LABEL} htmlFor="password">Contraseña</label>
                <a href="#" className={A.ENLACE}>¿Olvidaste tu contraseña?</a>
              </div>
              <div className={A.CAMPO}>
                <FiLock />
                <input className={A.INPUT} id="password" name="password" type={verPassword ? 'text' : 'password'} autoComplete="current-password"
                  placeholder="Ingresa tu contraseña"
                  value={credentials.password} onChange={handleChange} required />
                <button type="button" className={A.OJO} onClick={() => setVerPassword(!verPassword)}
                  aria-label={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                  {verPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <label className={A.RECORDAR}>
              <input type="checkbox" name="remember" checked={credentials.remember} onChange={handleChange} />
              Recordarme en este dispositivo
            </label>

            <button type="submit" className={A.BTN} disabled={cargando}>
              {cargando ? 'Ingresando...' : 'Ingresar'}
            </button>

            {/* Acceso rápido: solo aparece con npm run dev */}
            {import.meta.env.DEV && (
              <div className={A.DEMO}>
                <p className={A.DEMO_TITULO}>Acceso rápido (solo desarrollo)</p>
                <div className={A.DEMO_BOTONES}>
                  <button type="button" className={A.DEMO_BOTON} onClick={() => setCredentials({ ...credentials, email: 'admin@selloguardian.com', password: 'Admin123*' })}>Admin</button>
                  <button type="button" className={A.DEMO_BOTON} onClick={() => setCredentials({ ...credentials, email: 'civil@selloguardian.com', password: 'Civil123*' })}>Usuario civil</button>
                  <button type="button" className={A.DEMO_BOTON} onClick={() => setCredentials({ ...credentials, email: 'fundacion@selloguardian.com', password: 'Fundacion123*' })}>Fundación</button>
                </div>
              </div>
            )}
          </form>

          <p className={A.PIE}>
            ¿No tienes una cuenta?{' '}
            <Link to="/registro" className={A.ENLACE}>Regístrate aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
