import { usuariosDemo } from '../Data/usuariosDemo.js'

const CLAVE_REGISTRADOS = 'usuariosRegistrados'

// Lee los usuarios creados desde los formularios de registro
const leerRegistrados = () => {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_REGISTRADOS)) || []
  } catch {
    return []
  }
}

// Quita la contraseña antes de guardar la sesión
const sinPassword = (usuario) => {
  const copia = { ...usuario }
  delete copia.password
  return copia
}

// Valida credenciales: devuelve { usuario } o lanza Error con el mensaje a mostrar
export const iniciarSesion = async (email, password) => {
  const correo = email.trim().toLowerCase()
  const todos = [...usuariosDemo, ...leerRegistrados()]
  const encontrado = todos.find(
    (u) => u.email.toLowerCase() === correo && u.password === password
  )

  if (!encontrado) {
    throw new Error('Correo o contraseña incorrectos.')
  }

  // Una fundación nueva no entra al panel hasta que sea verificada
  if (encontrado.rol === 'fundacion' && encontrado.estadoVerificacion !== 'verificada') {
    throw new Error('Tu fundación aún está pendiente de verificación por el administrador.')
  }

  return { usuario: sinPassword(encontrado) }
}

// Crea un usuario desde Registro / RegistroFundacion
export const registrarUsuario = async (datos) => {
  const registrados = leerRegistrados()
  const correo = datos.email.trim().toLowerCase()
  const yaExiste = [...usuariosDemo, ...registrados].some(
    (u) => u.email.toLowerCase() === correo
  )

  if (yaExiste) {
    throw new Error('Ya existe una cuenta con ese correo.')
  }

  const nuevo = { id: Date.now(), foto: null, ...datos, email: correo }
  localStorage.setItem(CLAVE_REGISTRADOS, JSON.stringify([...registrados, nuevo]))
  return sinPassword(nuevo)
}

// Ruta de inicio según el rol (el civil va a /perfil hasta completarlo)
export const rutaInicioPorRol = (usuario) => {
  if (usuario.rol === 'admin') return '/admin'
  if (usuario.rol === 'fundacion') return '/fundacion'
  return usuario.perfilCompleto ? '/home' : '/perfil'
}
