import { createDecision } from './actions';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewDecisionPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-8 max-w-4xl mx-auto space-y-10 pb-24">
      <div className="flex items-center gap-6">
        <Link 
          href="/decisions" 
          className="p-3 bg-surface-1 border border-border rounded-xl text-foreground-muted hover:text-accent hover:border-accent/30 transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Initiate Intelligence Log</h1>
          <p className="text-foreground-secondary font-medium">Document a strategic technical choice for the organization.</p>
        </div>
      </div>

      <form action={createDecision} className="bg-surface-1 border border-border rounded-premium p-8 shadow-sm space-y-12 relative overflow-hidden group">
        <div className="absolute inset-0 bg-glass-gradient opacity-10 pointer-events-none" />
        
        {/* Basic Info Cluster */}
        <div className="space-y-8 relative z-10">
          <div className="flex items-center gap-3">
            <h3 className="text-[10px] font-black text-foreground-dim uppercase tracking-[0.2em]">Primary Coordinates</h3>
            <div className="h-px flex-1 bg-border" />
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-2">
              <label htmlFor="title" className="text-[10px] font-black text-foreground-dim uppercase tracking-widest">Decision Vector</label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                required
                className="w-full bg-surface-2 border border-transparent rounded-subtle px-4 py-3 text-foreground font-bold focus:outline-none focus:border-accent/30 focus:bg-surface-3 transition-all placeholder:text-foreground-dim placeholder:font-normal"
                placeholder="e.g. Cluster migration to ARM64 architecture"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="summary_one_liner" className="text-[10px] font-black text-foreground-dim uppercase tracking-widest">Executive Abstract</label>
              <input 
                type="text" 
                id="summary_one_liner" 
                name="summary_one_liner" 
                required
                className="w-full bg-surface-2 border border-transparent rounded-subtle px-4 py-3 text-foreground font-bold focus:outline-none focus:border-accent/30 focus:bg-surface-3 transition-all placeholder:text-foreground-dim placeholder:font-normal"
                placeholder="High-level summary of change and strategic intent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label htmlFor="decision_type" className="text-[10px] font-black text-foreground-dim uppercase tracking-widest">Intelligence Dimension</label>
                <select 
                  id="decision_type" 
                  name="decision_type"
                  className="w-full bg-surface-2 border border-transparent rounded-subtle px-4 py-3 text-sm text-foreground font-bold focus:outline-none focus:border-accent/30 focus:bg-surface-3 transition-all cursor-pointer"
                >
                  <option value="architecture">Architecture</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="data_model">Data Model</option>
                  <option value="security">Security</option>
                  <option value="tooling">Tooling</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="impact" className="text-[10px] font-black text-foreground-dim uppercase tracking-widest">Risk / Impact Factor</label>
                <select 
                  id="impact" 
                  name="impact"
                  className="w-full bg-surface-2 border border-transparent rounded-subtle px-4 py-3 text-sm text-foreground font-bold focus:outline-none focus:border-accent/30 focus:bg-surface-3 transition-all cursor-pointer"
                >
                  <option value="medium">Medium</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative Clusters */}
        <div className="space-y-10 relative z-10">
          <div className="flex items-center gap-3">
            <h3 className="text-[10px] font-black text-foreground-dim uppercase tracking-[0.2em]">Deep intelligence</h3>
            <div className="h-px flex-1 bg-border" />
          </div>
          
          <div className="space-y-8">
            <div className="space-y-2">
              <label htmlFor="what" className="text-[10px] font-black text-foreground-dim uppercase tracking-widest">Operational Detail</label>
              <textarea 
                id="what" 
                name="what" 
                rows={4}
                className="w-full bg-surface-2 border border-transparent rounded-subtle px-4 py-4 text-foreground font-mono text-sm focus:outline-none focus:border-accent/30 focus:bg-surface-3 transition-all placeholder:text-foreground-dim"
                placeholder="What exactly is being implemented? (Markdown supported)"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="why" className="text-[10px] font-black text-foreground-dim uppercase tracking-widest">Strategic Justification</label>
              <textarea 
                id="why" 
                name="why" 
                rows={4}
                className="w-full bg-surface-2 border border-transparent rounded-subtle px-4 py-4 text-foreground font-medium text-sm leading-relaxed focus:outline-none focus:border-accent/30 focus:bg-surface-3 transition-all placeholder:text-foreground-dim"
                placeholder="Why is this path being taken? Constraints, business value, or scale requirements."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="tradeoffs" className="text-[10px] font-black text-foreground-dim uppercase tracking-widest">Compromise Analysis</label>
              <textarea 
                id="tradeoffs" 
                name="tradeoffs" 
                rows={3}
                className="w-full bg-warning-bg border border-warning/10 rounded-subtle px-4 py-4 text-warning/90 font-medium text-sm italic focus:outline-none focus:border-warning/30 transition-all placeholder:text-warning/40"
                placeholder="What are the calculated risks and downsides? What was rejected?"
              />
            </div>
          </div>
        </div>

        <div className="pt-10 flex border-t border-border relative z-10">
          <button 
            type="submit"
            className="w-full flex items-center justify-center gap-3 bg-accent text-white hover:bg-accent-hover font-black uppercase tracking-[0.2em] rounded-premium px-8 py-4 transition-all shadow-glow hover:translate-y-[-2px] active:scale-95"
          >
            <Save className="w-5 h-5" /> Commit to Intel
          </button>
        </div>
      </form>
    </div>
  );
}
