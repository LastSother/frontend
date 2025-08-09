import React from 'react'
import { FaSun, FaCloudRain, FaBolt } from 'react-icons/fa'

export default function Weather({ current }) {
  const icons = {
    sunny: <FaSun className="text-yellow-500" />,
    rainy: <FaCloudRain className="text-blue-500" />,
    stormy: <FaBolt className="text-purple-500" />
  }

  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-lg">Погода:</span>
      {icons[current] || <FaSun />}
      <span className="capitalize">{current}</span>
    </div>
  )
}