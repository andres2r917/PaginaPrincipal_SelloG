import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Style/Denuncia.css';
import portada from '../assets/portada.jpeg';

// ─── Leaflet (instalarlo con: npm install leaflet) ───────────────────────────
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Ícono verde personalizado (igual al HTML/CSS)
const iconoVerde = L.divIcon({
  className: '',
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="48" viewBox="0 0 36 48">
      <path d="M18 0C8.06 0 0 8.06 0 18c0 12.44 18 30 18 30S36 30.44 36 18C36 8.06 27.94 0 18 0z"
        fill="#25f070"/>
      <circle cx="18" cy="18" r="7" fill="#ffffff" opacity="0.95"/>
    </svg>
  `,
  iconSize:   [36, 48],
  iconAnchor: [18, 48],
  popupAnchor:[0, -48],
});

// Coordenadas por defecto: Popayán, Colombia
const DEFAULT_LAT = 2.4419;
const DEFAULT_LNG = -76.6069;

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

  // ── Estado del mapa ──
  const [busqueda, setBusqueda] = useState('');
  const [coordenadas, setCoordenadas] = useState({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
  const [ubicacionError, setUbicacionError] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [usandoUbicacion, setUsandoUbicacion] = useState(false);

  const mapRef = useRef(null);       // referencia al div del mapa
  const mapInstanceRef = useRef(null); // instancia de L.map
  const markerRef = useRef(null);    // marcador actual
  const fileInputRef = useRef(null);

  // ── Inicializar mapa ──────────────────────────────────────────────────────
  useEffect(() => {
    if (mapInstanceRef.current) return; // ya inicializado

    const map = L.map(mapRef.current, {
      center: [DEFAULT_LAT, DEFAULT_LNG],
      zoom: 14,
    });

    // Tile oscuro estilo CartoDB Dark Matter (igual al HTML)
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
      }
    ).addTo(map);

    // Marcador inicial con ícono verde
    const marker = L.marker([DEFAULT_LAT, DEFAULT_LNG], { draggable: true, icon: iconoVerde }).addTo(map);
    markerRef.current = marker;

    // Al arrastrar el marcador → actualizar dirección
    marker.on('dragend', async () => {
      const { lat, lng } = marker.getLatLng();
      setCoordenadas({ lat, lng });
      await actualizarDireccionDesdeCoords(lat, lng);
    });

    // Al hacer clic en el mapa → mover marcador
    map.on('click', async (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      setCoordenadas({ lat, lng });
      await actualizarDireccionDesdeCoords(lat, lng);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // ── Mover marcador cuando cambien las coordenadas ─────────────────────────
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current) return;
    markerRef.current.setLatLng([coordenadas.lat, coordenadas.lng]);
    mapInstanceRef.current.flyTo([coordenadas.lat, coordenadas.lng], 16, { duration: 1.2 });
  }, [coordenadas]);

  // ── Geocodificación inversa (coords → dirección) ──────────────────────────
  const actualizarDireccionDesdeCoords = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=es`
      );
      const data = await res.json();
      const dir = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      setBusqueda(dir);
      setFormData((prev) => ({ ...prev, ubicacion: dir }));
    } catch {
      setBusqueda(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      setFormData((prev) => ({ ...prev, ubicacion: `${lat.toFixed(5)}, ${lng.toFixed(5)}` }));
    }
  };

  // ── Buscar dirección (texto → coords) ─────────────────────────────────────
  const handleBuscar = async () => {
    if (!busqueda.trim()) return;
    setBuscando(true);
    setUbicacionError('');
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(busqueda)}&limit=1&accept-language=es`
      );
      const data = await res.json();
      if (data.length === 0) {
        setUbicacionError('No se encontró la dirección. Intenta con otra búsqueda.');
        return;
      }
      const { lat, lon, display_name } = data[0];
      setCoordenadas({ lat: parseFloat(lat), lng: parseFloat(lon) });
      setBusqueda(display_name);
      setFormData((prev) => ({ ...prev, ubicacion: display_name }));
    } catch {
      setUbicacionError('Error al buscar la dirección. Verifica tu conexión.');
    } finally {
      setBuscando(false);
    }
  };

  // Enter para buscar
  const handleBuscarKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBuscar();
    }
  };

  // ── Usar ubicación actual del dispositivo ─────────────────────────────────
  const handleUbicacionActual = () => {
    if (!navigator.geolocation) {
      setUbicacionError('Tu navegador no soporta geolocalización.');
      return;
    }
    setUsandoUbicacion(true);
    setUbicacionError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoordenadas({ lat: latitude, lng: longitude });
        await actualizarDireccionDesdeCoords(latitude, longitude);
        setUsandoUbicacion(false);
      },
      (error) => {
        setUsandoUbicacion(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setUbicacionError('Permiso denegado. Activa la ubicación en tu navegador.');
            break;
          case error.POSITION_UNAVAILABLE:
            setUbicacionError('Ubicación no disponible en este momento.');
            break;
          case error.TIMEOUT:
            setUbicacionError('Tiempo de espera agotado. Intenta de nuevo.');
            break;
          default:
            setUbicacionError('Error al obtener la ubicación.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // ── Handlers del formulario ───────────────────────────────────────────────
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
    console.log('Denuncia enviada:', { ...formData, coordenadas, archivos });
    setEnviado(true);
    setTimeout(() => setEnviado(false), 3000);
  };

  // ─────────────────────────────────────────────────────────────────────────
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

        {/* ── Lado izquierdo ── */}
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

            {/* Tipo */}
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

            {/* Descripción */}
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

            {/* ── UBICACIÓN CON MAPA ── */}
            <div className="dn-group">
              <label className="dn-label">Ubicación</label>

              {/* Barra de búsqueda */}
              <div className="dn-ubicacion-search">
                <span className="dn-ubicacion-search__icon">🔍</span>
                <input
                  type="text"
                  className="dn-ubicacion-search__input"
                  placeholder="Busca una dirección o haz clic en el mapa..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  onKeyDown={handleBuscarKeyDown}
                />
                <button
                  type="button"
                  className="dn-ubicacion-search__btn"
                  onClick={handleBuscar}
                  disabled={buscando}
                >
                  {buscando ? '...' : 'Buscar'}
                </button>
              </div>

              {/* Botón ubicación actual */}
              <button
                type="button"
                className="dn-btn-ubicacion-actual"
                onClick={handleUbicacionActual}
                disabled={usandoUbicacion}
              >
                {usandoUbicacion ? (
                  <>⏳ Obteniendo ubicación...</>
                ) : (
                  <>📍 Usar mi ubicación actual</>
                )}
              </button>

              {/* Error de ubicación */}
              {ubicacionError && (
                <p className="dn-ubicacion-error">{ubicacionError}</p>
              )}

              {/* Mapa */}
              <div
                ref={mapRef}
                className="dn-mapa"
                style={{ height: '260px', width: '100%', borderRadius: '10px', marginTop: '10px', zIndex: 0 }}
              />
              <p className="dn-mapa-hint">
                Haz clic en el mapa o arrastra el marcador para ajustar la ubicación.
              </p>
            </div>

            {/* Archivos */}
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

            {/* Anónimo */}
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