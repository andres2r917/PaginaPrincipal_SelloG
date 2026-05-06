import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom';
import Header from './Componentes/Header.jsx'
import Footer from './Componentes/Footer.jsx'
import Navbar from './Componentes/Navbar.jsx'
import Seccion1 from './Componentes/Seccion1.jsx'
import Home from './Pages/Home.jsx'
import Login from './Pages/Login.jsx'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />    
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>   
    </div>   
  )
}

export default App