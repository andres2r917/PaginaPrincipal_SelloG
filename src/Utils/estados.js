import { BADGE_COLOR } from './adminEstilos'
// Estados y etiquetas de toda la aplicación: se editan aquí y cambian en todas las pantallas.
// Cada estado trae su texto (txt) y la clase del distintivo (cls) que usan los paneles.

// ── Denuncias (Estado_denuncia) ──
export const ESTADOS_DENUNCIA = ['pendiente', 'verificada', 'en_rescate', 'resuelta', 'descartada']

// "Activos": los que se muestran en la pestaña Activas y en el panel de fundación
export const ESTADOS_ACTIVOS = ['pendiente', 'verificada', 'en_rescate']

// punto: color del indicador en la actividad reciente del dashboard
export const BADGE_DENUNCIA = {
  pendiente: { txt: 'Pendiente', cls: BADGE_COLOR.pendiente, punto: 'pendiente' },
  verificada: { txt: 'Verificada', cls: BADGE_COLOR.exito, punto: 'info' },
  en_rescate: { txt: 'En rescate', cls: BADGE_COLOR.info, punto: 'info' },
  resuelta: { txt: 'Resuelta', cls: BADGE_COLOR.neutro, punto: 'exito' },
  descartada: { txt: 'Descartada', cls: BADGE_COLOR.critico, punto: 'info' },
}

// Tipo_denuncia
export const ETIQUETA_TIPO = {
  maltrato: 'Maltrato físico',
  abandono: 'Abandono',
  trafico: 'Tráfico de animales',
  negligencia: 'Negligencia',
  otro: 'Otro',
}

// ── Fundaciones (Estado_verificacion) ──
export const BADGE_FUNDACION = {
  pendiente: { txt: 'Pendiente', cls: BADGE_COLOR.pendiente },
  verificada: { txt: 'Verificada', cls: BADGE_COLOR.exito },
  rechazada: { txt: 'Rechazada', cls: BADGE_COLOR.critico },
}

// ── Solicitudes de adopción (Estado_solicitud) ──
export const BADGE_SOLICITUD = {
  pendiente: { txt: 'Pendiente', cls: BADGE_COLOR.pendiente },
  en_evaluacion: { txt: 'En evaluación', cls: BADGE_COLOR.neutro },
  aprobada: { txt: 'Aprobada', cls: BADGE_COLOR.exito },
  rechazada: { txt: 'Rechazada', cls: BADGE_COLOR.critico },
}

// ── Mascotas (Estado_adopcion) ──
export const BADGE_MASCOTA = {
  en_cuarentena: { txt: 'En cuarentena', cls: BADGE_COLOR.pendiente },
  disponible: { txt: 'Disponible', cls: BADGE_COLOR.exito },
  en_proceso: { txt: 'En proceso', cls: BADGE_COLOR.info },
  adoptado: { txt: 'Adoptado', cls: BADGE_COLOR.neutro },
}

// Distintivo de un estado; si llega uno desconocido se muestra tal cual
export const distintivo = (mapa, estado) => mapa[estado] ?? { txt: estado, cls: BADGE_COLOR.neutro }
