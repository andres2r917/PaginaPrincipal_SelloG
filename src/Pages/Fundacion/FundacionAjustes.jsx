import { useState } from 'react'
import { useAuth } from '../../Context/AuthContext.jsx'
import { useFundacion } from '../../Context/FundacionContext.jsx'
import { FiHome, FiCheck, FiSave } from 'react-icons/fi'

const FundacionAjustes = () => {
	const { usuario, guardarPerfilFundacion } = useAuth()
	const { capacidad, actualizarCapacidad, mascotas } = useFundacion()

	const [formulario, setFormulario] = useState({
		nombre: usuario?.nombre || '',
		cedulaRepresentante: usuario?.cedulaRepresentante || usuario?.nit || '',
		representante: usuario?.representante || '',
		telefono: usuario?.telefono || '',
		direccion: usuario?.direccion || '',
		redes: usuario?.redes || '',
		descripcion: usuario?.descripcion || '',
	})
	const [guardado, setGuardado] = useState(false)
	const [aviso, setAviso] = useState('')

	// Estado local para la capacidad del refugio
	const [nuevaCapacidad, setNuevaCapacidad] = useState(capacidad)
	const [capacidadGuardada, setCapacidadGuardada] = useState(false)

	const enCustodia = mascotas.filter((m) => m.estadoAdopcion !== 'adoptado').length
	const porcentajeOcupacion = Math.min(100, Math.round((enCustodia / (capacidad || 1)) * 100))

	const cambiarCampo = (e) => {
		setFormulario((actual) => ({ ...actual, [e.target.name]: e.target.value }))
		setGuardado(false)
	}

	// Los datos de la organización se guardan en la API
	const guardarCambios = async (e) => {
		e.preventDefault()
		setAviso('')
		try {
			await guardarPerfilFundacion(formulario)
			setGuardado(true)
		} catch (error) {
			setAviso(error.message)
		}
	}

	const guardarCapacidad = async (e) => {
		e.preventDefault()
		setAviso('')
		const resultado = await actualizarCapacidad(nuevaCapacidad)
		if (resultado.ok) {
			setCapacidadGuardada(true)
			setTimeout(() => setCapacidadGuardada(false), 3000)
		} else {
			setAviso(resultado.mensaje)
		}
	}

	return (
		<section>
			<h1 className="admin-title">Ajustes de Sede y Refugio</h1>
			{aviso && <p className="fnd-aviso fnd-aviso--error" role="alert">{aviso}</p>}

			{/* Tarjeta para configurar la capacidad del refugio */}
			<div className="admin-card fnd-form-card" style={{ marginBottom: 24 }}>
				<div className="fnd-ajustes-cabecera">
					<div>
						<h2><FiHome style={{ marginRight: 8, verticalAlign: 'middle', color: '#7C3AED' }} /> Capacidad del Refugio</h2>
						<p className="admin-card__subtitle">Define el límite máximo de animales que el refugio puede albergar simultáneamente.</p>
					</div>
					<span className="admin-badge--exito">{enCustodia} / {capacidad} ocupados ({porcentajeOcupacion}%)</span>
				</div>

				<div style={{ marginTop: 12, marginBottom: 16 }}>
					<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6, color: 'rgba(241,245,249,0.7)' }}>
						<span>Ocupación actual</span>
						<span>{enCustodia} de {capacidad} cupos</span>
					</div>
					<div className="h-[10px] w-full overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
						<div
							className="h-full rounded-full transition-[width] duration-[400ms] ease-[ease]"
							style={{
								width: `${porcentajeOcupacion}%`,
								background: porcentajeOcupacion > 90 ? 'var(--color-peligro)' : porcentajeOcupacion > 70 ? 'var(--color-aviso)' : 'var(--color-exito)'
							}}
						/>
					</div>
				</div>

				<form onSubmit={guardarCapacidad} style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
					<label style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 200 }}>
						<span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(241,245,249,0.7)', textTransform: 'uppercase' }}>
							Cupos máximos del refugio
						</span>
						<input
							type="number"
							min="1"
							max="500"
							className="fnd-modal__input"
							value={nuevaCapacidad}
							onChange={(e) => {
								setNuevaCapacidad(e.target.value)
								setCapacidadGuardada(false)
							}}
							required
							style={{ maxWidth: 220 }}
						/>
					</label>

					<button type="submit" className="fnd-btn-primario" style={{ alignSelf: 'flex-end', height: 42 }}>
						<FiSave /> Guardar capacidad
					</button>

					{capacidadGuardada && (
						<span style={{ color: '#10B981', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, alignSelf: 'flex-end', height: 42 }}>
							<FiCheck /> ¡Capacidad actualizada! ({nuevaCapacidad} cupos)
						</span>
					)}
				</form>
			</div>

			{/* Tarjeta de información de la organización */}
			<div className="admin-card fnd-form-card">
				<div className="fnd-ajustes-cabecera">
					<div>
						<h2>Información de la fundación</h2>
						<p className="admin-card__subtitle">Administra los datos visibles de tu organización.</p>
					</div>
					<span className="admin-badge--exito">{usuario?.estadoVerificacion || 'verificada'}</span>
				</div>

				<form className="fnd-ajustes-form" onSubmit={guardarCambios}>
					{[
						['nombre', 'Nombre de la organización'],
						['cedulaRepresentante', 'Cédula del Representante'],
						['representante', 'Representante'],
						['telefono', 'Teléfono'],
						['direccion', 'Dirección'],
						['redes', 'Redes sociales'],
					].map(([nombre, etiqueta]) => (
						<label key={nombre}>
							<span>{etiqueta}</span>
							<input name={nombre} value={formulario[nombre]} onChange={cambiarCampo} />
						</label>
					))}
					<label className="fnd-ajustes-form__ancho">
						<span>Descripción</span>
						<textarea name="descripcion" value={formulario.descripcion} onChange={cambiarCampo} rows="4" />
					</label>
					<div className="fnd-ajustes-form__acciones">
						{guardado && <span className="fnd-guardado">Cambios guardados</span>}
						<button type="submit" className="fnd-btn-primario">Guardar cambios</button>
					</div>
				</form>
			</div>
		</section>
	)
}

export default FundacionAjustes
