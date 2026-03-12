interface StatCardProps {
  label: string;
  value: string | number;
  delta?: string;
  trend?: 'up' | 'down';
}

export function StatCard({ label, value, delta, trend }: StatCardProps) {
  return (
    <div className="bg-surface-1 border border-border rounded-premium p-6 hover:border-accent/40 transition-all duration-500 group relative overflow-hidden shadow-sm hover:shadow-glow">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="text-[10px] font-bold uppercase tracking-widest text-foreground-muted mb-2 group-hover:text-foreground-secondary transition-colors">{label}</div>
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-black tracking-tight text-foreground group-hover:text-accent transition-colors duration-300">{value}</div>
          {delta && (
            <div className={`text-[10px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-md ${
              trend === 'down' 
                ? 'bg-danger/10 text-danger border border-danger/20' 
                : 'bg-success/10 text-success border border-success/20'
            }`}>
              {trend === 'up' ? '↑' : '↓'} {delta}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
