export type QuizKind = 'single' | 'multi' | 'boolean'

export interface QuizChoice { id: string; text: string }
export interface QuizItem {
  id: string
  kind: QuizKind
  question: string
  choices?: QuizChoice[]
  answer: string[]
  explanation?: string
}
export interface Quiz {
  type: 'quiz'
  title: string
  instructions?: string
  items: QuizItem[]
}

export type SurveyKind = 'likert' | 'single' | 'multi' | 'open'
export interface SurveyItemLikert {
  id: string
  kind: 'likert'
  question: string
  scale: { min: number; max: number; labels?: Record<string, string> }
}
export interface SurveyItemSelect {
  id: string
  kind: 'single' | 'multi'
  question: string
  options: { id: string; text: string }[]
  allowOther?: boolean
}
export interface SurveyItemOpen {
  id: string
  kind: 'open'
  question: string
  placeholder?: string
  maxLength?: number
}
export type SurveyItem = SurveyItemLikert | SurveyItemSelect | SurveyItemOpen
export interface Survey {
  type: 'survey'
  title: string
  instructions?: string
  items: SurveyItem[]
}

export interface Flashcard { q: string; a: string }
export interface Flashcards {
  type: 'flashcards'
  title?: string
  cards: Flashcard[]
}