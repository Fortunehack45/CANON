// Team Settings Page
import { createClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';
import { Users, Mail, ShieldAlert } from 'lucide-react';

export default async function TeamPage() {
  const supabase = createClient();
  
  // Fetch users (in a real app, constrained to org_id)
  const { data: users } = await supabase
    .from('users')
    .select('id, name, email, role, created_at')
    .order('created_at', { ascending: false });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-8 space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">Team Directory</h1>
          <p className="text-foreground-secondary">Manage engineers and architectural reviewers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-surface-1 border border-border rounded-premium p-6 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-foreground mb-1">{users?.length || 0}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-foreground-muted">Active Intelligence units</div>
         </div>
         
         <div className="md:col-span-2 bg-surface-1 border border-dashed border-border rounded-premium p-6 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="text-center md:text-left relative z-10">
              <h3 className="text-lg font-bold text-foreground mb-1">Invite New Architect</h3>
              <p className="text-sm text-foreground-secondary">Scale your engineering knowledge pool.</p>
            </div>
            <button className="whitespace-nowrap px-6 py-2.5 bg-accent text-white text-sm font-bold rounded-premium shadow-glow hover:bg-accent-hover transition-all relative z-10">
              Generate Invite
            </button>
         </div>
      </div>

      <div className="bg-surface-1 border border-border rounded-premium overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-2/50 border-b border-border text-[10px] font-bold text-foreground-dim uppercase tracking-widest">
                <th className="px-6 py-4">Engineer</th>
                <th className="px-6 py-4">Status / Role</th>
                <th className="px-6 py-4">Engagement</th>
                <th className="px-6 py-4 text-right">Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {!users || users.length === 0 ? (
                 <tr>
                   <td colSpan={4} className="px-6 py-12 text-center text-foreground-muted italic">
                     No team data records found.
                   </td>
                 </tr>
              ) : (
                users.map(u => (
                  <tr key={u.id} className="hover:bg-surface-2/30 transition-colors group">
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-[10px] font-bold text-accent">
                           {u.name?.charAt(0) || 'A'}
                         </div>
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
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-surface-3 text-foreground-muted border border-border">
                            Engineer
                          </span>
                        )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-medium text-foreground-secondary">
                        Joined {new Date(u.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
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
  );
}
