import { FiCheckCircle, FiX } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PAGINA, CONTENIDO, TOAST } from '../Utils/denunciaEstilos.js'
import '../Style/DenunciaFeed.css'
// Fondo propio de esta página
const FONDO = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1920&q=70'
import DenunciaFormulario from '../Componentes/Denuncias/DenunciaFormulario.jsx'
import DenunciaCard from '../Componentes/Denuncias/DenunciaCard/DenunciaCard.jsx'
import { useDenuncias } from '../Context/DenunciasContext.jsx'
import { ETIQUETA_TIPO } from '../Utils/estados.js'
import { limpiarTexto } from '../Utils/limpiarTexto.js'

const PESTANAS = [
  { id: 'activas', texto: 'Activas' },
  { id: 'todas', texto: 'Todas' },
  { id: 'mias', texto: 'Mis denuncias' },
]

const Denuncia = () => {
  const { denuncias, misDenuncias, telefonoEmergencia, agregarDenuncia } = useDenuncias()
  const [formAbierto, setFormAbierto] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const casoResaltado = searchParams.get('caso')
  // Texto que llega desde la barra de búsqueda del encabezado (?buscar=...)
  const buscar = searchParams.get('buscar') || ''
  const palabras = limpiarTexto(buscar).split(/\s+/).filter(Boolean)

  // Si se llega con ?caso= se muestra en la pestaña "Todas" para que aparezca aunque esté resuelto
  const [pestana, setPestana] = useState(casoResaltado ? 'todas' : 'activas')

  // Cuando carga la lista y hay un caso resaltado, hace scroll hasta él
  useEffect(() => {
    if (!casoResaltado || denuncias.length === 0) return
    const el = document.getElementById(`denuncia-${casoResaltado}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [casoResaltado, denuncias])

  // Guarda la denuncia, cierra el acordeón y avisa; la nueva queda arriba del feed
  const manejarEnvio = async (datos) => {
    try {
      await agregarDenuncia(datos)
    } catch (error) {
      // El formulario sigue abierto con lo escrito para poder reintentar
      setErrorEnvio(error.message)
      setTimeout(() => setErrorEnvio(''), 5000)
      return
    }
    setFormAbierto(false)
    setEnviado(true)
    setTimeout(() => setEnviado(false), 3000)
  }

  // Descartar denuncias según la pestaña activa
  const publicas = denuncias.filter((d) => d.estado !== 'descartada')
  const denunciasFiltradas = (() => {
    // Al buscar se revisan todas las públicas, no solo las activas
    if (palabras.length > 0 && pestana !== 'mias') {
      return publicas.filter((d) => palabras.every((p) =>
        limpiarTexto(`${ETIQUETA_TIPO[d.tipo] || d.tipo} ${d.descripcion} ${d.ubicacion} ${d.reportadoPor?.nombre || ''}`).includes(p)))
    }
    if (pestana === 'activas') return publicas.filter((d) => ['pendiente', 'verificada', 'en_rescate', 'abierta', 'en_proceso'].includes(d.estado))
    if (pestana === 'mias') return misDenuncias
    return publicas
  })().slice().sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

  const cambiarPestana = (id) => setPestana(id)

  return (
    <div className={PAGINA} style={{ backgroundImage: `url(${FONDO})` }}>
      <div className={`dnfeed-wrap ${CONTENIDO}`}>
        {/* Acordeón: el formulario solo se monta al abrirlo para que el mapa de Leaflet cargue bien */}
        <button
          type="button"
          className="dnfeed-acordeon"
          onClick={() => setFormAbierto((abierto) => !abierto)}
          aria-expanded={formAbierto}
        >
          <span>{formAbierto ? 'Cerrar formulario' : '+ Reportar una denuncia'}</span>
          <span className={`dnfeed-acordeon__flecha${formAbierto ? ' dnfeed-acordeon__flecha--abierta' : ''}`}>▼</span>
        </button>

        {formAbierto && <DenunciaFormulario onEnviar={manejarEnvio} />}

        {/* Pestañas de filtro */}
        <div className="dnfeed-tabs">
          {PESTANAS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`dnfeed-tab${pestana === p.id ? ' dnfeed-tab--activa' : ''}`}
              onClick={() => cambiarPestana(p.id)}
            >
              {p.texto}
            </button>
          ))}
        </div>

        {buscar && (
          <button type="button" className="dnfeed-tab dnfeed-tab--activa" onClick={() => setSearchParams({})}>
            Búsqueda: «{buscar}» <FiX />
          </button>
        )}

        {/* Lista de tarjetas usando el componente compartido */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {denunciasFiltradas.length === 0 ? (
            <p className="dnfeed-vacio">No hay denuncias en esta sección.</p>
          ) : (
            denunciasFiltradas.map((d) => (
              <DenunciaCard
                key={d.id}
                denuncia={d}
                variante="completa"
                telefonoEmergencia={telefonoEmergencia}
                resaltada={String(d.id) === casoResaltado}
              />
            ))
          )}
        </div>
      </div>

      {errorEnvio && <div className={TOAST} style={{ background: 'var(--color-error)' }}><FiX /> {errorEnvio}</div>}
      {enviado && <div className={TOAST}><FiCheckCircle /> Denuncia enviada correctamente</div>}
    </div>
  )
}

export default Denuncia