import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import '../Style/Login.css';
import portada from '../assets/portada.jpeg';

const Login = () => {
  const location = useLocation();
  // Inicializamos el hook de navegación
  const navigate = useNavigate(); 
  
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Iniciando sesión con:', credentials);navigate('/perfil'); 
  };
  return (
    <div className="login-page"
      style={{
        backgroundImage: `url(${portada})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
      <div className="login-container">
        <div className="login-visual">
          <img src="https://images.pexels.com/photos/3628100/pexels-photo-3628100.jpeg?cs=srgb&dl=pexels-edd1egalaxy-3628100.jpg&fm=jpg"alt="Voluntario con perro rescatado"className="login-visual__img"/>
          <div className="login-visual__overlay">
            <h2 className="login-visual__title">Tu compromiso cambia vidas.</h2>
            <p className="login-visual__subtitle">
              Cada ingreso nos acerca un paso más a encontrar el hogar perfecto para quienes más lo necesitan.
            </p>
          </div>
        </div>
        <div className="login-form-side">
          <div className="login-form-header">
            <div className="login-brand"></div>
            <h1 className="login-form-header__title">Iniciar Sesión</h1>
            <p className="login-form-header__sub">
              Bienvenido de nuevo a nuestra comunidad de rescate.
            </p>
          </div>
          <form className="login-form" onSubmit={handleSubmit}>
            {mensajeExito && (
              <div className="rg-error" style={{ backgroundColor: '#d4edda', color: '#155724', borderColor: '#c3e6cb', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center' }}>
                {mensajeExito}
              </div>
            )}
            <div className="lg-group">
              <label className="lg-label">Correo electrónico</label>
              <input
                name="email"
                type="email"
                className="lg-input"
                placeholder="Ingresar correo"
                value={credentials.email}
                onChange={handleChange}
                required/>
                </div>
            <div className="lg-group">
              <div className="lg-label-row">
                <label className="lg-label">Contraseña</label>
                <a href="#" className="lg-forgot">¿Olvidaste tu contraseña?</a>
              </div>
              <input
                name="password"
                type="password"
                className="lg-input"
                placeholder="Ingresar contraseña"
                value={credentials.password}
                onChange={handleChange}
                required/>
            </div>
            <div className="lg-remember">
              <input
                type="checkbox"
                name="remember"
                id="remember"
                checked={credentials.remember}
                onChange={handleChange}
              />
              <label htmlFor="remember">Recordarme en este dispositivo</label>
            </div>

            <button type="submit" className="lg-btn">
              Ingresar
            </button>
          </form>
          <div className="login-footer">
            <p>
              ¿No tienes una cuenta?{' '}
              <Link to="/registro" className="login-footer__link">Regístrate aquí</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;