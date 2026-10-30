// Clases de Tailwind de la página de Adopción (tarjetas, filtros, ventana de detalle y formulario).
// Los colores de la marca salen de @theme (index.css).

const BORDE = 'border-[rgba(255,255,255,0.08)]'
const CRISTAL = 'bg-[rgba(22,22,29,0.7)]'
const TEXTO_PRINCIPAL = 'text-[#f0f0f5]'

// ── Fondo y contenedor ──
// Hasta 700px ya es una sola columna: todo lo de escritorio se aplica desde 701px
export const HERO =
  'relative flex min-h-screen flex-col items-center overflow-hidden px-6 pt-[110px] pb-[70px] before:absolute before:inset-0 before:z-1 before:bg-[rgba(15,23,42,0.6)]'
export const PORTADA = 'absolute inset-0 z-0 h-full w-full bg-fondo object-cover brightness-[0.35] contrast-[1.1]'
export const CONTENIDO = 'relative z-1 mx-auto w-full max-w-[1100px]'

// ── Encabezado y garantías ──
export const ENCABEZADO = 'mb-7 text-center'
export const ENCABEZADO_TITULO = 'mb-[10px] text-[clamp(1.7rem,4vw,2.6rem)] font-black text-texto'
export const ENCABEZADO_TEXTO = 'text-[1rem] text-acento-suave'
export const ENCABEZADO_DESTACADO = 'text-texto'

export const GARANTIAS_GRID = 'mb-7 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[14px]'
export const GARANTIA = `flex items-center gap-3 rounded-[16px] border ${BORDE} ${CRISTAL} px-4 py-[14px] backdrop-blur-[12px]`
export const GARANTIA_ICONO =
  'flex size-10 shrink-0 items-center justify-center rounded-full bg-[rgba(124,58,237,0.18)] text-[1.15rem] text-acento-suave'
export const GARANTIA_TITULO = 'mb-[2px] block text-[0.9rem] text-texto'
export const GARANTIA_TEXTO = 'text-[0.75rem] leading-[1.35] text-[rgba(241,245,249,0.6)]'

// ── Filtros ──
export const FILTROS = 'mb-[22px] flex flex-wrap items-center gap-[14px]'
export const FILTRO_GRUPO = 'flex flex-wrap gap-2'
const CHIP_BASE =
  'cursor-pointer rounded-[20px] border px-[18px] py-[7px] text-[0.85rem] font-bold capitalize transition-[background,color,border-color] duration-200 ease-[ease] hover:border-[rgba(124,58,237,0.5)]'
export const CHIP = `${CHIP_BASE} ${BORDE} ${CRISTAL} text-acento-suave`
export const CHIP_ACTIVO = `${CHIP_BASE} border-primario bg-primario text-white`
export const chip = (activo) => (activo ? CHIP_ACTIVO : CHIP)
export const FILTRO_SELECT = `cursor-pointer rounded-[20px] border ${BORDE} ${CRISTAL} px-[14px] py-[7px] text-[0.85rem] text-texto-claro`
export const CONTADOR = 'ml-auto text-[0.85rem] text-[rgba(241,245,249,0.6)]'

export const ESTADO = 'text-center text-texto-suave'
export const ERROR =
  'mb-3 rounded-[10px] border border-[rgba(225,29,72,0.5)] bg-[rgba(225,29,72,0.15)] px-[14px] py-[10px] text-[14px] text-[#fecdd3]'
export const VACIO = `rounded-[16px] border ${BORDE} ${CRISTAL} px-5 py-[50px] text-center text-acento-suave`

// ── Botones ──
const BTN_VER_BASE =
  'cursor-pointer rounded-[20px] border-0 bg-primario py-2 text-[0.8rem] font-semibold text-white transition-[background] duration-200 ease-[ease] hover:bg-primario-hover'
export const BTN_VER = `${BTN_VER_BASE} mb-[18px] w-[80%] px-5`
export const BTN_LIMPIAR = `${BTN_VER_BASE} mt-[14px] px-6`
// Sirve también para los enlaces (iniciar sesión / completar perfil): ahí el hover no depende de :disabled
export const BTN_ENVIAR =
  'mt-1 w-full cursor-pointer rounded-[10px] border-0 bg-primario p-[11px] text-[0.9rem] font-semibold tracking-[0.02em] text-white transition-[background,opacity] duration-200 ease-[ease] disabled:cursor-not-allowed disabled:opacity-40 [&:not(:disabled)]:hover:bg-primario-hover'
export const BTN_ENLACE = 'inline-block text-center no-underline'

// ── Llamado para fundaciones ──
export const CTA =
  'mt-10 flex flex-wrap items-center justify-between gap-4 rounded-[16px] border border-[rgba(124,58,237,0.35)] bg-[linear-gradient(135deg,rgba(124,58,237,0.35),rgba(15,23,42,0.8))] px-[26px] py-[22px]'
export const CTA_TITULO = 'mb-1 block text-[1.05rem] text-texto'
export const CTA_TEXTO = 'text-[0.85rem] text-acento-suave'
export const CTA_BOTON =
  'rounded-[20px] bg-primario px-[22px] py-[9px] text-[0.85rem] font-bold text-white no-underline transition-[background] duration-200 ease-[ease] hover:bg-primario-hover'

// ── Tarjetas de animales ──
export const GRID =
  'grid w-full grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4 min-[701px]:grid-cols-[repeat(auto-fill,minmax(230px,1fr))] min-[701px]:gap-7'
export const TARJETA = `group/animal flex cursor-pointer flex-col items-center overflow-hidden rounded-[16px] border ${BORDE} bg-[rgba(22,22,29,0.75)] text-center backdrop-blur-[12px] transition-[transform,box-shadow,border-color] duration-200 ease-[ease] hover:border-[rgba(124,58,237,0.3)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)] hover:[transform:translateY(-4px)]`
export const TARJETA_FOTO = 'relative w-full overflow-hidden'
export const TARJETA_IMG =
  'h-[180px] w-full object-cover transition-[transform] duration-[350ms] ease-[ease] group-hover/animal:[transform:scale(1.06)]'
export const TARJETA_ETIQUETA =
  'absolute bottom-[10px] left-[10px] rounded-[20px] bg-[rgba(15,23,42,0.8)] px-[10px] py-[3px] text-[0.7rem] font-bold text-texto-claro'
export const TARJETA_VACUNADO =
  'absolute right-[10px] bottom-[10px] inline-flex items-center gap-1 rounded-[20px] bg-[rgba(16,185,129,0.9)] px-[10px] py-[3px] text-[0.7rem] font-bold text-white'
const FAV_BASE =
  'absolute top-[10px] right-[10px] flex size-[34px] cursor-pointer items-center justify-center rounded-full border-0 bg-[rgba(15,23,42,0.7)] text-[1rem] transition-[background,color] duration-200 ease-[ease] hover:bg-[rgba(15,23,42,0.95)]'
export const FAV = `${FAV_BASE} text-texto-claro`
export const FAV_ACTIVO = `${FAV_BASE} text-error [&_svg]:fill-current`
export const favorito = (activo) => (activo ? FAV_ACTIVO : FAV)
export const TARJETA_NOMBRE = `mt-[14px] mb-1 text-[1.1rem] font-semibold ${TEXTO_PRINCIPAL}`
export const TARJETA_DATOS = 'mb-4 text-[0.8rem] text-acento-suave'
export const SIN_FOTO =
  'flex h-[180px] w-full items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,#1e1b4b,#312e81)] text-[48px] text-primario'

// ── Ventana de detalle ──
export const OVERLAY = 'fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto bg-[rgba(0,0,0,0.75)] p-5'
export const MODAL = `relative flex max-h-[95vh] w-full max-w-[940px] animate-[modalEntrar_0.22s_ease] flex-col overflow-y-auto rounded-[16px] border ${BORDE} bg-fondo shadow-[0_24px_60px_rgba(0,0,0,0.6)] min-[701px]:max-h-[90vh] min-[701px]:flex-row`
export const MODAL_CERRAR =
  'absolute top-3 right-[14px] z-10 flex size-[30px] cursor-pointer items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.06)] text-[1rem] text-acento-suave transition-[background,color] duration-200 ease-[ease] hover:bg-[rgba(255,255,255,0.14)] hover:text-white'

// Columna izquierda: ficha del animal
export const INFO =
  'flex w-full min-w-auto flex-col gap-[18px] rounded-[16px_16px_0_0] bg-fondo px-6 py-7 min-[701px]:w-[280px] min-[701px]:min-w-[260px] min-[701px]:rounded-[16px_0_0_16px]'
export const INFO_IMG = 'h-[160px] w-full rounded-[12px] object-cover min-[701px]:h-[180px]'
export const INFO_NOMBRE = `text-[1.25rem] font-bold ${TEXTO_PRINCIPAL}`
export const FICHA_SECCION = 'flex flex-col gap-4'
export const FICHA_BLOQUE = 'flex flex-col gap-2'
export const FICHA_ETIQUETA = 'text-[0.62rem] font-bold tracking-[0.06em] text-acento-suave uppercase'
export const FICHA_GRUPO = 'flex flex-wrap gap-[6px]'
export const DATOS = 'grid grid-cols-[1fr_1fr] gap-[14px]'
export const DATO = 'flex flex-col'
export const DATO_ETIQUETA = 'mb-[3px] block text-[0.625rem] tracking-[0.06em] text-acento-suave uppercase'
export const DATO_VALOR = `text-[0.85rem] font-medium ${TEXTO_PRINCIPAL}`
export const HISTORIA = `rounded-[10px] border ${BORDE} bg-superficie px-4 py-[14px]`
export const HISTORIA_TITULO = `mb-[6px] text-[0.9rem] font-semibold ${TEXTO_PRINCIPAL}`
export const HISTORIA_TEXTO = 'text-[0.82rem] leading-[1.6] text-acento-suave'

// Etiquetas de color (verde, azul, violeta, y el estado de salud)
const INSIGNIA = 'rounded-[20px] border px-3 py-1 text-[0.72rem] font-semibold'
const INSIGNIA_COLOR = {
  verde: 'border-[rgba(124,58,237,0.3)] bg-[rgba(16,185,129,0.15)] text-exito',
  cian: 'border-[rgba(56,189,248,0.35)] bg-[rgba(56,189,248,0.15)] text-[#38bdf8]',
  violeta: 'border-[rgba(192,132,252,0.35)] bg-[rgba(192,132,252,0.15)] text-[#c084fc]',
  vacunado: 'border-[rgba(16,185,129,0.4)] bg-[rgba(16,185,129,0.18)] text-exito',
  sinVacunas: 'border-[rgba(225,29,72,0.4)] bg-[rgba(225,29,72,0.18)] text-peligro-claro',
  esterilizado: 'border-[rgba(124,58,237,0.4)] bg-[rgba(124,58,237,0.18)] text-acento',
  sinEsterilizar: 'border-[rgba(148,163,184,0.35)] bg-[rgba(148,163,184,0.18)] text-texto-suave',
  desparasitado: 'border-[rgba(14,165,233,0.4)] bg-[rgba(14,165,233,0.18)] text-[#38bdf8]',
  sinDesparasitar: 'border-[rgba(225,29,72,0.4)] bg-[rgba(225,29,72,0.18)] text-peligro-claro',
}
export const insignia = (color) => `${INSIGNIA} ${INSIGNIA_COLOR[color]}`

// Columna derecha: formulario
export const FORMULARIO_PANEL =
  'flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-6 min-[701px]:px-8 min-[701px]:pt-8 min-[701px]:pb-7'
export const FORMULARIO = 'mt-2 flex flex-col gap-5'
export const FORM_TITULO = `text-[1.25rem] font-bold ${TEXTO_PRINCIPAL}`
export const FORM_SUBTITULO = 'text-[0.85rem] leading-[1.5] text-primario'
export const FORM_GRUPO = 'flex flex-col gap-2'
export const FORM_ETIQUETA = `text-[0.85rem] font-semibold ${TEXTO_PRINCIPAL}`
export const FORM_CAMPO = `resize-y rounded-[8px] border ${BORDE} bg-superficie px-[14px] py-[11px] text-[0.9rem] ${TEXTO_PRINCIPAL} transition-[border-color] duration-200 ease-[ease] outline-none placeholder:text-acento-suave focus:border-primario focus-visible:outline-none`
export const CASILLAS = `flex flex-col gap-[14px] rounded-[8px] border ${BORDE} bg-superficie px-4 py-[14px]`
export const CASILLA = 'flex cursor-pointer items-start gap-[10px]'
export const CASILLA_CAJA =
  'mt-[2px] size-4 min-w-4 cursor-pointer appearance-none rounded-[4px] border-[1.5px] border-solid border-acento-suave bg-transparent p-0 transition-[background,border-color] duration-200 ease-[ease] outline-none checked:border-primario checked:bg-primario checked:bg-[image:var(--icono-check)] checked:bg-center checked:bg-no-repeat checked:bg-[length:10px] focus:shadow-[0_0_0_2px_rgba(124,58,237,0.3)] focus-visible:outline-none'
export const CASILLA_TEXTO = `text-[0.88rem] leading-[1.5] ${TEXTO_PRINCIPAL}`

// Solicitud enviada
export const EXITO = 'flex flex-1 flex-col items-center justify-center gap-[14px] px-[30px] py-[50px] text-center'
export const EXITO_ICONO =
  'flex size-[60px] items-center justify-center rounded-full border-2 border-[rgba(124,58,237,0.3)] bg-[rgba(16,185,129,0.15)] text-[1.8rem] text-primario'
export const EXITO_TITULO = `text-[1.1rem] font-bold ${TEXTO_PRINCIPAL}`
export const EXITO_TEXTO = 'max-w-[300px] text-[0.85rem] leading-[1.5] text-acento-suave'
