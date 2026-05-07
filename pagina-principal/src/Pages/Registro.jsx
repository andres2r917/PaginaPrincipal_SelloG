import React, { useState } from 'react'; // Importamos useState para manejar los datos
import { Link } from 'react-router-dom';
import '../Style/Registro.css';
import logo from '../assets/logo.svg'
import portada from '../assets/portada.jpeg'
const Registro = () => {
  // 1. Definimos el estado para capturar los datos del formulario
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    birthdate: '',
    password: ''
  });

  // 2. Función para actualizar el estado cuando el usuario escribe
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // 3. Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos registrados con éxito:", formData);
    // Aquí conectarías con tu base de datos o API
  };

  return (
    <div className="auth-page">
        
    <div>
     <img className='portada' src={portada} alt="portada"/>
    </div>
        
  <div className="auth-card">
    <header className="auth-card__header">
      <div className="auth-card__logo-container">
        {/* Aquí puedes insertar tu componente de logo o una imagen */}
         <div className='logo-design'>
        <img className='logo' src={logo} alt="logo"/> 
         </div>
      </div>
      <h2 className="auth-card__title">Registrarse</h2>
      <p className="auth-card__subtitle">Únete a la causa</p>
    </header>

    <form className="auth-form" onSubmit={handleSubmit}>
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

      <div className="auth-form__group">
        <label className="auth-form__label">Correo electrónico</label>
        <input 
          name="email" 
          type="email" 
          className="auth-form__input" 
          placeholder="ingresa tu correo" 
          value={formData.email}
          onChange={handleChange} 
          required 
        />
      </div>

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
      </div>

      <div className="auth-form__group">
        <label className="auth-form__label">Contraseña</label>
        <input 
          name="password" 
          type="password" 
          className="auth-form__input" 
          placeholder="ingresa tu contraseña" 
          value={formData.password}
          onChange={handleChange} 
          required 
        />
      </div>

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
}

export default Registro;