import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { X, Table, LayoutGrid, Calendar, GanttChart } from 'lucide-react'
import { api } from '../services/api'

interface TablesPanelProps {
  onClose: () => void
}

type ViewType = 'table' | 'kanban' | 'calendar' | 'gantt'

export function TablesPanel({ onClose }: TablesPanelProps) {
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [view, setView] = useState<ViewType>('table')

  const { data: tables = [], isLoading: tablesLoading } = useQuery({
    queryKey: ['tables'],
    queryFn: async () => {
      const response = await api.get('/api/tables')
      return response.data
    }
  })

  const { data: tableData, isLoading: tableLoading } = useQuery({
    queryKey: ['table', selectedTable],
    queryFn: async () => {
      if (!selectedTable) return null
      const response = await api.get(`/api/tables/${selectedTable}`)
      return response.data
    },
    enabled: !!selectedTable
  })

  return (
    <aside className="w-96 bg-white border-l flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">Live Tables</h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-2 border-b">
          <select
            value={selectedTable || ''}
            onChange={(e) => setSelectedTable(e.target.value || null)}
            className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a table...</option>
            {tablesLoading ? (
              <option disabled>Loading...</option>
            ) : (
              tables.map((table: any) => (
                <option key={table.id} value={table.id}>
                  {table.name} ({table.recordCount} records)
                </option>
              ))
            )}
          </select>
        </div>

        {selectedTable && tableData && (
          <>
            <div className="px-2 py-1 border-b flex gap-1">
              <button
                onClick={() => setView('table')}
                className={`p-1.5 rounded ${view === 'table' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <Table className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('kanban')}
                className={`p-1.5 rounded ${view === 'kanban' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`p-1.5 rounded ${view === 'calendar' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <Calendar className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('gantt')}
                className={`p-1.5 rounded ${view === 'gantt' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <GanttChart className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-2">
              {tableLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
              ) : view === 'table' ? (
                <TableView table={tableData} />
              ) : view === 'kanban' ? (
                <KanbanView table={tableData} />
              ) : (
                <div className="text-center text-gray-400 py-8">
                  {view.charAt(0).toUpperCase() + view.slice(1)} view coming soon
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </aside>
  )
}

function TableView({ table }: { table: any }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            {table.columns?.map((col: any) => (
              <th key={col.id} className="px-2 py-1 text-left font-medium text-gray-600">
                {col.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.records?.map((record: any, idx: number) => (
            <tr key={record.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {table.columns?.map((col: any) => (
                <td key={col.id} className="px-2 py-1 text-gray-800">
                  {col.type === 'select' ? (
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      record[col.id] === 'done' ? 'bg-green-100 text-green-700' :
                      record[col.id] === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {record[col.id]?.replace('_', ' ')}
                    </span>
                  ) : col.type === 'priority' ? (
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      record[col.id] === 'high' ? 'bg-red-100 text-red-700' :
                      record[col.id] === 'medium' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {record[col.id]}
                    </span>
                  ) : (
                    record[col.id]
                  )}
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
  const statusGroups = ['todo', 'in_progress', 'done']
  const statusLabels: Record<string, string> = {
    todo: 'To Do',
    in_progress: 'In Progress',
    done: 'Done'
  }

  return (
    <div className="flex gap-2 h-full">
      {statusGroups.map(status => (
        <div key={status} className="flex-1 bg-gray-100 rounded p-2">
          <h3 className="font-medium text-sm text-gray-700 mb-2">
            {statusLabels[status]} ({table.records?.filter((r: any) => r.status === status).length || 0})
          </h3>
          <div className="space-y-1">
            {table.records?.filter((r: any) => r.status === status).map((record: any) => (
              <div key={record.id} className="bg-white rounded p-2 shadow-sm text-xs">
                <p className="font-medium text-gray-800">{record.title}</p>
                <p className="text-gray-500 mt-1">{record.assignee}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
