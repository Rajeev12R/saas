// src/app/designboard/page.tsx (or DesignBoard.tsx)
import React from 'react'
import DesignBar from '@/components/layout/DesignBar'
import Sidebar from '@/components/layout/Sidebar' 
import Canvas from '@/components/designboard/Canvas'

const DesignBoard = () => {
  return (
    <div className='w-screen h-screen flex flex-col'>
      <DesignBar />

      <div className="flex flex-1 w-full">
        <Sidebar />

        <Canvas/>
      </div>
    </div>
  )
}

export default DesignBoard
