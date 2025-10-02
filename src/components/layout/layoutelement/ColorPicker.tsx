'use client'
import React, { useState, useEffect, useRef } from 'react'
import { HexColorPicker } from 'react-colorful'

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

function normalizeHex(input: string): string | null {
  if (!input) return null
  let s = input.trim().toLowerCase()
  if (s.startsWith('#')) s = s.slice(1)
  if (!/^[0-9a-f]{3}$|^[0-9a-f]{6}$/.test(s)) return null
  if (s.length === 3) {
    s = s.split('').map((c) => c + c).join('')
  }
  return `#${s}`
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [localColor, setLocalColor] = useState<string>(() => normalizeHex(color) ?? color)
  const [inputValue, setInputValue] = useState<string>(() => normalizeHex(color) ?? color)
  const popoverRef = useRef<HTMLDivElement | null>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const norm = normalizeHex(color)
    if (norm) {
      setLocalColor(norm)
      setInputValue(norm)
    } else {
      setInputValue(color)
    }
  }, [color])

  useEffect(() => {
    if (!isOpen) return
    const onDocClick = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        rootRef.current &&
        !rootRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [isOpen])

  const handlePickerChange = (newColor: string) => {
    const norm = normalizeHex(newColor) ?? newColor
    setLocalColor(norm)
    setInputValue(norm)
    onChange(norm)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setInputValue(v)
    const norm = normalizeHex(v)
    if (norm) {
      setLocalColor(norm)
      onChange(norm)
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const norm = normalizeHex(inputValue)
      if (norm) {
        setLocalColor(norm)
        setInputValue(norm)
        onChange(norm)
        setIsOpen(false)
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div ref={rootRef} title='Pick Color' className="relative inline-flex items-center gap-2">
      <button
        type="button"
        aria-label="Open color picker"
        onClick={() => setIsOpen((s) => !s)}
        className="w-7 h-7 rounded-lg border-2 border-gray-200 shadow-sm"
        style={{ backgroundColor: localColor }}
      />

      <input
        aria-label="Hex color"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder="#aabbcc"
        className="w-14 text-sm py-1 border-none outline-none rounded"
      />

      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute z-50 top-10 left-0 p-3 bg-white rounded shadow-lg"
        >
          <HexColorPicker color={localColor} onChange={handlePickerChange} />
        </div>
      )}
    </div>
  )
}

export default ColorPicker
