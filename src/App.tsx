/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import zxcvbn from 'zxcvbn';
import { Shield, Eye, EyeOff, Info, Github, Lock, Search } from 'lucide-react';
import { StrengthMeter } from './components/StrengthMeter';
import { BreachStatus } from './components/BreachStatus';
import { PasswordGenerator } from './components/PasswordGenerator';
import { motion } from 'motion/react';

export default function App() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const strengthResult = useMemo(() => {
    return password ? zxcvbn(password) : null;
  }, [password]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navigation Bar */}
      <nav className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center shadow-lg shadow-indigo-100">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-xl tracking-tighter text-slate-800 uppercase">
            FORTRESS<span className="text-indigo-600">VAULT</span>
          </span>
        </div>
        <div className="hidden md:flex gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
          <a href="#" className="text-indigo-600 border-b-2 border-indigo-600 py-5 transition-all">Analyzer</a>
          <a href="#" className="hover:text-slate-800 py-5 transition-all">Breach Monitor</a>
          <a href="#" className="hover:text-slate-800 py-5 transition-all">API Security</a>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-100 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
          Status: Secure
        </div>
      </nav>

      <main className="flex-1 p-8 xl:p-12 max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Section: Password Analysis */}
        <section className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-10 shadow-sm flex-1 flex flex-col min-h-[600px]">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Strength Analyzer</h2>
              <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest text-[11px]">Real-time entropy & complexity evaluation</p>
            </div>

            <div className="relative mb-12">
              <input 
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Type password sequence..."
                className="w-full h-20 bg-slate-50 border-2 border-indigo-50 rounded-2xl px-8 text-2xl font-mono focus:outline-none focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 transition-all shadow-inner text-slate-800 placeholder:text-slate-200" 
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 p-3 text-slate-300 hover:text-indigo-600 bg-white border border-slate-100 rounded-xl shadow-sm transition-all"
              >
                {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
              </button>
            </div>

            <div className="flex-1">
              <StrengthMeter result={strengthResult} />
            </div>

            {password && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap items-center gap-6 text-[10px] uppercase font-black text-slate-400 tracking-[0.25em]"
              >
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                   Analysis: Verified
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                   Method: zxcvbn
                </div>
                <div className="flex-1"></div>
                <div className="flex items-center gap-1.5 opacity-60">
                   <Info className="w-3 h-3" />
                   Calculations performed client-side
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Right Section: Utilities */}
        <aside className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 sticky top-28">
          
          <PasswordGenerator 
            onGenerate={(pwd) => {
              setPassword(pwd);
              setShowPassword(true);
            }} 
          />

          <BreachStatus password={password} />

          <div className="bg-white border rounded-2xl p-6 shadow-sm">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Search className="w-3 h-3" />
                Intelligence Reports
             </h3>
             <div className="space-y-4">
                <div className="flex gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 shrink-0"></div>
                   <p className="text-[11px] font-medium text-slate-500 leading-relaxed uppercase tracking-tighter">
                      <span className="text-slate-900 font-bold">K-Anonymity Protocol:</span> Only SHA-1 hash prefixes are sent for breach checks. 
                   </p>
                </div>
                <div className="flex gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 shrink-0"></div>
                   <p className="text-[11px] font-medium text-slate-500 leading-relaxed uppercase tracking-tighter">
                      <span className="text-slate-900 font-bold">Audit Status:</span> Local calculations ensure your plain-text never logs.
                   </p>
                </div>
             </div>
          </div>
        </aside>
      </main>

      <footer className="h-16 bg-white border-t border-slate-200 px-8 flex flex-col md:flex-row items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] py-4">
        <div className="flex gap-6 items-center">
          <span className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5" /> Zero-Trust Encryption
          </span>
          <span className="hidden md:inline text-slate-200">|</span>
          <span className="hidden md:inline">Open-Source Shield</span>
        </div>
        <div className="flex gap-8 items-center mt-2 md:mt-0">
          <span className="flex items-center gap-1"><Github className="w-3 h-3" /> GitHub</span>
          <span className="text-slate-200">•</span>
          <span>© 2026 Fortress Security Lab</span>
          <span className="text-slate-200">•</span>
          <span className="text-indigo-600 cursor-pointer hover:underline">Compliance</span>
        </div>
      </footer>
    </div>
  );
}
