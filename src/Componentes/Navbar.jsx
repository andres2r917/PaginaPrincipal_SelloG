import { useEffect, useRef, useState } from 'react'
import portada from '../assets/portada.jpeg'

// Estilos con Tailwind. Los colores de la marca salen de @theme (index.css)
const HERO =
  'relative flex min-h-screen items-center overflow-hidden px-6 py-[60px] before:absolute before:inset-0 before:z-1 before:bg-[rgba(15,23,42,0.6)]'
const PORTADA = 'absolute inset-0 z-0 h-full w-full bg-fondo object-cover brightness-[0.35] contrast-[1.1]'
const CONTENEDOR = 'relative z-2 max-w-[680px] animate-[fadeUp_0.9s_cubic-bezier(.22,1,.36,1)_both] px-12 pt-16 pb-12'
const TITULO = 'mb-4 text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.08] font-black tracking-[-1px] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.4)]'
const TEXTO = 'mb-8 text-[1.05rem] leading-[1.6] font-semibold text-[rgba(255,255,255,0.82)]'
const BTN =
  'inline-flex items-center gap-[0.4rem] rounded-full border-2 border-transparent bg-primario px-[1.6rem] py-3 text-[1rem] font-extrabold text-white no-underline shadow-[0_4px_20px_rgba(124,58,237,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-acento hover:text-fondo hover:shadow-[0_6px_28px_rgba(196,181,253,0.55)]'
const NUMERO = 'text-[1.6rem] leading-none font-black text-primario tabular-nums' // los dígitos no se mueven mientras cuentan
const ETIQUETA = 'mt-[2px] text-[0.78rem] font-semibold text-[rgba(255,255,255,0.65)]'

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

  return <span className={NUMERO} ref={ref}>{actual.toLocaleString('es-CO')}{sufijo}</span>
}

const Navbar = () => {
  return (
   <section className={HERO}>
    <div>
    <img className={PORTADA} src={portada} alt=""/>
    </div>
  <div className={CONTENEDOR}>
    <h1 className={TITULO}>
      La lucha contra el<br />
      <span className="text-primario">maltrato animal</span><br />
      nunca termina
    </h1>
    <p className={TEXTO}>
      Anímate a denunciar, adoptar y proteger <br /> a los que no tienen voz
    </p>

    <div className="mb-10 flex flex-wrap gap-4">
      <a href="#adopta" className={BTN}>
         Adoptar ahora
      </a>
    </div>

    <div className="flex flex-wrap items-center gap-6">
      {ESTADISTICAS.map((e, i) => (
        <div className="flex items-center gap-6" key={e.texto}>
          {i > 0 && <div className="h-9 w-px bg-[rgba(196,181,253,0.3)]" />}
          <div className="flex flex-col">
            <Contador valor={e.valor} sufijo={e.sufijo} />
            <span className={ETIQUETA}>{e.texto}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
  )
}

export default Navbar
