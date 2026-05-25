import { useState, useEffect, useCallback } from 'react';
import { Calculator as CalculatorIcon, Delete, RotateCcw } from 'lucide-react';
export default function Calculator({ onToast }) {
 const [display, setDisplay] = useState('0');
 const [storedValue, setStoredValue] = useState(null);
 const [operator, setOperator] = useState(null);
 const [waitingForOperand, setWaitingForOperand] = useState(true);
 const handleDigit = useCallback((digit) => {
 if (waitingForOperand) {
 setDisplay(digit);
 setWaitingForOperand(false);
 }
 else {
 setDisplay(prev => prev === '0' ? digit : prev + digit);
 }
 }, [waitingForOperand]);
 const handleOperator = useCallback((nextOperator) => {
 const inputValue = parseFloat(display);
 if (storedValue === null) {
 setStoredValue(inputValue);
 }
 else if (operator) {
 const result = calculate(storedValue, inputValue, operator);
 setDisplay(String(result));
 setStoredValue(result);
 }
 setWaitingForOperand(true);
 setOperator(nextOperator);
 }, [display, storedValue, operator]);
 const calculate = (num1, num2, op) => {
 switch (op) {
 case '+': return num1 + num2;
 case '-': return num1 - num2;
 case '*': return num1 * num2;
 case '/': return num1 / num2;
 default: return num2;
 }
 };
 const handleEquals = useCallback(() => {
 if (storedValue !== null && operator !== null) {
 const inputValue = parseFloat(display);
 const result = calculate(storedValue, inputValue, operator);
 setDisplay(String(result));
 setStoredValue(null);
 setOperator(null);
 setWaitingForOperand(true);
 onToast('计算完成！', 'success');
 }
 }, [display, storedValue, operator, onToast]);
 const handleDecimal = useCallback(() => {
 if (waitingForOperand) {
 setDisplay('0.');
 setWaitingForOperand(false);
 }
 else if (!display.includes('.')) {
 setDisplay(prev => prev + '.');
 }
 }, [waitingForOperand, display]);
 const handleClear = useCallback(() => {
 setDisplay('0');
 setStoredValue(null);
 setOperator(null);
 setWaitingForOperand(true);
 }, []);
 const handleDelete = useCallback(() => {
 if (display.length > 1) {
 setDisplay(prev => prev.slice(0, -1));
 }
 else {
 setDisplay('0');
 }
 }, [display]);
 const handleSign = useCallback(() => {
 setDisplay(prev => prev.startsWith('-') ? prev.slice(1) : '-' + prev);
 }, [display]);
 const handlePercentage = useCallback(() => {
 const inputValue = parseFloat(display);
 setDisplay(String(inputValue / 100));
 }, [display]);
 const buttons = [
 { label: 'C', color: 'warning', action: handleClear, icon: RotateCcw },
 { label: '⌫', color: 'secondary', action: handleDelete, icon: Delete },
 { label: '%', color: 'secondary', action: handlePercentage },
 { label: '/', color: 'primary', action: () => handleOperator('/') },
 { label: '7', color: 'default', action: () => handleDigit('7') },
 { label: '8', color: 'default', action: () => handleDigit('8') },
 { label: '9', color: 'default', action: () => handleDigit('9') },
 { label: '×', color: 'primary', action: () => handleOperator('*') },
 { label: '4', color: 'default', action: () => handleDigit('4') },
 { label: '5', color: 'default', action: () => handleDigit('5') },
 { label: '6', color: 'default', action: () => handleDigit('6') },
 { label: '-', color: 'primary', action: () => handleOperator('-') },
 { label: '1', color: 'default', action: () => handleDigit('1') },
 { label: '2', color: 'default', action: () => handleDigit('2') },
 { label: '3', color: 'default', action: () => handleDigit('3') },
 { label: '+', color: 'primary', action: () => handleOperator('+') },
 { label: '+/-', color: 'secondary', action: handleSign },
 { label: '0', color: 'default', action: () => handleDigit('0'), wide: true },
 { label: '.', color: 'secondary', action: handleDecimal },
 { label: '=', color: 'success', action: handleEquals },
 ];
 useEffect(() => {
 const handleKeyDown = (e) => {
 if (e.key >= '0' && e.key <= '9') {
 handleDigit(e.key);
 }
 else if (e.key === '.') {
 handleDecimal();
 }
 else if (['+', '-', '*', '/'].includes(e.key)) {
 handleOperator(e.key);
 }
 else if (e.key === '=' || e.key === 'Enter') {
 e.preventDefault();
 handleEquals();
 }
 else if (e.key === 'Escape') {
 handleClear();
 }
 else if (e.key === 'Backspace') {
 handleDelete();
 }
 };
 window.addEventListener('keydown', handleKeyDown);
 return () => window.removeEventListener('keydown', handleKeyDown);
 }, [handleDigit, handleDecimal, handleOperator, handleEquals, handleClear, handleDelete]);
 return (<div className="animate-fadeIn">
 <div className="card">
 <div className="card-header">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
 <CalculatorIcon className="w-5 h-5 text-white"/>
 </div>
 <div>
 <h2 className="card-title">简易计算器</h2>
 <p className="card-subtitle">支持键盘输入和鼠标操作</p>
 </div>
 </div>
 </div>

 <div className="calculator">
 <div className="calculator-display">
 <div className="display-value">{display}</div>
 {storedValue !== null && (<div className="display-memory">
 {storedValue} {operator}
 </div>)}
 </div>

 <div className="calculator-buttons">
 {buttons.map((btn, index) => {
 const Icon = btn.icon;
 return (<button key={index} onClick={btn.action} className={`calculator-btn calculator-btn-${btn.color} ${btn.wide ? 'calculator-btn-wide' : ''}`}>
 {Icon && <Icon className="w-4 h-4"/>}
 {!Icon && btn.label}
 </button>);
 })}
 </div>
 </div>

 <div className="mt-4 p-3 bg-card/50 rounded-lg">
 <p className="text-xs text-text-muted text-center">
 快捷键: 数字键输入 | + - * / 运算符 | Enter 等于 | Esc 清除 | Backspace 删除
 </p>
 </div>
 </div>
 </div>);
}

