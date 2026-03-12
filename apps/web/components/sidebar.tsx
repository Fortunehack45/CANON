'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Hexagon, 
  ListChecks, 
  Search, 
  Users, 
  Settings, 
  LogOut,
  Building2,
  UserCircle
} from 'lucide-react';
import { signOut } from '@/app/auth/actions';
import { OrgSwitcher } from './org-switcher';

const nav = [
  { href: '/', label: 'Overview', icon: BarChart3 },
  { href: '/decisions', label: 'Decisions', icon: Hexagon },
  { href: '/review', label: 'Review Queue', icon: ListChecks },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/profile', label: 'Profile', icon: Users },
  { href: '/team', label: 'Team', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  currentOrg?: { id: string; name: string; slug: string } | null;
  allOrgs?: { id: string; name: string; slug: string }[];
}

export function Sidebar({ currentOrg, allOrgs = [] }: SidebarProps) {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-background-secondary border-r border-border h-screen flex flex-shrink-0 flex-col py-6">
      <div className="px-6 mb-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-bold text-white shadow-glow">⬡</div>
        <span className="text-lg font-bold tracking-tight text-foreground">Black Box</span>
      </div>

      {/* Org Switcher */}
      <div className="px-3 mb-5">
        <OrgSwitcher currentOrg={currentOrg ?? null} allOrgs={allOrgs} />
      </div>
      
      <div className="px-6 mb-2 text-[10px] uppercase tracking-widest text-foreground-muted font-bold">Navigation</div>
      
      <nav className="flex-1 px-3 space-y-1">
        {nav.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-premium text-sm font-medium transition-all duration-500 group relative overflow-hidden ${
                isActive 
                  ? 'bg-accent/10 text-accent shadow-accent border border-accent/20 translate-x-1' 
                  : 'text-foreground-ghost hover:text-foreground hover:bg-surface-2 border border-transparent'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent animate-pulse" />
              )}
              <Icon 
                className={`w-4 h-4 transition-all duration-500 ${
                  isActive 
                    ? 'scale-110 text-accent' 
                    : 'group-hover:scale-110 opacity-70 group-hover:opacity-100'
                }`} 
              />
              <span className="relative z-10">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1 h-3 rounded-full bg-accent animate-in fade-in zoom-in duration-700 shadow-[0_0_12px_var(--accent)]" />
              )}
            </Link>
          );
        })}

        {/* Orgs quick link */}
        <div className="pt-3 border-t border-border/50 mt-3">
          <Link
            href="/orgs/new"
            className="flex items-center gap-3 px-3 py-2.5 rounded-premium text-sm font-medium transition-all duration-300 group text-foreground-secondary hover:text-foreground hover:bg-surface-2 border border-transparent"
          >
            <Building2 className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
            Create Org
          </Link>
        </div>
      </nav>

      <div className="mt-auto px-3 pt-6 border-t border-border">
        <form action={signOut}>
          <button 
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-premium text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-surface-2 transition-all group"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Sign Out
          </button>
        </form>
        
        <div className="px-3 py-4 mt-2">
          <div className="flex items-center gap-2 text-[10px] text-foreground-muted font-medium">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success"></span>
            </span>
            System Live
          </div>
        </div>
      </div>
    </aside>
  );
}
