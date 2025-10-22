"use client"
import React, { useState, useRef } from "react"
import { MdOutlineImage, MdDelete, MdDragIndicator } from "react-icons/md"
import TShirtPreview from '../designboard/TShirtPreview';

// Define available textures
const TEXTURE_OPTIONS = [
  { id: 'default', name: 'Plain', path: '', color: '#ffffff' },
  { id: 'wool', name: 'Wool', path: '/models/textures/Material.001_normal.png', color: '#94a3b8' },
  { id: 'cotton', name: 'Metallic', path: '/models/textures/Material.001_metallicRoughness.png', color: '#f8fafc' },
  { id: 'denim', name: 'Solid', path: '/models/textures/Material.001_baseColor.png', color: '#1e40af' },
]

const Sidebar = () => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleTextureSelect = (texturePath: string) => {
    const event = new CustomEvent('modelTextureChange', { 
      detail: { texture: texturePath } 
    })
    window.dispatchEvent(event)
  }

  const handleTextPlacement = (position: [number, number], area: 'front' | 'back') => {
    // Activate text mode with the specified position
    const event = new CustomEvent('activateTextModeWithPosition', { 
      detail: { 
        position,
        area
      } 
    });
    window.dispatchEvent(event);
  };

  const handleAddText = () => {
    // Activate text mode without specific position
    const event = new CustomEvent('activateTextMode', { 
      detail: { 
        fontSize: 24,
        fontFamily: 'Arial',
        color: '#000000'
      } 
    });
    window.dispatchEvent(event);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setUploadedImages(prev => [...prev, url])
      
      // Activate placement mode with this image
      const event = new CustomEvent('activateImagePlacement', { 
        detail: { imageUrl: url } 
      })
      window.dispatchEvent(event)
    }
  }

  const handleRemoveImage = (imageUrl: string, event: React.MouseEvent) => {
    event.stopPropagation()
    setUploadedImages(prev => prev.filter(img => img !== imageUrl))
    
    // Remove from canvas if placed
    const removeEvent = new CustomEvent('removeImage', { 
      detail: { imageUrl } 
    })
    window.dispatchEvent(removeEvent)
  }

  const handleImageClick = (imageUrl: string) => {
    // Activate placement mode with this image
    const event = new CustomEvent('activateImagePlacement', { 
      detail: { imageUrl } 
    })
    window.dispatchEvent(event)
  }

  const handleHotspotPlacement = (hotspotId: string) => {
    const hotspots = {
      'center-chest': [0, 0.5, 0.01],
      'left-chest': [-0.3, 0.5, 0.01],
      'right-chest': [0.3, 0.5, 0.01],
      'center-back': [0, 0.5, -0.01]
    }
    
    const position = hotspots[hotspotId as keyof typeof hotspots] as [number, number, number]
    const event = new CustomEvent('placeImageAtHotspot', { 
      detail: { position } 
    })
    window.dispatchEvent(event)
  }

  return (
    <div className="left w-96 h-full bg-white flex flex-col gap-8 p-6 border-r border-gray-200 shadow-sm overflow-y-auto">
      {/* T-Shirt Preview Section - Now takes more space */}
      <div className="flex-grow-0">
        <TShirtPreview 
          onTextPlacement={handleTextPlacement}
          onAddText={handleAddText}
        />
      </div>
      
      {/* Textures Section */}
      <div className="flex-shrink-0">
        <h3 className="text-sm font-semibold text-gray-500 mb-3 tracking-wide uppercase">
          Fabric Textures
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {TEXTURE_OPTIONS.map((texture) => (
            <button
              key={texture.id}
              onClick={() => handleTextureSelect(texture.path)}
              className="flex flex-col items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
              title={texture.name}
            >
              <div 
                className="w-14 h-14 rounded-lg border border-gray-300 shadow-sm"
                style={{ backgroundColor: texture.color }}
              />
              <span className="text-xs text-gray-700 font-medium">{texture.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="flex-shrink-0">
        <h3 className="text-sm font-semibold text-gray-500 mb-3 tracking-wide uppercase">
          Add Image
        </h3>
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition mb-4">
          <MdOutlineImage size={32} className="text-gray-500 mb-2" />
          <span className="text-sm text-gray-600 font-medium">Upload Image</span>
          <span className="text-xs text-gray-500 mt-1">PNG, JPG, SVG up to 10MB</span>
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleImageUpload}
          />
        </label>

        {/* Quick Placement Hotspots */}
        <div className="mb-4">
          <h4 className="text-xs font-medium text-gray-500 mb-2">Quick Placement</h4>
          <div className="flex flex-wrap gap-2">
            {['center-chest', 'left-chest', 'right-chest', 'center-back'].map((hotspot) => (
              <button
                key={hotspot}
                onClick={() => handleHotspotPlacement(hotspot)}
                className="text-xs px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg capitalize font-medium transition-colors"
              >
                {hotspot.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Uploaded Images Preview */}
        {uploadedImages.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-500 mb-2">Your Images</h4>
            <div className="space-y-3">
              {uploadedImages.map((imageUrl, index) => (
                <div 
                  key={index}
                  className="relative group cursor-pointer border-2 border-gray-200 rounded-xl p-3 hover:border-blue-500 transition-colors bg-white shadow-sm"
                  onClick={() => handleImageClick(imageUrl)}
                >
                  <div className="flex items-center gap-3">
                    <MdDragIndicator className="text-gray-400 flex-shrink-0" size={20} />
                    <img 
                      src={imageUrl} 
                      alt={`Upload ${index + 1}`}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-700 block truncate">
                        Image {index + 1}
                      </span>
                      <span className="text-xs text-gray-500">
                        Click to place on T-shirt
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleRemoveImage(imageUrl, e)}
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-100 rounded-lg transition-all"
                      title="Remove image"
                    >
                      <MdDelete size={18} className="text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar