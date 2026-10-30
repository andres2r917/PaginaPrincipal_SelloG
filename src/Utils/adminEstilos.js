// Clases de Tailwind de las tablas, formularios y ventanas modales de los paneles
// de Administración y de Fundación. Los colores de la marca salen de @theme (index.css).

// ── Encabezado de página, avisos y textos ──
export const PAGE_HEADER = 'mb-6 flex flex-wrap items-center justify-between gap-4'
export const AVISO =
  'mx-0 mt-0 mb-3.5 rounded-[10px] border border-[rgba(225,29,72,0.5)] bg-[rgba(225,29,72,0.15)] px-3.5 py-2.5 text-[14px] text-[#fecdd3]'
export const VACIO = 'mx-0 mt-0 mb-3.5 text-[14px] text-texto-suave'
export const SUBTITULO = 'mt-1 text-[14px] text-[rgba(241,245,249,0.6)]'
export const FILTROS = 'my-4 flex flex-wrap gap-2'

// ── Tabla ──
export const TABLA_WRAP =
  'overflow-hidden rounded-2xl border border-[rgba(124,58,237,0.22)] bg-[rgba(15,23,42,0.75)] backdrop-blur-[10px]'
export const TABLA =
  'w-full border-collapse ' +
  '[&_thead_th]:border-b [&_thead_th]:border-b-[rgba(124,58,237,0.2)] [&_thead_th]:px-[1.2rem] [&_thead_th]:py-4 [&_thead_th]:text-left [&_thead_th]:text-[0.75rem] [&_thead_th]:tracking-[0.04em] [&_thead_th]:text-[rgba(248,250,252,0.55)] [&_thead_th]:uppercase ' +
  '[&_tbody_td]:border-b [&_tbody_td]:border-b-[rgba(124,58,237,0.1)] [&_tbody_td]:px-[1.2rem] [&_tbody_td]:py-[0.9rem] [&_tbody_td]:text-[0.88rem] [&_tbody_td]:text-texto ' +
  '[&_tbody_tr:last-child_td]:border-b-0 [&_tbody_tr:hover]:bg-[rgba(124,58,237,0.06)]'
export const CELDA_VACIA = 'p-8 text-center text-[rgba(241,245,249,0.5)]'

// ── Distintivos de estado (los colores se eligen en utils/estados.js) ──
export const BADGE = 'inline-block rounded-full px-[0.7rem] py-1 text-[0.72rem] font-extrabold'
export const BADGE_COLOR = {
  exito: 'bg-[rgba(16,185,129,0.15)] text-exito',
  pendiente: 'bg-[rgba(245,158,11,0.15)] text-aviso',
  critico: 'bg-[rgba(225,29,72,0.15)] text-peligro',
  info: 'bg-[rgba(124,58,237,0.15)] text-acento',
  neutro: 'bg-[rgba(248,250,252,0.1)] text-[rgba(248,250,252,0.7)]',
}

// ── Botones de acción dentro de la tabla ──
export const ACCIONES = 'flex gap-2'
const ACCION_BASE =
  'flex size-8 cursor-pointer items-center justify-center rounded-lg border transition-[background] duration-[180ms] ease-[ease]'
export const ACCION_BTN = `${ACCION_BASE} border-[rgba(124,58,237,0.3)] bg-[rgba(124,58,237,0.1)] text-acento hover:bg-[rgba(124,58,237,0.25)]`
export const ACCION_APROBAR = `${ACCION_BASE} border-[rgba(16,185,129,0.3)] bg-[rgba(124,58,237,0.1)] text-exito hover:bg-[rgba(16,185,129,0.15)]`
export const ACCION_RECHAZAR = `${ACCION_BASE} border-[rgba(225,29,72,0.3)] bg-[rgba(124,58,237,0.1)] text-peligro hover:bg-[rgba(225,29,72,0.15)]`

// ── Pestañas (Usuarios) ──
export const TABS = 'mb-[1.2rem] flex gap-2 border-b border-[rgba(124,58,237,0.18)]'
const TAB_BASE =
  'cursor-pointer border-0 border-b-2 bg-transparent px-[1.1rem] py-[0.7rem] text-[0.9rem] font-bold hover:text-acento'
export const TAB_REPOSO = `${TAB_BASE} border-b-transparent text-[rgba(248,250,252,0.6)]`
export const TAB_ACTIVA = `${TAB_BASE} border-b-primario text-white`

// ── Formulario (Configuración) ──
export const FORM =
  'flex max-w-[560px] flex-col gap-[1.2rem] rounded-2xl border border-[rgba(124,58,237,0.22)] bg-[rgba(15,23,42,0.75)] px-[1.7rem] py-6 backdrop-blur-[10px]'
export const FORM_GROUP =
  'flex flex-col gap-[0.4rem] [&_label]:text-[0.82rem] [&_label]:font-bold [&_label]:text-[rgba(248,250,252,0.75)]'
export const INPUT =
  'rounded-[10px] border border-[rgba(124,58,237,0.25)] bg-[rgba(124,58,237,0.08)] px-[0.9rem] py-[0.65rem] text-[0.88rem] text-white outline-none focus:border-acento focus-visible:outline-none'
export const TOGGLE_ROW =
  'flex items-center justify-between py-[0.4rem] [&_span]:text-[0.88rem] [&_span]:font-semibold'
const TOGGLE_BASE =
  'relative h-6 w-[42px] cursor-pointer rounded-full border border-[rgba(124,58,237,0.35)] p-0'
export const toggle = (activo) => `${TOGGLE_BASE} ${activo ? 'bg-primario' : 'bg-[rgba(124,58,237,0.2)]'}`
export const toggleBolita = (activo) =>
  `absolute top-0.5 left-[3px] size-[18px] rounded-full bg-white transition-[transform] duration-[180ms] ease-[ease] ${
    activo ? '[transform:translateX(17px)]' : ''
  }`
export const SAVE_BTN =
  'flex cursor-pointer items-center gap-2 self-start rounded-[10px] border-0 bg-primario px-6 py-[0.7rem] text-[0.88rem] font-extrabold text-white hover:bg-acento hover:text-fondo'

// ── Mascotas del admin ──
export const MASCOTA_CELDA = 'flex items-center gap-3'
export const MASCOTA_NOMBRE = 'block text-texto'
export const MASCOTA_SUB = 'text-[11px] text-[rgba(241,245,249,0.5)]'
export const MASCOTA_MINI = 'size-10 rounded-lg object-cover'
export const MASCOTA_MINI_VACIA =
  'size-10 rounded-lg object-cover flex items-center justify-center bg-[rgba(124,58,237,0.2)] text-acento'
export const MASCOTA_FOTO =
  'mb-4 overflow-hidden rounded-xl border border-[rgba(124,58,237,0.25)] [&_img]:block [&_img]:h-60 [&_img]:w-full [&_img]:object-cover'
export const DETALLE_NOTA = 'mt-1 block text-[12px] text-[rgba(241,245,249,0.5)]'

// ── Ventana modal ──
export const MODAL_FONDO =
  'fixed inset-0 z-[1000] flex items-center justify-center bg-[rgba(11,18,36,0.78)] p-6 backdrop-blur-[6px] animate-[adminModalFadeIn_0.2s_ease-out]'
const MODAL_BASE =
  'flex max-h-[90vh] w-full flex-col overflow-hidden rounded-[20px] border border-[rgba(124,58,237,0.35)] bg-[#111827] text-texto shadow-[0_24px_60px_rgba(0,0,0,0.65),0_0_0_1px_rgba(196,181,253,0.1)] animate-[adminModalScaleUp_0.22s_cubic-bezier(0.16,1,0.3,1)]'
export const MODAL = `${MODAL_BASE} max-w-[760px]`
export const MODAL_LG = `${MODAL_BASE} max-w-[860px]`
export const MODAL_CABECERA =
  'flex items-center justify-between border-b border-[rgba(124,58,237,0.2)] bg-[rgba(15,23,42,0.9)] px-7 py-5'
export const MODAL_CABECERA_IZQ = 'flex flex-wrap items-center gap-[0.85rem]'
export const MODAL_TITULO = 'm-0 text-[1.35rem] font-extrabold text-white'
export const MODAL_CERRAR =
  'flex size-9 cursor-pointer items-center justify-center rounded-full border border-[rgba(124,58,237,0.25)] bg-[rgba(124,58,237,0.12)] text-[1.1rem] text-acento transition-all duration-[180ms] ease-[ease] hover:border-[rgba(225,29,72,0.4)] hover:bg-[rgba(225,29,72,0.2)] hover:text-peligro-claro hover:[transform:rotate(90deg)]'
export const MODAL_CUERPO = 'flex flex-col gap-6 overflow-y-auto px-7 py-6'
export const MODAL_GRID = 'grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-[1.1rem]'
export const DETALLE_ITEM =
  'flex flex-col gap-[0.3rem] rounded-xl border border-[rgba(124,58,237,0.18)] bg-[rgba(15,23,42,0.6)] px-4 py-[0.85rem]'
export const DETALLE_LABEL =
  'text-[0.75rem] font-bold tracking-[0.05em] text-[rgba(196,181,253,0.7)] uppercase'
export const DETALLE_VALOR = 'text-[0.95rem] font-semibold text-texto [word-break:break-word]'
export const MODAL_SECCION =
  'flex flex-col gap-2 rounded-[14px] border border-[rgba(124,58,237,0.18)] bg-[rgba(15,23,42,0.6)] px-5 py-[1.1rem]'
export const MODAL_SECCION_TITULO =
  'm-0 text-[0.85rem] font-extrabold tracking-[0.05em] text-acento uppercase'
export const MODAL_TEXTO = 'm-0 text-[0.95rem] leading-[1.6] text-texto-suave'
export const MODAL_GALERIA = 'flex gap-4 overflow-x-auto pb-2'
export const MODAL_GALERIA_IMG =
  'h-[150px] w-[220px] shrink-0 cursor-pointer rounded-xl border border-[rgba(124,58,237,0.3)] object-cover shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-[transform] duration-200 ease-[ease] hover:border-acento hover:[transform:scale(1.03)]'
export const MODAL_PIE =
  'flex flex-wrap items-center justify-between gap-3 border-t border-[rgba(124,58,237,0.2)] bg-[rgba(15,23,42,0.9)] px-7 py-[1.2rem]'
export const MODAL_ACCIONES_IZQ = 'flex flex-wrap items-center gap-[0.6rem]'
export const MODAL_TEXTAREA =
  'mt-2 box-border w-full resize-y rounded-[10px] border border-[rgba(196,181,253,0.3)] bg-fondo px-3 py-2.5 text-white [font:inherit] focus:outline-2 focus:outline-offset-1 focus:outline-primario'
export const MODAL_MEDIA =
  'mt-2.5 grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2.5 [&_:is(img,video)]:h-[120px] [&_:is(img,video)]:w-full [&_:is(img,video)]:rounded-[10px] [&_:is(img,video)]:bg-fondo [&_:is(img,video)]:object-cover'

// Botones del pie de las ventanas
const BTN_BASE =
  'inline-flex cursor-pointer items-center gap-[0.45rem] rounded-[10px] px-5 py-[0.65rem] text-[0.88rem] font-bold no-underline transition-all duration-[180ms] ease-[ease] disabled:cursor-not-allowed disabled:opacity-60'
export const BTN_PRIMARIO = `${BTN_BASE} border-0 bg-primario text-white hover:bg-primario-oscuro hover:text-white hover:[transform:translateY(-1px)]`
export const BTN_EXITO = `${BTN_BASE} border border-[rgba(16,185,129,0.4)] bg-[rgba(16,185,129,0.18)] text-exito-claro hover:bg-exito hover:text-fondo`
export const BTN_PELIGRO = `${BTN_BASE} border border-[rgba(225,29,72,0.4)] bg-[rgba(225,29,72,0.18)] text-peligro-claro hover:bg-peligro hover:text-white`
export const BTN_SECUNDARIO = `${BTN_BASE} border border-[rgba(124,58,237,0.3)] bg-[rgba(124,58,237,0.14)] text-acento hover:bg-[rgba(124,58,237,0.25)] hover:text-white`

// Etiquetas de salud (vacunado, esterilizado, desparasitado)
export const ETIQUETAS = 'mt-1.5 flex flex-wrap gap-2'
const ETIQUETA_BASE =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-bold transition-all duration-[180ms] ease-[ease] select-none'
const ETIQUETA_COLOR = {
  vacunado: 'border-[rgba(16,185,129,0.45)] bg-[rgba(16,185,129,0.2)] text-exito',
  sinVacunas: 'border-[rgba(225,29,72,0.45)] bg-[rgba(225,29,72,0.2)] text-peligro-claro',
  esterilizado: 'border-[rgba(124,58,237,0.45)] bg-[rgba(124,58,237,0.2)] text-acento',
  sinEsterilizar: 'border-[rgba(148,163,184,0.35)] bg-[rgba(148,163,184,0.2)] text-texto-suave',
  desparasitado: 'border-[rgba(34,211,238,0.4)] bg-[rgba(34,211,238,0.18)] text-[#67E8F9]',
  sinDesparasitar: 'border-[rgba(245,158,11,0.4)] bg-[rgba(245,158,11,0.2)] text-[#FCD34D]',
}
export const etiqueta = (clave) => `${ETIQUETA_BASE} ${ETIQUETA_COLOR[clave]}`
