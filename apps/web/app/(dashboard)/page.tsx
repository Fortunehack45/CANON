// Dashboard landing page - CTO Overview (live data from Supabase)
import { createClient } from '@/lib/supabase-server';
import { StatCard } from '@/components/stat-card';
import { DecisionCard } from '@/components/decision-card';
import { HealthGauge } from '@/components/health-gauge';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CTOOverview() {
  const supabase = createClient();

  // Fetch counts per status
  const { data: decisions } = await supabase
    .from('decision_records')
    .select('id, status, title, summary_one_liner, impact, decision_type, created_at');

  const total = decisions?.length ?? 0;
  const confirmed = decisions?.filter((d) => d.status === 'confirmed').length ?? 0;
  const pending = decisions?.filter((d) => d.status === 'pending_review').length ?? 0;
  const rejected = decisions?.filter((d) => d.status === 'rejected').length ?? 0;

  // Health score based on confirmed ratio
  const healthScore = total > 0 ? Math.round((confirmed / total) * 100) : 0;

  // Most recent 3 decisions
  const recent = (decisions ?? [])
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-8 space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">CTO Overview</h1>
        <p className="text-foreground-secondary">Real-time engineering knowledge intelligence</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Decisions" value={total} delta={`${total} total`} />
        <StatCard label="Confirmed" value={confirmed} delta={`${confirmed} confirmed`} trend="up" />
        <StatCard label="Pending Review" value={pending} delta={pending > 0 ? 'Action required' : 'All clear'} trend={pending > 0 ? 'down' : 'up'} />
        <HealthGauge score={healthScore} label="System Health" />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Intelligence Feed</h2>
            <div className="px-2 py-px bg-accent/10 border border-accent/20 rounded text-[10px] font-bold text-accent uppercase tracking-widest animate-pulse">Live</div>
          </div>
          <Link href="/decisions" className="text-[10px] font-black uppercase tracking-widest text-foreground-dim hover:text-accent transition-colors flex items-center gap-1.5 group">
            Knowledge Base <span className="transform group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {recent.length === 0 ? (
            <div className="bg-surface-1 border border-dashed border-border rounded-premium p-16 text-center shadow-inner">
              <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mx-auto mb-4 border border-border/50">
                <span className="text-2xl opacity-20">⬡</span>
              </div>
              <p className="text-sm text-foreground-muted font-medium max-w-xs mx-auto">Establishing baseline... No intelligence units documented for this cycle.</p>
            </div>
          ) : (
            recent.map((d) => (
              <DecisionCard
                key={d.id}
                id={d.id}
                title={d.title}
                summary={d.summary_one_liner ?? ''}
                impact={d.impact as 'high' | 'medium' | 'low' | 'critical'}
                type={d.decision_type}
                status={d.status as 'confirmed' | 'pending_review' | 'rejected'}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
