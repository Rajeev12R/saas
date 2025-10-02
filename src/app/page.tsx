import React from 'react'
import Navbar from '../components/layout/Navbar'
import LandingPage from '../components/home/LandingPage'
const page = () => {
  return (
    <div className='text-foreground flex flex-col w-screen h-screen overflow-x-hidden'>
      <Navbar/>
      <div className='max-w-7xl mx-auto flex flex-col w-full h-full px-4'>
      <LandingPage/>
      </div>
    </div>
  )
}

export default page