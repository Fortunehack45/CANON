export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import { createProject } from '../../../actions';
import { ArrowRight, Layers } from 'lucide-react';
import Link from 'next/link';

interface Props {
  params: { slug: string };
}

export default async function NewProjectPage({ params }: Props) {
  const supabase = createClient();

  const { data: org } = await supabase
    .from('organizations')
    .select('id, name, slug')
    .eq('slug', params.slug)
    .single();

  if (!org) notFound();

  async function handleCreateProject(formData: FormData) {
    'use server';
    await createProject(formData);
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-glow">
            <span className="text-white font-black text-lg">⬡</span>
          </div>
          <span className="text-xl font-black tracking-tight text-foreground">Black Box</span>
        </div>

        <div className="bg-surface-1 border border-border rounded-premium p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center text-accent">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-foreground">New Project</h1>
              <p className="text-xs text-foreground-muted">Under <span className="font-bold text-accent">{org.name}</span></p>
            </div>
          </div>

          <p className="text-sm text-foreground-secondary mb-6 mt-4">
            Projects organize decisions by product area, team, or initiative. Each project gets its own intelligence feed.
          </p>

          <form action={handleCreateProject} className="space-y-6">
            <input type="hidden" name="org_id" value={org.id} />

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground-dim">Project Name</label>
              <input
                type="text"
                name="name"
                required
                maxLength={60}
                placeholder="Checkout Service"
                className="w-full px-4 py-3.5 bg-surface-2 border border-border rounded-subtle text-foreground placeholder-foreground-dim text-sm font-bold focus:outline-none focus:border-accent/40 focus:shadow-glow transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground-dim">
                Description <span className="text-foreground-dim/50 font-medium normal-case tracking-normal">(optional)</span>
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="Decisions and architecture records for the checkout payment flow..."
                className="w-full px-4 py-3 bg-surface-2 border border-border rounded-subtle text-foreground placeholder-foreground-dim text-sm font-medium focus:outline-none focus:border-accent/40 transition-all resize-none"
              />
            </div>

            <button
              formAction={handleCreateProject}
              type="submit"
              className="w-full py-4 bg-accent text-white font-black text-[10px] uppercase tracking-widest rounded-premium shadow-glow hover:bg-accent-hover active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Create Project <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-foreground-dim mt-6">
          <Link href={`/orgs/${params.slug}`} className="text-accent font-bold hover:underline">← Back to {org.name}</Link>
        </p>
      </div>
    </div>
  );
}
