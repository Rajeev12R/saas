"use client"
import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

interface ImageObjectProps {
  url: string;
  position: [number, number, number];
  scale?: number;
  rotation?: number;
  opacity?: number;
  isSelected?: boolean;
  onPointerDown?: (event: any) => void;
}

const ImageObject: React.FC<ImageObjectProps> = ({
  url,
  position,
  scale = 1,
  rotation = 0,
  opacity = 1,
  isSelected = false,
  onPointerDown
}) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const texture = useTexture(url)

  useFrame(({ camera }) => {
    if (meshRef.current) {
      meshRef.current.lookAt(camera.position)
      meshRef.current.rotation.z = rotation
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={[scale * 0.5, scale * 0.5, 1]}
      onPointerDown={onPointerDown}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
      />
      
      {isSelected && (
        <mesh scale={[1.1, 1.1, 1]}>
          <ringGeometry args={[0.5, 0.55, 32]} />
          <meshBasicMaterial 
            color="#3b82f6" 
            transparent 
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </mesh>
  )
}

export default ImageObject