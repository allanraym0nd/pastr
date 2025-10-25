import { Clip } from '@/types'
import ClipCard from './ClipCard'

interface ClipGridProps {
  clips: Clip[]
  onCopy: (content: string) => void
  onDelete: (id: string) => void
}

export default function ClipGrid({ clips, onCopy, onDelete }: ClipGridProps) {
  if (clips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <div className="text-center">
          <span className="text-7xl mb-6 block">📋</span>
          <p className="text-xl font-medium text-gray-600 mb-2">No clips yet</p>
          <p className="text-sm text-gray-400">Copy something to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 auto-rows-max">
        {clips.map(clip => (
          <ClipCard
            key={clip.id}
            clip={clip}
            onCopy={onCopy}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}