'use server';

import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

export async function acceptInvite(token: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?redirect=/invite/${token}`);
  }

  // Look up the invitation
  const { data: invite, error: inviteError } = await supabase
    .from('invitations')
    .select('id, org_id, email, role, expires_at, accepted_at')
    .eq('token', token)
    .single();

  if (inviteError || !invite) {
    return { error: 'Invalid or expired invitation link.' };
  }

  if (invite.accepted_at) {
    return { error: 'This invitation has already been used.' };
  }

  if (new Date(invite.expires_at) < new Date()) {
    return { error: 'This invitation has expired. Please ask for a new one.' };
  }

  // Mark invitation as accepted
  await supabase
    .from('invitations')
    .update({ accepted_at: new Date().toISOString() })
    .eq('id', invite.id);

  // Check if user already has a profile in users table
  const { data: existingUser } = await supabase
    .from('users')
    .select('id, org_id')
    .eq('id', user.id)
    .single();

  if (existingUser) {
    // Update their org_id if they don't have one
    if (!existingUser.org_id) {
      await supabase
        .from('users')
        .update({ org_id: invite.org_id, role: invite.role })
        .eq('id', user.id);
    }
  } else {
    // Create user record
    await supabase
      .from('users')
      .insert({
        id: user.id,
        org_id: invite.org_id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email,
        role: invite.role,
      });
  }

  // Also add to org_members table
  await supabase
    .from('org_members')
    .upsert({
      org_id: invite.org_id,
      user_id: user.id,
      role: invite.role,
    }, { onConflict: 'org_id,user_id' });

  redirect('/');
}
