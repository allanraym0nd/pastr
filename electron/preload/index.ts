import { updateCategory } from "../main/database/categories";
import { getClipsByCategory, updateClipCategory } from "../main/database/clips";

const { contextBridge, ipcRenderer } = require('electron');;

// Job: Expose a safe, limited API to React
// Uses ipcRenderer to send messages to the main process

contextBridge.exposeInMainWorld('electron', {

 clips: {
    getAll: (limit?: number) => ipcRenderer.invoke('clips:getAll', limit),
    getByCategory: (categoryId: string) => ipcRenderer.invoke('clips:getByCategory', categoryId),
    delete: (clipId: string) => ipcRenderer.invoke('clips:delete', clipId),
    deleteAll: () => ipcRenderer.invoke('clips:deleteAll'),
    deleteOld: (daysOld:number) => ipcRenderer.invoke("clips:deleteOld", daysOld),
    updateClipCategory: (clipId: string, categoryId: string) => ipcRenderer.invoke("clips:updateClipCategory", clipId,categoryId),
    search: (query: string) => ipcRenderer.invoke('clips:search', query),
    getImage: (imagePath: string) => ipcRenderer.invoke('clips:getImage', imagePath), 
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

 },

 settings: {
   updateShortcut: (shortcut: string) => ipcRenderer.invoke("settings:updateShortcut", shortcut)
 }


})




// contextBridge safely exposes specific IPC methods to React app