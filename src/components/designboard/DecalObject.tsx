"use client"
import React, { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

interface DecalObjectProps {
  url: string;
  position: [number, number, number];
  scale?: number;
  rotation?: number;
  opacity?: number;
  isSelected?: boolean;
  onPointerDown?: (event: any) => void;
  onDoubleClick?: () => void;
}

const DecalObject: React.FC<DecalObjectProps> = ({
  url,
  position,
  scale = 0.2, 
  rotation = 0,
  opacity = 1,
  isSelected = false,
  onPointerDown,
  onDoubleClick
}) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const { camera } = useThree()
  const texture = useTexture(url)

  const decalGeometry = useMemo(() => {
    return new THREE.PlaneGeometry(scale, scale)
  }, [scale])

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.lookAt(camera.position)
      meshRef.current.rotation.z = rotation
    }
  })

  let clickTimeout: NodeJS.Timeout | null = null

  const handlePointerDown = (e: any) => {
    e.stopPropagation()
    
    if (clickTimeout) {
      clearTimeout(clickTimeout)
      clickTimeout = null
      onDoubleClick?.()
    } else {
      clickTimeout = setTimeout(() => {
        clickTimeout = null
        onPointerDown?.(e)
      }, 300)
    }
  }

  return (
    <mesh
      ref={meshRef}
      position={position}
      geometry={decalGeometry}
      onPointerDown={handlePointerDown}
    >
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        alphaTest={0.1}
        depthTest={true}
        depthWrite={false}
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

export default DecalObject