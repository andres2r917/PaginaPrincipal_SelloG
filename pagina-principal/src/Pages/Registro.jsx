import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Style/Registro.css';
import logo from '../assets/logo.svg';
import portada from '../assets/portada.jpeg';
const Registro = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    birthdate: '',
    rol: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!formData.rol) {
      setError('Por favor selecciona un rol.');
      return;
    }

    setError('');
    console.log("Datos registrados con éxito:", formData);
    // Aquí conectarías con tu base de datos o API
  };

  return (
    <div className="auth-page">
      <div>
        <img className="portada" src={portada} alt="portada" />
      </div>

      <div className="auth-card">
        <header className="auth-card__header">
          <div className="auth-card__logo-container">
            <div className="logo-design">
              <img className="logo" src={logo} alt="logo" />
            </div>
          </div>
          <h2 className="auth-card__title">Registrarse</h2>
          <p className="auth-card__subtitle">Únete a la causa</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>

          {/* ROL */}
          <div className="auth-form__group">
            <label className="auth-form__label">Rol</label>
            <select
              name="rol"
              className="auth-form__input auth-form__select"
              value={formData.rol}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona tu rol</option>
              <option value="usuario">Usuario</option>
              <option value="fundacion">Fundación</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          {/* NOMBRE */}
          <div className="auth-form__group">
            <label className="auth-form__label">Nombre de usuario</label>
            <input
              name="username"
              type="text"
              className="auth-form__input"
              placeholder="Nombre y apellidos"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* CORREO */}
          <div className="auth-form__group">
            <label className="auth-form__label">Correo electrónico</label>
            <input
              name="email"
              type="email"
              className="auth-form__input"
              placeholder="Ingresa tu correo"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* TELÉFONO + FECHA DE NACIMIENTO */}
          <div className="auth-form__row">
            <div className="auth-form__group">
              <label className="auth-form__label">Teléfono</label>
              <input
                name="phone"
                type="tel"
                className="auth-form__input"
                placeholder="+57"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="auth-form__group">
              <label className="auth-form__label">Fecha de nacimiento</label>
              <input
                name="birthdate"
                type="date"
                className="auth-form__input"
                value={formData.birthdate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* CONTRASEÑA */}
          <div className="auth-form__group">
            <label className="auth-form__label">Contraseña</label>
            <input
              name="password"
              type="password"
              className="auth-form__input"
              placeholder="Ingresa tu contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* CONFIRMAR CONTRASEÑA */}
          <div className="auth-form__group">
            <label className="auth-form__label">Confirmar contraseña</label>
            <input
              name="confirmPassword"
              type="password"
              className="auth-form__input"
              placeholder="Repite tu contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* MENSAJE DE ERROR */}
          {error && <p className="auth-form__error">{error}</p>}

          <button type="submit" className="auth-form__submit-btn">
            Registrarse
          </button>
        </form>

        <footer className="auth-card__footer">
          <span className="auth-card__footer-text">¿Ya tienes cuenta?</span>{' '}
          <Link to="/login" className="auth-card__link">Inicia sesión</Link>
        </footer>
      </div>
    </div>
  );
};

export default Registro;