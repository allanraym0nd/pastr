import { updateCategory } from "../main/database/categories";
import { getClipsByCategory, updateClipCategory } from "../main/database/clips";

const { contextBridge, ipcRenderer } = require('electron');;

// Expose protected methods that allow the renderer process to use the ipcRenderer without exposing the entire object

contextBridge.exposeInMainWorld('electron', {

 clips: {
    getAll: (limit?: number) => ipcRenderer.invoke('clips.getAll', limit),
    getClipsByCategory: (categoryId: string) => ipcRenderer.invoke('clips.getClipsByCategory', categoryId),
    delete: (clipId: string) => ipcRenderer.invoke('clips:delete', clipId),
    updateClipCategory: (clipId: string, categoryId: string) => ipcRenderer.invoke("clips.updateClipCategory", clipId,categoryId),
    search: (query: string) => ipcRenderer.invoke('clips:search', query),
    //on new lets react listen to new clipboard items
    onNew: (callback: (clip:any) => void) => { 
        const subscription = (_event:any, clip:any) => callback(clip)
        ipcRenderer.on("clip:new", subscription)

         return () => ipcRenderer.removeListener("clip:new", subscription)

    }

   
 },

 //categories api
 categories: {
    getAll: () => ipcRenderer.invoke('categories:getAll'),
    create: (name: string, color: string, icon?: string) => 
      ipcRenderer.invoke('categories:create', name, color, icon),
    update: (id: string, updates: any) => ipcRenderer.invoke('categories:update', id, updates),
    delete: (id: string) => ipcRenderer.invoke('categories:delete', id),

 }


})




// contextBridge safely exposes specific IPC methods to React app