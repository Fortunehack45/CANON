'use server';

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

export async function inviteUser(formData: FormData) {
  const email = formData.get('email') as string;
  const role = formData.get('role') as string;

  if (!email || !role) {
    return { error: 'Email and role are required.' };
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  // Get current user's org_id and role
  const { data: currentUser } = await supabase
    .from('users')
    .select('org_id, role, id')
    .eq('id', user.id)
    .single();

  if (!currentUser?.org_id) return { error: 'No organization found.' };
  if (!['admin', 'lead'].includes(currentUser.role)) {
    return { error: 'You must be an admin or lead to invite members.' };
  }

  // Check if already a member
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .eq('org_id', currentUser.org_id)
    .single();

  if (existingUser) return { error: 'This user is already a member of your organization.' };

  // Check if there's already a pending invite
  const { data: existingInvite } = await supabase
    .from('invitations')
    .select('id, expires_at')
    .eq('email', email)
    .eq('org_id', currentUser.org_id)
    .is('accepted_at', null)
    .single();

  if (existingInvite && new Date(existingInvite.expires_at) > new Date()) {
    return { error: 'A pending invitation already exists for this email.' };
  }

  // Create the invitation
  const { data: invite, error } = await supabase
    .from('invitations')
    .insert({
      org_id: currentUser.org_id,
      email,
      role,
      invited_by: currentUser.id,
    })
    .select('token')
    .single();

  if (error) {
    console.error('Invite error:', error);
    return { error: 'Failed to create invitation.' };
  }

  // In a real app, send email here using Resend / SendGrid
  // For now, return the invite link so admin can share it
  const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002'}/invite/${invite.token}`;
  
  revalidatePath('/team');
  return { success: true, inviteUrl };
}

export async function revokeInvite(inviteId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  const { data: currentUser } = await supabase
    .from('users')
    .select('org_id, role')
    .eq('id', user.id)
    .single();

  if (!currentUser || currentUser.role !== 'admin') {
    return { error: 'Only admins can revoke invitations.' };
  }

  const { error } = await supabase
    .from('invitations')
    .delete()
    .eq('id', inviteId)
    .eq('org_id', currentUser.org_id);

  if (error) return { error: 'Failed to revoke invitation.' };

  revalidatePath('/team');
  return { success: true };
}
