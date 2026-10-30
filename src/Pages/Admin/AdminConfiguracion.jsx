import { useEffect, useState } from 'react'
import { FiSave } from 'react-icons/fi'
import { useDenuncias } from '../../Context/DenunciasContext.jsx'
import AdminTopbar from '../../Componentes/Admin/AdminTopbar.jsx'
import { getConfiguracion, guardarConfiguracion } from '../../Services/adminService.js'
import { FORM, FORM_GROUP, INPUT, PAGE_HEADER, SAVE_BTN, TOGGLE_ROW, toggle, toggleBolita } from '../../Utils/adminEstilos'
import { MAIN, TITULO } from '../../Utils/panelEstilos'

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

      <main className={MAIN}>
        <div className={PAGE_HEADER}>
          <h1 className={TITULO}>Configuración</h1>
        </div>

        {error && <p role="alert" className="mb-3 text-peligro">{error}</p>}
        {aviso && <p role="status" style={{ color: '#10B981', marginBottom: 12 }}>{aviso}</p>}

        {config && (
          <form className={FORM} onSubmit={guardarCambios}>
            <div className={FORM_GROUP}>
              <label htmlFor="cfg-nombre">Nombre de la plataforma</label>
              <input id="cfg-nombre" className={INPUT} type="text" required value={config.nombre} onChange={(e) => cambiar('nombre', e.target.value)} />
            </div>

            <div className={FORM_GROUP}>
              <label htmlFor="cfg-email">Correo de soporte</label>
              <input id="cfg-email" className={INPUT} type="email" value={config.emailSoporte} onChange={(e) => cambiar('emailSoporte', e.target.value)} />
            </div>

            <div className={FORM_GROUP}>
              <label htmlFor="cfg-tel">Teléfono de emergencia (contacto de rescate)</label>
              <input
                id="cfg-tel"
                className={INPUT}
                type="tel"
                placeholder="+57 300 000 0000"
                value={config.telefonoEmergencia}
                onChange={(e) => cambiar('telefonoEmergencia', e.target.value)}
              />
            </div>

            <div className={TOGGLE_ROW}>
              <span id="cfg-notificaciones">Notificaciones por correo</span>
              <button
                type="button"
                role="switch"
                aria-checked={config.notificaciones}
                aria-labelledby="cfg-notificaciones"
                className={toggle(config.notificaciones)}
                onClick={() => cambiar('notificaciones', !config.notificaciones)}
              >
                <span className={toggleBolita(config.notificaciones)} />
              </button>
            </div>

            <div className={TOGGLE_ROW}>
              <span id="cfg-mantenimiento">Modo mantenimiento</span>
              <button
                type="button"
                role="switch"
                aria-checked={config.mantenimiento}
                aria-labelledby="cfg-mantenimiento"
                className={toggle(config.mantenimiento)}
                onClick={() => cambiar('mantenimiento', !config.mantenimiento)}
              >
                <span className={toggleBolita(config.mantenimiento)} />
              </button>
            </div>

            <button type="submit" className={SAVE_BTN} disabled={guardando}>
              <FiSave /> {guardando ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </form>
        )}
      </main>
    </>
  )
}

export default AdminConfiguracion
