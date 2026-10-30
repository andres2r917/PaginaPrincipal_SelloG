// Clases de Tailwind del marco de los paneles (menú lateral, barra superior, tarjetas)
// y del dashboard de Administración. Los colores de la marca salen de @theme (index.css).

// ── Marco: menú lateral ──
export const LAYOUT = 'flex min-h-screen bg-fondo text-texto'
// Por debajo de 769px se oculta; entre 769 y 900px queda colapsado (ancho 0)
export const SIDEBAR =
  'sticky top-0 hidden h-screen w-0 shrink-0 flex-col self-start overflow-hidden border-r border-r-[rgba(124,58,237,0.18)] bg-fondo p-0 min-[769px]:flex min-[901px]:w-[250px] min-[901px]:overflow-visible min-[901px]:px-4 min-[901px]:py-6'
export const BRAND = 'mb-8 flex items-center gap-[0.6rem] px-2 py-1 no-underline'
export const BRAND_LOGO =
  'block h-[clamp(38px,6vh,46px)] w-auto max-w-full object-contain transition-[transform] duration-[250ms] ease-[ease] hover:[transform:scale(1.05)]'
export const NAV = 'flex min-h-0 flex-1 flex-col gap-[0.3rem] overflow-y-auto'
const NAV_BASE =
  'flex cursor-pointer items-center gap-3 rounded-[10px] border-0 px-[0.8rem] py-[0.7rem] text-left text-[0.92rem] font-bold no-underline transition-[background,color] duration-[180ms] ease-[ease] [&_svg]:shrink-0 [&_svg]:text-[1.05rem]'
const NAV_HOVER = 'hover:bg-[rgba(124,58,237,0.12)] hover:text-acento'
export const NAV_ITEM = `${NAV_BASE} ${NAV_HOVER} bg-transparent text-[rgba(248,250,252,0.7)]`
export const NAV_ITEM_ACTIVO = `${NAV_BASE} ${NAV_HOVER} bg-[rgba(124,58,237,0.22)] text-white shadow-[inset_3px_0_0_var(--color-primario)]`
export const NAV_SALIR = `${NAV_BASE} mt-4 bg-transparent text-[rgba(248,250,252,0.55)] hover:bg-[rgba(225,29,72,0.12)] hover:text-peligro`
export const navItem = ({ isActive }) => (isActive ? NAV_ITEM_ACTIVO : NAV_ITEM)

// ── Marco: contenido y barra superior ──
export const CONTENT = 'flex min-w-0 flex-1 flex-col'
export const TOPBAR =
  'sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-b-[rgba(124,58,237,0.18)] bg-[rgba(15,23,42,0.75)] px-8 py-4 backdrop-blur-[10px]'
export const TOPBAR_SEARCH =
  'flex w-full max-w-[380px] items-center gap-[0.6rem] rounded-[25px] border border-[rgba(124,58,237,0.25)] bg-[rgba(124,58,237,0.1)] px-4 py-2 text-[rgba(248,250,252,0.6)] [&_input]:w-full [&_input]:border-0 [&_input]:bg-transparent [&_input]:text-[0.9rem] [&_input]:text-white [&_input]:outline-none'
export const TOPBAR_ACCIONES = 'flex items-center gap-4'
export const ICON_BTN =
  'relative flex size-[38px] cursor-pointer items-center justify-center rounded-full border border-[rgba(124,58,237,0.25)] bg-[rgba(124,58,237,0.12)] text-acento'
export const ICON_BTN_PUNTO = 'absolute top-1.5 right-2 size-[7px] rounded-full bg-peligro'
export const AVATAR_BTN =
  'flex size-9 cursor-pointer items-center justify-center rounded-full border-0 bg-primario font-extrabold text-white transition-[transform,box-shadow] duration-200 ease-[ease] hover:shadow-[0_0_0_3px_rgba(196,181,253,0.4)] hover:[transform:scale(1.06)]'
export const SELECT =
  'rounded-[20px] border border-[rgba(124,58,237,0.3)] bg-[rgba(124,58,237,0.12)] px-[0.9rem] py-[0.35rem] text-[0.78rem] font-bold text-acento'
export const MAIN = 'flex-1 p-8'
export const TITULO = 'mx-0 mt-0 mb-6 text-[1.8rem] font-black text-white'
export const FOOTER =
  'border-t border-t-[rgba(124,58,237,0.15)] p-[1.2rem] text-center text-[0.78rem] text-[rgba(248,250,252,0.62)]'

// ── Modal de perfil ──
export const PERFIL_CABECERA =
  'mb-6 flex items-center gap-4 border-b border-b-[rgba(255,255,255,0.07)] pb-4'
export const PERFIL_AVATAR =
  'flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[rgba(196,181,253,0.4)] bg-[linear-gradient(135deg,rgba(124,58,237,0.4),rgba(168,85,247,0.25))] text-[20px] font-bold text-acento [&_img]:size-full [&_img]:object-cover'
export const PERFIL_OK = 'mr-auto text-[13px] font-semibold text-exito'

// ── Tarjetas ──
export const GRID = 'grid grid-cols-1 gap-6 min-[1025px]:grid-cols-[1.6fr_1fr]'
export const CARD =
  'rounded-2xl border border-[rgba(124,58,237,0.22)] bg-[rgba(15,23,42,0.75)] px-6 py-[1.4rem] backdrop-blur-[10px]'
export const CARD_HEAD =
  'mb-[1.2rem] flex items-start justify-between gap-4 [&_h2]:m-0 [&_h2]:text-[1.05rem] [&_h2]:font-extrabold [&_h2]:text-white'
export const CARD_SUBTITULO = 'mx-0 mt-[0.2rem] mb-0 text-[0.8rem] text-[rgba(248,250,252,0.55)]'

// ── Dashboard de Administración ──
export const STAT_ROW = 'mb-[1.2rem] flex gap-4'
const STAT_BASE = 'flex-1 rounded-xl px-4 py-[0.9rem]'
export const STAT = { primario: `${STAT_BASE} bg-primario`, secundario: `${STAT_BASE} bg-[rgba(196,181,253,0.9)]` }
export const STAT_NUM = {
  primario: 'block text-[1.7rem] font-black text-white',
  secundario: 'block text-[1.7rem] font-black text-fondo',
}
export const STAT_LABEL = {
  primario: 'text-[0.75rem] font-bold text-[rgba(255,255,255,0.85)]',
  secundario: 'text-[0.75rem] font-bold text-[rgba(15,23,42,0.7)]',
}
export const MINI_TITULO = 'mx-0 mt-0 mb-2 text-[0.78rem] font-bold text-[rgba(248,250,252,0.6)]'

export const ACTIVIDAD_LISTA = 'm-0 flex list-none flex-col gap-4 p-0'
export const ACTIVIDAD_ITEM = 'flex gap-[0.7rem]'
export const ACTIVIDAD_CUERPO =
  '[&_p]:m-0 [&_p]:text-[0.88rem] [&_p]:font-semibold [&_p]:text-[rgba(248,250,252,0.9)]'
export const ACTIVIDAD_HORA = 'text-[0.72rem] text-[rgba(248,250,252,0.62)]'
const PUNTO_BASE = 'mt-1.5 size-[9px] shrink-0 rounded-full'
const PUNTO_COLOR = { exito: 'bg-exito', info: 'bg-acento', pendiente: 'bg-aviso', critico: 'bg-peligro' }
export const puntoActividad = (tipo) => `${PUNTO_BASE} ${PUNTO_COLOR[tipo] ?? ''}`
const ETIQUETA_COLOR = { exito: 'text-exito', pendiente: 'text-aviso' }
export const etiquetaActividad = (tipo) =>
  `ml-[0.3rem] text-[0.72rem] font-extrabold ${ETIQUETA_COLOR[tipo] ?? ''}`

export const BARRAS = 'flex h-40 items-end gap-4 pt-2'
export const BARRAS_GRUPO = 'group/barra flex h-full flex-1 flex-col items-center justify-end'
export const BARRAS_PAR = 'flex h-full w-full items-end justify-center gap-1'
export const BARRA =
  'w-2.5 rounded-t-[4px] bg-acento transition-[opacity] duration-200 ease-[ease] group-hover/barra:opacity-75'
export const BARRAS_ETIQUETA = 'mt-2 text-[0.7rem] font-bold text-[rgba(248,250,252,0.5)]'

const ALERTA_BASE =
  'mb-[0.8rem] flex gap-[0.7rem] rounded-xl px-4 py-[0.9rem] [&_svg]:mt-0.5 [&_svg]:shrink-0 [&_strong]:mb-[0.15rem] [&_strong]:block [&_strong]:text-[0.88rem] [&_p]:m-0 [&_p]:text-[0.8rem] [&_p]:opacity-90'
export const ALERTA_INFO = `${ALERTA_BASE} bg-[rgba(124,58,237,0.18)] text-[#EDE9FE] [&_svg]:text-acento`
export const ALERTA_CRITICA = `${ALERTA_BASE} bg-[rgba(225,29,72,0.18)] text-[#FEE2E2] [&_svg]:text-peligro`
