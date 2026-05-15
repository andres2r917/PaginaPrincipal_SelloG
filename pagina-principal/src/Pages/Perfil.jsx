import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Style/Perfil.css';
import portada from '../assets/portada.jpeg';

const Perfil = () => {

  const [formData, setFormData] = useState({
    documento: '',
    fechaNacimiento: '',
    tipoVivienda: '',
    ocupacion: '',
    salario: '',
    telefono: '',
    hijos: '',
    foto: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, foto: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Perfil actualizado:', formData);
  };

  return (
    <div className="perfil-page">

      {/* FONDO */}
      <div className="port">
        <img className="portada" src={portada} alt="portada" />
      </div>

      {/* OVERLAY */}
      <div className="perfil-overlay" />

      {/* CONTENIDO */}
      <div className="perfil-wrapper">

        {/* ── CARD ── */}
        <div className="perfil-card">
          <h1 className="perfil-titulo">Completa tu perfil</h1>
          <p className="perfil-subtitulo">
            Cuéntanos un poco más sobre ti para garantizar
            un proceso de adopción seguro y responsable.
          </p>

          <form className="perfil-form" onSubmit={handleSubmit}>

            {/* ── FOTO ── */}
            <div className="foto-wrap">
              <div className="foto-circulo">
                <div className="foto-preview">
                  {preview
                    ? <img src={preview} alt="Vista previa" />
                    : <span className="material-symbols-outlined foto-icono">foto</span>
                  }
                </div>
                <label className="foto-btn">
                  <span className="material-symbols-outlined">+</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFoto}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
              <span className="foto-texto">Subir foto de perfil</span>
            </div>

            {/* ── DOCUMENTO + FECHA ── */}
            <div className="perfil-fila">
              <div className="perfil-grupo">
                <label className="perfil-label">Documento de identidad</label>
                <input
                  name="documento"
                  type="text"
                  placeholder="Número de documento"
                  value={formData.documento}
                  onChange={handleChange}
                  className="perfil-input"
                  required
                />
              </div>
              <div className="perfil-grupo">
                <label className="perfil-label">Fecha de nacimiento</label>
                <input
                  name="fechaNacimiento"
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  className="perfil-input"
                  required
                />
              </div>
            </div>

            {/* ── TIPO VIVIENDA + OCUPACIÓN ── */}
            <div className="perfil-fila">
              <div className="perfil-grupo">
                <label className="perfil-label">Tipo de vivienda</label>
                <select
                  name="tipoVivienda"
                  value={formData.tipoVivienda}
                  onChange={handleChange}
                  className="perfil-input perfil-select"
                  required
                >
                  <option value="">Selecciona...</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="casa">Casa</option>
                  <option value="finca">Finca</option>
                </select>
              </div>
              <div className="perfil-grupo">
                <label className="perfil-label">Ocupación</label>
                <input
                  name="ocupacion"
                  type="text"
                  placeholder="Ej. Ingeniero, Docente..."
                  value={formData.ocupacion}
                  onChange={handleChange}
                  className="perfil-input"
                />
              </div>
            </div>

            {/* ── SALARIO + TELÉFONO ── */}
            <div className="perfil-fila">
              <div className="perfil-grupo">
                <label className="perfil-label">Salario aproximado</label>
                <div className="perfil-input-icono">
                  <span className="material-symbols-outlined"></span>
                  <input
                    name="salario"
                    type="text"
                    placeholder="$ 0 COP"
                    value={formData.salario}
                    onChange={handleChange}
                    className="perfil-input"
                  />
                </div>
              </div>
              <div className="perfil-grupo">
                <label className="perfil-label">Teléfono</label>
                <div className="perfil-input-icono">
                  <span className="material-symbols-outlined"></span>
                  <input
                    name="telefono"
                    type="tel"
                    placeholder="+57 300 000 0000"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="perfil-input"
                  />
                </div>
              </div>
            </div>

            {/* ── ¿TIENE HIJOS? ── */}
            <div className="perfil-grupo">
              <label className="perfil-label">¿Tienes hijos?</label>
              <div className="hijos-opciones">
                <label className="hijos-opcion">
                  <input
                    type="radio"
                    name="hijos"
                    value="si"
                    checked={formData.hijos === 'si'}
                    onChange={handleChange}
                  />
                  <div className="hijos-card">
                    <span className="material-symbols-outlined"></span>
                    <span>Sí</span>
                  </div>
                </label>
                <label className="hijos-opcion">
                  <input
                    type="radio"
                    name="hijos"
                    value="no"
                    checked={formData.hijos === 'no'}
                    onChange={handleChange}
                  />
                  <div className="hijos-card">
                    <span className="material-symbols-outlined"></span>
                    <span>No</span>
                  </div>
                </label>
              </div>
            </div>

            {/* ── BOTONES ── */}
            <div className="perfil-botones">
              <button type="submit" className="btn-completar">
                Completar Perfil
              </button>
              <Link to="/home" className="btn-omitir">
                Omitir por ahora
              </Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Perfil;