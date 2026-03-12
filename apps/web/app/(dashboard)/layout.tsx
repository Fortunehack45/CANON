import { Sidebar } from '@/components/sidebar';
import { createClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch current user's org
  let currentOrg = null;
  let allOrgs: { id: string; name: string; slug: string }[] = [];

  if (user) {
    const { data: userRecord } = await supabase
      .from('users')
      .select('org_id')
      .eq('id', user.id)
      .single();

    if (userRecord?.org_id) {
      const { data: org } = await supabase
        .from('organizations')
        .select('id, name, slug')
        .eq('id', userRecord.org_id)
        .single();
      currentOrg = org ?? null;
      if (org) allOrgs = [org];
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar currentOrg={currentOrg} allOrgs={allOrgs} />
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-background">
        {children}
      </main>
    </div>
  );
}
