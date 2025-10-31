/* eslint-disable no-restricted-globals */
import React, { createContext, useContext, useEffect, useState } from 'react'

type Font = (typeof fonts)[number]
const fonts = ['font-inter', 'font-manrope', 'font-system'] as const

interface FontContextType {
  font: Font
  setFont: (font: Font) => void
}

const FontContext = createContext<FontContextType | undefined>(undefined)

export const FontProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [font, _setFont] = useState<Font>(() => {
    const savedFont = localStorage.getItem('font')
    return fonts.includes(savedFont as Font) ? (savedFont as Font) : fonts[0]
  })

  useEffect(() => {
    const applyFont = (font: string) => {
      const root = document.documentElement

      root.classList.forEach((cls) => {
        if (cls.startsWith('font-')) root.classList.remove(cls)
      })

      root.classList.add(`${font}`)
    }

    applyFont(font)
  }, [font])

  const setFont = (font: Font) => {
    localStorage.setItem('font', font)
    _setFont(font)
  }

  return <FontContext value={{ font, setFont }}>{children}</FontContext>
}

export const useFont = () => {
  const context = useContext(FontContext)
  if (!context) {
    throw new Error('useFont must be used within a FontProvider')
  }
  return context
}
