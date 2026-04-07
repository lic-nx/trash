import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { api } from '../services/api'
import { Sparkles, Copy, RefreshCw, X, Loader2 } from 'lucide-react'

interface AIPanelProps {
  documentId: string
  onClose: () => void
  onInsertContent: (content: string) => void
}

export function AIPanel({ documentId, onClose, onInsertContent }: AIPanelProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'summarize' | 'suggest'>('generate')
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState('')

  const generateMutation = useMutation({
    mutationFn: async (p: string) => {
      const response = await api.post('/api/ai/generate', { prompt: p })
      return response.data
    },
    onSuccess: (data) => setResult(data.result)
  })

  const suggestMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await api.post('/api/ai/suggest', { content })
      return response.data
    },
    onSuccess: (data) => setResult(JSON.stringify(data.suggestions, null, 2))
  })

  const summarizeMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await api.post('/api/ai/summarize', { content })
      return response.data
    },
    onSuccess: (data) => setResult(data.summary + '\n\nKey Points:\n' + data.keyPoints.join('\n'))
  })

  const handleGenerate = () => {
    if (prompt.trim()) {
      generateMutation.mutate(prompt)
    }
  }

  const handleInsert = () => {
    if (result) {
      onInsertContent(result)
      onClose()
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
  }

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l shadow-xl flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h2 className="font-semibold">AI Assistant</h2>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {['generate', 'summarize', 'suggest'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === tab ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'generate' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What would you like to generate?
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Write a project summary for Sprint 42, Create a meeting agenda, Generate a task list for the feature..."
                className="w-full border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={4}
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || generateMutation.isPending}
              className="w-full py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
          </div>
        )}

        {activeTab === 'summarize' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Get a summary of your current document content.
            </p>
            <button
              onClick={() => summarizeMutation.mutate('')}
              disabled={summarizeMutation.isPending}
              className="w-full py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {summarizeMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Summarizing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Summarize Document
                </>
              )}
            </button>
          </div>
        )}

        {activeTab === 'suggest' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Get AI-powered suggestions for improving your document.
            </p>
            <button
              onClick={() => suggestMutation.mutate('')}
              disabled={suggestMutation.isPending}
              className="w-full py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {suggestMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Getting suggestions...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Get Suggestions
                </>
              )}
            </button>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-4 border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-3 py-2 flex items-center justify-between border-b">
              <span className="text-sm font-medium">Result</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopy}
                  className="p-1 hover:bg-gray-200 rounded text-gray-500"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => generateMutation.mutate(prompt)}
                  disabled={generateMutation.isPending}
                  className="p-1 hover:bg-gray-200 rounded text-gray-500"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-3 text-sm whitespace-pre-wrap bg-white max-h-64 overflow-y-auto">
              {result}
            </div>
            <div className="bg-gray-50 px-3 py-2 border-t">
              <button
                onClick={handleInsert}
                className="w-full py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                Insert into Document
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="border-t p-3 bg-gray-50">
        <div className="text-xs text-gray-500 mb-2">Quick Actions:</div>
        <div className="flex flex-wrap gap-1">
          {[
            'Write a summary',
            'Create task list',
            'Generate outline',
            'Add meeting notes'
          ].map((action) => (
            <button
              key={action}
              onClick={() => {
                setPrompt(action)
                setActiveTab('generate')
              }}
              className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-100"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}