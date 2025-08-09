import React, { useEffect, useState } from 'react'

export default function NewsFeed({ backend }) {
  const [news, setNews] = useState([])

  useEffect(() => {
    const fetchNews = () => fetch(backend + '/news').then(r => r.json()).then(n => setNews(n.slice(0, 15)))
    fetchNews()
    const interval = setInterval(fetchNews, 30000)
    const ws = new WebSocket((backend.replace('http', 'ws')) + '/ws/news')
    ws.onmessage = (e) => {
      const m = JSON.parse(e.data)
      if (m.type === 'news') {
        setNews(prev => [m.data, ...prev].slice(0, 15))
      }
    }
    return () => {
      clearInterval(interval)
      ws.close()
    }
  }, [])

  return (
    <div className="border border-gray-300 p-4 rounded-lg bg-white">
      <h3 className="font-bold mb-2">Лента новостей</h3>
      <div className="h-56 overflow-auto">
        {news.map((n, i) => (
          <div key={i} className="mb-2">
            <b>{n.title}</b>
            <div className="text-sm">{n.content}</div>
          </div>
        ))}
      </div>
    </div>
  )
}