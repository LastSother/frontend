import React from 'react'

export default function MayorPanel({ backend }) {
  const issueLaw = async (law) => {
    try {
      await fetch(`${backend}/issue_law`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ law })
      })
    } catch (e) {
      console.error('Ошибка закона:', e)
    }
  }

  return (
    <div className="border border-gray-300 p-4 rounded-lg bg-white shadow-lg">
      <h3 className="font-bold text-lg mb-3">Панель мэра</h3>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => issueLaw('повысить налоги')} className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-yellow-600">Повысить налоги</button>
        <button onClick={() => issueLaw('объявить праздник')} className="bg-pink-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-pink-600">Объявить праздник</button>
        <button onClick={() => issueLaw('запретить преступления')} className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600">Запретить преступления</button>
      </div>
    </div>
  )
}
