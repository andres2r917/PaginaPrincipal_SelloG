import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext.jsx'
import {
  FiGrid, FiClipboard, FiDatabase, FiAlertTriangle,
  FiUsers, FiSettings, FiLogOut, FiCheck, FiX, FiEye,
  FiPhone, FiMail, FiMapPin, FiFileText, FiShield, FiCalendar
} from 'react-icons/fi'
import Group from '../assets/Group.svg'
import AdminTopbar from '../Componentes/AdminTopbar.jsx'
import '../Style/AdminDashboard.css'
import '../Style/AdminTablas.css'
import '../Style/AdminModal.css'

// TODO: reemplazar por GET /api/admin/foundation-registrations cuando exista el endpoint en Laravel
// Cada entrada representa una fundación que solicitó unirse a la plataforma Sello Guardián
const solicitudesIniciales = [
  {
    id: 'FR-001',
    nombre: 'Amigos Peludos Cauca',
    cedulaRepresentante: '1061234567',
    representante: 'Laura Mosquera',
    telefono: '+57 314 222 3344',
    correo: 'amigospeludos@gmail.com',
    ciudad: 'Popayán',
    direccion: 'Carrera 8 #25-40, Barrio Bolívar',
    capacidad: '15 animales',
    descripcion: 'Somos una fundación sin ánimo de lucro con 3 años de experiencia rescatando y rehabilitando animales en la región. Contamos con instalaciones adecuadas y equipo de voluntarios.',
    documentos: ['RUT (adjunto)', 'Cámara de Comercio (adjunto)', 'Registro ante ICA'],
    fechaSolicitud: '2026-10-15',
    estado: 'Pendiente',
  },
  {
    id: 'FR-002',
    nombre: 'Patitas Felices del Sur',
    cedulaRepresentante: '1075876543',
    representante: 'Diego Hernández',
    telefono: '+57 318 999 1122',
    correo: 'patitasfelices@fundacion.org',
    ciudad: 'Timbío',
    direccion: 'Vereda El Carmelo, Km 3',
    capacidad: '25 animales',
    descripcion: 'Fundación activa desde 2019. Realizamos rescates, jornadas de vacunación y proceso de adopción responsable. Contamos con veterinario de planta.',
    documentos: ['RUT (adjunto)', 'Personería jurídica (adjunto)'],
    fechaSolicitud: '2026-10-12',
    estado: 'Aprobada',
  },
  {
    id: 'FR-003',
    nombre: 'Refugio Esperanza Animal',
    cedulaRepresentante: '1083234111',
    representante: 'Sandra Ríos',
    telefono: '+57 301 777 8899',
    correo: 'esperanzaanimal@outlook.com',
    ciudad: 'Santander de Quilichao',
    direccion: 'Calle 10 #4-18',
    capacidad: '10 animales',
    descripcion: 'Iniciativa comunitaria reciente. Solo tenemos RUT, aún estamos tramitando la personería jurídica.',
    documentos: ['RUT (adjunto)'],
    fechaSolicitud: '2026-10-08',
    estado: 'Rechazada',
  },
]

const badgePorEstado = {
  Pendiente: 'admin-badge--pendiente',
  Aprobada: 'admin-badge--exito',
  Rechazada: 'admin-badge--critico',
}

const AdminFundacionRegistros = () => {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const cerrarSesion = () => { logout(); navigate('/login') }

  const [solicitudes, setSolicitudes] = useState(solicitudesIniciales)
  const [solicitudSeleccionadaId, setSolicitudSeleccionadaId] = useState(null)

  // Cambia el estado de una solicitud (Aprobada / Rechazada)
  const cambiarEstado = (id, nuevoEstado) => {
    setSolicitudes(prev =>
      prev.map(s => s.id === id ? { ...s, estado: nuevoEstado } : s)
    )
  }

  const solicitudActiva = solicitudes.find(s => s.id === solicitudSeleccionadaId) || null

  return (
    <div className="admin-layout">

      <aside className="admin-sidebar">
        <Link to="/home" className="admin-brand" title="Ir al Inicio">
          <img className="admin-brand__logo" src={Group} alt="Sello Guardián" />
        </Link>

        <nav className="admin-nav">
          <Link to="/admin" className="admin-nav__item">
            <FiGrid /> <span>Dashboard</span>
          </Link>
          <Link to="/admin/adopciones" className="admin-nav__item admin-nav__item--active">
            <FiClipboard /> <span>Registro de Fundaciones</span>
          </Link>
          <Link to="/admin/mascotas" className="admin-nav__item">
            <FiDatabase /> <span>Mascotas</span>
          </Link>
          <Link to="/admin/denuncias" className="admin-nav__item">
            <FiAlertTriangle /> <span>Denuncias</span>
          </Link>
          <Link to="/admin/usuarios" className="admin-nav__item">
            <FiUsers /> <span>Usuarios y Fundaciones</span>
          </Link>
          <Link to="/admin/configuracion" className="admin-nav__item">
            <FiSettings /> <span>Configuración</span>
          </Link>
        </nav>

        <button className="admin-nav__item admin-nav__logout" onClick={cerrarSesion}>
          <FiLogOut /> <span>Cerrar sesión</span>
        </button>
      </aside>

      <div className="admin-content">
        <AdminTopbar placeholder="Buscar fundaciones por nombre o cédula..." />

        <main className="admin-main">
          <div className="admin-page-header">
            <h1 className="admin-title">Solicitudes de Registro de Fundaciones</h1>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fundación</th>
                  <th>Cédula representante</th>
                  <th>Representante</th>
                  <th>Ciudad</th>
                  <th>Fecha solicitud</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map(s => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.nombre}</td>
                    <td>{s.cedulaRepresentante}</td>
                    <td>{s.representante}</td>
                    <td>{s.ciudad}</td>
                    <td>{s.fechaSolicitud}</td>
                    <td>
                      <span className={`admin-badge ${badgePorEstado[s.estado]}`}>{s.estado}</span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        {/* Ver detalles: abre el modal con todos los datos para decidir */}
                        <button
                          className="admin-action-btn"
                          title="Revisar solicitud"
                          onClick={() => setSolicitudSeleccionadaId(s.id)}
                        >
                          <FiEye />
                        </button>
                        {/* Acciones rápidas solo para pendientes */}
                        {s.estado === 'Pendiente' && (
                          <>
                            <button
                              className="admin-action-btn admin-action-btn--aprobar"
                              title="Aprobar registro"
                              onClick={() => cambiarEstado(s.id, 'Aprobada')}
                            >
                              <FiCheck />
                            </button>
                            <button
                              className="admin-action-btn admin-action-btn--rechazar"
                              title="Rechazar registro"
                              onClick={() => cambiarEstado(s.id, 'Rechazada')}
                            >
                              <FiX />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        <footer className="admin-footer">
          Sello Guardián 2026. Panel administrativo.
        </footer>
      </div>

      {/* ── VENTANA MODAL: REVISIÓN DE SOLICITUD DE FUNDACIÓN ── */}
      {solicitudActiva && (
        <div className="admin-modal-backdrop" onClick={() => setSolicitudSeleccionadaId(null)}>
          <div className="admin-modal admin-modal--lg" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <div className="admin-modal__header-left">
                <h2 className="admin-modal__title">{solicitudActiva.nombre}</h2>
                <span className={`admin-badge ${badgePorEstado[solicitudActiva.estado]}`}>
                  {solicitudActiva.estado}
                </span>
              </div>
              <button
                className="admin-modal__close-btn"
                onClick={() => setSolicitudSeleccionadaId(null)}
                title="Cerrar"
              >
                ✕
              </button>
            </div>

            <div className="admin-modal__body">
              {/* Datos de identificación */}
              <div className="admin-modal__grid">
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Cédula del representante</span>
                  <span className="admin-detail-value">{solicitudActiva.cedulaRepresentante}</span>
                </div>
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Representante legal</span>
                  <span className="admin-detail-value">{solicitudActiva.representante}</span>
                </div>
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Teléfono de contacto</span>
                  <span className="admin-detail-value">
                    <FiPhone style={{ marginRight: 6, verticalAlign: 'middle' }} />
                    {solicitudActiva.telefono}
                  </span>
                </div>
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Correo electrónico</span>
                  <span className="admin-detail-value">
                    <FiMail style={{ marginRight: 6, verticalAlign: 'middle' }} />
                    {solicitudActiva.correo}
                  </span>
                </div>
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Sede / Dirección</span>
                  <span className="admin-detail-value">
                    <FiMapPin style={{ marginRight: 6, verticalAlign: 'middle' }} />
                    {solicitudActiva.ciudad} — {solicitudActiva.direccion}
                  </span>
                </div>
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Capacidad del albergue</span>
                  <span className="admin-detail-value">{solicitudActiva.capacidad}</span>
                </div>
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Fecha de solicitud</span>
                  <span className="admin-detail-value">
                    <FiCalendar style={{ marginRight: 6, verticalAlign: 'middle' }} />
                    {solicitudActiva.fechaSolicitud}
                  </span>
                </div>
              </div>

              {/* Descripción que envió la fundación */}
              <div className="admin-modal__section">
                <span className="admin-modal__section-title">
                  <FiShield style={{ marginRight: 6, verticalAlign: 'middle' }} />
                  Descripción de la fundación (enviada por el solicitante)
                </span>
                <p className="admin-modal__text">{solicitudActiva.descripcion}</p>
              </div>

              {/* Documentos adjuntos */}
              <div className="admin-modal__section">
                <span className="admin-modal__section-title">
                  <FiFileText style={{ marginRight: 6, verticalAlign: 'middle' }} />
                  Documentos adjuntos para verificación
                </span>
                <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.2rem', color: '#CBD5E1', lineHeight: 1.8 }}>
                  {solicitudActiva.documentos.map((doc, i) => (
                    <li key={i}>{doc}</li>
                  ))}
                </ul>
                {solicitudActiva.documentos.length < 2 && (
                  <p style={{ marginTop: '0.6rem', color: '#FDA4AF', fontSize: '0.85rem', fontStyle: 'italic' }}>
                    ⚠ Documentación incompleta: faltan documentos de acreditación adicionales para verificar la personería jurídica.
                  </p>
                )}
              </div>
            </div>

            <div className="admin-modal__footer">
              <div className="admin-modal__actions-left">
                {solicitudActiva.estado !== 'Aprobada' && (
                  <button
                    className="admin-modal__btn admin-modal__btn--success"
                    onClick={() => cambiarEstado(solicitudActiva.id, 'Aprobada')}
                  >
                    <FiCheck /> Aprobar registro — dar acceso a la plataforma
                  </button>
                )}
                {solicitudActiva.estado !== 'Rechazada' && (
                  <button
                    className="admin-modal__btn admin-modal__btn--danger"
                    onClick={() => cambiarEstado(solicitudActiva.id, 'Rechazada')}
                  >
                    <FiX /> Rechazar solicitud
                  </button>
                )}
              </div>
              <button
                className="admin-modal__btn admin-modal__btn--secondary"
                onClick={() => setSolicitudSeleccionadaId(null)}
              >
                Cerrar ventana
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminFundacionRegistros


