import { Block } from '../../stores'
import { ParagraphBlock } from './blocks/ParagraphBlock'
import { HeadingBlock } from './blocks/HeadingBlock'
import { ListBlock } from './blocks/ListBlock'
import { CodeBlock } from './blocks/CodeBlock'
import { QuoteBlock } from './blocks/QuoteBlock'
import { DividerBlock } from './blocks/DividerBlock'
import { TableBlock } from './blocks/TableBlock'
import { AIBlock } from './blocks/AIBlock'
import { CalloutBlock } from './blocks/CalloutBlock'

interface BlockComponentProps {
  block: Block
  isFocused: boolean
  onFocus: () => void
  onUpdate: (updates: Partial<Block>) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

export function BlockComponent({
  block,
  isFocused,
  onFocus,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onKeyDown
}: BlockComponentProps) {
  const commonProps = {
    block,
    isFocused,
    onFocus,
    onUpdate,
    onDelete,
    onMoveUp,
    onMoveDown,
    onKeyDown
  }

  switch (block.type) {
    case 'paragraph':
      return <ParagraphBlock {...commonProps} />
    case 'heading':
    case 'heading1':
    case 'heading2':
    case 'heading3':
      return <HeadingBlock {...commonProps} />
    case 'bulletList':
    case 'numberedList':
    case 'todoList':
      return <ListBlock {...commonProps} />
    case 'code':
      return <CodeBlock {...commonProps} />
    case 'quote':
      return <QuoteBlock {...commonProps} />
    case 'divider':
      return <DividerBlock {...commonProps} />
    case 'table':
      return <TableBlock {...commonProps} />
    case 'ai':
      return <AIBlock {...commonProps} />
    case 'callout':
      return <CalloutBlock {...commonProps} />
    default:
      return <ParagraphBlock {...commonProps} />
  }
}