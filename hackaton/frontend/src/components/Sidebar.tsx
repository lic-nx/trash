import { useQuery, useQueryClient } from '@tanstack/react-query'
import { FileText, Plus, FolderOpen, Search, Settings } from 'lucide-react'
import { api } from '../services/api'
import { useState, useMemo } from 'react'

// ✅ Proper TypeScript interface
export interface Document {
  id: string
  title: string
  content?: any[]
  createdAt?: string
  updatedAt?: string
}

interface SidebarProps {
  selectedDocument: string | null
  onSelectDocument: (id: string) => void
}

export function Sidebar({ selectedDocument, onSelectDocument }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const queryClient = useQueryClient()

  // ✅ React Query with error handling
  const { 
    data: documents = [], 
    isLoading, 
    error 
  } = useQuery<Document[]>({
    queryKey: ['documents'],
    queryFn: async () => {
      const response = await api.get('/documents')
      return response.data
    },
    retry: 1, // Optional: retry failed requests once
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  })

  // ✅ Memoized filtering for performance
  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) return documents
    return documents.filter(doc => 
      doc.title?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [documents, searchQuery])

  // ✅ Create document with refetch & error handling
  const handleCreateDocument = async () => {
    const title = prompt('Enter document title:')
    if (!title?.trim()) {
      if (title !== null) alert('Title cannot be empty')
      return
    }
    
    try {
      await api.post('/documents', { 
        title: title.trim(), 
        content: [] 
      })
      // ✅ Refresh documents list
      await queryClient.invalidateQueries({ queryKey: ['documents'] })
    } catch (err) {
      console.error('Failed to create document:', err)
      alert('Error creating document. Please try again.')
    }
  }

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <FolderOpen className="w-5 h-5 text-blue-400" />
          <h2 className="font-semibold text-lg">WikiLive</h2>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            aria-label="Search documents"
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      </div>
      
      {/* Documents List */}
      <div className="flex-1 overflow-y-auto p-2">
        {error ? (
          <div 
            role="alert" 
            className="text-red-400 text-sm p-3 bg-red-900/20 rounded-lg mx-2"
          >
            Failed to load documents. Please check your connection.
          </div>
        ) : isLoading ? (
          <div 
            role="status" 
            aria-live="polite"
            className="text-gray-400 text-sm p-2 flex items-center justify-center"
          >
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2" />
            Loading...
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-gray-400 text-sm p-4 text-center">
            {searchQuery ? 'No documents match your search' : 'No documents yet. Create one!'}
          </div>
        ) : (
          <ul className="space-y-1" role="listbox" aria-label="Documents list">
            {filteredDocuments.map((doc) => (
              <li key={doc.id} role="option">
                <button
                  onClick={() => onSelectDocument(doc.id)}
                  aria-current={selectedDocument === doc.id ? 'true' : undefined}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-all duration-150 ${
                    selectedDocument === doc.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate text-sm font-medium">{doc.title || 'Untitled'}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-3 border-t border-gray-700 space-y-2 bg-gray-900/50">
        <button
          onClick={handleCreateDocument}
          className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg flex items-center justify-center gap-2 transition font-medium"
          aria-label="Create new document"
        >
          <Plus className="w-4 h-4" />
          New Document
        </button>
        
        <div className="flex items-center justify-between px-1 py-1 text-xs text-gray-500">
          <span>WikiLive v1.0</span>
          <button 
            className="p-1 hover:text-gray-300 transition rounded"
            aria-label="Open settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}