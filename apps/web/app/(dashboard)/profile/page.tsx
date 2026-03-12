import { createClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import { ProfileForm } from './profile-form';
import { User as UserIcon, Shield, Clock } from 'lucide-react';

export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) notFound();

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (!user) notFound();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-8 space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-foreground">My Profile</h1>
        <p className="text-foreground-secondary text-sm">Manage your professional identity and social presence.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Editor */}
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-surface-1 border border-border rounded-premium p-8 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-widest text-foreground-dim mb-8 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-accent" /> Account Information
            </h2>
            <ProfileForm initialData={user} />
          </div>
        </div>

        {/* Right Column: Identity Card */}
        <div className="space-y-6">
          <div className="bg-surface-1 border border-border rounded-premium p-8 shadow-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-surface-2 rounded-full border-2 border-accent/20 p-1 mb-4">
                <div className="w-full h-full bg-accent/10 rounded-full flex items-center justify-center text-accent">
                  <UserIcon className="w-10 h-10" />
                </div>
              </div>
              <h3 className="text-xl font-black text-foreground">{user.name || 'Anonymous User'}</h3>
              <p className="text-foreground-dim text-[10px] font-black uppercase tracking-widest mb-4">@{user.github_login || 'non-github'}</p>
              
              <div className="w-full h-px bg-border my-6" />

              <div className="w-full space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center text-accent">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-foreground-dim">Organization Role</div>
                    <div className="text-xs font-bold text-foreground">{user.role || 'Member'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center text-accent">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-foreground-dim">Member Since</div>
                    <div className="text-xs font-bold text-foreground">{new Date(user.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-accent/5 border border-accent/20 rounded-premium p-6">
            <div className="flex items-center gap-2 mb-2 text-accent">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Premium Entity</span>
            </div>
            <p className="text-[11px] text-foreground-secondary leading-relaxed font-medium">
              Your profile is visible to all members of your organizations. Keep your bio updated to help your team understand your technical focus.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sparkles(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
