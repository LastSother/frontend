import React, { useEffect, useState, useRef } from 'react'
import _ from 'lodash'
import { FaPaperPlane } from 'react-icons/fa'

export default function ChatWindow({ backend, npc }) {
  const [ws, setWs] = useState(null)
  const [messages, setMessages] = useState([])
  const inputRef = useRef()
  const messagesEndRef = useRef()

  useEffect(() => {
    if (!npc) return
    if (ws) ws.close()
    const url = (backend.replace('http', 'ws')) + `/ws/npc_${npc.id}`
    const socket = new WebSocket(url)
    socket.onopen = () => console.log('Чат подключён')
    socket.onmessage = (evt) => {
      const m = JSON.parse(evt.data)
      if (m.type === 'chat') {
        setMessages(prev => [...prev, { from: m.data.from, text: m.data.text }])
      } else if (m.type === 'command') {
        setMessages(prev => [...prev, { from: 'system', text: m.data.reply }])
      }
    }
    setWs(socket)
    fetch(`${backend}/chat_history/${npc.id}`)
      .then(r => r.json())
      .then(hist => {
        setMessages(hist.map(h => ({ from: h.role === 'user' ? 'player' : 'npc', text: h.content })))
      })
    return () => socket.close()
  }, [npc])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
    <div className="chat-window">
      <h3 className="font-bold text-lg mb-3">Чат с {npc ? npc.name : '(выберите персонажа)'}</h3>
      <div className="h-64 overflow-y-auto bg-gray-50 p-3 rounded-lg">
        {messages.map((m, i) => (
          <div key={i} className={`chat-message ${m.from === 'player' ? 'player-message' : m.from === 'npc' ? 'npc-message' : 'bg-yellow-100'}`}>
            <b>{m.from === 'player' ? 'Вы' : m.from === 'npc' ? npc.name : 'Система'}:</b> {m.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex gap-2 mt-3">
        <input ref={inputRef} className="flex-1 border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-city-blue" placeholder="Напишите сообщение..." />
        <button onClick={sendMessage} className="bg-city-blue text-white p-2 rounded-lg hover:bg-blue-600 flex items-center">
          <FaPaperPlane />
        </button>
      </div>
      {npc && (
        <div className="flex flex-wrap gap-2 mt-3">
          <button onClick={() => sendCommand('go to shop')} className="bg-city-green text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600">Идти в магазин</button>
          <button onClick={() => sendCommand('start business')} className="bg-purple-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-purple-600">Открыть бизнес</button>
          <button onClick={() => sendCommand('vote for me')} className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600">Голосовать за меня</button>
          <button onClick={() => sendCommand('tell about city')} className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600">Рассказать о городе</button>
        </div>
      )}
    </div>
  )
}
