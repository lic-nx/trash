import { useCallback, useEffect, useRef, useState } from 'react'
import { Block, useDocumentStore } from '../../stores'
import { BlockComponent } from './BlockComponent'
import { BlockMenu } from './BlockMenu'
import { v4 as uuidv4 } from 'uuid'

interface BlockEditorProps {
  documentId: string
  onSave?: () => void
}

export function BlockEditor({ documentId, onSave }: BlockEditorProps) {
  const { currentDocument, updateDocument, addBlock, updateBlock, deleteBlock, moveBlock } = useDocumentStore()
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null)
  const [showBlockMenu, setShowBlockMenu] = useState(false)
  const [blockMenuPosition, setBlockMenuPosition] = useState({ x: 0, y: 0 })
  const [insertAfterBlockId, setInsertAfterBlockId] = useState<string | null>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-save with debounce
  const saveDocument = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    saveTimeoutRef.current = setTimeout(() => {
      if (currentDocument) {
        updateDocument(documentId, {
          content: currentDocument.content,
          updatedAt: new Date().toISOString()
        })
        onSave?.()
      }
    }, 1000)
  }, [currentDocument, documentId, updateDocument, onSave])

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  const handleAddBlock = useCallback((type: Block['type'], afterBlockId?: string) => {
    const newBlock: Block = {
      id: uuidv4(),
      type,
      content: type === 'heading' ? { level: 2, text: '' } : 
               type === 'table' ? { tableId: null } :
               type === 'ai' ? { prompt: '', result: '' } :
               type === 'code' ? { language: 'javascript', code: '' } :
               type === 'callout' ? { type: 'info', text: '' } :
               ''
    }
    
    addBlock(documentId, newBlock, afterBlockId || undefined)
    setFocusedBlockId(newBlock.id)
    setShowBlockMenu(false)
    saveDocument()
  }, [documentId, addBlock, saveDocument])

  const handleUpdateBlock = useCallback((blockId: string, updates: Partial<Block>) => {
    updateBlock(documentId, blockId, updates)
    saveDocument()
  }, [documentId, updateBlock, saveDocument])

  const handleDeleteBlock = useCallback((blockId: string) => {
    deleteBlock(documentId, blockId)
    saveDocument()
  }, [documentId, deleteBlock, saveDocument])

  const handleMoveBlock = useCallback((blockId: string, direction: 'up' | 'down') => {
    moveBlock(documentId, blockId, direction)
    saveDocument()
  }, [documentId, moveBlock, saveDocument])

  const handleKeyDown = useCallback((e: React.KeyboardEvent, blockId: string, block: Block) => {
    // Handle slash command
    if (e.key === '/' && block.type === 'paragraph' && !block.content) {
      e.preventDefault()
      const rect = (e.target as HTMLElement).getBoundingClientRect()
      setBlockMenuPosition({ x: rect.left, y: rect.bottom })
      setInsertAfterBlockId(blockId)
      setShowBlockMenu(true)
      return
    }

    // Handle Enter key - create new block
    if (e.key === 'Enter' && !e.shiftKey) {
      if (block.type === 'paragraph' || block.type === 'heading' || block.type === 'code') {
        e.preventDefault()
        handleAddBlock('paragraph', blockId)
      }
    }

    // Handle Backspace on empty block - delete and go to previous
    if (e.key === 'Backspace') {
      const content = typeof block.content === 'string' ? block.content : ''
      if (!content && currentDocument?.content.length && currentDocument.content.length > 1) {
        e.preventDefault()
        const index = currentDocument.content.findIndex(b => b.id === blockId)
        if (index > 0) {
          handleDeleteBlock(blockId)
          setFocusedBlockId(currentDocument.content[index - 1].id)
        }
      }
    }

    // Handle Arrow Up/Down for navigation
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      const blocks = currentDocument?.content || []
      const currentIndex = blocks.findIndex(b => b.id === blockId)
      
      if (e.key === 'ArrowUp' && currentIndex > 0) {
        const selection = window.getSelection()
        const range = selection?.getRangeAt(0)
        if (range && range.startOffset === 0) {
          e.preventDefault()
          setFocusedBlockId(blocks[currentIndex - 1].id)
        }
      }
      
      if (e.key === 'ArrowDown' && currentIndex < blocks.length - 1) {
        e.preventDefault()
        setFocusedBlockId(blocks[currentIndex + 1].id)
      }
    }
  }, [currentDocument, handleAddBlock, handleDeleteBlock])

  if (!currentDocument) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <p>Select a document to start editing</p>
      </div>
    )
  }

  return (
    <div ref={editorRef} className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto py-8 px-6">
        {/* Document Title */}
        <input
          type="text"
          value={currentDocument.title}
          onChange={(e) => {
            updateDocument(documentId, { title: e.target.value })
            saveDocument()
          }}
          className="w-full text-4xl font-bold outline-none mb-8 placeholder-gray-300"
          placeholder="Untitled"
        />

        {/* Blocks */}
        <div className="space-y-1">
          {currentDocument.content.map((block, index) => (
            <div key={block.id} className="group relative">
              {/* Block Controls */}
              <div className="absolute -left-12 top-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <button
                  onClick={() => handleAddBlock('paragraph', block.id)}
                  className="p-1 hover:bg-gray-100 rounded text-gray-400"
                  title="Add block below"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    setBlockMenuPosition({ x: 0, y: 0 })
                    setInsertAfterBlockId(block.id)
                    setShowBlockMenu(true)
                  }}
                  className="p-1 hover:bg-gray-100 rounded text-gray-400"
                  title="Change block type"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </button>
              </div>

              <BlockComponent
                block={block}
                isFocused={focusedBlockId === block.id}
                onFocus={() => setFocusedBlockId(block.id)}
                onUpdate={(updates) => handleUpdateBlock(block.id, updates)}
                onDelete={() => handleDeleteBlock(block.id)}
                onMoveUp={() => handleMoveBlock(block.id, 'up')}
                onMoveDown={() => handleMoveBlock(block.id, 'down')}
                onKeyDown={(e) => handleKeyDown(e, block.id, block)}
              />
            </div>
          ))}
        </div>

        {/* Add Block Button */}
        <button
          onClick={() => handleAddBlock('paragraph')}
          className="mt-4 w-full py-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 transition"
        >
          + Add a block
        </button>
      </div>

      {/* Block Menu */}
      {showBlockMenu && (
        <BlockMenu
          position={blockMenuPosition}
          onSelect={(type) => handleAddBlock(type, insertAfterBlockId || undefined)}
          onClose={() => setShowBlockMenu(false)}
        />
      )}
    </div>
  )
}