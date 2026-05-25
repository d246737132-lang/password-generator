import { useState } from 'react'
import { Shield, ListTodo, Sparkles } from 'lucide-react'
import PasswordGenerator from './components/PasswordGenerator'
import TodoList from './components/TodoList'
import Toast from './components/Toast'

const tools = [
  { id: 'password', name: '密码生成器', icon: Shield },
  { id: 'todo', name: '待办清单', icon: ListTodo },
]

function App() {
  const [activeTool, setActiveTool] = useState('password')
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }

  const renderTool = () => {
    switch (activeTool) {
      case 'password':
        return <PasswordGenerator onToast={addToast} />
      case 'todo':
        return <TodoList onToast={addToast} />
      default:
        return <PasswordGenerator onToast={addToast} />
    }
  }

  return (
    <div className="min-h-screen">
      <header className="bg-secondary/80 backdrop-blur-lg border-b border-border-color sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-lg shadow-primary/25">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary-light">生活效率工具箱</h1>
                <p className="text-xs text-text-muted">Life Efficiency Toolbox</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-secondary/50 backdrop-blur-sm border-b border-border-color">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-2 py-2">
            {tools.map((tool) => {
              const Icon = tool.icon
              const isActive = activeTool === tool.id
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300
                    ${isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                      : 'text-text-secondary hover:bg-card hover:text-text-primary'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{tool.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-fadeIn">
          {renderTool()}
        </div>
      </main>

      <footer className="mt-auto py-6 text-center text-text-muted text-sm">
        <p>Made with ❤️ - 生活效率工具箱</p>
      </footer>

      {toasts.map(toast => (
        <Toast key={toast.id} message={toast.message} type={toast.type} />
      ))}
    </div>
  )
}

export default App