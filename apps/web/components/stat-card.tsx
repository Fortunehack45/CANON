interface StatCardProps {
  label: string;
  value: string | number;
  delta?: string;
  trend?: 'up' | 'down';
}

export function StatCard({ label, value, delta, trend }: StatCardProps) {
  return (
    <div className="bg-surface-1 border border-border rounded-premium p-6 hover:border-border-hover transition-all duration-300 group relative overflow-hidden">
      <div className="absolute inset-0 bg-glass-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10">
        <div className="text-[10px] font-bold uppercase tracking-widest text-foreground-muted mb-2">{label}</div>
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-bold tracking-tight text-foreground">{value}</div>
          {delta && (
            <div className={`text-xs font-semibold ${trend === 'down' ? 'text-danger' : 'text-success'}`}>
              {trend === 'up' ? '↑' : '↓'} {delta}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
