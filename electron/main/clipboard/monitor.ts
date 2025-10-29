import { clipboard } from "electron";
import { insertClip } from "../database/clips";
import { processClipboardContent, processImage } from './processor'
import path from "path";
import fs from 'fs'
import { app } from "electron";
import { randomUUID } from "crypto";
import { preview } from "vite";

let previousContent = ''
let previousImageHash = ''
let monitorInterval: NodeJS.Timeout | null = null 

//create images directory
const imageDir = path.join('userData', 'images')
if(!fs.existsSync(imageDir)){
    fs.mkdirSync((imageDir), {recursive: true})
}

export function startClipboardMonitor(callback?: (clip: any) => void) {
    console.log('Starting clipboard monitor...')
    
    monitorInterval = setInterval(() => {
        try {  

            const image = clipboard.readImage()
            const currentText = clipboard.readText() 

            if(!image.isEmpty()){
                // Create a simple hash of the image to detect changes
                const imageBuffer = image.toPNG()
                const imageHash = imageBuffer.toString('base64').substring(0,50)

                if(imageHash !== previousImageHash){
                    previousImageHash = imageHash

                    console.log("New image detected in clipboard")

                    //save and image disk
                    const filename = `${randomUUID()}.png`
                    const filePath = path.join(imageDir, filename)
                    fs.writeFileSync(filePath,imageBuffer)
                     console.log('Image saved to:', filePath)

                     // get image dimensions
                     const size = image.getSize()

                    const processedClip = processImage(filePath,size)
                    const savedClip = insertClip(
                        'image',
                         filePath,
                         filePath,
                         {
                            width:size.width,
                            height:size.height,
                            size:imageBuffer.length

                         }

                    )
                    console.log('Saved image clip to database:', savedClip.id)

                    if (callback) {
                        callback(savedClip)
                    }

                    return
                }
            }

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

                // notify callback, will use this to notify react

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

