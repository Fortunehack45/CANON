'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { signOut } from '@/app/auth/actions';

const nav = [
  { href: '/', label: 'Overview', icon: '◈' },
  { href: '/decisions', label: 'Decisions', icon: '⬡' },
  { href: '/review', label: 'Review Queue', icon: '◎' },
  { href: '/search', label: 'Search', icon: '⊙' },
  { href: '/team', label: 'Team', icon: '◉' },
  { href: '/settings', label: 'Settings', icon: '⊛' },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">⬡</div>
        <span className="sidebar-logo-text">Black Box</span>
      </div>
      <div className="sidebar-label">Navigation</div>
      <nav className="sidebar-nav">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-link ${pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)) ? 'active' : ''}`}
          >
            <span style={{ fontSize: '1rem', lineHeight: 1 }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div style={{ marginTop: 'auto' }}>
        <form action={signOut}>
          <button 
            type="submit"
            className="w-full flex items-center gap-3 px-6 py-3 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </form>
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span className="pulse" style={{ display: 'inline-block', width: 6, height: 6, background: 'var(--success)', borderRadius: '50%', marginRight: 6 }} />
            API connected
          </div>
        </div>
      </div>
    </aside>
  );
}
