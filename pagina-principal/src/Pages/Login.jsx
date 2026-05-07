import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Style/Login.css';
import portada from '../assets/portada.jpeg'
import logo from '../assets/logo.svg'
const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Iniciando sesión:", credentials);
  };

  return (
    <div className="login-page"> 
    <div>
      <img className='portada' src={portada} alt="portada"/>
    </div>
      <div className="login-card">
        <header className="login-card__brand">
          <div className='logo-design'>
         <img className='logo' src={logo} alt="logo"/> 
          </div>
          <h2 className="login-card__title">Iniciar Sesión</h2>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form__group">
            <label className="login-form__label">Correo electrónico</label>
            <input
              name="email"
              type="email"
              className="login-form__input"
              placeholder="ingresar correo"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="login-form__group">
            <label className="login-form__label">Contraseña</label>
            <input
              name="password"
              type="password"
              className="login-form__input"
              placeholder="ingresar contraseña"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="login-form__btn">
            Ingresar
          </button>
        </form>

        <footer className="login-card__footer">
          <p>
            ¿No tienes una cuenta?{' '}
            <Link to="/registro" className="nav-item">Regístrate aquí</Link>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Login;