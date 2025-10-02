"use client"
import React, { useRef } from 'react'
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
}

const TextObject: React.FC<TextObjectProps> = ({content, fontSize, fontFamily, color, position, isSelected = false, onPointerDown}) => {
    const textRef = useRef<THREE.Mesh>(null)

    useFrame(({ camera }) => {
        if (textRef.current) {
            textRef.current.lookAt(camera.position)
        }
    })

    return (
        <Text
            ref={textRef}
            position={position}
            fontSize={fontSize / 100}
            color={color}
            font={`https://fonts.gstatic.com/s/${fontFamily.toLowerCase().replace(/ /g, '')}/v18/*`}
            anchorX="center"
            anchorY="middle"
            onPointerDown={onPointerDown}
        >
            {content}
            <meshBasicMaterial
                toneMapped={false}
                side={THREE.DoubleSide}
            />
        </Text>
    )
}

export default TextObject