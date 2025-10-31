import { useEffect, useState } from 'react'
import TopBar from './components/layout/TopBar'
import ClipGrid from './components/clipboard/ClipGrid'
import AddCategoryModal from './components/categories/AddCategoryModal'
import SettingsModal, {AppSettings} from './components/settings/SettingsModal'
import { Clip, Category } from './types'

const DEFAULT_SETTINGS: AppSettings = {
  historyLimitDays:30,
  globalShortcut: 'CommandOrControl+Shift+V'
}

function App() {
  const [clips, setClips] = useState<Clip[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)
  const [showSettingsModal,setShowSettingsModal] = useState(false)
  const [settings,setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)

  useEffect(() => {
    window.electron.categories.getAll().then(setCategories)
    loadClips()

    // Load settings from localStorage
    const savedSettings = localStorage.getItem('app-settings')
    if(savedSettings){
     const loadedSettings =  JSON.parse(savedSettings)
     setSettings(loadedSettings)
    // Run cleanup based on history limit
    if(loadedSettings.historyLimitDays !== -1){
      window.electron.clips.deleteOld(loadedSettings.historyLimitDays).then(result => {
        console.log(`Startup cleanup: Deleted ${result.deletedCount} old clips`)
        if(result.deletedCount > 0){
          loadClips()
        }
      })
    }

}
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

  const handleSaveSettings = async(newSettings: AppSettings) => {
    setSettings(newSettings)
    localStorage.setItems('app-settings', JSON.stringify(newSettings))    

    await window.electron.settings.updateShortcut(newSettings.globalShortcut)

    // Running cleanup immediately with new settings
    if(newSettings.historyLimitDays !== -1) {
     const result =  await window.electron.clips.deleteOld(newSettings.historyLimitDays)
     if(result.deletedCount > 0){
      loadClips()
     }
    }
  }


  const handleClearAll = async() => {
     console.log('App.tsx: handleClearAll called')

    try {
      
      const result = await window.electron.clips.deleteAll()
      console.log('DeleteAll results:', result)

      await loadClips()
      
      console.log('Clips reloaded')
    } catch(error) {
      console.error("Error clearing clips", error)

    }
   
   
   setClips([]) //clear UI

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
        onOpenSettings={() => setShowSettingsModal(true)}
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

      {showSettingsModal && (
        <SettingsModal 
          onClose={() => setShowSettingsModal(false)}
          onClearAll={handleClearAll}
          onSaveSettings={() => handleSaveSettings}
          currentSettings={settings}
        />
      )}
    </div>
    
  )
}

export default App