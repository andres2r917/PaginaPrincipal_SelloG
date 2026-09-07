import React from 'react'
import { Link } from 'react-router-dom';
import '../Style/Header.css'
import Group from '../assets/Group.svg'

const Header = () => {
  return (
     <header> 
          <nav className="nav-bar">
            <div className="nav-links">
               <img className='group' src={Group} alt="group" />
              <div className="items">
                <Link to="/home" className="nav-item">Inicio</Link>
                <Link to="/adopcion" className="nav-item">Adopcion</Link>
                <Link to="/denuncia" className="nav-item">Denuncia</Link>
              </div>
            </div>
            <div className="search-container">
              <div className="search-input-wrapper">
                <input type="text" placeholder="¿Qué buscas?" />
                <button className="search-button" aria-label="Buscar">
                  <svg
                    className="search-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                    <line x1="16.65" y1="16.65" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="auth-buttons">
              <Link to="/login" className="auth-btn login-btn">Iniciar sesión</Link>
            </div>
          </nav>
      </header>
  )
}
export default Header