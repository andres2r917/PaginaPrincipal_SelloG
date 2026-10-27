import { Link } from 'react-router-dom'
import { FiClock } from 'react-icons/fi'

const FundacionProximamente = ({ titulo }) => (
	<section className="fnd-proximamente">
		<div className="admin-card fnd-proximamente__card">
			<FiClock className="fnd-proximamente__icon" />
			<h1>{titulo}</h1>
			<p>Este módulo estará disponible en una próxima versión</p>
			<Link to="/fundacion" className="fnd-btn-primario">Volver al panel</Link>
		</div>
	</section>
)

export default FundacionProximamente
