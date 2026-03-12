'use server';

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

export async function getInstallationRepos() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data: userRecord } = await supabase
    .from('users')
    .select('org_id, github_access_token')
    .eq('id', user.id)
    .single();

  if (!userRecord?.org_id) throw new Error('No organization association');

  // Fetch repos from GitHub using the user token
  // For simplicity here, we'll try to fetch with user token first if available
  const token = userRecord.github_access_token;
  if (!token) return { repos: [], error: 'github_not_connected' };

  try {
    const res = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
      },
      next: { revalidate: 60 } // Cache for 1 minute
    });

    if (!res.ok) {
      const err = await res.json();
      console.error('GitHub API error:', err);
      return { repos: [], error: 'github_api_error' };
    }

    const repos = await res.json();
    return { 
      repos: Array.isArray(repos) ? repos.map((r: any) => ({
        id: r.id,
        name: r.name,
        full_name: r.full_name,
        owner: r.owner.login,
        description: r.description,
        private: r.private
      })) : []
    };
  } catch (err) {
    console.error('Fetch error:', err);
    return { repos: [], error: 'fetch_error' };
  }
}

export async function linkProjectToRepo(
  projectId: string, 
  repo: { id: number; owner: string; name: string }
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('projects')
    .update({
      github_repo_id: repo.id,
      github_repo_owner: repo.owner,
      github_repo_name: repo.name,
      updated_at: new Date().toISOString()
    })
    .eq('id', projectId);

  if (error) throw error;

  revalidatePath(`/orgs/[slug]/projects/[slug]/settings`, 'layout');
  return { success: true };
}
