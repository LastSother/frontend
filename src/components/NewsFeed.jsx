import React, { useEffect, useState } from 'react'

export default function NewsFeed({ backend }) {
  const [news, setNews] = useState([])

  useEffect(() => {
    const fetchNews = () => {
      fetch(backend + '/news')
        .then(r => {
          if (!r.ok) throw new Error('Ошибка загрузки новостей')
          return r.json()
        })
        .then(n => setNews(n.slice(0, 15)))
        .catch(err => console.error('Ошибка новостей:', err))
    }
    fetchNews()
    const interval = setInterval(fetchNews, 30000)
    const ws = new WebSocket((backend.replace('http', 'ws')) + '/ws/news')
    ws.onmessage = (e) => {
      try {
        const m = JSON.parse(e.data)
        if (m.type === 'news') {
          setNews(prev => [m.data, ...prev].slice(0, 15))
        }
      } catch (e) {
        console.error('WebSocket ошибка:', e)
      }
    }
    return () => {
      clearInterval(interval)
      ws.close()
    }
  }, [backend])

  return (
    <div className="news-panel">
      <h3 className="font-bold text-lg mb-3">Городские новости</h3>
      <div className="h-64 overflow-y-auto">
        {news.length > 0 ? (
          news.map((n, i) => (
            <div key={i} className="mb-3 p-2 bg-gray-50 rounded-lg">
              <b className="text-city-blue">{n.title}</b>
              <div className="text-sm">{n.content}</div>
              <div className="text-xs text-gray-500">{new Date(n.ts).toLocaleString('ru')}</div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Нет новостей</p>
        )}
      </div>
    </div>
  )
}
