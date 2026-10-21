import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext.jsx'
import {
  FiGrid, FiClipboard, FiDatabase, FiAlertTriangle,
  FiUsers, FiSettings, FiLogOut, FiEye, FiCheck, FiX,
  FiMail, FiPhone, FiMapPin, FiCalendar, FiShield, FiFileText, FiActivity
} from 'react-icons/fi'
import Group from '../assets/Group.svg'
import AdminTopbar from '../Componentes/AdminTopbar.jsx'
import '../Style/AdminDashboard.css'
import '../Style/AdminTablas.css'
import '../Style/AdminModal.css'

const civilesIniciales = [
  {
    id: 1,
    nombre: 'Carlos Ruiz',
    correo: 'carlos.ruiz@mail.com',
    telefono: '+57 312 456 7890',
    ciudad: 'Popayán',
    direccion: 'Barrio Bolívar, Manzana 4',
    fechaRegistro: '2026-02-14',
    estado: 'Activo',
    denunciasRealizadas: 2,
    solicitudesAdopcion: 1,
    notas: 'Usuario verificado mediante correo electrónico. Buen historial comunitario.'
  },
  {
    id: 2,
    nombre: 'Ana Torres',
    correo: 'ana.torres@mail.com',
    telefono: '+57 320 987 6543',
    ciudad: 'Popayán',
    direccion: 'Sector Norte, Cl. 25 N',
    fechaRegistro: '2026-03-01',
    estado: 'Activo',
    denunciasRealizadas: 1,
    solicitudesAdopcion: 0,
    notas: 'Reportó caso de abandono felino en Parque Caldas.'
  },
]

const fundacionesIniciales = [
  {
    id: 1,
    nombre: 'Huellitas Felices',
    cedulaRepresentante: '1061234567',
    representante: 'Dra. María Elena Gómez',
    telefono: '+57 310 000 0001',
    correo: 'contacto@huellitasfelices.org',
    ciudad: 'Popayán',
    direccion: 'Vereda Pomona, Km 2',
    estado: 'Verificada',
    fechaRegistro: '2025-11-10',
    capacidad: '35 animales (actualmente 24 en albergue)',
    documentos: ['Cédula de Ciudadanía Representante', 'Cámara de Comercio (Vigente)', 'Permiso Sanitario Departamental']
  },
  {
    id: 2,
    nombre: 'Patitas al Rescate',
    cedulaRepresentante: '1061987654',
    representante: 'Julián Camilo Andrade',
    telefono: '+57 311 000 0002',
    correo: 'rescate@patitasalrescate.org',
    ciudad: 'Popayán',
    direccion: 'Comuna 6, Barrio El Mirador',
    estado: 'Pendiente',
    fechaRegistro: '2026-04-02',
    capacidad: '20 animales (actualmente 15 en albergue)',
    documentos: ['Cédula de Ciudadanía Representante', 'Solicitud de verificación pendiente']
  },
]

const administradoresIniciales = [
  {
    id: 1,
    nombre: 'Admin Principal',
    correo: 'admin@selloguardian.com',
    rol: 'Superadmin',
    ultimoAcceso: 'Hoy a las 17:40',
    permisos: 'Acceso total a métricas, base de datos, denuncias y gestión de usuarios'
  },
]

const badgePorEstado = {
  Activo: 'admin-badge--exito',
  Inactivo: 'admin-badge--critico',
  Verificada: 'admin-badge--exito',
  Pendiente: 'admin-badge--pendiente',
  Suspendida: 'admin-badge--critico',
}

const AdminUsuarios = () => {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const cerrarSesion = () => { logout(); navigate('/login') }

  const [tabActiva, setTabActiva] = useState('civiles')
  const [civiles, setCiviles] = useState(civilesIniciales)
  const [fundaciones, setFundaciones] = useState(fundacionesIniciales)
  const [administradores, setAdministradores] = useState(administradoresIniciales)

  // Control del modal: { tipo: 'civil' | 'fundacion' | 'admin', id: number }
  const [modalData, setModalData] = useState(null)

  // Acciones en civiles
  const cambiarEstadoCivil = (id, nuevoEstado) => {
    setCiviles(prev => prev.map(c => c.id === id ? { ...c, estado: nuevoEstado } : c))
  }

  // Acciones en fundaciones
  const cambiarEstadoFundacion = (id, nuevoEstado) => {
    setFundaciones(prev => prev.map(f => f.id === id ? { ...f, estado: nuevoEstado } : f))
  }

  // Entidad actualmente abierta en el modal
  const itemActivo = modalData
    ? (modalData.tipo === 'civil'
        ? civiles.find(c => c.id === modalData.id)
        : modalData.tipo === 'fundacion'
          ? fundaciones.find(f => f.id === modalData.id)
          : administradores.find(a => a.id === modalData.id))
    : null

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
          <Link to="/admin/adopciones" className="admin-nav__item">
            <FiClipboard /> <span>Registro de Fundaciones</span>
          </Link>
          <Link to="/admin/mascotas" className="admin-nav__item">
            <FiDatabase /> <span>Mascotas</span>
          </Link>
          <Link to="/admin/denuncias" className="admin-nav__item">
            <FiAlertTriangle /> <span>Denuncias</span>
          </Link>
          <Link to="/admin/usuarios" className="admin-nav__item admin-nav__item--active">
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
        <AdminTopbar placeholder="Buscar usuarios y fundaciones..." />

        <main className="admin-main">
          <div className="admin-page-header">
            <h1 className="admin-title">Usuarios y Fundaciones</h1>
          </div>

          <div className="admin-tabs">
            <button
              className={`admin-tab ${tabActiva === 'civiles' ? 'admin-tab--active' : ''}`}
              onClick={() => setTabActiva('civiles')}
            >
              Civiles
            </button>
            <button
              className={`admin-tab ${tabActiva === 'fundaciones' ? 'admin-tab--active' : ''}`}
              onClick={() => setTabActiva('fundaciones')}
            >
              Fundaciones
            </button>
            <button
              className={`admin-tab ${tabActiva === 'administradores' ? 'admin-tab--active' : ''}`}
              onClick={() => setTabActiva('administradores')}
            >
              Administradores
            </button>
          </div>

          {tabActiva === 'civiles' && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Ciudad</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {civiles.map(c => (
                    <tr key={c.id}>
                      <td>{c.nombre}</td>
                      <td>{c.correo}</td>
                      <td>{c.ciudad}</td>
                      <td><span className={`admin-badge ${badgePorEstado[c.estado] || 'admin-badge--neutro'}`}>{c.estado}</span></td>
                      <td>
                        <div className="admin-actions">
                          <button
                            className="admin-action-btn"
                            title="Ver detalle"
                            onClick={() => setModalData({ tipo: 'civil', id: c.id })}
                          >
                            <FiEye />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tabActiva === 'fundaciones' && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Cédula Representante</th>
                    <th>Ciudad</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {fundaciones.map(f => (
                    <tr key={f.id}>
                      <td>{f.nombre}</td>
                      <td>{f.cedulaRepresentante}</td>
                      <td>{f.ciudad}</td>
                      <td><span className={`admin-badge ${badgePorEstado[f.estado] || 'admin-badge--neutro'}`}>{f.estado}</span></td>
                      <td>
                        <div className="admin-actions">
                          <button
                            className="admin-action-btn"
                            title="Ver detalle"
                            onClick={() => setModalData({ tipo: 'fundacion', id: f.id })}
                          >
                            <FiEye />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tabActiva === 'administradores' && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {administradores.map(a => (
                    <tr key={a.id}>
                      <td>{a.nombre}</td>
                      <td>{a.correo}</td>
                      <td>{a.rol}</td>
                      <td>
                        <div className="admin-actions">
                          <button
                            className="admin-action-btn"
                            title="Ver detalle"
                            onClick={() => setModalData({ tipo: 'admin', id: a.id })}
                          >
                            <FiEye />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>

        <footer className="admin-footer">
          Sello Guardián 2026. Panel administrativo.
        </footer>
      </div>

      {/* ── VENTANA MODAL DE DETALLE DE USUARIO / FUNDACIÓN ── */}
      {modalData && itemActivo && (
        <div className="admin-modal-backdrop" onClick={() => setModalData(null)}>
          <div className="admin-modal admin-modal--lg" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <div className="admin-modal__header-left">
                <h2 className="admin-modal__title">
                  {modalData.tipo === 'civil' && `Usuario: ${itemActivo.nombre}`}
                  {modalData.tipo === 'fundacion' && `Fundación: ${itemActivo.nombre}`}
                  {modalData.tipo === 'admin' && `Administrador: ${itemActivo.nombre}`}
                </h2>
                {itemActivo.estado && (
                  <span className={`admin-badge ${badgePorEstado[itemActivo.estado] || 'admin-badge--neutro'}`}>
                    {itemActivo.estado}
                  </span>
                )}
                {itemActivo.rol && (
                  <span className="admin-badge admin-badge--info">
                    {itemActivo.rol}
                  </span>
                )}
              </div>
              <button
                className="admin-modal__close-btn"
                onClick={() => setModalData(null)}
                title="Cerrar modal"
              >
                ✕
              </button>
            </div>

            <div className="admin-modal__body">
              {/* Contenido según el tipo de entidad */}
              {modalData.tipo === 'civil' && (
                <>
                  <div className="admin-modal__grid">
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Correo electrónico</span>
                      <span className="admin-detail-value">
                        <FiMail style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                        {itemActivo.correo}
                      </span>
                    </div>

                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Teléfono de contacto</span>
                      <span className="admin-detail-value">
                        <FiPhone style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                        {itemActivo.telefono}
                      </span>
                    </div>

                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Ciudad / Residencia</span>
                      <span className="admin-detail-value">
                        <FiMapPin style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                        {itemActivo.ciudad} — {itemActivo.direccion}
                      </span>
                    </div>

                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Fecha de registro</span>
                      <span className="admin-detail-value">
                        <FiCalendar style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                        {new Date(itemActivo.fechaRegistro).toLocaleDateString('es-CO')}
                      </span>
                    </div>
                  </div>

                  {/* Acciones y actividad del usuario */}
                  <div className="admin-modal__section">
                    <span className="admin-modal__section-title">
                      <FiActivity style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                      Historial de actividad en la plataforma
                    </span>
                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                      <div className="admin-detail-item" style={{ flex: '1 1 180px' }}>
                        <span className="admin-detail-label">Denuncias radicadas</span>
                        <span className="admin-detail-value" style={{ fontSize: '1.2rem', color: '#C4B5FD' }}>
                          {itemActivo.denunciasRealizadas} casos reportados
                        </span>
                      </div>
                      <div className="admin-detail-item" style={{ flex: '1 1 180px' }}>
                        <span className="admin-detail-label">Solicitudes de adopción</span>
                        <span className="admin-detail-value" style={{ fontSize: '1.2rem', color: '#6EE7B7' }}>
                          {itemActivo.solicitudesAdopcion} solicitudes
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="admin-modal__section">
                    <span className="admin-modal__section-title">Observaciones del perfil</span>
                    <p className="admin-modal__text">{itemActivo.notas}</p>
                  </div>
                </>
              )}

              {modalData.tipo === 'fundacion' && (
                <>
                  <div className="admin-modal__grid">
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Cédula del Representante</span>
                      <span className="admin-detail-value">{itemActivo.cedulaRepresentante}</span>
                    </div>

                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Representante legal</span>
                      <span className="admin-detail-value">{itemActivo.representante}</span>
                    </div>

                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Teléfono institucional</span>
                      <span className="admin-detail-value">
                        <FiPhone style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                        {itemActivo.telefono}
                      </span>
                    </div>

                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Correo institucional</span>
                      <span className="admin-detail-value">
                        <FiMail style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                        {itemActivo.correo}
                      </span>
                    </div>

                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Sede / Ubicación</span>
                      <span className="admin-detail-value">
                        <FiMapPin style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                        {itemActivo.ciudad} — {itemActivo.direccion}
                      </span>
                    </div>

                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Capacidad de albergue</span>
                      <span className="admin-detail-value">{itemActivo.capacidad}</span>
                    </div>
                  </div>

                  {/* Documentación de acreditación */}
                  <div className="admin-modal__section">
                    <span className="admin-modal__section-title">
                      <FiFileText style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                      Documentación de acreditación y personería jurídica
                    </span>
                    <ul style={{ margin: '0.4rem 0 0', paddingLeft: '1.2rem', color: '#CBD5E1', lineHeight: '1.7' }}>
                      {itemActivo.documentos.map((doc, i) => (
                        <li key={i}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {modalData.tipo === 'admin' && (
                <>
                  <div className="admin-modal__grid">
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Correo institucional</span>
                      <span className="admin-detail-value">{itemActivo.correo}</span>
                    </div>

                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Nivel de rol</span>
                      <span className="admin-detail-value">{itemActivo.rol}</span>
                    </div>

                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Último acceso</span>
                      <span className="admin-detail-value">{itemActivo.ultimoAcceso}</span>
                    </div>
                  </div>

                  <div className="admin-modal__section">
                    <span className="admin-modal__section-title">
                      <FiShield style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                      Alcance de privilegios administrativos
                    </span>
                    <p className="admin-modal__text">{itemActivo.permisos}</p>
                  </div>
                </>
              )}
            </div>

            <div className="admin-modal__footer">
              <div className="admin-modal__actions-left">
                {modalData.tipo === 'civil' && (
                  itemActivo.estado === 'Activo' ? (
                    <button
                      className="admin-modal__btn admin-modal__btn--danger"
                      onClick={() => cambiarEstadoCivil(itemActivo.id, 'Inactivo')}
                    >
                      <FiX /> Suspender cuenta de usuario
                    </button>
                  ) : (
                    <button
                      className="admin-modal__btn admin-modal__btn--success"
                      onClick={() => cambiarEstadoCivil(itemActivo.id, 'Activo')}
                    >
                      <FiCheck /> Reactivar cuenta de usuario
                    </button>
                  )
                )}

                {modalData.tipo === 'fundacion' && (
                  <>
                    {itemActivo.estado !== 'Verificada' && (
                      <button
                        className="admin-modal__btn admin-modal__btn--success"
                        onClick={() => cambiarEstadoFundacion(itemActivo.id, 'Verificada')}
                      >
                        <FiCheck /> Aprobar y Verificar Fundación
                      </button>
                    )}
                    {itemActivo.estado !== 'Suspendida' && (
                      <button
                        className="admin-modal__btn admin-modal__btn--danger"
                        onClick={() => cambiarEstadoFundacion(itemActivo.id, 'Suspendida')}
                      >
                        <FiX /> Suspender Fundación
                      </button>
                    )}
                  </>
                )}
              </div>

              <button
                className="admin-modal__btn admin-modal__btn--secondary"
                onClick={() => setModalData(null)}
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

export default AdminUsuarios


