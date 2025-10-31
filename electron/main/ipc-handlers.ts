// Listens for messages sent by the preload script
// Listen for requests from React and execute them
import fs from 'fs'
import { BrowserWindow, ipcMain, IpcMain,  } from "electron";
import { getAllClips,getClipsByCategory,updateClipCategory,deleteClip,searchClips, deleteAllClips, deleteOldClips} from "./database/clips";
import { getAllCategories, insertCategory, updateCategory, deleteCategory } from './database/categories'
import path from 'path';

export function setupIpcHandlers() {

    // clips
    ipcMain.handle('clips:getAll', async(_event, limit?:number) => {
        return getAllClips(limit)
    })

    ipcMain.handle('clips:getByCategory', async(_event, categoryId:string) => {
        return getClipsByCategory(categoryId)
    })

    ipcMain.handle('clips:delete', async (_event, clipId: string) => {
    deleteClip(clipId)
    return {success: true}
    
  })

  ipcMain.handle('clips:updateClipCategory', async (_event, clipId: string, categoryId:string | null) => {
    updateClipCategory(clipId,categoryId)
    return { success: true }
  })

  ipcMain.handle("clips:search", async(_event, query: string) => {
    return searchClips(query)
  })

  ipcMain.handle("clips:getImage", async(_event, imagePath:string) => {
    try {
      if(fs.existsSync(imagePath)){
        const imageBuffer =fs.readFileSync(imagePath)
        const base64 = imageBuffer.toString('base64')
        const ext = path.extname(imagePath).substring(1)
        return  `data:image/${ext};base64,${base64}`

      }
      return null
    } catch(error){ 
      console.error('Error reading image:', error)
      return null
      
    }
   
  })

  ipcMain.handle("clips:deleteAll", async() => {
    deleteAllClips()
    return {success: true}

  })

  ipcMain.handle("clips:deleteOld", async(_event, daysOld:number) => {
    const deletedCount = deleteOldClips(daysOld)
    return {success:true, deletedCount}

  })
  
   console.log('IPC handlers registered')

    // Categories
  ipcMain.handle('categories:getAll', async () => {
    return getAllCategories()
  })

  
  ipcMain.handle('categories:create', async (_event, name: string, color: string, icon?: string) => {
    return insertCategory(name, color, icon)
  })


  ipcMain.handle('categories:update', async (_event, id: string, updates: any) => {
    updateCategory(id, updates)
    return { success: true }
  })

  
  ipcMain.handle('categories:delete', async (_event, id: string) => {
    deleteCategory(id)
    return { success: true }
  })

  console.log('IPC handlers registered')
}

//sending new clip to all windows
export function notifyClip(clip:any): void {
    BrowserWindow.getAllWindows().forEach(window => {
        window.webContents.send("clip:send",clip)
    })
}