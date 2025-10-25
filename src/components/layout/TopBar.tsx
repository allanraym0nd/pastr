import { Search, Plus } from 'lucide-react'
import { Category } from '@/types'

interface TopBarProps {
  categories: Category[]
  selectedCategory: string | null
  onSelectCategory: (categoryId: string | null) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export default function TopBar({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange
}: TopBarProps) {
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

        {/* Categories - Fixed width container with no overflow */}
        <div className="flex items-center gap-2 flex-1">
          {/* All Clips (Clipboard) */}
          <button
            onClick={() => onSelectCategory(null)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === null
                ? 'bg-gray-800 text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <span className="text-base">🕐</span>
            Clipboard
          </button>

          {/* Category Pills - Sort by position */}
          {[...categories].sort((a, b) => a.position - b.position).map(category => {
            const isSelected = selectedCategory === category.id
            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
                style={{
                  backgroundColor: isSelected ? category.color : undefined
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