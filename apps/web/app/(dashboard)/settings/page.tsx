export const dynamic = 'force-dynamic';
// Workspace Settings Page
import { Github, Slack, Database } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-8 max-w-4xl space-y-12 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">Workspace Strategy</h1>
        <p className="text-foreground-secondary">Refine organization preferences and external connectivity.</p>
      </div>

      <div className="space-y-10">
        
        <section className="space-y-6">
           <div className="flex items-center gap-3">
             <h2 className="text-[10px] font-black text-foreground-dim uppercase tracking-[0.2em]">Operational Connectivity</h2>
             <div className="h-px flex-1 bg-border" />
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* GitHub */}
              <div className="group flex items-center justify-between p-5 bg-surface-1 border border-border rounded-premium transition-all hover:border-accent/30 shadow-sm">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface-2 flex items-center justify-center rounded-xl border border-border text-foreground transition-colors group-hover:text-accent group-hover:bg-accent/5">
                      <Github className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-foreground">GitHub</div>
                      <div className="text-xs text-foreground-dim font-medium leading-tight">Sync technical PRs to intelligence</div>
                    </div>
                 </div>
                 <button className="px-4 py-2 bg-surface-2 hover:bg-surface-3 text-foreground-secondary hover:text-foreground text-xs font-bold uppercase tracking-widest rounded-subtle transition-all">
                    Link
                 </button>
              </div>

              {/* Slack */}
              <div className="group flex items-center justify-between p-5 bg-surface-1 border border-border rounded-premium transition-all hover:border-accent/30 shadow-sm">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface-2 flex items-center justify-center rounded-xl border border-border text-foreground transition-colors group-hover:text-[#4A154B] group-hover:bg-[#4A154B]/5">
                      <Slack className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-foreground">Slack</div>
                      <div className="text-xs text-foreground-dim font-medium leading-tight">Automated review notifications</div>
                    </div>
                 </div>
                 <button className="px-4 py-2 bg-surface-2 hover:bg-surface-3 text-foreground-secondary hover:text-foreground text-xs font-bold uppercase tracking-widest rounded-subtle transition-all">
                    Link
                 </button>
              </div>
           </div>
        </section>

        <section className="space-y-6">
           <div className="flex items-center gap-3">
             <h2 className="text-[10px] font-black text-foreground-dim uppercase tracking-[0.2em]">Core Configuration</h2>
             <div className="h-px flex-1 bg-border" />
           </div>
           
           <div className="bg-surface-1 border border-border rounded-premium p-8 shadow-sm">
             <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-foreground-dim uppercase tracking-widest">Workspace Identity</label>
                    <input 
                      type="text" 
                      defaultValue="Black Box"
                      className="w-full bg-surface-2 border border-transparent rounded-subtle px-4 py-3 text-sm text-foreground font-bold focus:outline-none focus:border-accent/30 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-foreground-dim uppercase tracking-widest">Review Threshold</label>
                    <select 
                      className="w-full bg-surface-2 border border-transparent rounded-subtle px-4 py-3 text-sm text-foreground font-bold focus:outline-none focus:border-accent/30 transition-all cursor-pointer"
                    >
                      <option value="1">1 Senior Architect Required</option>
                      <option value="2">2 Approvals Required</option>
                      <option value="0">Zero Approval (Passive Log)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end border-t border-border pt-6">
                   <button type="button" className="px-8 py-3 bg-accent text-white rounded-premium text-sm font-black uppercase tracking-widest hover:bg-accent-hover transition-all shadow-glow">
                      Deploy Changes
                   </button>
                </div>
             </form>
           </div>
        </section>

        <section className="bg-danger/5 border border-danger/20 rounded-premium p-8 space-y-6">
           <div>
             <h2 className="text-xl font-black text-danger mb-1">Destructive Maneuver</h2>
             <p className="text-sm text-danger/60 font-medium">Irreversible deletion of entire engineering intelligence history.</p>
           </div>
           
           <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-danger/10 border border-danger/20 rounded-2xl">
              <div>
                <div className="font-bold text-white mb-0.5 whitespace-nowrap">Terminate Workspace</div>
                <div className="text-xs text-danger/70 font-medium">This will wipe all decision records permanently.</div>
              </div>
              <button className="whitespace-nowrap px-6 py-2.5 bg-danger hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-premium transition-all active:scale-95 shadow-lg">
                Confirm Destruction
              </button>
           </div>
        </section>

      </div>
    </div>
  );
}
