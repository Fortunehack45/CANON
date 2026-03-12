interface HealthGaugeProps {
  score: number;
  label: string;
}

export function HealthGauge({ score, label }: HealthGaugeProps) {
  let colorClass = 'text-success';
  let bgClass = 'bg-success/10';
  let borderClass = 'border-success/20';
  
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-surface-1 border border-border rounded-premium p-8 flex items-center justify-between relative overflow-hidden group shadow-sm hover:border-accent/30 hover:shadow-accent transition-all duration-700">
      {/* Dynamic Ambient Background */}
      <div className={`absolute -inset-20 opacity-0 group-hover:opacity-10 blur-[80px] transition-opacity duration-1000 ${bgClass}`} />
      
      <div className="relative z-10 space-y-1">
        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground-ghost group-hover:text-foreground-dim transition-colors">
          {label}
        </div>
        <div className={`text-4xl font-black tracking-tighter transition-all duration-500 group-hover:scale-105 ${colorClass}`}>
          {score}<span className="text-[10px] uppercase font-bold tracking-widest ml-1 opacity-50">Pts</span>
        </div>
      </div>

      <div className="relative z-10 w-20 h-20 transform transition-all duration-700 group-hover:rotate-12 group-hover:scale-110">
        <svg className="w-full h-full -rotate-90 filter drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]">
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-surface-3 opacity-30"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className={`${colorClass} transition-all duration-1000 ease-out`}
            style={{ filter: 'drop-shadow(0 0 12px currentColor)' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${colorClass} bg-current opacity-20`} />
        </div>
      </div>
    </div>
  );
}
