// Search Page
import { createClient } from '@/lib/supabase-server';
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
    <div className="animate-in max-w-4xl">
       <div className="page-header mb-8">
        <h1 className="page-title">Search Knowledge Base</h1>
        <p className="page-subtitle">Find past technical decisions across your organization.</p>
      </div>

      <form className="relative mb-12">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-neutral-500" />
        </div>
        <input
          type="text"
          name="q"
          defaultValue={query}
          className="block w-full pl-12 pr-4 py-4 border border-neutral-800 rounded-xl leading-5 bg-neutral-900/50 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 sm:text-lg transition-all shadow-xl"
          placeholder="Search for 'Redis', 'migration', 'database'..."
          autoFocus
        />
        <div className="absolute inset-y-0 right-2 flex items-center">
            <button type="submit" className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm font-medium transition-colors">
              Search
            </button>
        </div>
      </form>

      {query && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">
            {decisions?.length || 0} Results for '{query}'
          </h2>
        </div>
      )}

      <div className="grid gap-4">
        {!query ? (
           <div className="p-16 text-center border border-dashed border-neutral-800 rounded-xl bg-neutral-900/10">
              <SearchIcon className="w-8 h-8 text-neutral-600 mx-auto mb-4" />
              <p className="text-neutral-500 text-sm max-w-sm mx-auto">
                Type a keyword above to search through all recorded architecture and infrastructure decisions.
              </p>
           </div>
        ) : !decisions || decisions.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-neutral-800 rounded-xl">
             <h3 className="text-lg font-medium text-white mb-2">No matches found</h3>
             <p className="text-neutral-500 text-sm max-w-sm mx-auto">
               We couldn't find anything matching your search. Try different keywords.
             </p>
          </div>
        ) : (
          decisions.map(d => (
            <DecisionCard
              key={d.id}
              id={d.id}
              title={d.title}
              summary={d.summary_one_liner ?? ''}
              impact={d.impact as 'high' | 'medium' | 'low'}
              type={d.decision_type}
              status={d.status as 'confirmed' | 'pending_review' | 'rejected'}
            />
          ))
        )}
      </div>

    </div>
  );
}
