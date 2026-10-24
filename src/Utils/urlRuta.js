// Enlace de Google Maps con la ruta hacia el destino.
// Al abrirlo, Google Maps usa la ubicación actual de quien lo abre como punto de partida.
// Si no hay coordenadas, usa la dirección escrita.
export function crearUrlRuta(latitud, longitud, direccion = '') {
  const destino = latitud != null && longitud != null
    ? `${latitud},${longitud}`
    : encodeURIComponent(direccion);

  return `https://www.google.com/maps/dir/?api=1&destination=${destino}&travelmode=driving`;
}
