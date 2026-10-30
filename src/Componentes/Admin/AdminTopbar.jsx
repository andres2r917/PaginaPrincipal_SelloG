import { useState, useEffect } from 'react'
import { FiSearch, FiUser, FiX } from 'react-icons/fi'
import { useAuth } from '../../Context/AuthContext.jsx'
import { useDenuncias } from '../../Context/DenunciasContext.jsx'
import { getFundaciones } from '../../Services/adminService.js'
import { ETIQUETA_TIPO } from '../../Utils/estados.js'
import Notificaciones from '../Notificaciones.jsx'
import { BADGE_COLOR } from '../../Utils/adminEstilos'
import { AVATAR_BTN, PERFIL_AVATAR, PERFIL_CABECERA, TOPBAR, TOPBAR_ACCIONES, TOPBAR_SEARCH } from '../../Utils/panelEstilos'

const AdminTopbar = ({ placeholder = 'Buscar...', valor, onChange, value }) => {
  const { usuario } = useAuth()
  const { denuncias } = useDenuncias()
  const [fundaciones, setFundaciones] = useState([])

  const [perfilAbierto, setPerfilAbierto] = useState(false)

  const inicial =
    usuario?.nombre?.trim()?.charAt(0)?.toUpperCase() ||
    usuario?.email?.charAt(0)?.toUpperCase() || 'A'

  // Fundaciones registradas: se piden al abrir la página y se refrescan cada minuto
  useEffect(() => {
    if (usuario?.rol !== 'admin') return
    let activo = true
    const cargar = () => {
      if (document.hidden) return
      getFundaciones()
        .then((lista) => activo && setFundaciones(lista))
        .catch(() => {
          // Sin conexión se conservan los avisos que ya estaban
        })
    }
    cargar()
    const temporizador = setInterval(cargar, 60000)
    return () => {
      activo = false
      clearInterval(temporizador)
    }
  }, [usuario?.rol])

  // Avisos reales: fundaciones por verificar y denuncias que nadie ha revisado
  const avisos = [
    ...fundaciones
      .filter((f) => f.estado === 'pendiente')
      .map((f) => ({
        id: `fun-${f.id}`,
        texto: `La fundación ${f.nombre} espera verificación`,
        detalle: `Representante: ${f.representante}`,
        tipo: 'pendiente',
        fecha: f.fechaSolicitud,
        to: '/admin/adopciones',
      })),
    ...denuncias
      .filter((d) => d.estado === 'pendiente')
      .map((d) => ({
        id: `den-${d.id}`,
        texto: `Denuncia por verificar: ${ETIQUETA_TIPO[d.tipo] || d.tipo}`,
        detalle: d.ubicacion,
        tipo: d.urgencia === 'Alta' ? 'critico' : 'pendiente',
        fecha: d.fecha,
        to: '/admin/denuncias',
      })),
  ]

  const abrirPerfil = () => setPerfilAbierto(true)

  const valInput = valor !== undefined ? valor : value

  return (
    <>
      <header className={TOPBAR}>
        <div className={TOPBAR_SEARCH}>
          <FiSearch />
          <input
            type="text"
            placeholder={placeholder} aria-label={placeholder}
            value={valInput !== undefined ? valInput : undefined}
            onChange={onChange}
          />
        </div>

        <div className={TOPBAR_ACCIONES}>
          {/* Campana: avisos reales; lo que ya leíste se recuerda en este navegador */}
          <Notificaciones key={usuario?.id} items={avisos} usuarioId={usuario?.id} />

          {/* Avatar — abre modal de perfil */}
          <button
            className={AVATAR_BTN}
            onClick={abrirPerfil}
            aria-label="Ver perfil"
            title="Mi perfil"
          >
            {usuario?.foto
              ? <img src={usuario.foto} alt="Foto de perfil" className="size-full rounded-full object-cover" />
              : inicial}
          </button>
        </div>
      </header>

      {/* Modal de perfil */}
      {perfilAbierto && (
        <div className="fnd-modal__fondo" onClick={() => setPerfilAbierto(false)}>
          <div className={`fnd-modal`} onClick={(e) => e.stopPropagation()}>
            <button className="fnd-modal__cerrar" onClick={() => setPerfilAbierto(false)}>
              <FiX />
            </button>

            {/* Cabecera del modal */}
            <div className={PERFIL_CABECERA}>
              <div className={PERFIL_AVATAR}>
                {usuario?.foto
                  ? <img src={usuario.foto} alt="Foto de perfil" />
                  : <FiUser size={28} />}
              </div>
              <div>
                <h2 className="fnd-modal__titulo" style={{ marginBottom: 2 }}>Mi perfil</h2>
                <span className={BADGE_COLOR.neutro} style={{ fontSize: 12 }}>
                  {usuario?.rol === 'admin' ? 'Administrador' : 'Fundación'}
                </span>
              </div>
            </div>

            <div className="fnd-modal__campo">
              <p className="fnd-modal__label">Nombre</p>
              <p className="text-texto">{usuario?.nombre || '—'}</p>
            </div>
            <div className="fnd-modal__campo">
              <p className="fnd-modal__label">Correo electrónico</p>
              <p className="text-texto">{usuario?.email}</p>
            </div>
            <div className="fnd-modal__acciones">
              <button type="button" className="fnd-modal__btn fnd-modal__btn--secundario" onClick={() => setPerfilAbierto(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminTopbar
