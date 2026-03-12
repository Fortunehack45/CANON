export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import { DecisionCard } from '@/components/decision-card';
import Link from 'next/link';
import { Activity, Folder, Settings, Plus, ArrowLeft } from 'lucide-react';

interface Props {
  params: { slug: string; projectSlug: string };
}

export default async function ProjectDashboardPage({ params }: Props) {
  const supabase = createClient();

  const { data: org } = await supabase
    .from('organizations')
    .select('id, name, slug')
    .eq('slug', params.slug)
    .single();

  if (!org) notFound();

  const { data: project } = await supabase
    .from('projects')
    .select('id, name, description, status, created_at')
    .eq('org_id', org.id)
    .eq('slug', params.projectSlug)
    .single();

  if (!project) notFound();

  // Get project decisions
  const { data: decisions } = await supabase
    .from('decision_records')
    .select('id, title, summary_one_liner, impact, decision_type, status, created_at')
    .eq('org_id', org.id)
    .eq('project_id', project.id)
    .order('created_at', { ascending: false })
    .limit(10);

  const { count: decisionCount } = await supabase
    .from('decision_records')
    .select('id', { count: 'exact', head: true })
    .eq('project_id', project.id);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-8 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-foreground-muted">
        <Link href={`/orgs/${params.slug}`} className="hover:text-accent transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> {org.name}
        </Link>
        <span>/</span>
        <span className="text-foreground">{project.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center text-accent">
            <Folder className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">{project.name}</h1>
            <p className="text-foreground-secondary text-sm">{project.description || 'Project intelligence feed'}</p>
          </div>
        </div>
        <Link
          href={`/decisions/new?project_id=${project.id}`}
          className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-black text-[10px] uppercase tracking-widest rounded-premium shadow-glow hover:bg-accent-hover transition-all"
        >
          <Plus className="w-4 h-4" /> Log Decision
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { icon: Activity, label: 'Total Decisions', value: decisionCount ?? 0 },
          {
            icon: Activity,
            label: 'Confirmed',
            value: decisions?.filter(d => d.status === 'confirmed').length ?? 0
          },
          {
            icon: Activity,
            label: 'Pending Review',
            value: decisions?.filter(d => d.status === 'pending_review').length ?? 0
          },
        ].map(stat => (
          <div key={stat.label} className="bg-surface-1 border border-border rounded-premium p-5 shadow-sm hover:border-accent/30 transition-all group">
            <div className="text-2xl font-black text-foreground mb-1 group-hover:text-accent transition-colors">{stat.value}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-foreground-muted">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Intelligence Feed */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Project Intelligence Feed</h2>
            {decisions && decisions.length > 0 && (
              <div className="px-2 py-px bg-accent/10 border border-accent/20 rounded text-[10px] font-bold text-accent uppercase tracking-widest animate-pulse">Live</div>
            )}
          </div>
          <Link href={`/search?project=${project.id}`} className="text-[10px] font-black uppercase tracking-widest text-foreground-dim hover:text-accent transition-colors flex items-center gap-1.5 group">
            Search Project <span className="transform group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>

        {!decisions || decisions.length === 0 ? (
          <div className="bg-surface-1 border border-dashed border-border rounded-premium p-16 text-center">
            <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mx-auto mb-4 border border-border/50">
              <Activity className="w-7 h-7 text-foreground-dim opacity-30" />
            </div>
            <p className="text-sm text-foreground-muted font-medium max-w-xs mx-auto">
              No decisions logged for this project yet. Connect GitHub repos or log decisions manually.
            </p>
            <Link
              href={`/decisions/new?project_id=${project.id}`}
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-accent text-white font-black text-[10px] uppercase tracking-widest rounded-premium shadow-glow hover:bg-accent-hover transition-all"
            >
              Log First Decision
            </Link>
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
