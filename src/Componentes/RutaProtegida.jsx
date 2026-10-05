import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext.jsx'
import { rutaInicioPorRol } from '../Services/authService.js'

// Uso: <Route element={<RutaProtegida roles={['admin']} />}> ...rutas hijas... </Route>
const RutaProtegida = ({ roles }) => {
  const { usuario } = useAuth()

  // Sin sesión: se envía al login
  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  // Con sesión pero rol incorrecto: se envía a su propio inicio
  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to={rutaInicioPorRol(usuario)} replace />
  }

  return <Outlet />
}

export default RutaProtegida
