import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

// Estilos con Tailwind. Los colores de la marca salen de @theme (index.css)
const ENLACE =
  'no-underline transition-[color] duration-200 hover:text-white ' +
  'focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-[3px] ' +
  'focus-visible:outline-acento focus-visible:rounded';
const ENLACE_TEXTO = `${ENLACE} text-texto-suave`;
const ENLACE_RED =
  `${ENLACE} flex size-10 items-center justify-center rounded-full border text-[1rem] ` +
  'border-[rgba(196,181,253,0.3)] bg-[rgba(124,58,237,0.2)] text-texto-claro ' +
  'hover:border-primario hover:bg-primario';

const TITULO = 'mb-4 border-b border-[rgba(124,58,237,0.55)] pb-[0.6rem] text-[1rem] text-white';
const LISTA = 'flex list-none flex-col gap-[0.7rem] text-[0.9rem]';
const ITEM = 'flex items-start gap-[0.6rem]';
const ICONO = 'mt-[3px] shrink-0 text-acento';

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(196,181,253,0.15)] bg-[#0B1224] text-texto-suave">
      {/* 4 columnas; 2 en tablet y 1 en celular */}
      <div className="grid w-full grid-cols-[1.4fr_1fr_1.2fr_1fr] gap-10 px-10 pt-14 pb-8 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1 max-[560px]:gap-8 max-[560px]:pt-9">
        <div>
          <h2 className="text-[1.4rem] text-white">Sello Guardián</h2>
          <p className="mt-1 mb-3 text-[0.8rem] tracking-[0.08em] text-acento uppercase">
            Protección y adopción responsable
          </p>
          <p className="max-w-[34ch] text-[0.9rem] leading-[1.6] text-[#A9B4C8]">
            Plataforma para reportar maltrato animal, adoptar y apoyar a las fundaciones de nuestra región.
          </p>
        </div>

        <nav aria-label="Enlaces del sitio">
          <h3 className={TITULO}>Explora</h3>
          <ul className={LISTA}>
            <li className={ITEM}><Link className={ENLACE_TEXTO} to="/home">Inicio</Link></li>
            <li className={ITEM}><Link className={ENLACE_TEXTO} to="/adopcion">Adopción</Link></li>
            <li className={ITEM}><Link className={ENLACE_TEXTO} to="/denuncia">Denuncia</Link></li>
          </ul>
        </nav>

        <div>
          <h3 className={TITULO}>Contacto</h3>
          <ul className={LISTA}>
            <li className={ITEM}><FaMapMarkerAlt className={ICONO} aria-hidden="true" /><span>Calle Principal #14A, Popayán, Colombia</span></li>
            <li className={ITEM}><FaPhoneAlt className={ICONO} aria-hidden="true" /><a className={ENLACE_TEXTO} href="tel:+573001234567">+57 300 123 4567</a></li>
            <li className={ITEM}><FaEnvelope className={ICONO} aria-hidden="true" /><a className={ENLACE_TEXTO} href="mailto:Selloguardian@gmail.com">Selloguardian@gmail.com</a></li>
          </ul>
        </div>

        <div>
          <h3 className={TITULO}>Síguenos</h3>
          <ul className="flex list-none gap-3">
            {/* TODO: reemplazar los href="#" por los enlaces reales de las redes */}
            <li><a className={ENLACE_RED} href="#" aria-label="Facebook" rel="noopener noreferrer"><FaFacebookF /></a></li>
            <li><a className={ENLACE_RED} href="#" aria-label="Instagram" rel="noopener noreferrer"><FaInstagram /></a></li>
            <li><a className={ENLACE_RED} href="#" aria-label="X (antes Twitter)" rel="noopener noreferrer"><FaXTwitter /></a></li>
            <li><a className={ENLACE_RED} href="https://wa.me/573001234567" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[rgba(196,181,253,0.12)] px-6 py-[1.1rem] text-center text-[0.82rem] text-[#8D99AE]">
        <p>Sello Guardián {new Date().getFullYear()}. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
