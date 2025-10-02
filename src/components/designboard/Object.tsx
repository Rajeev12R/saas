"use client"
import React from 'react'
import { useGLTF } from "@react-three/drei"

const Object = () => {
    const { scene } = useGLTF("/models/scene.gltf")
    return (
        <primitive object={scene} scale={2} />
    )
}

export default Object