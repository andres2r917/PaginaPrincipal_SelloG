import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaPaw } from 'react-icons/fa';
import { FiAlertCircle, FiArrowLeft, FiChevronRight, FiEye, FiEyeOff, FiHeart, FiHome, FiLock, FiMail, FiUser } from 'react-icons/fi';
import * as A from '../Utils/accesoEstilos.js'; // estilos compartidos con el login
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
    <div className={A.PAGINA} style={A.FONDO_PAGINA}>
      <div className={A.TARJETA}>

        {/* Foto lateral */}
        <div className={A.VISUAL}>
          <img className={A.VISUAL_IMG} src={esFundacion ? FOTO_FUNDACION : FOTO_USUARIO} alt="" />
          <div className={A.VISUAL_CAPA}>
            <span className={A.VISUAL_CHIP}><FaPaw /> Sello Guardián</span>
            {esFundacion ? (
              <>
                <h2 className={A.VISUAL_TITULO}>Tu fundación puede ser el refugio que miles de animales están esperando</h2>
                <p className={A.VISUAL_SUBTITULO}>
                  Regístrala y empieza a conectar con personas que comparten tu misión.
                </p>
              </>
            ) : (
              <>
                <h2 className={A.VISUAL_TITULO}>Únete a miles de guardianes que protegen y encuentran hogar para quienes no tienen voz</h2>
                <p className={A.VISUAL_SUBTITULO}>
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
          <div className={A.PANEL}>
            <header className={A.CABECERA}>
              <h1 className={A.H1}>Crea tu cuenta</h1>
              <p className={A.CABECERA_TEXTO}>¿Cómo quieres unirte a Sello Guardián?</p>
            </header>

            <div className={A.ROLES}>
              <button type="button" className={A.ROL} onClick={() => setTipo('usuario')}>
                <span className={A.ROL_ICONO}><FiHeart /></span>
                <span>
                  <strong className={A.ROL_TITULO}>Quiero adoptar y ayudar</strong>
                  <small className={A.ROL_TEXTO}>Adopta, denuncia casos de maltrato y sigue tu actividad.</small>
                </span>
                <FiChevronRight className={A.ROL_FLECHA} />
              </button>

              <Link to="registroFundacion" className={A.ROL}>
                <span className={A.ROL_ICONO}><FiHome /></span>
                <span>
                  <strong className={A.ROL_TITULO}>Represento una fundación</strong>
                  <small className={A.ROL_TEXTO}>Publica animales, atiende denuncias y gestiona adopciones.</small>
                </span>
                <FiChevronRight className={A.ROL_FLECHA} />
              </Link>
            </div>

            <p className={A.PIE}>
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className={A.ENLACE}>Inicia sesión</Link>
            </p>
          </div>
        ) : (
          /* Paso 2: datos de la persona */
          <div className={A.PANEL}>
            <button type="button" className={A.VOLVER} onClick={() => { setTipo(null); setError(''); }}>
              <FiArrowLeft /> Cambiar tipo de cuenta
            </button>

            <header className={A.CABECERA}>
              <h1 className={A.H1}>Crea tu cuenta</h1>
              <p className={A.CABECERA_TEXTO}>Solo necesitas unos datos para empezar.</p>
            </header>

            <form className={A.FORM} onSubmit={handleSubmit}>
              <div className={A.GRUPO}>
                <label className={A.LABEL} htmlFor="username">Nombre completo</label>
                <div className={A.CAMPO}>
                  <FiUser />
                  <input className={A.INPUT} id="username" name="username" type="text" autoComplete="name"
                    placeholder="Nombre y apellidos"
                    value={formData.username} onChange={handleChange} required />
                </div>
              </div>

              <div className={A.GRUPO}>
                <label className={A.LABEL} htmlFor="email">Correo electrónico</label>
                <div className={A.CAMPO}>
                  <FiMail />
                  <input className={A.INPUT} id="email" name="email" type="email" autoComplete="email"
                    placeholder="tucorreo@ejemplo.com"
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

              {error && <div className={A.AVISO_ERROR} role="alert"><FiAlertCircle /> {error}</div>}

              <button type="submit" className={A.BTN}>Crear mi cuenta</button>
            </form>

            <p className={A.PIE}>
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className={A.ENLACE}>Inicia sesión</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Registro;
