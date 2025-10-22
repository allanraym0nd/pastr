const { contextBridge, ipcRenderer } = require('electron');;

// Expose protected methods that allow the renderer process to use the ipcRenderer without exposing the entire object

contextBridge.exposeInMainWorld('electron', {

     // Send messages to main process

    send: (channel: string, data:any) => {
        ipcRenderer.send(channel,data)
    }, 

     // Receive messages from main process
    on: (channel:string, callback:(data:any) => void) => { 
        ipcRenderer.on(channel,callback)
    },

    removeListener: (channel:string, callback:(data:any) => void) => {
        ipcRenderer.removeListener(channel,callback)
    }, 

     // Invoke (request/response pattern)
    invoke: (channel:string, data?:any) => {
        return ipcRenderer.invoke(channel, data)
    }


})




// contextBridge safely exposes specific IPC methods to React app