import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'
import { X, Table as TableIcon } from 'lucide-react'

export interface CellLink {
  tableId: string
  tableName: string
  recordId: string
  fieldId: string
  value: string
}

interface CellLinkPopupProps {
  onSelect: (link: CellLink) => void
  onClose: () => void
  position?: { x: number; y: number }
}

export function CellLinkPopup({ onSelect, onClose, position }: CellLinkPopupProps) {
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  const { data: tables = [], isLoading } = useQuery({
    queryKey: ['tables'],
    queryFn: async () => {
      const response = await api.get('/tables')
      return response.data
    }
  })

  const { data: tableData } = useQuery({
    queryKey: ['table', selectedTable],
    queryFn: async () => {
      if (!selectedTable) return null
      const response = await api.get(`/tables/${selectedTable}`)
      return response.data
    },
    enabled: !!selectedTable
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const handleSelect = () => {
    if (selectedTable && selectedRecord && tableData) {
      const table = tables.find((t: any) => t.id === selectedTable)
      const record = tableData.records.find((r: any) => r.id === selectedRecord)
      const firstField = tableData.columns[0]?.id
      
      if (record && firstField) {
        onSelect({
          tableId: selectedTable,
          tableName: table?.name || 'Unknown',
          recordId: selectedRecord,
          fieldId: firstField,
          value: record[firstField] || 'No value'
        })
      }
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        ref={popupRef}
        className="fixed z-50 bg-white rounded-lg shadow-xl border w-80 max-h-96 overflow-hidden"
        style={{ 
          left: position?.x || window.innerWidth / 2 - 160, 
          top: position?.y || window.innerHeight / 2 - 200 
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            <TableIcon className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-sm">Link to Table Cell</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 space-y-3">
          {/* Step 1: Select Table */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              1. Select Table
            </label>
            {isLoading ? (
              <div className="text-sm text-gray-400">Loading tables...</div>
            ) : (
              <select
                value={selectedTable || ''}
                onChange={(e) => {
                  setSelectedTable(e.target.value || null)
                  setSelectedRecord(null)
                }}
                className="w-full px-2 py-1.5 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a table...</option>
                {tables.map((table: any) => (
                  <option key={table.id} value={table.id}>
                    {table.name} ({table.recordCount} records)
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Step 2: Select Record */}
          {selectedTable && tableData && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                2. Select Record
              </label>
              <select
                value={selectedRecord || ''}
                onChange={(e) => setSelectedRecord(e.target.value || null)}
                className="w-full px-2 py-1.5 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a record...</option>
                {tableData.records.map((record: any) => (
                  <option key={record.id} value={record.id}>
                    {record.title || record.name || record[tableData.columns[0]?.id] || 'Untitled'}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Preview */}
          {selectedTable && selectedRecord && tableData && (
            <div className="p-3 bg-blue-50 rounded border border-blue-200">
              <p className="text-xs text-blue-700 font-medium mb-1">Preview:</p>
              <p className="text-sm text-blue-900">
                {tableData.name}.{tableData.records.find((r: any) => r.id === selectedRecord)?.[tableData.columns[0]?.id]}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t bg-gray-50 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSelect}
            disabled={!selectedTable || !selectedRecord}
            className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Insert Link
          </button>
        </div>
      </div>
    </>
  )
}

// Component to display a linked cell value
export function CellLinkDisplay({ link, onRemove }: { link: CellLink; onRemove?: () => void }) {
  const [value, setValue] = useState(link.value)

  // Fetch latest value periodically or on mount
  useEffect(() => {
    const fetchLatestValue = async () => {
      try {
        const response = await api.get(`/tables/${link.tableId}`)
        const table = response.data
        const record = table.records.find((r: any) => r.id === link.recordId)
        if (record && record[link.fieldId]) {
          setValue(record[link.fieldId])
        }
      } catch (error) {
        console.error('Failed to fetch linked cell value:', error)
      }
    }

    fetchLatestValue()
    // Refresh every 30 seconds
    const interval = setInterval(fetchLatestValue, 30000)
    return () => clearInterval(interval)
  }, [link.tableId, link.recordId, link.fieldId])

  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium cursor-pointer hover:bg-blue-200 transition">
      <span>{value}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 text-blue-400 hover:text-blue-600"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  )
}
