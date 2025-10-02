"use client"
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Canvas as ThreeCanvas } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'
import * as THREE from 'three'
import Object from './Object'
import TextObject from './TextObject'
import DecalObject from './DecalObject'

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

interface ImageConfig {
    id: string;
    url: string;
    position: [number, number, number];
    scale: number;
    rotation: number;
    opacity: number;
}

interface ImagePlacementMode {
    isActive: boolean;
    imageUrl: string | null;
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
    const [images, setImages] = useState<ImageConfig[]>([])
    const [imagePlacementMode, setImagePlacementMode] = useState<ImagePlacementMode>({
        isActive: false,
        imageUrl: null
    })
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null)
    const [isDraggingImage, setIsDraggingImage] = useState(false)
    const [draggingImageId, setDraggingImageId] = useState<string | null>(null)

    const canvasRef = useRef<HTMLDivElement>(null)
    const raycaster = useRef(new THREE.Raycaster())
    const mouse = useRef(new THREE.Vector2())

    const selectedText = texts.find(text => text.id === selectedTextId)
    const selectedImage = images.find(image => image.id === selectedImageId)

    const mapScreenToModelPosition = useCallback((screenX: number, screenY: number, rect: DOMRect): [number, number, number] => {
        const x = (screenX / rect.width) * 2 - 1
        const y = -(screenY / rect.height) * 2 + 1
        
        const modelX = x * 0.8  // Reduced range to stay on T-shirt
        const modelY = y * 0.8 + 0.3  // Adjusted Y offset for chest area
        const modelZ = 0.02  // Slightly in front of the model surface
        
        return [modelX, modelY, modelZ]
    }, [])

    useEffect(() => {
        const handleActivateTextMode = (event: CustomEvent<TextModeConfig>) => {
            setIsTextMode(true)
            setTextModeConfig(event.detail)

            const newText: TextConfig = {
                content: 'Your Text Here',
                fontSize: event.detail.fontSize,
                fontFamily: event.detail.fontFamily,
                color: event.detail.color,
                position: [0, 0.5, 0.02],
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

        const handleActivateImagePlacement = (event: CustomEvent<{ imageUrl: string }>) => {
            setImagePlacementMode({
                isActive: true,
                imageUrl: event.detail.imageUrl
            })
        }

        const handlePlaceImageAtHotspot = (event: CustomEvent<{ position: [number, number, number] }>) => {
            if (imagePlacementMode.imageUrl) {
                const newImage: ImageConfig = {
                    id: Math.random().toString(36).substr(2, 9),
                    url: imagePlacementMode.imageUrl,
                    position: event.detail.position,
                    scale: 0.3,
                    rotation: 0,
                    opacity: 1
                }
                setImages(prev => [...prev, newImage])
                setImagePlacementMode({ isActive: false, imageUrl: null })
                setSelectedImageId(newImage.id)
            }
        }

        const handleRemoveImage = (event: CustomEvent<{ imageUrl: string }>) => {
            setImages(prev => prev.filter(img => img.url !== event.detail.imageUrl))
            if (selectedImage?.url === event.detail.imageUrl) {
                setSelectedImageId(null)
            }
        }

        const handleUpdateSelectedText = (event: CustomEvent<Partial<TextModeConfig>>) => {
            if (!selectedTextId) return
            setTexts(prev => prev.map(text =>
                text.id === selectedTextId
                    ? { ...text, ...event.detail }
                    : text
            ))
        }

        window.addEventListener('activateTextMode', handleActivateTextMode as EventListener)
        window.addEventListener('modelColorChange', handleModelColorChange as EventListener)
        window.addEventListener('modelTextureChange', handleModelTextureChange as EventListener)
        window.addEventListener('activateImagePlacement', handleActivateImagePlacement as EventListener)
        window.addEventListener('placeImageAtHotspot', handlePlaceImageAtHotspot as EventListener)
        window.addEventListener('removeImage', handleRemoveImage as EventListener)
        window.addEventListener('updateSelectedText', handleUpdateSelectedText as EventListener)

        return () => {
            window.removeEventListener('activateTextMode', handleActivateTextMode as EventListener)
            window.removeEventListener('modelColorChange', handleModelColorChange as EventListener)
            window.removeEventListener('modelTextureChange', handleModelTextureChange as EventListener)
            window.removeEventListener('activateImagePlacement', handleActivateImagePlacement as EventListener)
            window.removeEventListener('placeImageAtHotspot', handlePlaceImageAtHotspot as EventListener)
            window.removeEventListener('removeImage', handleRemoveImage as EventListener)
            window.removeEventListener('updateSelectedText', handleUpdateSelectedText as EventListener)
        }
    }, [imagePlacementMode, selectedTextId, selectedImage])

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                if (imagePlacementMode.isActive) {
                    setImagePlacementMode({ isActive: false, imageUrl: null })
                }
                if (selectedText?.isEditing) {
                    selectedTextId && handleTextContentChange(selectedTextId, selectedText.content)
                }
            }

            if ((event.key === 'Delete' || event.key === 'Backspace')) {
                if (selectedTextId) {
                    setTexts(prev => prev.filter(text => text.id !== selectedTextId))
                    setSelectedTextId(null)
                }
                if (selectedImageId) {
                    setImages(prev => prev.filter(image => image.id !== selectedImageId))
                    setSelectedImageId(null)
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [selectedTextId, selectedImageId, imagePlacementMode, selectedText])

    const handleCanvasClick = useCallback((event: React.MouseEvent) => {
        if (!canvasRef.current) return

        const rect = canvasRef.current.getBoundingClientRect()

        if (imagePlacementMode.isActive && imagePlacementMode.imageUrl) {
            const position = mapScreenToModelPosition(
                event.clientX - rect.left,
                event.clientY - rect.top,
                rect
            )

            const newImage: ImageConfig = {
                id: Math.random().toString(36).substr(2, 9),
                url: imagePlacementMode.imageUrl,
                position: position,
                scale: 0.3,
                rotation: 0,
                opacity: 1
            }

            setImages(prev => [...prev, newImage])
            setImagePlacementMode({ isActive: false, imageUrl: null })
            setSelectedImageId(newImage.id)
            setSelectedTextId(null)
            return
        }

        setSelectedTextId(null)
        setSelectedImageId(null)
    }, [imagePlacementMode, mapScreenToModelPosition])


    const handleTextObjectClick = useCallback((event: any, textId: string) => {
        event.stopPropagation()
        setSelectedTextId(textId)
        setSelectedImageId(null)
        setIsDraggingText(true)
        setDraggingTextId(textId)
    }, [])

    const handleImageClick = useCallback((event: any, imageId: string) => {
        event.stopPropagation()
        setSelectedImageId(imageId)
        setSelectedTextId(null)
        setIsDraggingImage(true)
        setDraggingImageId(imageId)
    }, [])

    const handleMouseMove = useCallback((event: React.MouseEvent) => {
        if (!canvasRef.current) return

        const rect = canvasRef.current.getBoundingClientRect()

        // Handle text dragging
        if (isDraggingText && draggingTextId) {
            const position = mapScreenToModelPosition(
                event.clientX - rect.left,
                event.clientY - rect.top,
                rect
            )

            setTexts(prev => prev.map(text =>
                text.id === draggingTextId
                    ? { ...text, position }
                    : text
            ))
        }

        if (isDraggingImage && draggingImageId) {
            const position = mapScreenToModelPosition(
                event.clientX - rect.left,
                event.clientY - rect.top,
                rect
            )

            setImages(prev => prev.map(image =>
                image.id === draggingImageId
                    ? { ...image, position }
                    : image
            ))
        }
    }, [isDraggingText, draggingTextId, isDraggingImage, draggingImageId, mapScreenToModelPosition])

    const handleMouseUp = useCallback(() => {
        setIsDraggingText(false)
        setDraggingTextId(null)
        setIsDraggingImage(false)
        setDraggingImageId(null)
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

    const handleImageDoubleClick = useCallback((imageId: string) => {
        console.log('Image double clicked:', imageId)
    }, [])

    return (
        <div
            ref={canvasRef}
            className={`flex-1 bg-white flex items-center justify-center relative ${imagePlacementMode.isActive
                    ? 'cursor-crosshair'
                    : (isDraggingText || isDraggingImage)
                        ? 'cursor-grabbing'
                        : 'cursor-grab'
                }`}
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {imagePlacementMode.isActive && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-white rounded-sm"></div>
                        <span className="text-sm font-medium">Click on T-shirt to place image</span>
                    </div>
                    <div className="text-xs opacity-90 mt-1">
                        Press ESC to cancel
                    </div>
                </div>
            )}

            {selectedText?.isEditing && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-white border-2 border-blue-500 rounded-lg shadow-lg p-4 min-w-[300px]">
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

            {(selectedTextId || selectedImageId) && !selectedText?.isEditing && (
                <div className="absolute top-4 right-4 z-20 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[200px]">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        {selectedTextId ? 'Text Selected' : 'Image Selected'}
                    </h3>
                    <div className="text-xs text-gray-600 space-y-1">
                        {selectedTextId && (
                            <>
                                <div>Content: {selectedText?.content}</div>
                                <div>Font: {selectedText?.fontFamily}</div>
                                <div>Size: {selectedText?.fontSize}px</div>
                            </>
                        )}
                        {selectedImageId && (
                            <div>Image: {selectedImage?.url.split('/').pop()}</div>
                        )}
                        <div className="text-xs text-gray-400 mt-2">
                            Drag to move • Delete to remove
                        </div>
                    </div>
                </div>
            )}

            <ThreeCanvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <pointLight position={[-5, -5, 5]} intensity={0.5} />

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

                    {images.map((image) => (
                        <DecalObject
                            key={image.id}
                            url={image.url}
                            position={image.position}
                            scale={image.scale}
                            rotation={image.rotation}
                            isSelected={image.id === selectedImageId}
                            onPointerDown={(e: any) => handleImageClick(e, image.id)}
                            onDoubleClick={() => handleImageDoubleClick(image.id)}
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