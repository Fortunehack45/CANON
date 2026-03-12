import { createBrowserClient } from '@supabase/ssr';

// Browser-side client creator (safe for Client Components)
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Type helpers based on the Black Box schema
export type DecisionRecord = {
  id: string;
  org_id: string;
  title: string;
  summary_one_liner: string | null;
  what: string | null;
  why: string | null;
  alternatives_considered: string[];
  tradeoffs: string | null;
  outcome: string | null;
  decision_type: string;
  impact: string;
  tags: string[];
  confidence: number;
  ai_model: string | null;
  data_sources: string[];
  status: string;
  author_github_login: string | null;
  confirmed_by_user_id: string | null;
  confirmed_at: string | null;
  linked_pr_number: number | null;
  linked_repo: string | null;
  linked_commit_sha: string | null;
  linked_ticket_id: string | null;
  linked_slack_thread_ts: string | null;
  files_affected: string[];
  supersedes_id: string | null;
  superseded_by_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Organization = {
  id: string;
  name: string;
  github_org_login: string | null;
  slack_team_id: string | null;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  org_id: string;
  email: string;
  name: string | null;
  github_login: string | null;
  avatar_url: string | null;
  role: string;
  last_seen_at: string | null;
  created_at: string;
};
