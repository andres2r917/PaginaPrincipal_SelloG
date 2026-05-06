import React from 'react'
import '../Style/Navbar.css'
import portada from '../assets/portada.jpeg'
const Navbar = () => {
  return (
   <nav className="hero">
    <div>
    <img className='portada' src={portada} alt="portada"/>
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
      <a href="#denuncia" className="btn btn-outline">
         Hacer una denuncia
      </a>
    </div>

    <div className="hero-stats">
      <div className="stat-item">
        <span className="stat-num">1.240+</span>
        <span className="stat-label">Adoptados</span>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <span className="stat-num">380+</span>
        <span className="stat-label">Denuncias atendidas</span>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <span className="stat-num">95</span>
        <span className="stat-label">Voluntarios activos</span>
      </div>
    </div>
  </div>
</nav>
  )
}

export default Navbar
