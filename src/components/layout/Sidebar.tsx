"use client"
import React from "react"
import { MdOutlineImage } from "react-icons/md"

const Sidebar = () => {
  return (
    <div className="left w-64 h-full bg-white flex flex-col gap-8 p-6 border-r border-gray-200 shadow-sm">
      <div>
        <h3 className="text-sm font-semibold text-gray-500 mb-3 tracking-wide uppercase">
          Textures
        </h3>
        <div className="flex items-center gap-3 flex-wrap">
          {["#f87171", "#60a5fa", "#34d399", "#fbbf24"].map((color, idx) => (
            <button
              key={idx}
              className="w-10 h-10 rounded-lg shadow-sm hover:scale-105 transition-transform border border-gray-200"
              style={{ backgroundColor: color }}
              title={`Texture ${idx + 1}`}
            />
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
