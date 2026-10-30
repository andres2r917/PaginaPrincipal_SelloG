// Clases de Tailwind del formulario de denuncia y de la página de denuncias.
// Los colores de la marca salen de @theme (index.css).

// ── Página ──
// Fondo con foto (se pone en línea) y una capa oscura encima; el contenido va por encima de la capa
export const PAGINA =
  'relative flex min-h-[calc(100vh-70px)] items-start justify-center bg-[#f4fafd] bg-cover bg-fixed bg-center bg-no-repeat px-5 py-10 before:pointer-events-none before:absolute before:inset-0 before:z-0 before:bg-[rgba(11,18,36,0.72)]'
export const CONTENIDO = 'relative z-1'
export const TOAST =
  'fixed bottom-[30px] left-1/2 z-[9999] -translate-x-1/2 animate-[toastSubir_0.3s_ease] rounded-xl bg-primario px-7 py-[14px] text-[0.95rem] font-bold text-white shadow-[0_8px_24px_rgba(124,58,237,0.35)]'

// ── Tarjeta del formulario ──
export const CONTENEDOR =
  'flex min-h-[580px] w-full max-w-[920px] flex-col overflow-hidden rounded-[20px] bg-[#000000bd] shadow-[0_16px_48px_rgba(22,29,31,0.56)] min-[681px]:flex-row'
export const VISUAL = 'relative h-[200px] w-full shrink-0 overflow-hidden min-[681px]:h-auto min-[681px]:w-[40%]'
export const VISUAL_IMG = 'absolute inset-0 h-full w-full object-cover'
export const VISUAL_CAPA =
  'absolute inset-0 flex flex-col justify-end bg-[linear-gradient(to_top,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.3)_55%,transparent_100%)] px-7 py-8'
export const VISUAL_TITULO = 'mb-[10px] text-[1.15rem] leading-[1.45] font-bold text-primario'
export const VISUAL_SUBTITULO = 'text-[0.875rem] leading-[1.6] text-[rgba(255,255,255,0.93)]'

export const LADO = 'flex flex-1 flex-col overflow-y-auto px-5 py-7 min-[681px]:p-9'
export const CABECERA = 'mb-[22px]'
export const H1 = 'mb-1 text-[1.6rem] font-black text-primario'
export const CABECERA_TEXTO = 'text-[0.9rem] text-[#fcfcfce3]'

// ── Campos ──
export const FORM = 'flex flex-1 flex-col gap-4'
export const GRUPO = 'flex flex-col gap-[5px]'
export const LABEL = 'text-[0.78rem] font-bold tracking-[0.4px] text-[#ffffffd0] uppercase'
const CAMPO =
  'w-full appearance-none rounded-[10px] border-[1.5px] border-[#e5e7eb] bg-[#ffffffc0] px-[14px] text-[0.875rem] text-[#374151] outline-none transition-[border-color,box-shadow] duration-200 focus:border-primario focus:shadow-[0_0_0_3px_rgba(124,58,237,0.15)] focus-visible:outline-none'
export const INPUT = `${CAMPO} h-11`
export const TEXTAREA = `${CAMPO} h-auto resize-y py-3`

// ── Archivos ──
const DROPZONE =
  'cursor-pointer rounded-[10px] border-2 border-dashed px-4 py-6 text-center transition-[border-color,background-color] duration-200'
export const DROPZONE_REPOSO = `${DROPZONE} border-[#bccbba] bg-[#ffffffb7] hover:border-fondo hover:bg-[#f0fdf4]`
export const DROPZONE_ARRASTRANDO = `${DROPZONE} border-fondo bg-[#f0fdf4]`
export const DROPZONE_ICONO = 'mx-auto mb-[6px] block text-[1.8rem]'
export const DROPZONE_TEXTO = 'text-[0.875rem] text-[#6b7280]'
export const DROPZONE_ENLACE = 'cursor-pointer font-bold text-primario'
export const PREVIEW = 'mt-[10px] flex flex-wrap gap-[10px]'
export const PREVIEW_ITEM = 'relative flex w-20 flex-col items-center gap-1'
export const PREVIEW_IMG = 'h-[60px] w-20 rounded-lg border border-[#e5e7eb] object-cover'
export const PREVIEW_VIDEO = 'text-[2rem]'
export const PREVIEW_NOMBRE = 'text-center text-[0.65rem] break-all text-[#6b7280]'
export const PREVIEW_QUITAR =
  'absolute -top-[6px] -right-[6px] flex size-[18px] cursor-pointer items-center justify-center rounded-full border-none bg-error text-[0.65rem] text-white'

export const ANONIMO = 'flex items-center gap-2 text-[0.875rem] text-[#f3f5f8ee]'
export const ANONIMO_CHECK = 'size-4 cursor-pointer accent-primario'
export const BTN_ENVIAR =
  'h-12 w-full cursor-pointer rounded-[10px] border-none bg-primario text-[1rem] font-extrabold text-white transition-[background-color,translate,scale,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-primario-hover hover:shadow-[0_6px_18px_rgba(124,58,237,0.3)] active:translate-y-0 active:scale-[0.98]'

// ── Selector de ubicación (también se usa en el modal oscuro del panel de fundación) ──
const BUSQUEDA = 'mb-[10px] flex items-center gap-2 rounded-[10px] border-[1.5px] px-3 transition-[border-color,box-shadow] duration-200 focus-within:shadow-[0_0_0_3px_rgba(124,58,237,0.15)]'
export const BUSQUEDA_CLARA = `${BUSQUEDA} border-[#e5e7eb] bg-[#ffffffc0] focus-within:border-primario`
export const BUSQUEDA_OSCURA = `${BUSQUEDA} border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.06)]`
export const BUSQUEDA_ICONO = 'shrink-0 text-[15px] opacity-50'
const BUSQUEDA_CAMPO = 'flex-1 border-none bg-transparent py-3 text-[0.875rem] outline-none focus-visible:outline-none'
export const BUSQUEDA_CAMPO_CLARO = `${BUSQUEDA_CAMPO} text-[#374151] placeholder:text-[#9ca3af]`
export const BUSQUEDA_CAMPO_OSCURO = `${BUSQUEDA_CAMPO} text-texto placeholder:text-[rgba(241,245,249,0.5)]`
export const BTN_BUSCAR =
  'shrink-0 cursor-pointer rounded-[7px] border-none bg-primario px-[18px] py-[7px] text-[0.85rem] font-bold text-white transition-[background-color,translate] duration-200 enabled:hover:-translate-y-px enabled:hover:bg-primario-hover disabled:cursor-not-allowed disabled:opacity-60'
export const BTN_UBICACION =
  'mb-[2px] inline-flex cursor-pointer items-center gap-[7px] rounded-lg border-2 border-primario bg-transparent px-4 py-[7px] text-[0.85rem] font-bold text-primario transition-[background-color,color,translate] duration-200 enabled:hover:-translate-y-px enabled:hover:bg-[rgba(124,58,237,0.12)] disabled:cursor-not-allowed disabled:opacity-60'
export const UBICACION_ERROR = 'mt-1 mb-[2px] text-[0.8rem] font-semibold text-error'
export const MAPA = 'z-0 mt-[10px] h-[260px] w-full overflow-hidden rounded-[10px] border-[1.5px] border-[rgba(255,255,255,0.18)]'
export const MAPA_AYUDA = 'mt-[5px] mb-0 text-[0.75rem] text-[rgba(255,255,255,0.62)] italic'
