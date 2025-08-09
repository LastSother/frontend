import React from 'react'
import { FaSun, FaCloudRain, FaBolt } from 'react-icons/fa'

export default function Weather({ current }) {
  const icons = {
    'солнечно': <FaSun className="text-yellow-500 text-2xl" />,
    'дождь': <FaCloudRain className="text-blue-500 text-2xl" />,
    'буря': <FaBolt className="text-purple-500 text-2xl" />
  }

  return (
    <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow">
      <span className="text-lg font-semibold">Погода:</span>
      {icons[current] || <FaSun />}
      <span className="capitalize">{current}</span>
    </div>
  )
}
