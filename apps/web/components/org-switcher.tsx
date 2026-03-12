'use client';

import { useState } from 'react';
import { ChevronDown, Plus, Building2, Check } from 'lucide-react';
import Link from 'next/link';

interface Org {
  id: string;
  name: string;
  slug: string;
}

interface OrgSwitcherProps {
  currentOrg: Org | null;
  allOrgs: Org[];
}

export function OrgSwitcher({ currentOrg, allOrgs }: OrgSwitcherProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-1 border border-border/50 hover:border-accent/30 hover:bg-surface-2 transition-all group shadow-sm"
      >
        {/* Org Avatar */}
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center text-white font-black text-xs flex-shrink-0 shadow-accent group-hover:scale-105 transition-transform">
          {currentOrg ? currentOrg.name.charAt(0).toUpperCase() : '?'}
        </div>

        <div className="flex-1 text-left min-w-0">
          <div className="text-xs font-black text-foreground truncate leading-tight tracking-tight">
            {currentOrg?.name ?? 'No Organization'}
          </div>
          <div className="text-[8px] font-black text-foreground-ghost uppercase tracking-[0.2em] mt-0.5">
            {currentOrg ? 'Network' : 'Initialize'}
          </div>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-foreground-ghost group-hover:text-accent transition-all duration-300 ${open ? 'rotate-180 text-accent' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-1 bg-surface-1 border border-border rounded-subtle shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {allOrgs.length > 0 ? (
              <div className="py-1">
                <div className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-foreground-dim">Your Organizations</div>
                {allOrgs.map(org => (
                  <a
                    key={org.id}
                    href={`/orgs/${org.slug}`}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-surface-2 transition-colors group/item"
                    onClick={() => setOpen(false)}
                  >
                    <div className="w-6 h-6 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-black text-[10px]">
                      {org.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-foreground flex-1 truncate">{org.name}</span>
                    {currentOrg?.id === org.id && (
                      <Check className="w-3 h-3 text-accent flex-shrink-0" />
                    )}
                  </a>
                ))}
              </div>
            ) : (
              <div className="px-3 py-3 text-xs text-foreground-muted">No organizations yet</div>
            )}

            <div className="border-t border-border py-1">
              <Link
                href="/orgs/new"
                className="flex items-center gap-3 px-3 py-2 hover:bg-surface-2 transition-colors text-accent"
                onClick={() => setOpen(false)}
              >
                <div className="w-6 h-6 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <Plus className="w-3 h-3 text-accent" />
                </div>
                <span className="text-xs font-black">Create Organization</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
