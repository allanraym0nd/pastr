import { getAllCategories,insertCategory } from "./categories";

export function seedDefaultCategories(): void { 
    if(getAllCategories.length === 0) {
        console.log("Creating default categories...")

        insertCategory("Useful Links", "3b82f6",  '🔗')
        insertCategory('Important Notes', '#ef4444', '📌')   // Red  
        insertCategory('Email Templates', '#10b981', '✉️')   // Green
        insertCategory('Code Snippets', '#f59e0b', '💻')     // Orange
        
         console.log('Default categories created')
    }
}