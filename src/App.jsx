import React from 'react'
import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './Componentes/Header.jsx'
import Home from './Pages/Home.jsx'
import Login from './Pages/Login.jsx'
import Registro from './Pages/Registro.jsx'
import Adopcion from './Pages/Adopcion.jsx'
import Denuncia from './Pages/Denuncia.jsx'
import Perfil from './Pages/Perfil.jsx'
import RegistroFundacion from './Pages/RegistroFundacion.jsx'
import AdminDashboard from './Pages/AdminDashboard.jsx'
import AdminAdopciones from './Pages/AdminAdopciones.jsx'
import AdminMascotas from './Pages/AdminMascotas.jsx'
import AdminDenuncias from './Pages/AdminDenuncias.jsx'
import AdminUsuarios from './Pages/AdminUsuarios.jsx'
import AdminConfiguracion from './Pages/AdminConfiguracion.jsx'

const App = () => {
  const location = useLocation()
  // Ocultar el navbar global en todas las rutas del panel de administrador
  const esRutaAdmin = location.pathname.startsWith('/admin')

  return (
    <div>
      {!esRutaAdmin && <Header />}

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
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/adopciones" element={<AdminAdopciones />} />
        <Route path="/admin/mascotas" element={<AdminMascotas />} />
        <Route path="/admin/denuncias" element={<AdminDenuncias />} />
        <Route path="/admin/usuarios" element={<AdminUsuarios />} />
        <Route path="/admin/configuracion" element={<AdminConfiguracion />} />
      </Routes>

    </div>
  )
}

export default App