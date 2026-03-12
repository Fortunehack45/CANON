interface StatCardProps {
  label: string;
  value: string | number;
  delta?: string;
  trend?: 'up' | 'down';
}

export function StatCard({ label, value, delta, trend }: StatCardProps) {
  return (
    <div className="bg-surface-1 border border-border rounded-premium p-8 hover:border-accent/30 transition-all duration-700 group relative overflow-hidden shadow-sm hover:shadow-accent">
      <div className="absolute -inset-10 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-1000" />
      
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground-ghost mb-6 group-hover:text-foreground-dim transition-colors">
          {label}
        </div>
        
        <div className="flex items-baseline justify-between gap-4">
          <div className="text-4xl font-black tracking-tighter text-foreground group-hover:text-accent group-hover:scale-105 transition-all duration-500">
            {value}
          </div>
          
          {delta && (
            <div className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg transition-all duration-500 ${
              trend === 'down' 
                ? 'bg-danger/5 text-danger border border-danger/10 group-hover:border-danger/30' 
                : 'bg-success/5 text-success border border-success/10 group-hover:border-success/30'
            }`}>
              {trend === 'up' ? '↑' : '↓'} {delta}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
