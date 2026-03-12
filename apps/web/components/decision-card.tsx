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
      className="bg-surface-1 border border-border rounded-premium p-6 hover:border-accent hover:bg-surface-2 transition-all duration-300 group shadow-sm hover:shadow-glow block text-decoration-none"
    >
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex items-center justify-between gap-4 mb-2">
            <h3 className="text-base font-bold text-foreground leading-tight group-hover:text-accent transition-colors">
              {title}
            </h3>
            <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
              status === 'confirmed' 
                ? 'bg-success-bg text-success border-success/30' 
                : 'bg-warning-bg text-warning border-warning/30'
            }`}>
              {status.replace('_', ' ')}
            </div>
          </div>
          <p className="text-sm text-foreground-secondary line-clamp-2 leading-relaxed">
            {summary}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded-subtle text-[10px] font-bold uppercase tracking-wide border ${
              impact === 'critical' ? 'bg-red-500/15 text-red-400 border-red-500/30' :
              impact === 'high' ? 'bg-orange-500/15 text-orange-400 border-orange-500/30' :
              impact === 'medium' ? 'bg-yellow-500/15 text-yellow-500 border-yellow-500/30' :
              'bg-green-500/15 text-green-400 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.1)]'
            }`}>
              {impact} impact
            </span>
            <span className="px-2.5 py-1 rounded-subtle bg-surface-2 border border-border text-[10px] font-bold uppercase tracking-wide text-foreground-muted group-hover:border-accent/30 transition-colors">
              {type.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-medium text-foreground-dim">
            <User className="w-3 h-3 opacity-50" />
            <span>@author</span>
          </div>

          <div className="ml-auto flex items-center gap-4">
             <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-foreground-muted">
                   <BrainCircuit className="w-3 h-3 text-accent" />
                   Confidence
                </div>
                <div className="w-20 h-1 bg-surface-3 rounded-full overflow-hidden border border-border/50">
                   <div className="h-full bg-accent shadow-[0_0_8px_var(--accent)]" style={{ width: '85%' }} />
                </div>
             </div>
             <div className="text-[10px] font-bold uppercase tracking-widest text-foreground-dim flex items-center gap-1.5 opacity-0 group-hover:opacity-100 group-hover:text-accent transform translate-x-1 group-hover:translate-x-0 transition-all duration-300">
                Audit <ArrowRight className="w-3 h-3" />
             </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
