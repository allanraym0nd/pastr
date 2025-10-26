import { Search, Plus } from 'lucide-react'
import { Category } from '@/types'
import { useState } from 'react'

interface TopBarProps {
  categories: Category[]
  selectedCategory: string | null
  onSelectCategory: (categoryId: string | null) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  onDropClip: (clipId: string, categoryId: string | null) => void
  onAddCategory: () => void
}

export default function TopBar({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onDropClip,
  onAddCategory
}: TopBarProps) {
  const [dragOverCategory, setDragOverCategory] = useState<string | null>(null)

  const handleDragOver = (e: React.DragEvent, categoryId: string | null) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverCategory(categoryId)
  }

  const handleDragLeave = () => {
    setDragOverCategory(null)
  }

  const handleDrop = (e: React.DragEvent, categoryId: string | null) => {
    e.preventDefault()
    const clipId = e.dataTransfer.getData('clipId')
    if (clipId) {
      onDropClip(clipId, categoryId)
    }
    setDragOverCategory(null)
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-shrink-0 w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 flex-1">
          {/* All Clips (Clipboard) */}
          <button
            onClick={() => onSelectCategory(null)}
            onDragOver={(e) => handleDragOver(e, null)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, null)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === null
                ? 'bg-gray-800 text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            } ${
              dragOverCategory === null ? 'ring-2 ring-blue-400 ring-offset-2' : ''
            }`}
          >
            <span className="text-base">🕐</span>
            Clipboard
          </button>

          {/* Category Pills */}
          {[...categories].sort((a, b) => a.position - b.position).map(category => {
            const isSelected = selectedCategory === category.id
            const isDragOver = dragOverCategory === category.id
            
            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                onDragOver={(e) => handleDragOver(e, category.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, category.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                } ${
                  isDragOver ? 'ring-2 ring-offset-2 scale-105' : ''
                }`}
                style={{
                  backgroundColor: isSelected ? category.color : undefined,
                  boxShadow: isDragOver ? `0 0 0 2px white, 0 0 0 4px ${category.color}` : undefined
                }}
              >
                {category.icon && <span className="text-base">{category.icon}</span>}
                {category.name}
                {isSelected && <span className="text-xs opacity-75">●</span>}
              </button>
            )
          })}

          {/* Add Category Button */}
          <button
            onClick={onAddCategory}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all flex-shrink-0"
            title="Add Category"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}