export function extractJson<T = any>(text: string): T | null {
  if (!text) return null
  const fence = text.match(/```json\s*([\s\S]*?)```/i)
  const raw = fence ? fence[1] : text
  try { return JSON.parse(raw) as T } catch {
    const first = raw.indexOf('{'); const last = raw.lastIndexOf('}')
    if (first !== -1 && last !== -1 && last > first) {
      try { return JSON.parse(raw.slice(first, last + 1)) as T } catch { return null }
    }
    return null
  }
}
export function isQuiz(obj: any): boolean { return obj && obj.type === 'quiz' && Array.isArray(obj.items) }
export function isSurvey(obj: any): boolean { return obj && obj.type === 'survey' && Array.isArray(obj.items) }
export function isFlashcards(obj: any): boolean { return obj && obj.type === 'flashcards' && Array.isArray(obj.cards) }