import { createContext, useContext, useMemo, useState } from 'react'
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

// El provider y su hook comparten el contexto intencionalmente.
// eslint-disable-next-line react-refresh/only-export-components
export const useFundacion = () => useContext(FundacionContext)
