"use client"
import React, { useState, useRef } from "react"
import { MdOutlineImage, MdDelete, MdDragIndicator } from "react-icons/md"

// Define available textures
const TEXTURE_OPTIONS = [
  { id: 'default', name: 'Default Fabric', path: '/models/textures/Material.001_normal.png', color: '#94a3b8' },
  { id: 'cotton', name: 'Mettalic', path: '/models/textures/Material.001_metallicRoughness.png', color: '#f8fafc' },
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
    <div className="left w-64 h-full bg-white flex flex-col gap-8 p-6 border-r border-gray-200 shadow-sm overflow-y-auto">
      
      {/* Textures Section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 mb-3 tracking-wide uppercase">
          Fabric Textures
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {TEXTURE_OPTIONS.map((texture) => (
            <button
              key={texture.id}
              onClick={() => handleTextureSelect(texture.path)}
              className="flex flex-col items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
              title={texture.name}
            >
              <div 
                className="w-12 h-12 rounded-lg border border-gray-300 shadow-sm"
                style={{ backgroundColor: texture.color }}
              />
              <span className="text-xs text-gray-700 font-medium">{texture.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Image Upload Section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 mb-3 tracking-wide uppercase">
          Add Image
        </h3>
        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition mb-4">
          <MdOutlineImage size={28} className="text-gray-500 mb-1" />
          <span className="text-xs text-gray-600">Upload Image</span>
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
          <div className="flex flex-wrap gap-1">
            {['center-chest', 'left-chest', 'right-chest', 'center-back'].map((hotspot) => (
              <button
                key={hotspot}
                onClick={() => handleHotspotPlacement(hotspot)}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded capitalize"
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
            <div className="space-y-2">
              {uploadedImages.map((imageUrl, index) => (
                <div 
                  key={index}
                  className="relative group cursor-pointer border rounded-lg p-2 hover:border-blue-500 transition-colors"
                  onClick={() => handleImageClick(imageUrl)}
                >
                  <div className="flex items-center gap-2">
                    <MdDragIndicator className="text-gray-400 flex-shrink-0" />
                    <img 
                      src={imageUrl} 
                      alt={`Upload ${index + 1}`}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <span className="text-xs text-gray-600 flex-1 truncate">
                      Image {index + 1}
                    </span>
                    <button
                      onClick={(e) => handleRemoveImage(imageUrl, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                    >
                      <MdDelete size={14} className="text-red-500" />
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