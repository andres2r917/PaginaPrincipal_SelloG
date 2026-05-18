import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // ✅ Quitar Outlet, no se necesita aquí

const RegistroFundacion = () => {

  const [formData, setFormData] = useState({
    nombre: '',
    cc: '',
    representante: '',
    telefono: '',
    ciudad: '',
    email: '',
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
    setError('');
    console.log('Fundación registrada:', formData);
  };

  return (
    <div className="registro-form-side">
      <div className="registro-form-header">
        <h1 className="registro-form-header__title">Registrar Fundación</h1>
        <p className="registro-form-header__sub">Únete a la causa</p>
      </div>

      <form className="registro-form" onSubmit={handleSubmit}>
        <div className="rg-group">
          <label className="rg-label">Nombre de la fundación</label>
          <input name="nombre" type="text" className="rg-input"
            placeholder="Nombre de la fundación"
            value={formData.nombre} onChange={handleChange} required />
        </div>

        <div className="rg-group">
          <label className="rg-label">Número de CC</label>
          <input name="cc" type="text" className="rg-input"
            placeholder="CC"
            value={formData.cc} onChange={handleChange} required />
        </div>

        <div className="rg-group">
          <label className="rg-label">Representante legal</label>
          <input name="representante" type="text" className="rg-input"
            placeholder="Representante legal"
            value={formData.representante} onChange={handleChange} required />
        </div>

        <div className="rg-row">
          <div className="rg-group">
            <label className="rg-label">Teléfono de contacto</label>
            <input name="telefono" type="text" className="rg-input"
              placeholder="Teléfono de contacto"
              value={formData.telefono} onChange={handleChange} required />
          </div>
          <div className="rg-group">
            <label className="rg-label">Ciudad / Dirección</label>
            <input name="ciudad" type="text" className="rg-input"
              placeholder="Ciudad / Dirección"
              value={formData.ciudad} onChange={handleChange} required />
          </div>
        </div>

        <div className="rg-group">
          <label className="rg-label">Correo electrónico</label>
          <input name="email" type="email" className="rg-input"
            placeholder="Correo electrónico"
            value={formData.email} onChange={handleChange} required />
        </div>

        <div className="rg-row">
          <div className="rg-group">
            <label className="rg-label">Contraseña</label>
            <input name="password" type="password" className="rg-input"
              placeholder="Contraseña"
              value={formData.password} onChange={handleChange} required />
          </div>
          <div className="rg-group">
            <label className="rg-label">Confirmar contraseña</label>
            <input name="confirmPassword" type="password" className="rg-input"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword} onChange={handleChange} required />
          </div>
        </div>

        {error && <p className="rg-error">{error}</p>}

        <button type="submit" className="rg-btn">Registrar Fundación</button>
      </form>

      <div className="registro-footer">
        <p>¿Ya tienes cuenta?{' '}
          <Link to="/login" className="registro-footer__link">Inicia sesión aquí</Link>
        </p>
        <p>¿Eres usuario?{' '}
          <Link to="/registro" className="registro-footer__link">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default RegistroFundacion;