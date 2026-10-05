import { createContext, useContext, useState } from 'react'
import { iniciarSesion, rutaInicioPorRol } from '../Services/authService.js'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  // La sesión se recupera de localStorage al recargar la página
  const [usuario, setUsuario] = useState(() => {
    try {
      const guardado = localStorage.getItem('usuario')
      return guardado ? JSON.parse(guardado) : null
    } catch {
      return null
    }
  })

  const guardar = (datos) => {
    setUsuario(datos)
    localStorage.setItem('usuario', JSON.stringify(datos))
  }

  // Devuelve la ruta a la que debe ir el usuario; lanza Error si las credenciales fallan
  const login = async (email, password) => {
    const { usuario: autenticado } = await iniciarSesion(email, password)
    guardar(autenticado)
    return rutaInicioPorRol(autenticado)
  }

  const actualizarUsuario = (datosActualizados) => {
    setUsuario((prev) => {
      const siguiente = { ...(prev || {}), ...datosActualizados }
      localStorage.setItem('usuario', JSON.stringify(siguiente))
      return siguiente
    })
  }

  const logout = () => {
    setUsuario(null)
    localStorage.removeItem('usuario')
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout, actualizarUsuario }}>
      {children}
    </AuthContext.Provider>
  )
}

// El provider y su hook comparten el contexto intencionalmente.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
