import api, { mensajeError } from './api.js'

// "grande" -> "Grande": los filtros de la página comparan con la primera letra en mayúscula
const capitalizar = (texto = '') => texto.charAt(0).toUpperCase() + texto.slice(1)

// Convierte una mascota de la API (nombres de columna) a la forma que usan las pantallas
export const mapMascota = (p) => ({
  id: p.id,
  nombre: p.Nombre,
  especie: p.Especie,
  raza: p.Raza,
  sexo: capitalizar(p.Sexo ?? ''),
  edad: p.Edad_estimada,
  tamano: capitalizar(p.Tamano),
  salud: p.Estado_salud,
  temperamento: p.Temperamento ?? '',
  vacunado: Boolean(p.Vacunado),
  esterilizado: Boolean(p.Esterilizado),
  desparasitado: Boolean(p.Desparasitado),
  convivencia: p.Convivencia ?? '',
  historia: p.Descripcion_personalidad,
  img: p.Foto_url,
  fundacionId: p.Id_fundacion,
})

// Adopcion.jsx: solo las mascotas disponibles (la API ya filtra)
export const getMascotasDisponibles = async () => {
  try {
    const { data } = await api.get('/pets')
    return data.map(mapMascota)
  } catch (error) {
    throw new Error(mensajeError(error), { cause: error })
  }
}

// Solicitud de adopción del usuario civil. El adoptante sale del token y la fundación de la mascota.
export const solicitarAdopcion = async (idMascota, datos) => {
  try {
    await api.post('/adoption-applications', {
      Id_mascota: idMascota,
      Mensaje_presentacion: datos.mensaje_presentacion,
      Experiencia_mascotas: datos.experiencia_mascotas,
      Tiempo_disponible: datos.tiempo_disponible,
      Compromiso_veterinario: datos.compromiso_veterinario ? 1 : 0,
    })
  } catch (error) {
    throw new Error(mensajeError(error), { cause: error })
  }
}

// Solicitudes del usuario civil con sesión (Header.jsx las usa para sus notificaciones)
export const getMisSolicitudes = async () => {
  try {
    const { data } = await api.get('/adoption-applications/mine')
    return data.map((s) => ({
      id: s.id,
      estado: s.Estado_solicitud,
      comentarios: s.Comentarios_fundacion ?? '',
      // La fecha de la decisión no se guarda aparte: updated_at cambia cuando la fundación responde
      fecha: s.updated_at,
      enviada: s.Fecha_envio ?? s.created_at,
      mascota: s.pet?.Nombre ?? 'la mascota',
      mascotaFoto: s.pet?.Foto_url ?? '',
      mascotaAdoptada: s.pet?.Estado_adopcion === 'adoptado',
      fundacion: s.foundation?.Nombre_organizacion ?? 'la fundación',
      telefonoFundacion: s.foundation?.Telefono ?? '',
    }))
  } catch (error) {
    throw new Error(mensajeError(error), { cause: error })
  }
}
