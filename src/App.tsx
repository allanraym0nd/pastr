import { useEffect, useState } from 'react'
import TopBar from './components/layout/TopBar'
import ClipGrid from './components/clipboard/ClipGrid'
import { Clip,Category } from './types'

function App() {
  const [clips, setClips] = useState<Clip[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery,setSearchQuery] = useState("")

    useEffect(() => {
      // Fetch initial data
      window.electron.categories.getAll().then(setCategories)
      loadClips()

      // Listen for new clips
      const unsubscribe = window.electron.clips.onNew((newClip) => {
        setClips(prev => [newClip, ...prev])
      })

    
      return () => unsubscribe()
    }, [])


    const loadClips = async() => {
      if(selectedCategory){
        const data = await window.electron.clips.getByCategory(selectedCategory)
        setClips(data)
      } else {
        const data = await window.electron.clips.getAll(100)
        setClips(data)
      }

    }

    useEffect(() => {
      loadClips()
    },[selectedCategory])

    const filteredClips = searchQuery
        ? clips.filter(clip => 
            clip.content.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : clips

    const handleCopy = (content: string) => {
       navigator.clipboard.writeText(content)

    }

    const handleDelete = async(id: string) => {
      await window.electron.clips.delete(id)
      setClips(prev => prev.filter(clip => clip.id !== id))
    }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <TopBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <div className="flex-1 overflow-y-auto">
        <ClipGrid
          clips={filteredClips}
          onCopy={handleCopy}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
  
}

export default App