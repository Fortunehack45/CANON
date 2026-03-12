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
    <div className="animate-in max-w-5xl">
       <div className="page-header">
        <h1 className="page-title">Review Queue</h1>
        <p className="page-subtitle">Decisions requiring senior engineering sign-off.</p>
      </div>

      <div className="mt-8 flex items-center justify-between bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 lg:p-6 mb-8">
         <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 font-bold text-lg">
             {pendingCount}
           </div>
           <div>
             <div className="text-white font-medium text-lg">Pending Approvals</div>
             <div className="text-neutral-500 text-sm">Waiting for your review</div>
           </div>
         </div>
      </div>

      <div className="grid gap-4">
        {!decisions || decisions.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-neutral-800 rounded-xl">
             <div className="text-4xl mb-4">✨</div>
             <h3 className="text-lg font-medium text-white mb-2">Inbox zero</h3>
             <p className="text-neutral-500 text-sm max-w-sm mx-auto">
               You are all caught up. No decisions are currently pending review.
             </p>
          </div>
        ) : (
          decisions.map(d => (
            <div key={d.id} className="relative group">
               <DecisionCard
                  id={d.id}
                  title={d.title}
                  summary={d.summary_one_liner ?? `Filed by ${d.author_github_login}`}
                  impact={d.impact as 'high' | 'medium' | 'low'}
                  type={d.decision_type}
                  status="pending_review"
               />
               
               {/* Quick Action Overlay (Desktop) */}
               <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 ml-4 pl-4 border-l border-neutral-800">
                  <form action={approve.bind(null, d.id)}>
                    <button type="submit" className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-sm font-medium transition-colors">
                      Approve
                    </button>
                  </form>
                  <form action={reject.bind(null, d.id)}>
                    <button type="submit" className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-sm font-medium transition-colors">
                      Reject
                    </button>
                  </form>
               </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
