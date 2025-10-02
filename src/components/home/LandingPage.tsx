import React from 'react'

const LandingPage = () => {
    return (
        <div className='w-full h-full flex justify-center'>
            <div className='left w-1/2 h-screen bg-amber-600'>
            </div>
            <div className="right w-1/2 h-screen bg-background flex flex-col justify-center items-start px-12 space-y-6">
                <h1 className="text-6xl text-stone-800 font-bold tracking-wide leading-tight">
                    Next-Gen Fashion Design <br /> <span className="text-foreground">
                        Powered by{" "}
                        <span className="bg-[linear-gradient(90deg,#ff0080,#ff8c00,#40c463,#1e90ff,#8a2be2)] bg-clip-text text-transparent animate-gradient">
                            3D
                        </span>
                    </span>
                </h1>
                <p className="text-lg text-gray-600 max-w-md">
                    Create, customize, and preview clothing designs in real-time 3D.
                    Empower your brand with futuristic fashion design tools.
                </p>
                <div className="flex gap-4 mt-4">
                    <button className="py-3 px-6 bg-foreground text-background text-sm font-semibold rounded-lg shadow-md hover:opacity-90 transition">
                        Try Demo
                    </button>
                    <button className="py-3 px-6 bg-transparent border border-foreground text-foreground text-sm font-semibold rounded-lg hover:bg-foreground hover:text-background transition">
                        Get Started
                    </button>
                </div>
            </div>

        </div>
    )
}

export default LandingPage