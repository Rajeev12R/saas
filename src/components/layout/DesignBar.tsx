// src/components/layout/DesignBar.tsx
"use client"
import React, { useState, useEffect } from 'react'
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineTextFormat,
  MdOutlineAirplay,
  MdOutlineShare,
  MdOutlineHome,
  MdOutlineDashboardCustomize,
  MdOutlineTransform
} from "react-icons/md"
import ColorPicker from './layoutelement/ColorPicker'
import FontPicker from './layoutelement/FontPicker'

const DesignBar = () => {
  const [textColor, setTextColor] = useState('#000000')
  const [fontSize, setFontSize] = useState(24)
  const [fontFamily, setFontFamily] = useState('Arial')
  const [modelColor, setModelColor] = useState('#ffffff')
  const [textScale, setTextScale] = useState(1)
  const [textRotation, setTextRotation] = useState(0)

  useEffect(() => {
    const event = new CustomEvent('updateSelectedText', { 
      detail: { 
        fontSize, 
        fontFamily, 
        color: textColor 
      } 
    })
    window.dispatchEvent(event)
  }, [fontSize, fontFamily, textColor])

  const handleModelColorChange = (newColor: string) => {
    setModelColor(newColor)
    const event = new CustomEvent('modelColorChange', { 
      detail: { color: newColor } 
    })
    window.dispatchEvent(event)
  }

  const handleTextTransform = (transform: { scale?: number; rotation?: number }) => {
    const event = new CustomEvent('textTransform', { 
      detail: transform 
    })
    window.dispatchEvent(event)

    if (transform.scale !== undefined) {
      setTextScale(transform.scale)
    }
    if (transform.rotation !== undefined) {
      setTextRotation(transform.rotation)
    }
  }

  return (
    <div className="w-full shadow-md shadow-black/5 border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14 md:h-16 px-3 md:px-6">
        
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            title="Home"
            className="p-2 rounded-lg hover:bg-gray-100 transition-all shadow-sm"
          >
            <MdOutlineHome size={24} className="text-gray-700" />
          </button>
          <button
            title="Dashboard"
            className="p-2 rounded-lg hover:bg-gray-100 transition-all shadow-sm"
          >
            <MdOutlineDashboardCustomize size={24} className="text-gray-700" />
          </button>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Text Controls Section */}
          <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
            <span className="text-sm text-gray-600 font-medium">Text:</span>
            
            {/* Font Size */}
            <div className="relative" title='Font Size'>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="appearance-none font-medium text-gray-800 py-1.5 pl-3 pr-8 rounded-lg border border-gray-300 bg-white shadow-sm hover:border-gray-400 cursor-pointer text-sm"
              >
                {[12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              <MdOutlineKeyboardArrowDown
                size={18}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
              />
            </div>

            {/* Font Family */}
            <FontPicker
              activeFontFamily={fontFamily}
              onChange={(font) => setFontFamily(font.family)}
            />
            
            {/* Text Color */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Color:</span>
              <ColorPicker color={textColor} onChange={setTextColor} />
            </div>

            {/* Text Scale */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Scale:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleTextTransform({ scale: Math.max(0.1, textScale - 0.1) })}
                  className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200 text-sm"
                >
                  -
                </button>
                <span className="text-xs w-8 text-center">{textScale.toFixed(1)}</span>
                <button
                  onClick={() => handleTextTransform({ scale: Math.min(3, textScale + 0.1) })}
                  className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200 text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Text Rotation */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Rotate:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleTextTransform({ rotation: textRotation - 0.1 })}
                  className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200 text-sm"
                >
                  ↶
                </button>
                <span className="text-xs w-8 text-center">
                  {Math.round(textRotation * 180 / Math.PI)}°
                </span>
                <button
                  onClick={() => handleTextTransform({ rotation: textRotation + 0.1 })}
                  className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200 text-sm"
                >
                  ↷
                </button>
              </div>
            </div>
          </div>

          {/* Model Controls */}
          <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
            <span className="text-sm text-gray-600 font-medium">Model:</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Color:</span>
              <ColorPicker color={modelColor} onChange={handleModelColorChange} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            title="Share"
            className="flex items-center gap-1.5 py-1.5 px-4 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-all shadow-sm"
          >
            <span className="hidden sm:inline">Share</span>
            <MdOutlineShare size={18} />
          </button>
          <button
            title="Present"
            className="flex items-center gap-1.5 py-1.5 px-4 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-all shadow-sm"
          >
            <span className="hidden sm:inline">Present</span>
            <MdOutlineAirplay size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default DesignBar