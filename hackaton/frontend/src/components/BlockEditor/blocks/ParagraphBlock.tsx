import { Block } from '../../../stores'

interface ParagraphBlockProps {
  block: Block
  isFocused: boolean
  onFocus: () => void
  onUpdate: (updates: Partial<Block>) => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

export function ParagraphBlock({ block, isFocused, onFocus, onUpdate, onKeyDown }: ParagraphBlockProps) {
  return (
    <div className="paragraph-block">
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
    </div>
  )
}