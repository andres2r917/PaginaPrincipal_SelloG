import api, { mensajeError } from './api.js'
import { mapUsuario } from './authService.js'

// Convierte una mascota de la API (nombres de columna) a la forma que usa el panel de fundación
export const mapMascota = (p) => ({
  id: p.id,
  fundacionId: p.Id_fundacion,
  nombre: p.Nombre,
  especie: p.Especie,
  raza: p.Raza,
  sexo: p.Sexo ?? '',
  edadEstimada: p.Edad_estimada,
  tamano: p.Tamano,
  estadoSalud: p.Estado_salud,
  temperamento: p.Temperamento ?? '',
  convivencia: p.Convivencia ?? '',
  vacunado: Boolean(p.Vacunado),
  esterilizado: Boolean(p.Esterilizado),
  desparasitado: Boolean(p.Desparasitado),
  descripcion: p.Descripcion_personalidad,
  fotoUrl: p.Foto_url,
  estadoAdopcion: p.Estado_adopcion,
  // La API entrega la fecha en UTC (ISO); las pantallas la muestran en hora local
  fechaIngreso: p.created_at,
})

// Convierte una solicitud de adopción, con los datos de quien la envió
export const mapSolicitud = (s) => {
  const perfil = s.user_civil
  const cuenta = perfil?.user
  return {
    id: s.id,
    fundacionId: s.Id_fundacion,
    mascotaId: s.Id_mascota,
    estado: s.Estado_solicitud,
    fecha: s.created_at,
    mensaje: s.Mensaje_presentacion,
    experiencia: s.Experiencia_mascotas,
    tiempoDisponible: s.Tiempo_disponible,
    compromisoVeterinario: Boolean(s.Compromiso_veterinario),
    comentariosFundacion: s.Comentarios_fundacion ?? '',
    adoptante: {
      nombre: cuenta?.Nombre_completo ?? 'Adoptante',
      foto: cuenta?.Foto_url ?? null,
      correo: cuenta?.email ?? '',
      telefono: perfil?.Telefono ?? cuenta?.Telefono ?? '',
      tipoVivienda: (perfil?.Tipo_vivienda ?? '').toLowerCase(),
      salario: perfil?.Salario != null ? Number(perfil.Salario) : 0,
      hijos: perfil ? (perfil.Tiene_hijos ? 'si' : 'no') : '',
    },
  }
}

// Ejecuta una petición y, si falla, lanza un Error con el mensaje que se debe mostrar
const pedir = async (peticion) => {
  try {
    return await peticion()
  } catch (error) {
    throw new Error(mensajeError(error), { cause: error })
  }
}

export const getMascotas = () =>
  pedir(async () => (await api.get('/foundation/pets')).data.map(mapMascota))

export const getSolicitudes = () =>
  pedir(async () => (await api.get('/foundation/adoption-applications')).data.map(mapSolicitud))

// Nombres del panel -> columnas de la API. Solo viaja lo que venga definido.
const COLUMNAS_MASCOTA = {
  nombre: 'Nombre',
  especie: 'Especie',
  raza: 'Raza',
  edadEstimada: 'Edad_estimada',
  tamano: 'Tamano',
  sexo: 'Sexo',
  temperamento: 'Temperamento',
  convivencia: 'Convivencia',
  estadoSalud: 'Estado_salud',
  descripcion: 'Descripcion_personalidad',
  estadoAdopcion: 'Estado_adopcion',
  vacunado: 'Vacunado',
  esterilizado: 'Esterilizado',
  desparasitado: 'Desparasitado',
}

const aColumnas = (datos) => {
  const columnas = {}
  Object.entries(COLUMNAS_MASCOTA).forEach(([clave, columna]) => {
    if (datos[clave] === undefined) return
    columnas[columna] = typeof datos[clave] === 'boolean' ? (datos[clave] ? 1 : 0) : datos[clave]
  })
  return columnas
}

// Registrar ingreso: puede llevar la foto como archivo (foto) o como enlace (fotoUrl)
export const crearMascota = (datos) =>
  pedir(async () => {
    const formulario = new FormData()
    Object.entries(aColumnas(datos)).forEach(([columna, valor]) => formulario.append(columna, valor))
    if (datos.foto) formulario.append('Foto', datos.foto)
    else if (datos.fotoUrl) formulario.append('Foto_url', datos.fotoUrl)
    return mapMascota((await api.post('/foundation/pets', formulario)).data)
  })

// Gestionar, o mover la tarjeta del Kanban (entonces solo viaja Estado_adopcion).
// Una foto nueva exige multipart, y Laravel solo lee multipart en POST: por eso se simula el PUT.
export const actualizarMascota = (id, datos) =>
  pedir(async () => {
    const columnas = aColumnas(datos)
    if (datos.foto) {
      const formulario = new FormData()
      Object.entries(columnas).forEach(([columna, valor]) => formulario.append(columna, valor))
      formulario.append('Foto', datos.foto)
      formulario.append('_method', 'PUT')
      return mapMascota((await api.post(`/foundation/pets/${id}`, formulario)).data)
    }
    // fotoUrl vacío quita la foto; si no viene definido, la foto no se toca
    if (datos.fotoUrl !== undefined) columnas.Foto_url = datos.fotoUrl || null
    return mapMascota((await api.put(`/foundation/pets/${id}`, columnas)).data)
  })

export const resolverSolicitud = (id, estado, comentarios = '') =>
  pedir(async () =>
    mapSolicitud(
      (await api.put(`/foundation/adoption-applications/${id}`, {
        Estado_solicitud: estado,
        Comentarios_fundacion: comentarios,
      })).data
    )
  )

// Ajustes: cada tarjeta manda solo sus campos. Devuelve el usuario ya actualizado.
export const guardarPerfilFundacion = (datos) =>
  pedir(async () => {
    const columnas = {
      Nombre_organizacion: datos.nombre,
      Cedula_representante: datos.cedulaRepresentante,
      Nombre_representante: datos.representante,
      Telefono: datos.telefono,
      Direccion: datos.direccion,
      Redes: datos.redes,
      Descripcion: datos.descripcion,
      Capacidad: datos.capacidad,
    }
    Object.keys(columnas).forEach((k) => columnas[k] === undefined && delete columnas[k])
    return mapUsuario((await api.put('/foundation/profile', columnas)).data)
  })
