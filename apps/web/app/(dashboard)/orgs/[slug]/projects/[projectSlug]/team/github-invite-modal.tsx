'use client';

import { useState } from 'react';
import { Github, Send, Loader2, Check, AlertCircle, X } from 'lucide-react';
import { inviteToGithubRepo } from '../settings/github-actions';

interface Props {
  projectId: string;
  projectSlug: string;
  orgSlug: string;
  isLinked: boolean;
}

export function GitHubInviteModal({ projectId, projectSlug, orgSlug, isLinked }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [permission, setPermission] = useState<'pull' | 'push' | 'admin'>('push');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleInvite() {
    if (!username) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      await inviteToGithubRepo(projectId, username, permission);
      setStatus('success');
      setUsername('');
      setTimeout(() => {
        setStatus('idle');
        setIsOpen(false);
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err.message || 'Failed to send GitHub invitation');
    }
  }

  if (!isLinked) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-surface-2 border border-border text-foreground-secondary hover:text-accent hover:border-accent/40 text-[10px] font-black uppercase tracking-widest rounded-premium transition-all"
      >
        <Github className="w-3 h-3" /> Invite via GitHub
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative bg-surface-1 border border-border rounded-premium w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center text-accent">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">GitHub Invitation</h3>
                  <p className="text-[10px] text-foreground-dim uppercase tracking-widest font-black">Linked Repository</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-foreground-ghost hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-foreground-dim uppercase tracking-widest">GitHub Username</label>
                <input
                  type="text"
                  placeholder="e.g. heptagon-al"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-premium px-4 py-3 text-sm focus:outline-none focus:border-accent/40 focus:shadow-glow transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-foreground-dim uppercase tracking-widest">Permission Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'pull', label: 'Read' },
                    { id: 'push', label: 'Write' },
                    { id: 'admin', label: 'Admin' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setPermission(opt.id as any)}
                      className={`px-3 py-2 rounded-premium text-[10px] font-black uppercase tracking-widest border transition-all ${
                        permission === opt.id 
                          ? 'bg-accent/10 border-accent/40 text-accent shadow-glow' 
                          : 'bg-surface-2 border-border text-foreground-ghost hover:text-foreground'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 p-3 bg-danger/5 border border-danger/20 rounded-premium text-danger text-[10px] font-bold">
                  <AlertCircle className="w-4 h-4" />
                  {errorMsg}
                </div>
              )}

              {status === 'success' && (
                <div className="flex items-center gap-2 p-3 bg-success/5 border border-success/20 rounded-premium text-success text-[10px] font-bold animate-in slide-in-from-top-2">
                  <Check className="w-4 h-4" />
                  Invitation sent successfully!
                </div>
              )}

              <button
                onClick={handleInvite}
                disabled={!username || status === 'loading' || status === 'success'}
                className="w-full py-3.5 bg-accent text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-premium shadow-glow hover:bg-accent-hover transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Transmitting...
                  </>
                ) : status === 'success' ? (
                  <>
                    <Check className="w-4 h-4" /> Transmitted
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Invitation
                  </>
                )}
              </button>
            </div>
            
            <div className="p-4 bg-surface-2/30 border-t border-border text-center">
              <p className="text-[9px] text-foreground-ghost font-medium italic">
                Users will receive an email from GitHub and an in-app notification to join the repository.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
