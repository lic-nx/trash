import { useState } from 'react'
import { Book, ChevronRight, CheckCircle, Lightbulb, Table, Link, Edit3, Search, Users, Zap } from 'lucide-react'

export function TutorialPage({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const steps = [
    {
      title: 'Welcome to WikiLive',
      icon: <Book className="w-8 h-8 text-blue-500" />,
      description: 'Your collaborative workspace for documentation and data management',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            WikiLive combines the power of Confluence-style documentation with live database tables.
            Create beautiful documents, embed interactive tables, and link data directly in your content.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <Edit3 className="w-6 h-6 text-blue-500 mb-2" />
              <h4 className="font-semibold text-blue-700">Rich Editor</h4>
              <p className="text-sm text-blue-600">Block-based editing with multiple content types</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <Table className="w-6 h-6 text-green-500 mb-2" />
              <h4 className="font-semibold text-green-700">Live Tables</h4>
              <p className="text-sm text-green-600">Embed and edit database tables directly in documents</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <Link className="w-6 h-6 text-purple-500 mb-2" />
              <h4 className="font-semibold text-purple-700">Cell Linking</h4>
              <p className="text-sm text-purple-600">Reference table cells in your text with @mentions</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <Zap className="w-6 h-6 text-orange-500 mb-2" />
              <h4 className="font-semibold text-orange-700">Real-time Sync</h4>
              <p className="text-sm text-orange-600">Changes sync instantly across all viewers</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Creating Documents',
      icon: <Edit3 className="w-8 h-8 text-green-500" />,
      description: 'Learn how to create and edit documents',
      content: (
        <div className="space-y-4">
          <ol className="list-decimal list-inside space-y-3 text-gray-600">
            <li>Click <strong>"New Document"</strong> in the sidebar to create a new document</li>
            <li>Click on the title area to give your document a meaningful name</li>
            <li>Start typing in the content area or type <code className="bg-gray-100 px-2 py-0.5 rounded">/</code> to open the block menu</li>
            <li>Choose from various block types: Text, Headings, Lists, Code, Tables, and more</li>
            <li>Use arrow keys to navigate between blocks</li>
            <li>Your changes are auto-saved every second</li>
          </ol>
          <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <p className="text-sm text-yellow-700">
              <strong>Pro Tip:</strong> Type <code className="bg-white px-2 py-0.5 rounded">/</code> anywhere in an empty paragraph to quickly insert different block types!
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Working with Tables',
      icon: <Table className="w-8 h-8 text-purple-500" />,
      description: 'Embed and interact with live database tables',
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-700">Creating a Table Block:</h4>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Type <code className="bg-gray-100 px-2 py-0.5 rounded">/table</code> or select "Live Table" from the block menu</li>
            <li>Click <strong>"Create new table"</strong> to make a new table, or select an existing one</li>
            <li>Give your table a name when prompted</li>
            <li>The table will be embedded in your document</li>
          </ol>
          
          <h4 className="font-semibold text-gray-700 mt-4">Editing Table Data:</h4>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Click any cell to edit its value</li>
            <li>Press <code className="bg-gray-100 px-2 py-0.5 rounded">Enter</code> to save or <code className="bg-gray-100 px-2 py-0.5 rounded">Escape</code> to cancel</li>
            <li>Changes are automatically saved to the database</li>
            <li>Switch between Table, Kanban, Calendar, and Gantt views using the buttons in the table header</li>
          </ul>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h5 className="font-semibold text-blue-700 mb-2">Available Views:</h5>
            <div className="grid grid-cols-2 gap-2 text-sm text-blue-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded"></div>
                <span><strong>Table:</strong> Traditional spreadsheet view</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded"></div>
                <span><strong>Kanban:</strong> Card-based workflow view</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded"></div>
                <span><strong>Calendar:</strong> Date-based timeline</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded"></div>
                <span><strong>Gantt:</strong> Project timeline view</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Linking to Table Cells',
      icon: <Link className="w-8 h-8 text-orange-500" />,
      description: 'Reference specific data in your documents',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            One of WikiLive's most powerful features is the ability to link to specific table cells 
            directly in your text. This keeps your documentation always up-to-date with the latest data.
          </p>
          
          <h4 className="font-semibold text-gray-700">How to Link:</h4>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Type <code className="bg-gray-100 px-2 py-0.5 rounded">@</code> in any text block</li>
            <li>A popup will show available tables</li>
            <li>Select a table, then choose a specific record and field</li>
            <li>The link will appear as a pill showing the current value</li>
            <li>When the table cell updates, the link automatically reflects the new value!</li>
          </ol>

          <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-400 rounded">
            <p className="text-sm text-green-700">
              <strong>Example:</strong> "The current project status is <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Projects.API Gateway.status: active</span>"
            </p>
          </div>

          <div className="mt-4 p-4 bg-purple-50 rounded-lg">
            <h5 className="font-semibold text-purple-700 mb-2">Use Cases:</h5>
            <ul className="text-sm text-purple-600 space-y-1">
              <li>• Status reports that auto-update</li>
              <li>• Meeting notes with live action items</li>
              <li>• Documentation with current metrics</li>
              <li>• Project plans with real-time progress</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: 'Collaboration Features',
      icon: <Users className="w-8 h-8 text-indigo-500" />,
      description: 'Work together in real-time',
      content: (
        <div className="space-y-4">
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span><strong>Real-time Editing:</strong> Multiple users can edit documents simultaneously</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span><strong>Auto-save:</strong> Never lose your work with automatic saving</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span><strong>Version History:</strong> Track changes over time (coming soon)</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span><strong>Comments:</strong> Add comments to blocks (coming soon)</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      title: 'Ready to Start!',
      icon: <Lightbulb className="w-8 h-8 text-yellow-500" />,
      description: 'You\'re all set to use WikiLive',
      content: (
        <div className="space-y-4 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700">Congratulations!</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            You've completed the tutorial. You're now ready to create amazing documentation 
            with live data integration.
          </p>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-3">Quick Start Checklist:</h4>
            <div className="text-left space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-500 rounded" defaultChecked />
                <span className="text-gray-600">Create your first document</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-500 rounded" defaultChecked />
                <span className="text-gray-600">Embed a table in your document</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-500 rounded" defaultChecked />
                <span className="text-gray-600">Try linking to a table cell with @</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-500 rounded" defaultChecked />
                <span className="text-gray-600">Explore different table views</span>
              </label>
            </div>
          </div>
        </div>
      )
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleJumpToStep = (index: number) => {
    setCurrentStep(index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Book className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">WikiLive Tutorial</h1>
              <p className="text-sm text-gray-500">Learn how to use WikiLive effectively</p>
            </div>
          </div>
          <button
            onClick={onComplete}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
          >
            Skip Tutorial
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-3">
          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => handleJumpToStep(index)}
                className={`flex-1 h-2 rounded-full transition-all ${
                  index <= currentStep 
                    ? 'bg-blue-500' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% complete</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Step Indicator */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                {steps[currentStep].icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
                <p className="text-blue-100">{steps[currentStep].description}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 min-h-[400px]">
            {steps[currentStep].content}
          </div>

          {/* Navigation */}
          <div className="px-8 py-6 bg-gray-50 border-t flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                currentStep === 0
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              ← Previous
            </button>

            <div className="flex items-center gap-2">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleJumpToStep(index)}
                  className={`w-3 h-3 rounded-full transition ${
                    index === currentStep
                      ? 'bg-blue-500 scale-125'
                      : completedSteps.includes(index)
                      ? 'bg-green-400'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Jump to step ${index + 1}`}
                />
              ))}
            </div>

            {currentStep === steps.length - 1 ? (
              <button
                onClick={onComplete}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition shadow-lg"
              >
                Get Started →
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition shadow-lg"
              >
                Next →
              </button>
            )}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <Search className="w-5 h-5 text-blue-500 mb-2" />
            <h4 className="font-semibold text-gray-700">Quick Search</h4>
            <p className="text-sm text-gray-600">Use the search bar to find documents instantly</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <Lightbulb className="w-5 h-5 text-yellow-500 mb-2" />
            <h4 className="font-semibold text-gray-700">Keyboard Shortcuts</h4>
            <p className="text-sm text-gray-600">Type / for commands, Enter for new blocks</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <Table className="w-5 h-5 text-purple-500 mb-2" />
            <h4 className="font-semibold text-gray-700">Multiple Views</h4>
            <p className="text-sm text-gray-600">Switch between Table, Kanban, Calendar & Gantt</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-sm text-gray-500">
        <p>WikiLive v1.0 - Collaborative Documentation Platform</p>
        <p className="mt-1">Built with React, TypeScript, and TailwindCSS</p>
      </footer>
    </div>
  )
}
