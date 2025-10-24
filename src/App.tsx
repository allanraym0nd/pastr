import { useEffect, useState } from 'react'
import TopBar from './components/layout/TopBar'
import ClipGrid from './components/clipboard/ClipGrid'
import { Clip,Category } from './types'

function App() {
  const [clips, setClips] = useState<Clip[]>([])
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    // Fetch initial data
    window.electron.clips.getAll().then(setClips)
    window.electron.categories.getAll().then(setCategories)

    // Listen for new clips
    const unsubscribe = window.electron.clips.onNew((newClip) => {
      console.log('New clip received in React:', newClip)
      setClips(prev => [newClip, ...prev])
    })

    // Cleanup
    return () => unsubscribe()
  }, [])

  return (
    <div className="h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Clipboard Manager
        </h1>

        <div className="grid grid-cols-2 gap-8">
          {/* Categories */}
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Categories</h2>
            <ul className="space-y-2">
              {categories.map(cat => (
                <li key={cat.id} className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded" style={{ backgroundColor: cat.color }}></span>
                  <span>{cat.icon} {cat.name}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Clips */}
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Recent Clips ({clips.length})</h2>
            <div className="space-y-3">
              {clips.slice(0, 5).map(clip => (
                <div key={clip.id} className="p-3 bg-gray-50 rounded border border-gray-200">
                  <p className="text-sm text-gray-600 truncate">
                    {clip.preview || clip.content}
                  </p>
                  <span className="text-xs text-gray-400">
                    {new Date(clip.created_at).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App