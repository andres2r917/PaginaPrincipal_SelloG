import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext.jsx'
import {
  FiGrid, FiClipboard, FiDatabase, FiAlertTriangle,
  FiUsers, FiSettings, FiLogOut, FiPlus, FiEye, FiEdit2,
  FiX, FiUploadCloud, FiTrash2, FiCheck, FiSearch, FiHeart
} from 'react-icons/fi'
import Group from '../assets/Group.svg'
import AdminTopbar from '../Componentes/AdminTopbar.jsx'
import '../Style/AdminDashboard.css'
import '../Style/AdminTablas.css'
import '../Style/AdminModal.css'

// TODO: reemplazar por GET /api/admin/pets y POST / PUT correspondientes en Laravel
const mascotasIniciales = [
  {
    id: 1,
    nombre: 'Luna',
    especie: 'Perro',
    raza: 'Labrador',
    edad: '2 años',
    tamano: 'Grande',
    sexo: 'Hembra',
    fundacion: 'Huellitas Felices',
    estado: 'Disponible',
    salud: 'Vacunación al día y desparasitada',
    vacunado: true,
    esterilizado: true,
    foto: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&h=450&fit=crop',
    descripcion: 'Dócil, cariñosa y muy atenta con niños. Rescatada en el sector norte de Popayán.',
    fechaIngreso: '2026-02-14'
  },
  {
    id: 2,
    nombre: 'Milan',
    especie: 'Perro',
    raza: 'Golden',
    edad: '1 año',
    tamano: 'Grande',
    sexo: 'Macho',
    fundacion: 'Patitas al Rescate',
    estado: 'En proceso',
    salud: 'En chequeo post-adopción',
    vacunado: true,
    esterilizado: false,
    foto: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=450&fit=crop',
    descripcion: 'Juguetón, con energía alta y listo para entrenamiento.',
    fechaIngreso: '2026-03-01'
  },
  {
    id: 3,
    nombre: 'Thor',
    especie: 'Perro',
    raza: 'Doberman',
    edad: '3 años',
    tamano: 'Grande',
    sexo: 'Macho',
    fundacion: 'Huellitas Felices',
    estado: 'Adoptado',
    salud: 'Excelente estado de salud',
    vacunado: true,
    esterilizado: true,
    foto: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=450&fit=crop',
    descripcion: 'Tranquilo y leal, adoptado por familia en Popayán.',
    fechaIngreso: '2026-01-20'
  },
  {
    id: 4,
    nombre: 'Coco',
    especie: 'Perro',
    raza: 'Beagle',
    edad: '8 meses',
    tamano: 'Mediano',
    sexo: 'Macho',
    fundacion: 'Amigos Peludos',
    estado: 'Disponible',
    salud: 'Vacunación al día',
    vacunado: true,
    esterilizado: false,
    foto: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=600&h=450&fit=crop',
    descripcion: 'Curioso, amigable con otros perros y muy activo.',
    fechaIngreso: '2026-03-10'
  },
  {
    id: 5,
    nombre: 'Milo',
    especie: 'Gato',
    raza: 'Persa Mestizo',
    edad: '3 años',
    tamano: 'Pequeño',
    sexo: 'Macho',
    fundacion: 'Huellitas Felices',
    estado: 'Disponible',
    salud: 'Esterilizado y desparasitado',
    vacunado: true,
    esterilizado: true,
    foto: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=450&fit=crop',
    descripcion: 'Tranquilo y silencioso, ideal para apartamentos.',
    fechaIngreso: '2026-03-12'
  }
]

const FUNDACIONES_DISPONIBLES = [
  'Huellitas Felices',
  'Patitas al Rescate',
  'Amigos Peludos',
  'Patitas Callejeras Popayán'
]

const badgePorEstado = {
  Disponible: 'admin-badge--exito',
  'En proceso': 'admin-badge--pendiente',
  Adoptado: 'admin-badge--neutro',
  'En cuarentena': 'admin-badge--critico'
}

const AdminMascotas = () => {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const [mascotas, setMascotas] = useState(mascotasIniciales)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')

  // Modales
  const [modalDetalle, setModalDetalle] = useState(null)
  const [modalEditar, setModalEditar] = useState(null)
  const [modalCrear, setModalCrear] = useState(false)

  // Subida de archivos por dropzone
  const [dragActivo, setDragActivo] = useState(false)
  const [modoUrl, setModoUrl] = useState(false)
  const fileInputRef = useRef(null)

  // Formulario nuevo / editar
  const [formMascota, setFormMascota] = useState({
    nombre: '',
    especie: 'Perro',
    raza: '',
    edad: '',
    tamano: 'Mediano',
    sexo: 'Macho',
    fundacion: FUNDACIONES_DISPONIBLES[0],
    estado: 'Disponible',
    salud: '',
    vacunado: true,
    esterilizado: false,
    foto: '',
    descripcion: ''
  })

  // Cierra la sesión y vuelve al login
  const cerrarSesion = () => { logout(); navigate('/login') }

  // Filtro de búsqueda
  const mascotasFiltradas = mascotas.filter((m) => {
    const texto = `${m.nombre} ${m.raza} ${m.fundacion} ${m.especie}`.toLowerCase()
    const coincideTexto = texto.includes(busqueda.toLowerCase())
    const coincideEstado = filtroEstado === 'todos' || m.estado === filtroEstado
    return coincideTexto && coincideEstado
  })

  // Manejador de subida de archivo desde PC
  const manejarArchivo = (file) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setFormMascota((prev) => ({ ...prev, foto: url }))
  }

  // Abrir modal de creación
  const abrirModalCrear = () => {
    setFormMascota({
      nombre: '',
      especie: 'Perro',
      raza: '',
      edad: '',
      tamano: 'Mediano',
      sexo: 'Macho',
      fundacion: FUNDACIONES_DISPONIBLES[0],
      estado: 'Disponible',
      salud: '',
      vacunado: true,
      esterilizado: false,
      foto: '',
      descripcion: ''
    })
    setModoUrl(false)
    setModalCrear(true)
  }

  // Guardar nueva mascota
  const guardarNuevaMascota = (e) => {
    e.preventDefault()
    const nuevoId = mascotas.length ? Math.max(...mascotas.map((m) => m.id)) + 1 : 1
    const nueva = {
      ...formMascota,
      id: nuevoId,
      fechaIngreso: new Date().toISOString().slice(0, 10),
      foto: formMascota.foto || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&h=450&fit=crop'
    }
    setMascotas((prev) => [nueva, ...prev])
    setModalCrear(false)
  }

  // Abrir modal de edición
  const abrirModalEditar = (mascota) => {
    setModalDetalle(null)
    setFormMascota({ ...mascota })
    setModoUrl(false)
    setModalEditar(mascota)
  }

  // Guardar edición
  const guardarEdicionMascota = (e) => {
    e.preventDefault()
    setMascotas((prev) =>
      prev.map((m) => (m.id === modalEditar.id ? { ...formMascota, id: modalEditar.id } : m))
    )
    setModalEditar(null)
  }

  return (
    <div className="admin-layout">
      {/* ── SIDEBAR ── */}
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
          <Link to="/admin/mascotas" className="admin-nav__item admin-nav__item--active">
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

      {/* ── CONTENIDO ── */}
      <div className="admin-content">
        <AdminTopbar
          placeholder="Buscar por nombre, raza o fundación..."
          valor={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <main className="admin-main">
          <div className="admin-page-header">
            <div>
              <h1 className="admin-title">Mascotas en Sistema</h1>
              <p style={{ color: 'rgba(241, 245, 249, 0.6)', fontSize: 14, marginTop: 4 }}>
                Administra los animales registrados por fundaciones autorizadas en la plataforma.
              </p>
            </div>
            <button className="admin-btn-add" onClick={abrirModalCrear}>
              <FiPlus /> Agregar mascota
            </button>
          </div>

          {/* Filtros rápidos de estado */}
          <div style={{ display: 'flex', gap: 8, margin: '16px 0', flexWrap: 'wrap' }}>
            {['todos', 'Disponible', 'En proceso', 'Adoptado'].map((st) => (
              <button
                key={st}
                onClick={() => setFiltroEstado(st)}
                style={{
                  background: filtroEstado === st ? '#7C3AED' : 'rgba(255,255,255,0.06)',
                  color: filtroEstado === st ? '#fff' : 'rgba(241,245,249,0.7)',
                  border: '1px solid rgba(124, 58, 237, 0.25)',
                  borderRadius: 999,
                  padding: '6px 14px',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {st === 'todos' ? 'Todas las mascotas' : st}
              </button>
            ))}
          </div>

          {/* Tabla de mascotas */}
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mascota</th>
                  <th>Raza</th>
                  <th>Edad</th>
                  <th>Fundación</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {mascotasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: 32, color: 'rgba(241,245,249,0.5)' }}>
                      No se encontraron mascotas con los criterios de búsqueda.
                    </td>
                  </tr>
                ) : (
                  mascotasFiltradas.map((m) => (
                    <tr key={m.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          {m.foto ? (
                            <img
                              src={m.foto}
                              alt={m.nombre}
                              style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C4B5FD', fontWeight: 700 }}>
                              {m.nombre.charAt(0)}
                            </div>
                          )}
                          <div>
                            <strong style={{ color: '#F8FAFC', display: 'block' }}>{m.nombre}</strong>
                            <small style={{ color: 'rgba(241,245,249,0.5)', fontSize: 11 }}>{m.especie || 'Perro'}</small>
                          </div>
                        </div>
                      </td>
                      <td>{m.raza}</td>
                      <td>{m.edad}</td>
                      <td>{m.fundacion}</td>
                      <td>
                        <span className={`admin-badge ${badgePorEstado[m.estado] || 'admin-badge--neutro'}`}>
                          {m.estado}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button
                            className="admin-action-btn"
                            title="Ver detalles"
                            onClick={() => setModalDetalle(m)}
                          >
                            <FiEye />
                          </button>
                          <button
                            className="admin-action-btn"
                            title="Editar datos"
                            onClick={() => abrirModalEditar(m)}
                          >
                            <FiEdit2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>

        <footer className="admin-footer">
          Sello Guardián 2026. Panel administrativo.
        </footer>
      </div>

      {/* ── MODAL VER DETALLES ── */}
      {modalDetalle && (
        <div className="admin-modal-backdrop" onClick={() => setModalDetalle(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <div className="admin-modal__header-left">
                <span className="admin-modal__icon-badge">🐾</span>
                <div>
                  <h2 className="admin-modal__title">{modalDetalle.nombre}</h2>
                  <span className="admin-modal__subtitle">Expediente #{modalDetalle.id} — {modalDetalle.fundacion}</span>
                </div>
              </div>
              <button className="admin-modal__close-btn" onClick={() => setModalDetalle(null)}>
                <FiX />
              </button>
            </div>

            <div className="admin-modal__body">
              {modalDetalle.foto && (
                <div style={{ marginBottom: 16, borderRadius: 12, overflow: 'hidden', maxHeight: 240, border: '1px solid rgba(124, 58, 237, 0.25)' }}>
                  <img
                    src={modalDetalle.foto}
                    alt={modalDetalle.nombre}
                    style={{ width: '100%', height: 240, objectFit: 'cover', display: 'block' }}
                  />
                </div>
              )}

              <div className="admin-modal__grid">
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Especie</span>
                  <span className="admin-detail-value">{modalDetalle.especie || 'Perro'}</span>
                </div>
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Raza</span>
                  <span className="admin-detail-value">{modalDetalle.raza}</span>
                </div>
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Edad estimada</span>
                  <span className="admin-detail-value">{modalDetalle.edad}</span>
                </div>
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Tamaño / Sexo</span>
                  <span className="admin-detail-value">{modalDetalle.tamano || 'Mediano'} · {modalDetalle.sexo || 'Macho'}</span>
                </div>
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Fundación custodia</span>
                  <span className="admin-detail-value">{modalDetalle.fundacion}</span>
                </div>
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Estado actual</span>
                  <span className="admin-detail-value">
                    <span className={`admin-badge ${badgePorEstado[modalDetalle.estado] || 'admin-badge--neutro'}`}>
                      {modalDetalle.estado}
                    </span>
                  </span>
                </div>
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Salud & Vacunación</span>
                  <span className="admin-detail-value">
                    {modalDetalle.salud || 'Sin novedades médicas'}
                    <span style={{ display: 'block', fontSize: 12, color: 'rgba(241,245,249,0.5)', marginTop: 4 }}>
                      Vacunado: {modalDetalle.vacunado ? '✓ Sí' : '✗ No'} · Esterilizado: {modalDetalle.esterilizado ? '✓ Sí' : '✗ No'}
                    </span>
                  </span>
                </div>
                <div className="admin-detail-item">
                  <span className="admin-detail-label">Fecha de ingreso</span>
                  <span className="admin-detail-value">{modalDetalle.fechaIngreso || '2026-02-01'}</span>
                </div>
              </div>

              {modalDetalle.descripcion && (
                <div className="admin-detail-block" style={{ marginTop: 14 }}>
                  <span className="admin-detail-label">Personalidad y antecedentes</span>
                  <p className="admin-detail-text">{modalDetalle.descripcion}</p>
                </div>
              )}
            </div>

            <div className="admin-modal__footer">
              <button
                className="admin-modal__btn admin-modal__btn--secondary"
                onClick={() => setModalDetalle(null)}
              >
                Cerrar
              </button>
              <button
                className="admin-modal__btn admin-modal__btn--primary"
                onClick={() => abrirModalEditar(modalDetalle)}
              >
                <FiEdit2 /> Editar esta mascota
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL AGREGAR / EDITAR MASCOTA ── */}
      {(modalCrear || modalEditar) && (
        <div className="admin-modal-backdrop" onClick={() => { setModalCrear(false); setModalEditar(null) }}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <div className="admin-modal__header-left">
                <span className="admin-modal__icon-badge">{modalCrear ? '➕' : '✏️'}</span>
                <div>
                  <h2 className="admin-modal__title">{modalCrear ? 'Agregar Nueva Mascota' : `Editar — ${modalEditar.nombre}`}</h2>
                  <span className="admin-modal__subtitle">
                    {modalCrear ? 'Registra un animal rescatado en la base de datos' : 'Actualiza la información y estado del animal'}
                  </span>
                </div>
              </div>
              <button className="admin-modal__close-btn" onClick={() => { setModalCrear(false); setModalEditar(null) }}>
                <FiX />
              </button>
            </div>

            <form onSubmit={modalCrear ? guardarNuevaMascota : guardarEdicionMascota}>
              <div className="admin-modal__body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="admin-modal__grid">
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Nombre *</span>
                    <input
                      type="text"
                      className="fnd-modal__input"
                      value={formMascota.nombre}
                      onChange={(e) => setFormMascota({ ...formMascota, nombre: e.target.value })}
                      required
                      placeholder="Ej: Max, Luna"
                      style={{ width: '100%', marginTop: 4 }}
                    />
                  </div>

                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Especie</span>
                    <select
                      className="fnd-modal__input"
                      value={formMascota.especie}
                      onChange={(e) => setFormMascota({ ...formMascota, especie: e.target.value })}
                      style={{ width: '100%', marginTop: 4 }}
                    >
                      <option value="Perro" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>Perro</option>
                      <option value="Gato" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>Gato</option>
                      <option value="Ave" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>Ave</option>
                      <option value="Otro" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>Otro</option>
                    </select>
                  </div>

                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Raza *</span>
                    <input
                      type="text"
                      className="fnd-modal__input"
                      value={formMascota.raza}
                      onChange={(e) => setFormMascota({ ...formMascota, raza: e.target.value })}
                      required
                      placeholder="Ej: Criollo, Labrador"
                      style={{ width: '100%', marginTop: 4 }}
                    />
                  </div>

                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Edad estimada *</span>
                    <input
                      type="text"
                      className="fnd-modal__input"
                      value={formMascota.edad}
                      onChange={(e) => setFormMascota({ ...formMascota, edad: e.target.value })}
                      required
                      placeholder="Ej: 2 años, 8 meses"
                      style={{ width: '100%', marginTop: 4 }}
                    />
                  </div>

                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Tamaño</span>
                    <select
                      className="fnd-modal__input"
                      value={formMascota.tamano}
                      onChange={(e) => setFormMascota({ ...formMascota, tamano: e.target.value })}
                      style={{ width: '100%', marginTop: 4 }}
                    >
                      <option value="Pequeño" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>Pequeño</option>
                      <option value="Mediano" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>Mediano</option>
                      <option value="Grande" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>Grande</option>
                    </select>
                  </div>

                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Sexo</span>
                    <select
                      className="fnd-modal__input"
                      value={formMascota.sexo}
                      onChange={(e) => setFormMascota({ ...formMascota, sexo: e.target.value })}
                      style={{ width: '100%', marginTop: 4 }}
                    >
                      <option value="Macho" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>Macho</option>
                      <option value="Hembra" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>Hembra</option>
                    </select>
                  </div>

                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Fundación custodia</span>
                    <select
                      className="fnd-modal__input"
                      value={formMascota.fundacion}
                      onChange={(e) => setFormMascota({ ...formMascota, fundacion: e.target.value })}
                      style={{ width: '100%', marginTop: 4 }}
                    >
                      {FUNDACIONES_DISPONIBLES.map((f) => (
                        <option key={f} value={f} style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Estado de adopción</span>
                    <select
                      className="fnd-modal__input"
                      value={formMascota.estado}
                      onChange={(e) => setFormMascota({ ...formMascota, estado: e.target.value })}
                      style={{ width: '100%', marginTop: 4 }}
                    >
                      <option value="Disponible" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>Disponible</option>
                      <option value="En proceso" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>En proceso</option>
                      <option value="Adoptado" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>Adoptado</option>
                      <option value="En cuarentena" style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}>En cuarentena</option>
                    </select>
                  </div>
                </div>

                {/* Subida de foto desde PC o URL */}
                <div style={{ marginTop: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span className="admin-detail-label">Foto de la mascota</span>
                    <button
                      type="button"
                      onClick={() => setModoUrl(!modoUrl)}
                      style={{ background: 'none', border: 'none', color: '#C4B5FD', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      {modoUrl ? 'Subir desde mi PC' : 'Pegar URL de imagen'}
                    </button>
                  </div>

                  {modoUrl ? (
                    <input
                      type="url"
                      placeholder="https://ejemplo.com/foto.jpg"
                      className="fnd-modal__input"
                      value={formMascota.foto}
                      onChange={(e) => setFormMascota({ ...formMascota, foto: e.target.value })}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    <div>
                      {formMascota.foto ? (
                        <div className="fnd-preview-foto">
                          <img src={formMascota.foto} alt="Vista previa" />
                          <button
                            type="button"
                            className="fnd-preview-foto__remover"
                            onClick={() => setFormMascota({ ...formMascota, foto: '' })}
                            title="Eliminar foto"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div
                          className={`fnd-dropzone ${dragActivo ? 'fnd-dropzone--drag' : ''}`}
                          onDragOver={(e) => { e.preventDefault(); setDragActivo(true) }}
                          onDragLeave={() => setDragActivo(false)}
                          onDrop={(e) => {
                            e.preventDefault()
                            setDragActivo(false)
                            if (e.dataTransfer.files?.[0]) {
                              manejarArchivo(e.dataTransfer.files[0])
                            }
                          }}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <FiUploadCloud className="fnd-dropzone__icon" />
                          <p className="fnd-dropzone__texto">
                            <span className="fnd-dropzone__link">Sube una foto</span> desde tu computadora o arrástrala
                          </p>
                          <span className="fnd-dropzone__hint">PNG, JPG o WEBP</span>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              if (e.target.files?.[0]) manejarArchivo(e.target.files[0])
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 14 }}>
                  <span className="admin-detail-label">Estado de salud</span>
                  <input
                    type="text"
                    className="fnd-modal__input"
                    value={formMascota.salud}
                    onChange={(e) => setFormMascota({ ...formMascota, salud: e.target.value })}
                    placeholder="Ej: Saludable, esquema de vacunas completo..."
                    style={{ width: '100%', marginTop: 4 }}
                  />
                </div>

                <div style={{ marginTop: 14 }}>
                  <span className="admin-detail-label">Etiquetas de Salud & Esterilización (clic para alternar)</span>
                  <div className="admin-tags-group">
                    <button
                      type="button"
                      className={`admin-tag-toggle ${formMascota.vacunado ? 'admin-tag-toggle--vacunado' : 'admin-tag-toggle--sin-vacunas'}`}
                      onClick={() => setFormMascota({ ...formMascota, vacunado: !formMascota.vacunado })}
                      title="Clic para cambiar estado de vacunación"
                    >
                      {formMascota.vacunado ? '✓ Vacunado' : '⚠ Sin Vacunas'}
                    </button>
                    <button
                      type="button"
                      className={`admin-tag-toggle ${formMascota.esterilizado ? 'admin-tag-toggle--esterilizado' : 'admin-tag-toggle--sin-esterilizar'}`}
                      onClick={() => setFormMascota({ ...formMascota, esterilizado: !formMascota.esterilizado })}
                      title="Clic para cambiar estado de esterilización"
                    >
                      {formMascota.esterilizado ? '✓ Esterilizado' : 'Sin Esterilizar'}
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: 14 }}>
                  <span className="admin-detail-label">Descripción / Personalidad</span>
                  <textarea
                    className="fnd-modal__input"
                    rows="3"
                    value={formMascota.descripcion}
                    onChange={(e) => setFormMascota({ ...formMascota, descripcion: e.target.value })}
                    placeholder="Describe el comportamiento, historia o requerimientos especiales del animal..."
                    style={{ width: '100%', marginTop: 4, resize: 'vertical' }}
                  />
                </div>
              </div>

              <div className="admin-modal__footer">
                <button
                  type="button"
                  className="admin-modal__btn admin-modal__btn--secondary"
                  onClick={() => { setModalCrear(false); setModalEditar(null) }}
                >
                  Cancelar
                </button>
                <button type="submit" className="admin-modal__btn admin-modal__btn--primary">
                  <FiCheck /> {modalCrear ? 'Guardar mascota' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminMascotas
