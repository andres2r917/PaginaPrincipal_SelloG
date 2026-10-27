import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaPaw } from 'react-icons/fa';
import { FiAlertCircle, FiArrowLeft, FiChevronRight, FiEye, FiEyeOff, FiHeart, FiHome, FiLock, FiMail, FiUser } from 'react-icons/fi';
import '../Style/Login.css'; // estilos base compartidos con el login
import '../Style/Registro.css';
import { registrarCivil } from '../Services/authService.js';

// Fotos del panel lateral: una para personas y otra para fundaciones
const FOTO_USUARIO = 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=1000&h=1200&fit=crop';
const FOTO_FUNDACION = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1000&h=1200&fit=crop';

const Registro = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const esFundacion = location.pathname === '/registro/registroFundacion';

  // null = todavía no elige el tipo de cuenta; 'usuario' = formulario de persona
  const [tipo, setTipo] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [verPassword, setVerPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setError('');
    try {
      // Cuenta de usuario civil: el perfil se completa en el primer ingreso
      await registrarCivil({
        nombre: formData.username,
        email: formData.email,
        password: formData.password,
      });
      navigate('/login', { state: { mensajeExito: 'Cuenta creada. Ya puedes iniciar sesión.' } });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="acceso-page">
      <div className="acceso-card">

        {/* Foto lateral */}
        <div className="acceso-visual">
          <img className="acceso-visual__img" src={esFundacion ? FOTO_FUNDACION : FOTO_USUARIO} alt="" />
          <div className="acceso-visual__overlay">
            <span className="acceso-visual__chip"><FaPaw /> Sello Guardián</span>
            {esFundacion ? (
              <>
                <h2 className="acceso-visual__title">Tu fundación puede ser el refugio que miles de animales están esperando</h2>
                <p className="acceso-visual__subtitle">
                  Regístrala y empieza a conectar con personas que comparten tu misión.
                </p>
              </>
            ) : (
              <>
                <h2 className="acceso-visual__title">Únete a miles de guardianes que protegen y encuentran hogar para quienes no tienen voz</h2>
                <p className="acceso-visual__subtitle">
                  Tu compromiso es el primer paso para cambiar una vida para siempre.
                </p>
              </>
            )}
          </div>
        </div>

        {esFundacion ? (
          <Outlet />
        ) : tipo === null ? (
          /* Paso 1: elegir el tipo de cuenta */
          <div className="acceso-panel">
            <header className="acceso-header">
              <h1>Crea tu cuenta</h1>
              <p>¿Cómo quieres unirte a Sello Guardián?</p>
            </header>

            <div className="registro-roles">
              <button type="button" className="registro-rol" onClick={() => setTipo('usuario')}>
                <span className="registro-rol__icono"><FiHeart /></span>
                <span>
                  <strong>Quiero adoptar y ayudar</strong>
                  <small>Adopta, denuncia casos de maltrato y sigue tu actividad.</small>
                </span>
                <FiChevronRight className="registro-rol__flecha" />
              </button>

              <Link to="registroFundacion" className="registro-rol">
                <span className="registro-rol__icono"><FiHome /></span>
                <span>
                  <strong>Represento una fundación</strong>
                  <small>Publica animales, atiende denuncias y gestiona adopciones.</small>
                </span>
                <FiChevronRight className="registro-rol__flecha" />
              </Link>
            </div>

            <p className="acceso-pie">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="acceso-enlace">Inicia sesión</Link>
            </p>
          </div>
        ) : (
          /* Paso 2: datos de la persona */
          <div className="acceso-panel">
            <button type="button" className="registro-volver" onClick={() => { setTipo(null); setError(''); }}>
              <FiArrowLeft /> Cambiar tipo de cuenta
            </button>

            <header className="acceso-header">
              <h1>Crea tu cuenta</h1>
              <p>Solo necesitas unos datos para empezar.</p>
            </header>

            <form className="acceso-form" onSubmit={handleSubmit}>
              <div className="acceso-grupo">
                <label className="acceso-label" htmlFor="username">Nombre completo</label>
                <div className="acceso-campo">
                  <FiUser />
                  <input id="username" name="username" type="text" autoComplete="name"
                    placeholder="Nombre y apellidos"
                    value={formData.username} onChange={handleChange} required />
                </div>
              </div>

              <div className="acceso-grupo">
                <label className="acceso-label" htmlFor="email">Correo electrónico</label>
                <div className="acceso-campo">
                  <FiMail />
                  <input id="email" name="email" type="email" autoComplete="email"
                    placeholder="tucorreo@ejemplo.com"
                    value={formData.email} onChange={handleChange} required />
                </div>
              </div>

              <div className="acceso-fila">
                <div className="acceso-grupo">
                  <label className="acceso-label" htmlFor="password">Contraseña</label>
                  <div className="acceso-campo">
                    <FiLock />
                    <input id="password" name="password" type={verPassword ? 'text' : 'password'} autoComplete="new-password"
                      placeholder="Mínimo 8 caracteres" minLength={8}
                      value={formData.password} onChange={handleChange} required />
                    <button type="button" className="acceso-ojo" onClick={() => setVerPassword(!verPassword)}
                      aria-label={verPassword ? 'Ocultar contraseñas' : 'Mostrar contraseñas'}>
                      {verPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div className="acceso-grupo">
                  <label className="acceso-label" htmlFor="confirmPassword">Confirmar contraseña</label>
                  <div className="acceso-campo">
                    <FiLock />
                    <input id="confirmPassword" name="confirmPassword" type={verPassword ? 'text' : 'password'} autoComplete="new-password"
                      placeholder="Repite tu contraseña"
                      value={formData.confirmPassword} onChange={handleChange} required />
                  </div>
                </div>
              </div>

              {error && <div className="acceso-aviso acceso-aviso--error" role="alert"><FiAlertCircle /> {error}</div>}

              <button type="submit" className="acceso-btn">Crear mi cuenta</button>
            </form>

            <p className="acceso-pie">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="acceso-enlace">Inicia sesión</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Registro;
