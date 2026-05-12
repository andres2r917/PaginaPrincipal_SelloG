import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../Style/Denuncia.css';
import portada from '../assets/portada.jpeg';

const Denuncia = () => {
  const [formData, setFormData] = useState({
    tipo: '',
    descripcion: '',
    ubicacion: '',
    anonimo: false,
  });
  const [archivos, setArchivos] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleFiles = (files) => {
    const nuevos = Array.from(files).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
    }));
    setArchivos((prev) => [...prev, ...nuevos]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const eliminarArchivo = (index) => {
    setArchivos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Denuncia enviada:', { ...formData, archivos });
    setEnviado(true);
    setTimeout(() => setEnviado(false), 3000);
  };

  return (
    <div
      className="denuncias-page"
      style={{
        backgroundImage: `url(${portada})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="denuncias-container">

        {/* ── Lado izquierdo: imagen + mensaje ── */}
        <div className="denuncias-visual">
          <img
            src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=1000&fit=crop"
            alt="Animal rescatado"
            className="denuncias-visual__img"
          />
          <div className="denuncias-visual__overlay">
            <h2 className="denuncias-visual__title">
              Ayúdanos a proteger a los que no tienen voz.
            </h2>
            <p className="denuncias-visual__subtitle">
              Tu reporte puede ser anónimo, si quieres eso lo decides tú.
            </p>
          </div>
        </div>

        {/* ── Lado derecho: formulario ── */}
        <div className="denuncias-form-side">
          <div className="denuncias-form-header">
            <h1 className="denuncias-form-header__title">Realiza tu Denuncia</h1>
            <p className="denuncias-form-header__sub">
              Cada denuncia cuenta. Juntos podemos marcar la diferencia.
            </p>
          </div>

          <form className="denuncias-form" onSubmit={handleSubmit}>

            <div className="dn-group">
              <label className="dn-label">Tipo de denuncia</label>
              <select name="tipo" className="dn-input" value={formData.tipo} onChange={handleChange} required>
                <option value="">Selecciona un tipo</option>
                <option value="maltrato">Maltrato físico</option>
                <option value="abandono">Abandono</option>
                <option value="trafico">Tráfico de animales</option>
                <option value="negligencia">Negligencia</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div className="dn-group">
              <label className="dn-label">Descripción de los hechos</label>
              <textarea
                name="descripcion"
                className="dn-input dn-textarea"
                rows="4"
                placeholder="Describe lo que ocurrió con el mayor detalle posible..."
                value={formData.descripcion}
                onChange={handleChange}
                required
              />
            </div>

            <div className="dn-group">
              <label className="dn-label">Ubicación</label>
              <input
                name="ubicacion"
                type="text"
                className="dn-input"
                placeholder="Ej: Calle 68 AN #13-79, Popayán"
                value={formData.ubicacion}
                onChange={handleChange}
              />
            </div>

            <div className="dn-group">
              <label className="dn-label">Sube imágenes o videos</label>
              <div
                className={`dn-dropzone ${dragOver ? 'drag-over' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              >
                <span className="dn-dropzone__icon">☁️</span>
                <p>
                  <span className="dn-dropzone__link">Sube el archivo</span> o arrástralo aquí
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept="image/*,video/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </div>

              {archivos.length > 0 && (
                <div className="dn-preview">
                  {archivos.map((archivo, i) => (
                    <div key={i} className="dn-preview__item">
                      {archivo.type.startsWith('image/') ? (
                        <img src={archivo.url} alt={archivo.name} />
                      ) : (
                        <span className="dn-preview__video">🎥</span>
                      )}
                      <span className="dn-preview__name">{archivo.name}</span>
                      <button
                        type="button"
                        className="dn-preview__remove"
                        onClick={() => eliminarArchivo(i)}
                      >✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="dn-anonimo">
              <input
                type="checkbox"
                name="anonimo"
                id="checkAnonimo"
                checked={formData.anonimo}
                onChange={handleChange}
              />
              <label htmlFor="checkAnonimo">Enviar de forma anónima</label>
            </div>

            <button type="submit" className="dn-btn">
              Enviar denuncia
            </button>
          </form>
        </div>
      </div>

      {enviado && (
        <div className="dn-toast">
          ✅ Denuncia enviada correctamente
        </div>
      )}
    </div>
  );
};

export default Denuncia;