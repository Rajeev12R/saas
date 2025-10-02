"use client"
import React, { useEffect, useState, useRef } from 'react'
import { Canvas as ThreeCanvas } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'
import * as THREE from 'three'
import Object from './Object'
import TextObject from './TextObject'

interface TextConfig {
    content: string;
    fontSize: number;
    fontFamily: string;
    color: string;
    position: [number, number, number];
    id: string;
}

interface TextModeConfig {
    fontSize: number;
    fontFamily: string;
    color: string;
}

const Canvas = () => {
    const [texts, setTexts] = useState<TextConfig[]>([])
    const [isTextMode, setIsTextMode] = useState(false)
    const [textModeConfig, setTextModeConfig] = useState<TextModeConfig | null>(null)
    const [tempText, setTempText] = useState('')
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
    const [isDraggingText, setIsDraggingText] = useState(false)
    const [draggingTextId, setDraggingTextId] = useState<string | null>(null)
    const canvasRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleActivateTextMode = (event: CustomEvent<TextModeConfig>) => {
            setIsTextMode(true)
            setTextModeConfig(event.detail)
            setTempText('Your Text Here')
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (isTextMode && e.key === 'Escape') {
                setIsTextMode(false)
                setTextModeConfig(null)
                setTempText('')
            }
        }

        window.addEventListener('activateTextMode', handleActivateTextMode as EventListener)
        window.addEventListener('keydown', handleKeyDown)
        
        return () => {
            window.removeEventListener('activateTextMode', handleActivateTextMode as EventListener)
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [isTextMode])

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect()
        if (!rect) return

        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        setCursorPosition({ x, y })

        if (isDraggingText && draggingTextId) {
            const normalizedX = (x / rect.width) * 4 - 2
            const normalizedY = -(y / rect.height) * 4 + 2
            
            setTexts(prev => prev.map(text => 
                text.id === draggingTextId 
                    ? { ...text, position: [normalizedX, normalizedY, 0] }
                    : text
            ))
        }
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!isTextMode) return
        
        const target = e.target as HTMLElement
        if (target.tagName === 'INPUT') return

        const rect = canvasRef.current?.getBoundingClientRect()
        if (!rect) return

        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        if (textModeConfig && tempText.trim()) {
            const normalizedX = (x / rect.width) * 4 - 2
            const normalizedY = -(y / rect.height) * 4 + 2
            
            const newText: TextConfig = {
                content: tempText,
                fontSize: textModeConfig.fontSize,
                fontFamily: textModeConfig.fontFamily,
                color: textModeConfig.color,
                position: [normalizedX, normalizedY, 0],
                id: Math.random().toString(36).substr(2, 9)
            }
            
            setTexts(prev => [...prev, newText])
            setIsTextMode(false)
            setTextModeConfig(null)
            setTempText('')
        }
    }

    const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempText(e.target.value)
    }

    const handleTextInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && textModeConfig) {
            const rect = canvasRef.current?.getBoundingClientRect()
            if (!rect) return

            const normalizedX = (cursorPosition.x / rect.width) * 4 - 2
            const normalizedY = -(cursorPosition.y / rect.height) * 4 + 2
            
            const newText: TextConfig = {
                content: tempText,
                fontSize: textModeConfig.fontSize,
                fontFamily: textModeConfig.fontFamily,
                color: textModeConfig.color,
                position: [normalizedX, normalizedY, 0],
                id: Math.random().toString(36).substr(2, 9)
            }
            
            setTexts(prev => [...prev, newText])
            setIsTextMode(false)
            setTextModeConfig(null)
            setTempText('')
        } else if (e.key === 'Escape') {
            setIsTextMode(false)
            setTextModeConfig(null)
            setTempText('')
        }
    }

    const handleTextObjectMouseDown = (e: any, textId: string) => {
        e.stopPropagation()
        setIsDraggingText(true)
        setDraggingTextId(textId)
    }

    const handleMouseUp = () => {
        setIsDraggingText(false)
        setDraggingTextId(null)
    }

    const handleMouseLeave = () => {
        setIsDraggingText(false)
        setDraggingTextId(null)
    }

    return (
        <div 
            ref={canvasRef}
            className="flex-1 bg-white flex items-center justify-center relative"
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
        >
            {isTextMode && (
                <div 
                    className="absolute bg-white border-2 border-blue-500 rounded-lg shadow-lg p-2 min-w-[120px] z-10 pointer-events-none"
                    style={{
                        left: `${cursorPosition.x}px`,
                        top: `${cursorPosition.y}px`,
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    <input
                        type="text"
                        value={tempText}
                        onChange={handleTextInputChange}
                        onKeyDown={handleTextInputKeyDown}
                        className="w-full border-none outline-none text-sm bg-transparent pointer-events-auto"
                        autoFocus
                        style={{
                            fontSize: `${textModeConfig?.fontSize}px`,
                            fontFamily: textModeConfig?.fontFamily,
                            color: textModeConfig?.color
                        }}
                    />
                </div>
            )}
            
            <ThreeCanvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />

                <Stage environment="city" intensity={0.6}>
                    <Object />
                    {texts.map((text) => (
                        <TextObject
                            key={text.id}
                            content={text.content}
                            fontSize={text.fontSize}
                            fontFamily={text.fontFamily}
                            color={text.color}
                            position={text.position}
                            onPointerDown={(e) => handleTextObjectMouseDown(e, text.id)}
                        />
                    ))}
                </Stage>

                <OrbitControls
                    enablePan={false}
                    minDistance={2}
                    maxDistance={4}
                    enableDamping={true}
                    dampingFactor={0.05}
                    rotateSpeed={0.8}
                />
            </ThreeCanvas>
        </div>
    )
}

export default Canvas