interface ProcessedClip { 
    type: 'text' | 'image' | 'audio' | 'file', 
    content: string,
    preview: string,
    metadata?: { 
        length?: number
        lines?: number
        isUrl?: boolean
        isCode?: boolean
    }
}

export function processClipboardContent(content: string):ProcessedClip {
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
    const isUrl = urlRegex.test(content.trim()) 
    
     const codeIndicators = ['{', '}', '()', '=>', 'function', 'const', 'let', 'var', 'import', 'export']
     const isCode = codeIndicators.some(indicator => content.includes(indicator))

     const preview = content.length > 100 
      ? content.substring(0,100) + '...'
      : content

      const lines = content.split('\n').length


      return {
        type: 'text', 
        content: content,
        preview: preview,
        metadata: {
            length: content.length,
            lines: lines,
            isUrl: isUrl,
            isCode:isCode
        }
      }


} 

export function processImage(imagePath: string): ProcessedClip { 
    return {
        type: 'image',
        content: imagePath,
        preview: imagePath,
        metadata: {}
    }

}