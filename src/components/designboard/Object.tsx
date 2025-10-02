"use client"
import React, { useRef, useEffect } from 'react'
import { useGLTF } from "@react-three/drei"
import * as THREE from 'three'

interface ObjectProps {
  color?: string;
  textureUrl?: string;
}

const Object: React.FC<ObjectProps> = ({ color, textureUrl }) => {
    const { scene } = useGLTF("/models/scene.gltf")
    const modelRef = useRef<THREE.Group>(null)

    useEffect(() => {
        if (!modelRef.current) return;

        modelRef.current.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
                const material = child.material as THREE.MeshStandardMaterial;
                
                if (color && material.color) {
                    material.color.set(color);
                }
                
                if (textureUrl) {
                    new THREE.TextureLoader().load(textureUrl, (texture) => {
                        texture.wrapS = THREE.RepeatWrapping;
                        texture.wrapT = THREE.RepeatWrapping;
                        material.map = texture;
                        material.needsUpdate = true;
                    });
                } else if (textureUrl === '') {
                    material.map = null;
                    material.needsUpdate = true;
                }
                
                material.needsUpdate = true;
            }
        });
    }, [color, textureUrl]);

    return (
        <primitive ref={modelRef} object={scene} scale={2} />
    )
}

export default Object