"use client"
import React, { useEffect, useState, useRef, useCallback } from 'react'
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
    isEditing?: boolean;
}

interface TextModeConfig {
    fontSize: number;
    fontFamily: string;
    color: string;
}

interface ModelConfig {
    color: string;
    texture: string;
}

const Canvas = () => {
    const [texts, setTexts] = useState<TextConfig[]>([])
    const [isTextMode, setIsTextMode] = useState(false)
    const [textModeConfig, setTextModeConfig] = useState<TextModeConfig | null>(null)
    const [selectedTextId, setSelectedTextId] = useState<string | null>(null)
    const [isDraggingText, setIsDraggingText] = useState(false)
    const [draggingTextId, setDraggingTextId] = useState<string | null>(null)
    const [modelConfig, setModelConfig] = useState<ModelConfig>({
        color: '#ffffff',
        texture: ''
    })
    const canvasRef = useRef<HTMLDivElement>(null)
    const raycaster = useRef(new THREE.Raycaster())
    const mouse = useRef(new THREE.Vector2())

    const selectedText = texts.find(text => text.id === selectedTextId)

    useEffect(() => {
        const handleActivateTextMode = (event: CustomEvent<TextModeConfig>) => {
            setIsTextMode(true)
            setTextModeConfig(event.detail)

            const newText: TextConfig = {
                content: 'Double click to edit',
                fontSize: event.detail.fontSize,
                fontFamily: event.detail.fontFamily,
                color: event.detail.color,
                position: [0, 0, 0],
                id: Math.random().toString(36).substr(2, 9),
                isEditing: false
            }

            setTexts(prev => [...prev, newText])
            setSelectedTextId(newText.id)
            setIsTextMode(false) 
        }

        const handleModelColorChange = (event: CustomEvent<{ color: string }>) => {
            setModelConfig(prev => ({ ...prev, color: event.detail.color }))
        }

        const handleModelTextureChange = (event: CustomEvent<{ texture: string }>) => {
            setModelConfig(prev => ({ ...prev, texture: event.detail.texture }))
        }

        window.addEventListener('activateTextMode', handleActivateTextMode as EventListener)
        window.addEventListener('modelColorChange', handleModelColorChange as EventListener)
        window.addEventListener('modelTextureChange', handleModelTextureChange as EventListener)

        return () => {
            window.removeEventListener('activateTextMode', handleActivateTextMode as EventListener)
            window.removeEventListener('modelColorChange', handleModelColorChange as EventListener)
            window.removeEventListener('modelTextureChange', handleModelTextureChange as EventListener)
        }
    }, [])

    const handleCanvasClick = useCallback((event: React.MouseEvent) => {
        if (!canvasRef.current) return

        const rect = canvasRef.current.getBoundingClientRect()
        mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
        mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
        setSelectedTextId(null)
    }, [])

    const handleTextObjectClick = useCallback((event: any, textId: string) => {
        event.stopPropagation()
        setSelectedTextId(textId)
        setIsDraggingText(true)
        setDraggingTextId(textId)
    }, [])

    const handleMouseMove = useCallback((event: React.MouseEvent) => {
        if (!isDraggingText || !draggingTextId || !canvasRef.current) return

        const rect = canvasRef.current.getBoundingClientRect()
        const x = ((event.clientX - rect.left) / rect.width) * 4 - 2
        const y = -((event.clientY - rect.top) / rect.height) * 4 + 2

        setTexts(prev => prev.map(text =>
            text.id === draggingTextId
                ? { ...text, position: [x, y, 0] }
                : text
        ))
    }, [isDraggingText, draggingTextId])

    const handleMouseUp = useCallback(() => {
        setIsDraggingText(false)
        setDraggingTextId(null)
    }, [])

    const handleTextDoubleClick = useCallback((textId: string) => {
        setTexts(prev => prev.map(text =>
            text.id === textId
                ? { ...text, isEditing: true }
                : text
        ))
    }, [])

    const handleTextContentChange = useCallback((textId: string, newContent: string) => {
        setTexts(prev => prev.map(text =>
            text.id === textId
                ? { ...text, content: newContent, isEditing: false }
                : text
        ))
    }, [])

    useEffect(() => {
        const handleUpdateSelectedText = (event: CustomEvent<Partial<TextModeConfig>>) => {
            if (!selectedTextId) return

            setTexts(prev => prev.map(text =>
                text.id === selectedTextId
                    ? { ...text, ...event.detail }
                    : text
            ))
        }

        window.addEventListener('updateSelectedText', handleUpdateSelectedText as EventListener)
        return () => {
            window.removeEventListener('updateSelectedText', handleUpdateSelectedText as EventListener)
        }
    }, [selectedTextId])

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.key === 'Delete' || event.key === 'Backspace') && selectedTextId) {
                setTexts(prev => prev.filter(text => text.id !== selectedTextId))
                setSelectedTextId(null)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [selectedTextId])

    return (
        <div
            ref={canvasRef}
            className="flex-1 bg-white flex items-center justify-center relative cursor-grab active:cursor-grabbing"
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {selectedText?.isEditing && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-white border-2 border-blue-500 rounded-lg shadow-lg p-4 min-w-[300px]">
                    <input
                        type="text"
                        value={selectedText.content}
                        onChange={(e) => setTexts(prev => prev.map(text =>
                            text.id === selectedTextId
                                ? { ...text, content: e.target.value }
                                : text
                        ))}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                selectedTextId && handleTextContentChange(selectedTextId, selectedText.content)
                            } else if (e.key === 'Escape') {
                                selectedTextId && handleTextContentChange(selectedTextId, selectedText.content)
                            }
                        }}
                        onBlur={() => selectedTextId && handleTextContentChange(selectedTextId, selectedText.content)}
                        className="w-full border-none outline-none text-lg p-2 bg-transparent"
                        autoFocus
                        style={{
                            fontSize: `${selectedText.fontSize}px`,
                            fontFamily: selectedText.fontFamily,
                            color: selectedText.color
                        }}
                    />
                    <div className="text-xs text-gray-500 mt-2">
                        Press Enter to save, Escape to cancel
                    </div>
                </div>
            )}

            <ThreeCanvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />

                <Stage environment="city" intensity={0.6}>
                    <Object
                        color={modelConfig.color}
                        textureUrl={modelConfig.texture}
                    />
                    {texts.map((text) => (
                        <TextObject
                            key={text.id}
                            content={text.content}
                            fontSize={text.fontSize}
                            fontFamily={text.fontFamily}
                            color={text.color}
                            position={text.position}
                            isSelected={text.id === selectedTextId}
                            onPointerDown={(e) => handleTextObjectClick(e, text.id)}
                            onDoubleClick={() => handleTextDoubleClick(text.id)}
                        />
                    ))}
                </Stage>

                <OrbitControls
                    enablePan={true}
                    minDistance={2}
                    maxDistance={10}
                    enableDamping={true}
                    dampingFactor={0.05}
                    rotateSpeed={0.8}
                />
            </ThreeCanvas>
        </div>
    )
}

export default Canvas