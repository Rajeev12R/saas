"use client"
import type React from "react"
import { useState } from "react"

interface FontPickerProps {
  activeFontFamily: string
  onChange: (font: { family: string }) => void
}

const POPULAR_FONTS = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Georgia",
  "Courier New",
  "Verdana",
  "Trebuchet MS",
  "Impact",
  "Comic Sans MS",
  "Palatino",
  "Garamond",
  "Bookman",
  "Tahoma",
  "Lucida Console",
  "Monaco",
]

const FontPicker: React.FC<FontPickerProps> = ({ activeFontFamily, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleFontSelect = (fontFamily: string) => {
    onChange({ family: fontFamily })
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-background text-foreground border border-border rounded-md shadow-sm shadow-black/10 text-left flex items-center justify-between hover:bg-accent transition-colors"
      >
        <span style={{ fontFamily: activeFontFamily }}>{activeFontFamily}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {POPULAR_FONTS.map((font) => (
            <button
              key={font}
              onClick={() => handleFontSelect(font)}
              className={`w-full px-3 py-2 text-left hover:bg-accent transition-colors ${
                activeFontFamily === font ? "bg-accent" : ""
              }`}
              style={{ fontFamily: font }}
            >
              {font}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default FontPicker
