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
    <div className="flex flex-col md:flex-row gap-4 mt-6 p-4 bg-neutral-900/40 border border-neutral-800/60 rounded-xl">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-neutral-500" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-neutral-800 rounded-lg leading-5 bg-neutral-950 text-neutral-300 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
          placeholder="Search decisions..."
          defaultValue={currentQuery || ''}
          onChange={(e) => {
             // Basic debounce could go here, for now trigger on blur or enter
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleFilter('query', e.currentTarget.value);
          }}
          onBlur={(e) => handleFilter('query', e.currentTarget.value)}
        />
      </div>

      <div className="flex gap-2">
        <select 
          className="bg-neutral-950 border border-neutral-800 text-neutral-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
          value={currentStatus || 'all'}
          onChange={(e) => handleFilter('status', e.target.value)}
          disabled={isPending}
        >
          <option value="all">All Status</option>
          <option value="pending_review">Pending Review</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Rejected</option>
        </select>

        <select 
          className="bg-neutral-950 border border-neutral-800 text-neutral-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
          value={currentImpact || 'all'}
          onChange={(e) => handleFilter('impact', e.target.value)}
          disabled={isPending}
        >
          <option value="all">All Impact</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
    </div>
  );
}
