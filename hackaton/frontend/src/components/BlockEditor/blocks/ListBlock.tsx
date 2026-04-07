import { useState } from 'react'
import { Block } from '../../../stores'
import { v4 as uuidv4 } from 'uuid'

interface ListBlockProps {
  block: Block
  isFocused?: boolean
  onFocus?: () => void
  onUpdate: (updates: Partial<Block>) => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

interface ListItem {
  id: string
  text: string
  checked?: boolean
}

export function ListBlock({ block, block, isFocused = false, onFocus, onUpdate, onKeyDown }: ListBlockProps) {
  const items: ListItem[] = Array.isArray(block.content) 
    ? block.content 
    : [{ id: '1', text: '' }]

  const updateItem = (id: string, updates: Partial<ListItem>) => {
    const newItems = items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    )
    onUpdate({ content: newItems })
  }

  const addItem = (afterId: string) => {
    const index = items.findIndex(item => item.id === afterId)
    const newItems = [
      ...items.slice(0, index + 1),
      { id: uuidv4(), text: '', checked: block.type === 'todoList' ? false : undefined },
      ...items.slice(index + 1)
    ]
    onUpdate({ content: newItems })
  }

  const deleteItem = (id: string) => {
    if (items.length > 1) {
      onUpdate({ content: items.filter(item => item.id !== id) })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, itemId: string) => {
    const item = items.find(i => i.id === itemId)
    
    if (e.key === 'Enter' && !e.shiftKey && item?.text) {
      e.preventDefault()
      addItem(itemId)
    }
    
    if (e.key === 'Backspace' && !item?.text && items.length > 1) {
      e.preventDefault()
      deleteItem(itemId)
    }
    
    onKeyDown(e)
  }

  const renderBullet = (type: Block['type'], index: number, item: ListItem) => {
    switch (type) {
      case 'bulletList':
        return <span className="text-gray-400 mr-2">•</span>
      case 'numberedList':
        return <span className="text-gray-400 mr-2 w-5">{index + 1}.</span>
      case 'todoList':
        return (
          <input
            type="checkbox"
            checked={item.checked || false}
            onChange={(e) => updateItem(item.id, { checked: e.target.checked })}
            className="mr-2 h-4 w-4 rounded border-gray-300"
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="list-block">
      {items.map((item, index) => (
        <div key={item.id} className={`flex items-start gap-1 py-0.5 ${block.type === 'todoList' && item.checked ? 'opacity-50 line-through' : ''}`}>
          {renderBullet(block.type, index, item)}
          <input
            type="text"
            value={item.text}
            onChange={(e) => updateItem(item.id, { text: e.target.value })}
            onKeyDown={(e) => handleKeyDown(e, item.id)}
            onFocus={onFocus}
            placeholder="List item"
            className="flex-1 outline-none bg-transparent"
          />
        </div>
      ))}
    </div>
  )
}