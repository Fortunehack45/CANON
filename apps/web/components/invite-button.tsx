'use client';
import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { InviteModal } from './invite-modal';

export function InviteButton({ small }: { small?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`flex items-center gap-2 bg-accent text-white font-black uppercase tracking-widest rounded-premium shadow-glow hover:bg-accent-hover active:scale-95 transition-all ${
          small ? 'px-4 py-2 text-[10px]' : 'px-5 py-2.5 text-[10px]'
        }`}
      >
        <UserPlus className={small ? 'w-3 h-3' : 'w-4 h-4'} />
        Invite Member
      </button>
      {open && <InviteModal onClose={() => setOpen(false)} />}
    </>
  );
}
