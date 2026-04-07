import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { Editor } from './components/Editor'
import { TablesPanel } from './components/TablesPanel'

function App() {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)
  const [showTables, setShowTables] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        selectedDocument={selectedDocument}
        onSelectDocument={setSelectedDocument}
      />
      
      <main className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b px-4 py-2 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">
              WikiLive
            </h1>
            <button
              onClick={() => setShowTables(!showTables)}
              className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              {showTables ? 'Hide Tables' : 'Show Tables'}
            </button>
          </header>
          
          <div className="flex-1 overflow-hidden">
            <Editor documentId={selectedDocument} />
          </div>
        </div>
        
        {showTables && (
          <TablesPanel onClose={() => setShowTables(false)} />
        )}
      </main>
    </div>
  )
}

export default App
