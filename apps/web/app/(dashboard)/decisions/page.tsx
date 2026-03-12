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
    <div className="animate-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Decisions</h1>
          <p className="page-subtitle">Architecture, infrastructure, and technical choices.</p>
        </div>
        <Link 
          href="/decisions/new" 
          className="bg-white text-black hover:bg-neutral-200 font-medium text-sm rounded-lg px-4 py-2 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Record Decision
        </Link>
      </div>

      <FilterBar 
        currentStatus={searchParams.status} 
        currentImpact={searchParams.impact} 
        currentQuery={searchParams.query} 
      />

      <div className="decision-list" style={{ marginTop: '1.5rem' }}>
        {error ? (
          <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm">
            Failed to load decisions: {error.message}
          </div>
        ) : !decisions || decisions.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-neutral-800 rounded-xl">
            <h3 className="text-lg font-medium text-white mb-2">No decisions found</h3>
            <p className="text-neutral-500 text-sm max-w-sm mx-auto">
              {!searchParams.status && !searchParams.impact && !searchParams.query 
                ? "You haven't recorded any architecture decisions yet." 
                : "Try adjusting your filters to see more results."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {decisions.map((d) => (
              <DecisionCard
                key={d.id}
                id={d.id}
                title={d.title}
                summary={d.summary_one_liner ?? ''}
                impact={d.impact as 'high' | 'medium' | 'low'}
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
