import React, { useEffect, useState, useRef } from 'react'
import MapView from './components/MapView'
import ChatWindow from './components/ChatWindow'
import NewsFeed from './components/NewsFeed'
import Weather from './components/Weather'
import MayorPanel from './components/MayorPanel'
import { toast } from 'react-toastify'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function App() {
  const [npcs, setNpcs] = useState([])
  const [selected, setSelected] = useState(null)
  const [weather, setWeather] = useState('солнечно')
  const [isMayor, setIsMayor] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const wsRef = useRef(null)

  useEffect(() => {
    fetch(BACKEND + '/map').then(r => r.json()).then(setNpcs)
    fetch(BACKEND + '/weather').then(r => r.json()).then(w => setWeather(w.current || 'солнечно'))
    const ws = new WebSocket((BACKEND.replace('http', 'ws')) + '/ws/map')
    ws.onopen = () => console.log('WebSocket карты открыт')
    ws.onmessage = (evt) => {
      try {
        const m = JSON.parse(evt.data)
        if (m.type === 'map_update') {
          setNpcs(prev => prev.map(p => p.id === m.data.id ? { ...p, x: m.data.x, y: m.data.y, state: { ...p.state, location: m.data.location } } : p))
        } else if (m.type === 'news') {
          toast.info(`${m.data.title}: ${m.data.content}`)
          if (m.data.title.includes('Погода')) setWeather(m.data.content.split(' ')[1].toLowerCase())
          if (m.data.title.includes('Выборы')) {
            const winner = m.data.content.split(' ')[2]
            setIsMayor(winner === 'Игрок')
          }
        }
      } catch (e) {}
    }
    wsRef.current = ws
    return () => ws.close()
  }, [])

  return (
    <div className="min-h-screen bg-city-bg p-4">
      <Weather current={weather} />
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <MapView npcs={npcs} onSelect={(npc) => { setSelected(npc); setIsChatOpen(true); }} weather={weather} />
        </div>
        <div className="w-full md:w-80 lg:w-96 flex flex-col gap-4">
          <NewsFeed backend={BACKEND} />
          {isMayor && <MayorPanel backend={BACKEND} />}
        </div>
      </div>
      {isChatOpen && selected && (
        <ChatWindow backend={BACKEND} npc={selected} onClose={() => setIsChatOpen(false)} />
      )}
    </div>
  )
}
