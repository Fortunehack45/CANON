// Workspace Settings Page
import { Github, Slack, Database } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="animate-in max-w-3xl pb-20">
       <div className="page-header mb-8">
        <h1 className="page-title">Workspace Settings</h1>
        <p className="page-subtitle">Manage integrations and organization preferences.</p>
      </div>

      <div className="space-y-8">
        
        <section className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 sm:p-8">
           <h2 className="text-xl font-medium text-white mb-6 border-b border-neutral-800/80 pb-4">Integrations</h2>
           
           <div className="space-y-4">
              {/* GitHub */}
              <div className="flex items-center justify-between p-4 border border-neutral-800 rounded-xl bg-neutral-900/60">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-neutral-800 flex items-center justify-center rounded-lg border border-neutral-700 text-white">
                      <Github className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-medium text-white">GitHub</div>
                      <div className="text-sm text-neutral-400">Sync PRs and commit SHAs to decisions</div>
                    </div>
                 </div>
                 <button className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 rounded-lg text-sm font-medium transition-colors">
                    Connect
                 </button>
              </div>

              {/* Slack */}
              <div className="flex items-center justify-between p-4 border border-neutral-800 rounded-xl bg-neutral-900/60">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-neutral-800 flex items-center justify-center rounded-lg border border-neutral-700 text-blue-400">
                      <Slack className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Slack</div>
                      <div className="text-sm text-neutral-400">Auto-nudge reviewers for pending decisions</div>
                    </div>
                 </div>
                 <button className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 rounded-lg text-sm font-medium transition-colors">
                    Connect
                 </button>
              </div>
           </div>
        </section>

        <section className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 sm:p-8">
           <h2 className="text-xl font-medium text-white mb-6 border-b border-neutral-800/80 pb-4">General Configuration</h2>
           
           <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Organization Name</label>
                <input 
                  type="text" 
                  defaultValue="Fortunehack45"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Approval Policy</label>
                <select 
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="1">1 Senior Engineer Approval Required</option>
                  <option value="2">2 Approvals Required</option>
                  <option value="0">No Approval Required (Log only)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end">
                 <button type="button" className="px-6 py-2.5 bg-white text-black rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors">
                    Save Changes
                 </button>
              </div>
           </form>
        </section>

        <section className="border border-red-900/50 bg-red-950/10 rounded-2xl p-6 sm:p-8">
           <h2 className="text-xl font-medium text-red-500 mb-2">Danger Zone</h2>
           <p className="text-sm text-neutral-400 mb-6">Irreversible actions for your workspace.</p>
           
           <div className="flex items-center justify-between p-4 border border-red-900/30 rounded-xl bg-red-950/20">
              <div>
                <div className="font-medium text-white">Delete Workspace</div>
                <div className="text-sm text-neutral-500">Permanently delete all decision records and history.</div>
              </div>
              <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg text-sm font-medium transition-colors">
                Delete Workspace
              </button>
           </div>
        </section>

      </div>
    </div>
  );
}
