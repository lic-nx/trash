import { useState } from 'react'
import { Block } from '../../../stores'

interface CodeBlockProps {
  block: Block
  isFocused?: boolean
  onFocus?: () => void
  onUpdate: (updates: Partial<Block>) => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

const LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'csharp', 'cpp',
  'go', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'html', 'css',
  'sql', 'bash', 'json', 'yaml', 'markdown'
]

export function CodeBlock({ block, isFocused = false, onFocus, onUpdate, onKeyDown }: CodeBlockProps) {
  const [showLanguageSelect, setShowLanguageSelect] = useState(false)
  
  const content = block.content as { language: string; code: string } || { language: 'javascript', code: '' }

  const updateContent = (updates: Partial<typeof content>) => {
    onUpdate({ content: { ...content, ...updates } })
  }

  return (
    <div className="code-block">
      {/* Language Selector */}
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => setShowLanguageSelect(!showLanguageSelect)}
          className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded font-mono"
        >
          {content.language}
        </button>
        
        {showLanguageSelect && (
          <div className="absolute z-10 mt-8 bg-white border rounded shadow-lg max-h-48 overflow-y-auto">
            {LANGUAGES.map(lang => (
              <button
                key={lang}
                onClick={() => {
                  updateContent({ language: lang })
                  setShowLanguageSelect(false)
                }}
                className="block w-full text-left px-3 py-1 text-sm hover:bg-blue-50"
              >
                {lang}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Code Editor */}
      <textarea
        value={content.code}
        onChange={(e) => updateContent({ code: e.target.value })}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        placeholder="Write your code here..."
        className="w-full font-mono text-sm bg-gray-900 text-gray-100 p-4 rounded-lg resize-none outline-none min-h-[100px]"
        spellCheck={false}
      />
    </div>
  )
}