// Team Settings Page — with invite system
import { createClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';
import { Users, Mail, ShieldAlert, Clock, Plus, Trash2, UserPlus } from 'lucide-react';
import { InviteButton } from '@/components/invite-button';

export default async function TeamPage() {
  const supabase = createClient();
  
  const { data: { user: authUser } } = await supabase.auth.getUser();

  // Get current user's role
  const { data: currentUser } = await supabase
    .from('users')
    .select('id, org_id, role')
    .eq('id', authUser?.id ?? '')
    .single();

  const canInvite = currentUser && ['admin', 'lead'].includes(currentUser.role);

  // Fetch team members in same org
  const { data: users } = await supabase
    .from('users')
    .select('id, name, email, role, created_at, avatar_url, github_login')
    .eq('org_id', currentUser?.org_id ?? '')
    .order('created_at', { ascending: false });

  // Fetch pending invitations
  const { data: invitations } = currentUser?.org_id
    ? await supabase
        .from('invitations')
        .select('id, email, role, expires_at, created_at, invited_by')
        .eq('org_id', currentUser.org_id)
        .is('accepted_at', null)
        .order('created_at', { ascending: false })
    : { data: [] };

  const pendingInvites = (invitations ?? []).filter(
    inv => new Date(inv.expires_at) > new Date()
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-8 space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">Team Directory</h1>
          <p className="text-foreground-secondary">Manage engineers and architectural reviewers. Members join by invitation only.</p>
        </div>
        {canInvite && <InviteButton />}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-surface-1 border border-border rounded-premium p-6 shadow-sm hover:border-accent/30 transition-all duration-500 group">
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-foreground mb-1 group-hover:text-accent transition-colors">{users?.length || 0}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-foreground-muted">Active Members</div>
         </div>

         <div className="bg-surface-1 border border-border rounded-premium p-6 shadow-sm hover:border-warning/30 transition-all duration-500 group">
            <div className="w-10 h-10 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center text-warning mb-4 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-foreground mb-1 group-hover:text-warning transition-colors">{pendingInvites.length}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-foreground-muted">Pending Invitations</div>
         </div>
         
         <div className="md:col-span-1 bg-surface-1 border border-dashed border-border rounded-premium p-6 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="text-center md:text-left relative z-10">
              <h3 className="text-lg font-bold text-foreground mb-1">Invite Only Access</h3>
              <p className="text-sm text-foreground-secondary">New members require a valid invite link.</p>
            </div>
            {canInvite && (
              <InviteButton small />
            )}
         </div>
      </div>

      {/* Pending Invitations */}
      {pendingInvites.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[10px] font-black text-foreground-dim uppercase tracking-[0.2em]">Pending Invitations</h2>
            <div className="h-px flex-1 bg-border" />
            <div className="px-2 py-px bg-warning/10 border border-warning/20 rounded text-[10px] font-bold text-warning uppercase tracking-widest">{pendingInvites.length} pending</div>
          </div>
          <div className="bg-surface-1 border border-border rounded-premium overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-2/50 border-b border-border text-[10px] font-bold text-foreground-dim uppercase tracking-widest">
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Expires</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {pendingInvites.map(inv => (
                  <tr key={inv.id} className="group hover:bg-surface-2/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-warning/10 border border-warning/20 flex items-center justify-center">
                          <Mail className="w-3.5 h-3.5 text-warning" />
                        </div>
                        <span className="text-sm font-bold text-foreground">{inv.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-surface-3 text-foreground-muted border border-border capitalize">{inv.role}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground-secondary">
                      {new Date(inv.expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[10px] font-bold uppercase tracking-widest text-foreground-dim hover:text-danger transition-colors flex items-center gap-1 ml-auto">
                        <Trash2 className="w-3 h-3" /> Revoke
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Active Members */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-[10px] font-black text-foreground-dim uppercase tracking-[0.2em]">Active Members</h2>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="bg-surface-1 border border-border rounded-premium overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-2/50 border-b border-border text-[10px] font-bold text-foreground-dim uppercase tracking-widest">
                  <th className="px-6 py-4">Engineer</th>
                  <th className="px-6 py-4">Status / Role</th>
                  <th className="px-6 py-4">GitHub</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right">Settings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {!users || users.length === 0 ? (
                   <tr>
                     <td colSpan={5} className="px-6 py-16 text-center">
                       <div className="flex flex-col items-center gap-3">
                         <UserPlus className="w-8 h-8 text-foreground-dim opacity-30" />
                         <p className="text-foreground-muted text-sm font-medium">No team members yet. Invite your first engineer above.</p>
                       </div>
                     </td>
                   </tr>
                ) : (
                  users.map(u => (
                    <tr key={u.id} className="hover:bg-surface-2/30 transition-colors group">
                      <td className="px-6 py-5">
                         <div className="flex items-center gap-3">
                           {u.avatar_url ? (
                             <img src={u.avatar_url} alt={u.name ?? ''} className="w-8 h-8 rounded-full border border-border" />
                           ) : (
                             <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-[10px] font-black text-accent">
                               {(u.name ?? u.email)?.charAt(0).toUpperCase()}
                             </div>
                           )}
                           <div>
                             <div className="font-bold text-foreground group-hover:text-accent transition-colors">{u.name || 'Anonymous'}</div>
                             <div className="text-xs text-foreground-dim font-medium">{u.email}</div>
                           </div>
                         </div>
                      </td>
                      <td className="px-6 py-5">
                          {u.role === 'admin' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-accent-subtle text-accent border border-accent/20">
                              <ShieldAlert className="w-3 h-3" /> Admin
                            </span>
                          ) : u.role === 'lead' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-warning/10 text-warning border border-warning/20">
                              Lead
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-surface-3 text-foreground-muted border border-border">
                              {u.role || 'Engineer'}
                            </span>
                          )}
                      </td>
                      <td className="px-6 py-5">
                        {u.github_login ? (
                          <a
                            href={`https://github.com/${u.github_login}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-foreground-secondary hover:text-accent transition-colors"
                          >
                            @{u.github_login}
                          </a>
                        ) : (
                          <span className="text-xs text-foreground-dim">—</span>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-medium text-foreground-secondary">
                          {new Date(u.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="text-[10px] font-bold uppercase tracking-widest text-foreground-dim hover:text-accent transition-colors">Edit Profile</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
