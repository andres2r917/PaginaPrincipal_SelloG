import { mapMascota } from './fundacionService.js'
import api, { mensajeError } from './api.js'

// Convierte una fundación de la API (nombres de columna) a la forma que usan las pantallas de admin
export const mapFundacion = (f) => ({
  id: f.id,
  nombre: f.Nombre_organizacion,
  representante: f.Nombre_representante,
  cedulaRepresentante: f.Cedula_representante,
  telefono: f.Telefono,
  correo: f.user?.email ?? f.Email_contacto ?? '',
  direccion: f.Direccion,
  capacidad: f.Capacidad,
  descripcion: f.Descripcion ?? '',
  fechaSolicitud: f.created_at,
  estado: f.Estado_verificacion,
  motivoRechazo: f.Motivo_rechazo ?? '',
  evidencias: (f.evidences ?? []).map((e) => ({ id: e.id, url: e.Url, tipoArchivo: e.Tipo_archivo })),
})

// AdminAdopciones.jsx: todas las fundaciones registradas (pendientes, verificadas y rechazadas)
export const getFundaciones = async () => {
  try {
    const { data } = await api.get('/admin/foundations')
    return data.map(mapFundacion)
  } catch (error) {
    throw new Error(mensajeError(error), { cause: error })
  }
}

// estado: 'verificada' | 'rechazada'. Al rechazar hay que enviar el motivo.
export const verificarFundacion = async (id, estado, motivo = '') => {
  try {
    await api.put(`/admin/foundations/${id}/verification`, {
      Estado_verificacion: estado,
      Motivo_rechazo: estado === 'rechazada' ? motivo : null,
    })
  } catch (error) {
    throw new Error(mensajeError(error), { cause: error })
  }
}

// AdminDashboard.jsx: cifras generales de la plataforma
export const getEstadisticas = async () => {
  try {
    const { data } = await api.get('/admin/stats')
    return data
  } catch (error) {
    throw new Error(mensajeError(error), { cause: error })
  }
}

// AdminUsuarios.jsx: usuarios civiles con su perfil y cuántas denuncias han hecho
export const getCiviles = async () => {
  try {
    const { data } = await api.get('/admin/users/civiles')
    return data.map((u) => ({
      id: u.id,
      nombre: u.Nombre_completo,
      correo: u.email,
      telefono: u.Telefono ?? u.user_civil?.Telefono ?? '',
      direccion: u.user_civil?.Direccion ?? '',
      vivienda: u.user_civil?.Tipo_vivienda ?? '',
      ocupacion: u.user_civil?.Ocupacion ?? '',
      fechaRegistro: u.Fecha_registro ?? u.created_at,
      denuncias: u.denunciations_count ?? 0,
    }))
  } catch (error) {
    throw new Error(mensajeError(error), { cause: error })
  }
}

export const getAdministradores = async () => {
  try {
    const { data } = await api.get('/admin/users/administradores')
    return data.map((a) => ({
      id: a.id,
      nombre: a.user?.Nombre_completo ?? '',
      correo: a.user?.email ?? '',
      nivel: a.Nivel_acceso ?? '',
    }))
  } catch (error) {
    throw new Error(mensajeError(error), { cause: error })
  }
}

// AdminMascotas.jsx: todas las mascotas, con el nombre de su fundación
export const getMascotasAdmin = async () => {
  try {
    const { data } = await api.get('/admin/pets')
    return data.map((p) => ({ ...mapMascota(p), fundacion: p.foundation?.Nombre_organizacion ?? '—' }))
  } catch (error) {
    throw new Error(mensajeError(error), { cause: error })
  }
}

// AdminConfiguracion.jsx: la plataforma tiene una sola fila de configuración
export const getConfiguracion = async () => {
  try {
    const { data } = await api.get('/admin/settings')
    return {
      nombre: data.Nombre_plataforma ?? '',
      emailSoporte: data.Email_soporte ?? '',
      telefonoEmergencia: data.Telefono_emergencia ?? '',
      notificaciones: Boolean(data.Notificaciones_activas),
      mantenimiento: Boolean(data.Modo_mantenimiento),
    }
  } catch (error) {
    throw new Error(mensajeError(error), { cause: error })
  }
}

export const guardarConfiguracion = async (c) => {
  try {
    await api.put('/admin/settings', {
      Nombre_plataforma: c.nombre,
      Email_soporte: c.emailSoporte || null,
      Telefono_emergencia: c.telefonoEmergencia || null,
      Notificaciones_activas: c.notificaciones,
      Modo_mantenimiento: c.mantenimiento,
    })
  } catch (error) {
    throw new Error(mensajeError(error), { cause: error })
  }
}
