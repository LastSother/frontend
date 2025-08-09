import React from 'react'

export default function MayorPanel({ backend }) {
  const issueLaw = (law) => {
    // Send to WS or API, assume global WS
    fetch(`${backend}/issue_law`, { method: 'POST', body: JSON.stringify({ law }) }) // Add endpoint in back
  }

  return (
    <div className="border border-gray-300 p-4 rounded-lg bg-white">
      <h3 className="font-bold mb-2">Панель Мэра</h3>
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => issueLaw('increase taxes')} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">Повысить налоги</button>
        <button onClick={() => issueLaw('holiday')} className="bg-pink-500 text-white px-3 py-1 rounded text-sm">Объявить праздник</button>
        <button onClick={() => issueLaw('ban crime')} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Запретить преступления</button>
      </div>
    </div>
  )
}