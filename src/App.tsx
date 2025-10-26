import { useEffect, useState } from 'react'
import TopBar from './components/layout/TopBar'
import ClipGrid from './components/clipboard/ClipGrid'
import AddCategoryModal from './components/categories/AddCategoryModal'
import { Clip, Category } from './types'

function App() {
  const [clips, setClips] = useState<Clip[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)

  useEffect(() => {
    window.electron.categories.getAll().then(setCategories)
    loadClips()

    const unsubscribe = window.electron.clips.onNew((newClip) => {
      setClips(prev => [newClip, ...prev])
    })

    return () => unsubscribe()
  }, [])

  const loadClips = async () => {
    if (selectedCategory) {
      const data = await window.electron.clips.getByCategory(selectedCategory)
      setClips(data)
    } else {
      const data = await window.electron.clips.getAll(100)
      setClips(data)
    }
  }

  useEffect(() => {
    loadClips()
  }, [selectedCategory])

  const filteredClips = searchQuery
    ? clips.filter(clip => 
        clip.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : clips

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    // TODO: Show toast
  }

  const handleDelete = async (id: string) => {
    await window.electron.clips.delete(id)
    setClips(prev => prev.filter(clip => clip.id !== id))
  }


  const handleDropClip = async (clipId: string, categoryId: string | null) => {
    await window.electron.clips.updateClipCategory(clipId, categoryId)


    
    // update local state
    setClips(prev => prev.map(clip => 
      clip.id === clipId ? { ...clip, category_id: categoryId } : clip
    ))
    
   
    if (selectedCategory) {
       console.log('Reloading clips for category:', selectedCategory)
      loadClips()
    }
  }

  const handleAddCategory = async(name:string, color: string, icon: string) => {
    const newCategory = await window.electron.categories.create(name,color,icon)
    setCategories(prev => [...prev, newCategory])
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <TopBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onDropClip={handleDropClip}
        onAddCategory={() => setShowAddCategoryModal(true)}
      />
      
      <div className="flex-1 overflow-y-auto">
        <ClipGrid
          clips={filteredClips}
          onCopy={handleCopy}
          onDelete={handleDelete}
        />
      </div>

 
      {showAddCategoryModal && (
       <AddCategoryModal 
          onClose={() => setShowAddCategoryModal(false)}
          onAdd={handleAddCategory}
       />
      )}
    </div>
    
  )
}

export default App