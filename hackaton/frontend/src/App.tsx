import { useState, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { Editor } from './components/Editor'
import { TablesPanel } from './components/TablesPanel'
import { TutorialPage } from './components/TutorialPage'

function App() {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)
  const [showTables, setShowTables] = useState(false)
  const [showTutorial, setShowTutorial] = useState(true)

  // Check if user has completed tutorial (in real app, this would be in localStorage or backend)
  useEffect(() => {
    const tutorialCompleted = localStorage.getItem('tutorialCompleted')
    if (tutorialCompleted === 'true') {
      setShowTutorial(false)
    }
  }, [])

  const handleTutorialComplete = () => {
    localStorage.setItem('tutorialCompleted', 'true')
    setShowTutorial(false)
  }

  if (showTutorial) {
    return <TutorialPage onComplete={handleTutorialComplete} />
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        selectedDocument={selectedDocument}
        onSelectDocument={setSelectedDocument}
      />
      
      <main className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b px-6 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-800">
                WikiLive
              </h1>
              <nav className="hidden md:flex items-center gap-1">
                <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded transition">
                  Home
                </button>
                <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded transition">
                  Spaces
                </button>
                <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded transition">
                  Create
                </button>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowTutorial(true)}
                className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded transition"
                title="View Tutorial"
              >
                📚 Tutorial
              </button>
              <button
                onClick={() => setShowTables(!showTables)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-sm"
              >
                {showTables ? 'Hide Tables' : 'Show Tables'}
              </button>
            </div>
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
