import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDenuncias } from '../../Context/DenunciasContext.jsx'
import { getEstadisticas } from '../../Services/adminService.js'
import { hace } from '../../Utils/tiempo.js'
import {
  FiAlertTriangle,
  FiCheckCircle
} from 'react-icons/fi'
import AdminTopbar from '../../Componentes/Admin/AdminTopbar.jsx'
import { BADGE_DENUNCIA } from '../../Utils/estados.js'
import { ACTIVIDAD_CUERPO, ACTIVIDAD_HORA, ACTIVIDAD_ITEM, ACTIVIDAD_LISTA, ALERTA_CRITICA, ALERTA_INFO, BARRA, BARRAS, BARRAS_ETIQUETA, BARRAS_GRUPO, BARRAS_PAR, CARD, CARD_HEAD, CARD_SUBTITULO, GRID, MAIN, MINI_TITULO, SELECT, STAT, STAT_LABEL, STAT_NUM, STAT_ROW, TITULO, etiquetaActividad, puntoActividad } from '../../Utils/panelEstilos'

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

// Denuncias de cada uno de los últimos 6 meses
const denunciasPorMes = (denuncias) => {
  const hoy = new Date()
  return Array.from({ length: 6 }, (_, i) => {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - (5 - i), 1)
    const total = denuncias.filter((d) => {
      const f = new Date(d.fecha)
      return f.getFullYear() === fecha.getFullYear() && f.getMonth() === fecha.getMonth()
    }).length
    return { mes: MESES[fecha.getMonth()], denuncias: total }
  })
}

const AdminDashboard = () => {
  const { denuncias } = useDenuncias()
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [modoMetricas, setModoMetricas] = useState('proteccion') // 'proteccion' | 'adopcion'

  useEffect(() => {
    getEstadisticas()
      .then(setStats)
      .catch((e) => setError(e.message))
  }, [])

  const s = stats ?? {}
  const denunciasUrgentes = denuncias.filter((d) => d.urgencia?.toLowerCase() === 'alta' && ['pendiente', 'verificada'].includes(d.estado))
  const actividad = [...denuncias].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 5)
  const datosGrafico = denunciasPorMes(denuncias)
  const maxBar = Math.max(1, ...datosGrafico.map((d) => d.denuncias))


  return (
    <>



        {/* Topbar */}
        <AdminTopbar placeholder="Buscar denuncias, mascotas, usuarios..." />

        <main className={MAIN}>
          <h1 className={TITULO}>Dashboard</h1>

          <div className={GRID}>

            {/* Estado Guardián */}
            <section className={CARD}>
              <div className={CARD_HEAD}>
                <div>
                  <h2>Estado Guardián</h2>
                  <p className={CARD_SUBTITULO}>
                    {modoMetricas === 'proteccion' ? 'Métricas de protección activas' : 'Métricas de adopción y rescate'}
                  </p>
                </div>
                <select
                  className={SELECT}
                  value={modoMetricas}
                  onChange={(e) => setModoMetricas(e.target.value)}
                >
                  <option value="proteccion">Protección</option>
                  <option value="adopcion">Adopción</option>
                </select>
              </div>

              {error && <p role="alert" style={{ color: '#E11D48', fontSize: 13 }}>{error}</p>}

              {modoMetricas === 'proteccion' ? (
                <div className={STAT_ROW}>
                  <div className={STAT.primario}>
                    <span className={STAT_NUM.primario}>{s.denuncias_activas ?? '—'}</span>
                    <span className={STAT_LABEL.primario}>Denuncias activas en curso</span>
                  </div>
                  <div className={STAT.secundario}>
                    <span className={STAT_NUM.secundario}>{s.casos_resueltos ?? '—'}</span>
                    <span className={STAT_LABEL.secundario}>Casos resueltos con éxito</span>
                  </div>
                </div>
              ) : (
                <div className={STAT_ROW}>
                  <div className={STAT.primario} style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
                    <span className={STAT_NUM.primario}>{s.adopciones_concretadas ?? '—'}</span>
                    <span className={STAT_LABEL.primario}>Adopciones concretadas</span>
                  </div>
                  <div className={STAT.secundario}>
                    <span className={STAT_NUM.secundario}>{s.mascotas_disponibles ?? '—'}</span>
                    <span className={STAT_LABEL.secundario}>Mascotas disponibles</span>
                  </div>
                </div>
              )}

              <div className={STAT_ROW} style={{ marginTop: 12 }}>
                <div className={STAT.secundario}>
                  <span className={STAT_NUM.secundario}>{s.tasa_resolucion ?? '—'}%</span>
                  <span className={STAT_LABEL.secundario}>Denuncias válidas resueltas</span>
                </div>
                <div className={STAT.secundario}>
                  <span className={STAT_NUM.secundario}>{s.usuarios_civiles ?? '—'}</span>
                  <span className={STAT_LABEL.secundario}>Usuarios registrados</span>
                </div>
              </div>
            </section>

            {/* Actividad Reciente */}
            <section className={CARD}>
              <div className={CARD_HEAD}>
                <h2>Actividad Reciente</h2>
              </div>
              <ul className={ACTIVIDAD_LISTA}>
                {actividad.map((d) => (
                  <li key={d.id} className={ACTIVIDAD_ITEM}>
                    <span className={puntoActividad(BADGE_DENUNCIA[d.estado]?.punto || 'info')} />
                    <div className={ACTIVIDAD_CUERPO}>
                      <p>
                        Denuncia #{d.id} — {d.ubicacion}
                        <span className={etiquetaActividad(BADGE_DENUNCIA[d.estado]?.punto || 'info')}> {d.estado.replace('_', ' ')}</span>
                      </p>
                      <span className={ACTIVIDAD_HORA}>{hace(d.fecha)}</span>
                    </div>
                  </li>
                ))}
                {actividad.length === 0 && <li className={ACTIVIDAD_ITEM}><p>Aún no hay denuncias.</p></li>}
              </ul>
            </section>

            {/* Reportes: barras */}
            <section className={CARD}>
              <div className={CARD_HEAD}>
                <h2>Resumen de Reportes</h2>
              </div>
              <p className={MINI_TITULO}>Denuncias de los últimos 6 meses</p>
              <div className={BARRAS}>
                {datosGrafico.map((d) => (
                  <div className={BARRAS_GRUPO} key={d.mes}>
                    <div className={BARRAS_PAR}>
                      <div
                        className={BARRA}
                        style={{ height: `${(d.denuncias / maxBar) * 100}%` }}
                        title={`Denuncias en ${d.mes}: ${d.denuncias}`}
                      />
                    </div>
                    <span className={BARRAS_ETIQUETA}>{d.mes} ({d.denuncias})</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Alertas y Notificaciones */}
            <section className={CARD}>
              <div className={CARD_HEAD}>
                <h2>Alertas y Notificaciones</h2>
              </div>

              {denunciasUrgentes.length > 0 ? (
                <div className={ALERTA_CRITICA}>
                  <FiAlertTriangle />
                  <div>
                    <strong>Denuncia urgente pendiente (#{denunciasUrgentes[0].id})</strong>
                    <p>{denunciasUrgentes[0].descripcion.slice(0, 75)}...</p>
                  </div>
                </div>
              ) : (
                <div className={ALERTA_INFO} style={{ borderColor: 'rgba(16, 185, 129, 0.4)' }}>
                  <FiCheckCircle style={{ color: '#10B981' }} />
                  <div>
                    <strong>Sin denuncias críticas sin atender</strong>
                    <p>Todos los reportes urgentes han sido verificados o asignados.</p>
                  </div>
                </div>
              )}

              {s.fundaciones_pendientes > 0 && (
                <Link to="/admin/adopciones" className={ALERTA_INFO} style={{ textDecoration: 'none' }}>
                  <FiAlertTriangle />
                  <div>
                    <strong>Fundaciones por verificar: {s.fundaciones_pendientes}</strong>
                    <p>Revisa los registros pendientes en "Registro de Fundaciones".</p>
                  </div>
                </Link>
              )}
            </section>

          </div>
        </main>

    </>
  )
}

export default AdminDashboard