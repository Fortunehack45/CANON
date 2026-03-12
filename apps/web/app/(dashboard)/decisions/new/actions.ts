'use server';

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createDecision(formData: FormData) {
  const supabase = createClient();
  
  // Get current user to link to org
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('You must be logged in to record a decision.');
  }

  // NOTE: In the real app, we'd query for the user's specific orgId. 
  // For this demo, since we just created the table, we'll use a placeholder
  // if no org exists, or we would auto-create it. We assume the user has an org.
  // For simplicity, we just fetch any org or make a dummy one for the demo:
  let { data: org } = await supabase.from('organizations').select('id').limit(1).single();
  
  if (!org) {
    // Scaffold an org for the demo if the DB was just wiped
    const newOrgId = crypto.randomUUID();
    await supabase.from('organizations').insert({
      id: newOrgId,
      name: 'Default Organization',
    });
    org = { id: newOrgId };
  }

  const title = formData.get('title') as string;
  const summary_one_liner = formData.get('summary_one_liner') as string;
  const decision_type = formData.get('decision_type') as string;
  const impact = formData.get('impact') as string;
  const what = formData.get('what') as string;
  const why = formData.get('why') as string;
  const tradeoffs = formData.get('tradeoffs') as string;

  const id = crypto.randomUUID();

  const { error } = await supabase.from('decision_records').insert({
    id,
    org_id: org.id,
    title,
    summary_one_liner,
    decision_type,
    impact,
    what,
    why,
    tradeoffs,
    status: 'pending_review',
    author_github_login: user.user_metadata?.full_name || user.email,
  });

  if (error) {
    console.error('Insert error:', error);
    throw new Error('Failed to record decision.');
  }

  // Revalidate the decisions list page so the new item shows up
  revalidatePath('/decisions');
  revalidatePath('/');
  
  // Redirect back to the list
  redirect('/decisions');
}
