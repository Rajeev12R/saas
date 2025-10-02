"use client"
import React, { useRef, forwardRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

interface TextObjectProps {
    content: string;
    fontSize: number;
    fontFamily: string;
    color: string;
    position: [number, number, number];
    isSelected?: boolean;
    onPointerDown?: (event: any) => void;
    onDoubleClick?: () => void;
}

const TextObject = forwardRef<THREE.Mesh, TextObjectProps>(({
    content, 
    fontSize, 
    fontFamily, 
    color, 
    position, 
    isSelected = false, 
    onPointerDown,
    onDoubleClick
}, ref) => {
    const textRef = useRef<THREE.Mesh>(null)
    const localRef = (ref as React.RefObject<THREE.Mesh>) || textRef

    useFrame(({ camera }) => {
        if (localRef.current) {
            localRef.current.lookAt(camera.position)
        }
    })

    // Simple font mapping
    const getFontUrl = (fontFamily: string) => {
        const fontMap: { [key: string]: string } = {
            'Arial': 'https://fonts.gstatic.com/s/arial/v18/',
            'Helvetica': 'https://fonts.gstatic.com/s/helvetica/v19/',
            'Times New Roman': 'https://fonts.gstatic.com/s/times/v20/',
            'Georgia': 'https://fonts.gstatic.com/s/georgia/v17/',
            'Courier New': 'https://fonts.gstatic.com/s/courier/v22/',
            'Verdana': 'https://fonts.gstatic.com/s/verdana/v17/',
            'Trebuchet MS': 'https://fonts.gstatic.com/s/trebuchet/v15/',
            'Open Sans': 'https://fonts.gstatic.com/s/opensans/v34/'
        }
        
        return fontMap[fontFamily] || fontMap['Arial']
    }

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
        <Text
            ref={localRef}
            position={position}
            fontSize={fontSize / 100}
            color={color}
            font={getFontUrl(fontFamily)}
            anchorX="center"
            anchorY="middle"
            onPointerDown={handlePointerDown}
        >
            {content}
            <meshBasicMaterial
                toneMapped={false}
                side={THREE.DoubleSide}
                transparent={true}
                opacity={isSelected ? 0.9 : 1}
            />
            {isSelected && (
                <mesh position={[0, 0, -0.01]}>
                    <planeGeometry args={[content.length * (fontSize / 100) * 0.6, fontSize / 80]} />
                    <meshBasicMaterial 
                        color="#3b82f6" 
                        transparent 
                        opacity={0.2} 
                        side={THREE.DoubleSide}
                    />
                </mesh>
            )}
        </Text>
    )
})

TextObject.displayName = 'TextObject'

export default TextObject