function monthTitle(d) {
  const date = new Date(String(d).replace(' ', 'T'))
  const y = date.getFullYear()
  const m = date.toLocaleString('es-ES', { month: 'long' })
  return `${m.charAt(0).toUpperCase() + m.slice(1)} ${y}`
}

export function groupByMonthYear(items) {
  const map = new Map()
  for (const it of items) {
    const dt = new Date(String(it.createdAt || Date.now()).replace(' ', 'T'))
    const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(it)
  }
  const keys = [...map.keys()].sort((a, b) => (a < b ? 1 : -1))
  return keys.map(k => {
    const first = map.get(k)[0]
    return { key: k, title: monthTitle(first.createdAt), items: map.get(k) }
  })
}

export function groupByAuthor(items, names = {}) {
  const map = new Map()
  for (const it of items) {
    const key = it.authorId ?? 'unknown'
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(it)
  }
  const keys = [...map.keys()]
  return keys.map(k => ({
    key: `author-${k}`,
    title: names[k] ? `Autor: ${names[k]}` : 'Autor desconocido',
    items: map.get(k)
  }))
}

export function groupNone(items) {
  return [{ key: 'all', title: 'Todos', items }]
}