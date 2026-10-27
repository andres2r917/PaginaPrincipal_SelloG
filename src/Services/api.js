import axios from 'axios'

// La dirección viene del .env: VITE_API_URL=http://api.selloguardian.test/api
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // Sin este header, Laravel responde con errores HTML en vez de JSON
  headers: { Accept: 'application/json' },
})

// Antes de cada petición se agrega el token guardado al iniciar sesión
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Si el token venció o no es válido (401), se borra y se manda al login.
// El login con contraseña incorrecta también da 401: se excluye.
api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    const esLogin = error.config?.url === '/login'
    if (error.response?.status === 401 && !esLogin && localStorage.getItem('token')) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Saca el mensaje a mostrar de un error de axios
export const mensajeError = (error) => {
  if (!error.response) {
    return 'No se pudo conectar con el servidor. Verifica que el backend esté encendido.'
  }
  const datos = error.response.data
  // Errores de validación de Laravel (422): se muestra el primero
  if (datos?.errors) {
    return Object.values(datos.errors)[0][0]
  }
  return datos?.message || 'Ocurrió un error. Intenta de nuevo.'
}

export default api
