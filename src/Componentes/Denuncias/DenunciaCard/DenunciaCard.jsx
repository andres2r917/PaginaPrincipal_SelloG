import {
  FaMapMarkerAlt, FaPhoneAlt, FaPaw, FaUserSecret, FaUser,
  FaRoute, FaMapMarkedAlt, FaCheckCircle, FaRegClock, FaImages
} from 'react-icons/fa';
import { tiempoRelativo } from '../../../Utils/tiempoRelativo';
import { crearUrlRuta } from '../../../Utils/urlRuta';

// Estilos con Tailwind. Los colores de la marca salen de @theme (index.css)
const CARD =
  'grid grid-cols-1 overflow-hidden rounded-2xl border bg-[#162033] text-texto-claro transition-[translate,border-color,box-shadow] duration-200 ease-[ease] hover:-translate-y-0.5 hover:border-[rgba(196,181,253,0.4)] motion-reduce:transition-none'
const CARD_NORMAL = 'border-[rgba(196,181,253,0.18)] shadow-[0_8px_24px_rgba(2,6,23,0.35)]'
// Cuando se llega desde "Ver detalles" en Home, la tarjeta se resalta
const CARD_RESALTADA =
  'border-acento shadow-[0_0_0_2px_rgba(196,181,253,0.45),0_12px_32px_rgba(124,58,237,0.35)] animate-[dcPulso_1.6s_ease-out_1] motion-reduce:animate-none'
// En móvil (720px o menos) la foto pasa arriba; en pantallas grandes va a un lado
const CARD_COLUMNAS = {
  resumen: 'min-[721px]:grid-cols-[260px_minmax(0,1fr)]',
  completa: 'min-[721px]:grid-cols-[300px_minmax(0,1fr)]',
}
const MEDIA = 'relative min-h-[190px] bg-fondo min-[721px]:min-h-[220px]'
const MEDIA_IMG = 'absolute inset-0 block h-full w-full object-cover'
const MEDIA_VACIO =
  'absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,#1E1B4B,var(--color-fondo))] text-[3rem] text-[rgba(196,181,253,0.35)]'
const MEDIA_CONTADOR =
  'absolute right-[10px] bottom-[10px] inline-flex items-center gap-[6px] rounded-full bg-[rgba(15,23,42,0.88)] px-[10px] py-1 text-[0.75rem] font-semibold text-texto-claro'
const CUERPO = 'flex min-w-0 flex-col gap-[0.6rem] px-[1.1rem] py-4 min-[721px]:px-6 min-[721px]:py-5'
const ETIQUETAS = 'flex flex-wrap gap-2'
const TITULO = 'mt-[0.15rem] text-[1.3rem] leading-[1.25] font-bold text-white'
const FILA = 'flex flex-wrap items-center gap-[0.4rem] text-[0.85rem] text-[#A9B4C8]'
const UBICACION = `${FILA} [&>svg]:shrink-0 [&>svg]:text-[#FB7185]`
const META_SEP = 'opacity-60'
const DESCRIPCION = 'text-[0.98rem] leading-[1.55] text-texto-claro'
// Etiquetas: siempre fondo oscuro/translúcido con texto claro (regla de contraste)
const BADGE =
  'inline-flex items-center gap-[6px] rounded-full border px-[10px] py-1 text-[0.72rem] font-bold tracking-[0.02em] whitespace-nowrap'
const BADGE_COLOR = {
  'urgencia-alta': 'border-[rgba(225,29,72,0.45)] bg-[rgba(225,29,72,0.18)] text-peligro-claro',
  'urgencia-media': 'border-[rgba(245,158,11,0.45)] bg-[rgba(245,158,11,0.16)] text-[#FCD34D]',
  'urgencia-baja': 'border-[rgba(16,185,129,0.45)] bg-[rgba(16,185,129,0.16)] text-exito-claro',
  tipo: 'border-[rgba(196,181,253,0.4)] bg-[rgba(124,58,237,0.28)] text-[#EDE9FE]',
  proceso: 'border-[rgba(59,130,246,0.45)] bg-[rgba(59,130,246,0.18)] text-[#BFDBFE]',
  resuelta: 'border-[rgba(148,163,184,0.4)] bg-[rgba(148,163,184,0.18)] text-[#E2E8F0]',
  verificada: 'border-[rgba(16,185,129,0.45)] bg-[rgba(16,185,129,0.16)] text-exito-claro',
  pendiente: 'border-[rgba(148,163,184,0.35)] bg-[rgba(148,163,184,0.14)] text-texto-suave',
}
const ACCIONES = 'mt-auto flex flex-wrap gap-[0.6rem] pt-[0.6rem]'
const BTN =
  'inline-flex cursor-pointer items-center gap-2 rounded-[10px] border px-4 py-[9px] text-[0.88rem] font-bold no-underline [font-family:inherit] transition-[background-color,border-color,translate] duration-200 ease-[ease] hover:-translate-y-px focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-acento motion-reduce:transition-none'
const BTN_PRIMARIO = `${BTN} border-transparent bg-primario text-white hover:bg-primario-oscuro`
const BTN_SECUNDARIO = `${BTN} border-[rgba(196,181,253,0.4)] bg-transparent text-[#E9E5FF] hover:bg-[rgba(196,181,253,0.12)]`
// Texto oscuro sobre verde para que se lea bien
const BTN_EMERGENCIA = `${BTN} border-transparent bg-exito text-[#04261A] hover:bg-[#34D399]`

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
      className={`${CARD} ${CARD_COLUMNAS[variante] ?? CARD_COLUMNAS.completa} ${resaltada ? CARD_RESALTADA : CARD_NORMAL}`}
    >
      <div className={MEDIA}>
        {foto ? (
          <img className={MEDIA_IMG} src={foto} alt={`Evidencia: ${titulo || tipo}`} loading="lazy" />
        ) : (
          <div className={MEDIA_VACIO} aria-hidden="true"><FaPaw /></div>
        )}
        {totalEvidencias > 1 && (
          <span className={MEDIA_CONTADOR}>
            <FaImages aria-hidden="true" /> {totalEvidencias}
          </span>
        )}
      </div>

      <div className={CUERPO}>
        <div className={ETIQUETAS}>
          <span className={`${BADGE} ${BADGE_COLOR[`urgencia-${urgenciaClave}`] ?? ''}`}>
            {ETIQUETAS_URGENCIA[urgenciaClave] || 'Urgencia'}
          </span>
          {titulo && <span className={`${BADGE} ${BADGE_COLOR.tipo}`}>{tipo}</span>}
          {(estado === 'en_proceso' || estado === 'en_rescate') && (
            <span className={`${BADGE} ${BADGE_COLOR.proceso}`}>{ETIQUETAS_ESTADO.en_proceso}</span>
          )}
          {estado === 'resuelta' && (
            <span className={`${BADGE} ${BADGE_COLOR.resuelta}`}>{ETIQUETAS_ESTADO.resuelta}</span>
          )}
          <span className={`${BADGE} ${estaVerificada ? BADGE_COLOR.verificada : BADGE_COLOR.pendiente}`}>
            {estaVerificada && <FaCheckCircle aria-hidden="true" />}
            {estaVerificada ? 'Verificada por el equipo' : 'Sin verificar aún'}
          </span>
        </div>

        <h3 className={TITULO}>{titulo || tipo}</h3>

        <p className={FILA}>
          {anonima ? <FaUserSecret aria-hidden="true" /> : <FaUser aria-hidden="true" />}
          <span>{nombreAutor}</span>
          <span className={META_SEP} aria-hidden="true">·</span>
          <FaRegClock aria-hidden="true" />
          <span>{tiempoRelativo(fecha)}</span>
        </p>

        <p className={`${DESCRIPCION}${esResumen ? ' line-clamp-3' : ''}`}>{descripcion}</p>

        <p className={UBICACION}>
          <FaMapMarkerAlt aria-hidden="true" />
          <span>{direccionFinal}</span>
        </p>

        <div className={ACCIONES}>
          {esResumen ? (
            <>
              <button
                type="button"
                className={BTN_PRIMARIO}
                onClick={() => onVerDetalles && onVerDetalles(id)}
              >
                Ver detalles
              </button>
              <a className={BTN_SECUNDARIO} href={urlComoLlegar} target="_blank" rel="noopener noreferrer">
                <FaRoute aria-hidden="true" /> Cómo llegar
              </a>
            </>
          ) : (
            <>
              {onVerMapa && (
                <button type="button" className={BTN_PRIMARIO} onClick={() => onVerMapa(denuncia)}>
                  <FaMapMarkedAlt aria-hidden="true" /> Ver en el mapa
                </button>
              )}
              <a className={BTN_SECUNDARIO} href={urlComoLlegar} target="_blank" rel="noopener noreferrer">
                <FaRoute aria-hidden="true" /> Cómo llegar
              </a>
              {telefonoLimpio && estado !== 'resuelta' && (
                <a className={BTN_EMERGENCIA} href={`tel:${telefonoLimpio}`}>
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
