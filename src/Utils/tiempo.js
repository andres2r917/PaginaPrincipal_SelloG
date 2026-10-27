// Texto relativo a partir de una fecha ISO: "Hace 5 min", "Hace 3 h", "Hace 2 d"
export const hace = (fechaISO) => {
  const min = Math.max(0, Math.floor((Date.now() - new Date(fechaISO).getTime()) / 60000))
  if (min < 1) return 'Hace un momento'
  if (min < 60) return `Hace ${min} min`
  const horas = Math.floor(min / 60)
  if (horas < 24) return `Hace ${horas} h`
  return `Hace ${Math.floor(horas / 24)} d`
}
