import { FiLoader, FiMapPin, FiSearch, FiUploadCloud, FiVideo, FiX } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import * as E from '../../Utils/denunciaEstilos.js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { crearCapaBase } from '../../Utils/mapaBase.js';
import { crearIconoPatica } from '../../Utils/iconoPatica.js';

const DEFAULT_LAT = 2.4419;
const DEFAULT_LNG = -76.6069;

// Zona de Popayán (izquierda, arriba, derecha, abajo). Se usa como preferencia en la búsqueda.
const POPAYAN_VIEWBOX = '-76.70,2.52,-76.52,2.38';

const ICONO_PATICA = crearIconoPatica('#7C3AED');

const FORM_INITIAL_STATE = {
  tipo:        '',
  urgencia:    'Media',
  descripcion: '',
  anonimo:     false,
};


// Arma una dirección corta (calle, número, barrio, ciudad) en vez del texto largo de Nominatim.
// Si no hay suficientes datos, usa el texto completo.
const formatearDireccion = (direccion, textoCompleto) => {
  if (!direccion) return textoCompleto;

  const calle = [direccion.road, direccion.house_number].filter(Boolean).join(' ');
  const partes = [
    calle,
    direccion.neighbourhood || direccion.suburb,
    direccion.city || direccion.town || direccion.village,
    direccion.state,
  ].filter(Boolean);

  return partes.length >= 2 ? partes.join(', ') : textoCompleto;
};

const fetchDireccionDesdeCoords = async (lat, lng) => {
  try {
    // zoom=18 pide el detalle a nivel de calle y número
    const res  = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=es`
    );
    const data = await res.json();
    return formatearDireccion(data.address, data.display_name) || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
};

//Hook: mapa Leaflet 

const useLeafletMap = (coordenadas, setCoordenadas, onDireccionChange) => {
  const mapRef      = useRef(null);
  const mapInstance = useRef(null);
  const markerRef   = useRef(null);
  const setCoordenadasRef = useRef(setCoordenadas);
  const onDireccionChangeRef = useRef(onDireccionChange);

  useEffect(() => {
    setCoordenadasRef.current = setCoordenadas;
    onDireccionChangeRef.current = onDireccionChange;
  }, [setCoordenadas, onDireccionChange]);

  useEffect(() => {
    if (mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [DEFAULT_LAT, DEFAULT_LNG],
      zoom:   14,
    });

    crearCapaBase().addTo(map);

    const marker = L.marker([DEFAULT_LAT, DEFAULT_LNG], {
      draggable: true,
      icon:      ICONO_PATICA,
    }).addTo(map);

    markerRef.current = marker;

    const handlePosChange = async (lat, lng) => {
      setCoordenadasRef.current({ lat, lng });
      const dir = await fetchDireccionDesdeCoords(lat, lng);
      onDireccionChangeRef.current(dir, lat, lng);
    };

    marker.on('dragend', () => {
      const { lat, lng } = marker.getLatLng();
      handlePosChange(lat, lng);
    });

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      handlePosChange(lat, lng);
    });

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !markerRef.current) return;
    markerRef.current.setLatLng([coordenadas.lat, coordenadas.lng]);
    mapInstance.current.flyTo([coordenadas.lat, coordenadas.lng], 18, { duration: 1.2 });
  }, [coordenadas]);

  return mapRef;
};

// Selector de ubicación: buscador de direcciones, "usar mi ubicación" y mapa con la patica.
// Lo usan el formulario público y el panel de fundación; avisa con onCambio({ ubicacion, latitud, longitud }).
export const SelectorUbicacion = ({ onCambio, oscuro = false }) => {
  const [busqueda,        setBusqueda]        = useState('');
  const [coordenadas,     setCoordenadas]     = useState({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
  const [ubicacionError,  setUbicacionError]  = useState('');
  const [buscando,        setBuscando]        = useState(false);
  const [usandoUbicacion, setUsandoUbicacion] = useState(false);

  // Muestra la dirección en el buscador y avisa al formulario con la dirección y las coordenadas elegidas
  const handleDireccionChange = (dir, lat, lng) => {
    setBusqueda(dir);
    onCambio({ ubicacion: dir, latitud: lat, longitud: lng });
  };

  const mapRef = useLeafletMap(coordenadas, setCoordenadas, handleDireccionChange);

  const handleBuscar = async () => {
    if (!busqueda.trim()) return;
    setBuscando(true);
    setUbicacionError('');

    try {
      // Si no escribió la ciudad, se agrega: la plataforma opera en Popayán
      const consulta = /popay[aá]n/i.test(busqueda) ? busqueda : `${busqueda}, Popayán, Cauca`;

      const res  = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(consulta)}&limit=1&addressdetails=1&countrycodes=co&viewbox=${POPAYAN_VIEWBOX}&accept-language=es`
      );
      const data = await res.json();

      if (data.length === 0) {
        setUbicacionError('No se encontró la dirección. Intenta con otra búsqueda o haz clic en el mapa.');
        return;
      }

      const { lat, lon, display_name, address } = data[0];
      setCoordenadas({ lat: parseFloat(lat), lng: parseFloat(lon) });
      handleDireccionChange(formatearDireccion(address, display_name), parseFloat(lat), parseFloat(lon));
    } catch {
      setUbicacionError('Error al buscar la dirección. Verifica tu conexión.');
    } finally {
      setBuscando(false);
    }
  };

  const handleBuscarKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBuscar();
    }
  };

  const handleUbicacionActual = () => {
    if (!navigator.geolocation) {
      setUbicacionError('Tu navegador no soporta geolocalización.');
      return;
    }

    setUsandoUbicacion(true);
    setUbicacionError('');

    // Se escucha la posición unos segundos y se conserva la lectura más precisa
    let mejor = null;
    let idVigilancia = null;
    let temporizador = null;

    const terminar = async () => {
      navigator.geolocation.clearWatch(idVigilancia);
      clearTimeout(temporizador);

      if (!mejor) {
        setUsandoUbicacion(false);
        return;
      }

      const { latitude, longitude, accuracy } = mejor;
      setCoordenadas({ lat: latitude, lng: longitude });
      const dir = await fetchDireccionDesdeCoords(latitude, longitude);
      handleDireccionChange(dir, latitude, longitude);

      // Un computador sin GPS suele dar solo una ubicación aproximada (por Wi-Fi o IP)
      if (accuracy > 100) {
        setUbicacionError(`Ubicación aproximada (±${Math.round(accuracy)} m). Arrastra el pin para ajustarla.`);
      }
      setUsandoUbicacion(false);
    };

    idVigilancia = navigator.geolocation.watchPosition(
      ({ coords }) => {
        if (!mejor || coords.accuracy < mejor.accuracy) {
          mejor = coords;
        }
        // Con 25 m o menos ya es suficiente: no hace falta esperar más
        if (coords.accuracy <= 25) {
          terminar();
        }
      },
      (error) => {
        // Si ya hubo alguna lectura, se usa; si no, se muestra el error
        if (mejor) {
          terminar();
          return;
        }
        navigator.geolocation.clearWatch(idVigilancia);
        clearTimeout(temporizador);
        setUsandoUbicacion(false);
        const mensajes = {
          [error.PERMISSION_DENIED]:    'Permiso denegado. Activa la ubicación en tu navegador.',
          [error.POSITION_UNAVAILABLE]: 'Ubicación no disponible en este momento.',
          [error.TIMEOUT]:              'Tiempo de espera agotado. Intenta de nuevo.',
        };
        setUbicacionError(mensajes[error.code] ?? 'Error al obtener la ubicación.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    // Máximo 8 segundos escuchando
    temporizador = setTimeout(terminar, 8000);
  };

  return (
    <>
    <div className={oscuro ? E.BUSQUEDA_OSCURA : E.BUSQUEDA_CLARA}>
      <span className={E.BUSQUEDA_ICONO}><FiSearch /></span>
      <input
        type="text"
        className={oscuro ? E.BUSQUEDA_CAMPO_OSCURO : E.BUSQUEDA_CAMPO_CLARO}
        placeholder="Busca una dirección o haz clic en el mapa..." aria-label="Busca una dirección o haz clic en el mapa..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        onKeyDown={handleBuscarKeyDown}
      />
      <button
        type="button"
        className={E.BTN_BUSCAR}
        onClick={handleBuscar}
        disabled={buscando}
      >
        {buscando ? '...' : 'Buscar'}
      </button>
    </div>

    <button
      type="button"
      className={E.BTN_UBICACION}
      onClick={handleUbicacionActual}
      disabled={usandoUbicacion}
    >
      {usandoUbicacion ? <><FiLoader /> Obteniendo ubicación...</> : <><FiMapPin /> Usar mi ubicación actual</>}
    </button>

    {ubicacionError && (
      <p className={E.UBICACION_ERROR}>{ubicacionError}</p>
    )}

    <div ref={mapRef} className={E.MAPA} />
    <p className={E.MAPA_AYUDA}>
      Haz clic en el mapa o arrastra el marcador para ajustar la ubicación.
    </p>
    </>
  );
};

const DenunciaFormulario = ({ onEnviar }) => {
  const [formData,        setFormData]        = useState(FORM_INITIAL_STATE);
  const [archivos,        setArchivos]        = useState([]);
  // Dirección y coordenadas elegidas en el SelectorUbicacion
  const [ubicacion,       setUbicacion]       = useState({ ubicacion: '', latitud: DEFAULT_LAT, longitud: DEFAULT_LNG });
  const [dragOver,        setDragOver]        = useState(false);
  const [enviando,        setEnviando]        = useState(false);

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    // Se entrega la denuncia a la página, que la manda a la API y cierra el acordeón.
    // Los archivos van como File: la API guarda cada uno y crea su evidencia.
    await onEnviar({
      tipo:        formData.tipo,
      urgencia:    formData.urgencia,
      descripcion: formData.descripcion,
      ubicacion:   ubicacion.ubicacion,
      latitud:     ubicacion.latitud,
      longitud:    ubicacion.longitud,
      anonima:     formData.anonimo,
      archivos:    archivos.map((a) => a.file),
    });
    setEnviando(false);
  };

  const agregarArchivos = (files) => {
    const nuevos = Array.from(files).map((file) => ({
      file,
      name: file.name,
      url:  URL.createObjectURL(file),
      type: file.type,
      size: file.size,
    }));
    setArchivos((prev) => [...prev, ...nuevos]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    agregarArchivos(e.dataTransfer.files);
  };

  const eliminarArchivo = (index) => {
    setArchivos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
      <div className={E.CONTENEDOR}>
        <div className={E.VISUAL}>
          <img
            src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=1000&fit=crop"
            alt="Animal rescatado"
            className={E.VISUAL_IMG}/>
          <div className={E.VISUAL_CAPA}>
            <h2 className={E.VISUAL_TITULO}>
              Ayúdanos a proteger a los que no tienen voz.
            </h2>
            <p className={E.VISUAL_SUBTITULO}>
              Tu reporte puede ser anónimo, si quieres eso lo decides tú.
            </p>
          </div>
        </div>
        <div className={E.LADO}>
          <div className={E.CABECERA}>
            <h1 className={E.H1}>Realiza tu Denuncia</h1>
            <p className={E.CABECERA_TEXTO}>
              Cada denuncia cuenta. Juntos podemos marcar la diferencia.
            </p>
          </div>

          <form className={E.FORM} onSubmit={handleSubmit}>

            {/* Tipo de denuncia */}
            <div className={E.GRUPO}>
              <label className={E.LABEL} htmlFor="dn-tipo">Tipo de denuncia</label>
              <select id="dn-tipo"
                name="tipo"
                className={E.INPUT}
                value={formData.tipo}
                onChange={handleChange}
                required>
                <option value="">Selecciona un tipo</option>
                <option value="maltrato">Maltrato físico</option>
                <option value="abandono">Abandono</option>
                <option value="trafico">Tráfico de animales</option>
                <option value="negligencia">Negligencia</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            {/* Urgencia: ayuda a la comunidad y a las fundaciones a priorizar los casos */}
            <div className={E.GRUPO}>
              <label className={E.LABEL} htmlFor="dn-urgencia">Nivel de urgencia</label>
              <select id="dn-urgencia"
                name="urgencia"
                className={E.INPUT}
                value={formData.urgencia}
                onChange={handleChange}>
                <option value="Alta">Alta: el animal está en peligro ahora</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>

            <div className={E.GRUPO}>
              <label className={E.LABEL} htmlFor="dn-descripcion">Descripción de los hechos</label>
              <textarea id="dn-descripcion"
                name="descripcion"
                className={E.TEXTAREA}
                rows="4"
                placeholder="Describe lo que ocurrió con el mayor detalle posible..." aria-label="Describe lo que ocurrió con el mayor detalle posible..."
                value={formData.descripcion}
                onChange={handleChange}
                required
              />
            </div>
            <div className={E.GRUPO}>
              <span className={E.LABEL}>Ubicación</span>

              <SelectorUbicacion onCambio={setUbicacion} />
            </div>

            {/* Archivos */}
            <div className={E.GRUPO}>
              <span className={E.LABEL}>Sube imágenes o videos</span>
              <div
                className={dragOver ? E.DROPZONE_ARRASTRANDO : E.DROPZONE_REPOSO}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              >
                <span className={E.DROPZONE_ICONO}><FiUploadCloud /></span>
                <p className={E.DROPZONE_TEXTO}>
                  <span className={E.DROPZONE_ENLACE}>Sube el archivo</span> o arrástralo aquí
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) => agregarArchivos(e.target.files)}
                />
              </div>

              {archivos.length > 0 && (
                <div className={E.PREVIEW}>
                  {archivos.map((archivo, i) => (
                    <div key={i} className={E.PREVIEW_ITEM}>
                      {archivo.type.startsWith('image/') ? (
                        <img className={E.PREVIEW_IMG} src={archivo.url} alt={archivo.name} />
                      ) : (
                        <span className={E.PREVIEW_VIDEO}><FiVideo /></span>
                      )}
                      <span className={E.PREVIEW_NOMBRE}>{archivo.name}</span>
                      <button
                        type="button"
                        className={E.PREVIEW_QUITAR}
                        onClick={() => eliminarArchivo(i)}
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Anónimo */}
            <div className={E.ANONIMO}>
              <input
                type="checkbox"
                className={E.ANONIMO_CHECK}
                name="anonimo"
                id="checkAnonimo"
                checked={formData.anonimo}
                onChange={handleChange}
              />
              <label htmlFor="checkAnonimo">Enviar de forma anónima</label>
            </div>

            <button type="submit" className={E.BTN_ENVIAR} disabled={enviando}>
              {enviando ? 'Enviando...' : 'Enviar denuncia'}
            </button>
          </form>
        </div>
      </div>
  );
};

export default DenunciaFormulario;
