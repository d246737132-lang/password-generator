import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
}

const colors = {
  success: 'bg-success-color',
  error: 'bg-error-color',
  warning: 'bg-warning-color',
  info: 'bg-primary',
}

function Toast({ message, type = 'success' }) {
  const Icon = icons[type]
  const color = colors[type]

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
      <div className={`
        flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg
        ${color} text-white min-w-[200px] max-w-[300px]
      `}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  )
}

export default Toast