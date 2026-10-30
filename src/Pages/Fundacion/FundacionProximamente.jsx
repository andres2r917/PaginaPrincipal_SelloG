import { Link } from 'react-router-dom'
import { FiClock } from 'react-icons/fi'
import { CARD } from '../../Utils/panelEstilos'
import { FND_BTN_PRIMARIO } from '../../Utils/fundacionEstilos'

const FundacionProximamente = ({ titulo }) => (
	<section className="fnd-proximamente">
		<div className={`${CARD} fnd-proximamente__card`}>
			<FiClock className="fnd-proximamente__icon" />
			<h1>{titulo}</h1>
			<p>Este módulo estará disponible en una próxima versión</p>
			<Link to="/fundacion" className={FND_BTN_PRIMARIO}>Volver al panel</Link>
		</div>
	</section>
)

export default FundacionProximamente
