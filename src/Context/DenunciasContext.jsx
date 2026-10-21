import { createContext, useContext, useState } from 'react'
import { seedDenuncias, TELEFONO_EMERGENCIA_INICIAL } from '../Data/seedDenuncias.js'

const DenunciasContext = createContext(null)

// Siguiente id disponible dentro de un arreglo [{ id }]
const siguienteId = (lista) => (lista.length ? Math.max(...lista.map((d) => d.id)) + 1 : 1)

export const DenunciasProvider = ({ children }) => {
  const [denuncias, setDenuncias] = useState(seedDenuncias)
  // Reemplaza a platform_settings.Telefono_emergencia mientras no exista la API
  const [telefonoEmergencia, setTelefonoEmergencia] = useState(TELEFONO_EMERGENCIA_INICIAL)

  // Crea una denuncia nueva. Quién reporta se infiere del usuario con sesión:
  // anónima → "Denuncia anónima", fundación → su nombre, civil → "Usuario registrado".
  // usuarioId se guarda aunque sea anónima (para "Mis denuncias") pero nunca se muestra en público.
  const agregarDenuncia = (datos, usuario) => {
    let reportadoPor = { tipo: 'civil', nombre: 'Usuario registrado' }
    if (datos.anonima || !usuario) {
      reportadoPor = { tipo: 'anonimo', nombre: 'Denuncia anónima' }
    } else if (usuario.rol === 'fundacion') {
      reportadoPor = { tipo: 'fundacion', nombre: usuario.nombre }
    }

    const nueva = {
      id: siguienteId(denuncias),
      tipo: datos.tipo,
      descripcion: datos.descripcion,
      ubicacion: datos.ubicacion,
      latitud: datos.latitud,
      longitud: datos.longitud,
      anonima: Boolean(datos.anonima),
      estado: 'pendiente',
      urgencia: datos.urgencia || 'Media',
      fecha: new Date().toISOString(),
      usuarioId: usuario?.id ?? null,
      reportadoPor,
      fundacionAsignada: null,
      fechaAsignacion: null,
      evidencias: datos.evidencias || [],
    }
    setDenuncias((lista) => [nueva, ...lista])
    return nueva
  }

  // Simula el UPDATE condicional de Laravel (whereNull Id_fundacion_asignada):
  // solo asigna si el caso sigue libre; si no, devuelve el equivalente al error 409.
  const asignarFundacion = (id, fundacion) => {
    const denuncia = denuncias.find((d) => d.id === id)
    if (!denuncia) return { ok: false, status: 404, mensaje: 'La denuncia no existe.' }
    if (denuncia.fundacionAsignada) {
      return { ok: false, status: 409, mensaje: 'Este caso ya fue asignado a otra fundación.' }
    }
    if (!['pendiente', 'verificada'].includes(denuncia.estado)) {
      return { ok: false, status: 409, mensaje: 'Este caso ya no está disponible.' }
    }
    setDenuncias((lista) =>
      lista.map((d) =>
        d.id === id && !d.fundacionAsignada
          ? { ...d, fundacionAsignada: fundacion, fechaAsignacion: new Date().toISOString(), estado: 'en_rescate' }
          : d
      )
    )
    return { ok: true }
  }

  // Cambio de estado: lo usa el admin (verificar/descartar) y la fundación asignada (resolver)
  const cambiarEstado = (id, estado) =>
    setDenuncias((lista) => lista.map((d) => (d.id === id ? { ...d, estado } : d)))

  const actualizarTelefonoEmergencia = (telefono) => setTelefonoEmergencia(telefono)

  const value = {
    denuncias,
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
