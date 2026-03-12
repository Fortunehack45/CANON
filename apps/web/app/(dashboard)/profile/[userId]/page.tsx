import { createClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import { User as UserIcon, MapPin, Globe, Twitter, Linkedin, Briefcase, Calendar } from 'lucide-react';
import Link from 'next/link';

interface Props {
  params: { userId: string };
}

export default async function PublicProfilePage({ params }: Props) {
  const supabase = createClient();

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', params.userId)
    .single();

  if (!user) notFound();

  // Get user's project roles
  const { data: projectRoles } = await supabase
    .from('project_members')
    .select('*, projects(name, slug, orgs(slug))')
    .eq('user_id', user.id);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-8 max-w-5xl mx-auto space-y-12">
      {/* Profile Header Card */}
      <div className="bg-surface-1 border border-border rounded-premium p-10 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <UserIcon className="w-32 h-32" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start">
          <div className="w-32 h-32 bg-surface-2 rounded-2xl border-2 border-accent/20 p-1 shrink-0 shadow-accent">
            <div className="w-full h-full bg-accent/10 rounded-xl flex items-center justify-center text-accent">
              <UserIcon className="w-14 h-14" />
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-foreground">{user.name || 'Anonymous User'}</h1>
              <p className="text-accent text-sm font-bold tracking-widest uppercase">@{user.github_login || 'non-github'}</p>
            </div>

            <p className="text-foreground-secondary text-lg leading-relaxed max-w-2xl font-medium">
              {user.bio || "No professional bio provided yet. Engineering brilliance in progress."}
            </p>

            <div className="flex flex-wrap gap-6 pt-2">
              {user.location && (
                <div className="flex items-center gap-2 text-foreground-dim text-xs font-bold uppercase tracking-widest">
                  <MapPin className="w-3.5 h-3.5 text-accent" /> {user.location}
                </div>
              )}
              {user.website && (
                <a href={user.website} target="_blank" className="flex items-center gap-2 text-foreground-dim text-xs font-bold uppercase tracking-widest hover:text-accent transition-colors">
                  <Globe className="w-3.5 h-3.5 text-accent" /> Website
                </a>
              )}
              {user.twitter && (
                <a href={`https://twitter.com/${user.twitter.replace('@', '')}`} target="_blank" className="flex items-center gap-2 text-foreground-dim text-xs font-bold uppercase tracking-widest hover:text-accent transition-colors">
                  <Twitter className="w-3.5 h-3.5 text-accent" /> Twitter
                </a>
              )}
              {user.linkedin && (
                <a href={user.linkedin} target="_blank" className="flex items-center gap-2 text-foreground-dim text-xs font-bold uppercase tracking-widest hover:text-accent transition-colors">
                  <Linkedin className="w-3.5 h-3.5 text-accent" /> LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Project Contributions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-accent" /> Project Roles
            </h2>
            <div className="h-px bg-border flex-1 mx-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectRoles && projectRoles.length > 0 ? (
              projectRoles.map((pm: any) => (
                <Link 
                  key={pm.id}
                  href={`/orgs/${pm.projects.orgs.slug}/projects/${pm.projects.slug}`}
                  className="bg-surface-1 border border-border rounded-xl p-5 hover:border-accent/30 hover:bg-surface-2 transition-all group"
                >
                  <div className="text-[10px] font-black uppercase tracking-widest text-foreground-dim mb-1 group-hover:text-accent transition-colors">
                    {pm.projects.name}
                  </div>
                  <div className="text-sm font-bold text-foreground">{pm.custom_role_name || pm.role}</div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-12 text-center bg-surface-1 border border-dashed border-border rounded-xl">
                <p className="text-xs font-bold text-foreground-dim uppercase tracking-widest">No public project roles found</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Activity/Meta */}
        <div className="space-y-6">
          <div className="bg-surface-1 border border-border rounded-premium p-6 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground-dim mb-6 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent" /> Identity Matrix
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="text-[9px] font-black uppercase tracking-widest text-foreground-ghost mb-1">Affiliation</div>
                <div className="text-xs font-bold text-foreground">Black Box Engineering</div>
              </div>
              <div>
                <div className="text-[9px] font-black uppercase tracking-widest text-foreground-ghost mb-1">Security Clearance</div>
                <div className="text-xs font-bold text-foreground">{user.role || 'Member'}</div>
              </div>
              <div>
                <div className="text-[9px] font-black uppercase tracking-widest text-foreground-ghost mb-1">Joined Nebula</div>
                <div className="text-xs font-bold text-foreground">{new Date(user.created_at).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
