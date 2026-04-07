import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Block } from '../../../stores'
import { api } from '../../../services/api'
import { X, Table, LayoutGrid, Calendar, GanttChart } from 'lucide-react'

interface TableBlockProps {
  block: Block
  isFocused: boolean
  onFocus: () => void
  onUpdate: (updates: Partial<Block>) => void
  onDelete: () => void
}

type ViewType = 'table' | 'kanban' | 'calendar' | 'gantt'

export function TableBlock({ block, isFocused, onFocus, onUpdate, onDelete }: TableBlockProps) {
  const content = block.content as { tableId: string | null; view?: ViewType }
  const [view, setView] = useState<ViewType>(content.view || 'table')
  const [showTableSelect, setShowTableSelect] = useState(!content.tableId)

  const { data: tables = [], isLoading: tablesLoading } = useQuery({
    queryKey: ['tables'],
    queryFn: async () => {
      const response = await api.get('/api/tables')
      return response.data
    }
  })

  const { data: tableData, isLoading: tableLoading } = useQuery({
    queryKey: ['table', content.tableId],
    queryFn: async () => {
      if (!content.tableId) return null
      const response = await api.get(`/api/tables/${content.tableId}`)
      return response.data
    },
    enabled: !!content.tableId
  })

  const handleTableSelect = (tableId: string) => {
    onUpdate({ content: { ...content, tableId } })
    setShowTableSelect(false)
  }

  const handleViewChange = (newView: ViewType) => {
    setView(newView)
    onUpdate({ content: { ...content, view: newView } })
  }

  if (!content.tableId || showTableSelect) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-500 text-sm">Select a table to embed</span>
          {content.tableId && (
            <button onClick={() => setShowTableSelect(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {tablesLoading ? (
          <div className="text-center py-4 text-gray-400">Loading tables...</div>
        ) : (
          <div className="space-y-2">
            {tables.map((table: any) => (
              <button
                key={table.id}
                onClick={() => handleTableSelect(table.id)}
                className="w-full text-left px-3 py-2 rounded hover:bg-blue-50 border border-gray-200 flex items-center gap-2"
              >
                <Table className="w-4 h-4 text-blue-500" />
                <span>{table.name}</span>
                <span className="text-xs text-gray-400">({table.recordCount} records)</span>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="table-block" onClick={onFocus}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2 bg-gray-50 px-3 py-2 rounded-t-lg border">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-blue-500" />
          <span className="font-medium text-sm">{tableData?.name || 'Loading...'}</span>
        </div>
        
        <div className="flex items-center gap-1">
          {/* View Switcher */}
          <button
            onClick={() => handleViewChange('table')}
            className={`p-1.5 rounded ${view === 'table' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
          >
            <Table className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleViewChange('kanban')}
            className={`p-1.5 rounded ${view === 'kanban' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleViewChange('calendar')}
            className={`p-1.5 rounded ${view === 'calendar' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
          >
            <Calendar className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleViewChange('gantt')}
            className={`p-1.5 rounded ${view === 'gantt' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
          >
            <GanttChart className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setShowTableSelect(true)}
            className="p-1.5 rounded hover:bg-gray-200 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {tableLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="border rounded-b-lg">
          {view === 'table' && <TableView table={tableData} />}
          {view === 'kanban' && <KanbanView table={tableData} />}
          {view === 'calendar' && <CalendarView table={tableData} />}
          {view === 'gantt' && <GanttView table={tableData} />}
        </div>
      )}
    </div>
  )
}

function TableView({ table }: { table: any }) {
  if (!table?.columns || !table?.records) {
    return <div className="p-4 text-center text-gray-400">No data</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            {table.columns.map((col: any) => (
              <th key={col.id} className="px-3 py-2 text-left font-medium text-gray-600 border-b">
                {col.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.records.map((record: any, idx: number) => (
            <tr key={record.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {table.columns.map((col: any) => (
                <td key={col.id} className="px-3 py-2 border-b">
                  <CellValue column={col} value={record[col.id]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function KanbanView({ table }: { table: any }) {
  const statusColumn = table?.columns?.find((c: any) => c.type === 'select')
  const statusOptions = statusColumn?.options || ['todo', 'in_progress', 'done']
  
  const statusLabels: Record<string, string> = {
    todo: 'To Do',
    in_progress: 'In Progress',
    done: 'Done'
  }

  const statusColors: Record<string, string> = {
    todo: 'bg-gray-100 border-gray-300',
    in_progress: 'bg-yellow-50 border-yellow-300',
    done: 'bg-green-50 border-green-300'
  }

  return (
    <div className="flex gap-2 p-2 overflow-x-auto min-h-[200px]">
      {statusOptions.map((status: string) => (
        <div key={status} className={`flex-1 min-w-[200px] rounded p-2 ${statusColors[status] || 'bg-gray-100'}`}>
          <h4 className="font-medium text-sm mb-2">
            {statusLabels[status] || status}
            <span className="ml-1 text-gray-400 font-normal">
              ({table?.records?.filter((r: any) => r[statusColumn?.id] === status).length || 0})
            </span>
          </h4>
          <div className="space-y-1">
            {table?.records?.filter((r: any) => r[statusColumn?.id] === status).map((record: any) => (
              <div key={record.id} className="bg-white rounded p-2 shadow-sm border text-xs">
                <p className="font-medium">{record.title || record.name}</p>
                {record.assignee && <p className="text-gray-500 mt-1">👤 {record.assignee}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function CalendarView({ table }: { table: any }) {
  const dateColumn = table?.columns?.find((c: any) => c.type === 'date')
  
  if (!dateColumn) {
    return <div className="p-4 text-center text-gray-400">No date column found</div>
  }

  const recordsByDate = table?.records?.reduce((acc: any, record: any) => {
    const date = record[dateColumn.id]
    if (!acc[date]) acc[date] = []
    acc[date].push(record)
    return acc
  }, {}) || {}

  const today = new Date()
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    return d.toISOString().split('T')[0]
  })

  return (
    <div className="p-2">
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-xs text-center text-gray-500 py-1">{day}</div>
        ))}
        {days.map(date => {
          const records = recordsByDate[date] || []
          return (
            <div key={date} className="min-h-[60px] border rounded p-1">
              <div className="text-xs text-gray-400 mb-1">
                {new Date(date).getDate()}
              </div>
              {records.slice(0, 2).map((record: any) => (
                <div key={record.id} className="text-xs truncate bg-blue-100 rounded px-1 mb-0.5">
                  {record.title || record.name}
                </div>
              ))}
              {records.length > 2 && (
                <div className="text-xs text-gray-400">+{records.length - 2} more</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function GanttView({ table }: { table: any }) {
  const dateColumn = table?.columns?.find((c: any) => c.type === 'date')
  const titleColumn = table?.columns?.find((c: any) => c.type === 'text')
  
  if (!dateColumn) {
    return <div className="p-4 text-center text-gray-400">No date column found</div>
  }

  const records = table?.records || []
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return d.toISOString().split('T')[0]
  })

  return (
    <div className="p-2 overflow-x-auto">
      <div className="flex">
        {/* Labels */}
        <div className="w-32 flex-shrink-0">
          <div className="h-8 border-b"></div>
          {records.map((record: any) => (
            <div key={record.id} className="h-8 border-b flex items-center text-xs truncate pr-2">
              {record.title || record.name || 'Untitled'}
            </div>
          ))}
        </div>
        
        {/* Timeline */}
        <div className="flex-1">
          <div className="flex">
            {days.map(date => (
              <div key={date} className="w-12 text-xs text-center border-b py-1">
                {new Date(date).getDate()}
              </div>
            ))}
          </div>
          {records.map((record: any) => (
            <div key={record.id} className="h-8 border-b flex items-center relative">
              {(() => {
                const recordDate = record[dateColumn.id]
                const dayIndex = days.indexOf(recordDate)
                if (dayIndex >= 0) {
                  return (
                    <div 
                      className="absolute h-5 bg-blue-400 rounded" 
                      style={{ left: `${dayIndex * 48 + 8}px`, width: '48px' }}
                    >
                    </div>
                  )
                }
                return null
              })()}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CellValue({ column, value }: { column: any; value: any }) {
  if (column.type === 'select') {
    const colorMap: Record<string, string> = {
      done: 'bg-green-100 text-green-700',
      in_progress: 'bg-yellow-100 text-yellow-700',
      todo: 'bg-gray-100 text-gray-700',
      high: 'bg-red-100 text-red-700',
      medium: 'bg-orange-100 text-orange-700',
      low: 'bg-blue-100 text-blue-700'
    }
    return (
      <span className={`px-2 py-0.5 rounded text-xs ${colorMap[value] || 'bg-gray-100'}`}>
        {value?.replace('_', ' ')}
      </span>
    )
  }
  
  if (column.type === 'date') {
    return <span className="text-xs">{value}</span>
  }
  
  return <span>{value}</span>
}