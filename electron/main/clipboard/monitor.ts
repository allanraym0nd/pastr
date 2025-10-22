import { clipboard } from "electron";
import { insertClip } from "../database/clips";
import { processClipboardContent } from './processor'

let previousContent = ''
let monitorInterval: NodeJS.Timeout | null = null

export function startClipboardMonitor(callback?: (clip: any) => void) {
    console.log('Starting clipboard monitor...')
    
    monitorInterval = setInterval(() => {
        try { 
            const currentText = clipboard.readText() 

            if(currentText && currentText !== previousContent){
                previousContent = currentText

                console.log('New clipboard content detected:', currentText.substring(0, 50) + '...')

                const processedClip = processClipboardContent(currentText)
                const savedClip = insertClip(
                    processedClip.type,
                    processedClip.content,
                    processedClip.preview || '',
                    processedClip.metadata,
                )

                console.log('Saved clip to database:', savedClip.id)

                // will use this to notify react

                if (callback) {
          callback(savedClip)
        }
            }
        } catch(error){
            console.error('Clipboard monitoring error:', error)
        }

    },500)
}

    export function stopClipboardMonitor() {

        if(monitorInterval){
            clearInterval(monitorInterval)
            monitorInterval = null
            console.log("Clipboard monitor stopped")
        }
    }

