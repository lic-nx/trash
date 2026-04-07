import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export interface Block {
  id: string
  type: 'paragraph' | 'heading' | 'heading1' | 'heading2' | 'heading3' | 'bulletList' | 'numberedList' | 'todoList' | 'code' | 'quote' | 'divider' | 'table' | 'image' | 'ai' | 'callout'
  content: any
  props?: Record<string, any>
}

export interface Document {
  id: string
  title: string
  content: Block[]
  createdAt: string
  updatedAt: string
}

interface DocumentState {
  documents: Document[]
  currentDocument: Document | null
  isLoading: boolean
  error: string | null
  
  // Actions
  setDocuments: (documents: Document[]) => void
  setCurrentDocument: (doc: Document | null) => void
  addDocument: (doc: Document) => void
  updateDocument: (id: string, updates: Partial<Document>) => void
  deleteDocument: (id: string) => void
  
  // Block operations
  addBlock: (docId: string, block: Block, afterBlockId?: string) => void
  updateBlock: (docId: string, blockId: string, updates: Partial<Block>) => void
  deleteBlock: (docId: string, blockId: string) => void
  moveBlock: (docId: string, blockId: string, direction: 'up' | 'down') => void
}

export const useDocumentStore = create<DocumentState>()(
  subscribeWithSelector((set, get) => ({
    documents: [],
    currentDocument: null,
    isLoading: false,
    error: null,
    
    setDocuments: (documents) => set({ documents }),
    
    setCurrentDocument: (doc) => set({ currentDocument: doc }),
    
    addDocument: (doc) => set((state) => ({
      documents: [...state.documents, doc]
    })),
    
    updateDocument: (id, updates) => set((state) => ({
      documents: state.documents.map(d => d.id === id ? { ...d, ...updates } : d),
      currentDocument: state.currentDocument?.id === id 
        ? { ...state.currentDocument, ...updates }
        : state.currentDocument
    })),
    
    deleteDocument: (id) => set((state) => ({
      documents: state.documents.filter(d => d.id !== id),
      currentDocument: state.currentDocument?.id === id ? null : state.currentDocument
    })),
    
    addBlock: (docId, block, afterBlockId) => set((state) => {
      const doc = state.documents.find(d => d.id === docId)
      if (!doc) return state
      
      let newContent: Block[]
      if (afterBlockId) {
        const index = doc.content.findIndex(b => b.id === afterBlockId)
        newContent = [
          ...doc.content.slice(0, index + 1),
          block,
          ...doc.content.slice(index + 1)
        ]
      } else {
        newContent = [...doc.content, block]
      }
      
      return {
        documents: state.documents.map(d => 
          d.id === docId ? { ...d, content: newContent } : d
        ),
        currentDocument: state.currentDocument?.id === docId
          ? { ...state.currentDocument, content: newContent }
          : state.currentDocument
      }
    }),
    
    updateBlock: (docId, blockId, updates) => set((state) => {
      const updateContent = (content: Block[]) => 
        content.map(b => b.id === blockId ? { ...b, ...updates } : b)
      
      return {
        documents: state.documents.map(d => 
          d.id === docId ? { ...d, content: updateContent(d.content) } : d
        ),
        currentDocument: state.currentDocument?.id === docId
          ? { ...state.currentDocument, content: updateContent(state.currentDocument.content) }
          : state.currentDocument
      }
    }),
    
    deleteBlock: (docId, blockId) => set((state) => {
      const filterContent = (content: Block[]) => content.filter(b => b.id !== blockId)
      
      return {
        documents: state.documents.map(d => 
          d.id === docId ? { ...d, content: filterContent(d.content) } : d
        ),
        currentDocument: state.currentDocument?.id === docId
          ? { ...state.currentDocument, content: filterContent(state.currentDocument.content) }
          : state.currentDocument
      }
    }),
    
    moveBlock: (docId, blockId, direction) => set((state) => {
      const doc = state.documents.find(d => d.id === docId)
      if (!doc) return state
      
      const index = doc.content.findIndex(b => b.id === blockId)
      if (index === -1) return state
      
      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= doc.content.length) return state
      
      const newContent = [...doc.content]
      ;[newContent[index], newContent[newIndex]] = [newContent[newIndex], newContent[index]]
      
      return {
        documents: state.documents.map(d => 
          d.id === docId ? { ...d, content: newContent } : d
        ),
        currentDocument: state.currentDocument?.id === docId
          ? { ...state.currentDocument, content: newContent }
          : state.currentDocument
      }
    })
  }))
)