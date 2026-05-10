import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Header from './Componentes/Header.jsx'
import Home from './Pages/Home.jsx'
import Login from './Pages/Login.jsx'
import Registro from './Pages/Registro.jsx'
import Adopcion from './Pages/Adopcion.jsx'
const App = () => {
  return (
    <div>
      <Header />

      <Routes>
        <Route path="/"element={<Home />} />
        <Route path="/home"element={<Home />} />
        <Route path="/login"element={<Login />} />
        <Route path="/registro"element={<Registro />} />
        <Route path="/adopcion"element={<Adopcion />} />
      </Routes>

    </div>
  )
}

export default App