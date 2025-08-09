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
  const [weather, setWeather] = useState('sunny')
  const [isMayor, setIsMayor] = useState(false) // Assume player can be mayor
  const wsRef = useRef(null)

  useEffect(() => {
    fetch(BACKEND + '/map').then(r => r.json()).then(setNpcs)
    // Fetch weather (add /weather endpoint in back if needed, or from news)
    const ws = new WebSocket((BACKEND.replace('http', 'ws')) + '/ws/map')
    ws.onopen = () => console.log('WS map open')
    ws.onmessage = (evt) => {
      try {
        const m = JSON.parse(evt.data)
        if (m.type === 'map_update') {
          setNpcs(prev => prev.map(p => p.id === m.data.id ? { ...p, x: m.data.x, y: m.data.y, state: { ...p.state, location: m.data.location } } : p))
        } else if (m.type === 'news') {
          toast.info(m.data.title + ': ' + m.data.content)
          if (m.data.title.includes('Погода')) setWeather(m.data.content.split(' ')[1].toLowerCase())
          if (m.data.title.includes('Выборы')) {
            const winner = m.data.content.split(' ')[2]
            setIsMayor(winner === 'Player') // Assume player name
          }
        }
      } catch (e) {}
    }
    wsRef.current = ws
    return () => ws.close()
  }, [])

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <div className="flex-1">
        <Weather current={weather} />
        <MapView npcs={npcs} onSelect={setSelected} weather={weather} />
      </div>
      <div className="w-full md:w-96 flex flex-col gap-4">
        <ChatWindow backend={BACKEND} npc={selected} />
        <NewsFeed backend={BACKEND} />
        {isMayor && <MayorPanel backend={BACKEND} />}
      </div>
    </div>
  )
}