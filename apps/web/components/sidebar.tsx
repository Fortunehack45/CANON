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
  LogOut 
} from 'lucide-react';
import { signOut } from '@/app/auth/actions';

const nav = [
  { href: '/', label: 'Overview', icon: BarChart3 },
  { href: '/decisions', label: 'Decisions', icon: Hexagon },
  { href: '/review', label: 'Review Queue', icon: ListChecks },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/team', label: 'Team', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-background-secondary border-r border-border h-screen flex flex-shrink-0 flex-col py-6">
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-bold text-white shadow-glow">⬡</div>
        <span className="text-lg font-bold tracking-tight text-foreground">Black Box</span>
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-premium text-sm font-medium transition-all duration-300 group ${
                isActive 
                  ? 'bg-accent/10 text-accent shadow-glow border border-accent/20' 
                  : 'text-foreground-secondary hover:text-foreground hover:bg-surface-2 border border-transparent'
              }`}
            >
              <Icon 
                className={`w-4 h-4 transition-all duration-300 ${
                  isActive 
                    ? 'scale-110' 
                    : 'group-hover:scale-110 opacity-70 group-hover:opacity-100'
                }`} 
              />
              {item.label}
              {isActive && (
                <div className="ml-auto w-1 h-3 rounded-full bg-accent animate-in fade-in zoom-in duration-500 shadow-[0_0_8px_var(--accent)]" />
              )}
            </Link>
          );
        })}
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
