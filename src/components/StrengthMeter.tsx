import React from 'react';
import zxcvbn from 'zxcvbn';
import { ShieldAlert, ShieldX, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface StrengthMeterProps {
  result: zxcvbn.ZXCVBNResult | null;
}

export const StrengthMeter: React.FC<StrengthMeterProps> = ({ result }) => {
  if (!result || !result.password) return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-300 border-2 border-dashed border-slate-100 rounded-2xl">
      <ShieldAlert className="w-12 h-12 mb-2 opacity-20" />
      <p className="text-sm font-medium">Waiting for input...</p>
    </div>
  );

  const score = result.score; // 0 to 4
  const percentage = ((score + 1) / 5) * 100;

  const getStatus = () => {
    switch (score) {
      case 0: return { label: 'Dangerously Weak', color: 'bg-rose-500', text: 'text-rose-500', ring: 'border-rose-500' };
      case 1: return { label: 'Weak', color: 'bg-orange-500', text: 'text-orange-500', ring: 'border-orange-500' };
      case 2: return { label: 'Fair', color: 'bg-amber-500', text: 'text-amber-500', ring: 'border-amber-500' };
      case 3: return { label: 'Strong', color: 'bg-indigo-500', text: 'text-indigo-500', ring: 'border-indigo-500' };
      case 4: return { label: 'Very Strong', color: 'bg-emerald-500', text: 'text-emerald-500', ring: 'border-emerald-500' };
      default: return { label: 'None', color: 'bg-slate-200', text: 'text-slate-400', ring: 'border-slate-200' };
    }
  };

  const status = getStatus();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative flex flex-col items-center justify-center">
        {/* Circular Progress */}
        <div className="w-48 h-48 rounded-full border-[14px] border-slate-50 flex items-center justify-center relative shadow-inner">
           <svg className="absolute inset-0 w-full h-full -rotate-90">
             <circle
               cx="96"
               cy="96"
               r="89"
               className="fill-none stroke-slate-100 stroke-[14px]"
             />
             <circle
               cx="96"
               cy="96"
               r="89"
               style={{ 
                 strokeDasharray: 559.2, 
                 strokeDashoffset: 559.2 - (559.2 * percentage) / 100 
               }}
               className={cn("fill-none stroke-[14px] transition-all duration-1000 ease-out", status.text.replace('text-', 'stroke-'))}
             />
           </svg>
           <div className="text-center z-10">
             <span className="text-5xl font-black text-slate-800 leading-none">{Math.round(percentage)}%</span>
             <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black mt-1">{status.label}</p>
           </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-xs font-black mb-2 uppercase tracking-widest">
            <span className="text-slate-400">Entropy Score</span>
            <span className={cn("font-mono font-bold", status.text)}>{result.guesses_log10.toFixed(1)} bits</span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <div 
              className={cn("h-full transition-all duration-1000 ease-out", status.color)} 
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-slate-100">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Crack Time</span>
           <span className="text-sm font-bold text-slate-800">{result.crack_times_display.offline_slow_hashing_1e4_per_second}</span>
        </div>

        <ul className="space-y-2.5">
          {result.feedback.suggestions.length > 0 ? (
            result.feedback.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-500 leading-relaxed font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                {s}
              </li>
            ))
          ) : (
            <li className="flex items-center gap-2.5 text-xs text-emerald-600 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              Optimal complexity detected
            </li>
          )}
          {result.feedback.warning && (
            <li className="flex items-start gap-2.5 text-xs text-rose-500 font-bold p-3 bg-rose-50 rounded-lg">
              <ShieldX className="w-4 h-4 shrink-0" />
              {result.feedback.warning}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};
