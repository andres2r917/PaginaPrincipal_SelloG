import { createContext, useContext, useEffect, useState } from 'react'
import {
  iniciarSesion,
  obtenerSesion,
  cerrarSesion,
  rutaInicioPorRol,
  guardarPerfilCivil,
  subirFotoPerfil,
} from '../Services/authService.js'
import { guardarPerfilFundacion as guardarPerfilFundacionApi } from '../Services/fundacionService.js'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null)
  // Mientras se verifica el token guardado, las rutas protegidas no deben redirigir
  const [cargando, setCargando] = useState(() => Boolean(localStorage.getItem('token')))

  // Al recargar la página: si hay token, se pide quién es el usuario
  useEffect(() => {
    if (!localStorage.getItem('token')) return

    obtenerSesion()
      .then(setUsuario)
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setCargando(false))
  }, [])

  // Devuelve la ruta a la que debe ir el usuario; lanza Error si las credenciales fallan
  const login = async (email, password) => {
    const { usuario: autenticado } = await iniciarSesion(email, password)
    setUsuario(autenticado)
    return rutaInicioPorRol(autenticado)
  }

  // Perfil del civil: se guarda en la API y la sesión queda con los datos que devuelve el servidor
  const guardarPerfil = async (datos, foto) => {
    let actualizado = await guardarPerfilCivil(datos)
    if (foto) actualizado = await subirFotoPerfil(foto)
    setUsuario(actualizado)
  }

  // Ajustes de la fundación: se guardan en la API y la sesión recibe los datos del servidor
  const guardarPerfilFundacion = async (datos) => {
    setUsuario(await guardarPerfilFundacionApi(datos))
  }

  const logout = () => {
    cerrarSesion()
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, logout, guardarPerfil, guardarPerfilFundacion }}>
      {children}
    </AuthContext.Provider>
  )
}

// El provider y su hook comparten el contexto intencionalmente.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
