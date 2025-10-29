export async function chat(payload: {
  messages: { role: 'system'|'user'|'assistant', content: string }[]
  context: {
    blogMeta: { id: string | number | null, titulo: string, tipo: string }
    selectedChapterText: string
    allChaptersText: string
  }
  language?: 'es'|'en'
  responseFormat?: 'quiz-json' | 'survey-json' | 'flashcards-json'
}) {
  const res = await fetch('http://localhost:3000/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error('AI endpoint error')
  return await res.json()
}