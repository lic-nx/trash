import { Block } from '../../../stores'

interface QuoteBlockProps {
  block: Block
  isFocused: boolean
  onFocus: () => void
  onUpdate: (updates: Partial<Block>) => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

export function QuoteBlock({ block, isFocused, onFocus, onUpdate, onKeyDown }: QuoteBlockProps) {
  return (
    <blockquote className="border-l-4 border-gray-300 pl-4 italic">
      <textarea
        value={typeof block.content === 'string' ? block.content : ''}
        onChange={(e) => onUpdate({ content: e.target.value })}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        placeholder="Quote..."
        className="w-full resize-none outline-none bg-transparent text-gray-600"
        rows={2}
      />
    </blockquote>
  )
}