import api, { mensajeError } from './api.js'

// Fecha_denuncia llega como "2026-10-24 16:46:09" (hora UTC, sin zona): se marca como UTC para que "hace X" salga bien
const aFechaIso = (fecha) => (fecha && !fecha.includes('T') ? `${fecha.replace(' ', 'T')}Z` : fecha)

// Convierte una denuncia de la API (nombres de columna) a la forma que usan los componentes
export const mapDenuncia = (d) => ({
  id: d.id,
  tipo: d.Tipo_denuncia,
  descripcion: d.Descripcion_hecho,
  ubicacion: d.Ubicacion,
  latitud: d.Latitud != null ? Number(d.Latitud) : null,
  longitud: d.Longitud != null ? Number(d.Longitud) : null,
  anonima: Boolean(d.Anonima),
  estado: d.Estado_denuncia,
  urgencia: d.Urgencia,
  fecha: aFechaIso(d.Fecha_denuncia),
  // "Mías" no trae reportado_por: se deduce de si fue anónima
  reportadoPor: d.reportado_por ?? (d.Anonima
    ? { tipo: 'anonimo', nombre: 'Denuncia anónima' }
    : { tipo: 'civil', nombre: 'Usuario registrado' }),
  fundacionAsignada: d.fundacion_asignada
    ? { id: d.fundacion_asignada.id, nombre: d.fundacion_asignada.Nombre_organizacion, telefono: d.fundacion_asignada.Telefono }
    : null,
  fechaAsignacion: d.Fecha_asignacion,
  evidencias: (d.evidences ?? []).map((e) => ({
    id: e.id,
    url: e.Url,
    tipoArchivo: e.Tipo_archivo,
    tamanoBytes: e.Tamano_bytes,
  })),
})

// Feed público; el admin ve además las descartadas
export const getDenuncias = async (esAdmin = false) => {
  const { data } = await api.get(esAdmin ? '/admin/denunciations' : '/denunciations')
  return data.map(mapDenuncia)
}

// Pestaña "Mías" (requiere sesión)
export const getMisDenuncias = async () => {
  const { data } = await api.get('/denunciations/mine')
  return data.map(mapDenuncia)
}

// Teléfono de emergencia de la plataforma (platform_settings)
export const getTelefonoEmergencia = async () => {
  const { data } = await api.get('/settings/emergency-phone')
  return data.Telefono_emergencia ?? ''
}

// Crea una denuncia. Va como FormData porque lleva archivos (evidencias[]).
export const crearDenuncia = async (datos) => {
  const formData = new FormData()
  formData.append('Tipo_denuncia', datos.tipo)
  formData.append('Descripcion_hecho', datos.descripcion)
  formData.append('Ubicacion', datos.ubicacion)
  if (datos.latitud != null) formData.append('Latitud', datos.latitud)
  if (datos.longitud != null) formData.append('Longitud', datos.longitud)
  formData.append('Anonima', datos.anonima ? 1 : 0)
  formData.append('Urgencia', datos.urgencia || 'Media')
  datos.archivos?.forEach((archivo) => formData.append('evidencias[]', archivo))

  try {
    const { data } = await api.post('/denunciations', formData)
    return mapDenuncia(data)
  } catch (error) {
    throw new Error(mensajeError(error), { cause: error })
  }
}

// Una fundación se hace cargo del caso. Si otra se adelantó, la API responde 409.
export const reclamarDenuncia = (id) => api.patch(`/denunciations/${id}/claim`)

// El admin asigna el caso a una fundación verificada
export const asignarDenuncia = (id, fundacionId) =>
  api.put(`/admin/denunciations/${id}/assign`, { Id_fundacion_asignada: fundacionId })

// Admin: cualquier estado. Fundación: solo en su propio caso.
export const actualizarEstado = (id, estado) =>
  api.patch(`/denunciations/${id}/status`, { Estado_denuncia: estado })
