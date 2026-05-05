import React from 'react'
import { FaInstagram, FaTwitter, FaWhatsapp, FaFacebook, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import '../Style/Footer.css'
const Footer = () => {
  return (
      <footer className="footer-guardian">
      <div className="footer-content">    
      
        <div className="footer-section">
          <h3>Contacto</h3>
          <div className="contact-item">
            <FaMapMarkerAlt className="icon" />
            <span>Calle Principal #14A, Popayan, Colombia</span>
          </div>
          <div className="contact-item">
            <FaPhoneAlt className="icon" />
            <span>+57 300 123 4567</span>
          </div>
          <div className="contact-item">
            <FaEnvelope className="icon" />
            <span>Selloguardian@gmail.com</span>
          </div>
        </div>

        <div className="footer-section">
          <h3>Síguenos</h3>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://wa.me/tu-numero" target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p> Sello Guardián. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer
