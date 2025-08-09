import React from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { FaHome, FaShoppingCart, FaBriefcase, FaTree, FaBuilding } from 'react-icons/fa'

export default function MapView({ npcs, onSelect, weather }) {
  const bgClass = weather === 'дождь' ? 'bg-gray-300' : weather === 'буря' ? 'bg-red-200' : 'bg-green-200'

  return (
    <TransformWrapper minScale={0.5} maxScale={3} initialScale={1}>
      <TransformComponent>
        <div className={`map ${bgClass} w-[1200px] h-[600px]`}>
          <div className="location bg-blue-300 left-0 top-0 w-[200px] h-[200px] flex items-center justify-center">
            <FaHome className="text-2xl mr-2" /> Дом
          </div>
          <div className="location bg-yellow-300 left-[200px] top-[200px] w-[200px] h-[200px] flex items-center justify-center">
            <FaShoppingCart className="text-2xl mr-2" /> Магазин
          </div>
          <div className="location bg-purple-300 left-[400px] top-0 w-[200px] h-[200px] flex items-center justify-center">
            <FaBriefcase className="text-2xl mr-2" /> Работа
          </div>
          <div className="location bg-green-300 left-[600px] top-[200px] w-[200px] h-[200px] flex items-center justify-center">
            <FaTree className="text-2xl mr-2" /> Парк
          </div>
          <div className="location bg-red-300 left-0 top-[200px] w-[200px] h-[200px] flex items-center justify-center">
            <FaBuilding className="text-2xl mr-2" /> Мэрия
          </div>
          {npcs.map(n => (
            <div
              key={n.id}
              className="npc group"
              onClick={() => onSelect(n)}
              style={{ left: `${n.x}px`, top: `${n.y}px` }}
            >
              <FaHome className="text-city-blue" />
              <div className="absolute bg-white p-2 text-xs rounded shadow-lg hidden group-hover:block z-10">
                <p><b>{n.name}</b> ({n.profession})</p>
                <p>Деньги: {n.state?.money} монет</p>
                <p>Локация: {n.state?.location === 'home' ? 'Дом' : n.state?.location === 'shop' ? 'Магазин' : n.state?.location === 'work' ? 'Работа' : n.state?.location === 'park' ? 'Парк' : 'Мэрия'}</p>
                <p>Отношения: {Object.entries(n.state?.relations || {}).map(([k, v]) => `${k}: ${v === 'friend' ? 'друг' : v === 'enemy' ? 'враг' : 'нейтрал'}`).join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
      </TransformComponent>
    </TransformWrapper>
  )
}
