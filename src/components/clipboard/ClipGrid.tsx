import { Clip } from "@/types";
import ClipCard from "./ClipCard";

interface ClipGridProps {
    clips: Clip[]
    onCopy: (content: string) => void
    onDelete: (id: string) => void
}

export default function ClipGrid({clips,onCopy,onDelete}: ClipGridProps) {
    if(clips.length === 0) {
        return ( 
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <span className="text-6xl mb-4">📋</span>
                <p className="text-lg">No clips yet</p>
                <p className="text-sm">Copy something to get started</p>
             </div>
        )
    }


    return ( 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6 auto-rows-max">
            {clips.map(clip => (
                <ClipCard  
                key={clip.id}
                clip={clip}
                onCopy={onCopy}
                onDelete={onDelete}
                />
            ))}
        </div>
    )

}