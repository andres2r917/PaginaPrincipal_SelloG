import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Header from './Componentes/Header.jsx'
import Home from './Pages/Home.jsx'
import Login from './Pages/Login.jsx'
import Registro from './Pages/Registro.jsx'
import Adopcion from './Pages/Adopcion.jsx'
import Denuncia from './Pages/Denuncia.jsx'
import Perfil from './Pages/Perfil.jsx'
import RegistroFundacion from './Pages/RegistroFundacion.jsx'

const App = () => {
  return (
    <div>
      <Header />

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
      </Routes>

    </div>
  )
}

export default App