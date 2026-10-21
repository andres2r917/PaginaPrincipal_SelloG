import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import '../Style/Denuncia.css'
import '../Style/DenunciaFeed.css'
import portada from '../assets/portada.jpeg'
import DenunciaFormulario from '../Componentes/DenunciaFormulario.jsx'
import DenunciaCard from '../Componentes/DenunciaCard/DenunciaCard.jsx'
import { useAuth } from '../Context/AuthContext.jsx'
import { useDenuncias } from '../Context/DenunciasContext.jsx'
import { TELEFONO_EMERGENCIA } from '../Services/denunciasService.js'

const PESTANAS = [
  { id: 'activas', texto: 'Activas' },
  { id: 'todas', texto: 'Todas' },
  { id: 'mias', texto: 'Mis denuncias' },
]

const Denuncia = () => {
  const { usuario } = useAuth()
  const { denuncias, agregarDenuncia } = useDenuncias()
  const [formAbierto, setFormAbierto] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [searchParams] = useSearchParams()
  const casoResaltado = searchParams.get('caso')

  // Si se llega con ?caso= se muestra en la pestaña "Todas" para que aparezca aunque esté resuelto
  const [pestana, setPestana] = useState(casoResaltado ? 'todas' : 'activas')

  // Cuando carga la lista y hay un caso resaltado, hace scroll hasta él
  useEffect(() => {
    if (!casoResaltado || denuncias.length === 0) return
    const el = document.getElementById(`denuncia-${casoResaltado}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [casoResaltado, denuncias])

  // Guarda la denuncia, cierra el acordeón y avisa; la nueva queda arriba del feed
  const manejarEnvio = (datos) => {
    agregarDenuncia(datos, usuario)
    setFormAbierto(false)
    setEnviado(true)
    setTimeout(() => setEnviado(false), 3000)
  }

  // Descartar denuncias según la pestaña activa
  const publicas = denuncias.filter((d) => d.estado !== 'descartada')
  const denunciasFiltradas = (() => {
    if (pestana === 'activas') return publicas.filter((d) => ['pendiente', 'verificada', 'en_rescate', 'abierta', 'en_proceso'].includes(d.estado))
    if (pestana === 'mias') return usuario ? denuncias.filter((d) => d.usuarioId === usuario.id) : []
    return publicas
  })().slice().sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

  const cambiarPestana = (id) => setPestana(id)

  return (
    <div className="denuncias-page dnfeed-page denuncia-fondo" style={{ backgroundImage: `url(${portada})` }}>
      <div className="dnfeed-wrap">
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
                telefonoEmergencia={TELEFONO_EMERGENCIA}
                resaltada={String(d.id) === casoResaltado}
              />
            ))
          )}
        </div>
      </div>

      {enviado && <div className="dn-toast">✅ Denuncia enviada correctamente</div>}
    </div>
  )
}

export default Denuncia