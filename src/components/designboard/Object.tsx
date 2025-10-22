// src/components/designboard/Object.tsx
"use client"
import React, { useRef, useEffect, useState } from 'react'
import { useGLTF, useTexture } from "@react-three/drei"
import * as THREE from 'three'

interface ObjectProps {
  color?: string;
  textureUrl?: string;
  dynamicTexture?: THREE.Texture | null;
}

const AVAILABLE_TEXTURES = {
  default: '/models/textures/Material.001_baseColor.png',
  normal: '/models/textures/Material.001_normal.png',
}

const Object: React.FC<ObjectProps> = ({ 
  color = '#ffffff', 
  textureUrl,
  dynamicTexture 
}) => {
  const { scene } = useGLTF("/models/scene.gltf")
  const modelRef = useRef<THREE.Group>(null)
  const [textureError, setTextureError] = useState(false)
  const [currentTexture, setCurrentTexture] = useState<THREE.Texture | null>(null)

  const getTexturePath = () => {
    if (!textureUrl) return AVAILABLE_TEXTURES.default
    return textureUrl
  }

  const texturePath = getTexturePath()
  const texture = useTexture(texturePath)

  useEffect(() => {
    const handleTextureLoad = () => {
      setTextureError(false)
      setCurrentTexture(texture)
    }

    const handleTextureError = () => {
      console.error(`Failed to load texture: ${texturePath}`)
      setTextureError(true)
      setCurrentTexture(null)
    }

    if (texture?.image?.complete) {
      if (texture.image.naturalWidth === 0) {
        handleTextureError()
      } else {
        handleTextureLoad()
      }
    } else {
      texture.image.onload = handleTextureLoad
      texture.image.onerror = handleTextureError
    }

    return () => {
      if (texture?.image) {
        texture.image.onload = null
        texture.image.onerror = null
      }
    }
  }, [texture, texturePath])

  useEffect(() => {
    if (!modelRef.current) return

    modelRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const material = child.material as THREE.MeshStandardMaterial;
        
        // Disable double-sided rendering to prevent text showing on back
        material.side = THREE.FrontSide;
        
        // Use dynamic texture if available, otherwise use base texture
        if (dynamicTexture) {
          material.map = dynamicTexture;
          material.color.set('#ffffff'); // Use white color when dynamic texture is applied
        } else if (currentTexture && !textureError) {
          material.map = currentTexture
          material.color.set('#ffffff')
        } else {
          material.map = null
          material.color.set(color)
        }
        
        if (material.map) {
          material.map.wrapS = THREE.RepeatWrapping
          material.map.wrapT = THREE.RepeatWrapping
          material.needsUpdate = true
        }
        
        material.needsUpdate = true
      }
    })
  }, [color, currentTexture, textureError, dynamicTexture])

  return (
    <primitive ref={modelRef} object={scene} scale={2} />
  )
}

export default Object