import { useState } from 'react'
import { useFundacion } from '../Context/FundacionContext.jsx'

const COLUMNAS = [
  { key: 'en_cuarentena', titulo: 'Ingreso & Cuarentena' },
  { key: 'disponible', titulo: 'Listos para Adopción' },
  { key: 'en_proceso', titulo: 'En Proceso de Entrega' },
]

const etiquetasEstado = {
  en_cuarentena: 'Cuarentena',
  disponible: 'Disponible',
  en_proceso: 'En proceso',
}

const FundacionPipeline = () => {
  const { mascotas, moverMascota } = useFundacion()
  const [arrastrando, setArrastrando] = useState(null)
  const [colDrop, setColDrop] = useState(null)

  // Mascotas activas (excluye adoptados)
  const activas = mascotas.filter((m) => m.estadoAdopcion !== 'adoptado')

  const onDragStart = (id) => setArrastrando(id)
  const onDragOver = (e, key) => { e.preventDefault(); setColDrop(key) }
  const onDrop = (e, key) => {
    e.preventDefault()
    if (arrastrando) moverMascota(arrastrando, key)
    setArrastrando(null)
    setColDrop(null)
  }
  const onDragEnd = () => { setArrastrando(null); setColDrop(null) }

  return (
    <div>
      <h1 className="admin-title">Pipeline de Peluditos</h1>
      <p style={{ color: 'rgba(241,245,249,0.55)', fontSize: 13, marginBottom: 20 }}>
        Arrastra las tarjetas para cambiar el estado. En pantallas táctiles usa el selector.
      </p>

      <div className="fnd-kanban">
        {COLUMNAS.map((col) => {
          const lista = activas.filter((m) => m.estadoAdopcion === col.key)
          return (
            <div
              key={col.key}
              className={`fnd-kanban__col${colDrop === col.key ? ' fnd-kanban__col--drop' : ''}`}
              onDragOver={(e) => onDragOver(e, col.key)}
              onDrop={(e) => onDrop(e, col.key)}
            >
              <div className="fnd-kanban__col-header">
                <span className="fnd-kanban__col-titulo">{col.titulo}</span>
                <span className="fnd-badge">{lista.length}</span>
              </div>

              {lista.map((m) => (
                <div
                  key={m.id}
                  className={`fnd-kanban__tarjeta${arrastrando === m.id ? ' fnd-kanban__tarjeta--drag' : ''}`}
                  draggable
                  onDragStart={() => onDragStart(m.id)}
                  onDragEnd={onDragEnd}
                >
                  {m.fotoUrl && (
                    <img
                      src={m.fotoUrl}
                      alt={m.nombre}
                      style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 7, marginBottom: 8 }}
                    />
                  )}
                  <p className="fnd-kanban__tarjeta-nombre">{m.nombre}</p>
                  <p className="fnd-kanban__tarjeta-sub">{m.raza} · Ingresó {m.fechaIngreso}</p>
                  <div className="fnd-kanban__tarjeta-chips">
                    {m.vacunado && <span className="fnd-mascota__chip">Vacunado</span>}
                    {m.esterilizado && <span className="fnd-mascota__chip">Esterilizado</span>}
                    {(m.estadoSalud || '').toLowerCase().includes('tratamiento') && (
                      <span className="fnd-mascota__chip fnd-mascota__chip--tratamiento">Tratamiento</span>
                    )}
                  </div>
                  {/* Selector alternativo para pantallas táctiles */}
                  <select
                    className="fnd-kanban__select"
                    value={m.estadoAdopcion}
                    onChange={(e) => moverMascota(m.id, e.target.value)}
                  >
                    {COLUMNAS.map((c) => (
                      <option key={c.key} value={c.key}>{etiquetasEstado[c.key]}</option>
                    ))}
                  </select>
                </div>
              ))}

              {lista.length === 0 && (
                <p style={{ fontSize: 12, color: 'rgba(241,245,249,0.3)', textAlign: 'center', marginTop: 24 }}>Sin animales</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FundacionPipeline
