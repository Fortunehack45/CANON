// Review Queue
import { createClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';
import { DecisionCard } from '@/components/decision-card';
import { revalidatePath } from 'next/cache';

export default async function ReviewPage() {
  const supabase = createClient();
  
  const { data: decisions } = await supabase
    .from('decision_records')
    .select('id, status, title, summary_one_liner, impact, decision_type, author_github_login')
    .eq('status', 'pending_review')
    .order('created_at', { ascending: true });

  const pendingCount = decisions?.length || 0;

  // Server actions for quick approve/reject from the queue
  async function approve(id: string) {
    'use server';
    const s = createClient();
    await s.from('decision_records').update({ status: 'confirmed' }).eq('id', id);
    revalidatePath('/review');
    revalidatePath('/decisions');
    revalidatePath('/');
  }

  async function reject(id: string) {
    'use server';
    const s = createClient();
    await s.from('decision_records').update({ status: 'rejected' }).eq('id', id);
    revalidatePath('/review');
    revalidatePath('/decisions');
    revalidatePath('/');
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-8 space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">Review Queue</h1>
        <p className="text-foreground-secondary">Strategic choices requiring senior engineering sign-off.</p>
      </div>

      <div className="bg-surface-1 border border-border rounded-premium p-8 relative overflow-hidden group shadow-sm">
        <div className="absolute inset-0 bg-glass-gradient opacity-10" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-warning-bg border border-warning/20 flex items-center justify-center text-warning font-black text-2xl shadow-glow">
            {pendingCount}
          </div>
          <div>
            <div className="text-xl font-bold text-foreground">Pending Intelligence</div>
            <div className="text-foreground-secondary font-medium">Capture or refine these architectural records to maintain system health.</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {!decisions || decisions.length === 0 ? (
          <div className="bg-surface-1 border border-dashed border-border rounded-premium p-20 text-center">
             <div className="text-4xl mb-4 opacity-30">✨</div>
             <h3 className="text-lg font-bold text-foreground mb-2">Inbox Zero</h3>
             <p className="text-foreground-muted text-sm max-w-xs mx-auto">
               Your engineering intelligence is up to date. No decisions are currently pending review.
             </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {decisions.map(d => (
              <div key={d.id} className="relative group">
                 <DecisionCard
                    id={d.id}
                    title={d.title}
                    summary={d.summary_one_liner ?? `Filed by ${d.author_github_login}`}
                    impact={d.impact as 'high' | 'medium' | 'low' | 'critical'}
                    type={d.decision_type}
                    status="pending_review"
                 />
                 
                 {/* Quick Action Overlay (Desktop) */}
                 <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 pl-6 border-l border-border bg-gradient-to-r from-transparent via-surface-1 to-surface-1 h-2/3">
                    <form action={approve.bind(null, d.id)}>
                      <button type="submit" className="px-5 py-2 bg-success-bg hover:bg-success text-success hover:text-white border border-success/30 rounded-premium text-xs font-bold uppercase tracking-wider transition-all">
                        Approve
                      </button>
                    </form>
                    <form action={reject.bind(null, d.id)}>
                      <button type="submit" className="px-5 py-2 bg-danger-bg hover:bg-danger text-danger hover:text-white border border-danger/30 rounded-premium text-xs font-bold uppercase tracking-wider transition-all">
                        Reject
                      </button>
                    </form>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
