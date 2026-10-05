// Puntúa de 0 a 100 qué tan sólida es una solicitud de adopción (es solo orientativa)
export const calcularPuntuacion = (solicitud) => {
  const a = solicitud.adoptante || {}
  let puntos = 0

  // Vivienda (25)
  if (a.tipoVivienda === 'casa' || a.tipoVivienda === 'finca') puntos += 25
  else if (a.tipoVivienda === 'apartamento') puntos += 15

  // Experiencia previa con mascotas (25)
  const experiencia = (solicitud.experiencia || '').trim()
  if (experiencia.length > 40) puntos += 25
  else if (experiencia.length > 0) puntos += 12

  // Compromiso de atención veterinaria (25)
  if (solicitud.compromisoVeterinario) puntos += 25

  // Tiempo disponible: 'poco' | 'medio' | 'mucho' (15)
  if (solicitud.tiempoDisponible === 'mucho') puntos += 15
  else if (solicitud.tiempoDisponible === 'medio') puntos += 9
  else if (solicitud.tiempoDisponible === 'poco') puntos += 4

  // Ingresos declarados (10): peso bajo para no excluir por dinero
  if (Number(a.salario) >= 1500000) puntos += 10
  else if (Number(a.salario) > 0) puntos += 6

  return Math.min(100, puntos)
}

// Prioritaria = puntuación alta (alimenta el KPI "N prioritarias")
export const esPrioritaria = (solicitud) => calcularPuntuacion(solicitud) >= 85
