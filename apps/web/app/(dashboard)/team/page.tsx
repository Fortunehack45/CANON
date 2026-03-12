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
    <div className="animate-in max-w-4xl">
       <div className="page-header mb-8">
        <h1 className="page-title">Team Directory</h1>
        <p className="page-subtitle">Manage engineers and reviewers in your organization.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="col-span-1 border border-neutral-800 bg-neutral-900/40 rounded-xl p-6">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{users?.length || 0}</div>
            <div className="text-sm text-neutral-400">Active Members</div>
         </div>
         
         <div className="col-span-1 md:col-span-2 border border-dashed border-neutral-800 rounded-xl p-6 flex items-center justify-center text-center">
            <div>
              <Mail className="w-6 h-6 text-neutral-600 mx-auto mb-3" />
              <h3 className="text-white font-medium mb-1">Invite Members</h3>
              <p className="text-sm text-neutral-500 mb-4">Send email invites to join your workspace.</p>
              <button className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors">
                 Send Invite
              </button>
            </div>
         </div>
      </div>

      <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900/20">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-900/80 text-neutral-400 border-b border-neutral-800">
            <tr>
              <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Member</th>
              <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Role</th>
              <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Joined</th>
              <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60">
            {!users || users.length === 0 ? (
               <tr>
                 <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">
                   No team members found.
                 </td>
               </tr>
            ) : (
              users.map(u => (
                <tr key={u.id} className="hover:bg-neutral-800/20 transition-colors">
                  <td className="px-6 py-4">
                     <div className="font-medium text-white">{u.name || 'Anonymous'}</div>
                     <div className="text-neutral-500">{u.email}</div>
                  </td>
                  <td className="px-6 py-4">
                      {u.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          <ShieldAlert className="w-3 h-3" /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-800 text-neutral-300 border border-neutral-700">
                          Engineer
                        </span>
                      )}
                  </td>
                  <td className="px-6 py-4 text-neutral-400">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-neutral-500 hover:text-white transition-colors">Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
