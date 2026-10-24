import {
  FaMapMarkerAlt, FaPhoneAlt, FaPaw, FaUserSecret, FaUser,
  FaRoute, FaMapMarkedAlt, FaCheckCircle, FaRegClock, FaImages
} from 'react-icons/fa';
import { tiempoRelativo } from '../../Utils/tiempoRelativo';
import { crearUrlRuta } from '../../Utils/urlRuta';
import './DenunciaCard.css';

const ETIQUETAS_URGENCIA = {
  alta: 'Urgencia alta',
  media: 'Urgencia media',
  baja: 'Urgencia baja'
};

const ETIQUETAS_ESTADO = {
  abierta: 'Abierta',
  en_proceso: 'En proceso',
  resuelta: 'Resuelta'
};

/*
  Tarjeta de denuncia compartida entre Home y la página Denuncia.
  - variante 'resumen'  → Home (botón "Ver detalles")
  - variante 'completa' → Denuncia (mapa, cómo llegar, línea de emergencia)
*/
export default function DenunciaCard({
  denuncia,
  variante = 'completa',
  telefonoEmergencia,
  onVerMapa,
  onVerDetalles,
  resaltada = false
}) {
  const {
    id, titulo, tipo, urgencia, estado, verificada, anonima,
    autor, descripcion, direccion, lat, lng, fecha
  } = denuncia;

  // Soporta tanto array de strings (evidencia) como array de objetos (evidencias: [{url}])
  const listaEvidencias = Array.isArray(denuncia.evidencia) && denuncia.evidencia.length > 0
    ? denuncia.evidencia
    : (Array.isArray(denuncia.evidencias) ? denuncia.evidencias : []);

  const primeraEvidencia = listaEvidencias[0];
  const foto = typeof primeraEvidencia === 'string'
    ? primeraEvidencia
    : (primeraEvidencia?.url || null);

  const totalEvidencias = listaEvidencias.length;

  const esResumen = variante === 'resumen';
  const nombreAutor = anonima ? 'Denuncia anónima' : (autor || denuncia.reportadoPor?.nombre || 'Usuario registrado');
  const direccionFinal = direccion || denuncia.ubicacion || '';
  const latFinal = lat ?? denuncia.latitud ?? null;
  const lngFinal = lng ?? denuncia.longitud ?? null;
  const urgenciaClave = (urgencia || 'media').toLowerCase();
  const estaVerificada = Boolean(verificada || estado === 'verificada');

  // Enlace a indicaciones: usa coordenadas si existen, si no la dirección escrita
  const urlComoLlegar = crearUrlRuta(latFinal, lngFinal, direccionFinal);

  const telefonoLimpio = telefonoEmergencia ? telefonoEmergencia.replace(/[^\d+]/g, '') : null;

  return (
    <article
      id={`denuncia-${id}`}
      className={`dc-card dc-card--${variante}${resaltada ? ' dc-card--resaltada' : ''}`}
    >
      <div className="dc-media">
        {foto ? (
          <img src={foto} alt={`Evidencia: ${titulo || tipo}`} loading="lazy" />
        ) : (
          <div className="dc-media-vacio" aria-hidden="true"><FaPaw /></div>
        )}
        {totalEvidencias > 1 && (
          <span className="dc-media-contador">
            <FaImages aria-hidden="true" /> {totalEvidencias}
          </span>
        )}
      </div>

      <div className="dc-body">
        <div className="dc-etiquetas">
          <span className={`dc-badge dc-badge--urgencia-${urgenciaClave}`}>
            {ETIQUETAS_URGENCIA[urgenciaClave] || 'Urgencia'}
          </span>
          {titulo && <span className="dc-badge dc-badge--tipo">{tipo}</span>}
          {(estado === 'en_proceso' || estado === 'en_rescate') && (
            <span className="dc-badge dc-badge--proceso">{ETIQUETAS_ESTADO.en_proceso}</span>
          )}
          {estado === 'resuelta' && (
            <span className="dc-badge dc-badge--resuelta">{ETIQUETAS_ESTADO.resuelta}</span>
          )}
          <span className={`dc-badge ${estaVerificada ? 'dc-badge--verificada' : 'dc-badge--pendiente'}`}>
            {estaVerificada && <FaCheckCircle aria-hidden="true" />}
            {estaVerificada ? 'Verificada por el equipo' : 'Sin verificar aún'}
          </span>
        </div>

        <h3 className="dc-titulo">{titulo || tipo}</h3>

        <p className="dc-meta">
          {anonima ? <FaUserSecret aria-hidden="true" /> : <FaUser aria-hidden="true" />}
          <span>{nombreAutor}</span>
          <span className="dc-meta-sep" aria-hidden="true">·</span>
          <FaRegClock aria-hidden="true" />
          <span>{tiempoRelativo(fecha)}</span>
        </p>

        <p className="dc-descripcion">{descripcion}</p>

        <p className="dc-ubicacion">
          <FaMapMarkerAlt aria-hidden="true" />
          <span>{direccionFinal}</span>
        </p>

        <div className="dc-acciones">
          {esResumen ? (
            <>
              <button
                type="button"
                className="dc-btn dc-btn--primario"
                onClick={() => onVerDetalles && onVerDetalles(id)}
              >
                Ver detalles
              </button>
              <a className="dc-btn dc-btn--secundario" href={urlComoLlegar} target="_blank" rel="noopener noreferrer">
                <FaRoute aria-hidden="true" /> Cómo llegar
              </a>
            </>
          ) : (
            <>
              {onVerMapa && (
                <button type="button" className="dc-btn dc-btn--primario" onClick={() => onVerMapa(denuncia)}>
                  <FaMapMarkedAlt aria-hidden="true" /> Ver en el mapa
                </button>
              )}
              <a className="dc-btn dc-btn--secundario" href={urlComoLlegar} target="_blank" rel="noopener noreferrer">
                <FaRoute aria-hidden="true" /> Cómo llegar
              </a>
              {telefonoLimpio && estado !== 'resuelta' && (
                <a className="dc-btn dc-btn--emergencia" href={`tel:${telefonoLimpio}`}>
                  <FaPhoneAlt aria-hidden="true" /> Línea de emergencia
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
}
