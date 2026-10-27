import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './Componentes/Header.jsx'
import Home from './Pages/Home.jsx'
import Login from './Pages/Login.jsx'
import Registro from './Pages/Registro.jsx'
import Adopcion from './Pages/Adopcion.jsx'
import Denuncia from './Pages/Denuncia.jsx'
import Perfil from './Pages/Perfil.jsx'
import MisSolicitudes from './Pages/MisSolicitudes.jsx'
import RegistroFundacion from './Pages/RegistroFundacion.jsx'
import AdminDashboard from './Pages/Admin/AdminDashboard.jsx'
import AdminAdopciones from './Pages/Admin/AdminAdopciones.jsx'
import AdminMascotas from './Pages/Admin/AdminMascotas.jsx'
import AdminDenuncias from './Pages/Admin/AdminDenuncias.jsx'
import AdminUsuarios from './Pages/Admin/AdminUsuarios.jsx'
import AdminConfiguracion from './Pages/Admin/AdminConfiguracion.jsx'
import { AuthProvider } from './Context/AuthContext.jsx'
import RutaProtegida from './Componentes/RutaProtegida.jsx'
import AdminLayout from './Componentes/Admin/AdminLayout.jsx'
import { FundacionProvider } from './Context/FundacionContext.jsx'
import FundacionLayout from './Componentes/Fundacion/FundacionLayout.jsx'
import FundacionDashboard from './Pages/Fundacion/FundacionDashboard.jsx'
import FundacionExpedientes from './Pages/Fundacion/FundacionExpedientes.jsx'
import FundacionPipeline from './Pages/Fundacion/FundacionPipeline.jsx'
import FundacionAdopciones from './Pages/Fundacion/FundacionAdopciones.jsx'
import FundacionAjustes from './Pages/Fundacion/FundacionAjustes.jsx'
import FundacionProximamente from './Pages/Fundacion/FundacionProximamente.jsx'
import FundacionDenuncias from './Pages/Fundacion/FundacionDenuncias.jsx'
import { DenunciasProvider } from './Context/DenunciasContext.jsx'

const AppContenido = () => {
  const location = useLocation()
  // Ocultar el navbar global en los paneles de administrador y de fundación
  const esPanel = location.pathname.startsWith('/admin') || location.pathname.startsWith('/fundacion')

  return (
    <div>
      {!esPanel && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Ruta anidada */}
        <Route path="/registro" element={<Registro />}>
          <Route path="registroFundacion" element={<RegistroFundacion />} />
        </Route>

        <Route path="/adopcion" element={<Adopcion />} />
        <Route path="/denuncia" element={<Denuncia />} />

        {/* Solo usuario civil */}
        <Route element={<RutaProtegida roles={['civil']} />}>
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/mis-solicitudes" element={<MisSolicitudes />} />
        </Route>

        {/* Solo administrador */}
        <Route element={<RutaProtegida roles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/adopciones" element={<AdminAdopciones />} />
            <Route path="/admin/mascotas" element={<AdminMascotas />} />
            <Route path="/admin/denuncias" element={<AdminDenuncias />} />
            <Route path="/admin/usuarios" element={<AdminUsuarios />} />
            <Route path="/admin/configuracion" element={<AdminConfiguracion />} />
          </Route>
        </Route>

        {/* Solo fundación, con su propio contexto de datos */}
        <Route element={<RutaProtegida roles={['fundacion']} />}>
          <Route element={<FundacionProvider><FundacionLayout /></FundacionProvider>}>
            <Route path="/fundacion" element={<FundacionDashboard />} />
            <Route path="/fundacion/expedientes" element={<FundacionExpedientes />} />
            <Route path="/fundacion/pipeline" element={<FundacionPipeline />} />
            <Route path="/fundacion/adopciones" element={<FundacionAdopciones />} />
            <Route path="/fundacion/historial-medico" element={<FundacionProximamente titulo="Historial Médico" />} />
            <Route path="/fundacion/donaciones" element={<FundacionProximamente titulo="Donaciones & Recursos" />} />
            <Route path="/fundacion/denuncias" element={<FundacionDenuncias />} />
            <Route path="/fundacion/metricas" element={<FundacionProximamente titulo="Métricas & Auditoría" />} />
            <Route path="/fundacion/ajustes" element={<FundacionAjustes />} />
          </Route>
        </Route>
      </Routes>

    </div>
  )
}

// El AuthProvider envuelve todo para que Header, Login y los paneles lean la sesión
const App = () => (
  <AuthProvider>
    {/* Las denuncias se comparten entre la vista pública, el panel de fundación y el panel admin */}
    <DenunciasProvider>
      <AppContenido />
    </DenunciasProvider>
  </AuthProvider>
)

export default App