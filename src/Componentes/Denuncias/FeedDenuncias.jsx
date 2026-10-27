import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../Style/DenunciaFeed.css'
import { useAuth } from '../../Context/AuthContext.jsx'
import { useDenuncias } from '../../Context/DenunciasContext.jsx'
import { ESTADOS_ACTIVOS } from '../../Utils/estados.js'
import TarjetaDenuncia from './TarjetaDenuncia.jsx'

const POR_PAGINA = 6

const PESTANAS = [
  { id: 'activas', texto: 'Activas' },
  { id: 'todas', texto: 'Todas' },
  { id: 'mias', texto: 'Mis denuncias' },
]

const MENSAJE_VACIO = {
  activas: 'No hay casos activos por ahora.',
  todas: 'Todavía no hay denuncias registradas.',
  mias: 'Aún no has enviado ninguna denuncia.',
}

// Las más nuevas siempre arriba
const masRecientesPrimero = (lista) => [...lista].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

const FeedDenuncias = () => {
  const { usuario } = useAuth()
  const { denuncias } = useDenuncias()
  const [pestana, setPestana] = useState('activas')
  const [visibles, setVisibles] = useState(POR_PAGINA)

  // Las descartadas nunca se muestran en público
  const publicas = denuncias.filter((d) => d.estado !== 'descartada')

  const porPestana = {
    activas: publicas.filter((d) => ESTADOS_ACTIVOS.includes(d.estado)),
    todas: publicas,
    // Solo las del usuario con sesión (incluye las que envió como anónimas)
    mias: usuario ? denuncias.filter((d) => d.usuarioId === usuario.id) : [],
  }

  const lista = masRecientesPrimero(porPestana[pestana])

  const cambiarPestana = (id) => {
    setPestana(id)
    setVisibles(POR_PAGINA)
  }

  return (
    <section className="dnfeed-feed">
      <div className="dnfeed-tabs">
        {PESTANAS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`dnfeed-tab${pestana === p.id ? ' dnfeed-tab--activa' : ''}`}
            onClick={() => cambiarPestana(p.id)}
          >
            {p.texto} ({porPestana[p.id].length})
          </button>
        ))}
      </div>

      {pestana === 'mias' && !usuario ? (
        <p className="dnfeed-vacio">
          <Link to="/login">Inicia sesión</Link> para ver las denuncias que has enviado.
        </p>
      ) : lista.length === 0 ? (
        <p className="dnfeed-vacio">{MENSAJE_VACIO[pestana]}</p>
      ) : (
        <div className="dnfeed-lista">
          {lista.slice(0, visibles).map((d) => (
            <TarjetaDenuncia key={d.id} denuncia={d} />
          ))}
        </div>
      )}

      {/* Paginación manual: el usuario decide cuándo seguir bajando */}
      {lista.length > visibles && (
        <button type="button" className="dnfeed-btn dnfeed-btn--secundario dnfeed-mas" onClick={() => setVisibles((v) => v + POR_PAGINA)}>
          Cargar más
        </button>
      )}
    </section>
  )
}

export default FeedDenuncias
