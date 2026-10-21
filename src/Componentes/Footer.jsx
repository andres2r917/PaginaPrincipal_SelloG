import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import '../Style/Footer.css';

export default function Footer() {
  return (
    <footer className="sg-footer">
      <div className="sg-footer__contenedor">
        <div className="sg-footer__col sg-footer__marca">
          <h2 className="sg-footer__titulo-marca">Sello Guardián</h2>
          <p className="sg-footer__lema">Protección y adopción responsable</p>
          <p className="sg-footer__texto">
            Plataforma para reportar maltrato animal, adoptar y apoyar a las fundaciones de nuestra región.
          </p>
        </div>

        <nav className="sg-footer__col" aria-label="Enlaces del sitio">
          <h3 className="sg-footer__titulo">Explora</h3>
          <ul className="sg-footer__lista">
            <li><Link to="/home">Inicio</Link></li>
            <li><Link to="/adopcion">Adopción</Link></li>
            <li><Link to="/denuncia">Denuncia</Link></li>
          </ul>
        </nav>

        <div className="sg-footer__col">
          <h3 className="sg-footer__titulo">Contacto</h3>
          <ul className="sg-footer__lista">
            <li><FaMapMarkerAlt aria-hidden="true" /><span>Calle Principal #14A, Popayán, Colombia</span></li>
            <li><FaPhoneAlt aria-hidden="true" /><a href="tel:+573001234567">+57 300 123 4567</a></li>
            <li><FaEnvelope aria-hidden="true" /><a href="mailto:Selloguardian@gmail.com">Selloguardian@gmail.com</a></li>
          </ul>
        </div>

        <div className="sg-footer__col">
          <h3 className="sg-footer__titulo">Síguenos</h3>
          <ul className="sg-footer__redes">
            {/* TODO: reemplazar los href="#" por los enlaces reales de las redes */}
            <li><a href="#" aria-label="Facebook" rel="noopener noreferrer"><FaFacebookF /></a></li>
            <li><a href="#" aria-label="Instagram" rel="noopener noreferrer"><FaInstagram /></a></li>
            <li><a href="#" aria-label="X (antes Twitter)" rel="noopener noreferrer"><FaXTwitter /></a></li>
            <li><a href="https://wa.me/573001234567" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a></li>
          </ul>
        </div>
      </div>

      <div className="sg-footer__legal">
        <p>Sello Guardián {new Date().getFullYear()}. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}