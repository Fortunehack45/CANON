// Dashboard landing page - CTO Overview (live data from Supabase)
import { createClient } from '@/lib/supabase-server';
import { StatCard } from '@/components/stat-card';
import { DecisionCard } from '@/components/decision-card';
import { HealthGauge } from '@/components/health-gauge';

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
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">CTO Overview</h1>
        <p className="page-subtitle">Real-time engineering knowledge intelligence</p>
      </div>

      <div className="stat-grid">
        <StatCard title="Total Decisions" value={total} delta={`${total} in database`} />
        <StatCard title="Confirmed" value={confirmed} delta={`${confirmed} confirmed`} type="success" />
        <StatCard title="Pending Review" value={pending} delta={pending > 0 ? 'Needs attention' : 'All clear'} type={pending > 0 ? 'warning' : 'success'} />
        <HealthGauge score={healthScore} label="Knowledge Health" />
      </div>

      <div className="page-header" style={{ paddingTop: '1rem' }}>
        <h2 className="page-title" style={{ fontSize: '1.25rem' }}>Recent High-Impact Decisions</h2>
      </div>

      <div className="decision-list" style={{ marginTop: '1.5rem' }}>
        {recent.length === 0 ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '2rem' }}>
            No decisions recorded yet.
          </p>
        ) : (
          recent.map((d) => (
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
