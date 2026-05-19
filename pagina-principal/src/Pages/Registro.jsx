import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'; 
import '../Style/Registro.css';
import portada from '../assets/portada.jpeg';

const Registro = () => {
  const location = useLocation();
  //Inicializamos el hook de navegación
  const navigate = useNavigate(); 
  
  const esFundacion = location.pathname === "/registro/registroFundacion";

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    rol: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    console.log('Datos registrados con éxito:', formData);
    navigate('/login'); 
  };

  return (
    <div
      className="registro-page"
      style={{
        backgroundImage: `url(${portada})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="registro-container">

        {/* Imagen lateral */}
        <div className="registro-visual">
          <img src="https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800&h=1000&fit=crop" alt="Perros rescatados" className="registro-visual__img"/>
          <div className="registro-visual__overlay">
            {esFundacion ? (
              <>
                <h2 className="registro-visual__title">Tu fundación puede ser el refugio que miles de animales están esperando</h2>
                <p className="registro-visual__subtitle">
                  Regístrala y empieza a conectar con personas que comparten tu misión.
                </p>
              </>
            ) : (
              <>
                <h2 className="registro-visual__title"> Únete a miles de guardianes que protegen y encuentran hogar para quienes no tienen voz</h2>
                <p className="registro-visual__subtitle">
                  Tu compromiso es el primer paso para cambiar una vida para siempre.
                </p>
              </>
            )}
          </div>
        </div>
      
        {esFundacion ? (
          <Outlet />
        ) : (
          <div className="registro-form-side">
            <div className="registro-form-header">
              <h1 className="registro-form-header__title">Registrarse</h1>
              <p className="registro-form-header__sub">Únete a la causa</p>
            </div>
            <form className="registro-form" onSubmit={handleSubmit}>
              <div className="rg-group">
                <label className="rg-label">Rol</label>
                <div className="rg-dropdown">
                  <span className="rg-dropdown__selected">
                    {formData.rol === 'usuario' ? 'Usuario' : formData.rol === 'fundacion' ? 'Fundación' : 'Selecciona tu rol'}
                  </span>
                  <ul className="rg-dropdown__menu">
                    <li onClick={() => setFormData({ ...formData, rol: 'usuario' })}>Usuario</li>
                    <li>
                      <Link to="registroFundacion">Fundación</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="rg-group">
                <label className="rg-label">Nombre de usuario</label>
                <input name="username" type="text" className="rg-input"
                  placeholder="Nombre y apellidos"
                  value={formData.username} onChange={handleChange} required />
              </div>
              <div className="rg-group">
                <label className="rg-label">Correo electrónico</label>
                <input name="email" type="email" className="rg-input"
                  placeholder="Ingresa tu correo"
                  value={formData.email} onChange={handleChange} required />
              </div>
              <div className="rg-row">
                <div className="rg-group">
                  <label className="rg-label">Contraseña</label>
                  <input name="password" type="password" className="rg-input"
                    placeholder="Ingresa tu contraseña"
                    value={formData.password} onChange={handleChange} required />
                </div>
                <div className="rg-group">
                  <label className="rg-label">Confirmar contraseña</label>
                  <input name="confirmPassword" type="password" className="rg-input"
                    placeholder="Repite tu contraseña"
                    value={formData.confirmPassword} onChange={handleChange} required />
                </div>
              </div>
              {error && <p className="rg-error">{error}</p>}
              <button type="submit" className="rg-btn">Registrarse</button>
            </form>
            <div className="registro-footer">
              <p>¿Ya tienes cuenta?{' '}
                <Link to="/login" className="registro-footer__link">Inicia sesión</Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Registro;