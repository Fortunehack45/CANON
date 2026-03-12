// Search Page
import { createClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';
import { DecisionCard } from '@/components/decision-card';
import { Search as SearchIcon } from 'lucide-react';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || '';
  const supabase = createClient();
  
  let decisions: any[] | null = [];
  
  if (query) {
    const { data } = await supabase
      .from('decision_records')
      .select('id, status, title, summary_one_liner, impact, decision_type, created_at')
      .textSearch('title', query)
      .limit(50);
    decisions = data;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-8 space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">Knowledge Search</h1>
        <p className="text-foreground-secondary">Retrieve past technical decisions and engineering intelligence.</p>
      </div>

      <form className="relative group max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-20">
          <SearchIcon className="h-5 w-5 text-foreground-dim group-focus-within:text-accent transition-all duration-300 group-focus-within:scale-110" />
        </div>
        <input
          type="text"
          name="q"
          defaultValue={query}
          className="block w-full pl-14 pr-32 py-5 bg-surface-1 border border-border rounded-premium text-foreground placeholder-foreground-dim focus:outline-none focus:bg-surface-2 focus:border-accent/40 focus:shadow-glow transition-all sm:text-lg font-bold relative z-10"
          placeholder="Search vectors: 'Redis', 'migration', 'auth'..."
          autoFocus
        />
        <div className="absolute inset-y-2 right-2 flex items-center z-20">
            <button type="submit" className="h-full px-8 bg-accent text-white rounded-subtle text-[10px] font-black uppercase tracking-widest hover:bg-accent-hover transition-all shadow-glow active:scale-95">
              Execute Intelligence Retrieval
            </button>
        </div>
        <div className="absolute inset-0 bg-accent/5 rounded-premium blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
      </form>

      {query && (
        <div>
          <h2 className="text-[10px] font-black text-foreground-dim uppercase tracking-[0.2em]">
            Found {decisions?.length || 0} intelligence records for "{query}"
          </h2>
          <div className="h-px bg-border mt-4" />
        </div>
      )}

      <div className="space-y-4">
        {!query ? (
           <div className="bg-surface-1 border border-dashed border-border rounded-premium p-20 text-center">
              <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center mx-auto mb-6 text-foreground-dim">
                <SearchIcon className="w-8 h-8 opacity-40" />
              </div>
              <p className="text-foreground-muted text-sm max-w-sm mx-auto font-medium">
                Enter technical keywords to traverse the workspace intelligence graph and find relevant decision history.
              </p>
           </div>
        ) : !decisions || decisions.length === 0 ? (
          <div className="bg-surface-1 border border-dashed border-border rounded-premium p-20 text-center">
             <h3 className="text-lg font-bold text-foreground mb-2">Null result</h3>
             <p className="text-foreground-muted text-sm max-w-sm mx-auto">
               No architectural records match your current query parameters. Try widening the search scope.
             </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {decisions.map(d => (
              <DecisionCard
                key={d.id}
                id={d.id}
                title={d.title}
                summary={d.summary_one_liner ?? ''}
                impact={d.impact as 'high' | 'medium' | 'low' | 'critical'}
                type={d.decision_type}
                status={d.status as 'confirmed' | 'pending_review' | 'rejected'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
