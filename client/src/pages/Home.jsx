import React from 'react'
import Navbar from '../components/Navbar.jsx'
import Header from '../components/Header.jsx'
import { assets } from '../assets/assets.js'

const Home = () => {
  return (
    <div 
      className='flex flex-col items-center justify-center min-h-screen bg-cover bg-center'
      style={{ backgroundImage: `url(${assets.bg_img})` }}
    >
        <Navbar />
        <Header />
    </div>
  )
}

export default Home