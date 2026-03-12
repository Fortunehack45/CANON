export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase-server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Settings, Github, Database, Shield } from 'lucide-react';
import { RepoLinkingForm } from './repo-linking-form';

interface Props {
  params: { slug: string; projectSlug: string };
}

export default async function ProjectSettingsPage({ params }: Props) {
  const supabase = createClient();

  const { data: org } = await supabase
    .from('organizations')
    .select('id, name, slug')
    .eq('slug', params.slug)
    .single();

  if (!org) notFound();

  const { data: project } = await supabase
    .from('projects')
    .select('id, name, description, slug, github_repo_id, github_repo_name')
    .eq('org_id', org.id)
    .eq('slug', params.projectSlug)
    .single();

  if (!project) notFound();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  // Verify access (Lead/Admin only)
  const { data: member } = await supabase
    .from('project_members')
    .select('role')
    .eq('project_id', project.id)
    .eq('user_id', user.id)
    .single();

  if (!member || !['admin', 'lead'].includes(member.role)) {
    return (
      <div className="p-8 text-center">
        <Shield className="w-12 h-12 text-danger mx-auto mb-4 opacity-20" />
        <h1 className="text-xl font-bold text-foreground mb-2">Access Restricted</h1>
        <p className="text-foreground-secondary text-sm">Only Project Leads or Admins can access integration settings.</p>
        <Link href={`/orgs/${params.slug}/projects/${params.projectSlug}`} className="mt-6 inline-block text-accent text-xs font-black uppercase tracking-widest">
          Go Back
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-8 space-y-12 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-foreground-muted">
        <Link href={`/orgs/${params.slug}/projects/${params.projectSlug}`} className="hover:text-accent transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> {project.name}
        </Link>
        <span>/</span>
        <span className="text-foreground">Settings</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-surface-2 border border-border rounded-xl flex items-center justify-center text-foreground-secondary shadow-sm">
          <Settings className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Project Settings</h1>
          <p className="text-foreground-secondary text-sm">Manage integrations, repository links, and intelligence capture.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-border">
         <div className="pb-4 border-b-2 border-accent text-accent text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer">
           Integrations
         </div>
         <div className="pb-4 border-b-2 border-transparent text-foreground-ghost hover:text-foreground text-[10px] font-black uppercase tracking-[0.2em] transition-colors cursor-not-allowed">
           General
         </div>
         <div className="pb-4 border-b-2 border-transparent text-foreground-ghost hover:text-foreground text-[10px] font-black uppercase tracking-[0.2em] transition-colors cursor-not-allowed">
           Governance
         </div>
      </div>

      <section className="space-y-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-foreground font-bold">
            <Github className="w-5 h-5" />
            <span>GitHub Connectivity</span>
          </div>
          <p className="text-xs text-foreground-dim leading-relaxed">
            Link this project to a GitHub repository to automatically harvest engineering decisions from pull requests and issues.
          </p>
        </div>

        <RepoLinkingForm 
          projectId={project.id} 
          currentRepoId={project.github_repo_id} 
          currentRepoName={project.github_repo_name}
        />
      </section>

      <section className="space-y-8 opacity-50 grayscale pt-8 border-t border-border">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-foreground-dim font-bold">
            <Database className="w-5 h-5" />
            <span>Vector Indexing</span>
          </div>
          <p className="text-[10px] text-foreground-ghost uppercase tracking-widest font-black">
            System Synced • 1,242 nodes
          </p>
        </div>
      </section>
    </div>
  );
}
