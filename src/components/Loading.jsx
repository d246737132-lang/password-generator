function Loading() {
  return (
    <div className="flex items-center justify-center gap-3 py-8">
      <div className="relative">
        <div className="w-8 h-8 border-4 border-primary/20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-8 h-8 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
      </div>
      <span className="text-text-secondary">加载中...</span>
    </div>
  )
}

export default Loading