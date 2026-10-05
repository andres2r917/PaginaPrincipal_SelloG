# Sello Guardián — Auth por roles y Panel de Fundación (solo React)

## Reglas obligatorias

1. Crea los archivos marcados como **CREAR** en la ruta exacta indicada. Carpetas existentes: `src/Pages/`, `src/Componentes/`, `src/Style/`. Se permite crear estas carpetas nuevas, solo para los archivos que aquí se indican: `src/Context/`, `src/Data/`, `src/Services/`, `src/Utils/`.
2. Para los archivos marcados como **MODIFICAR**, solo cambia el bloque indicado, en el lugar exacto que señalo (busca el texto de referencia "antes de" / "después de" / "reemplaza esta línea"). No reordenes ni reescribas el resto del archivo.
3. NO agregues ningún comentario de marca de agua, firma de IA ni texto tipo "Generado por IA", "Código generado con Claude/Gemini/ChatGPT", "AI-generated", etc. El código debe verse como si lo hubiera escrito yo.
4. SÍ agrega comentarios breves en español (una línea) donde ya los pongo yo en el código de referencia. Los comentarios van solo en español.
5. MUY IMPORTANTE — evita dejar código duplicado o en conflicto: si alguno de los archivos ya tiene un import, un componente, una clase CSS o una ruta (`<Route>`) parecida a lo que vas a agregar, REEMPLAZA esa parte en vez de agregar una copia nueva. Antes de terminar, revisa cada archivo completo una vez para confirmar que:
   * Cada `import` aparece UNA sola vez por archivo.
   * Cada `<Route path="...">` aparece UNA sola vez en `App.jsx`.
   * No quedan dos clases CSS con el mismo nombre pero distinto contenido en el mismo archivo `.css`.
6. No toques `src/main.jsx`, `index.html` ni `vite.config.js`. El proyecto ya tiene `BrowserRouter` envolviendo `<App />`. Por eso el `AuthProvider` se coloca **dentro de `App.jsx`** (no en `main.jsx`). No instales librerías nuevas: se usa React 19, React Router 7 (`react-router-dom`) y `react-icons` (`fi` y `fa`), que ya están en el proyecto.
7. Al final, dame un resumen corto de qué archivos creaste y cuáles modificaste.
8. PROHIBIDO ejecutar cualquier comando de Git (`git add`, `git commit`, `git push`, `git reset`, etc.) o cualquier acción relacionada con el control de versiones. Solo debes crear y modificar los archivos indicados en el sistema de archivos. El control de versiones lo hago yo manualmente después de revisar los cambios.
9. Todo es **solo frontend**: datos simulados y sesión en `localStorage`. No hay llamadas a backend, no crees `.env` ni `fetch` a APIs.
10. Paleta "Púrpura Real & Medianoche": `#7C3AED`, `#0F172A`, `#C4B5FD`, `#10B981`, `#E11D48`. Las clases CSS nuevas del panel de fundación llevan prefijo `fnd-`; las del acceso rápido del login, `lg-`.

---

## Resumen de lo que se va a hacer

* **Auth funcional por roles** (Administrador, Usuario civil, Fundación) con un usuario por defecto de cada uno, rutas protegidas y avatar con menú en el Header.
* **Panel de Fundación** en `/fundacion`: base visual del prototipo 2, con del prototipo 1 el Kanban, la puntuación de adoptantes con Aprobar/Revisar, la campana y "Registrar Ingreso".

### Credenciales por defecto (solo desarrollo)

| Rol | Correo | Contraseña | Va a |
|---|---|---|---|
| Administrador | `admin@selloguardian.com` | `Admin123*` | `/admin` |
| Usuario civil | `civil@selloguardian.com` | `Civil123*` | `/perfil` si no ha completado su perfil, si no `/home` |
| Fundación | `fundacion@selloguardian.com` | `Fundacion123*` | `/fundacion` |

Valores de `rol` en el front: `admin`, `civil`, `fundacion`.

---

# PARTE 1 — Autenticación

## 1.1 CREAR — `src/Data/usuariosDemo.js`

```js
// Usuarios por defecto para desarrollo (simulan la tabla users)
export const usuariosDemo = [
  {
    id: 1,
    nombre: 'Administrador Sello Guardián',
    email: 'admin@selloguardian.com',
    password: 'Admin123*',
    rol: 'admin',
    foto: null,
  },
  {
    id: 2,
    nombre: 'Carlos Ruiz',
    email: 'civil@selloguardian.com',
    password: 'Civil123*',
    rol: 'civil',
    foto: null,
    // Perfil vacío: obliga a pasar por /perfil en el primer ingreso
    documento: '',
    fechaNacimiento: '',
    tipoVivienda: '',
    ocupacion: '',
    salario: '',
    telefono: '',
    hijos: '',
    perfilCompleto: false,
  },
  {
    id: 3,
    nombre: 'Huellitas Felices',
    email: 'fundacion@selloguardian.com',
    password: 'Fundacion123*',
    rol: 'fundacion',
    foto: null,
    fundacionId: 1,
    // pendiente | verificada | rechazada
    estadoVerificacion: 'verificada',
  },
]
```

## 1.2 CREAR — `src/Services/authService.js`

```js
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
const sinPassword = ({ password, ...resto }) => resto

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
```

## 1.3 CREAR — `src/Context/AuthContext.jsx`

```jsx
import React, { createContext, useContext, useState } from 'react'
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

export const useAuth = () => useContext(AuthContext)
```

## 1.4 CREAR — `src/Componentes/RutaProtegida.jsx`

```jsx
import React from 'react'
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
```

## 1.5 MODIFICAR — `src/App.jsx`

No se toca `main.jsx`: el `AuthProvider` se coloca aquí. Son 5 cambios puntuales.

**a) Imports.** Agregar estas líneas **después de** `import AdminConfiguracion from './Pages/AdminConfiguracion.jsx'`:

```jsx
import { AuthProvider } from './Context/AuthContext.jsx'
import RutaProtegida from './Componentes/RutaProtegida.jsx'
import { FundacionProvider } from './Context/FundacionContext.jsx'
import FundacionLayout from './Componentes/FundacionLayout.jsx'
import FundacionDashboard from './Pages/FundacionDashboard.jsx'
import FundacionExpedientes from './Pages/FundacionExpedientes.jsx'
import FundacionPipeline from './Pages/FundacionPipeline.jsx'
import FundacionAdopciones from './Pages/FundacionAdopciones.jsx'
import FundacionAjustes from './Pages/FundacionAjustes.jsx'
import FundacionProximamente from './Pages/FundacionProximamente.jsx'
```

**b) Renombrar el componente.** Reemplazar la línea `const App = () => {` por:

```jsx
const AppContenido = () => {
```

**c) Panel oculta el Header.** Reemplazar estas dos líneas (comentario + constante):

```jsx
  // Ocultar el navbar global en todas las rutas del panel de administrador
  const esRutaAdmin = location.pathname.startsWith('/admin')
```

por:

```jsx
  // Ocultar el navbar global en los paneles de administrador y de fundación
  const esPanel = location.pathname.startsWith('/admin') || location.pathname.startsWith('/fundacion')
```

y reemplazar `{!esRutaAdmin && <Header />}` por `{!esPanel && <Header />}`.

**d) Rutas.** Reemplazar las líneas desde `<Route path="/perfil" element={<Perfil />} />` hasta `<Route path="/admin/configuracion" element={<AdminConfiguracion />} />` (inclusive) por este bloque. No deben quedar rutas repetidas:

```jsx
        {/* Solo usuario civil */}
        <Route element={<RutaProtegida roles={['civil']} />}>
          <Route path="/perfil" element={<Perfil />} />
        </Route>

        {/* Solo administrador */}
        <Route element={<RutaProtegida roles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/adopciones" element={<AdminAdopciones />} />
          <Route path="/admin/mascotas" element={<AdminMascotas />} />
          <Route path="/admin/denuncias" element={<AdminDenuncias />} />
          <Route path="/admin/usuarios" element={<AdminUsuarios />} />
          <Route path="/admin/configuracion" element={<AdminConfiguracion />} />
        </Route>

        {/* Solo fundación, con su propio contexto de datos */}
        <Route element={<RutaProtegida roles={['fundacion']} />}>
          <Route element={<FundacionProvider><FundacionLayout /></FundacionProvider>}>
            <Route path="/fundacion" element={<FundacionDashboard />} />
            <Route path="/fundacion/expedientes" element={<FundacionExpedientes />} />
            <Route path="/fundacion/pipeline" element={<FundacionPipeline />} />
            <Route path="/fundacion/adopciones" element={<FundacionAdopciones />} />
            <Route path="/fundacion/historial-medico" element={<FundacionProximamente titulo="Historial Médico" />} />
            <Route path="/fundacion/donaciones" element={<FundacionProximamente titulo="Donaciones & Recursos" />} />
            <Route path="/fundacion/denuncias" element={<FundacionProximamente titulo="Casos de Denuncia" />} />
            <Route path="/fundacion/metricas" element={<FundacionProximamente titulo="Métricas & Auditoría" />} />
            <Route path="/fundacion/ajustes" element={<FundacionAjustes />} />
          </Route>
        </Route>
```

**e) Nuevo componente raíz.** Reemplazar la línea `export default App` (al final) por:

```jsx
// El AuthProvider envuelve todo para que Header, Login y los paneles lean la sesión
const App = () => (
  <AuthProvider>
    <AppContenido />
  </AuthProvider>
)

export default App
```

## 1.6 MODIFICAR — `src/Pages/Login.jsx`

**a)** Reemplazar la línea `import portada from '../assets/portada.jpeg';` por:

```jsx
import portada from '../assets/portada.jpeg';
import { useAuth } from '../Context/AuthContext';
```

**b)** Después de la línea `const navigate = useNavigate(); ` agregar:

```jsx
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
```

**c)** Reemplazar todo el `handleSubmit` (el que hace `console.log('Iniciando sesión con:', credentials);navigate('/perfil');`) por:

```jsx
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      // El rol lo determina la credencial: login devuelve la ruta de inicio
      const ruta = await login(credentials.email, credentials.password);
      navigate(ruta, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };
```

**d)** Agregar **justo antes de** `<div className="lg-group">` del campo "Correo electrónico" (es decir, debajo del bloque `{mensajeExito && (...)}`):

```jsx
            {error && <div className="lg-error">{error}</div>}
```

**e)** Reemplazar el botón `<button type="submit" className="lg-btn">` con su texto "Ingresar" por:

```jsx
            <button type="submit" className="lg-btn" disabled={cargando}>
              {cargando ? 'Ingresando...' : 'Ingresar'}
            </button>

            {/* Acceso rápido: solo aparece con npm run dev */}
            {import.meta.env.DEV && (
              <div className="lg-demo">
                <p className="lg-demo__titulo">Acceso rápido (solo desarrollo)</p>
                <div className="lg-demo__botones">
                  <button type="button" onClick={() => setCredentials({ ...credentials, email: 'admin@selloguardian.com', password: 'Admin123*' })}>Admin</button>
                  <button type="button" onClick={() => setCredentials({ ...credentials, email: 'civil@selloguardian.com', password: 'Civil123*' })}>Usuario civil</button>
                  <button type="button" onClick={() => setCredentials({ ...credentials, email: 'fundacion@selloguardian.com', password: 'Fundacion123*' })}>Fundación</button>
                </div>
              </div>
            )}
```

**f) MODIFICAR — `src/Style/Login.css`:** agregar al final (las clases `lg-error` y `lg-demo*` no existen aún; confírmalo antes de pegar):

```css
/* Mensaje de error del login */
.lg-error {
  background: rgba(225, 29, 72, 0.12);
  color: #E11D48;
  border: 1px solid rgba(225, 29, 72, 0.4);
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
  text-align: center;
  font-size: 14px;
}

/* Acceso rápido de desarrollo */
.lg-demo { margin-top: 16px; padding-top: 14px; border-top: 1px dashed rgba(124, 58, 237, 0.35); }
.lg-demo__titulo { font-size: 12px; opacity: 0.7; margin-bottom: 8px; text-align: center; }
.lg-demo__botones { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }
.lg-demo__botones button { background: transparent; color: #7C3AED; border: 1px solid #7C3AED; border-radius: 8px; padding: 6px 12px; font-size: 12px; cursor: pointer; }
.lg-demo__botones button:hover { background: rgba(124, 58, 237, 0.12); }
```

## 1.7 MODIFICAR — `src/Componentes/Header.jsx`

**a)** Reemplazar `import React from 'react'` por:

```jsx
import React, { useState, useEffect, useRef } from 'react'
```

**b)** Reemplazar `import { NavLink, Link } from 'react-router-dom';` por:

```jsx
import { NavLink, Link, useNavigate } from 'react-router-dom';
```

**c)** Después de `import Group from '../assets/Group.svg'` agregar:

```jsx
import { useAuth } from '../Context/AuthContext'
```

**d)** Justo después de la línea `const Header = () => {` agregar:

```jsx
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const menuRef = useRef(null)

  // Cierra el menú al hacer clic fuera de él
  useEffect(() => {
    const cerrarAlClickAfuera = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuAbierto(false)
    }
    document.addEventListener('click', cerrarAlClickAfuera)
    return () => document.removeEventListener('click', cerrarAlClickAfuera)
  }, [])

  const handleLogout = () => {
    logout()
    setMenuAbierto(false)
    navigate('/home')
  }

  const inicial =
    usuario?.nombre?.trim()?.charAt(0)?.toUpperCase() ||
    usuario?.email?.charAt(0)?.toUpperCase() || 'U'

  // Enlace principal del menú según el rol
  const enlacePanel =
    usuario?.rol === 'admin' ? { to: '/admin', texto: 'Panel de administración' }
    : usuario?.rol === 'fundacion' ? { to: '/fundacion', texto: 'Panel de fundación' }
    : { to: '/perfil', texto: 'Mi perfil' }
```

**e)** Reemplazar la línea `<Link to="/login" className="auth-btn login-btn">Iniciar sesión</Link>` (dentro de `<div className="auth-buttons">`) por:

```jsx
              {usuario ? (
                <div className="perfil-menu" ref={menuRef}>
                  <button
                    type="button"
                    className="perfil-avatar"
                    onClick={(e) => { e.stopPropagation(); setMenuAbierto((p) => !p) }}
                    aria-label="Menú de perfil"
                    aria-expanded={menuAbierto}
                  >
                    {usuario.foto ? <img src={usuario.foto} alt="Perfil" /> : <span>{inicial}</span>}
                  </button>

                  {menuAbierto && (
                    <div className="perfil-dropdown" onClick={(e) => e.stopPropagation()}>
                      <div className="perfil-dropdown__user">
                        <div className="perfil-dropdown__avatar">
                          {usuario.foto ? <img src={usuario.foto} alt={usuario.nombre} /> : <span>{inicial}</span>}
                        </div>
                        <div className="perfil-dropdown__meta">
                          <strong>{usuario.nombre || 'Usuario'}</strong>
                          <small>{usuario.email}</small>
                        </div>
                      </div>
                      <Link to={enlacePanel.to} className="perfil-dropdown__item" onClick={() => setMenuAbierto(false)}>
                        {enlacePanel.texto}
                      </Link>
                      <button type="button" className="perfil-dropdown__item perfil-dropdown__logout" onClick={handleLogout}>
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="auth-btn login-btn">Iniciar sesión</Link>
              )}
```

**f) MODIFICAR — `src/Style/Header.css`:** agregar al final (ninguna de estas clases existe todavía):

```css
/* Avatar y menú de sesión */
.perfil-menu { position: relative; z-index: 40; }

.perfil-avatar {
  width: 46px;
  height: 46px;
  border: 2px solid rgba(196, 181, 253, 0.95);
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.96), rgba(168, 85, 247, 0.82));
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 800;
  overflow: hidden;
  box-shadow: 0 8px 18px rgba(124, 58, 237, 0.38);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  padding: 0;
}
.perfil-avatar:hover {
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 12px 24px rgba(124, 58, 237, 0.48);
  border-color: rgba(255, 255, 255, 0.9);
}
.perfil-avatar img { width: 100%; height: 100%; object-fit: cover; }

.perfil-dropdown {
  position: absolute;
  top: calc(100% + 14px);
  right: 0;
  width: 230px;
  background: rgba(15, 23, 42, 0.97);
  border: 1px solid rgba(196, 181, 253, 0.26);
  border-radius: 18px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.52);
  padding: 10px;
  z-index: 50;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.perfil-dropdown__user {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 10px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 8px;
}
.perfil-dropdown__avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(168, 85, 247, 0.18));
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  overflow: hidden;
  border: 1px solid rgba(196, 181, 253, 0.38);
  flex-shrink: 0;
}
.perfil-dropdown__avatar img { width: 100%; height: 100%; object-fit: cover; }
.perfil-dropdown__meta { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.perfil-dropdown__meta strong { color: #f8fafc; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.perfil-dropdown__meta small { color: rgba(241, 245, 249, 0.72); font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.perfil-dropdown__item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border-radius: 10px;
  color: #e2e8f0;
  text-decoration: none;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: background 0.2s ease, color 0.2s ease, transform 0.15s ease;
}
.perfil-dropdown__item:hover { background: rgba(124, 58, 237, 0.18); color: #f5f3ff; transform: translateX(2px); }
.perfil-dropdown__logout { margin-top: 6px; border-top: 1px solid rgba(255, 255, 255, 0.08); color: #fca5a5; }
.perfil-dropdown__logout:hover { background: rgba(239, 68, 68, 0.12); color: #fecaca; }
```

## 1.8 MODIFICAR — `src/Pages/Perfil.jsx`

Se conserva todo el diseño y `Perfil.css`. Solo cambia la lógica de arriba.

**a)** Reemplazar las dos primeras líneas de import (`import React, { useState } from 'react';` y `import { Link } from 'react-router-dom';`) por:

```jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
```

y **después de** `import portada from '../assets/portada.jpeg';` agregar:

```jsx
import { useAuth } from '../Context/AuthContext';
```

**b)** Reemplazar el bloque desde `const Perfil = () => {` hasta el cierre de `handleSubmit` (justo antes de `return (`) por:

```jsx
const Perfil = () => {
  const navigate = useNavigate();
  const { usuario, actualizarUsuario } = useAuth();

  // Se precargan los datos que ya tenga la sesión
  const [formData, setFormData] = useState({
    documento: usuario?.documento || '',
    fechaNacimiento: usuario?.fechaNacimiento || '',
    tipoVivienda: usuario?.tipoVivienda || '',
    ocupacion: usuario?.ocupacion || '',
    salario: usuario?.salario || '',
    telefono: usuario?.telefono || '',
    hijos: usuario?.hijos || '',
    foto: usuario?.foto || null,
  });

  const [preview, setPreview] = useState(usuario?.foto || null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // La foto se guarda en base64 para que sobreviva a recargar la página
  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const lector = new FileReader();
    lector.onload = () => {
      setFormData((prev) => ({ ...prev, foto: lector.result }));
      setPreview(lector.result);
    };
    lector.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Se guarda en la sesión y se marca el perfil como completo
    actualizarUsuario({ ...formData, foto: preview, perfilCompleto: true });
    navigate('/home');
  };

```

El resto del archivo (el JSX del `return`, incluido el enlace "Omitir por ahora" hacia `/home`) no cambia.

## 1.9 MODIFICAR — `src/Pages/Registro.jsx`

**a)** Después de `import portada from '../assets/portada.jpeg';` agregar:

```jsx
import { registrarUsuario } from '../Services/authService.js';
```

**b)** Reemplazar todo el `handleSubmit` por:

```jsx
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (!formData.rol) {
      setError('Por favor selecciona un rol.');
      return;
    }
    setError('');
    try {
      // Cuenta de usuario civil: el perfil se completa en el primer ingreso
      await registrarUsuario({
        nombre: formData.username,
        email: formData.email,
        password: formData.password,
        rol: 'civil',
        perfilCompleto: false,
      });
      navigate('/login', { state: { mensajeExito: 'Cuenta creada. Ya puedes iniciar sesión.' } });
    } catch (err) {
      setError(err.message);
    }
  };
```

## 1.10 MODIFICAR — `src/Pages/RegistroFundacion.jsx`

**a)** Reemplazar `import { Link } from 'react-router-dom'; ` por:

```jsx
import { Link, useNavigate } from 'react-router-dom';
import { registrarUsuario } from '../Services/authService.js';
```

**b)** Justo después de la línea `const RegistroFundacion = () => {` agregar:

```jsx
  const navigate = useNavigate();
```

**c)** Reemplazar todo el `handleSubmit` por:

```jsx
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setError('');
    try {
      // La fundación queda pendiente hasta que el administrador la verifique
      await registrarUsuario({
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
        rol: 'fundacion',
        estadoVerificacion: 'pendiente',
        fundacionId: Date.now(),
        nit: formData.cc,
        representante: formData.representante,
        telefono: formData.telefono,
        ciudad: formData.ciudad,
      });
      navigate('/login', { state: { mensajeExito: 'Solicitud enviada. Un administrador verificará tu fundación.' } });
    } catch (err) {
      setError(err.message);
    }
  };
```

## 1.11 MODIFICAR — las 6 páginas de admin

Aplica exactamente lo mismo en `AdminDashboard.jsx`, `AdminAdopciones.jsx`, `AdminMascotas.jsx`, `AdminDenuncias.jsx`, `AdminUsuarios.jsx` y `AdminConfiguracion.jsx`:

**a)** Reemplazar la línea `import { Link } from 'react-router-dom'` por:

```jsx
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext.jsx'
```

**b)** Justo después de la línea de apertura del componente (`const AdminXxx = () => {`) agregar:

```jsx
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  // Cierra la sesión y vuelve al login
  const cerrarSesion = () => { logout(); navigate('/login') }
```

**c)** Reemplazar `<button className="admin-nav__item admin-nav__logout">` por:

```jsx
<button className="admin-nav__item admin-nav__logout" onClick={cerrarSesion}>
```

**d)** Reemplazar `<div className="admin-avatar">A</div>` por:

```jsx
<div className="admin-avatar">{usuario?.nombre?.charAt(0) || 'A'}</div>
```

---

# PARTE 2 — Panel de Fundación (`/fundacion/*`)

## 2.1 Diseño (prototipo 2 como base + elementos del prototipo 1)

**Barra superior:** breadcrumb `Sello Guardián › {nombre de la fundación}`; buscador con atajo `Ctrl+K`; selector `Este mes / Últimos 3 meses / Este año`; campana con punto si hay solicitudes pendientes (**del 1**); botón **Registrar Ingreso** (el "Nuevo Peludito" del 1); avatar.

**Barra lateral:** Panel General · Expedientes Peluditos (badge con total) · **Pipeline de Peluditos (del 1)** · Adopciones (badge con pendientes) · **Historial Médico (del 1)** · **Donaciones & Recursos (del 1)** · Casos de Denuncia · Métricas & Auditoría · Ajustes de Sede. Al pie: avatar, nombre de la fundación, botón cerrar sesión.

**Panel General (`/fundacion`):**
1. Fila de 4 KPI con mini-sparkline: **En Custodia**, **Solicitudes Activas** (subtítulo "N prioritarias"), **Adopciones concretadas**, **Capacidad de Refugio** (barra de progreso; carmesí si supera 90 %).
2. Dos paneles:
   * Izquierda **"Animales bajo cuidado"**: filtros `Todos (N) · Perros · Gatos · Casos Médicos`, tarjetas con foto, nombre, edad, chips (`Vacunado`, `Esterilizado`, `Tratamiento activo`) y acciones **Gestionar** / **Ficha técnica**.
   * Derecha **"Solicitudes recientes"** en línea de tiempo: avatar, `Adoptante — Mascota`, tiempo relativo, badge de estado y, si está pendiente o en evaluación, la **puntuación** (%) con botones **Aprobar** (esmeralda) y **Revisar** (púrpura) **(del 1)**.
3. **"Pipeline operativo" (del 1):** Kanban compacto de 3 columnas con contador: `Ingreso & Cuarentena` · `Listos para Adopción` · `En Proceso de Entrega`.

**No se replica (aún no hay datos para ello):** selector de sede, historial médico, donaciones, métricas y casos de denuncia. Esas rutas muestran la página "Próximamente".

**Estados de mascota:** `en_cuarentena` · `disponible` · `en_proceso` · `adoptado`.
**Estados de solicitud:** `pendiente` · `en_evaluacion` · `aprobada` · `rechazada`.
Columnas del Kanban: `en_cuarentena` = Ingreso & Cuarentena, `disponible` = Listos para Adopción, `en_proceso` = En Proceso de Entrega.

## 2.2 CREAR — `src/Utils/puntuacion.js`

```js
// Puntúa de 0 a 100 qué tan sólida es una solicitud de adopción (es solo orientativa)
export const calcularPuntuacion = (solicitud) => {
  const a = solicitud.adoptante || {}
  let puntos = 0

  // Vivienda (25)
  if (a.tipoVivienda === 'casa' || a.tipoVivienda === 'finca') puntos += 25
  else if (a.tipoVivienda === 'apartamento') puntos += 15

  // Experiencia previa con mascotas (25)
  const experiencia = (solicitud.experiencia || '').trim()
  if (experiencia.length > 40) puntos += 25
  else if (experiencia.length > 0) puntos += 12

  // Compromiso de atención veterinaria (25)
  if (solicitud.compromisoVeterinario) puntos += 25

  // Tiempo disponible: 'poco' | 'medio' | 'mucho' (15)
  if (solicitud.tiempoDisponible === 'mucho') puntos += 15
  else if (solicitud.tiempoDisponible === 'medio') puntos += 9
  else if (solicitud.tiempoDisponible === 'poco') puntos += 4

  // Ingresos declarados (10): peso bajo para no excluir por dinero
  if (Number(a.salario) >= 1500000) puntos += 10
  else if (Number(a.salario) > 0) puntos += 6

  return Math.min(100, puntos)
}

// Prioritaria = puntuación alta (alimenta el KPI "N prioritarias")
export const esPrioritaria = (solicitud) => calcularPuntuacion(solicitud) >= 85
```

## 2.3 CREAR — `src/Data/seedFundacion.js`

Debe exportar `CAPACIDAD_REFUGIO`, `seedMascotas` y `seedSolicitudes`. Mínimo 8 mascotas y 6 solicitudes con los nombres de los prototipos (mascotas: Max, Luna, Rocky, Ronny, Toby, Milo, Cooper y una más; adoptantes: Ana López, Carlos Ruiz, María Gómez). Para las fotos, **reutiliza las mismas URLs de imágenes (Unsplash/Pexels) que ya usa `Pages/Adopcion.jsx`**. Varía los estados y las viviendas/experiencias para que las puntuaciones sean distintas.

```js
export const CAPACIDAD_REFUGIO = 55

export const seedMascotas = [
  {
    id: 1,
    fundacionId: 1,
    nombre: 'Max',
    especie: 'perro',
    raza: 'Golden Retriever',
    edadEstimada: '2 años',
    tamano: 'grande',
    estadoSalud: 'Tratamiento activo',
    vacunado: true,
    esterilizado: true,
    descripcion: 'Sociable y juguetón.',
    fotoUrl: '<URL tomada de Adopcion.jsx>',
    estadoAdopcion: 'disponible',
    fechaIngreso: '2026-09-12',
  },
  // Luna (gato), Rocky (bulldog, en tratamiento), Ronny, Toby y Milo (en_cuarentena), Cooper (en_proceso), etc.
]

export const seedSolicitudes = [
  {
    id: 101,
    fundacionId: 1,
    mascotaId: 1,
    estado: 'pendiente',
    fecha: '2026-09-27T10:05:00',
    mensaje: 'Quiero darle un hogar a Max.',
    experiencia: 'Tuve dos perros durante 10 años y los llevaba al veterinario cada 6 meses.',
    tiempoDisponible: 'mucho',
    compromisoVeterinario: true,
    comentariosFundacion: '',
    adoptante: { nombre: 'Ana López', foto: null, tipoVivienda: 'casa', salario: 2200000, hijos: 'no' },
  },
  // Más solicitudes con estados pendiente / en_evaluacion / aprobada / rechazada
]
```

## 2.4 CREAR — `src/Context/FundacionContext.jsx`

```jsx
import React, { createContext, useContext, useMemo, useState } from 'react'
import { useAuth } from './AuthContext.jsx'
import { seedMascotas, seedSolicitudes, CAPACIDAD_REFUGIO } from '../Data/seedFundacion.js'

const FundacionContext = createContext(null)

// Siguiente id disponible dentro de un arreglo [{ id }]
const siguienteId = (lista) => (lista.length ? Math.max(...lista.map((i) => i.id)) + 1 : 1)

export const FundacionProvider = ({ children }) => {
  const { usuario } = useAuth()
  const fundacionId = usuario?.fundacionId ?? 1

  const [todasMascotas, setTodasMascotas] = useState(seedMascotas)
  const [todasSolicitudes, setTodasSolicitudes] = useState(seedSolicitudes)

  // Solo los datos de la fundación con sesión activa
  const mascotas = useMemo(
    () => todasMascotas.filter((m) => m.fundacionId === fundacionId),
    [todasMascotas, fundacionId]
  )
  const solicitudes = useMemo(
    () => todasSolicitudes.filter((s) => s.fundacionId === fundacionId),
    [todasSolicitudes, fundacionId]
  )

  const agregarMascota = (datos) =>
    setTodasMascotas((lista) => [
      ...lista,
      {
        id: siguienteId(lista),
        fundacionId,
        estadoAdopcion: 'en_cuarentena',
        fechaIngreso: new Date().toISOString().slice(0, 10),
        ...datos,
      },
    ])

  const actualizarMascota = (id, datos) =>
    setTodasMascotas((lista) => lista.map((m) => (m.id === id ? { ...m, ...datos } : m)))

  // Mueve una mascota entre columnas del Kanban
  const moverMascota = (id, estadoAdopcion) => actualizarMascota(id, { estadoAdopcion })

  // Aprobar, rechazar o pasar a evaluación; al aprobar la mascota pasa a "en_proceso"
  const resolverSolicitud = (id, estado, comentariosFundacion = '') => {
    const solicitud = todasSolicitudes.find((s) => s.id === id)
    setTodasSolicitudes((lista) =>
      lista.map((s) => (s.id === id ? { ...s, estado, comentariosFundacion } : s))
    )
    if (estado === 'aprobada' && solicitud) moverMascota(solicitud.mascotaId, 'en_proceso')
  }

  const value = {
    fundacionId,
    mascotas,
    solicitudes,
    capacidad: CAPACIDAD_REFUGIO,
    agregarMascota,
    actualizarMascota,
    moverMascota,
    resolverSolicitud,
  }

  return <FundacionContext.Provider value={value}>{children}</FundacionContext.Provider>
}

export const useFundacion = () => useContext(FundacionContext)
```

## 2.5 CREAR — `src/Componentes/FundacionLayout.jsx`

Menú lateral y barra superior compartidos (así no se copian en cada página). **Reutiliza las clases existentes de `AdminDashboard.css`** (`admin-layout`, `admin-sidebar`, `admin-brand`, `admin-nav`, `admin-nav__item`, `admin-nav__item--active`, `admin-content`, `admin-topbar`, `admin-topbar__search`, `admin-topbar__actions`, `admin-icon-btn`, `admin-icon-btn__dot`, `admin-avatar`, `admin-select`, `admin-main`).

```jsx
import React, { useEffect, useRef } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  FiGrid, FiFileText, FiColumns, FiUsers, FiActivity, FiHeart,
  FiAlertTriangle, FiBarChart2, FiSettings, FiLogOut, FiBell, FiSearch, FiPlus,
} from 'react-icons/fi'
import { FaPaw } from 'react-icons/fa'
import { useAuth } from '../Context/AuthContext.jsx'
import { useFundacion } from '../Context/FundacionContext.jsx'
import '../Style/AdminDashboard.css'
import '../Style/FundacionPanel.css'

const FundacionLayout = () => {
  const { usuario, logout } = useAuth()
  const { mascotas, solicitudes } = useFundacion()
  const navigate = useNavigate()
  const buscadorRef = useRef(null)

  const pendientes = solicitudes.filter((s) => ['pendiente', 'en_evaluacion'].includes(s.estado)).length

  // Atajo Ctrl+K enfoca el buscador
  useEffect(() => {
    const atajo = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        buscadorRef.current?.focus()
      }
    }
    window.addEventListener('keydown', atajo)
    return () => window.removeEventListener('keydown', atajo)
  }, [])

  // Cierra la sesión y vuelve al login
  const cerrarSesion = () => { logout(); navigate('/login') }

  const items = [
    { to: '/fundacion', texto: 'Panel General', icono: <FiGrid />, fin: true },
    { to: '/fundacion/expedientes', texto: 'Expedientes Peluditos', icono: <FiFileText />, badge: mascotas.length },
    { to: '/fundacion/pipeline', texto: 'Pipeline de Peluditos', icono: <FiColumns /> },
    { to: '/fundacion/adopciones', texto: 'Adopciones', icono: <FiUsers />, badge: pendientes },
    { to: '/fundacion/historial-medico', texto: 'Historial Médico', icono: <FiActivity /> },
    { to: '/fundacion/donaciones', texto: 'Donaciones & Recursos', icono: <FiHeart /> },
    { to: '/fundacion/denuncias', texto: 'Casos de Denuncia', icono: <FiAlertTriangle /> },
    { to: '/fundacion/metricas', texto: 'Métricas & Auditoría', icono: <FiBarChart2 /> },
    { to: '/fundacion/ajustes', texto: 'Ajustes de Sede', icono: <FiSettings /> },
  ]

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand__badge"><FaPaw /></span>
          <span className="admin-brand__name">Sello <span>Guardián</span></span>
        </div>

        <nav className="admin-nav">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.fin}
              className={({ isActive }) => `admin-nav__item${isActive ? ' admin-nav__item--active' : ''}`}
            >
              {it.icono} <span>{it.texto}</span>
              {it.badge > 0 && <span className="fnd-badge">{it.badge}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bloque de usuario al pie del menú */}
        <div className="fnd-usuario">
          <div className="admin-avatar">{usuario?.nombre?.charAt(0) || 'F'}</div>
          <div className="fnd-usuario__meta">
            <strong>{usuario?.nombre}</strong>
            <small>Fundación</small>
          </div>
          <button className="admin-icon-btn" onClick={cerrarSesion} aria-label="Cerrar sesión">
            <FiLogOut />
          </button>
        </div>
      </aside>

      <div className="admin-content">
        <header className="admin-topbar">
          <div className="fnd-breadcrumb">
            Sello Guardián <span>›</span> <strong>{usuario?.nombre}</strong>
          </div>

          <div className="admin-topbar__search">
            <FiSearch />
            <input ref={buscadorRef} type="text" placeholder="Buscar animal o expediente..." />
            <kbd className="fnd-kbd">Ctrl K</kbd>
          </div>

          <div className="admin-topbar__actions">
            <select className="admin-select" defaultValue="mes">
              <option value="mes">Este mes</option>
              <option value="trimestre">Últimos 3 meses</option>
              <option value="anio">Este año</option>
            </select>
            <button className="admin-icon-btn" aria-label="Notificaciones">
              <FiBell />
              {pendientes > 0 && <span className="admin-icon-btn__dot" />}
            </button>
            {/* Abre el modal de nuevo ingreso en Expedientes */}
            <button
              className="fnd-btn-primario"
              onClick={() => navigate('/fundacion/expedientes', { state: { abrirModal: true } })}
            >
              <FiPlus /> Registrar Ingreso
            </button>
          </div>
        </header>

        {/* Aquí se renderiza cada página del panel */}
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default FundacionLayout
```

## 2.6 CREAR — páginas del panel en `src/Pages/`

Ninguna incluye menú propio (lo da el layout). Todas leen datos con `useFundacion()` y usan `admin-card`, los badges `admin-badge--exito / --pendiente / --critico / --neutro` (de `AdminTablas.css`) y clases `fnd-*`. Sin librerías de gráficos: las sparklines son SVG simple como en `AdminDashboard.jsx`.

**`FundacionDashboard.jsx`** — implementa el punto 2.1 completo.
* En Custodia = mascotas con `estadoAdopcion !== 'adoptado'`. Capacidad = custodia / `capacidad`.
* "Casos Médicos" filtra `estadoSalud` que contenga "tratamiento".
* **Aprobar** → `resolverSolicitud(id, 'aprobada')`; **Revisar** → `resolverSolicitud(id, 'en_evaluacion')`.
* Puntuación con `calcularPuntuacion(solicitud)`: esmeralda ≥ 85, lavanda 60–84, carmesí < 60.
* Helper local `hace(fechaISO)` → "Hace 25 min / 2 h / 3 d".

**`FundacionExpedientes.jsx`** — grilla completa de mascotas con filtros por especie y estado y buscador local. Cada tarjeta: **Gestionar** (modal para editar `estadoAdopcion` y `estadoSalud` con `actualizarMascota`) y **Ficha técnica** (modal de solo lectura con todos los campos). El modal **Registrar Ingreso** se abre automáticamente si `useLocation().state?.abrirModal` es `true`; sus campos son: Nombre, Especie (perro/gato/ave/otro), Raza, Edad estimada, Tamaño, Estado de salud, Personalidad y Foto (URL). Al guardar llama `agregarMascota`.

**`FundacionPipeline.jsx`** — Kanban de 3 columnas (`en_cuarentena`, `disponible`, `en_proceso`) con contador. Tarjeta: foto, nombre, fecha de ingreso y chips. Mover entre columnas con **drag & drop nativo HTML5** (`draggable`, `onDragStart`, `onDragOver`, `onDrop` → `moverMascota`) y, como alternativa táctil, un `<select>` "Mover a…" en cada tarjeta. Las mascotas `adoptado` no se muestran.

**`FundacionAdopciones.jsx`** — tabla de solicitudes (Adoptante, Mascota, Fecha, Puntuación, Estado, Acciones) con filtro por estado. Al hacer clic en una fila se abre un modal con el detalle (mensaje, experiencia, tiempo disponible, compromiso veterinario, vivienda), un campo "Comentarios de la fundación" y los botones **Aprobar / En evaluación / Rechazar** (`resolverSolicitud`). Rechazar exige escribir un comentario.

**`FundacionAjustes.jsx`** — formulario con: Nombre de la organización, NIT, Representante, Teléfono, Dirección, Redes y Descripción. Guardar con `actualizarUsuario` de `useAuth()`. Mostrar `estadoVerificacion` como badge de solo lectura.

**`FundacionProximamente.jsx`** — recibe la prop `titulo` y muestra una tarjeta centrada con ícono, el título, el texto "Este módulo estará disponible en una próxima versión" y un `<Link>` que vuelve a `/fundacion`.

## 2.7 CREAR — `src/Style/FundacionPanel.css`

Solo estilos **nuevos** con prefijo `fnd-`. Antes de escribir una regla, confirmar que no exista ya en `AdminDashboard.css` o `AdminTablas.css`. Clases mínimas: `fnd-badge` (pastilla púrpura del contador del menú), `fnd-usuario` y `fnd-usuario__meta` (bloque al pie del menú), `fnd-breadcrumb`, `fnd-kbd`, `fnd-btn-primario` (fondo `#7C3AED`), `fnd-kpis` (grid de 4 columnas → 2 → 1 en responsive), `fnd-kpi__barra` / `fnd-kpi__relleno`, `fnd-dos-cols` (izquierda ancha, derecha angosta), `fnd-filtros` y `fnd-chip`, `fnd-grid-mascotas`, `fnd-mascota` (+ `__foto`, `__chips`, `__acciones`), `fnd-timeline`, `fnd-score` (+ `--alta`, `--media`, `--baja`), `fnd-btn-aprobar` (`#10B981`), `fnd-btn-revisar` (`#7C3AED`), `fnd-kanban`, `fnd-kanban__col`, `fnd-kanban__tarjeta`, `fnd-modal` y `fnd-modal__fondo`.
Estilo: fondo `#0F172A`, tarjetas con borde `rgba(124, 58, 237, 0.18)`, texto `#F8FAFC`, acentos `#C4B5FD`, estados `#10B981` / `#E11D48`. Responsive: menú lateral colapsable por debajo de 900 px.

---

## Revisión final (antes de entregar)

* Cada `import` aparece una sola vez en cada archivo tocado, en especial `App.jsx`, `Login.jsx`, `Header.jsx`, `Perfil.jsx` y `RegistroFundacion.jsx`.
* Cada `<Route path="...">` aparece una sola vez en `App.jsx`.
* `Header.css`, `Login.css` y `FundacionPanel.css` no tienen clases repetidas.
* `main.jsx`, `index.html` y `vite.config.js` quedaron sin cambios.
* `npm run build` compila sin errores.

## Pruebas manuales

* Cada credencial de la tabla entra a su destino; una contraseña incorrecta muestra el mensaje rojo.
* Sin sesión, `/admin` y `/fundacion` redirigen a `/login`; un civil que escribe `/admin` vuelve a su inicio.
* Recargar mantiene la sesión; "Cerrar sesión" (Header, admin y fundación) la borra.
* El Header público no aparece en `/admin/*` ni `/fundacion/*`; en el resto muestra el avatar con menú cuando hay sesión.
* El civil pasa por `/perfil` en su primer ingreso y, tras guardar, va directo a `/home`.
* Registrar una fundación nueva y tratar de entrar muestra "pendiente de verificación".
* Registrar Ingreso agrega la mascota a `Ingreso & Cuarentena`; arrastrar una tarjeta cambia su estado; aprobar una solicitud mueve la mascota a `En Proceso de Entrega`.
* Los botones de acceso rápido solo se ven con `npm run dev`.

Al terminar, entrégame el resumen corto de archivos creados y modificados (regla 7).
