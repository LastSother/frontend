import React, { useEffect, useState, useRef } from 'react'
import _ from 'lodash'
import { FaArrowRight } from 'react-icons/fa'

export default function ChatWindow({ backend, npc }) {
  const [ws, setWs] = useState(null)
  const [messages, setMessages] = useState([])
  const inputRef = useRef()

  useEffect(() => {
    if (!npc) return
    if (ws) ws.close()
    const url = (backend.replace('http', 'ws')) + `/ws/npc_${npc.id}`
    const socket = new WebSocket(url)
    socket.onopen = () => console.log('chat connected')
    socket.onmessage = (evt) => {
      const m = JSON.parse(evt.data)
      if (m.type === 'chat') {
        setMessages(prev => [...prev, { from: m.data.from, text: m.data.text }])
      } else if (m.type === 'command') {
        setMessages(prev => [...prev, { from: 'system', text: m.data.reply }])
      }
    }
    setWs(socket)
    fetch(`${backend}/chat_history/${npc.id}`).then(r => r.json()).then(hist => {
      setMessages(hist.map(h => ({ from: h.role === 'user' ? 'player' : 'npc', text: h.content })))
    })
    return () => socket.close()
  }, [npc])

  const sendMessage = _.debounce(() => {
    const text = inputRef.current.value
    if (!text || !ws) return
    ws.send(JSON.stringify({ action: 'message', text }))
    setMessages(prev => [...prev, { from: 'player', text }])
    inputRef.current.value = ''
  }, 500)

  const sendCommand = (cmd) => {
    if (!ws) return
    ws.send(JSON.stringify({ action: 'command', text: cmd }))
  }

  return (
    <div className="border border-gray-300 p-4 rounded-lg bg-white">
      <h3 className="font-bold mb-2">Чат с {npc ? npc.name : '(выберите NPC)'}</h3>
      <div className="h-56 overflow-auto bg-gray-50 p-2 rounded">
        {messages.map((m, i) => (
          <div key={i} className={`chat-message ${m.from === 'player' ? 'player-message' : 'npc-message'}`}>
            <b>{m.from}:</b> {m.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        <input ref={inputRef} className="flex-1 border p-2 rounded" placeholder="Сообщение..." />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"><FaArrowRight /></button>
      </div>
      <div className="flex gap-2 mt-2 flex-wrap">
        <button onClick={() => sendCommand('go to shop')} className="bg-green-500 text-white px-3 py-1 rounded text-sm">Go Shop</button>
        <button onClick={() => sendCommand('start business')} className="bg-purple-500 text-white px-3 py-1 rounded text-sm">Start Business</button>
        <button onClick={() => sendCommand('vote for me')} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Vote Me</button>
      </div>
    </div>
  )
}