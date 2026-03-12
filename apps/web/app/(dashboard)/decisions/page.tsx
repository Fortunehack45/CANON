// Decisions List Page
import { createClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';
import { DecisionCard } from '@/components/decision-card';
import { FilterBar } from '@/components/filter-bar';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default async function DecisionsPage({
  searchParams,
}: {
  searchParams: { status?: string; impact?: string; query?: string; page?: string };
}) {
  const supabase = createClient();
  
  // Build query
  let query = supabase
    .from('decision_records')
    .select('id, status, title, summary_one_liner, impact, decision_type, created_at');

  if (searchParams.status && searchParams.status !== 'all') {
    query = query.eq('status', searchParams.status);
  }
  if (searchParams.impact && searchParams.impact !== 'all') {
    query = query.eq('impact', searchParams.impact);
  }
  if (searchParams.query) {
    query = query.textSearch('title', searchParams.query);
  }

  // Pagination (simple 20 items per page for now)
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data: decisions, error } = await query;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-8 space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">Architecture Decisions</h1>
          <p className="text-foreground-secondary">Strategic technical choices and engineering intelligence.</p>
        </div>
        <Link 
          href="/decisions/new" 
          className="bg-accent text-white hover:bg-accent-hover font-bold text-sm rounded-premium px-5 py-2.5 transition-all shadow-glow hover:translate-y-[-1px] flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Record Decision
        </Link>
      </div>

      <div className="bg-surface-1 border border-border rounded-premium p-1">
        <FilterBar 
          currentStatus={searchParams.status} 
          currentImpact={searchParams.impact} 
          currentQuery={searchParams.query} 
        />
      </div>

      <div className="space-y-4">
        {error ? (
          <div className="p-4 bg-danger/10 border border-danger/20 rounded-premium text-danger text-sm font-medium">
            Failed to load decisions: {error.message}
          </div>
        ) : !decisions || decisions.length === 0 ? (
          <div className="bg-surface-1 border border-dashed border-border rounded-premium p-20 text-center">
            <div className="text-4xl mb-4 opacity-20">⬡</div>
            <h3 className="text-lg font-bold text-foreground mb-2">No results found</h3>
            <p className="text-foreground-muted text-sm max-w-xs mx-auto">
              {!searchParams.status && !searchParams.impact && !searchParams.query 
                ? "You haven't recorded any architecture decisions yet. Start by capturing your first choice." 
                : "Your current filters aren't matching any records. Try broadening your search."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {decisions.map((d) => (
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
