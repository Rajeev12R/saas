'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Navbar: React.FC = () => {
    const router = useRouter();
  return (
    <nav className="w-full shadow-md shadow-black/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between md:h-16 lg:h-18 sm:h-14 px-4">
        
        <div className="left">
          <Image src="" alt="" width={20} height={20} />
        </div>

        <div className="center flex items-center justify-center gap-4 text-sm font-semibold">
          <Link href="" className='px-4 py-2 hover:bg-gray-50 rounded-xl'>Home</Link>
          <Link href="" className='px-4 py-2 hover:bg-gray-50 rounded-xl'>3D Demos</Link>
          <Link href="" className='px-4 py-2 hover:bg-gray-50 rounded-xl'>Product</Link>
          <Link href="" className='px-4 py-2 hover:bg-gray-50 rounded-xl'>Discover Tools</Link>
          <Link href="" className='px-4 py-2 hover:bg-gray-50 rounded-xl'>Pricing</Link>
        </div>

        <div className="right flex items-center justify-center gap-5">
          <button className="py-2 px-5 bg-foreground text-background text-sm cursor-pointer rounded-lg" onClick={() => router.push("/designboard")}>Try Demo</button>
          <button className="py-2 px-5 bg-foreground text-background text-sm cursor-pointer rounded-lg">Get Started</button>
        </div>

      </div>
    </nav>
  )
}

export default Navbar
