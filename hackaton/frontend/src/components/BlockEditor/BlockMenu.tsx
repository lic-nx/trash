import { useState } from 'react'
import { Block } from '../../stores'

interface BlockMenuProps {
  position: { x: number; y: number }
  onSelect: (type: Block['type']) => void
  onClose: () => void
}

const BLOCK_TYPES: { type: Block['type']; label: string; icon: string; description: string }[] = [
  { type: 'paragraph', label: 'Text', icon: '📝', description: 'Plain text block' },
  { type: 'heading1', label: 'Heading 1', icon: 'H1', description: 'Large heading' },
  { type: 'heading2', label: 'Heading 2', icon: 'H2', description: 'Medium heading' },
  { type: 'heading3', label: 'Heading 3', icon: 'H3', description: 'Small heading' },
  { type: 'bulletList', label: 'Bullet List', icon: '•', description: 'Unordered list' },
  { type: 'numberedList', label: 'Numbered List', icon: '1.', description: 'Ordered list' },
  { type: 'todoList', label: 'To-do List', icon: '☑', description: 'Task checklist' },
  { type: 'quote', label: 'Quote', icon: '"', description: 'Quote block' },
  { type: 'code', label: 'Code', icon: '<>', description: 'Code snippet' },
  { type: 'divider', label: 'Divider', icon: '—', description: 'Horizontal divider' },
  { type: 'callout', label: 'Callout', icon: '💡', description: 'Highlighted text box' },
  { type: 'table', label: 'Live Table', icon: '📊', description: 'Embed table from MWS Tables' },
  { type: 'ai', label: 'AI Assistant', icon: '🤖', description: 'AI-generated content' },
]

export function BlockMenu({ position, onSelect, onClose }: BlockMenuProps) {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const filteredTypes = BLOCK_TYPES.filter(t => 
    t.label.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => Math.min(i + 1, filteredTypes.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredTypes[selectedIndex]) {
        onSelect(filteredTypes[selectedIndex].type)
      }
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      {/* Menu */}
      <div
        className="fixed z-50 bg-white rounded-lg shadow-xl border w-72 max-h-96 overflow-hidden"
        style={{ left: position.x || 100, top: position.y || 100 }}
      >
        {/* Search */}
        <div className="p-2 border-b">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search blocks..."
            className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>

        {/* Block Types */}
        <div className="overflow-y-auto max-h-64">
          {filteredTypes.map((type, index) => (
            <button
              key={type.type}
              onClick={() => onSelect(type.type)}
              className={`w-full px-3 py-2 flex items-center gap-3 text-left hover:bg-blue-50 ${
                index === selectedIndex ? 'bg-blue-50' : ''
              }`}
            >
              <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded text-sm">
                {type.icon}
              </span>
              <div>
                <div className="font-medium text-sm">{type.label}</div>
                <div className="text-xs text-gray-500">{type.description}</div>
              </div>
            </button>
          ))}
          {filteredTypes.length === 0 && (
            <div className="p-4 text-center text-gray-400 text-sm">
              No blocks found
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-2 border-t text-xs text-gray-400 flex justify-between">
          <span>↑↓ Navigate</span>
          <span>↵ Select</span>
          <span>Esc Close</span>
        </div>
      </div>
    </>
  )
}