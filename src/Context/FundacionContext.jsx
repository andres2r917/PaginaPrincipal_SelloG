import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext.jsx'
import * as fundacionApi from '../Services/fundacionService.js'

const FundacionContext = createContext(null)

// Las acciones devuelven { ok, mensaje } para que cada pantalla muestre el aviso si algo falla
const intentar = async (accion) => {
  try {
    await accion()
    return { ok: true }
  } catch (error) {
    return { ok: false, mensaje: error.message }
  }
}

export const FundacionProvider = ({ children }) => {
  const { usuario, guardarPerfilFundacion } = useAuth()
  const idUsuario = usuario?.id
  const esFundacion = usuario?.rol === 'fundacion'

  // Los datos guardan de quién son: al cambiar de cuenta no se ven los de la anterior
  const [datos, setDatos] = useState({ idUsuario: null, mascotas: [], solicitudes: [] })
  const [error, setError] = useState('')

  const cargarTodo = () =>
    Promise.all([fundacionApi.getMascotas(), fundacionApi.getSolicitudes()])
      .then(([mascotas, solicitudes]) => {
        setDatos({ idUsuario, mascotas, solicitudes })
        setError('')
      })
      .catch((e) => setError(e.message))

  // Se carga al entrar y se refresca cada minuto (así llegan las solicitudes nuevas sin recargar)
  useEffect(() => {
    if (!esFundacion) return
    cargarTodo()
    const temporizador = setInterval(() => {
      if (!document.hidden) cargarTodo()
    }, 60000)
    return () => clearInterval(temporizador)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [esFundacion, idUsuario])

  const sonSuyos = datos.idUsuario === idUsuario
  const mascotas = sonSuyos ? datos.mascotas : []
  const solicitudes = sonSuyos ? datos.solicitudes : []

  // Registrar el ingreso de una mascota (la foto va como archivo o como enlace)
  const agregarMascota = (nueva) =>
    intentar(async () => {
      await fundacionApi.crearMascota(nueva)
      await cargarTodo()
    })

  const actualizarMascota = (id, cambios) =>
    intentar(async () => {
      await fundacionApi.actualizarMascota(id, cambios)
      await cargarTodo()
    })

  // Mueve una mascota entre columnas del Kanban: la tarjeta cambia al instante y, si falla, se recarga
  const moverMascota = async (id, estadoAdopcion) => {
    setDatos((actual) => ({
      ...actual,
      mascotas: actual.mascotas.map((m) => (m.id === id ? { ...m, estadoAdopcion } : m)),
    }))
    const resultado = await intentar(() => fundacionApi.actualizarMascota(id, { estadoAdopcion }))
    if (!resultado.ok) await cargarTodo()
    return resultado
  }

  // Aprobar, rechazar o pasar a evaluación; al aprobar la API deja la mascota "en_proceso"
  const resolverSolicitud = (id, estado, comentariosFundacion = '') =>
    intentar(async () => {
      await fundacionApi.resolverSolicitud(id, estado, comentariosFundacion)
      await cargarTodo()
    })

  // Cupos del refugio: viven en la fundación (columna Capacidad)
  const capacidad = usuario?.capacidad ?? 50

  const actualizarCapacidad = (nuevaCapacidad) => {
    const num = parseInt(nuevaCapacidad, 10)
    if (isNaN(num) || num < 1) return Promise.resolve({ ok: false, mensaje: 'Escribe un número mayor que cero.' })
    return intentar(() => guardarPerfilFundacion({ capacidad: num }))
  }

  const value = {
    fundacionId: usuario?.fundacionId,
    mascotas,
    solicitudes,
    capacidad,
    error,
    actualizarCapacidad,
    agregarMascota,
    actualizarMascota,
    moverMascota,
    resolverSolicitud,
  }

  return <FundacionContext.Provider value={value}>{children}</FundacionContext.Provider>
}

// El provider y su hook comparten el contexto intencionalmente.
// eslint-disable-next-line react-refresh/only-export-components
export const useFundacion = () => useContext(FundacionContext)
