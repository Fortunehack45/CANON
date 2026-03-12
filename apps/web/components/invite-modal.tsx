'use client';
import { useState, useTransition } from 'react';
import { Mail, Plus, X, ChevronDown, Copy, Check, AlertCircle } from 'lucide-react';
import { inviteUser } from '@/app/(dashboard)/team/actions';

const ROLES = [
  { value: 'admin', label: 'Admin', desc: 'Full access, manage org & members' },
  { value: 'lead', label: 'Lead', desc: 'Confirm decisions, view team health' },
  { value: 'engineer', label: 'Engineer', desc: 'View & submit decisions' },
  { value: 'viewer', label: 'Viewer', desc: 'Read-only access' },
];

export function InviteModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('engineer');
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ error?: string; inviteUrl?: string } | null>(null);
  const [copied, setCopied] = useState(false);

  function copyLink() {
    if (!result?.inviteUrl) return;
    navigator.clipboard.writeText(result.inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.set('email', email);
    fd.set('role', role);
    startTransition(async () => {
      const res = await inviteUser(fd);
      setResult(res as any);
    });
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-surface-1 border border-border rounded-premium p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-black tracking-tight text-foreground">Invite Team Member</h2>
            <p className="text-[10px] text-foreground-muted uppercase tracking-widest mt-0.5">Invite link expires in 7 days</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-2 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {!result?.inviteUrl ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground-dim">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-dim" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="engineer@company.com"
                  className="w-full pl-11 pr-4 py-3 bg-surface-2 border border-border rounded-subtle text-foreground placeholder-foreground-dim text-sm font-medium focus:outline-none focus:border-accent/40 focus:shadow-glow transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground-dim">Role</label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`p-3 rounded-subtle border text-left transition-all ${
                      role === r.value
                        ? 'border-accent/50 bg-accent/10 text-accent'
                        : 'border-border bg-surface-2 text-foreground-secondary hover:border-border-hover'
                    }`}
                  >
                    <div className="text-xs font-black">{r.label}</div>
                    <div className="text-[10px] text-foreground-muted leading-tight mt-0.5">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {result?.error && (
              <div className="flex items-center gap-2 p-3 bg-danger/10 border border-danger/20 rounded-subtle text-danger text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {result.error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 bg-accent text-white font-black text-[10px] uppercase tracking-widest rounded-premium shadow-glow hover:bg-accent-hover active:scale-95 transition-all disabled:opacity-60"
            >
              {isPending ? 'Generating Invite...' : 'Generate Invite Link'}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="p-4 bg-success/10 border border-success/20 rounded-subtle text-center">
              <p className="text-sm font-bold text-success mb-0.5">Invite Link Generated!</p>
              <p className="text-[10px] text-foreground-muted">Share this link with <span className="text-foreground font-bold">{email}</span></p>
            </div>

            <div className="bg-surface-2 border border-border rounded-subtle p-3 flex items-center gap-3">
              <p className="text-xs text-foreground-secondary font-mono truncate flex-1">{result.inviteUrl}</p>
              <button
                onClick={copyLink}
                className="flex-shrink-0 p-2 rounded-md hover:bg-surface-3 text-foreground-secondary hover:text-accent transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-[10px] text-foreground-muted text-center">
              ⚠ Email sending coming soon. For now, manually share this link.
            </p>

            <button
              onClick={onClose}
              className="w-full py-3 bg-surface-2 text-foreground-secondary font-bold text-sm rounded-premium hover:bg-surface-3 transition-all border border-border"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
