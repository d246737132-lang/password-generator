import { useState, useEffect, useCallback } from 'react'
import { Copy, RefreshCw, Check, Shield, Zap, Lock, Eye, EyeOff } from 'lucide-react'

const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}

function PasswordGenerator({ onToast }) {
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [strength, setStrength] = useState(0)

  const generatePassword = useCallback(() => {
    let charset = ''
    if (includeUppercase) charset += CHAR_SETS.uppercase
    if (includeLowercase) charset += CHAR_SETS.lowercase
    if (includeNumbers) charset += CHAR_SETS.numbers
    if (includeSymbols) charset += CHAR_SETS.symbols

    if (!charset) {
      onToast('请至少选择一种字符类型', 'warning')
      return
    }

    let newPassword = ''
    const array = new Uint32Array(length)
    crypto.getRandomValues(array)

    for (let i = 0; i < length; i++) {
      newPassword += charset[array[i] % charset.length]
    }

    setPassword(newPassword)
    calculateStrength(newPassword)
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, onToast])

  const calculateStrength = (pwd) => {
    let score = 0
    if (pwd.length >= 8) score += 1
    if (pwd.length >= 12) score += 1
    if (pwd.length >= 16) score += 1
    if (/[a-z]/.test(pwd)) score += 1
    if (/[A-Z]/.test(pwd)) score += 1
    if (/[0-9]/.test(pwd)) score += 1
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1
    setStrength(Math.min(Math.floor((score / 7) * 100), 100))
  }

  const copyToClipboard = async () => {
    if (!password) {
      onToast('请先生成密码', 'warning')
      return
    }

    try {
      await navigator.clipboard.writeText(password)
      setCopied(true)
      onToast('密码已复制到剪贴板', 'success')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      onToast('复制失败', 'error')
    }
  }

  useEffect(() => {
    generatePassword()
  }, [])

  const getStrengthLabel = () => {
    if (strength < 30) return { label: '弱', color: 'text-error-color' }
    if (strength < 60) return { label: '中等', color: 'text-warning-color' }
    if (strength < 80) return { label: '强', color: 'text-secondary-color' }
    return { label: '极强', color: 'text-success-color' }
  }

  const strengthInfo = getStrengthLabel()

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
      e.preventDefault()
      generatePassword()
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
      e.preventDefault()
      copyToClipboard()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [generatePassword, copyToClipboard])

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border-color overflow-hidden">
        <div className="bg-gradient-to-r from-primary/20 to-primary-dark/20 px-6 py-4 border-b border-border-color">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">密码生成器</h2>
              <p className="text-sm text-text-secondary">生成安全可靠的随机密码</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="relative mb-6">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type={isVisible ? 'text' : 'password'}
                  value={password}
                  readOnly
                  className="w-full px-4 py-4 bg-secondary/50 border border-border-color rounded-xl text-lg font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="点击生成密码"
                />
                <button
                  onClick={() => setIsVisible(!isVisible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-text-muted hover:text-text-primary transition-colors"
                >
                  {isVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={generatePassword}
                  className="px-4 py-4 bg-primary hover:bg-primary-dark text-white rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
                  title="Ctrl+G 生成"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button
                  onClick={copyToClipboard}
                  className={`px-4 py-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                    copied
                      ? 'bg-success-color text-white'
                      : 'bg-secondary hover:bg-card text-text-primary'
                  }`}
                  title="Ctrl+C 复制"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {password && (
              <div className="mt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-text-secondary">密码强度</span>
                  <span className={`text-sm font-medium ${strengthInfo.color}`}>{strengthInfo.label}</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      strength < 30 ? 'bg-error-color' :
                      strength < 60 ? 'bg-warning-color' :
                      strength < 80 ? 'bg-secondary-color' : 'bg-success-color'
                    }`}
                    style={{ width: `${strength}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-text-secondary mb-3">密码长度</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="4"
                max="64"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="flex-1 h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
              />
              <div className="w-16 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-primary-light animate-numberRoll">{length}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-text-secondary">包含字符类型</label>
            {[
              { key: 'uppercase', label: '大写字母', desc: 'A-Z', checked: includeUppercase, setter: setIncludeUppercase },
              { key: 'lowercase', label: '小写字母', desc: 'a-z', checked: includeLowercase, setter: setIncludeLowercase },
              { key: 'numbers', label: '数字', desc: '0-9', checked: includeNumbers, setter: setIncludeNumbers },
              { key: 'symbols', label: '特殊字符', desc: '!@#$%', checked: includeSymbols, setter: setIncludeSymbols },
            ].map((item) => (
              <label
                key={item.key}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                  item.checked ? 'bg-primary/20 border border-primary/50' : 'bg-secondary/50 border border-transparent hover:border-border-color'
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(e) => item.setter(e.target.checked)}
                  className="w-5 h-5 rounded border-border-color bg-secondary accent-primary"
                />
                <div className="flex-1">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-sm text-text-muted ml-2">{item.desc}</span>
                </div>
                {item.checked && <Lock className="w-4 h-4 text-primary" />}
              </label>
            ))}
          </div>

          <div className="mt-6 p-4 bg-secondary/30 rounded-xl">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-secondary-color flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-text-secondary">
                  <span className="font-medium text-text-primary">快捷键：</span>
                  <kbd className="px-2 py-1 bg-secondary rounded text-xs mx-1">Ctrl+G</kbd> 生成密码
                  <kbd className="px-2 py-1 bg-secondary rounded text-xs mx-1">Ctrl+C</kbd> 复制密码
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasswordGenerator