// GitHub Integration Page
export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase-server';
import { Github, Check, Link2, Layers, AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';
import { GitHubConnectButton } from '@/components/github-connect-button';

export default async function GitHubSettingsPage() {
  const supabase = createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  // Get user record with GitHub info
  const { data: userRecord } = await supabase
    .from('users')
    .select('id, org_id, role, github_login, github_user_id')
    .eq('id', authUser?.id ?? '')
    .single();

  // Get org GitHub installation
  const { data: installation } = userRecord?.org_id
    ? await supabase
        .from('github_installations')
        .select('*')
        .eq('org_id', userRecord.org_id)
        .single()
    : { data: null };

  const isGitHubConnected = !!userRecord?.github_login;
  const isAppInstalled = !!installation;
  const canManage = userRecord?.role && ['admin', 'lead'].includes(userRecord.role);

  // GitHub App installation URL
  const githubAppInstallUrl = `https://github.com/apps/${process.env.NEXT_PUBLIC_GITHUB_APP_SLUG || 'black-box-ki'}/installations/new`;

  // GitHub OAuth URL
  const githubOAuthUrl = `https://github.com/login/oauth/authorize?client_id=${
    process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || 'YOUR_GITHUB_CLIENT_ID'
  }&scope=read:user,user:email&redirect_uri=${
    encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002'}/api/auth/github/callback`)
  }`;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-8 max-w-3xl space-y-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">GitHub Integration</h1>
        <p className="text-foreground-secondary">Connect your GitHub account and install the Black Box App to automatically capture engineering decisions from pull requests.</p>
      </div>

      {/* Step 1: Connect Personal GitHub */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${isGitHubConnected ? 'bg-success text-white' : 'bg-surface-3 border border-border text-foreground-dim'}`}>
            {isGitHubConnected ? <Check className="w-3 h-3" /> : '1'}
          </div>
          <h2 className="text-[10px] font-black text-foreground-dim uppercase tracking-[0.2em]">Connect Your GitHub Account</h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className={`p-6 rounded-premium border shadow-sm flex items-center justify-between gap-6 ${
          isGitHubConnected ? 'bg-success/5 border-success/20' : 'bg-surface-1 border-border'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
              isGitHubConnected ? 'bg-success/10 border-success/20 text-success' : 'bg-surface-2 border-border text-foreground'
            }`}>
              <Github className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-foreground">
                {isGitHubConnected ? `Connected as @${userRecord?.github_login}` : 'GitHub Account'}
              </div>
              <div className="text-xs text-foreground-dim">
                {isGitHubConnected
                  ? 'Your GitHub identity is linked to your Black Box account'
                  : 'Connect your personal GitHub account to identify your contributions'}
              </div>
            </div>
          </div>

          {isGitHubConnected ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/20 rounded-premium text-[10px] font-black uppercase tracking-widest text-success">
              <Check className="w-3 h-3" /> Connected
            </div>
          ) : (
            <GitHubConnectButton oauthUrl={githubOAuthUrl} />
          )}
        </div>
      </section>

      {/* Step 2: Install GitHub App on Organization */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${isAppInstalled ? 'bg-success text-white' : 'bg-surface-3 border border-border text-foreground-dim'}`}>
            {isAppInstalled ? <Check className="w-3 h-3" /> : '2'}
          </div>
          <h2 className="text-[10px] font-black text-foreground-dim uppercase tracking-[0.2em]">Install GitHub App on Your Organization</h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className={`p-6 rounded-premium border shadow-sm ${
          isAppInstalled ? 'bg-success/5 border-success/20' : 'bg-surface-1 border-border'
        }`}>
          {isAppInstalled ? (
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center text-success">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-foreground">App Installed on <span className="text-success">@{installation?.account_login}</span></div>
                  <div className="text-xs text-foreground-dim">
                    {installation?.all_repos ? 'Monitoring all repositories' : `Monitoring ${installation?.selected_repos?.length ?? 0} repositories`}
                  </div>
                </div>
              </div>
              {canManage && (
                <a
                  href={githubAppInstallUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-surface-2 border border-border text-foreground-secondary hover:text-foreground text-[10px] font-black uppercase tracking-widest rounded-subtle transition-all"
                >
                  Manage <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-foreground-dim">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-foreground">GitHub App Not Installed</div>
                  <div className="text-xs text-foreground-dim">Install the Black Box GitHub App to auto-capture PR decisions</div>
                </div>
              </div>
              {canManage ? (
                <a
                  href={githubAppInstallUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-[10px] font-black uppercase tracking-widest rounded-premium shadow-glow hover:bg-accent-hover transition-all"
                >
                  <Github className="w-3 h-3" /> Install App
                </a>
              ) : (
                <div className="flex items-center gap-2 text-[10px] font-bold text-foreground-muted">
                  <AlertTriangle className="w-3 h-3 text-warning" /> Ask your admin to install the app
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Step 3: Repository Selection */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${isAppInstalled ? 'bg-accent text-white' : 'bg-surface-3 border border-border text-foreground-dim opacity-40'}`}>
            3
          </div>
          <h2 className={`text-[10px] font-black uppercase tracking-[0.2em] ${isAppInstalled ? 'text-foreground-dim' : 'text-foreground-dim/40'}`}>
            Select Repositories to Monitor
          </h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className={`p-6 rounded-premium border shadow-sm transition-opacity ${!isAppInstalled ? 'opacity-40 pointer-events-none' : 'bg-surface-1 border-border'}`}>
          {isAppInstalled ? (
            <div className="space-y-4">
              <p className="text-sm text-foreground-secondary">
                Choose which repositories Black Box should monitor for engineering decisions.
              </p>

              <div className="grid grid-cols-1 gap-3">
                <label className={`flex items-center gap-4 p-4 rounded-subtle border cursor-pointer transition-all ${installation?.all_repos ? 'border-accent/40 bg-accent/5' : 'border-border bg-surface-2 hover:border-border-hover'}`}>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${installation?.all_repos ? 'border-accent bg-accent' : 'border-border-hover'}`}>
                    {installation?.all_repos && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <div className="font-bold text-foreground text-sm">All Repositories</div>
                    <div className="text-xs text-foreground-dim">Monitor every repo in your GitHub organization</div>
                  </div>
                </label>

                <label className={`flex items-center gap-4 p-4 rounded-subtle border cursor-pointer transition-all ${!installation?.all_repos ? 'border-accent/40 bg-accent/5' : 'border-border bg-surface-2 hover:border-border-hover'}`}>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${!installation?.all_repos ? 'border-accent bg-accent' : 'border-border-hover'}`}>
                    {!installation?.all_repos && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <div className="font-bold text-foreground text-sm">Selected Repositories</div>
                    <div className="text-xs text-foreground-dim">Choose specific repos ({installation?.selected_repos?.length ?? 0} selected)</div>
                  </div>
                </label>
              </div>

              {!installation?.all_repos && installation?.selected_repos && installation.selected_repos.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-[10px] font-black text-foreground-muted uppercase tracking-widest">Selected Repos</p>
                  <div className="flex flex-wrap gap-2">
                    {installation.selected_repos.map((repo: string) => (
                      <span key={repo} className="px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-subtle text-xs font-bold text-accent">
                        {repo}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-[10px] text-foreground-muted mt-2">
                To change repository access, click "Manage" in your GitHub App installation settings.
              </p>

              {canManage && (
                <a
                  href={githubAppInstallUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 bg-surface-2 border border-border text-foreground-secondary text-[10px] font-black uppercase tracking-widest rounded-premium hover:bg-surface-3 transition-all"
                >
                  <RefreshCw className="w-3 h-3" /> Manage Repo Access on GitHub
                </a>
              )}
            </div>
          ) : (
            <p className="text-sm text-foreground-muted">Install the GitHub App first to configure repository access.</p>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-surface-1 border border-border rounded-premium p-8 space-y-4 shadow-sm">
        <h3 className="text-[10px] font-black text-foreground-dim uppercase tracking-[0.2em]">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {[
            { step: '01', title: 'PR Merged', desc: 'A developer merges a pull request in a monitored repo' },
            { step: '02', title: 'AI Extracts', desc: 'Black Box reads the diff, comments, and context. AI extracts the decision made.' },
            { step: '03', title: 'Knowledge Logged', desc: 'A structured Decision Record appears in your dashboard for review.' },
          ].map(item => (
            <div key={item.step} className="space-y-2">
              <div className="text-2xl font-black text-accent/30">{item.step}</div>
              <div className="font-bold text-foreground text-sm">{item.title}</div>
              <div className="text-xs text-foreground-secondary leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
