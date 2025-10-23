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
    getAll: (limit?:number) => Promise<[Clip]>
  }


  // send: (channel: string, data: any) => void
  // on: (channel: string, callback: (data: any) => void) => void
  // removeListener: (channel: string, callback: (data: any) => void) => void
  // invoke: (channel:string, data?:any) => Promise<any>

}

declare global {
    interface Window {
        electron: ElectronAPI
    }
}