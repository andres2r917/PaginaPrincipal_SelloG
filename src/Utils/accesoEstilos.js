// Clases de Tailwind compartidas por Login, Registro y RegistroFundacion.
// Los colores de la marca salen de @theme (index.css).

// Foto de fondo con velo oscuro para que el panel se lea bien
export const FONDO_PAGINA = {
  background:
    'radial-gradient(circle at 12% 18%, rgba(124, 58, 237, 0.30), transparent 45%),' +
    'linear-gradient(rgba(11, 15, 25, 0.72), rgba(11, 15, 25, 0.82)),' +
    "url('https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=1920&q=70') center / cover no-repeat fixed," +
    'var(--color-fondo)',
}

export const PAGINA = 'flex min-h-[calc(100vh-70px)] items-center justify-center px-5 py-10'
export const TARJETA =
  'flex min-h-[600px] w-full max-w-[980px] animate-[accesoEntrar_0.45s_cubic-bezier(.22,1,.36,1)_both] overflow-hidden rounded-[22px] border border-[rgba(124,58,237,0.28)] bg-[rgba(15,23,42,0.92)] shadow-[0_24px_60px_rgba(0,0,0,0.5)]'

// Lado de la foto (se oculta en pantallas de 860px o menos)
export const VISUAL = 'relative hidden w-[44%] shrink-0 min-[861px]:block'
export const VISUAL_IMG = 'absolute inset-0 h-full w-full object-cover'
export const VISUAL_CAPA =
  'absolute inset-0 flex flex-col justify-end bg-[linear-gradient(to_top,rgba(15,23,42,0.96)_0%,rgba(15,23,42,0.5)_55%,rgba(124,58,237,0.18)_100%)] p-8'
export const VISUAL_CHIP =
  'mb-[14px] inline-flex items-center gap-[6px] self-start rounded-[20px] bg-[rgba(124,58,237,0.9)] px-3 py-[5px] text-[0.75rem] font-extrabold text-white'
export const VISUAL_TITULO = 'mb-[10px] text-[1.6rem] leading-[1.2] font-black text-white'
export const VISUAL_SUBTITULO = 'text-[0.95rem] leading-[1.5] text-[rgba(241,245,249,0.85)]'

// Lado del formulario
export const PANEL = 'flex min-w-0 flex-1 flex-col justify-center px-[22px] py-8 min-[861px]:p-11'
export const CABECERA = 'mb-6'
export const H1 = 'mb-[6px] text-[1.8rem] font-black text-texto'
export const CABECERA_TEXTO = 'text-[0.95rem] text-[rgba(241,245,249,0.7)]'

export const FORM = 'flex flex-col gap-4'
export const FILA = 'flex flex-col gap-[14px] min-[861px]:flex-row'
export const GRUPO = 'flex min-w-0 flex-1 flex-col gap-[6px]'
export const LABEL_FILA = 'flex items-center justify-between'
export const LABEL = 'text-[0.8rem] font-bold text-[rgba(241,245,249,0.85)]'

// Campo con icono a la izquierda
export const CAMPO =
  'flex items-center gap-[10px] rounded-xl border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.06)] px-[14px] transition-[border-color,box-shadow] duration-200 focus-within:border-primario focus-within:shadow-[0_0_0_3px_rgba(124,58,237,0.25)] [&>svg]:shrink-0 [&>svg]:text-[1.05rem] [&>svg]:text-[rgba(196,181,253,0.85)]'
// Incluye: ocultar el ojo nativo del navegador y que el autorrelleno no pinte el campo de blanco
export const INPUT =
  'min-w-0 flex-1 border-none bg-transparent py-[13px] text-[0.95rem] text-texto outline-none focus-visible:outline-none placeholder:text-[rgba(241,245,249,0.5)] [&::-ms-clear]:hidden [&::-ms-reveal]:hidden [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#1e293b] [&:-webkit-autofill]:[-webkit-text-fill-color:var(--color-texto)] [&:-webkit-autofill]:[caret-color:var(--color-texto)]'
export const OJO =
  'flex cursor-pointer border-none bg-transparent p-1 text-[1.1rem] text-[rgba(196,181,253,0.85)] hover:text-white'

export const ENLACE = 'text-[0.85rem] font-bold text-acento no-underline hover:underline'
export const RECORDAR = 'flex items-center gap-2 text-[0.85rem] text-[rgba(241,245,249,0.8)] accent-primario'

// Botones
const BTN_BASE =
  'cursor-pointer rounded-xl text-[1rem] font-extrabold transition-[background-color,translate] duration-200 disabled:cursor-not-allowed disabled:opacity-60'
export const BTN =
  `${BTN_BASE} w-full border-none bg-primario p-[13px] text-white shadow-[0_8px_20px_rgba(124,58,237,0.35)] enabled:hover:-translate-y-px enabled:hover:bg-primario-oscuro`
export const BTN_ACCION = `${BTN} flex-1`
export const BTN_SECUNDARIO =
  `${BTN_BASE} w-auto border border-[rgba(196,181,253,0.4)] bg-transparent px-5 py-[13px] text-acento enabled:hover:bg-[rgba(124,58,237,0.15)]`

// Mensajes de éxito y de error
const AVISO =
  'flex items-start gap-2 rounded-[10px] px-[14px] py-[10px] text-[0.85rem] leading-[1.4] font-semibold [&>svg]:mt-[2px] [&>svg]:shrink-0'
export const AVISO_OK = `${AVISO} border border-[rgba(16,185,129,0.4)] bg-[rgba(16,185,129,0.15)] text-exito-claro`
export const AVISO_ERROR = `${AVISO} border border-[rgba(225,29,72,0.45)] bg-[rgba(225,29,72,0.15)] text-peligro-claro`

export const PIE = 'mt-[22px] text-center text-[0.9rem] leading-[1.8] text-[rgba(241,245,249,0.7)]'

// Acceso rápido de desarrollo (solo con npm run dev)
export const DEMO = 'mt-1 rounded-xl border border-dashed border-[rgba(196,181,253,0.35)] px-[14px] py-3'
export const DEMO_TITULO = 'mb-2 text-[0.75rem] text-[rgba(241,245,249,0.6)]'
export const DEMO_BOTONES = 'flex flex-wrap gap-2'
export const DEMO_BOTON =
  'cursor-pointer rounded-lg border border-[rgba(124,58,237,0.6)] bg-transparent px-3 py-[6px] text-[0.75rem] text-acento hover:bg-[rgba(124,58,237,0.2)]'

// ── Registro: elegir tipo de cuenta ──
export const ROLES = 'flex flex-col gap-[14px]'
export const ROL =
  'flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.05)] px-5 py-[18px] text-left text-inherit no-underline [font:inherit] transition-[border-color,background-color,translate] duration-200 hover:-translate-y-0.5 hover:border-primario hover:bg-[rgba(124,58,237,0.16)]'
export const ROL_ICONO =
  'flex size-12 shrink-0 items-center justify-center rounded-[14px] bg-[rgba(124,58,237,0.25)] text-[1.4rem] text-acento'
export const ROL_TITULO = 'mb-[3px] block text-[1rem] font-bold text-texto'
export const ROL_TEXTO = 'text-[0.82rem] leading-[1.4] text-[rgba(241,245,249,0.7)]'
export const ROL_FLECHA = 'ml-auto shrink-0 text-[1.2rem] text-acento'

// Volver a elegir el tipo de cuenta
export const VOLVER =
  'mb-4 inline-flex cursor-pointer items-center gap-[6px] self-start border-none bg-transparent p-0 text-[0.85rem] font-bold text-acento no-underline hover:underline'

// ── Registro de fundación: pasos ──
export const PASOS = 'mb-[22px] flex list-none gap-2'
const PASO =
  'flex flex-1 flex-col gap-[6px] text-[0.75rem] font-bold before:h-1 before:rounded before:transition-[background-color] before:duration-300'
export const PASO_PENDIENTE = `${PASO} text-[rgba(241,245,249,0.6)] before:bg-[rgba(255,255,255,0.14)]`
export const PASO_HECHO = `${PASO} text-[rgba(241,245,249,0.6)] before:bg-primario`
export const PASO_ACTIVO = `${PASO} text-texto before:bg-primario`

export const ACCIONES = 'flex gap-3'
export const OPCIONAL = 'font-normal text-texto-gris not-italic'
export const ADJUNTAR =
  'inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[rgba(196,181,253,0.6)] px-4 py-[10px] font-semibold text-acento focus-within:bg-[rgba(124,58,237,0.15)] hover:bg-[rgba(124,58,237,0.15)]'
export const ADJUNTAR_INPUT = 'absolute size-px opacity-0'
export const AYUDA = 'mt-[6px] text-[13px] text-texto-gris'
export const ARCHIVOS = 'mt-[10px] grid list-none gap-[6px] p-0'
export const ARCHIVO =
  'flex items-center justify-between gap-2 rounded-[10px] bg-[rgba(124,58,237,0.12)] px-3 py-2 text-[14px] text-[#e2e8f0]'
export const ARCHIVO_NOMBRE = 'overflow-hidden text-ellipsis whitespace-nowrap'
export const ARCHIVO_QUITAR = 'inline-flex cursor-pointer border-none bg-transparent text-peligro-claro'
