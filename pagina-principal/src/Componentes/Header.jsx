import React from 'react'
import { Link } from 'react-router-dom';
import '../Style/Header.css'
import logo from '../assets/logo.svg'
const Header = () => {
  return (
     <header> 
          <nav className="nav-bar">
            <div className="nav-links">
                <div>
                  <img className="logo" src={logo} alt="Logo"/>
                </div>
              <div className="items">
                <Link to="/home" className="nav-item">Inicio</Link>
                <Link to="/adopta" className="nav-item">Adopta</Link>
                <Link to="/denuncia" className="nav-item">Denuncia</Link>
              </div>
            </div>

            <div className="search-container">
              <div className="search-input-wrapper">
                <input type="text" placeholder="¿Qué buscas?" />
                <button className="search-button">🔍</button>
              </div>
            </div>

            <div className="auth-buttons">
              <Link to="/login" className="login-btn">Iniciar sesión</Link>
              <Link to="/registro" className="register-btn">Registrarse</Link>
            </div>
          </nav>
      </header>
  )
}

export default Header