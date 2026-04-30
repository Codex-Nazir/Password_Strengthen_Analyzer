import React, { useState } from 'react';
import { RefreshCw, Copy, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface GeneratorProps {
  onGenerate: (pwd: string) => void;
}

export const PasswordGenerator: React.FC<GeneratorProps> = ({ onGenerate }) => {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const [generatedPwd, setGeneratedPwd] = useState('');

  const generate = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    let chars = lowercase;
    if (includeUppercase) chars += uppercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    let result = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      result += chars.charAt(array[i] % chars.length);
    }

    setGeneratedPwd(result);
    onGenerate(result);
  };

  const copyToClipboard = () => {
    if (!generatedPwd) return;
    navigator.clipboard.writeText(generatedPwd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col">
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Password Generator</h3>
      
      <div className="flex items-center justify-between gap-4 mb-6">
        <span className="text-xs font-bold text-slate-600 uppercase tracking-widest leading-none">Length</span>
        <input 
          type="range" 
          min="8"
          max="64"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="accent-indigo-600 flex-1 h-1 bg-slate-100 rounded-full appearance-none cursor-pointer" 
        />
        <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-[10px] font-mono font-bold w-10 text-center">{length}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <label className={cn(
          "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest cursor-pointer p-3 rounded-xl border transition-all",
          includeSymbols ? "bg-indigo-50 border-indigo-100 text-indigo-700" : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100"
        )}>
          <input 
            type="checkbox" 
            checked={includeSymbols} 
            onChange={(e) => setIncludeSymbols(e.target.checked)}
            className="rounded-sm border-slate-300 text-indigo-600 focus:ring-0 w-3 h-3" 
          /> Symbols
        </label>
        <label className={cn(
          "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest cursor-pointer p-3 rounded-xl border transition-all",
          includeNumbers ? "bg-indigo-50 border-indigo-100 text-indigo-700" : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100"
        )}>
          <input 
            type="checkbox" 
            checked={includeNumbers} 
            onChange={(e) => setIncludeNumbers(e.target.checked)}
            className="rounded-sm border-slate-300 text-indigo-600 focus:ring-0 w-3 h-3" 
          /> Numbers
        </label>
        <label className={cn(
          "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest cursor-pointer p-3 rounded-xl border transition-all",
          includeUppercase ? "bg-indigo-50 border-indigo-100 text-indigo-700" : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100"
        )}>
          <input 
            type="checkbox" 
            checked={includeUppercase} 
            onChange={(e) => setIncludeUppercase(e.target.checked)}
            className="rounded-sm border-slate-300 text-indigo-600 focus:ring-0 w-3 h-3" 
          /> Caps
        </label>
        <button 
          onClick={copyToClipboard}
          disabled={!generatedPwd}
          className={cn(
            "flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest cursor-pointer p-3 rounded-xl border transition-all",
            copied ? "bg-emerald-50 border-emerald-100 text-emerald-700 font-black shadow-inner" : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
          )}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <button 
        onClick={generate}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-[0.25em] py-4 rounded-xl transition-all shadow-xl shadow-indigo-100 active:scale-95 flex items-center justify-center gap-3 group"
      >
        <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
        Generate Secure
      </button>
    </div>
  );
};
