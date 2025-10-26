import { db } from './db'
import { randomUUID } from 'crypto'

export interface Clip { 
  id: string
  type: 'text' | 'image' | 'audio' | 'file'
  content: string
  preview: string | null
  metadata: string | null
  created_at: number
  category_id: string | null
}

export function insertClip(
    type: Clip['type'],
    content: string,
    preview?: string,
    metadata?: object
): Clip  {
    const id = randomUUID()
    const created_at = Date.now()

    const stmt = db.prepare(`
    INSERT INTO clips (id, type, content, preview, metadata, created_at, category_id)
     VALUES (?, ?, ?, ?, ?, ?, NULL)
`)


stmt.run (
    id,
    type,
    content,
    preview || null,
    metadata ? JSON.stringify(metadata) : null,
    created_at
)

return {
    id,
    type,
    content,
    preview: preview || null,
    metadata: metadata ? JSON.stringify(metadata) : null,
    created_at,
    category_id: null
}
}

export function getAllClips(limit=100): Clip[] {
    const stmt = db.prepare(`
        SELECT * FROM clips 
        ORDER BY created_at DESC 
        LIMIT ?
        `)

        return stmt.all(limit) as Clip[]

} 

export function getClipsByCategory(categoryId: string): Clip[] {
    const stmt =db.prepare(`
        SELECT * FROM clips 
        WHERE category_id = ?
        ORDER BY created_at DESC
        `)

         return stmt.all(categoryId) as Clip[]
}

export function updateClipCategory(clipId: string, categoryId: string | null): void {
  const stmt = db.prepare(`
    UPDATE clips 
    SET category_id = ? 
    WHERE id = ?
  `)
  
  stmt.run(categoryId, clipId)

}

export function deleteClip(clipId: string): void {
  const stmt = db.prepare('DELETE FROM clips WHERE id = ?')
  stmt.run(clipId)
}

export function searchClips(query: string, limit=50): Clip[] {
    const stmt = db.prepare(`
        SELECT * FROM clips
        WHERE content LIKE ? 
        ORDER BY created_at DESC 
        LIMIT ?
        `)

        return stmt.all(`%${query}%`, limit) as Clip[]

}

