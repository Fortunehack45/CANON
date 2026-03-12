import { createClient } from '@/lib/supabase-server';
import { acceptInvite } from './actions';
import { CheckCircle, Clock, Users, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface Props {
  params: { token: string };
}

export default async function AcceptInvitePage({ params }: Props) {
  const { token } = params;
  const supabase = createClient();

  // Fetch the invitation details
  const { data: invite } = await supabase
    .from('invitations')
    .select(`
      id, email, role, expires_at, accepted_at,
      organizations (name, slug)
    `)
    .eq('token', token)
    .single();

  const { data: { user } } = await supabase.auth.getUser();

  let status: 'valid' | 'expired' | 'used' | 'invalid' = 'invalid';
  if (invite) {
    if (invite.accepted_at) status = 'used';
    else if (new Date(invite.expires_at) < new Date()) status = 'expired';
    else status = 'valid';
  }

  const orgName = (invite?.organizations as any)?.name ?? 'an Organization';
  const expiresAt = invite ? new Date(invite.expires_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';

  async function handleAccept(): Promise<void> {
    'use server';
    await acceptInvite(token);
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-glow">
            <span className="text-white font-black text-lg">⬡</span>
          </div>
          <span className="text-xl font-black tracking-tight text-foreground">Black Box</span>
        </div>

        <div className="bg-surface-1 border border-border rounded-premium p-8 shadow-sm text-center">
          {status === 'valid' && (
            <>
              <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-foreground mb-2">You're Invited</h1>
              <p className="text-foreground-secondary text-sm mb-1">
                You've been invited to join
              </p>
              <p className="text-xl font-bold text-accent mb-1">{orgName}</p>
              <p className="text-foreground-secondary text-sm mb-6">
                as <span className="font-bold text-foreground capitalize">{invite?.role}</span>
              </p>

              <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-foreground-muted mb-8">
                <Clock className="w-3 h-3" />
                Expires {expiresAt}
              </div>

              {user ? (
                <form action={handleAccept}>
                  <button
                    type="submit"
                    className="w-full py-4 bg-accent text-white font-black text-sm uppercase tracking-widest rounded-premium shadow-glow hover:bg-accent-hover active:scale-95 transition-all"
                  >
                    Accept & Join {orgName}
                  </button>
                </form>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-foreground-muted mb-4">Sign in or create an account to accept this invitation.</p>
                  <Link
                    href={`/auth/login?redirect=/invite/${token}`}
                    className="block w-full py-3.5 bg-accent text-white font-black text-sm uppercase tracking-widest rounded-premium shadow-glow hover:bg-accent-hover transition-all text-center"
                  >
                    Sign In to Accept
                  </Link>
                  <Link
                    href={`/auth/signup?redirect=/invite/${token}`}
                    className="block w-full py-3.5 bg-surface-2 text-foreground-secondary font-bold text-sm rounded-premium hover:bg-surface-3 transition-all text-center border border-border"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </>
          )}

          {status === 'expired' && (
            <>
              <div className="w-16 h-16 bg-warning/10 border border-warning/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-warning" />
              </div>
              <h1 className="text-2xl font-black text-foreground mb-2">Invitation Expired</h1>
              <p className="text-foreground-muted text-sm">This invitation link expired on {expiresAt}.</p>
              <p className="text-foreground-muted text-sm mt-1">Please ask your team admin to send a new invitation.</p>
            </>
          )}

          {status === 'used' && (
            <>
              <div className="w-16 h-16 bg-success/10 border border-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h1 className="text-2xl font-black text-foreground mb-2">Already Accepted</h1>
              <p className="text-foreground-muted text-sm">This invitation has already been used.</p>
              <Link href="/" className="mt-6 block text-sm font-bold text-accent hover:underline">Go to Dashboard →</Link>
            </>
          )}

          {status === 'invalid' && (
            <>
              <div className="w-16 h-16 bg-danger/10 border border-danger/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-danger" />
              </div>
              <h1 className="text-2xl font-black text-foreground mb-2">Invalid Link</h1>
              <p className="text-foreground-muted text-sm">This invitation link is invalid or doesn't exist.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
