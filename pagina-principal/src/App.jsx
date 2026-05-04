import React from 'react'
import './App.css'
import Header from './Componentes/Header.jsx'
import Footer from './Componentes/Footer.jsx'
import Navbar from './Componentes/Navbar.jsx'
import Seccion1 from './Componentes/Seccion1.jsx'
import Seccion2 from './Componentes/Seccion2.jsx' 
const App = () => {
  return (
    <div>      
      <Header />
      <Navbar/>
    <div>
      <Seccion1 />
      <Seccion2 />
    </div>
      <Footer />
    </div>
  )
}

export default App
