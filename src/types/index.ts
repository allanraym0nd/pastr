export interface Clip {
  id: string
  type: 'text' | 'image' | 'audio' | 'file'
  content: string
  preview: string | null
  metadata: string | null
  created_at: number
  category_id: string | null
}

export interface Category {
  id: string
  name: string
  color: string
  icon: string | null
  position: number
  created_at: number
}