// Pasa a minúsculas y quita tildes, para comparar textos al buscar ("canino" encuentra "Caníno")
export const limpiarTexto = (texto = '') =>
  String(texto).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
