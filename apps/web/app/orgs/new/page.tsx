import { createOrg } from '../actions';
import { Building2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function NewOrgPage() {
  async function handleCreate(formData: FormData) {
    'use server';
    await createOrg(formData);
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-glow">
            <span className="text-white font-black text-lg">⬡</span>
          </div>
          <span className="text-xl font-black tracking-tight text-foreground">Black Box</span>
        </div>

        <div className="bg-surface-1 border border-border rounded-premium p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center text-accent">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-foreground">Create Organization</h1>
              <p className="text-xs text-foreground-muted">Your engineering team's knowledge base</p>
            </div>
          </div>

          <form action={handleCreate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground-dim">Organization Name</label>
              <input
                type="text"
                name="name"
                required
                maxLength={80}
                placeholder="Acme Corp Engineering"
                className="w-full px-4 py-3.5 bg-surface-2 border border-border rounded-subtle text-foreground placeholder-foreground-dim text-sm font-bold focus:outline-none focus:border-accent/40 focus:shadow-glow transition-all"
              />
              <p className="text-[10px] text-foreground-dim">A URL-friendly slug will be auto-generated.</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground-dim">Description <span className="text-foreground-dim/50 font-medium normal-case tracking-normal">(optional)</span></label>
              <textarea
                name="description"
                rows={3}
                placeholder="Engineering knowledge intelligence for our platform team..."
                className="w-full px-4 py-3 bg-surface-2 border border-border rounded-subtle text-foreground placeholder-foreground-dim text-sm font-medium focus:outline-none focus:border-accent/40 transition-all resize-none"
              />
            </div>

            <div className="bg-surface-2 border border-border/50 rounded-subtle p-4 space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-foreground-muted">What happens next</p>
              <ul className="space-y-1.5 text-xs text-foreground-secondary">
                <li className="flex items-start gap-2"><span className="text-accent mt-0.5">→</span> You become the organization Admin</li>
                <li className="flex items-start gap-2"><span className="text-accent mt-0.5">→</span> Invite your engineers via unique invite links</li>
                <li className="flex items-start gap-2"><span className="text-accent mt-0.5">→</span> Create projects and connect GitHub repos</li>
              </ul>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-accent text-white font-black text-[10px] uppercase tracking-widest rounded-premium shadow-glow hover:bg-accent-hover active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Create Organization <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-foreground-dim mt-6">
          Already in an organization?{' '}
          <Link href="/" className="text-accent font-bold hover:underline">Go to Dashboard</Link>
        </p>
      </div>
    </div>
  );
}
