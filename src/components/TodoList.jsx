import { useState, useEffect, useCallback } from 'react';
import { Plus, Check, Trash2, Edit3, Save, X, Download, ListTodo, Filter, Calendar, Tag } from 'lucide-react';
const STORAGE_KEY = 'todo-list-data';
function TodoList({ onToast }) {
 const [todos, setTodos] = useState([]);
 const [inputValue, setInputValue] = useState('');
 const [editingId, setEditingId] = useState(null);
 const [editingValue, setEditingValue] = useState('');
 const [filter, setFilter] = useState('all');
 const [isLoading, setIsLoading] = useState(true);
 useEffect(() => {
 const saved = localStorage.getItem(STORAGE_KEY);
 if (saved) {
 setTimeout(() => {
 setTodos(JSON.parse(saved));
 setIsLoading(false);
 }, 500);
 }
 else {
 setIsLoading(false);
 }
 }, []);
 useEffect(() => {
 if (!isLoading && todos.length > 0) {
 localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
 }
 }, [todos, isLoading]);
 const addTodo = useCallback(() => {
 if (!inputValue.trim()) {
 onToast('请输入待办事项', 'warning');
 return;
 }
 const newTodo = {
 id: Date.now(),
 text: inputValue.trim(),
 completed: false,
 createdAt: new Date().toISOString(),
 };
 setTodos(prev => [newTodo, ...prev]);
 setInputValue('');
 onToast('待办事项已添加', 'success');
 }, [inputValue, onToast]);
 const toggleTodo = useCallback((id) => {
 setTodos(prev => prev.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
 }, []);
 const deleteTodo = useCallback((id) => {
 setTodos(prev => prev.filter(todo => todo.id !== id));
 onToast('待办事项已删除', 'info');
 }, [onToast]);
 const startEdit = useCallback((todo) => {
 setEditingId(todo.id);
 setEditingValue(todo.text);
 }, []);
 const saveEdit = useCallback((id) => {
 if (!editingValue.trim()) {
 onToast('请输入内容', 'warning');
 return;
 }
 setTodos(prev => prev.map(todo => todo.id === id ? { ...todo, text: editingValue.trim() } : todo));
 setEditingId(null);
 setEditingValue('');
 onToast('待办事项已更新', 'success');
 }, [editingValue, onToast]);
 const cancelEdit = useCallback(() => {
 setEditingId(null);
 setEditingValue('');
 }, []);
 const clearCompleted = useCallback(() => {
 const completedCount = todos.filter(todo => todo.completed).length;
 if (completedCount === 0) {
 onToast('没有已完成的待办事项', 'info');
 return;
 }
 setTodos(prev => prev.filter(todo => !todo.completed));
 onToast(`已清除 ${completedCount} 个已完成事项`, 'success');
 }, [todos, onToast]);
 const exportTodos = useCallback(() => {
 const data = JSON.stringify(todos, null, 2);
 const blob = new Blob([data], { type: 'application/json' });
 const url = URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = url;
 a.download = `todos-${new Date().toISOString().split('T')[0]}.json`;
 a.click();
 URL.revokeObjectURL(url);
 onToast('待办数据已导出', 'success');
 }, [todos, onToast]);
 const filteredTodos = todos.filter(todo => {
 if (filter === 'all')
 return true;
 if (filter === 'active')
 return !todo.completed;
 if (filter === 'completed')
 return todo.completed;
 return true;
 });
 const stats = {
 total: todos.length,
 active: todos.filter(t => !t.completed).length,
 completed: todos.filter(t => t.completed).length,
 };
 const handleKeyDown = (e) => {
 if (e.key === 'Enter' && !editingId) {
 addTodo();
 }
 if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
 e.preventDefault();
 document.querySelector('input.todo-input')?.focus();
 }
 if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
 e.preventDefault();
 exportTodos();
 }
 };
 useEffect(() => {
 window.addEventListener('keydown', handleKeyDown);
 return () => window.removeEventListener('keydown', handleKeyDown);
 }, [addTodo, editingId, exportTodos]);
 return (<div className="max-w-2xl mx-auto">
 <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border-color overflow-hidden">
 <div className="bg-gradient-to-r from-primary/20 to-primary-dark/20 px-6 py-4 border-b border-border-color">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-success-color to-green-400 flex items-center justify-center">
 <ListTodo className="w-6 h-6 text-white"/>
 </div>
 <div>
 <h2 className="text-xl font-bold">待办清单</h2>
 <p className="text-sm text-text-secondary">管理你的日常任务</p>
 </div>
 </div>
 <button onClick={exportTodos} className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-card rounded-lg transition-all duration-300 hover:scale-105" title="Ctrl+E 导出">
 <Download className="w-4 h-4"/>
 <span className="text-sm">导出</span>
 </button>
 </div>
 </div>

 <div className="p-6">
 <div className="flex gap-3 mb-6">
 <div className="flex-1 relative">
 <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="添加新的待办事项..." className="todo-input w-full px-4 py-3 bg-secondary/50 border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"/>
 </div>
 <button onClick={addTodo} className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30">
 <Plus className="w-5 h-5"/>
 </button>
 </div>

 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center gap-4">
 {[{ key: 'all', label: '全部' }, { key: 'active', label: '待完成' }, { key: 'completed', label: '已完成' }].map(item => (<button key={item.key} onClick={() => setFilter(item.key)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${filter === item.key
 ? 'bg-primary text-white'
 : 'text-text-secondary hover:text-text-primary hover:bg-secondary'}`}>
 {item.label}
 </button>))}
 </div>
 <button onClick={clearCompleted} className="text-sm text-text-muted hover:text-error-color transition-colors flex items-center gap-1">
 <Trash2 className="w-4 h-4"/>
 清除已完成
 </button>
 </div>

 <div className="flex items-center gap-4 mb-4 px-4 py-2 bg-secondary/30 rounded-xl">
 <div className="flex items-center gap-2">
 <Tag className="w-4 h-4 text-text-muted"/>
 <span className="text-sm text-text-secondary">
 <span className="font-medium text-text-primary">{stats.total}</span> 项任务
 </span>
 </div>
 <div className="flex items-center gap-2">
 <Calendar className="w-4 h-4 text-text-muted"/>
 <span className="text-sm text-text-secondary">
 <span className="font-medium text-success-color">{stats.completed}</span> 已完成
 <span className="mx-2">|</span>
 <span className="font-medium text-primary-light">{stats.active}</span> 待完成
 </span>
 </div>
 </div>

 {isLoading ? (<div className="flex items-center justify-center py-12">
 <div className="relative">
 <div className="w-10 h-10 border-4 border-primary/20 rounded-full"></div>
 <div className="absolute top-0 left-0 w-10 h-10 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
 </div>
 </div>) : filteredTodos.length === 0 ? (<div className="text-center py-12">
 <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center">
 <Filter className="w-10 h-10 text-text-muted"/>
 </div>
 <p className="text-text-secondary">暂无待办事项</p>
 <p className="text-sm text-text-muted mt-1">点击上方输入框添加新任务</p>
 </div>) : (<div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
 {filteredTodos.map((todo, index) => (<div key={todo.id} className={`group flex items-center gap-3 p-4 rounded-xl transition-all duration-300 animate-fadeIn ${todo.completed
 ? 'bg-secondary/30'
 : 'bg-secondary/50 hover:bg-secondary'} ${index % 2 === 0 ? 'animate-fadeIn' : 'animate-slideIn'}`} style={{ animationDelay: `${index * 50}ms` }}>
 <button onClick={() => toggleTodo(todo.id)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${todo.completed
 ? 'bg-success-color border-success-color'
 : 'border-border-color hover:border-primary'}`}>
 {todo.completed && <Check className="w-4 h-4 text-white"/>}
 </button>

 {editingId === todo.id ? (<div className="flex-1 flex items-center gap-2">
 <input type="text" value={editingValue} onChange={(e) => setEditingValue(e.target.value)} className="flex-1 px-3 py-2 bg-card border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" autoFocus onKeyDown={(e) => {
 if (e.key === 'Enter')
 saveEdit(todo.id);
 if (e.key === 'Escape')
 cancelEdit();
 }}/>
 <button onClick={() => saveEdit(todo.id)} className="p-2 text-success-color hover:bg-success-color/20 rounded-lg transition-colors">
 <Save className="w-4 h-4"/>
 </button>
 <button onClick={cancelEdit} className="p-2 text-text-muted hover:text-error-color hover:bg-error-color/20 rounded-lg transition-colors">
 <X className="w-4 h-4"/>
 </button>
 </div>) : (<span className={`flex-1 text-base ${todo.completed ? 'line-through text-text-muted' : 'text-text-primary'}`}>
 {todo.text}
 </span>)}

 {editingId !== todo.id && (<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
 <button onClick={() => startEdit(todo)} className="p-2 text-text-muted hover:text-primary hover:bg-primary/20 rounded-lg transition-colors">
 <Edit3 className="w-4 h-4"/>
 </button>
 <button onClick={() => deleteTodo(todo.id)} className="p-2 text-text-muted hover:text-error-color hover:bg-error-color/20 rounded-lg transition-colors">
 <Trash2 className="w-4 h-4"/>
 </button>
 </div>)}
 </div>))}
 </div>)}
 </div>
 </div>
 </div>);
}
export default TodoList;
