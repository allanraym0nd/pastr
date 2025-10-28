import { db } from './db'
import { randomUUID } from 'crypto'

export interface Category {
  id: string
  name: string
  color: string
  icon: string | null
  position: number
  created_at: number
}

export function insertCategory(
  name: string,
  color: string,
  icon?: string
): Category { 
    const id = randomUUID()
    const created_at = Date.now()

    const maxPos = db.prepare('SELECT MAX(position) as MAX FROM Categories').get() as { max: number | null }
    const position = (maxPos.max || 0) + 1

    const stmt = db.prepare(`
        INSERT INTO categories (id, name, color, icon, position, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
        `)

        stmt.run(id, name, color, icon || null, position, created_at)

        return {id, name, color, icon: icon || null, position, created_at }
}



export function getAllCategories(): Category[] {
  const stmt = db.prepare('SELECT * FROM categories ORDER BY position ASC')
  return stmt.all() as Category[]
}

export function updateCategory(
    id:string,
    updates:Partial<Pick<Category, 'name' | 'color' | 'icon'>>
): void {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(',')
    const values = Object.values(updates)
    const stmt = db.prepare(`
        UPDATE categories SET ${fields} WHERE id = ?
`)

        stmt.run(...values, id)

}

export function deleteCategory(id: string): void {
  const stmt = db.prepare('DELETE FROM categories WHERE id = ?')
  stmt.run(id)
}

export function reorderCategories(categoryIds:string[]):void {
    const stmt = db.prepare(`UPDATE categories SET position = ? WHERE id =?`) // this will be reused multiple times to update each category’s position.

    const transaction = db.transaction((ids:string[]) => {
        ids.forEach((id,index) => {
            stmt.run(index + 1, id)
        })
    })

    transaction(categoryIds)

}