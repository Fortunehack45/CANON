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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-gradient-to-br from-surface-2 to-surface-3 border border-border rounded-2xl flex items-center justify-center text-accent font-black text-2xl shadow-lg group">
            <div className="group-hover:scale-110 transition-transform duration-500">
              {org.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-foreground">{org.name}</h1>
            <p className="text-foreground-secondary text-sm font-medium">{org.description || 'Engineering intelligence network'}</p>
          </div>
        </div>
        <Link
          href={`/orgs/${params.slug}/projects/new`}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-premium shadow-glow hover:bg-accent-hover transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> New Project
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Folder, label: 'Projects', value: projects?.length ?? 0, gradient: 'from-accent/10 to-transparent', textColor: 'text-accent' },
          { icon: Users, label: 'Members', value: memberCount ?? 0, gradient: 'from-success/10 to-transparent', textColor: 'text-success' },
          { icon: Activity, label: 'Decisions', value: decisionCount ?? 0, gradient: 'from-warning/10 to-transparent', textColor: 'text-warning' },
        ].map(stat => (
          <div key={stat.label} className="bg-surface-1 border border-border rounded-premium p-8 relative overflow-hidden group shadow-sm hover:border-accent/30 transition-all duration-700">
            <div className={`absolute -inset-10 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-1000`} />
            
            <div className="relative z-10 flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-foreground-dim mb-6 group-hover:scale-110 group-hover:text-accent transition-all duration-500">
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={`text-4xl font-black ${stat.textColor} tracking-tighter mb-1.5 group-hover:scale-105 transition-transform duration-500`}>{stat.value}</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground-ghost group-hover:text-foreground-dim transition-colors">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Projects Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <h2 className="text-[10px] font-black text-foreground-dim uppercase tracking-[0.3em] whitespace-nowrap">Active Nodes</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        </div>

        {!projects || projects.length === 0 ? (
          <div className="bg-surface-1 border border-dashed border-border rounded-premium p-20 text-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-surface-2/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-20 h-20 bg-surface-2 rounded-full flex items-center justify-center mx-auto mb-6 border border-border shadow-inner">
                <Layers className="w-8 h-8 text-foreground-ghost opacity-40 animate-pulse" />
              </div>
              <h3 className="text-xl font-black text-foreground mb-3">No Nodes Detected</h3>
              <p className="text-sm text-foreground-secondary max-w-sm mx-auto mb-8 font-medium italic">
                Initialize your first project node to begin indexing engineering intelligence.
              </p>
              <Link
                href={`/orgs/${params.slug}/projects/new`}
                className="inline-flex items-center gap-3 px-8 py-3.5 bg-accent text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-premium shadow-glow hover:bg-accent-hover transition-all"
              >
                <Plus className="w-4 h-4" /> Create First Node
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map(project => (
              <Link
                key={project.id}
                href={`/orgs/${params.slug}/projects/${project.slug}`}
                className="bg-surface-1 border border-border rounded-premium p-8 hover:border-accent/40 hover:bg-surface-2 transition-all duration-700 group relative overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-accent"
              >
                {/* Premium Shine Effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="w-12 h-12 bg-surface-2 border border-border rounded-xl flex items-center justify-center text-accent group-hover:scale-110 group-hover:bg-accent/5 group-hover:border-accent/20 transition-all duration-500">
                      <Folder className="w-6 h-6" />
                    </div>
                    <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border transition-all duration-500 ${
                      project.status === 'active'
                        ? 'bg-success/5 text-success border-success/10 group-hover:border-success/30'
                        : 'bg-surface-3 text-foreground-ghost border-border'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-foreground tracking-tight group-hover:text-accent transition-colors duration-300 mb-2">{project.name}</h3>
                  <p className="text-[13px] text-foreground-secondary line-clamp-2 leading-relaxed font-medium">{project.description || 'Project intelligence node'}</p>
                </div>

                <div className="mt-8 pt-6 border-t border-border flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-foreground-ghost" />
                    <span className="text-[9px] text-foreground-ghost font-black uppercase tracking-widest">
                      Indexed {new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-accent opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                    Connect <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
