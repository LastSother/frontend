import React from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { FaHome, FaShoppingCart, FaBriefcase, FaTree } from 'react-icons/fa'

export default function MapView({ npcs, onSelect, weather }) {
  const bgClass = weather === 'rainy' ? 'bg-gray-300' : weather === 'stormy' ? 'bg-red-200' : 'bg-green-200'

  return (
    <TransformWrapper minScale={0.5} maxScale={3} initialScale={1}>
      <TransformComponent>
        <div className={`map ${bgClass} w-[2000px] h-[1000px]`}>
          {/* Locations */}
          <div className="location bg-blue-300 left-0 top-0 w-[200px] h-[200px]"><FaHome className="m-auto" /> Home</div>
          <div className="location bg-yellow-300 left-[200px] top-[200px] w-[200px] h-[200px]"><FaShoppingCart className="m-auto" /> Shop</div>
          <div className="location bg-purple-300 left-[400px] top-0 w-[200px] h-[200px]"><FaBriefcase className="m-auto" /> Work</div>
          <div className="location bg-green-300 left-[600px] top-[200px] w-[200px] h-[200px]"><FaTree className="m-auto" /> Park</div>
          <div className="location bg-red-300 left-0 top-[200px] w-[200px] h-[200px]">Mayor Office</div>
          {npcs.map(n => (
            <div key={n.id} className="npc" onClick={() => onSelect(n)} style={{ left: `${n.x}px`, top: `${n.y}px` }}>
              {n.name[0]}
              <div className="absolute bg-white p-1 text-xs hidden group-hover:block">
                Money: {n.state?.money} | Relations: {Object.entries(n.state?.relations || {}).map(([k,v]) => `${k}:${v}`).join(', ')}
              </div>
            </div>
          ))}
        </div>
      </TransformComponent>
    </TransformWrapper>
  )
}