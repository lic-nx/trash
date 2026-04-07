export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'

export const BLOCK_TYPES = {
  PARAGRAPH: 'paragraph',
  HEADING: 'heading',
  HEADING1: 'heading1',
  HEADING2: 'heading2',
  HEADING3: 'heading3',
  BULLET_LIST: 'bulletList',
  NUMBERED_LIST: 'numberedList',
  TODO_LIST: 'todoList',
  CODE: 'code',
  QUOTE: 'quote',
  DIVIDER: 'divider',
  TABLE: 'table',
  AI: 'ai',
  CALLOUT: 'callout'
} as const

export const TABLE_VIEWS = {
  TABLE: 'table',
  KANBAN: 'kanban',
  CALENDAR: 'calendar',
  GANTT: 'gantt'
} as const

export const AI_TABS = {
  GENERATE: 'generate',
  SUMMARIZE: 'summarize',
  SUGGEST: 'suggest'
} as const

export const CALLOUT_TYPES = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success',
  TIP: 'tip'
} as const

export const KEYBOARD_SHORTCUTS = {
  NEW_BLOCK: 'Enter',
  DELETE_BLOCK: 'Backspace',
  NAVIGATE_UP: 'ArrowUp',
  NAVIGATE_DOWN: 'ArrowDown',
  OPEN_BLOCK_MENU: '/'
}

export const DEFAULT_TABLE_ID = 'tasks'
