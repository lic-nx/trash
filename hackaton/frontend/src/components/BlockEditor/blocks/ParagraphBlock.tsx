import { Block } from '../../../stores'

interface ParagraphBlockProps {
  block: Block
  isFocused?: boolean
  onFocus?: () => void
  onUpdate: (updates: Partial<Block>) => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

export function ParagraphBlock({ block, isFocused = false, onFocus, onUpdate, onKeyDown }: ParagraphBlockProps) {
  return (
    <div className="paragraph-block relative group">
      <textarea
        value={typeof block.content === 'string' ? block.content : ''}
        onChange={(e) => onUpdate({ content: e.target.value })}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        placeholder="Type '/' for commands..."
        className="w-full resize-none outline-none min-h-[1.5rem] text-gray-800 leading-relaxed"
        rows={1}
        style={{ 
          height: 'auto',
          overflow: 'hidden'
        }}
      />
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
          Type @ to link to table cell
        </span>
      </div>
    </div>
  )
}
