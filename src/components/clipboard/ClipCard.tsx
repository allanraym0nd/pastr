import { Clip } from '@/types'
import { Copy, Trash2 } from 'lucide-react'

interface ClipCardProps { 
    clip: Clip
    onCopy: (content: string) => void
    onDelete: (id: string) => void
}

export default function ClipCard({clip,onCopy,onDelete}: ClipCardProps) {

    const metadata = clip.metadata ? JSON.parse(clip.metadata) : {} 

    const getCardColor = () => { 
        switch (clip.type) {
            case 'text':
                return metadata.isUrl? "bg-blue-500" : "bg-yellow-500"
            case 'image':
                 return 'bg-red-500'
            case 'audio':
                 return 'bg-pink-500'
            default:
                 return 'bg-gray-500'        
        }
    }

    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000)
         if (seconds < 60) return 'Just now'
         if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
         if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
          return `${Math.floor(seconds / 86400)} days ago`
    }

    return (
          <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden">
      {/* Colored Header */}
      <div className={`${getCardColor()} px-4 py-2 flex items-center justify-between`}>
        <div className="flex items-center gap-2 text-white">
          <span className="text-sm font-medium capitalize">{clip.type}</span>
          <span className="text-xs opacity-75">{timeAgo(clip.created_at)}</span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onCopy(clip.content)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            title="Copy"
          >
            <Copy className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => onDelete(clip.id)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {clip.type === 'text' && (
          <p className="text-sm text-gray-700 line-clamp-6 whitespace-pre-wrap">
            {clip.content}
          </p>
        )}
        
        {clip.type === 'image' && (
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-4xl">🖼️</span>
          </div>
        )}

        {metadata.length && (
          <div className="mt-3 text-xs text-gray-400">
            {metadata.length} characters
          </div>
        )}
      </div>
    </div>
    )
}