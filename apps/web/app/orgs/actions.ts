'use server';

import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

export async function createOrg(formData: FormData) {
  const name = (formData.get('name') as string)?.trim();
  const description = (formData.get('description') as string)?.trim();

  if (!name) return { error: 'Organization name is required.' };

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  // Get current user record
  const { data: currentUser } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.id)
    .single();

  if (!currentUser) return { error: 'User profile not found.' };

  const slug = toSlug(name);

  // Check slug uniqueness
  const { data: existing } = await supabase
    .from('organizations')
    .select('id')
    .eq('slug', slug)
    .single();

  if (existing) return { error: `An organization with slug "${slug}" already exists. Try a different name.` };

  // Create the org
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .insert({ name, slug, description, owner_id: currentUser.id })
    .select('id, slug')
    .single();

  if (orgError || !org) {
    console.error('createOrg error:', orgError);
    return { error: 'Failed to create organization.' };
  }

  // Add creator as admin member
  await supabase.from('org_members').insert({
    org_id: org.id,
    user_id: currentUser.id,
    role: 'admin',
  });

  // Update user's primary org_id if they don't have one
  await supabase
    .from('users')
    .update({ org_id: org.id, role: 'admin' })
    .eq('id', currentUser.id)
    .is('org_id', null);

  revalidatePath('/orgs');
  redirect(`/orgs/${org.slug}`);
}

export async function createProject(formData: FormData) {
  const name = (formData.get('name') as string)?.trim();
  const description = (formData.get('description') as string)?.trim();
  const orgId = formData.get('org_id') as string;

  if (!name || !orgId) return { error: 'Project name is required.' };

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  // Verify user is a member of this org
  const { data: membership } = await supabase
    .from('org_members')
    .select('role')
    .eq('org_id', orgId)
    .eq('user_id', user.id)
    .single();

  if (!membership || !['admin', 'lead'].includes(membership.role)) {
    return { error: 'You must be an admin or lead to create projects.' };
  }

  const slug = toSlug(name);

  const { data: org } = await supabase
    .from('organizations')
    .select('slug')
    .eq('id', orgId)
    .single();

  const { data: project, error } = await supabase
    .from('projects')
    .insert({ org_id: orgId, name, description, slug, created_by: user.id })
    .select('id, slug')
    .single();

  if (error) {
    if (error.code === '23505') return { error: `A project named "${name}" already exists in this org.` };
    console.error('createProject error:', error);
    return { error: 'Failed to create project.' };
  }

  revalidatePath(`/orgs/${org?.slug}`);
  redirect(`/orgs/${org?.slug}/projects/${project.slug}`);
}
