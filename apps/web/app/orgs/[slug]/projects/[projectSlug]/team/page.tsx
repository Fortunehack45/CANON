export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase-server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Users, Shield, Github, UserPlus, Mail, Clock } from 'lucide-react';
import { GitHubInviteModal } from './github-invite-modal';

interface Props {
  params: { slug: string; projectSlug: string };
}

export default async function ProjectTeamPage({ params }: Props) {
  const supabase = createClient();

  const { data: org } = await supabase
    .from('organizations')
    .select('id, name, slug')
    .eq('slug', params.slug)
    .single();

  if (!org) notFound();

  const { data: project } = await supabase
    .from('projects')
    .select('id, name, slug, github_repo_id, github_repo_name')
    .eq('org_id', org.id)
    .eq('slug', params.projectSlug)
    .single();

  if (!project) notFound();

  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect('/auth/login');

  // Fetch project members
  const { data: members } = await supabase
    .from('project_members')
    .select(`
      id,
      role,
      custom_role_name,
      joined_at,
      user:users (
        id,
        name,
        email,
        avatar_url,
        github_login
      )
    `)
    .eq('project_id', project.id);

  // Get current user's role in the project
  const currentMember = (members as any)?.find((m: any) => m.user.id === authUser.id);
  const canInvite = currentMember && ['admin', 'lead'].includes(currentMember.role);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-8 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-foreground-muted">
        <Link href={`/orgs/${params.slug}/projects/${params.projectSlug}`} className="hover:text-accent transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> {project.name}
        </Link>
        <span>/</span>
        <span className="text-foreground">Team</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center text-accent">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Project Team</h1>
            <p className="text-foreground-secondary text-sm">Manage project contributors and GitHub repository access.</p>
          </div>
        </div>
        
        {canInvite && (
          <div className="flex items-center gap-3">
             <GitHubInviteModal 
                projectId={project.id} 
                projectSlug={project.slug} 
                orgSlug={params.slug} 
                isLinked={!!project.github_repo_id} 
              />
             <button className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-black text-[10px] uppercase tracking-widest rounded-premium shadow-glow hover:bg-accent-hover transition-all">
                <UserPlus className="w-4 h-4" /> Add Member
             </button>
          </div>
        )}
      </div>

      {!project.github_repo_id && (
         <div className="p-6 bg-surface-2 border border-dashed border-border rounded-premium flex flex-col items-center text-center space-y-3">
            <Github className="w-8 h-8 text-foreground-ghost opacity-20" />
            <div>
               <h3 className="font-bold text-foreground">GitHub Not Linked</h3>
               <p className="text-xs text-foreground-dim max-w-sm mx-auto">Link this project to a GitHub repository to invite collaborators directly from this dashboard.</p>
            </div>
            <Link 
               href={`/orgs/${params.slug}/projects/${params.projectSlug}/settings`}
               className="text-[10px] font-black uppercase tracking-widest text-accent hover:text-accent-hover transition-colors"
            >
               Go to Settings →
            </Link>
         </div>
      )}

      {/* Team List */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-[10px] font-black text-foreground-dim uppercase tracking-[0.2em]">Active Contributors</h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="bg-surface-1 border border-border rounded-premium overflow-hidden shadow-sm">
          <table className="w-full text-left font-inter">
            <thead>
              <tr className="bg-surface-2/50 border-b border-border text-[10px] font-bold text-foreground-dim uppercase tracking-widest">
                <th className="px-6 py-4">Engineer</th>
                <th className="px-6 py-4">Project Role</th>
                <th className="px-6 py-4">GitHub</th>
                <th className="px-6 py-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {members?.map((m: any) => (
                <tr key={m.id} className="group hover:bg-surface-2/30 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      {m.user.avatar_url ? (
                        <img src={m.user.avatar_url} className="w-8 h-8 rounded-full border border-border shadow-sm" alt="" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-surface-3 flex items-center justify-center text-[10px] font-black text-foreground-ghost">
                          {m.user.name?.charAt(0) || m.user.email.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-foreground group-hover:text-accent transition-colors">
                          {m.user.name || 'Anonymous'}
                        </div>
                        <div className="text-xs text-foreground-dim font-medium">{m.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                       <span className={`inline-flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                          m.role === 'lead' ? 'bg-warning/10 border-warning/20 text-warning' : 
                          m.role === 'admin' ? 'bg-accent/10 border-accent/20 text-accent' : 
                          'bg-surface-3 border-border text-foreground-ghost'
                       }`}>
                          {m.role}
                       </span>
                       {m.custom_role_name && (
                          <span className="text-[10px] font-medium italic text-foreground-dim">{m.custom_role_name}</span>
                       )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {m.user.github_login ? (
                      <div className="flex items-center gap-2">
                        <Github className="w-3.5 h-3.5 text-foreground-ghost" />
                        <span className="text-xs font-bold text-foreground-secondary">@{m.user.github_login}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-foreground-ghost italic">—</span>
                    )}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-xs font-medium text-foreground-dim">
                       {new Date(m.joined_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* How it works note */}
      <div className="bg-accent/5 border border-accent/20 border-dashed rounded-premium p-6">
         <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center text-accent flex-shrink-0">
               <Shield className="w-4 h-4" />
            </div>
            <div>
               <h4 className="font-bold text-foreground text-sm mb-1">Collaborator Management</h4>
               <p className="text-[11px] text-foreground-secondary leading-relaxed">
                  Project Leads can directly manage external GitHub access. Invitations sent via Black Box will automatically link the user's GitHub identity to their architectural contributions once they accept on GitHub.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
