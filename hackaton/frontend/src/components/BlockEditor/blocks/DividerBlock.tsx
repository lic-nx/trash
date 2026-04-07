import { Block } from '../../../stores'

interface DividerBlockProps {
  block: Block
  isFocused?: boolean
  onFocus?: () => void
}

export function DividerBlock({ block, isFocused, onFocus }: DividerBlockProps) {
  return (
    <div className="py-2">
      <hr className="border-t border-gray-200" />
    </div>
  )
}