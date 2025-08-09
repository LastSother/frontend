import React from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { FaHome, FaShoppingCart, FaBriefcase, FaTree, FaCity, FaCoffee, FaShieldAlt, FaNewspaper, FaCar, FaChalkboardTeacher, FaLaptopCode, FaUserMd, FaWrench, FaPaintBrush, FaStore, FaGraduationCap, FaBreadSlice, FaWalking, FaUser } from 'react-icons/fa'

export default function MapView({ npcs, onSelect, weather }) {
  const bgClass = weather === 'дождь' ? 'bg-gray-300' : weather === 'буря' ? 'bg-red-200' : 'bg-green-200'

  const getNpcIcon = (profession) => {
    if (profession.includes('Бариста')) return <FaCoffee className="text-brown-500" />
    if (profession.includes('Полицейский')) return <FaShieldAlt className="text-blue-500" />
    if (profession.includes('Журналист')) return <FaNewspaper className="text-yellow-500" />
    if (profession.includes('Таксист')) return <FaCar className="text-gray-500" />
    if (profession.includes('Учитель')) return <FaChalkboardTeacher className="text-purple-500" />
    if (profession.includes('Программист')) return <FaLaptopCode className="text-green-500" />
    if (profession.includes('Врач')) return <FaUserMd className="text-red-500" />
    if (profession.includes('Механик')) return <FaWrench className="text-orange-500" />
    if (profession.includes('Художник')) return <FaPaintBrush className="text-pink-500" />
    if (profession.includes('Продавец')) return <FaStore className="text-teal-500" />
    if (profession.includes('Студентка')) return <FaGraduationCap className="text-indigo-500" />
    if (profession.includes('Пекарь')) return <FaBreadSlice className="text-yellow-600" />
    if (profession.includes('Пенсионерка')) return <FaWalking className="text-gray-600" />
    return <FaUser className="text-city-blue" />
  }

  return (
    <TransformWrapper minScale={0.5} maxScale={3} initialScale={1}>
      <TransformComponent>
        <div className={`map ${bgClass} w-[1200px] h-[600px]`}>
          <div className="location bg-blue-300 left-0 top-0 w-[200px] h-[200px]">
            <FaHome className="text-2xl mr-2" /> Дом
          </div>
          <div className="location bg-yellow-300 left-[200px] top-[200px] w-[200px] h-[200px]">
            <FaShoppingCart className="text-2xl mr-2" /> Магазин
          </div>
          <div className="location bg-purple-300 left-[400px] top-0 w-[200px] h-[200px]">
            <FaBriefcase className="text-2xl mr-2" /> Работа
          </div>
          <div className="location bg-green-300 left-[600px] top-[200px] w-[200px] h-[200px]">
            <FaTree className="text-2xl mr-2" /> Парк
          </div>
          <div className="location bg-red-300 left-0 top-[200px] w-[200px] h-[200px]">
            <FaCity className="text-2xl mr-2" /> Мэрия
          </div>
          {npcs.length > 0 ? (
            npcs.map(n => (
              <div
                key={n.id}
                className="npc group relative"
                onClick={() => onSelect(n)}
                style={{ left: `${n.x}px`, top: `${n.y}px` }}
              >
                {getNpcIcon(n.profession)}
                <div className="npc-info">
                  <p><b>{n.name}</b> ({n.profession})</p>
                  <p>Деньги: {n.state?.money || 0} монет</p>
                  <p>Локация: {n.state?.location || 'Неизвестно'}</p>
                  <p>Отношения: {Object.entries(n.state?.relations || {}).map(([k, v]) => `${k}: ${v === 'friend' ? 'друг' : v === 'enemy' ? 'враг' : 'нейтрал'}`).join(', ') || 'Нет данных'}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-red-500">Нет данных о жителях</p>
          )}
        </div>
      </TransformComponent>
    </TransformWrapper>
  )
}
