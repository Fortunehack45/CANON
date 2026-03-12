'use server';

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

export async function updateProjectRole(projectId: string, role: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('project_members')
    .upsert({
      project_id: projectId,
      user_id: user.id,
      role: role.length > 50 ? 'custom' : role,
      custom_role_name: role,
      joined_at: new Date().toISOString()
    }, {
      onConflict: 'project_id, user_id'
    });

  if (error) {
    console.error('updateProjectRole error:', error);
    throw new Error('Failed to update project role');
  }

  revalidatePath(`/orgs/[slug]/projects/[projectSlug]`, 'layout');
}
