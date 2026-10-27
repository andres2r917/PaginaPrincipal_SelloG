import { useEffect, useRef, useState } from 'react'
import '../Style/Navbar.css'
import portada from '../assets/portada.jpeg'

// Estadísticas del hero (cuando exista la API se reemplazan por los datos reales)
const ESTADISTICAS = [
  { valor: 1240, sufijo: '+', texto: 'Adoptados' },
  { valor: 380, sufijo: '+', texto: 'Denuncias atendidas' },
  { valor: 95, sufijo: '', texto: 'Voluntarios activos' },
]

// Número que sube desde 0 hasta su valor cuando aparece en pantalla
const Contador = ({ valor, sufijo }) => {
  // Quien prefiere menos movimiento ve el número final directamente
  const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [actual, setActual] = useState(sinMovimiento ? valor : 0)
  const ref = useRef(null)

  useEffect(() => {
    if (sinMovimiento) return

    let frame
    const observador = new IntersectionObserver(([entrada]) => {
      if (!entrada.isIntersecting) return
      observador.disconnect()

      const duracion = 1800
      const inicio = performance.now()
      const animar = (ahora) => {
        const progreso = Math.min((ahora - inicio) / duracion, 1)
        const suave = 1 - Math.pow(1 - progreso, 3) // empieza rápido y frena al final
        setActual(Math.round(valor * suave))
        if (progreso < 1) frame = requestAnimationFrame(animar)
      }
      frame = requestAnimationFrame(animar)
    })

    observador.observe(ref.current)
    return () => {
      observador.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [valor, sinMovimiento])

  return <span className="stat-num" ref={ref}>{actual.toLocaleString('es-CO')}{sufijo}</span>
}

const Navbar = () => {
  return (
   <section className="hero">
    <div className='portada-container'>
    <img className='portada' src={portada} alt=""/>
    </div>
  <div className="hero-container">
    <h1 className="hero-title">
      La lucha contra el<br />
      <span className="hero-highlight">maltrato animal</span><br />
      nunca termina
    </h1>
    <p className="hero-text">
      Anímate a denunciar, adoptar y proteger <br /> a los que no tienen voz
    </p>

    <div className="hero-btns">
      <a href="#adopta" className="btn btn-primary">
         Adoptar ahora
      </a>
    </div>

    <div className="hero-stats">
      {ESTADISTICAS.map((e, i) => (
        <div className="stat-item-wrap" key={e.texto}>
          {i > 0 && <div className="stat-divider" />}
          <div className="stat-item">
            <Contador valor={e.valor} sufijo={e.sufijo} />
            <span className="stat-label">{e.texto}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
  )
}

export default Navbar
