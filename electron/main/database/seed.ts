import { getAllCategories, insertCategory } from './categories'

let hasSeeded = false 

export function seedDefaultCategories(): void {
  if (hasSeeded) return // Don't seed twice in same session
  
  const existing = getAllCategories()
  
  if (existing.length === 0) {
    console.log('Creating default categories...')
    
    insertCategory('Useful Links', '#3b82f6', '🔗')
    insertCategory('Important Notes', '#ef4444', '📌')
    insertCategory('Email Templates', '#10b981', '✉️')
    insertCategory('Code Snippets', '#f59e0b', '💻')
    
    console.log('Default categories created')
  } else {
    console.log(`Found ${existing.length} existing categories, skipping seed`)
  }
  
  hasSeeded = true
}