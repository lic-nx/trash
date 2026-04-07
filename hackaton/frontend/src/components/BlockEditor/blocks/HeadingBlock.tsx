import { Block } from '../../../stores'

interface HeadingBlockProps {
  block: Block
  isFocused?: boolean
  onFocus?: () => void
  onUpdate: (updates: Partial<Block>) => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

const headingStyles = {
  heading1: 'text-4xl font-bold',
  heading2: 'text-3xl font-bold',
  heading3: 'text-2xl font-semibold',
}

export function HeadingBlock({ block, block, isFocused = false, onFocus, onUpdate, onKeyDown }: HeadingBlockProps) {
  const content = block.type === 'heading' 
    ? (block.content as { level: number; text: string })
    : block.content
  
  const text = typeof content === 'string' ? content : content?.text || ''
  const level = typeof content === 'object' && 'level' in content ? content.level : 2
  
  const headingType = block.type === 'heading' 
    ? `heading${level}` as keyof typeof headingStyles
    : block.type as keyof typeof headingStyles

  const styleClass = headingStyles[headingType] || headingStyles.heading2

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (block.type === 'heading') {
      onUpdate({ content: { level, text: e.target.value } })
    } else {
      onUpdate({ content: e.target.value })
    }
  }

  return (
    <div className="heading-block">
      <input
        type="text"
        value={text}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        placeholder="Heading"
        className={`w-full outline-none bg-transparent ${styleClass}`}
      />
    </div>
  )
}