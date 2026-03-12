'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { useCallback, useTransition } from 'react';

export function FilterBar({
  currentStatus,
  currentImpact,
  currentQuery
}: {
  currentStatus?: string;
  currentImpact?: string;
  currentQuery?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === 'all' || !value) {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilter = (name: string, value: string) => {
    startTransition(() => {
      router.push(`/decisions?${createQueryString(name, value)}`);
    });
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-2 p-1">
      <div className="relative flex-1 group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-foreground-muted group-focus-within:text-accent transition-colors" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-4 py-2 bg-surface-1 border border-transparent rounded-subtle text-sm text-foreground placeholder-foreground-dim focus:outline-none focus:bg-surface-2 focus:border-accent/30 transition-all"
          placeholder="Search engineering intelligence..."
          defaultValue={currentQuery || ''}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleFilter('query', e.currentTarget.value);
          }}
          onBlur={(e) => handleFilter('query', e.currentTarget.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <select 
          className="bg-surface-1 border border-transparent hover:bg-surface-2 text-foreground-secondary text-sm rounded-subtle px-3 py-2 cursor-pointer focus:outline-none focus:border-accent/30 transition-all outline-none"
          value={currentStatus || 'all'}
          onChange={(e) => handleFilter('status', e.target.value)}
          disabled={isPending}
        >
          <option value="all">Any Status</option>
          <option value="pending_review">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Rejected</option>
        </select>

        <select 
          className="bg-surface-1 border border-transparent hover:bg-surface-2 text-foreground-secondary text-sm rounded-subtle px-3 py-2 cursor-pointer focus:outline-none focus:border-accent/30 transition-all outline-none"
          value={currentImpact || 'all'}
          onChange={(e) => handleFilter('impact', e.target.value)}
          disabled={isPending}
        >
          <option value="all">All Impact</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
    </div>
  );
}
