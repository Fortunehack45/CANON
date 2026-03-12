export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Layers, Users, Plus, ArrowRight, Folder, Activity } from 'lucide-react';

interface Props {
  params: { slug: string };
}

export default async function OrgPage({ params }: Props) {
  const supabase = createClient();

  const { data: org } = await supabase
    .from('organizations')
    .select('id, name, slug, description, created_at')
    .eq('slug', params.slug)
    .single();

  if (!org) notFound();

  // Fetch projects in this org
  const { data: projects } = await supabase
    .from('projects')
    .select('id, name, slug, description, status, created_at')
    .eq('org_id', org.id)
    .order('created_at', { ascending: false });

  // Fetch member count
  const { count: memberCount } = await supabase
    .from('org_members')
    .select('id', { count: 'exact', head: true })
    .eq('org_id', org.id);

  // Fetch decision count
  const { count: decisionCount } = await supabase
    .from('decision_records')
    .select('id', { count: 'exact', head: true })
    .eq('org_id', org.id);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center text-accent font-black text-xl">
            {org.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">{org.name}</h1>
            <p className="text-foreground-secondary text-sm">{org.description || 'Engineering knowledge base'}</p>
          </div>
        </div>
        <Link
          href={`/orgs/${params.slug}/projects/new`}
          className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-black text-[10px] uppercase tracking-widest rounded-premium shadow-glow hover:bg-accent-hover transition-all"
        >
          <Plus className="w-4 h-4" /> New Project
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Folder, label: 'Projects', value: projects?.length ?? 0, color: 'accent' },
          { icon: Users, label: 'Members', value: memberCount ?? 0, color: 'success' },
          { icon: Activity, label: 'Decisions', value: decisionCount ?? 0, color: 'warning' },
        ].map(stat => (
          <div key={stat.label} className="bg-surface-1 border border-border rounded-premium p-6 shadow-sm hover:border-accent/30 transition-all duration-500 group">
            <div className={`w-10 h-10 rounded-xl bg-${stat.color}/10 border border-${stat.color}/20 flex items-center justify-center text-${stat.color} mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-foreground mb-1 group-hover:text-accent transition-colors">{stat.value}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-foreground-muted">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-[10px] font-black text-foreground-dim uppercase tracking-[0.2em]">Projects</h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        {!projects || projects.length === 0 ? (
          <div className="bg-surface-1 border border-dashed border-border rounded-premium p-16 text-center">
            <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mx-auto mb-4 border border-border/50">
              <Layers className="w-7 h-7 text-foreground-dim opacity-30" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">No Projects Yet</h3>
            <p className="text-sm text-foreground-muted max-w-sm mx-auto mb-6">
              Projects organize your decisions by product area, team, or initiative.
            </p>
            <Link
              href={`/orgs/${params.slug}/projects/new`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-black text-[10px] uppercase tracking-widest rounded-premium shadow-glow hover:bg-accent-hover transition-all"
            >
              <Plus className="w-3 h-3" /> Create First Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map(project => (
              <Link
                key={project.id}
                href={`/orgs/${params.slug}/projects/${project.slug}`}
                className="bg-surface-1 border border-border rounded-premium p-6 hover:border-accent/40 hover:shadow-glow transition-all duration-300 group block"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="w-10 h-10 bg-accent/10 border border-accent/20 rounded-lg flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                    <Folder className="w-5 h-5" />
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                    project.status === 'active'
                      ? 'bg-success/10 text-success border-success/20'
                      : 'bg-surface-3 text-foreground-muted border-border'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-foreground group-hover:text-accent transition-colors mb-1">{project.name}</h3>
                <p className="text-xs text-foreground-secondary line-clamp-2 leading-relaxed">{project.description || 'No description'}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[10px] text-foreground-dim font-medium">
                    Created {new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-foreground-dim group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
