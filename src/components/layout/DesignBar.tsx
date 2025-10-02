"use client"
import React, { useState } from 'react'
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineTextFormat,
  MdOutlineAirplay,
  MdOutlineShare,
  MdOutlineHome,
  MdOutlineDashboardCustomize
} from "react-icons/md"
import ColorPicker from './layoutelement/ColorPicker'
import FontPicker from './layoutelement/FontPicker'

const DesignBar = () => {
  const [color, setColor] = useState('#aabbcc')
  const [fontSize, setFontSize] = useState(16)
  const [fontFamily, setFontFamily] = useState('Open Sans')

  const handleAddText = () => {
    const event = new CustomEvent('activateTextMode', { 
      detail: { 
        fontSize, 
        fontFamily, 
        color 
      } 
    })
    window.dispatchEvent(event)
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
          <button
            title="Add Text"
            onClick={handleAddText}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all shadow-sm"
          >
            <MdOutlineTextFormat size={24} className="text-gray-700" />
          </button>

          <div className="relative" title='Font Size'>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="appearance-none font-medium text-gray-800 py-1.5 pl-3 pr-8 rounded-lg border border-gray-300 bg-white shadow-sm hover:border-gray-400 cursor-pointer text-sm"
            >
              {[8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <MdOutlineKeyboardArrowDown
              size={18}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
            />
          </div>

          <FontPicker
            activeFontFamily={fontFamily}
            onChange={(font) => setFontFamily(font.family)}
          />
          <ColorPicker color={color} onChange={setColor} />
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
          <button
            title="Export"
            className="flex items-center gap-1.5 py-1.5 px-4 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-all shadow-sm"
          >
            <span className="hidden sm:inline">Export</span>
            <MdOutlineKeyboardArrowDown size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default DesignBar