// Puntúa de 0 a 100 qué tan sólida es una solicitud de adopción (es solo orientativa)
export const calcularPuntuacion = (solicitud) => {
  const a = solicitud.adoptante || {}
  let puntos = 0

  // Vivienda (25)
  if (a.tipoVivienda === 'casa' || a.tipoVivienda === 'finca') puntos += 25
  else if (a.tipoVivienda === 'apartamento') puntos += 15

  // Experiencia previa con mascotas (25): el formulario ofrece opciones, "Nunca..." no suma
  const experiencia = (solicitud.experiencia || '').trim().toLowerCase()
  if (experiencia && !experiencia.startsWith('nunca')) puntos += 25

  // Compromiso de atención veterinaria (25)
  if (solicitud.compromisoVeterinario) puntos += 25

  // Tiempo disponible, según la opción elegida en el formulario (15)
  const tiempo = solicitud.tiempoDisponible || ''
  if (tiempo === 'Más de 6 horas' || tiempo === 'Estoy en casa todo el día') puntos += 15
  else if (tiempo === 'Entre 4 y 6 horas' || tiempo === 'Entre 2 y 4 horas') puntos += 9
  else if (tiempo) puntos += 4

  // Ingresos declarados (10): peso bajo para no excluir por dinero
  if (Number(a.salario) >= 1500000) puntos += 10
  else if (Number(a.salario) > 0) puntos += 6

  return Math.min(100, puntos)
}

// Prioritaria = puntuación alta (alimenta el KPI "N prioritarias")
export const esPrioritaria = (solicitud) => calcularPuntuacion(solicitud) >= 85

// Clase CSS del color de la puntuación (alta, media o baja)
export const claseScore = (p) => p >= 85 ? 'fnd-score--alta' : p >= 60 ? 'fnd-score--media' : 'fnd-score--baja'
