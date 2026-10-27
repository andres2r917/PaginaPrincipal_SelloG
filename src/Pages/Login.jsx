import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaPaw } from 'react-icons/fa';
import { FiAlertCircle, FiCheckCircle, FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi';
import '../Style/Login.css';
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
    <div className="acceso-page">
      <div className="acceso-card">
        <div className="acceso-visual">
          <img className="acceso-visual__img" src={FOTO} alt="" />
          <div className="acceso-visual__overlay">
            <span className="acceso-visual__chip"><FaPaw /> Sello Guardián</span>
            <h2 className="acceso-visual__title">Tu compromiso cambia vidas.</h2>
            <p className="acceso-visual__subtitle">
              Cada ingreso nos acerca un paso más a encontrar el hogar perfecto para quienes más lo necesitan.
            </p>
          </div>
        </div>

        <div className="acceso-panel">
          <header className="acceso-header">
            <h1>Bienvenido de nuevo</h1>
            <p>Inicia sesión para denunciar, adoptar y seguir tus casos.</p>
          </header>

          <form className="acceso-form" onSubmit={handleSubmit}>
            {mensajeExito && (
              <div className="acceso-aviso acceso-aviso--ok" role="status"><FiCheckCircle /> {mensajeExito}</div>
            )}
            {error && (
              <div className="acceso-aviso acceso-aviso--error" role="alert"><FiAlertCircle /> {error}</div>
            )}

            <div className="acceso-grupo">
              <label className="acceso-label" htmlFor="email">Correo electrónico</label>
              <div className="acceso-campo">
                <FiMail />
                <input id="email" name="email" type="email" autoComplete="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={credentials.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="acceso-grupo">
              <div className="acceso-label-fila">
                <label className="acceso-label" htmlFor="password">Contraseña</label>
                <a href="#" className="acceso-enlace">¿Olvidaste tu contraseña?</a>
              </div>
              <div className="acceso-campo">
                <FiLock />
                <input id="password" name="password" type={verPassword ? 'text' : 'password'} autoComplete="current-password"
                  placeholder="Ingresa tu contraseña"
                  value={credentials.password} onChange={handleChange} required />
                <button type="button" className="acceso-ojo" onClick={() => setVerPassword(!verPassword)}
                  aria-label={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                  {verPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <label className="acceso-recordar">
              <input type="checkbox" name="remember" checked={credentials.remember} onChange={handleChange} />
              Recordarme en este dispositivo
            </label>

            <button type="submit" className="acceso-btn" disabled={cargando}>
              {cargando ? 'Ingresando...' : 'Ingresar'}
            </button>

            {/* Acceso rápido: solo aparece con npm run dev */}
            {import.meta.env.DEV && (
              <div className="acceso-demo">
                <p className="acceso-demo__titulo">Acceso rápido (solo desarrollo)</p>
                <div className="acceso-demo__botones">
                  <button type="button" onClick={() => setCredentials({ ...credentials, email: 'admin@selloguardian.com', password: 'Admin123*' })}>Admin</button>
                  <button type="button" onClick={() => setCredentials({ ...credentials, email: 'civil@selloguardian.com', password: 'Civil123*' })}>Usuario civil</button>
                  <button type="button" onClick={() => setCredentials({ ...credentials, email: 'fundacion@selloguardian.com', password: 'Fundacion123*' })}>Fundación</button>
                </div>
              </div>
            )}
          </form>

          <p className="acceso-pie">
            ¿No tienes una cuenta?{' '}
            <Link to="/registro" className="acceso-enlace">Regístrate aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
