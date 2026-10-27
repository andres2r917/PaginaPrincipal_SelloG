import { useEffect, useState } from 'react'
import { FiSave } from 'react-icons/fi'
import { useDenuncias } from '../../Context/DenunciasContext.jsx'
import AdminTopbar from '../../Componentes/Admin/AdminTopbar.jsx'
import { getConfiguracion, guardarConfiguracion } from '../../Services/adminService.js'
import '../../Style/Admin/AdminTablas.css'

const AdminConfiguracion = () => {
  const { actualizarTelefonoEmergencia } = useDenuncias()
  const [config, setConfig] = useState(null)
  const [error, setError] = useState('')
  const [aviso, setAviso] = useState('')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    getConfiguracion()
      .then(setConfig)
      .catch((e) => setError(e.message))
  }, [])

  const cambiar = (campo, valor) => {
    setConfig({ ...config, [campo]: valor })
    setAviso('')
  }

  const guardarCambios = async (e) => {
    e.preventDefault()
    if (guardando) return
    setGuardando(true)
    setError('')
    try {
      await guardarConfiguracion(config)
      // El feed de denuncias usa este teléfono sin volver a pedirlo
      actualizarTelefonoEmergencia(config.telefonoEmergencia.trim())
      setAviso('Configuración guardada.')
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <>
      <AdminTopbar placeholder="Buscar configuración..." />

      <main className="admin-main">
        <div className="admin-page-header">
          <h1 className="admin-title">Configuración</h1>
        </div>

        {error && <p role="alert" className="texto-error--mb">{error}</p>}
        {aviso && <p role="status" style={{ color: '#10B981', marginBottom: 12 }}>{aviso}</p>}

        {config && (
          <form className="admin-form" onSubmit={guardarCambios}>
            <div className="admin-form-group">
              <label htmlFor="cfg-nombre">Nombre de la plataforma</label>
              <input id="cfg-nombre" className="admin-input" type="text" required value={config.nombre} onChange={(e) => cambiar('nombre', e.target.value)} />
            </div>

            <div className="admin-form-group">
              <label htmlFor="cfg-email">Correo de soporte</label>
              <input id="cfg-email" className="admin-input" type="email" value={config.emailSoporte} onChange={(e) => cambiar('emailSoporte', e.target.value)} />
            </div>

            <div className="admin-form-group">
              <label htmlFor="cfg-tel">Teléfono de emergencia (contacto de rescate)</label>
              <input
                id="cfg-tel"
                className="admin-input"
                type="tel"
                placeholder="+57 300 000 0000"
                value={config.telefonoEmergencia}
                onChange={(e) => cambiar('telefonoEmergencia', e.target.value)}
              />
            </div>

            <div className="admin-toggle-row">
              <span id="cfg-notificaciones">Notificaciones por correo</span>
              <button
                type="button"
                role="switch"
                aria-checked={config.notificaciones}
                aria-labelledby="cfg-notificaciones"
                className={`admin-toggle ${config.notificaciones ? 'admin-toggle--on' : ''}`}
                onClick={() => cambiar('notificaciones', !config.notificaciones)}
              >
                <span className="admin-toggle__dot" />
              </button>
            </div>

            <div className="admin-toggle-row">
              <span id="cfg-mantenimiento">Modo mantenimiento</span>
              <button
                type="button"
                role="switch"
                aria-checked={config.mantenimiento}
                aria-labelledby="cfg-mantenimiento"
                className={`admin-toggle ${config.mantenimiento ? 'admin-toggle--on' : ''}`}
                onClick={() => cambiar('mantenimiento', !config.mantenimiento)}
              >
                <span className="admin-toggle__dot" />
              </button>
            </div>

            <button type="submit" className="admin-save-btn" disabled={guardando}>
              <FiSave /> {guardando ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </form>
        )}
      </main>
    </>
  )
}

export default AdminConfiguracion
