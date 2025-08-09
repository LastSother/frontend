import React, { useEffect, useState, useRef } from 'react'
import _ from 'lodash'
import { FaTimes, FaPaperPlane } from 'react-icons/fa'

export default function ChatWindow({ backend, npc, onClose }) {
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
      try {
        const m = JSON.parse(evt.data)
        if (m.type === 'chat') {
          setMessages(prev => [...prev, { from: m.data.from, text: m.data.text }])
        } else if (m.type === 'command') {
          setMessages(prev => [...prev, { from: 'system', text: m.data.reply }])
        }
      } catch (e) {
        console.error('Ошибка WebSocket:', e)
      }
    }
    setWs(socket)
    fetch(`${backend}/chat_history/${npc.id}`)
      .then(r => r.json())
      .then(hist => {
        setMessages(hist.map(h => ({ from: h.role === 'user' ? 'player' : 'npc', text: h.content })))
      })
      .catch(err => console.error('Ошибка загрузки истории:', err))
    return () => socket.close()
  }, [npc, backend])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = _.debounce(() => {
    const text = inputRef.current.value.trim()
    if (!text || !ws) return
    ws.send(JSON.stringify({ action: 'message', text }))
    setMessages(prev => [...prev, { from: 'player', text }])
    inputRef.current.value = ''
  }, 500)

  const sendCommand = (cmd) => {
    if (!ws) return
    ws.send(JSON.stringify({ action: 'command', text: cmd }))
  }

  if (!npc) return null

  return (
    <div className="chat-modal">
      <div className="chat-content">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Чат с {npc.name}</h3>
          <button onClick={onClose} className="text-red-500 hover:text-red-700">
            <FaTimes size={20} />
          </button>
        </div>
        <div className="h-64 overflow-y-auto bg-gray-50 p-3 rounded-lg mb-4">
          {messages.length > 0 ? (
            messages.map((m, i) => (
              <div key={i} className={`chat-message ${m.from === 'player' ? 'player-message' : m.from === 'npc' ? 'npc-message' : 'bg-yellow-100'}`}>
                <b>{m.from === 'player' ? 'Вы' : m.from === 'npc' ? npc.name : 'Система'}:</b> {m.text}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Нет сообщений</p>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-2">
          <input ref={inputRef} className="flex-1 border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-city-blue" placeholder="Напишите сообщение..." />
          <button onClick={sendMessage} className="bg-city-blue text-white p-2 rounded-lg hover:bg-blue-600 flex items-center">
            <FaPaperPlane />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <button onClick={() => sendCommand('go to shop')} className="bg-city-green text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600" title="Отправить персонажа в магазин">Пойти в магазин</button>
          <button onClick={() => sendCommand('start business')} className="bg-purple-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-purple-600" title="Начать бизнес для персонажа">Начать бизнес</button>
          <button onClick={() => sendCommand('vote for me')} className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600" title="Проголосовать за игрока как мэра">Проголосовать за меня</button>
          <button onClick={() => sendCommand('tell about city')} className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600" title="Узнать о городе от персонажа">Рассказать о городе</button>
        </div>
      </div>
    </div>
  )
}
