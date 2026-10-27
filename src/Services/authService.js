import api, { mensajeError } from './api.js'

// Convierte el usuario de la API (nombres de columna) a la forma que usan los componentes
export const mapUsuario = (u) => {
  const rol = u.role.Nombre_rol
  const civil = u.user_civil
  const fundacion = u.foundation

  const base = {
    id: u.id,
    // Una fundación se muestra con el nombre de su organización
    nombre: fundacion?.Nombre_organizacion ?? u.Nombre_completo,
    email: u.email,
    rol,
    foto: u.Foto_url ?? null,
    // El civil guarda su teléfono en el perfil (usercivils); la fundación en su organización
    telefono: fundacion?.Telefono ?? civil?.Telefono ?? u.Telefono ?? '',
  }

  if (rol === 'civil') {
    return {
      ...base,
      // El perfil está completo cuando ya existe su fila en usercivils
      perfilCompleto: civil !== null,
      documento: civil?.Documento_identidad ?? '',
      fechaNacimiento: civil?.Fecha_nacimiento ?? '',
      direccion: civil?.Direccion ?? '',
      tipoVivienda: civil?.Tipo_vivienda ?? '',
      ocupacion: civil?.Ocupacion ?? '',
      // La API devuelve el decimal como texto ("3000000.00"); se muestra como número
      salario: civil?.Salario != null ? String(Number(civil.Salario)) : '',
      hijos: civil ? (civil.Tiene_hijos ? 'si' : 'no') : '',
    }
  }

  if (rol === 'fundacion') {
    return {
      ...base,
      fundacionId: fundacion.id,
      estadoVerificacion: fundacion.Estado_verificacion,
      representante: fundacion.Nombre_representante,
      cedulaRepresentante: fundacion.Cedula_representante,
      direccion: fundacion.Direccion,
      redes: fundacion.Redes ?? '',
      descripcion: fundacion.Descripcion ?? '',
      capacidad: fundacion.Capacidad,
    }
  }

  return base
}

// Inicia sesión: guarda el token y devuelve { usuario }. Lanza Error con el mensaje a mostrar.
export const iniciarSesion = async (email, password) => {
  try {
    const { data } = await api.post('/login', { email: email.trim().toLowerCase(), password })
    localStorage.setItem('token', data.token)
    return { usuario: mapUsuario(data.usuario) }
  } catch (error) {
    throw new Error(mensajeError(error), { cause: error })
  }
}

// Registro.jsx (usuario civil). No guarda el token: después del registro se va al login.
export const registrarCivil = async ({ nombre, email, password }) => {
  try {
    await api.post('/register', {
      Nombre_completo: nombre,
      email: email.trim().toLowerCase(),
      password,
    })
  } catch (error) {
    // El mensaje por defecto de Laravel viene en inglés
    if (error.response?.data?.errors?.email) {
      throw new Error('Ya existe una cuenta con ese correo.', { cause: error })
    }
    throw new Error(mensajeError(error), { cause: error })
  }
}

// RegistroFundacion.jsx. Queda pendiente de verificación y no recibe token.
export const registrarFundacion = async (datos) => {
  try {
    // FormData porque pueden ir fotos o videos (opcionales)
    const formulario = new FormData()
    formulario.append('Nombre_organizacion', datos.nombre)
    formulario.append('Nombre_representante', datos.representante)
    formulario.append('Cedula_representante', datos.cedulaRepresentante)
    formulario.append('Telefono', datos.telefono)
    // El formulario pide la ciudad; se guarda en Direccion
    formulario.append('Direccion', datos.ciudad)
    formulario.append('email', datos.email.trim().toLowerCase())
    formulario.append('password', datos.password)
    ;(datos.archivos ?? []).forEach((archivo) => formulario.append('evidencias[]', archivo))

    await api.post('/register/foundation', formulario)
  } catch (error) {
    if (error.response?.data?.errors?.email) {
      throw new Error('Ya existe una cuenta con ese correo.', { cause: error })
    }
    throw new Error(mensajeError(error), { cause: error })
  }
}

// Perfil.jsx: crea o actualiza los datos del usuario civil. Devuelve el usuario ya actualizado.
export const guardarPerfilCivil = async (datos) => {
  try {
    const { data } = await api.put('/perfil', {
      Documento_identidad: datos.documento,
      Fecha_nacimiento: datos.fechaNacimiento,
      Tipo_vivienda: datos.tipoVivienda,
      Direccion: datos.direccion || null,
      Ocupacion: datos.ocupacion || null,
      Salario: datos.salario === '' ? null : Number(datos.salario),
      Telefono: datos.telefono || null,
      Tiene_hijos: datos.hijos === 'si' ? 1 : 0,
    })
    return mapUsuario(data)
  } catch (error) {
    if (error.response?.data?.errors?.Documento_identidad) {
      throw new Error('Ya existe una cuenta con ese documento de identidad.', { cause: error })
    }
    throw new Error(mensajeError(error), { cause: error })
  }
}

// Sube la foto de perfil (archivo de imagen, máximo 2 MB). Devuelve el usuario actualizado.
export const subirFotoPerfil = async (archivo) => {
  try {
    const formulario = new FormData()
    formulario.append('Foto', archivo)
    const { data } = await api.post('/perfil/foto', formulario)
    return mapUsuario(data)
  } catch (error) {
    throw new Error(mensajeError(error), { cause: error })
  }
}

// Recupera la sesión al recargar la página (usa el token guardado)
export const obtenerSesion = async () => {
  const { data } = await api.get('/me')
  return mapUsuario(data)
}

// Cierra la sesión: el token se borra de inmediato y se avisa al servidor para que lo invalide
export const cerrarSesion = () => {
  const token = localStorage.getItem('token')
  localStorage.removeItem('token')
  if (token) {
    api.post('/logout', null, { headers: { Authorization: `Bearer ${token}` } }).catch(() => {})
  }
}

// Ruta de inicio según el rol (el civil entra directamente a /home)
export const rutaInicioPorRol = (usuario) => {
  if (usuario.rol === 'admin') return '/admin'
  if (usuario.rol === 'fundacion') return '/fundacion'
  return '/home'
}
