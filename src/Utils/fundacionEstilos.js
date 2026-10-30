// Clases de Tailwind del panel de la fundación (tarjetas de mascotas, solicitudes, kanban,
// ventanas y formularios). Los colores de la marca salen de @theme (index.css).

// ── Menú lateral y barra superior ──
export const FND_BADGE =
  'ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primario px-[5px] text-[11px] font-bold text-white'
export const FND_USUARIO =
  'mt-auto flex items-center gap-2.5 border-t border-t-[rgba(255,255,255,0.08)] px-4 py-3.5'
export const FND_USUARIO_META =
  'flex min-w-0 flex-1 flex-col gap-0.5 [&_strong]:overflow-hidden [&_strong]:text-[13px] [&_strong]:text-ellipsis [&_strong]:whitespace-nowrap [&_strong]:text-texto [&_small]:text-[11px] [&_small]:text-[rgba(241,245,249,0.55)]'
export const FND_BREADCRUMB =
  'text-[14px] whitespace-nowrap text-[rgba(241,245,249,0.65)] [&_span]:mx-1 [&_span]:opacity-50 [&_strong]:text-acento'
export const FND_KBD =
  'rounded-[5px] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] px-1.5 py-0.5 text-[11px] whitespace-nowrap text-[rgba(241,245,249,0.62)] [font-family:monospace]'

export { AVISO as FND_AVISO } from './adminEstilos'

// ── Botones y avisos ──
export const FND_BTN_PRIMARIO =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-[10px] border-0 bg-primario px-4 py-[9px] text-[14px] font-bold whitespace-nowrap text-white transition-[background,transform] duration-200 ease-[ease] hover:bg-primario-oscuro hover:[transform:translateY(-1px)]'
const FND_BTN_SOLICITUD =
  'cursor-pointer rounded-[7px] border px-2.5 py-1 text-[12px] font-semibold transition-[background] duration-200 ease-[ease] disabled:cursor-not-allowed disabled:opacity-60'
export const FND_BTN_APROBAR = `${FND_BTN_SOLICITUD} border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.18)] text-exito hover:bg-[rgba(16,185,129,0.3)]`
export const FND_BTN_REVISAR = `${FND_BTN_SOLICITUD} border-[rgba(124,58,237,0.3)] bg-[rgba(124,58,237,0.18)] text-acento hover:bg-[rgba(124,58,237,0.3)]`
export const FND_GUARDADO = 'text-[13px] font-semibold text-exito'

// ── Rejillas del dashboard ──
export const FND_KPIS = 'mb-6 grid grid-cols-1 gap-4 min-[601px]:grid-cols-2 min-[1101px]:grid-cols-4'
export const FND_KPI_BARRA = 'mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[rgba(255,255,255,0.1)]'
export const fndRelleno = (critico) =>
  `h-full rounded-full transition-[width] duration-[400ms] ease-[ease] ${critico ? 'bg-peligro' : 'bg-primario'}`
export const FND_SPARKLINE = 'h-6 w-[60px] shrink-0'
export const FND_DOS_COLS = 'mb-6 grid grid-cols-1 gap-4 min-[901px]:grid-cols-[1.4fr_1fr]'
export const FND_FILTROS = 'mb-4 flex flex-wrap gap-2'
const FND_CHIP_BASE =
  'cursor-pointer rounded-full border px-3.5 py-[5px] text-[13px] font-semibold transition-all duration-200 ease-[ease]'
export const fndChip = (activo) =>
  `${FND_CHIP_BASE} ${
    activo
      ? 'border-primario bg-[rgba(124,58,237,0.22)] text-acento'
      : 'border-[rgba(196,181,253,0.3)] bg-transparent text-[rgba(241,245,249,0.7)] hover:border-primario hover:bg-[rgba(124,58,237,0.22)] hover:text-acento'
  }`

// ── Tarjeta de mascota ──
export const FND_GRID_MASCOTAS = 'grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3.5'
export const FND_MASCOTA =
  'overflow-hidden rounded-[14px] border border-[rgba(124,58,237,0.18)] bg-[rgba(255,255,255,0.04)] transition-[border-color,transform] duration-200 ease-[ease] hover:border-[rgba(124,58,237,0.45)] hover:[transform:translateY(-2px)]'
export const FND_MASCOTA_FOTO =
  'flex h-[130px] w-full items-center justify-center bg-[rgba(124,58,237,0.1)] object-cover text-[40px] text-[rgba(196,181,253,0.4)] [&_img]:h-full [&_img]:w-full [&_img]:object-cover'
export const FND_MASCOTA_CUERPO = 'p-3'
export const FND_MASCOTA_NOMBRE = 'mb-1 text-[15px] font-bold text-texto'
export const FND_MASCOTA_SUB = 'mb-2 text-[12px] text-[rgba(241,245,249,0.55)]'
export const FND_MASCOTA_CHIPS = 'mb-2.5 flex flex-wrap gap-1'
const FND_MASCOTA_CHIP = 'rounded-full border px-2 py-0.5 text-[10px] font-semibold'
const FND_MASCOTA_CHIP_COLOR = {
  base: 'border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.15)] text-exito',
  tratamiento: 'border-[rgba(225,29,72,0.3)] bg-[rgba(225,29,72,0.12)] text-peligro',
  cuarentena: 'border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.12)] text-aviso',
  vacunado: 'border-[rgba(16,185,129,0.35)] bg-[rgba(16,185,129,0.18)] text-exito',
  sinVacunas: 'border-[rgba(225,29,72,0.35)] bg-[rgba(225,29,72,0.16)] text-peligro-claro',
  esterilizado: 'border-[rgba(124,58,237,0.35)] bg-[rgba(124,58,237,0.18)] text-acento',
  sinEsterilizar: 'border-[rgba(148,163,184,0.3)] bg-[rgba(148,163,184,0.16)] text-texto-suave',
}
export const fndChipMascota = (tipo = 'base') => `${FND_MASCOTA_CHIP} ${FND_MASCOTA_CHIP_COLOR[tipo]}`
export const FND_MASCOTA_ACCIONES = 'flex gap-1.5'
const FND_MASCOTA_BTN =
  'flex-1 cursor-pointer rounded-[7px] border-0 px-0 py-1.5 text-[12px] font-semibold transition-[opacity] duration-200 ease-[ease] hover:opacity-85'
export const FND_BTN_GESTIONAR = `${FND_MASCOTA_BTN} bg-[rgba(124,58,237,0.22)] text-acento`
export const FND_BTN_FICHA = `${FND_MASCOTA_BTN} bg-[rgba(255,255,255,0.07)] text-[rgba(241,245,249,0.7)]`

// ── Línea de tiempo de solicitudes ──
export const FND_TIMELINE = 'flex flex-col gap-3'
export const FND_TIMELINE_ITEM = 'flex items-start gap-3'
export const FND_TIMELINE_AVATAR =
  'flex size-9 shrink-0 items-center justify-center rounded-full bg-[rgba(124,58,237,0.22)] text-[14px] font-bold text-acento'
export const FND_TIMELINE_CUERPO = 'min-w-0 flex-1'
export const FND_TIMELINE_NOMBRE = 'mb-0.5 text-[13px] font-bold text-texto'
export const FND_TIMELINE_MASCOTA = 'mb-1.5 text-[12px] text-[rgba(241,245,249,0.55)]'
export const FND_TIMELINE_ACCIONES = 'flex flex-wrap items-center gap-1.5'
export const FND_SCORE = 'inline-flex items-center gap-1 rounded-full px-2 py-[3px] text-[12px] font-bold'
export const FND_SCORE_COLOR = {
  alta: 'bg-[rgba(16,185,129,0.15)] text-exito',
  media: 'bg-[rgba(196,181,253,0.12)] text-acento',
  baja: 'bg-[rgba(225,29,72,0.12)] text-peligro',
}
export const FND_TABLA_WRAP = 'overflow-x-auto rounded-xl border border-[rgba(124,58,237,0.14)]'

// ── Kanban ──
export const FND_KANBAN = 'grid grid-cols-1 gap-4 min-[801px]:grid-cols-3'
const FND_KANBAN_COL = 'min-h-[200px] rounded-[14px] border p-3.5'
export const fndKanbanCol = (drop) =>
  `${FND_KANBAN_COL} ${
    drop
      ? 'border-[rgba(124,58,237,0.55)] bg-[rgba(124,58,237,0.06)]'
      : 'border-[rgba(124,58,237,0.14)] bg-[rgba(255,255,255,0.03)]'
  }`
export const FND_KANBAN_CABECERA =
  'mb-3 flex items-center justify-between border-b border-b-[rgba(255,255,255,0.06)] pb-2.5'
export const FND_KANBAN_TITULO = 'text-[13px] font-bold text-acento'
const FND_KANBAN_TARJETA =
  'mb-2 cursor-grab rounded-[10px] border border-[rgba(124,58,237,0.2)] bg-[rgba(255,255,255,0.05)] p-2.5 transition-[border-color,box-shadow] duration-200 ease-[ease] hover:border-[rgba(124,58,237,0.5)] hover:shadow-[0_4px_12px_rgba(124,58,237,0.15)]'
export const fndKanbanTarjeta = (arrastrando) =>
  arrastrando ? `${FND_KANBAN_TARJETA} opacity-50` : FND_KANBAN_TARJETA
export const FND_KANBAN_NOMBRE = 'mb-1 text-[14px] font-bold text-texto'
export const FND_KANBAN_SUB = 'mb-1.5 text-[11px] text-[rgba(241,245,249,0.5)]'
export const FND_KANBAN_CHIPS = 'mb-2 flex flex-wrap gap-1'
export const FND_KANBAN_SELECT =
  'w-full cursor-pointer rounded-md border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] px-1.5 py-1 text-[11px] text-acento'

// ── Ventana modal ──
export const FND_MODAL_FONDO =
  'fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(0,0,0,0.65)] p-5 backdrop-blur-[4px]'
export const FND_MODAL =
  'relative max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-[18px] border border-[rgba(124,58,237,0.3)] bg-fondo p-7'
export const FND_MODAL_TITULO = 'mb-5 text-[18px] font-extrabold text-texto'
export const FND_MODAL_CERRAR =
  'absolute top-4 right-4 cursor-pointer border-0 bg-transparent text-[20px] leading-none text-[rgba(241,245,249,0.55)] transition-[color] duration-200 ease-[ease] hover:text-texto'
export const FND_MODAL_CAMPO = 'mb-3.5 flex flex-col gap-1.5'
export const FND_MODAL_LABEL =
  'text-[12px] font-bold tracking-[0.4px] text-[rgba(241,245,249,0.65)] uppercase'
const FND_MODAL_INPUT_BASE =
  'rounded-[9px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.06)] px-3 py-2.5 text-[14px] text-texto transition-[border-color] duration-200 ease-[ease] outline-none [color-scheme:dark] focus:border-[rgba(124,58,237,0.55)] focus-visible:outline-none'
export const FND_MODAL_INPUT = FND_MODAL_INPUT_BASE
export const FND_MODAL_SELECT = `${FND_MODAL_INPUT_BASE} cursor-pointer [&_option]:bg-fondo! [&_option]:p-2.5 [&_option]:text-texto!`
export const FND_MODAL_ACCIONES = 'mt-5 flex justify-end gap-2.5'
const FND_MODAL_BTN_BASE =
  'cursor-pointer rounded-[9px] border-0 px-[18px] py-[9px] text-[14px] font-bold transition-[opacity] duration-200 ease-[ease] hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60'
export const FND_MODAL_BTN_PRIMARIO = `${FND_MODAL_BTN_BASE} bg-primario text-white`
export const FND_MODAL_BTN_SECUNDARIO = `${FND_MODAL_BTN_BASE} bg-[rgba(255,255,255,0.08)] text-[rgba(241,245,249,0.75)]`
export const FND_MODAL_BTN_APROBAR = `${FND_MODAL_BTN_BASE} bg-[rgba(16,185,129,0.18)] text-exito hover:bg-[rgba(16,185,129,0.3)]`
export const FND_MODAL_BTN_REVISAR = `${FND_MODAL_BTN_BASE} bg-[rgba(124,58,237,0.18)] text-acento hover:bg-[rgba(124,58,237,0.3)]`

// ── Zona de carga y vistas previas ──
const FND_DROPZONE_BASE =
  'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-5 text-center transition-all duration-200 ease-[ease] hover:border-primario hover:bg-[rgba(124,58,237,0.1)]'
export const fndDropzone = (arrastrando) =>
  `${FND_DROPZONE_BASE} ${
    arrastrando
      ? 'border-primario bg-[rgba(124,58,237,0.1)]'
      : 'border-[rgba(124,58,237,0.35)] bg-[rgba(124,58,237,0.04)]'
  }`
export const FND_DROPZONE_ICONO = 'text-[28px] text-acento'
export const FND_DROPZONE_TEXTO = 'm-0 text-[13px] text-[rgba(241,245,249,0.8)]'
export const FND_DROPZONE_LINK = 'font-bold text-acento underline'
export const FND_DROPZONE_HINT = 'm-0 text-[11px] text-[rgba(241,245,249,0.62)]'
export const FND_PREVIEW_FOTO =
  'relative mt-2 max-h-[180px] overflow-hidden rounded-xl border border-[rgba(124,58,237,0.3)] bg-black [&_img]:block [&_img]:h-[180px] [&_img]:w-full [&_img]:object-cover'
export const FND_PREVIEW_FOTO_QUITAR =
  'absolute top-2 right-2 flex size-7 cursor-pointer items-center justify-center rounded-full border-0 bg-[rgba(225,29,72,0.9)] text-[14px] text-white transition-[background,transform] duration-150 ease-[ease] hover:bg-peligro hover:[transform:scale(1.1)]'
export const FND_PREVIEW_GRID = 'mt-2.5 grid grid-cols-[repeat(auto-fill,minmax(95px,1fr))] gap-2.5'
export const FND_PREVIEW_THUMB =
  'relative h-20 overflow-hidden rounded-lg border border-[rgba(124,58,237,0.3)] bg-black [&_:is(img,video)]:block [&_:is(img,video)]:h-full [&_:is(img,video)]:w-full [&_:is(img,video)]:object-cover'
export const FND_PREVIEW_THUMB_QUITAR =
  'absolute top-1 right-1 flex size-[22px] cursor-pointer items-center justify-center rounded-full border-0 bg-[rgba(225,29,72,0.9)] text-[12px] text-white transition-[transform] duration-150 ease-[ease] hover:bg-peligro hover:[transform:scale(1.15)]'

// ── Ajustes de la sede ──
export const FND_FORM_CARD = 'max-w-[760px]'
export const FND_AJUSTES_CABECERA =
  'mb-6 flex items-start justify-between gap-4 border-b border-b-[rgba(255,255,255,0.07)] pb-4 [&_h2]:mb-1 [&_h2]:text-[16px] [&_h2]:font-bold [&_h2]:text-texto'
export const FND_AJUSTES_FORM =
  'grid grid-cols-1 gap-4 min-[601px]:grid-cols-2 [&_label]:flex [&_label]:flex-col [&_label]:gap-1.5 [&_label>span]:text-[11px] [&_label>span]:font-bold [&_label>span]:tracking-[0.4px] [&_label>span]:text-[rgba(241,245,249,0.6)] [&_label>span]:uppercase [&_:is(input,textarea)]:box-border [&_:is(input,textarea)]:w-full [&_:is(input,textarea)]:resize-y [&_:is(input,textarea)]:rounded-[9px] [&_:is(input,textarea)]:border [&_:is(input,textarea)]:border-[rgba(255,255,255,0.1)] [&_:is(input,textarea)]:bg-[rgba(255,255,255,0.06)] [&_:is(input,textarea)]:px-3 [&_:is(input,textarea)]:py-2.5 [&_:is(input,textarea)]:text-[14px] [&_:is(input,textarea)]:text-texto [&_:is(input,textarea)]:transition-[border-color] [&_:is(input,textarea)]:duration-200 [&_:is(input,textarea)]:ease-[ease] [&_:is(input,textarea)]:outline-none [&_:is(input,textarea)]:[font-family:inherit] [&_:is(input,textarea):focus]:border-[rgba(124,58,237,0.55)]'
export const FND_AJUSTES_ANCHO = 'col-span-full'
export const FND_AJUSTES_ACCIONES = 'col-span-full mt-1 flex items-center justify-end gap-3'
