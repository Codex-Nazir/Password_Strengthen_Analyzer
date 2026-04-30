import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, ShieldAlert, Loader2, ArrowRight } from 'lucide-react';
import { sha1 } from '../lib/utils';

interface BreachStatusProps {
  password?: string;
}

export const BreachStatus: React.FC<BreachStatusProps> = ({ password }) => {
  const [loading, setLoading] = useState(false);
  const [breachCount, setBreachCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkBreach = async (pwd: string) => {
    if (!pwd || pwd.length < 1) {
      setBreachCount(null);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const fullHash = await sha1(pwd);
      const prefix = fullHash.substring(0, 5);
      const suffix = fullHash.substring(5);

      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      
      if (!response.ok) throw new Error('Could not check breach status');

      const text = await response.text();
      const lines = text.split('\n');
      
      const foundLine = lines.find(line => line.startsWith(suffix));
      
      if (foundLine) {
        const count = parseInt(foundLine.split(':')[1]);
        setBreachCount(count);
      } else {
        setBreachCount(0);
      }
    } catch (err) {
      console.error(err);
      setError('Check failed. Network error or API down.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (password) checkBreach(password);
    }, 500); // Debounce
    
    return () => clearTimeout(timer);
  }, [password]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex-1 flex flex-col min-h-[340px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Breach Intelligence</h3>
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
        ) : breachCount !== null && breachCount > 0 ? (
          <span className="text-[10px] text-rose-500 font-black animate-pulse px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">CRITICAL</span>
        ) : breachCount === 0 ? (
          <span className="text-[10px] text-emerald-500 font-black px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">SECURE</span>
        ) : null}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto">
        {!password ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-2 opacity-30">
            <ShieldAlert className="w-10 h-10 text-slate-500" />
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Awaiting Analysis</p>
          </div>
        ) : error ? (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-4 flex items-center gap-3">
             <AlertCircle className="w-5 h-5 text-rose-500" />
             <p className="text-xs text-rose-200 font-medium">{error}</p>
          </div>
        ) : breachCount === 0 ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 animate-in zoom-in-95 duration-500">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="text-white font-bold text-sm">Pwned Status: Clear</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              This password hash was not found in our database of over <span className="text-white">8.5 billion</span> exposed credentials worldwide.
            </p>
          </div>
        ) : breachCount !== null && breachCount > 0 ? (
          <>
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-4 animate-in zoom-in-95 duration-500">
              <div className="flex justify-between items-start mb-2">
                <span className="text-white font-bold text-sm leading-tight text-balance">Database Exposure Found</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                This exact sequence has appeared <span className="text-rose-500 font-black text-sm">{breachCount.toLocaleString()} times</span> in known security breaches.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest">Immediate Action Required</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                DANGER: Credential stuffing bots prioritize leaked sequences. Discontinue use on all platforms.
              </p>
            </div>
          </>
        ) : null}
      </div>

      {password && !loading && !error && breachCount !== null && (
        <div className="pt-4 mt-auto border-t border-white/5">
          <button className="text-[10px] text-indigo-400 hover:text-indigo-300 font-black uppercase tracking-widest flex items-center gap-1 group transition-colors">
            Research Full Report 
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
};
