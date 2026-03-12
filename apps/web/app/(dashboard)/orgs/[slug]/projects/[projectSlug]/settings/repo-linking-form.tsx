'use client';

import { useState, useEffect } from 'react';
import { Github, Search, Check, Link2, ExternalLink, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { getInstallationRepos, linkProjectToRepo } from './github-actions';
import { useRouter } from 'next/navigation';

interface Repo {
  id: number;
  name: string;
  full_name: string;
  owner: string;
  description: string;
  private: boolean;
}

interface Props {
  projectId: string;
  currentRepoId?: number | null;
  currentRepoName?: string | null;
}

export function RepoLinkingForm({ projectId, currentRepoId, currentRepoName }: Props) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSelector, setShowSelector] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadRepos();
  }, []);

  async function loadRepos() {
    setLoading(true);
    setError(null);
    try {
      const result = await getInstallationRepos();
      if (result.error === 'github_not_connected') {
        setError('GitHub account not connected. Please go to Global Settings to connect.');
      } else if (result.error) {
        setError('Failed to fetch repositories from GitHub.');
      } else {
        setRepos(result.repos);
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSelect(repo: Repo) {
    setSaving(true);
    try {
      await linkProjectToRepo(projectId, {
        id: repo.id,
        owner: repo.owner,
        name: repo.name
      });
      setShowSelector(false);
      router.refresh();
    } catch (err) {
      setError('Failed to link project to repository.');
    } finally {
      setSaving(false);
    }
  }

  const filteredRepos = repos.filter(r => 
    r.full_name.toLowerCase().includes(search.toLowerCase())
  );

  const currentRepo = repos.find(r => r.id === currentRepoId);

  return (
    <div className="space-y-6">
      <div className="bg-surface-1 border border-border rounded-premium overflow-hidden">
        <div className="p-6 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${currentRepoId ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-surface-2 border-border text-foreground-ghost'}`}>
              <Github className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-foreground">
                {currentRepoName || 'No Repository Linked'}
              </div>
              <div className="text-xs text-foreground-dim">
                {currentRepoId 
                  ? 'Continuous synchronization active' 
                  : 'Link a repository to enable intelligence capture'}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowSelector(!showSelector)}
            className={`px-5 py-2.5 rounded-premium text-[10px] font-black uppercase tracking-widest transition-all ${
              currentRepoId 
                ? 'bg-surface-2 border border-border text-foreground-secondary hover:text-foreground' 
                : 'bg-accent text-white shadow-glow hover:bg-accent-hover'
            }`}
          >
            {currentRepoId ? 'Change Repo' : 'Link Repository'}
          </button>
        </div>

        {showSelector && (
          <div className="border-t border-border animate-in slide-in-from-top-4 duration-500">
            <div className="p-4 bg-surface-2/50 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-ghost" />
                <input
                  type="text"
                  placeholder="Search your repositories..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-surface-1 border border-border rounded-premium pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-accent/40 focus:shadow-glow transition-all"
                />
              </div>
            </div>

            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="p-12 text-center text-foreground-dim flex flex-col items-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-accent" />
                  <p className="text-xs font-medium italic">Scanning GitHub for connections...</p>
                </div>
              ) : error ? (
                <div className="p-12 text-center space-y-4">
                  <div className="w-12 h-12 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <p className="text-sm text-foreground-secondary italic">{error}</p>
                </div>
              ) : filteredRepos.length === 0 ? (
                <div className="p-12 text-center text-foreground-dim italic text-sm">
                  No repositories found matching your search.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredRepos.map(repo => (
                    <button
                      key={repo.id}
                      onClick={() => handleSelect(repo)}
                      disabled={saving}
                      className="w-full text-left p-4 hover:bg-accent/5 flex items-center justify-between group transition-colors disabled:opacity-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-surface-3 flex items-center justify-center text-foreground-ghost group-hover:text-accent transition-colors">
                          <Link2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-foreground group-hover:text-accent transition-colors">
                            {repo.full_name}
                          </div>
                          {repo.description && (
                            <div className="text-[10px] text-foreground-dim line-clamp-1">{repo.description}</div>
                          )}
                        </div>
                      </div>
                      {currentRepoId === repo.id ? (
                        <Check className="w-4 h-4 text-success" />
                      ) : (
                        <div className="text-[10px] font-black uppercase tracking-widest text-accent opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all">
                          Select
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-border bg-surface-2/30 flex justify-between items-center">
               <button 
                onClick={loadRepos}
                className="text-[10px] font-black uppercase tracking-widest text-foreground-dim hover:text-foreground flex items-center gap-2 transition-colors"
                disabled={loading}
               >
                 <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Sync List
               </button>
               <a 
                 href="/settings/github" 
                 className="text-[10px] font-black uppercase tracking-widest text-accent hover:text-accent-hover flex items-center gap-2"
                >
                  Manage Permissions <ExternalLink className="w-3 h-3" />
                </a>
            </div>
          </div>
        )}
      </div>

      {currentRepoId && (
        <div className="bg-surface-1 border border-border rounded-premium p-6 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center gap-3">
            <h3 className="text-[10px] font-black text-foreground-dim uppercase tracking-[0.2em]">Sync Strategy</h3>
            <div className="h-px flex-1 bg-border" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-surface-2 border border-border rounded-premium group hover:border-accent/30 transition-all">
              <div className="font-bold text-sm text-foreground mb-1">PR Intelligence</div>
              <p className="text-[11px] text-foreground-secondary leading-relaxed">
                Automatically extract high-level architectural decisions from merged pull requests using the Black Box extractor engine.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-success">Active</span>
              </div>
            </div>
            
            <div className="p-4 bg-surface-2 border border-border rounded-premium group hover:border-accent/30 transition-all">
              <div className="font-bold text-sm text-foreground mb-1">Issue Harvesting</div>
              <p className="text-[11px] text-foreground-secondary leading-relaxed">
                Monitor issue resolutions and RFC tags to capture strategic pivots and logic changes.
              </p>
              <div className="mt-4 flex items-center gap-2 text-foreground-dim">
                <div className="w-1.5 h-1.5 rounded-full bg-border" />
                <span className="text-[9px] font-black uppercase tracking-widest">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
