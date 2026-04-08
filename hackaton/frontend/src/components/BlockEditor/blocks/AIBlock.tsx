import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Block } from '../../../stores'
import { api } from '../../../services/api'
import { Sparkles, Loader2, Copy, RefreshCw } from 'lucide-react'

interface AIBlockProps {
  block: Block
  isFocused?: boolean
  onFocus?: () => void
  onUpdate: (updates: Partial<Block>) => void
}

export function AIBlock({ block, isFocused = false, onFocus, onUpdate }: AIBlockProps) {
  const content = block.content as { prompt: string; result: string; loading?: boolean }
  const [showPrompt, setShowPrompt] = useState(!content.result)

  const generateMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const response = await api.post('/ai/generate', { prompt })
      return response.data
    },
    onSuccess: (data) => {
      onUpdate({ content: { ...content, result: data.result, loading: false } })
    },
    onError: () => {
      onUpdate({ content: { ...content, result: 'Error generating content. Please try again.', loading: false } })
    }
  })

  const handleGenerate = () => {
    if (!content.prompt.trim()) return
    onUpdate({ content: { ...content, loading: true } })
    generateMutation.mutate(content.prompt)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content.result)
  }

  const handleRegenerate = () => {
    generateMutation.mutate(content.prompt)
  }

  if (showPrompt || !content.result) {
    return (
      <div className="ai-block bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <span className="font-medium text-purple-700">AI Assistant</span>
        </div>
        
        <textarea
          value={content.prompt}
          onChange={(e) => onUpdate({ content: { ...content, prompt: e.target.value } })}
          placeholder="Describe what you want to generate... (e.g., 'Write a project summary for Sprint 42')"
          className="w-full border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          rows={3}
        />
        
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={handleGenerate}
            disabled={!content.prompt.trim() || generateMutation.isPending}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate
              </>
            )}
          </button>
          
          <button
            onClick={() => onUpdate({ content: { prompt: '', result: '' } })}
            className="px-4 py-2 text-gray-500 hover:text-gray-700"
          >
            Clear
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="ai-block bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/50 border-b border-purple-100">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-medium text-purple-700">AI Generated</span>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="p-1.5 hover:bg-white/70 rounded text-gray-500"
            title="Copy"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={handleRegenerate}
            disabled={generateMutation.isPending}
            className="p-1.5 hover:bg-white/70 rounded text-gray-500"
            title="Regenerate"
          >
            <RefreshCw className={`w-4 h-4 ${generateMutation.isPending ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowPrompt(true)}
            className="px-2 py-1 text-xs text-purple-600 hover:bg-white/70 rounded"
          >
            Edit Prompt
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="prose prose-sm max-w-none">
          {content.result}
        </div>
      </div>
    </div>
  )
}