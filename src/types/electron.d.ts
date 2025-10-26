export interface Clip {
  id: string
  type: 'text' | 'image' | 'audio' | 'file'
  content: string
  preview: string | null
  metadata: string | null
  created_at: number
  category_id: string | null
}

export interface Category {
  id: string
  name: string
  color: string
  icon: string | null
  position: number
  created_at: number
}

export interface ElectronAPI {
  clips: {
    getAll: (limit?: number) => Promise<Clip[]>
    getByCategory: (categoryId: string) => Promise<Clip[]>
    delete: (clipId: string) => Promise<{ success: boolean }>
    updateClipCategory: (clipId: string, categoryId: string | null) => Promise<{ success: boolean }>
    search: (query: string) => Promise<Clip[]>
    onNew: (callback: (clip: Clip) => void) => () => void
  }
  categories: {
    getAll: () => Promise<Category[]>
    create: (name: string, color: string, icon?: string) => Promise<Category>
    update: (id: string, updates: Partial<Category>) => Promise<{ success: boolean }>
    delete: (id: string) => Promise<{ success: boolean }>
  }
}

declare global {
  interface Window {
    electron: ElectronAPI
  }
}



  // send: (channel: string, data: any) => void
  // on: (channel: string, callback: (data: any) => void) => void
  // removeListener: (channel: string, callback: (data: any) => void) => void
  // invoke: (channel:string, data?:any) => Promise<any>