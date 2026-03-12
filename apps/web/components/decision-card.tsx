import Link from 'next/link';
import { ArrowRight, BrainCircuit, User } from 'lucide-react';

interface DecisionCardProps {
  id: string;
  title: string;
  summary: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  status: 'confirmed' | 'pending_review' | 'rejected';
}

export function DecisionCard({ id, title, summary, impact, type, status }: DecisionCardProps) {
  return (
    <Link 
      href={`/decisions/${id}`} 
      className="bg-surface-1 border border-border rounded-premium p-6 hover:border-accent/40 hover:bg-surface-2 transition-all duration-500 group relative overflow-hidden block text-decoration-none shadow-sm hover:shadow-accent"
    >
      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex flex-col gap-6">
        <div>
          <div className="flex items-center justify-between gap-4 mb-3">
            <h3 className="text-lg font-black text-foreground tracking-tight leading-tight group-hover:text-accent transition-colors duration-300">
              {title}
            </h3>
            <div className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all duration-500 ${
              status === 'confirmed' 
                ? 'bg-success-bg text-success border-success/20 group-hover:border-success/40' 
                : 'bg-warning-bg text-warning border-warning/20 group-hover:border-warning/40'
            }`}>
              {status.replace('_', ' ')}
            </div>
          </div>
          <p className="text-[13px] text-foreground-secondary line-clamp-2 leading-relaxed font-medium">
            {summary}
          </p>
        </div>
        
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all duration-500 ${
              impact === 'critical' ? 'bg-red-500/10 text-red-400 border-red-500/10 group-hover:border-red-500/30' :
              impact === 'high' ? 'bg-orange-500/10 text-orange-400 border-orange-500/10 group-hover:border-orange-500/30' :
              impact === 'medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/10 group-hover:border-yellow-500/30' :
              'bg-green-500/10 text-green-400 border-green-500/10 group-hover:border-green-500/30'
            }`}>
              {impact}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-surface-3 border border-border text-[9px] font-black uppercase tracking-widest text-foreground-muted group-hover:text-foreground-secondary transition-colors duration-500">
              {type.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-foreground-ghost group-hover:text-foreground-dim transition-colors">
            <User className="w-3 h-3" />
            <span>@author</span>
          </div>

          <div className="ml-auto flex items-center gap-6">
             <div className="flex flex-col items-end gap-1.5">
                <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-foreground-ghost group-hover:text-accent transition-colors">
                   <BrainCircuit className="w-3 h-3" />
                   Entropy
                </div>
                <div className="w-24 h-1 bg-surface-3 rounded-full overflow-hidden border border-border/50">
                   <div className="h-full bg-accent shadow-[0_0_12px_var(--accent)] transition-all duration-1000 group-hover:w-[90%]" style={{ width: '85%' }} />
                </div>
             </div>
             <ArrowRight className="w-4 h-4 text-foreground-ghost opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-accent transition-all duration-500" />
          </div>
        </div>
      </div>
    </Link>
  );
}
