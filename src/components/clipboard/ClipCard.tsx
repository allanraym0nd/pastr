import { Clip } from '@/types'
import { Copy, Trash2, Clock } from 'lucide-react'

interface ClipCardProps {
  clip: Clip
  onCopy: (content: string) => void
  onDelete: (id: string) => void
}

export default function ClipCard({ clip, onCopy, onDelete }: ClipCardProps) {
  const metadata = clip.metadata ? JSON.parse(clip.metadata) : {}
  
  const getCardColor = () => {
    switch (clip.type) {
      case 'text':
        if (metadata.isUrl) return 'bg-blue-500'
        if (metadata.isCode) return 'bg-purple-500'
        return 'bg-yellow-500'
      case 'image':
        return 'bg-gradient-to-br from-red-500 to-orange-500'
      case 'audio':
        return 'bg-gradient-to-br from-pink-500 to-rose-500'
      default:
        return 'bg-gray-500'
    }
  }

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return 'Just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div 
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer border border-gray-100"
      onClick={() => onCopy(clip.content)}
    >
      {/* Colored Header */}
      <div className={`${getCardColor()} px-4 py-2.5 flex items-center justify-between`}>
        <div className="flex items-center gap-2 text-white">
          <span className="text-xs font-semibold uppercase tracking-wide">{clip.type}</span>
          <Clock className="w-3 h-3 opacity-75" />
          <span className="text-xs opacity-90">{timeAgo(clip.created_at)}</span>
        </div>
        
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onCopy(clip.content)
            }}
            className="p-1.5 hover:bg-white/20 rounded-md transition-colors"
            title="Copy"
          >
            <Copy className="w-3.5 h-3.5 text-white" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(clip.id)
            }}
            className="p-1.5 hover:bg-white/20 rounded-md transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {clip.type === 'text' && (
          <>
            <p className="text-sm text-gray-800 line-clamp-4 whitespace-pre-wrap break-words">
              {clip.content}
            </p>
            {metadata.length && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">
                  {metadata.length} characters
                </span>
              </div>
            )}
          </>
        )}
        
        {clip.type === 'image' && (
          <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-5xl">🖼️</span>
          </div>
        )}

        {clip.type === 'audio' && (
          <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-5xl">🎵</span>
          </div>
        )}
      </div>
    </div>
  )
}