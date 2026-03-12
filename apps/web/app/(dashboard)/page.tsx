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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 p-8 space-y-12 max-w-7xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tighter text-foreground">CTO Overview</h1>
        <p className="text-foreground-secondary text-sm font-medium tracking-tight">Real-time engineering knowledge intelligence & system nodes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Nodes" value={total} delta={`${total} units`} />
        <StatCard label="Confirmed" value={confirmed} delta={`${confirmed} stable`} trend="up" />
        <StatCard label="Pending Audit" value={pending} delta={pending > 0 ? 'Critical Path' : 'Synched'} trend={pending > 0 ? 'down' : 'up'} />
        <HealthGauge score={healthScore} label="Neural Integrity" />
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-black tracking-tight text-foreground">Intelligence Feed</h2>
            <div className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-[8px] font-black text-accent uppercase tracking-[0.2em] animate-pulse">Sync Active</div>
          </div>
          <Link href="/decisions" className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground-ghost hover:text-accent transition-all flex items-center gap-2 group">
            Access Knowledge Base <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {recent.length === 0 ? (
            <div className="bg-surface-1 border border-dashed border-border rounded-premium p-24 text-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-surface-2/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 space-y-4">
                <div className="w-20 h-20 bg-surface-2 rounded-full flex items-center justify-center mx-auto border border-border shadow-inner">
                  <span className="text-3xl opacity-20 animate-pulse">⬡</span>
                </div>
                <p className="text-xs text-foreground-ghost font-black uppercase tracking-[0.2em] max-w-xs mx-auto leading-relaxed">
                  Establishing secure baseline... No intelligence units documented for this cycle.
                </p>
              </div>
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

function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
