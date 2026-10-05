import { useState } from 'react'
import { useAuth } from '../Context/AuthContext.jsx'

const FundacionAjustes = () => {
	const { usuario, actualizarUsuario } = useAuth()
	const [formulario, setFormulario] = useState({
		nombre: usuario?.nombre || '',
		nit: usuario?.nit || '',
		representante: usuario?.representante || '',
		telefono: usuario?.telefono || '',
		direccion: usuario?.direccion || '',
		redes: usuario?.redes || '',
		descripcion: usuario?.descripcion || '',
	})
	const [guardado, setGuardado] = useState(false)

	const cambiarCampo = (e) => {
		setFormulario((actual) => ({ ...actual, [e.target.name]: e.target.value }))
		setGuardado(false)
	}

	const guardarCambios = (e) => {
		e.preventDefault()
		actualizarUsuario(formulario)
		setGuardado(true)
	}

	return (
		<section>
			<h1 className="admin-title">Ajustes de Sede</h1>
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
						['nit', 'NIT'],
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
