'use client';
import { Github } from 'lucide-react';

export function GitHubConnectButton({ oauthUrl }: { oauthUrl: string }) {
  return (
    <a
      href={oauthUrl}
      className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-[10px] font-black uppercase tracking-widest rounded-premium hover:bg-foreground/80 active:scale-95 transition-all shadow-sm"
    >
      <Github className="w-3.5 h-3.5" /> Connect GitHub
    </a>
  );
}
