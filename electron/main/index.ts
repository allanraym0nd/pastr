import { app, BrowserWindow } from 'electron'; 
import path from 'path';
import { fileURLToPath } from 'url'; // Needed for ESM to get file path
import squirrelStartup from 'electron-squirrel-startup';

// --- ESM Path Resolution ---
// Define __filename and __dirname equivalents for ES Module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ---------------------------

if(squirrelStartup){
    app.quit()
}

let mainWindow: BrowserWindow | null = null 

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
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
        // __dirname is now defined and works
        mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
    }

    mainWindow.on('close', () => {
        mainWindow = null
    })
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        // On macOS, re-create window when dock icon is clicked
        if(BrowserWindow.getAllWindows().length === 0){
            createWindow()
        }
    }) 
})

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})