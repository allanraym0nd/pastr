import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron'; 
import path from 'path';
import { fileURLToPath } from 'url'; //esm
import squirrelStartup from 'electron-squirrel-startup';
import './database/db'
import { seedDefaultCategories } from './database/seed';
import { insertClip,getAllClips } from './database/clips';
import { getAllCategories } from './database/categories';
import { startClipboardMonitor, stopClipboardMonitor } from './clipboard/monitor'
import { notifyClip, setupIpcHandlers } from './ipc-handlers';

// --- ESM Path Resolution ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


if(squirrelStartup){
    app.quit()
}

let mainWindow: BrowserWindow | null = null 

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 800,
        minWidth: 1200,   // Minimum width
        minHeight: 100,   // Minimum height
        webPreferences: {
            // __dirname is now defined and works
            preload: path.join(__dirname, '../preload/index.js'), 
            nodeIntegration: false,
            contextIsolation: true
        }
    })

    if(process.env.VITE_DEV_SERVER_URL){
        mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
        mainWindow.webContents.openDevTools(); //open dev tools
    } else { 
       
        mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
    }

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

function registerGlobalShortcut(shortcut: string) {
    globalShortcut.unregisterAll()

    const success = globalShortcut.register(shortcut, () => {
        if(mainWindow){
            if(mainWindow.isMinimized()){
                mainWindow.restore()
            }
            if(!mainWindow.isVisible()){
                mainWindow.show()
            } else {
                createWindow()
            }
        }
    })
    if (success) {
    console.log(`Global shortcut ${shortcut} registered successfully`)
  } else {
    console.error(`Failed to register global shortcut: ${shortcut}`)
  }
}

app.whenReady().then(() => {
    seedDefaultCategories()

    setupIpcHandlers()

    console.log('Categories:', getAllCategories())
    console.log('Clips:', getAllClips())

    registerGlobalShortcut('CommandOrControl+Shift+V')

    createWindow()

    // Start clipboard monitoring and notify React of new clips
    startClipboardMonitor((clip) => {
        console.log('New saved clip:',clip)
        notifyClip(clip)
    })

    app.on('activate', () => {
        // On macOS, re-create window when dock icon is clicked
        if(BrowserWindow.getAllWindows().length === 0){
            createWindow()
        }
    }) 
})

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
    stopClipboardMonitor()
    globalShortcut.unregisterAll()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('settings:updateShortcut',async(_event,shortcut:string) => {
    registerGlobalShortcut(shortcut)
    return {success:true}
})