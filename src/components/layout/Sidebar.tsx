"use client"
import React from "react"
import { MdOutlineImage } from "react-icons/md"

const Sidebar = () => {
  const handleTextureSelect = (textureUrl: string) => {
    const event = new CustomEvent('modelTextureChange', { 
      detail: { texture: textureUrl } 
    })
    window.dispatchEvent(event)
  }

  const handleRemoveTexture = () => {
    const event = new CustomEvent('modelTextureChange', { 
      detail: { texture: '' } 
    })
    window.dispatchEvent(event)
  }

  return (
    <div className="left w-64 h-full bg-white flex flex-col gap-8 p-6 border-r border-gray-200 shadow-sm">
      <div>
        <h3 className="text-sm font-semibold text-gray-500 mb-3 tracking-wide uppercase">
          Textures
        </h3>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleRemoveTexture}
            className="w-10 h-10 rounded-lg shadow-sm hover:scale-105 transition-transform border border-gray-200 bg-white flex items-center justify-center"
            title="No Texture"
          >
            <span className="text-xs text-gray-500">X</span>
          </button>
          {[
            "/models/textures/Material.001_baseColor.png",
            "/models/textures/Material.001_metallicRoughness.png", 
            "/models/textures/Material.001_normal.png",
          ].map((textureUrl, idx) => (
            <button
              key={idx}
              onClick={() => handleTextureSelect(textureUrl)}
              className="w-10 h-10 rounded-lg shadow-sm hover:scale-105 transition-transform border border-gray-200 bg-gray-200"
              title={`Texture ${idx + 1}`}
            >
              <div className="w-full h-full rounded-lg bg-gradient-to-br from-gray-300 to-gray-500" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-500 mb-3 tracking-wide uppercase">
          Add Image
        </h3>
        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition">
          <MdOutlineImage size={28} className="text-gray-500 mb-1" />
          <span className="text-xs text-gray-600">Upload Image</span>
          <input type="file" accept="image/*" className="hidden" />
        </label>
      </div>
    </div>
  )
}

export default Sidebar