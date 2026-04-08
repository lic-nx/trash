import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'

interface EditorProps {
  documentId: string | null
}

interface Block {
  id: string
  type: 'paragraph' | 'heading' | 'list' | 'table' | 'code'
  content: any
}

export function Editor({ documentId }: EditorProps) {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [title, setTitle] = useState('')
  const queryClient = useQueryClient()

  const { data: document, isLoading } = useQuery({
    queryKey: ['document', documentId],
    queryFn: async () => {
      if (!documentId) return null
      const response = await api.get(`/documents/${documentId}`)
      return response.data
    },
    enabled: !!documentId
  })

  useEffect(() => {
    if (document) {
      setTitle(document.title || '')
      setBlocks(document.content || [])
    }
  }, [document])

  const updateMutation = useMutation({
    mutationFn: async (data: { title: string; content: Block[] }) => {
      const response = await api.put(`/documents/${documentId}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    }
  })

  const handleSave = () => {
    if (documentId) {
      updateMutation.mutate({ title, content: blocks })
    }
  }

  const addBlock = (type: Block['type']) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: type === 'heading' ? { level: 2, text: '' } : ''
    }
    setBlocks([...blocks, newBlock])
  }

  const updateBlock = (id: string, content: any) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b))
  }

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id))
  }

  if (!documentId) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <div className="text-center">
          <p className="text-lg">Select a document or create a new one</p>
          <p className="text-sm mt-2">Your wiki content will appear here</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b px-6 py-4 flex items-center justify-between">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Document title"
          className="text-2xl font-bold outline-none flex-1"
        />
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
        >
          {updateMutation.isPending ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-4 flex gap-2">
            <button onClick={() => addBlock('paragraph')} className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm">+ Paragraph</button>
            <button onClick={() => addBlock('heading')} className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm">+ Heading</button>
            <button onClick={() => addBlock('list')} className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm">+ List</button>
            <button onClick={() => addBlock('table')} className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm">+ Table</button>
          </div>

          <div className="space-y-4">
            {blocks.map((block) => (
              <div key={block.id} className="group relative">
                {block.type === 'paragraph' && (
                  <textarea
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, e.target.value)}
                    className="w-full p-2 border rounded resize-none outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Write something..."
                  />
                )}
                
                {block.type === 'heading' && (
                  <input
                    type="text"
                    value={block.content.text || ''}
                    onChange={(e) => updateBlock(block.id, { ...block.content, text: e.target.value })}
                    className="w-full p-2 text-xl font-bold border-b-2 border-gray-200 outline-none focus:border-blue-500"
                    placeholder="Heading"
                  />
                )}
                
                {block.type === 'list' && (
                  <textarea
                    value={Array.isArray(block.content) ? block.content.join('\n') : block.content}
                    onChange={(e) => updateBlock(block.id, e.target.value.split('\n'))}
                    className="w-full p-2 border rounded resize-none outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="List items (one per line)"
                  />
                )}
                
                {block.type === 'table' && (
                  <div className="border rounded p-4 bg-gray-50">
                    <p className="text-gray-500 text-sm mb-2">Table Widget</p>
                    <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
                      Configure Table
                    </button>
                  </div>
                )}
                
                <button
                  onClick={() => deleteBlock(block.id)}
                  className="absolute right-0 top-0 px-2 py-1 bg-red-500 text-white rounded text-xs opacity-0 group-hover:opacity-100 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
