// src/components/designboard/Canvas.tsx
"use client"
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Canvas as ThreeCanvas, useThree } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'
import * as THREE from 'three'
import Object from './Object'
import DecalObject from './DecalObject'

interface TextConfig {
    id: string;
    content: string;
    fontSize: number;
    fontFamily: string;
    color: string;
    position: [number, number]; // UV coordinates [u, v]
    rotation: number;
    scale: number;
    isEditing?: boolean;
    area: 'front' | 'back';
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

// Dynamic Texture Component - FIXED VERSION
const DynamicTextureTshirt: React.FC<{
    baseColor: string;
    baseTextureUrl: string;
    texts: TextConfig[];
    onTextureUpdate: (texture: THREE.Texture) => void;
}> = ({ baseColor, baseTextureUrl, texts, onTextureUpdate }) => {
    const { gl } = useThree();
    const [baseTexture, setBaseTexture] = useState<THREE.Texture | null>(null);
    const [dynamicTexture, setDynamicTexture] = useState<THREE.CanvasTexture | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);

    const TEXTURE_WIDTH = 1024;
    const TEXTURE_HEIGHT = 1024;

    // Initialize canvas and context
    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = TEXTURE_WIDTH;
        canvas.height = TEXTURE_HEIGHT;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            contextRef.current = ctx;
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.colorSpace = THREE.SRGBColorSpace;
        setDynamicTexture(texture);
        onTextureUpdate(texture);
    }, [onTextureUpdate]);

    // Load base texture
    useEffect(() => {
        if (!baseTextureUrl) {
            setBaseTexture(null);
            return;
        }

        const loader = new THREE.TextureLoader();
        loader.load(
            baseTextureUrl,
            (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                setBaseTexture(texture);
            },
            undefined,
            (error) => {
                console.error('Failed to load base texture:', error);
                setBaseTexture(null);
            }
        );
    }, [baseTextureUrl]);

    // Render texture - FIXED to ensure text appears immediately
    useEffect(() => {
        const ctx = contextRef.current;
        if (!ctx || !dynamicTexture) return;

        // Clear canvas with base color
        ctx.clearRect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);

        // Draw base texture if available
        if (baseTexture?.image) {
            ctx.globalAlpha = 1.0;
            ctx.drawImage(baseTexture.image, 0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);
        }

        // Draw all texts - FIXED: Ensure text rendering works properly
        texts.forEach(text => {
            if (!text.content.trim()) return;

            ctx.save();

            // Set font properties
            const effectiveFontSize = Math.max(12, text.fontSize * text.scale);
            ctx.font = `bold ${effectiveFontSize}px ${text.fontFamily}`;
            ctx.fillStyle = text.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Convert UV coordinates to canvas coordinates
            const canvasX = text.position[0] * TEXTURE_WIDTH;
            const canvasY = text.position[1] * TEXTURE_HEIGHT;

            ctx.translate(canvasX, canvasY);
            ctx.rotate(text.rotation);
            
            // Add text outline for better visibility
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = Math.max(2, effectiveFontSize * 0.1);
            ctx.strokeText(text.content, 0, 0);

            // Draw main text
            ctx.fillText(text.content, 0, 0);

            ctx.restore();
        });

        // Force texture update
        dynamicTexture.needsUpdate = true;
    }, [baseColor, baseTexture, texts, dynamicTexture]);

    return null;
};

const Canvas = () => {
    const [texts, setTexts] = useState<TextConfig[]>([]);
    const [isTextMode, setIsTextMode] = useState(false);
    const [textModeConfig, setTextModeConfig] = useState<TextModeConfig>({
        fontSize: 24,
        fontFamily: 'Arial',
        color: '#000000'
    });
    const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
    const [modelConfig, setModelConfig] = useState<ModelConfig>({
        color: '#ffffff',
        texture: ''
    });
    const [images, setImages] = useState<ImageConfig[]>([]);
    const [imagePlacementMode, setImagePlacementMode] = useState<ImagePlacementMode>({
        isActive: false,
        imageUrl: null
    });
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
    const [dynamicTexture, setDynamicTexture] = useState<THREE.Texture | null>(null);

    const canvasRef = useRef<HTMLDivElement>(null);
    const tshirtRef = useRef<THREE.Group>(null);

    const selectedText = texts.find(text => text.id === selectedTextId);
    const selectedImage = images.find(image => image.id === selectedImageId);

    // Handle texture updates
    const handleTextureUpdate = useCallback((texture: THREE.Texture) => {
        setDynamicTexture(texture);
    }, []);

    // Event listeners - FIXED: Proper text placement
    useEffect(() => {
        const handleActivateTextMode = (event: CustomEvent<TextModeConfig>) => {
            setIsTextMode(true);
            setTextModeConfig(event.detail);
            console.log('Text mode activated - use preview to place text');
        };

        const handleActivateTextModeWithPosition = (event: CustomEvent<{
            position: [number, number];
            area: 'front' | 'back';
        }>) => {
            const newText: TextConfig = {
                id: `text-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                content: 'Your Text Here',
                fontSize: textModeConfig.fontSize,
                fontFamily: textModeConfig.fontFamily,
                color: textModeConfig.color,
                position: event.detail.position,
                rotation: 0,
                scale: 1,
                isEditing: true,
                area: event.detail.area
            };

            console.log('Creating new text:', newText);
            setTexts(prev => [...prev, newText]);
            setSelectedTextId(newText.id);
            setIsTextMode(false);
        };

        const handleModelColorChange = (event: CustomEvent<{ color: string }>) => {
            setModelConfig(prev => ({ ...prev, color: event.detail.color }));
        };

        const handleModelTextureChange = (event: CustomEvent<{ texture: string }>) => {
            setModelConfig(prev => ({ ...prev, texture: event.detail.texture }));
        };

        const handleActivateImagePlacement = (event: CustomEvent<{ imageUrl: string }>) => {
            setImagePlacementMode({
                isActive: true,
                imageUrl: event.detail.imageUrl
            });
        };

        const handleUpdateSelectedText = (event: CustomEvent<Partial<TextModeConfig>>) => {
            if (!selectedTextId) return;
            setTexts(prev => prev.map(text =>
                text.id === selectedTextId
                    ? { ...text, ...event.detail }
                    : text
            ));
        };

        const handleTextTransform = (event: CustomEvent<{
            scale?: number;
            rotation?: number;
        }>) => {
            if (!selectedTextId) return;
            setTexts(prev => prev.map(text =>
                text.id === selectedTextId
                    ? {
                        ...text,
                        scale: event.detail.scale ?? text.scale,
                        rotation: event.detail.rotation ?? text.rotation
                    }
                    : text
            ));
        };

        // Add all event listeners
        const listeners = [
            { event: 'activateTextMode', handler: handleActivateTextMode },
            { event: 'activateTextModeWithPosition', handler: handleActivateTextModeWithPosition },
            { event: 'modelColorChange', handler: handleModelColorChange },
            { event: 'modelTextureChange', handler: handleModelTextureChange },
            { event: 'activateImagePlacement', handler: handleActivateImagePlacement },
            { event: 'updateSelectedText', handler: handleUpdateSelectedText },
            { event: 'textTransform', handler: handleTextTransform },
        ];

        listeners.forEach(({ event, handler }) => {
            window.addEventListener(event, handler as EventListener);
        });

        return () => {
            listeners.forEach(({ event, handler }) => {
                window.removeEventListener(event, handler as EventListener);
            });
        };
    }, [selectedTextId, textModeConfig]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement;
            const isInputField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

            if (event.key === 'Escape') {
                if (imagePlacementMode.isActive) {
                    setImagePlacementMode({ isActive: false, imageUrl: null });
                }
                if (selectedText?.isEditing) {
                    setTexts(prev => prev.map(text =>
                        text.id === selectedTextId
                            ? { ...text, isEditing: false }
                            : text
                    ));
                }
                setSelectedTextId(null);
                setSelectedImageId(null);
            }

            if ((event.key === 'Delete' || event.key === 'Backspace') && !isInputField) {
                if (selectedTextId && !selectedText?.isEditing) {
                    setTexts(prev => prev.filter(text => text.id !== selectedTextId));
                    setSelectedTextId(null);
                    event.preventDefault();
                }
                if (selectedImageId) {
                    setImages(prev => prev.filter(image => image.id !== selectedImageId));
                    setSelectedImageId(null);
                    event.preventDefault();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedTextId, selectedImageId, imagePlacementMode, selectedText]);

    const handleCanvasClick = useCallback((event: React.MouseEvent) => {
        if (selectedText?.isEditing) return;

        if (!selectedTextId) {
            setSelectedImageId(null);
        }
    }, [selectedText, selectedTextId]);

    const handleTextDoubleClick = useCallback((textId: string) => {
        setTexts(prev => prev.map(text =>
            text.id === textId
                ? { ...text, isEditing: true }
                : text
        ));
    }, []);

    const handleTextContentChange = useCallback((textId: string, newContent: string) => {
        setTexts(prev => prev.map(text =>
            text.id === textId
                ? { ...text, content: newContent, isEditing: false }
                : text
        ));
        setSelectedTextId(textId);
    }, []);

    const handleImageClick = useCallback((event: any, imageId: string) => {
        event.stopPropagation();
        setSelectedImageId(imageId);
        setSelectedTextId(null);
    }, []);

    // Close text editing when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectedText?.isEditing && canvasRef.current && !canvasRef.current.contains(event.target as Node)) {
                selectedTextId && handleTextContentChange(selectedTextId, selectedText.content);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [selectedText, selectedTextId, handleTextContentChange]);

    return (
        <div
            ref={canvasRef}
            className={`flex-1 bg-gray-50 flex items-center justify-center relative ${
                imagePlacementMode.isActive ? 'cursor-crosshair' : 'cursor-default'
            }`}
            onClick={handleCanvasClick}
        >
            {/* Placement Mode Indicator */}
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

            {/* Text Selected Indicator */}
            {selectedTextId && !selectedText?.isEditing && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-white rounded-sm"></div>
                        <span className="text-sm font-medium">
                            Text selected on {selectedText?.area} - Double-click to edit
                        </span>
                    </div>
                </div>
            )}

            {/* Text Editing Overlay */}
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
                            e.stopPropagation();
                            if (e.key === 'Enter') {
                                selectedTextId && handleTextContentChange(selectedTextId, selectedText.content);
                            } else if (e.key === 'Escape') {
                                setTexts(prev => prev.map(text =>
                                    text.id === selectedTextId
                                        ? { ...text, isEditing: false }
                                        : text
                                ));
                            }
                        }}
                        onBlur={() => selectedTextId && handleTextContentChange(selectedTextId, selectedText.content)}
                        onFocus={(e) => e.target.select()}
                        className="w-full border-none outline-none text-lg p-2 bg-transparent"
                        autoFocus
                        style={{
                            fontSize: `${selectedText.fontSize}px`,
                            fontFamily: selectedText.fontFamily,
                            color: selectedText.color
                        }}
                        placeholder="Enter your text here..."
                    />
                    <div className="text-xs text-gray-500 mt-2">
                        Press Enter to finish editing • Escape to cancel
                    </div>
                </div>
            )}

            {/* Instructions for new users */}
            {texts.length === 0 && !imagePlacementMode.isActive && (
                <div className="absolute top-4 left-4 z-20 bg-white border border-blue-200 rounded-lg shadow-lg p-4 max-w-xs">
                    <h3 className="text-sm font-semibold text-blue-700 mb-2">How to Add Text</h3>
                    <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                        <li>Click "Add Text" in the design bar</li>
                        <li>Use the T-shirt preview in sidebar to position text</li>
                        <li>Customize text properties in the design bar</li>
                        <li>Rotate the 3D view to see your design</li>
                    </ol>
                </div>
            )}

            {/* 3D Canvas */}
            <ThreeCanvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 5, 5]} intensity={0.8} />
                <pointLight position={[-5, -5, 5]} intensity={0.4} />

                <Stage environment="city" intensity={0.6}>
                    <group ref={tshirtRef}>
                        <Object
                            color={modelConfig.color}
                            textureUrl={modelConfig.texture}
                            dynamicTexture={dynamicTexture}
                        />
                    </group>

                    {/* Dynamic Texture Component */}
                    <DynamicTextureTshirt
                        baseColor={modelConfig.color}
                        baseTextureUrl={modelConfig.texture}
                        texts={texts}
                        onTextureUpdate={handleTextureUpdate}
                    />

                    {/* Images as Decals */}
                    {images.map((image) => (
                        <DecalObject
                            key={image.id}
                            url={image.url}
                            position={image.position}
                            scale={image.scale}
                            rotation={image.rotation}
                            isSelected={image.id === selectedImageId}
                            onPointerDown={(e: any) => handleImageClick(e, image.id)}
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
    );
};

export default Canvas;