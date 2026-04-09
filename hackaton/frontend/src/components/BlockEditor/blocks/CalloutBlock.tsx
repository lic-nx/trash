import { useState } from 'react'
import { Block } from '../../../stores'

interface CalloutBlockProps {
  block: Block
  isFocused?: boolean
  onFocus?: () => void
  onUpdate: (updates: Partial<Block>) => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

const calloutTypes = {
  info: { icon: '💡', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' },
  warning: { icon: '⚠️', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800' },
  error: { icon: '❌', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' },
  success: { icon: '✅', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' },
  tip: { icon: '💬', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800' }
}

export function CalloutBlock({ block, isFocused = false, onFocus, onUpdate, onKeyDown }: CalloutBlockProps) {
  const [showTypeSelect, setShowTypeSelect] = useState(false)
  
  const content = block.content as { type: keyof typeof calloutTypes; text: string } || { type: 'info', text: '' }
  const calloutStyle = calloutTypes[content.type] || calloutTypes.info

  const updateContent = (updates: Partial<typeof content>) => {
    onUpdate({ content: { ...content, ...updates } })
  }

  return (
    <div className={`callout-block rounded-lg border ${calloutStyle.bg} ${calloutStyle.border} p-4`}>
      <div className="flex items-start gap-3">
        {/* Type Selector */}
        <button
          onClick={() => setShowTypeSelect(!showTypeSelect)}
          className="text-xl hover:opacity-80 relative"
        >
          {calloutStyle.icon}
        </button>
        
        {showTypeSelect && (
          <div className="absolute z-10 mt-8 bg-white border rounded shadow-lg">
            {Object.entries(calloutTypes).map(([type, style]) => (
              <button
                key={type}
                onClick={() => {
                  updateContent({ type: type as keyof typeof calloutTypes })
                  setShowTypeSelect(false)
                }}
                className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <span>{style.icon}</span>
                <span className="capitalize">{type}</span>
              </button>
            ))}
          </div>
        )}
        
        {/* Content */}
        <textarea
          value={content.text}
          onChange={(e) => updateContent({ text: e.target.value })}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          placeholder="Write your callout text..."
          className={`flex-1 bg-transparent outline-none resize-none ${calloutStyle.text}`}
          rows={2}
        />
      </div>
    </div>
  )
}