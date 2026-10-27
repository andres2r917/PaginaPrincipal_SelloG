import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext.jsx'
import { mensajeError } from '../Services/api.js'
import {
  getDenuncias, getMisDenuncias, getTelefonoEmergencia, crearDenuncia,
  reclamarDenuncia, asignarDenuncia, actualizarEstado,
} from '../Services/denunciasService.js'

const DenunciasContext = createContext(null)

// Pide las listas a la API: el feed (todas para el admin) y, con sesión, las propias
const cargarListas = async (esAdmin, haySesion) => ({
  lista: await getDenuncias(esAdmin),
  propias: haySesion ? await getMisDenuncias() : null,
})

export const DenunciasProvider = ({ children }) => {
  const { usuario } = useAuth()
  const [denuncias, setDenuncias] = useState([])
  const [mias, setMias] = useState([])
  const [telefonoEmergencia, setTelefonoEmergencia] = useState('')

  const esAdmin = usuario?.rol === 'admin'
  const idUsuario = usuario?.id ?? null
  const haySesion = idUsuario !== null

  // Carga inicial y cada vez que cambia la sesión
  // y cada minuto, para que las denuncias nuevas y los cambios de estado lleguen sin recargar la página
  useEffect(() => {
    let activo = true
    const cargar = () => {
      if (document.hidden) return
      cargarListas(esAdmin, haySesion)
        .then(({ lista, propias }) => {
          if (!activo) return
          setDenuncias(lista)
          if (propias) setMias(propias)
        })
        .catch(() => {
          // Sin conexión se conservan las listas que ya estaban en pantalla
        })
    }
    cargar()
    const temporizador = setInterval(cargar, 60000)
    return () => {
      activo = false
      clearInterval(temporizador)
    }
  }, [esAdmin, haySesion, idUsuario])

  // Refresca las listas después de crear o cambiar una denuncia
  const recargar = async () => {
    try {
      const { lista, propias } = await cargarListas(esAdmin, haySesion)
      setDenuncias(lista)
      if (propias) setMias(propias)
    } catch {
      // Se mantiene lo que ya estaba
    }
  }

  useEffect(() => {
    getTelefonoEmergencia().then(setTelefonoEmergencia).catch(() => {})
  }, [])

  // Crea la denuncia en la API y refresca las listas. Lanza Error con el mensaje a mostrar.
  const agregarDenuncia = async (datos) => {
    const nueva = await crearDenuncia(datos)
    await recargar()
    return nueva
  }

  // Las acciones devuelven { ok, status, mensaje } para que la pantalla muestre el aviso (por ejemplo el 409)
  const ejecutar = async (peticion) => {
    try {
      await peticion()
      await recargar()
      return { ok: true }
    } catch (error) {
      return { ok: false, status: error.response?.status, mensaje: mensajeError(error) }
    }
  }

  // Fundación: "Hacerme cargo". Admin: asignar el caso a la fundación elegida.
  const asignarFundacion = (id, fundacion) =>
    ejecutar(() => (esAdmin ? asignarDenuncia(id, fundacion.id) : reclamarDenuncia(id)))

  // Cambio de estado: lo usa el admin (verificar/descartar) y la fundación asignada (resolver)
  const cambiarEstado = (id, estado) => ejecutar(() => actualizarEstado(id, estado))

  // Se conecta a la API en la tanda del panel de administración
  const actualizarTelefonoEmergencia = (telefono) => setTelefonoEmergencia(telefono)

  const value = {
    denuncias,
    // Sin sesión no hay "Mías", aunque la lista guardada todavía tenga datos de antes
    misDenuncias: haySesion ? mias : [],
    telefonoEmergencia,
    agregarDenuncia,
    asignarFundacion,
    cambiarEstado,
    actualizarTelefonoEmergencia,
  }

  return <DenunciasContext.Provider value={value}>{children}</DenunciasContext.Provider>
}

// El provider y su hook comparten el contexto intencionalmente.
// eslint-disable-next-line react-refresh/only-export-components
export const useDenuncias = () => useContext(DenunciasContext)
